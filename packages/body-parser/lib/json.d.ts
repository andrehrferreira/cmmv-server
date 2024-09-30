/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
import * as http from 'node:http';
import * as http2 from 'node:http2';
import { ServerMiddleware, IRequest, IRespose, INext } from '@cmmv/server-common';
export interface BodyParserJSONOptions {
    limit?: number | string;
    inflate?: boolean;
    reviver?: any;
    strict?: boolean;
    type?: string;
    verify?: boolean | Function;
    express?: boolean;
}
export declare class CMMVBodyParserJSON extends ServerMiddleware {
    middlewareName: string;
    private options;
    constructor(options?: BodyParserJSONOptions);
    process(req: IRequest | http.IncomingMessage | http2.Http2ServerRequest, res: IRespose | http.ServerResponse | http2.Http2ServerResponse, next?: INext): Promise<void>;
    private parse;
    /**
     * Create strict violation syntax error matching native error.
     *
     * @param {string} str
     * @param {string} char
     * @return {Error}
     * @private
     */
    private createStrictSyntaxError;
    /**
     * Get the first non-whitespace character in a string.
     *
     * @param {string} str
     * @return {function}
     * @private
     */
    private firstchar;
    /**
     * Get the charset of a request.
     *
     * @param {object} req
     * @api private
     */
    private getCharset;
    /**
     * Normalize a SyntaxError for JSON.parse.
     *
     * @param {SyntaxError} error
     * @param {object} obj
     * @return {SyntaxError}
     */
    private normalizeJsonSyntaxError;
    /**
     * Get the simple type checker.
     *
     * @param {string} type
     * @return {function}
     */
    private typeChecker;
}
export default function (options?: BodyParserJSONOptions): CMMVBodyParserJSON;
