import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

/**
 * 安全的 Markdown 渲染：先把原文中的 HTML 标签转义，
 * 再交给 marked 解析，避免作者（或恶意评论）注入 <script>。
 * 解析完再做一遍链接/图片协议过滤，挡掉 javascript: 之类的伪协议。
 */
export function renderMarkdown(src: string): string {
  if (!src) return '';
  // 只转义 & 与 <：保留 > 让 Markdown 的引用语法仍然生效
  const escaped = src.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const html = marked.parse(escaped, { async: false }) as string;

  // 用 template 解析成 DOM 再逐个检查，比正则可靠（属性引号、大小写都能覆盖）
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  for (const a of Array.from(tpl.content.querySelectorAll('a'))) {
    const href = (a.getAttribute('href') || '').trim();
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else if (!/^(mailto:|#|\/)/i.test(href)) {
      // javascript: / data: / vbscript: 等一律摘掉链接，只留文字
      a.removeAttribute('href');
    }
  }
  for (const img of Array.from(tpl.content.querySelectorAll('img'))) {
    const src2 = (img.getAttribute('src') || '').trim();
    if (!/^(https?:\/\/|\/|data:image\/)/i.test(src2)) img.removeAttribute('src');
  }
  return tpl.innerHTML;
}

/** 从 Markdown 生成纯文本摘要。 */
export function plainSummary(src: string, max = 120): string {
  const s = src
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > max ? s.slice(0, max) + '…' : s;
}

/** 拆出所有图片地址，用于「正文配图」区。 */
export function extractImages(src: string): string[] {
  const out: string[] = [];
  const re = /!\[[^\]]*\]\(([^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}
