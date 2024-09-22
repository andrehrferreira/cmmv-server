/**
 * @see https://github.com/expressjs/express/blob/master/test/app.all.js
 */

import * as request from 'supertest';

import { CmmvServer } from '..';

const after = require('after');

describe('app.all()', function () {
    it('should add a router per method', function (done) {
        const app = CmmvServer();
        const cb = after(2, done);

        app.all('/tobi', function (req, res) {
            res.end(req.method);
        });

        request(app.socket).put('/tobi').expect(200, 'PUT', cb);

        request(app.socket).get('/tobi').expect(200, 'GET', cb);
    });

    //find-my-way dont support /*splat
    /*it('should run the callback for a method just once', function(done){
        const app = CmmvServer()
        let n = 0;
    
        app.all('/*splat', function(req, res, next){
            if (n++) return done(new Error('DELETE called several times'));
            next();
        });
    
        request(app.socket)
            .del('/tobi')
            .expect(404, done);
    });*/
});
