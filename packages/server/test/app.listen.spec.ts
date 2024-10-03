/**
 * @see https://github.com/expressjs/express/blob/master/test/app.listen.js
 */

import { strict as assert } from 'assert';

import cmmv from '..';
import { AddressInfo } from 'net';

describe('app.listen()', function () {
    it('should wrap with an HTTP server', function (done) {
        const app = cmmv();

        app.listen({ port: 0 }).then(server => {
            server.close(done);
        });
    });

    /*it('should callback on HTTP server errors', function (done) {
        const app1 = cmmv();
        const app2 = cmmv();

        app1.listen({ port: 0 }).then((server) => {
            app2.listen({ 
                port: (server.address() as AddressInfo).port 
            }).then((server) => {
                console.log((server.address() as AddressInfo).port );
            }).catch((err) => {
                console.log(err);
                assert(err.code === 'EADDRINUSE');
                server.close();
                done();
            });
        });
    });*/
});
