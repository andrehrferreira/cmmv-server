/*!
 * cookie-parser
 * Copyright(c) 2014 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */

/*!
 * node-cookie-signature
 * Copyright (c) 2012–2023 LearnBoost <tj@learnboost.com> and other contributors;
 * MIT Licensed
 *
 * @see https://github.com/tj/node-cookie-signature/blob/master/LICENSE
 */

import * as crypto from 'node:crypto';
import * as cookie from 'cookie';

import {
    ServerMiddleware,
    IRequest,
    IRespose,
    INext,
} from '@cmmv/server-common';

const onHeaders = require('on-headers');

type CookieParserOptions = cookie.CookieParseOptions & {
    name?: string;
    secret?: string | string[];
    express?: boolean;
};

export class CookieParserMiddleware extends ServerMiddleware {
    public middlewareName: string = 'cookie-parser';
    private options: CookieParserOptions;

    constructor(options: CookieParserOptions) {
        super();
        this.options = options || {};
        this.options.secret =
            !options?.secret || Array.isArray(options?.secret)
                ? options?.secret || []
                : [options?.secret];
        this.options.express = this.options.express !== false;
    }

    async process(req: IRequest, res: IRespose, next: INext) {
        if (req.cookies) return next();

        const cookies = req.headers.cookie;

        req.secret = this.options.secret[0];
        req.cookies = Object.create(null);
        req.signedCookies = Object.create(null);

        if (!cookies) return next();

        req.cookies = cookie.parse(cookies, this.options);

        if (this.options.secret.length !== 0) {
            req.signedCookies = signedCookies(req.cookies, this.options.secret);
            req.signedCookies = JSONCookies(req.signedCookies);
        }

        req.cookies = JSONCookies(req.cookies);

        next();
    }
}

export default function (options?: CookieParserOptions) {
    const middleware = new CookieParserMiddleware(options);

    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else return middleware;
}

/**
 * Parse JSON cookies.
 *
 * @param {Object} obj
 * @return {Object}
 * @public
 */
export const JSONCookies = obj => {
    const cookies = Object.keys(obj);
    let key;
    let val;

    for (let i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = JSONCookie(obj[key]);

        if (val) obj[key] = val;
    }

    return obj;
};

/**
 * Parse JSON cookie string.
 *
 * @param {String} str
 * @return {Object} Parsed object or undefined if not json cookie
 * @public
 */
export const JSONCookie = (str?: any) => {
    if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') return undefined;

    try {
        return JSON.parse(str.slice(2));
    } catch (err) {
        return undefined;
    }
};

/**
 * Parse a signed cookie string, return the decoded value.
 *
 * @param {String} str signed cookie string
 * @param {string|array} secret
 * @return {String} decoded value
 * @public
 */
export const signedCookie = (
    str: any,
    secret: string | string[],
): string | boolean => {
    if (typeof str !== 'string') return undefined;

    if (str.substr(0, 2) !== 's:') return str;

    const secrets = !secret || Array.isArray(secret) ? secret || [] : [secret];

    for (let i = 0; i < secrets.length; i++) {
        const val = unsign(str.slice(2), secrets[i]);

        if (val !== false) return val;
    }

    return false;
};

/**
 * Parse signed cookies, returning an object containing the decoded key/value
 * pairs, while removing the signed key from obj.
 *
 * @param {Object} obj
 * @param {string|array} secret
 * @return {Object}
 * @public
 */
export const signedCookies = (obj: Object, secret: string | string[]) => {
    const cookies = Object.keys(obj);
    const ret = {};
    let dec;
    let key;
    let val;

    for (let i = 0; i < cookies.length; i++) {
        key = cookies[i];
        val = obj[key];
        dec = signedCookie(val, secret);

        if (val !== dec) {
            ret[key] = dec;
            delete obj[key];
        }
    }

    return ret;
};

/**
 * Sign the given `val` with `secret`.
 *
 * @param {String} val
 * @param {String|NodeJS.ArrayBufferView|crypto.KeyObject} secret
 * @return {String}
 * @api private
 */
export const sign = (val, secret) => {
    if ('string' != typeof val)
        throw new TypeError('Cookie value must be provided as a string.');
    if (null == secret) throw new TypeError('Secret key must be provided.');
    return (
        val +
        '.' +
        crypto
            .createHmac('sha256', secret)
            .update(val)
            .digest('base64')
            .replace(/\=+$/, '')
    );
};

/**
 * Unsign and decode the given `input` with `secret`,
 * returning `false` if the signature is invalid.
 *
 * @param {String} input
 * @param {String|NodeJS.ArrayBufferView|crypto.KeyObject} secret
 * @return {String|Boolean}
 * @api private
 */
export const unsign = (input, secret) => {
    if ('string' != typeof input)
        throw new TypeError('Signed cookie string must be provided.');
    if (null == secret) throw new TypeError('Secret key must be provided.');
    const tentativeValue = input.slice(0, input.lastIndexOf('.')),
        expectedInput = exports.sign(tentativeValue, secret),
        expectedBuffer = Buffer.from(expectedInput),
        inputBuffer = Buffer.from(input);

    return expectedBuffer.length === inputBuffer.length &&
        crypto.timingSafeEqual(
            new Uint8Array(expectedBuffer),
            new Uint8Array(inputBuffer),
        )
        ? tentativeValue
        : false;
};
