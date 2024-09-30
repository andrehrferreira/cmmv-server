"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
const hooks_1 = require("./hooks");
const response_1 = require("./response");
const symbols_1 = require("./symbols");
const bodyless = new Set(['GET', 'HEAD', 'TRACE']);
const bodywith = new Set(['DELETE', 'OPTIONS', 'PATCH', 'PUT', 'POST']);
const handleRequest = (err, request, res) => {
    if (res.sent === true)
        return;
    if (err != null) {
        res[symbols_1.kResponseIsError] = true;
        res.send(err);
        return;
    }
    const method = request.req.method;
    const headers = request.headers;
    if (bodyless.has(method)) {
        handler(request, res);
        return;
    }
    if (bodywith.has(method)) {
        const contentType = headers['content-type'];
        const contentLength = headers['content-length'];
        const transferEncoding = headers['transfer-encoding'];
        if (contentType === undefined) {
            if ((contentLength === undefined || contentLength === '0') &&
                transferEncoding === undefined) {
                handler(request, res);
            }
            else {
                //context.contentTypeParser.run('', handler, request, reply)
            }
        }
        else {
            if (contentLength === undefined &&
                transferEncoding === undefined &&
                method === 'OPTIONS') {
                handler(request, res);
                return;
            }
            //context.contentTypeParser.run(contentType, handler, request, reply)
        }
        return;
    }
    // Return 404 instead of 405 see https://github.com/fastify/fastify/pull/862 for discussion
    handler(request, res);
};
exports.handleRequest = handleRequest;
function handler(req, res) {
    if (req.preHandler !== null && req.preHandler.length > 0) {
        (0, hooks_1.preHandlerHookRunner)(req.preHandler, req, res, preHandlerCallback);
    }
    else {
        preHandlerCallback(null, req, res);
    }
}
function preHandlerCallback(err, req, res) {
    if (res.sent)
        return;
    try {
        if (err != null) {
            res[symbols_1.kResponseIsError] = true;
            res.send(err);
            return;
        }
        let result;
        try {
            result = req.handler(req, res);
        }
        catch (err) {
            res[symbols_1.kResponseIsError] = true;
            res.send(err);
            return;
        }
        if (result !== undefined) {
            if (result !== null && typeof result.then === 'function')
                (0, response_1.wrapThenable)(result, res);
            else
                res.send(result);
        }
    }
    finally {
    }
}
