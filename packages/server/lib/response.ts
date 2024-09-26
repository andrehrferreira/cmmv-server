/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/express/blob/master/lib/response.js
 */

import * as http from 'node:http';
import * as http2 from 'node:http2';
import { finished as eos, Readable } from 'node:stream';

import { mime, statuses } from '../utils';
import { Request } from './request';

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

export type Response = (http.ServerResponse | http2.Http2ServerResponse) & {
    app?: any;
    request?: Request;
    raw?: any;
    sent: boolean;
    elapsedTime: number;
    code(code: number);
    status(code: number);
    send(payload: string | Buffer);
    sendStatus(statusCode);
    contentType(type: string);
    type(type: string);
    header(field: string | string[], val: string);
    set(field: string | string[], val: string);
    get(field: string);
    getHeaders();
    links(links: object);
    trailer(key, fn);
    hasTrailer(key: string);
    removeTrailer(key: string);
    hijack();
    getSerializationFunction(schemaOrStatus, contentType);
    compileSerializationSchema(schema, httpStatus?, contentType?);
    serializeInput(input, schema, httpStatus, contentType);
    serialize(payload);
    serializer(fn);
    redirect(url, code);
    callNotFound();
    then(fulfilled, rejected);
};

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

export const buildResponse = (app, req: Request, R: Response) => {
    R.app = app;
    R.sent = false;
    R.request = req;
    R[kResponseSerializer] = null;
    R[kResponseErrorHandlerCalled] = false;
    R[kResponseHijacked] = false;
    R[kResponseIsError] = false;
    R[kResponseIsRunningOnErrorHook] = false;
    R[kResponseHeaders] = {};
    R[kResponseTrailers] = null;
    R[kResponseHasStatusCode] = false;
    R[kResponseStartTime] = undefined;

    Object.defineProperty(R, 'now', {
        get(): number {
            const ts = process.hrtime();
            return ts[0] * 1e3 + ts[1] / 1e6;
        },
    });

    Object.defineProperty(R, 'elapsedTime', {
        get(): number {
            if (this[kResponseStartTime] === undefined) return 0;

            const endTime = this[kResponseEndTime] || this.now();
            return endTime - this[kResponseStartTime];
        },
    });

    Object.defineProperty(R, 'sent', {
        get(): boolean {
            return (this[kResponseHijacked] || this.writableEnded) === true;
        },
    });

    R.hijack = function hijack() {
        this[kResponseHijacked] = true;
        return this;
    };

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
    R.code = R.status = function status(code: number) {
        if (!Number.isInteger(code))
            throw new CM_ERR_INVALID_CODE_TYPE(JSON.stringify(code));

        if (code < 100 || code > 999)
            throw new CM_ERR_INVALID_CODE_RANGE(JSON.stringify(code));

        this.statusCode = code;
        this[kResponseHasStatusCode] = true;
        return this;
    };

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
    R.links = function links(links) {
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
    };

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
    R.send = function send(payload: any) {
        if (this[kResponseIsRunningOnErrorHook] === true)
            throw new CM_ERR_SEND_INSIDE_ONERR();

        if (this.sent) {
            console.warn({
                err: new CM_ERR_RES_ALREADY_SENT(req.url, req.method),
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
                    this.set('Content-Type', 'text/html; charset=utf-8');
                else if (Buffer.isBuffer(payload))
                    this.set('Content-Type', 'application/octet-stream');
                else this.set('Content-Type', 'text/plain; charset=utf-8');
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
    };

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
    R.sendStatus = function sendStatus(statusCode: number) {
        const payload = statuses.message[statusCode] || String(statusCode);
        this.status(statusCode);
        this.type('text/plain; charset=utf-8');
        onSendHook(this, payload);
    };

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
    R.contentType = R.type = function contentType(this: any, type) {
        const ct =
            type.indexOf('/') === -1
                ? mime.getType(type) || 'application/octet-stream'
                : type;

        return this.set('Content-Type', ct);
    };

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
    R.set = R.header = function header(this: any, field, val) {
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
    };

    /**
     * Get value for header `field`.
     *
     * @param {String} field
     * @return {String}
     * @public
     */
    R.get = function get(field: string) {
        field = field.toLowerCase();
        let value = this[kResponseHeaders][field];

        if (value === undefined && this.hasHeader(field))
            value = this.getHeader(field);

        return value;
    };

    /**
     * Trailers
     */
    R.trailer = function trailer(key: string, fn: Function) {
        key = key.toLowerCase();

        if (INVALID_TRAILERS.has(key)) throw new CM_ERR_BAD_TRAILER_NAME(key);

        if (typeof fn !== 'function')
            throw new CM_ERR_BAD_TRAILER_VALUE(key, typeof fn);

        if (this[kResponseTrailers] === null) this[kResponseTrailers] = {};
        this[kResponseTrailers][key] = fn;
        return this;
    };

    R.hasTrailer = function hasTrailer(key: string) {
        return this[kResponseTrailers]?.[key.toLowerCase()] !== undefined;
    };

    R.removeTrailer = function removeTrailer(key: string) {
        if (this[kResponseTrailers] === null) return this;
        this[kResponseTrailers][key.toLowerCase()] = undefined;
        return this;
    };

    /**
     * Serialize
     */
    R.getSerializationFunction = function getSerializationFunction(
        schemaOrStatus,
        contentType,
    ) {
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
    };

    R.serialize = function (payload) {
        if (this[kResponseSerializer] !== null) {
            return this[kResponseSerializer](payload);
        } else {
            if (this[kResponseSerializerDefault])
                return this[kResponseSerializerDefault](
                    payload,
                    this.statusCode,
                );
            else return serialize(this, payload, this.statusCode);
        }
    };

    return R;
};

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

function safeWriteHead(res, statusCode) {
    try {
        res.writeHead(statusCode, res[kResponseHeaders]);
    } catch (err) {
        if (err.code === 'ERR_HTTP_HEADERS_SENT')
            console.warn(
                `Reply was already sent, did you forget to "return reply" in the "${res.request.url}" (${res.request.method}) route?`,
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

function onSendEnd(res, payload) {
    if (res[kResponseTrailers] !== null) {
        const trailerHeaders = Object.keys(res[kResponseTrailers]);
        let header = '';

        for (const trailerName of trailerHeaders) {
            if (typeof res[kResponseTrailers][trailerName] !== 'function')
                continue;
            header += ' ';
            header += trailerName;
        }

        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Trailer', header.trim());
    }

    if (toString.call(payload) === '[object Response]') {
        if (typeof payload.status === 'number') res.code(payload.status);

        if (
            typeof payload.headers === 'object' &&
            typeof payload.headers.forEach === 'function'
        ) {
            for (const [headerName, headerValue] of payload.headers)
                res.setHeader(headerName, headerValue);
        }

        if (payload.body !== null) {
            if (payload.bodyUsed) throw new CM_ERR_RES_BODY_CONSUMED();
        }

        payload = payload.body;
    }

    const statusCode = res.statusCode;

    if (payload === undefined || payload === null) {
        if (
            statusCode >= 200 &&
            statusCode !== 204 &&
            statusCode !== 304 &&
            res.request.method !== 'HEAD' &&
            res[kResponseTrailers] === null
        ) {
            res[kResponseTrailers]['content-length'] = '0';
        }

        safeWriteHead(res, statusCode);
        sendTrailer(payload, res);
        return;
    }

    if ((statusCode >= 100 && statusCode < 200) || statusCode === 204) {
        // Responses without a content body must not send content-type
        // or content-length headers.
        // See https://www.rfc-editor.org/rfc/rfc9110.html#section-8.6.
        res.removeHeader('content-type');
        res.removeHeader('content-length');
        safeWriteHead(res, statusCode);
        sendTrailer(undefined, res);
        if (typeof payload.resume === 'function') {
            payload.on('error', noop);
            payload.resume();
        }
        return;
    }

    if (typeof payload.pipe === 'function') {
        sendStream(payload, res);
        return;
    }

    if (typeof payload.getReader === 'function') {
        sendWebStream(payload, res);
        return;
    }

    if (typeof payload !== 'string' && !Buffer.isBuffer(payload))
        throw new CM_ERR_RES_INVALID_PAYLOAD_TYPE(typeof payload);

    if (res[kResponseTrailers] === null) {
        const contentLength = res[kResponseHeaders]['content-length'];
        if (
            !contentLength ||
            (res.request.method !== 'HEAD' &&
                Number(contentLength) !== Buffer.byteLength(payload))
        ) {
            res[kResponseHeaders]['content-length'] =
                '' + Buffer.byteLength(payload);
        }
    }

    safeWriteHead(res, statusCode);
    res.write(payload);
    sendTrailer(payload, res);
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

function sendTrailer(payload, res) {
    if (res[kResponseTrailers] === null) {
        res.end(null, null, null);
        return;
    }

    const trailerHeaders = Object.keys(res[kResponseTrailers]);
    const trailers = {};
    let handled = 0;
    let skipped = true;

    function send() {
        if (handled === 0) {
            res.addTrailers(trailers);
            res.end(null, null, null);
        }
    }

    for (const trailerName of trailerHeaders) {
        if (typeof res[kResponseTrailers][trailerName] !== 'function') continue;
        skipped = false;
        handled--;

        function cb(err, value) {
            handled++;

            if (err) console.debug(err);
            else trailers[trailerName] = value;

            process.nextTick(send);
        }

        const result = res[kResponseTrailers][trailerName](res, payload, cb);

        if (typeof result === 'object' && typeof result.then === 'function')
            result.then(v => cb(null, v), cb);
    }

    if (skipped) res.end(null, null, null);
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
