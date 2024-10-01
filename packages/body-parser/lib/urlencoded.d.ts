/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
export interface BodyParserUrlEncodedOptions {
    extended?: boolean;
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
    defaultCharset?: string;
    interpretNumericEntities?: boolean;
    charsetSentinel?: boolean;
    depth?: number;
    parameterLimit?: number;
}
export declare class BodyParserUrlEncodedMiddleware {
    middlewareName: string;
    private options;
    constructor(options?: BodyParserUrlEncodedOptions);
    process(req: any, res: any, next?: any): Promise<void>;
    expressMiddleware(req: any, res: any, done: any): void;
    cmmvMiddleware(req: any, res: any, payload: any, done: any): Promise<unknown>;
    /**
     * Get the extended query parser.
     *
     * @param {object} options
     */
    createQueryParser(options: any, extended: any): (body: any, encoding: any) => any;
    /**
     * Get the charset of a request.
     *
     * @param {object} req
     * @api private
     */
    getCharset(req: any): any;
    /**
     * Get the simple type checker.
     *
     * @param {string} type
     * @return {function}
     */
    private typeChecker;
}
export default function (options?: BodyParserUrlEncodedOptions): BodyParserUrlEncodedMiddleware;
