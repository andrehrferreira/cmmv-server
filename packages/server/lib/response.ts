/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 *
 * @see https://github.com/expressjs/express/blob/master/lib/response.js
 *
 * koa
 * Copyright (c) 2019 Koa contributors
 * MIT Licensed
 *
 * @see https://github.com/koajs/koa/blob/master/lib/response.js
 *
 * fastify
 * Copyright (c) 2016-2024 The Fastify Team
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify/blob/main/lib/reply.js
 */

import { isAbsolute as pathIsAbsolute, resolve, extname } from 'node:path';
import { finished as eos, Readable, Stream } from 'node:stream';

import {
    mime,
    statuses,
    sendfile,
    contentDisposition,
    destroy,
    encodeUrl,
    escapeHtml,
    utilsMerge,
    cookieSignatureSign,
    cookieSerialize,
    normalizeType,
    normalizeTypes,
} from '../utils';

import {
    CM_ERR_RES_ALREADY_SENT,
    CM_ERR_BAD_TRAILER_NAME,
    CM_ERR_BAD_TRAILER_VALUE,
    CM_ERR_SEND_INSIDE_ONERR,
    CM_ERR_SEND_CONTENTTYPE_ARR,
    CM_ERR_INVALID_CODE_TYPE,
    CM_ERR_INVALID_CODE_RANGE,
    CM_ERR_RES_BODY_CONSUMED,
    CM_ERR_RES_INVALID_PAYLOAD_TYPE,
} from './errors';

import {
    kResponseIsError,
    kResponseTrailers,
    kResponseIsRunningOnErrorHook,
    kResponseSerializer,
    kResponseErrorHandlerCalled,
    kResponseHeaders,
    kResponseHasStatusCode,
    kResponseStartTime,
    kDisableRequestLogging,
    kResponseEndTime,
    kResponseHijacked,
    kResponseSerializerDefault,
    kSchemaResponse,
    kResponseCacheSerializeFns,
    kResponseNextErrorHandler,
} from './symbols';

import {
    onSendHookRunner,
    onResponseHookRunner,
    preSerializationHookRunner,
} from './hooks';

import { handleError } from './error-handler';

const send = require('@fastify/send');
const onFinish = require('on-finished');
const vary = require('vary');
const createError = require('http-errors');

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer#directives
// https://datatracker.ietf.org/doc/html/rfc7230.html#chunked.trailer.part
const INVALID_TRAILERS = new Set([
    'transfer-encoding',
    'content-length',
    'host',
    'cache-control',
    'max-forwards',
    'te',
    'authorization',
    'set-cookie',
    'content-encoding',
    'content-type',
    'content-range',
    'trailer',
]);

export const setupResponseListeners = res => {
    res[kResponseStartTime] = res.now();

    const onResFinished = err => {
        res[kResponseEndTime] = res.now();
        res.removeListener('finish', onResFinished);
        res.removeListener('error', onResFinished);

        if (res && res.onResponse !== null) {
            onResponseHookRunner(
                res.onResponse,
                res.request,
                res,
                onResponseCallback,
            );
        } else {
            onResponseCallback(err, res.request, res);
        }
    };

    res.on('finish', onResFinished);
    res.on('error', onResFinished);
};

export const wrapThenable = (thenable, res, store?) => {
    if (store) store.async = true;

    thenable.then(
        function (payload) {
            if (res[kResponseHijacked] === true) return;

            try {
                if (
                    payload !== undefined ||
                    (res.sent === false &&
                        res.headersSent === false &&
                        res.request.aborted === false)
                ) {
                    try {
                        res.send(payload);
                    } catch (err) {
                        res[kResponseIsError] = true;
                        res.send(err);
                    }
                }
            } finally {
            }
        },
        function (err) {
            try {
                if (res.sent === true) {
                    console.error(
                        { err },
                        'Promise errored, but reply.sent = true was set',
                    );
                    return;
                }

                res[kResponseIsError] = true;
                res.send(err);
            } catch (err) {
                res.send(err);
            }
        },
    );
};

function safeWriteHead(response, statusCode) {
    try {
        response.res.writeHead(statusCode, response[kResponseHeaders]);
    } catch (err) {
        if (err.code === 'ERR_HTTP_HEADERS_SENT')
            console.warn(
                `Reply was already sent, did you forget to "return reply" in the "${response.request.url}" (${response.request.method}) route?`,
            );

        throw err;
    }
}

function preSerializationHook(res, payload) {
    if (res.preSerialization !== null) {
        preSerializationHookRunner(
            res.preSerialization,
            res.request,
            res,
            payload,
            preSerializationHookEnd,
        );
    } else {
        preSerializationHookEnd(null, res.request, res, payload);
    }
}

function preSerializationHookEnd(err, req, res, payload) {
    if (err != null) {
        onErrorHook(res, err);
        return;
    }

    try {
        if (res[kResponseSerializer] !== null) {
            payload = res[kResponseSerializer](payload);
        } else if (res[kResponseSerializerDefault]) {
            payload = res[kResponseSerializerDefault](payload, res.statusCode);
        } else {
            payload = res.serialize(
                res,
                payload,
                res.statusCode,
                res[kResponseHeaders]['content-type'],
            );
        }
    } catch (e) {
        wrapSerializationError(e, res);
        onErrorHook(res, e);
        return;
    }

    onSendHook(res, payload);
}

function wrapSerializationError(error, res) {
    error.serialization = res.request.config;
}

