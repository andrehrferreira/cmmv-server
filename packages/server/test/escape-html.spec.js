"use strict";
/**
 * @see https://github.com/component/escape-html/blob/master/test/index.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const utils_1 = require("../utils");
describe('escapeHtml(string)', function () {
    describe('when string is undefined', function () {
        it('should return "undefined"', function () {
            assert_1.strict.strictEqual((0, utils_1.escapeHtml)(undefined), 'undefined');
        });
    });
    describe('when string is null', function () {
        it('should return "null"', function () {
            assert_1.strict.strictEqual((0, utils_1.escapeHtml)(null), 'null');
        });
    });
    describe('when string is a number', function () {
        it('should return stringified number', function () {
            assert_1.strict.strictEqual((0, utils_1.escapeHtml)(42), '42');
        });
    });
    describe('when string is an object', function () {
        it('should return "[object Object]"', function () {
            assert_1.strict.strictEqual((0, utils_1.escapeHtml)({}), '[object Object]');
        });
    });
    describe("when string contains '\"'", function () {
        describe('as only character', function () {
            it('should replace with "&quot;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('"'), '&quot;');
            });
        });
        describe('as first character', function () {
            it('should replace with "&quot;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('"bar'), '&quot;bar');
            });
        });
        describe('as last character', function () {
            it('should replace with "&quot;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo"'), 'foo&quot;');
            });
        });
        describe('as middle character', function () {
            it('should replace with "&quot;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo"bar'), 'foo&quot;bar');
            });
        });
        describe('multiple times', function () {
            it('should replace all occurrances with "&quot;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo""bar'), 'foo&quot;&quot;bar');
            });
        });
    });
    describe('when string contains "&"', function () {
        describe('as only character', function () {
            it('should replace with "&amp;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('&'), '&amp;');
            });
        });
        describe('as first character', function () {
            it('should replace with "&amp;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('&bar'), '&amp;bar');
            });
        });
        describe('as last character', function () {
            it('should replace with "&amp;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo&'), 'foo&amp;');
            });
        });
        describe('as middle character', function () {
            it('should replace with "&amp;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo&bar'), 'foo&amp;bar');
            });
        });
        describe('multiple times', function () {
            it('should replace all occurrances with "&amp;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo&&bar'), 'foo&amp;&amp;bar');
            });
        });
    });
    describe('when string contains "\'"', function () {
        describe('as only character', function () {
            it('should replace with "&#39;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)("'"), '&#39;');
            });
        });
        describe('as first character', function () {
            it('should replace with "&#39;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)("'bar"), '&#39;bar');
            });
        });
        describe('as last character', function () {
            it('should replace with "&#39;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)("foo'"), 'foo&#39;');
            });
        });
        describe('as middle character', function () {
            it('should replace with "&#39;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)("foo'bar"), 'foo&#39;bar');
            });
        });
        describe('multiple times', function () {
            it('should replace all occurrances with "&#39;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)("foo''bar"), 'foo&#39;&#39;bar');
            });
        });
    });
    describe('when string contains "<"', function () {
        describe('as only character', function () {
            it('should replace with "&lt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('<'), '&lt;');
            });
        });
        describe('as first character', function () {
            it('should replace with "&lt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('<bar'), '&lt;bar');
            });
        });
        describe('as last character', function () {
            it('should replace with "&lt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo<'), 'foo&lt;');
            });
        });
        describe('as middle character', function () {
            it('should replace with "&lt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo<bar'), 'foo&lt;bar');
            });
        });
        describe('multiple times', function () {
            it('should replace all occurrances with "&lt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo<<bar'), 'foo&lt;&lt;bar');
            });
        });
    });
    describe('when string contains ">"', function () {
        describe('as only character', function () {
            it('should replace with "&gt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('>'), '&gt;');
            });
        });
        describe('as first character', function () {
            it('should replace with "&gt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('>bar'), '&gt;bar');
            });
        });
        describe('as last character', function () {
            it('should replace with "&gt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo>'), 'foo&gt;');
            });
        });
        describe('as middle character', function () {
            it('should replace with "&gt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo>bar'), 'foo&gt;bar');
            });
        });
        describe('multiple times', function () {
            it('should replace all occurrances with "&gt;"', function () {
                assert_1.strict.strictEqual((0, utils_1.escapeHtml)('foo>>bar'), 'foo&gt;&gt;bar');
            });
        });
    });
    describe('when escaped character mixed', function () {
        it('should escape all occurrances', function () {
            assert_1.strict.strictEqual((0, utils_1.escapeHtml)('&foo <> bar "fizz" l\'a'), '&amp;foo &lt;&gt; bar &quot;fizz&quot; l&#39;a');
        });
    });
});
