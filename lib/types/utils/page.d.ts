import { type IRenderPageWithPostsProps, type IRenderPageWithMdProps, type IRenderPageWithTplProps } from './render';
import type { Config, PugLocalData, ArchivePostItem } from "../interface";
export declare const renderHomepages: (options: Omit<IRenderPageWithPostsProps, 'layout' | 'directories'>) => void;
export declare const renderCategoryPage: (options: Omit<IRenderPageWithTplProps, 'layout' | 'url' | 'dstPath'> & {
    outDir: string;
    publicPath: string;
}) => void;
export declare const renderCategoriesListPages: (postMap: Map<string, ArchivePostItem[]>, options: Omit<IRenderPageWithPostsProps, 'layout' | 'directories' | 'posts'>) => void;
export declare const renderTagPage: (options: Omit<IRenderPageWithTplProps, 'layout' | 'url' | 'dstPath'> & {
    outDir: string;
    publicPath: string;
}) => void;
export declare const renderTagsListPages: (postMap: Map<string, ArchivePostItem[]>, options: Omit<IRenderPageWithPostsProps, 'layout' | 'directories' | 'fileResover' | 'posts'>) => void;
export declare const renderPostPage: (options: Omit<IRenderPageWithMdProps, 'layout'>) => void;
export declare const renderAboutPage: (options: {
    outDir: string;
    sourceDir: string;
    layoutDir: string;
    config: Config;
    localData: PugLocalData;
    publicPath: string;
}) => void;
/**
 * 渲染_extra下用户自定义页面
 * @param options
 */
export declare const renderExtraPages: (options: {
    outDir: string;
    sourceDir: string;
    layoutDir: string;
    config: Config;
    localData: PugLocalData;
    publicPath: string;
}) => void;
