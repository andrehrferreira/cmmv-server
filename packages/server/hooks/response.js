"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preSerializationHookRunner = exports.onTimeoutHookRunner = exports.preHandlerHookRunner = exports.preValidationHookRunner = exports.onResponseHookRunner = exports.onSendHookRunner = exports.onResponseHookIterator = void 0;
const utils_1 = require("./utils");
const errors_1 = require("../lib/errors");
const onResponseHookIterator = (fn, req, res, next) => {
    return fn(req, res, next);
};
exports.onResponseHookIterator = onResponseHookIterator;
const onSendHookRunner = (functions, request, res, payload, cb) => {
    let i = 0;
    function next(err, newPayload) {
        if (err) {
            cb(err, request, res, payload);
            return;
        }
        if (newPayload !== undefined)
            payload = newPayload;
        if (i === functions.length) {
            cb(null, request, res, payload);
            return;
        }
        let result;
        try {
            result = functions[i++](request, res, payload, next);
        }
        catch (error) {
            cb(error, request, res);
            return;
        }
        if (result && typeof result.then === 'function')
            result.then(handleResolve).catch(handleReject);
    }
    function handleResolve(newPayload) {
        next(null, newPayload);
    }
    function handleReject(err) {
        if (!err)
            err = new errors_1.CM_ERR_SEND_UNDEFINED_ERR();
        cb(err, request, res, payload);
    }
    next();
};
exports.onSendHookRunner = onSendHookRunner;
exports.onResponseHookRunner = (0, utils_1.hookRunnerGenerator)(exports.onResponseHookIterator);
exports.preValidationHookRunner = (0, utils_1.hookRunnerGenerator)(utils_1.hookIterator);
exports.preHandlerHookRunner = (0, utils_1.hookRunnerGenerator)(utils_1.hookIterator);
exports.onTimeoutHookRunner = (0, utils_1.hookRunnerGenerator)(utils_1.hookIterator);
exports.preSerializationHookRunner = exports.onSendHookRunner;
