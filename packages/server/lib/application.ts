import * as http from 'node:http';
import * as https from 'node:https';
import * as path from 'node:path';
import { EventEmitter } from 'node:events';

import { ServerOptions } from '@cmmv/server-common';

import {
    CM_ERR_HTTP2_INVALID_VERSION,
    CM_ERR_OPTIONS_NOT_OBJ,
    CM_ERR_QSP_NOT_FN,
} from './errors';

import { kChildren, kHooks, kMiddlewares } from './symbols';

import { Hooks, hookRunnerApplication, supportedHooks } from './hooks';

import { HTTPMethod } from '../constants';
import { Router } from './router';
import { buildRequest } from './request';
import { buildResponse } from './response';

export class Application extends EventEmitter {
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

            if (typeof fn !== 'function') {
                let arg = fn;

                while (Array.isArray(arg) && arg.length !== 0) arg = arg[0];

                if (typeof arg !== 'function') {
                    offset = 1;
                    path = fn;
                }
            }

            const fns = flatten.call(slice.call(arguments, offset), Infinity);

            if (fns.length === 0)
                throw new TypeError('app.use() requires a middleware function');

            const router = this.router;

            fns.forEach((fn: any) => {
                if (!fn || !fn.handle || !fn.set) return router.use(path, fn);

                fn.mountpath = path;
                fn.parent = this;
                router.use(path, fn.handle);
                fn.emit('mount', this);
            }, this);

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
            return server.listen.call(server, listenOptions);
        };

        return { server, listen };
    }

    private _handler(this: any, req, res) {
        const route = this.route(req.method, req.url);

        if (route) {
            const request = buildRequest(
                this.app,
                req,
                res,
                route.parms,
                route.searchParams,
            );
            const response = buildResponse(this.app, request, res);
            const middlewares = this[kMiddlewares] || [];
            let stack = [...middlewares, ...route.store.stack].flat();

            while (stack.length > 0) {
                stack[0].call(this, request, response);
                stack.shift();
            }
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    }

    private http2() {
        try {
            return require('node:http2');
        } catch (err) {
            throw new CM_ERR_HTTP2_INVALID_VERSION();
        }
    }
}

export default (
    options?: ServerOptions,
    httpHandler?: Function,
): { server; listen } => {
    return new Application().createServerInstance(options, httpHandler);
};
