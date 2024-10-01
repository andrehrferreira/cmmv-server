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
exports.urlencodedExpress = exports.urlencoded = exports.textExpress = exports.text = exports.rawExpress = exports.raw = exports.jsonExpress = exports.json = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./lib"), exports);
const lib_1 = require("./lib");
const json = async function (options) {
    const middleware = new lib_1.BodyParserJSONMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.json = json;
const jsonExpress = function (options) {
    const middleware = new lib_1.BodyParserJSONMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.jsonExpress = jsonExpress;
const raw = async function (options) {
    const middleware = new lib_1.BodyParserRawMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.raw = raw;
const rawExpress = function (options) {
    const middleware = new lib_1.BodyParserRawMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.rawExpress = rawExpress;
const text = async function (options) {
    const middleware = new lib_1.BodyParserTextMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.text = text;
const textExpress = function (options) {
    const middleware = new lib_1.BodyParserTextMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.textExpress = textExpress;
const urlencoded = async function (options) {
    const middleware = new lib_1.BodyParserUrlEncodedMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.urlencoded = urlencoded;
const urlencodedExpress = function (options) {
    const middleware = new lib_1.BodyParserUrlEncodedMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.urlencodedExpress = urlencodedExpress;
