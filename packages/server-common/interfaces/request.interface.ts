import * as http from 'node:http';
import * as http2 from 'node:http2';

import { IServerApplication } from './application.interface';

export interface IRequest {
    readonly app: IServerApplication;
    readonly httpRequest: http.IncomingMessage | http2.Http2ServerRequest;
    readonly req: http.IncomingMessage | http2.Http2ServerRequest;
    readonly res: http.ServerResponse | http2.Http2ServerResponse;
    readonly body: any;
    readonly params?: { [k: string]: string | undefined };
    readonly next?: Function;
    headers: http.IncomingHttpHeaders | http2.IncomingHttpHeaders;
    url: string;
    method: string;
    path: string;
    baseUrl: string;
    cookies: any;
    fresh: any;
    hostname: string;
    ip: string;
    ips: string[];
    originalUrl: string;
    protocol: string;
    secure: boolean;
    stale: boolean;
    subdomains: string[];
    xhr: boolean;
    getHeader(name?: string): string | string[] | null;
}
