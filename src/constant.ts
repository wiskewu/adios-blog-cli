export const CONFIG_FILE_NAME = 'adios.config.json';

// 主题模版中的目录名
export const SRC_DIR_STATIC = 'statics';
export const SRC_DIR_LAYOUT = 'layout';

// 博客项目源数据目录名
export const SOURCE_ROOT = 'source';
export const ASSETS_ROOT = 'assets';
export const SOURCE_DIR_POSTS = '_posts';
export const SOURCE_DIR_ABOUT = '_about';
export const SOURCE_DIR_EXTRA = '_extra';

// 输出后的目录名
export const DST_DIR_ROOT = 'public';
export const DST_DIR_ASSETS = ASSETS_ROOT;
export const DST_DIR_STATIC = SRC_DIR_STATIC;

// 输出后的页面对应目录
export const DST_PAGE_POSTS = 'posts';
export const DST_PAGE_INDEX_LIST = 'list';
export const DST_PAGE_CATEGORIES = 'categories';
export const DST_PAGE_TAGS = 'tags';
export const DST_PAGE_EXTRA = 'extra';
export const DST_PAGE_ABOUT = 'about';

// 页面模版名
export const PAGE_TPL_NAME = {
    home: 'index',
    homeList: 'index',
    
    categories: 'categories',
    categoryList: 'category-list',

    tags: 'tags',
    tagList: 'tag-list',

    about: 'about',

    posts: 'posts',
    post: 'post',

    extra: 'extra',
};

// ip tester
export const IP_REG = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;

// remove redundant slash symbol
export const SLASH_REG = /(?<!:)(\/\/+)/g;