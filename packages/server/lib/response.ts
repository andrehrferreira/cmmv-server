/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */

import * as vary from 'vary';
import * as accepts from 'accepts';
import * as send from 'send';
import { Buffer } from 'safe-buffer';
import * as createError from 'http-errors';
import * as cookie from 'cookie';

import * as http from 'node:http';
import * as http2 from 'node:http2';
import * as url from 'node:url';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const onHeaders = require('on-headers');
const extname = path.extname;
const resolve = path.resolve;

const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND } = http2.constants;

import { CookieOptions } from '../interfaces';

import { Request } from './request';

import { IRespose, IRequest } from '@cmmv/server-common';

import { ServerApplication } from './application';

import {
    mime,
    escapeHtml,
    statuses,
    fresh,
    encodeUrl,
    contentDisposition,
} from '../utils';

export class Response implements IRespose {
    public buffer: Buffer = Buffer.alloc(0);
    public statusCode: number = HTTP_STATUS_OK;
    public accept;
    public headers: any = {};
    public sended: boolean = false;
    public uuid: string;
    public secret: string;

    constructor(
        public readonly app: ServerApplication,
        public readonly req: Request,
        public readonly res: http.ServerResponse | http2.Http2ServerResponse,
    ) {
        this.accept = accepts(req.httpRequest as http.IncomingMessage);
        const self = this;

        onHeaders(
            this.res,
            function (this: http.ServerResponse | http2.Http2ServerResponse) {
                for (const keyHeader in self.headers) {
                    this.setHeader(keyHeader, self.headers[keyHeader]);
                }
            },
        );
    }

    get httpResponse() {
        return this.res;
    }

    get writeHead() {
        return this.res.writeHead;
    }

    get contentType() {
        return (type?: string) => this.type(type);
    }

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
    public append(appendName: string, val: any) {
        const prev = this.get(appendName);
        let value = val;

        if (prev) {
            value = Array.isArray(prev)
                ? prev.concat(val)
                : Array.isArray(val)
                  ? [prev].concat(val)
                  : [prev, val];
        }

        return this.set(appendName, value);
    }

    /**
     * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
     *
     * @param {String} filename
     * @return {ServerResponse}
     * @public
     */
    public attachment(filename?: string) {
        if (filename) this.type(extname(filename));

        this.set('Content-Disposition', contentDisposition(filename));

        return this;
    }

    get cookies() {
        return this.req.cookies;
    }

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
    public cookie(
        name: string,
        value: string | Object,
        options?: CookieOptions,
    ) {
        var opts = this.mergeObject({}, options);
        var secret = this.secret;
        var signed = opts.signed;

        if (signed && !secret)
            throw new Error(
                'cookieParser("secret") required for signed cookies',
            );

        let val =
            typeof value === 'object'
                ? 'j:' + JSON.stringify(value)
                : String(value);

        if (signed) val = 's:' + this.cookieSign(val, secret);

        if (opts.maxAge != null) {
            var maxAge = opts.maxAge - 0;

            if (!isNaN(maxAge)) {
                opts.expires = new Date(Date.now() + maxAge);
                opts.maxAge = Math.floor(maxAge / 1000);
            }
        }

        if (opts.path == null) opts.path = '/';

        this.append('Set-Cookie', cookie.serialize(name, String(val), opts));

        return this;
    }

