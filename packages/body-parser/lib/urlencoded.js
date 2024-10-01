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
exports.BodyParserUrlEncodedMiddleware = void 0;
exports.default = default_1;
const typeis = require("type-is");
const bytes = require("bytes");
const qs = require("qs");
const contentType = require("content-type");
const createError = require("http-errors");
const on_finished_1 = require("on-finished");
const read_1 = require("./read");
class BodyParserUrlEncodedMiddleware {
    constructor(options) {
        this.middlewareName = 'body-parse-urlencoded';
        this.options = {
            limit: typeof options?.limit !== 'number'
                ? bytes.parse(options?.limit || '100kb')
                : options?.limit,
            inflate: options?.inflate !== false,
            type: options?.type || 'application/x-www-form-urlencoded',
            verify: options?.verify || false,
            extended: Boolean(options?.extended),
            defaultCharset: options?.defaultCharset || 'utf-8',
            interpretNumericEntities: options?.interpretNumericEntities,
            charsetSentinel: options?.charsetSentinel,
            depth: Boolean(options?.extended)
                ? options.depth !== undefined
                    ? options.depth
                    : 32
                : 0,
            parameterLimit: options.parameterLimit !== undefined
                ? options.parameterLimit
                : 1000,
        };
    }
    async process(req, res, next) {
        if (req.app && typeof req.app.addContentTypeParser == 'function') {
            req.app.addContentTypeParser('application/x-www-form-urlencoded', this.cmmvMiddleware.bind(this));
        }
        else
            this.expressMiddleware.call(this, req, res, next);
    }
    expressMiddleware(req, res, done) {
        if (this.options?.defaultCharset !== 'utf-8' &&
            this.options?.defaultCharset !== 'iso-8859-1') {
            throw new TypeError('option defaultCharset must be either utf-8 or iso-8859-1');
        }
        const queryparse = this.createQueryParser(this.options, this.options.extended);
        const shouldParse = typeof this.options?.type !== 'function'
            ? this.typeChecker(this.options.type)
            : this.options.type;
        function parse(body, encoding) {
            return body.length ? queryparse(body, encoding) : {};
        }
        if ((0, on_finished_1.isFinished)(req)) {
            done();
            return;
        }
        if (!('body' in req))
            req['body'] = undefined;
        if (!typeis.hasBody(req)) {
            done();
            return;
        }
        if (!shouldParse(req)) {
            done();
            return;
        }
        const charset = this.getCharset(req) || this.options.defaultCharset;
        if (charset !== 'utf-8' && charset !== 'iso-8859-1') {
            done(createError(415, 'unsupported charset "' + charset.toUpperCase() + '"', {
                charset: charset,
                type: 'charset.unsupported',
            }));
            return;
        }
        (0, read_1.read)(req, res, done, parse.bind(this), {
            encoding: charset,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
            charsetSentinel: this.options.charsetSentinel,
            interpretNumericEntities: this.options.interpretNumericEntities,
        });
    }
    cmmvMiddleware(req, res, payload, done) {
        return new Promise((resolve, reject) => {
            if (this.options?.defaultCharset !== 'utf-8' &&
                this.options?.defaultCharset !== 'iso-8859-1') {
                throw new TypeError('option defaultCharset must be either utf-8 or iso-8859-1');
            }
            const queryparse = this.createQueryParser(this.options, this.options.extended);
            const shouldParse = typeof this.options?.type !== 'function'
                ? this.typeChecker(this.options.type)
                : this.options.type;
            function parse(body, encoding) {
                return body.length ? queryparse(body, encoding) : {};
            }
            if ((0, on_finished_1.isFinished)(req)) {
                resolve(null);
                return;
            }
            if (!('body' in req))
                req['body'] = undefined;
            if (!typeis.hasBody(req)) {
                resolve(null);
                return;
            }
            if (!shouldParse(req)) {
                resolve(null);
                return;
            }
            const charset = this.getCharset(req) || this.options.defaultCharset;
            if (charset !== 'utf-8' && charset !== 'iso-8859-1') {
                resolve(createError(415, 'unsupported charset "' + charset.toUpperCase() + '"', {
                    charset: charset,
                    type: 'charset.unsupported',
                }));
                return;
            }
            (0, read_1.read)(req, res, resolve, parse.bind(this), {
                encoding: charset,
                inflate: this.options.inflate,
                limit: this.options.limit,
                verify: this.options.verify,
                charsetSentinel: this.options.charsetSentinel,
                interpretNumericEntities: this.options.interpretNumericEntities,
            });
        });
    }
    /**
     * Get the extended query parser.
     *
     * @param {object} options
     */
    createQueryParser(options, extended) {
        let parameterLimit = options.parameterLimit !== undefined
            ? options.parameterLimit
            : 1000;
        const charsetSentinel = options.charsetSentinel;
        const interpretNumericEntities = options.interpretNumericEntities;
        const depth = extended
            ? options.depth !== undefined
                ? options.depth
                : 32
            : 0;
        if (isNaN(parameterLimit) || parameterLimit < 1)
            throw new TypeError('option parameterLimit must be a positive number');
        if (isNaN(depth) || depth < 0)
            throw new TypeError('option depth must be a zero or a positive number');
        if (isFinite(parameterLimit))
            parameterLimit = parameterLimit | 0;
        return function (body, encoding) {
            /**
             * Count the number of parameters, stopping once limit reached
             *
             * @param {string} body
             * @param {number} limit
             * @api private
             */
            function parameterCount(body, limit) {
                let count = 0;
                let index = 0;
                while ((index = body.indexOf('&', index)) !== -1) {
                    count++;
                    index++;
                    if (count === limit)
                        return undefined;
                }
                return count;
            }
            const paramCount = parameterCount(body, parameterLimit);
            if (paramCount === undefined) {
                throw createError(413, 'too many parameters', {
                    type: 'parameters.too.many',
                });
            }
            const arrayLimit = extended ? Math.max(100, paramCount) : 0;
            try {
                return qs.parse(body, {
                    allowPrototypes: true,
                    arrayLimit: arrayLimit,
                    depth: depth,
                    charsetSentinel: charsetSentinel,
                    interpretNumericEntities: interpretNumericEntities,
                    charset: encoding,
                    parameterLimit: parameterLimit,
                    strictDepth: true,
                });
            }
            catch (err) {
                if (err instanceof RangeError) {
                    throw createError(400, 'The input exceeded the depth', {
                        type: 'querystring.parse.rangeError',
                    });
                }
                else {
                    throw err;
                }
            }
        };
    }
    /**
     * Get the charset of a request.
     *
     * @param {object} req
     * @api private
     */
    getCharset(req) {
        try {
            return (contentType.parse(req).parameters.charset || '').toLowerCase();
        }
        catch (e) {
            return undefined;
        }
    }
    /**
     * Get the simple type checker.
     *
     * @param {string} type
     * @return {function}
     */
    typeChecker(type) {
        return function checkType(req) {
            const isIRequest = req && req.httpRequest;
            return Boolean(typeis(isIRequest ? req.httpRequest : req, type));
        };
    }
}
exports.BodyParserUrlEncodedMiddleware = BodyParserUrlEncodedMiddleware;
function default_1(options) {
    if (options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function') {
        throw new TypeError('option verify must be function');
    }
    const parameterLimit = options.parameterLimit !== undefined ? options.parameterLimit : 1000;
    if (isNaN(parameterLimit) || parameterLimit < 1)
        throw new TypeError('option parameterLimit must be a positive number');
    return new BodyParserUrlEncodedMiddleware(options);
}
