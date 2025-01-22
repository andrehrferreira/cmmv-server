import { hookIterator, hookRunnerGenerator } from './utils';

import { CM_ERR_SEND_UNDEFINED_ERR } from '../lib/errors';

export const onRequestHookRunner = hookRunnerGenerator(hookIterator);

export const onRequestAbortHookRunner = (functions, request, cb) => {
    let i = 0;

    function next(err?) {
        if (err || i === functions.length) {
            cb(err, request);
            return;
        }

        let result;

        try {
            result = functions[i++](request, next);
        } catch (error) {
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
        if (!err) err = new CM_ERR_SEND_UNDEFINED_ERR();

        cb(err, request);
    }

    next();
};
