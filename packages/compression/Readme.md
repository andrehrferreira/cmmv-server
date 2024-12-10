<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/andrehrferreira/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">Contract-Model-Model-View (CMMV) <br/> Building scalable and modular applications using contracts.</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@cmmv/core"><img src="https://img.shields.io/npm/v/@cmmv/core.svg" alt="NPM Version" /></a>
    <a href="https://github.com/andrehrferreira/cmmv-server/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cmmv/core.svg" alt="Package License" /></a>
    <a href="https://dl.circleci.com/status-badge/redirect/circleci/QyJWAYrZ9JTfN1eubSDo5u/JEtDUbr1cNkGRxfKFJo7oR/tree/main" target="_blank"><img src="https://dl.circleci.com/status-badge/img/circleci/QyJWAYrZ9JTfN1eubSDo5u/JEtDUbr1cNkGRxfKFJo7oR/tree/main.svg?style=svg" alt="CircleCI" /></a>
</p>

<p align="center">
  <a href="https://cmmv.io">Documentation</a> &bull;
  <a href="https://github.com/andrehrferreira/cmmv-server/issues">Report Issue</a>
</p>

## Description

``@cmmv/server`` is inspired by the popular [Express.js](https://expressjs.com/pt-br/) framework but has been entirely rewritten in TypeScript with performance improvements in mind. The project integrates common plugins like ``body-parser``, ``compression``, ``cookie-parser``, ``cors``, ``etag``, ``helmet`` and ``serve-static`` out of the box. Additionally, it plans to support any Express.js-compatible plugin in the near future.

## Installation

Install the ``@cmmv/server`` package via npm:

```bash
$ pnpm add @cmmv/server
```

## Quick Start

Below is a simple example of how to create a new CMMV application:

```typescript
import cmmv, { json, urlencoded, serverStatic } from '@cmmv/server';
import etag from '@cmmv/etag';
import cors from '@cmmv/cors';
import cookieParser from '@cmmv/cookie-parser';
import compression from '@cmmv/compression';
import helmet from '@cmmv/helmet';

const app = cmmv();
const host = '0.0.0.0';
const port = 3000;

app.use(serverStatic('public'));
app.use(cors());
app.use(etag({ algorithm: 'fnv1a' }));
app.use(cookieParser());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));
app.use(compression({ level: 6 }));
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: false,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'example.com'],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    }),
);

app.set('view engine', 'pug');

app.get('/view', async (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.get('/', async (req, res) => {
    res.send('Hello World');
});

app.get('/json', async (req, res) => {    
    res.json({ hello: 'world' });
});

app.get('/user/:id', async (req, res) => {
    res.send('User ' + req.params.id);
});

app.get('/users', async (req, res) => {
    res.json(req.query);
});

app.post('/test', async (req, res) => {
    console.log(req.body);
    res.send('ok');
});

app.listen({ host, port })
.then(server => {
    console.log(
        `Listen on http://${server.address().address}:${server.address().port}`,
    );
})
.catch(err => {
    throw Error(err.message);
});
```

## Features

* **Performance Optimized:** Faster and more efficient with improvements over Express.js.
* **Built-in Plugins:** Includes commonly used middleware like ``compression``, ``body-parser``, ``cookie-parser``, and more.
* **TypeScript First:** Fully written in TypeScript for better type safety and developer experience.
* **Express.js Compatibility:** Plans to support Express.js-compatible plugins.
* **HTTP/2 Support:** Native support for HTTP/2, improving speed and connection performance.

## Benchmarks

* [https://github.com/fastify/benchmarks](https://github.com/fastify/benchmarks)
* Machine: linux x64 | 32 vCPUs | 128.0GB Mem
* Node: v20.17.0
* Run: Thu Nov 26 2024 15:23:41 GMT+0000 (Coordinated Universal Time)
* Method: ``autocannon -c 100 -d 40 -p 10 localhost:3000``

| Framework                | Version  | Router | Requests/s | Latency (ms) | Throughput/Mb |
|--------------------------|----------|--------|------------|--------------|---------------|
| bare                     | v20.17.0 | ✗      | 88267.6    | 10.87        | 15.74         |
| fastify                  | 5.1.0    | ✓      | 87846.6    | 10.91        | 15.75         |
| polka                    | 0.5.2    | ✓      | 87234.8    | 10.99        | 15.56         |
| connect                  | 3.7.0    | ✗      | 86129.8    | 11.13        | 15.36         |
| connect-router           | 1.3.8    | ✓      | 85804.8    | 11.16        | 15.30         |
| server-base              | 7.1.32   | ✗      | 85724.8    | 11.18        | 15.29         |
| rayo                     | 1.4.6    | ✓      | 85504.6    | 11.21        | 15.25         |
| server-base-router       | 7.1.32   | ✓      | 84189.0    | 11.39        | 15.01         |
| micro                    | 10.0.1   | ✗      | 81955.2    | 11.70        | 14.62         |
| micro-route              | 2.5.0    | ✓      | 81153.6    | 11.82        | 14.47         |
| cmmv                     | 0.6.2    | ✓      | 79041.6    | 12.16        | 14.17         |
| koa                      | 2.15.3   | ✗      | 76639.6    | 12.54        | 13.67         |
| polkadot                 | 1.0.0    | ✗      | 72702.4    | 13.25        | 12.96         |
| koa-isomorphic-router    | 1.0.1    | ✓      | 72588.4    | 13.28        | 12.95         |
| hono                     | 4.6.12   | ✓      | 72410.8    | 13.31        | 12.91         |
| take-five                | 2.0.0    | ✓      | 71261.2    | 13.54        | 25.62         |
| 0http                    | 3.5.3    | ✓      | 71047.6    | 13.58        | 12.67         |
| restana                  | 4.9.9    | ✓      | 68919.6    | 14.01        | 12.29         |
| koa-router               | 12.0.1   | ✓      | 67593.6    | 14.31        | 12.05         |
| h3-router                | 1.13.0   | ✓      | 66985.2    | 14.44        | 11.95         |
| microrouter              | 3.1.3    | ✓      | 62076.0    | 15.61        | 11.07         |
| h3                       | 1.13.0   | ✗      | 60265.6    | 16.10        | 10.75         |
| hapi                     | 21.3.12  | ✓      | 58199.2    | 16.68        | 10.38         |
| restify                  | 11.1.0   | ✓      | 57493.6    | 16.89        | 10.36         |
| fastify-big-json         | 5.1.0    | ✓      | 21931.2    | 45.09        | 252.32        |
| express                  | 5.0.1    | ✓      | 21549.2    | 45.89        | 3.84          |
| express-with-middlewares | 5.0.1    | ✓      | 18930.4    | 52.30        | 7.04          |
| trpc-router              | 10.45.2  | ✓      | N/A        | N/A          | N/A           |