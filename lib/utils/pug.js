"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPugNavListData = exports.getPugTagsData = exports.getPugCategoriesData = exports.getPugPostsData = void 0;
const ramda_1 = __importDefault(require("ramda"));
const constant_1 = require("../constant");
const file_1 = require("./file");
const getPugPostsData = (posts, publicPath) => {
    const format = (names, baseDirectories) => ramda_1.default.map((name) => {
        const lowerName = ramda_1.default.toLower(name);
        return {
            name: name,
            url: (0, file_1.getRouteListedUrl)([...baseDirectories, lowerName], publicPath, 1)
        };
    }, names);
    return ramda_1.default.map((post) => {
        var _a, _b;
        const { descriptor, url } = post;
        return {
            title: descriptor.title,
            layout: descriptor.layout,
            createDate: (_a = descriptor.createDate) === null || _a === void 0 ? void 0 : _a.format('DD/MM/YYYY HH:mm'),
            updateDate: (_b = descriptor.updateDate) === null || _b === void 0 ? void 0 : _b.format('DD/MM/YYYY HH:mm'),
            author: descriptor.author,
            categories: format(descriptor.categories, [constant_1.DST_PAGE_CATEGORIES]),
            tags: format(descriptor.tags, [constant_1.DST_PAGE_TAGS]),
            summary: descriptor.summary,
            top: descriptor.top,
            html: descriptor.html,
            toc: descriptor.toc,
            url,
        };
    }, posts);
};
exports.getPugPostsData = getPugPostsData;
const getPugCategoriesData = (map, publicPath) => {
    var _a;
    const categories = [];
    for (let [cat, _] of map) {
        // cat is already in lower case
        const indexUrl = (0, file_1.getRouteListedUrl)([constant_1.DST_PAGE_CATEGORIES, cat], publicPath, 1);
        categories.push({
            name: cat,
            total: ((_a = map.get(cat)) === null || _a === void 0 ? void 0 : _a.length) || 0,
            indexUrl,
        });
    }
    return categories;
};
exports.getPugCategoriesData = getPugCategoriesData;
const getPugTagsData = (map, publicPath) => {
    var _a;
    const categories = [];
    for (let [tag, _] of map) {
        // tag is already in lower case
        const indexUrl = (0, file_1.getRouteListedUrl)([constant_1.DST_PAGE_TAGS, tag], publicPath, 1);
        categories.push({
            name: tag,
            total: ((_a = map.get(tag)) === null || _a === void 0 ? void 0 : _a.length) || 0,
            indexUrl,
        });
    }
    return categories;
};
exports.getPugTagsData = getPugTagsData;
const getPugNavListData = (navList, publicPath) => {
    return ramda_1.default.map(({ title, pathname }) => {
        return {
            title,
            url: (0, file_1.resolveWebUrl)(publicPath, pathname),
        };
    }, navList);
};
exports.getPugNavListData = getPugNavListData;
