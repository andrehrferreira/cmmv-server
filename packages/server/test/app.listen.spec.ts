/**
 * @see https://github.com/expressjs/express/blob/master/test/app.listen.js
 */

import { strict as assert } from 'assert';

import cmmv from '..';
import { AddressInfo } from 'net';

describe('app.listen()', function () {
    it('should wrap with an HTTP server', function (done) {
        const app = cmmv();

        const server = app.listen(0, () => {
            server.close(done);
        });
    });

    /*it('should callback on HTTP server errors', function (done) {
        const app1 = CmmvServer();
        const app2 = CmmvServer();

        const server1 = app1.listen(0, err => {
            assert(!err);
            app2.listen((server1.address() as AddressInfo).port, (err: any) => {
                assert(err.code === 'EADDRINUSE');
                server1.close();
                done();
            });
        });
    });*/
});
