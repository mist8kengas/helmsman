import { existsSync, mkdirSync, writeFileSync, appendFileSync } from 'fs';

type LogType = 'log' | 'info' | 'warn' | 'error';

const logDir = `./var/log/`;
const logType: { [index: string]: string } = {
    log: 'LOG',
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
};

export default function logger(log: string, type?: LogType): void {
    const fileName = `${new Date().toISOString().slice(0, 10)}.log`; // ISO-8601 date
    const logPath = logDir + fileName;

    // check if log directory exists
    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });
    if (!existsSync(logPath)) writeFileSync(logPath, '', { encoding: 'utf-8' });

    const now = ~~(Date.now() / 1e3) * 1e3;
    const index = `[${new Date(now).toISOString()} - ${
        logType[type || 'log']
    }] ${log}\n`;
    appendFileSync(logPath, index, { encoding: 'utf-8' });
}

export { LogType };
