import { api, type PostView } from '../api';
import { mb, prepareImage } from '../image';
import { renderMarkdown } from '../md';
import { esc, icon, toast } from '../ui';
import { bindThemeToggle, themeToggleHTML } from '../theme';
import type { ViewCtx } from '../types';

const CATEGORIES = ['随笔', '城市', '旅行', '技术', '阅读', '生活'];
const FENCE = String.fromCharCode(96).repeat(3);
const IMAGE_LIMIT_MB = 30;

type Mode = 'edit' | 'split' | 'preview';

/** 上一次挂载的编辑器残留的全局监听器，重新挂载时统一释放。 */
let teardown: (() => void) | null = null;

const LS_MODE = 'qz.editor.mode';
const LS_SPLIT = 'qz.editor.split';

interface Draft {
  title: string;
  content: string;
  category: string;
  visibility: string;
  pinned: boolean;
  cover: string;
  savedAt: number;
}

interface Heading {
  level: number;
  text: string;
  offset: number;
}

/**
 * 写作工作台：整页铺满、可拖拽分屏、大纲跳转、列表续行、滚动同步。
 * 所有插入走 execCommand('insertText')，保留浏览器原生撤销栈。
 */
export async function renderEditor(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const editId = ctx.params.id ? Number(ctx.params.id) : 0;
  let existing: PostView | null = null;
  if (editId) {
    existing = await api.post(editId);
    if (!existing.canEdit) {
      root.innerHTML = `<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>`;
      return;
    }
  }

  teardown?.();
  const ac = new AbortController();
  let offTheme: (() => void) | null = null;
  // 离开页面后计时器可能还会跑一次，届时 DOM 已被替换，
  // 所有回调都要先看 disposed，避免读到 null。
  let disposed = false;
  let saveTimer = 0;
  let renderTimer = 0;
  let outlineTimer = 0;
  let published = false;
  teardown = () => {
    disposed = true;
    window.clearTimeout(saveTimer);
    window.clearTimeout(renderTimer);
    window.clearTimeout(outlineTimer);
    // 防抖还没触发就离开时补存一次，避免刚写的内容丢掉；
    // 已经发布成功的不用存，否则会留下一条幽灵草稿。
    if (!published) {
      try {
        if (saveState.classList.contains('dirty') && content.value.trim()) {
          localStorage.setItem(draftKey, JSON.stringify(collect()));
        }
      } catch {
        /* 存储配额或隐私模式下忽略 */
      }
    }
    ac.abort();
    offTheme?.();
    document.body.classList.remove('writer-mode');
  };

  let cover = existing?.cover ?? '';
  let images = existing?.images ?? [];
  const draftKey = `qz.draft.${editId || 'new'}`;
  let mode: Mode = readMode();
  let splitRatio = Number(localStorage.getItem(LS_SPLIT)) || 50;

  document.body.classList.add('writer-mode');

  root.innerHTML = `<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${editId ? `#/post/${editId}` : '#/home'}" title="返回">${icon('back', 16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${esc(existing?.title ?? '')}" autocomplete="off">
      <span class="wr-state" id="save-state">未保存</span>
      <div class="wr-modes" id="mode-switch">
        <button data-mode="edit" title="只显示编辑区（Ctrl+Shift+E）">编辑</button>
        <button data-mode="split" title="左右分屏（Ctrl+Shift+S）">分屏</button>
        <button data-mode="preview" title="只看效果（Ctrl+Shift+V）">预览</button>
      </div>
      <div class="wr-tools">
        <button class="wr-ibtn" id="btn-outline" title="大纲">${icon('outline', 16)}</button>
        <button class="wr-ibtn wr-only-mobile" id="btn-eye" title="预览">${icon('eye', 16)}</button>
        <button class="wr-ibtn" id="btn-side" title="封面与可见范围">${icon('settings', 16)}</button>
        <button class="wr-ibtn" id="btn-full" title="全屏写作（F11）">${icon('expand', 15)}</button>
        ${themeToggleHTML('btn-theme', 16, 'wr-ibtn')}
        <button class="wr-ibtn" id="btn-help" title="快捷键（Ctrl+/）">?</button>
        <button class="btn btn-primary btn-sm" id="save-btn">${icon('check', 13)} ${editId ? '保存修改' : '发布'}</button>
      </div>
    </header>

    <div class="wr-draft" id="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="wr-body" id="body" data-mode="${mode}" style="--split:${splitRatio}%">
      <section class="wr-pane wr-edit" id="pane-edit">
        <div class="wr-toolbar" id="toolbar">
          <div class="tb-group">
            <button class="tb-btn" data-cmd="h1" title="一级标题（Ctrl+1）">H1</button>
            <button class="tb-btn" data-cmd="h2" title="二级标题（Ctrl+2）">H2</button>
            <button class="tb-btn" data-cmd="h3" title="三级标题（Ctrl+3）">H3</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="bold" title="加粗（Ctrl+B）"><b>B</b></button>
            <button class="tb-btn" data-cmd="italic" title="斜体（Ctrl+I）"><i>I</i></button>
            <button class="tb-btn" data-cmd="strike" title="删除线"><s>S</s></button>
            <button class="tb-btn" data-cmd="code" title="行内代码（Ctrl+E）">${icon('codeInline', 15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="quote" title="引用">${icon('message', 15)}</button>
            <button class="tb-btn" data-cmd="codeblock" title="代码块（Ctrl+Shift+C）">${icon('codeBlock', 15)}</button>
            <button class="tb-btn" data-cmd="ul" title="无序列表">${icon('listUl', 15)}</button>
            <button class="tb-btn" data-cmd="ol" title="有序列表">${icon('listOl', 15)}</button>
            <button class="tb-btn" data-cmd="task" title="任务列表">${icon('task', 15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="link" title="链接（Ctrl+K）">${icon('link', 15)}</button>
            <label class="tb-btn" title="插入图片（也可直接粘贴或拖入）">
              ${icon('image', 15)}<input type="file" id="img-input" accept="image/*" multiple hidden>
            </label>
            <button class="tb-btn" data-cmd="table" title="表格">${icon('table', 15)}</button>
            <button class="tb-btn" data-cmd="hr" title="分割线">—</button>
          </div>
          <span class="tb-hint" id="tb-hint">Ctrl+V 直接粘贴截图</span>
        </div>
        <div class="wr-scroll" id="edit-scroll">
          <textarea class="wr-input" id="content" spellcheck="false" wrap="soft" placeholder="从这里开始写…

## 小标题
- 列表项，回车自动续行
> 引用一段话

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${esc(existing?.content ?? '')}</textarea>
        </div>
      </section>

      <div class="wr-splitter" id="splitter" title="拖动调整左右比例"><i></i></div>

      <section class="wr-pane wr-preview" id="pane-preview">
        <div class="wr-pv-bar">
          <span>预览</span>
          <span class="wr-pv-meta" id="pv-meta"></span>
        </div>
        <div class="wr-scroll" id="pv-scroll">
          <div class="md-preview markdown" id="preview"></div>
        </div>
      </section>

      <aside class="wr-drawer wr-outline" id="outline" data-open="false">
        <div class="wr-drawer-head">
          <b>大纲</b>
          <button class="wr-ibtn" data-close="outline" title="关闭">${icon('close', 14)}</button>
        </div>
        <div class="wr-outline-list" id="outline-list"></div>
      </aside>

      <aside class="wr-drawer wr-side" id="side" data-open="false">
        <div class="wr-drawer-head">
          <b>文章设置</b>
          <button class="wr-ibtn" data-close="side" title="关闭">${icon('close', 14)}</button>
        </div>
        <div class="wr-drawer-body">
          <section class="rail-card">
            <h3>封面</h3>
            <div class="cover-slot" id="cover-slot">
              ${cover ? `<img src="${esc(cover)}" alt="">` : '<span>点击上传封面</span>'}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${esc(existing?.category ?? '随笔')}">
              <datalist id="cat-list">${CATEGORIES.map((c) => `<option value="${c}">`).join('')}</datalist>
            </label>
            <label class="field">
              <span>可见范围</span>
              <select class="input" id="visibility">
                <option value="public" ${existing?.visibility === 'public' ? 'selected' : ''}>所有人可见</option>
                <option value="unlisted" ${existing?.visibility === 'unlisted' ? 'selected' : ''}>不公开列出（仅链接可见）</option>
                <option value="private" ${existing?.visibility === 'private' ? 'selected' : ''}>仅自己可见</option>
              </select>
            </label>
            <label class="checkline">
              <input type="checkbox" id="pinned" ${existing?.pinned ? 'checked' : ''}>
              <span>在首页置顶</span>
            </label>
          </section>
          <section class="rail-card">
            <h3>正文配图</h3>
            <div class="editor-thumbs" id="thumbs">
              ${images.map((u) => `<img src="${esc(u)}" alt="" data-zoom="${esc(u)}">`).join('') || '<span class="muted">还没有配图</span>'}
            </div>
          </section>
        </div>
      </aside>
    </div>

    <footer class="wr-status">
      <span id="stat-words">0 字</span>
      <span class="dot">·</span>
      <span id="stat-read">约 1 分钟</span>
      <span class="dot">·</span>
      <span id="stat-cursor">第 1 行</span>
      <span class="wr-grow"></span>
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${IMAGE_LIMIT_MB}MB 内图片自动压缩</span>
    </footer>

    <div class="wr-help" id="help" hidden>
      <div class="wr-help-card">
        <div class="wr-help-head">
          <b>快捷键</b>
          <button class="wr-ibtn" id="help-close">${icon('close', 14)}</button>
        </div>
        <div class="wr-help-grid">
          ${[
            ['Ctrl + B / I', '加粗 / 斜体'],
            ['Ctrl + E', '行内代码'],
            ['Ctrl + K', '插入链接'],
            ['Ctrl + 1 / 2 / 3', '一 / 二 / 三级标题'],
            ['Ctrl + Shift + C', '代码块'],
            ['Ctrl + Shift + 8 / 7', '无序 / 有序列表'],
            ['Ctrl + Shift + Q', '引用'],
            ['Ctrl + Shift + E / S / V', '编辑 / 分屏 / 预览'],
            ['Ctrl + S', '保存'],
            ['Tab / Shift + Tab', '整行缩进 / 反缩进'],
            ['Ctrl + V', '粘贴截图直接插图'],
            ['Ctrl + /', '打开本面板'],
          ]
            .map(([k, v]) => `<div class="k"><kbd>${k}</kbd><span>${v}</span></div>`)
            .join('')}
        </div>
      </div>
    </div>
  </div>`;

  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  offTheme = bindThemeToggle(root, 'btn-theme');

  const title = q<HTMLInputElement>('#title');
  const content = q<HTMLTextAreaElement>('#content');
  const preview = q<HTMLElement>('#preview');
  const body = q<HTMLElement>('#body');
  const splitter = q<HTMLElement>('#splitter');
  const pvScroll = q<HTMLElement>('#pv-scroll');
  const thumbs = q<HTMLElement>('#thumbs');
  const saveState = q<HTMLElement>('#save-state');
  const wordsEl = q<HTMLElement>('#stat-words');
  const readEl = q<HTMLElement>('#stat-read');
  const cursorEl = q<HTMLElement>('#stat-cursor');
  const pvMeta = q<HTMLElement>('#pv-meta');
  const draftBar = q<HTMLElement>('#draft-bar');
  const outline = q<HTMLElement>('#outline');
  const outlineList = q<HTMLElement>('#outline-list');
  const side = q<HTMLElement>('#side');
  const help = q<HTMLElement>('#help');

  /* ---------- 视图模式 ---------- */

  const setMode = (m: Mode) => {
    mode = m;
    body.dataset.mode = m;
    localStorage.setItem(LS_MODE, m);
    root.querySelectorAll<HTMLElement>('#mode-switch button').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === m);
    });
    q('#btn-eye').classList.toggle('on', m === 'preview');
    if (m === 'preview') {
      paintPreview(true);
    } else {
      content.focus();
    }
  };

  root.querySelectorAll<HTMLElement>('#mode-switch button').forEach((b) => {
    b.addEventListener('click', () => setMode(b.dataset.mode as Mode));
  });
  q('#btn-eye').addEventListener('click', () => setMode(mode === 'edit' ? 'preview' : 'edit'));

  /* ---------- 抽屉 ---------- */

  const setDrawer = (el: HTMLElement, open: boolean) => {
    el.dataset.open = String(open);
    if (el === outline) q('#btn-outline').classList.toggle('on', open);
    if (el === side) q('#btn-side').classList.toggle('on', open);
  };

  q('#btn-outline').addEventListener('click', () => setDrawer(outline, outline.dataset.open !== 'true'));
  q('#btn-side').addEventListener('click', () => setDrawer(side, side.dataset.open !== 'true'));
  root.querySelectorAll<HTMLElement>('[data-close]').forEach((b) => {
    b.addEventListener('click', () => setDrawer(b.dataset.close === 'side' ? side : outline, false));
  });

  /* ---------- 全屏 ---------- */

  const wr = q<HTMLElement>('#wr');
  const btnFull = q<HTMLElement>('#btn-full');
  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wr.requestFullscreen?.().catch(() => toast('当前环境不支持全屏', 'err'));
  };
  btnFull.addEventListener('click', toggleFull);
  document.addEventListener('fullscreenchange', () => {
    const on = !!document.fullscreenElement;
    btnFull.innerHTML = on ? icon('compress', 15) : icon('expand', 15);
    btnFull.classList.toggle('on', on);
    btnFull.title = on ? '退出全屏' : '全屏写作';
  }, { signal: ac.signal });

  /* ---------- 预览与统计 ---------- */

  function paintPreview(now = false) {
    window.clearTimeout(renderTimer);
    const run = () => {
      if (disposed) return;
      const src = content.value;
      preview.innerHTML = src.trim() ? renderMarkdown(src) : '<p class="muted">预览会显示在这里</p>';
      const blocks = preview.querySelectorAll('h1,h2,h3,h4,p,li,pre,blockquote,table').length;
      pvMeta.textContent = `${blocks} 个段落`;
    };
    if (now) run();
    else renderTimer = window.setTimeout(run, 140);
  }

  function stats() {
    const src = content.value;
    const cjk = (src.match(/[\u3400-\u9fa5]/g) ?? []).length;
    const latin = (src.replace(/[\u3400-\u9fa5]/g, ' ').match(/[A-Za-z0-9_]+/g) ?? []).length;
    const n = cjk + latin;
    wordsEl.textContent = `${n.toLocaleString()} 字`;
    readEl.textContent = `约 ${Math.max(1, Math.round(n / 400))} 分钟`;
  }

  function cursorInfo() {
    const pos = content.selectionStart;
    const before = content.value.slice(0, pos);
    const line = before.split('\n').length;
    const col = pos - (before.lastIndexOf('\n') + 1) + 1;
    cursorEl.textContent = `第 ${line} 行 · 第 ${col} 列`;
  }

  function paintOutline() {
    window.clearTimeout(outlineTimer);
    outlineTimer = window.setTimeout(() => {
      if (disposed) return;
      const heads = collectHeadings(content.value);
      if (!heads.length) {
        outlineList.innerHTML = '<p class="muted">标题会出现在这里</p>';
        return;
      }
      outlineList.innerHTML = heads
        .map(
          (h, i) =>
            `<button class="ol-item lv${h.level}" data-i="${i}"><span>${esc(h.text)}</span></button>`,
        )
        .join('');
      outlineList.querySelectorAll<HTMLElement>('.ol-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          const h = heads[Number(btn.dataset.i)];
          if (h) scrollToOffset(h.offset);
          if (window.innerWidth < 1000) setDrawer(outline, false);
        });
      });
    }, 260);
  }

  /** 把 textarea 滚到某个字符偏移处：用同宽同字体的镜像元素量高度。 */
  function scrollToOffset(offset: number) {
    const cs = getComputedStyle(content);
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const mirror = document.createElement('div');
    mirror.style.cssText = [
      'position:absolute',
      'visibility:hidden',
      'top:0',
      'left:0',
      `width:${Math.max(80, content.clientWidth - pad)}px`,
      `font:${cs.font}`,
      `line-height:${cs.lineHeight}`,
      `letter-spacing:${cs.letterSpacing}`,
      'white-space:pre-wrap',
      'overflow-wrap:break-word',
      'word-break:break-word',
    ].join(';');
    const lineStart = content.value.lastIndexOf('\n', offset - 1) + 1;
    mirror.textContent = content.value.slice(0, lineStart);
    document.body.appendChild(mirror);
    const h = mirror.getBoundingClientRect().height;
    mirror.remove();
    // textarea 自己滚动（height:100%），外层容器没有滚动量
    content.scrollTop = Math.max(0, h - 8);
    content.focus();
    content.setSelectionRange(offset, offset);
    cursorInfo();
  }

  /* ---------- 草稿 ---------- */

  const readDraft = (): Draft | null => {
    try {
      const raw = localStorage.getItem(draftKey);
      return raw ? (JSON.parse(raw) as Draft) : null;
    } catch {
      return null;
    }
  };

  const collect = (): Draft => ({
    title: title.value,
    content: content.value,
    category: q<HTMLInputElement>('#category')?.value ?? '随笔',
    visibility: q<HTMLSelectElement>('#visibility')?.value ?? 'public',
    pinned: q<HTMLInputElement>('#pinned')?.checked ?? false,
    cover,
    savedAt: Date.now(),
  });

  const queueSave = () => {
    window.clearTimeout(saveTimer);
    saveState.textContent = '未保存';
    saveState.classList.add('dirty');
    saveTimer = window.setTimeout(() => {
      if (disposed || published) return;
      localStorage.setItem(draftKey, JSON.stringify(collect()));
      const t = new Date();
      saveState.textContent = `已存草稿 ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
      saveState.classList.remove('dirty');
    }, 1200);
  };

  const draft = readDraft();
  if (draft && (draft.content !== (existing?.content ?? '') || draft.title !== (existing?.title ?? ''))) {
    const t = new Date(draft.savedAt);
    q('#draft-text').textContent =
      `发现 ${t.getMonth() + 1} 月 ${t.getDate()} 日 ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')} 的草稿`;
    draftBar.hidden = false;
    q('#draft-restore').addEventListener('click', () => {
      title.value = draft.title;
      content.value = draft.content;
      q<HTMLInputElement>('#category').value = draft.category || '随笔';
      q<HTMLSelectElement>('#visibility').value = draft.visibility || 'public';
      q<HTMLInputElement>('#pinned').checked = !!draft.pinned;
      cover = draft.cover || cover;
      if (cover) setCoverPreview(cover);
      draftBar.hidden = true;
      refresh();
      paintPreview(true);
      toast('已恢复草稿', 'ok');
    });
    q('#draft-discard').addEventListener('click', () => {
      localStorage.removeItem(draftKey);
      draftBar.hidden = true;
    });
  }

  /* ---------- 编辑命令 ---------- */

  const refresh = () => {
    stats();
    cursorInfo();
    paintPreview();
    paintOutline();
    queueSave();
  };

  /** 用 execCommand 替换区间：保留原生撤销（Ctrl+Z）。 */
  const replaceRange = (start: number, end: number, text: string, selStart: number, selEnd: number) => {
    content.focus();
    content.setSelectionRange(start, end);
    let ok = false;
    try {
      ok = document.execCommand('insertText', false, text);
    } catch {
      ok = false;
    }
    if (!ok) content.setRangeText(text, start, end, 'end');
    content.setSelectionRange(selStart, selEnd);
    refresh();
  };

  const insert = (text: string, selectFrom = 0, selectTo = 0) => {
    const s = content.selectionStart;
    const e = content.selectionEnd;
    replaceRange(s, e, text, s + selectFrom, s + (selectTo || text.length));
  };

  const wrap = (before: string, after: string, placeholder: string) => {
    const s = content.selectionStart;
    const e = content.selectionEnd;
    const sel = content.value.slice(s, e) || placeholder;
    replaceRange(s, e, before + sel + after, s + before.length, s + before.length + sel.length);
  };

  const lineBounds = () => {
    const s = content.selectionStart;
    const e = content.selectionEnd;
    const lineStart = content.value.lastIndexOf('\n', Math.max(0, s - 1)) + 1;
    const nl = content.value.indexOf('\n', e);
    const lineEnd = nl === -1 ? content.value.length : nl;
    return { lineStart, lineEnd };
  };

  const prefixLines = (prefix: string, placeholder: string) => {
    const { lineStart, lineEnd } = lineBounds();
    const block = content.value.slice(lineStart, lineEnd) || placeholder;
    const lines = block.split('\n');
    const all = lines.every((l) => l.startsWith(prefix));
    const next = lines
      .map((l) => (all ? l.slice(prefix.length) : prefix + l.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/, '')))
      .join('\n');
    replaceRange(lineStart, lineEnd, next, lineStart, lineStart + next.length);
  };

  const commands: Record<string, () => void> = {
    h1: () => prefixLines('# ', '一级标题'),
    h2: () => prefixLines('## ', '二级标题'),
    h3: () => prefixLines('### ', '三级标题'),
    bold: () => wrap('**', '**', '加粗文字'),
    italic: () => wrap('*', '*', '斜体文字'),
    strike: () => wrap('~~', '~~', '删除线'),
    code: () => wrap('`', '`', 'code'),
    quote: () => prefixLines('> ', '引用一段话'),
    ul: () => prefixLines('- ', '列表项'),
    ol: () => prefixLines('1. ', '列表项'),
    task: () => prefixLines('- [ ] ', '待办事项'),
    codeblock: () => insert(`\n${FENCE}\n// code\n${FENCE}\n`, FENCE.length + 2, FENCE.length + 9),
    hr: () => insert('\n---\n'),
    link: () => {
      const sel = content.value.slice(content.selectionStart, content.selectionEnd);
      insert(`[${sel || '链接文字'}](https://)`, sel ? sel.length + 3 : 1, sel ? sel.length + 11 : 5);
    },
    table: () => insert('\n| 列一 | 列二 |\n| --- | --- |\n| 内容 | 内容 |\n'),
  };

  q('#toolbar').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-cmd]');
    if (!btn) return;
    e.preventDefault();
    commands[btn.dataset.cmd ?? '']?.();
  });

  /* ---------- 智能回车 / Tab 缩进 ---------- */

  const LIST_RE = /^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/;

  const continueList = (): boolean => {
    const pos = content.selectionStart;
    if (pos !== content.selectionEnd) return false;
    const lineStart = content.value.lastIndexOf('\n', pos - 1) + 1;
    const line = content.value.slice(lineStart, pos);
    const m = line.match(LIST_RE);
    if (!m) return false;

    const [, indent, marker, task] = m;
    const bodyText = line.slice(m[0].length).trim();
    // 空项目连续回车：退出列表
    if (!bodyText) {
      replaceRange(lineStart, pos, '', lineStart, lineStart);
      return true;
    }
    let next = '\n' + indent;
    if (/^\d+\.$/.test(marker)) {
      next += `${parseInt(marker, 10) + 1}. `;
    } else {
      next += marker + ' ';
    }
    if (task) next += '[ ] ';
    replaceRange(pos, pos, next, pos + next.length, pos + next.length);
    return true;
  };

  const indentLines = (outdent: boolean) => {
    const { lineStart, lineEnd } = lineBounds();
    const block = content.value.slice(lineStart, lineEnd);
    const lines = block.split('\n');
    const next = lines.map((l) => (outdent ? l.replace(/^ {1,2}|^\t/, '') : '  ' + l)).join('\n');
    const caretOnly = content.selectionStart === content.selectionEnd;
    let ns = lineStart;
    let ne = lineStart + next.length;
    if (caretOnly) {
      const offsetInLine = content.selectionStart - lineStart;
      const removed = (lines[0].match(/^ {1,2}|^\t/) ?? [''])[0].length;
      const nextOffset = outdent ? Math.max(0, offsetInLine - removed) : offsetInLine + 2;
      ns = lineStart + nextOffset;
      ne = ns;
    }
    replaceRange(lineStart, lineEnd, next, ns, ne);
  };

  content.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    if (e.key === 'Tab') {
      e.preventDefault();
      indentLines(e.shiftKey);
      return;
    }

    if (!mod && e.key === 'Enter' && !e.altKey && !e.isComposing) {
      if (continueList()) {
        e.preventDefault();
        return;
      }
    }

    if (!mod) return;

    if (e.shiftKey) {
      if (key === 'c') {
        e.preventDefault();
        commands.codeblock();
      } else if (e.key === '8' || e.key === '*') {
        e.preventDefault();
        commands.ul();
      } else if (e.key === '7' || e.key === '&') {
        e.preventDefault();
        commands.ol();
      } else if (key === 'q') {
        e.preventDefault();
        commands.quote();
      } else if (key === 'e') {
        e.preventDefault();
        setMode('edit');
      } else if (key === 's') {
        e.preventDefault();
        setMode('split');
      } else if (key === 'v') {
        e.preventDefault();
        setMode('preview');
      }
      return;
    }

    if (key === 'b') {
      e.preventDefault();
      commands.bold();
    } else if (key === 'i') {
      e.preventDefault();
      commands.italic();
    } else if (key === 'k') {
      e.preventDefault();
      commands.link();
    } else if (key === 'e') {
      e.preventDefault();
      commands.code();
    } else if (key === 's') {
      e.preventDefault();
      void save();
    } else if (key === '1' || key === '2' || key === '3') {
      e.preventDefault();
      commands[`h${key}`]();
    } else if (key === '/') {
      e.preventDefault();
      toggleHelp();
    }
  });

  content.addEventListener('keyup', cursorInfo);
  content.addEventListener('click', cursorInfo);
  content.addEventListener('select', cursorInfo);
  content.addEventListener('input', refresh);

  /* ---------- 滚动同步 ---------- */

  let syncing = false;
  const syncScroll = (from: HTMLElement, to: HTMLElement) => {
    if (mode !== 'split') return;
    if (syncing) return;
    syncing = true;
    const fromMax = from.scrollHeight - from.clientHeight;
    const ratio = fromMax > 0 ? from.scrollTop / fromMax : 0;
    to.scrollTop = ratio * (to.scrollHeight - to.clientHeight);
    requestAnimationFrame(() => {
      syncing = false;
    });
  };
  content.addEventListener('scroll', () => syncScroll(content, pvScroll), { passive: true });
  pvScroll.addEventListener('scroll', () => syncScroll(pvScroll, content), { passive: true });

  /* ---------- 拖拽分屏 ---------- */

  splitter.addEventListener('pointerdown', (e) => {
    if (mode !== 'split') {
      setMode('split');
    }
    e.preventDefault();
    splitter.setPointerCapture(e.pointerId);
    splitter.classList.add('dragging');
    document.body.classList.add('wr-resizing');

    const move = (ev: PointerEvent) => {
      const rect = body.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(78, Math.max(22, pct));
      splitRatio = clamped;
      body.style.setProperty('--split', `${clamped}%`);
    };
    const up = () => {
      splitter.classList.remove('dragging');
      document.body.classList.remove('wr-resizing');
      localStorage.setItem(LS_SPLIT, String(Math.round(splitRatio)));
      splitter.removeEventListener('pointermove', move);
      splitter.removeEventListener('pointerup', up);
      splitter.removeEventListener('pointercancel', up);
    };
    splitter.addEventListener('pointermove', move);
    splitter.addEventListener('pointerup', up);
    splitter.addEventListener('pointercancel', up);
  });

  splitter.addEventListener('dblclick', () => {
    splitRatio = 50;
    body.style.setProperty('--split', '50%');
    localStorage.setItem(LS_SPLIT, '50');
  });

  /* ---------- 插图（选择 / 粘贴 / 拖拽） ---------- */

  const busy = new Set<string>();

  const uploadAndInsert = async (files: File[], alt = '图片') => {
    const list = files.filter((f) => {
      if (f.type.startsWith('image/')) return true;
      toast('只能插入图片文件', 'err');
      return false;
    });
    if (!list.length) return;

    // 3 路并发压缩上传，但按原顺序插入，行文顺序不会被并发打乱
    type Done = { url: string; name: string; note: string | null };
    const done: (Done | null)[] = new Array(list.length).fill(null);
    let cursor = 0;

    const worker = async () => {
      while (cursor < list.length) {
        const i = cursor++;
        const f = list[i];
        const key = `${f.name}-${f.size}`;
        if (busy.has(key)) continue;
        busy.add(key);
        try {
          const prepared = await prepareImage(f);
          if (prepared.size > IMAGE_LIMIT_MB * 1024 * 1024) {
            throw new Error(`压缩后仍有 ${mb(prepared.size)}，超过上限`);
          }
          const { url } = await api.upload(prepared.file);
          done[i] = {
            url,
            name: (f.name || alt).replace(/\.[^.]+$/, '') || alt,
            note: prepared.compressed ? `已压缩 ${mb(prepared.originalSize)} → ${mb(prepared.size)}` : null,
          };
        } catch (err) {
          toast((err as Error).message, 'err');
        } finally {
          busy.delete(key);
        }
      }
    };

    toast(list.length > 1 ? `正在处理 ${list.length} 张…` : `正在处理 ${list[0].name || alt}…`);
    await Promise.all([worker(), worker(), worker()]);

    let compressed = 0;
    for (const d of done) {
      if (!d) continue;
      images.push(d.url);
      insert(`\n![${d.name}](${d.url})\n`);
      if (d.note) compressed++;
    }
    thumbs.innerHTML = images.map((u) => `<img src="${esc(u)}" alt="">`).join('');
    const ok = done.filter(Boolean).length;
    if (ok) toast(compressed ? `${ok} 张已插入，其中 ${compressed} 张经过压缩` : `${ok} 张图片已插入`, 'ok');
  };

  content.addEventListener('paste', (e) => {
    const dt = e.clipboardData;
    if (!dt) return;
    const files = Array.from(dt.items)
      .filter((i) => i.kind === 'file' && i.type.startsWith('image/'))
      .map((i) => i.getAsFile())
      .filter((f): f is File => !!f);
    if (!files.length) return;
    e.preventDefault();
    void uploadAndInsert(files, '粘贴的图片');
  });

  const paneEdit = q<HTMLElement>('#pane-edit');
  paneEdit.addEventListener('dragover', (e) => {
    if (e.dataTransfer?.types.includes('Files')) {
      e.preventDefault();
      paneEdit.classList.add('dropping');
    }
  });
  paneEdit.addEventListener('dragleave', () => paneEdit.classList.remove('dropping'));
  paneEdit.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer?.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    e.preventDefault();
    paneEdit.classList.remove('dropping');
    void uploadAndInsert(files);
  });

  q<HTMLInputElement>('#img-input').addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) await uploadAndInsert(files);
    input.value = '';
  });

  /* ---------- 封面 ---------- */

  const coverSlot = q<HTMLElement>('#cover-slot');
  const coverInput = q<HTMLInputElement>('#cover-input');

  // 只换图，不重建 slot —— 里面还有 file input，重建会让第二次上传失效
  const setCoverPreview = (url: string) => {
    coverSlot.querySelector('img')?.remove();
    coverSlot.querySelector('span')?.remove();
    coverSlot.insertAdjacentHTML('afterbegin', url ? `<img src="${esc(url)}" alt="">` : '<span>点击上传封面</span>');
  };
  coverSlot.addEventListener('click', () => coverInput.click());
  coverInput.addEventListener('change', async () => {
    const f = coverInput.files?.[0];
    if (!f) return;
    try {
      const prepared = await prepareImage(f);
      const { url } = await api.upload(prepared.file);
      cover = url;
      setCoverPreview(url);
      queueSave();
      toast('封面已更新', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  /* ---------- 快捷键面板 ---------- */

  function toggleHelp(force?: boolean) {
    const show = force ?? help.hidden;
    help.hidden = !show;
  }
  q('#btn-help').addEventListener('click', () => toggleHelp());
  q('#help-close').addEventListener('click', () => toggleHelp(false));
  help.addEventListener('click', (e) => {
    if (e.target === help) toggleHelp(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!help.hidden) toggleHelp(false);
      else if (outline.dataset.open === 'true') setDrawer(outline, false);
      else if (side.dataset.open === 'true') setDrawer(side, false);
    }
  }, { signal: ac.signal });

  /* ---------- 保存 ---------- */

  title.addEventListener('input', queueSave);
  root.querySelectorAll('#category,#visibility,#pinned').forEach((el) => el.addEventListener('change', queueSave));

  const save = async () => {
    const payload = {
      title: title.value.trim(),
      content: content.value,
      cover,
      category: q<HTMLInputElement>('#category').value.trim() || '随笔',
      visibility: q<HTMLSelectElement>('#visibility').value,
      pinned: q<HTMLInputElement>('#pinned').checked,
      images,
    };
    if (!payload.title && !payload.content.trim()) {
      toast('写个标题或正文再发布', 'err');
      return;
    }
    const btn = q<HTMLButtonElement>('#save-btn');
    btn.disabled = true;
    btn.textContent = '保存中…';
    try {
      const saved = editId ? await api.updatePost(editId, payload) : await api.createPost(payload);
      published = true;
      window.clearTimeout(saveTimer);
      localStorage.removeItem(draftKey);
      toast(editId ? '已保存' : '已发布', 'ok');
      location.hash = `#/post/${saved.id}`;
    } catch (err) {
      toast((err as Error).message, 'err');
      btn.disabled = false;
      btn.innerHTML = `${icon('check', 13)} ${editId ? '保存修改' : '发布'}`;
    }
  };
  q('#save-btn').addEventListener('click', () => void save());

  window.addEventListener('beforeunload', (e) => {
    if (saveState.classList.contains('dirty') && content.value.trim()) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, { signal: ac.signal });

  /* ---------- 初始化 ---------- */

  stats();
  cursorInfo();
  paintOutline();
  paintPreview(true);
  setMode(mode);

  // 标题里回车直接跳到正文
  title.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      content.focus();
      content.setSelectionRange(0, 0);
    }
  });

  if (window.innerWidth < 1000 && !existing?.title) {
    title.focus();
  } else {
    content.focus();
    content.setSelectionRange(content.value.length, content.value.length);
  }
}

function readMode(): Mode {
  const saved = localStorage.getItem(LS_MODE);
  if (saved === 'edit' || saved === 'split' || saved === 'preview') return saved;
  return window.innerWidth >= 1000 ? 'split' : 'edit';
}

function collectHeadings(src: string): Heading[] {
  const heads: Heading[] = [];
  const re = /^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    // 跳过代码块里的 # 号标题
    const before = src.slice(0, m.index);
    const fences = (before.match(/^```/gm) ?? []).length;
    if (fences % 2 === 1) continue;
    heads.push({ level: m[1].length, text: m[2].replace(/[*_`~]/g, ''), offset: m.index });
  }
  return heads;
}
