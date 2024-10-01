"use strict";
/*!
 * destroy
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * Copyright(c) 2024 Andre Ferreira
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = void 0;
const node_events_1 = require("node:events");
const node_fs_1 = require("node:fs");
const Stream = require("node:stream");
const Zlib = require("node:zlib");
/**
 * Destroy the given stream, and optionally suppress any future `error` events.
 *
 * @param {object} stream
 * @param {boolean} suppress
 * @public
 */
const destroy = (stream, suppress) => {
    if (!stream)
        return;
    if (isFsReadStream(stream)) {
        destroyReadStream(stream);
    }
    else if (isZlibStream(stream)) {
        destroyZlibStream(stream);
    }
    else if (hasDestroy(stream)) {
        stream.destroy();
    }
    if (isEventEmitter(stream) && suppress) {
        stream.removeAllListeners('error');
        stream.addListener('error', noop);
    }
    return stream;
};
exports.destroy = destroy;
/**
 * Destroy a ReadStream.
 *
 * @param {object} stream
 * @private
 */
function destroyReadStream(stream) {
    stream.destroy();
    if (typeof stream.close === 'function')
        stream.on('open', onOpenClose);
}
/**
 * Close a Zlib stream.
 *
 * Zlib streams below Node.js 4.5.5 have a buggy implementation
 * of .close() when zlib encountered an error.
 *
 * @param {object} stream
 * @private
 */
function closeZlibStream(stream) {
    if (stream._hadError === true) {
        const prop = stream._binding === null ? '_binding' : '_handle';
        stream[prop] = {
            close: function () {
                this[prop] = null;
            },
        };
    }
    stream.close();
}
/**
 * Destroy a Zlib stream.
 *
 * Zlib streams don't have a destroy function in Node.js 6. On top of that
 * simply calling destroy on a zlib stream in Node.js 8+ will result in a
 * memory leak. So until that is fixed, we need to call both close AND destroy.
 *
 * PR to fix memory leak: https://github.com/nodejs/node/pull/23734
 *
 * In Node.js 6+8, it's important that destroy is called before close as the
 * stream would otherwise emit the error 'zlib binding closed'.
 *
 * @param {object} stream
 * @private
 */
function destroyZlibStream(stream) {
    if (typeof stream.destroy === 'function') {
        if (stream._binding) {
            stream.destroy();
            if (stream._processing) {
                stream._needDrain = true;
                stream.once('drain', onDrainClearBinding);
            }
            else {
                stream._binding.clear();
            }
        }
        else if (stream._destroy &&
            stream._destroy !== Stream.Transform.prototype._destroy) {
            stream.destroy();
        }
        else if (stream._destroy && typeof stream.close === 'function') {
            stream.destroyed = true;
            stream.close();
        }
        else {
            stream.destroy();
        }
    }
    else if (typeof stream.close === 'function') {
        closeZlibStream(stream);
    }
}
/**
 * Determine if stream has destroy.
 * @private
 */
function hasDestroy(stream) {
    return typeof stream.destroy === 'function';
}
/**
 * Determine if val is EventEmitter.
 * @private
 */
function isEventEmitter(val) {
    return val instanceof node_events_1.EventEmitter;
}
/**
 * Determine if stream is fs.ReadStream stream.
 * @private
 */
function isFsReadStream(stream) {
    return stream instanceof node_fs_1.ReadStream;
}
/**
 * Determine if stream is Zlib stream.
 * @private
 */
function isZlibStream(stream) {
    return (stream instanceof Zlib.gzip ||
        stream instanceof Zlib.gunzip ||
        stream instanceof Zlib.deflate ||
        stream instanceof Zlib.deflateRaw ||
        stream instanceof Zlib.inflate ||
        stream instanceof Zlib.inflateRaw ||
        stream instanceof Zlib.unzip);
}
/**
 * No-op function.
 * @private
 */
function noop() { }
/**
 * On drain handler to clear binding.
 * @private
 */
// istanbul ignore next: node.js 0.8
function onDrainClearBinding() {
    this._binding.clear();
}
/**
 * On open handler to close stream.
 * @private
 */
function onOpenClose() {
    if (typeof this.fd === 'number')
        this.close();
}
