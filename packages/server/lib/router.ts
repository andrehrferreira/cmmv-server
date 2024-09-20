import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

import * as FindMyWay from 'find-my-way';

import { Request } from './request';
import { Response } from './response';
import { ServerApplication } from './application';

export class Router {
    public router: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;
    public params: Map<string, Function> = new Map<string, Function>();

    public stack: Map<FindMyWay.HTTPMethod, Array<Function>> = new Map<
        FindMyWay.HTTPMethod,
        Array<Function>
    >();

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
        if (typeof valueOrObject === 'string')
            this.params.set(valueOrObject, cb);
        else if (Array.isArray(valueOrObject)) {
            valueOrObject.forEach(item => this.params.set(item, cb));
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

            if (!this.router.hasRoute(method, finalPath))
                this.router.on(method, finalPath, (req, res) => {}, {
                    callbacks,
                });
            else {
                const handler = this.router.findRoute(method, finalPath);
                this.router.off(method, finalPath);
                this.router.on(method, finalPath, (req, res) => {}, {
                    callbacks: [...handler.store.callbacks, ...callbacks],
                });
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
        req: IncomingMessage | Http2ServerRequest,
        res: ServerResponse | Http2ServerResponse,
        body: any,
    ): Promise<{
        request: Request;
        response: Response;
        fn: Array<(req: Request, res: Response, next?: Function) => void>;
        head?: boolean;
    } | null> {
        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                    'GET,HEAD,PUT,PATCH,POST,DELETE',
                Vary: 'Access-Control-Request-Headers',
                'Content-Length': '0',
                Connection: 'close',
                Date: new Date().toUTCString(),
            });
            res.end();
            return null;
        }

        const method = req.method as FindMyWay.HTTPMethod;

        const route = this.router.find(method, req.url);

        if (
            route &&
            route.store &&
            route.store.callbacks &&
            route.store.callbacks.length > 0
        ) {
            const request = new Request(socket, req, res, body, {
                ...route.params,
            });

            const response = new Response(socket, req, res);

            if (this.stack.has(method)) {
                //compatibility Expressjs
                const stack = this.stack.get(method);

                if (Array.isArray(stack)) {
                    route.store.callbacks = Array.isArray(route.store.callbacks)
                        ? [...stack, ...route.store.callbacks]
                        : [...stack];
                }
            }

            if (request.params) {
                //compatibility Expressjs
                for (const key in request.params) {
                    if (this.params.has(key)) {
                        route.store.callbacks.unshift((req, res, next) => {
                            const callback = this.params.get(key);
                            callback(
                                req,
                                res,
                                async () => {
                                    next(req, res, next);
                                },
                                request.params[key],
                            );
                        });
                    }
                }
            }

            return {
                request,
                response,
                fn: route.store.callbacks,
                head: req.method === 'HEAD',
            };
        }

        return null;
    }

    /**
     * dispatch req, res into this route
     *
     * @see https://github.com/pillarjs/router/blob/master/lib/route.js#L100
     * @private
     */
    public dispatch(req, res, done) {
        //compatibility Expressjs
        let method = req.method.toUpperCase() as FindMyWay.HTTPMethod;

        if (this.stack.has(method)) {
            let stack = this.stack.get(method);

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
                    : function (fn) {
                          process.nextTick(fn.bind.apply(fn, arguments));
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
            console.log(method);
            done();
        }
    }
}
