import * as http from 'node:http';
import * as https from 'node:https';
import * as path from 'node:path';
import { EventEmitter } from 'node:events';

import { ServerOptions } from '@cmmv/server-common';

import {
    CM_ERR_HTTP2_INVALID_VERSION,
    CM_ERR_OPTIONS_NOT_OBJ,
    CM_ERR_QSP_NOT_FN,
    CM_ERR_INSTANCE_ALREADY_LISTENING,
    CM_ERR_HOOK_INVALID_HANDLER,
    CM_ERR_HOOK_INVALID_ASYNC_HANDLER,
    CM_ERR_ERROR_HANDLER_NOT_FN,
} from './errors';

import {
    kChildren,
    kErrorHandler,
    kHooks,
    kMiddlewares,
    kRequestPayloadStream,
    kResponseIsError,
    kState,
} from './symbols';

import {
    Hooks,
    hookRunnerApplication,
    onRequestAbortHookRunner,
    onRequestHookRunner,
    preParsingHookRunner,
    supportedHooks,
} from './hooks';

import { buildErrorHandler, rootErrorHandler } from './error-handler';

import { HTTPMethod } from '../constants';
import { Router } from './router';
import request from './request';
import response from './response';
import { handleRequest } from './handle-request';

export class Application extends EventEmitter {
    request: any;

    response: any;

    constructor() {
        super();
        this.request = Object.create(request);
        this.response = Object.create(response);
    }

    private processOptions(options?: ServerOptions) {
        if (typeof options !== 'object') throw new CM_ERR_OPTIONS_NOT_OBJ();

        if (
            options.querystringParser &&
            typeof options.querystringParser !== 'function'
        )
            throw new CM_ERR_QSP_NOT_FN(typeof options.querystringParser);

        options.http2 = Boolean(options.http2 === true);
        options.connectionTimeout = options.connectionTimeout || 0;
        options.keepAliveTimeout = options.keepAliveTimeout || 72000;
        options.maxRequestsPerSocket = options.maxRequestsPerSocket || 0;
        options.requestTimeout = options.requestTimeout || 0;
        options.bodyLimit = options.bodyLimit || 1048576;
        options.maxHeaderSize = options.maxHeaderSize || 16384;
        options.insecureHTTPParser = Boolean(
            options.insecureHTTPParser === true,
        );
        options.joinDuplicateHeaders = Boolean(
            options.joinDuplicateHeaders === true,
        );

        return options;
    }

