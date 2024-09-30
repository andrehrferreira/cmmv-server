"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hooks = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("./errors");
class Hooks {
    constructor() {
        this.onRequest = [];
        this.onResponse = [];
        this.onSend = [];
        this.onError = [];
        this.onRoute = [];
        this.onRegister = [];
        this.onReady = [];
        this.onListen = [];
        this.onTimeout = [];
        this.onRequestAbort = [];
        this.preHandler = [];
        this.preParsing = [];
        this.preValidation = [];
        this.preSerialization = [];
        this.preClose = [];
    }
    validate(hook, fn) {
        if (typeof hook !== 'string')
            throw new errors_1.CM_ERR_HOOK_INVALID_TYPE();
        if (Array.isArray(this[hook]) === false)
            throw new errors_1.CM_ERR_HOOK_NOT_SUPPORTED(hook);
        if (typeof fn !== 'function')
            throw new errors_1.CM_ERR_HOOK_INVALID_HANDLER(hook, Object.prototype.toString.call(fn));
    }
    add(hook, fn) {
        this.validate(hook, fn);
        this[hook].push(fn);
    }
}
exports.Hooks = Hooks;
tslib_1.__exportStar(require("../hooks"), exports);
