/*!
 * CMMV Cors
 * Copyright(c) 2013 Troy Goode <troygoode@gmail.com>
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/cors
 */
export interface CorsOptions {
    origin?: any;
    methods?: string | string[];
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
    credentials?: boolean;
    maxAge?: number;
    headers?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
}
export declare class CorsMiddleware {
    middlewareName: string;
    private options;
    constructor(options?: CorsOptions);
    process(req: any, res: any, next?: any): Promise<void>;
    onCall(req: any, res: any, payload: any, done: any): Promise<void>;
    isString(s: any): s is string | String;
    isOriginAllowed(origin: any, allowedOrigin: any): boolean;
    configureOrigin(options: any, req: any): any[];
    configureMethods(options: any): {
        key: string;
        value: any;
    };
    configureCredentials(options: any): {
        key: string;
        value: string;
    };
    configureAllowedHeaders(options: any, req: any): any[];
    configureExposedHeaders(options: any): {
        key: string;
        value: any;
    };
    configureMaxAge(options: any): {
        key: string;
        value: any;
    };
    applyHeaders(headers: any, res: any): void;
}
export default function (options?: CorsOptions): Promise<(req: any, res: any, next: any) => Promise<void>>;
export declare const cors: (options?: CorsOptions | Function) => (req: any, res: any, next: any) => void;
