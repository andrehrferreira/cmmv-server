/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/express/blob/344b022fc7ed95cf07b46e097935e61151fd585f/lib/utils.js
 */

/*!
 * etag
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 *
 * @see https://github.com/jshttp/etag/blob/master/index.js
 */

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';

export let etag = createETagGenerator({ weak: false });

export let wetag = createETagGenerator({ weak: true });

/**
 * Compile "etag" value to function.
 *
 * @param  {Boolean|String|Function} val
 * @return {Function}
 * @api private
 */
export let compileETag = val => {
    let fn;

    if (typeof val === 'function') return val;

    switch (val) {
        case true:
        case 'weak':
            fn = exports.wetag;
            break;
        case false:
            break;
        case 'strong':
            fn = exports.etag;
            break;
        default:
            throw new TypeError('unknown value for etag function: ' + val);
    }

    return fn;
};

/**
 * Create an ETag generator function, generating ETags with
 * the given options.
 *
 * @param {object} options
 * @return {function}
 * @private
 */
export function createETagGenerator(options) {
    return function generateETag(body, options?) {
        let encoding = options === 'string' ? options : 'utf-8';

        const buf =
            typeof body === 'string' ? Buffer.from(body, encoding) : body;

        return etagGen(buf, options);
    };
}

/**
 * Create a simple ETag.
 *
 * @param {string|Buffer|Stats} entity
 * @param {object} [options]
 * @param {boolean} [options.weak]
 * @return {String}
 * @public
 */
function etagGen(
    entity?: string | Buffer | fs.Stats,
    options?: { weak: boolean },
) {
    if (entity == null) throw new TypeError('argument entity is required');

    // support fs.Stats object
    const isStats = isstats(entity);
    let weak =
        options && typeof options.weak === 'boolean' ? options.weak : isStats;

    if (options?.weak === false) weak = false;
    else if (isStats === true) weak = true;

    // validate argument
    if (!isStats && typeof entity !== 'string' && !Buffer.isBuffer(entity))
        throw new TypeError(
            'argument entity must be string, Buffer, or fs.Stats',
        );

    // generate entity tag
    const tag = isStats ? stattag(entity) : entitytag(entity);

    return weak ? 'W/' + tag : tag;
}

/**
 * Generate an entity tag.
 *
 * @param {Buffer|string} entity
 * @return {string}
 * @private
 */

function entitytag(entity) {
    if (entity.length === 0) return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';

    const hash = crypto
        .createHash('sha1')
        .update(entity, 'utf8')
        .digest('base64')
        .substring(0, 27);

    const len =
        typeof entity === 'string'
            ? Buffer.byteLength(entity, 'utf8')
            : entity.length;

    return '"' + len.toString(16) + '-' + hash + '"';
}

/**
 * Determine if object is a Stats object.
 *
 * @param {object} obj
 * @return {boolean}
 * @api private
 */

function isstats(obj) {
    // genuine fs.Stats
    if (typeof fs.Stats === 'function' && obj instanceof fs.Stats) return true;

    // quack quack
    return (
        obj &&
        typeof obj === 'object' &&
        'ctime' in obj &&
        toString.call(obj.ctime) === '[object Date]' &&
        'mtime' in obj &&
        toString.call(obj.mtime) === '[object Date]' &&
        'ino' in obj &&
        typeof obj.ino === 'number' &&
        'size' in obj &&
        typeof obj.size === 'number'
    );
}

/**
 * Generate a tag for a stat.
 *
 * @param {object} stat
 * @return {string}
 * @private
 */

function stattag(stat) {
    const mtime = stat.mtime.getTime().toString(16);
    const size = stat.size.toString(16);
    return '"' + size + '-' + mtime + '"';
}
