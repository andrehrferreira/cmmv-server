import * as vary from 'vary';
import * as accepts from 'accepts';
import * as send from 'send';
import { Buffer } from 'safe-buffer';

import * as http from 'node:http';
import * as http2 from 'node:http2';

const onHeaders = require('on-headers');

const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND } = http2.constants;

import { CookieOptions } from '../interfaces';

import { IRespose } from '@cmmv/server-common';

import { ServerApplication } from './application';

export class Response implements IRespose {
    public buffer: Buffer;
    public statusCode: number = HTTP_STATUS_OK;
    public accept;
    public headers: any = {};
    public sended: boolean = false;

    constructor(
        public readonly app: ServerApplication,
        public readonly req: http.IncomingMessage | http2.Http2ServerRequest,
        public readonly res: http.ServerResponse | http2.Http2ServerResponse,
    ) {
        this.accept = accepts(req as http.IncomingMessage);
        const self = this;

        onHeaders(
            this.res,
            function (this: http.ServerResponse | http2.Http2ServerResponse) {
                for (const keyHeader in self.headers) {
                    this.setHeader(keyHeader, self.headers[keyHeader]);
                }
            },
        );
    }

    get httpResponse() {
        return this.res;
    }

    public append(appendName: string, value: any) {}

    public attachment(contentType?: string) {}

    public cookie(name: string, value: string, options?: CookieOptions) {}

    public clearCookie(name: string, options?: CookieOptions) {}

    public download(path: string, filename?: string) {}

    public end(data?: string, encoding?: string) {
        this.buffer = Buffer.from(data, encoding);
    }

    public format(object: Object) {}

    public get(headerName: string): string {
        return this.headers[headerName];
    }

    public json(body?: any) {}

    public jsonp(body?: any) {}

    public links(links?: Object) {}

    public location(path: string) {}

    public redirect(pathOrStatus: string | number, path?: string) {}

    public render(
        view: string,
        locals?: any,
        callback?: (err: any, html: string) => void,
    ) {}

    public send(body?: string | Object | Buffer) {
        if (!this.sended) {
            if (typeof body === 'object') {
                if (
                    !this.headers['Content-Type'] &&
                    this.accept.type(['json']) === 'json'
                )
                    this.headers['Content-Type'] = 'application/json';

                this.buffer = Buffer.from(JSON.stringify(body), 'utf8');
            } else if (typeof body === 'string') {
                if (
                    !this.headers['Content-Type'] &&
                    this.accept.type(['html']) === 'html'
                )
                    this.headers['Content-Type'] = 'text/html';

                this.buffer = Buffer.from(body, 'utf8');
            } else {
                if (!this.headers['Content-Type'])
                    this.headers['Content-Type'] = 'application/octet-stream';

                this.buffer = new Buffer(body);
            }
        }
    }

    public sendFile(
        path: string,
        options?: send.SendOptions,
        fn?: (err: any) => void,
    ): void {
        if (!this.sended) {
            this.sended = true;
            const stream = send(this.req, path, options);

            stream.on('error', err => {
                if (fn) return fn(err);
                this.res.writeHead(HTTP_STATUS_NOT_FOUND);
                return this.res.end('File not found');
            });

            stream.pipe(this.res);
        }
    }

    public sendStatus(statusCode: number): Response {
        this.statusCode = statusCode;
        this.res.statusCode = statusCode;
        this.res.end(http.STATUS_CODES[statusCode]);
        return this;
    }

    public set(field: string | Object, value?: string): Response {
        if (typeof field == 'object') {
            for (const key in field) this.headers[key] = field[key];
        } else {
            this.headers[field] = value;
        }

        return this;
    }

    public setHeader(field: string, value?: string): Response {
        this.set(field, value);
        return this;
    }

    public remove(field: string): Response {
        delete this.headers[field];
        return this;
    }

    public removeHeader(field: string): Response {
        this.remove(field);
        return this;
    }

    public status(code: number): Response {
        this.statusCode = code;
        return this;
    }

    public type(type: string): Response {
        return this;
    }

    public vary(field: string): Response {
        vary(this.res as http.ServerResponse, field);
        return this;
    }
}
