'use strict';

const express = require('express');
const compression = require('compression');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(compression());
app.use(express.static("public"));
app.get('/', (req, res) => res.send('Hello world'));
app.listen(6003);