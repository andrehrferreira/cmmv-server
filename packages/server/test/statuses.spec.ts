/**
 * @see https://github.com/jshttp/statuses/blob/master/test/test.js
 */

import { strict as assert } from 'assert';

import * as http from 'node:http';

import { default as status } from '../utils/statuses';

describe('status', function () {
    describe('arguments', function () {
        describe('code', function () {
            it('should accept a number', function () {
                assert.strictEqual(status(200), 'OK');
            });

            it('should accept a string', function () {
                assert.strictEqual(status('OK'), 200);
            });

            it('should accept a string number', function () {
                assert.strictEqual(status('200'), 'OK');
            });
        });
    });

    describe('when given a number', function () {
        it('should return message when a valid status code', function () {
            assert.strictEqual(status(200), 'OK');
            assert.strictEqual(status(404), 'Not Found');
            assert.strictEqual(status(500), 'Internal Server Error');
        });

        it('should throw for invalid status code', function () {
            assert.throws(status.bind(null, 0), /invalid status code/);
            assert.throws(status.bind(null, 1000), /invalid status code/);
        });

        it('should throw for unknown status code', function () {
            assert.throws(status.bind(null, 299), /invalid status code/);
            assert.throws(status.bind(null, 310), /invalid status code/);
        });

        it('should throw for discontinued status code', function () {
            assert.throws(status.bind(null, 306), /invalid status code/);
        });
    });

    describe('when given a string', function () {
        it('should return message when a valid status code', function () {
            assert.strictEqual(status('200'), 'OK');
            assert.strictEqual(status('404'), 'Not Found');
            assert.strictEqual(status('500'), 'Internal Server Error');
        });

        it('should be truthy when a valid status message', function () {
            assert.ok(status('OK'));
            assert.ok(status('Not Found'));
            assert.ok(status('Internal Server Error'));
        });

        it('should be case insensitive', function () {
            assert.ok(status('Ok'));
            assert.ok(status('not found'));
            assert.ok(status('INTERNAL SERVER ERROR'));
        });

        it('should throw for unknown status message', function () {
            assert.throws(
                status.bind(null, 'too many bugs'),
                /invalid status message/,
            );
            assert.throws(
                status.bind(null, 'constructor'),
                /invalid status message/,
            );
            assert.throws(
                status.bind(null, '__proto__'),
                /invalid status message/,
            );
        });

        it('should throw for unknown status code', function () {
            assert.throws(status.bind(null, '299'), /invalid status code/);
        });
    });

    describe('.codes', function () {
        it('should include codes from Node.js', function () {
            Object.keys(http.STATUS_CODES).forEach(function forEachCode(code) {
                assert.notStrictEqual(
                    status.codes.indexOf(Number(code)),
                    -1,
                    'contains ' + code,
                );
            });
        });
    });

    describe('.empty', function () {
        it('should be an object', function () {
            assert.ok(status.empty);
            assert.strictEqual(typeof status.empty, 'object');
        });

        it('should include 204', function () {
            assert(status.empty[204]);
        });
    });

    describe('.message', function () {
        it('should be a map of code to message', function () {
            assert.strictEqual(status.message[200], 'OK');
        });

        it('should include codes from Node.js', function () {
            Object.keys(http.STATUS_CODES).forEach(function forEachCode(code) {
                assert.ok(status.message[code], 'contains ' + code);
            });
        });
    });

    describe('.redirect', function () {
        it('should be an object', function () {
            assert.ok(status.redirect);
            assert.strictEqual(typeof status.redirect, 'object');
        });

        it('should include 308', function () {
            assert(status.redirect[308]);
        });
    });

    describe('.retry', function () {
        it('should be an object', function () {
            assert.ok(status.retry);
            assert.strictEqual(typeof status.retry, 'object');
        });

        it('should include 504', function () {
            assert(status.retry[504]);
        });
    });
});
