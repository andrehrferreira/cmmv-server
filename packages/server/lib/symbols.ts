//Basic
export const kHooks = Symbol('cmmv.hooks');
export const kChildren = Symbol('cmmv.children');
export const kState = Symbol('cmmv.state');
export const kOptions = Symbol('cmmv.options');
export const kMiddlewares = Symbol('cmmv.middlewares');

//Schema
export const kSchemaResponse = Symbol('cmmv.schema.response');

//Request
export const kRequest = Symbol('cmmv.request');
export const kRequestOriginalUrl = Symbol('cmmv.request.originalUrl');
export const kDisableRequestLogging = Symbol('cmmv.request.disableLogging');
export const kRequestPayloadStream = Symbol('cmmv.request.payloadStream');

//Response
export const kResponse = Symbol('cmmv.response');
export const kResponseSerializer = Symbol('cmmv.response.serializer');
export const kResponseIsError = Symbol('cmmv.response.isError');
export const kResponseErrorHandlerCalled = Symbol(
    'cmmv.response.errorHandlerCalled',
);
export const kResponseHeaders = Symbol('cmmv.response.headers');
export const kResponseHasStatusCode = Symbol('cmmv.response.hasStatusCode');
export const kResponseStartTime = Symbol('cmmv.response.startTime');
export const kResponseEndTime = Symbol('cmmv.response.endTime');
export const kResponseSerializerDefault = Symbol(
    'cmmv.response.serializerDefault',
);
export const kResponseIsRunningOnErrorHook = Symbol(
    'cmmv.response.isRunningOnErrorHook',
);
export const kResponseTrailers = Symbol('cmmv.response.trailers');
export const kResponseHijacked = Symbol('cmmv.response.hijacked');
export const kResponseCacheSerializeFns = Symbol(
    'cmmv.response.cacheSerializeFns',
);
export const kResponseNextErrorHandler = Symbol(
    'cmmv.response.nextErrorHandler',
);

//Others
export const kErrorHandler = Symbol('cmmv.errorHandler');
