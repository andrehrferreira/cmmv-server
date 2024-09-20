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
import * as zlib from 'node:zlib';
import { ServerMiddleware, INext } from '@cmmv/server-common';
import { Request, Response } from '@cmmv/server';
declare class CMMVCompression extends ServerMiddleware {
    middlewareName: string;
    afterProcess: boolean;
    private options;
    private cache;
    private cacheEnabled;
    private cacheTimeout;
    constructor(options?: zlib.ZlibOptions, cacheEnabled?: boolean, cacheTimeout?: number);
    process(req: Request, res: Response, next?: INext): Promise<void>;
    createCompressionStream(method: string): zlib.BrotliCompress;
    compressData(inputBuffer: Buffer, compressionStream: zlib.Gzip | zlib.Deflate): Promise<Buffer>;
    filter(res: Response): boolean;
    shouldTransform(res: Response): boolean;
    generateHash(encoding: string, body: Buffer): string;
    flush(): void;
}
export default function (options?: zlib.ZlibOptions): CMMVCompression;
export {};
