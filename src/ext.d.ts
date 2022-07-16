declare module 'git-pull-or-clone' {
    export default function (url: string, outPath: string, opts: ((err: any) => void) | { depth: number }, cb?: (err: any) => void): void;
}