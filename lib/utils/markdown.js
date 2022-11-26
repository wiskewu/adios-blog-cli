"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMdWithSimpleDescriptor = exports.parseMdToDescriptor = exports.renderMdToHtml = void 0;
// @ts-nocheck
const R = __importStar(require("ramda"));
const dayjs_1 = __importDefault(require("dayjs"));
// markdown it with plugins
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_sub_1 = __importDefault(require("markdown-it-sub"));
const markdown_it_sup_1 = __importDefault(require("markdown-it-sup"));
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_deflist_1 = __importDefault(require("markdown-it-deflist"));
const markdown_it_mark_1 = __importDefault(require("markdown-it-mark"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
const markdown_it_katex_1 = __importDefault(require("markdown-it-katex"));
const markdown_it_toc_done_right_1 = __importDefault(require("markdown-it-toc-done-right"));
const markdown_it_task_lists_1 = __importDefault(require("markdown-it-task-lists"));
const markdown_it_emoji_1 = __importDefault(require("markdown-it-emoji"));
const highlight_js_1 = __importDefault(require("highlight.js"));
const node_html_parser_1 = require("node-html-parser");
const slugify_1 = __importDefault(require("slugify"));
const file_1 = require("../utils/file");
const logger_1 = require("../utils/logger");
const checker_1 = require("./checker");
/**
 *
 * @param str 不能包含中文
 * @returns 转化锚链接字符串为符合语法的锚链接
 */
const anchorSlugify = (str) => {
    return (0, slugify_1.default)(str, {
        lower: true,
        replacement: '-',
    });
};
const md = new markdown_it_1.default({
    html: true,
    xhtmlOut: true,
    linkify: true,
    breaks: true,
    langPrefix: 'language-',
    typographer: true,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: `“”‘’`,
    // 必须返回pre标签，否则内部会进行额外包裹
    highlight: function (str, lang) {
        let language;
        if (lang && (language = highlight_js_1.default.getLanguage(lang))) {
            try {
                return `<pre class="language-${lang}" data-lang="${language.name}"><code>${highlight_js_1.default.highlight(lang, str, true).value}</code></pre>`;
            }
            catch (_) {
                (0, logger_1.error)('\n##########ERRORS:', _);
            }
        }
        return `<pre data-lang="Code"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});
md.use(markdown_it_sub_1.default)
    .use(markdown_it_sup_1.default)
    .use(markdown_it_footnote_1.default)
    .use(markdown_it_deflist_1.default)
    .use(markdown_it_mark_1.default)
    .use(markdown_it_katex_1.default, { throwOnError: true, errorColor: '#cc0000' })
    .use(markdown_it_task_lists_1.default)
    .use(markdown_it_emoji_1.default)
    .use(markdown_it_anchor_1.default, { slugify: anchorSlugify })
    .use(markdown_it_toc_done_right_1.default);
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
const processingRawMdHtml = (html, parsedPublicPath) => {
    const root = (0, node_html_parser_1.parse)(html);
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
        const wrappedSrc = (0, file_1.resolveWebUrl)(parsedPublicPath, src);
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
const renderMdToHtml = (mdContent, parsedPublicPath) => {
    // 渲染时默认加上TOC(markdown语法)以自动生成目录结构，渲染完毕存储后需移除该目录节点
    mdContent += '\n[TOC]';
    return processingRawMdHtml(md.render(mdContent), parsedPublicPath);
};
exports.renderMdToHtml = renderMdToHtml;
/**
 * 解析markdown内容到对象描述
 * @param rawMarkdown 原始的markdown内容
 * @param filePath 文件路径
 * @returns
 */
const parseMdToDescriptor = (rawMarkdown, filePath, parsedPublicPath) => {
    const seperator = '---\n';
    const sepLen = seperator.length;
    const startIdx = rawMarkdown.indexOf(seperator);
    if (startIdx === -1) {
        (0, logger_1.error)(`can not parse file information of start position:【${filePath}】, please check it out\n.`);
        return null;
    }
    const endIdx = rawMarkdown.indexOf(seperator, startIdx + sepLen);
    if (endIdx === -1) {
        (0, logger_1.error)(`can not parse file information of end position:【${filePath}】, please check it out\n.`);
        return null;
    }
    const infoStr = rawMarkdown.slice(startIdx + sepLen, endIdx).trim();
    const contentStr = rawMarkdown.slice(endIdx + sepLen).trim();
    if (!contentStr.length) {
        (0, logger_1.error)(`content is empty, file: 【${filePath}】\n`);
        return null;
    }
    const infos = infoStr.split('\n');
    const result = {
        // default values
        tags: [],
        categories: [],
        draft: false,
        top: false,
        updateDate: null,
        createDate: null,
    };
    R.forEach((info) => {
        // assume that all key and value is valid.
        const [k, ...rest] = info.split(':');
        const key = k.trim();
        // date contains ':'
        const value = rest.join(':').trim();
        if (!key || !value) {
            return;
        }
        const name = key;
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
                result[name] = (0, dayjs_1.default)(value);
                break;
            case 'draft':
            case 'top':
                result[name] = value.toLocaleLowerCase() === 'true';
                break;
            default:
                (0, logger_1.warn)(`can not parse field '${key}' with '${value}' in ${filePath}`);
        }
    }, infos);
    if (!(0, checker_1.blogInfoValidate)(result, filePath)) {
        return null;
    }
    const { html, toc } = (0, exports.renderMdToHtml)(contentStr, parsedPublicPath);
    result.html = html;
    result.toc = toc;
    result.mdContent = contentStr;
    return result;
};
exports.parseMdToDescriptor = parseMdToDescriptor;
const parseMdWithSimpleDescriptor = (rawMarkdown, filename, parsedPublicPath) => {
    const { html, toc } = (0, exports.renderMdToHtml)(rawMarkdown, parsedPublicPath);
    const result = {
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
};
exports.parseMdWithSimpleDescriptor = parseMdWithSimpleDescriptor;
