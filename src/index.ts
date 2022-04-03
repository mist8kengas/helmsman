import logger from './utils/logger.js';

// import server
import './server/index.js';

// setup - check if ci.json exists
import { existsSync, writeFileSync } from 'fs';
if (!existsSync('./var/config/ci_cd.json')) {
    writeFileSync('./var/config/ci_cd.json', '{}');
    logger(
        `Created file "./var/config/ci_cd.json" because it does not exist`,
        'info'
    );
}
