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

import * as typeis from 'type-is';
import * as bytes from 'bytes';
import * as contentType from 'content-type';
import { isFinished } from 'on-finished';

import { read } from './read';

export interface BodyParserTextOptions {
    defaultCharset?: string;
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
}

export class BodyParserTextMiddleware {
    public middlewareName: string = 'body-parse-text';

    private options: BodyParserTextOptions;

    constructor(options?: BodyParserTextOptions) {
        this.options = {
            limit:
                typeof options?.limit !== 'number'
                    ? bytes.parse(options?.limit || '100kb')
                    : options?.limit,
            inflate: options?.inflate !== false,
            type: options?.type || 'text/plain',
            verify: options?.verify || false,
            defaultCharset: options?.defaultCharset || 'utf-8',
        };
    }

    async process(req, res, next?) {
        if (req.app && typeof req.app.addContentTypeParser == 'function') {
            req.app.addContentTypeParser(
                'text/plain',
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

        const charset = this.getCharset(req) || this.options.defaultCharset;

        read(req, res, done, parse.bind(this), {
            encoding: charset,
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

            const charset = this.getCharset(req) || this.options.defaultCharset;

            read(req, res, resolve, parse.bind(this), {
                encoding: charset,
                inflate: this.options.inflate,
                limit: this.options.limit,
                verify: this.options.verify,
            });
        });
    }

    /**
     * Get the charset of a request.
     *
     * @param {object} req
     * @api private
     */
    private getCharset(req) {
        try {
            return (
                contentType.parse(req).parameters.charset || ''
            ).toLowerCase();
        } catch (e) {
            return undefined;
        }
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

export default function (options?: BodyParserTextOptions) {
    if (
        options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function'
    ) {
        throw new TypeError('option verify must be function');
    }

    const middleware = new BodyParserTextMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
}
