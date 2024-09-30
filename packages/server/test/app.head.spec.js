"use strict";
/**
 * @see https://github.com/expressjs/express/blob/master/test/app.head.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const request = require("supertest");
const __1 = require("..");
describe('HEAD', function () {
    it('should default to GET', function (done) {
        const app = (0, __1.default)();
        app.get('/tobi', function (req, res) {
            // send() detects HEAD
            res.send('tobi');
        });
        request(app.socket).head('/tobi').expect(200, done);
    });
    it('should output the same headers as GET requests', function (done) {
        const app = (0, __1.default)();
        app.get('/tobi', function (req, res) {
            // send() detects HEAD
            res.send('tobi');
        });
        request(app.socket)
            .head('/tobi')
            .expect(200, function (err, res) {
            if (err)
                return done(err);
            const headers = res.headers;
            request(app.socket)
                .get('/tobi')
                .expect(200, function (err, res) {
                if (err)
                    return done(err);
                delete headers.date;
                delete headers['req-uuid'];
                delete headers['transfer-encoding'];
                delete res.headers.date;
                delete res.headers['req-uuid'];
                delete res.headers['transfer-encoding'];
                assert_1.strict.deepEqual(res.headers, headers);
                done();
            });
        });
    });
});
describe('app.head()', function () {
    it('should override', function (done) {
        const app = (0, __1.default)();
        app.head('/tobi', function (req, res) {
            res.header('x-method', 'head');
            res.end();
        });
        app.get('/tobi', function (req, res) {
            res.header('x-method', 'get');
            res.send('tobi');
        });
        request(app.socket)
            .head('/tobi')
            .expect('x-method', 'head')
            .expect(200, done);
    });
});
