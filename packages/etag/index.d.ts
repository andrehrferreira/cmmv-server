/*!
 * CMMV Cors
 * Copyright(c) Fastify
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify-etag
 */
export interface ETagOptions {
    algorithm?: string;
    weak?: boolean;
}
export declare class EtagMiddleware {
    middlewareName: string;
    protected options: ETagOptions;
    constructor(options?: ETagOptions);
    process(req: any, res: any, next: any): Promise<void>;
    onCall(req: any, res: any, payload: any, done: any): Promise<void>;
    buildHashFn(algorithm?: string, weak?: boolean): (payload: any) => string;
    validateAlgorithm(algorithm: any): boolean;
}
export default function (options?: ETagOptions): Promise<(req: any, res: any, next: any) => Promise<void>>;
export declare const etag: (options?: ETagOptions) => (req: any, res: any, next: any) => Promise<void>;
