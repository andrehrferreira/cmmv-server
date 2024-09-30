/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
export * from './lib';
import { BodyParserJSONOptions, BodyParserRawOptions, BodyParserTextOptions, BodyParserUrlEncodedOptions } from './lib';
export declare const json: (options?: BodyParserJSONOptions) => any;
export declare const raw: (options?: BodyParserRawOptions) => any;
export declare const text: (options?: BodyParserTextOptions) => any;
export declare const urlencoded: (options?: BodyParserUrlEncodedOptions) => any;
