import fse from 'fs-extra';
import R from 'ramda';
import pug from 'pug';
import type { Post, Config, PugLocalData } from '../interface';
import {
    getPugLayoutFilepath,
    getRouteIndexedUrl,
    getRouteListedUrl,
    getFileIndexedUrl,
    getFileListedUrl,
} from './file';
import { getPugPostsData } from './pug';
import { sortUnderWeightAndDate } from './sort';

export interface IRenderPageWithPostsProps {
    outDir: string;
    layoutDir: string;
    layout: string;
    directories: string[];
    localData: PugLocalData;
    posts: Post[];
    config: Config;
    publicPath: string;
    pageScopedName?: string;
}
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
export const renderPageWithPosts = (options: IRenderPageWithPostsProps, indexPage: boolean) => {
    const { layoutDir, layout, directories, config, posts, outDir, localData, publicPath, pageScopedName } = options;
    const layoutTplPath = getPugLayoutFilepath(layoutDir, layout);
    const sortedPosts = sortUnderWeightAndDate(posts);
    const arrPosts = R.splitEvery(config.settings.pageSize, sortedPosts);
    const total = arrPosts.length;
    // eg: xxx blog - tags
    const pageTitle = pageScopedName ? config.siteinfo.name + ' - ' + pageScopedName : config.siteinfo.name;
    arrPosts.forEach((postList, i: number) => {
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
            filepath = getFileIndexedUrl([], outDir);
            url = getRouteIndexedUrl([], publicPath);
        } else {
            filepath = getFileListedUrl(directories, outDir, pageNum);
            url = getRouteListedUrl(directories, publicPath, pageNum);
        }
        if (i > 0) {
            hasPrev = true;
            if (indexPage && i - 1 === 0) {
                prevPageUrl = getRouteIndexedUrl([], publicPath);
            } else {
                prevPageUrl = getRouteListedUrl(directories, publicPath, i);
            }
        }
        if (i < total - 1) {
            hasNext = true;
            nextPageUrl = getRouteListedUrl(directories, publicPath, i + 2);
        }
        const extLocalData: PugLocalData = {
            posts: getPugPostsData(postList, publicPath),
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
        const data: PugLocalData = R.mergeLeft(localData, extLocalData);
        const html = renderTplToHtml(layoutTplPath, data);
        // 输出到目录
        fse.outputFileSync(filepath, html);
    });
}

export type PostLike = Omit<Post, 'descriptor'> & Partial<Pick<Post, 'descriptor'>>;
export interface IRenderPageWithMdProps {
    layoutDir: string;
    layout: string;
    postLike: PostLike;
    localData: PugLocalData;
    config: Config;
    publicPath: string;
}
/**
 * 渲染独立页(md数据可选)
 * @param options
 */
export const renderPageWithMd = (options: IRenderPageWithMdProps) => {
    const { layout, layoutDir, postLike, localData, config, publicPath } = options;
    const layoutTplPath = getPugLayoutFilepath(layoutDir, layout);

    const extLocalData: PugLocalData = {
        pageTitle: config.siteinfo.name,
        siteinfo: config.siteinfo,
        pageUrl: postLike.url,
    };
    if (postLike.descriptor) {
        const [pugPost] = getPugPostsData([postLike as Post], publicPath)
        extLocalData.pageTitle = config.siteinfo.name + ' - ' + postLike.descriptor.title;
        extLocalData.post = pugPost;
        extLocalData.content = postLike.descriptor.html;
        extLocalData.toc = postLike.descriptor.toc;
    }
    const data: PugLocalData = R.mergeLeft(localData, extLocalData);
    const html = renderTplToHtml(layoutTplPath, data);
    // 输出到目录
    fse.outputFileSync(postLike.dstPath, html);
}

export interface IRenderPageWithTplProps {
    layoutDir: string;
    layout: string;
    localData: PugLocalData;
    config: Config;
    url: string;
    dstPath: string;
}
/**
 * 只根据模版文件进行渲染
 * @param options 
 */
export const renderPageWithTpl = (options: IRenderPageWithTplProps) => {
    const { layout, layoutDir, localData, config, url, dstPath } = options;
    const layoutTplPath = getPugLayoutFilepath(layoutDir, layout);
    const data: PugLocalData = R.mergeLeft(localData, {
        pageUrl: url,
        pageTitle: config.siteinfo.name,
        siteinfo: config.siteinfo,
    });
    const html = renderTplToHtml(layoutTplPath, data);
    fse.outputFileSync(dstPath, html);
};

export const renderTplToHtml = (tplPath: string, data: any) => {
    return pug.renderFile(tplPath, data);
}