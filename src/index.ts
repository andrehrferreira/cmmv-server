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
