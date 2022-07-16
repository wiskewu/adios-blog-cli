import path from 'path';
import gitPullOrClone from 'git-pull-or-clone';
import fse from 'fs-extra';
import ora from 'ora';
import { prompt, type QuestionCollection } from 'inquirer';
import { log } from '../utils/logger';

export default async function init() {
    const question: QuestionCollection = [
        {
            type: 'input',
            message: "请输入项目名(Please input your project name)",
            name: "name",
            default: 'adios-blog',
        }
    ];
    const answer = await prompt(question);
    const dst = path.resolve(`./${answer.name}`);
    const repo = 'git@github.com:wiskewu/adios-blog-template.git';
    const progress = ora(`Downloading ${repo} into ${dst}...`);
    progress.start();
    gitPullOrClone(repo, dst, (err) => {
        if (err) {
            progress.fail('Clone repo failed.');
            throw err;
        }
        log('下载完成(Download successfully)!');

        const pkgDst = path.resolve(dst, 'package.json');
        progress.info('正在重命名(Renaming Project)...');
        const pkgStr = fse.readFileSync(pkgDst).toString();
        const pkgJson = JSON.parse(pkgStr);
        pkgJson.name = answer.name;
        fse.writeFileSync(pkgDst, JSON.stringify(pkgJson, undefined, 2));
        progress.succeed();
        log(`
            🚀🚀🚀 初始化完成
            To get Start:
            =============================
            cd ${answer.name}
            yarn && yarn build && yarn dev
            =============================
        `);
    });
}
