import * as http from 'node:http';
import * as https from 'node:https';
import * as http2 from 'node:http2';
import * as zlib from 'node:zlib';
import * as net from 'node:net';

import * as querystring from 'qs';
import * as formidable from 'formidable';
import { EventEmitter } from 'events';

import {
    ServerMiddleware,
    IServerApplication,
    Telemetry,
} from '@cmmv/server-common';

import { ServerStaticMiddleware } from '@cmmv/server-static';

import { Router } from './router';
import { Request } from './request';
import { Response } from './response';

import {
    ServerOptions,
    DefaultServerOptions,
    DefaultServerHTTP2Options,
} from '../interfaces';

const {
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_BAD_GATEWAY,
} = http2.constants;

const mixin = require('merge-descriptors');

type Socket =
    | http.Server
    | https.Server
    | http2.Http2Server
    | http2.Http2SecureServer;

export class ServerApplication implements IServerApplication {
    private isHTTP2: boolean = false;
    public socket: Socket;
    private opts:
        | http.ServerOptions
        | https.ServerOptions
        | http2.ServerOptions
        | http2.SecureServerOptions;

    private middlewares: Set<ServerMiddleware | Function> = new Set<
        ServerMiddleware | Function
    >();

    private middlewaresArr: Array<ServerMiddleware | Function> = [];
    private staticServer: ServerStaticMiddleware | null = null;
    private router: Router = new Router();
    public parent: ServerApplication = null;

    private scope: Map<string, any> = new Map<string, any>();
    private namesProtected: Set<string> = new Set<string>();

    get locals() {
        //compatibility Expressjs
        const obj: { [key: string]: any } = {};

        this.scope.forEach((value, key) => {
            obj[key] = value;
        });

        return obj;
    }

    get settings() {
        //compatibility Expressjs
        return this.scope.has('settings') ? this.scope.get('settings') : {};
    }

    get param() {
        return this.router.param.bind(this.router);
    }

    //compatibility Expressjs
    private _request = {};
    private _response = {};

    get request() {
        return this._request as any;
    }

    set request(value) {
        this._request = value;
    }

    get response() {
        return this._response as any;
    }

    set response(value) {
        this._response = value;
    }

    constructor(opts?: ServerOptions) {
        this.isHTTP2 = opts?.http2 === true || false;

        this.opts = this.isHTTP2
            ? new DefaultServerHTTP2Options(opts).ToOptions()
            : new DefaultServerOptions(opts).ToOptions();

        if (!this.isHTTP2) {
            this.socket =
                opts && opts?.key && opts?.cert
                    ? https.createServer(
                          this.opts as https.ServerOptions,
                          (req, res) => this.onListener(req, res),
                      )
                    : http.createServer(
                          this.opts as http.ServerOptions,
                          (req, res) => this.onListener(req, res),
                      );
        } else {
            (this.opts as http2.SecureServerOptions).allowHTTP1 = true;

            this.socket =
                opts && opts?.key && opts?.cert
                    ? http2.createSecureServer(
                          this.opts as http2.SecureServerOptions,
                          (req, res) => this.onListener(req, res),
                      )
                    : http2.createServer(
                          this.opts as http2.ServerOptions,
                          (req, res) => this.onListener(req, res),
                      );
        }
    }

    private async onListener(
        req: http.IncomingMessage | http2.Http2ServerRequest,
        res: http.ServerResponse | http2.Http2ServerResponse,
    ) {
        const hasFileExtension = /\.\w+$/.test(req.url);
        res.setHeader('Req-UUID', Telemetry.generateId());

        if (hasFileExtension && this.staticServer) {
            this.staticServer.process(req, res, err =>
                this.handleBody(req, res, this.processRequest.bind(this)),
            );
        } else {
            this.handleBody(req, res, this.processRequest.bind(this));
        }
    }

