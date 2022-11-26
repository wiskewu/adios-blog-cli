
// @ts-nocheck
import * as R from 'ramda';
import dayjs from 'dayjs';
// markdown it with plugins
import MarkdownIt from "markdown-it";
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItDeflist from 'markdown-it-deflist';
import MarkdownItMark from 'markdown-it-mark';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItKatex from 'markdown-it-katex';
import MarkdownItTocRightDone from 'markdown-it-toc-done-right';
import MarkdownItTaskLists from 'markdown-it-task-lists';
import MarkdownItEmoji from 'markdown-it-emoji';
import hljs, { Language } from 'highlight.js';
import { parse } from 'node-html-parser';
import slugify from 'slugify';

import { resolveWebUrl } from '../utils/file';
import { log, error, warn } from '../utils/logger';
import { blogInfoValidate } from './checker';
import { type MarkdownDescriptor } from '../interface';

/**
 * 
 * @param str 不能包含中文
 * @returns 转化锚链接字符串为符合语法的锚链接
 */
const anchorSlugify = (str: string): string => {
    return slugify(str, {
        lower: true,
        replacement: '-',
    });
};

const md: MarkdownIt = new MarkdownIt({
    html: true, // 可以识别 HTML 标签
    xhtmlOut: true, // 使用 '/' 去闭合单独标签 (<br />).
    linkify: true, // 自动将类似url的文本转换为链接
    breaks: true, // 是否将 \n 转换为 <br />标签
    langPrefix: 'language-',  // 用于代码块中，添加类名前缀
    typographer: true, // 启用一些语言中立的替换 + 引号美化

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: `“”‘’`,

    // 必须返回pre标签，否则内部会进行额外包裹
    highlight: function (str, lang) {
        let language: Language | undefined;
        if (lang && (language = hljs.getLanguage(lang))) {
            try {
                return `<pre class="language-${lang}" data-lang="${language.name}"><code>${hljs.highlight(lang, str, true).value}</code></pre>`
            } catch(_) {
                error('\n##########ERRORS:', _);
            }
        }
        return `<pre data-lang="Code"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
});

md.use(MarkdownItSub)
    .use(MarkdownItSup)
    .use(MarkdownItFootnote)
    .use(MarkdownItDeflist)
    .use(MarkdownItMark)
    .use(MarkdownItKatex, { throwOnError: true, errorColor: '#cc0000' })
    .use(MarkdownItTaskLists)
    .use(MarkdownItEmoji)
    .use(MarkdownItAnchor, { slugify: anchorSlugify })
    .use(MarkdownItTocRightDone);

// /**
//  * 创建代码块
//  * @param originCodeBlockHtml 
//  * @param className 
//  * @param language 
//  * @returns 
//  */
//  const createCodeBlock = (originCodeBlockHtml: string, className: string, language?: string) => {
//     const lang = language || 'Code';
//     return `<figure class="hljs ${className}" data-lang="${lang}"><table><tbody>
//                 <tr>
//                     <td class="hljs-code">
//                         ${originCodeBlockHtml}
//                     </td>
//                 </tr>
//             </tbody></table></figure>`;
// };

/**
 * 根据html生成对应的目录标记（弥补markdown-it-anchor 不解析纯html文本的问题）
 * @param html 
 * @param parsedPublicPath 公共路径
 * @returns 
 */
const processingRawMdHtml = (html: string, parsedPublicPath: string): { html: string; toc: string } => {
    const root = parse(html);
    const timeMs = Date.now();
    let titleCnt = 1;
    // 根据html的h元素生成对应的目录标记（弥补markdown-it-anchor 不解析纯html文本的问题）
    for (const h of root.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
        let href = h.getAttribute('id');
        if (!href) {
            const tid = String(titleCnt++).padStart(3, '0');
            href = `${timeMs} ${tid}`;
        }
        const slug = anchorSlugify(href);
        h.setAttribute('id', slug);
        h.innerHTML = `<a class="header-anchor" href="#${slug}">#</a>${h.innerHTML}`;
    }

    // 额外封装代码块
    // for (const c of root.querySelectorAll('pre')) {
    //     const codeBlock = c.outerHTML; // 取出"<pre><code></code></pre>"部分
    //     const className = c.classNames;
    //     const lang = c.getAttribute('data-lang');
    //     // 直接替换原pre标签
    //     c.replaceWith(createCodeBlock(codeBlock, className, lang));
    // }

    // 替换所有图片的相对路径链接到绝对路径地址
    for (const img of root.querySelectorAll('img')) {
        const src = img.getAttribute('src');
        const wrappedSrc = resolveWebUrl(parsedPublicPath, src);
        img.setAttribute('src', wrappedSrc);
    }

    // 删除toc（类名由markdown-it-toc-done-right插件生成）
    let lastToc = '';
    for (const t of root.querySelectorAll('.table-of-contents')) {
        lastToc = t.outerHTML;
        t.remove();
    }
    return {
        html: root.toString(),
        toc: lastToc,
    };
};

/**
 * 渲染md到html
 * @param mdContent 
 * @returns 
 */
 export const renderMdToHtml = (mdContent: string, parsedPublicPath: string) => {
    // 渲染时默认加上TOC(markdown语法)以自动生成目录结构，渲染完毕存储后需移除该目录节点
    mdContent += '\n[TOC]';
    return processingRawMdHtml(md.render(mdContent), parsedPublicPath);
};

/**
 * 解析markdown内容到对象描述
 * @param rawMarkdown 原始的markdown内容
 * @param filePath 文件路径
 * @returns 
 */
export const parseMdToDescriptor = (rawMarkdown: string, filePath: string, parsedPublicPath: string): MarkdownDescriptor | null => {
    const seperator = '---\n';
    const sepLen = seperator.length;
    const startIdx = rawMarkdown.indexOf(seperator);
    if (startIdx === -1) {
        error(`can not parse file information of start position:【${filePath}】, please check it out\n.`);
        return null;
    }
    const endIdx = rawMarkdown.indexOf(seperator, startIdx + sepLen);
    if (endIdx === -1) {
        error(`can not parse file information of end position:【${filePath}】, please check it out\n.`);
        return null;
    }
    const infoStr = rawMarkdown.slice(startIdx + sepLen, endIdx).trim();
    const contentStr = rawMarkdown.slice(endIdx + sepLen).trim();
    if (!contentStr.length) {
        error(`content is empty, file: 【${filePath}】\n`);
        return null;
    }
    const infos = infoStr.split('\n');
    const result: MarkdownDescriptor = {
        // default values
        tags: [],
        categories: [],
        draft: false,
        top: false,
        updateDate: null,
        createDate: null,
    } as MarkdownDescriptor;
    R.forEach((info) => {
        // assume that all key and value is valid.
        const [k, ...rest] = info.split(':');
        const key = k.trim();
        // date contains ':'
        const value = rest.join(':').trim();
        if (!key || !value) {
            return;
        }
        const name = key as keyof MarkdownDescriptor;
        switch (name) {
            case 'title':
            case 'summary':
            case 'layout':
            case 'author':
                result[name] = value;
                break;
            case 'categories':
            case 'tags':
                result[name] = value.replace(/\s+/, '').split(',');
                break;
            case 'createDate':
            case 'updateDate':
                result[name] = dayjs(value);
                break;
            case 'draft':
            case 'top':
                result[name] = value.toLocaleLowerCase() === 'true';
                break;
            default:
                warn(`can not parse field '${key}' with '${value}' in ${filePath}`);
        }
    }, infos);

    if (!blogInfoValidate(result, filePath)) {
        return null;
    }
    const { html, toc } = renderMdToHtml(contentStr, parsedPublicPath);
    result.html = html;
    result.toc = toc;
    result.mdContent = contentStr;
    return result;
}

export const parseMdWithSimpleDescriptor = (rawMarkdown: string, filename: string, parsedPublicPath: string): MarkdownDescriptor => {
    const { html, toc } = renderMdToHtml(rawMarkdown, parsedPublicPath);
    const result: MarkdownDescriptor = {
        title: filename,
        layout: '',
        createDate: null,
        updateDate: null,
        author: '',
        categories: [],
        tags: [],
        summary: '',
        draft: false,
        top: false,
        // parsed
        mdContent: rawMarkdown,
        html,
        toc,
    };
    return result;
}