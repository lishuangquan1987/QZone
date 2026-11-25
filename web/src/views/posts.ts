import { api, type PostView } from '../api';
import { postRowHTML } from '../components';
import { esc, icon, skeleton, toast } from '../ui';
import type { ViewCtx } from '../types';

const SORTS = [
  { key: 'latest', label: '最新' },
  { key: 'popular', label: '最热' },
];

/** 文章归档：分类、排序、分页。 */
export async function renderPosts(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const sort = ctx.params.sort === 'popular' ? 'popular' : 'latest';
  const category = ctx.params.category || '全部';
  const keyword = ctx.params.q || '';

  root.innerHTML = `<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">ARCHIVE</p>
        <h1>全部文章</h1>
        <p class="page-sub" id="archive-sub">正在整理…</p>
      </div>
    </header>
    <div class="archive-bar">
      <div class="chip-row" id="cat-row"></div>
      <div class="sort-row">
        ${SORTS.map((s) => `<button class="sort-btn ${s.key === sort ? 'active' : ''}" data-sort="${s.key}">${s.label}</button>`).join('')}
      </div>
    </div>
    ${keyword ? `<p class="search-note">搜索「${esc(keyword)}」的结果</p>` : ''}
    <div id="archive-list" class="archive-list">${skeleton(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;

  const list = root.querySelector<HTMLElement>('#archive-list')!;
  const more = root.querySelector<HTMLButtonElement>('#load-more')!;
  const catRow = root.querySelector<HTMLElement>('#cat-row')!;
  let cursor: string | undefined;
  let all: PostView[] = [];

  const paintCategories = () => {
    const set = new Set<string>(['全部']);
    all.forEach((p) => p.category && set.add(p.category));
    catRow.innerHTML = Array.from(set)
      .map((c) => `<button class="chip ${c === category ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`)
      .join('');
  };

  const load = async (reset: boolean) => {
    if (reset) {
      cursor = undefined;
      list.innerHTML = skeleton(2);
    }
    const r = await api.posts({ category, sort, q: keyword, limit: 8, before: cursor });
    all = reset ? r.posts : all.concat(r.posts);
    const html = r.posts.map(postRowHTML).join('');
    if (reset) list.innerHTML = html;
    else list.insertAdjacentHTML('beforeend', html);
    if (r.posts.length) cursor = r.posts[r.posts.length - 1].at;
    more.hidden = !r.hasMore;
    root.querySelector('#archive-sub')!.textContent = `共 ${r.total} 篇 · 按${sort === 'popular' ? '阅读量' : '时间'}排序`;
    paintCategories();
    if (reset && !r.posts.length) {
      list.innerHTML = `<div class="card empty">
        <div class="empty-mark">${icon('book', 22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;
    }
  };

  more.addEventListener('click', async () => {
    more.disabled = true;
    try {
      await load(false);
    } catch (err) {
      toast((err as Error).message, 'err');
    } finally {
      more.disabled = false;
    }
  });

  catRow.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-cat]');
    if (!btn) return;
    const qs = new URLSearchParams();
    if (btn.dataset.cat && btn.dataset.cat !== '全部') qs.set('category', btn.dataset.cat);
    if (sort === 'popular') qs.set('sort', 'popular');
    location.hash = `#/posts${qs.toString() ? '?' + qs.toString() : ''}`;
  });

  root.querySelectorAll<HTMLElement>('[data-sort]').forEach((b) => {
    b.addEventListener('click', () => {
      const qs = new URLSearchParams();
      if (category !== '全部') qs.set('category', category);
      if (b.dataset.sort === 'popular') qs.set('sort', 'popular');
      location.hash = `#/posts${qs.toString() ? '?' + qs.toString() : ''}`;
    });
  });

  try {
    await load(true);
  } catch (err) {
    toast((err as Error).message, 'err');
    list.innerHTML = `<div class="card empty"><p class="empty-title">加载失败</p></div>`;
  }
}
