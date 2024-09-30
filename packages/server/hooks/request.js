"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestAbortHookRunner = exports.onRequestHookRunner = void 0;
const utils_1 = require("./utils");
const errors_1 = require("../lib/errors");
exports.onRequestHookRunner = (0, utils_1.hookRunnerGenerator)(utils_1.hookIterator);
const onRequestAbortHookRunner = (functions, request, cb) => {
    let i = 0;
    function next(err) {
        if (err || i === functions.length) {
            cb(err, request);
            return;
        }
        let result;
        try {
            result = functions[i++](request, next);
        }
        catch (error) {
            cb(error, request);
            return;
        }
        if (result && typeof result.then === 'function')
            result.then(handleResolve, handleReject);
    }
    function handleResolve() {
        next();
    }
    function handleReject(err) {
        if (!err)
            err = new errors_1.CM_ERR_SEND_UNDEFINED_ERR();
        cb(err, request);
    }
    next();
};
exports.onRequestAbortHookRunner = onRequestAbortHookRunner;
