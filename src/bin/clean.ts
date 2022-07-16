import { resolve } from 'path';
import fse from 'fs-extra';
import { warn, log } from '../utils/logger';
import { CONFIG_FILE_NAME, DST_DIR_ROOT } from '../constant';
import type { Config } from '../interface';

export default function clean(absProjectPath: string) {
    // 调用方的项目根目录
    const rootDir = absProjectPath;
    const configFile = fse.readFileSync(resolve(rootDir, CONFIG_FILE_NAME)).toString();
    // 配置文件
    const config: Config = JSON.parse(configFile);
    const outputDir = resolve(rootDir, config.alias?.output || DST_DIR_ROOT);
    warn(`Cleaning directory【${outputDir}】from the config file...`);
    
    fse.rmSync(outputDir, { recursive: true, force: true });

    log('clean done!');
}