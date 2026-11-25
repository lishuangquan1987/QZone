import { api, type JournalView } from '../api';
import { commentListHTML, journalCardHTML } from '../components';
import { me } from '../state';
import { avatarHTML, bindLightbox, esc, fullTime, icon, modal, text, toast } from '../ui';
import type { ViewCtx } from '../types';

const CATEGORIES = ['全部', '随笔', '城市', '旅行', '技术', '读书'];

/** 日志列表。 */
export async function renderJournals(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const cat = ctx.params.category || '全部';
  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('book', 18)} 日志</h2>
        <p class="module-sub">把长一点的想法，认真写下来。</p>
      </div>
      <button class="btn btn-primary" id="new-journal">${icon('plus', 15)} 写日志</button>
    </section>
    <nav class="chip-row">
      ${CATEGORIES.map(
        (c) => `<button class="chip ${c === cat ? 'active' : ''}" data-cat="${c}">${c}</button>`,
      ).join('')}
      <span class="chip-spacer"></span>
      <span class="chip-hint" id="journal-total"></span>
    </nav>
    <div id="journal-list" class="journal-list"></div>`;

  outlet.querySelectorAll<HTMLElement>('[data-cat]').forEach((b) => {
    b.addEventListener('click', () => {
      location.hash = `#/journals?category=${encodeURIComponent(b.dataset.cat ?? '全部')}`;
    });
  });

  const list = outlet.querySelector<HTMLElement>('#journal-list')!;
  const load = async () => {
    const r = await api.journals({ category: cat });
    outlet.querySelector('#journal-total')!.textContent = `共 ${r.journals.length} 篇`;
    list.innerHTML = r.journals.length
      ? r.journals.map(journalCardHTML).join('')
      : `<div class="card empty"><div class="empty-mark">${icon('book', 24)}</div>
          <p class="empty-title">这个分类下还没有日志</p>
          <p class="empty-desc">写一篇，从今天开始。</p></div>`;
  };
  await load();

  outlet.querySelector('#new-journal')!.addEventListener('click', () => void openJournalEditor(load));
}

/** 写日志弹窗。 */
async function openJournalEditor(onDone: () => Promise<void>): Promise<void> {
  let cover = '';
  await modal({
    title: '写日志',
    wide: true,
    confirmText: '发表',
    body: `<form class="editor-form" id="journal-form">
      <input class="input input-title" name="title" maxlength="60" placeholder="标题" required>
      <div class="editor-row">
        <input class="input" name="category" list="journal-cats" placeholder="分类" value="随笔" maxlength="12">
        <datalist id="journal-cats">${CATEGORIES.filter((c) => c !== '全部')
          .map((c) => `<option value="${c}">`)
          .join('')}</datalist>
        <input class="input" name="mood" placeholder="心情（如：平静）" maxlength="12">
        <input class="input" name="weather" placeholder="天气（如：晴）" maxlength="12">
      </div>
      <textarea class="textarea" name="content" rows="12" placeholder="正文…（支持换行）" required></textarea>
      <div class="editor-cover">
        <label class="tool">${icon('camera', 15)}<span>添加封面</span>
          <input type="file" accept="image/*" id="journal-cover" hidden>
        </label>
        <div id="journal-cover-preview"></div>
      </div>
    </form>`,
    onMount: (root) => {
      root.querySelector<HTMLInputElement>('#journal-cover')!.addEventListener('change', async (e) => {
        const f = (e.target as HTMLInputElement).files?.[0];
        if (!f) return;
        try {
          const { url } = await api.upload(f);
          cover = url;
          root.querySelector('#journal-cover-preview')!.innerHTML =
            `<img src="${esc(url)}" alt="" class="editor-cover-img">`;
        } catch (err) {
          toast((err as Error).message, 'err');
        }
      });
    },
    onConfirm: async (root) => {
      const f = root.querySelector<HTMLFormElement>('#journal-form')!;
      const data = new FormData(f);
      const title = String(data.get('title') ?? '').trim();
      const content = String(data.get('content') ?? '').trim();
      if (!title || !content) {
        toast('标题和正文都不能为空', 'err');
        return false;
      }
      await api.createJournal({
        title,
        content,
        category: String(data.get('category') ?? '随笔'),
        mood: String(data.get('mood') ?? ''),
        weather: String(data.get('weather') ?? ''),
        cover,
      });
      toast('日志已发表', 'ok');
      await onDone();
      return true;
    },
  });
}

