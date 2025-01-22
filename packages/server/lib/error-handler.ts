import { STATUS_CODES as statusCodes } from 'node:http';

import {
    kResponseIsRunningOnErrorHook,
    kResponseNextErrorHandler,
    kResponseHeaders,
    kResponseHasStatusCode,
} from './symbols';

import {
    CM_ERR_RES_INVALID_PAYLOAD_TYPE,
    CM_ERR_FAILED_ERROR_SERIALIZATION,
} from './errors';

import { wrapThenable } from './response';

const serializeError = require('./error-serializer');

export const rootErrorHandler = {
    func: defaultErrorHandler,
    toJSON() {
        return this.func.name.toString() + '()';
    },
};

export const handleError = (response, error, cb?) => {
    response[kResponseIsRunningOnErrorHook] = false;

    if (response[kResponseNextErrorHandler] === false) {
        fallbackErrorHandler(error, response, function (res, payload) {
            try {
                response.res.writeHead(
                    res.raw.statusCode,
                    res[kResponseHeaders],
                );
            } catch (error) {
                response.res.writeHead(res.statusCode);
            }
            response.res.end(payload);
        });
        return;
    }

    const errorHandler =
        response[kResponseNextErrorHandler] || response.errorHandler;
    response[kResponseNextErrorHandler] = Object.getPrototypeOf(errorHandler);

    delete response[kResponseHeaders]['content-type'];
    delete response[kResponseHeaders]['content-length'];

    const func = errorHandler?.func || null;

    if (!func) {
        response[kResponseNextErrorHandler] = false;
        fallbackErrorHandler(error, response, cb);
        return;
    }

    try {
        const result = func(error, response.request, response);

        if (result !== undefined) {
            if (result !== null && typeof result.then === 'function')
                wrapThenable(result, response);
            else response.send(result);
        }
    } catch (err) {
        response.send(err);
    }
};

export const buildErrorHandler = (parent = rootErrorHandler, func) => {
    if (!func) return parent;
    const errorHandler = Object.create(parent);
    errorHandler.func = func;
    return errorHandler;
};

function fallbackErrorHandler(error, res, cb) {
    if (res.headersSent === true) return;

    const statusCode = res.statusCode;
    res[kResponseHeaders]['content-type'] =
        res[kResponseHeaders]['content-type'] ??
        'application/json; charset=utf-8';
    let payload;

    try {
        payload = serializeError({
            error: statusCodes[statusCode + ''],
            code: error.code,
            message: error.message,
            statusCode,
        });
    } catch (err) {
        res.code(500);
        payload = serializeError(
            new CM_ERR_FAILED_ERROR_SERIALIZATION(err.message, error.message),
        );
    }

    if (typeof payload !== 'string' && !Buffer.isBuffer(payload))
        payload = serializeError(
            new CM_ERR_RES_INVALID_PAYLOAD_TYPE(typeof payload),
        );

    res[kResponseHeaders]['content-length'] = '' + Buffer.byteLength(payload);
    cb(res, payload);
}

function defaultErrorHandler(error, request, res) {
    setErrorHeaders(error, res);

    if (!res[kResponseHasStatusCode] || res.statusCode === 200) {
        const statusCode = error.statusCode || error.status;
        res.code(statusCode >= 400 ? statusCode : 500);
    }

    res.send(error);
}

function setErrorHeaders(error, res) {
    let statusCode = res.statusCode;
    statusCode = statusCode >= 400 ? statusCode : 500;

    if (error != null) {
        if (error.headers !== undefined) res.headers(error.headers);
        if (error.status >= 400) statusCode = error.status;
        else if (error.statusCode >= 400) statusCode = error.statusCode;
    }

    res.statusCode = statusCode;
}
