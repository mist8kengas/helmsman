import { Router } from 'express';
const router = Router();

import 'colors';
import { exec } from 'child_process';
import { createHmac, timingSafeEqual } from 'crypto';
import readCiCdExec from '../../utils/readCiCdExec.js';
import logger from '../../utils/logger.js';

// import .env
import * as env from 'dotenv';
env.config({ encoding: 'utf8' });
const { HELMSMAN_WEBHOOK_SECRET = '' } = process.env;

function verifySignature(signature: string | undefined, body: Buffer): boolean {
    if (!signature) return false;
    const [hashAlgorithm, hashSignature] = signature?.split('=') || [];
    const hashSignatureBuffer = Buffer.from(hashSignature, 'hex');
    const hmacHash = createHmac(hashAlgorithm, HELMSMAN_WEBHOOK_SECRET)
        .update(body)
        .digest();
    return timingSafeEqual(hashSignatureBuffer, hmacHash);
}

router.post('/', (req, _, next) => {
    const {
        'x-github-delivery': githubDelivery,
        'x-github-event': githubEvent,
        'x-hub-signature-256': githubSignatureSha256,
    } = <{ [index: string]: string | undefined }>req.headers;

    // expect the following headers to exist
    if (!githubDelivery || !githubSignatureSha256 || !githubEvent)
        return next(400);

    // expects req from github
    if (!verifySignature(githubSignatureSha256, req.body)) {
        const logMessage = `Bad or invalid signature (${githubDelivery})`;
        console.warn('[server:post]'.yellow, '/webhook'.gray, logMessage);
        logger(logMessage, 'warn');
        return next(400);
    } else {
        const logMessage = `Good signature (${githubDelivery})`;
        console.info('[server:post]'.green, '/webhook'.gray, logMessage);
        logger(logMessage, 'info');
    }

    // parse json input
    const payloadBody: Webhook = JSON.parse(
        Buffer.from(req.body).toString('utf-8')
    );

    const ciCdExec = readCiCdExec(
        payloadBody.repository.full_name,
        githubEvent
    );
    if (ciCdExec) {
        const logMessage = `CI ${githubEvent} command for "${payloadBody.repository.full_name}" (${githubDelivery}) has been executed`;
        console.info('[server:post]'.green, '/webhook'.gray, logMessage);
        logger(logMessage, 'info');

        exec(ciCdExec, (err, _, stderr) => {
            if (err) {
                const logMessage = `An error occurred while executing the ${githubEvent} command for "${payloadBody.repository.full_name}" (${githubDelivery}): ${stderr}`;
                console.error('[server:post]'.red, '/webhook'.gray, logMessage);
                logger(logMessage, 'error');
                return;
            }

            const logMessage = `CI ${githubEvent} command for "${payloadBody.repository.full_name}" (${githubDelivery}) has been executed succesfully`;
            console.info('[server:post]'.green, '/webhook'.gray, logMessage);
            logger(logMessage, 'info');
        });
        next(202);
    } else {
        const logMessage = `Tried to execute CI ${githubEvent} command for "${payloadBody.repository.full_name}" (${githubDelivery}) but it does not exist. Please check your configuration and redeliver the webhook event.`;
        console.warn('[server:post]'.yellow, '/webhook'.gray, logMessage);
        logger(logMessage, 'warn');
        next(500);
    }
});

export default router;
