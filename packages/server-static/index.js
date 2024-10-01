"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerStaticMiddleware = void 0;
exports.default = serveStatic;
const url = require("node:url");
const node_path_1 = require("node:path");
const send = require("send");
const encodeUrl = require("encodeurl");
const escapeHtml = require("escape-html");
const parseUrl = require("parseurl");
function createHtmlDocument(title, body) {
    return ('<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '<meta charset="utf-8">\n' +
        '<title>' +
        title +
        '</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '<pre>' +
        body +
        '</pre>\n' +
        '</body>\n' +
        '</html>\n');
}
function collapseLeadingSlashes(str) {
    let i;
    for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) !== 0x2f)
            break;
    }
    return i > 1 ? '/' + str.substr(i) : str;
}
class ServerStaticMiddleware {
    constructor(root, options) {
        this.middlewareName = 'server-static';
        this.root = root;
        this.rootResolve = (0, node_path_1.resolve)(root);
        this.options = {
            etag: options?.etag ?? true,
            maxAge: options?.maxAge ?? 0,
            cacheControl: options?.cacheControl ?? true,
            dotfiles: options?.dotfiles ?? 'ignore',
            index: options?.index || options?.index === false
                ? options?.index
                : 'index.html',
            fallthrough: options?.fallthrough !== false,
            redirect: options?.redirect !== false,
            immutable: options?.immutable ?? false,
            lastModified: options?.lastModified ?? true,
            extensions: options?.extensions || false,
            root: (0, node_path_1.resolve)(root),
            acceptRanges: options?.acceptRanges ?? true,
            setHeaders: options?.setHeaders ?? null,
        };
    }
    async process(req, res, next) {
        try {
            let pathname = parseUrl(req).pathname;
            const originalUrl = parseUrl.original(req);
            const decodedPath = decodeURIComponent(pathname);
            const onDirectory = this.options.redirect
                ? this.createRedirectDirectoryListener()
                : this.createNotFoundDirectoryListener();
            if (req.method !== 'GET' && req.method !== 'HEAD') {
                if (this.options.fallthrough)
                    return next();
                res.statusCode = 405;
                res.setHeader('Allow', 'GET, HEAD');
                res.setHeader('Content-Length', '0');
                res.end();
                return;
            }
            if (decodedPath.includes('..')) {
                res.statusCode = 403;
                res.end('Forbidden');
                return;
            }
            let forwardError = !this.options.fallthrough;
            if (pathname?.startsWith('/')) {
                if (pathname === '/' && originalUrl.pathname.substr(-1) !== '/')
                    pathname = '';
                const stream = send(req, pathname, this.options);
                stream.on('directory', onDirectory);
                if (this.options.setHeaders)
                    stream.on('headers', this.options.setHeaders);
                if (this.options.fallthrough) {
                    stream.on('file', function onFile() {
                        forwardError = true;
                    });
                }
                stream.on('error', function error(err) {
                    if (forwardError || !(err.statusCode < 500)) {
                        next(err);
                        return;
                    }
                    next();
                });
                stream.pipe(res);
            }
            else {
                next();
            }
        }
        catch (err) {
            next();
        }
    }
    async compressData(inputBuffer, compressionStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            compressionStream.on('data', chunk => chunks.push(chunk));
            compressionStream.on('end', () => resolve(Buffer.concat(chunks)));
            compressionStream.on('error', err => reject(err));
            compressionStream.end(inputBuffer);
        });
    }
    createNotFoundDirectoryListener() {
        return function notFound() {
            this.error(404);
        };
    }
    createRedirectDirectoryListener() {
        return function redirect(res) {
            if (this.hasTrailingSlash()) {
                this.error(404);
                return;
            }
            const originalUrl = parseUrl.original(this.req);
            originalUrl.path = null;
            originalUrl.pathname = collapseLeadingSlashes(originalUrl.pathname + '/');
            const loc = encodeUrl(url.format(originalUrl));
            const doc = createHtmlDocument('Redirecting', 'Redirecting to ' + escapeHtml(loc));
            res.statusCode = 301;
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
            res.setHeader('Content-Length', Buffer.byteLength(doc));
            res.setHeader('Content-Security-Policy', "default-src 'none'");
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Location', loc);
            res.end(doc);
        };
    }
}
exports.ServerStaticMiddleware = ServerStaticMiddleware;
function serveStatic(root, options) {
    if (!root)
        throw new TypeError('root path required');
    if (typeof root !== 'string')
        throw new TypeError('root path must be a string');
    return new ServerStaticMiddleware(root, options);
}
function statAsync(indexPath) {
    throw new Error('Function not implemented.');
}
