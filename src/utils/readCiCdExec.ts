import { readFileSync } from 'fs';
import logger from './logger.js';

enum EXEC_RESPONSE {
    BAD_CONFIG = 1 << 0,
}
const EXEC_RESPONSE_MAP: { [index: number]: string } = {
    1: 'bad_config',
};
type execResponse = EXEC_RESPONSE;

export default function readCiCdExec(
    repository: string,
    ref: string,
    type: string
): string | EXEC_RESPONSE | undefined {
    const jsonPath = './var/config/ci_cd.json';
    let ciCd = undefined;

    try {
        ciCd = JSON.parse(readFileSync(jsonPath, { encoding: 'utf-8' }));
    } catch (error) {
        logger(`Invalid syntax detected in "./var/config/ci_cd.json"`, 'error');
        const message =
            'An error occured while trying to parse "./var/config/ci_cd.json", check for invalid syntax and run the program again. (Check error logs)';
        console.log('[helmsman]'.red, message, error);
        return EXEC_RESPONSE.BAD_CONFIG;
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

export { EXEC_RESPONSE, EXEC_RESPONSE_MAP };
export type { execResponse };
