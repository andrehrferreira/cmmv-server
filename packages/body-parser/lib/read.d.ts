/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
export declare function read(req: any, res: any, next: any, parse: any, options: any): any;
/**
 * Get the content stream of the request.
 *
 * @param {object} req
 * @param {function} debug
 * @param {boolean} [inflate=true]
 * @return {object}
 * @api private
 */
export declare function contentstream(req: any, inflate: any): any;
/**
 * Dump the contents of a request.
 *
 * @param {object} req
 * @param {function} callback
 * @api private
 */
export declare function dump(req: any, callback: any): void;
