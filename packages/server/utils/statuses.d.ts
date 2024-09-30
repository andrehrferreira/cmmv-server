/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 *
 * @see https://github.com/jshttp/statuses
 */
export declare const statuses: {
    readonly message: any;
    readonly code: {};
    readonly codes: number[];
    redirect: {
        300: boolean;
        301: boolean;
        302: boolean;
        303: boolean;
        305: boolean;
        307: boolean;
        308: boolean;
    };
    empty: {
        204: boolean;
        205: boolean;
        304: boolean;
    };
    retry: {
        502: boolean;
        503: boolean;
        504: boolean;
    };
    /**
     * Create a map of message to status code.
     * @private
     */
    createMessageToStatusCodeMap(codes: any): {};
    /**
     * Create a list of all status codes.
     * @private
     */
    createStatusCodeList(codes: any): number[];
    /**
     * Get the status code for given message.
     * @private
     */
    getStatusCode(message: any): any;
    getStatusMessage(code: any): any;
};
export default status;
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
declare function status(code: string | number): number;
declare namespace status {
    var message: any;
    var code: {};
    var codes: number[];
    var redirect: {
        300: boolean;
        301: boolean;
        302: boolean;
        303: boolean;
        305: boolean;
        307: boolean;
        308: boolean;
    };
    var empty: {
        204: boolean;
        205: boolean;
        304: boolean;
    };
    var retry: {
        502: boolean;
        503: boolean;
        504: boolean;
    };
}
