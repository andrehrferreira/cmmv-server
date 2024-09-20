import { IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as url from 'node:url';

import * as qs from 'qs';
import * as FindMyWay from 'find-my-way';

import { BiIndexMap } from '../utils';
import { Request } from './request';
import { Response } from './response';
import { ServerApplication } from './application';

export class Router {
    public router: FindMyWay.Instance<FindMyWay.HTTPVersion.V2>;

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
        this.router.on('GET', path, (req, res) => {}, { callbacks });
    }

    public get(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('GET', path, (req, res) => {}, { callbacks });
    }

    public post(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('POST', path, null, { callbacks });
    }

    public put(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('PUT', path, null, { callbacks });
    }

    public delete(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('DELETE', path, null, { callbacks });
    }

    public head(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('HEAD', path, null, { callbacks });
    }

    public patch(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('PATCH', path, null, { callbacks });
    }

    public checkout(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('CHECKOUT', path, null, { callbacks });
    }

    public copy(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('COPY', path, null, { callbacks });
    }

    public lock(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('LOCK', path, null, { callbacks });
    }

    public merge(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('MERGE', path, null, { callbacks });
    }

    public mkactivity(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('MKACTIVITY', path, null, { callbacks });
    }

    public mkcol(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('MKCOL', path, null, { callbacks });
    }

    public move(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('MOVE', path, null, { callbacks });
    }

    public 'm-search'(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('M-SEARCH', path, null, { callbacks });
    }

    public notify(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('NOTIFY', path, null, { callbacks });
    }

    public options(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('OPTIONS', path, null, { callbacks });
    }

    public purge(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('PURGE', path, null, { callbacks });
    }

    public report(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('REPORT', path, null, { callbacks });
    }

    public search(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('SEARCH', path, null, { callbacks });
    }

    public subscribe(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('SUBSCRIBE', path, null, { callbacks });
    }

    public trace(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('TRACE', path, null, { callbacks });
    }

    public unlock(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('UNLOCK', path, null, { callbacks });
    }

    public unsubscribe(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.router.on('UNSUBSCRIBE', path, null, { callbacks });
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
    } | null> {
        const route = this.router.find(
            req.method as FindMyWay.HTTPMethod,
            req.url,
        );

        if (route.store.callbacks && route.store.callbacks.length > 0) {
            const request = new Request(socket, req, res, body, {
                ...route.params,
            });
            const response = new Response(socket, req, res);
            return { request, response, fn: route.store.callbacks };
        }

        return null;
    }
}
