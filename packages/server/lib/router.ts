import * as url from 'node:url';
import * as http from 'node:http';
import * as http2 from 'node:http2';

import { BiIndexMap } from '../utils';
import { Request } from './request';
import { Response } from './response';
import { ServerApplication } from './application';

export class Router {
    private index: BiIndexMap = new BiIndexMap();

    public all(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('get', path, callbacks);
        this.index.set('post', path, callbacks);
        this.index.set('put', path, callbacks);
        this.index.set('delete', path, callbacks);
        this.index.set('head', path, callbacks);
        this.index.set('patch', path, callbacks);
        this.index.set('checkout', path, callbacks);
        this.index.set('copy', path, callbacks);
        this.index.set('lock', path, callbacks);
        this.index.set('merge', path, callbacks);
        this.index.set('mkactivity', path, callbacks);
        this.index.set('mkcol', path, callbacks);
        this.index.set('move', path, callbacks);
        this.index.set('m-search', path, callbacks);
        this.index.set('notify', path, callbacks);
        this.index.set('options', path, callbacks);
        this.index.set('purge', path, callbacks);
        this.index.set('report', path, callbacks);
        this.index.set('search', path, callbacks);
        this.index.set('subscribe', path, callbacks);
        this.index.set('trace', path, callbacks);
        this.index.set('unlock', path, callbacks);
        this.index.set('unsubscribe', path, callbacks);
    }

    public get(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('get', path, callbacks);
    }

    public post(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('post', path, callbacks);
    }

    public put(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('put', path, callbacks);
    }

    public delete(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('delete', path, callbacks);
    }

    public head(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('head', path, callbacks);
    }

    public patch(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('patch', path, callbacks);
    }

    public checkout(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('checkout', path, callbacks);
    }

    public copy(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('copy', path, callbacks);
    }

    public lock(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('lock', path, callbacks);
    }

    public merge(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('merge', path, callbacks);
    }

    public mkactivity(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('mkactivity', path, callbacks);
    }

    public mkcol(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('mkcol', path, callbacks);
    }

    public move(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('move', path, callbacks);
    }

    public 'm-search'(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('m-search', path, callbacks);
    }

    public notify(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('notify', path, callbacks);
    }

    public options(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('options', path, callbacks);
    }

    public purge(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('purge', path, callbacks);
    }

    public report(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('report', path, callbacks);
    }

    public search(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('search', path, callbacks);
    }

    public subscribe(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('subscribe', path, callbacks);
    }

    public trace(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('trace', path, callbacks);
    }

    public unlock(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('unlock', path, callbacks);
    }

    public unsubscribe(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        this.index.set('unsubscribe', path, callbacks);
    }

    public async process(
        socket: ServerApplication,
        req: http.IncomingMessage | http2.Http2ServerRequest,
        res: http.ServerResponse | http2.Http2ServerResponse,
        body: any,
    ): Promise<{
        request: Request;
        response: Response;
        fn: Array<(req: Request, res: Response, next?: Function) => void>;
    } | null> {
        const method = req.method.toLowerCase();
        const parsedUrl = url.parse(req.url, true);
        const fn = await this.index.get(method, parsedUrl.pathname);

        if (fn && fn.length > 0) {
            const request = new Request(socket, req, res, body);
            const response = new Response(socket, req, res);
            return { request, response, fn };
        }

        return null;
    }
}