    async handleBody(
        req: http.IncomingMessage | http2.Http2ServerRequest,
        res: http.ServerResponse | http2.Http2ServerResponse,
        next: (req: any, res: any, body: any) => void,
    ) {
        try {
            const method = req.method?.toUpperCase();
            const bodyMethods = ['POST', 'PUT', 'PATCH'];
            const contentType = req.headers['content-type'];

            if (bodyMethods.includes(method)) {
                Telemetry.start(
                    'Body Parser',
                    res.getHeader('Req-UUID') as string,
                );

                let body = '';

                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', async () => {
                    try {
                        const decompressedBody = await this.decompressBody(
                            body,
                            req,
                            res,
                        );

                        Telemetry.end(
                            'Body Parser',
                            res.getHeader('Req-UUID') as string,
                        );

                        switch (contentType) {
                            case 'application/json':
                                next(req, res, JSON.parse(decompressedBody));
                                break;
                            case 'application/x-www-form-urlencoded':
                                next(
                                    req,
                                    res,
                                    querystring.parse(decompressedBody),
                                );
                                break;
                            case 'multipart/form-data':
                                const form = new formidable.IncomingForm();
                                form.parse(req, (err, fields, files) => {
                                    if (err) {
                                        res.writeHead(400, {
                                            'Content-Type': 'application/json',
                                        });
                                        res.end(
                                            JSON.stringify({
                                                error: 'Invalid form data',
                                            }),
                                        );
                                        return;
                                    }
                                    next(req, res, { fields, files });
                                });
                                break;
                            default:
                                next(req, res, null);
                                break;
                        }
                    } catch (err) {
                        if (process.env.NODE_ENV === 'dev') console.error(err);

                        res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
                        res.end(err.message);
                    }
                });
            } else {
                next(req, res, null);
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'dev') console.error(err);

            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            res.end(err.message);
        }
    }

    async decompressBody(body: string, req, res): Promise<string> {
        Telemetry.start('Decompress Body', res.getHeader('Req-UUID') as string);

        const encoding = (
            req.headers['content-encoding'] || 'identity'
        ).toLowerCase();

        let steam = null;

        switch (encoding) {
            case 'br':
                steam = zlib.createBrotliCompress();
            case 'gzip':
                steam = zlib.createGzip();
            case 'deflate':
                steam = zlib.createDeflate();
        }

        if (steam) {
            const data = await this.decompressData(Buffer.from(body), steam);
            Telemetry.end(
                'Decompress Body',
                res.getHeader('Req-UUID') as string,
            );
            return data;
        }

        return body;
    }

    async decompressData(
        inputBuffer: Buffer,
        compressionStream: zlib.Gzip | zlib.Deflate | zlib.BrotliCompress,
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const chunks: Buffer[] = [];

            compressionStream.on('data', chunk => {
                chunks.push(chunk);
            });

            compressionStream.on('end', () => {
                resolve(Buffer.concat(chunks).toString());
            });

            compressionStream.on('error', err => {
                reject(err);
            });

            compressionStream.end(inputBuffer);
        });
    }

    bindCustomContext(original, newScope) {
        mixin(original, newScope, false);
    }

    private async processRequest(req, res, body: any) {
        const route = await this.router.process(this, req, res, body);
        Telemetry.start('Process Request', res.getHeader('Req-UUID') as string);

        try {
            const processMiddleware = async (
                index: number,
                after: boolean = false,
            ) => {
                if (index < this.middlewaresArr.length && route) {
                    const middleware = this.middlewaresArr[index];

                    if (!route.response.sended) {
                        if (
                            middleware instanceof ServerMiddleware &&
                            middleware?.afterProcess === after
                        ) {
                            middleware.process(
                                route.request,
                                route.response,
                                () => processMiddleware(index + 1, after),
                            );
                        } else if (typeof middleware === 'function') {
                            if (middleware.length === 4) {
                                //compatibility Expressjs
                                middleware(null, route, route, () =>
                                    processMiddleware(index + 1, after),
                                );
                            } else {
                                middleware(route, route, () =>
                                    processMiddleware(index + 1, after),
                                );
                            }
                        } else {
                            processMiddleware(index + 1, after);
                        }
                    }
                } else if (route) {
                    if (!route.response.sended) {
                        if (!after) {
                            await this.runFunctions(
                                route.fn,
                                route.request,
                                route.response,
                            );

                            if (!route.response.sended)
                                processMiddleware(0, true);
                            else {
                                res.writeHead(route.response.statusCode);
                                res.end(
                                    route.head === true
                                        ? ''
                                        : route.response.buffer,
                                );
                            }
                        } else if (route) {
                            const uuid = res.getHeader('Req-UUID') as string;
                            Telemetry.end('Process Request', uuid);
                            Telemetry.table(uuid);
                            Telemetry.clearTelemetry(uuid);

                            res.writeHead(route.response.statusCode);
                            res.end(
                                route.head === true
                                    ? ''
                                    : route.response.buffer,
                            );
                        } else {
                            res.writeHead(HTTP_STATUS_NOT_FOUND);
                            res.end('Not Found');
                        }
                    }
                } else {
                    res.writeHead(HTTP_STATUS_NOT_FOUND);
                    res.end('Not Found');
                }
            };

            if (route) {
                this.bindCustomContext(route.request.req, this._request); //compatibility Expressjs
                this.bindCustomContext(route.response.res, this._response); //compatibility Expressjs

                if (this.middlewaresArr.length > 0) processMiddleware(0);
                else {
                    if (route) {
                        const uuid = res.getHeader('Req-UUID') as string;
                        Telemetry.end('Process Request', uuid);
                        Telemetry.table(uuid);
                        Telemetry.clearTelemetry(uuid);

                        await this.runFunctions(
                            route.fn,
                            route.request,
                            route.response,
                        );

                        res.writeHead(route.response.statusCode);
                        res.end(route.head ? '' : route.response.buffer);
                    } else {
                        res.writeHead(HTTP_STATUS_NOT_FOUND);
                        res.end('Not Found');
                    }
                }
            } else {
                res.writeHead(HTTP_STATUS_NOT_FOUND);
                res.end('Not Found');
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'dev') console.error(err);

            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            res.end(err.message);
        }
    }

    private async runFunctions(
        fns: Array<(req: Request, res: Response, next?: Function) => void>,
        req: Request,
        res: Response,
    ) {
        const runFn = async (index: number) => {
            if (fns && index < fns.length)
                fns[index](req, res, () => runFn(index + 1));
        };

        await runFn(0);
    }

    //Methods
    public use(
        app:
            | ServerMiddleware
            | Router
            | ServerStaticMiddleware
            | Function
            | string,
        parent?: ServerApplication,
    ): void {
        if (app instanceof Router) {
            this.router = app;
        } else if (app instanceof ServerStaticMiddleware) {
            this.staticServer = app;
        } else if (
            parent instanceof ServerApplication &&
            typeof app === 'string'
        ) {
            this.parent = parent;
        } else if (app instanceof ServerMiddleware) {
            this.middlewares.add(app);
            this.middlewaresArr = Array.from(this.middlewares);
        } else if (typeof app === 'function') {
            console.warn(
                'The use of generic middlewares was maintained for compatibility but its use is not recommended, change to ServerMiddleware',
            );
            this.middlewares.add(app);
            this.middlewaresArr = Array.from(this.middlewares);
        } else {
            throw Error('Invalid use middleware');
        }
    }

    public all(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) {
            this.router.all(path, ...callbacks);
        }
    }

    public get(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ): any | null {
        if (callbacks.length > 0) {
            this.router.get(path, ...callbacks);
        } else if (typeof path === 'string' && path !== '') {
            return this.scope.has(path as string) ? this.scope.get(path) : null;
        }

        return null;
    }

    public post(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.post(path, ...callbacks);
    }

    public put(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.put(path, ...callbacks);
    }

    public delete(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.delete(path, ...callbacks);
    }

    public head(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.head(path, ...callbacks);
    }

    public patch(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.patch(path, ...callbacks);
    }

    public options(
        path: string,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.options(path, ...callbacks);
    }

    //Scope
    public set(name: string, value: any): boolean {
        if (!this.scope.has('settings')) this.scope.set('settings', {});

        if (!this.namesProtected.has(name)) {
            const settings = this.scope.get('settings');
            settings[name] = value;
            this.scope.set('settings', settings);
            return true;
        }

        return false;
    }

    public enable(name: string): void {
        if (this.namesProtected.has(name)) this.namesProtected.delete(name);
    }

    public enabled(name: string): boolean {
        return this.namesProtected.has(name);
    }

    public disable(name: string): void {
        if (!this.namesProtected.has(name)) this.namesProtected.add(name);
    }

    public disabled(name: string): boolean {
        return !this.namesProtected.has(name);
    }

    //Others
    public render(
        viewName: string,
        dataOrCallback: object | Function,
        callback?: Function,
    ) {}

    public listen(
        port: number,
        hostOrCallback?: string | ((err?: Error) => void),
        callback?: (err?: Error) => void,
    ): Socket {
        const host =
            typeof hostOrCallback === 'string' ? hostOrCallback : '127.0.0.1';
        const cb =
            typeof hostOrCallback === 'function' ? hostOrCallback : callback;
        this.socket.listen({ port, host, backlog: true }, cb);
        return this.socket;
    }

    public close(callback?: (err?: Error) => void) {
        this.socket.close(callback);
    }

    public Router(): new () => Router {
        //compatibility Expressjs
        return Router;
    }

    //Events
    public on(name: string, callback: Function) {} //compatibility Expressjs
    public emit(name: string, value?: any) {} //compatibility Expressjs
}

export const CmmvServer = (options?: ServerOptions) => {
    const app = new ServerApplication(options);
    mixin(app, EventEmitter.prototype, false);
    return app;
};
