'use strict';

const fastify = require('fastify')();
const fastifyStatic = require('@fastify/static');
const path = require('path');
const fastifyCompress = require('@fastify/compress');

fastify.register(fastifyCompress);
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', 
});

fastify.addContentTypeParser(
    'application/json', 
    { limit: '50mb' },
    fastify.getDefaultJsonParser('ignore', 'ignore')
);

fastify.get('/', (req, reply) => {
    reply.send('Hello world');
});

fastify.listen({ port: 6004 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
});
