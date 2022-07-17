"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const ramda_1 = __importDefault(require("ramda"));
const path_1 = require("path");
const rd_1 = __importDefault(require("rd"));
const logger_1 = require("../utils/logger");
const markdown_1 = require("../utils/markdown");
const file_1 = require("../utils/file");
const pug_1 = require("../utils/pug");
const page_1 = require("../utils/page");
const constant_1 = require("../constant");
function build(absProjectPath) {
    var _a, _b, _c;
    // 调用方的项目根目录
    const rootDir = absProjectPath;
    const configFile = fs_extra_1.default.readFileSync((0, path_1.resolve)(rootDir, constant_1.CONFIG_FILE_NAME)).toString();
    // 配置文件
    const config = JSON.parse(configFile);
    // 主题文件目录
    const themeDir = (0, path_1.resolve)(rootDir, config.theme.path);
    // 数据源 数据源引用资源 输出目录
    const sourceDir = (0, path_1.resolve)(rootDir, ((_a = config.alias) === null || _a === void 0 ? void 0 : _a.source) || constant_1.SOURCE_ROOT);
    // md源文件中引用的资源数据
    const userResourceDir = (0, path_1.resolve)(rootDir, ((_b = config.alias) === null || _b === void 0 ? void 0 : _b.assets) || constant_1.ASSETS_ROOT);
    const outputDir = (0, path_1.resolve)(rootDir, ((_c = config.alias) === null || _c === void 0 ? void 0 : _c.output) || constant_1.DST_DIR_ROOT);
    // 主题相关
    const layoutDir = (0, path_1.resolve)(themeDir, constant_1.SRC_DIR_LAYOUT);
    const themeAssetsDir = (0, path_1.resolve)(themeDir, constant_1.SRC_DIR_STATIC);
    // parsed data
    const homePostList = [];
    const allPosts = [];
    // 各个标签对应的文章
    const tagsMap = new Map();
    // 各个分类对应的文章
    const categoriesMap = new Map();
    const publicPath = (0, file_1.resolvePublicPath)(config.siteinfo.publicPath);
    const srcPostsDir = (0, path_1.resolve)(sourceDir, constant_1.SOURCE_DIR_POSTS);
    rd_1.default.eachFileFilterSync(srcPostsDir, /\.md$/, (f) => {
        var _a;
        const mdFile = fs_extra_1.default.readFileSync(f).toString();
        const mdDescriptor = (0, markdown_1.parseMdToDescriptor)(mdFile, f, publicPath);
        if (!mdDescriptor || mdDescriptor.draft === true) {
            (0, logger_1.warn)('[DRAFT] Draft not compiled: ', f);
            return;
        }
        const filename = (0, file_1.resolveFilenameWithoutExt)(srcPostsDir, f);
        const post = {
            descriptor: mdDescriptor,
            dstPath: (0, file_1.getFilePath)([constant_1.DST_PAGE_POSTS], outputDir, filename),
            url: (0, file_1.getUrl)([constant_1.DST_PAGE_POSTS], publicPath, filename),
        };
        // 首页文章过滤
        const filterCategories = ramda_1.default.difference(mdDescriptor.categories, ((_a = config.settings.homepage) === null || _a === void 0 ? void 0 : _a.filter) || []);
        if (filterCategories.length !== mdDescriptor.categories.length) {
            (0, logger_1.warn)('[FILTER] Post not compiled into Index page by filter: ', f);
        }
        else {
            homePostList.push(post);
        }
        // 分类
        ramda_1.default.forEach((category) => {
            const lowerCateName = ramda_1.default.toLower(category);
            const list = categoriesMap.get(lowerCateName);
            if (list) {
                list.push({
                    scopedName: category,
                    post,
                });
            }
            else {
                categoriesMap.set(lowerCateName, [{ scopedName: category, post }]);
            }
        }, post.descriptor.categories);
        // 标签
        ramda_1.default.forEach((tag) => {
            const lowerTagName = ramda_1.default.toLower(tag);
            const list = tagsMap.get(lowerTagName);
            if (list) {
                list.push({
                    scopedName: tag,
                    post,
                });
            }
            else {
                tagsMap.set(lowerTagName, [{ scopedName: tag, post }]);
            }
        }, post.descriptor.tags);
        allPosts.push(post);
    });
    const commonData = {
        categories: (0, pug_1.getPugCategoriesData)(categoriesMap, publicPath),
        tags: (0, pug_1.getPugTagsData)(tagsMap, publicPath),
        navList: (0, pug_1.getPugNavListData)(config.settings.navList, publicPath),
        pageTitle: config.siteinfo.name,
        siteinfo: Object.assign(Object.assign({}, config.siteinfo), { homepage: (0, file_1.resolveWebUrl)(publicPath, config.siteinfo.homepage) }),
        publicPath,
        utils: {
            resolveRes: (url) => (0, file_1.resolveResourceUrl)(publicPath, url),
        }
    };
    // 所有文章
    ramda_1.default.forEach((post) => {
        (0, page_1.renderPostPage)({
            layoutDir,
            postLike: post,
            config,
            localData: commonData,
            publicPath,
        });
    }, allPosts);
    // 首页
    (0, page_1.renderHomepages)({
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        posts: homePostList,
        config,
        publicPath,
    });
    // 分类
    (0, page_1.renderCategoryPage)({
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });
    (0, page_1.renderCategoriesListPages)(categoriesMap, {
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });
    // 标签
    (0, page_1.renderTagPage)({
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });
    (0, page_1.renderTagsListPages)(tagsMap, {
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });
    // about页面
    (0, page_1.renderAboutPage)({
        outDir: outputDir,
        sourceDir,
        layoutDir,
        config,
        localData: commonData,
        publicPath,
    });
    // 用户自定义页面
    (0, page_1.renderExtraPages)({
        outDir: outputDir,
        layoutDir,
        sourceDir,
        config,
        localData: commonData,
        publicPath,
    });
    // 复制主题中的statics文件夹到public
    fs_extra_1.default.copySync(themeAssetsDir, (0, path_1.resolve)(outputDir, constant_1.DST_DIR_STATIC));
    // 复制md源数据中使用的资源assets文件夹到public
    fs_extra_1.default.copySync(userResourceDir, (0, path_1.resolve)(outputDir, constant_1.DST_DIR_ASSETS));
    (0, logger_1.log)('构建成功，快去部署或预览吧！');
}
exports.default = build;
