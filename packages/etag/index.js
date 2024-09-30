"use strict";
/*!
 * CMMV Cors
 * Copyright(c) Fastify
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify-etag
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.etag = exports.EtagMiddleware = void 0;
exports.default = default_1;
const node_crypto_1 = require("node:crypto");
const fnv1a_1 = require("./fnv1a");
class EtagMiddleware {
    constructor(options) {
        this.middlewareName = 'etag';
        this.options = {
            algorithm: options?.algorithm || 'sha1',
            weak: Boolean(options?.weak === true),
        };
    }
    async process(req, res, next) {
        if (req.app && typeof req.app.addHook == 'function')
            req.app.addHook('onSend', this.onCall.bind(this));
        else
            this.onCall.call(this, req, res, res.body, next);
    }
    async onCall(req, res, payload, done) {
        const hash = this.buildHashFn(this.options.algorithm, this.options.weak);
        let etag = res.getHeader('etag');
        let newPayload;
        if (!etag) {
            if (!(typeof payload === 'string' || payload instanceof Buffer)) {
                done(null, newPayload);
                return;
            }
            etag = hash(payload);
            res.set('etag', etag);
        }
        if (res.statusCode === 304 &&
            (req.headers['if-none-match'] === etag ||
                req.headers['if-none-match'] === 'W/' + etag ||
                'W/' + req.headers['if-none-match'] === etag)) {
            res.code(304);
            newPayload = '';
        }
        done(null, newPayload);
    }
    buildHashFn(algorithm = 'sha1', weak = false) {
        this.validateAlgorithm(algorithm);
        const prefix = weak ? 'W/"' : '"';
        if (algorithm === 'fnv1a')
            return payload => prefix + (0, fnv1a_1.fnv1a)(payload).toString(36) + '"';
        return payload => prefix +
            (0, node_crypto_1.createHash)(algorithm).update(payload).digest('base64') +
            '"';
    }
    validateAlgorithm(algorithm) {
        if (algorithm === 'fnv1a')
            return true;
        try {
            (0, node_crypto_1.createHash)(algorithm);
        }
        catch (e) {
            throw new TypeError(`Algorithm ${algorithm} not supported.`);
        }
    }
}
exports.EtagMiddleware = EtagMiddleware;
async function default_1(options) {
    const middleware = new EtagMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
}
const etag = function (options) {
    const middleware = new EtagMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
exports.etag = etag;
