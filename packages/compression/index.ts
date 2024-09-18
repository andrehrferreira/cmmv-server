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

import * as compressible from "compressible";
import * as vary from "vary";
import * as accepts from "accepts";
import { Buffer } from "safe-buffer";

import * as zlib from "node:zlib";

import { Request, Response, ServerMiddleware } from "@cmmv/server";

class CMMVCompression extends ServerMiddleware {
    public middlewareName: string = "Compression";

    public override afterProcess: boolean = true;

    private options: zlib.ZlibOptions;
    
    constructor(options?: zlib.ZlibOptions){
        super();
        this.options = options;
    }

    async process(req: Request, res: Response, next?: Function) {

        if (this.filter(req, res) && this.shouldTransform(req, res)) {
            vary(res.httpResponse, 'Accept-Encoding');

            const encoding = res.get('Content-Encoding') || 'identity';

            if (encoding !== 'identity')
                return;

            if (req.method === 'HEAD')
                return;

            const accept = accepts(req.httpRequest);
            let method = accept.encoding(['gzip', 'deflate', 'identity']);

            if (method === 'deflate' && accept.encoding(['gzip'])) 
                method = accept.encoding(['gzip', 'identity']);
            
            if (!method || method === 'identity')
                return;

            const stream = method === 'gzip'
                ? zlib.createGzip(this.options)
                : zlib.createDeflate(this.options);

            res.set('Content-Encoding', method)
            res.remove('Content-Length');

            const compressedBuffer = await this.compressData(res.buffer, stream);
            res.buffer = compressedBuffer;
        }
        
        next();
    }

    async compressData(inputBuffer: Buffer, compressionStream: zlib.Gzip | zlib.Deflate): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
    
            compressionStream.on("data", (chunk) => {
                chunks.push(chunk);
            });
    
            compressionStream.on("end", () => {
                resolve(Buffer.concat(chunks));
            });
    
            compressionStream.on("error", (err) => {
                reject(err);
            });
    
            compressionStream.end(inputBuffer);
        });
    }
    
    filter(req: Request, res: Response){
        const type = res.get('Content-Type');
        return !(type === undefined || !compressible(type));
    }

    shouldTransform(req: Request, res: Response){
        const cacheControl = res.get('Cache-Control');
        return !cacheControl || !/(?:^|,)\s*?no-transform\s*?(?:,|$)/.test(cacheControl)
    }
}

export default function (options?: zlib.ZlibOptions){
    return new CMMVCompression(options);
};