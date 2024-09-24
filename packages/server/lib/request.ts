import * as http from 'node:http';
import * as https from 'node:https';
import * as http2 from 'node:http2';
import * as url from 'node:url';

import * as accepts from 'accepts';
import * as cookie from 'cookie';
import * as typeis from 'type-is';

import { IRequest } from '@cmmv/server-common';

import { ServerApplication } from './application';

import { parseurl, rangeParser, fresh } from '../utils';

export class Request implements IRequest {
    constructor(
        public readonly app: ServerApplication,
        public readonly req: http.IncomingMessage | http2.Http2ServerRequest,
        public readonly res: http.ServerResponse | http2.Http2ServerResponse,
        public readonly body: any,
        public readonly params?: { [k: string]: string | undefined },
        public readonly next?: Function,
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

    get url() {
        return this.req.url;
    }

    get baseUrl() {
        return this.req['baseUrl'] || '';
    }

    get cookies() {
        return cookie.parse(this.req.headers.cookie || '');
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
        const queryparse = this.app.get('query parser fn');

        if (!queryparse) return Object.create(null);

        const querystring = parseurl(this.req).query;

        return queryparse(querystring);
    }

    get secure() {
        return this.protocol === 'https';
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

    get header() {
        return (name: string) => this.getHeader(name);
    }

    get headers() {
        return this.req.headers;
    }

    get get() {
        return (name: string) => this.getHeader(name);
    }

    getHeader(name): string | string[] | null {
        if (!name) {
            throw new TypeError('name argument is required to req.get');
        }

        if (typeof name !== 'string') {
            throw new TypeError('name must be a string to req.get');
        }

        const lc = name.toLowerCase();

        switch (lc) {
            case 'referer':
            case 'referrer':
                return this.req.headers.referrer || this.req.headers.referer;
            default:
                return this.req.headers[lc];
        }
    }

    //compatibility Expressjs
    get accepts() {
        return (...args: string[]) => {
            const accept = accepts(this.req as http.IncomingMessage);
            return accept.types.apply(accept, args);
        };
    }

    get acceptsEncodings() {
        return (...args: string[]) => {
            const accept = accepts(this.req as http.IncomingMessage);
            return accept.encodings.apply(accept, args);
        };
    }

    get acceptsCharsets() {
        return (...args: string[]) => {
            const accept = accepts(this.req as http.IncomingMessage);
            return accept.charsets.apply(accept, args);
        };
    }

    get acceptsLanguages() {
        return (...args: string[]) => {
            const accept = accepts(this.req as http.IncomingMessage);
            return accept.languages.apply(accept, args);
        };
    }

    get range() {
        return (size, options) => {
            const range = this.get('Range');
            if (!range) return;
            return rangeParser(size, range as string, options);
        };
    }

    get is() {
        return types => {
            let arr = types;

            if (!Array.isArray(types)) {
                arr = new Array(arguments.length);

                for (let i = 0; i < arr.length; i++) arr[i] = arguments[i];
            }

            return typeis(this, arr);
        };
    }

    get host() {
        return () => {
            let trust = this.app.get('trust proxy fn');
            let val = this.get('X-Forwarded-Host');

            if (!val || !trust(this.req.socket.remoteAddress, 0)) {
                val = this.get('Host');
            } else if (val.indexOf(',') !== -1) {
                // Note: X-Forwarded-Host is normally only ever a
                //       single value, but this is to be safe.
                val = (val as string)
                    .substring(0, val.indexOf(','))
                    .trimRight();
            }

            return val || undefined;
        };
    }

    get fresh() {
        return () => {
            const method = this.method;
            const res = this.res;
            const status = res.statusCode;

            // GET or HEAD for weak freshness validation only
            if ('GET' !== method && 'HEAD' !== method) return false;

            // 2xx or 304 as per rfc2616 14.26
            if ((status >= 200 && status < 300) || 304 === status) {
                return fresh(this.req.headers, {
                    etag: res.getHeader('ETag'),
                    'last-modified': res.getHeader('Last-Modified'),
                });
            }

            return false;
        };
    }

    get stale() {
        return !this.fresh;
    }
}
