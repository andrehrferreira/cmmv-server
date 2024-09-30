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
exports.urlencoded = exports.text = exports.raw = exports.json = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./lib"), exports);
const lib_1 = require("./lib");
const json = function (options) {
    const middleware = new lib_1.CMMVBodyParserJSON(options);
    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else
        return middleware;
};
exports.json = json;
const raw = function (options) {
    const middleware = new lib_1.CMMVBodyParserRaw(options);
    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else
        return middleware;
};
exports.raw = raw;
const text = function (options) {
    const middleware = new lib_1.CMMVBodyParserText(options);
    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else
        return middleware;
};
exports.text = text;
const urlencoded = function (options) {
    const middleware = new lib_1.CMMVBodyParserUrlEncoded(options);
    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else
        return middleware;
};
exports.urlencoded = urlencoded;
