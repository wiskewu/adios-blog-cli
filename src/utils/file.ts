import path from 'path';
import { SLASH_REG, IP_REG } from '../constant';

/**
 * 解析公共路径
 * @param publicPath 
 * @returns 
 */
export const resolvePublicPath = (publicPath: string) => {
    if (publicPath === '') {
        return '/';
    }
    if (publicPath === '/' || publicPath.startsWith('.')) {
        return publicPath;
    }
    // domin or ip（去除冗余'/'）
    return publicPath.replace(SLASH_REG, '/');
};

/**
 * 去除名称中包含的空白符
 * @param filename 
 * @returns 空白符替换为下划线
 */
const slugifyFilename = (filename: string) => {
    return filename.replace(/\s/g, '_');
};

/**
 * 去除名称后缀名
 * @param filename 
 * @returns 
 */
const removeFilenameExt = (filename: string) => {
    const ext = path.extname(filename);
    return ext ? filename.slice(0, filename.length - ext.length) : filename;
};


export const getFilename = (dirpath: string, filepath: string) => {
    return filepath.slice(dirpath.length + 1);
};

/**
 * 获取有效的文件名（不含空格）
 * @param dirpath 
 * @param filepath 
 * @returns 
 */
export const resolveFilenameWithoutExt = (dirpath: string, filepath: string) => {
    const filename = filepath.slice(dirpath.length + 1);
    return slugifyFilename(removeFilenameExt(filename));
};

export const getPugLayoutFilepath = (layoutDir: string, layoutshortname: string) => {
    return path.resolve(layoutDir, layoutshortname + '.pug');
};

/**
 * 获取带有首页性质的页面地址（以index.html结尾）
 * @param routes 不含文件名的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param filename 文件名
 * @returns 页面的网络地址 eg: /post/xxxxx.html
 */
export const getUrl = (routes: string[], parsedPublicPath: string, filename: string) => {
    const rs = routes.concat('');
    return ([parsedPublicPath, ...rs].join('/')).replace(SLASH_REG, '/') + filename + '.html';
};

/**
 * 获取带有列表分页性质的页面地址（以index.html结尾）
 * @param routes 不含文件名的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param filename 文件名
 * @returns eg: /User/.../public/post/xxxxx.html
 */
export const getFilePath = (directories: string[], outputPublicPath: string, filename: string) => {
    return path.join(outputPublicPath, ...directories, filename + '.html');
};

/**
 * 获取带有首页性质的页面地址（以index.html结尾）
 * @param routes 不含index的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @returns 页面的网络地址 eg: /about/index.html
 */
export const getRouteIndexedUrl = (routes: string[], parsedPublicPath: string) => {
    return getUrl(routes, parsedPublicPath, 'index');
};

/**
 * 获取带有首页性质的文件地址（以index.html结尾）
 * @param directories 子目录
 * @param outputPublicPath 公共目录（绝对路径）
 * @returns 文件的本地地址 eg: /User/.../public/about/index.html
 */
export const getFileIndexedUrl = (directories: string[], outputPublicPath: string) => {
    return getFilePath(directories, outputPublicPath, 'index');
};

/**
 * 获取带有列表分页性质的页面地址（以index.html结尾）
 * @param routes 不含页数的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param index 页码
 * @returns eg: /tags/{{name}}/2.html
 */
export const getRouteListedUrl = (routes: string[], parsedPublicPath: string, index: number) => {
    return getUrl(routes, parsedPublicPath, index.toString());
};

/**
 * 获取带有列表分页性质的文件地址（以index.html结尾）
 * @param directories 子目录
 * @param outputPublicPath 公共目录（绝对路径）
 * @param index 页码
 * @returns eg: /User/.../public/categories/Js/2.html
 */
export const getFileListedUrl = (directories: string[], outputPublicPath: string, index: number) => {
    return getFilePath(directories, outputPublicPath, index.toString());
};

/**
 * 获取静态资源路径
 * @param parsedPublicPath 
 * @param url 相对静态资源地址
 * @returns 
 */
export const resolveResourceUrl = (parsedPublicPath: string, url: string) => {
    // 去除冗余'/'
    return [parsedPublicPath, url].join('/').replace(SLASH_REG, '/');
}

/**
 * 获取完整可访问的网址
 * @param parsedPublicPath 
 * @param pathname eg: /xxx/index; www.yourapp.com/xxx
 */
export const resolveWebUrl = (parsedPublicPath: string, pathname: string) => {
    if (!pathname) return parsedPublicPath;
    if (pathname.startsWith('http') || IP_REG.test(pathname)) {
        return pathname;
    }
    return [parsedPublicPath, pathname].join('/').replace(SLASH_REG, '/');
};