    /**
     * Clear cookie `name`.
     *
     * @param {String} name
     * @param {Object} [options]
     * @return {ServerResponse} for chaining
     * @public
     */
    public clearCookie(name: string, options?: CookieOptions) {
        // Force cookie expiration by setting expires to the past
        const opts = { path: '/', ...options, expires: new Date(1) };
        // ensure maxAge is not passed
        delete opts.maxAge;

        return this.cookie(name, '', opts);
    }

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
    public download(path: string, filename?: string, options?, callback?) {
        var done = callback;
        var name = filename;
        var opts = options || null;

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

        let headers = {
            'Content-Disposition': contentDisposition(name || path),
        };

        if (opts && opts.headers) {
            let keys = Object.keys(opts.headers);

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
    }

    public end(data?: string | Buffer, encoding?: string, cb?: () => void) {
        this.buffer =
            typeof data === 'string' ? Buffer.from(data, encoding) : data;

        if (
            !this.headers['Content-Encoding'] &&
            this.buffer &&
            this.buffer.length > 0
        )
            this.setHeader('Content-Length', this.buffer.length.toString());
    }

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
    public format(object: any) {
        const req = this.req;
        const next = req.next;

        var keys = Object.keys(object).filter(function (v) {
            return v !== 'default';
        });

        var key =
            keys.length > 0
                ? accepts(this.req.httpRequest as http.IncomingMessage).types(
                      key,
                  )
                : false;

        this.vary('Accept');

        if (key) {
            this.set('Content-Type', this.normalizeType(key).value);
            object[key](req, this, next);
        } else if (object.default) {
            object.default(req, this, next);
        } else {
            next(
                createError(406, {
                    types: this.normalizeTypes(keys).map(function (o) {
                        return o.value;
                    }),
                }),
            );
        }

        return this;
    }

    /**
     * Get value for header `field`.
     *
     * @param {String} field
     * @return {String}
     * @public
     */
    public get(headerName: string): string {
        return this.getHeader(headerName);
    }

    public getHeader(headerName: string) {
        return this.headers[headerName];
    }

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
    public json(obj?: string | number | boolean | object) {
        // settings
        const app = this.app;
        const escape = app.get('json escape');
        const replacer = app.get('json replacer');
        const spaces = app.get('json spaces');
        const body = this.stringify(obj, replacer, spaces, escape);

        // content-type
        if (!this.get('Content-Type'))
            this.set('Content-Type', 'application/json');

        return this.send(body);
    }

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
    public jsonp(obj?: string | number | boolean | object) {
        const app = this.app;
        const escape = app.get('json escape');
        const replacer = app.get('json replacer');
        const spaces = app.get('json spaces');
        let body = this.stringify(obj, replacer, spaces, escape);
        const query = url.parse(this.req.url, true).query;
        let callback = query[app.get('jsonp callback name')];

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
    }

    private stringify(value, replacer, spaces, escape) {
        // v8 checks arguments.length for optimizing simple call
        // https://bugs.chromium.org/p/v8/issues/detail?id=4730
        let json =
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
    }

    public links(links: { [rel: string]: string }): Response {
        const existingLink = this.get('Link') || '';

        const formattedLinks = Object.keys(links)
            .map(rel => `<${links[rel]}>; rel="${rel}"`)
            .join(', ');

        this.set(
            'Link',
            existingLink
                ? `${existingLink}, ${formattedLinks}`
                : formattedLinks,
        );

        return this;
    }

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
    public location(path: string) {
        return this.set('Location', encodeUrl(url));
    }

    /**
     * Redirect to the given `url` with optional response `status`
     * defaulting to 302.
     *
     * Examples:
     *
     *    res.redirect('/foo/bar');
     *    res.redirect('http://example.com');
     *    res.redirect(301, 'http://example.com');
     *    res.redirect('../login'); // /blog/post/1 -> /blog/login
     *
     * @public
     */
    public redirect(url?: string) {
        let address = url;
        let body: string;
        var status = 302;

        // allow status / url
        if (arguments.length === 2) {
            status = arguments[0];
            address = arguments[1];
        }

        // Set location header
        address = this.location(address).get('Location');

        // Support text/{plain,html} by default
        this.format({
            text: function () {
                body = statuses.message[status] + '. Redirecting to ' + address;
            },

            html: function () {
                var u = escapeHtml(address);
                body =
                    '<p>' +
                    statuses.message[status] +
                    '. Redirecting to ' +
                    u +
                    '</p>';
            },

            default: function () {
                body = '';
            },
        });

        // Respond
        this.status(status);
        this.set('Content-Length', Buffer.from(body).length.toString());

        if (this.req.method === 'HEAD') this.end();
        else this.end(body);
    }

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
    public render(view, options, callback) {
        var app = this.app;
        var done = callback;
        var opts = options || {};
        var req = this.req;
        var self = this;

        // support callback function as second arg
        if (typeof options === 'function') {
            done = options;
            opts = {};
        }

        // merge res.locals
        opts._locals = app.locals;

        // default callback to respond
        done =
            done ||
            function (err, str) {
                if (err) return req.next(err);
                self.send(str);
            };

        // render
        app.render(view, opts, done);
    }

    /**
     * Send a response.
     *
     * Examples:
     *
     *     res.send(Buffer.from('wahoo'));
     *     res.send({ some: 'json' });
     *     res.send('<p>some html</p>');
     *
     * @param {string|number|boolean|object|Buffer} body
     * @public
     */
    public send(body?: string | number | boolean | object | Buffer): Response {
        let chunk = body;
        let encoding: BufferEncoding | undefined;
        let type: string | undefined;
        const req = this.req;
        const app = this.app;

        switch (typeof chunk) {
            case 'string':
                if (!this.get('Content-Type')) this.type('html');
                break;
            case 'boolean':
            case 'number':
            case 'object':
                if (chunk === null) {
                    chunk = '';
                } else if (Buffer.isBuffer(chunk)) {
                    if (!this.get('Content-Type')) {
                        this.type('bin');
                    }
                } else {
                    return this.json(chunk);
                }
                break;
        }

        if (typeof chunk === 'string') {
            encoding = 'utf8';
            type = this.get('Content-Type');

            if (typeof type === 'string')
                this.set('Content-Type', this.setCharset(type, 'utf-8'));
        }

        const etagFn = app.get('etag fn');
        const generateETag = !this.get('ETag') && typeof etagFn === 'function';

        let len: number | undefined;

        if (chunk !== undefined) {
            if (Buffer.isBuffer(chunk)) {
                len = chunk.length;
            } else if (
                !generateETag &&
                typeof chunk === 'string' &&
                chunk.length < 1000
            ) {
                len = Buffer.byteLength(chunk, encoding);
            } else {
                const chunkBuffer = Buffer.from(chunk as string, encoding);
                encoding = undefined;
                len = chunkBuffer.length;
            }

            this.set('Content-Length', len.toString());
        }

        let etag: string | undefined;
        if (generateETag && len !== undefined) {
            etag = etagFn(chunk, encoding);

            if (etag) this.set('ETag', etag);
        }

        if (this.reqFresh()) this.status(304);

        if (this.statusCode === 204 || this.statusCode === 304) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Transfer-Encoding');
            chunk = '';
        }

        if (this.statusCode === 205) {
            this.set('Content-Length', '0');
            this.removeHeader('Transfer-Encoding');
            chunk = '';
        }

        if (req.method === 'HEAD') this.end();
        else this.end(chunk, encoding);

        return this;
    }

