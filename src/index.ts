import cmmv from '@cmmv/server';
import etag from '@cmmv/etag';
import cors from '@cmmv/cors';
import cookieParser from '@cmmv/cookie-parser';

/*const app = CmmvServer({
    http2: true,
    key: readFileSync("./cert/private-key.pem"),
    cert: readFileSync("./cert/certificate.pem"),
    passphrase: "1234"
});*/

const app = cmmv();
const host = '0.0.0.0';
const port = 3000;

app.use(cors());
app.use(etag({ algorithm: 'fnv1a' }));
app.use(cookieParser());

app.get('/', async (req, res) => {
    res.send('Hello World');
});

app.get('/json', async (req, res) => {
    res.json({ hello: 'world' });
});

app.listen({ host, port })
    .then(address => {
        //console.log(app.server)
        console.log(`Listen on http://${address.address}:${address.port}`);
    })
    .catch(err => {
        throw Error(err.message);
    });
