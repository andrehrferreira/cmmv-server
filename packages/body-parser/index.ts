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
    BodyParserJSONMiddleware,
    BodyParserRawOptions,
    BodyParserRawMiddleware,
    BodyParserTextOptions,
    BodyParserTextMiddleware,
    BodyParserUrlEncodedOptions,
    BodyParserUrlEncodedMiddleware,
} from './lib';

export const json = async function (
    options?: BodyParserJSONOptions,
): Promise<any> {
    const middleware = new BodyParserJSONMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};

export const jsonExpress = function (options?: BodyParserJSONOptions): any {
    const middleware = new BodyParserJSONMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};

export const raw = async function (
    options?: BodyParserRawOptions,
): Promise<any> {
    const middleware = new BodyParserRawMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};

export const rawExpress = function (options?: BodyParserRawOptions): any {
    const middleware = new BodyParserRawMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};

export const text = async function (
    options?: BodyParserTextOptions,
): Promise<any> {
    const middleware = new BodyParserTextMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};

export const textExpress = function (options?: BodyParserTextOptions): any {
    const middleware = new BodyParserTextMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};

export const urlencoded = async function (
    options?: BodyParserUrlEncodedOptions,
): Promise<any> {
    const middleware = new BodyParserUrlEncodedMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};

export const urlencodedExpress = function (
    options?: BodyParserUrlEncodedOptions,
): any {
    const middleware = new BodyParserUrlEncodedMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
