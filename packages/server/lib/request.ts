/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/express/blob/master/lib/request.js
 */

import * as http from 'node:http';
import * as http2 from 'node:http2';
import { isIP } from 'node:net';

import * as proxyaddr from 'proxy-addr';

export type Request = (http.IncomingMessage | http2.Http2ServerRequest) & {
    app?: any;
    props?: any;
    prototype?: any;
    body?: {} | undefined;
    params?: {} | undefined;
    query?: {} | undefined;
    get(name: string);
    header(name: string);
    accepts();
    acceptsEncodings();
    acceptsCharsets();
    acceptsLanguages();
    range(size, options);
    is(types: string | string[]);
};

export const buildRequest = (
    app,
    R: Request,
    res: Response,
    params: {},
    query: {},
) => {
    R.app = app;
    R.body = undefined;
    R.params = params;
    R.query = query;

    /**
     * Parse the query string of `req.url`.
     *
     * This uses the "query parser" setting to parse the raw
     * string into an object.
     *
     * @return {String}
     * @api public
     */
    Object.defineProperty(R, 'query', {
        configurable: true,
        enumerable: true,
        get(): number {
            const { parseurl } = require('../utils');
            var queryparse = app.get('query parser fn');

            if (!queryparse) return Object.create(null);

            var querystring = parseurl(this).query;

            return queryparse(querystring);
        },
    });

    /**
     * Return the protocol string "http" or "https"
     * when requested with TLS. When the "trust proxy"
     * setting trusts the socket address, the
     * "X-Forwarded-Proto" header field will be trusted
     * and used if present.
     *
     * If you're running behind a reverse proxy that
     * supplies https for you this may be enabled.
     *
     * @return {String}
     * @public
     */
    Object.defineProperty(R, 'protocol', {
        configurable: true,
        enumerable: true,
        get(): string {
            const proto = this.connection.encrypted ? 'https' : 'http';
            const trust = app.get('trust proxy fn');

            if (!trust(this.connection.remoteAddress, 0)) return proto;

            const header = this.get('X-Forwarded-Proto') || proto;
            const index = header.indexOf(',');

            return index !== -1
                ? header.substring(0, index).trim()
                : header.trim();
        },
    });

    /**
     * Short-hand for:
     *
     *    req.protocol === 'https'
     *
     * @return {Boolean}
     * @public
     */
    Object.defineProperty(R, 'secure', {
        configurable: true,
        enumerable: true,
        get(): boolean {
            return this.protocol === 'https';
        },
    });

    /**
     * Return the remote address from the trusted proxy.
     *
     * The is the remote address on the socket unless
     * "trust proxy" is set.
     *
     * @return {String}
     * @public
     */
    Object.defineProperty(R, 'ip', {
        configurable: true,
        enumerable: true,
        get(): boolean {
            const trust = app.get('trust proxy fn');
            return proxyaddr(this, trust);
        },
    });

    /**
     * When "trust proxy" is set, trusted proxy addresses + client.
     *
     * For example if the value were "client, proxy1, proxy2"
     * you would receive the array `["client", "proxy1", "proxy2"]`
     * where "proxy2" is the furthest down-stream and "proxy1" and
     * "proxy2" were trusted.
     *
     * @return {Array}
     * @public
     */
    Object.defineProperty(R, 'ips', {
        configurable: true,
        enumerable: true,
        get(): boolean {
            const trust = app.get('trust proxy fn');
            const addrs = proxyaddr.all(this, trust);
            addrs.reverse().pop();
            return addrs;
        },
    });

    /**
     * Return subdomains as an array.
     *
     * Subdomains are the dot-separated parts of the host before the main domain of
     * the app. By default, the domain of the app is assumed to be the last two
     * parts of the host. This can be changed by setting "subdomain offset".
     *
     * For example, if the domain is "tobi.ferrets.example.com":
     * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
     * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
     *
     * @return {Array}
     * @public
     */
    Object.defineProperty(R, 'subdomains', {
        configurable: true,
        enumerable: true,
        get(): string[] {
            const hostname = this.hostname;
            if (!hostname) return [];

            var offset = app.get('subdomain offset');
            var subdomains = !isIP(hostname)
                ? hostname.split('.').reverse()
                : [hostname];

            return subdomains.slice(offset);
        },
    });

    /**
     * Short-hand for `url.parse(req.url).pathname`.
     *
     * @return {String}
     * @public
     */
    Object.defineProperty(R, 'path', {
        configurable: true,
        enumerable: true,
        get(): string {
            const { parseurl } = require('../utils');
            return parseurl(this).pathname;
        },
    });

    /**
     * Parse the "Host" header field to a host.
     *
     * When the "trust proxy" setting trusts the socket
     * address, the "X-Forwarded-Host" header field will
     * be trusted.
     *
     * @return {String}
     * @public
     */
    Object.defineProperty(R, 'host', {
        configurable: true,
        enumerable: true,
        get(): string {
            const trust = app.get('trust proxy fn');
            let val = this.get('X-Forwarded-Host');

            if (!val || !trust(this.connection.remoteAddress, 0))
                val = this.get('Host');
            else if (val.indexOf(',') !== -1)
                val = val.substring(0, val.indexOf(',')).trimRight();

            return val || undefined;
        },
    });

    /**
     * Parse the "Host" header field to a hostname.
     *
     * When the "trust proxy" setting trusts the socket
     * address, the "X-Forwarded-Host" header field will
     * be trusted.
     *
     * @return {String}
     * @api public
     */
    Object.defineProperty(R, 'hostname', {
        configurable: true,
        enumerable: true,
        get(): string {
            const host = this.host;

            if (!host) return;

            const offset = host[0] === '[' ? host.indexOf(']') + 1 : 0;
            const index = host.indexOf(':', offset);

            return index !== -1 ? host.substring(0, index) : host;
        },
    });

    /**
     * Check if the request is fresh, aka
     * Last-Modified or the ETag
     * still match.
     *
     * @return {Boolean}
     * @public
     */
    Object.defineProperty(R, 'fresh', {
        configurable: true,
        enumerable: true,
        get(): boolean {
            const { fresh } = require('../utils');
            const method = this.method;
            const res = this.res;
            const status = res.statusCode;

            if ('GET' !== method && 'HEAD' !== method) return false;

            if ((status >= 200 && status < 300) || 304 === status) {
                return fresh(this.headers, {
                    etag: res.get('ETag'),
                    'last-modified': res.get('Last-Modified'),
                });
            }

            return false;
        },
    });

    /**
     * Check if the request is stale, aka
     * "Last-Modified" and / or the "ETag" for the
     * resource has changed.
     *
     * @return {Boolean}
     * @public
     */
    Object.defineProperty(R, 'stale', {
        configurable: true,
        enumerable: true,
        get(): boolean {
            return !this.fresh;
        },
    });

    /**
     * Check if the request was an _XMLHttpRequest_.
     *
     * @return {Boolean}
     * @public
     */
    Object.defineProperty(R, 'xhr', {
        configurable: true,
        enumerable: true,
        get(): boolean {
            const val = this.get('X-Requested-With') || '';
            return val.toLowerCase() === 'xmlhttprequest';
        },
    });

    /**
     * Return request header.
     *
     * The `Referrer` header field is special-cased,
     * both `Referrer` and `Referer` are interchangeable.
     *
     * Examples:
     *
     *     req.get('Content-Type');
     *     // => "text/plain"
     *
     *     req.get('content-type');
     *     // => "text/plain"
     *
     *     req.get('Something');
     *     // => undefined
     *
     * Aliased as `req.header()`.
     *
     * @param {String} name
     * @return {String}
     * @public
     */
    R.get = R.header = function header(name) {
        if (!name) throw new TypeError('name argument is required to req.get');

        if (typeof name !== 'string')
            throw new TypeError('name must be a string to req.get');

        var lc = name.toLowerCase();

        switch (lc) {
            case 'referer':
            case 'referrer':
                return this.headers.referrer || this.headers.referer;
            default:
                return this.headers[lc];
        }
    };

    /**
     * To do: update docs.
     *
     * Check if the given `type(s)` is acceptable, returning
     * the best match when true, otherwise `undefined`, in which
     * case you should respond with 406 "Not Acceptable".
     *
     * The `type` value may be a single MIME type string
     * such as "application/json", an extension name
     * such as "json", a comma-delimited list such as "json, html, text/plain",
     * an argument list such as `"json", "html", "text/plain"`,
     * or an array `["json", "html", "text/plain"]`. When a list
     * or array is given, the _best_ match, if any is returned.
     *
     * Examples:
     *
     *     // Accept: text/html
     *     req.accepts('html');
     *     // => "html"
     *
     *     // Accept: text/*, application/json
     *     req.accepts('html');
     *     // => "html"
     *     req.accepts('text/html');
     *     // => "text/html"
     *     req.accepts('json, text');
     *     // => "json"
     *     req.accepts('application/json');
     *     // => "application/json"
     *
     *     // Accept: text/*, application/json
     *     req.accepts('image/png');
     *     req.accepts('png');
     *     // => undefined
     *
     *     // Accept: text/*;q=.5, application/json
     *     req.accepts(['html', 'json']);
     *     req.accepts('html', 'json');
     *     req.accepts('html, json');
     *     // => "json"
     *
     * @param {String|Array} type(s)
     * @return {String|Array|Boolean}
     * @public
     */
    R.accepts = function () {
        var accept = require('accepts')(this);
        return accept.types.apply(accept, arguments);
    };

    /**
     * Check if the given `encoding`s are accepted.
     *
     * @param {String} ...encoding
     * @return {String|Array}
     * @public
     */
    R.acceptsEncodings = function () {
        var accept = require('accepts')(this);
        return accept.encodings.apply(accept, arguments);
    };

    /**
     * Check if the given `charset`s are acceptable,
     * otherwise you should respond with 406 "Not Acceptable".
     *
     * @param {String} ...charset
     * @return {String|Array}
     * @public
     */
    R.acceptsCharsets = function () {
        var accept = require('accepts')(this);
        return accept.charsets.apply(accept, arguments);
    };

    /**
     * Check if the given `lang`s are acceptable,
     * otherwise you should respond with 406 "Not Acceptable".
     *
     * @param {String} ...lang
     * @return {String|Array}
     * @public
     */
    R.acceptsLanguages = function () {
        var accept = require('accepts')(this);
        return accept.languages.apply(accept, arguments);
    };

    /**
     * Parse Range header field, capping to the given `size`.
     *
     * Unspecified ranges such as "0-" require knowledge of your resource length. In
     * the case of a byte range this is of course the total number of bytes. If the
     * Range header field is not given `undefined` is returned, `-1` when unsatisfiable,
     * and `-2` when syntactically invalid.
     *
     * When ranges are returned, the array has a "type" property which is the type of
     * range that is required (most commonly, "bytes"). Each array element is an object
     * with a "start" and "end" property for the portion of the range.
     *
     * The "combine" option can be set to `true` and overlapping & adjacent ranges
     * will be combined into a single range.
     *
     * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
     * should respond with 4 users when available, not 3.
     *
     * @param {number} size
     * @param {object} [options]
     * @param {boolean} [options.combine=false]
     * @return {number|array}
     * @public
     */
    R.range = function range(size, options) {
        const { parseRange } = require('../utils');
        const range = this.get('Range');
        if (!range) return;
        return parseRange(size, range, options);
    };

    /**
     * Check if the incoming request contains the "Content-Type"
     * header field, and it contains the given mime `type`.
     *
     * Examples:
     *
     *      // With Content-Type: text/html; charset=utf-8
     *      req.is('html');
     *      req.is('text/html');
     *      req.is('text/*');
     *      // => true
     *
     *      // When Content-Type is application/json
     *      req.is('json');
     *      req.is('application/json');
     *      req.is('application/*');
     *      // => true
     *
     *      req.is('html');
     *      // => false
     *
     * @param {String|Array} types...
     * @return {String|false|null}
     * @public
     */
    R.is = function is(...types: any) {
        const typeis = require('typeis');
        let arr = types;

        if (!Array.isArray(types)) {
            arr = new Array(types.length);

            for (let i = 0; i < arr.length; i++) arr[i] = types[i];
        }

        return typeis(this, arr);
    };

    return R;
};
