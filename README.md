<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/andrehrferreira/cmmv/main/public/assets/logo.png" width="300" alt="CMMV Logo" /></a>
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
$ npm install @cmmv/server @cmmv/server-static
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

app.get('/view', function (req, res) {
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
    //console.log(app.server)
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
* Method: autocannon -c 100 -d 40 -p 10 localhost:3000

┌──────────────────────────┬──────────┬────────┬────────────┬──────────────┬───────────────┐
│                          │ Version  │ Router │ Requests/s │ Latency (ms) │ Throughput/Mb │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ polka                    │ 0.5.2    │ ✓      │ 47499.2    │ 20.61        │ 8.47          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ connect                  │ 3.7.0    │ ✗      │ 47233.6    │ 20.70        │ 8.42          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ bare                     │ v20.17.0 │ ✗      │ 46587.2    │ 20.99        │ 8.31          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ fastify                  │ 5.0.0    │ ✓      │ 46321.0    │ 21.17        │ 8.30          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ server-base-router       │ 7.1.32   │ ✓      │ 46158.6    │ 21.19        │ 8.23          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ micro                    │ 10.0.1   │ ✗      │ 45477.4    │ 21.55        │ 8.11          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ rayo                     │ 1.4.6    │ ✓      │ 45397.6    │ 21.59        │ 8.10          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ server-base              │ 7.1.32   │ ✗      │ 44877.0    │ 21.85        │ 8.00          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ micro-route              │ 2.5.0    │ ✓      │ 43836.6    │ 22.37        │ 7.82          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ connect-router           │ 1.3.8    │ ✓      │ 43080.0    │ 22.78        │ 7.68          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ cmmv                     │ 0.0.11   │ ✓      │ 41603.9    │ 23.60        │ 7.46          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ restana                  │ 4.9.9    │ ✓      │ 41601.8    │ 23.57        │ 7.42          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ hono                     │ 4.6.3    │ ✓      │ 41482.1    │ 23.66        │ 7.40          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ polkadot                 │ 1.0.0    │ ✗      │ 40766.6    │ 24.08        │ 7.27          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ 0http                    │ 3.5.3    │ ✓      │ 38630.6    │ 25.44        │ 6.89          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ koa                      │ 2.15.3   │ ✗      │ 38582.8    │ 25.46        │ 6.88          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ take-five                │ 2.0.0    │ ✓      │ 37030.6    │ 26.59        │ 13.31         │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ h3                       │ 1.13.0   │ ✗      │ 36602.2    │ 26.86        │ 6.53          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ koa-isomorphic-router    │ 1.0.1    │ ✓      │ 36570.6    │ 26.88        │ 6.52          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ h3-router                │ 1.13.0   │ ✓      │ 35513.8    │ 27.70        │ 6.33          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ koa-router               │ 12.0.1   │ ✓      │ 35363.8    │ 27.84        │ 6.31          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ hapi                     │ 21.3.10  │ ✓      │ 32379.0    │ 30.42        │ 5.77          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ microrouter              │ 3.1.3    │ ✓      │ 32073.4    │ 30.72        │ 5.72          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ restify                  │ 11.1.0   │ ✓      │ 30820.4    │ 31.97        │ 5.56          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ fastify-big-json         │ 5.0.0    │ ✓      │ 12205.6    │ 81.42        │ 140.44        │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ express                  │ 5.0.0    │ ✓      │ 10808.0    │ 91.93        │ 1.93          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ express-with-middlewares │ 5.0.0    │ ✓      │ 9815.5     │ 101.27       │ 3.65          │
├──────────────────────────┼──────────┼────────┼────────────┼──────────────┼───────────────┤
│ trpc-router              │ 10.45.2  │ ✓      │ N/A        │ N/A          │ N/A           │
└──────────────────────────┴──────────┴────────┴────────────┴──────────────┴───────────────┘

## Documentation

The complete documentation is available [here](https://cmmv.io).

## Support

CMMV is an open-source project, and we are always looking for contributors to help improve it. If you encounter a bug or have a feature request, please open an issue on [GitHub](https://github.com/andrehrferreira/cmmv/issues).

## Stay in Touch

- Author - [André Ferreira](https://github.com/andrehrferreira)
- Twitter - [@andrehrferreira](https://twitter.com/andrehrferreira)
- Linkdin - [@andrehrf](https://www.linkedin.com/in/andrehrf)
- Youtube - [@Andrehrferreira](https://www.youtube.com/@Andrehrferreira)

## License

CMMV is [MIT licensed](LICENSE).
