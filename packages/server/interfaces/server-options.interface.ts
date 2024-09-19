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

export class DefaultServerOptions implements ServerOptions {
    public connectionsCheckingInterval: number = 3000;
    public headersTimeout: number = 6000;
    public insecureHTTPParser: boolean = false;
    public joinDuplicateHeaders: boolean = false;
    public keepAlive: boolean = false;
    public keepAliveInitialDelay: number = 0;
    public keepAliveTimeout: number = 0;
    public maxHeaderSize: number = 16384;
    public noDelay: boolean = true;
    public requestTimeout: number = 300000;
    public requireHostHeader: boolean = true;
    public rejectNonStandardBodyWrites: boolean = false;
    public key?: Buffer;
    public cert?: Buffer;
    public passphrase?: string;
    public allowHTTP1?: boolean;

    constructor(options?: ServerOptions) {
        this.connectionsCheckingInterval =
            options?.connectionsCheckingInterval || 3000;
        this.headersTimeout = options?.headersTimeout || 6000;
        this.insecureHTTPParser = options?.insecureHTTPParser || false;
        this.joinDuplicateHeaders = options?.joinDuplicateHeaders || false;
        this.keepAlive = options?.keepAlive || false;
        this.keepAliveInitialDelay = options?.keepAliveInitialDelay || 0;
        this.keepAliveTimeout = options?.keepAliveTimeout || 5000;
        this.maxHeaderSize = options?.maxHeaderSize || 16384;
        this.noDelay = options?.noDelay || true;
        this.requestTimeout = options?.requestTimeout || 300000;
        this.requireHostHeader = options?.requireHostHeader || true;
        this.rejectNonStandardBodyWrites =
            options?.rejectNonStandardBodyWrites || false;
        this.key = options?.key || undefined;
        this.cert = options?.cert || undefined;
        this.passphrase = options?.passphrase || undefined;
        this.allowHTTP1 = options?.allowHTTP1 || true;
    }

    public ToOptions(): Object {
        return {
            connectionsCheckingInterval: this.connectionsCheckingInterval,
            headersTimeout: this.headersTimeout,
            insecureHTTPParser: this.insecureHTTPParser,
            joinDuplicateHeaders: this.joinDuplicateHeaders,
            keepAlive: this.keepAlive,
            keepAliveInitialDelay: this.keepAliveInitialDelay,
            keepAliveTimeout: this.keepAliveTimeout,
            maxHeaderSize: this.maxHeaderSize,
            noDelay: this.noDelay,
            requestTimeout: this.requestTimeout,
            requireHostHeader: this.requireHostHeader,
            rejectNonStandardBodyWrites: this.rejectNonStandardBodyWrites,
            key: this.key,
            cert: this.cert,
            passphrase: this.passphrase,
            allowHTTP1: this.allowHTTP1,
        };
    }
}

export interface ServerHTTP2Options {
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    allowHTTP1?: boolean;
}

export class DefaultServerHTTP2Options implements ServerHTTP2Options {
    public key?: Buffer;
    public cert?: Buffer;
    public passphrase?: string;
    public allowHTTP1?: boolean;

    constructor(options?: ServerOptions) {
        this.key = options?.key || undefined;
        this.cert = options?.cert || undefined;
        this.passphrase = options?.passphrase || undefined;
        this.allowHTTP1 = options?.allowHTTP1 || true;
    }

    public ToOptions(): Object {
        return {
            key: this.key,
            cert: this.cert,
            passphrase: this.passphrase,
            allowHTTP1: this.allowHTTP1,
        };
    }
}
