'use strict';

const { default: cmmv, json, serverStatic } = require('@cmmv/server');
const { default: compression } = require('@cmmv/compression');
const app = cmmv();

app.use(json({ limit: '50mb' }));
app.use(compression());
app.use(serverStatic('public'));

app.get("/", async (req, res) => res.send("Hello World"));
app.listen(6001);
