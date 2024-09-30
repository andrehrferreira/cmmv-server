export * from './interfaces';
export * from './lib';
import { Router as router } from './lib/router';
import * as Utils from './utils';
import { ServerOptions } from '@cmmv/server-common';
declare function CmmvServer(this: any, options?: ServerOptions): any;
export default CmmvServer;
export declare const application: (options?: ServerOptions, httpHandler?: Function) => {
    server: any;
    listen: any;
};
export declare const Router: typeof router;
export declare const Route: typeof router;
export declare const request: any;
export declare const response: any;
export declare const utils: typeof Utils;
