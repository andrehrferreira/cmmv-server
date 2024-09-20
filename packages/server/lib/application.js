"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmmvServer = exports.ServerApplication = void 0;
const http = require("node:http");
const https = require("node:https");
const http2 = require("node:http2");
const zlib = require("node:zlib");
const querystring = require("qs");
const formidable = require("formidable");
const events_1 = require("events");
const server_common_1 = require("@cmmv/server-common");
const server_static_1 = require("@cmmv/server-static");
const router_1 = require("./router");
const interfaces_1 = require("../interfaces");
const { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_BAD_GATEWAY } = http2.constants;
const mixin = require('merge-descriptors');
class ServerApplication {
    get locals() {
        const obj = {};
        this.scope.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    get settings() {
        return this.scope.has("settings") ? this.scope.get("settings") : {};
    }
    get param() {
        return this.router.param.bind(this.router);
    }
    get request() {
        return this._request;
    }
    set request(value) {
        this._request = value;
    }
    get response() {
        return this._response;
    }
    set response(value) {
        this._response = value;
    }
    constructor(opts) {
        this.isHTTP2 = false;
        this.middlewares = new Set();
        this.middlewaresArr = [];
        this.staticServer = null;
        this.router = new router_1.Router();
        this.parent = null;
        this.scope = new Map();
        this.namesProtected = new Set();
        //compatibility Expressjs
        this._request = {};
        this._response = {};
        this.isHTTP2 = opts?.http2 === true || false;
        this.opts = this.isHTTP2
            ? new interfaces_1.DefaultServerHTTP2Options(opts).ToOptions()
            : new interfaces_1.DefaultServerOptions(opts).ToOptions();
        if (!this.isHTTP2) {
            this.socket =
                opts && opts?.key && opts?.cert
                    ? https.createServer(this.opts, (req, res) => this.onListener(req, res))
                    : http.createServer(this.opts, (req, res) => this.onListener(req, res));
        }
        else {
            this.opts.allowHTTP1 = true;
            this.socket =
                opts && opts?.key && opts?.cert
                    ? http2.createSecureServer(this.opts, (req, res) => this.onListener(req, res))
                    : http2.createServer(this.opts, (req, res) => this.onListener(req, res));
        }
    }
    async onListener(req, res) {
        const hasFileExtension = /\.\w+$/.test(req.url);
        res.setHeader('Req-UUID', server_common_1.Telemetry.generateId());
        if (hasFileExtension && this.staticServer) {
            this.staticServer.process(req, res, err => this.handleBody(req, res, this.processRequest.bind(this)));
        }
        else {
            this.handleBody(req, res, this.processRequest.bind(this));
        }
    }
    async handleBody(req, res, next) {
        try {
            const method = req.method?.toUpperCase();
            const bodyMethods = ['POST', 'PUT', 'PATCH'];
            const contentType = req.headers['content-type'];
            if (bodyMethods.includes(method)) {
                server_common_1.Telemetry.start('Body Parser', res.getHeader('Req-UUID'));
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    try {
                        const decompressedBody = await this.decompressBody(body, req, res);
                        server_common_1.Telemetry.end('Body Parser', res.getHeader('Req-UUID'));
                        switch (contentType) {
                            case 'application/json':
                                next(req, res, JSON.parse(decompressedBody));
                                break;
                            case 'application/x-www-form-urlencoded':
                                next(req, res, querystring.parse(decompressedBody));
                                break;
                            case 'multipart/form-data':
                                const form = new formidable.IncomingForm();
                                form.parse(req, (err, fields, files) => {
                                    if (err) {
                                        res.writeHead(400, {
                                            'Content-Type': 'application/json',
                                        });
                                        res.end(JSON.stringify({
                                            error: 'Invalid form data',
                                        }));
                                        return;
                                    }
                                    next(req, res, { fields, files });
                                });
                                break;
                            default:
                                next(req, res, null);
                                break;
                        }
                    }
                    catch (err) {
                        if (process.env.NODE_ENV === "dev")
                            console.error(err);
                        res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
                        res.end(err.message);
                    }
                });
            }
            else {
                next(req, res, null);
            }
        }
        catch (err) {
            if (process.env.NODE_ENV === "dev")
                console.error(err);
            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            res.end(err.message);
        }
    }
    async decompressBody(body, req, res) {
        server_common_1.Telemetry.start('Decompress Body', res.getHeader('Req-UUID'));
        const encoding = (req.headers['content-encoding'] || 'identity').toLowerCase();
        let steam = null;
        switch (encoding) {
            case 'br':
                steam = zlib.createBrotliCompress();
            case 'gzip':
                steam = zlib.createGzip();
            case 'deflate':
                steam = zlib.createDeflate();
        }
        if (steam) {
            const data = await this.decompressData(Buffer.from(body), steam);
            server_common_1.Telemetry.end('Decompress Body', res.getHeader('Req-UUID'));
            return data;
        }
        return body;
    }
    async decompressData(inputBuffer, compressionStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            compressionStream.on('data', chunk => {
                chunks.push(chunk);
            });
            compressionStream.on('end', () => {
                resolve(Buffer.concat(chunks).toString());
            });
            compressionStream.on('error', err => {
                reject(err);
            });
            compressionStream.end(inputBuffer);
        });
    }
    bindCustomContext(original, newScope) {
        mixin(original, newScope, false);
    }
    async processRequest(req, res, body) {
        const route = await this.router.process(this, req, res, body);
        server_common_1.Telemetry.start('Process Request', res.getHeader('Req-UUID'));
        try {
            const processMiddleware = async (index, after = false) => {
                if (index < this.middlewaresArr.length && route) {
                    const middleware = this.middlewaresArr[index];
                    if (!route.response.sended) {
                        if (middleware instanceof server_common_1.ServerMiddleware &&
                            middleware?.afterProcess === after) {
                            middleware.process(route.request, route.response, () => processMiddleware(index + 1, after));
                        }
                        else if (typeof middleware === "function") {
                            if (middleware.length === 4) { //compatibility Expressjs
                                middleware(null, route, route, () => processMiddleware(index + 1, after));
                            }
                            else {
                                middleware(route, route, () => processMiddleware(index + 1, after));
                            }
                        }
                        else {
                            processMiddleware(index + 1, after);
                        }
                    }
                }
                else if (route) {
                    if (!route.response.sended) {
                        if (!after) {
                            await this.runFunctions(route.fn, route.request, route.response);
                            if (!route.response.sended)
                                processMiddleware(0, true);
                            else {
                                res.writeHead(route.response.statusCode);
                                res.end(route.head === true ? "" : route.response.buffer);
                            }
                        }
                        else if (route) {
                            const uuid = res.getHeader('Req-UUID');
                            server_common_1.Telemetry.end('Process Request', uuid);
                            server_common_1.Telemetry.table(uuid);
                            server_common_1.Telemetry.clearTelemetry(uuid);
                            res.writeHead(route.response.statusCode);
                            res.end(route.head === true ? "" : route.response.buffer);
                        }
                        else {
                            res.writeHead(HTTP_STATUS_NOT_FOUND);
                            res.end('Not Found');
                        }
                    }
                }
                else {
                    res.writeHead(HTTP_STATUS_NOT_FOUND);
                    res.end('Not Found');
                }
            };
            if (route) {
                this.bindCustomContext(route.request.req, this._request); //compatibility Expressjs
                this.bindCustomContext(route.response.res, this._response); //compatibility Expressjs
                if (this.middlewaresArr.length > 0)
                    processMiddleware(0);
                else {
                    if (route) {
                        const uuid = res.getHeader('Req-UUID');
                        server_common_1.Telemetry.end('Process Request', uuid);
                        server_common_1.Telemetry.table(uuid);
                        server_common_1.Telemetry.clearTelemetry(uuid);
                        await this.runFunctions(route.fn, route.request, route.response);
                        res.writeHead(route.response.statusCode);
                        res.end(route.head ? "" : route.response.buffer);
                    }
                    else {
                        res.writeHead(HTTP_STATUS_NOT_FOUND);
                        res.end('Not Found');
                    }
                }
            }
            else {
                res.writeHead(HTTP_STATUS_NOT_FOUND);
                res.end('Not Found');
            }
        }
        catch (err) {
            if (process.env.NODE_ENV === "dev")
                console.error(err);
            res.writeHead(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            res.end(err.message);
        }
    }
    async runFunctions(fns, req, res) {
        const runFn = async (index) => {
            if (fns && index < fns.length)
                fns[index](req, res, () => runFn(index + 1));
        };
        await runFn(0);
    }
    //Methods
    use(app, parent) {
        if (app instanceof router_1.Router) {
            this.router = app;
        }
        else if (app instanceof server_static_1.ServerStaticMiddleware) {
            this.staticServer = app;
        }
        else if (parent instanceof ServerApplication &&
            typeof app === 'string') {
            this.parent = parent;
        }
        else if (app instanceof server_common_1.ServerMiddleware) {
            this.middlewares.add(app);
            this.middlewaresArr = Array.from(this.middlewares);
        }
        else if (typeof app === "function") {
            console.warn("The use of generic middlewares was maintained for compatibility but its use is not recommended, change to ServerMiddleware");
            this.middlewares.add(app);
            this.middlewaresArr = Array.from(this.middlewares);
        }
        else {
            throw Error("Invalid use middleware");
        }
    }
    all(path, ...callbacks) {
        if (callbacks.length > 0) {
            this.router.all(path, ...callbacks);
        }
    }
    get(path, ...callbacks) {
        if (callbacks.length > 0) {
            this.router.get(path, ...callbacks);
        }
        else if (typeof path === 'string' && path !== '') {
            return this.scope.has(path) ? this.scope.get(path) : null;
        }
        return null;
    }
    post(path, ...callbacks) {
        if (callbacks.length > 0)
            this.router.post(path, ...callbacks);
    }
    put(path, ...callbacks) {
        if (callbacks.length > 0)
            this.router.put(path, ...callbacks);
    }
    delete(path, ...callbacks) {
        if (callbacks.length > 0)
            this.router.delete(path, ...callbacks);
    }
    head(path, ...callbacks) {
        if (callbacks.length > 0)
            this.router.head(path, ...callbacks);
    }
    patch(path, ...callbacks) {
        if (callbacks.length > 0)
            this.router.patch(path, ...callbacks);
    }
    options(path, ...callbacks) {
        if (callbacks.length > 0)
            this.router.options(path, ...callbacks);
    }
    //Scope
    set(name, value) {
        if (!this.scope.has("settings"))
            this.scope.set("settings", {});
        if (!this.namesProtected.has(name)) {
            const settings = this.scope.get("settings");
            settings[name] = value;
            this.scope.set("settings", settings);
            return true;
        }
        return false;
    }
    enable(name) {
        if (this.namesProtected.has(name))
            this.namesProtected.delete(name);
    }
    enabled(name) {
        return this.namesProtected.has(name);
    }
    disable(name) {
        if (!this.namesProtected.has(name))
            this.namesProtected.add(name);
    }
    disabled(name) {
        return !this.namesProtected.has(name);
    }
    //Others
    render(viewName, dataOrCallback, callback) { }
    listen(port, hostOrCallback, callback) {
        const host = typeof hostOrCallback === 'string' ? hostOrCallback : '127.0.0.1';
        const cb = typeof hostOrCallback === 'function' ? hostOrCallback : callback;
        this.socket.listen({ port, host, backlog: true }, cb);
        return this.socket;
    }
    close(callback) {
        this.socket.close(callback);
    }
    Router() {
        return router_1.Router;
    }
    //Events
    on(name, callback) { } //compatibility Expressjs
    emit(name, value) { } //compatibility Expressjs
}
exports.ServerApplication = ServerApplication;
const CmmvServer = (options) => {
    const app = new ServerApplication(options);
    mixin(app, events_1.EventEmitter.prototype, false);
    return app;
};
exports.CmmvServer = CmmvServer;
