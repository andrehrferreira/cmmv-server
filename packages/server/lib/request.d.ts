import * as http from 'node:http';
import * as http2 from 'node:http2';
import { IRequest } from '@cmmv/server-common';
import { ServerApplication } from './application';
export declare class Request implements IRequest {
    readonly app: ServerApplication;
    readonly req: http.IncomingMessage | http2.Http2ServerRequest;
    readonly res: http.ServerResponse | http2.Http2ServerResponse;
    readonly body: any;
    readonly params?: {
        [k: string]: string | undefined;
    };
    constructor(app: ServerApplication, req: http.IncomingMessage | http2.Http2ServerRequest, res: http.ServerResponse | http2.Http2ServerResponse, body: any, params?: {
        [k: string]: string | undefined;
    });
    get httpRequest(): http.IncomingMessage | http2.Http2ServerRequest;
    get method(): string;
    get path(): string;
    get url(): string;
    get baseUrl(): any;
    get cookies(): any;
    get fresh(): any;
    get hostname(): string;
    get ip(): string;
    get ips(): string[];
    get originalUrl(): any;
    get protocol(): "https" | "http";
    get query(): import("querystring").ParsedUrlQuery;
    get secure(): boolean;
    get stale(): boolean;
    get subdomains(): string[];
    get xhr(): boolean;
}
