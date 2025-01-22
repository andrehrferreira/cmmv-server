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
* Run: Wed Jan 22 2025 05:33:16 GMT+0000 (Coordinated Universal Time)
* Method: ``autocannon -c 100 -d 40 -p 10 localhost:3000``

| Framework                | Version  | Router | Requests/s | Latency (ms) | Throughput/Mb |
|--------------------------|----------|--------|------------|--------------|---------------|
| polka                    | 0.5.2    | ✓      | 90446.4    | 10.58        | 16.13         |
| server-base-router       | 7.1.32   | ✓      | 89302.4    | 10.68        | 15.93         |
| rayo                     | 1.4.6    | ✓      | 88780.4    | 10.78        | 15.83         |
| server-base              | 7.1.32   | ✗      | 87916.3    | 10.89        | 15.68         |
| micro-route              | 2.5.0    | ✓      | 86964.8    | 10.98        | 15.51         |
| micro                    | 10.0.1   | ✗      | 86753.2    | 11.03        | 15.47         |
| bare                     | v20.17.0 | ✗      | 86028.1    | 11.16        | 15.34         |
| connect                  | 3.7.0    | ✗      | 85639.4    | 11.19        | 15.27         |
| hono                     | 4.6.17   | ✓      | 84604.8    | 11.32        | 13.88         |
| adonisjs                 | 7.4.0    | ✓      | 83726.4    | 11.45        | 14.93         |
| fastify                  | 5.2.1    | ✓      | 83579.3    | 11.49        | 14.99         |
| cmmv                     | 0.8.0    | ✓      | 82763.2    | 11.59        | 14.84         |
| connect-router           | 1.3.8    | ✓      | 82483.2    | 11.62        | 14.71         |
| koa                      | 2.15.3   | ✗      | 78353.6    | 12.26        | 13.97         |
| take-five                | 2.0.0    | ✓      | 74826.0    | 12.87        | 26.90         |
| polkadot                 | 1.0.0    | ✗      | 74411.2    | 12.94        | 13.27         |
| 0http                    | 3.5.3    | ✓      | 72744.4    | 13.25        | 12.97         |
| koa-isomorphic-router    | 1.0.1    | ✓      | 71037.6    | 13.58        | 12.67         |
| restana                  | 4.9.9    | ✓      | 68915.2    | 14.01        | 12.29         |
| koa-router               | 13.1.0   | ✓      | 68392.8    | 14.12        | 12.20         |
| microrouter              | 3.1.3    | ✓      | 63176.0    | 15.33        | 11.27         |
| h3-router                | 1.13.1   | ✓      | 62246.4    | 15.57        | 11.10         |
| hapi                     | 21.3.12  | ✓      | 60025.6    | 16.16        | 10.70         |
| restify                  | 11.1.0   | ✓      | 58256.0    | 16.66        | 10.50         |
| h3                       | 1.13.1   | ✗      | 38771.0    | 25.29        | 6.91          |
| fastify-big-json         | 5.2.1    | ✓      | 20817.6    | 47.53        | 239.52        |
| express                  | 5.0.1    | ✓      | 20620.0    | 47.98        | 3.68          |
| express-with-middlewares | 5.0.1    | ✓      | 18059.5    | 54.84        | 6.72          |
| trpc-router              | 10.45.2  | ✓      | N/A        | N/A          | N/A           |
