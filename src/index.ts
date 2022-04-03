import logger from './utils/logger.js';

// setup - check if ci.json exists
import { existsSync, mkdirSync, writeFileSync } from 'fs';
if (!existsSync('./var/config')) mkdirSync('./var/config', { recursive: true });
if (!existsSync('./var/config/ci_cd.json')) {
    writeFileSync('./var/config/ci_cd.json', '{}');
    logger(
        `Created file "./var/config/ci_cd.json" because it does not exist`,
        'info'
    );
    console.log(
        '[helmsman]'.yellow,
        'Please configure "./var/config/ci_cd.json" and run the program again.'
    );
    process.exit(1);
}

// import server
import './server/index.js';
