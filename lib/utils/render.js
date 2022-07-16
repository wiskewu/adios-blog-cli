"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTplToHtml = exports.renderPageWithTpl = exports.renderPageWithMd = exports.renderPageWithPosts = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const ramda_1 = __importDefault(require("ramda"));
const pug_1 = __importDefault(require("pug"));
const file_1 = require("./file");
const pug_2 = require("./pug");
const sort_1 = require("./sort");
/**
 * 渲染带分页功能的页面
 * @param options
 * @param options.outDir 输出目录
 * @param options.layoutDir 主题layout文件夹路径
 * @param options.layout 输出目录
 * @param options.directories 输出目录下的多级子目录
 * @param options.localData 传入模版的待渲染数据
 * @param options.posts 博文列表（未排序）
 * @param options.fileResover
 * @param options.config 全局配置
 * @param options.publicPath
 * @param options.pageScopedName 父路由名称
 * @param indexPage 是否是主页
 */
const renderPageWithPosts = (options, indexPage) => {
    const { layoutDir, layout, directories, config, posts, outDir, localData, publicPath, pageScopedName } = options;
    const layoutTplPath = (0, file_1.getPugLayoutFilepath)(layoutDir, layout);
    const sortedPosts = (0, sort_1.sortUnderWeightAndDate)(posts);
    const arrPosts = ramda_1.default.splitEvery(config.settings.pageSize, sortedPosts);
    const total = arrPosts.length;
    // eg: xxx blog - tags
    const pageTitle = pageScopedName ? config.siteinfo.name + ' - ' + pageScopedName : config.siteinfo.name;
    arrPosts.forEach((postList, i) => {
        const isIndex = indexPage && i === 0;
        // we would like to place homepage at public/index.html
        // TODO: 路径问题
        let filepath = '';
        let url = '';
        let prevPageUrl = '';
        let nextPageUrl = '';
        let hasPrev = false;
        let hasNext = false;
        const pageNum = i + 1;
        if (isIndex) {
            filepath = (0, file_1.getFileIndexedUrl)([], outDir);
            url = (0, file_1.getRouteIndexedUrl)([], publicPath);
        }
        else {
            filepath = (0, file_1.getFileListedUrl)(directories, outDir, pageNum);
            url = (0, file_1.getRouteListedUrl)(directories, publicPath, pageNum);
        }
        if (i > 0) {
            hasPrev = true;
            if (indexPage && i - 1 === 0) {
                prevPageUrl = (0, file_1.getRouteIndexedUrl)([], publicPath);
            }
            else {
                prevPageUrl = (0, file_1.getRouteListedUrl)(directories, publicPath, i);
            }
        }
        if (i < total - 1) {
            hasNext = true;
            nextPageUrl = (0, file_1.getRouteListedUrl)(directories, publicPath, i + 2);
        }
        const extLocalData = {
            posts: (0, pug_2.getPugPostsData)(postList, publicPath),
            pageTitle,
            pagination: {
                pageNum: i + 1,
                prevPageUrl,
                nextPageUrl,
                hasPrev,
                hasNext,
                pageCount: total,
                scopedName: pageScopedName,
            },
            // TODO: ？
            pageUrl: url,
            siteinfo: config.siteinfo,
        };
        const data = ramda_1.default.mergeLeft(localData, extLocalData);
        const html = (0, exports.renderTplToHtml)(layoutTplPath, data);
        // 输出到目录
        fs_extra_1.default.outputFileSync(filepath, html);
    });
};
exports.renderPageWithPosts = renderPageWithPosts;
/**
 * 渲染独立页(md数据可选)
 * @param options
 */
const renderPageWithMd = (options) => {
    const { layout, layoutDir, postLike, localData, config, publicPath } = options;
    const layoutTplPath = (0, file_1.getPugLayoutFilepath)(layoutDir, layout);
    const extLocalData = {
        pageTitle: config.siteinfo.name,
        siteinfo: config.siteinfo,
        pageUrl: postLike.url,
    };
    if (postLike.descriptor) {
        const [pugPost] = (0, pug_2.getPugPostsData)([postLike], publicPath);
        extLocalData.pageTitle = config.siteinfo.name + ' - ' + postLike.descriptor.title;
        extLocalData.post = pugPost;
        extLocalData.content = postLike.descriptor.html;
        extLocalData.toc = postLike.descriptor.toc;
    }
    const data = ramda_1.default.mergeLeft(localData, extLocalData);
    const html = (0, exports.renderTplToHtml)(layoutTplPath, data);
    // 输出到目录
    fs_extra_1.default.outputFileSync(postLike.dstPath, html);
};
exports.renderPageWithMd = renderPageWithMd;
/**
 * 只根据模版文件进行渲染
 * @param options
 */
const renderPageWithTpl = (options) => {
    const { layout, layoutDir, localData, config, url, dstPath } = options;
    const layoutTplPath = (0, file_1.getPugLayoutFilepath)(layoutDir, layout);
    const data = ramda_1.default.mergeLeft(localData, {
        pageUrl: url,
        pageTitle: config.siteinfo.name,
        siteinfo: config.siteinfo,
    });
    const html = (0, exports.renderTplToHtml)(layoutTplPath, data);
    fs_extra_1.default.outputFileSync(dstPath, html);
};
exports.renderPageWithTpl = renderPageWithTpl;
const renderTplToHtml = (tplPath, data) => {
    return pug_1.default.renderFile(tplPath, data);
};
exports.renderTplToHtml = renderTplToHtml;