    private injectApplication(server, options?: ServerOptions) {
        const slice = Array.prototype.slice;
        const flatten = Array.prototype.flat;
        const self = this;

        const app: any = {
            router: new Router(),
            cache: Object.create(null),
            engines: Object.create(null),
            settings: Object.create(null),
            locals: Object.create(null),
            mountpath: '/',
        };

        HTTPMethod.forEach(method => {
            app[method] = ((path?: string, ...callbacks) => {
                if (method === 'get' && callbacks.length === 0)
                    return app.set(path);

                const route = app.router;
                route[method].call(route, path, callbacks);
                return this;
            }).bind(app);
        });

        app.use = function use(fn: any) {
            let offset = 0;
            let path = '/';

            if (fn.constructor.name === 'Promise') {
                return fn
                    .then(init => init.call(this, { app: this }, null, null))
                    .catch(err => {
                        throw new Error(err);
                    });
            }

            if (typeof fn !== 'function') {
                let arg = fn;

                while (Array.isArray(arg) && arg.length !== 0) arg = arg[0];

                if (typeof arg !== 'function') {
                    offset = 1;
                    path = fn;
                }
            } else {
                path = '';
            }

            const fns = flatten.call(slice.call(arguments, offset), Infinity);

            if (fns.length === 0)
                throw new TypeError('app.use() requires a middleware function');

            const router = this.router;

            fns.forEach((fn: any) => {
                if ((!fn || !fn.handle || !fn.set) && path !== '')
                    return router.use(path, fn);

                fn.mountpath = path;
                this[kMiddlewares].push(fn.handle ? fn.handle : fn);
            }, this);

            this.emit('mount');

            return this;
        };

        app.route = function route(method: string, path: string) {
            return this.router.find(method, path);
        };

        /**
         * Assign `setting` to `val`, or return `setting`'s value.
         *
         *    app.set('foo', 'bar');
         *    app.set('foo');
         *    // => "bar"
         *
         * Mounted servers inherit their parent server's settings.
         *
         * @param {String} setting
         * @param {*} [val]
         * @return {Server} for chaining
         * @public
         */
        app.set = function set(setting: string, val: any) {
            if (arguments.length === 1) return this.settings[setting];

            this.settings[setting] = val;

            switch (setting) {
                case 'etag':
                    const { compileETag } = require('../utils');
                    this.set('etag fn', compileETag(val));
                    break;
                case 'query parser':
                    const { compileQueryParser } = require('../utils');
                    this.set('query parser fn', compileQueryParser(val));
                    break;
                case 'trust proxy':
                    const { compileTrust } = require('../utils');
                    this.set('trust proxy fn', compileTrust(val));
                    break;
            }

            return this;
        };

        app.setErrorHandler = function setErrorHandler(func) {
            self.throwIfAlreadyStarted('Cannot call "setErrorHandler"!');

            if (typeof func !== 'function')
                throw new CM_ERR_ERROR_HANDLER_NOT_FN();

            this[kErrorHandler] = buildErrorHandler(
                this[kErrorHandler],
                func.bind(this),
            );
            return this;
        };

        app.addHook = function addHook(name, fn) {
            self.throwIfAlreadyStarted('Cannot call "addHook"!');

            if (fn == null) throw new CM_ERR_HOOK_INVALID_HANDLER(name, fn);

            if (
                name === 'onSend' ||
                name === 'preSerialization' ||
                name === 'onError' ||
                name === 'preParsing'
            ) {
                if (fn.constructor.name === 'AsyncFunction' && fn.length !== 4)
                    throw new CM_ERR_HOOK_INVALID_ASYNC_HANDLER();
            } else if (name === 'onReady' || name === 'onListen') {
                if (fn.constructor.name === 'AsyncFunction' && fn.length !== 0)
                    throw new CM_ERR_HOOK_INVALID_ASYNC_HANDLER();
            } else if (name === 'onRequestAbort') {
                if (fn.constructor.name === 'AsyncFunction' && fn.length !== 1)
                    throw new CM_ERR_HOOK_INVALID_ASYNC_HANDLER();
            } else {
                if (fn.constructor.name === 'AsyncFunction' && fn.length === 3)
                    throw new CM_ERR_HOOK_INVALID_ASYNC_HANDLER();
            }

            if (name === 'onClose') this.onClose(fn.bind(this));
            else this[kHooks].add(name, fn);

            return this;
        };

        for (const method in app) {
            if (!server[method]) server[method] = app[method];
        }

        app.set('etag', 'weak');
        app.set('env', process.env.NODE_ENV || 'dev');
        app.set('query parser', 'simple');
        app.set('subdomain offset', 2);
        app.set('trust proxy', false);
        app.set('jsonp callback name', 'callback');
        app.set('views', path.resolve('views'));

        server.app = app;
        server[kHooks] = new Hooks();
        server[kMiddlewares] = [];
        server[kChildren] = [];
        server[kState] = {};
        server[kErrorHandler] = buildErrorHandler(
            rootErrorHandler,
            function (error, request, res) {
                console.error(error);
                res.status(409).send({ ok: false });
            },
        );
        server.runPreParsing = this.runPreParsing;
        server.request = this.request;
        server.response = this.response;
    }

