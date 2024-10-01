/**
 * mime
 * Copyright (c) 2023 Robert Kieffer
 * Copyright (c) 2024 Andre Ferreira
 * @see https://github.com/broofa/mime
 */
type TypeMap = {
    [key: string]: string[];
};
export declare class Mime {
    #private;
    constructor(...args: TypeMap[]);
    define(typeMap: TypeMap, force?: boolean): this;
    /**
     * Get mime type associated with an extension
     */
    getType(path: string): string;
    /**
     * Get default file extension associated with a mime type
     */
    getExtension(type: string): string;
    /**
     * Get all file extensions associated with a mime type
     */
    getAllExtensions(type: string): Set<string>;
    _freeze(): this;
    _getTestState(): {
        types: Map<string, string>;
        extensions: Map<string, string>;
    };
}
export declare const mime: Mime;
export {};
