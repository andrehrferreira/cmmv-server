"use strict";
/**
 * mime
 * Copyright (c) 2023 Robert Kieffer
 * Copyright (c) 2024 Andre Ferreira
 * @see https://github.com/broofa/mime
 */
var _Mime_extensionToType, _Mime_typeToExtension, _Mime_typeToExtensions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mime = exports.Mime = void 0;
const tslib_1 = require("tslib");
const other_1 = require("../types/other");
const standard_1 = require("../types/standard");
class Mime {
    constructor(...args) {
        _Mime_extensionToType.set(this, new Map());
        _Mime_typeToExtension.set(this, new Map());
        _Mime_typeToExtensions.set(this, new Map());
        if (args.length > 0) {
            for (const arg of args)
                this.define(arg);
        }
        else {
            this.define(standard_1.default);
            this.define(other_1.default);
        }
    }
    define(typeMap, force = false) {
        for (let [type, extensions] of Object.entries(typeMap)) {
            type = type.toLowerCase();
            extensions = extensions.map(ext => ext.toLowerCase());
            if (!tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").has(type))
                tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").set(type, new Set());
            const allExtensions = tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type);
            let first = true;
            for (let extension of extensions) {
                const starred = extension.startsWith('*');
                extension = starred ? extension.slice(1) : extension;
                allExtensions?.add(extension);
                if (first)
                    tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtension, "f").set(type, extension);
                first = false;
                if (starred)
                    continue;
                const currentType = tslib_1.__classPrivateFieldGet(this, _Mime_extensionToType, "f").get(extension);
                if (currentType && currentType != type && !force) {
                    throw new Error(`"${type} -> ${extension}" conflicts with "${currentType} -> ${extension}". Pass \`force=true\` to override this definition.`);
                }
                tslib_1.__classPrivateFieldGet(this, _Mime_extensionToType, "f").set(extension, type);
            }
        }
        return this;
    }
    /**
     * Get mime type associated with an extension
     */
    getType(path) {
        if (typeof path !== 'string')
            return null;
        const last = path.replace(/^.*[/\\]/, '').toLowerCase();
        const ext = last.replace(/^.*\./, '').toLowerCase();
        const hasPath = last.length < path.length;
        const hasDot = ext.length < last.length - 1;
        if (!hasDot && hasPath)
            return null;
        return tslib_1.__classPrivateFieldGet(this, _Mime_extensionToType, "f").get(ext) ?? null;
    }
    /**
     * Get default file extension associated with a mime type
     */
    getExtension(type) {
        if (typeof type !== 'string')
            return null;
        type = type?.split?.(';')[0];
        return ((type && tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtension, "f").get(type.trim().toLowerCase())) ??
            null);
    }
    /**
     * Get all file extensions associated with a mime type
     */
    getAllExtensions(type) {
        if (typeof type !== 'string')
            return null;
        return tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").get(type.toLowerCase()) ?? null;
    }
    //
    // Private API, for internal use only.  These APIs may change at any time
    //
    _freeze() {
        this.define = () => {
            throw new Error('define() not allowed for built-in Mime objects. See https://github.com/broofa/mime/blob/main/README.md#custom-mime-instances');
        };
        Object.freeze(this);
        for (const extensions of tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtensions, "f").values())
            Object.freeze(extensions);
        return this;
    }
    _getTestState() {
        return {
            types: tslib_1.__classPrivateFieldGet(this, _Mime_extensionToType, "f"),
            extensions: tslib_1.__classPrivateFieldGet(this, _Mime_typeToExtension, "f"),
        };
    }
}
exports.Mime = Mime;
_Mime_extensionToType = new WeakMap(), _Mime_typeToExtension = new WeakMap(), _Mime_typeToExtensions = new WeakMap();
exports.mime = new Mime()._freeze();
