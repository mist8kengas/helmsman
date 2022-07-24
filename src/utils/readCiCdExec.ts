import { readFileSync } from 'fs';
import logger from './logger.js';

export default function readCiCdExec(
    repository: string,
    ref: string,
    type: string
): string | undefined {
    const jsonPath = './var/config/ci_cd.json';
    let ciCd = undefined;

    try {
        ciCd = JSON.parse(readFileSync(jsonPath, { encoding: 'utf-8' }));
    } catch (error) {
        logger(`Invalid syntax detected in "./var/config/ci_cd.json"`, 'error');
        const message =
            'An error occured while trying to parse "./var/config/ci_cd.json", check for invalid syntax and run the program again. (Check error logs)';
        console.log('[helmsman]'.red, message, error);
        return 'bad_config';
    }
    const [, branch] = /refs\/heads\/(.*)$/.exec(ref) || [];
    const repositoryBranch = `${repository}/${branch}`;

    // do the default if there is no branch specified in the config
    if (Object.keys(ciCd).indexOf(repositoryBranch) < 0)
        return ciCd[repository] ? ciCd[repository][type] : undefined;
    else
        return ciCd[repositoryBranch]
            ? ciCd[repositoryBranch][type]
            : undefined;
}
