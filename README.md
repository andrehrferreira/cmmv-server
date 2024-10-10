<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/andrehrferreira/cmmv/main/public/assets/logo_CMMV_negativa.svg" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">Contract-Model-Model-View (CMMV) <br/> A minimalistic framework for building scalable and modular applications using TypeScript contracts.</p>
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
$ pnpm install @cmmv/server
```

## Quick Start

Below is a simple example of how to create a new CMMV application:

```typescript
//import { readFileSync } from "node:fs";

import cmmv, { json, urlencoded, serverStatic } from '@cmmv/server';
import etag from '@cmmv/etag';
import cors from '@cmmv/cors';
import cookieParser from '@cmmv/cookie-parser';
import compression from '@cmmv/compression';
import helmet from '@cmmv/helmet';

const app = cmmv({
    /*http2: true,
    https: {
        key: readFileSync("./cert/private-key.pem"),
        cert: readFileSync("./cert/certificate.pem"),
        passphrase: "1234"
    }*/
});

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
* Machine: linux x64 | 32 vCPUs | 256.6GB Mem
* Node: v20.17.0
* Run: Thu Oct 02 2024 15:23:41 GMT+0000 (Coordinated Universal Time)
* Method: ``autocannon -c 100 -d 40 -p 10 localhost:3000``

|                          | Version  | Router | Requests/s | Latency (ms) | Throughput/Mb |
|--------------------------|----------|--------|------------|--------------|---------------|
| bare                     | v20.17.0 | ✗      | 45270.4    | 21.62        | 8.07          |
| micro                    | 10.0.1   | ✗      | 44705.8    | 21.93        | 7.97          |
| fastify                  | 5.0.0    | ✓      | 44547.8    | 22.01        | 7.99          |
| connect                  | 3.7.0    | ✗      | 44174.4    | 22.18        | 7.88          |
| polka                    | 0.5.2    | ✓      | 43791.2    | 22.37        | 7.81          |
| rayo                     | 1.4.6    | ✓      | 43731.8    | 22.41        | 7.80          |
| server-base-router       | 7.1.32   | ✓      | 43117.6    | 22.72        | 7.69          |
| server-base              | 7.1.32   | ✗      | 42169.4    | 23.24        | 7.52          |
| micro-route              | 2.5.0    | ✓      | 41600.0    | 23.55        | 7.42          |
| connect-router           | 1.3.8    | ✓      | 41163.3    | 23.85        | 7.34          |
| cmmv                     | 0.4.0    | ✓      | 40995.2    | 23.92        | 7.35          |
| hono                     | 4.6.3    | ✓      | 39738.6    | 24.68        | 7.09          |
| polkadot                 | 1.0.0    | ✗      | 37472.8    | 26.20        | 6.68          |
| koa                      | 2.15.3   | ✗      | 37181.4    | 26.42        | 6.63          |
| 0http                    | 3.5.3    | ✓      | 37101.6    | 26.47        | 6.62          |
| take-five                | 2.0.0    | ✓      | 35171.4    | 27.95        | 12.65         |
| h3                       | 1.13.0   | ✗      | 34667.4    | 28.35        | 6.18          |
| koa-isomorphic-router    | 1.0.1    | ✓      | 34542.7    | 28.46        | 6.16          |
| h3-router                | 1.13.0   | ✓      | 33551.0    | 29.31        | 5.98          |
| restana                  | 4.9.9    | ✓      | 33532.8    | 29.36        | 5.98          |
| koa-router               | 12.0.1   | ✓      | 33426.2    | 29.46        | 5.96          |
| microrouter              | 3.1.3    | ✓      | 30049.2    | 32.79        | 5.36          |
| hapi                     | 21.3.10  | ✓      | 30014.8    | 32.82        | 5.35          |
| restify                  | 11.1.0   | ✓      | 28548.0    | 34.55        | 5.15          |
| fastify-big-json         | 5.0.0    | ✓      | 11675.6    | 85.19        | 134.34        |
| express                  | 5.0.1    | ✓      | 10058.2    | 98.82        | 1.79          |
| express-with-middlewares | 5.0.1    | ✓      | 8826.8     | 112.63       | 3.28          |
| trpc-router              | 10.45.2  | ✓      | N/A        | N/A          | N/A           |

## Documentation

The complete documentation is available [here](https://cmmv.io).

## Support

CMMV is an open-source project, and we are always looking for contributors to help improve it. If you encounter a bug or have a feature request, please open an issue on [GitHub](https://github.com/andrehrferreira/cmmv-server/issues).

## Stay in Touch

- Author - [André Ferreira](https://github.com/andrehrferreira)
- Twitter - [@andrehrferreira](https://twitter.com/andrehrferreira)
- Linkdin - [@andrehrf](https://www.linkedin.com/in/andrehrf)
- Youtube - [@Andrehrferreira](https://www.youtube.com/@Andrehrferreira)

## License

CMMV is [MIT licensed](LICENSE).
