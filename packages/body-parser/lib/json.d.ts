/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
export interface BodyParserJSONOptions {
    limit?: number | string;
    inflate?: boolean;
    reviver?: any;
    strict?: boolean;
    type?: string;
    verify?: boolean | Function;
}
export declare class BodyParserJSONMiddleware {
    middlewareName: string;
    private options;
    constructor(options?: BodyParserJSONOptions);
    process(req: any, res: any, next?: any): Promise<void>;
    expressMiddleware(req: any, res: any, done: any): void;
    cmmvMiddleware(req: any, res: any, payload: any, done: any): Promise<unknown>;
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
export default function (options?: BodyParserJSONOptions): Promise<(req: any, res: any, next: any) => Promise<void>>;
