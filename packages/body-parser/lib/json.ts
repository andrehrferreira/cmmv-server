/*!
 * CMMV Compression
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/expressjs/body-parser
 */

import * as http from 'node:http';

import * as typeis from 'type-is';
import * as bytes from 'bytes';
import * as contentType from 'content-type';
import * as createError from 'http-errors';
import { isFinished } from 'on-finished';

import { read } from './read';

import {
    ServerMiddleware,
    IRequest,
    IRespose,
    INext,
} from '@cmmv/server-abstract';

export interface BodyParserJSONOptions {
    limit?: number | string;
    inflate?: boolean;
    reviver?: any;
    strict?: boolean;
    type?: string;
    verify?: boolean | Function;
}

const FIRST_CHAR_REGEXP = /^[\x20\x09\x0a\x0d]*([^\x20\x09\x0a\x0d])/; // eslint-disable-line no-control-regex
const JSON_SYNTAX_CHAR = '#';
const JSON_SYNTAX_REGEXP = /#+/g;

export class CMMVBodyParserJSON extends ServerMiddleware {
    public middlewareName: string = 'body-parse-json';

    private options: BodyParserJSONOptions;

    constructor(options?: BodyParserJSONOptions) {
        super();

        this.options = {
            limit:
                typeof options?.limit !== 'number'
                    ? bytes.parse(options?.limit || '100kb')
                    : options?.limit,
            inflate: options?.inflate !== false,
            reviver: options?.reviver,
            strict: options?.strict !== false,
            type: options?.type || 'application/json',
            verify: options?.verify || false,
        };
    }

    async process(req: IRequest, res: IRespose, next?: INext) {
        if (isFinished(req.httpRequest as http.IncomingMessage)) {
            next();
            return;
        }

        if (!('body' in req.httpRequest)) req.httpRequest['body'] = undefined;

        if (!typeis.hasBody(req.httpRequest as http.IncomingMessage)) {
            next();
            return;
        }

        const shouldParse =
            typeof this.options.type !== 'function'
                ? this.typeChecker(this.options.type)
                : this.options.type;

        if (!shouldParse(req)) {
            next();
            return;
        }

        const charset = this.getCharset(req) || 'utf-8';
        if (charset.slice(0, 4) !== 'utf-') {
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

        read(req.httpRequest, res.httpResponse, next, this.parse, {
            encoding: charset,
            inflate: this.options.inflate,
            limit: this.options.limit,
            verify: this.options.verify,
        });
    }

    private parse(body) {
        if (body.length === 0) {
            // special-case empty json body, as it's a common client-side mistake
            // TODO: maybe make this configurable or part of "strict" option
            return {};
        }

        if (this.options.strict) {
            const first = this.firstchar(body);

            if (first !== '{' && first !== '[')
                throw this.createStrictSyntaxError(body, first);
        }

        try {
            return JSON.parse(body, this.options.reviver);
        } catch (e) {
            throw this.normalizeJsonSyntaxError(e, {
                message: e.message,
                stack: e.stack,
            });
        }
    }

    /**
     * Create strict violation syntax error matching native error.
     *
     * @param {string} str
     * @param {string} char
     * @return {Error}
     * @private
     */
    private createStrictSyntaxError(str: string, char: string) {
        const index = str.indexOf(char);
        let partial = '';

        if (index !== -1) {
            partial = str.substring(0, index) + JSON_SYNTAX_CHAR;

            for (let i = index + 1; i < str.length; i++)
                partial += JSON_SYNTAX_CHAR;
        }

        try {
            JSON.parse(partial);
            /* istanbul ignore next */ throw new SyntaxError(
                'strict violation',
            );
        } catch (e) {
            return this.normalizeJsonSyntaxError(e, {
                message: e.message.replace(
                    JSON_SYNTAX_REGEXP,
                    function (placeholder) {
                        return str.substring(index, index + placeholder.length);
                    },
                ),
                stack: e.stack,
            });
        }
    }

    /**
     * Get the first non-whitespace character in a string.
     *
     * @param {string} str
     * @return {function}
     * @private
     */
    private firstchar(str): string | undefined {
        const match = FIRST_CHAR_REGEXP.exec(str);
        return match ? match[1] : undefined;
    }

    /**
     * Get the charset of a request.
     *
     * @param {object} req
     * @api private
     */
    private getCharset(req: IRequest) {
        try {
            return (
                contentType.parse(req.httpRequest).parameters.charset || ''
            ).toLowerCase();
        } catch (e) {
            return undefined;
        }
    }

    /**
     * Normalize a SyntaxError for JSON.parse.
     *
     * @param {SyntaxError} error
     * @param {object} obj
     * @return {SyntaxError}
     */
    private normalizeJsonSyntaxError(error, obj) {
        const keys = Object.getOwnPropertyNames(error);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (key !== 'stack' && key !== 'message') delete error[key];
        }

        // replace stack before message for Node.js 0.10 and below
        error.stack = obj.stack.replace(error.message, obj.message);
        error.message = obj.message;

        return error;
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

export default function (options?: BodyParserJSONOptions) {
    if (
        options.verify !== false &&
        options.verify !== undefined &&
        options.verify !== null &&
        typeof options.verify !== 'function'
    ) {
        throw new TypeError('option verify must be function');
    }

    return new CMMVBodyParserJSON(options);
}
