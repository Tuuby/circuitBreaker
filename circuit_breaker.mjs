import httpproxy from 'http-proxy';
import express from 'express';

const app = express();
const proxy = httpproxy.createProxyServer({
    proxyTimeout: 5000
});

const HOST = 'localhost';
const PORT = 3000;

let serverPort = PORT + 1;

let open = false;
const TRIP_TIMEOUT = 10000;

// Proxy the request to the correct server
app.use('/', (req, res) => {
    if (open) {
        res.status(503).send('Service unavailable');
        return;
    }

    const proxyRequest = proxy.web(req, res, { target: `http://${HOST}:${serverPort}` });

    res.on('error', () => {
        tripCircuit();
    });

    res.on('finish', () => {
        if (res.statusCode >= 500) {
            console.log("DANGER!!");
            tripCircuit();
        } else {
            console.log("SUCCESS!!");
        }
    })
});

function tripCircuit() {
    if (!open) {
        console.log('Circuit tripped!');
        open = true;
        setTimeout(() => {
            console.log('Resetting circuit..');
            open = false;
        }, TRIP_TIMEOUT);
    }
}

app.listen(PORT, () => console.log(`Proxy is listening on port ${PORT}`));