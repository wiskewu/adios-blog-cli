"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const git_pull_or_clone_1 = __importDefault(require("git-pull-or-clone"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = require("inquirer");
const logger_1 = require("../utils/logger");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const question = [
            {
                type: 'input',
                message: "请输入项目名(Please input your project name)",
                name: "name",
                default: 'adios-blog',
            }
        ];
        const answer = yield (0, inquirer_1.prompt)(question);
        const dst = path_1.default.resolve(`./${answer.name}`);
        const repo = 'git@github.com:wiskewu/eslint-config-basejs.git';
        const progress = (0, ora_1.default)(`Downloading ${repo} into ${dst}...`);
        progress.start();
        (0, git_pull_or_clone_1.default)(repo, dst, (err) => {
            if (err) {
                progress.fail('Clone repo failed.');
                throw err;
            }
            (0, logger_1.log)('下载完成(Download successfully)!');
            const pkgDst = path_1.default.resolve(dst, 'package.json');
            progress.info('正在重命名(Renaming Project)...');
            const pkgStr = fs_extra_1.default.readFileSync(pkgDst).toString();
            const pkgJson = JSON.parse(pkgStr);
            pkgJson.name = answer.name;
            fs_extra_1.default.writeFileSync(pkgDst, JSON.stringify(pkgJson, undefined, 2));
            progress.succeed();
            (0, logger_1.log)(`
            🚀🚀🚀 初始化完成
            To get Start:
            =============================
            cd ${answer.name}
            yarn && yarn build && yarn dev
            =============================
        `);
        });
    });
}
exports.default = init;
