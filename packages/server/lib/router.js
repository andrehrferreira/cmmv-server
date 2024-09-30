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
    get(path, ...callbacks) {
        this.mergeRoutes('GET', path, ...callbacks);
        this.mergeRoutes('HEAD', path, ...callbacks);
    }
    use(path, fn) {
        console.log(path, fn);
    }
}
exports.Router = Router;
