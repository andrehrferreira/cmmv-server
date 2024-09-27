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

import * as proxyaddr from 'proxy-addr';
import { mime } from './mime';

/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */
export const compileTrust = val => {
    if (typeof val === 'function') return val;

    if (val === true)
        return function () {
            return true;
        };

    if (typeof val === 'number')
        return function (a, i) {
            return i < val;
        };

    if (typeof val === 'string') {
        val = val.split(',').map(function (v) {
            return v.trim();
        });
    }

    return proxyaddr.compile(val || []);
};

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
export const utilsMerge = (a, b) => {
    if (a && b) {
        for (var key in b) a[key] = b[key];
    }
    return a;
};

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */
export const normalizeType = type => {
    return ~type.indexOf('/')
        ? acceptParams(type)
        : {
              value: mime.getType(type) || 'application/octet-stream',
              params: {},
          };
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */
export const normalizeTypes = types => {
    const ret = [];

    for (let i = 0; i < types.length; ++i)
        ret.push(exports.normalizeType(types[i]));

    return ret;
};

/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */
function acceptParams(str) {
    const parts = str.split(/ *; */);
    const ret = { value: parts[0], quality: 1, params: {} };

    for (var i = 1; i < parts.length; ++i) {
        const pms = parts[i].split(/ *= */);

        if ('q' === pms[0]) ret.quality = parseFloat(pms[1]);
        else ret.params[pms[0]] = pms[1];
    }

    return ret;
}
