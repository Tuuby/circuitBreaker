import express from "express";

let errorState = false;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const app = express();

app.get('/', async (req, res) => {

    if (errorState) {
        res.status(500).send('Internal server error.');
        return;
    }
    // Sleep for one second
    sleep(1000);
    res.status(200).send('Successfull response.');
});

app.get('/errors', (req, res) => {
    errorState = true;
    res.status(200).send('Switched to error state.');
})

app.get('/reset', (req, res) => {
    errorState = false;
    res.status(200).send('Switched to normal state.');
})

app.listen(3001, () => console.log('App is listening on port 3001.'));