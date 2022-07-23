import fse from 'fs-extra';
import R from 'ramda';
import { resolve } from 'path';
import rd from 'rd';
import { error, log, warn } from '../utils/logger';
import { parseMdToDescriptor } from '../utils/markdown';
import { resolvePublicPath, getUrl, getFilePath, resolveFilenameWithoutExt, resolveResourceUrl, resolveWebUrl } from '../utils/file';
import { getPugCategoriesData, getPugTagsData, getPugNavListData } from '../utils/pug';
import { renderAboutPage, renderHomepages, renderCategoriesListPages ,renderCategoryPage, renderTagPage, renderTagsListPages, renderPostPage, renderExtraPages } from '../utils/page';
import type { Config, Post, PugLocalData, ArchivePostItem } from "../interface";
import {
    CONFIG_FILE_NAME,
    SRC_DIR_LAYOUT,
    SRC_DIR_STATIC,
    SOURCE_ROOT,
    SOURCE_DIR_POSTS,
    DST_DIR_ROOT,
    DST_DIR_ASSETS,
    DST_DIR_STATIC,
    DST_PAGE_POSTS,
    ASSETS_ROOT,
} from "../constant";

export default function build(absProjectPath: string) {
    // 调用方的项目根目录
    const rootDir = absProjectPath;
    const configFile = fse.readFileSync(resolve(rootDir, CONFIG_FILE_NAME)).toString();
    // 配置文件
    const config: Config = JSON.parse(configFile);
    // 主题文件目录
    let themeDir = '';
    if (config.theme.pkg) {
        themeDir = require(config.theme.pkg)();
    } else if (config.theme.path) {
        themeDir = resolve(rootDir, config.theme.path);
    }
    if (!themeDir) {
        error(`Please specify a theme directory or package name but got: ${config.theme}`);
        return;
    }
    // 数据源 数据源引用资源 输出目录
    const sourceDir = resolve(rootDir, config.alias?.source || SOURCE_ROOT);
    // md源文件中引用的资源数据
    const userResourceDir = resolve(rootDir, config.alias?.assets || ASSETS_ROOT);
    const outputDir = resolve(rootDir, config.alias?.output || DST_DIR_ROOT);
    // 主题相关
    const layoutDir = resolve(themeDir, SRC_DIR_LAYOUT);
    const themeAssetsDir = resolve(themeDir, SRC_DIR_STATIC);

    // parsed data
    const homePostList: Post[] = [];
    const allPosts: Post[] = [];
    // 各个标签对应的文章
    const tagsMap: Map<string, ArchivePostItem[]> = new Map();
    // 各个分类对应的文章
    const categoriesMap: Map<string, ArchivePostItem[]> = new Map();

    const publicPath = resolvePublicPath(config.siteinfo.publicPath);

    const srcPostsDir = resolve(sourceDir, SOURCE_DIR_POSTS);
    rd.eachFileFilterSync(srcPostsDir, /\.md$/, (f) => {
        const mdFile = fse.readFileSync(f).toString();
        const mdDescriptor = parseMdToDescriptor(mdFile, f, publicPath);
        if (!mdDescriptor) {
            error('[FAILED] post compile failed: ', f);
            return;
        }
        if (mdDescriptor.draft === true) {
            warn('[DRAFT] Draft not compiled: ', f);
            return;
        }
        const filename = resolveFilenameWithoutExt(srcPostsDir, f);
        const post: Post = {
            descriptor: mdDescriptor,
            dstPath: getFilePath([DST_PAGE_POSTS], outputDir, filename),
            url: getUrl([DST_PAGE_POSTS], publicPath, filename),
        };

        // 首页文章过滤
        const filterCategories = R.difference(mdDescriptor.categories, config.settings.homepage?.filter || []);
        if (filterCategories.length !== mdDescriptor.categories.length) {
            warn('[FILTER] Post not compiled into Index page by filter: ', f);
        } else {
            homePostList.push(post);
        }

        // 分类
        R.forEach((category) => {
            const lowerCateName = R.toLower(category);
            const list = categoriesMap.get(lowerCateName);
            if (list) {
                list.push({
                    scopedName: category,
                    post,
                });
            } else {
                categoriesMap.set(lowerCateName, [{ scopedName: category, post }]);
            }
        }, post.descriptor.categories);

        // 标签
        R.forEach((tag) => {
            const lowerTagName = R.toLower(tag);
            const list = tagsMap.get(lowerTagName);
            if (list) {
                list.push({
                    scopedName: tag,
                    post,
                });
            } else {
                tagsMap.set(lowerTagName, [{ scopedName: tag, post }]);
            }
        }, post.descriptor.tags);

        allPosts.push(post);
    });

    const commonData: PugLocalData = {
        categories: getPugCategoriesData(categoriesMap, publicPath),
        tags: getPugTagsData(tagsMap, publicPath),
        navList: getPugNavListData(config.settings.navList, publicPath),
        pageTitle: config.siteinfo.name,
        siteinfo: {
            ...config.siteinfo,
            homepage: resolveWebUrl(publicPath, config.siteinfo.homepage),
        },
        publicPath,
        utils: {
            resolveRes: (url: string) => resolveResourceUrl(publicPath, url),
        }
    };

    // 所有文章
    R.forEach((post) => {
        renderPostPage({
            layoutDir,
            postLike: post,
            config,
            localData: commonData,
            publicPath,
        });
    }, allPosts);

    // 首页
    renderHomepages({
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        posts: homePostList,
        config,
        publicPath,
    });

    // 分类
    renderCategoryPage({
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });
    renderCategoriesListPages(categoriesMap, {
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });

    // 标签
    renderTagPage({
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });
    renderTagsListPages(tagsMap, {
        outDir: outputDir,
        layoutDir,
        localData: commonData,
        config,
        publicPath,
    });

    // about页面
    renderAboutPage({
        outDir: outputDir,
        sourceDir,
        layoutDir,
        config,
        localData: commonData,
        publicPath,
    });

    // 用户自定义页面
    renderExtraPages({
        outDir: outputDir,
        layoutDir,
        sourceDir,
        config,
        localData: commonData,
        publicPath,
    });

    // 复制主题中的statics文件夹到public
    fse.copySync(themeAssetsDir, resolve(outputDir, DST_DIR_STATIC));
    // 复制md源数据中使用的资源assets文件夹到public
    fse.copySync(userResourceDir, resolve(outputDir, DST_DIR_ASSETS));

    log('构建结束，快去部署或预览吧！');
}