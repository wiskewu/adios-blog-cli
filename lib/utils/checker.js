"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInfoValidate = void 0;
const ramda_1 = __importDefault(require("ramda"));
const logger_1 = require("../utils/logger");
const blogInfoValidate = (info, filePath) => {
    var _a;
    const errs = [];
    const warns = [];
    if (!info.title) {
        errs.push('please specify a title');
    }
    if (!info.categories.length) {
        errs.push('please specify a category');
    }
    if (!info.createDate) {
        errs.push('please specify a create date');
    }
    else if (!info.createDate.isValid()) {
        errs.push('please specify a valid create date in format: "YYYY-MM-DD HH:mm"');
    }
    else if (((_a = info.updateDate) === null || _a === void 0 ? void 0 : _a.isValid()) && info.updateDate.isBefore(info.createDate)) {
        errs.push('please specify a valid update date that bigger than create date');
    }
    if (!info.author) {
        errs.push('please specify an author');
    }
    if (!info.summary) {
        warns.push('please specify a summary');
    }
    if (!info.tags.length) {
        warns.push('please specify a tag');
    }
    if (warns.length) {
        (0, logger_1.warn)(`\nPlease fix those warnings in 【${filePath}】, to make your post more completed:`);
        // we do not need any highlight color
        ramda_1.default.forEach(console.log, warns);
    }
    if (errs.length) {
        (0, logger_1.error)(`\nPlease fix those errors in 【${filePath}】, otherwise this post will not be published:`);
        // we do not need any highlight color
        ramda_1.default.forEach(console.log, errs);
        return false;
    }
    return true;
};
exports.blogInfoValidate = blogInfoValidate;
