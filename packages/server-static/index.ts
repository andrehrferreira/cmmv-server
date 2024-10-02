/*!
 * serve-static
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 *
 * @see https://github.com/expressjs/serve-static
 */

/**
 * fastify-static
 * Copyright (c) 2017-2023 Fastify
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify-static
 */

import * as url from 'node:url';
import * as zlib from 'node:zlib';
import * as path from 'node:path';
import { statSync } from 'node:fs';

import * as fg from 'fast-glob';
import * as send from '@fastify/send';
import * as encodingNegotiator from '@fastify/accept-negotiator';
import * as encodeUrl from 'encodeurl';
import * as escapeHtml from 'escape-html';
import * as parseUrl from 'parseurl';

export interface StaticOptions {
    root?: string;
    prefix?: string;
    maxAge?: number;
    cacheControl?: boolean;
    dotfiles?: 'allow' | 'deny' | 'ignore';
    serverDotfiles?: boolean;
    index?: string | boolean;
    fallthrough?: boolean;
    redirect?: boolean;
    immutable?: boolean;
    lastModified?: boolean;
    etag?: boolean;
    extensions?: any;
    acceptRanges?: boolean;
    preCompressed?: boolean;
    allowedPath?: any;
    setHeaders?: (res, path, stat) => void;
}

function createHtmlDocument(title, body) {
    return (
        '<!DOCTYPE html>\n' +
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
        '</html>\n'
    );
}

function collapseLeadingSlashes(str) {
    let i;

    for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) !== 0x2f) break;
    }

    return i > 1 ? '/' + str.substr(i) : str;
}

export class ServerStaticMiddleware {
    public middlewareName: string = 'server-static';

    private app: any;
    private root: string | string[];
    private options: StaticOptions;

    constructor(root: string | string[], options?: StaticOptions) {
        this.root = root;

        this.options = {
            etag: options?.etag ?? true,
            prefix: options?.prefix ?? '/',
            maxAge: options?.maxAge ?? 0,
            cacheControl: options?.cacheControl ?? true,
            dotfiles: options?.dotfiles || 'allow',
            index:
                options?.index || options?.index === false
                    ? options?.index
                    : 'index.html',
            fallthrough: options?.fallthrough !== false,
            redirect: options?.redirect !== false,
            immutable: options?.immutable ?? false,
            lastModified: options?.lastModified ?? true,
            extensions: options?.extensions || false,
            acceptRanges: options?.acceptRanges ?? true,
            preCompressed: options?.preCompressed ?? false,
            serverDotfiles: options?.serverDotfiles ?? false,
            setHeaders: options?.setHeaders ?? null,
            allowedPath: options?.allowedPath ?? null,
        };
    }

    async process(server, done) {
        if (server && typeof server.app.addHook == 'function') {
            this.app = server.app;
            server.app.addHook('onListen', this.onCall.bind(this));
        }
        //else this.onCall.call(this, server, done);
    }

    async onCall() {
        const indexes =
            this.options.index === undefined
                ? ['index.html']
                : [].concat(this.options.index);
        const indexDirs = new Map();
        const routes = new Set();
        const roots = Array.isArray(this.root) ? this.root : [this.root];

        const routeOpts = {
            errorHandler(error, request, reply) {
                if (error?.code === 'ERR_STREAM_PREMATURE_CLOSE') {
                    reply.request.raw.destroy();
                    return;
                }
            },
        };

        for (let rootPath of roots) {
            rootPath = rootPath.split(path.win32.sep).join(path.posix.sep);
            !rootPath.endsWith('/') && (rootPath += '/');

            const files = await fg(['**/**'], {
                cwd: rootPath,
                absolute: false,
                followSymbolicLinks: true,
                onlyFiles: true,
                dot: this.options.serverDotfiles,
            });

            for (let file of files) {
                file = file.split(path.win32.sep).join(path.posix.sep);
                const route = this.options.prefix + file;

                if (routes.has(route)) continue;

                routes.add(route);

                this.setUpHeadAndGet(routeOpts, route, `/${file}`, rootPath);

                const key = path.posix.basename(route);

                if (indexes.includes(key) && !indexDirs.has(key))
                    indexDirs.set(path.posix.dirname(route), rootPath);
            }
        }
    }

    setUpHeadAndGet(routeOpts, route, file, rootPath) {
        const toSetUp = Object.assign({}, routeOpts, {
            method: ['HEAD', 'GET'],
            url: route,
            handler: this.serveFileHandler.bind(this),
        });
        toSetUp.config = toSetUp.config || {};
        toSetUp.config.file = file;
        toSetUp.config.rootPath = rootPath;
        this.app.addRoute(toSetUp);
    }

    async serveFileHandler(req, res) {
        // TODO: remove the fallback branch when bump major
        /* c8 ignore next */
        const routeConfig = req.routeOptions?.config || req.routeConfig;
        return this.pumpSendToReply(
            req,
            res,
            routeConfig.file,
            routeConfig.rootPath,
        );
    }

