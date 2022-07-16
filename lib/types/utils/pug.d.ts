import type { Post, PugCategory, PugPost, PugTag, ArchivePostItem, PugNav } from '../interface';
export declare const getPugPostsData: (posts: Post[], publicPath: string) => PugPost[];
export declare const getPugCategoriesData: (map: Map<string, ArchivePostItem[]>, publicPath: string) => PugCategory[];
export declare const getPugTagsData: (map: Map<string, ArchivePostItem[]>, publicPath: string) => PugTag[];
export declare const getPugNavListData: (navList: {
    title: string;
    pathname: string;
}[], publicPath: string) => PugNav[];
