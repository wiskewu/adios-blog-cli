"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderExtraPages = exports.renderAboutPage = exports.renderPostPage = exports.renderTagsListPages = exports.renderTagPage = exports.renderCategoriesListPages = exports.renderCategoryPage = exports.renderHomepages = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const R = __importStar(require("ramda"));
const markdown_1 = require("./markdown");
const file_1 = require("./file");
const render_1 = require("./render");
const logger_1 = require("../utils/logger");
const constant_1 = require("../constant");
const renderCategoryOrTagPageWithPosts = (postMap, options) => {
    const { directories } = options;
    for (let [name, archiveItems] of postMap) {
        const posts = R.pluck('post', archiveItems);
        (0, render_1.renderPageWithPosts)(Object.assign(Object.assign({}, options), { posts, directories: directories.concat([name]), pageScopedName: name }), false);
    }
};
// export const renderHomePage = (options: Omit<IRenderPageProps, 'layout' | 'directories'>) => {
//     renderPage({
//         ...options,
//         layout: 'index',
//     });
// };
// 首页
const renderHomepages = (options) => {
    const { config } = options;
    (0, render_1.renderPageWithPosts)(Object.assign(Object.assign({}, options), { layout: constant_1.PAGE_TPL_NAME.homeList, directories: [constant_1.DST_PAGE_INDEX_LIST], config }), true);
};
exports.renderHomepages = renderHomepages;
// 分类汇总页
const renderCategoryPage = (options) => {
    const { outDir, publicPath } = options;
    const url = (0, file_1.getRouteIndexedUrl)([constant_1.DST_PAGE_CATEGORIES], publicPath);
    const dstPath = (0, file_1.getFileIndexedUrl)([constant_1.DST_PAGE_CATEGORIES], outDir);
    (0, render_1.renderPageWithTpl)(Object.assign(Object.assign({}, options), { layout: constant_1.PAGE_TPL_NAME.categories, dstPath,
        url }));
};
exports.renderCategoryPage = renderCategoryPage;
// 分类列表页
const renderCategoriesListPages = (postMap, options) => {
    const { config } = options;
    renderCategoryOrTagPageWithPosts(postMap, Object.assign(Object.assign({}, options), { layout: constant_1.PAGE_TPL_NAME.categoryList, directories: [constant_1.DST_PAGE_CATEGORIES], config }));
};
exports.renderCategoriesListPages = renderCategoriesListPages;
// 标签汇总页
const renderTagPage = (options) => {
    const { outDir, publicPath } = options;
    const url = (0, file_1.getRouteIndexedUrl)([constant_1.DST_PAGE_TAGS], publicPath);
    const dstPath = (0, file_1.getFileIndexedUrl)([constant_1.DST_PAGE_TAGS], outDir);
    (0, render_1.renderPageWithTpl)(Object.assign(Object.assign({}, options), { layout: constant_1.PAGE_TPL_NAME.tags, dstPath,
        url }));
};
exports.renderTagPage = renderTagPage;
// 标签列表页
const renderTagsListPages = (postMap, options) => {
    const { config } = options;
    renderCategoryOrTagPageWithPosts(postMap, Object.assign(Object.assign({}, options), { layout: constant_1.PAGE_TPL_NAME.tagList, directories: [constant_1.DST_PAGE_TAGS], config }));
};
exports.renderTagsListPages = renderTagsListPages;
// 文章详情页
const renderPostPage = (options) => {
    // TODO: 渲染到html
    const { postLike } = options;
    (0, render_1.renderPageWithMd)(Object.assign(Object.assign({}, options), { postLike, layout: postLike.descriptor.layout || constant_1.PAGE_TPL_NAME.post }));
};
exports.renderPostPage = renderPostPage;
// 关于页面
const renderAboutPage = (options) => {
    const { outDir, sourceDir, config, layoutDir, localData, publicPath } = options;
    const aboutPath = (0, path_1.resolve)(sourceDir, constant_1.SOURCE_DIR_ABOUT, 'about.md');
    const aboutMd = fs_extra_1.default.readFileSync(aboutPath).toString();
    const aboutDescriptor = (0, markdown_1.parseMdWithSimpleDescriptor)(aboutMd, 'about', publicPath);
    if (aboutDescriptor) {
        const aboutPost = {
            url: (0, file_1.getRouteIndexedUrl)([constant_1.DST_PAGE_ABOUT], publicPath),
            descriptor: aboutDescriptor,
            dstPath: (0, file_1.getFileIndexedUrl)([constant_1.DST_PAGE_ABOUT], outDir),
        };
        (0, render_1.renderPageWithMd)({
            publicPath,
            layoutDir,
            layout: constant_1.PAGE_TPL_NAME.about,
            postLike: aboutPost,
            localData,
            config,
        });
    }
};
exports.renderAboutPage = renderAboutPage;
/**
 * 渲染_extra下用户自定义页面
 * @param options
 */
const renderExtraPages = (options) => {
    const { sourceDir, layoutDir, config, outDir, localData, publicPath } = options;
    const extraDir = (0, path_1.resolve)(sourceDir, constant_1.SOURCE_DIR_EXTRA);
    const { extraPages = [] } = config.settings;
    R.forEach((item) => {
        if (!item.layout) {
            (0, logger_1.error)('Please specify an layout on independent page with: ', item);
            return;
        }
        if (item.source) {
            // with md data
            if (item.source.indexOf('/') > -1) {
                (0, logger_1.error)('Please specify an valid source name on rendering independent page with: ', item);
                return;
            }
            const htmlFileNameNonExt = item.outputName || item.source;
            const pagePath = (0, path_1.resolve)(extraDir, `${item.source}.md`);
            const pageMd = fs_extra_1.default.readFileSync(pagePath).toString();
            const pageDescriptor = (0, markdown_1.parseMdWithSimpleDescriptor)(pageMd, item.source, publicPath);
            if (pageDescriptor) {
                const pagePost = {
                    url: (0, file_1.getUrl)([constant_1.DST_PAGE_EXTRA], publicPath, htmlFileNameNonExt),
                    descriptor: pageDescriptor,
                    dstPath: (0, file_1.getFilePath)([constant_1.DST_PAGE_EXTRA], outDir, htmlFileNameNonExt),
                };
                (0, render_1.renderPageWithMd)({
                    publicPath,
                    layoutDir,
                    layout: item.layout,
                    postLike: pagePost,
                    localData: Object.assign(Object.assign({}, localData), { pageTitle: item.title || localData.pageTitle }),
                    config,
                });
            }
        }
        else {
            // without md data
            const htmlFileNameNonExt = item.outputName || item.layout;
            const pagePost = {
                url: (0, file_1.getUrl)([constant_1.DST_PAGE_EXTRA], publicPath, htmlFileNameNonExt),
                descriptor: undefined,
                dstPath: (0, file_1.getFilePath)([constant_1.DST_PAGE_EXTRA], outDir, htmlFileNameNonExt),
            };
            (0, render_1.renderPageWithMd)({
                publicPath,
                layoutDir,
                layout: item.layout,
                postLike: pagePost,
                localData: Object.assign(Object.assign({}, localData), { pageTitle: item.title || localData.pageTitle }),
                config,
            });
        }
    }, extraPages);
};
exports.renderExtraPages = renderExtraPages;
