import { strict as assert } from 'assert';

import { CmmvServer } from '..';

describe('app', function () {
    describe('.locals', function () {
        it('should default object with null prototype', function () {
            var app = CmmvServer();
            assert.ok(app.locals);
            assert.strictEqual(typeof app.locals, 'object');
            //assert.strictEqual(Object.getPrototypeOf(app.locals), null)
        });

        describe('.settings', function () {
            it('should contain app settings ', function () {
                var app = CmmvServer();
                app.set('title', 'CMMV');
                assert.ok(app.locals.settings);
                assert.strictEqual(typeof app.locals.settings, 'object');
                assert.strictEqual(app.locals.settings, app.settings);
                assert.strictEqual(app.locals.settings.title, 'CMMV');
            });
        });
    });
});
