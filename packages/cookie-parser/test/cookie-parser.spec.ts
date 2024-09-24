/**
 * @see https://github.com/expressjs/cookie-parser
 */

import { strict as assert } from 'assert';

import * as http from 'node:http';
import * as request from 'supertest';

import {
    default as cookieParser,
    sign,
    JSONCookies,
    JSONCookie,
    signedCookie,
    signedCookies,
} from '..';

describe('cookieParser()', function () {
    it('should export JSONCookies function', function () {
        assert(typeof JSONCookies, 'function');
    });

    describe('when no cookies are sent', function () {
        it('should default req.cookies to {}', function (done) {
            request(createServer('keyboard cat'))
                .get('/')
                .expect(200, '{}', done);
        });

        it('should default req.signedCookies to {}', function (done) {
            request(createServer('keyboard cat'))
                .get('/signed')
                .expect(200, '{}', done);
        });
    });

    describe('when cookies are sent', function () {
        it('should populate req.cookies', function (done) {
            request(createServer('keyboard cat'))
                .get('/')
                .set('Cookie', 'foo=bar; bar=baz')
                .expect(200, '{"foo":"bar","bar":"baz"}', done);
        });

        it('should inflate JSON cookies', function (done) {
            request(createServer('keyboard cat'))
                .get('/')
                .set('Cookie', 'foo=j:{"foo":"bar"}')
                .expect(200, '{"foo":{"foo":"bar"}}', done);
        });

        it('should not inflate invalid JSON cookies', function (done) {
            request(createServer('keyboard cat'))
                .get('/')
                .set('Cookie', 'foo=j:{"foo":')
                .expect(200, '{"foo":"j:{\\"foo\\":"}', done);
        });
    });

    describe('when req.cookies exists', function () {
        it('should do nothing', function (done) {
            const _parser: any = cookieParser({ express: true });

            const server = http.createServer(function (req: any, res) {
                req.cookies = { fizz: 'buzz' };
                _parser(req, res, function (err) {
                    if (err) {
                        res.statusCode = 500;
                        res.end(err.message);
                        return;
                    }

                    res.end(JSON.stringify(req.cookies));
                });
            });

            request(server)
                .get('/')
                .set('Cookie', 'foo=bar; bar=baz')
                .expect(200, '{"fizz":"buzz"}', done);
        });
    });

    describe('when a secret is given', function () {
        const val = sign('foobarbaz', 'keyboard cat');
        // TODO: "bar" fails...

        it('should populate req.signedCookies', function (done) {
            request(createServer('keyboard cat'))
                .get('/signed')
                .set('Cookie', 'foo=s:' + val)
                .expect(200, '{"foo":"foobarbaz"}', done);
        });

        it('should remove the signed value from req.cookies', function (done) {
            request(createServer('keyboard cat'))
                .get('/')
                .set('Cookie', 'foo=s:' + val)
                .expect(200, '{}', done);
        });

        it('should omit invalid signatures', function (done) {
            const server = createServer('keyboard cat');

            request(server)
                .get('/signed')
                .set('Cookie', 'foo=' + val + '3')
                .expect(200, '{}', function (err) {
                    if (err) return done(err);

                    request(server)
                        .get('/')
                        .set('Cookie', 'foo=' + val + '3')
                        .expect(
                            200,
                            '{"foo":"foobarbaz.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3"}',
                            done,
                        );
                });
        });
    });

    describe('when multiple secrets are given', function () {
        it('should populate req.signedCookies', function (done) {
            request(createServer(['keyboard cat', 'nyan cat']))
                .get('/signed')
                .set(
                    'Cookie',
                    'buzz=s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE; fizz=s:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88',
                )
                .expect(200, '{"buzz":"foobar","fizz":"foobar"}', done);
        });
    });

    describe('when no secret is given', function () {
        let server;

        before(function () {
            server = createServer();
        });

        it('should populate req.cookies', function (done) {
            request(server)
                .get('/')
                .set('Cookie', 'foo=bar; bar=baz')
                .expect(200, '{"foo":"bar","bar":"baz"}', done);
        });

        it('should not populate req.signedCookies', function (done) {
            const val = sign('foobarbaz', 'keyboard cat');
            request(server)
                .get('/signed')
                .set('Cookie', 'foo=s:' + val)
                .expect(200, '{}', done);
        });
    });
});

describe('cookieParser.JSONCookie(str)', function () {
    it('should return undefined for non-string arguments', function () {
        assert.strictEqual(JSONCookie(), undefined);
        assert.strictEqual(JSONCookie(undefined), undefined);
        assert.strictEqual(JSONCookie(null), undefined);
        assert.strictEqual(JSONCookie(42), undefined);
        assert.strictEqual(JSONCookie({}), undefined);
        assert.strictEqual(JSONCookie([]), undefined);
        assert.strictEqual(
            JSONCookie(function () {}),
            undefined,
        );
    });

    it('should return undefined for non-JSON cookie string', function () {
        assert.strictEqual(JSONCookie(''), undefined);
        assert.strictEqual(JSONCookie('foo'), undefined);
        assert.strictEqual(JSONCookie('{}'), undefined);
    });

    it('should return object for JSON cookie string', function () {
        assert.deepEqual(JSONCookie('j:{"foo":"bar"}'), { foo: 'bar' });
    });

    it('should return undefined on invalid JSON', function () {
        assert.strictEqual(JSONCookie('j:{foo:"bar"}'), undefined);
    });
});