function onErrorHook(res, error, cb?) {
    if (
        res.onError !== null &&
        res.onError !== undefined &&
        !res[kResponseNextErrorHandler]
    ) {
        res[kResponseIsRunningOnErrorHook] = true;
        onSendHookRunner(res.onError, res.request, res, error, () =>
            handleError(res, error, cb),
        );
    } else {
        handleError(res, error, cb);
    }
}

function onSendHook(res, payload) {
    if (res.onSend !== null && res.onSend !== undefined) {
        onSendHookRunner(res.onSend, res.request, res, payload, wrapOnSendEnd);
    } else {
        onSendEnd(res, payload);
    }
}

function onSendEnd(response, payload) {
    if (
        response[kResponseTrailers] !== null &&
        response[kResponseTrailers] !== undefined
    ) {
        const trailerHeaders = Object.keys(response[kResponseTrailers]);
        let header = '';

        for (const trailerName of trailerHeaders) {
            if (typeof response[kResponseTrailers][trailerName] !== 'function')
                continue;
            header += ' ';
            header += trailerName;
        }

        response.res.setHeader('Transfer-Encoding', 'chunked');
        response.res.setHeader('Trailer', header.trim());
    }

    if (toString.call(payload) === '[object Response]') {
        if (typeof payload.status === 'number') response.code(payload.status);

        if (
            typeof payload.headers === 'object' &&
            typeof payload.headers.forEach === 'function'
        ) {
            for (const [headerName, headerValue] of payload.headers)
                response.res.setHeader(headerName, headerValue);
        }

        if (payload.body !== null) {
            if (payload.bodyUsed) throw new CM_ERR_RES_BODY_CONSUMED();
        }

        payload = payload.body;
    }

    const statusCode = response.res.statusCode;

    if (payload === undefined || payload === null) {
        if (
            statusCode >= 200 &&
            statusCode !== 204 &&
            statusCode !== 304 &&
            response.request.method !== 'HEAD' &&
            response[kResponseTrailers] === null
        ) {
            response[kResponseTrailers]['content-length'] = '0';
        }

        safeWriteHead(response, statusCode);
        sendTrailer(payload, response);
        return;
    }

    if ((statusCode >= 100 && statusCode < 200) || statusCode === 204) {
        // Responses without a content body must not send content-type
        // or content-length headers.
        // See https://www.rfc-editor.org/rfc/rfc9110.html#section-8.6.
        response.res.removeHeader('content-type');
        response.res.removeHeader('content-length');
        safeWriteHead(response, statusCode);
        sendTrailer(undefined, response);
        if (typeof payload.resume === 'function') {
            payload.on('error', noop);
            payload.resume();
        }
        return;
    }

    if (typeof payload.pipe === 'function') {
        sendStream(payload, response);
        return;
    }

    if (typeof payload.getReader === 'function') {
        sendWebStream(payload, response);
        return;
    }

    if (typeof payload !== 'string' && !Buffer.isBuffer(payload))
        throw new CM_ERR_RES_INVALID_PAYLOAD_TYPE(typeof payload);

    if (response[kResponseTrailers] === null) {
        const contentLength = response[kResponseHeaders]['content-length'];
        if (
            !contentLength ||
            (response.request.method !== 'HEAD' &&
                Number(contentLength) !== Buffer.byteLength(payload))
        ) {
            response[kResponseHeaders]['content-length'] =
                '' + Buffer.byteLength(payload);
        }
    }

    //Etag
    const len = Number(response[kResponseHeaders]['content-length']);
    const etagFn = response.app.get('etag fn');
    const generateETag = !response.get('ETag') && typeof etagFn === 'function';

    let etag;
    if (generateETag && len !== undefined) {
        if ((etag = etagFn(payload, 'utf8'))) response.set('ETag', etag);
    }

    safeWriteHead(response, statusCode);

    if (response.req.method !== 'HEAD') response.res.write(payload);

    sendTrailer(payload, response);
}

function onResponseCallback(err, req, res) {
    if (res[kDisableRequestLogging]) return;

    const responseTime = res.elapsedTime;

    if (err != null) {
        console.error({ res, err, responseTime }, 'request errored');
        return;
    }

    console.info({ res, responseTime }, 'request completed');
}

function wrapOnSendEnd(err, req, res, payload) {
    if (err != null) onErrorHook(res, err);
    else onSendEnd(res, payload);
}

function sendTrailer(payload, response) {
    if (response[kResponseTrailers] === null) {
        response.res.end(null, null, null);
        return;
    }

    const trailerHeaders = Object.keys(response[kResponseTrailers]);
    const trailers = {};
    let handled = 0;
    let skipped = true;

    function send() {
        if (handled === 0) {
            response.addTrailers(trailers);
            response.res.end(null, null, null);
        }
    }

    for (const trailerName of trailerHeaders) {
        if (typeof response[kResponseTrailers][trailerName] !== 'function')
            continue;
        skipped = false;
        handled--;

        function cb(err, value) {
            handled++;

            if (err) console.debug(err);
            else trailers[trailerName] = value;

            process.nextTick(send);
        }

        const result = response[kResponseTrailers][trailerName](
            response,
            payload,
            cb,
        );

        if (typeof result === 'object' && typeof result.then === 'function')
            result.then(v => cb(null, v), cb);
    }

    if (skipped) response.res.end(null, null, null);
}

function sendStreamTrailer(payload, res) {
    if (res[kResponseTrailers] === null) return;
    payload.on('end', () => sendTrailer(null, res));
}

function logStreamError(logger, err, res) {
    if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
        if (!logger[kDisableRequestLogging])
            logger.info({ res }, 'stream closed prematurely');
    } else {
        logger.warn(
            { err },
            'response terminated with an error with headers already sent',
        );
    }
}

