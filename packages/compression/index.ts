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

export type CompressionOptions = zlib.ZlibOptions & {
    threshold?: number;
    express?: boolean;
    cacheEnabled?: boolean;
    cacheTimeout?: number;
};

const onHeaders = require('on-headers');

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
        req: http.IncomingMessage | http2.Http2ServerRequest,
        res: http.ServerResponse | http2.Http2ServerResponse,
        next?: INext,
    ) {
        try {
            const acceptHeader = req.headers['accept-encoding'];
            const accept = accepts(req as http.IncomingMessage);

            let method = accept.encoding(['br', 'gzip', 'deflate', 'identity']);

            if (method === 'gzip' && accept.encoding(['br'])) method = 'br';

            if (this.filter(res) && this.shouldTransform(res)) {
                if (this.options.express)
                    this.expressCompatibility(req, res, next, this.options);
                else {
                    vary(res as http.ServerResponse, 'Accept-Encoding');

                    if (req.method === 'HEAD') {
                        next();
                        return;
                    }

                    const encoding =
                        res.getHeader('Content-Encoding') || 'identity';
                    const contentLenght = res.getHeader('Content-Length');

                    /*if (
                        (Number(contentLenght) < this.options.threshold &&
                            !Number.isNaN(contentLenght)) ||
                        (res instanceof Response &&
                            res.buffer.length < this.options.threshold)
                    ) {
                        next();
                        return;
                    }*/

                    if (encoding !== 'identity') {
                        next();
                        return;
                    }

                    if (!method || method === 'identity') {
                        next();
                        return;
                    }

                    /*if (res instanceof Response) {
                        const hashKey = this.generateHash(method, res.buffer);

                        if (
                            this.options.cacheEnabled &&
                            this.cache.has(hashKey)
                        ) {
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
                    }*/

                    const stream = this.createCompressionStream(method);

                    if (!stream) {
                        next();
                        return;
                    }

                    /*if (res instanceof Response) {
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
                    }*/
                }
            }

            next();
        } catch (err) {
            console.error(err);
            next();
        }
    }

    expressCompatibility(req, res, next, opts) {
        const filter = opts.filter || shouldCompress;

        let ended = false;
        let length;
        let listeners = [];
        let stream;

        const _end = res.end;
        const _on = res.on;
        const _write = res.write;

        res.flush = function flush() {
            if (stream) stream.flush();
        };

        res.write = function write(chunk, encoding) {
            if (ended) return false;

            if (!this._header) this._implicitHeader();

            return stream
                ? stream.write(toBuffer(chunk, encoding))
                : _write.call(this, chunk, encoding);
        };

        res.end = function end(chunk, encoding) {
            if (ended) return false;

            if (!this._header) {
                // estimate the length
                if (!this.getHeader('Content-Length'))
                    length = chunkLength(chunk, encoding);

                this._implicitHeader();
            }

            if (!stream) return _end.call(this, chunk, encoding);

            // mark ended
            ended = true;

            // write Buffer for Node.js 0.8
            return chunk ? stream.end(toBuffer(chunk, encoding)) : stream.end();
        };

        res.on = function on(type, listener) {
            if (!listeners || type !== 'drain')
                return _on.call(this, type, listener);

            if (stream) return stream.on(type, listener);

            // buffer listeners for future stream
            listeners.push([type, listener]);

            return this;
        };

        function nocompress(msg) {
            addListeners(res, _on, listeners);
            listeners = null;
        }

        onHeaders(res, function onResponseHeaders() {
            if (!filter(req, res)) {
                nocompress('filtered');
                return;
            }

            if (!shouldTransform(req, res)) {
                nocompress('no transform');
                return;
            }

            vary(res, 'Accept-Encoding');

            if (
                Number(res.getHeader('Content-Length')) < opts.threshold ||
                length < opts.threshold
            ) {
                nocompress('size below threshold');
                return;
            }

            const encoding = res.getHeader('Content-Encoding') || 'identity';

            if (encoding !== 'identity') {
                nocompress('already encoded');
                return;
            }

            if (req.method === 'HEAD') {
                nocompress('HEAD request');
                return;
            }

            const accept = accepts(req);
            let method = accept.encoding(['gzip', 'deflate', 'identity']);

            if (method === 'deflate' && accept.encoding(['gzip']))
                method = accept.encoding(['gzip', 'identity']);

            if (!method || method === 'identity') {
                nocompress('not acceptable');
                return;
            }

            stream =
                method === 'gzip'
                    ? zlib.createGzip(opts)
                    : zlib.createDeflate(opts);

            addListeners(stream, stream.on, listeners);

            res.setHeader('Content-Encoding', method);
            res.removeHeader('Content-Length');

            stream.on('data', function onStreamData(chunk) {
                if (_write.call(res, chunk) === false) stream.pause();
            });

            stream.on('end', function onStreamEnd() {
                _end.call(res);
            });

            _on.call(res, 'drain', function onResponseDrain() {
                stream.resume();
            });
        });
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
        return !(type === undefined || !compressible(type));
    }

    shouldTransform(res: any) {
        const cacheControl =
            res.getHeader('Cache-Control') || res.headers['Cache-Control'];
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

/**
 * Add bufferred listeners to stream
 * @private
 */

function addListeners(stream, on, listeners) {
    for (let i = 0; i < listeners.length; i++) {
        on.apply(stream, listeners[i]);
    }
}

/**
 * Get the length of a given chunk
 */
function chunkLength(chunk, encoding) {
    if (!chunk) return 0;

    return !Buffer.isBuffer(chunk)
        ? Buffer.byteLength(chunk, encoding)
        : chunk.length;
}

/**
 * Default filter function.
 * @private
 */
function shouldCompress(req, res) {
    const type = res.getHeader('Content-Type');

    if (type === undefined || !compressible(type)) return false;

    return true;
}

/**
 * Determine if the entity should be transformed.
 * @private
 */
function shouldTransform(req, res) {
    const cacheControlNoTransformRegExp = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;
    const cacheControl = res.getHeader('Cache-Control');

    // Don't compress for Cache-Control: no-transform
    // https://tools.ietf.org/html/rfc7234#section-5.2.2.4
    return !cacheControl || !cacheControlNoTransformRegExp.test(cacheControl);
}

/**
 * Coerce arguments to Buffer
 * @private
 */
function toBuffer(chunk, encoding) {
    return !Buffer.isBuffer(chunk) ? Buffer.from(chunk, encoding) : chunk;
}
