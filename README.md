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

Below is the current performance comparison result between CMMV and other HTTP server projects in Node.js

```npm run benchmarks:all```
| (index) | Framework | Reqs/s | Total Reqs | Transfer/s | Transfer Total | Latency  |
|---------|-----------|--------|------------|------------|----------------|----------|
| 0       | http      | 25051  | 250511     | 4.25 MB    | 42.53 MB       | 300 ms   |
| 1       | fastify   | 23491  | 234912     | 3.58 MB    | 35.84 MB       | 230 ms   |
| 2       | cmmv      | 21787  | 217850     | 3.32 MB    | 33.24 MB       | 186 ms   |
| 3       | koa       | 21521  | 215214     | 3.59 MB    | 35.92 MB       | 264 ms   |
| 4       | hapi      | 16009  | 160086     | 3.37 MB    | 33.74 MB       | 163 ms   |
| 5       | express   | 6607   | 66061      | 1.5 MB     | 14.99 MB       | 115 ms   |


Following the performance test adding ``json``, ``server static``, ``compression`` middlewares

```npm run benchmarks:complex```
| (index) | Framework | Reqs/s | Total Reqs | Transfer/s | Transfer Total | Latency  |
|---------|-----------|--------|------------|------------|----------------|----------|
| 0       | fastify   | 25490  | 254886     | 4.28 MB    | 42.78 MB       | 286 ms   |
| 1       | cmmv      | 18518  | 185149     | 3.23 MB    | 32.31 MB       | 179 ms   |
| 2       | express   | 4796   | 47963      | 1.19 MB    | 11.94 MB       | 226 ms   |

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
