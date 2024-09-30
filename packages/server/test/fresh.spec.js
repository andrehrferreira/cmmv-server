"use strict";
/**
 * @see https://github.com/jshttp/fresh/blob/master/test/fresh.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../utils");
describe('fresh(reqHeaders, resHeaders)', function () {
    describe('when a non-conditional GET is performed', function () {
        it('should be stale', function () {
            const reqHeaders = {};
            const resHeaders = {};
            assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
        });
    });
    describe('when requested with If-None-Match', function () {
        describe('when ETags match', function () {
            it('should be fresh', function () {
                const reqHeaders = { 'if-none-match': '"foo"' };
                const resHeaders = { etag: '"foo"' };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when ETags mismatch', function () {
            it('should be stale', function () {
                const reqHeaders = { 'if-none-match': '"foo"' };
                const resHeaders = { etag: '"bar"' };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when at least one matches', function () {
            it('should be fresh', function () {
                const reqHeaders = { 'if-none-match': ' "bar" , "foo"' };
                const resHeaders = { etag: '"foo"' };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when etag is missing', function () {
            it('should be stale', function () {
                const reqHeaders = { 'if-none-match': '"foo"' };
                const resHeaders = {};
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when ETag is weak', function () {
            it('should be fresh on exact match', function () {
                const reqHeaders = { 'if-none-match': 'W/"foo"' };
                const resHeaders = { etag: 'W/"foo"' };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
            it('should be fresh on strong match', function () {
                const reqHeaders = { 'if-none-match': 'W/"foo"' };
                const resHeaders = { etag: '"foo"' };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when ETag is strong', function () {
            it('should be fresh on exact match', function () {
                const reqHeaders = { 'if-none-match': '"foo"' };
                const resHeaders = { etag: '"foo"' };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
            it('should be fresh on weak match', function () {
                const reqHeaders = { 'if-none-match': '"foo"' };
                const resHeaders = { etag: 'W/"foo"' };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when * is given', function () {
            it('should be fresh', function () {
                const reqHeaders = { 'if-none-match': '*' };
                const resHeaders = { etag: '"foo"' };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
            it('should get ignored if not only value', function () {
                const reqHeaders = { 'if-none-match': '*, "bar"' };
                const resHeaders = { etag: '"foo"' };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
    });
    describe('when requested with If-Modified-Since', function () {
        describe('when modified since the date', function () {
            it('should be stale', function () {
                const reqHeaders = {
                    'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                const resHeaders = {
                    'last-modified': 'Sat, 01 Jan 2000 01:00:00 GMT',
                };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when unmodified since the date', function () {
            it('should be fresh', function () {
                const reqHeaders = {
                    'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT',
                };
                const resHeaders = {
                    'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when Last-Modified is missing', function () {
            it('should be stale', function () {
                const reqHeaders = {
                    'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                const resHeaders = {};
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('with invalid If-Modified-Since date', function () {
            it('should be stale', function () {
                const reqHeaders = { 'if-modified-since': 'foo' };
                const resHeaders = {
                    'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('with invalid Last-Modified date', function () {
            it('should be stale', function () {
                const reqHeaders = {
                    'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                const resHeaders = { 'last-modified': 'foo' };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
    });
    describe('when requested with If-Modified-Since and If-None-Match', function () {
        describe('when both match', function () {
            it('should be fresh', function () {
                const reqHeaders = {
                    'if-none-match': '"foo"',
                    'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT',
                };
                const resHeaders = {
                    etag: '"foo"',
                    'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when only ETag matches', function () {
            it('should be fresh', function () {
                const reqHeaders = {
                    'if-none-match': '"foo"',
                    'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                const resHeaders = {
                    etag: '"foo"',
                    'last-modified': 'Sat, 01 Jan 2000 01:00:00 GMT',
                };
                assert_1.strict.ok((0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when only Last-Modified matches', function () {
            it('should be stale', function () {
                const reqHeaders = {
                    'if-none-match': '"foo"',
                    'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT',
                };
                const resHeaders = {
                    etag: '"bar"',
                    'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when none match', function () {
            it('should be stale', function () {
                const reqHeaders = {
                    'if-none-match': '"foo"',
                    'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                const resHeaders = {
                    etag: '"bar"',
                    'last-modified': 'Sat, 01 Jan 2000 01:00:00 GMT',
                };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
    });
    describe('when requested with Cache-Control: no-cache', function () {
        it('should be stale', function () {
            const reqHeaders = { 'cache-control': ' no-cache' };
            const resHeaders = {};
            assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
        });
        describe('when ETags match', function () {
            it('should be stale', function () {
                const reqHeaders = {
                    'cache-control': ' no-cache',
                    'if-none-match': '"foo"',
                };
                const resHeaders = { etag: '"foo"' };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
        describe('when unmodified since the date', function () {
            it('should be stale', function () {
                const reqHeaders = {
                    'cache-control': ' no-cache',
                    'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT',
                };
                const resHeaders = {
                    'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT',
                };
                assert_1.strict.ok(!(0, utils_1.fresh)(reqHeaders, resHeaders));
            });
        });
    });
});
