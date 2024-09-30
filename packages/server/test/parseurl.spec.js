"use strict";
/**
 * @see https://github.com/pillarjs/parseurl/blob/master/test/test.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const parseurl_1 = require("../utils/parseurl");
const url = require('url');
const URL_EMPTY_VALUE = url.Url ? null : undefined;
describe('parseurl(req)', function () {
    it('should parse the request URL', function () {
        const req = createReq('/foo/bar');
        const url = (0, parseurl_1.parseurl)(req);
        assert_1.strict.strictEqual(url.host, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.href, '/foo/bar');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.query, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.search, URL_EMPTY_VALUE);
    });
    it('should parse with query string', function () {
        const req = createReq('/foo/bar?fizz=buzz');
        const url = (0, parseurl_1.parseurl)(req);
        assert_1.strict.strictEqual(url.host, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.href, '/foo/bar?fizz=buzz');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.query, 'fizz=buzz');
        assert_1.strict.strictEqual(url.search, '?fizz=buzz');
    });
    it('should parse with hash', function () {
        const req = createReq('/foo/bar#bazz');
        const url = (0, parseurl_1.parseurl)(req);
        assert_1.strict.strictEqual(url.host, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.href, '/foo/bar#bazz');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.query, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.search, URL_EMPTY_VALUE);
    });
    it('should parse with query string and hash', function () {
        const req = createReq('/foo/bar?fizz=buzz#bazz');
        const url = (0, parseurl_1.parseurl)(req);
        assert_1.strict.strictEqual(url.host, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.href, '/foo/bar?fizz=buzz#bazz');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.query, 'fizz=buzz');
        assert_1.strict.strictEqual(url.search, '?fizz=buzz');
    });
    it('should parse a full URL', function () {
        const req = createReq('http://localhost:8888/foo/bar');
        const url = (0, parseurl_1.parseurl)(req);
        assert_1.strict.strictEqual(url.host, 'localhost:8888');
        assert_1.strict.strictEqual(url.hostname, 'localhost');
        assert_1.strict.strictEqual(url.href, 'http://localhost:8888/foo/bar');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, '8888');
        assert_1.strict.strictEqual(url.query, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.search, URL_EMPTY_VALUE);
    });
    it('should not choke on auth-looking URL', function () {
        const req = createReq('//todo@txt');
        assert_1.strict.strictEqual((0, parseurl_1.parseurl)(req).pathname, '//todo@txt');
    });
    it('should return undefined missing url', function () {
        const req = createReq();
        const url = (0, parseurl_1.parseurl)(req);
        assert_1.strict.strictEqual(url, undefined);
    });
    describe('when using the same request', function () {
        it('should parse multiple times', function () {
            const req = createReq('/foo/bar');
            assert_1.strict.strictEqual((0, parseurl_1.parseurl)(req).pathname, '/foo/bar');
            assert_1.strict.strictEqual((0, parseurl_1.parseurl)(req).pathname, '/foo/bar');
            assert_1.strict.strictEqual((0, parseurl_1.parseurl)(req).pathname, '/foo/bar');
        });
        it('should reflect url changes', function () {
            const req = createReq('/foo/bar');
            let url = (0, parseurl_1.parseurl)(req);
            const val = Math.random();
            url._token = val;
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
            req.url = '/bar/baz';
            url = (0, parseurl_1.parseurl)(req);
            assert_1.strict.strictEqual(url._token, undefined);
            assert_1.strict.strictEqual((0, parseurl_1.parseurl)(req).pathname, '/bar/baz');
        });
        it('should cache parsing', function () {
            const req = createReq('/foo/bar');
            let url = (0, parseurl_1.parseurl)(req);
            const val = Math.random();
            url._token = val;
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
            url = (0, parseurl_1.parseurl)(req);
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        });
        it('should cache parsing where href does not match', function () {
            const req = createReq('/foo/bar ');
            let url = (0, parseurl_1.parseurl)(req);
            const val = Math.random();
            url._token = val;
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
            url = (0, parseurl_1.parseurl)(req);
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        });
    });
});
describe('parseurl.original(req)', function () {
    it('should parse the request original URL', function () {
        const req = createReq('/foo/bar', '/foo/bar');
        const url = (0, parseurl_1.parseUrlOriginal)(req);
        assert_1.strict.strictEqual(url.host, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.href, '/foo/bar');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.query, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.search, URL_EMPTY_VALUE);
    });
    it('should parse originalUrl when different', function () {
        const req = createReq('/bar', '/foo/bar');
        const url = (0, parseurl_1.parseUrlOriginal)(req);
        assert_1.strict.strictEqual(url.host, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.href, '/foo/bar');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.query, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.search, URL_EMPTY_VALUE);
    });
    it('should parse req.url when originalUrl missing', function () {
        const req = createReq('/foo/bar');
        const url = (0, parseurl_1.parseUrlOriginal)(req);
        assert_1.strict.strictEqual(url.host, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.href, '/foo/bar');
        assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        assert_1.strict.strictEqual(url.port, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.query, URL_EMPTY_VALUE);
        assert_1.strict.strictEqual(url.search, URL_EMPTY_VALUE);
    });
    it('should return undefined missing req.url and originalUrl', function () {
        const req = createReq();
        const url = (0, parseurl_1.parseUrlOriginal)(req);
        assert_1.strict.strictEqual(url, undefined);
    });
    describe('when using the same request', function () {
        it('should parse multiple times', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            assert_1.strict.strictEqual((0, parseurl_1.parseUrlOriginal)(req).pathname, '/foo/bar');
            assert_1.strict.strictEqual((0, parseurl_1.parseUrlOriginal)(req).pathname, '/foo/bar');
            assert_1.strict.strictEqual((0, parseurl_1.parseUrlOriginal)(req).pathname, '/foo/bar');
        });
        it('should reflect changes', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            let url = (0, parseurl_1.parseUrlOriginal)(req);
            const val = Math.random();
            url._token = val;
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
            req.originalUrl = '/bar/baz';
            url = (0, parseurl_1.parseUrlOriginal)(req);
            assert_1.strict.strictEqual(url._token, undefined);
            assert_1.strict.strictEqual((0, parseurl_1.parseUrlOriginal)(req).pathname, '/bar/baz');
        });
        it('should cache parsing', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            let url = (0, parseurl_1.parseUrlOriginal)(req);
            const val = Math.random();
            url._token = val;
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
            url = (0, parseurl_1.parseUrlOriginal)(req);
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        });
        it('should cache parsing if req.url changes', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            let url = (0, parseurl_1.parseUrlOriginal)(req);
            const val = Math.random();
            url._token = val;
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
            req.url = '/baz';
            url = (0, parseurl_1.parseUrlOriginal)(req);
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        });
        it('should cache parsing where href does not match', function () {
            const req = createReq('/foo/bar ', '/foo/bar ');
            let url = (0, parseurl_1.parseUrlOriginal)(req);
            const val = Math.random();
            url._token = val;
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
            url = (0, parseurl_1.parseUrlOriginal)(req);
            assert_1.strict.strictEqual(url._token, val);
            assert_1.strict.strictEqual(url.pathname, '/foo/bar');
        });
    });
});
function createReq(url, originalUrl) {
    return {
        url: url,
        originalUrl: originalUrl,
    };
}
