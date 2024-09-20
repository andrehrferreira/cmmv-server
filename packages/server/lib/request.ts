import * as http from 'node:http';
import * as https from 'node:https';
import * as http2 from 'node:http2';
import * as url from 'node:url';

import * as cookie from 'cookie';

import { IRequest } from '@cmmv/server-common';

import { ServerApplication } from './application';

export class Request implements IRequest {
    constructor(
        public readonly app: ServerApplication,
        public readonly req: http.IncomingMessage | http2.Http2ServerRequest,
        public readonly res: http.ServerResponse | http2.Http2ServerResponse,
        public readonly body: any,
        public readonly params?: { [k: string]: string | undefined },
    ) {}

    get httpRequest() {
        return this.req;
    }

    get method() {
        return this.req.method;
    }

    get path() {
        return url.parse(this.req.url, true).pathname;
    }

    get baseUrl() {
        return this.req['baseUrl'] || '';
    }

    get cookies() {
        return cookie.parse(this.req.headers.cookie || '');
    }

    get fresh() {
        return this.req['fresh'];
    }

    get hostname() {
        return this.req.headers.host?.split(':')[0];
    }

    get ip() {
        return this.req.socket.remoteAddress;
    }

    get ips() {
        return ((this.req.headers['x-forwarded-for'] as string) || '')
            .split(',')
            .map(ip => ip.trim());
    }

    get originalUrl() {
        return this.req['originalUrl'] || this.req.url;
    }

    get protocol() {
        if (this.app.socket instanceof https.Server) return 'https';

        if (this.req.headers[':scheme'] === 'https') return 'https';

        return 'http';
    }

    get query() {
        return url.parse(this.req.url, true).query;
    }

    get secure() {
        return this.protocol === 'https';
    }

    get stale() {
        return !this.fresh;
    }

    get subdomains() {
        const hostname = this.hostname || '';
        return hostname.split('.').slice(0, -2);
    }

    get xhr() {
        const requestedWith = this.req.headers['x-requested-with'];

        if (typeof requestedWith === 'string')
            return requestedWith.toLowerCase() === 'xmlhttprequest';

        return false;
    }
}
