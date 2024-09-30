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
exports.CMMVBodyParserRaw = void 0;
exports.default = default_1;
const http = require("node:http");
const http2 = require("node:http2");
const typeis = require("type-is");
const bytes = require("bytes");
const on_finished_1 = require("on-finished");
const read_1 = require("./read");
const server_common_1 = require("@cmmv/server-common");
class CMMVBodyParserRaw extends server_common_1.ServerMiddleware {
    constructor(options) {
        super();
        this.middlewareName = 'body-parse-raw';
        this.options = {
            limit: typeof options?.limit !== 'number'
                ? bytes.parse(options?.limit || '100kb')
                : options?.limit,
            inflate: options?.inflate !== false,
            type: options?.type || 'application/octet-stream',
            verify: options?.verify || false,
            express: options?.express || false,
        };
    }
    async process(req, res, next) {
        const reqTest = req instanceof http.IncomingMessage ||
            req instanceof http2.Http2ServerRequest
            ? req
            : req.httpRequest;
        const resTest = res instanceof http.ServerResponse ||
            res instanceof http2.Http2ServerResponse
            ? res
            : res.httpResponse;
        const shouldParse = typeof this.options?.type !== 'function'
            ? this.typeChecker(this.options.type)
            : this.options.type;
        function parse(buf) {
            return buf;
        }
        if ((0, on_finished_1.isFinished)(reqTest)) {
            next();
            return;
        }
        if (!('body' in reqTest))
            reqTest['body'] = undefined;
        if (!typeis.hasBody(reqTest)) {
            next();
            return;
        }
        if (!shouldParse(reqTest)) {
            next();
            return;
        }
        (0, read_1.read)(reqTest, resTest, next, parse.bind(this), {
            encoding: null,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
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
exports.CMMVBodyParserRaw = CMMVBodyParserRaw;
function default_1(options) {
    if (options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function') {
        throw new TypeError('option verify must be function');
    }
    return new CMMVBodyParserRaw(options);
}
