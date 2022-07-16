/**
 * 解析公共路径
 * @param publicPath
 * @returns
 */
export declare const resolvePublicPath: (publicPath: string) => string;
export declare const getFilename: (dirpath: string, filepath: string) => string;
/**
 * 获取有效的文件名（不含空格）
 * @param dirpath
 * @param filepath
 * @returns
 */
export declare const resolveFilenameWithoutExt: (dirpath: string, filepath: string) => string;
export declare const getPugLayoutFilepath: (layoutDir: string, layoutshortname: string) => string;
/**
 * 获取带有首页性质的页面地址（以index.html结尾）
 * @param routes 不含文件名的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param filename 文件名
 * @returns 页面的网络地址 eg: /post/xxxxx.html
 */
export declare const getUrl: (routes: string[], parsedPublicPath: string, filename: string) => string;
/**
 * 获取带有列表分页性质的页面地址（以index.html结尾）
 * @param routes 不含文件名的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param filename 文件名
 * @returns eg: /User/.../public/post/xxxxx.html
 */
export declare const getFilePath: (directories: string[], outputPublicPath: string, filename: string) => string;
/**
 * 获取带有首页性质的页面地址（以index.html结尾）
 * @param routes 不含index的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @returns 页面的网络地址 eg: /about/index.html
 */
export declare const getRouteIndexedUrl: (routes: string[], parsedPublicPath: string) => string;
/**
 * 获取带有首页性质的文件地址（以index.html结尾）
 * @param directories 子目录
 * @param outputPublicPath 公共目录（绝对路径）
 * @returns 文件的本地地址 eg: /User/.../public/about/index.html
 */
export declare const getFileIndexedUrl: (directories: string[], outputPublicPath: string) => string;
/**
 * 获取带有列表分页性质的页面地址（以index.html结尾）
 * @param routes 不含页数的路由
 * @param parsedPublicPath 已解析的根路径（结尾非'/'）
 * @param index 页码
 * @returns eg: /tags/{{name}}/2.html
 */
export declare const getRouteListedUrl: (routes: string[], parsedPublicPath: string, index: number) => string;
/**
 * 获取带有列表分页性质的文件地址（以index.html结尾）
 * @param directories 子目录
 * @param outputPublicPath 公共目录（绝对路径）
 * @param index 页码
 * @returns eg: /User/.../public/categories/Js/2.html
 */
export declare const getFileListedUrl: (directories: string[], outputPublicPath: string, index: number) => string;
/**
 * 获取静态资源路径
 * @param parsedPublicPath
 * @param url 相对静态资源地址
 * @returns
 */
export declare const resolveResourceUrl: (parsedPublicPath: string, url: string) => string;
/**
 * 获取完整可访问的网址
 * @param parsedPublicPath
 * @param pathname eg: /xxx/index; www.yourapp.com/xxx
 */
export declare const resolveWebUrl: (parsedPublicPath: string, pathname: string) => string;
