import { CM_ERR_SEND_UNDEFINED_ERR } from '../lib/errors';

import { kHooks, kChildren, kRequestPayloadStream } from '../lib/symbols';

import { Hooks } from '../lib/hooks';

export function hookIterator(fn, req, res, next) {
    if (res.sent === true) return undefined;
    return fn(req, res, next);
}

export const hookRunnerGenerator = iterator => {
    return function hookRunner(functions, req, res, cb) {
        let i = 0;

        function next(err?) {
            if (res.sent) return;

            if (err || i === functions.length) {
                cb(err, req, res);
                return;
            }

            let result;

            try {
                result = iterator(functions[i++], req, res, next);
            } catch (error) {
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
            if (!err) err = new CM_ERR_SEND_UNDEFINED_ERR();
            cb(err, req, res);
        }

        next();
    };
};

export const onListenHookRunner = server => {
    const hooks = server[kHooks].onListen;
    const hooksLen = hooks.length;

    let i = 0;
    let c = 0;

    next();

    function next(err?) {
        err && console.error(err);

        if (i === hooksLen) {
            while (c < server[kChildren].length) {
                const child = server[kChildren][c++];
                onListenHookRunner(child);
            }

            return;
        }

        wrap(hooks[i++], server, next);
    }

    async function wrap(fn, server, done) {
        if (fn.length === 1) {
            try {
                fn.call(server, done);
            } catch (e) {
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
        } catch (error) {
            done(error);
        }
    }
};

export const preParsingHookRunner = (functions, req, res, cb) => {
    let i = 0;

    function next(err?, newPayload?) {
        if (res.sent) return;

        if (newPayload !== undefined) req[kRequestPayloadStream] = newPayload;

        if (err || i === functions.length) {
            cb(err, req, res);
            return;
        }

        let result;
        try {
            result = functions[i++](req, res, req[kRequestPayloadStream], next);
        } catch (error) {
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
        if (!err) err = new CM_ERR_SEND_UNDEFINED_ERR();

        cb(err, req, res);
    }

    next();
};

export const buildHooks = h => {
    const hooks = new Hooks();
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
