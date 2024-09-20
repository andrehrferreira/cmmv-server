"use strict";
/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = read;
exports.contentstream = contentstream;
exports.dump = dump;
const zlib = require("node:zlib");
const createError = require("http-errors");
const getBody = require("raw-body");
const iconv = require("iconv-lite");
const onFinished = require("on-finished");
const unpipe = require("unpipe");
const destroy = require('destroy');
const hasBrotliSupport = 'createBrotliDecompress' in zlib;
function read(req, res, next, parse, options) {
    let length;
    const opts = options;
    let stream;
    // read options
    const encoding = opts.encoding !== null ? opts.encoding : null;
    const verify = opts.verify;
    try {
        // get the content stream
        stream = contentstream(req, opts.inflate);
        length = stream.length;
        stream.length = undefined;
    }
    catch (err) {
        return next(err);
    }
    // set raw-body options
    opts.length = length;
    opts.encoding = verify ? null : encoding;
    if (opts.encoding === null &&
        encoding !== null &&
        !iconv.encodingExists(encoding)) {
        return next(createError(415, 'unsupported charset "' + encoding.toUpperCase() + '"', {
            charset: encoding.toLowerCase(),
            type: 'charset.unsupported',
        }));
    }
    getBody(stream, opts, function (error, body) {
        if (error) {
            let _error;
            if (error.type === 'encoding.unsupported') {
                _error = createError(415, 'unsupported charset "' + encoding.toUpperCase() + '"', {
                    charset: encoding.toLowerCase(),
                    type: 'charset.unsupported',
                });
            }
            else {
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
            }
            catch (err) {
                next(createError(403, err, {
                    body: body,
                    type: err.type || 'entity.verify.failed',
                }));
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
        }
        catch (err) {
            next(createError(400, err, {
                body: str,
                type: err.type || 'entity.parse.failed',
            }));
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
function contentstream(req, inflate) {
    const encoding = (req.headers['content-encoding'] || 'identity').toLowerCase();
    const length = req.headers['content-length'];
    let stream;
    if (inflate === false && encoding !== 'identity') {
        throw createError(415, 'content encoding unsupported', {
            encoding: encoding,
            type: 'encoding.unsupported',
        });
    }
    switch (encoding) {
        case 'deflate':
            stream = zlib.createInflate();
            req.pipe(stream);
            break;
        case 'gzip':
            stream = zlib.createGunzip();
            req.pipe(stream);
            break;
        case 'identity':
            stream = req;
            stream.length = length;
            break;
        case 'br':
            if (hasBrotliSupport) {
                stream = zlib.createBrotliDecompress();
                req.pipe(stream);
            }
            break;
    }
    if (stream === undefined) {
        throw createError(415, 'unsupported content encoding "' + encoding + '"', {
            encoding: encoding,
            type: 'encoding.unsupported',
        });
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
function dump(req, callback) {
    if (onFinished.isFinished(req)) {
        callback(null);
    }
    else {
        onFinished(req, callback);
        req.resume();
    }
}
