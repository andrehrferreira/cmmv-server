"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const https = require("node:https");
const url = require("node:url");
const cookie = require("cookie");
class Request {
    constructor(app, req, res, body, params) {
        this.app = app;
        this.req = req;
        this.res = res;
        this.body = body;
        this.params = params;
    }
    get httpRequest() {
        return this.req;
    }
    get method() {
        return this.req.method;
    }
    get path() {
        return url.parse(this.req.url, true).pathname;
    }
    get url() {
        return this.req.url;
    }
    get baseUrl() {
        return this.req['baseUrl'] || '';
    }
    get cookies() {
        return cookie.parse(this.req.headers.cookie || '');
    }
    get fresh() {
        return this.req['fresh'];
    }
    get hostname() {
        return this.req.headers.host?.split(':')[0];
    }
    get ip() {
        return this.req.socket.remoteAddress;
    }
    get ips() {
        return (this.req.headers['x-forwarded-for'] || '')
            .split(',')
            .map(ip => ip.trim());
    }
    get originalUrl() {
        return this.req['originalUrl'] || this.req.url;
    }
    get protocol() {
        if (this.app.socket instanceof https.Server)
            return 'https';
        if (this.req.headers[':scheme'] === 'https')
            return 'https';
        return 'http';
    }
    get query() {
        return url.parse(this.req.url, true).query;
    }
    get secure() {
        return this.protocol === 'https';
    }
    get stale() {
        return !this.fresh;
    }
    get subdomains() {
        const hostname = this.hostname || '';
        return hostname.split('.').slice(0, -2);
    }
    get xhr() {
        const requestedWith = this.req.headers['x-requested-with'];
        if (typeof requestedWith === 'string')
            return requestedWith.toLowerCase() === 'xmlhttprequest';
        return false;
    }
}
exports.Request = Request;
