/**
 * mime
 * Copyright (c) 2023 Robert Kieffer
 * Copyright (c) 2024 Andre Ferreira
 * @see https://github.com/broofa/mime
 */

import otherTypes from '../types/other';
import standardTypes from '../types/standard';

type TypeMap = { [key: string]: string[] };

export class Mime {
    #extensionToType = new Map<string, string>();
    #typeToExtension = new Map<string, string>();
    #typeToExtensions = new Map<string, Set<string>>();

    constructor(...args: TypeMap[]) {
        if (args.length > 0) {
            for (const arg of args) this.define(arg);
        } else {
            this.define(standardTypes);
            this.define(otherTypes);
        }
    }

    define(typeMap: TypeMap, force = false) {
        for (let [type, extensions] of Object.entries(typeMap)) {
            // Lowercase thingz
            type = type.toLowerCase();
            extensions = extensions.map(ext => ext.toLowerCase());

            if (!this.#typeToExtensions.has(type))
                this.#typeToExtensions.set(type, new Set<string>());

            const allExtensions = this.#typeToExtensions.get(type);

            let first = true;
            for (let extension of extensions) {
                const starred = extension.startsWith('*');

                extension = starred ? extension.slice(1) : extension;
                allExtensions?.add(extension);

                if (first) this.#typeToExtension.set(type, extension);

                first = false;

                if (starred) continue;

                const currentType = this.#extensionToType.get(extension);
                if (currentType && currentType != type && !force) {
                    throw new Error(
                        `"${type} -> ${extension}" conflicts with "${currentType} -> ${extension}". Pass \`force=true\` to override this definition.`,
                    );
                }

                this.#extensionToType.set(extension, type);
            }
        }

        return this;
    }

    /**
     * Get mime type associated with an extension
     */
    getType(path: string) {
        if (typeof path !== 'string') return null;

        const last = path.replace(/^.*[/\\]/, '').toLowerCase();
        const ext = last.replace(/^.*\./, '').toLowerCase();

        const hasPath = last.length < path.length;
        const hasDot = ext.length < last.length - 1;

        if (!hasDot && hasPath) return null;

        return this.#extensionToType.get(ext) ?? null;
    }

    /**
     * Get default file extension associated with a mime type
     */
    getExtension(type: string) {
        if (typeof type !== 'string') return null;

        type = type?.split?.(';')[0];

        return (
            (type && this.#typeToExtension.get(type.trim().toLowerCase())) ??
            null
        );
    }

    /**
     * Get all file extensions associated with a mime type
     */
    getAllExtensions(type: string) {
        if (typeof type !== 'string') return null;
        return this.#typeToExtensions.get(type.toLowerCase()) ?? null;
    }

    //
    // Private API, for internal use only.  These APIs may change at any time
    //

    _freeze() {
        this.define = () => {
            throw new Error(
                'define() not allowed for built-in Mime objects. See https://github.com/broofa/mime/blob/main/README.md#custom-mime-instances',
            );
        };

        Object.freeze(this);

        for (const extensions of this.#typeToExtensions.values())
            Object.freeze(extensions);

        return this;
    }

    _getTestState() {
        return {
            types: this.#extensionToType,
            extensions: this.#typeToExtension,
        };
    }
}

export let mime = new Mime()._freeze();
