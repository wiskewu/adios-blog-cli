import type { Post, Config, PugLocalData } from '../interface';
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
export declare const renderPageWithPosts: (options: IRenderPageWithPostsProps, indexPage: boolean) => void;
export declare type PostLike = Omit<Post, 'descriptor'> & Partial<Pick<Post, 'descriptor'>>;
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
export declare const renderPageWithMd: (options: IRenderPageWithMdProps) => void;
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
export declare const renderPageWithTpl: (options: IRenderPageWithTplProps) => void;
export declare const renderTplToHtml: (tplPath: string, data: any) => string;
