export * from './content-disposition';
export * from './content-type';
export * from './encodeurl';
export * from './escape-html';
export * from './etag';
export * from './fresh';
export * from './mime';
export * from './parseurl';
export * from './querystring';
export * from './range-parser';
export * from './statuses';

import * as proxyaddr from 'proxy-addr';

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
