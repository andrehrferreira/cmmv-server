"use strict";
/*!
 * parseurl
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.originalurl = exports.parseUrlOriginal = exports.parseurl = void 0;
const url = require('url');
const parse = url.parse; // eslint-disable-line
const Url = url.Url;
/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
const parseurl = (req) => {
    const urlReturn = req.url;
    if (urlReturn === undefined)
        return undefined;
    let parsed = req?._parsedUrl;
    if (fresh(urlReturn, parsed))
        return parsed;
    parsed = fastparse(urlReturn);
    parsed._raw = urlReturn;
    return (req._parsedUrl = parsed);
};
exports.parseurl = parseurl;
/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
const parseUrlOriginal = (req) => {
    const url = req.originalUrl;
    if (typeof url !== 'string')
        return (0, exports.parseurl)(req);
    let parsed = req._parsedOriginalUrl;
    if (fresh(url, parsed))
        return parsed;
    // Parse the URL
    parsed = fastparse(url);
    parsed._raw = url;
    return (req._parsedOriginalUrl = parsed);
};
exports.parseUrlOriginal = parseUrlOriginal;
/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
const originalurl = (req) => {
    const urlReturn = req.originalUrl;
    if (typeof urlReturn !== 'string')
        return (0, exports.parseurl)(req);
    let parsed = req._parsedOriginalUrl;
    if (fresh(urlReturn, parsed))
        return parsed;
    // Parse the URL
    parsed = fastparse(urlReturn);
    parsed._raw = urlReturn;
    return (req._parsedOriginalUrl = parsed);
};
exports.originalurl = originalurl;
/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @private
 */
function fastparse(str) {
    if (typeof str !== 'string' || str.charCodeAt(0) !== 0x2f /* / */)
        return parse(str);
    let pathname = str;
    let query = null;
    let search = null;
    // This takes the regexp from https://github.com/joyent/node/pull/7878
    // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
    // And unrolls it into a for loop
    for (let i = 1; i < str.length; i++) {
        switch (str.charCodeAt(i)) {
            case 0x3f /* ?  */:
                if (search === null) {
                    pathname = str.substring(0, i);
                    query = str.substring(i + 1);
                    search = str.substring(i);
                }
                break;
            case 0x09: /* \t */
            case 0x0a: /* \n */
            case 0x0c: /* \f */
            case 0x0d: /* \r */
            case 0x20: /*    */
            case 0x23: /* #  */
            case 0xa0:
            case 0xfeff:
                return parse(str);
        }
    }
    const urlReturn = Url !== undefined ? new Url() : {};
    urlReturn.path = str;
    urlReturn.href = str;
    urlReturn.pathname = pathname;
    if (search !== null) {
        urlReturn.query = query;
        urlReturn.search = search;
    }
    return urlReturn;
}
/**
 * Determine if parsed is still fresh for url.
 *
 * @param {string} url
 * @param {object} parsedUrl
 * @return {boolean}
 * @private
 */
function fresh(url, parsedUrl) {
    return (typeof parsedUrl === 'object' &&
        parsedUrl !== null &&
        (Url === undefined || parsedUrl instanceof Url) &&
        parsedUrl._raw === url);
}
