import fse from 'fs-extra';
import { resolve } from 'path';
import * as R from 'ramda';
import { parseMdWithSimpleDescriptor } from './markdown';
import { getFileIndexedUrl, getFilePath, getRouteIndexedUrl, getUrl } from './file';
import {
    renderPageWithPosts,
    renderPageWithMd,
    renderPageWithTpl,
    type IRenderPageWithPostsProps,
    type IRenderPageWithMdProps,
    type IRenderPageWithTplProps,
    type PostLike,
} from './render';
import type { Config, PugLocalData, ArchivePostItem } from "../interface";
import {
    SOURCE_DIR_ABOUT,
    SOURCE_DIR_EXTRA,
    DST_PAGE_ABOUT,
    DST_PAGE_CATEGORIES,
    DST_PAGE_EXTRA,
    DST_PAGE_INDEX_LIST,
    DST_PAGE_TAGS,
    PAGE_TPL_NAME,
} from "../constant";

const renderCategoryOrTagPageWithPosts = (postMap: Map<string, ArchivePostItem[]>, options: Omit<IRenderPageWithPostsProps, 'posts' | 'pageScopedName'>) => {
    const { directories } = options;
    for (let [name, archiveItems] of postMap) {
        const posts = R.pluck('post', archiveItems);
        renderPageWithPosts({
            ...options,
            posts,
            directories: directories.concat([name]),
            pageScopedName: name,
        }, false);
    }
};

// export const renderHomePage = (options: Omit<IRenderPageProps, 'layout' | 'directories'>) => {
//     renderPage({
//         ...options,
//         layout: 'index',
//     });
// };

// 首页
export const renderHomepages = (options: Omit<IRenderPageWithPostsProps, 'layout' | 'directories'>) => {
    const { config } = options;
    renderPageWithPosts({
        ...options,
        layout: PAGE_TPL_NAME.homeList,
        directories: [DST_PAGE_INDEX_LIST],
        config,
    }, true);
};

// 分类汇总页
export const renderCategoryPage = (options: Omit<IRenderPageWithTplProps, 'layout' | 'url' | 'dstPath'> & { outDir: string; publicPath: string; }) => {
    const { outDir, publicPath } = options;
    const url = getRouteIndexedUrl([DST_PAGE_CATEGORIES], publicPath);
    const dstPath = getFileIndexedUrl([DST_PAGE_CATEGORIES], outDir);
    renderPageWithTpl({
        ...options,
        layout: PAGE_TPL_NAME.categories,
        dstPath,
        url,
    });
};

// 分类列表页
export const renderCategoriesListPages = (postMap: Map<string, ArchivePostItem[]>, options: Omit<IRenderPageWithPostsProps, 'layout' | 'directories' | 'posts'>) => {
    const { config } = options;
    renderCategoryOrTagPageWithPosts(postMap, {
        ...options,
        layout: PAGE_TPL_NAME.categoryList,
        directories: [DST_PAGE_CATEGORIES],
        config,
    });
};

// 标签汇总页
export const renderTagPage = (options: Omit<IRenderPageWithTplProps, 'layout' | 'url' | 'dstPath'> & { outDir: string; publicPath: string; }) => {
    const { outDir, publicPath } = options;
    const url = getRouteIndexedUrl([DST_PAGE_TAGS], publicPath);
    const dstPath = getFileIndexedUrl([DST_PAGE_TAGS], outDir);
    renderPageWithTpl({
        ...options,
        layout: PAGE_TPL_NAME.tags,
        dstPath,
        url,
    });
};

// 标签列表页
export const renderTagsListPages = (postMap: Map<string, ArchivePostItem[]>, options: Omit<IRenderPageWithPostsProps, 'layout' | 'directories' | 'fileResover' | 'posts'>) => {
    const { config } = options;
    renderCategoryOrTagPageWithPosts(postMap, {
        ...options,
        layout: PAGE_TPL_NAME.tagList,
        directories: [DST_PAGE_TAGS],
        config,
    });
};

// 文章详情页
export const renderPostPage = (options: Omit<IRenderPageWithMdProps, 'layout'>) => {
    // TODO: 渲染到html
    const { postLike } = options;
    renderPageWithMd({
        ...options,
        postLike,
        layout: postLike.descriptor!.layout || PAGE_TPL_NAME.post,
    });
};

// 关于页面
export const renderAboutPage = (options: {
    outDir: string;
    sourceDir: string;
    layoutDir: string;
    config: Config;
    localData: PugLocalData;
    publicPath: string;
}) => {
    const { outDir, sourceDir, config, layoutDir, localData, publicPath } = options;
    const aboutPath = resolve(sourceDir, SOURCE_DIR_ABOUT, 'about.md');
    const aboutMd = fse.readFileSync(aboutPath).toString();
    const aboutDescriptor = parseMdWithSimpleDescriptor(aboutMd, 'about');
    if (aboutDescriptor) {
        const aboutPost: PostLike = {
            url: getRouteIndexedUrl([DST_PAGE_ABOUT], publicPath),
            descriptor: aboutDescriptor,
            dstPath: getFileIndexedUrl([DST_PAGE_ABOUT], outDir),
        };
        renderPageWithMd({
            publicPath,
            layoutDir,
            layout: PAGE_TPL_NAME.about,
            postLike: aboutPost,
            localData,
            config,
        });
    }
};

/**
 * 渲染_extra下用户自定义页面
 * @param options 
 */
export const renderExtraPages = (options: {
    outDir: string;
    sourceDir: string;
    layoutDir: string;
    config: Config;
    localData: PugLocalData;
    publicPath: string;
}) => {
    const { sourceDir, layoutDir, config, outDir, localData, publicPath } = options;
    const extraDir = resolve(sourceDir, SOURCE_DIR_EXTRA);
    const { extraPages = [] } = config.settings;
    R.forEach((item) => {
        if (!item.layout) {
            console.error('Please specify an layout on independent page with: ', item);
            return;
        }
        if (item.source) {
            // with md data
            if (item.source.indexOf('/') > -1) {
                console.error('Please specify an valid source name on rendering independent page with: ', item);
                return;
            }
            const htmlFileNameNonExt = item.outputName || item.source;
            const pagePath = resolve(extraDir, `${item.source}.md`);
            const pageMd = fse.readFileSync(pagePath).toString();
            const pageDescriptor = parseMdWithSimpleDescriptor(pageMd, item.source);
            if (pageDescriptor) {
                const pagePost: PostLike = {
                    url: getUrl([DST_PAGE_EXTRA], publicPath, htmlFileNameNonExt),
                    descriptor: pageDescriptor,
                    dstPath: getFilePath([DST_PAGE_EXTRA], outDir, htmlFileNameNonExt),
                };
                renderPageWithMd({
                    publicPath,
                    layoutDir,
                    layout: item.layout,
                    postLike: pagePost,
                    localData: {
                        ...localData,
                        pageTitle: item.title || localData.pageTitle,
                    },
                    config,
                });
            }
        } else {
            // without md data
            const htmlFileNameNonExt = item.outputName || item.layout;
            const pagePost: PostLike = {
                url: getUrl([DST_PAGE_EXTRA], publicPath, htmlFileNameNonExt),
                descriptor: undefined,
                dstPath: getFilePath([DST_PAGE_EXTRA], outDir, htmlFileNameNonExt),
            };
            renderPageWithMd({
                publicPath,
                layoutDir,
                layout: item.layout,
                postLike: pagePost,
                localData: {
                    ...localData,
                    pageTitle: item.title || localData.pageTitle,
                },
                config,
            });
        }
    }, extraPages);
};