/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */

export * from './lib';

import {
    BodyParserJSONOptions,
    CMMVBodyParserJSON,
    BodyParserRawOptions,
    CMMVBodyParserRaw,
    BodyParserTextOptions,
    CMMVBodyParserText,
    BodyParserUrlEncodedOptions,
    CMMVBodyParserUrlEncoded,
} from './lib';

export const json = function (options?: BodyParserJSONOptions): any {
    const middleware = new CMMVBodyParserJSON(options);

    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else return middleware;
};

export const raw = function (options?: BodyParserRawOptions): any {
    const middleware = new CMMVBodyParserRaw(options);

    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else return middleware;
};

export const text = function (options?: BodyParserTextOptions): any {
    const middleware = new CMMVBodyParserText(options);

    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else return middleware;
};

export const urlencoded = function (
    options?: BodyParserUrlEncodedOptions,
): any {
    const middleware = new CMMVBodyParserUrlEncoded(options);

    if (options?.express === true)
        return (req, res, next) => middleware.process(req, res, next);
    else return middleware;
};
