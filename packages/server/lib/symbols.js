"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kErrorHandler = exports.kResponseNextErrorHandler = exports.kResponseCacheSerializeFns = exports.kResponseHijacked = exports.kResponseTrailers = exports.kResponseIsRunningOnErrorHook = exports.kResponseSerializerDefault = exports.kResponseEndTime = exports.kResponseStartTime = exports.kResponseHasStatusCode = exports.kResponseHeaders = exports.kResponseErrorHandlerCalled = exports.kResponseIsError = exports.kResponseSerializer = exports.kResponse = exports.kRequestPayloadStream = exports.kDisableRequestLogging = exports.kRequestOriginalUrl = exports.kRequest = exports.kSchemaResponse = exports.kMiddlewares = exports.kOptions = exports.kState = exports.kChildren = exports.kHooks = void 0;
//Basic
exports.kHooks = Symbol('cmmv.hooks');
exports.kChildren = Symbol('cmmv.children');
exports.kState = Symbol('cmmv.state');
exports.kOptions = Symbol('cmmv.options');
exports.kMiddlewares = Symbol('cmmv.middlewares');
//Schema
exports.kSchemaResponse = Symbol('cmmv.schema.response');
//Request
exports.kRequest = Symbol('cmmv.request');
exports.kRequestOriginalUrl = Symbol('cmmv.request.originalUrl');
exports.kDisableRequestLogging = Symbol('cmmv.request.disableLogging');
exports.kRequestPayloadStream = Symbol('cmmv.request.payloadStream');
//Response
exports.kResponse = Symbol('cmmv.response');
exports.kResponseSerializer = Symbol('cmmv.response.serializer');
exports.kResponseIsError = Symbol('cmmv.response.isError');
exports.kResponseErrorHandlerCalled = Symbol('cmmv.response.errorHandlerCalled');
exports.kResponseHeaders = Symbol('cmmv.response.headers');
exports.kResponseHasStatusCode = Symbol('cmmv.response.hasStatusCode');
exports.kResponseStartTime = Symbol('cmmv.response.startTime');
exports.kResponseEndTime = Symbol('cmmv.response.endTime');
exports.kResponseSerializerDefault = Symbol('cmmv.response.serializerDefault');
exports.kResponseIsRunningOnErrorHook = Symbol('cmmv.response.isRunningOnErrorHook');
exports.kResponseTrailers = Symbol('cmmv.response.trailers');
exports.kResponseHijacked = Symbol('cmmv.response.hijacked');
exports.kResponseCacheSerializeFns = Symbol('cmmv.response.cacheSerializeFns');
exports.kResponseNextErrorHandler = Symbol('cmmv.response.nextErrorHandler');
//Others
exports.kErrorHandler = Symbol('cmmv.errorHandler');
