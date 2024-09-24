/**
 * @see https://github.com/expressjs/express/blob/master/test/app.options.js
 */

import { strict as assert } from 'assert';

import * as request from 'supertest';

import { CmmvServer, Router } from '..';

describe('OPTIONS', function () {
    it('should default to the routes defined', function (done) {
        const app = CmmvServer();

        app.post('/', function () {});
        app.get('/users', function (req, res) {});
        app.put('/users', function (req, res) {});

        request(app.socket)
            .options('/users')
            .expect('Allow', 'GET, HEAD, PUT')
            .expect(200, 'GET, HEAD, PUT', done);
    });

    it('should only include each method once', function (done) {
        const app = CmmvServer();

        app.delete('/', function () {});
        app.get('/users', function (req, res) {});
        app.put('/users', function (req, res) {});
        app.get('/users', function (req, res) {});

        request(app.socket)
            .options('/users')
            .expect('Allow', 'GET, HEAD, PUT')
            .expect(200, 'GET, HEAD, PUT', done);
    });

    it('should not be affected by app.all', function (done) {
        const app = CmmvServer();

        app.get('/', function () {});
        app.get('/users', function (req, res) {});
        app.put('/users', function (req, res) {});
        app.all('/users', function (req, res, next) {
            res.setHeader('x-hit', '1');
            next();
        });

        request(app.socket)
            .options('/users')
            .expect('x-hit', '1')
            .expect('Allow', 'GET, HEAD, PUT')
            .expect(200, 'GET, HEAD, PUT', done);
    });

    it('should not respond if the path is not defined', function (done) {
        const app = CmmvServer();

        app.get('/users', function (req, res) {});

        request(app.socket).options('/other').expect(404, done);
    });

    it('should forward requests down the middleware chain', function (done) {
        const app = CmmvServer();
        const router = new Router();

        router.get('/users', function (req, res) {});
        app.use(router);
        app.get('/other', function (req, res) {});

        request(app.socket)
            .options('/other')
            .expect('Allow', 'GET, HEAD')
            .expect(200, 'GET, HEAD', done);
    });

    /*describe('when error occurs in response handler', function () {
        it('should pass error to callback', function (done) {
            const app = CmmvServer();
            const router = new Router();
    
            router.get('/users', function(req, res){});
    
            app.use(function (req, res, next) {
                res.writeHead(200);
                next();
            });
            app.use(router);
            app.use(function (err, req, res, next) {
                res.end('true');
            });
    
            request(app.socket)
                .options('/users')
                .expect(200, 'true', done)
        })
    })*/
});

describe('app.options()', function () {
    it('should override the default behavior', function (done) {
        const app = CmmvServer();

        app.options('/users', function (req, res) {
            res.set('Allow', 'GET');
            res.send('GET');
        });

        app.get('/users', function (req, res) {});
        app.put('/users', function (req, res) {});

        request(app.socket)
            .options('/users')
            .expect('GET')
            .expect('Allow', 'GET', done);
    });
});
