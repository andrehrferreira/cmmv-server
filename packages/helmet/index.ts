/*!
 * CMMV Helmet
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */

/*!
 * fastify-helmet
 * Copyright(c) Fastify
 * MIT Licensed
 *
 * @see https://github.com/fastify/fastify-helmet
 */

/**
 * helmet
 * Copyright (c) 2012-2024 Evan Hahn, Adam Baldwin
 * MIT Licensed
 *
 * @see https://github.com/helmetjs/helmet
 */

import { HelmetOptions } from 'helmet';
const Helmet = require('helmet');

export class HelmetMiddleware {
    public middlewareName: string = 'helmet';

    protected options: HelmetOptions;

    constructor(options?: HelmetOptions) {
        this.options = options || {};
    }

    async process(req, res, next) {
        if (req) {
            if (req && req.app && typeof req.app.addHook == 'function')
                req.app.addHook('onSend', this.onCall.bind(this));
            else this.onCall.call(this, req, res, null, next);
        }
    }

    async onCall(request, response, payload, done) {
        if (response.headersSent === true) return;

        if (this.options.contentSecurityPolicy !== false) {
            const cspDirectives =
                this.options.contentSecurityPolicy &&
                typeof this.options.contentSecurityPolicy !== 'boolean'
                    ? this.options.contentSecurityPolicy.directives
                    : Helmet.contentSecurityPolicy?.getDefaultDirectives();
            const cspReportOnly =
                this.options.contentSecurityPolicy &&
                typeof this.options.contentSecurityPolicy !== 'boolean'
                    ? this.options.contentSecurityPolicy.reportOnly
                    : undefined;
            const cspUseDefaults =
                this.options.contentSecurityPolicy &&
                typeof this.options.contentSecurityPolicy !== 'boolean'
                    ? this.options.contentSecurityPolicy.useDefaults
                    : undefined;

            const directives: any = { ...cspDirectives };

            if (response.cspNonce) {
                const { script: scriptCSPNonce, style: styleCSPNonce } =
                    response.cspNonce;

                const scriptKey = Array.isArray(directives['script-src'])
                    ? 'script-src'
                    : 'scriptSrc';
                directives[scriptKey] = Array.isArray(directives[scriptKey])
                    ? [...directives[scriptKey]]
                    : [];
                directives[scriptKey].push(`'nonce-${scriptCSPNonce}'`);

                const styleKey = Array.isArray(directives['style-src'])
                    ? 'style-src'
                    : 'styleSrc';
                directives[styleKey] = Array.isArray(directives[styleKey])
                    ? [...directives[styleKey]]
                    : [];
                directives[styleKey].push(`'nonce-${styleCSPNonce}'`);
            }

            const contentSecurityPolicy = {
                directives,
                reportOnly: cspReportOnly,
                useDefaults: cspUseDefaults,
            };

            const mergedHelmetConfiguration = Object.assign(
                Object.create(null),
                this.options,
                { contentSecurityPolicy },
            );

            Helmet(mergedHelmetConfiguration)(request.req, response.res, done);
        } else {
            Helmet(this.options)(request.req, response.res, done);
        }
    }
}

export default async function (options?: HelmetOptions) {
    const middleware = new HelmetMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
}

export const helmet = function (options?: HelmetOptions) {
    const middleware = new HelmetMiddleware(options);
    return (req, res, next) => middleware.process(req, res, next);
};
