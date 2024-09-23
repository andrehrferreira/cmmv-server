/**
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 *
 * @see https://github.com/expressjs/express/blob/master/lib/response.js
 * MIT Licensed
 */

'use strict';

import * as http from 'node:http';

let res = Object.create(http.ServerResponse.prototype);

module.exports = res;

/**
 * Set the HTTP status code for the response.
 *
 * Expects an integer value between 100 and 999 inclusive.
 * Throws an error if the provided status code is not an integer or if it's outside the allowable range.
 *
 * @param {number} code - The HTTP status code to set.
 * @return {ServerResponse} - Returns itself for chaining methods.
 * @throws {TypeError} If `code` is not an integer.
 * @throws {RangeError} If `code` is outside the range 100 to 999.
 * @public
 */
res.status = function status(code) {
    // Check if the status code is not an integer
    if (!Number.isInteger(code))
        throw new TypeError(
            `Invalid status code: ${JSON.stringify(code)}. Status code must be an integer.`,
        );

    // Check if the status code is outside of Node's valid range
    if (code < 100 || code > 999)
        throw new RangeError(
            `Invalid status code: ${JSON.stringify(code)}. Status code must be greater than 99 and less than 1000.`,
        );

    this.statusCode = code;
    return this;
};
