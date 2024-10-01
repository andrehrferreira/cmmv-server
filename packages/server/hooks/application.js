"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookRunnerApplication = void 0;
const symbols_1 = require("../lib/symbols");
const hookRunnerApplication = (hookName, boot, server, cb) => {
    const hooks = server[symbols_1.kHooks][hookName];
    let i = 0;
    let c = 0;
    next();
    function exit(err) {
        if (err) {
            /*if (err.code === 'AVV_ERR_READY_TIMEOUT') {
                err = appendStackTrace(err, new FST_ERR_HOOK_TIMEOUT(hookName))
            } else {
                err = AVVIO_ERRORS_MAP[err.code] != null
                    ? appendStackTrace(err, new AVVIO_ERRORS_MAP[err.code](err.message))
                    : err
            }*/
            cb(err);
            return;
        }
        cb();
    }
    function next(err) {
        if (err) {
            exit(err);
            return;
        }
        if (i === hooks.length && c === server[symbols_1.kChildren].length) {
            if (i === 0 && c === 0) {
                // speed up start
                exit();
            }
            else {
                boot(function manageTimeout(err, done) {
                    exit(err);
                    done(err);
                });
            }
            return;
        }
        if (i === hooks.length && c < server[symbols_1.kChildren].length) {
            const child = server[symbols_1.kChildren][c++];
            (0, exports.hookRunnerApplication)(hookName, boot, child, next);
            return;
        }
        boot(wrap(hooks[i++], server));
        next();
    }
    function wrap(fn, server) {
        return function (err, done) {
            if (err) {
                done(err);
                return;
            }
            if (fn.length === 1) {
                try {
                    fn.call(server, done);
                }
                catch (error) {
                    done(error);
                }
                return;
            }
            try {
                const ret = fn.call(server);
                if (ret && typeof ret.then === 'function') {
                    ret.then(done, done);
                    return;
                }
            }
            catch (error) {
                err = error;
            }
            done(err);
        };
    }
};
exports.hookRunnerApplication = hookRunnerApplication;
