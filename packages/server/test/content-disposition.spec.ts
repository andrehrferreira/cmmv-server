/**
 * @see https://github.com/jshttp/content-disposition/blob/master/test/test.js
 */

import { strict as assert } from 'assert';

import { contentDisposition } from '../utils';

describe('contentDisposition()', function () {
    it('should create an attachment header', function () {
        assert.strictEqual(contentDisposition(), 'attachment');
    });
});

describe('contentDisposition(filename)', function () {
    it('should create a header with file name', function () {
        assert.strictEqual(
            contentDisposition('plans.pdf'),
            'attachment; filename="plans.pdf"',
        );
    });

    it('should use the basename of the string', function () {
        assert.strictEqual(
            contentDisposition('/path/to/plans.pdf'),
            'attachment; filename="plans.pdf"',
        );
    });

    describe('when "filename" is US-ASCII', function () {
        it('should only include filename parameter', function () {
            assert.strictEqual(
                contentDisposition('plans.pdf'),
                'attachment; filename="plans.pdf"',
            );
        });

        it('should escape quotes', function () {
            assert.strictEqual(
                contentDisposition('the "plans".pdf'),
                'attachment; filename="the \\"plans\\".pdf"',
            );
        });
    });
});
