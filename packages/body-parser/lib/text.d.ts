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
export interface BodyParserTextOptions {
    defaultCharset?: string;
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
    express?: boolean;
}
export declare class CMMVBodyParserText extends ServerMiddleware {
    middlewareName: string;
    private options;
    constructor(options?: BodyParserTextOptions);
    process(req: IRequest | http.IncomingMessage | http2.Http2ServerRequest, res: IRespose | http.ServerResponse | http2.Http2ServerResponse, next?: INext): Promise<void>;
    /**
     * Get the charset of a request.
     *
     * @param {object} req
     * @api private
     */
    private getCharset;
    /**
     * Get the simple type checker.
     *
     * @param {string} type
     * @return {function}
     */
    private typeChecker;
}
export default function (options?: BodyParserTextOptions): CMMVBodyParserText;
