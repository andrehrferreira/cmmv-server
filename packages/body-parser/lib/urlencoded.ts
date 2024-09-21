/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */

import * as http from 'node:http';
import * as http2 from 'node:http2';

import * as typeis from 'type-is';
import * as bytes from 'bytes';
import * as qs from 'qs';
import * as contentType from 'content-type';
import * as createError from 'http-errors';
import { isFinished } from 'on-finished';

import { read } from './read';

import {
    ServerMiddleware,
    IRequest,
    IRespose,
    INext,
} from '@cmmv/server-common';

export interface BodyParserUrlEncodedOptions {
    extended?: boolean;
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
    defaultCharset?: string;
    express?: boolean;
    interpretNumericEntities?: boolean;
    charsetSentinel?: boolean;
}

export class CMMVBodyParserUrlEncoded extends ServerMiddleware {
    public middlewareName: string = 'body-parse-urlencoded';

    private options: BodyParserUrlEncodedOptions;

    constructor(options?: BodyParserUrlEncodedOptions) {
        super();

        this.options = {
            limit:
                typeof options?.limit !== 'number'
                    ? bytes.parse(options?.limit || '100kb')
                    : options?.limit,
            inflate: options?.inflate !== false,
            type: options?.type || 'application/x-www-form-urlencoded',
            verify: options?.verify || false,
            extended: Boolean(options?.extended),
            defaultCharset: options?.defaultCharset || 'utf-8',
            express: options?.express || false,
            interpretNumericEntities: options?.interpretNumericEntities,
            charsetSentinel: options?.charsetSentinel,
        };
    }

    async process(
        req: IRequest | http.IncomingMessage | http2.Http2ServerRequest,
        res: IRespose | http.ServerResponse | http2.Http2ServerResponse,
        next?: INext,
    ) {
        const reqTest =
            req instanceof http.IncomingMessage ||
            req instanceof http2.Http2ServerRequest
                ? req
                : req.httpRequest;
        const resTest =
            res instanceof http.ServerResponse ||
            res instanceof http2.Http2ServerResponse
                ? res
                : res.httpResponse;

        if (
            this.options?.defaultCharset !== 'utf-8' &&
            this.options?.defaultCharset !== 'iso-8859-1'
        ) {
            throw new TypeError(
                'option defaultCharset must be either utf-8 or iso-8859-1',
            );
        }

        const queryparse = this.createQueryParser(
            this.options,
            this.options.extended,
        );

        const shouldParse =
            typeof this.options?.type !== 'function'
                ? this.typeChecker(this.options.type)
                : this.options.type;

        function parse(buf) {
            return buf;
        }

        if (isFinished(reqTest as http.IncomingMessage)) {
            next();
            return;
        }

        if (!('body' in reqTest)) reqTest['body'] = undefined;

        if (!typeis.hasBody(reqTest as http.IncomingMessage)) {
            next();
            return;
        }

        if (!shouldParse(reqTest)) {
            next();
            return;
        }

        const charset = this.getCharset(req) || this.options.defaultCharset;

        if (charset !== 'utf-8' && charset !== 'iso-8859-1') {
            next(
                createError(
                    415,
                    'unsupported charset "' + charset.toUpperCase() + '"',
                    {
                        charset: charset,
                        type: 'charset.unsupported',
                    },
                ),
            );

            return;
        }

        read(reqTest, resTest, next, parse.bind(this), {
            encoding: charset,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
            charsetSentinel: this.options.charsetSentinel,
            interpretNumericEntities: this.options.interpretNumericEntities,
        });
    }

    /**
     * Get the extended query parser.
     *
     * @param {object} options
     */
    createQueryParser(options, extended) {
        let parameterLimit =
            options.parameterLimit !== undefined
                ? options.parameterLimit
                : 1000;
        const charsetSentinel = options.charsetSentinel;
        const interpretNumericEntities = options.interpretNumericEntities;
        const depth = extended
            ? options.depth !== undefined
                ? options.depth
                : 32
            : 0;

        if (isNaN(parameterLimit) || parameterLimit < 1)
            throw new TypeError(
                'option parameterLimit must be a positive number',
            );

        if (isNaN(depth) || depth < 0)
            throw new TypeError(
                'option depth must be a zero or a positive number',
            );

        if (isFinite(parameterLimit)) parameterLimit = parameterLimit | 0;

        return (body, encoding) => {
            const paramCount = this.parameterCount(body, parameterLimit);

            if (paramCount === undefined) {
                throw createError(413, 'too many parameters', {
                    type: 'parameters.too.many',
                });
            }

            const arrayLimit = extended ? Math.max(100, paramCount) : 0;

            try {
                return qs.parse(body, {
                    allowPrototypes: true,
                    arrayLimit: arrayLimit,
                    depth: depth,
                    charsetSentinel: charsetSentinel,
                    interpretNumericEntities: interpretNumericEntities,
                    charset: encoding,
                    parameterLimit: parameterLimit,
                    strictDepth: true,
                });
            } catch (err) {
                if (err instanceof RangeError) {
                    throw createError(400, 'The input exceeded the depth', {
                        type: 'querystring.parse.rangeError',
                    });
                } else {
                    throw err;
                }
            }
        };
    }

    /**
     * Count the number of parameters, stopping once limit reached
     *
     * @param {string} body
     * @param {number} limit
     * @api private
     */
    parameterCount(body, limit) {
        let count = 0;
        let index = 0;

        while ((index = body.indexOf('&', index)) !== -1) {
            count++;
            index++;

            if (count === limit) return undefined;
        }

        return count;
    }

    /**
     * Get the charset of a request.
     *
     * @param {object} req
     * @api private
     */
    getCharset(req) {
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

export default function (options?: BodyParserUrlEncodedOptions) {
    if (
        options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function'
    ) {
        throw new TypeError('option verify must be function');
    }

    return new CMMVBodyParserUrlEncoded(options);
}
