"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLASH_REG = exports.IP_REG = exports.PAGE_TPL_NAME = exports.DST_PAGE_ABOUT = exports.DST_PAGE_EXTRA = exports.DST_PAGE_TAGS = exports.DST_PAGE_CATEGORIES = exports.DST_PAGE_INDEX_LIST = exports.DST_PAGE_POSTS = exports.DST_DIR_STATIC = exports.DST_DIR_ASSETS = exports.DST_DIR_ROOT = exports.SOURCE_DIR_EXTRA = exports.SOURCE_DIR_ABOUT = exports.SOURCE_DIR_POSTS = exports.ASSETS_ROOT = exports.SOURCE_ROOT = exports.SRC_DIR_LAYOUT = exports.SRC_DIR_STATIC = exports.CONFIG_FILE_NAME = void 0;
exports.CONFIG_FILE_NAME = 'adios.config.json';
// 主题模版中的目录名
exports.SRC_DIR_STATIC = 'statics';
exports.SRC_DIR_LAYOUT = 'layout';
// 博客项目源数据目录名
exports.SOURCE_ROOT = 'source';
exports.ASSETS_ROOT = 'assets';
exports.SOURCE_DIR_POSTS = '_posts';
exports.SOURCE_DIR_ABOUT = '_about';
exports.SOURCE_DIR_EXTRA = '_extra';
// 输出后的目录名
exports.DST_DIR_ROOT = 'public';
exports.DST_DIR_ASSETS = exports.ASSETS_ROOT;
exports.DST_DIR_STATIC = exports.SRC_DIR_STATIC;
// 输出后的页面对应目录
exports.DST_PAGE_POSTS = 'posts';
exports.DST_PAGE_INDEX_LIST = 'list';
exports.DST_PAGE_CATEGORIES = 'categories';
exports.DST_PAGE_TAGS = 'tags';
exports.DST_PAGE_EXTRA = 'extra';
exports.DST_PAGE_ABOUT = 'about';
// 页面模版名
exports.PAGE_TPL_NAME = {
    home: 'index',
    homeList: 'index',
    categories: 'categories',
    categoryList: 'category-list',
    tags: 'tags',
    tagList: 'tag-list',
    about: 'about',
    posts: 'posts',
    post: 'post',
    extra: 'extra',
};
// ip tester
exports.IP_REG = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;
// remove redundant slash symbol
exports.SLASH_REG = /(?<!:)(\/\/+)/g;
