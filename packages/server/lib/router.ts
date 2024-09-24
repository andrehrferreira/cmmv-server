import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse, constants } from 'http2';

import * as FindMyWay from 'find-my-way';
import { flatten } from 'array-flatten';

import { Request } from './request';
import { Response } from './response';
import { ServerApplication } from './application';

const mixin = require('merge-descriptors');

const reqExpress = require('./req.express');
const resExpress = require('./res.express');

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = constants;

export class Router {
    public router: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;
    public registeredRoutes: {
        method: FindMyWay.HTTPMethod;
        path: string;
        options: any;
    }[] = [];
    public params: Map<string, Function[]> = new Map<string, Function[]>();

    public stack: Map<FindMyWay.HTTPMethod, Array<Function>> = new Map<
        FindMyWay.HTTPMethod,
        Array<Function>
    >();

    public optionsAllow: Map<string, Set<string>> = new Map<
        string,
        Set<string>
    >();
    public wildcard: Array<Function> = new Array<Function>();
    public parent: Router;
    private allBind = false;

    constructor(private path: string = '') {
        if (!this.router) {
            this.router = FindMyWay({
                caseSensitive: false,
                ignoreTrailingSlash: true,
                ignoreDuplicateSlashes: true,
                allowUnsafeRegex: true,
            });

            this.stack = new Map<FindMyWay.HTTPMethod, Array<Function>>();
        }
    }

    public param(valueOrObject: string | string[], cb) {
        //compatibility Expressjs
        if (
            typeof valueOrObject === 'string' &&
            !this.params.has(valueOrObject)
        )
            this.params.set(valueOrObject, []);

        if (typeof valueOrObject === 'string') {
            const stack = this.params.get(valueOrObject);
            stack.push(cb);
            this.params.set(valueOrObject, stack);
        } else if (Array.isArray(valueOrObject)) {
            valueOrObject.forEach(item => {
                if (typeof item === 'string' && !this.params.has(item))
                    this.params.set(item, []);

                const stack = this.params.get(item);
                stack.push(cb);
                this.params.set(item, stack);
            });
        }
    }

    public isHttp2Request(
        req: IncomingMessage | Http2ServerRequest,
    ): req is Http2ServerRequest {
        return (req as Http2ServerRequest).stream !== undefined;
    }

    public all(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.allBind = true;
        this.acl(path, ...callbacks);
        this.bind(path, ...callbacks);
        this.connect(path, ...callbacks);
        this.link(path, ...callbacks);
        this.get(path, ...callbacks);
        this.post(path, ...callbacks);
        this.put(path, ...callbacks);
        this.delete(path, ...callbacks);
        this.patch(path, ...callbacks);
        this.checkout(path, ...callbacks);
        this.copy(path, ...callbacks);
        this.lock(path, ...callbacks);
        this.merge(path, ...callbacks);
        this.mkactivity(path, ...callbacks);
        this.mkcalendar(path, ...callbacks);
        this.mkcol(path, ...callbacks);
        this.move(path, ...callbacks);
        this['m-search'](path, ...callbacks);
        this.notify(path, ...callbacks);
        this.options(path, ...callbacks);
        this.propfind(path, ...callbacks);
        this.proppatch(path, ...callbacks);
        this.purge(path, ...callbacks);
        this.rebind(path, ...callbacks);
        this.report(path, ...callbacks);
        this.source(path, ...callbacks);
        this.search(path, ...callbacks);
        this.subscribe(path, ...callbacks);
        this.trace(path, ...callbacks);
        this.unbind(path, ...callbacks);
        this.unlink(path, ...callbacks);
        this.unlock(path, ...callbacks);
        this.unsubscribe(path, ...callbacks);
        this.allBind = false;

        this.wildcard = [...this.wildcard, ...callbacks];

        if (typeof path === 'function') this.wildcard.push(path);

        return this;
    }

