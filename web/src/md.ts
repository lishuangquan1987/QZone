import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

/**
 * 安全的 Markdown 渲染：先把原文中的 HTML 标签转义，
 * 再交给 marked 解析，避免作者（或恶意评论）注入 <script>。
 */
export function renderMarkdown(src: string): string {
  if (!src) return '';
  const escaped = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const html = marked.parse(escaped, { async: false }) as string;
  // 外链新开窗口，并补上 rel
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
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
