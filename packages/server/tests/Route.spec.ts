import { strict as assert } from 'assert';

import { CmmvServer, Route } from '..';

const methods = require('methods');

describe('Route', function () {
    it('should work without handlers', function (done) {
        const req = { method: 'GET', url: '/' };
        const route = new Route('/foo');
        route.dispatch(req, {}, done);
    });

    it('should not stack overflow with a large sync stack', function (done) {
        this.timeout(5000); // long-running test

        const req = {
            method: 'GET',
            url: '/',
            called: false,
            counter: 0,
        };

        const route = new Route('/foo');

        route.get(function (req, res, next) {
            req.counter = 0;
            next();
        });

        for (let i = 0; i < 6000; i++) {
            route.all(function (req, res, next) {
                req.counter++;
                next();
            });
        }

        route.get(function (req, res, next) {
            req.called = true;
            next();
        });

        route.dispatch(req, {}, function (err) {
            if (err) return done(err);
            assert.ok(req.called);
            assert.strictEqual(req.counter, 6000);
            done();
        });
    });

    describe('.all', function () {
        it('should add handler', function (done) {
            const req = { method: 'GET', url: '/', called: false };
            const route = new Route('/foo');

            route.all(function (req, res, next) {
                req.called = true;
                next();
            });

            route.dispatch(req, {}, function (err) {
                if (err) return done(err);
                assert.ok(req.called);
                done();
            });
        });

        it('should handle VERBS', function (done) {
            let count = 0;
            const route = new Route('/foo');
            const expectedMethods = methods.length;

            const cb = function (err) {
                if (err) return done(err);
                if (count === expectedMethods) {
                    assert.strictEqual(count, expectedMethods);
                    done();
                }
            };

            route.all(function (req, res, next) {
                count++;
                next();
            });

            methods.forEach(function (method) {
                const req = { method: method, url: '/' };
                route.dispatch(req, {}, cb);
            });
        });

        it('should stack', function (done) {
            const req = { count: 0, method: 'GET', url: '/' };
            const route = new Route('/foo');

            route.all(function (req, res, next) {
                req.count++;
                next();
            });

            route.all(function (req, res, next) {
                req.count++;
                next();
            });

            route.dispatch(req, {}, function (err) {
                if (err) return done(err);
                assert.strictEqual(req.count, 2);
                done();
            });
        });
    });
});
