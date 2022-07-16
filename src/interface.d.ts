import { Dayjs } from 'dayjs';

export interface MarkdownDescriptor {
    // info
    title: string;
    layout: string;
    createDate: Dayjs;
    updateDate: Dayjs;
    author: string;
    categories: string[];
    tags: string[];
    summary: string;
    draft: boolean;
    top: boolean;
    // parsed
    mdContent: string;
    html: string;
    toc: string;
}

// ===== Config ===== //
export interface SiteinfoConfig {
    name: string;
    maintainer: string;
    description: string;
    keywords: string;
    homepage: string;
    publicPath: string;
}
export interface NavListItem {
    title: string;
    pathname: string;
}
export interface ExtraPageItem {
    title?: string;
    // 读取的md源
    source?: string;
    // 匹配的布局模版名
    layout: string;
    // 输出后的html名 fallback to source, or layout at last
    outputName?: string;
}

export interface SettingsConfig {
    pageSize: number;
    homepage?: {
        filter: string[];
    };
    navList: NavListItem[];
    // 独立页
    extraPages?: ExtraPageItem[];
}

export interface Config {
    siteinfo: SiteinfoConfig;
    settings: SettingsConfig;
    theme: {
        name: string;
        path: string;
    },
    // has default
    alias?: {
        source?: string;
        output?: string;
        assets?: string;
    },
    // preview
    devServer?: {
        port?: number,
    }
}

// ==== Post ==== //
export interface Post {
    descriptor: MarkdownDescriptor;
    url: string;
    dstPath: string;
}

// ====== for pug render
export interface PugPost {
    title: string;
    layout: string;
    createDate: string;
    updateDate: string;
    author: string;
    categories: { name: string; url: string }[];
    tags: { name: string; url: string }[];
    summary: string;
    top: boolean;
    html: string;
    toc: string;
    url: string;
}

export interface PugCategory {
    name: string;
    total: number;
    // 第一页
    indexUrl: string;
}

export type PugTag = PugCategory;

export interface PugNav {
    title: string;
    url: string;
};
export interface PugLocalData {
    // md博文(渲染独立页)
    post?: PugPost;
    // 博文列表(渲染列表时才有此字段)
    posts?: PugPost[];
    categories?: PugCategory[];
    tags?: PugTag[];
    publicPath?: string;
    // 分页相关
    pagination?: {
        pageNum?: number;
        pageSize?: number;
        pageUrl?: string;
        prevPageUrl?: string;
        nextPageUrl?: string;
        hasPrev?: boolean;
        hasNext?: boolean;
        pageCount?: number;
        // parent route, eg: xxx/FE/1.html => “FE”.
        scopedName?: string;
    };
    // equals to pagination.pageUrl
    pageUrl?: string;
    pageTitle?: string;
    content?: string;
    toc?: string;
    navList?: PugNav[];
    siteinfo?: Config['siteinfo'];
    utils?: {
        resolveRes: (path: string) => void;
    }
}

// extra types
export interface ArchivePostItem {
    scopedName: string;
    post: Post;
};