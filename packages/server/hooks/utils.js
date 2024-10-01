"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHooks = exports.preParsingHookRunner = exports.onListenHookRunner = exports.hookRunnerGenerator = void 0;
exports.hookIterator = hookIterator;
const errors_1 = require("../lib/errors");
const symbols_1 = require("../lib/symbols");
const hooks_1 = require("../lib/hooks");
function hookIterator(fn, req, res, next) {
    if (res.sent === true)
        return undefined;
    return fn(req, res, next);
}
const hookRunnerGenerator = iterator => {
    return function hookRunner(functions, req, res, cb) {
        let i = 0;
        function next(err) {
            if (res.sent)
                return;
            if (err || i === functions.length) {
                cb(err, req, res);
                return;
            }
            let result;
            try {
                result = iterator(functions[i++], req, res, next);
            }
            catch (error) {
                cb(error, req, res);
                return;
            }
            if (result && typeof result.then === 'function')
                result.then(handleResolve).catch(handleReject);
        }
        function handleResolve() {
            next();
        }
        function handleReject(err) {
            if (!err)
                err = new errors_1.CM_ERR_SEND_UNDEFINED_ERR();
            cb(err, req, res);
        }
        next();
    };
};
exports.hookRunnerGenerator = hookRunnerGenerator;
const onListenHookRunner = server => {
    const hooks = server[symbols_1.kHooks].onListen;
    const hooksLen = hooks.length;
    let i = 0;
    let c = 0;
    next();
    function next(err) {
        err && console.error(err);
        if (i === hooksLen) {
            while (c < server[symbols_1.kChildren].length) {
                const child = server[symbols_1.kChildren][c++];
                (0, exports.onListenHookRunner)(child);
            }
            return;
        }
        wrap(hooks[i++], server, next);
    }
    async function wrap(fn, server, done) {
        if (fn.length === 1) {
            try {
                fn.call(server, done);
            }
            catch (e) {
                done(e);
            }
            return;
        }
        try {
            const ret = fn.call(server);
            if (ret && typeof ret.then === 'function') {
                ret.then(done, done);
                return;
            }
            done();
        }
        catch (error) {
            done(error);
        }
    }
};
exports.onListenHookRunner = onListenHookRunner;
const preParsingHookRunner = (functions, req, res, cb) => {
    let i = 0;
    function next(err, newPayload) {
        if (res.sent)
            return;
        if (newPayload !== undefined)
            req[symbols_1.kRequestPayloadStream] = newPayload;
        if (err || i === functions.length) {
            cb(err, req, res);
            return;
        }
        let result;
        try {
            result = functions[i++](req, res, req[symbols_1.kRequestPayloadStream], next);
        }
        catch (error) {
            cb(error, req, res);
            return;
        }
        if (result && typeof result.then === 'function')
            result.then(handleResolve, handleReject);
    }
    function handleResolve(newPayload) {
        next(null, newPayload);
    }
    function handleReject(err) {
        if (!err)
            err = new errors_1.CM_ERR_SEND_UNDEFINED_ERR();
        cb(err, req, res);
    }
    next();
};
exports.preParsingHookRunner = preParsingHookRunner;
const buildHooks = h => {
    const hooks = new hooks_1.Hooks();
    hooks.onRequest = h.onRequest.slice();
    hooks.preParsing = h.preParsing.slice();
    hooks.preValidation = h.preValidation.slice();
    hooks.preSerialization = h.preSerialization.slice();
    hooks.preHandler = h.preHandler.slice();
    hooks.onSend = h.onSend.slice();
    hooks.onResponse = h.onResponse.slice();
    hooks.onError = h.onError.slice();
    hooks.onRoute = h.onRoute.slice();
    hooks.onRegister = h.onRegister.slice();
    hooks.onTimeout = h.onTimeout.slice();
    hooks.onRequestAbort = h.onRequestAbort.slice();
    hooks.onReady = [];
    hooks.onListen = [];
    hooks.preClose = [];
    return hooks;
};
exports.buildHooks = buildHooks;
