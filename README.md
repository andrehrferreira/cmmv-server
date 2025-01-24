<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/cmmvio/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">Contract-Model-Model-View (CMMV) <br/> Building scalable and modular applications using contracts.</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@cmmv/core"><img src="https://img.shields.io/npm/v/@cmmv/core.svg" alt="NPM Version" /></a>
    <a href="https://github.com/cmmvio/cmmv-server/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cmmv/core.svg" alt="Package License" /></a>
    <a href="https://dl.circleci.com/status-badge/redirect/circleci/QyJWAYrZ9JTfN1eubSDo5u/JEtDUbr1cNkGRxfKFJo7oR/tree/main" target="_blank"><img src="https://dl.circleci.com/status-badge/img/circleci/QyJWAYrZ9JTfN1eubSDo5u/JEtDUbr1cNkGRxfKFJo7oR/tree/main.svg?style=svg" alt="CircleCI" /></a>
</p>

<p align="center">
  <a href="https://cmmv.io">Documentation</a> &bull;
  <a href="https://github.com/cmmvio/cmmv-server/issues">Report Issue</a>
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

| Framework                 | Version  | Router | Requests/s | Latency (ms) | Throughput/Mb |
|---------------------------|----------|--------|------------|--------------|---------------|
| bare                      | v20.17.0 | ✗      | 91084.8    | 10.51        | 16.24         |
| polka                     | 0.5.2    | ✓      | 89697.9    | 10.67        | 16.00         |
| rayo                      | 1.4.6    | ✓      | 89449.8    | 10.70        | 15.95         |
| server-base-router        | 7.1.32   | ✓      | 87786.0    | 10.89        | 15.66         |
| connect                   | 3.7.0    | ✗      | 87734.4    | 10.91        | 15.65         |
| server-base               | 7.1.32   | ✗      | 87707.6    | 10.88        | 15.64         |
| micro                     | 10.0.1   | ✗      | 87536.0    | 10.90        | 15.61         |
| fastify                   | 5.2.1    | ✓      | 87495.9    | 10.94        | 15.69         |
| connect-router            | 1.3.8    | ✓      | 86404.8    | 11.05        | 15.41         |
| micro-route               | 2.5.0    | ✓      | 86115.2    | 11.10        | 15.36         |
| cmmv                      | 0.8.0    | ✓      | 85812.8    | 11.15        | 15.39         |
| adonisjs                  | 7.4.0    | ✓      | 83334.4    | 11.52        | 14.86         |
| hono                      | 4.6.17   | ✓      | 82860.8    | 11.58        | 13.59         |
| 0http                     | 3.5.3    | ✓      | 79984.9    | 12.02        | 14.26         |
| koa                       | 2.15.3   | ✗      | 78946.0    | 12.17        | 14.08         |
| polkadot                  | 1.0.0    | ✗      | 78546.9    | 12.24        | 14.01         |
| take-five                 | 2.0.0    | ✓      | 74257.6    | 12.96        | 26.70         |
| koa-isomorphic-router     | 1.0.1    | ✓      | 71901.6    | 13.42        | 12.82         |
| koa-router                | 13.1.0   | ✓      | 70117.2    | 13.77        | 12.50         |
| restana                   | 4.9.9    | ✓      | 69510.8    | 13.89        | 12.40         |
| h3                        | 1.13.1   | ✗      | 66768.0    | 14.48        | 11.91         |
| h3-router                 | 1.13.1   | ✓      | 64330.0    | 15.04        | 11.47         |
| microrouter               | 3.1.3    | ✓      | 63030.8    | 15.37        | 11.24         |
| hapi                      | 21.3.12  | ✓      | 60592.8    | 16.00        | 10.81         |
| restify                   | 11.1.0   | ✓      | 58288.0    | 16.65        | 10.51         |
| fastify-big-json          | 5.2.1    | ✓      | 21667.6    | 45.64        | 249.29        |
| express                   | 5.0.1    | ✓      | 21299.2    | 46.42        | 3.80          |
| express-with-middlewares  | 5.0.1    | ✓      | 18680.4    | 53.00        | 6.95          |
| trpc-router               | 10.45.2  | ✓      | N/A        | N/A          | N/A           |