    private mergeRoutes(
        method: FindMyWay.HTTPMethod,
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (typeof path !== 'function') {
            const finalPath = this.path ? this.path + path : path;

            if (typeof finalPath === 'string') {
                if (!this.optionsAllow.has(finalPath))
                    this.optionsAllow.set(finalPath, new Set<string>());

                if (!this.router.hasRoute(method, finalPath)) {
                    this.router.on(method, finalPath, (req, res) => {}, {
                        callbacks,
                    });
                    this.registeredRoutes.push({
                        method,
                        path: finalPath,
                        options: { callbacks },
                    });
                } else {
                    const handler = this.router.find(method, finalPath);
                    this.router.off(method, finalPath);
                    this.router.on(method, finalPath, (req, res) => {}, {
                        callbacks: [...handler.store.callbacks, ...callbacks],
                    });
                }

                if (method !== 'OPTIONS' && !this.allBind) {
                    const optionsAllow = this.optionsAllow.get(finalPath);
                    optionsAllow.add(method);
                    this.optionsAllow.set(finalPath, optionsAllow);
                }
            }
        } else {
            const stack = this.stack.has(method) ? this.stack.get(method) : [];
            stack.push(path);
            this.stack.set(method, stack);
        }
    }

    public acl(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('ACL', path, ...callbacks);
    }

    public bind(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('BIND', path, ...callbacks);
    }

    public connect(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('CONNECT', path, ...callbacks);
    }

    public link(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('LINK', path, ...callbacks);
    }

    public get(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('GET', path, ...callbacks);
        this.mergeRoutes('HEAD', path, ...callbacks);
    }

    public post(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('POST', path, ...callbacks);
    }

    public put(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PUT', path, ...callbacks);
    }

    public delete(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('DELETE', path, ...callbacks);
    }

    public head(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('HEAD', path, ...callbacks);
    }

    public patch(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PATCH', path, ...callbacks);
    }

    public checkout(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('CHECKOUT', path, ...callbacks);
    }

    public copy(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('COPY', path, ...callbacks);
    }

    public lock(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('LOCK', path, ...callbacks);
    }

    public merge(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MERGE', path, ...callbacks);
    }

    public mkactivity(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MKACTIVITY', path, ...callbacks);
    }

    public mkcalendar(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MKCALENDAR', path, ...callbacks);
    }

    public mkcol(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MKCOL', path, ...callbacks);
    }

    public move(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MOVE', path, ...callbacks);
    }

    public 'm-search'(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('M-SEARCH', path, ...callbacks);
    }

    public notify(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('NOTIFY', path, ...callbacks);
    }

    public options(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('OPTIONS', path, ...callbacks);
    }

    public propfind(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PROPFIND', path, ...callbacks);
    }

    public proppatch(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PROPPATCH', path, ...callbacks);
    }

    public purge(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PURGE', path, ...callbacks);
    }

    public rebind(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('REBIND', path, ...callbacks);
    }

    public report(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('REPORT', path, ...callbacks);
    }

    public search(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('SEARCH', path, ...callbacks);
    }

    public source(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('SOURCE', path, ...callbacks);
    }

    public unbind(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('UNBIND', path, ...callbacks);
    }

    public unlink(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('UNLINK', path, ...callbacks);
    }

    public subscribe(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('SUBSCRIBE', path, ...callbacks);
    }

    public trace(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('TRACE', path, ...callbacks);
    }

    public unlock(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('UNLOCK', path, ...callbacks);
    }

    public unsubscribe(
        path: string | Function,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('UNSUBSCRIBE', path, ...callbacks);
    }

