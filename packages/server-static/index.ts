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

import * as http from "node:http";
import * as url from "node:url";
import { stat } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "node:url";
import { promisify } from "node:util";

import * as send from "send";
import * as encodeUrl from "encodeurl";
import * as escapeHtml from "escape-html";
import * as parseUrl from "parseurl";

const statAsync = promisify(stat);

export interface StaticOptions {
    root: string;
    maxAge?: number;
    cacheControl?: boolean;
    dotfiles?: "allow" | "deny" | "ignore";
    index?: string | boolean;
    fallthrough?: boolean;
    redirect?: boolean;
    immutable?: boolean;
    lastModified?: boolean;
    etag?: boolean;
    extensions?: any;
    setHeaders?: (res, path, stat) => void;
}

function createHtmlDocument (title, body) {
    return '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '<meta charset="utf-8">\n' +
      '<title>' + title + '</title>\n' +
      '</head>\n' +
      '<body>\n' +
      '<pre>' + body + '</pre>\n' +
      '</body>\n' +
      '</html>\n'
}

function collapseLeadingSlashes (str) {
    let i;

    for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) !== 0x2f) {
            break;
        }
    }
  
    return i > 1 ? '/' + str.substr(i) : str
}

export class ServerStaticMiddleware {
    public middlewareName: string = "server-static";

    private root: string;
    private rootResolve: string;
    private options: StaticOptions;

    constructor(root: string, options?: StaticOptions) {
        
        this.root = root;
        this.rootResolve = resolve(root);

        this.options = {
            etag: options?.etag || true,
            maxAge: options?.maxAge || 0,
            cacheControl: options?.cacheControl !== false,
            dotfiles: options?.dotfiles || "ignore",
            index: options?.index !== undefined ? options.index : "index.html",
            fallthrough: options?.fallthrough || false,
            redirect: options?.redirect || false,
            immutable: options?.immutable || false,
            lastModified: options?.lastModified || true,
            extensions: options?.lastModified || false,
            root: options?.root || resolve(root),
            setHeaders: options?.setHeaders || null,
        };
    }

    async process(req: http.IncomingMessage, res: http.ServerResponse, next: Function) {
        try {
            const pathname = url.parse(req.url, true).pathname;

            const onDirectory = this.options.redirect
                ? this.createRedirectDirectoryListener()
                : this.createNotFoundDirectoryListener()

            if(req.method !== 'GET' && req.method !== 'HEAD'){
                if (this.options.fallthrough) 
                    return next()
                            
                res.statusCode = 405
                res.setHeader('Allow', 'GET, HEAD')
                res.setHeader('Content-Length', '0')
                res.end()
                return;
            }

            let forwardError = !this.options.fallthrough;

            if(pathname.startsWith("/")){
                const parsedUrl = parse(req.url);
                const filePath = join(this.rootResolve, decodeURIComponent(parsedUrl.pathname));
                let fileStat;

                try {
                    fileStat = await statAsync(filePath);
                } catch (err) {
                    return next();
                }

                const stream = send(req, pathname, this.options);

                if(this.options.setHeaders && typeof this.options.setHeaders === "function")
                    this.options.setHeaders(res, pathname, fileStat);

                stream.on('directory', onDirectory);

                if (this.options.fallthrough) {
                    stream.on('file', function onFile () {
                        forwardError = true
                    })
                }

                stream.on('error', function error (err) {
                    if (forwardError || !(err.statusCode < 500)) {
                        next(err)
                        return;
                    }
              
                    next()
                });

                stream.pipe(res);
            }
            else{
                next();
            }
        } catch (err) {
            console.error(err);
            next();
        }
    }

    createNotFoundDirectoryListener () {
        return function notFound (this: any) {
          this.error(404)
        }
    }

    createRedirectDirectoryListener () {
        return function redirect (this: any, res: any) {
            if (this.hasTrailingSlash()) {
                this.error(404)
                return
            }
        
            const originalUrl = parseUrl.original(this.req);
        
            originalUrl.path = null
            originalUrl.pathname = collapseLeadingSlashes(originalUrl.pathname + '/')
        
            const loc = encodeUrl(url.format(originalUrl))
            const doc = createHtmlDocument('Redirecting', 'Redirecting to ' + escapeHtml(loc))
        
            res.statusCode = 301
            res.setHeader('Content-Type', 'text/html; charset=UTF-8')
            res.setHeader('Content-Length', Buffer.byteLength(doc))
            res.setHeader('Content-Security-Policy', "default-src 'none'")
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.setHeader('Location', loc)
            res.end(doc);
        }
    }
}

export default function serveStatic(root: string, options?: StaticOptions) {
    if (!root)
        throw new TypeError('root path required')
      
    if (typeof root !== 'string') 
        throw new TypeError('root path must be a string')
    
    return new ServerStaticMiddleware(root, options);
}
