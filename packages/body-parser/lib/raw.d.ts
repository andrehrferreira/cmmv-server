/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
export interface BodyParserRawOptions {
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
}
export declare class BodyParserRawMiddleware {
    middlewareName: string;
    private options;
    constructor(options?: BodyParserRawOptions);
    process(req: any, res: any, next?: any): Promise<void>;
    expressMiddleware(req: any, res: any, done: any): void;
    cmmvMiddleware(req: any, res: any, payload: any, done: any): Promise<unknown>;
    /**
     * Get the simple type checker.
     *
     * @param {string} type
     * @return {function}
     */
    private typeChecker;
}
export default function (options?: BodyParserRawOptions): Promise<(req: any, res: any, next: any) => Promise<void>>;