describe('cookieParser.signedCookie(str, secret)', function () {
    it('should return undefined for non-string arguments', function () {
        assert.strictEqual(signedCookie(undefined, 'keyboard cat'), undefined);
        assert.strictEqual(signedCookie(null, 'keyboard cat'), undefined);
        assert.strictEqual(signedCookie(42, 'keyboard cat'), undefined);
        assert.strictEqual(signedCookie({}, 'keyboard cat'), undefined);
        assert.strictEqual(signedCookie([], 'keyboard cat'), undefined);
        assert.strictEqual(
            signedCookie(function () {}, 'keyboard cat'),
            undefined,
        );
    });

    it('should pass through non-signed string', function () {
        assert.strictEqual(signedCookie('', 'keyboard cat'), '');
        assert.strictEqual(signedCookie('foo', 'keyboard cat'), 'foo');
        assert.strictEqual(signedCookie('j:{}', 'keyboard cat'), 'j:{}');
    });

    it('should return false for tampered signed string', function () {
        assert.strictEqual(
            signedCookie(
                's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
                'keyboard cat',
            ),
            false,
        );
    });

    it('should return unsigned value for signed string', function () {
        assert.strictEqual(
            signedCookie(
                's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
                'keyboard cat',
            ),
            'foobar',
        );
    });

    describe('when secret is an array', function () {
        it('should return false for tampered signed string', function () {
            assert.strictEqual(
                signedCookie(
                    's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
                    ['keyboard cat', 'nyan cat'],
                ),
                false,
            );
        });

        it('should return unsigned value for first secret', function () {
            assert.strictEqual(
                signedCookie(
                    's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
                    ['keyboard cat', 'nyan cat'],
                ),
                'foobar',
            );
        });

        it('should return unsigned value for second secret', function () {
            assert.strictEqual(
                signedCookie(
                    's:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88',
                    ['keyboard cat', 'nyan cat'],
                ),
                'foobar',
            );
        });
    });
});

describe('cookieParser.signedCookies(obj, secret)', function () {
    it('should ignore non-signed strings', function () {
        assert.deepEqual(signedCookies({}, 'keyboard cat'), {});
        assert.deepEqual(signedCookies({ foo: 'bar' }, 'keyboard cat'), {});
    });

    it('should include tampered strings as false', function () {
        assert.deepEqual(
            signedCookies(
                { foo: 's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE' },
                'keyboard cat',
            ),
            {
                foo: false,
            },
        );
    });

    it('should include unsigned strings', function () {
        assert.deepEqual(
            signedCookies(
                { foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE' },
                'keyboard cat',
            ),
            {
                foo: 'foobar',
            },
        );
    });

    it('should remove signed strings from original object', function () {
        const obj = {
            foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
        };

        assert.deepEqual(signedCookies(obj, 'keyboard cat'), { foo: 'foobar' });
        assert.deepEqual(obj, {});
    });

    it('should remove tampered strings from original object', function () {
        const obj = {
            foo: 's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
        };

        assert.deepEqual(signedCookies(obj, 'keyboard cat'), { foo: false });
        assert.deepEqual(obj, {});
    });

    it('should leave unsigned string in original object', function () {
        const obj = {
            fizz: 'buzz',
            foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
        };

        assert.deepEqual(signedCookies(obj, 'keyboard cat'), { foo: 'foobar' });
        assert.deepEqual(obj, { fizz: 'buzz' });
    });

    describe('when secret is an array', function () {
        it('should include unsigned strings for matching secrets', function () {
            const obj = {
                buzz: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
                fizz: 's:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88',
            };

            assert.deepEqual(signedCookies(obj, ['keyboard cat']), {
                buzz: 'foobar',
                fizz: false,
            });
        });

        it('should include unsigned strings for all secrets', function () {
            const obj = {
                buzz: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
                fizz: 's:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88',
            };

            assert.deepEqual(signedCookies(obj, ['keyboard cat', 'nyan cat']), {
                buzz: 'foobar',
                fizz: 'foobar',
            });
        });
    });
});

function createServer(secret?) {
    const _parser: any = cookieParser({ secret, express: true });

    return http.createServer(function (req: any, res) {
        _parser(req, res, function (err) {
            if (err) {
                res.statusCode = 500;
                res.end(err.message);
                return;
            }

            const cookies =
                req.url === '/signed' ? req.signedCookies : req.cookies;

            res.end(JSON.stringify(cookies));
        });
    });
}
