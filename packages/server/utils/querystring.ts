/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/express/blob/master/lib/utils.js
 */

import * as qs from 'qs';
import * as querystring from 'querystring';

/**
 * Compile "query parser" value to function.
 *
 * @param  {String|Function} val
 * @return {Function}
 * @api private
 */
export const compileQueryParser = function compileQueryParser(
    val: string | Function | boolean,
) {
    let fn;

    if (typeof val === 'function') return val;

    switch (val) {
        case true:
        case 'simple':
            fn = querystring.parse;
            break;
        case false:
            break;
        case 'extended':
            fn = parseExtendedQueryString;
            break;
        default:
            throw new TypeError(
                'unknown value for query parser function: ' + val,
            );
    }

    return fn;
};

/**
 * Parse an extended query string with qs.
 *
 * @param {String} str
 * @return {Object}
 * @private
 */

function parseExtendedQueryString(str) {
    return qs.parse(str, {
        allowPrototypes: true,
    });
}
