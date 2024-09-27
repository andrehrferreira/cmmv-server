'use strict';

const { default: cmmv } = require('@cmmv/server');
const app = cmmv();
app.get("/", async (req, res) => res.end("Hello World"));
app.listen(5001);