    public async process(
        socket: ServerApplication,
        req: (IncomingMessage | Http2ServerRequest) & { params: {} },
        res: ServerResponse | Http2ServerResponse,
        body: any,
        handle: boolean = false,
        next?: Function,
    ): Promise<{
        request: Request;
        response: Response;
        fn: Array<(req: Request, res: Response, next?: Function) => void>;
        head?: boolean;
    } | null> {
        try {
            const method = req.method as FindMyWay.HTTPMethod;
            const route = this.router.find(method, req.url ? req.url : '');
            // eslint-disable-next-line
            let err = null;

            //Options (compatibility Expressjs)
            if (method === 'OPTIONS') {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader(
                    'Access-Control-Allow-Methods',
                    'GET,HEAD,PUT,PATCH,POST,DELETE',
                );
                res.setHeader('Connection', 'close');
                res.setHeader('Vary', 'Access-Control-Request-Headers');

                const request = new Request(socket, req, res, body, null, next);
                const response = new Response(socket, request, res);

                const optionsAllow = this.optionsAllow.get(req.url);
                let allow;

                if (optionsAllow) {
                    allow = Array.from(optionsAllow).join(', ');
                    res.setHeader('Allow', allow);
                }

                if (
                    route &&
                    route.store &&
                    route.store.callbacks &&
                    route.store.callbacks.length > 0
                ) {
                    try {
                        route.store.callbacks[0](request, response, () => {
                            if (typeof next === 'function') next();
                        });
                    } catch (err) {
                        console.log(err);
                        return;
                    }
                }

                if (this.wildcard.length > 0) {
                    const wildcard = this.parent
                        ? [
                              ...new Set([
                                  ...this.wildcard,
                                  ...this.parent.wildcard,
                              ]),
                          ]
                        : [...new Set(this.wildcard)];
                    this.processWindcard(wildcard, request, response, () => {
                        if (typeof next === 'function') next();
                    });
                }

                if (!res.headersSent && allow) {
                    res.writeHead(200);
                    res.end(allow);
                } else if (!allow) {
                    res.writeHead(404);
                    res.end();
                }

                return;
            }

            //With route exits
            if (req.url) {
                if (
                    route &&
                    route.store &&
                    route.store.callbacks &&
                    route.store.callbacks.length > 0
                ) {
                    const request = new Request(
                        socket,
                        req,
                        res,
                        body,
                        {
                            ...route.params,
                        },
                        route.store.callbacks[route.store.callbacks.length - 1],
                    );

                    const response = new Response(socket, request, res);

                    if (this.stack.has(method)) {
                        //compatibility Expressjs
                        const stack = this.stack.get(method);

                        if (Array.isArray(stack)) {
                            route.store.callbacks = Array.isArray(
                                route.store.callbacks,
                            )
                                ? [...stack, ...route.store.callbacks]
                                : [...stack];
                        }
                    }

                    if (request.params) {
                        //compatibility Expressjs
                        for (const key in request.params) {
                            if (this.params.has(key)) {
                                const callbacks = this.params.get(key);

                                callbacks.forEach(callback => {
                                    route.store.callbacks.unshift(
                                        (req, res, next) => {
                                            try {
                                                callback(
                                                    req,
                                                    res,
                                                    async () => {
                                                        next(req, res, next);
                                                    },
                                                    request.params[key],
                                                );
                                            } catch (err) {
                                                err = err;
                                                res.writeHead(
                                                    HTTP_STATUS_INTERNAL_SERVER_ERROR,
                                                );
                                                res.end(err.message);
                                                res.finish();
                                            }
                                        },
                                    );
                                });
                            }
                        }
                    }

                    if (handle && route.store.callbacks.length === 1) {
                        mixin(req, reqExpress, false);
                        mixin(res, resExpress, false);
                        req.params = route.params;
                        route.store.callbacks[0](req, res);
                    }

                    return {
                        request,
                        response,
                        fn: route.store.callbacks,
                        head: req.method === 'HEAD',
                    };
                }
            }

            //Process next
            if (next && !err && typeof next === 'function') {
                const wildcard = this.parent
                    ? [...new Set([...this.wildcard, ...this.parent.wildcard])]
                    : [...new Set(this.wildcard)];

                if (this.stack.has(method)) this.dispatch(req, res, next);
                else if (wildcard.length > 0) {
                    this.processWindcard(wildcard, req, res, next);
                } else next();
            }

            return null;
        } catch (err) {
            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            res.end(err.message);
        }
    }

    private processWindcard(wildcard, req, res, next?) {
        let current = null;
        let finished = 0;

        for (let i = 0; i < wildcard.length; i++) {
            current = wildcard[i];

            try {
                current(req, res, () => {
                    finished++;

                    if (finished === wildcard.length && next) next();
                });
            } catch {
                finished++;

                if (finished === wildcard.length && next) next();
            }
        }
    }

    //compatibility Expressjs
    get handle() {
        return (req, res, next) => {
            this.process(null, req, res, null, true, next);
        };
    }

