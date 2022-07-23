import R from 'ramda';
import { error, warn } from '../utils/logger';
import { type MarkdownDescriptor } from '../interface';

export const blogInfoValidate = (info: MarkdownDescriptor, filePath: string) => {
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
    } else if (!info.createDate.isValid()) {
        errs.push('please specify a valid create date in format: "YYYY-MM-DD HH:mm"');
    } else if (info.updateDate?.isValid() && info.updateDate.isBefore(info.createDate)) {
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
        warn(`\nPlease fix those warnings in 【${filePath}】, to make your post more completed:`);
        // we do not need any highlight color
        R.forEach(console.log, warns);
    }
    if (errs.length) {
        error(`\nPlease fix those errors in 【${filePath}】, otherwise this post will not be published:`);
        // we do not need any highlight color
        R.forEach(console.log, errs);
        return false;
    }
    return true;
};