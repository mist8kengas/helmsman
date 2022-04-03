import { readFileSync } from 'fs';

export default function readCiCdExec(
    repository: string,
    type: string
): string | undefined {
    const jsonPath = './var/config/ci_cd.json',
        ciCd = JSON.parse(readFileSync(jsonPath, { encoding: 'utf-8' }));
    return ciCd[repository] ? ciCd[repository][type] : undefined;
}