    get route() {
        return (path?: string) => {
            this.parent = new Router(path);
            return this.parent;
        };
    }

    /**
     * dispatch req, res into this route
     *
     * @see https://github.com/pillarjs/router/blob/master/lib/route.js#L100
     * @private
     */
    public dispatch(req, res, done, wildcard: Function[] = null) {
        //compatibility Expressjs
        let method = req.method.toUpperCase() as FindMyWay.HTTPMethod;

        if (this.stack.has(method) || wildcard) {
            let stack = wildcard ? wildcard : this.stack.get(method);

            if (method === 'HEAD' && !this.router.hasRoute('HEAD', req.url))
                method = 'GET';

            const route = this.router.find(method, req.url);

            if (route) {
                if (route && route.store && route.store.callbacks) {
                    if (Array.isArray(route.store.callbacks))
                        stack = [...stack, ...route.store.callbacks];
                }
            }

            const defer =
                typeof setImmediate === 'function'
                    ? setImmediate
                    : function (fn, ...args) {
                          process.nextTick(() => fn(...args));
                      };

            let idx = 0;
            let sync = 0;

            if (stack.length === 0) return done();

            req.route = this;

            next();

            function next(err?: string) {
                if (err && err === 'route') return done();

                if (err && err === 'router') return done(err);

                if (idx >= stack.length) return done(err);

                if (++sync > 100) return defer(() => next(err));

                let layer;
                let match;

                while (match !== true && idx < stack.length) {
                    layer = stack[idx++];
                    match = !layer.method || layer.method === method;
                }

                if (match !== true) return done(err);

                if (err) layer(err, req, res, next);
                else layer(req, res, next);

                sync = 0;
            }
        } else {
            done();
        }
    }

    /**
     * Use the given middleware function, with optional path, defaulting to "/".
     *
     * Use (like `.all`) will run for any http METHOD, but it will not add
     * handlers for those methods so OPTIONS requests will not consider `.use`
     * functions even if they could respond.
     *
     * The other difference is that _route_ path is stripped and not visible
     * to the handler function. The main effect of this feature is that mounted
     * handlers can operate without any code changes regardless of the "prefix"
     * pathname.
     *
     * @see https://github.com/pillarjs/router/blob/master/index.js
     * @public
     */
    public use(handler?: Function);
    public use(handler: string, ...routes: Array<Router | Function> | any);
    public use(handler: Function[], ...routes: Array<Router | Function> | any);
    public use(handler?: any, ...routes: Array<Router | Function> | any) {
        let offset = 0;
        let path = '/';

        if (typeof handler !== 'function') {
            let arg = handler;

            while (Array.isArray(arg) && arg.length !== 0) arg = arg[0];

            if (typeof arg !== 'function') {
                offset = 1;
                path = handler;
            }
        }

        const callbacks = flatten(
            /* eslint-disable-next-line prefer-rest-params */
            Array.prototype.slice.call(arguments, offset),
        );

        if (callbacks.length === 0)
            throw new TypeError('argument handler is required');

        for (let i = 0; i < callbacks.length; i++) {
            const fn = callbacks[i];

            if (typeof fn !== 'function' && !(fn instanceof Router))
                throw new TypeError('argument handler must be a function');

            this.all(path, fn);
        }

        if (Array.isArray(routes)) {
            for (const route of routes) {
                if (route instanceof Router) {
                    route.stack.forEach((middleware, method) => {
                        if (!this.stack.has(method)) {
                            this.stack.set(method, []);
                        }
                        const existingStack = this.stack.get(method);
                        this.stack.set(method, [
                            ...existingStack,
                            ...middleware,
                        ]);
                    });

                    route.params.forEach((fn, param) => {
                        this.params.set(param, fn);
                    });

                    route.registeredRoutes.forEach(routeItem => {
                        this.mergeRoutes(
                            routeItem.method,
                            handler + routeItem.path,
                            ...routeItem.options.callbacks,
                        );
                    });

                    this.wildcard = [...this.wildcard, ...route.wildcard];
                } else if (typeof route === 'function') {
                    this.wildcard.push(route);
                }
            }
        }

        //if(typeof handler === "function")
        //    this.wildcard.push(handler);

        return this;
    }
}
