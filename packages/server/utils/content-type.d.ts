/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/jshttp/content-type/blob/master/index.js
 */
/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @public
 */
export declare const contentTypeFormat: (obj: any) => any;
/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @public
 */
export declare const contentTypeParse: (string: string) => any;
declare const _default: {
    format: (obj: any) => any;
    parse: (string: string) => any;
};
export default _default;
/**
 * Set the charset in a given Content-Type string.
 *
 * @param {String} type
 * @param {String} charset
 * @return {String}
 * @api private
 */
export declare const setCharset: (type: string, charset: string) => any;
