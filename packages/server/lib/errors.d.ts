/**
 * fastify-error
 * Copyright (c) 2020 Fastify
 * Copyright (c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify-error/blob/master/index.js
 */
export declare const createError: (code: string, message: string, statusCode?: number, Base?: ErrorConstructor) => {
    (this: any, ...args: any[]): void;
    prototype: any;
};
/**
 * Basic
 */
export declare const CM_ERR_HTTP2_INVALID_VERSION: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_OPTIONS_NOT_OBJ: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_QSP_NOT_FN: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_INSTANCE_ALREADY_LISTENING: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_ERROR_HANDLER_NOT_FN: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
/**
 * hooks
 */
export declare const CM_ERR_HOOK_INVALID_TYPE: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_HOOK_NOT_SUPPORTED: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_HOOK_INVALID_HANDLER: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_HOOK_INVALID_ASYNC_HANDLER: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
/**
 * Response
 */
export declare const CM_ERR_RES_ALREADY_SENT: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_BAD_TRAILER_NAME: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_BAD_TRAILER_VALUE: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_SEND_INSIDE_ONERR: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_SEND_CONTENTTYPE_ARR: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_INVALID_CODE_TYPE: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_INVALID_CODE_RANGE: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_RES_BODY_CONSUMED: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_RES_INVALID_PAYLOAD_TYPE: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_SEND_UNDEFINED_ERR: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
export declare const CM_ERR_FAILED_ERROR_SERIALIZATION: {
    (this: any, ...args: any[]): void;
    prototype: any;
};
