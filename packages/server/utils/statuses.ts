/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 *
 * @see https://github.com/jshttp/statuses
 */

const Codes = require('./codes.json');

export const statuses = {
    // status code to message map
    get message() {
        return Codes;
    },

    // status message (lower-case) to code map
    get code() {
        return this.createMessageToStatusCodeMap(Codes);
    },

    // array of status codes
    get codes() {
        return this.createStatusCodeList(Codes);
    },

    // status codes for redirects
    redirect: {
        300: true,
        301: true,
        302: true,
        303: true,
        305: true,
        307: true,
        308: true,
    },

    // status codes for empty bodies
    empty: {
        204: true,
        205: true,
        304: true,
    },

    // status codes for when you should retry the request
    retry: {
        502: true,
        503: true,
        504: true,
    },

    /**
     * Create a map of message to status code.
     * @private
     */
    createMessageToStatusCodeMap(codes) {
        const map = {};

        Object.keys(codes).forEach(function forEachCode(code) {
            const message = codes[code];
            const status = Number(code);
            map[message.toLowerCase()] = status;
        });

        return map;
    },

    /**
     * Create a list of all status codes.
     * @private
     */
    createStatusCodeList(codes) {
        return Object.keys(codes).map(function mapCode(code) {
            return Number(code);
        });
    },

    /**
     * Get the status code for given message.
     * @private
     */
    getStatusCode(message) {
        const msg = message.toLowerCase();

        if (!Object.prototype.hasOwnProperty.call(this.code, msg))
            throw new Error('invalid status message: "' + message + '"');

        return this.code[msg];
    },

    getStatusMessage(code) {
        if (!Object.prototype.hasOwnProperty.call(this.message, code))
            throw new Error('invalid status code: ' + code);

        return this.message[code];
    },
};

export default status;
status.message = Codes;
status.code = statuses.code;
status.codes = statuses.codes;
status.redirect = statuses.redirect;
status.empty = statuses.empty;
status.retry = statuses.retry;

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {number}
 * @public
 */
function status(code: string | number): number {
    if (typeof code === 'number') return statuses.getStatusMessage(code);

    if (typeof code !== 'string')
        throw new TypeError('code must be a number or string');

    // '403'
    const n = parseInt(code, 10);

    if (!isNaN(n)) return statuses.getStatusMessage(n);

    return statuses.getStatusCode(code);
}
