"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const http2_1 = require("http2");
const FindMyWay = require("find-my-way");
const request_1 = require("./request");
const response_1 = require("./response");
const { HTTP_STATUS_OK } = http2_1.constants;
class Router {
    constructor() {
        this.params = new Map();
        if (!this.router) {
            this.router = FindMyWay({
                caseSensitive: false,
                ignoreTrailingSlash: true,
                ignoreDuplicateSlashes: true,
                allowUnsafeRegex: true,
            });
        }
    }
    param(valueOrObject, cb) {
        if (typeof valueOrObject === "string")
            this.params.set(valueOrObject, cb);
        else if (Array.isArray(valueOrObject)) {
            valueOrObject.forEach((item) => this.params.set(item, cb));
        }
    }
    isHttp2Request(req) {
        return req.stream !== undefined;
    }
    all(path, ...callbacks) {
        this.get(path, ...callbacks);
        this.post(path, ...callbacks);
        this.put(path, ...callbacks);
        this.delete(path, ...callbacks);
        this.patch(path, ...callbacks);
        this.checkout(path, ...callbacks);
        this.copy(path, ...callbacks);
        this.lock(path, ...callbacks);
        this.merge(path, ...callbacks);
        this.mkactivity(path, ...callbacks);
        this.mkcol(path, ...callbacks);
        this.move(path, ...callbacks);
        this["m-search"](path, ...callbacks);
        this.notify(path, ...callbacks);
        this.options(path, ...callbacks);
        this.purge(path, ...callbacks);
        this.search(path, ...callbacks);
        this.subscribe(path, ...callbacks);
        this.trace(path, ...callbacks);
        this.unlock(path, ...callbacks);
        this.unsubscribe(path, ...callbacks);
    }
    mergeRoutes(method, path, ...callbacks) {
        if (!this.router.hasRoute(method, path))
            this.router.on(method, path, (req, res) => { }, { callbacks });
        else {
            const handler = this.router.findRoute(method, path);
            this.router.off(method, path);
            this.router.on(method, path, (req, res) => { }, {
                callbacks: [...handler.store.callbacks, ...callbacks,]
            });
        }
    }
    get(path, ...callbacks) {
        this.mergeRoutes('GET', path, ...callbacks);
        this.mergeRoutes('HEAD', path, ...callbacks);
    }
    post(path, ...callbacks) {
        this.mergeRoutes('POST', path, ...callbacks);
    }
    put(path, ...callbacks) {
        this.mergeRoutes('PUT', path, ...callbacks);
    }
    delete(path, ...callbacks) {
        this.mergeRoutes('DELETE', path, ...callbacks);
    }
    head(path, ...callbacks) {
        this.mergeRoutes('HEAD', path, ...callbacks);
    }
    patch(path, ...callbacks) {
        this.mergeRoutes('PATCH', path, ...callbacks);
    }
    checkout(path, ...callbacks) {
        this.mergeRoutes('CHECKOUT', path, ...callbacks);
    }
    copy(path, ...callbacks) {
        this.mergeRoutes('COPY', path, ...callbacks);
    }
    lock(path, ...callbacks) {
        this.mergeRoutes('LOCK', path, ...callbacks);
    }
    merge(path, ...callbacks) {
        this.mergeRoutes('MERGE', path, ...callbacks);
    }
    mkactivity(path, ...callbacks) {
        this.mergeRoutes('MKACTIVITY', path, ...callbacks);
    }
    mkcol(path, ...callbacks) {
        this.mergeRoutes('MKCOL', path, ...callbacks);
    }
    move(path, ...callbacks) {
        this.mergeRoutes('MOVE', path, ...callbacks);
    }
    'm-search'(path, ...callbacks) {
        this.mergeRoutes('M-SEARCH', path, ...callbacks);
    }
    notify(path, ...callbacks) {
        this.mergeRoutes('NOTIFY', path, ...callbacks);
    }
    options(path, ...callbacks) {
        this.mergeRoutes('OPTIONS', path, ...callbacks);
    }
    purge(path, ...callbacks) {
        this.mergeRoutes('PURGE', path, ...callbacks);
    }
    report(path, ...callbacks) {
        this.mergeRoutes('REPORT', path, ...callbacks);
    }
    search(path, ...callbacks) {
        this.mergeRoutes('SEARCH', path, ...callbacks);
    }
    subscribe(path, ...callbacks) {
        this.mergeRoutes('SUBSCRIBE', path, ...callbacks);
    }
    trace(path, ...callbacks) {
        this.mergeRoutes('TRACE', path, ...callbacks);
    }
    unlock(path, ...callbacks) {
        this.mergeRoutes('UNLOCK', path, ...callbacks);
    }
    unsubscribe(path, ...callbacks) {
        this.mergeRoutes('UNSUBSCRIBE', path, ...callbacks);
    }
    async process(socket, req, res, body) {
        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
                'Vary': 'Access-Control-Request-Headers',
                'Content-Length': '0',
                'Connection': 'close',
                'Date': new Date().toUTCString(),
            });
            res.end();
            return null;
        }
        const route = this.router.find(req.method, req.url);
        if (route && route.store && route.store.callbacks && route.store.callbacks.length > 0) {
            const request = new request_1.Request(socket, req, res, body, {
                ...route.params,
            });
            const response = new response_1.Response(socket, req, res);
            if (request.params) {
                for (const key in request.params) {
                    if (this.params.has(key)) {
                        route.store.callbacks.unshift((req, res, next) => {
                            const callback = this.params.get(key);
                            callback(req, res, async () => {
                                next(req, res, next);
                            }, request.params[key]);
                        });
                    }
                }
            }
            return {
                request, response,
                fn: route.store.callbacks,
                head: req.method === "HEAD"
            };
        }
        return null;
    }
}
exports.Router = Router;
