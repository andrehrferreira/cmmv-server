/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

import * as path from 'node:path';
import * as fs from 'node:fs';

const dirname = path.dirname;
const basename = path.basename;
const extname = path.extname;
const join = path.join;
const resolve = path.resolve;

/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *   - `root` root path for view lookup
 *
 * @param {string} name
 * @param {object} options
 * @public
 */
export default function View(this: any, name, options) {
    const opts = options || {};

    this.defaultEngine = opts.defaultEngine;
    this.ext = extname(name);
    this.name = name;
    this.root = opts.root;

    if (!this.ext && !this.defaultEngine)
        throw new Error(
            'No default engine was specified and no extension was provided.',
        );

    let fileName = name;

    if (!this.ext) {
        this.ext =
            this.defaultEngine[0] !== '.'
                ? '.' + this.defaultEngine
                : this.defaultEngine;

        fileName += this.ext;
    }

    if (!opts.engines[this.ext]) {
        const mod = this.ext.slice(1);
        const fn = require(mod).__express;

        if (typeof fn !== 'function')
            throw new Error(
                'Module "' + mod + '" does not provide a view engine.',
            );

        opts.engines[this.ext] = fn;
    }

    this.engine = opts.engines[this.ext];
    this.path = this.lookup(fileName);
}

/**
 * Lookup view by the given `name`
 *
 * @param {string} name
 * @private
 */

View.prototype.lookup = function lookup(name) {
    let path;
    let roots = [].concat(this.root);

    for (let i = 0; i < roots.length && !path; i++) {
        const root = roots[i];

        const loc = resolve(root, name);
        const dir = dirname(loc);
        const file = basename(loc);

        path = this.resolve(dir, file);
    }

    return path;
};

/**
 * Render with the given options.
 *
 * @param {object} options
 * @param {function} callback
 * @private
 */

View.prototype.render = function render(options, callback) {
    let sync = true;

    this.engine(this.path, options, function onRender(this: any) {
        if (!sync) return callback.apply(this, arguments);

        var args = new Array(arguments.length);
        var cntx = this;

        for (var i = 0; i < arguments.length; i++) args[i] = arguments[i];

        return process.nextTick(function renderTick() {
            return callback.apply(cntx, args);
        });
    });

    sync = false;
};

/**
 * Resolve the file within the given directory.
 *
 * @param {string} dir
 * @param {string} file
 * @private
 */
View.prototype.resolve = function resolve(dir, file) {
    var ext = this.ext;

    var path = join(dir, file);
    var stat = tryStat(path);

    if (stat && stat.isFile()) return path;

    path = join(dir, basename(file, ext), 'index' + ext);
    stat = tryStat(path);

    if (stat && stat.isFile()) return path;
};

/**
 * Return a stat, maybe.
 *
 * @param {string} path
 * @return {fs.Stats}
 * @private
 */
function tryStat(path) {
    try {
        return fs.statSync(path);
    } catch (e) {
        return undefined;
    }
}
