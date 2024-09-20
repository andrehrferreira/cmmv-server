import { strict as assert } from 'assert';

import { CmmvServer } from '..';
import { AddressInfo } from 'net';

describe('app.listen()', function () {
    it('should wrap with an HTTP server', function (done) {
        var app = CmmvServer();

        var server = app.listen(0, () => {
            server.close(done);
        });
    });

    it('should callback on HTTP server errors', function (done) {
        var app1 = CmmvServer();
        var app2 = CmmvServer();

        var server1 = app1.listen(0, err => {
            assert(!err);
            app2.listen((server1.address() as AddressInfo).port, (err: any) => {
                //assert(err.code === 'EADDRINUSE')
                server1.close();
                done();
            });
        });
    });
});
