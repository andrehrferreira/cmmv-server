"use strict";
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 *
 * @see https://github.com/expressjs/express/blob/master/lib/response.js#L234
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendfile = void 0;
const onFinished = require('on-finished');
const sendfile = (res, file, options, callback) => {
    let done = false;
    let streaming;
    // request aborted
    function onaborted() {
        if (done)
            return;
        done = true;
        const err = new Error('Request aborted');
        err.code = 'ECONNABORTED';
        callback(err);
    }
    // directory
    function ondirectory() {
        if (done)
            return;
        done = true;
        const err = new Error('EISDIR, read');
        err.code = 'EISDIR';
        callback(err);
    }
    // errors
    function onerror(err) {
        if (done)
            return;
        done = true;
        callback(err);
    }
    // ended
    function onend() {
        if (done)
            return;
        done = true;
        callback();
    }
    // file
    function onfile() {
        streaming = false;
    }
    // finished
    function onfinish(err) {
        if (err && err.code === 'ECONNRESET')
            return onaborted();
        if (err)
            return onerror(err);
        if (done)
            return;
        setImmediate(function () {
            if (streaming !== false && !done) {
                onaborted();
                return;
            }
            if (done)
                return;
            done = true;
            callback();
        });
    }
    // streaming
    function onstream() {
        streaming = true;
    }
    file.on('directory', ondirectory);
    file.on('end', onend);
    file.on('error', onerror);
    file.on('file', onfile);
    file.on('stream', onstream);
    onFinished(res, onfinish);
    if (options.headers) {
        file.on('headers', function headers(res) {
            var obj = options.headers;
            var keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                let k = keys[i];
                res.setHeader(k, obj[k]);
            }
        });
    }
    file.pipe(res);
};
exports.sendfile = sendfile;
