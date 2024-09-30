"use strict";
/**
 * @see https://github.com/jshttp/statuses/blob/master/test/test.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const http = require("node:http");
const statuses_1 = require("../utils/statuses");
describe('status', function () {
    describe('arguments', function () {
        describe('code', function () {
            it('should accept a number', function () {
                assert_1.strict.strictEqual((0, statuses_1.default)(200), 'OK');
            });
            it('should accept a string', function () {
                assert_1.strict.strictEqual((0, statuses_1.default)('OK'), 200);
            });
            it('should accept a string number', function () {
                assert_1.strict.strictEqual((0, statuses_1.default)('200'), 'OK');
            });
        });
    });
    describe('when given a number', function () {
        it('should return message when a valid status code', function () {
            assert_1.strict.strictEqual((0, statuses_1.default)(200), 'OK');
            assert_1.strict.strictEqual((0, statuses_1.default)(404), 'Not Found');
            assert_1.strict.strictEqual((0, statuses_1.default)(500), 'Internal Server Error');
        });
        it('should throw for invalid status code', function () {
            assert_1.strict.throws(statuses_1.default.bind(null, 0), /invalid status code/);
            assert_1.strict.throws(statuses_1.default.bind(null, 1000), /invalid status code/);
        });
        it('should throw for unknown status code', function () {
            assert_1.strict.throws(statuses_1.default.bind(null, 299), /invalid status code/);
            assert_1.strict.throws(statuses_1.default.bind(null, 310), /invalid status code/);
        });
        it('should throw for discontinued status code', function () {
            assert_1.strict.throws(statuses_1.default.bind(null, 306), /invalid status code/);
        });
    });
    describe('when given a string', function () {
        it('should return message when a valid status code', function () {
            assert_1.strict.strictEqual((0, statuses_1.default)('200'), 'OK');
            assert_1.strict.strictEqual((0, statuses_1.default)('404'), 'Not Found');
            assert_1.strict.strictEqual((0, statuses_1.default)('500'), 'Internal Server Error');
        });
        it('should be truthy when a valid status message', function () {
            assert_1.strict.ok((0, statuses_1.default)('OK'));
            assert_1.strict.ok((0, statuses_1.default)('Not Found'));
            assert_1.strict.ok((0, statuses_1.default)('Internal Server Error'));
        });
        it('should be case insensitive', function () {
            assert_1.strict.ok((0, statuses_1.default)('Ok'));
            assert_1.strict.ok((0, statuses_1.default)('not found'));
            assert_1.strict.ok((0, statuses_1.default)('INTERNAL SERVER ERROR'));
        });
        it('should throw for unknown status message', function () {
            assert_1.strict.throws(statuses_1.default.bind(null, 'too many bugs'), /invalid status message/);
            assert_1.strict.throws(statuses_1.default.bind(null, 'constructor'), /invalid status message/);
            assert_1.strict.throws(statuses_1.default.bind(null, '__proto__'), /invalid status message/);
        });
        it('should throw for unknown status code', function () {
            assert_1.strict.throws(statuses_1.default.bind(null, '299'), /invalid status code/);
        });
    });
    describe('.codes', function () {
        it('should include codes from Node.js', function () {
            Object.keys(http.STATUS_CODES).forEach(function forEachCode(code) {
                assert_1.strict.notStrictEqual(statuses_1.default.codes.indexOf(Number(code)), -1, 'contains ' + code);
            });
        });
    });
    describe('.empty', function () {
        it('should be an object', function () {
            assert_1.strict.ok(statuses_1.default.empty);
            assert_1.strict.strictEqual(typeof statuses_1.default.empty, 'object');
        });
        it('should include 204', function () {
            (0, assert_1.strict)(statuses_1.default.empty[204]);
        });
    });
    describe('.message', function () {
        it('should be a map of code to message', function () {
            assert_1.strict.strictEqual(statuses_1.default.message[200], 'OK');
        });
        it('should include codes from Node.js', function () {
            Object.keys(http.STATUS_CODES).forEach(function forEachCode(code) {
                assert_1.strict.ok(statuses_1.default.message[code], 'contains ' + code);
            });
        });
    });
    describe('.redirect', function () {
        it('should be an object', function () {
            assert_1.strict.ok(statuses_1.default.redirect);
            assert_1.strict.strictEqual(typeof statuses_1.default.redirect, 'object');
        });
        it('should include 308', function () {
            (0, assert_1.strict)(statuses_1.default.redirect[308]);
        });
    });
    describe('.retry', function () {
        it('should be an object', function () {
            assert_1.strict.ok(statuses_1.default.retry);
            assert_1.strict.strictEqual(typeof statuses_1.default.retry, 'object');
        });
        it('should include 504', function () {
            (0, assert_1.strict)(statuses_1.default.retry[504]);
        });
    });
});
