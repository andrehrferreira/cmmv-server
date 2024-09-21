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
import { isFinished } from 'on-finished';

import { read } from './read';

import {
    ServerMiddleware,
    IRequest,
    IRespose,
    INext,
} from '@cmmv/server-common';

export interface BodyParserRawOptions {
    limit?: number | string;
    inflate?: boolean;
    type?: string;
    verify?: boolean | Function;
    express?: boolean;
}

export class CMMVBodyParserRaw extends ServerMiddleware {
    public middlewareName: string = 'body-parse-raw';

    private options: BodyParserRawOptions;

    constructor(options?: BodyParserRawOptions) {
        super();

        this.options = {
            limit:
                typeof options?.limit !== 'number'
                    ? bytes.parse(options?.limit || '100kb')
                    : options?.limit,
            inflate: options?.inflate !== false,
            type: options?.type || 'application/octet-stream',
            verify: options?.verify || false,
            express: options?.express || false,
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

        read(reqTest, resTest, next, parse.bind(this), {
            encoding: null,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
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

export default function (options?: BodyParserRawOptions) {
    if (
        options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function'
    ) {
        throw new TypeError('option verify must be function');
    }

    return new CMMVBodyParserRaw(options);
}
