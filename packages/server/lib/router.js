"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const FindMyWay = require("find-my-way");
class Router {
    constructor(path = '') {
        this.path = path;
        this.stack = new Map();
        if (!this.router) {
            this.router = FindMyWay({
                caseSensitive: false,
                ignoreTrailingSlash: true,
                ignoreDuplicateSlashes: true,
                allowUnsafeRegex: true,
            });
            this.stack = new Map();
        }
    }
    find(method, path) {
        return new Promise((resolve, reject) => {
            const httpMethod = method;
            if (this.router.hasRoute(httpMethod, path)) {
                const route = this.router.find(httpMethod, path);
                resolve(route);
            }
            else {
                reject();
            }
        });
    }
    mergeRoutes(method, path, ...callbacks) {
        if (typeof path !== 'function') {
            let finalPath = this.path ? this.path + path : path;
            if (!this.router.hasRoute(method, finalPath)) {
                this.router.on(method, finalPath, (req, res) => { }, {
                    stack: callbacks,
                });
            }
            else {
                const handler = this.router.find(method, finalPath);
                this.router.off(method, finalPath);
                this.router.on(method, finalPath, (req, res) => { }, {
                    stack: [...handler.store.stack, ...callbacks],
                });
            }
        }
    }
    acl(path, ...callbacks) {
        this.mergeRoutes('ACL', path, ...callbacks);
    }
    bind(path, ...callbacks) {
        this.mergeRoutes('BIND', path, ...callbacks);
    }
    checkout(path, ...callbacks) {
        this.mergeRoutes('CHECKOUT', path, ...callbacks);
    }
    connect(path, ...callbacks) {
        this.mergeRoutes('CONNECT', path, ...callbacks);
    }
    copy(path, ...callbacks) {
        this.mergeRoutes('COPY', path, ...callbacks);
    }
    delete(path, ...callbacks) {
        this.mergeRoutes('DELETE', path, ...callbacks);
    }
    get(path, ...callbacks) {
        this.mergeRoutes('GET', path, ...callbacks);
        this.mergeRoutes('HEAD', path, ...callbacks);
    }
    head(path, ...callbacks) {
        this.mergeRoutes('HEAD', path, ...callbacks);
    }
    link(path, ...callbacks) {
        this.mergeRoutes('LINK', path, ...callbacks);
    }
    lock(path, ...callbacks) {
        this.mergeRoutes('LOCK', path, ...callbacks);
    }
    'm-search'(path, ...callbacks) {
        this.mergeRoutes('M-SEARCH', path, ...callbacks);
    }
    merge(path, ...callbacks) {
        this.mergeRoutes('MERGE', path, ...callbacks);
    }
    mkactivity(path, ...callbacks) {
        this.mergeRoutes('MKACTIVITY', path, ...callbacks);
    }
    mkcalendar(path, ...callbacks) {
        this.mergeRoutes('MKCALENDAR', path, ...callbacks);
    }
    mkcol(path, ...callbacks) {
        this.mergeRoutes('MKCOL', path, ...callbacks);
    }
    move(path, ...callbacks) {
        this.mergeRoutes('MOVE', path, ...callbacks);
    }
    notify(path, ...callbacks) {
        this.mergeRoutes('NOTIFY', path, ...callbacks);
    }
    options(path, ...callbacks) {
        this.mergeRoutes('OPTIONS', path, ...callbacks);
    }
    patch(path, ...callbacks) {
        this.mergeRoutes('PATCH', path, ...callbacks);
    }
    post(path, ...callbacks) {
        this.mergeRoutes('POST', path, ...callbacks);
    }
    propfind(path, ...callbacks) {
        this.mergeRoutes('PROPFIND', path, ...callbacks);
    }
    proppatch(path, ...callbacks) {
        this.mergeRoutes('PROPPATCH', path, ...callbacks);
    }
    purge(path, ...callbacks) {
        this.mergeRoutes('PURGE', path, ...callbacks);
    }
    put(path, ...callbacks) {
        this.mergeRoutes('PUT', path, ...callbacks);
    }
    rebind(path, ...callbacks) {
        this.mergeRoutes('REBIND', path, ...callbacks);
    }
    report(path, ...callbacks) {
        this.mergeRoutes('REPORT', path, ...callbacks);
    }
    search(path, ...callbacks) {
        this.mergeRoutes('SEARCH', path, ...callbacks);
    }
    source(path, ...callbacks) {
        this.mergeRoutes('SOURCE', path, ...callbacks);
    }
    subscribe(path, ...callbacks) {
        this.mergeRoutes('SUBSCRIBE', path, ...callbacks);
    }
    trace(path, ...callbacks) {
        this.mergeRoutes('TRACE', path, ...callbacks);
    }
    unbind(path, ...callbacks) {
        this.mergeRoutes('UNBIND', path, ...callbacks);
    }
    unlink(path, ...callbacks) {
        this.mergeRoutes('UNLINK', path, ...callbacks);
    }
    unlock(path, ...callbacks) {
        this.mergeRoutes('UNLOCK', path, ...callbacks);
    }
    unsubscribe(path, ...callbacks) {
        this.mergeRoutes('UNSUBSCRIBE', path, ...callbacks);
    }
    use(path, fn) {
        console.log(path, fn);
    }
}
exports.Router = Router;