function sendStream(payload, res) {
    let sourceOpen = true;
    let errorLogged = false;

    sendStreamTrailer(payload, res);

    eos(payload, { readable: true, writable: false }, function (err) {
        sourceOpen = false;
        if (err != null) {
            if (res.headersSent || res.request.aborted === true) {
                if (!errorLogged) {
                    errorLogged = true;
                    logStreamError(console, err, res);
                }
                res.destroy();
            } else {
                onErrorHook(res, err);
            }
        }
    });

    eos(res, function (err) {
        if (sourceOpen) {
            if (err != null && res.headersSent && !errorLogged) {
                errorLogged = true;
                logStreamError(console, err, res);
            }

            if (typeof payload.destroy === 'function') {
                payload.destroy();
            } else if (typeof payload.close === 'function') {
                payload.close(noop);
            } else if (typeof payload.abort === 'function') {
                payload.abort();
            } else {
                console.warn('stream payload does not end properly');
            }
        }
    });

    if (!res.headersSent) {
        for (const key in res[kResponseHeaders])
            res.setHeader(key, res[kResponseHeaders][key]);
    } else {
        console.warn(
            "response will send, but you shouldn't use res.writeHead in stream mode",
        );
    }

    payload.pipe(res);
}

function sendWebStream(payload, res) {
    const nodeStream = Readable.fromWeb(payload);
    sendStream(nodeStream, res);
}

/**
 * This function runs when a payload that is not a string|buffer|stream or null
 * should be serialized to be streamed to the response.
 * This is the default serializer that can be customized by the user using the replySerializer
 *
 * @param {object} context the request context
 * @param {object} data the JSON payload to serialize
 * @param {number} statusCode the http status code
 * @param {string} [contentType] the reply content type
 * @returns {string} the serialized payload
 */
function serialize(context, data, statusCode, contentType?) {
    //const fnSerialize = getSchemaSerializer(context, statusCode, contentType);

    //if (fnSerialize)
    //    return fnSerialize(data)

    return JSON.stringify(data);
}

function noop() {}

