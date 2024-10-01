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
import { kResponseIsError, kResponseTrailers, kResponseIsRunningOnErrorHook, kResponseSerializer, kResponseErrorHandlerCalled, kResponseHeaders, kResponseHasStatusCode, kResponseStartTime, kResponseHijacked } from './symbols';
export declare const setupResponseListeners: (res: any) => void;
export declare const wrapThenable: (thenable: any, res: any, store?: any) => void;
declare const _default: {
    app: any;
    req: any;
    res: any;
    request: any;
    _body: any;
    locals: any;
    [kResponseSerializer]: any;
    [kResponseErrorHandlerCalled]: boolean;
    [kResponseHijacked]: boolean;
    [kResponseIsError]: boolean;
    [kResponseIsRunningOnErrorHook]: boolean;
    [kResponseHeaders]: {};
    [kResponseTrailers]: any;
    [kResponseHasStatusCode]: boolean;
    [kResponseStartTime]: any;
    /**
     * Return the request socket.
     *
     * @return {Connection}
     * @api public
     */
    readonly socket: any;
    /**
     * Get response status code.
     *
     * @return {Number}
     * @api public
     */
    status: any;
    readonly statusCode: any;
    readonly now: number;
    readonly elapsedTime: number;
    readonly sent: boolean;
    /**
     * Get response status message
     *
     * @return {String}
     * @api public
     */
    message: any;
    readonly statusMessage: any;
    /**
     * Get response body.
     *
     * @return {Mixed}
     * @api public
     */
    body: any;
    /**
     * Set Content-Length field to `n`.
     *
     * @param {Number} n
     * @api public
     */
    length: number;
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
    lastModified: Date;
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
    has(field: any): any;
    /**
     * Remove header `field`.
     *
     * @param {String} field
     * @api public
     */
    remove(field: any): void;
    /**
     * Checks if the request is writable.
     * Tests for the existence of the socket
     * as node sometimes does not set it.
     *
     * @return {Boolean}
     * @api private
     */
    readonly writable: any;
    /**
     * HTTP Compatibility
     */
    readonly headerSent: any;
    readonly headersSent: any;
    readonly sendDate: any;
    readonly strictContentLength: any;
    readonly writableEnded: any;
    readonly writableFinished: any;
    hijack(): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
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
    code(code: number): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
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
    links(links: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
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
    header(field: any, val: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    setHeader(field: any, val: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    set(field: any, val: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    /**
     * Get value for header `field`.
     *
     * @param {String} field
     * @return {String}
     * @public
     */
    getHeader(field: any): any;
    get(field: string): any;
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
    type(type: string): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    contentType(type: string): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
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
    sendStatus(statusCode: number): void;
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
    send(payload: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    json(obj: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    jsonp(obj: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
    sendFile(path: any, options: any, callback: any): void;
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
    download(path: any, filename: any, options: any, callback: any): void;
    end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    format(obj: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    /**
     * Add `field` to Vary. If already present in the Vary set, then
     * this call is simply ignored.
     *
     * @param {Array|String} field
     * @return {ServerResponse} for chaining
     * @public
     */
    vary(field: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    /**
     * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
     *
     * @param {String} filename
     * @return {ServerResponse}
     * @public
     */
    attachment(filename: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    append(field: any, val: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    location(url: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    redirect(url: any, alt?: any): void;
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
    clearCookie(name: any, options: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    cookie(name: any, value: any, options: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
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
    render(view: any, options: any, callback: any): void;
    /**
     * Trailers
     */
    trailer(key: string, fn: Function): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    hasTrailer(key: string): boolean;
    removeTrailer(key: string): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    /**
     * Serialize
     */
    getSerializationFunction(schemaOrStatus: any, contentType: any): any;
    serialize(payload: any): any;
    /**
     * HTTP Expose
     */
    flushHeaders(): void;
    getHeaderNames(): string[];
    getHeaders(): Object;
    hasHeader(name: string): boolean;
    removeHeader(name: string): void;
    setTimeout(msecs: number, cb?: Function): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
    uncork(): void;
    writeEarlyHints(hints: any, callback: any): {
        app: any;
        req: any;
        res: any;
        request: any;
        _body: any;
        locals: any;
        [kResponseSerializer]: any;
        [kResponseErrorHandlerCalled]: boolean;
        [kResponseHijacked]: boolean;
        [kResponseIsError]: boolean;
        [kResponseIsRunningOnErrorHook]: boolean;
        [kResponseHeaders]: {};
        [kResponseTrailers]: any;
        [kResponseHasStatusCode]: boolean;
        [kResponseStartTime]: any;
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        readonly socket: any;
        /**
         * Get response status code.
         *
         * @return {Number}
         * @api public
         */
        status: any;
        readonly statusCode: any;
        readonly now: number;
        readonly elapsedTime: number;
        readonly sent: boolean;
        /**
         * Get response status message
         *
         * @return {String}
         * @api public
         */
        message: any;
        readonly statusMessage: any;
        /**
         * Get response body.
         *
         * @return {Mixed}
         * @api public
         */
        body: any;
        /**
         * Set Content-Length field to `n`.
         *
         * @param {Number} n
         * @api public
         */
        length: number;
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
        lastModified: Date;
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
        has(field: any): any;
        /**
         * Remove header `field`.
         *
         * @param {String} field
         * @api public
         */
        remove(field: any): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         *
         * @return {Boolean}
         * @api private
         */
        readonly writable: any;
        /**
         * HTTP Compatibility
         */
        readonly headerSent: any;
        readonly headersSent: any;
        readonly sendDate: any;
        readonly strictContentLength: any;
        readonly writableEnded: any;
        readonly writableFinished: any;
        hijack(): any;
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
        code(code: number): any;
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
        links(links: any): any;
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
        header(field: any, val: any): any;
        setHeader(field: any, val: any): any;
        set(field: any, val: any): any;
        /**
         * Get value for header `field`.
         *
         * @param {String} field
         * @return {String}
         * @public
         */
        getHeader(field: any): any;
        get(field: string): any;
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
        type(type: string): any;
        contentType(type: string): any;
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
        sendStatus(statusCode: number): void;
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
        send(payload: any): any;
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
        json(obj: any): any;
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
        jsonp(obj: any): any;
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
        stringify(value: any, replacer: any, spaces: any, escape: any): string;
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
        sendFile(path: any, options: any, callback: any): void;
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
        download(path: any, filename: any, options: any, callback: any): void;
        end(payload: string | Buffer | Uint8Array, encoding?: string, cb?: Function): any;
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
        format(obj: any): any;
        /**
         * Add `field` to Vary. If already present in the Vary set, then
         * this call is simply ignored.
         *
         * @param {Array|String} field
         * @return {ServerResponse} for chaining
         * @public
         */
        vary(field: any): any;
        /**
         * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
         *
         * @param {String} filename
         * @return {ServerResponse}
         * @public
         */
        attachment(filename: any): any;
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
        append(field: any, val: any): any;
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
        location(url: any): any;
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
        redirect(url: any, alt?: any): void;
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
        clearCookie(name: any, options: any): any;
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
        cookie(name: any, value: any, options: any): any;
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
        render(view: any, options: any, callback: any): void;
        /**
         * Trailers
         */
        trailer(key: string, fn: Function): any;
        hasTrailer(key: string): boolean;
        removeTrailer(key: string): any;
        /**
         * Serialize
         */
        getSerializationFunction(schemaOrStatus: any, contentType: any): any;
        serialize(payload: any): any;
        /**
         * HTTP Expose
         */
        flushHeaders(): void;
        getHeaderNames(): string[];
        getHeaders(): Object;
        hasHeader(name: string): boolean;
        removeHeader(name: string): void;
        setTimeout(msecs: number, cb?: Function): any;
        uncork(): void;
        writeEarlyHints(hints: any, callback: any): any;
    };
};
export default _default;
