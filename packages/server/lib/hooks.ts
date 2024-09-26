import {
    CM_ERR_HOOK_INVALID_TYPE,
    CM_ERR_HOOK_NOT_SUPPORTED,
    CM_ERR_HOOK_INVALID_HANDLER,
} from './errors';

export class Hooks {
    public onRequest = [];
    public onResponse = [];
    public onSend = [];
    public onError = [];
    public onRoute = [];
    public onRegister = [];
    public onReady = [];
    public onListen = [];
    public onTimeout = [];
    public onRequestAbort = [];
    public preHandler = [];
    public preParsing = [];
    public preValidation = [];
    public preSerialization = [];
    public preClose = [];

    public validate(hook: string, fn) {
        if (typeof hook !== 'string') throw new CM_ERR_HOOK_INVALID_TYPE();
        if (Array.isArray(this[hook]) === false)
            throw new CM_ERR_HOOK_NOT_SUPPORTED(hook);
        if (typeof fn !== 'function')
            throw new CM_ERR_HOOK_INVALID_HANDLER(
                hook,
                Object.prototype.toString.call(fn),
            );
    }

    public add(hook, fn) {
        this.validate(hook, fn);
        this[hook].push(fn);
    }
}

export * from '../hooks';
