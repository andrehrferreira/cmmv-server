export declare const onResponseHookIterator: (fn: any, req: any, res: any, next: any) => any;
export declare const onSendHookRunner: (functions: any, request: any, res: any, payload: any, cb: any) => void;
export declare const onResponseHookRunner: (functions: any, req: any, res: any, cb: any) => void;
export declare const preValidationHookRunner: (functions: any, req: any, res: any, cb: any) => void;
export declare const preHandlerHookRunner: (functions: any, req: any, res: any, cb: any) => void;
export declare const onTimeoutHookRunner: (functions: any, req: any, res: any, cb: any) => void;
export declare const preSerializationHookRunner: (functions: any, request: any, res: any, payload: any, cb: any) => void;
