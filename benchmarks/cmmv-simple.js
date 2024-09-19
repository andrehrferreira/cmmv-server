'use strict';

const cmmv = require('@cmmv/server');
const app = cmmv();
app.get("/", async (req, res) => res.send("Hello World"));
app.listen(5001);