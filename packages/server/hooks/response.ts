import { hookIterator, hookRunnerGenerator } from './utils';

import { CM_ERR_SEND_UNDEFINED_ERR } from '../lib/errors';

export const onResponseHookIterator = (fn, req, res, next) => {
    return fn(req, res, next);
};

export const onSendHookRunner = (functions, request, res, payload, cb) => {
    let i = 0;

    function next(err?, newPayload?) {
        if (err) {
            cb(err, request, res, payload);
            return;
        }

        if (newPayload !== undefined) payload = newPayload;

        if (i === functions.length) {
            cb(null, request, res, payload);
            return;
        }

        let result;
        try {
            result = functions[i++](request, res, payload, next);
        } catch (error) {
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
        if (!err) err = new CM_ERR_SEND_UNDEFINED_ERR();
        cb(err, request, res, payload);
    }

    next();
};

export const onResponseHookRunner = hookRunnerGenerator(onResponseHookIterator);
export const preValidationHookRunner = hookRunnerGenerator(hookIterator);
export const preHandlerHookRunner = hookRunnerGenerator(hookIterator);
export const onTimeoutHookRunner = hookRunnerGenerator(hookIterator);
export const preSerializationHookRunner = onSendHookRunner;
