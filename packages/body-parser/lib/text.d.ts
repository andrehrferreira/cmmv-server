/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
export interface BodyParserTextOptions {
    defaultCharset?: string;
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
}
export declare class BodyParserTextMiddleware {
    middlewareName: string;
    private options;
    constructor(options?: BodyParserTextOptions);
    process(req: any, res: any, next?: any): Promise<void>;
    expressMiddleware(req: any, res: any, done: any): void;
    cmmvMiddleware(req: any, res: any, payload: any, done: any): Promise<unknown>;
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
export default function (options?: BodyParserTextOptions): (req: any, res: any, next: any) => Promise<void>;
