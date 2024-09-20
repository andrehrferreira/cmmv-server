'use strict';

(async _ => {
    const fastify = require('fastify');
    const app = fastify()
    await app.register(import('@fastify/compress'));
    app.get('/', async (req, reply) => reply.type('text/html').send('Hello world'));
    app.listen({ port: 5004 });
})();