    private reqFresh() {
        const method = this.req.method;
        const res = this;
        const status = res.statusCode;

        if ('GET' !== method && 'HEAD' !== method) return false;

        if ((status >= 200 && status < 300) || 304 === status) {
            return fresh(this.req.headers, {
                etag: res.getHeader('ETag'),
                'last-modified': res.getHeader('Last-Modified'),
            });
        }

        return false;
    }

    private setCharset(type: string, charset: string): string {
        if (!/;\s*charset\s*=/.test(type)) {
            return `${type}; charset=${charset}`;
        }
        return type;
    }

    public sendFile(
        path: string,
        options?: send.SendOptions,
        fn?: (err: any) => void,
    ): void {
        if (!this.sended) {
            this.sended = true;
            const stream = send(this.req.httpRequest, path, options);

            stream.on('error', err => {
                if (fn) return fn(err);
                this.res.writeHead(HTTP_STATUS_NOT_FOUND);
                return this.res.end('File not found');
            });

            stream.pipe(this.res);
        }
    }

    public sendStatus(statusCode: number): Response {
        this.statusCode = statusCode;
        this.res.statusCode = statusCode;
        this.res.end(http.STATUS_CODES[statusCode]);
        return this;
    }

    public set(field: string | Object, value?: string): Response {
        this.header(field, value);
        return this;
    }

