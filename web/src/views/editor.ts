import { api, type PostView } from '../api';
import { mb, prepareImage } from '../image';
import { renderMarkdown } from '../md';
import { esc, icon, toast } from '../ui';
import type { ViewCtx } from '../types';

const CATEGORIES = ['随笔', '城市', '旅行', '技术', '阅读', '生活'];
const FENCE = String.fromCharCode(96).repeat(3);
const IMAGE_LIMIT_MB = 30;

type Mode = 'edit' | 'split' | 'preview';

interface Draft {
  title: string;
  content: string;
  category: string;
  visibility: string;
  pinned: boolean;
  cover: string;
  savedAt: number;
}

/** 写作页：Markdown 工具栏 + 分屏预览 + 粘贴/拖拽插图 + 草稿自动保存。 */
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

  let cover = existing?.cover ?? '';
  const images = existing?.images ?? [];
  const draftKey = `qz.draft.${editId || 'new'}`;
  let mode: Mode = window.innerWidth >= 1100 ? 'split' : 'edit';

  root.innerHTML = `<div class="page">
    <div class="editor-head">
      <a class="back-link" href="${editId ? `#/post/${editId}` : '#/home'}">${icon('back', 14)} 返回</a>
      <div class="editor-actions">
        <span class="save-state" id="save-state">未保存</span>
        <div class="mode-switch" id="mode-switch">
          <button data-mode="edit" title="只显示编辑区">编辑</button>
          <button data-mode="split" title="左右分屏">分屏</button>
          <button data-mode="preview" title="只看效果">预览</button>
        </div>
        <button class="btn btn-primary btn-sm" id="save-btn">${icon('check', 13)} ${editId ? '保存修改' : '发布'}</button>
      </div>
    </div>

    <div id="draft-bar" class="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="editor-grid">
      <div class="editor-main card">
        <input class="title-input" id="title" maxlength="80" placeholder="标题" value="${esc(existing?.title ?? '')}">

        <div class="md-toolbar" id="toolbar">
          <div class="tb-group">
            <button class="tb-btn" data-cmd="h1" title="一级标题">H1</button>
            <button class="tb-btn" data-cmd="h2" title="二级标题">H2</button>
            <button class="tb-btn" data-cmd="h3" title="三级标题">H3</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="bold" title="加粗（Ctrl+B）"><b>B</b></button>
            <button class="tb-btn" data-cmd="italic" title="斜体（Ctrl+I）"><i>I</i></button>
            <button class="tb-btn" data-cmd="strike" title="删除线"><s>S</s></button>
            <button class="tb-btn" data-cmd="code" title="行内代码">${icon('codeInline', 15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="quote" title="引用">${icon('message', 15)}</button>
            <button class="tb-btn" data-cmd="codeblock" title="代码块">${icon('codeBlock', 15)}</button>
            <button class="tb-btn" data-cmd="ul" title="无序列表">${icon('listUl', 15)}</button>
            <button class="tb-btn" data-cmd="ol" title="有序列表">${icon('listOl', 15)}</button>
            <button class="tb-btn" data-cmd="task" title="任务列表">${icon('task', 15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="link" title="链接（Ctrl+K）">${icon('link', 15)}</button>
            <label class="tb-btn" title="插入图片（也可直接粘贴/拖入）">
              ${icon('image', 15)}<input type="file" id="img-input" accept="image/*" multiple hidden>
            </label>
            <button class="tb-btn" data-cmd="table" title="表格">${icon('table', 15)}</button>
            <button class="tb-btn" data-cmd="hr" title="分割线">—</button>
          </div>
          <span class="tb-hint">可直接粘贴截图</span>
        </div>

        <div class="editor-split" id="split" data-mode="${mode}">
          <textarea class="md-input" id="content" spellcheck="false" placeholder="从这里开始写…

## 小标题
- 列表项
> 引用一段话

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${esc(existing?.content ?? '')}</textarea>
          <div class="md-preview markdown" id="preview"></div>
        </div>

        <div class="editor-status">
          <span id="stat-words">0 字</span>
          <span class="dot">·</span>
          <span id="stat-read">约 1 分钟</span>
          <span class="dot">·</span>
          <span class="status-note">图片单张上限 ${IMAGE_LIMIT_MB}MB，超过会自动压缩</span>
        </div>
      </div>

      <aside class="editor-side">
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
      </aside>
    </div>
  </div>`;

  const title = root.querySelector<HTMLInputElement>('#title')!;
  const content = root.querySelector<HTMLTextAreaElement>('#content')!;
  const preview = root.querySelector<HTMLElement>('#preview')!;
  const split = root.querySelector<HTMLElement>('#split')!;
  const thumbs = root.querySelector<HTMLElement>('#thumbs')!;
  const saveState = root.querySelector<HTMLElement>('#save-state')!;
  const wordsEl = root.querySelector<HTMLElement>('#stat-words')!;
  const readEl = root.querySelector<HTMLElement>('#stat-read')!;
  const draftBar = root.querySelector<HTMLElement>('#draft-bar')!;

  /* ---------- 预览与统计 ---------- */

  let renderTimer = 0;
  const paintPreview = () => {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => {
      if (mode === 'edit') return;
      preview.innerHTML = content.value.trim()
        ? renderMarkdown(content.value)
        : '<p class="muted">预览会显示在这里</p>';
    }, 120);
  };

  const stats = () => {
    const plain = content.value
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/[#>*_`~\-|]/g, '')
      .replace(/\s/g, '');
    const n = plain.length;
    wordsEl.textContent = `${n} 字`;
    readEl.textContent = `约 ${Math.max(1, Math.round(n / 400))} 分钟`;
  };

  const setMode = (m: Mode) => {
    mode = m;
    split.dataset.mode = m;
    root.querySelectorAll<HTMLElement>('#mode-switch button').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === m);
    });
    if (m !== 'edit') paintPreview();
  };

  root.querySelectorAll<HTMLElement>('#mode-switch button').forEach((b) => {
    b.addEventListener('click', () => setMode(b.dataset.mode as Mode));
  });

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
    category: root.querySelector<HTMLInputElement>('#category')!.value,
    visibility: root.querySelector<HTMLSelectElement>('#visibility')!.value,
    pinned: root.querySelector<HTMLInputElement>('#pinned')!.checked,
    cover,
    savedAt: Date.now(),
  });

  let saveTimer = 0;
  const queueSave = () => {
    window.clearTimeout(saveTimer);
    saveState.textContent = '未保存';
    saveState.classList.add('dirty');
    saveTimer = window.setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(collect()));
      const t = new Date();
      saveState.textContent = `已自动保存 ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
      saveState.classList.remove('dirty');
    }, 1200);
  };

  const draft = readDraft();
  if (draft && (draft.content !== (existing?.content ?? '') || draft.title !== (existing?.title ?? ''))) {
    const t = new Date(draft.savedAt);
    root.querySelector('#draft-text')!.textContent =
      `发现 ${t.getMonth() + 1} 月 ${t.getDate()} 日 ${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')} 的草稿`;
    draftBar.hidden = false;
    root.querySelector('#draft-restore')!.addEventListener('click', () => {
      title.value = draft.title;
      content.value = draft.content;
      (root.querySelector('#category') as HTMLInputElement).value = draft.category || '随笔';
      (root.querySelector('#visibility') as HTMLSelectElement).value = draft.visibility || 'public';
      (root.querySelector('#pinned') as HTMLInputElement).checked = !!draft.pinned;
      cover = draft.cover || cover;
      if (cover) root.querySelector('#cover-slot')!.innerHTML = `<img src="${esc(cover)}" alt="">`;
      draftBar.hidden = true;
      stats();
      paintPreview();
      toast('已恢复草稿', 'ok');
    });
    root.querySelector('#draft-discard')!.addEventListener('click', () => {
      localStorage.removeItem(draftKey);
      draftBar.hidden = true;
    });
  }

  /* ---------- 编辑命令 ---------- */

  const afterEdit = () => {
    stats();
    paintPreview();
    queueSave();
  };

  const insert = (text: string, selectFrom = 0, selectTo = 0) => {
    const s = content.selectionStart;
    const e = content.selectionEnd;
    content.value = content.value.slice(0, s) + text + content.value.slice(e);
    content.selectionStart = s + selectFrom;
    content.selectionEnd = s + (selectTo || text.length);
    content.focus();
    afterEdit();
  };

  const wrap = (before: string, after: string, placeholder: string) => {
    const s = content.selectionStart;
    const e = content.selectionEnd;
    const sel = content.value.slice(s, e) || placeholder;
    insert(before + sel + after, before.length, before.length + sel.length);
  };

  const prefixLines = (prefix: string, placeholder: string) => {
    const lineStart = content.value.lastIndexOf('\n', Math.max(0, content.selectionStart - 1)) + 1;
    const nl = content.value.indexOf('\n', content.selectionEnd);
    const lineEnd = nl === -1 ? content.value.length : nl;
    const block = content.value.slice(lineStart, lineEnd) || placeholder;
    const lines = block.split('\n');
    const all = lines.every((l) => l.startsWith(prefix));
    const next = lines
      .map((l) => (all ? l.slice(prefix.length) : prefix + l.replace(/^([-*+]\s+|\d+\.\s+|>\s+)/, '')))
      .join('\n');
    content.value = content.value.slice(0, lineStart) + next + content.value.slice(lineEnd);
    content.selectionStart = lineStart;
    content.selectionEnd = lineStart + next.length;
    content.focus();
    afterEdit();
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
    codeblock: () => insert(`\n${FENCE}\n// code\n${FENCE}\n`, FENCE.length + 2, FENCE.length + 10),
    hr: () => insert('\n---\n'),
    link: () => {
      const sel = content.value.slice(content.selectionStart, content.selectionEnd);
      insert(`[${sel || '链接文字'}](https://)`, sel ? sel.length + 3 : 1, sel ? sel.length + 11 : 5);
    },
    table: () => insert('\n| 列一 | 列二 |\n| --- | --- |\n| 内容 | 内容 |\n'),
  };

  root.querySelector('#toolbar')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-cmd]');
    if (!btn) return;
    e.preventDefault();
    commands[btn.dataset.cmd ?? '']?.();
  });

  /* ---------- 插图（选择 / 粘贴 / 拖拽） ---------- */

  const busy = new Set<string>();

  const uploadAndInsert = async (files: File[], alt = '图片') => {
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        toast('只能插入图片文件', 'err');
        continue;
      }
      const key = `${f.name}-${f.size}`;
      if (busy.has(key)) continue;
      busy.add(key);
      try {
        toast(`正在处理 ${f.name || alt}…`);
        const prepared = await prepareImage(f);
        if (prepared.size > IMAGE_LIMIT_MB * 1024 * 1024) {
          throw new Error(`压缩后仍有 ${mb(prepared.size)}，超过上限`);
        }
        const { url } = await api.upload(prepared.file);
        images.push(url);
        const name = (f.name || alt).replace(/\.[^.]+$/, '') || alt;
        insert(`\n![${name}](${url})\n`);
        thumbs.innerHTML = images.map((u) => `<img src="${esc(u)}" alt="" data-zoom="${esc(u)}">`).join('');
        toast(prepared.compressed ? `已压缩 ${mb(prepared.originalSize)} → ${mb(prepared.size)}` : '图片已插入', 'ok');
      } catch (err) {
        toast((err as Error).message, 'err');
      } finally {
        busy.delete(key);
      }
    }
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

  const main = root.querySelector<HTMLElement>('.editor-main')!;
  main.addEventListener('dragover', (e) => {
    if (e.dataTransfer?.types.includes('Files')) {
      e.preventDefault();
      main.classList.add('dropping');
    }
  });
  main.addEventListener('dragleave', () => main.classList.remove('dropping'));
  main.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer?.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    e.preventDefault();
    main.classList.remove('dropping');
    void uploadAndInsert(files);
  });

  root.querySelector<HTMLInputElement>('#img-input')!.addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) await uploadAndInsert(files);
    input.value = '';
  });

  /* ---------- 快捷键 ---------- */

  content.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (e.key === 'Tab') {
      e.preventDefault();
      insert('  ');
      return;
    }
    if (!mod) return;
    const k = e.key.toLowerCase();
    if (k === 'b') {
      e.preventDefault();
      commands.bold();
    } else if (k === 'i') {
      e.preventDefault();
      commands.italic();
    } else if (k === 'k') {
      e.preventDefault();
      commands.link();
    } else if (k === 's') {
      e.preventDefault();
      void save();
    }
  });

  /* ---------- 封面 ---------- */

  const coverSlot = root.querySelector<HTMLElement>('#cover-slot')!;
  const coverInput = root.querySelector<HTMLInputElement>('#cover-input')!;
  coverSlot.addEventListener('click', () => coverInput.click());
  coverInput.addEventListener('change', async () => {
    const f = coverInput.files?.[0];
    if (!f) return;
    try {
      const prepared = await prepareImage(f);
      const { url } = await api.upload(prepared.file);
      cover = url;
      coverSlot.innerHTML = `<img src="${esc(url)}" alt="">`;
      queueSave();
      toast('封面已更新', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  /* ---------- 保存 ---------- */

  title.addEventListener('input', queueSave);
  content.addEventListener('input', afterEdit);
  root.querySelectorAll('#category,#visibility,#pinned').forEach((el) => el.addEventListener('change', queueSave));

  const save = async () => {
    const body = {
      title: title.value.trim(),
      content: content.value,
      cover,
      category: root.querySelector<HTMLInputElement>('#category')!.value.trim() || '随笔',
      visibility: root.querySelector<HTMLSelectElement>('#visibility')!.value,
      pinned: root.querySelector<HTMLInputElement>('#pinned')!.checked,
      images,
    };
    if (!body.title && !body.content.trim()) {
      toast('写个标题或正文再发布', 'err');
      return;
    }
    const btn = root.querySelector<HTMLButtonElement>('#save-btn')!;
    btn.disabled = true;
    btn.textContent = '保存中…';
    try {
      const saved = editId ? await api.updatePost(editId, body) : await api.createPost(body);
      localStorage.removeItem(draftKey);
      toast(editId ? '已保存' : '已发布', 'ok');
      location.hash = `#/post/${saved.id}`;
    } catch (err) {
      toast((err as Error).message, 'err');
      btn.disabled = false;
      btn.innerHTML = `${icon('check', 13)} ${editId ? '保存修改' : '发布'}`;
    }
  };
  root.querySelector('#save-btn')!.addEventListener('click', () => void save());

  /* ---------- 初始化 ---------- */

  stats();
  setMode(mode);
  paintPreview();

  // 标题里回车直接跳到正文
  title.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      content.focus();
    }
  });
}
