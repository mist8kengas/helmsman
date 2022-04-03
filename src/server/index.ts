import express from 'express';
const app = express();

import 'colors';
import logger from '../utils/logger.js';

// import .env
import * as env from 'dotenv';
env.config({ encoding: 'utf8' });
const { HELMSMAN_HTTP_PORT = '5000', HELMSMAN_HTTP_ADDR = 'localhost' } =
    process.env;

// parse POST data
import bodyParser from 'body-parser';
app.use(bodyParser.raw({ inflate: true, type: () => !0 }));

import route_Webhook from './routes/webhook.js';
app.use('/webhook', route_Webhook);

// responses
import response from './response.js';
app.use(response);

// listen
app.listen(+HELMSMAN_HTTP_PORT, HELMSMAN_HTTP_ADDR, () => {
    console.log(
        '[server]'.green,
        'Listening on',
        `http://${HELMSMAN_HTTP_ADDR}:${HELMSMAN_HTTP_PORT}`.yellow.underline
    );
    logger(
        `Listening on http://${HELMSMAN_HTTP_ADDR}:${HELMSMAN_HTTP_PORT}`,
        'info'
    );
});
