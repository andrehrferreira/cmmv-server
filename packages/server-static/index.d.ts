/*!
 * CMMV Compression
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/serve-static
 */
import * as zlib from 'node:zlib';
export interface StaticOptions {
    root?: string;
    maxAge?: number;
    cacheControl?: boolean;
    dotfiles?: 'allow' | 'deny' | 'ignore';
    index?: string | boolean;
    fallthrough?: boolean;
    redirect?: boolean;
    immutable?: boolean;
    lastModified?: boolean;
    etag?: boolean;
    extensions?: any;
    acceptRanges?: boolean;
    setHeaders?: (res: any, path: any, stat: any) => void;
}
export declare class ServerStaticMiddleware {
    middlewareName: string;
    private root;
    private rootResolve;
    private options;
    constructor(root: string, options?: StaticOptions);
    process(req: any, res: any, next?: any): Promise<any>;
    compressData(inputBuffer: Buffer, compressionStream: zlib.Gzip | zlib.Deflate): Promise<Buffer>;
    createNotFoundDirectoryListener(): (this: any) => void;
    createRedirectDirectoryListener(): (this: any, res: any) => void;
}
export default function serveStatic(root: string, options?: StaticOptions): ServerStaticMiddleware;
