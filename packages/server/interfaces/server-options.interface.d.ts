export interface ServerOptions {
    http2?: boolean;
    connectionsCheckingInterval?: number;
    headersTimeout?: number;
    insecureHTTPParser?: boolean;
    joinDuplicateHeaders?: boolean;
    keepAlive?: boolean;
    keepAliveInitialDelay?: number;
    keepAliveTimeout?: number;
    maxHeaderSize?: number;
    noDelay?: boolean;
    requestTimeout?: number;
    requireHostHeader?: boolean;
    rejectNonStandardBodyWrites?: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    allowHTTP1?: boolean;
}
export declare class DefaultServerOptions implements ServerOptions {
    connectionsCheckingInterval: number;
    headersTimeout: number;
    insecureHTTPParser: boolean;
    joinDuplicateHeaders: boolean;
    keepAlive: boolean;
    keepAliveInitialDelay: number;
    keepAliveTimeout: number;
    maxHeaderSize: number;
    noDelay: boolean;
    requestTimeout: number;
    requireHostHeader: boolean;
    rejectNonStandardBodyWrites: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    allowHTTP1?: boolean;
    constructor(options?: ServerOptions);
    ToOptions(): Object;
}
export interface ServerHTTP2Options {
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    allowHTTP1?: boolean;
}
export declare class DefaultServerHTTP2Options implements ServerHTTP2Options {
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    allowHTTP1?: boolean;
    constructor(options?: ServerOptions);
    ToOptions(): Object;
}
