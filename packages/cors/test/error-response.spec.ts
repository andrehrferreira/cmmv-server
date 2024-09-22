/**
 * @see https://github.com/expressjs/cors/blob/master/test/error-response.js
 */

(function () {
    'use strict';

    var cmmv = require('@cmmv/server').default,
        supertest = require('supertest'),
        cors = require('..').default;

    var app;

    /* -------------------------------------------------------------------------- */

    app = cmmv();
    app.use(cors());

    app.post('/five-hundred', function (req, res, next) {
        next(new Error('nope'));
    });

    app.post('/four-oh-one', function (req, res, next) {
        next(new Error('401'));
    });

    app.post('/four-oh-four', function (req, res, next) {
        next();
    });

    app.use(function (err, req, res, next) {
        if (err.message === '401') res.status(401).send('unauthorized');
        else next(err);
    });

    /* -------------------------------------------------------------------------- */

    /*describe('error response', function () {
        it('500', function (done) {
            supertest(app.socket)
              .post('/five-hundred')
              .expect(500)
              .expect('Access-Control-Allow-Origin', '*')
              .expect(/Error: nope/)
              .end(done)
        });

        it('401', function (done) {
            supertest(app.socket)
              .post('/four-oh-one')
              .expect(401)
              .expect('Access-Control-Allow-Origin', '*')
              .expect('unauthorized')
              .end(done)
        });

        it('404', function (done) {
            supertest(app.socket)
              .post('/four-oh-four')
              .expect(404)
              .expect('Access-Control-Allow-Origin', '*')
              .end(done)
        });
    });*/
})();
