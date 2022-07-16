import handler from 'serve-handler';
import http from 'http';
import { resolve } from 'path';
import fse from 'fs-extra';
import { log, warn, error } from '../utils/logger';
import { CONFIG_FILE_NAME, DST_DIR_ROOT } from '../constant';
import type { Config } from '../interface';

export default function serve(absProjectPath: string) {
    const rootDir = absProjectPath;
    const configFile = fse.readFileSync(resolve(rootDir, CONFIG_FILE_NAME)).toString();
    const config: Config = JSON.parse(configFile);
    const outputDir = resolve(rootDir, config.alias?.output || DST_DIR_ROOT);

    const devServer = config.devServer;
    const port = devServer?.port || 3000;

    if (!fse.existsSync(outputDir)) {
        error(`target dir【${outputDir}】does not esixt.`);
        warn('Please check and compile the files first!');
        return;
    }
    const server = http.createServer((request, response) => {
        // You pass two more arguments for config and middleware
        // More details here: https://github.com/vercel/serve-handler#options
        return handler(request, response, {
            public: outputDir
        });
      });
      
    server.listen(port, () => {
        log(`Running at http://localhost:${port}`);
    });

    server.on('error', (e) => {
        throw e;
    })
}