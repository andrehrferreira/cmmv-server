/**
 * fastify-error
 * Copyright (c) 2020 Fastify
 * Copyright (c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify-error/blob/master/index.js
 */

import { format } from 'node:util';

export const createError = (
    code: string,
    message: string,
    statusCode = 500,
    Base = Error,
) => {
    if (typeof code !== 'string') throw new Error('Erro code must be empty');
    if (typeof message !== 'string')
        throw new Error('Erro message must be empty');

    code = code.toUpperCase();
    !statusCode && (statusCode = undefined);

    function CmmvError(this: any, ...args) {
        this.code = code;
        this.message = format(message, ...args);
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

/**
 * Basic
 */
export const CM_ERR_HTTP2_INVALID_VERSION = createError(
    'CM_ERR_HTTP2_INVALID_VERSION',
    'HTTP2 is available only from node >= 8.8.1',
);

export const CM_ERR_OPTIONS_NOT_OBJ = createError(
    'CM_ERR_OPTIONS_NOT_OBJ',
    'Options must be an object',
    500,
    TypeError,
);

export const CM_ERR_QSP_NOT_FN = createError(
    'CM_ERR_QSP_NOT_FN',
    "querystringParser option should be a function, instead got '%s'",
    500,
    TypeError,
);

export const CM_ERR_INSTANCE_ALREADY_LISTENING = createError(
    'CM_ERR_INSTANCE_ALREADY_LISTENING',
    'CMMV instance is already listening. %s',
);

export const CM_ERR_ERROR_HANDLER_NOT_FN = createError(
    'CM_ERR_ERROR_HANDLER_NOT_FN',
    'Error Handler must be a function',
    500,
    TypeError,
);

/**
 * hooks
 */
export const CM_ERR_HOOK_INVALID_TYPE = createError(
    'CM_ERR_HOOK_INVALID_TYPE',
    'The hook name must be a string',
    500,
    TypeError,
);

export const CM_ERR_HOOK_NOT_SUPPORTED = createError(
    'CM_ERR_HOOK_NOT_SUPPORTED',
    '%s hook not supported!',
    500,
    TypeError,
);

export const CM_ERR_HOOK_INVALID_HANDLER = createError(
    'CM_ERR_HOOK_INVALID_HANDLER',
    '%s hook should be a function, instead got %s',
    500,
    TypeError,
);

export const CM_ERR_HOOK_INVALID_ASYNC_HANDLER = createError(
    'CM_ERR_HOOK_INVALID_ASYNC_HANDLER',
    "Async function has too many arguments. Async hooks should not use the 'done' argument.",
    500,
    TypeError,
);

/**
 * Response
 */
export const CM_ERR_RES_ALREADY_SENT = createError(
    'CM_ERR_RES_ALREADY_SENT',
    'Response was already sent, did you forget to "return reply" in "%s" (%s)?',
);

export const CM_ERR_BAD_TRAILER_NAME = createError(
    'CM_ERR_BAD_TRAILER_NAME',
    'Called res.trailer with an invalid header name: %s',
);

export const CM_ERR_BAD_TRAILER_VALUE = createError(
    'CM_ERR_BAD_TRAILER_VALUE',
    "Called res.trailer('%s', fn) with an invalid type: %s. Expected a function.",
);

export const CM_ERR_SEND_INSIDE_ONERR = createError(
    'CM_ERR_SEND_INSIDE_ONERR',
    'You cannot use `send` inside the `onError` hook',
);

export const CM_ERR_SEND_CONTENTTYPE_ARR = createError(
    'CM_ERR_SEND_CONTENTTYPE_ARR',
    'Content-Type cannot be set to an Array',
);

export const CM_ERR_INVALID_CODE_TYPE = createError(
    'CM_ERR_INVALID_CODE_TYPE',
    'Invalid status code: %s Status code must be an integer.',
    500,
    TypeError,
);

export const CM_ERR_INVALID_CODE_RANGE = createError(
    'CM_ERR_INVALID_CODE_RANGE',
    'Invalid status code: %s. Status code must be greater than 99 and less than 1000.',
    500,
    RangeError,
);

export const CM_ERR_RES_BODY_CONSUMED = createError(
    'CM_ERR_RES_BODY_CONSUMED',
    'Response.body is already consumed.',
);

export const CM_ERR_RES_INVALID_PAYLOAD_TYPE = createError(
    'CM_ERR_RES_INVALID_PAYLOAD_TYPE',
    "Attempted to send payload of invalid type '%s'. Expected a string or Buffer.",
);

export const CM_ERR_SEND_UNDEFINED_ERR = createError(
    'CM_ERR_SEND_UNDEFINED_ERR',
    'Undefined error has occurred',
);

export const CM_ERR_FAILED_ERROR_SERIALIZATION = createError(
    'CM_ERR_FAILED_ERROR_SERIALIZATION',
    'Failed to serialize an error. Error: %s. Original error: %s.',
);
