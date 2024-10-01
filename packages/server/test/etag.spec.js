"use strict";
/**
 * @see https://github.com/jshttp/etag/blob/master/test/test.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const seedrandom = require("seedrandom");
const fs = require("node:fs");
const utils_1 = require("../utils");
const buf5kb = getbuffer(5 * 1024);
const str5kb = getbuffer(5 * 1024).toString();
describe('etag(entity)', function () {
    describe('when "entity" is a string', function () {
        it('should generate a strong ETag', function () {
            assert_1.strict.strictEqual((0, utils_1.etag)('beep boop'), '"9-fINXV39R1PCo05OqGqr7KIY9lCE"');
        });
        it('should work containing Unicode', function () {
            assert_1.strict.strictEqual((0, utils_1.etag)('论'), '"3-QkSKq8sXBjHL2tFAZknA2n6LYzM"');
            assert_1.strict.strictEqual((0, utils_1.etag)('论', { weak: true }), 'W/"3-QkSKq8sXBjHL2tFAZknA2n6LYzM"');
        });
        it('should work for empty string', function () {
            assert_1.strict.strictEqual((0, utils_1.etag)(''), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
        });
    });
    describe('when "entity" is a Buffer', function () {
        it('should generate a strong ETag', function () {
            assert_1.strict.strictEqual((0, utils_1.etag)(Buffer.from([1, 2, 3])), '"3-cDeAcZjCKn0rCAc3HXY3eahP388"');
        });
        it('should work for empty Buffer', function () {
            assert_1.strict.strictEqual((0, utils_1.etag)(Buffer.alloc(0)), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
        });
    });
    describe('when "entity" is a fs.Stats', function () {
        it('should generate a weak ETag', function () {
            assert_1.strict.ok(isweak((0, utils_1.etag)(fs.statSync(__filename))));
        });
        it('should generate consistently', function () {
            assert_1.strict.strictEqual((0, utils_1.etag)(fs.statSync(__filename)), (0, utils_1.etag)(fs.statSync(__filename)));
        });
    });
    describe('when "entity" looks like a stats object', function () {
        it('should generate a weak ETag', function () {
            const fakeStat = {
                ctime: new Date('2014-09-01T14:52:07Z'),
                mtime: new Date('2014-09-01T14:52:07Z'),
                ino: 0,
                size: 3027,
            };
            assert_1.strict.strictEqual((0, utils_1.etag)(fakeStat), 'W/"bd3-14831b399d8"');
        });
    });
    describe('with "weak" option', function () {
        describe('when "false"', function () {
            it('should generate a strong ETag for a string', function () {
                assert_1.strict.strictEqual((0, utils_1.etag)('', { weak: false }), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
                assert_1.strict.strictEqual((0, utils_1.etag)('beep boop', { weak: false }), '"9-fINXV39R1PCo05OqGqr7KIY9lCE"');
                assert_1.strict.strictEqual((0, utils_1.etag)(str5kb, { weak: false }), '"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"');
            });
            it('should generate a strong ETag for a Buffer', function () {
                assert_1.strict.strictEqual((0, utils_1.etag)(Buffer.alloc(0), { weak: false }), '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
                assert_1.strict.strictEqual((0, utils_1.etag)(Buffer.from([1, 2, 3]), { weak: false }), '"3-cDeAcZjCKn0rCAc3HXY3eahP388"');
                assert_1.strict.strictEqual((0, utils_1.etag)(buf5kb, { weak: false }), '"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"');
            });
            it('should generate a strong ETag for fs.Stats', function () {
                assert_1.strict.ok(!isweak((0, utils_1.etag)(fs.statSync(__filename), { weak: false })));
            });
        });
        describe('when "true"', function () {
            it('should generate a weak ETag for a string', function () {
                assert_1.strict.strictEqual((0, utils_1.etag)('', { weak: true }), 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
                assert_1.strict.strictEqual((0, utils_1.etag)('beep boop', { weak: true }), 'W/"9-fINXV39R1PCo05OqGqr7KIY9lCE"');
                assert_1.strict.strictEqual((0, utils_1.etag)(str5kb, { weak: true }), 'W/"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"');
            });
            it('should generate a weak ETag for a Buffer', function () {
                assert_1.strict.strictEqual((0, utils_1.etag)(Buffer.alloc(0), { weak: true }), 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"');
                assert_1.strict.strictEqual((0, utils_1.etag)(Buffer.from([1, 2, 3]), { weak: true }), 'W/"3-cDeAcZjCKn0rCAc3HXY3eahP388"');
                assert_1.strict.strictEqual((0, utils_1.etag)(buf5kb, { weak: true }), 'W/"1400-CH0oWYLQGHe/yDhUrMkMg3fIdVU"');
            });
            it('should generate a weak ETag for fs.Stats', function () {
                assert_1.strict.ok(isweak((0, utils_1.etag)(fs.statSync(__filename), { weak: true })));
            });
            it('should generate different ETags for different strings', function () {
                assert_1.strict.notStrictEqual((0, utils_1.etag)('plumless', { weak: true }), (0, utils_1.etag)('buckeroo', { weak: true }));
            });
        });
    });
});
function getbuffer(size) {
    const buffer = Buffer.alloc(size);
    const rng = seedrandom('etag test');
    for (let i = 0; i < buffer.length; i++)
        buffer[i] = (rng() * 94 + 32) | 0;
    return buffer;
}
function isweak(etag) {
    const weak = /^(W\/|)"([^"]+)"/.exec(etag);
    if (weak === null)
        throw new Error('invalid ETag: ' + etag);
    return weak[1] === 'W/';
}
