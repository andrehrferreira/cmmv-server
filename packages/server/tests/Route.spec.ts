import { strict as assert } from 'assert';

import { CmmvServer, Route } from '..';

describe('Route', function () {
    it('should work without handlers', function (done) {
        var req = { method: 'GET', url: '/' };
        var route = new Route('/foo');
        route.dispatch(req, {}, done);
    });
});
