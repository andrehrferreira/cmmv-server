"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const __1 = require("..");
describe('app', function () {
    describe('.locals', function () {
        it('should default object with null prototype', function () {
            var app = (0, __1.CmmvServer)();
            assert_1.strict.ok(app.locals);
            assert_1.strict.strictEqual(typeof app.locals, 'object');
            //assert.strictEqual(Object.getPrototypeOf(app.locals), null)
        });
        describe('.settings', function () {
            it('should contain app settings ', function () {
                var app = (0, __1.CmmvServer)();
                app.set('title', 'CMMV');
                assert_1.strict.ok(app.locals.settings);
                assert_1.strict.strictEqual(typeof app.locals.settings, 'object');
                assert_1.strict.strictEqual(app.locals.settings, app.settings);
                assert_1.strict.strictEqual(app.locals.settings.title, 'CMMV');
            });
        });
    });
});
