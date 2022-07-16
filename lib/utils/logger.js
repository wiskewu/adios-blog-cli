"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const toLogger = (key, color) => {
    return (msg, ...args) => {
        // @ts-ignore
        const res = chalk_1.default[color](msg, ...args);
        console[key](res);
    };
};
exports.log = toLogger('log', 'green');
exports.warn = toLogger('warn', 'yellow');
exports.error = toLogger('error', 'red');
