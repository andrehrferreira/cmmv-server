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
import * as zlib from 'node:zlib';
export type CompressionOptions = zlib.ZlibOptions & {
    threshold?: number;
    cacheEnabled?: boolean;
    cacheTimeout?: number;
};
export declare class CompressionMiddleware {
    middlewareName: string;
    private options;
    private cache;
    constructor(options?: CompressionOptions);
    process(req: any, res: any, next?: any): Promise<void>;
    onCall(req: any, res: any, payload: any, done: any, express?: boolean): Promise<Buffer | Error>;
    expressCompatibility(req: any, res: any, next: any, opts: any): void;
    createCompressionStream(method: string): zlib.BrotliCompress;
    compressData(inputBuffer: Buffer, compressionStream: zlib.Gzip | zlib.Deflate): Promise<Buffer>;
    filter(res: any): boolean;
    shouldTransform(res: any): boolean;
    generateHash(encoding: string, body: Buffer): string;
    flush(): void;
}
export default function (options?: CompressionOptions): Promise<(req: any, res: any, next: any) => Promise<void>>;
