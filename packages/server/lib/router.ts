import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse, constants } from 'http2';

import * as FindMyWay from 'find-my-way';

import { Request } from './request';
import { Response } from './response';
import { ServerApplication } from './application';

const { HTTP_STATUS_OK } = constants;

export class Router {
    public router: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;
    public params: Map<string, Function> = new Map<string, Function>();

    constructor() {
        if (!this.router) {
            this.router = FindMyWay({
                caseSensitive: false,
                ignoreTrailingSlash: true,
                ignoreDuplicateSlashes: true,
                allowUnsafeRegex: true,
            });
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
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
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
        this.mkcol(path, ...callbacks);
        this.move(path, ...callbacks);
        this['m-search'](path, ...callbacks);
        this.notify(path, ...callbacks);
        this.options(path, ...callbacks);
        this.purge(path, ...callbacks);
        this.search(path, ...callbacks);
        this.subscribe(path, ...callbacks);
        this.trace(path, ...callbacks);
        this.unlock(path, ...callbacks);
        this.unsubscribe(path, ...callbacks);
    }

    private mergeRoutes(
        method: FindMyWay.HTTPMethod,
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (!this.router.hasRoute(method, path))
            this.router.on(method, path, (req, res) => {}, { callbacks });
        else {
            const handler = this.router.findRoute(method, path);
            this.router.off(method, path);
            this.router.on(method, path, (req, res) => {}, {
                callbacks: [...handler.store.callbacks, ...callbacks],
            });
        }
    }

    public get(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('GET', path, ...callbacks);
        this.mergeRoutes('HEAD', path, ...callbacks);
    }

    public post(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('POST', path, ...callbacks);
    }

    public put(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PUT', path, ...callbacks);
    }

    public delete(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('DELETE', path, ...callbacks);
    }

    public head(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('HEAD', path, ...callbacks);
    }

    public patch(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PATCH', path, ...callbacks);
    }

    public checkout(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('CHECKOUT', path, ...callbacks);
    }

    public copy(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('COPY', path, ...callbacks);
    }

    public lock(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('LOCK', path, ...callbacks);
    }

    public merge(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MERGE', path, ...callbacks);
    }

    public mkactivity(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MKACTIVITY', path, ...callbacks);
    }

    public mkcol(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MKCOL', path, ...callbacks);
    }

    public move(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('MOVE', path, ...callbacks);
    }

    public 'm-search'(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('M-SEARCH', path, ...callbacks);
    }

    public notify(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('NOTIFY', path, ...callbacks);
    }

    public options(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('OPTIONS', path, ...callbacks);
    }

    public purge(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('PURGE', path, ...callbacks);
    }

    public report(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('REPORT', path, ...callbacks);
    }

    public search(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('SEARCH', path, ...callbacks);
    }

    public subscribe(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('SUBSCRIBE', path, ...callbacks);
    }

    public trace(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('TRACE', path, ...callbacks);
    }

    public unlock(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.mergeRoutes('UNLOCK', path, ...callbacks);
    }

    public unsubscribe(
        path: string,
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

        const route = this.router.find(
            req.method as FindMyWay.HTTPMethod,
            req.url,
        );

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

            if (request.params) {
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
}
