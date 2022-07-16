import chalk from "chalk";

const toLogger = (key: 'log' | 'warn' | 'error', color: any) => {
    return (msg: string, ...args: any[]) => {
        // @ts-ignore
        const res = chalk[color](msg, ...args);
        console[key](res);
    };
};
export const log = toLogger('log', 'green');

export const warn = toLogger('warn', 'yellow');

export const error = toLogger('error', 'red');