/** 日志详情。 */
export async function renderJournalDetail(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const id = ctx.params.id!;
  const j: JournalView = await api.journal(id);
  const u = me();
  const paragraphs = (j.content ?? '')
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${text(p)}</p>`)
    .join('');

  outlet.innerHTML = `
    <article class="card journal-detail">
      <a class="back-link" href="#/journals">${icon('back', 14)} 返回日志列表</a>
      ${j.cover ? `<div class="journal-hero"><img src="${esc(j.cover)}" alt="" data-zoom="${esc(j.cover)}"></div>` : ''}
      <h1 class="journal-detail-title">${esc(j.title)}</h1>
      <div class="journal-detail-meta">
        ${avatarHTML(j.author.avatar, j.author.nickname, 28, j.author.uin)}
        <a href="#/u/${esc(j.author.uin)}">${esc(j.author.nickname)}</a>
        <span class="dot">·</span><time>${fullTime(j.at)}</time>
        <span class="dot">·</span><span>${icon('eye', 12)} ${j.views}</span>
        ${j.category ? `<span class="tag">${esc(j.category)}</span>` : ''}
        ${j.mood ? `<span class="tag tag-soft">心情 ${esc(j.mood)}</span>` : ''}
        ${j.weather ? `<span class="tag tag-soft">${esc(j.weather)}</span>` : ''}
        ${
          j.canEdit
            ? `<button class="text-btn danger journal-del" id="del-journal">${icon('trash', 13)} 删除</button>`
            : ''
        }
      </div>
      <div class="journal-body-text">${paragraphs}</div>

      <div class="feed-actions detail-actions">
        <button class="act ${j.liked ? 'active' : ''}" id="journal-like">
          ${icon('heart', 15)}<span>${j.likes.length || '赞'}</span>
        </button>
        <button class="act" id="journal-comment-focus">${icon('feed', 15)}<span>${j.comments.length || '评论'}</span></button>
      </div>

      <div class="feed-social detail-social">
        ${
          j.likes.length
            ? `<div class="like-row">${icon('heart', 13)}<span>${j.likes.map((l) => esc(l.nickname)).join('、')}</span></div>`
            : ''
        }
        <div id="journal-comments">${commentListHTML(j.comments, j.id)}</div>
        <form class="comment-form" id="journal-comment-form">
          <input name="content" maxlength="500" placeholder="写下你的评论…" required autocomplete="off">
          <button class="btn btn-primary btn-sm" type="submit">发送</button>
        </form>
      </div>
    </article>`;

  bindLightbox(outlet);

  outlet.querySelector('#journal-like')!.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLElement;
    try {
      const r = await api.likeJournal(j.id);
      btn.classList.toggle('active', r.liked);
      btn.querySelector('span')!.textContent = String(r.count || '赞');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  outlet.querySelector('#journal-comment-focus')!.addEventListener('click', () => {
    outlet.querySelector<HTMLInputElement>('#journal-comment-form input')!.focus();
  });

  outlet.querySelector<HTMLFormElement>('#journal-comment-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector('input')!;
    const content = input.value.trim();
    if (!content) return;
    try {
      const c = await api.commentJournal(j.id, content);
      outlet.querySelector('#journal-comments')!.insertAdjacentHTML('beforeend', commentListHTML([c], j.id));
      input.value = '';
      toast('评论已发布', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  const del = outlet.querySelector<HTMLElement>('#del-journal');
  if (del) {
    del.addEventListener('click', async () => {
      const ok = await modal({
        title: '删除日志',
        body: `<p class="confirm-text">删除后无法恢复，确定删除《${esc(j.title)}》吗？</p>`,
        confirmText: '删除',
      });
      if (!ok) return;
      try {
        await api.deleteJournal(j.id);
        toast('已删除', 'ok');
        location.hash = '#/journals';
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });
  }

  // 日志评论删除
  outlet.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act="del-comment"]');
    if (!btn) return;
    try {
      await api.deleteJournalComment(j.id, btn.dataset.cid!);
      btn.closest('.comment')?.remove();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  // 记录访问足迹（浏览日志）
  void api.visit(u.uin, '日志').catch(() => undefined);
}
