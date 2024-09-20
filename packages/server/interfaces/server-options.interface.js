"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultServerHTTP2Options = exports.DefaultServerOptions = void 0;
class DefaultServerOptions {
    constructor(options) {
        this.connectionsCheckingInterval = 3000;
        this.headersTimeout = 6000;
        this.insecureHTTPParser = false;
        this.joinDuplicateHeaders = false;
        this.keepAlive = true;
        this.keepAliveInitialDelay = 0;
        this.keepAliveTimeout = 5000;
        this.maxHeaderSize = 16384;
        this.noDelay = true;
        this.requestTimeout = 300000;
        this.requireHostHeader = true;
        this.rejectNonStandardBodyWrites = false;
        this.connectionsCheckingInterval =
            options?.connectionsCheckingInterval || 3000;
        this.headersTimeout = options?.headersTimeout || 6000;
        this.insecureHTTPParser = options?.insecureHTTPParser || false;
        this.joinDuplicateHeaders = options?.joinDuplicateHeaders || false;
        this.keepAlive = options?.keepAlive || true;
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
    ToOptions() {
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
exports.DefaultServerOptions = DefaultServerOptions;
class DefaultServerHTTP2Options {
    constructor(options) {
        this.key = options?.key || undefined;
        this.cert = options?.cert || undefined;
        this.passphrase = options?.passphrase || undefined;
        this.allowHTTP1 = options?.allowHTTP1 || true;
    }
    ToOptions() {
        return {
            key: this.key,
            cert: this.cert,
            passphrase: this.passphrase,
            allowHTTP1: this.allowHTTP1,
        };
    }
}
exports.DefaultServerHTTP2Options = DefaultServerHTTP2Options;
