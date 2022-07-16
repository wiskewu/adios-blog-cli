"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = exports.clean = exports.build = void 0;
const build_1 = __importDefault(require("./bin/build"));
exports.build = build_1.default;
const clean_1 = __importDefault(require("./bin/clean"));
exports.clean = clean_1.default;
const preview_1 = __importDefault(require("./bin/preview"));
exports.serve = preview_1.default;
exports.default = { build: build_1.default, clean: clean_1.default, serve: preview_1.default };
