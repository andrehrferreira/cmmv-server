/*!
 * CMMV Body-Parser
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */

/**
 * body-parser
 * Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>
 * Copyright (c) 2014-2015 Douglas Christopher Wilson <doug@somethingdoug.com>
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */

import * as http from 'node:http';
import * as http2 from 'node:http2';

import * as typeis from 'type-is';
import * as bytes from 'bytes';
import { isFinished } from 'on-finished';

import { read } from './read';

export interface BodyParserRawOptions {
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
}

export class BodyParserRawMiddleware {
    public middlewareName: string = 'body-parse-raw';

    private options: BodyParserRawOptions;

    constructor(options?: BodyParserRawOptions) {
        this.options = {
            limit:
                typeof options?.limit !== 'number'
                    ? bytes.parse(options?.limit || '100kb')
                    : options?.limit,
            inflate: options?.inflate !== false,
            type: options?.type || 'application/octet-stream',
            verify: options?.verify || false,
        };
    }

    async process(req, res, next?) {
        if (req.app && typeof req.app.addContentTypeParser == 'function') {
            req.app.addContentTypeParser(
                ['*', 'application/vnd+octets', 'application/octet-stream'],
                this.cmmvMiddleware.bind(this),
            );
        } else this.expressMiddleware.call(this, req, res, next);
    }

    expressMiddleware(req, res, done) {
        const shouldParse =
            typeof this.options?.type !== 'function'
                ? this.typeChecker(this.options.type)
                : this.options.type;

        function parse(buf) {
            return buf;
        }

        if (isFinished(req as http.IncomingMessage)) {
            done();
            return;
        }

        if (!('body' in req)) req['body'] = undefined;

        if (!typeis.hasBody(req as http.IncomingMessage)) {
            done();
            return;
        }

        if (!shouldParse(req)) {
            done();
            return;
        }

        read(req, res, done, parse.bind(this), {
            encoding: null,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
        });
    }

    cmmvMiddleware(req, res, payload, done) {
        return new Promise((resolve, reject) => {
            const shouldParse =
                typeof this.options?.type !== 'function'
                    ? this.typeChecker(this.options.type)
                    : this.options.type;

            function parse(buf) {
                return buf;
            }

            if (isFinished(req as http.IncomingMessage)) {
                resolve(null);
                return;
            }

            if (!('body' in req)) req['body'] = undefined;

            if (!typeis.hasBody(req as http.IncomingMessage)) {
                resolve(null);
                return;
            }

            if (!shouldParse(req)) {
                resolve(null);
                return;
            }

            read(req, res, resolve, parse.bind(this), {
                encoding: null,
                inflate: this.options.inflate,
                limit: this.options.limit,
                verify: this.options.verify,
            });
        });
    }

    /**
     * Get the simple type checker.
     *
     * @param {string} type
     * @return {function}
     */
    private typeChecker(type: any) {
        return function checkType(req) {
            const isIRequest = req && req.httpRequest;
            return Boolean(typeis(isIRequest ? req.httpRequest : req, type));
        };
    }
}

export default async function (options?: BodyParserRawOptions) {
    if (
        options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function'
    ) {
        throw new TypeError('option verify must be function');
    }

    const middleware = new BodyParserRawMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
}
