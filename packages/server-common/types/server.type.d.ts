import * as http from 'node:http';
import * as https from 'node:https';
import * as http2 from 'node:http2';
export type ServerHttp = http.Server;
export type ServerHttps = https.Server;
export type ServerHttp2 = http2.Http2Server;
export type ServerHttp2Secure = http2.Http2SecureServer;
export type Server = ServerHttp | ServerHttps | ServerHttp2 | ServerHttp2Secure;
