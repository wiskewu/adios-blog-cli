import R from 'ramda';
import { DST_PAGE_CATEGORIES, DST_PAGE_TAGS } from '../constant';
import type { Post, PugCategory, PugPost, PugTag, ArchivePostItem, PugNav } from '../interface';
import { getRouteListedUrl, resolveWebUrl } from './file';

export const getPugPostsData = (posts: Post[], publicPath: string): PugPost[] => {
    const format = (names: string[], baseDirectories: string[]) => R.map((name) => {
        const lowerName = R.toLower(name);
        return {
            name: name,
            url: getRouteListedUrl([...baseDirectories, lowerName], publicPath, 1)
        };
    }, names);
    return R.map((post) => {
        const { descriptor, url } = post;
        return {
            title: descriptor.title,
            layout: descriptor.layout,
            createDate: descriptor.createDate?.format('DD/MM/YYYY HH:mm'),
            updateDate: descriptor.updateDate?.format('DD/MM/YYYY HH:mm'),
            author: descriptor.author,
            categories: format(descriptor.categories, [DST_PAGE_CATEGORIES]),
            tags: format(descriptor.tags, [DST_PAGE_TAGS]),
            summary: descriptor.summary,
            top: descriptor.top,
            html: descriptor.html,
            toc: descriptor.toc,
            url,
        };
    }, posts);
};

export const getPugCategoriesData = (map: Map<string, ArchivePostItem[]>, publicPath: string): PugCategory[] => {
    const categories: PugCategory[] = [];
    for (let [cat, _] of map) {
        // cat is already in lower case
        const indexUrl = getRouteListedUrl([DST_PAGE_CATEGORIES, cat], publicPath, 1);
        categories.push({
            name: cat,
            total: map.get(cat)?.length || 0,
            indexUrl,
        });
    }
    return categories;
};

export const getPugTagsData = (map: Map<string, ArchivePostItem[]>, publicPath: string): PugTag[] => {
    const categories: PugTag[] = [];
    for (let [tag, _] of map) {
        // tag is already in lower case
        const indexUrl = getRouteListedUrl([DST_PAGE_TAGS, tag], publicPath, 1);
        categories.push({
            name: tag,
            total: map.get(tag)?.length || 0,
            indexUrl,
        });
    }
    return categories;
};

export const getPugNavListData = (navList: { title: string; pathname: string }[], publicPath: string): PugNav[] => {
    return R.map(({ title, pathname }) => {
        return {
            title,
            url: resolveWebUrl(publicPath, pathname),
        };
    }, navList);
};