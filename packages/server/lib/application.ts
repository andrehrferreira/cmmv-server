import * as http from 'node:http';
import * as https from 'node:https';
import * as http2 from 'node:http2';
import * as zlib from 'node:zlib';

import * as querystring from 'qs';
import * as formidable from 'formidable';
import { EventEmitter } from 'events';

import { ServerMiddleware, IServerApplication } from '@cmmv/server-common';

import { StaticOptions, ServerStaticMiddleware } from '@cmmv/server-static';

import { Router } from './router';
import { Request } from './request';
import { Response } from './response';

import {
    ServerOptions,
    ServerHTTP2Options,
    DefaultServerOptions,
    DefaultServerHTTP2Options,
} from '../interfaces';

const { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR } =
    http2.constants;

const mixin = require('merge-descriptors');

export class ServerApplication implements IServerApplication {
    private isHTTP2: boolean = false;
    public socket:
        | http.Server
        | https.Server
        | http2.Http2Server
        | http2.Http2SecureServer;
    private options:
        | http.ServerOptions
        | https.ServerOptions
        | http2.ServerOptions
        | http2.SecureServerOptions;
    private middlewares: Set<ServerMiddleware> = new Set<ServerMiddleware>();
    private middlewaresArr: Array<ServerMiddleware> = [];
    private staticServer: ServerStaticMiddleware | null = null;
    private router: Router = new Router();
    public parent: ServerApplication = null;

    private scope: Map<string, any> = new Map<string, any>();
    private namesProtected: Set<string> = new Set<string>();

    constructor(options?: ServerOptions) {
        this.isHTTP2 = options?.http2 === true || false;

        this.options = this.isHTTP2
            ? new DefaultServerHTTP2Options(options).ToOptions()
            : new DefaultServerOptions(options).ToOptions();

        if (!this.isHTTP2) {
            this.socket =
                options && options?.key && options?.cert
                    ? https.createServer(
                          this.options as https.ServerOptions,
                          (req, res) => this.onListener(req, res),
                      )
                    : http.createServer(
                          this.options as http.ServerOptions,
                          (req, res) => this.onListener(req, res),
                      );
        } else {
            (this.options as http2.SecureServerOptions).allowHTTP1 = true;

            this.socket =
                options && options?.key && options?.cert
                    ? http2.createSecureServer(
                          this.options as http2.SecureServerOptions,
                          (req, res) => this.onListener(req, res),
                      )
                    : http2.createServer(
                          this.options as http2.ServerOptions,
                          (req, res) => this.onListener(req, res),
                      );
        }
    }

    private async onListener(req, res) {
        const path = req.url;
        const hasFileExtension = /\.\w+$/.test(path);

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
        const method = req.method?.toUpperCase();
        const bodyMethods = ['POST', 'PUT', 'PATCH'];
        const contentType = req.headers['content-type'];

        if (bodyMethods.includes(method)) {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const decompressedBody = await this.decompressBody(
                        body,
                        req,
                    );

                    switch (contentType) {
                        case 'application/json':
                            next(req, res, JSON.parse(decompressedBody));
                            break;
                        case 'application/x-www-form-urlencoded':
                            next(req, res, querystring.parse(decompressedBody));
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
                    console.log(err);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON format' }));
                }
            });
        } else {
            next(req, res, null);
        }
    }

    async decompressBody(body: string, req): Promise<string> {
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

        if (steam) return await this.compressData(Buffer.from(body), steam);

        return body;
    }

    async compressData(
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

    private async processRequest(req, res, body: any) {
        const route = await this.router.process(this, req, res, body);

        try {
            const processMiddleware = async (
                index: number,
                after: boolean = false,
            ) => {
                if (index < this.middlewaresArr.length && route) {
                    const middleware = this.middlewaresArr[index];

                    if (!route.response.sended) {
                        if (middleware.afterProcess === after) {
                            middleware.process(
                                route.request,
                                route.response,
                                () => {
                                    processMiddleware(index + 1, after);
                                },
                            );
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
                            processMiddleware(0, true);
                        } else if (route) {
                            res.writeHead(route.response.statusCode);
                            res.end(route.response.buffer);
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

            if (this.middlewaresArr.length > 0) processMiddleware(0);
            else {
                console.log(route);
                if (route) {
                    console.log('aki');

                    await this.runFunctions(
                        route.fn,
                        route.request,
                        route.response,
                    );
                    res.writeHead(route.response.statusCode);
                    res.end(route.response.buffer);
                } else {
                    res.writeHead(HTTP_STATUS_NOT_FOUND);
                    res.end('Not Found');
                }
            }
        } catch (err) {
            console.error(err);
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
            if (index < fns.length) {
                fns[index](req, res, () => runFn(index + 1));
            }
        };

        await runFn(0);
    }

    //Methods
    public use(
        app: ServerMiddleware | Router | ServerStaticMiddleware | string,
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
        }
    }

    public all(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) {
            this.router.all(path, ...callbacks);
        }
    }

    public get(
        path: string | RegExp,
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
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.post(path, ...callbacks);
    }

    public put(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.put(path, ...callbacks);
    }

    public delete(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.delete(path, ...callbacks);
    }

    public head(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.head(path, ...callbacks);
    }

    public patch(
        path: string | RegExp,
        ...callbacks: Array<
            (req: Request, res: Response, next?: Function) => void
        >
    ) {
        if (callbacks.length > 0) this.router.patch(path, ...callbacks);
    }

    //Scope
    public set(name: string, value: any): boolean {
        if (!this.namesProtected.has(name)) {
            this.scope.set(name, value);
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
        host: string = '0.0.0.0',
        callback?: () => void,
    ): void {
        this.socket.listen(
            {
                port,
                host,
            },
            callback,
        );
    }

    //Events
    public on(name: string, callback: Function) {}
    public emit(name: string, value?: any) {}
}

export const CmmvServer = (options?: ServerOptions) => {
    const app = new ServerApplication(options);
    mixin(app, EventEmitter.prototype, false);
    return app;
};
