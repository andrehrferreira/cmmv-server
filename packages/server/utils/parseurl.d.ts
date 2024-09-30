/*!
 * parseurl
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
import * as http from 'node:http';
import * as http2 from 'node:http2';
type Req = (http.IncomingMessage | http2.Http2ServerRequest) & {
    originalUrl?: string;
    _parsedOriginalUrl?: any;
    _parsedUrl?: any;
    _raw?: string;
};
/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
export declare const parseurl: (req: Req) => any | undefined;
/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
export declare const parseUrlOriginal: (req: Req) => any;
/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
export declare const originalurl: (req: Req) => any;
export {};
