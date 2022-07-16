"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serve_handler_1 = __importDefault(require("serve-handler"));
const http_1 = __importDefault(require("http"));
const path_1 = require("path");
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger_1 = require("../utils/logger");
const constant_1 = require("../constant");
function serve(absProjectPath) {
    var _a;
    const rootDir = absProjectPath;
    const configFile = fs_extra_1.default.readFileSync((0, path_1.resolve)(rootDir, constant_1.CONFIG_FILE_NAME)).toString();
    const config = JSON.parse(configFile);
    const outputDir = (0, path_1.resolve)(rootDir, ((_a = config.alias) === null || _a === void 0 ? void 0 : _a.output) || constant_1.DST_DIR_ROOT);
    const devServer = config.devServer;
    const port = (devServer === null || devServer === void 0 ? void 0 : devServer.port) || 3000;
    if (!fs_extra_1.default.existsSync(outputDir)) {
        (0, logger_1.error)(`target dir【${outputDir}】does not esixt.`);
        (0, logger_1.warn)('Please check and compile the files first!');
        return;
    }
    const server = http_1.default.createServer((request, response) => {
        // You pass two more arguments for config and middleware
        // More details here: https://github.com/vercel/serve-handler#options
        return (0, serve_handler_1.default)(request, response, {
            public: outputDir
        });
    });
    server.listen(port, () => {
        (0, logger_1.log)(`Running at http://localhost:${port}`);
    });
    server.on('error', (e) => {
        throw e;
    });
}
exports.default = serve;