    async pumpSendToReply(
        req,
        res,
        pathname,
        rootPath,
        rootPathOffset = 0,
        pumpOptions?,
        checkedEncodings?,
    ) {
        const sendOptions = {
            root: this.options.root,
            acceptRanges: this.options.acceptRanges,
            cacheControl: this.options.cacheControl,
            dotfiles: this.options.dotfiles,
            etag: this.options.etag,
            extensions: this.options.extensions,
            immutable: this.options.immutable,
            index: this.options.index,
            lastModified: this.options.lastModified,
            maxAge: this.options.maxAge,
        };
        const setHeaders = this.options.setHeaders;

        if (
            setHeaders !== undefined &&
            setHeaders !== null &&
            typeof setHeaders !== 'function'
        )
            throw new TypeError('The `setHeaders` option must be a function');

        const allowedPath = this.options.allowedPath;
        const pathnameOrig = pathname;
        const options = Object.assign({}, sendOptions, pumpOptions);

        if (rootPath) {
            if (Array.isArray(rootPath)) {
                options.root = rootPath[rootPathOffset];
            } else {
                options.root = rootPath;
            }
        }

        if (allowedPath && !allowedPath(pathname, options.root, req)) {
            return res.callNotFound();
        }

        let encoding;
        let pathnameForSend = pathname;

        if (this.options.preCompressed) {
            /**
             * We conditionally create this structure to track our attempts
             * at sending pre-compressed assets
             */
            if (!checkedEncodings) checkedEncodings = new Set();

            encoding = this.getEncodingHeader(
                req.req.headers,
                checkedEncodings,
            );

            if (encoding) {
                if (pathname.endsWith('/')) {
                    pathname = this.findIndexFile(
                        pathname,
                        options.root,
                        options.index,
                    );

                    if (!pathname) return req.callNotFound();

                    pathnameForSend =
                        pathnameForSend +
                        pathname +
                        '.' +
                        this.getEncodingExtension(encoding);
                } else {
                    pathnameForSend =
                        pathname + '.' + this.getEncodingExtension(encoding);
                }
            }
        }

        const { statusCode, headers, stream, type, metadata } = await send(
            req.req,
            encodeURI(pathnameForSend),
            options,
        );

        switch (type) {
            case 'file': {
                if (
                    setHeaders !== undefined &&
                    typeof setHeaders === 'function'
                )
                    setHeaders(res.res, metadata.path, metadata.stat);

                if (encoding) {
                    res.set('content-type', this.getContentType(pathname));
                    res.set('content-encoding', encoding);
                } else {
                    res.set('content-type', this.getContentType(pathname));
                }

                const buffer = await this.streamToBuffer(stream);
                await res.send(buffer);

                break;
            }
        }
    }

    async streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', err => reject(err));
        });
    }

    async compressData(
        inputBuffer: Buffer,
        compressionStream: zlib.Gzip | zlib.Deflate,
    ): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            compressionStream.on('data', chunk => chunks.push(chunk));
            compressionStream.on('end', () => resolve(Buffer.concat(chunks)));
            compressionStream.on('error', err => reject(err));
            compressionStream.end(inputBuffer);
        });
    }

    createNotFoundDirectoryListener() {
        return function notFound(this: any) {
            this.error(404);
        };
    }

    createRedirectDirectoryListener() {
        return function redirect(this: any, res: any) {
            if (this.hasTrailingSlash()) {
                this.error(404);
                return;
            }

            const originalUrl = parseUrl.original(this.req);

            originalUrl.path = null;
            originalUrl.pathname = collapseLeadingSlashes(
                originalUrl.pathname + '/',
            );

            const loc = encodeUrl(url.format(originalUrl));
            const doc = createHtmlDocument(
                'Redirecting',
                'Redirecting to ' + escapeHtml(loc),
            );

            res.statusCode = 301;
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
            res.setHeader('Content-Length', Buffer.byteLength(doc));
            res.setHeader('Content-Security-Policy', "default-src 'none'");
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Location', loc);
            res.end(doc);
        };
    }

    getContentType(path) {
        const type = send.mime.getType(path) || 'application/octet-stream';

        if (!send.isUtf8MimeType(type)) return type;

        return `${type}; charset=UTF-8`;
    }

    getEncodingHeader(headers, checked) {
        if (!('accept-encoding' in headers)) return;

        const asteriskRegex = /\*/gu;

        // consider the no-preference token as gzip for downstream compat
        const header = headers['accept-encoding']
            .toLowerCase()
            .replace(asteriskRegex, 'gzip');

        return encodingNegotiator.negotiate(
            header,
            ['br', 'gzip', 'deflate'].filter(enc => !checked.has(enc)),
        );
    }

    getEncodingExtension(encoding) {
        switch (encoding) {
            case 'br':
                return 'br';
            case 'gzip':
                return 'gz';
        }
    }

    findIndexFile(pathname, root, indexFiles = ['index.html']) {
        if (Array.isArray(indexFiles)) {
            return indexFiles.find(filename => {
                const p = path.join(root, pathname, filename);
                try {
                    const stats = statSync(p);
                    return !stats.isDirectory();
                } catch {
                    return false;
                }
            });
        }
        /* c8 ignore next */
        return false;
    }
}

export default async function serveStatic(
    root: string,
    options?: StaticOptions,
) {
    if (!root) throw new TypeError('root path required');

    if (typeof root !== 'string')
        throw new TypeError('root path must be a string');

    return (server, done) =>
        new ServerStaticMiddleware(root, options).process(server, done);
}

function statAsync(indexPath: string) {
    throw new Error('Function not implemented.');
}
