"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortUnderWeightAndDate = void 0;
const ramda_1 = __importDefault(require("ramda"));
const dayjs_1 = require("dayjs");
/**
 * 根据权重和最后更新时间排序
 * @param latestFirst true：日期越近，则排在越前
 */
const sortUnderWeightAndDate = (posts, latestFirst = true) => {
    const weightedPosts = [];
    const unWeightedPosts = [];
    const getDate = (createAt, updateAt) => {
        return updateAt.isValid() ? updateAt : createAt.isValid() ? createAt : new dayjs_1.Dayjs();
    };
    ramda_1.default.forEach((post) => {
        if (post.descriptor.top) {
            weightedPosts.push(post);
        }
        else {
            unWeightedPosts.push(post);
        }
    }, posts);
    const dateSorter = (a, b) => {
        const aDate = getDate(a.descriptor.createDate, a.descriptor.updateDate);
        const bDate = getDate(b.descriptor.createDate, b.descriptor.updateDate);
        if (aDate.isSame(bDate))
            return 0;
        if (latestFirst) {
            return aDate.isBefore(bDate) ? 1 : -1;
        }
        return aDate.isAfter(bDate) ? 1 : -1;
    };
    return ramda_1.default.concat(ramda_1.default.sort(dateSorter, weightedPosts), ramda_1.default.sort(dateSorter, unWeightedPosts));
};
exports.sortUnderWeightAndDate = sortUnderWeightAndDate;
