/*!
 * cookie-parser
 * Copyright(c) 2014 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */
import * as cookie from 'cookie';
type CookieParserOptions = cookie.CookieParseOptions & {
    name?: string;
    secret?: string | string[];
};
export declare class CookieParserMiddleware {
    middlewareName: string;
    private options;
    constructor(options: CookieParserOptions);
    process(req: any, res: any, next: any): Promise<void>;
    onCall(req: any, res: any, payload: any, done: any): Promise<void>;
}
export default function (options?: CookieParserOptions): Promise<(req: any, res: any, next: any) => Promise<void>>;
export declare const cookieParser: (options?: CookieParserOptions) => (req: any, res: any, next: any) => Promise<void>;
/**
 * Parse JSON cookies.
 *
 * @param {Object} obj
 * @return {Object}
 * @public
 */
export declare const JSONCookies: (obj: any) => any;
/**
 * Parse JSON cookie string.
 *
 * @param {String} str
 * @return {Object} Parsed object or undefined if not json cookie
 * @public
 */
export declare const JSONCookie: (str?: any) => any;
/**
 * Parse a signed cookie string, return the decoded value.
 *
 * @param {String} str signed cookie string
 * @param {string|array} secret
 * @return {String} decoded value
 * @public
 */
export declare const signedCookie: (str: any, secret: string | string[]) => string | boolean;
/**
 * Parse signed cookies, returning an object containing the decoded key/value
 * pairs, while removing the signed key from obj.
 *
 * @param {Object} obj
 * @param {string|array} secret
 * @return {Object}
 * @public
 */
export declare const signedCookies: (obj: Object, secret: string | string[]) => {};
/**
 * Sign the given `val` with `secret`.
 *
 * @param {String} val
 * @param {String|NodeJS.ArrayBufferView|crypto.KeyObject} secret
 * @return {String}
 * @api private
 */
export declare const sign: (val: any, secret: any) => string;
/**
 * Unsign and decode the given `input` with `secret`,
 * returning `false` if the signature is invalid.
 *
 * @param {String} input
 * @param {String|NodeJS.ArrayBufferView|crypto.KeyObject} secret
 * @return {String|Boolean}
 * @api private
 */
export declare const unsign: (input: any, secret: any) => string | false;
export {};