export default {
    app: undefined,
    req: undefined,
    res: undefined,
    request: undefined,
    _body: undefined,
    locals: undefined,
    [kResponseSerializer]: null,
    [kResponseErrorHandlerCalled]: false,
    [kResponseHijacked]: false,
    [kResponseIsError]: false,
    [kResponseIsRunningOnErrorHook]: false,
    [kResponseHeaders]: {},
    [kResponseTrailers]: null,
    [kResponseHasStatusCode]: false,
    [kResponseStartTime]: undefined,

    clear() {
        this[kResponseSerializer] = null;
        this[kResponseErrorHandlerCalled] = false;
        this[kResponseHijacked] = false;
        this[kResponseIsError] = false;
        this[kResponseIsRunningOnErrorHook] = false;
        this[kResponseHeaders] = {};
        this[kResponseTrailers] = null;
        this[kResponseHasStatusCode] = false;
        this[kResponseStartTime] = undefined;
        this.req = undefined;
        this.res = undefined;
        this.request = undefined;
        this._body = undefined;
        this.locals = undefined;
    },

    /**
     * Return the request socket.
     *
     * @return {Connection}
     * @api public
     */
    get socket() {
        return this.res.socket;
    },

    /**
     * Get response status code.
     *
     * @return {Number}
     * @api public
     */
    get status() {
        return this.res.statusCode;
    },

    get statusCode() {
        return this.res.statusCode;
    },

    get now() {
        const ts = process.hrtime();
        return ts[0] * 1e3 + ts[1] / 1e6;
    },

    get elapsedTime() {
        if (this[kResponseStartTime] === undefined) return 0;
        const endTime = this[kResponseEndTime] || this.now;
        return endTime - this[kResponseStartTime];
    },

    get sent() {
        return (this[kResponseHijacked] || this.res.writableEnded) === true;
    },

    /**
     * Get response status message
     *
     * @return {String}
     * @api public
     */
    get message() {
        return this.res.statusMessage || statuses.message[this.status];
    },

    get statusMessage() {
        return this.message;
    },

    /**
     * Set response status message
     *
     * @param {String} msg
     * @api public
     */
    set message(msg) {
        this.res.statusMessage = msg;
    },

    /**
     * Get response body.
     *
     * @return {Mixed}
     * @api public
     */
    get body() {
        return this._body;
    },

    /**
     * Set response body.
     *
     * @param {String|Buffer|Object|Stream|ReadableStream|Blob|Response} val
     * @api public
     */
    set body(val) {
        const original = this._body;
        this._body = val;

        if (val == null) {
            if (!statuses.empty[this.status]) {
                if (this.get('Content-Type') === 'application/json') {
                    this._body = 'null';
                    return;
                }
                this.status = 204;
            }

            this.remove('Content-Type');
            this.remove('Content-Length');
            this.remove('Transfer-Encoding');
            return;
        }

        if (!this[kResponseHasStatusCode]) this.status = 200;

        const setType = !this.has('Content-Type');

        // string
        if (typeof val === 'string') {
            if (setType)
                /^\s*</.test(val)
                    ? this.type('text/html')
                    : this.type('text/plain');
            this.length = Buffer.byteLength(val);
            return;
        }

        // buffer
        if (Buffer.isBuffer(val)) {
            if (setType) this.type('application/octet-stream');
            this.length = val.length;
            return;
        }

        // stream
        if (val instanceof Stream) {
            onFinish(this.res, destroy.bind(null, val));

            if (original !== val)
                if (original != null) this.remove('Content-Length');

            if (setType) this.type('application/octet-stream');
            return;
        }

        // ReadableStream
        if (val instanceof ReadableStream) {
            if (setType) this.type('application/octet-stream');
            return;
        }

        // blob
        if (val instanceof Blob) {
            if (setType) this.type('application/octet-stream');
            this.length = val.size;
            return;
        }

        // Response
        if (val instanceof Response) {
            this.status = val.status;
            if (setType) this.type('application/octet-stream');
            const headers = val.headers;

            for (const key of headers.keys()) this.set(key, headers.get(key));

            if (val.redirected) this.redirect(val.url);

            return;
        }

        // json
        this.remove('Content-Length');
        this.type('application/json');
    },

    /**
     * Set Content-Length field to `n`.
     *
     * @param {Number} n
     * @api public
     */
    set length(n) {
        if (!this.has('Transfer-Encoding')) this.set('Content-Length', n);
    },

    /**
     * Return parsed response Content-Length when present.
     *
     * @return {Number}
     * @api public
     */
    get length() {
        if (this.has('Content-Length'))
            return parseInt(this.get('Content-Length'), 10) || 0;

        const { body } = this;
        if (!body || body instanceof Stream) return undefined;
        if (typeof body === 'string') return Buffer.byteLength(body);
        if (Buffer.isBuffer(body)) return body.length;
        return Buffer.byteLength(JSON.stringify(body));
    },

    /**
     * Set response status code.
     *
     * @param {Number} code
     * @api public
     */
    set status(code) {
        if (!Number.isInteger(code))
            throw new CM_ERR_INVALID_CODE_TYPE(JSON.stringify(code));

        if (code < 100 || code > 999)
            throw new CM_ERR_INVALID_CODE_RANGE(JSON.stringify(code));

        this.res.statusCode = code;
        this[kResponseHasStatusCode] = true;
    },

    /**
     * Last Modiefied
     */

    /**
     * Set the Last-Modified date using a string or a Date.
     *
     *     this.response.lastModified = new Date();
     *     this.response.lastModified = '2013-09-13';
     *
     * @param {String|Date} val
     * @api public
     */
    set lastModified(val) {
        if (typeof val === 'string') val = new Date(val);
        this.set('Last-Modified', val.toUTCString());
    },

    /**
     * Get the Last-Modified date in Date form, if it exists.
     *
     * @return {Date}
     * @api public
     */
    get lastModified() {
        const date = this.get('last-modified');
        if (date) return new Date(date);
    },

    /**
     * Returns true if the header identified by name is currently set in the outgoing headers.
     * The header name matching is case-insensitive.
     *
     * Examples:
     *
     *     this.has('Content-Type');
     *     // => true
     *
     *     this.get('content-type');
     *     // => true
     *
     * @param {String} field
     * @return {boolean}
     * @api public
     */
    has(field) {
        return typeof this.res.hasHeader === 'function'
            ? this.res.hasHeader(field)
            : field.toLowerCase() in this.res.getHeaders();
    },

    /**
     * Remove header `field`.
     *
     * @param {String} field
     * @api public
     */
    remove(field) {
        if (this.headerSent) return;
        this.res.removeHeader(field);
    },

    /**
     * Checks if the request is writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     *
     * @return {Boolean}
     * @api private
     */
    get writable() {
        // can't write any more after response finished
        // response.writableEnded is available since Node > 12.9
        // https://nodejs.org/api/http.html#http_response_writableended
        // response.finished is undocumented feature of previous Node versions
        // https://stackoverflow.com/questions/16254385/undocumented-response-finished-in-node-js
        if (this.res.writableEnded || this.res.finished) return false;

        const socket = this.res.socket;
        // There are already pending outgoing res, but still writable
        // https://github.com/nodejs/node/blob/v4.4.7/lib/_http_server.js#L486
        if (!socket) return true;
        return socket.writable;
    },

    /**
     * HTTP Compatibility
     */
    get headerSent() {
        return this.res.headerSent;
    },

    get headersSent() {
        return this.res.headersSent;
    },

    get sendDate() {
        return this.res.sendDate;
    },

    get strictContentLength() {
        return this.res.strictContentLength;
    },

    get writableEnded() {
        return this.res.writableEnded;
    },

    get writableFinished() {
        return this.res.writableFinished;
    },

    hijack() {
        this[kResponseHijacked] = true;
        return this;
    },

    /**
     * Set the HTTP status code for the response.
     *
     * Expects an integer value between 100 and 999 inclusive.
     * Throws an error if the provided status code is not an integer or if it's outside the allowable range.
     *
     * @param {number} code - The HTTP status code to set.
     * @return {ServerResponse} - Returns itself for chaining methods.
     * @throws {TypeError} If `code` is not an integer.
     * @throws {RangeError} If `code` is outside the range 100 to 999.
     * @public
     */
    code(code: number) {
        this.status = code;
        return this;
    },

    /**
     * Set Link header field with the given `links`.
     *
     * Examples:
     *
     *    res.links({
     *      next: 'http://api.example.com/users?page=2',
     *      last: 'http://api.example.com/users?page=5'
     *    });
     *
     * @param {Object} links
     * @return {ServerResponse}
     * @public
     */
    links(links) {
        let link = this.get('Link') || '';
        if (link) link += ', ';

        return this.set(
            'Link',
            link +
                Object.keys(links)
                    .map(function (rel) {
                        return '<' + links[rel] + '>; rel="' + rel + '"';
                    })
                    .join(', '),
        );
    },

    /**
     * Set header `field` to `val`, or pass
     * an object of header fields.
     *
     * Examples:
     *
     *    res.set('Foo', ['bar', 'baz']);
     *    res.set('Accept', 'application/json');
     *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
     *
     * Aliased as `res.header()`.
     *
     * When the set header is "Content-Type", the type is expanded to include
     * the charset if not present using `mime.contentType()`.
     *
     * @param {String|Object} field
     * @param {String|Array} val
     * @return {ServerResponse} for chaining
     * @public
     */
    header(field, val) {
        return this.set(field, val);
    },
    setHeader(field, val) {
        return this.set(field, val);
    },
    set(field, val) {
        if (typeof field === 'string') {
            field = field.toLowerCase();

            if (this[kResponseHeaders][field] && field === 'set-cookie') {
                if (typeof this[kResponseHeaders][field] === 'string')
                    this[kResponseHeaders][field] = [
                        this[kResponseHeaders][field],
                    ];

                if (Array.isArray(val))
                    Array.prototype.push.apply(
                        this[kResponseHeaders][field],
                        val,
                    );
                else this[kResponseHeaders][field].push(val);
            } else {
                let value = Array.isArray(val) ? val.map(String) : String(val);

                if (field === 'content-type' && value.indexOf('/') === -1) {
                    if (Array.isArray(value))
                        throw new CM_ERR_SEND_CONTENTTYPE_ARR();

                    value = mime.getType(value);
                }

                this[kResponseHeaders][field] = value;
            }
        } else {
            for (let key in field) this.set(key, field[key]);
        }

        return this;
    },

    /**
     * Get value for header `field`.
     *
     * @param {String} field
     * @return {String}
     * @public
     */
    getHeader(field) {
        return this.get(field);
    },
    get(field: string) {
        field = field.toLowerCase();
        let value = this[kResponseHeaders][field];

        if (value === undefined && this.res.hasHeader(field))
            value = this.res.getHeader(field);

        return value;
    },

    /**
     * Set _Content-Type_ response header with `type` through `mime.contentType()`
     * when it does not contain "/", or set the Content-Type to `type` otherwise.
     * When no mapping is found though `mime.contentType()`, the type is set to
     * "application/octet-stream".
     *
     * Examples:
     *
     *     res.type('.html');
     *     res.type('html');
     *     res.type('json');
     *     res.type('application/json');
     *     res.type('png');
     *
     * @param {String} type
     * @return {ServerResponse} for chaining
     * @public
     */
    type(type: string) {
        return this.contentType(type);
    },
    contentType(type: string) {
        const ct =
            type.indexOf('/') === -1
                ? mime.getType(type) || 'application/octet-stream'
                : type;

        return this.set('Content-Type', ct);
    },

    /**
     * Send given HTTP status code.
     *
     * Sets the response status to `statusCode` and the body of the
     * response to the standard description from node's http.STATUS_CODES
     * or the statusCode number if no description.
     *
     * Examples:
     *
     *     res.sendStatus(200);
     *
     * @param {number} statusCode
     * @public
     */
    sendStatus(statusCode: number) {
        const payload = statuses.message[statusCode] || String(statusCode);
        this.status(statusCode);
        this.type('text/plain; charset=utf-8');
        onSendHook(this, payload);
    },

    /**
     * Send a response.
     *
     * Examples:
     *
     *     res.send(Buffer.from('wahoo'));
     *     res.send({ some: 'json' });
     *     res.send('<p>some html</p>');
     *
     * @param {string|number|boolean|object|Buffer} payload
     * @public
     */
    send(payload: any) {
        if (this[kResponseIsRunningOnErrorHook] === true)
            throw new CM_ERR_SEND_INSIDE_ONERR();

        if (this.sent) {
            console.warn({
                err: new CM_ERR_RES_ALREADY_SENT(this.req.url, this.req.method),
            });
            return this;
        }

        if (payload instanceof Error || this[kResponseIsError] === true) {
            this[kResponseIsError] = false;
            onErrorHook(this, payload, onSendHook);
            return this;
        }

        if (payload === undefined) {
            onSendHook(this, payload);
            return this;
        }

        let contentType = this.get('content-type');
        let hasContentType = contentType !== undefined;

        if (payload !== null) {
            if (
                typeof payload.pipe === 'function' ||
                typeof payload.getReader === 'function' ||
                toString.call(payload) === '[object Response]'
            ) {
                onSendHook(this, payload);
                return this;
            }

            if (payload instanceof ArrayBuffer) {
                if (hasContentType === false)
                    this.set('Content-Type', 'application/octet-stream');

                payload = Buffer.isBuffer(payload)
                    ? payload
                    : Buffer.from(payload);
                onSendHook(this, payload);
            }

            if (!this.get('Content-Type')) {
                if (typeof payload === 'string')
                    this.set('Content-Type', 'text/html');
                else if (Buffer.isBuffer(payload))
                    this.set('Content-Type', 'application/octet-stream');
                else this.set('Content-Type', 'text/plain');
                contentType = this.get('content-type');
                hasContentType = true;
            }
        }

        if (this[kResponseSerializer] !== null) {
            if (typeof payload !== 'string') {
                preSerializationHook(this, payload);
                return this;
            } else {
                payload = this[kResponseSerializer](payload);
            }
        } else if (
            hasContentType === false ||
            contentType.indexOf('json') > -1
        ) {
            if (hasContentType === false) {
                this.set('Content-Type', 'application/json; charset=utf-8');
            } else {
                if (contentType.indexOf('charset') === -1) {
                    const customContentType = contentType.trim();

                    if (customContentType.endsWith(';'))
                        this.set(
                            'Content-Type',
                            `${customContentType} charset=utf-8`,
                        );
                    else
                        this.set(
                            'Content-Type',
                            `${customContentType}; charset=utf-8`,
                        );
                }
            }

            if (typeof payload !== 'string') {
                preSerializationHook(this, payload);
                return this;
            }
        }

        onSendHook(this, payload);

        return this;
    },

    /**
     * Send JSON response.
     *
     * Examples:
     *
     *     res.json(null);
     *     res.json({ user: 'tj' });
     *
     * @param {string|number|boolean|object} obj
     * @public
     */
    json(obj) {
        const escape = this.app.get('json escape');
        const replacer = this.app.get('json replacer');
        const spaces = this.app.get('json spaces');
        const body = this.stringify(obj, replacer, spaces, escape);

        if (!this.get('Content-Type'))
            this.set('Content-Type', 'application/json');

        return this.send(body);
    },

    /**
     * Send JSON response with JSONP callback support.
     *
     * Examples:
     *
     *     res.jsonp(null);
     *     res.jsonp({ user: 'tj' });
     *
     * @param {string|number|boolean|object} obj
     * @public
     */
    jsonp(obj) {
        const escape = this.app.get('json escape');
        const replacer = this.app.get('json replacer');
        const spaces = this.app.get('json spaces');
        let body = this.stringify(obj, replacer, spaces, escape);
        let callback = this.req.query[this.app.get('jsonp callback name')];

        if (!this.get('Content-Type')) {
            this.set('X-Content-Type-Options', 'nosniff');
            this.set('Content-Type', 'application/json');
        }

        if (Array.isArray(callback)) callback = callback[0];

        if (typeof callback === 'string' && callback.length !== 0) {
            this.set('X-Content-Type-Options', 'nosniff');
            this.set('Content-Type', 'text/javascript');

            callback = callback.replace(/[^\[\]\w$.]/g, '');

            if (body === undefined) {
                body = '';
            } else if (typeof body === 'string') {
                body = body
                    .replace(/\u2028/g, '\\u2028')
                    .replace(/\u2029/g, '\\u2029');
            }

            body =
                '/**/ typeof ' +
                callback +
                " === 'function' && " +
                callback +
                '(' +
                body +
                ');';
        }

        return this.send(body);
    },

    /**
     * Stringify JSON, like JSON.stringify, but v8 optimized, with the
     * ability to escape characters that can trigger HTML sniffing.
     *
     * @param {*} value
     * @param {function} replacer
     * @param {number} spaces
     * @param {boolean} escape
     * @returns {string}
     * @private
     */
    stringify(value, replacer, spaces, escape) {
        // v8 checks arguments.length for optimizing simple call
        // https://bugs.chromium.org/p/v8/issues/detail?id=4730
        var json =
            replacer || spaces
                ? JSON.stringify(value, replacer, spaces)
                : JSON.stringify(value);

        if (escape && typeof json === 'string') {
            json = json.replace(/[<>&]/g, function (c) {
                switch (c.charCodeAt(0)) {
                    case 0x3c:
                        return '\\u003c';
                    case 0x3e:
                        return '\\u003e';
                    case 0x26:
                        return '\\u0026';
                    /* istanbul ignore next: unreachable default */
                    default:
                        return c;
                }
            });
        }

        return json;
    },

    /**
     * Transfer the file at the given `path`.
     *
     * Automatically sets the _Content-Type_ response header field.
     * The callback `callback(err)` is invoked when the transfer is complete
     * or when an error occurs. Be sure to check `res.headersSent`
     * if you wish to attempt responding, as the header and some data
     * may have already been transferred.
     *
     * Options:
     *
     *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
     *   - `root`     root directory for relative filenames
     *   - `headers`  object of headers to serve with file
     *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
     *
     * Other options are passed along to `send`.
     *
     * Examples:
     *
     *  The following example illustrates how `res.sendFile()` may
     *  be used as an alternative for the `static()` middleware for
     *  dynamic situations. The code backing `res.sendFile()` is actually
     *  the same code, so HTTP cache support etc is identical.
     *
     *     app.get('/user/:uid/photos/:file', function(req, res){
     *       var uid = req.params.uid
     *         , file = req.params.file;
     *
     *       req.user.mayViewFilesFrom(uid, function(yes){
     *         if (yes) {
     *           res.sendFile('/uploads/' + uid + '/' + file);
     *         } else {
     *           res.send(403, 'Sorry! you cant see that.');
     *         }
     *       });
     *     });
     *
     * @public
     */
    sendFile(path, options, callback) {
        let done = callback;
        const req = this.req;
        const res = this;
        const next = req.next;
        let opts = options || {};

        if (!path)
            throw new TypeError('path argument is required to res.sendFile');

        if (typeof path !== 'string')
            throw new TypeError('path must be a string to res.sendFile');

        if (typeof options === 'function') {
            done = options;
            opts = {};
        }

        if (!opts.root && !pathIsAbsolute(path))
            throw new TypeError(
                'path must be absolute or specify root to res.sendFile',
            );

        const pathname = encodeURI(path);
        const file = send(req, pathname, opts);

        // transfer
        sendfile(res.res, file, opts, function (err) {
            if (done) return done(err);
            if (err && err.code === 'EISDIR') return next();

            // next() all but write errors
            if (err && err.code !== 'ECONNABORTED' && err.syscall !== 'write')
                next(err);
        });
    },

    /**
     * Transfer the file at the given `path` as an attachment.
     *
     * Optionally providing an alternate attachment `filename`,
     * and optional callback `callback(err)`. The callback is invoked
     * when the data transfer is complete, or when an error has
     * occurred. Be sure to check `res.headersSent` if you plan to respond.
     *
     * Optionally providing an `options` object to use with `res.sendFile()`.
     * This function will set the `Content-Disposition` header, overriding
     * any `Content-Disposition` header passed as header options in order
     * to set the attachment and filename.
     *
     * This method uses `res.sendFile()`.
     *
     * @public
     */
    download(path, filename, options, callback) {
        let done = callback;
        let name = filename;
        let opts = options || null;

        if (typeof filename === 'function') {
            done = filename;
            name = null;
            opts = null;
        } else if (typeof options === 'function') {
            done = options;
            opts = null;
        }

        if (
            typeof filename === 'object' &&
            (typeof options === 'function' || options === undefined)
        ) {
            name = null;
            opts = filename;
        }

        const headers = {
            'Content-Disposition': contentDisposition(name || path),
        };

        if (opts && opts.headers) {
            const keys = Object.keys(opts.headers);

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];

                if (key.toLowerCase() !== 'content-disposition')
                    headers[key] = opts.headers[key];
            }
        }

        opts = Object.create(opts);
        opts.headers = headers;

        var fullPath = !opts.root ? resolve(path) : path;

        return this.sendFile(fullPath, opts, done);
    },

    end(data: string | Buffer | Uint8Array, encoding?: string, cb?: Function) {
        this.res.end(data, encoding, cb);
        return this;
    },

    /**
     * Respond to the Acceptable formats using an `obj`
     * of mime-type callbacks.
     *
     * This method uses `req.accepted`, an array of
     * acceptable types ordered by their quality values.
     * When "Accept" is not present the _first_ callback
     * is invoked, otherwise the first match is used. When
     * no match is performed the server responds with
     * 406 "Not Acceptable".
     *
     * Content-Type is set for you, however if you choose
     * you may alter this within the callback using `res.type()`
     * or `res.set('Content-Type', ...)`.
     *
     *    res.format({
     *      'text/plain': function(){
     *        res.send('hey');
     *      },
     *
     *      'text/html': function(){
     *        res.send('<p>hey</p>');
     *      },
     *
     *      'application/json': function () {
     *        res.send({ message: 'hey' });
     *      }
     *    });
     *
     * In addition to canonicalized MIME types you may
     * also use extnames mapped to these types:
     *
     *    res.format({
     *      text: function(){
     *        res.send('hey');
     *      },
     *
     *      html: function(){
     *        res.send('<p>hey</p>');
     *      },
     *
     *      json: function(){
     *        res.send({ message: 'hey' });
     *      }
     *    });
     *
     * By default Express passes an `Error`
     * with a `.status` of 406 to `next(err)`
     * if a match is not made. If you provide
     * a `.default` callback it will be invoked
     * instead.
     *
     * @param {Object} obj
     * @return {ServerResponse} for chaining
     * @public
     */
    format(obj) {
        var req = this.req;
        var next = req.next;

        var keys = Object.keys(obj).filter(function (v) {
            return v !== 'default';
        });

        var key = keys.length > 0 ? req.accepts(keys) : false;

        this.vary('Accept');

        if (key) {
            this.set('Content-Type', normalizeType(key).value);
            obj[key](req, this, next);
        } else if (obj.default) {
            obj.default(req, this, next);
        } else {
            next(
                createError(406, {
                    types: normalizeTypes(keys).map(function (o) {
                        return o.value;
                    }),
                }),
            );
        }

        return this;
    },

    /**
     * Add `field` to Vary. If already present in the Vary set, then
     * this call is simply ignored.
     *
     * @param {Array|String} field
     * @return {ServerResponse} for chaining
     * @public
     */
    vary(field) {
        vary(this, field);
        return this;
    },

    /**
     * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
     *
     * @param {String} filename
     * @return {ServerResponse}
     * @public
     */
    attachment(filename) {
        if (filename) this.type(extname(filename));

        this.set('Content-Disposition', contentDisposition(filename));
        return this;
    },

    /**
     * Append additional header `field` with value `val`.
     *
     * Example:
     *
     *    res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
     *    res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
     *    res.append('Warning', '199 Miscellaneous warning');
     *
     * @param {String} field
     * @param {String|Array} val
     * @return {ServerResponse} for chaining
     * @public
     */
    append(field, val) {
        const prev = this.get(field);
        let value = val;

        if (prev) {
            value = Array.isArray(prev)
                ? prev.concat(val)
                : Array.isArray(val)
                  ? [prev].concat(val)
                  : [prev, val];
        }

        return this.set(field, value);
    },

    /**
     * Redirect
     */

    /**
     * Set the location header to `url`.
     *
     * The given `url` can also be "back", which redirects
     * to the _Referrer_ or _Referer_ headers or "/".
     *
     * Examples:
     *
     *    res.location('/foo/bar').;
     *    res.location('http://example.com');
     *    res.location('../login');
     *
     * @param {String} url
     * @return {ServerResponse} for chaining
     * @public
     */
    location(url) {
        return this.set('Location', encodeUrl(url));
    },

    /**
     * Perform a 302 redirect to `url`.
     *
     * The string "back" is special-cased
     * to provide Referrer support, when Referrer
     * is not present `alt` or "/" is used.
     *
     * Examples:
     *
     *    this.redirect('back');
     *    this.redirect('back', '/index.html');
     *    this.redirect('/login');
     *    this.redirect('http://google.com');
     *
     * @param {String} url
     * @param {String} [alt]
     * @api public
     */
    redirect(url, alt?) {
        if (url === 'back') url = this.get('Referrer') || alt || '/';

        if (/^https?:\/\//i.test(url)) url = new URL(url).toString();

        this.set('Location', encodeUrl(url));

        if (!statuses.redirect[this.status]) this.status = 302;

        if (this.req.accepts('html')) {
            url = escapeHtml(url);
            this.type('text/html; charset=utf-8');
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }

        this.type('text/plain; charset=utf-8');
        this.body = `Redirecting to ${url}.`;
    },

    /**
     * Cookies
     */

    /**
     * Clear cookie `name`.
     *
     * @param {String} name
     * @param {Object} [options]
     * @return {ServerResponse} for chaining
     * @public
     */
    clearCookie(name, options) {
        const opts = { path: '/', ...options, expires: new Date(1) };
        delete opts.maxAge;

        return this.cookie(name, '', opts);
    },

    /**
     * Set cookie `name` to `value`, with the given `options`.
     *
     * Options:
     *
     *    - `maxAge`   max-age in milliseconds, converted to `expires`
     *    - `signed`   sign the cookie
     *    - `path`     defaults to "/"
     *
     * Examples:
     *
     *    // "Remember Me" for 15 minutes
     *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
     *
     *    // same as above
     *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
     *
     * @param {String} name
     * @param {String|Object} value
     * @param {Object} [options]
     * @return {ServerResponse} for chaining
     * @public
     */
    cookie(name, value, options) {
        const opts = utilsMerge({}, options);
        const secret = this.req.secret;
        const signed = opts.signed;

        if (signed && !secret)
            throw new Error(
                'cookieParser("secret") required for signed cookies',
            );

        let val =
            typeof value === 'object'
                ? 'j:' + JSON.stringify(value)
                : String(value);

        if (signed) val = 's:' + cookieSignatureSign(val, secret);

        if (opts.maxAge != null) {
            const maxAge = opts.maxAge - 0;

            if (!isNaN(maxAge)) {
                opts.expires = new Date(Date.now() + maxAge);
                opts.maxAge = Math.floor(maxAge / 1000);
            }
        }

        if (opts.path == null) opts.path = '/';

        this.append('Set-Cookie', cookieSerialize(name, String(val), opts));

        return this;
    },

    /**
     * Render
     */

    /**
     * Render `view` with the given `options` and optional callback `fn`.
     * When a callback function is given a response will _not_ be made
     * automatically, otherwise a response of _200_ and _text/html_ is given.
     *
     * Options:
     *
     *  - `cache`     boolean hinting to the engine it should cache
     *  - `filename`  filename of the view being rendered
     *
     * @public
     */
    render(view, options, callback) {
        const app = this.app;
        let done = callback;
        let opts = options || {};
        const req = this.req;
        const self = this;

        if (typeof options === 'function') {
            done = options;
            opts = {};
        }

        opts._locals = this.locals;

        done =
            done ||
            function (err, str) {
                if (err) return req.next(err);
                self.send(str);
            };

        app.render(view, opts, done);
    },

    /**
     * Trailers
     */
    trailer(key: string, fn: Function) {
        key = key.toLowerCase();

        if (INVALID_TRAILERS.has(key)) throw new CM_ERR_BAD_TRAILER_NAME(key);

        if (typeof fn !== 'function')
            throw new CM_ERR_BAD_TRAILER_VALUE(key, typeof fn);

        if (this[kResponseTrailers] === null) this[kResponseTrailers] = {};
        this[kResponseTrailers][key] = fn;
        return this;
    },

    hasTrailer(key: string) {
        return this[kResponseTrailers]?.[key.toLowerCase()] !== undefined;
    },

    removeTrailer(key: string) {
        if (this[kResponseTrailers] === null) return this;
        this[kResponseTrailers][key.toLowerCase()] = undefined;
        return this;
    },

    /**
     * Serialize
     */
    getSerializationFunction(schemaOrStatus, contentType) {
        let serialize;

        if (
            typeof schemaOrStatus === 'string' ||
            typeof schemaOrStatus === 'number'
        ) {
            if (typeof contentType === 'string')
                serialize =
                    this[kSchemaResponse]?.[schemaOrStatus]?.[contentType];
            else serialize = this[kSchemaResponse]?.[schemaOrStatus];
        } else if (typeof schemaOrStatus === 'object') {
            serialize = this[kResponseCacheSerializeFns]?.get(schemaOrStatus);
        }

        return serialize;
    },

    serialize(payload) {
        if (this[kResponseSerializer] !== null) {
            return this[kResponseSerializer](payload);
        } else {
            if (this[kResponseSerializerDefault])
                return this[kResponseSerializerDefault](
                    payload,
                    this.res.statusCode,
                );
            else return serialize(this, payload, this.res.statusCode);
        }
    },

    /**
     * HTTP Expose
     */
    flushHeaders() {
        this[kResponseHeaders] = this.res.flushHeaders();
    },

    getHeaderNames(): string[] {
        return this.res.getHeaderNames();
    },

    getHeaders(): Object {
        return this.res.getHeaders();
    },

    hasHeader(name: string): boolean {
        return this.res.hasHeader(name);
    },

    removeHeader(name: string) {
        this.res.removeHeader(name);
    },

    setTimeout(msecs: number, cb?: Function) {
        this.res.setTimeout(msecs, cb);
        return this;
    },

    uncork() {
        this.res.uncork();
    },
};
