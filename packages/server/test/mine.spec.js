"use strict";
/**
 * @see https://github.com/expressjs/express/blob/master/test/app.all.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../utils");
const mimeTypes = require("mime-types");
const diffs = [];
describe('class Mime', function () {
    it('new constructor()', () => {
        const mime = new utils_1.Mime({ 'text/a': ['a', 'a1'] }, { 'text/b': ['b', 'b1'] });
        assert_1.strict.equal(mime.getType('a'), 'text/a');
        assert_1.strict.equal(mime.getType('a1'), 'text/a');
        assert_1.strict.equal(mime.getType('b'), 'text/b');
        assert_1.strict.equal(mime.getType('b1'), 'text/b');
        assert_1.strict.equal(mime.getExtension('text/a'), 'a');
        assert_1.strict.equal(mime.getExtension('text/b'), 'b');
    });
});
describe('Mime vendor tests', () => {
    it('MDN types', () => {
        const mime = new utils_1.Mime();
        // MDN types listed at https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        const MDN = {
            aac: 'audio/aac',
            abw: 'application/x-abiword',
            arc: 'application/x-freearc',
            avi: 'video/x-msvideo',
            azw: 'application/vnd.amazon.ebook',
            bin: 'application/octet-stream',
            bmp: 'image/bmp',
            bz: 'application/x-bzip',
            bz2: 'application/x-bzip2',
            csh: 'application/x-csh',
            css: 'text/css',
            csv: 'text/csv',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            eot: 'application/vnd.ms-fontobject',
            epub: 'application/epub+zip',
            gz: 'application/gzip',
            gif: 'image/gif',
            htm: 'text/html',
            html: 'text/html',
            ico: 'image/vnd.microsoft.icon',
            ics: 'text/calendar',
            jar: 'application/java-archive',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            js: 'text/javascript',
            json: 'application/json',
            jsonld: 'application/ld+json',
            mid: 'audio/x-midi',
            midi: 'audio/x-midi',
            mjs: 'text/javascript',
            mp3: 'audio/mpeg',
            mpeg: 'video/mpeg',
            mpkg: 'application/vnd.apple.installer+xml',
            odp: 'application/vnd.oasis.opendocument.presentation',
            ods: 'application/vnd.oasis.opendocument.spreadsheet',
            odt: 'application/vnd.oasis.opendocument.text',
            oga: 'audio/ogg',
            ogv: 'video/ogg',
            ogx: 'application/ogg',
            opus: 'audio/opus',
            otf: 'font/otf',
            png: 'image/png',
            pdf: 'application/pdf',
            php: 'application/php',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            rar: 'application/vnd.rar',
            rtf: 'application/rtf',
            sh: 'application/x-sh',
            svg: 'image/svg+xml',
            swf: 'application/x-shockwave-flash',
            tar: 'application/x-tar',
            tif: 'image/tiff',
            tiff: 'image/tiff',
            ts: 'video/mp2t',
            ttf: 'font/ttf',
            txt: 'text/plain',
            vsd: 'application/vnd.visio',
            wav: 'audio/wav',
            weba: 'audio/webm',
            webm: 'video/webm',
            webp: 'image/webp',
            woff: 'font/woff',
            woff2: 'font/woff2',
            xhtml: 'application/xhtml+xml',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            xml: 'application/xml',
            xul: 'application/vnd.mozilla.xul+xml',
            zip: 'application/zip',
            '3gp': 'video/3gpp',
            '3g2': 'video/3gpp2',
            '7z': 'application/x-7z-compressed',
        };
        for (const ext in MDN) {
            const expected = MDN[ext];
            const actual = mime.getType(ext);
            if (actual !== expected)
                diffs.push(['MDN', ext, expected, actual]);
        }
        for (const ext in mimeTypes.types) {
            const expected = mimeTypes.types[ext];
            const actual = mime.getType(ext);
            if (actual !== expected)
                diffs.push(['mime-types', ext, expected, actual]);
        }
    });
});
