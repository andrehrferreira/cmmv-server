"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const compressible = require("compressible");
const vary = require("vary");
const accepts = require("accepts");
const safe_buffer_1 = require("safe-buffer");
const zlib = require("node:zlib");
const crypto = require("node:crypto");
const server_common_1 = require("@cmmv/server-common");
class CMMVCompression extends server_common_1.ServerMiddleware {
    constructor(options, cacheEnabled = true, cacheTimeout = 15000) {
        super();
        this.middlewareName = 'compression';
        this.afterProcess = true;
        this.cache = new Map();
        this.options = options;
        this.cacheEnabled = cacheEnabled;
        this.cacheTimeout = cacheTimeout;
    }
    async process(req, res, next) {
        const uuid = res.uuid;
        server_common_1.Telemetry.start('Compress Data', uuid);
        const accept = accepts(req.httpRequest);
        let method = accept.encoding(['br', 'gzip', 'deflate', 'identity']);
        if (method === 'gzip' && accept.encoding(['br']))
            method = 'br';
        if (req.method === 'HEAD') {
            server_common_1.Telemetry.end('Compress Data', uuid);
            next();
            return;
        }
        else if (this.filter(res) && this.shouldTransform(res)) {
            vary(res.httpResponse, 'Accept-Encoding');
            const encoding = res.get('Content-Encoding') || 'identity';
            if (encoding !== 'identity') {
                server_common_1.Telemetry.end('Compress Data', uuid);
                next();
                return;
            }
            if (!method || method === 'identity') {
                server_common_1.Telemetry.end('Compress Data', uuid);
                next();
                return;
            }
            const hashKey = this.generateHash(method, res.buffer);
            if (this.cacheEnabled && this.cache.has(hashKey)) {
                const cacheEntry = this.cache.get(hashKey);
                if (Date.now() - cacheEntry.timestamp < this.cacheTimeout) {
                    res.set('Content-Encoding', method);
                    res.remove('Content-Length');
                    res.buffer = cacheEntry.buffer;
                    server_common_1.Telemetry.end('Compress Data', uuid);
                    next();
                    return;
                }
                else {
                    this.cache.delete(hashKey);
                }
            }
            const stream = this.createCompressionStream(method);
            if (!stream) {
                server_common_1.Telemetry.end('Compress Data', uuid);
                next();
                return;
            }
            res.set('Content-Encoding', method);
            res.remove('Content-Length');
            const compressedBuffer = await this.compressData(res.buffer, stream);
            res.buffer = compressedBuffer;
        }
        server_common_1.Telemetry.end('Compress Data', uuid);
        next();
    }
    createCompressionStream(method) {
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
    async compressData(inputBuffer, compressionStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            compressionStream.on('data', chunk => {
                chunks.push(chunk);
            });
            compressionStream.on('end', () => {
                resolve(safe_buffer_1.Buffer.concat(chunks));
            });
            compressionStream.on('error', err => {
                reject(err);
            });
            compressionStream.end(inputBuffer);
        });
    }
    filter(res) {
        const type = res.get('Content-Type');
        return !(type === undefined || !compressible(type));
    }
    shouldTransform(res) {
        const cacheControl = res.get('Cache-Control');
        return (!cacheControl ||
            !/(?:^|,)\s*?no-transform\s*?(?:,|$)/.test(cacheControl));
    }
    generateHash(encoding, body) {
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
function default_1(options) {
    return new CMMVCompression(options);
}
