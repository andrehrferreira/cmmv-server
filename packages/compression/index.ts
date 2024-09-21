/*!
 * CMMV Compression
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/compression
 */

import * as compressible from 'compressible';
import * as vary from 'vary';
import * as accepts from 'accepts';
import * as bytes from 'bytes';
import { Buffer } from 'safe-buffer';

import * as http from 'node:http';
import * as http2 from 'node:http2';
import * as zlib from 'node:zlib';
import * as crypto from 'node:crypto';

import {
    ServerMiddleware,
    INext,
    IRequest,
    IRespose,
} from '@cmmv/server-common';

import { Request, Response } from '@cmmv/server';

export type CompressionOptions = zlib.ZlibOptions & {
    threshold?: number;
    express?: boolean;
    cacheEnabled?: boolean;
    cacheTimeout?: number;
};

export class CMMVCompression extends ServerMiddleware {
    public middlewareName: string = 'compression';

    public override afterProcess: boolean = true;

    private options: CompressionOptions;
    private cache: Map<string, { buffer: Buffer; timestamp: number }> =
        new Map();

    constructor(options?: CompressionOptions) {
        super();
        this.options = options || {};

        this.options.threshold =
            (options && options.threshold) || options?.threshold === 0
                ? bytes.parse(options.threshold)
                : 1024;

        if (this.options.threshold == null) this.options.threshold = 1024;
    }

    async process(
        req: Request | http.IncomingMessage | http2.Http2ServerRequest,
        res: Response | http.ServerResponse | http2.Http2ServerResponse,
        next?: INext,
    ) {
        try {
            const reqTest =
                req instanceof http.IncomingMessage ||
                req instanceof http2.Http2ServerRequest
                    ? req
                    : req.httpRequest;
            const resTest =
                res instanceof http.ServerResponse ||
                res instanceof http2.Http2ServerResponse
                    ? res
                    : res.httpResponse;

            const acceptHeader =
                req instanceof Request
                    ? req.getHeader('accept-encoding')
                    : req.headers['accept-encoding'];
            const accept = accepts(
                (req instanceof Request
                    ? req.httpRequest
                    : req) as http.IncomingMessage,
            );
            let method = accept.encoding(['br', 'gzip', 'deflate', 'identity']);

            if (method === 'gzip' && accept.encoding(['br'])) method = 'br';

            console.log(this.filter(res), this.shouldTransform(res));
            if (this.filter(res) && this.shouldTransform(res)) {
                vary(resTest as http.ServerResponse, 'Accept-Encoding');

                if (req.method === 'HEAD') {
                    next();
                    return;
                }

                const encoding =
                    res.getHeader('Content-Encoding') || 'identity';
                const contentLenght = res.getHeader('Content-Length');

                if (
                    (Number(contentLenght) < this.options.threshold &&
                        !Number.isNaN(contentLenght)) ||
                    (res instanceof Response &&
                        res.buffer.length < this.options.threshold)
                ) {
                    next();
                    return;
                }

                if (encoding !== 'identity') {
                    next();
                    return;
                }

                if (!method || method === 'identity') {
                    next();
                    return;
                }

                if (res instanceof Response) {
                    const hashKey = this.generateHash(method, res.buffer);

                    if (this.options.cacheEnabled && this.cache.has(hashKey)) {
                        const cacheEntry = this.cache.get(hashKey);

                        if (
                            Date.now() - cacheEntry.timestamp <
                            this.options.cacheTimeout
                        ) {
                            resTest.setHeader('Content-Encoding', method);
                            resTest.removeHeader('Content-Length');

                            if (res instanceof Response) {
                                res.set('Content-Encoding', method);
                                res.remove('Content-Length');
                                res.buffer = cacheEntry.buffer;
                            }

                            next();
                            return;
                        } else {
                            this.cache.delete(hashKey);
                        }
                    }
                }

                const stream = this.createCompressionStream(method);

                if (!stream) {
                    next();
                    return;
                }

                if (res instanceof Response) {
                    res.set('Content-Encoding', method);
                    res.remove('Content-Length');

                    const compressedBuffer = await this.compressData(
                        res.buffer,
                        stream,
                    );

                    res.buffer = compressedBuffer;
                } else {
                    resTest.setHeader('Content-Encoding', method);
                    resTest.removeHeader('Content-Length');
                }
            }

            next();
        } catch (err) {
            console.error(err);
            next();
        }
    }

    createCompressionStream(method: string) {
        switch (method) {
            case 'br':
                return zlib.createBrotliCompress(this.options);
            case 'gzip':
                return zlib.createGzip(this.options);
            case 'deflate':
                return zlib.createDeflate(this.options);
            default:
                return null;
        }
    }

    async compressData(
        inputBuffer: Buffer,
        compressionStream: zlib.Gzip | zlib.Deflate,
    ): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];

            compressionStream.on('data', chunk => {
                chunks.push(chunk);
            });

            compressionStream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });

            compressionStream.on('error', err => {
                reject(err);
            });

            compressionStream.end(inputBuffer);
        });
    }

    filter(res: any) {
        const type =
            res.getHeader('Content-Type') || res.headers['Content-Type'];
        console.log(type);
        return !(type === undefined || !compressible(type));
    }

    shouldTransform(res: any) {
        const cacheControl =
            res.getHeader('Cache-Control') || res.headers['Cache-Control'];
        console.log(cacheControl);
        return (
            !cacheControl ||
            !/(?:^|,)\s*?no-transform\s*?(?:,|$)/.test(cacheControl as string)
        );
    }

    generateHash(encoding: string, body: Buffer): string {
        const hash = crypto.createHash('md5');
        hash.update(encoding + body.toString('base64'));
        return hash.digest('hex');
    }

    flush() {
        const now = Date.now();

        this.cache.forEach((value, key) => {
            if (now - value.timestamp >= this.options.cacheTimeout)
                this.cache.delete(key);
        });
    }
}

export default function (options?: CompressionOptions) {
    const middleware = new CMMVCompression(options);

    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else return middleware;
}
