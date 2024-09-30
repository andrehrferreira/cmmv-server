"use strict";
/*!
 * CMMV Cors
 * Copyright(c) 2013 Troy Goode <troygoode@gmail.com>
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/cors
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = exports.CorsMiddleware = void 0;
exports.default = default_1;
const assign = require("object-assign");
const vary = require("vary");
class CorsMiddleware {
    constructor(options) {
        this.middlewareName = 'cors';
        this.options = {
            origin: options?.origin || '*',
            methods: options?.methods || 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: options?.preflightContinue || false,
            optionsSuccessStatus: options?.optionsSuccessStatus || 204,
            credentials: options?.credentials || false,
            maxAge: options?.maxAge || 0,
            headers: options?.headers,
            exposedHeaders: options?.exposedHeaders,
            allowedHeaders: options?.allowedHeaders
        };
    }
    async process(req, res, next) {
        if (req.app && typeof req.app.addHook == 'function')
            req.app.addHook('onSend', this.onCall.bind(this));
        else
            this.onCall.call(this, req, res, res.body, next);
    }
    async onCall(req, res, payload, done) {
        let headers = [];
        const method = req.method && req.method.toUpperCase && req.method.toUpperCase();
        if (method === 'OPTIONS') {
            headers.push(this.configureOrigin(this.options, req));
            headers.push(this.configureCredentials(this.options));
            headers.push(this.configureMethods(this.options));
            headers.push(this.configureAllowedHeaders(this.options, req));
            headers.push(this.configureMaxAge(this.options));
            headers.push(this.configureExposedHeaders(this.options));
            this.applyHeaders(headers, res);
            if (this.options.preflightContinue) {
                done();
            }
            else {
                // Safari (and potentially other browsers) need content-length 0,
                //   for 204 or they just hang waiting for a body
                res.statusCode = this.options.optionsSuccessStatus;
                res.setHeader('Content-Length', '0');
                res.end();
            }
        }
        else {
            headers.push(this.configureOrigin(this.options, req));
            headers.push(this.configureCredentials(this.options));
            headers.push(this.configureExposedHeaders(this.options));
            this.applyHeaders(headers, res);
            done();
        }
    }
    isString(s) {
        return typeof s === 'string' || s instanceof String;
    }
    isOriginAllowed(origin, allowedOrigin) {
        if (Array.isArray(allowedOrigin)) {
            for (var i = 0; i < allowedOrigin.length; ++i) {
                if (this.isOriginAllowed(origin, allowedOrigin[i]))
                    return true;
            }
            return false;
        }
        else if (this.isString(allowedOrigin)) {
            return origin === allowedOrigin;
        }
        else if (allowedOrigin instanceof RegExp) {
            return allowedOrigin.test(origin);
        }
        else {
            return !!allowedOrigin;
        }
    }
    configureOrigin(options, req) {
        let requestOrigin = req.headers.origin, headers = [], isAllowed;
        if (!options.origin || options.origin === '*') {
            // allow any origin
            headers.push([
                {
                    key: 'Access-Control-Allow-Origin',
                    value: '*',
                },
            ]);
        }
        else if (this.isString(options.origin)) {
            // fixed origin
            headers.push([
                {
                    key: 'Access-Control-Allow-Origin',
                    value: options.origin,
                },
            ]);
            headers.push([
                {
                    key: 'Vary',
                    value: 'Origin',
                },
            ]);
        }
        else {
            isAllowed = this.isOriginAllowed(requestOrigin, options.origin);
            // reflect origin
            headers.push([
                {
                    key: 'Access-Control-Allow-Origin',
                    value: isAllowed ? requestOrigin : false,
                },
            ]);
            headers.push([
                {
                    key: 'Vary',
                    value: 'Origin',
                },
            ]);
        }
        return headers;
    }
    configureMethods(options) {
        var methods = options.methods;
        if (methods.join)
            methods = options.methods.join(','); // .methods is an array, so turn it into a string
        return {
            key: 'Access-Control-Allow-Methods',
            value: methods,
        };
    }
    configureCredentials(options) {
        if (options.credentials === true) {
            return {
                key: 'Access-Control-Allow-Credentials',
                value: 'true',
            };
        }
        return null;
    }
    configureAllowedHeaders(options, req) {
        let allowedHeaders = options.allowedHeaders || options.headers;
        const headers = [];
        if (!allowedHeaders) {
            allowedHeaders = req.headers['access-control-request-headers']; // .headers wasn't specified, so reflect the request headers
            headers.push([
                {
                    key: 'Vary',
                    value: 'Access-Control-Request-Headers',
                },
            ]);
        }
        else if (allowedHeaders.join) {
            allowedHeaders = allowedHeaders.join(','); // .headers is an array, so turn it into a string
        }
        if (allowedHeaders && allowedHeaders.length) {
            headers.push([
                {
                    key: 'Access-Control-Allow-Headers',
                    value: allowedHeaders,
                },
            ]);
        }
        return headers;
    }
    configureExposedHeaders(options) {
        let headers = options.exposedHeaders;
        if (!headers)
            return null;
        else if (headers.join)
            headers = headers.join(','); // .headers is an array, so turn it into a string
        if (headers && headers.length) {
            return {
                key: 'Access-Control-Expose-Headers',
                value: headers,
            };
        }
        return null;
    }
    configureMaxAge(options) {
        const maxAge = (typeof options.maxAge === 'number' || options.maxAge) &&
            options.maxAge.toString();
        if (maxAge && maxAge.length) {
            return {
                key: 'Access-Control-Max-Age',
                value: maxAge,
            };
        }
        return null;
    }
    applyHeaders(headers, res) {
        for (let i = 0, n = headers.length; i < n; i++) {
            let header = headers[i];
            if (header) {
                if (Array.isArray(header))
                    this.applyHeaders(header, res);
                else if (header.key === 'Vary' && header.value)
                    vary(res, header.value);
                else if (header.value)
                    res.setHeader(header.key, header.value);
            }
        }
    }
}
exports.CorsMiddleware = CorsMiddleware;
async function default_1(options) {
    const middleware = new CorsMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
}
const cors = function (options) {
    let middleware = typeof options !== 'function' ?
        new CorsMiddleware(options) : new CorsMiddleware();
    if (typeof options === 'function') {
        let optionsCallback = null;
        const defaults = {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        };
        if (typeof options === 'function') {
            optionsCallback = options;
        }
        else {
            optionsCallback = function (req, cb) {
                cb(null, options);
            };
        }
        return function corsMiddleware(req, res, next) {
            optionsCallback(req, function (err, options) {
                if (err) {
                    next(err);
                }
                else {
                    var corsOptions = assign({}, defaults, options);
                    var originCallback = null;
                    if (corsOptions.origin &&
                        typeof corsOptions.origin === 'function') {
                        originCallback = corsOptions.origin;
                    }
                    else if (corsOptions.origin) {
                        originCallback = function (origin, cb) {
                            cb(null, corsOptions.origin);
                        };
                    }
                    if (originCallback) {
                        originCallback(req.headers.origin, function (err2, origin) {
                            if (err2 || !origin) {
                                next(err2);
                            }
                            else {
                                corsOptions.origin = origin;
                                middleware = new CorsMiddleware(corsOptions);
                                middleware.process(req, res, next);
                            }
                        });
                    }
                    else {
                        next();
                    }
                }
            });
        };
    }
    else
        return (req, res, next) => middleware.process(req, res, next);
};
exports.cors = cors;
