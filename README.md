<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/andrehrferreira/cmmv/main/public/assets/logo.png" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">Contract-Model-Model-View (CMMV) <br/> A minimalistic framework for building scalable and modular applications using TypeScript contracts.</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@cmmv/core"><img src="https://img.shields.io/npm/v/@cmmv/core.svg" alt="NPM Version" /></a>
    <a href="https://github.com/andrehrferreira/cmmv/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cmmv/core.svg" alt="Package License" /></a>
    <a href="https://dl.circleci.com/status-badge/redirect/circleci/QyJWAYrZ9JTfN1eubSDo5u/7gdwcdqbMYfbYYX4hhoNhc/tree/main" target="_blank"><img src="https://dl.circleci.com/status-badge/img/circleci/QyJWAYrZ9JTfN1eubSDo5u/7gdwcdqbMYfbYYX4hhoNhc/tree/main.svg" alt="CircleCI" /></a>
</p>

<p align="center">
  <a href="https://cmmv.io">Documentation</a> &bull;
  <a href="https://github.com/andrehrferreira/cmmv/issues">Report Issue</a>
</p>

## Description

``@cmmv/server`` is inspired by the popular [Express.js](https://expressjs.com/pt-br/) framework but has been entirely rewritten in TypeScript with performance improvements in mind. The project integrates common plugins like ``body-parser``, ``compression``, ``cookie-parser``, ``cors``, ``multer``, ``serve-static``, and ``session`` out of the box. Additionally, it plans to support any Express.js-compatible plugin in the near future.


## Installation

Install the ``@cmmv/server`` package via npm:

```bash
$ npm install @cmmv/server @cmmv/server-static
```

## Quick Start

Below is a simple example of how to create a new CMMV application:

```typescript
import { readFileSync } from 'node:fs';

import cmmv, { json, serverStatic } from '@cmmv/server';
import compression from '@cmmv/compression';
import cors from '@cmmv/cors';

/*const app = CmmvServer({
    key: readFileSync("./cert/private-key.pem"),
    cert: readFileSync("./cert/certificate.pem"),
    passphrase: "1234"
});*/

const app = cmmv({
    /*http2: true,
    key: readFileSync('./cert/private-key.pem'),
    cert: readFileSync('./cert/certificate.pem'),
    passphrase: '1234',*/
});

const host = '0.0.0.0';
const port = 3000;

app.use(json({ limit: '50mb' }));
app.use(compression({ threshold: 0 }));
app.use(serverStatic('public'));
app.use(cors());

app.post('/', function () {});
app.get('/users', function (req, res) {});
app.put('/users', function (req, res) {});

app.get('/docs/:id', (req, res) => {
    console.log(req.params);
    res.send('Ok');
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/test', (req, res) => {
    console.log(req.body);
    res.send('Ok');
});

app.get('/test', (req, res) => res.sendFile('./public/test.html'));

app.listen(3000, host, () => {
    console.log(`Listen on http://${host}:${port}`);
});
```

## Features

* **Performance Optimized:** Faster and more efficient with improvements over Express.js.
* **Built-in Plugins:** Includes commonly used middleware like ``compression``, ``body-parser``, ``cookie-parser``, and more.
* **TypeScript First:** Fully written in TypeScript for better type safety and developer experience.
* **Express.js Compatibility:** Plans to support Express.js-compatible plugins.
* **HTTP/2 Support:** Native support for HTTP/2, improving speed and connection performance.

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
