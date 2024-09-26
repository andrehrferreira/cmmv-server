/**
 * @see https://github.com/expressjs/express/blob/master/test/app.use.js
 */

import { strict as assert } from 'assert';

import * as request from 'supertest';

import cmmv from '..';

const methods = require('methods');
const after = require('after');

describe('app', function () {
    it('should emit "mount" when mounted', function (done) {
        const blog = cmmv(),
            app = cmmv();

        blog.on('mount', function (arg) {
            assert.strictEqual(arg, app);
            done();
        });

        app.use(blog);
    });

    describe('.use(app)', function () {
        /*it('should mount the app', function(done){
            const blog = CmmvServer()
            , app = CmmvServer();
    
            blog.get('/blog', function(req, res){
                res.end('blog');
            });
        
            app.use(blog);
        
            request(app.socket)
                .get('/blog')
                .expect('blog', done);
        })
    
        it('should support mount-points', function(done){
            const blog = CmmvServer()
                , forum = CmmvServer()
                , app = CmmvServer();

            var cb = after(2, done)
        
            blog.get('/', function(req, res){
                res.end('blog');
            });
        
            forum.get('/', function(req, res){
                res.end('forum');
            });
        
            app.use('/blog', blog);
            app.use('/forum', forum);
        
            request(app.socket)
                .get('/blog')
                .expect(200, 'blog', cb)
        
            request(app.socket)
                .get('/forum')
                .expect(200, 'forum', cb)
        })
    
        it('should set the child\'s .parent', function(){
            const blog = CmmvServer()
                , app = CmmvServer();
        
            app.use('/blog', blog);
            assert.strictEqual(blog.parent, app)
        })
    
        it('should support dynamic routes', function(done){
            const blog = CmmvServer()
                , app = CmmvServer();
        
            blog.get('/', function(req, res){
                res.end('success');
            });
        
            app.use('/post/:article', blog);
        
            request(app.socket)
                .get('/post/once-upon-a-time')
                .expect('success', done);
        })
    
        it('should support mounted app anywhere', function(done){
            const cb = after(3, done);
            const blog = CmmvServer()
                , other = CmmvServer()
                , app = CmmvServer();
        
            function fn1(req, res, next) {
                res.setHeader('x-fn-1', 'hit');
                next();
            }
        
            function fn2(req, res, next) {
                res.setHeader('x-fn-2', 'hit');
                next();
            }
        
            blog.get('/', function(req, res){
                res.end('success');
            });
        
            blog.once('mount', function (parent) {
                assert.strictEqual(parent, app)
                cb();
            });
            other.once('mount', function (parent) {
                assert.strictEqual(parent, app)
                cb();
            });
        
            app.use('/post/:article', fn1, other, fn2, blog);
        
            request(app)
            .get('/post/once-upon-a-time')
            .expect('x-fn-1', 'hit')
            .expect('x-fn-2', 'hit')
            .expect('success', cb);
        })*/
    });
});
