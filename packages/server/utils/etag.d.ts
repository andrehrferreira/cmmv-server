/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/express/blob/344b022fc7ed95cf07b46e097935e61151fd585f/lib/utils.js
 */
export declare const etag: (body: any, options?: any) => string;
export declare const wetag: (body: any, options?: any) => string;
/**
 * Compile "etag" value to function.
 *
 * @param  {Boolean|String|Function} val
 * @return {Function}
 * @api private
 */
export declare const compileETag: (val: any) => any;
/**
 * Create an ETag generator function, generating ETags with
 * the given options.
 *
 * @param {object} options
 * @return {function}
 * @private
 */
export declare function createETagGenerator(options: any): (body: any, options?: any) => string;
