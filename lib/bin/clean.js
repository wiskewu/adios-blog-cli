"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger_1 = require("../utils/logger");
const constant_1 = require("../constant");
function clean(absProjectPath) {
    var _a;
    // 调用方的项目根目录
    const rootDir = absProjectPath;
    const configFile = fs_extra_1.default.readFileSync((0, path_1.resolve)(rootDir, constant_1.CONFIG_FILE_NAME)).toString();
    // 配置文件
    const config = JSON.parse(configFile);
    const outputDir = (0, path_1.resolve)(rootDir, ((_a = config.alias) === null || _a === void 0 ? void 0 : _a.output) || constant_1.DST_DIR_ROOT);
    (0, logger_1.warn)(`Cleaning directory【${outputDir}】from the config file...`);
    fs_extra_1.default.rmSync(outputDir, { recursive: true, force: true });
    (0, logger_1.log)('clean done!');
}
exports.default = clean;
