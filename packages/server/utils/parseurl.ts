/*!
 * parseurl
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

import * as http from 'node:http';
import * as http2 from 'node:http2';

const url = require('url');
const parse = url.parse; // eslint-disable-line
var Url = url.Url;

type Req = (http.IncomingMessage | http2.Http2ServerRequest) & {
    originalUrl?: string;
    _parsedOriginalUrl?: any;
    _parsedUrl?: any;
    _raw?: string;
};

/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
export let parseurl = (req: Req): any | undefined => {
    let urlReturn = req.url;

    if (urlReturn === undefined) return undefined;

    let parsed = req?._parsedUrl;

    if (fresh(urlReturn, parsed)) return parsed;

    parsed = fastparse(urlReturn);
    parsed._raw = urlReturn;

    return (req._parsedUrl = parsed);
};

/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */
export let parseUrlOriginal = (req: Req) => {
    const url = req.originalUrl;

    if (typeof url !== 'string') return parseurl(req);

    let parsed = req._parsedOriginalUrl;

    if (fresh(url, parsed)) return parsed;

    // Parse the URL
    parsed = fastparse(url);
    parsed._raw = url;

    return (req._parsedOriginalUrl = parsed);
};

/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */

export let originalurl = (req: Req) => {
    let urlReturn = req.originalUrl;

    if (typeof urlReturn !== 'string') return parseurl(req);

    var parsed = req._parsedOriginalUrl;

    if (fresh(urlReturn, parsed)) return parsed;

    // Parse the URL
    parsed = fastparse(urlReturn);
    parsed._raw = urlReturn;

    return (req._parsedOriginalUrl = parsed);
};

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

    var pathname = str;
    var query = null;
    var search = null;

    // This takes the regexp from https://github.com/joyent/node/pull/7878
    // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
    // And unrolls it into a for loop
    for (var i = 1; i < str.length; i++) {
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

    let urlReturn = Url !== undefined ? new Url() : {};

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
    return (
        typeof parsedUrl === 'object' &&
        parsedUrl !== null &&
        (Url === undefined || parsedUrl instanceof Url) &&
        parsedUrl._raw === url
    );
}
