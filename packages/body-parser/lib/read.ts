/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */

import * as zlib from 'node:zlib';

import * as createError from 'http-errors';
import * as getBody from 'raw-body';
import * as iconv from 'iconv-lite';
import * as onFinished from 'on-finished';
import * as unpipe from 'unpipe';

const destroy = require('destroy');

const hasBrotliSupport = 'createBrotliDecompress' in zlib;

export function read(req, res, next, parse, options) {
    let length;
    const opts = options;
    let stream;

    const encoding = opts.encoding !== null ? opts.encoding : null;
    const verify = opts.verify;

    try {
        stream = contentstream(req, opts.inflate);
        length = stream.length;
        stream.length = undefined;
    } catch (err) {
        console.error(err);
        return next(err);
    }

    opts.length = length;
    opts.encoding = verify ? null : encoding;

    if (
        opts.encoding === null &&
        encoding !== null &&
        !iconv.encodingExists(encoding)
    ) {
        return next(
            createError(
                415,
                'unsupported charset "' + encoding.toUpperCase() + '"',
                {
                    charset: encoding.toLowerCase(),
                    type: 'charset.unsupported',
                },
            ),
        );
    }

    getBody(stream, opts, function (error, body) {
        if (error) {
            let _error;

            if (error.type === 'encoding.unsupported') {
                _error = createError(
                    415,
                    'unsupported charset "' + encoding.toUpperCase() + '"',
                    {
                        charset: encoding.toLowerCase(),
                        type: 'charset.unsupported',
                    },
                );
            } else {
                _error = createError(400, error);
            }

            if (stream !== req) {
                unpipe(req);
                destroy(stream, true);
            }

            dump(req, function onfinished() {
                next(createError(400, _error));
            });

            return;
        }

        if (verify) {
            try {
                verify(req, res, body, encoding);
            } catch (err) {
                next(
                    createError(403, err, {
                        body: body,
                        type: err.type || 'entity.verify.failed',
                    }),
                );
                return;
            }
        }

        let str = body;

        try {
            str =
                typeof body !== 'string' && encoding !== null
                    ? iconv.decode(body, encoding)
                    : body;

            req.body = parse(str, encoding);
        } catch (err) {
            next(
                createError(400, err, {
                    body: str,
                    type: err.type || 'entity.parse.failed',
                }),
            );
            return;
        }

        next();
    });
}

/**
 * Get the content stream of the request.
 *
 * @param {object} req
 * @param {function} debug
 * @param {boolean} [inflate=true]
 * @return {object}
 * @api private
 */
export function contentstream(request, inflate) {
    const encoding = (
        request.headers['content-encoding'] || 'identity'
    ).toLowerCase();
    const length = request.headers['content-length'];
    let stream: any = {};

    if (inflate === false && encoding !== 'identity') {
        throw createError(415, 'content encoding unsupported', {
            encoding: encoding,
            type: 'encoding.unsupported',
        });
    }

    switch (encoding) {
        case 'deflate':
            stream = zlib.createInflate();
            request.req.pipe(stream);
            break;
        case 'gzip':
            stream = zlib.createGunzip();
            request.req.pipe(stream);
            break;
        case 'br':
            if (hasBrotliSupport) {
                stream = zlib.createBrotliDecompress();
                request.req.pipe(stream);
            }
            break;
        default:
            stream = request.req;
            stream.length = length;
            break;
    }

    return stream;
}

/**
 * Dump the contents of a request.
 *
 * @param {object} req
 * @param {function} callback
 * @api private
 */
export function dump(req, callback) {
    if (onFinished.isFinished(req)) {
        callback(null);
    } else {
        onFinished(req, callback);
        req.resume();
    }
}
