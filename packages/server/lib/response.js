"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const vary = require("vary");
const accepts = require("accepts");
const send = require("send");
const safe_buffer_1 = require("safe-buffer");
const http = require("node:http");
const http2 = require("node:http2");
const onHeaders = require('on-headers');
const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND } = http2.constants;
class Response {
    constructor(app, req, res) {
        this.app = app;
        this.req = req;
        this.res = res;
        this.statusCode = HTTP_STATUS_OK;
        this.headers = {};
        this.sended = false;
        this.accept = accepts(req);
        this.uuid = res.getHeader('Req-UUID');
        const self = this;
        onHeaders(this.res, function () {
            for (const keyHeader in self.headers) {
                this.setHeader(keyHeader, self.headers[keyHeader]);
            }
        });
    }
    get httpResponse() {
        return this.res;
    }
    append(appendName, value) { }
    attachment(contentType) { }
    cookie(name, value, options) { }
    clearCookie(name, options) { }
    download(path, filename) { }
    end(data, encoding) {
        this.buffer = (data) ? safe_buffer_1.Buffer.from(data, encoding) : safe_buffer_1.Buffer.from("");
    }
    format(object) { }
    get(headerName) {
        return this.headers[headerName];
    }
    json(body) { }
    jsonp(body) { }
    links(links) { }
    location(path) { }
    redirect(pathOrStatus, path) { }
    render(view, locals, callback) { }
    send(body) {
        if (!this.sended) {
            if (typeof body === 'object') {
                if (!this.headers['Content-Type'] &&
                    this.accept.type(['json']) === 'json')
                    this.headers['Content-Type'] = 'application/json';
                this.buffer = safe_buffer_1.Buffer.from(JSON.stringify(body), 'utf8');
            }
            else if (typeof body === 'string') {
                if (!this.headers['Content-Type'] &&
                    this.accept.type(['html']) === 'html')
                    this.headers['Content-Type'] = 'text/html';
                this.buffer = safe_buffer_1.Buffer.from(body, 'utf8');
            }
            else {
                if (!this.headers['Content-Type'])
                    this.headers['Content-Type'] = 'application/octet-stream';
                this.buffer = new safe_buffer_1.Buffer(body);
            }
        }
    }
    sendFile(path, options, fn) {
        if (!this.sended) {
            this.sended = true;
            const stream = send(this.req, path, options);
            stream.on('error', err => {
                if (fn)
                    return fn(err);
                this.res.writeHead(HTTP_STATUS_NOT_FOUND);
                return this.res.end('File not found');
            });
            stream.pipe(this.res);
        }
    }
    sendStatus(statusCode) {
        this.statusCode = statusCode;
        this.res.statusCode = statusCode;
        this.res.end(http.STATUS_CODES[statusCode]);
        return this;
    }
    set(field, value) {
        if (typeof field == 'object') {
            for (const key in field) {
                if (!this.headers[key])
                    this.headers[key] = field[key];
            }
        }
        else {
            if (!this.headers[field])
                this.headers[field] = value;
        }
        return this;
    }
    header(field, value) {
        this.set(field, value);
        return this;
    }
    setHeader(field, value) {
        this.set(field, value);
        return this;
    }
    remove(field) {
        delete this.headers[field];
        return this;
    }
    removeHeader(field) {
        this.remove(field);
        return this;
    }
    status(code) {
        this.statusCode = code;
        return this;
    }
    type(type) {
        return this;
    }
    vary(field) {
        vary(this.res, field);
        return this;
    }
}
exports.Response = Response;
