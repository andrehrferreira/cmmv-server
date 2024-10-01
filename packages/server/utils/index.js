"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTypes = exports.normalizeType = exports.utilsMerge = exports.compileTrust = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./content-disposition"), exports);
tslib_1.__exportStar(require("./content-type"), exports);
tslib_1.__exportStar(require("./cookie-signature"), exports);
tslib_1.__exportStar(require("./cookie"), exports);
tslib_1.__exportStar(require("./destroy"), exports);
tslib_1.__exportStar(require("./encodeurl"), exports);
tslib_1.__exportStar(require("./escape-html"), exports);
tslib_1.__exportStar(require("./etag"), exports);
tslib_1.__exportStar(require("./fresh"), exports);
tslib_1.__exportStar(require("./mime"), exports);
tslib_1.__exportStar(require("./parseurl"), exports);
tslib_1.__exportStar(require("./querystring"), exports);
tslib_1.__exportStar(require("./range-parser"), exports);
tslib_1.__exportStar(require("./sendfile"), exports);
tslib_1.__exportStar(require("./statuses"), exports);
const proxyaddr = require("proxy-addr");
const mime_1 = require("./mime");
/**
 * Compile "proxy trust" value to function.
 *
 * @param  {Boolean|String|Number|Array|Function} val
 * @return {Function}
 * @api private
 */
const compileTrust = val => {
    if (typeof val === 'function')
        return val;
    if (val === true)
        return function () {
            return true;
        };
    if (typeof val === 'number')
        return function (a, i) {
            return i < val;
        };
    if (typeof val === 'string') {
        val = val.split(',').map(function (v) {
            return v.trim();
        });
    }
    return proxyaddr.compile(val || []);
};
exports.compileTrust = compileTrust;
/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api public
 * @see https://github.com/jaredhanson/utils-merge/blob/master/index.js
 */
const utilsMerge = (a, b) => {
    if (a && b) {
        for (var key in b)
            a[key] = b[key];
    }
    return a;
};
exports.utilsMerge = utilsMerge;
/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */
const normalizeType = type => {
    return ~type.indexOf('/')
        ? acceptParams(type)
        : {
            value: mime_1.mime.getType(type) || 'application/octet-stream',
            params: {},
        };
};
exports.normalizeType = normalizeType;
/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */
const normalizeTypes = types => {
    const ret = [];
    for (let i = 0; i < types.length; ++i)
        ret.push(exports.normalizeType(types[i]));
    return ret;
};
exports.normalizeTypes = normalizeTypes;
/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */
function acceptParams(str) {
    const parts = str.split(/ *; */);
    const ret = { value: parts[0], quality: 1, params: {} };
    for (var i = 1; i < parts.length; ++i) {
        const pms = parts[i].split(/ *= */);
        if ('q' === pms[0])
            ret.quality = parseFloat(pms[1]);
        else
            ret.params[pms[0]] = pms[1];
    }
    return ret;
}
