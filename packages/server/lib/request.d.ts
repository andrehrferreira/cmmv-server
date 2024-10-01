declare const _default: {
    app: any;
    req: any;
    res: any;
    originalUrl: any;
    memoizedURL: any;
    /**
     * Parse the query string of `req.url`.
     *
     * This uses the "query parser" setting to parse the raw
     * string into an object.
     *
     * @return {String}
     * @api public
     */
    readonly query: number;
    /**
     * Get query string.
     *
     * @return {String}
     * @api public
     */
    readonly querystring: any;
    /**
     * Get the search string. Same as the query string
     * except it includes the leading ?.
     *
     * @return {String}
     * @api public
     */
    readonly search: string;
    /**
     * Return the request socket.
     *
     * @return {Connection}
     * @api public
     */
    readonly socket: any;
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
    readonly protocol: string;
    /**
     * Return request header, alias as request.header
     *
     * @return {Object}
     * @api public
     */
    readonly headers: any;
    /**
     * Get request URL.
     *
     * @return {String}
     * @api public
     */
    readonly url: any;
    /**
     * Get origin of URL.
     *
     * @return {String}
     * @api public
     */
    readonly origin: string;
    /**
     * Get full request URL.
     *
     * @return {String}
     * @api public
     */
    readonly href: any;
    /**
     * Short-hand for:
     *
     *    req.protocol === 'https'
     *
     * @return {Boolean}
     * @public
     */
    readonly secure: boolean;
    /**
     * Get request method.
     *
     * @return {String}
     * @api public
     */
    readonly method: any;
    /**
     * Get request pathname.
     *
     * @return {String}
     * @api public
     */
    readonly path: any;
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
    readonly host: string;
    /**
     * Parse the "Host" header field hostname
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     *
     * @return {String} hostname
     * @api public
     */
    readonly hostname: any;
    /**
     * Get WHATWG parsed URL.
     * Lazily memoized.
     *
     * @return {URL|Object}
     * @api public
     */
    readonly URL: any;
    /**
     * Check if the request is fresh, aka
     * Last-Modified and/or the ETag
     * still match.
     *
     * @return {Boolean}
     * @api public
     */
    readonly fresh: boolean;
    /**
     * Check if the request is stale, aka
     * "Last-Modified" and / or the "ETag" for the
     * resource has changed.
     *
     * @return {Boolean}
     * @api public
     */
    readonly stale: boolean;
    /**
     * Check if the request is idempotent.
     *
     * @return {Boolean}
     * @api public
     */
    readonly idempotent: boolean;
    /**
     * Return the remote address from the trusted proxy.
     *
     * The is the remote address on the socket unless
     * "trust proxy" is set.
     *
     * @return {String}
     * @public
     */
    readonly ip: boolean;
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
    readonly ips: boolean;
    /**
     * Return parsed Content-Length when present.
     *
     * @return {Number|void}
     * @api public
     */
    _length: any;
    length: number;
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
    readonly subdomains: string[];
    /**
     * Check if the request was an _XMLHttpRequest_.
     *
     * @return {Boolean}
     * @public
     */
    readonly xhr: boolean;
    /**
     * Cookies
     */
    _cookies: any;
    cookies: any;
    _signedCookies: any;
    signedCookies: any;
    /**
     * Return request header.
     *
     * The `Referrer` header field is special-cased,
     * both `Referrer` and `Referer` are interchangeable.
     *
     * Examples:
     *
     *     this.get('Content-Type');
     *     // => "text/plain"
     *
     *     this.get('content-type');
     *     // => "text/plain"
     *
     *     this.get('Something');
     *     // => ''
     *
     * @param {String} field
     * @return {String}
     * @api public
     */
    header(name: any): string;
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
    get(name: any): string;
    /**
     * Get accept object.
     * Lazily memoized.
     *
     * @return {Object}
     * @api private
     */
    _accept: any;
    readonly accept: any;
    /**
     * Return the request mime type void of
     * parameters such as "charset".
     *
     * @return {String}
     * @api public
     */
    readonly type: string;
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
    accepts(...args: any[]): any;
    /**
     * Check if the given `encoding`s are accepted.
     *
     * @param {String} ...encoding
     * @return {String|Array}
     * @public
     */
    acceptsEncodings(...args: any[]): any;
    /**
     * Check if the given `charset`s are acceptable,
     * otherwise you should respond with 406 "Not Acceptable".
     *
     * @param {String} ...charset
     * @return {String|Array}
     * @public
     */
    acceptsCharsets(...args: any[]): any;
    /**
     * Check if the given `lang`s are acceptable,
     * otherwise you should respond with 406 "Not Acceptable".
     *
     * @param {String} ...lang
     * @return {String|Array}
     * @public
     */
    acceptsLanguages(...args: any[]): any;
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
    range(size: any, options: any): any;
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
    is(...types: any): any;
};
export default _default;