    public header(field: string | Object, val?: string | string[]): Response {
        if (typeof field === 'object') {
            for (const key in field) {
                this.setHeader(key, field[key] as string);
            }
        } else {
            if (field.toLowerCase() === 'content-type') {
                if (Array.isArray(val))
                    throw new TypeError(
                        'Content-Type cannot be set to an Array',
                    );

                const value = mime.getType(val as string) || val;
                this.setHeader(field, value as string);
            } else if (Array.isArray(val)) {
                this.setHeader(field, val.join(', '));
            } else {
                this.setHeader(field, val as string);
            }
        }

        return this;
    }

    public setHeader(field: string | object, value?: string): Response {
        if (typeof field == 'object') {
            for (const key in field)
                if (!this.headers[key]) this.headers[key] = field[key];
        } else {
            this.headers[field] = value;
        }

        return this;
    }

    public remove(field: string): Response {
        delete this.headers[field];
        return this;
    }

    public removeHeader(field: string): Response {
        this.remove(field);
        return this;
    }

    public status(code: number): Response {
        this.statusCode = code;
        return this;
    }

    public type(type: string): Response {
        const ct =
            type.indexOf('/') === -1
                ? mime.getType(type) || 'application/octet-stream'
                : type;

        return this.set('Content-Type', ct);
    }

    public vary(field: string): Response {
        vary(this.res as http.ServerResponse, field);
        return this;
    }

    public finish() {
        this.res.writeHead(this.statusCode);
        this.res.end(this.buffer.toString());
    }

    /**
     * Normalize `types`, for example "html" becomes "text/html".
     *
     * @param {Array} types
     * @return {Array}
     * @api private
     */
    public normalizeTypes(types: string[]) {
        let ret = [];

        for (let i = 0; i < types.length; ++i)
            ret.push(this.normalizeType(types[i]));

        return ret;
    }

    /**
     * Normalize the given `type`, for example "html" becomes "text/html".
     *
     * @param {String} type
     * @return {Object}
     * @api private
     */
    public normalizeType(type: string) {
        return ~type.indexOf('/')
            ? this.acceptParams(type)
            : {
                  value: mime.getType(type) || 'application/octet-stream',
                  params: {},
              };
    }

    /**
     * Parse accept params `str` returning an
     * object with `.value`, `.quality` and `.params`.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */
    public acceptParams(str: string) {
        const parts = str.split(/ *; */);
        let ret = { value: parts[0], quality: 1, params: {} };

        for (var i = 1; i < parts.length; ++i) {
            const pms = parts[i].split(/ *= */);
            if ('q' === pms[0]) ret.quality = parseFloat(pms[1]);
            else ret.params[pms[0]] = pms[1];
        }

        return ret;
    }

    /**
     * Merge object b with object a.
     *
     *     var a = { foo: 'bar' }
     *       , b = { bar: 'baz' };
     *
     *     merge(a, b);
     *     // => { foo: 'bar', bar: 'baz' }
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object}
     * @api public
     */
    public mergeObject(a, b) {
        if (a && b) {
            for (let key in b) a[key] = b[key];
        }

        return a;
    }

    /**
     * Sign the given `val` with `secret`.
     *
     * @param {String} val
     * @param {String|NodeJS.ArrayBufferView|crypto.KeyObject} secret
     * @return {String}
     * @api private
     */
    public cookieSign(val, secret) {
        if ('string' != typeof val)
            throw new TypeError('Cookie value must be provided as a string.');
        if (null == secret) throw new TypeError('Secret key must be provided.');
        return (
            val +
            '.' +
            crypto
                .createHmac('sha256', secret)
                .update(val)
                .digest('base64')
                .replace(/\=+$/, '')
        );
    }
}
