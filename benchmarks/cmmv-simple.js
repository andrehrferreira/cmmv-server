'use strict';

const { default: cmmv } = require('@cmmv/server');
const { Inspector } = require('@cmmv/inspector');

const app = cmmv();
app.get("/", async (req, res) => res.send("Hello World"));

Inspector.once(async () => {
    Inspector.saveProfile("./profiles")
    console.log("Performing cleanup: Saving heap snapshot...");
});

Inspector.bindKillProcess();
Inspector.start();
app.listen(5001);