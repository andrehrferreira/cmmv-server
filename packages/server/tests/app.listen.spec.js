"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const __1 = require("..");
describe('app.listen()', function () {
    it('should wrap with an HTTP server', function (done) {
        var app = (0, __1.CmmvServer)();
        var server = app.listen(0, () => {
            server.close(done);
        });
    });
    it('should callback on HTTP server errors', function (done) {
        var app1 = (0, __1.CmmvServer)();
        var app2 = (0, __1.CmmvServer)();
        var server1 = app1.listen(0, (err) => {
            (0, assert_1.strict)(!err);
            app2.listen(server1.address().port, (err) => {
                //assert(err.code === 'EADDRINUSE')
                server1.close();
                done();
            });
        });
    });
});