    public createServerInstance(options?: ServerOptions, httpHandler?) {
        let server = null;

        options = this.processOptions(options || {});

        if (options.serverFactory) {
            server = options.serverFactory(this._handler, options);
        } else if (options.http2) {
            if (options.https)
                server = this.http2().createSecureServer(
                    options.https,
                    (req, res) => this._handler.call(server, req, res),
                );
            else
                server = this.http2().createServer(options, (req, res) =>
                    this._handler.call(server, req, res),
                );
        } else {
            if (options.https)
                server = https.createServer(options.https, (req, res) =>
                    this._handler.call(server, req, res),
                );
            else
                server = http.createServer(options, (req, res) =>
                    this._handler.call(server, req, res),
                );

            server.keepAliveTimeout = options.keepAliveTimeout;
            server.requestTimeout = options.requestTimeout;

            if (options.maxRequestsPerSocket > 0)
                server.maxRequestsPerSocket = options.maxRequestsPerSocket;
        }

        if (!options.serverFactory)
            server.setTimeout(options.connectionTimeout);

        this.injectApplication.call(this, server, options);

        const listen = (listenOptions: { host: string; port: number }) => {
            server[kState].started = true;
            return server.listen.call(server, listenOptions);
        };

        return { server, listen };
    }

    private async _handler(this: any, req, res) {
        this.route(req.method, req.url)
            .then(async route => {
                const request = Object.create(this.request);
                const response = Object.create(this.response);
                response.clear();

                request.app = response.app = this;
                request.req = response.req = req;
                request.res = response.res = res;

                request.server = this;
                request.response = response;
                response.request = request;
                request.originalUrl = req.url;

                request.preParsing = this[kHooks].preParsing;
                request.preHandler = this[kHooks].preHandler;

                response.onSend = this[kHooks].onSend;
                response.onError = this[kHooks].onError;
                response.errorHandler = this[kErrorHandler];

                const middlewares = this[kMiddlewares] || [];
                let stack = [...middlewares, ...route.store.stack].flat();
                request.handler = stack[stack.length - 1];

                if (
                    this[kHooks].onRequest &&
                    this[kHooks].onRequest.length > 0
                ) {
                    onRequestHookRunner(
                        this[kHooks].onRequest,
                        request,
                        response,
                        this.runPreParsing,
                    );
                } else {
                    this.runPreParsing(null, request, response);
                }

                if (
                    this[kHooks].onRequestAbort !== null &&
                    this[kHooks].onRequestAbort.length > 0
                ) {
                    req.on('close', () => {
                        /* istanbul ignore else */
                        if (req.aborted) {
                            onRequestAbortHookRunner(
                                this[kHooks].onRequestAbort,
                                request,
                                this.handleOnRequestAbortHooksErrors.bind(
                                    null,
                                    response,
                                ),
                            );
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err);
                res.writeHead(404);
                res.end('Not Found');
            });
    }

    private http2() {
        try {
            return require('node:http2');
        } catch (err) {
            throw new CM_ERR_HTTP2_INVALID_VERSION();
        }
    }

    public throwIfAlreadyStarted(msg) {
        if (this[kState]?.started)
            throw new CM_ERR_INSTANCE_ALREADY_LISTENING(msg);
    }

    runPreParsing(err, request, response) {
        if (response.sent === true) return;

        if (err != null) {
            response[kResponseIsError] = true;
            response.send(err);
            return;
        }

        request[kRequestPayloadStream] = request.raw;

        if ((request.preParsing !== null, request.preParsing.length > 0)) {
            preParsingHookRunner(
                request.preParsing,
                request,
                response,
                handleRequest.bind(request.server),
            );
        } else {
            handleRequest.call(request.server, null, request, response);
        }
    }

    handleOnRequestAbortHooksErrors(reply, err) {
        if (err) console.error({ err }, 'onRequestAborted hook failed');
    }
}

export default (
    options?: ServerOptions,
    httpHandler?: Function,
): { server; listen } => {
    return new Application().createServerInstance(options, httpHandler);
};
