export declare const rootErrorHandler: {
    func: typeof defaultErrorHandler;
    toJSON(): string;
};
export declare const handleError: (response: any, error: any, cb?: any) => void;
export declare const buildErrorHandler: (parent: {
    func: typeof defaultErrorHandler;
    toJSON(): string;
}, func: any) => any;
declare function defaultErrorHandler(error: any, request: any, res: any): void;
export {};
