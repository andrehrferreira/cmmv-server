import { EventEmitter } from 'node:events';
import { ServerOptions } from '@cmmv/server-common';
export declare class Application extends EventEmitter {
    request: any;
    response: any;
    constructor();
    private processOptions;
    private injectApplication;
    createServerInstance(options?: ServerOptions, httpHandler?: any): {
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
declare const _default: (options?: ServerOptions, httpHandler?: Function) => {
    server: any;
    listen: any;
};
export default _default;
