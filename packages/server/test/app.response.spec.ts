/**
 * @see https://github.com/expressjs/express/blob/master/test/app.response.js
 */

import * as request from 'supertest';

import cmmv from '..';

const after = require('after');

describe('app', function () {
    /*describe('.response', function () {
        it('should extend the response prototype', function (done) {
            const app = cmmv();

            app.response.shout = function (str) {
                this.send(str.toUpperCase());
            };

            app.use(function (req, res) {
                res.shout('hey');
            });

            request(app.socket).get('/').expect('HEY', done);
        });
    });

    it('should only extend for the referenced app', function (done) {
        var app1 = CmmvServer()
        var app2 = CmmvServer()
        var cb = after(2, done)
  
        app1.response.shout = function (str) {
            this.send(str.toUpperCase())
        }
  
        app1.get('/', function (req, res: any) {
            res.shout('foo')
        })
  
        app2.get('/', function (req, res: any) {
            res.shout('foo')
        })
  
        request(app1.socket)
            .get('/')
            .expect(200, 'FOO', cb)
  
        request(app2.socket)
            .get('/')
            .expect(500, /(?:not a function|has no method)/, cb)
    });

    it('should inherit to sub apps', function (done) {
        var app1 = CmmvServer()
        var app2 = CmmvServer()
        var cb = after(2, done)
  
        app1.response.shout = function (str) {
          this.send(str.toUpperCase())
        }
  
        app1.use('/sub', app2)
  
        app1.get('/', function (req, res: any) {
          res.shout('foo')
        })
  
        app2.get('/', function (req, res: any) {
          res.shout('foo')
        })
  
        request(app1.socket)
          .get('/')
          .expect(200, 'FOO', cb)
  
        request(app1.socket)
          .get('/sub')
          .expect(200, 'FOO', cb)
    });

    it('should allow sub app to override', function (done) {
        var app1 = CmmvServer()
        var app2 = CmmvServer()
        var cb = after(2, done)
  
        app1.response.shout = function (str) {
          this.send(str.toUpperCase())
        }
  
        app2.response.shout = function (str) {
            this.send(str + '!')
        }
  
        app1.use('/sub', app2)
  
        app1.get('/', function (req, res: any) {
            res.shout('foo')
        });
  
        app2.get('/', function (req, res: any) {
            res.shout('foo')
        });
  
        request(app1.socket)
            .get('/')
            .expect(200, 'FOO', cb)
  
        request(app1.socket)
            .get('/sub')
            .expect(200, 'foo!', cb)
    });

    it('should not pollute parent app', function (done) {
        var app1 = CmmvServer()
        var app2 = CmmvServer()
        var cb = after(2, done)
  
        app1.response.shout = function (str) {
            this.send(str.toUpperCase())
        }
  
        app2.response.shout = function (str) {
            this.send(str + '!')
        }
  
        app1.use('/sub', app2)
  
        app1.get('/sub/foo', function (req, res: any) {
            res.shout('foo')
        })
  
        app2.get('/', function (req, res: any) {
            res.shout('foo')
        })
  
        request(app1.socket)
          .get('/sub')
          .expect(200, 'foo!', cb)
  
        request(app1.socket)
          .get('/sub/foo')
          .expect(200, 'FOO', cb)
    });*/
});
