export * from './content-disposition';
export * from './content-type';
export * from './cookie-signature';
export * from './cookie';
export * from './destroy';
export * from './encodeurl';
export * from './escape-html';
export * from './etag';
export * from './fresh';
export * from './mime';
export * from './parseurl';
export * from './querystring';
export * from './range-parser';
export * from './sendfile';
export * from './statuses';
/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */
export declare const compileTrust: (val: any) => any;
/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 * @see https://github.com/jaredhanson/utils-merge/blob/master/index.js
 */
export declare const utilsMerge: (a: any, b: any) => any;
/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */
export declare const normalizeType: (type: any) => {
    value: any;
    quality: number;
    params: {};
} | {
    value: string;
    params: {};
};
/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */
export declare const normalizeTypes: (types: any) => any[];
