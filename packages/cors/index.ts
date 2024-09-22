/*!
 * CMMV Cors
 * Copyright(c) 2013 Troy Goode <troygoode@gmail.com>
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/cors
 */

import * as http from 'node:http';
import * as http2 from 'node:http2';

import * as assign from 'object-assign';
import * as vary from 'vary';
import * as bytes from 'bytes';

import {
    ServerMiddleware,
    IRequest,
    IRespose,
    INext,
} from '@cmmv/server-common';

export interface CorsOptions {
    origin?: any;
    methods?: string | string[];
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    credentials?: boolean;
    maxAge?: number;
    express?: boolean;
    headers?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
}

export class CMMVCors extends ServerMiddleware {
    public middlewareName: string = 'cors';

    private options: CorsOptions;

    constructor(options?: CorsOptions) {
        super();

        this.options = {
            origin: options?.origin || '*',
            methods: options?.methods || 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: options?.preflightContinue || false,
            optionsSuccessStatus: options?.optionsSuccessStatus || 204,
            credentials: options?.credentials || false,
            maxAge: options?.maxAge || 0,
            headers: options?.headers,
            exposedHeaders: options?.exposedHeaders,
            allowedHeaders: options?.allowedHeaders,
            express: options?.express === true,
        };
    }

    async process(
        req: IRequest | http.IncomingMessage | http2.Http2ServerRequest,
        res: IRespose | http.ServerResponse | http2.Http2ServerResponse,
        next?: INext,
    ) {
        let reqTest: any =
            req instanceof http.IncomingMessage ||
            req instanceof http2.Http2ServerRequest
                ? req
                : req?.httpRequest;
        let resTest: any =
            res instanceof http.ServerResponse ||
            res instanceof http2.Http2ServerResponse
                ? res
                : res?.httpResponse;

        if (!reqTest) reqTest = req;

        if (!resTest) resTest = res;

        let headers = [];
        const method =
            req.method && req.method.toUpperCase && req.method.toUpperCase();

        if (method === 'OPTIONS') {
            headers.push(this.configureOrigin(this.options, reqTest));
            headers.push(this.configureCredentials(this.options));
            headers.push(this.configureMethods(this.options));
            headers.push(this.configureAllowedHeaders(this.options, reqTest));
            headers.push(this.configureMaxAge(this.options));
            headers.push(this.configureExposedHeaders(this.options));
            this.applyHeaders(headers, resTest);

            if (this.options.preflightContinue) {
                next();
            } else {
                // Safari (and potentially other browsers) need content-length 0,
                //   for 204 or they just hang waiting for a body
                resTest.statusCode = this.options.optionsSuccessStatus;
                resTest.setHeader('Content-Length', '0');
                (resTest as http.ServerResponse).end();
            }
        } else {
            headers.push(this.configureOrigin(this.options, reqTest));
            headers.push(this.configureCredentials(this.options));
            headers.push(this.configureExposedHeaders(this.options));
            this.applyHeaders(headers, resTest);

            next();
        }
    }

    isString(s) {
        return typeof s === 'string' || s instanceof String;
    }

    isOriginAllowed(origin, allowedOrigin) {
        if (Array.isArray(allowedOrigin)) {
            for (var i = 0; i < allowedOrigin.length; ++i) {
                if (this.isOriginAllowed(origin, allowedOrigin[i])) return true;
            }

            return false;
        } else if (this.isString(allowedOrigin)) {
            return origin === allowedOrigin;
        } else if (allowedOrigin instanceof RegExp) {
            return allowedOrigin.test(origin);
        } else {
            return !!allowedOrigin;
        }
    }

    configureOrigin(options, req) {
        let requestOrigin = req.headers.origin,
            headers = [],
            isAllowed;

        if (!options.origin || options.origin === '*') {
            // allow any origin
            headers.push([
                {
                    key: 'Access-Control-Allow-Origin',
                    value: '*',
                },
            ]);
        } else if (this.isString(options.origin)) {
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
        } else {
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

        if (methods.join) methods = options.methods.join(','); // .methods is an array, so turn it into a string

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
        } else if (allowedHeaders.join) {
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

        if (!headers) return null;
        else if (headers.join) headers = headers.join(','); // .headers is an array, so turn it into a string

        if (headers && headers.length) {
            return {
                key: 'Access-Control-Expose-Headers',
                value: headers,
            };
        }

        return null;
    }

    configureMaxAge(options) {
        const maxAge =
            (typeof options.maxAge === 'number' || options.maxAge) &&
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
                if (Array.isArray(header)) this.applyHeaders(header, res);
                else if (header.key === 'Vary' && header.value)
                    vary(res, header.value);
                else if (header.value) res.setHeader(header.key, header.value);
            }
        }
    }
}

export default function (options?: CorsOptions | Function) {
    let middleware;

    middleware =
        typeof options !== 'function' ? new CMMVCors(options) : new CMMVCors();

    if (typeof options === 'function' || options?.express === true) {
        let optionsCallback = null;

        const defaults = {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        };

        if (typeof options === 'function') {
            optionsCallback = options;
        } else {
            optionsCallback = function (req, cb) {
                cb(null, options);
            };
        }

        return function corsMiddleware(req, res, next) {
            optionsCallback(req, function (err, options) {
                if (err) {
                    next(err);
                } else {
                    var corsOptions = assign({}, defaults, options);
                    var originCallback = null;

                    if (
                        corsOptions.origin &&
                        typeof corsOptions.origin === 'function'
                    ) {
                        originCallback = corsOptions.origin;
                    } else if (corsOptions.origin) {
                        originCallback = function (origin, cb) {
                            cb(null, corsOptions.origin);
                        };
                    }

                    if (originCallback) {
                        originCallback(
                            req.headers.origin,
                            function (err2, origin) {
                                if (err2 || !origin) {
                                    next(err2);
                                } else {
                                    corsOptions.origin = origin;
                                    middleware = new CMMVCors(corsOptions);
                                    middleware.process(req, res, next);
                                }
                            },
                        );
                    } else {
                        next();
                    }
                }
            });
        };
    } else return middleware;
}
