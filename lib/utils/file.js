"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWebUrl = exports.resolveResourceUrl = exports.getFileListedUrl = exports.getRouteListedUrl = exports.getFileIndexedUrl = exports.getRouteIndexedUrl = exports.getFilePath = exports.getUrl = exports.getPugLayoutFilepath = exports.resolveFilenameWithoutExt = exports.getFilename = exports.resolvePublicPath = void 0;
const path_1 = __importDefault(require("path"));
const constant_1 = require("../constant");
/**
 * 解析公共路径
 * @param publicPath
 * @returns
 */
const resolvePublicPath = (publicPath) => {
    if (publicPath === '') {
        return '/';
    }
    if (publicPath === '/' || publicPath.startsWith('.')) {
        return publicPath;
    }
    // domin or ip（去除冗余'/'）
    return publicPath.replace(constant_1.SLASH_REG, '/');
};
exports.resolvePublicPath = resolvePublicPath;
/**
 * 去除名称中包含的空白符
 * @param filename
 * @returns 空白符替换为下划线
 */
const slugifyFilename = (filename) => {
    return filename.replace(/\s/g, '_');
};
/**
 * 去除名称后缀名
 * @param filename
 * @returns
 */
const removeFilenameExt = (filename) => {
    const ext = path_1.default.extname(filename);
    return ext ? filename.slice(0, filename.length - ext.length) : filename;
};
const getFilename = (dirpath, filepath) => {
    return filepath.slice(dirpath.length + 1);
};
exports.getFilename = getFilename;
/**
 * 获取有效的文件名（不含空格）
 * @param dirpath
 * @param filepath
 * @returns
 */
const resolveFilenameWithoutExt = (dirpath, filepath) => {
    const filename = filepath.slice(dirpath.length + 1);
    return slugifyFilename(removeFilenameExt(filename));
};
exports.resolveFilenameWithoutExt = resolveFilenameWithoutExt;
const getPugLayoutFilepath = (layoutDir, layoutshortname) => {
    return path_1.default.resolve(layoutDir, layoutshortname + '.pug');
};
exports.getPugLayoutFilepath = getPugLayoutFilepath;
/**
 * 获取带有首页性质的页面地址（以index.html结尾）
 * @param routes 不含文件名的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param filename 文件名
 * @returns 页面的网络地址 eg: /post/xxxxx.html
 */
const getUrl = (routes, parsedPublicPath, filename) => {
    const rs = routes.concat('');
    const pb = parsedPublicPath === '/' ? '' : parsedPublicPath;
    return [pb, ...rs].join('/') + filename + '.html';
};
exports.getUrl = getUrl;
/**
 * 获取带有列表分页性质的页面地址（以index.html结尾）
 * @param routes 不含文件名的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param filename 文件名
 * @returns eg: /User/.../public/post/xxxxx.html
 */
const getFilePath = (directories, outputPublicPath, filename) => {
    return path_1.default.join(outputPublicPath, ...directories, filename + '.html');
};
exports.getFilePath = getFilePath;
/**
 * 获取带有首页性质的页面地址（以index.html结尾）
 * @param routes 不含index的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @returns 页面的网络地址 eg: /about/index.html
 */
const getRouteIndexedUrl = (routes, parsedPublicPath) => {
    return (0, exports.getUrl)(routes, parsedPublicPath, 'index');
};
exports.getRouteIndexedUrl = getRouteIndexedUrl;
/**
 * 获取带有首页性质的文件地址（以index.html结尾）
 * @param directories 子目录
 * @param outputPublicPath 公共目录（绝对路径）
 * @returns 文件的本地地址 eg: /User/.../public/about/index.html
 */
const getFileIndexedUrl = (directories, outputPublicPath) => {
    return (0, exports.getFilePath)(directories, outputPublicPath, 'index');
};
exports.getFileIndexedUrl = getFileIndexedUrl;
/**
 * 获取带有列表分页性质的页面地址（以index.html结尾）
 * @param routes 不含页数的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param index 页码
 * @returns eg: /tags/{{name}}/2.html
 */
const getRouteListedUrl = (routes, parsedPublicPath, index) => {
    return (0, exports.getUrl)(routes, parsedPublicPath, index.toString());
};
exports.getRouteListedUrl = getRouteListedUrl;
/**
 * 获取带有列表分页性质的文件地址（以index.html结尾）
 * @param directories 子目录
 * @param outputPublicPath 公共目录（绝对路径）
 * @param index 页码
 * @returns eg: /User/.../public/categories/Js/2.html
 */
const getFileListedUrl = (directories, outputPublicPath, index) => {
    return (0, exports.getFilePath)(directories, outputPublicPath, index.toString());
};
exports.getFileListedUrl = getFileListedUrl;
/**
 * 获取静态资源路径
 * @param parsedPublicPath
 * @param url 相对静态资源地址
 * @returns
 */
const resolveResourceUrl = (parsedPublicPath, url) => {
    // 去除冗余'/'
    return [parsedPublicPath, url].join('/').replace(constant_1.SLASH_REG, '/');
};
exports.resolveResourceUrl = resolveResourceUrl;
/**
 * 获取完整可访问的网址
 * @param parsedPublicPath
 * @param pathname eg: /xxx/index; www.yourapp.com/xxx
 */
const resolveWebUrl = (parsedPublicPath, pathname) => {
    if (!pathname)
        return parsedPublicPath;
    if (pathname.startsWith('http') || constant_1.IP_REG.test(pathname)) {
        return pathname;
    }
    return [parsedPublicPath, pathname].join('/').replace(constant_1.SLASH_REG, '/');
};
exports.resolveWebUrl = resolveWebUrl;
