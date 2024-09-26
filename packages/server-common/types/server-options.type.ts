import * as http from 'node:http';
import * as https from 'node:https';
import * as http2 from 'node:http2';

export type ServerHttpOptions = http.ServerOptions;
export type ServerHttpsOptions = https.ServerOptions;
export type ServerHttp2Options = http2.ServerOptions;
export type ServerHttp2SecureOptions = http2.SecureServerOptions;

export type ServerOptions = (
    | ServerHttpOptions
    | ServerHttpsOptions
    | ServerHttp2Options
    | ServerHttp2SecureOptions
) & {
    http2?: boolean;
    serverFactory?: Function;
    keepAliveTimeout?: number;
    requestTimeout?: number;
    maxRequestsPerSocket?: number;
    maxHeaderSize?: number;
    connectionTimeout?: number;
    insecureHTTPParser?: boolean;
    joinDuplicateHeaders?: boolean;
    bodyLimit?: number;
    querystringParser?: Function;
    http?: ServerHttpOptions;
    https?: ServerHttpsOptions | undefined;
};
