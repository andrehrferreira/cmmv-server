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
exports.BodyParserJSONMiddleware = void 0;
exports.default = default_1;
const typeis = require("type-is");
const bytes = require("bytes");
const contentType = require("content-type");
const createError = require("http-errors");
const on_finished_1 = require("on-finished");
const read_1 = require("./read");
const FIRST_CHAR_REGEXP = /^[\x20\x09\x0a\x0d]*([^\x20\x09\x0a\x0d])/; // eslint-disable-line no-control-regex
const JSON_SYNTAX_CHAR = '#';
const JSON_SYNTAX_REGEXP = /#+/g;
const bodywith = new Set(['DELETE', 'OPTIONS', 'PATCH', 'PUT', 'POST']);
class BodyParserJSONMiddleware {
    constructor(options) {
        this.middlewareName = 'body-parse-json';
        this.options = {
            limit: typeof options?.limit !== 'number'
                ? bytes.parse(options?.limit || '100kb')
                : options?.limit,
            inflate: options?.inflate !== false,
            reviver: options?.reviver,
            strict: options?.strict !== false,
            type: options?.type || 'application/json',
            verify: options?.verify || false,
        };
    }
    async process(req, res, next) {
        if (req.app && typeof req.app.addContentTypeParser == 'function') {
            req.app.addContentTypeParser(['application/json', 'text/json', 'application/vnd.api+json'], this.cmmvMiddleware.bind(this));
        }
        else
            this.expressMiddleware.call(this, req, res, next);
    }
    expressMiddleware(req, res, done) {
        if (!bodywith.has(req.method.toUpperCase())) {
            done(null);
            return;
        }
        if ((0, on_finished_1.isFinished)(req)) {
            done(null);
            return;
        }
        if (!('body' in req))
            req['body'] = undefined;
        if (!typeis.hasBody(req)) {
            done(null);
            return;
        }
        const shouldParse = typeof this.options?.type !== 'function'
            ? this.typeChecker(this.options.type)
            : this.options.type;
        if (!shouldParse(req)) {
            done(null);
            return;
        }
        const charset = this.getCharset(req) || 'utf-8';
        if (charset.slice(0, 4) !== 'utf-') {
            done(createError(415, 'unsupported charset "' + charset.toUpperCase() + '"', {
                charset: charset,
                type: 'charset.unsupported'
            }));
            return;
        }
        (0, read_1.read)(req, res, done, this.parse.bind(this), {
            encoding: charset,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
        });
    }
    cmmvMiddleware(req, res, payload, done) {
        return new Promise((resolve, reject) => {
            if (!bodywith.has(req.method.toUpperCase())) {
                resolve(null);
                return;
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
            const shouldParse = typeof this.options?.type !== 'function'
                ? this.typeChecker(this.options.type)
                : this.options.type;
            if (!shouldParse(req)) {
                resolve(null);
                return;
            }
            const charset = this.getCharset(req) || 'utf-8';
            if (charset.slice(0, 4) !== 'utf-') {
                resolve(createError(415, 'unsupported charset "' + charset.toUpperCase() + '"', {
                    charset: charset,
                    type: 'charset.unsupported'
                }));
                return;
            }
            (0, read_1.read)(req, res, resolve, this.parse.bind(this), {
                encoding: charset,
                inflate: this.options.inflate,
                limit: this.options.limit,
                verify: this.options.verify,
            });
        });
    }
    parse(body) {
        if (body.length === 0) {
            // special-case empty json body, as it's a common client-side mistake
            // TODO: maybe make this configurable or part of "strict" option
            return {};
        }
        if (this.options.strict) {
            const first = this.firstchar(body);
            if (first !== '{' && first !== '[')
                throw this.createStrictSyntaxError(body, first);
        }
        try {
            return JSON.parse(body, this.options.reviver);
        }
        catch (e) {
            throw this.normalizeJsonSyntaxError(e, {
                message: e.message,
                stack: e.stack,
            });
        }
    }
    /**
     * Create strict violation syntax error matching native error.
     *
     * @param {string} str
     * @param {string} char
     * @return {Error}
     * @private
     */
    createStrictSyntaxError(str, char) {
        const index = str.indexOf(char);
        let partial = '';
        if (index !== -1) {
            partial = str.substring(0, index) + JSON_SYNTAX_CHAR;
            for (let i = index + 1; i < str.length; i++)
                partial += JSON_SYNTAX_CHAR;
        }
        try {
            JSON.parse(partial);
            /* istanbul ignore next */
            throw new SyntaxError('strict violation');
        }
        catch (e) {
            return this.normalizeJsonSyntaxError(e, {
                message: e.message.replace(JSON_SYNTAX_REGEXP, function (placeholder) {
                    return str.substring(index, index + placeholder.length);
                }),
                stack: e.stack,
            });
        }
    }
    /**
     * Get the first non-whitespace character in a string.
     *
     * @param {string} str
     * @return {function}
     * @private
     */
    firstchar(str) {
        const match = FIRST_CHAR_REGEXP.exec(str);
        return match ? match[1] : undefined;
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
     * Normalize a SyntaxError for JSON.parse.
     *
     * @param {SyntaxError} error
     * @param {object} obj
     * @return {SyntaxError}
     */
    normalizeJsonSyntaxError(error, obj) {
        const keys = Object.getOwnPropertyNames(error);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key !== 'stack' && key !== 'message')
                delete error[key];
        }
        // replace stack before message for Node.js 0.10 and below
        error.stack = obj.stack.replace(error.message, obj.message);
        error.message = obj.message;
        return error;
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
exports.BodyParserJSONMiddleware = BodyParserJSONMiddleware;
async function default_1(options) {
    if (options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function') {
        throw new TypeError('option verify must be function');
    }
    const middleware = new BodyParserJSONMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
}
