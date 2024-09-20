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
import * as zlib from 'node:zlib';
import * as crypto from 'node:crypto';

import { ServerMiddleware, INext } from '@cmmv/server-common';

import { Request, Response } from '@cmmv/server';

type CompressOptions = zlib.ZlibOptions & { threshold?: number };

class CMMVCompression extends ServerMiddleware {
    public middlewareName: string = 'compression';

    public override afterProcess: boolean = true;

    private options: CompressOptions;
    private cache: Map<string, { buffer: Buffer; timestamp: number }> =
        new Map();
    private cacheEnabled: boolean;
    private cacheTimeout: number;

    constructor(
        options?: CompressOptions,
        cacheEnabled = true,
        cacheTimeout = 15000,
    ) {
        super();
        this.options = options || {};

        this.options.threshold =
            options && options.threshold
                ? bytes.parse(options.threshold)
                : 1024;

        if (this.options.threshold == null) this.options.threshold = 1024;

        this.cacheEnabled = cacheEnabled;
        this.cacheTimeout = cacheTimeout;
    }

    async process(req: Request, res: Response, next?: INext) {
        const accept = accepts(req.httpRequest as http.IncomingMessage);
        let method = accept.encoding(['br', 'gzip', 'deflate', 'identity']);

        if (method === 'gzip' && accept.encoding(['br'])) method = 'br';

        if (req.method === 'HEAD') {
            next();
            return;
        } else if (this.filter(res) && this.shouldTransform(res)) {
            const encoding = res.get('Content-Encoding') || 'identity';

            if (res.buffer.length < this.options.threshold) {
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

            vary(res.httpResponse as http.ServerResponse, 'Accept-Encoding');

            const hashKey = this.generateHash(method, res.buffer);

            if (this.cacheEnabled && this.cache.has(hashKey)) {
                const cacheEntry = this.cache.get(hashKey);

                if (Date.now() - cacheEntry.timestamp < this.cacheTimeout) {
                    res.set('Content-Encoding', method);
                    res.remove('Content-Length');
                    res.buffer = cacheEntry.buffer;
                    next();
                    return;
                } else {
                    this.cache.delete(hashKey);
                }
            }

            const stream = this.createCompressionStream(method);

            if (!stream) {
                next();
                return;
            }

            res.set('Content-Encoding', method);
            res.remove('Content-Length');

            const compressedBuffer = await this.compressData(
                res.buffer,
                stream,
            );

            res.buffer = compressedBuffer;
        }

        next();
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

    filter(res: Response) {
        const type = res.get('Content-Type');
        return !(type === undefined || !compressible(type));
    }

    shouldTransform(res: Response) {
        const cacheControl = res.get('Cache-Control');
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
            if (now - value.timestamp >= this.cacheTimeout)
                this.cache.delete(key);
        });
    }
}

export default function (options?: CompressOptions) {
    return new CMMVCompression(options);
}
