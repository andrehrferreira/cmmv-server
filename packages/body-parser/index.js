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
exports.json = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./lib"), exports);
const lib_1 = require("./lib");
const json = function (options) {
    return new lib_1.CMMVBodyParserJSON(options);
};
exports.json = json;
