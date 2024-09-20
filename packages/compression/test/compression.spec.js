"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const http = require("node:http");
const zlib = require("node:zlib");
const request = require("supertest");
const index_1 = require("../index");
const server_1 = require("@cmmv/server");
const onHeaders = require('on-headers');
describe('compression()', function () {
    it('should skip HEAD', function (done) {
        const server = createServer({ threshold: 0 }, (req, res) => {
            res.setHeader('Content-Type', 'text/plain');
            res.end('hello, world');
        });
        request(server)
            .head('/')
            .set('Accept-Encoding', 'gzip')
            .expect(shouldNotHaveHeader('Content-Encoding'))
            .expect(200, done);
    });
    it('should skip unknown accept-encoding', function (done) {
        const server = createServer({ threshold: 0 }, function (req, res) {
            res.setHeader('Content-Type', 'text/plain');
            res.end('hello, world');
        });
        request(server)
            .get('/')
            .set('Accept-Encoding', 'bogus')
            .expect(shouldNotHaveHeader('Content-Encoding'))
            .expect(200, done);
    });
    it('should skip if content-encoding already set', function (done) {
        const server = createServer({ threshold: 0 }, function (req, res) {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Encoding', 'x-custom');
            res.end('hello, world');
        });
        request(server)
            .get('/')
            .set('Accept-Encoding', 'gzip')
            .expect('Content-Encoding', 'x-custom')
            .expect(200, 'hello, world', done);
    });
    it('should set Vary', function (done) {
        const server = createServer({ threshold: 0 }, function (req, res) {
            res.setHeader('Content-Type', 'text/plain');
            res.end('hello, world');
        });
        request(server)
            .get('/')
            .set('Accept-Encoding', 'gzip')
            .expect('Content-Encoding', 'gzip')
            .expect('Vary', 'Accept-Encoding', done);
    });
    /*it('should set Vary even if Accept-Encoding is not set', function (done) {
        var server = createServer({ threshold: 1000 }, function (req, res) {
          res.setHeader('Content-Type', 'text/plain')
          res.end('hello, world')
        })
    
        request(server)
          .get('/')
          .expect('Vary', 'Accept-Encoding')
          .expect(shouldNotHaveHeader('Content-Encoding'))
          .expect(200, done)
    })
    
    it('should not set Vary if Content-Type does not pass filter', function (done) {
        var server = createServer(null, function (req, res) {
            res.setHeader('Content-Type', 'image/jpeg')
            res.end()
        })

        request(server)
            .get('/')
            .expect(shouldNotHaveHeader('Vary'))
            .expect(200, done)
    })*/
});
function createServer(opts, fn) {
    const _compression = (0, index_1.default)(opts);
    return http.createServer(async (req, res) => {
        const request = new server_1.Request(null, req, res, null);
        const response = new server_1.Response(null, req, res);
        await fn(request, response);
        let callFn = false;
        await _compression.process(request, response, () => {
            callFn = true;
            res.writeHead(200);
            res.end(response.buffer);
        });
        if (!callFn)
            fn(req, res);
        return;
    });
}
function shouldHaveBodyLength(length) {
    return function (res) {
        assert_1.strict.strictEqual(res.text.length, length, 'should have body length of ' + length);
    };
}
function shouldNotHaveHeader(header) {
    return function (res) {
        assert_1.strict.ok(!(header.toLowerCase() in res.headers), 'should not have header ' + header);
    };
}
function writeAndFlush(stream, count, buf) {
    let writes = 0;
    return function () {
        if (writes++ >= count)
            return;
        if (writes === count)
            return stream.end(buf);
        stream.write(buf);
        stream.flush();
    };
}
function unchunk(encoding, onchunk, onend) {
    return function (res) {
        let stream;
        assert_1.strict.strictEqual(res.headers['content-encoding'], encoding);
        switch (encoding) {
            case 'deflate':
                stream = res.pipe(zlib.createInflate());
                break;
            case 'gzip':
                stream = res.pipe(zlib.createGunzip());
                break;
        }
        stream.on('data', onchunk);
        stream.on('end', onend);
    };
}
