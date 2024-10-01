export declare class Hooks {
    onRequest: any[];
    onResponse: any[];
    onSend: any[];
    onError: any[];
    onRoute: any[];
    onRegister: any[];
    onReady: any[];
    onListen: any[];
    onTimeout: any[];
    onRequestAbort: any[];
    preHandler: any[];
    preParsing: any[];
    preValidation: any[];
    preSerialization: any[];
    preClose: any[];
    validate(hook: string, fn: any): void;
    add(hook: any, fn: any): void;
}
export * from '../hooks';
