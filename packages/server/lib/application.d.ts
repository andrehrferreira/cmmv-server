import { EventEmitter } from 'node:events';
export declare class Application extends EventEmitter {
    request: any;
    response: any;
    constructor();
    private processOptions;
    private injectApplication;
    createServerInstance(options?: any, httpHandler?: any): {
        server: any;
        listen: (listenOptions: {
            host: string;
            port: number;
        }) => any;
    };
    private _handler;
    private http2;
    throwIfAlreadyStarted(msg: any): void;
    runPreParsing(err: any, request: any, response: any): void;
    handleOnRequestAbortHooksErrors(reply: any, err: any): void;
}
declare const _default: (options?: any, httpHandler?: Function) => {
    server: any;
    listen: any;
};
export default _default;
