/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */
export * from './lib';
import { BodyParserJSONOptions, CMMVBodyParserJSON } from './lib';
export declare const json: (options?: BodyParserJSONOptions) => CMMVBodyParserJSON;
