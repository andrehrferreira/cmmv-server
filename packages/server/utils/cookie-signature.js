"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieSignatureUnsign = exports.cookieSignatureSign = void 0;
/**
 * cookie-signature
 * Copyright (c) 2012–2023 LearnBoost <tj@learnboost.com> and other contributors;
 * MIT Licensed
 *
 * @see https://github.com/tj/node-cookie-signature/tree/master
 */
const crypto = require("node:crypto");
/**
 * Sign the given `val` with `secret`.
 *
 * @param {String} val
 * @param {String|NodeJS.ArrayBufferView|crypto.KeyObject} secret
 * @return {String}
 * @api private
 */
const cookieSignatureSign = (val, secret) => {
    if ('string' != typeof val)
        throw new TypeError('Cookie value must be provided as a string.');
    if (null == secret)
        throw new TypeError('Secret key must be provided.');
    return (val +
        '.' +
        crypto
            .createHmac('sha256', secret)
            .update(val)
            .digest('base64')
            .replace(/\=+$/, ''));
};
exports.cookieSignatureSign = cookieSignatureSign;
/**
 * Unsign and decode the given `input` with `secret`,
 * returning `false` if the signature is invalid.
 *
 * @param {String} input
 * @param {String|NodeJS.ArrayBufferView|crypto.KeyObject} secret
 * @return {String|Boolean}
 * @api private
 */
const cookieSignatureUnsign = (input, secret) => {
    if ('string' != typeof input)
        throw new TypeError('Signed cookie string must be provided.');
    if (null == secret)
        throw new TypeError('Secret key must be provided.');
    const tentativeValue = input.slice(0, input.lastIndexOf('.')), expectedInput = exports.sign(tentativeValue, secret), expectedBuffer = Buffer.from(expectedInput), inputBuffer = Buffer.from(input);
    return expectedBuffer.length === inputBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, inputBuffer)
        ? tentativeValue
        : false;
};
exports.cookieSignatureUnsign = cookieSignatureUnsign;
