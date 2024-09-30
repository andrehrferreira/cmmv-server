"use strict";
/**
 * fastify-error
 * Copyright (c) 2020 Fastify
 * Copyright (c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify-error/blob/master/index.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CM_ERR_FAILED_ERROR_SERIALIZATION = exports.CM_ERR_SEND_UNDEFINED_ERR = exports.CM_ERR_RES_INVALID_PAYLOAD_TYPE = exports.CM_ERR_RES_BODY_CONSUMED = exports.CM_ERR_INVALID_CODE_RANGE = exports.CM_ERR_INVALID_CODE_TYPE = exports.CM_ERR_SEND_CONTENTTYPE_ARR = exports.CM_ERR_SEND_INSIDE_ONERR = exports.CM_ERR_BAD_TRAILER_VALUE = exports.CM_ERR_BAD_TRAILER_NAME = exports.CM_ERR_RES_ALREADY_SENT = exports.CM_ERR_HOOK_INVALID_ASYNC_HANDLER = exports.CM_ERR_HOOK_INVALID_HANDLER = exports.CM_ERR_HOOK_NOT_SUPPORTED = exports.CM_ERR_HOOK_INVALID_TYPE = exports.CM_ERR_ERROR_HANDLER_NOT_FN = exports.CM_ERR_INSTANCE_ALREADY_LISTENING = exports.CM_ERR_QSP_NOT_FN = exports.CM_ERR_OPTIONS_NOT_OBJ = exports.CM_ERR_HTTP2_INVALID_VERSION = exports.createError = void 0;
const node_util_1 = require("node:util");
const createError = (code, message, statusCode = 500, Base = Error) => {
    if (typeof code !== 'string')
        throw new Error('Erro code must be empty');
    if (typeof message !== 'string')
        throw new Error('Erro message must be empty');
    code = code.toUpperCase();
    !statusCode && (statusCode = undefined);
    function CmmvError(...args) {
        this.code = code;
        this.message = (0, node_util_1.format)(message, ...args);
        this.statusCode = statusCode;
    }
    CmmvError.prototype = Object.create(Base.prototype, {
        constructor: {
            value: CmmvError,
            enumerable: false,
            writable: true,
            configurable: true,
        },
    });
    CmmvError.prototype[Symbol.toStringTag] = 'Error';
    CmmvError.prototype.toString = function () {
        return `${this.name} [${this.code}]: ${this.message}`;
    };
    return CmmvError;
};
exports.createError = createError;
/**
 * Basic
 */
exports.CM_ERR_HTTP2_INVALID_VERSION = (0, exports.createError)('CM_ERR_HTTP2_INVALID_VERSION', 'HTTP2 is available only from node >= 8.8.1');
exports.CM_ERR_OPTIONS_NOT_OBJ = (0, exports.createError)('CM_ERR_OPTIONS_NOT_OBJ', 'Options must be an object', 500, TypeError);
exports.CM_ERR_QSP_NOT_FN = (0, exports.createError)('CM_ERR_QSP_NOT_FN', "querystringParser option should be a function, instead got '%s'", 500, TypeError);
exports.CM_ERR_INSTANCE_ALREADY_LISTENING = (0, exports.createError)('CM_ERR_INSTANCE_ALREADY_LISTENING', 'CMMV instance is already listening. %s');
exports.CM_ERR_ERROR_HANDLER_NOT_FN = (0, exports.createError)('CM_ERR_ERROR_HANDLER_NOT_FN', 'Error Handler must be a function', 500, TypeError);
/**
 * hooks
 */
exports.CM_ERR_HOOK_INVALID_TYPE = (0, exports.createError)('CM_ERR_HOOK_INVALID_TYPE', 'The hook name must be a string', 500, TypeError);
exports.CM_ERR_HOOK_NOT_SUPPORTED = (0, exports.createError)('CM_ERR_HOOK_NOT_SUPPORTED', '%s hook not supported!', 500, TypeError);
exports.CM_ERR_HOOK_INVALID_HANDLER = (0, exports.createError)('CM_ERR_HOOK_INVALID_HANDLER', '%s hook should be a function, instead got %s', 500, TypeError);
exports.CM_ERR_HOOK_INVALID_ASYNC_HANDLER = (0, exports.createError)('CM_ERR_HOOK_INVALID_ASYNC_HANDLER', "Async function has too many arguments. Async hooks should not use the 'done' argument.", 500, TypeError);
/**
 * Response
 */
exports.CM_ERR_RES_ALREADY_SENT = (0, exports.createError)('CM_ERR_RES_ALREADY_SENT', 'Response was already sent, did you forget to "return reply" in "%s" (%s)?');
exports.CM_ERR_BAD_TRAILER_NAME = (0, exports.createError)('CM_ERR_BAD_TRAILER_NAME', 'Called res.trailer with an invalid header name: %s');
exports.CM_ERR_BAD_TRAILER_VALUE = (0, exports.createError)('CM_ERR_BAD_TRAILER_VALUE', "Called res.trailer('%s', fn) with an invalid type: %s. Expected a function.");
exports.CM_ERR_SEND_INSIDE_ONERR = (0, exports.createError)('CM_ERR_SEND_INSIDE_ONERR', 'You cannot use `send` inside the `onError` hook');
exports.CM_ERR_SEND_CONTENTTYPE_ARR = (0, exports.createError)('CM_ERR_SEND_CONTENTTYPE_ARR', 'Content-Type cannot be set to an Array');
exports.CM_ERR_INVALID_CODE_TYPE = (0, exports.createError)('CM_ERR_INVALID_CODE_TYPE', 'Invalid status code: %s Status code must be an integer.', 500, TypeError);
exports.CM_ERR_INVALID_CODE_RANGE = (0, exports.createError)('CM_ERR_INVALID_CODE_RANGE', 'Invalid status code: %s. Status code must be greater than 99 and less than 1000.', 500, RangeError);
exports.CM_ERR_RES_BODY_CONSUMED = (0, exports.createError)('CM_ERR_RES_BODY_CONSUMED', 'Response.body is already consumed.');
exports.CM_ERR_RES_INVALID_PAYLOAD_TYPE = (0, exports.createError)('CM_ERR_RES_INVALID_PAYLOAD_TYPE', "Attempted to send payload of invalid type '%s'. Expected a string or Buffer.");
exports.CM_ERR_SEND_UNDEFINED_ERR = (0, exports.createError)('CM_ERR_SEND_UNDEFINED_ERR', 'Undefined error has occurred');
exports.CM_ERR_FAILED_ERROR_SERIALIZATION = (0, exports.createError)('CM_ERR_FAILED_ERROR_SERIALIZATION', 'Failed to serialize an error. Error: %s. Original error: %s.');
