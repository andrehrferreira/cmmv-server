/**
 * @see https://github.com/jshttp/range-parser/blob/master/test/range-parser.js
 */

import { strict as assert } from 'assert';

import { rangeParser as parse } from '../utils';

const deepEqual = require('deep-equal');

describe('parseRange(len, str)', function () {
    /*it('should reject non-string str', function () {
        assert.throws(parse.bind(null, 200, {}),
          /TypeError: argument str must be a string/)
    })*/

    it('should return -2 for invalid str', function () {
        assert.strictEqual(parse(200, 'malformed'), -2);
    });

    it('should return -1 if all specified ranges are invalid', function () {
        assert.strictEqual(parse(200, 'bytes=500-20'), -1);
        assert.strictEqual(parse(200, 'bytes=500-999'), -1);
        assert.strictEqual(parse(200, 'bytes=500-999,1000-1499'), -1);
    });

    it('should parse str', function () {
        const range = parse(1000, 'bytes=0-499');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 0, end: 499 });
    });

    it('should cap end at size', function () {
        const range = parse(200, 'bytes=0-499');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 0, end: 199 });
    });

    it('should parse str', function () {
        const range = parse(1000, 'bytes=40-80');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 40, end: 80 });
    });

    it('should parse str asking for last n bytes', function () {
        const range = parse(1000, 'bytes=-400');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 600, end: 999 });
    });

    it('should parse str with only start', function () {
        const range = parse(1000, 'bytes=400-');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 400, end: 999 });
    });

    it('should parse "bytes=0-"', function () {
        const range = parse(1000, 'bytes=0-');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 0, end: 999 });
    });

    it('should parse str with no bytes', function () {
        const range = parse(1000, 'bytes=0-0');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 0, end: 0 });
    });

    it('should parse str asking for last byte', function () {
        const range = parse(1000, 'bytes=-1');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 999, end: 999 });
    });

    it('should parse str with multiple ranges', function () {
        const range = parse(1000, 'bytes=40-80,81-90,-1');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 3);
        deepEqual(range[0], { start: 40, end: 80 });
        deepEqual(range[1], { start: 81, end: 90 });
        deepEqual(range[2], { start: 999, end: 999 });
    });

    it('should parse str with some invalid ranges', function () {
        const range = parse(200, 'bytes=0-499,1000-,500-999');
        assert.strictEqual(range.type, 'bytes');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 0, end: 199 });
    });

    it('should parse non-byte range', function () {
        const range = parse(1000, 'items=0-5');
        assert.strictEqual(range.type, 'items');
        assert.strictEqual(range.length, 1);
        deepEqual(range[0], { start: 0, end: 5 });
    });

    describe('when combine: true', function () {
        it('should combine overlapping ranges', function () {
            const range = parse(150, 'bytes=0-4,90-99,5-75,100-199,101-102', {
                combine: true,
            });
            assert.strictEqual(range.type, 'bytes');
            assert.strictEqual(range.length, 2);
            deepEqual(range[0], { start: 0, end: 75 });
            deepEqual(range[1], { start: 90, end: 149 });
        });

        it('should retain original order', function () {
            const range = parse(150, 'bytes=-1,20-100,0-1,101-120', {
                combine: true,
            });
            assert.strictEqual(range.type, 'bytes');
            assert.strictEqual(range.length, 3);
            deepEqual(range[0], { start: 149, end: 149 });
            deepEqual(range[1], { start: 20, end: 120 });
            deepEqual(range[2], { start: 0, end: 1 });
        });
    });
});
