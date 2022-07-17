import { type MarkdownDescriptor } from '../interface';
/**
 * 渲染md到html
 * @param mdContent
 * @returns
 */
export declare const renderMdToHtml: (mdContent: string, parsedPublicPath: string) => {
    html: string;
    toc: string;
};
/**
 * 解析markdown内容到对象描述
 * @param rawMarkdown 原始的markdown内容
 * @param filePath 文件路径
 * @returns
 */
export declare const parseMdToDescriptor: (rawMarkdown: string, filePath: string, parsedPublicPath: string) => MarkdownDescriptor | null;
export declare const parseMdWithSimpleDescriptor: (rawMarkdown: string, filename: string, parsedPublicPath: string) => MarkdownDescriptor;
