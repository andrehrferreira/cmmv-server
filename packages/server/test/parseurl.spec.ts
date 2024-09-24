/**
 * @see https://github.com/pillarjs/parseurl/blob/master/test/test.js
 */

import { strict as assert } from 'assert';
import { parseurl, parseUrlOriginal } from '../utils/parseurl';
const url = require('url');

import * as http from 'node:http';
import * as http2 from 'node:http2';

const URL_EMPTY_VALUE = url.Url ? null : undefined;

type Req = (http.IncomingMessage | http2.Http2ServerRequest) & {
    originalUrl?: string;
    _parsedOriginalUrl?: any;
    _parsedUrl?: any;
    _raw?: string;
};

describe('parseurl(req)', function () {
    it('should parse the request URL', function () {
        const req = createReq('/foo/bar');
        const url = parseurl(req);
        assert.strictEqual(url.host, URL_EMPTY_VALUE);
        assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert.strictEqual(url.href, '/foo/bar');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, URL_EMPTY_VALUE);
        assert.strictEqual(url.query, URL_EMPTY_VALUE);
        assert.strictEqual(url.search, URL_EMPTY_VALUE);
    });

    it('should parse with query string', function () {
        const req = createReq('/foo/bar?fizz=buzz');
        const url = parseurl(req);
        assert.strictEqual(url.host, URL_EMPTY_VALUE);
        assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert.strictEqual(url.href, '/foo/bar?fizz=buzz');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, URL_EMPTY_VALUE);
        assert.strictEqual(url.query, 'fizz=buzz');
        assert.strictEqual(url.search, '?fizz=buzz');
    });

    it('should parse with hash', function () {
        const req = createReq('/foo/bar#bazz');
        const url = parseurl(req);
        assert.strictEqual(url.host, URL_EMPTY_VALUE);
        assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert.strictEqual(url.href, '/foo/bar#bazz');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, URL_EMPTY_VALUE);
        assert.strictEqual(url.query, URL_EMPTY_VALUE);
        assert.strictEqual(url.search, URL_EMPTY_VALUE);
    });

    it('should parse with query string and hash', function () {
        const req = createReq('/foo/bar?fizz=buzz#bazz');
        const url = parseurl(req);
        assert.strictEqual(url.host, URL_EMPTY_VALUE);
        assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert.strictEqual(url.href, '/foo/bar?fizz=buzz#bazz');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, URL_EMPTY_VALUE);
        assert.strictEqual(url.query, 'fizz=buzz');
        assert.strictEqual(url.search, '?fizz=buzz');
    });

    it('should parse a full URL', function () {
        const req = createReq('http://localhost:8888/foo/bar');
        const url = parseurl(req);
        assert.strictEqual(url.host, 'localhost:8888');
        assert.strictEqual(url.hostname, 'localhost');
        assert.strictEqual(url.href, 'http://localhost:8888/foo/bar');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, '8888');
        assert.strictEqual(url.query, URL_EMPTY_VALUE);
        assert.strictEqual(url.search, URL_EMPTY_VALUE);
    });

    it('should not choke on auth-looking URL', function () {
        const req = createReq('//todo@txt');
        assert.strictEqual(parseurl(req).pathname, '//todo@txt');
    });

    it('should return undefined missing url', function () {
        const req = createReq();
        const url = parseurl(req);
        assert.strictEqual(url, undefined);
    });

    describe('when using the same request', function () {
        it('should parse multiple times', function () {
            const req = createReq('/foo/bar');
            assert.strictEqual(parseurl(req).pathname, '/foo/bar');
            assert.strictEqual(parseurl(req).pathname, '/foo/bar');
            assert.strictEqual(parseurl(req).pathname, '/foo/bar');
        });

        it('should reflect url changes', function () {
            const req = createReq('/foo/bar');
            let url = parseurl(req);
            const val = Math.random();

            url._token = val;
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');

            req.url = '/bar/baz';
            url = parseurl(req);
            assert.strictEqual(url._token, undefined);
            assert.strictEqual(parseurl(req).pathname, '/bar/baz');
        });

        it('should cache parsing', function () {
            const req = createReq('/foo/bar');
            let url = parseurl(req);
            const val = Math.random();

            url._token = val;
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');

            url = parseurl(req);
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');
        });

        it('should cache parsing where href does not match', function () {
            const req = createReq('/foo/bar ');
            let url = parseurl(req);
            const val = Math.random();

            url._token = val;
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');

            url = parseurl(req);
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');
        });
    });
});

