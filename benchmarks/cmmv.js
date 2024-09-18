'use strict';

const app = require('@cmmv/server')();
app.get("/", async (req, res) => res.send("Hello World"));
app.listen(5001, "127.0.0.1", () => console.log("Listen on http://127.0.0.1:5001"));