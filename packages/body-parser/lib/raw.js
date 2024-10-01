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
exports.BodyParserRawMiddleware = void 0;
exports.default = default_1;
const typeis = require("type-is");
const bytes = require("bytes");
const on_finished_1 = require("on-finished");
const read_1 = require("./read");
class BodyParserRawMiddleware {
    constructor(options) {
        this.middlewareName = 'body-parse-raw';
        this.options = {
            limit: typeof options?.limit !== 'number'
                ? bytes.parse(options?.limit || '100kb')
                : options?.limit,
            inflate: options?.inflate !== false,
            type: options?.type || 'application/octet-stream',
            verify: options?.verify || false,
        };
    }
    async process(req, res, next) {
        if (req.app && typeof req.app.addContentTypeParser == 'function') {
            req.app.addContentTypeParser(['*', 'application/vnd+octets', 'application/octet-stream'], this.cmmvMiddleware.bind(this));
        }
        else
            this.expressMiddleware.call(this, req, res, next);
    }
    expressMiddleware(req, res, done) {
        const shouldParse = typeof this.options?.type !== 'function'
            ? this.typeChecker(this.options.type)
            : this.options.type;
        function parse(buf) {
            return buf;
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
        (0, read_1.read)(req, res, done, parse.bind(this), {
            encoding: null,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
        });
    }
    cmmvMiddleware(req, res, payload, done) {
        return new Promise((resolve, reject) => {
            const shouldParse = typeof this.options?.type !== 'function'
                ? this.typeChecker(this.options.type)
                : this.options.type;
            function parse(buf) {
                return buf;
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
            (0, read_1.read)(req, res, resolve, parse.bind(this), {
                encoding: null,
                inflate: this.options.inflate,
                limit: this.options.limit,
                verify: this.options.verify,
            });
        });
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
exports.BodyParserRawMiddleware = BodyParserRawMiddleware;
async function default_1(options) {
    if (options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function') {
        throw new TypeError('option verify must be function');
    }
    const middleware = new BodyParserRawMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
}
