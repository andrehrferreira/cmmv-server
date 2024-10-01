export * from './interfaces';
export * from './lib';
import { Router as router } from './lib/router';
import * as Utils from './utils';
declare function CmmvServer(this: any, options?: any): any;
export default CmmvServer;
export declare const application: (options?: any, httpHandler?: Function) => {
    server: any;
    listen: any;
};
export declare const json: (options?: import("@cmmv/body-parser").BodyParserJSONOptions) => Promise<any>;
export declare const urlencoded: (options?: import("@cmmv/body-parser").BodyParserUrlEncodedOptions) => Promise<any>;
export declare const text: (options?: import("@cmmv/body-parser").BodyParserTextOptions) => Promise<any>;
export declare const raw: (options?: import("@cmmv/body-parser").BodyParserRawOptions) => Promise<any>;
export declare const Router: typeof router;
export declare const Route: typeof router;
export declare const request: any;
export declare const response: any;
export declare const utils: typeof Utils;
