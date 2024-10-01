"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildErrorHandler = exports.handleError = exports.rootErrorHandler = void 0;
const node_http_1 = require("node:http");
const symbols_1 = require("./symbols");
const errors_1 = require("./errors");
const response_1 = require("./response");
const serializeError = require('./error-serializer');
exports.rootErrorHandler = {
    func: defaultErrorHandler,
    toJSON() {
        return this.func.name.toString() + '()';
    },
};
const handleError = (response, error, cb) => {
    response[symbols_1.kResponseIsRunningOnErrorHook] = false;
    if (response[symbols_1.kResponseNextErrorHandler] === false) {
        fallbackErrorHandler(error, response, function (res, payload) {
            try {
                response.res.writeHead(res.raw.statusCode, res[symbols_1.kResponseHeaders]);
            }
            catch (error) {
                response.res.writeHead(res.statusCode);
            }
            response.res.end(payload);
        });
        return;
    }
    const errorHandler = response[symbols_1.kResponseNextErrorHandler] || response.errorHandler;
    response[symbols_1.kResponseNextErrorHandler] = Object.getPrototypeOf(errorHandler);
    delete response[symbols_1.kResponseHeaders]['content-type'];
    delete response[symbols_1.kResponseHeaders]['content-length'];
    const func = errorHandler?.func || null;
    if (!func) {
        response[symbols_1.kResponseNextErrorHandler] = false;
        fallbackErrorHandler(error, response, cb);
        return;
    }
    try {
        const result = func(error, response.request, response);
        if (result !== undefined) {
            if (result !== null && typeof result.then === 'function')
                (0, response_1.wrapThenable)(result, response);
            else
                response.send(result);
        }
    }
    catch (err) {
        response.send(err);
    }
};
exports.handleError = handleError;
const buildErrorHandler = (parent = exports.rootErrorHandler, func) => {
    if (!func)
        return parent;
    const errorHandler = Object.create(parent);
    errorHandler.func = func;
    return errorHandler;
};
exports.buildErrorHandler = buildErrorHandler;
function fallbackErrorHandler(error, res, cb) {
    const statusCode = res.statusCode;
    res[symbols_1.kResponseHeaders]['content-type'] =
        res[symbols_1.kResponseHeaders]['content-type'] ??
            'application/json; charset=utf-8';
    let payload;
    try {
        payload = serializeError({
            error: node_http_1.STATUS_CODES[statusCode + ''],
            code: error.code,
            message: error.message,
            statusCode,
        });
    }
    catch (err) {
        res.code(500);
        payload = serializeError(new errors_1.CM_ERR_FAILED_ERROR_SERIALIZATION(err.message, error.message));
    }
    if (typeof payload !== 'string' && !Buffer.isBuffer(payload))
        payload = serializeError(new errors_1.CM_ERR_RES_INVALID_PAYLOAD_TYPE(typeof payload));
    res[symbols_1.kResponseHeaders]['content-length'] = '' + Buffer.byteLength(payload);
    cb(res, payload);
}
function defaultErrorHandler(error, request, res) {
    setErrorHeaders(error, res);
    if (!res[symbols_1.kResponseHasStatusCode] || res.statusCode === 200) {
        const statusCode = error.statusCode || error.status;
        res.code(statusCode >= 400 ? statusCode : 500);
    }
    res.send(error);
}
function setErrorHeaders(error, res) {
    let statusCode = res.statusCode;
    statusCode = statusCode >= 400 ? statusCode : 500;
    if (error != null) {
        if (error.headers !== undefined)
            res.headers(error.headers);
        if (error.status >= 400)
            statusCode = error.status;
        else if (error.statusCode >= 400)
            statusCode = error.statusCode;
    }
    res.statusCode = statusCode;
}