describe('parseurl.original(req)', function () {
    it('should parse the request original URL', function () {
        const req = createReq('/foo/bar', '/foo/bar');
        const url = parseUrlOriginal(req);
        assert.strictEqual(url.host, URL_EMPTY_VALUE);
        assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert.strictEqual(url.href, '/foo/bar');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, URL_EMPTY_VALUE);
        assert.strictEqual(url.query, URL_EMPTY_VALUE);
        assert.strictEqual(url.search, URL_EMPTY_VALUE);
    });

    it('should parse originalUrl when different', function () {
        const req = createReq('/bar', '/foo/bar');
        const url = parseUrlOriginal(req);
        assert.strictEqual(url.host, URL_EMPTY_VALUE);
        assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert.strictEqual(url.href, '/foo/bar');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, URL_EMPTY_VALUE);
        assert.strictEqual(url.query, URL_EMPTY_VALUE);
        assert.strictEqual(url.search, URL_EMPTY_VALUE);
    });

    it('should parse req.url when originalUrl missing', function () {
        const req = createReq('/foo/bar');
        const url = parseUrlOriginal(req);
        assert.strictEqual(url.host, URL_EMPTY_VALUE);
        assert.strictEqual(url.hostname, URL_EMPTY_VALUE);
        assert.strictEqual(url.href, '/foo/bar');
        assert.strictEqual(url.pathname, '/foo/bar');
        assert.strictEqual(url.port, URL_EMPTY_VALUE);
        assert.strictEqual(url.query, URL_EMPTY_VALUE);
        assert.strictEqual(url.search, URL_EMPTY_VALUE);
    });

    it('should return undefined missing req.url and originalUrl', function () {
        const req = createReq();
        const url = parseUrlOriginal(req);
        assert.strictEqual(url, undefined);
    });

    describe('when using the same request', function () {
        it('should parse multiple times', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            assert.strictEqual(parseUrlOriginal(req).pathname, '/foo/bar');
            assert.strictEqual(parseUrlOriginal(req).pathname, '/foo/bar');
            assert.strictEqual(parseUrlOriginal(req).pathname, '/foo/bar');
        });

        it('should reflect changes', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            let url = parseUrlOriginal(req);
            const val = Math.random();

            url._token = val;
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');

            req.originalUrl = '/bar/baz';
            url = parseUrlOriginal(req);
            assert.strictEqual(url._token, undefined);
            assert.strictEqual(parseUrlOriginal(req).pathname, '/bar/baz');
        });

        it('should cache parsing', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            let url = parseUrlOriginal(req);
            const val = Math.random();

            url._token = val;
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');

            url = parseUrlOriginal(req);
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');
        });

        it('should cache parsing if req.url changes', function () {
            const req = createReq('/foo/bar', '/foo/bar');
            let url = parseUrlOriginal(req);
            const val = Math.random();

            url._token = val;
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');

            req.url = '/baz';
            url = parseUrlOriginal(req);
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');
        });

        it('should cache parsing where href does not match', function () {
            const req = createReq('/foo/bar ', '/foo/bar ');
            let url = parseUrlOriginal(req);
            const val = Math.random();

            url._token = val;
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');

            url = parseUrlOriginal(req);
            assert.strictEqual(url._token, val);
            assert.strictEqual(url.pathname, '/foo/bar');
        });
    });
});

function createReq(url?: string, originalUrl?: string): Req {
    return {
        url: url,
        originalUrl: originalUrl,
    } as Req;
}
