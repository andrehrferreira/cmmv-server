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
import { Buffer } from 'safe-buffer';
import * as http from 'node:http';
import * as http2 from 'node:http2';
import * as zlib from 'node:zlib';
import { ServerMiddleware, INext } from '@cmmv/server-common';
export type CompressionOptions = zlib.ZlibOptions & {
    threshold?: number;
    express?: boolean;
    cacheEnabled?: boolean;
    cacheTimeout?: number;
};
export declare class CMMVCompression extends ServerMiddleware {
    middlewareName: string;
    afterProcess: boolean;
    private options;
    private cache;
    constructor(options?: CompressionOptions);
    process(req: http.IncomingMessage | http2.Http2ServerRequest, res: http.ServerResponse | http2.Http2ServerResponse, next?: INext): Promise<void>;
    expressCompatibility(req: any, res: any, next: any, opts: any): void;
    createCompressionStream(method: string): zlib.BrotliCompress;
    compressData(inputBuffer: Buffer, compressionStream: zlib.Gzip | zlib.Deflate): Promise<Buffer>;
    filter(res: any): boolean;
    shouldTransform(res: any): boolean;
    generateHash(encoding: string, body: Buffer): string;
    flush(): void;
}
export default function (options?: CompressionOptions): CMMVCompression | ((req: any, res: any, next: any) => Promise<void>);
