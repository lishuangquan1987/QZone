import { api } from '../api';
import { postRowHTML } from '../components';
import { esc, icon, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 全站搜索：文章 / 用户 / 相册。 */
export async function renderSearch(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const q = (ctx.params.q || '').trim();

  root.innerHTML = `<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SEARCH</p>
        <h1>搜索</h1>
        <p class="page-sub">${q ? `“${esc(q)}” 的结果` : '找文章、找朋友、找相册'}</p>
      </div>
    </header>

    <form class="search-box card" id="search-form">
      <input class="input" name="q" value="${esc(q)}" placeholder="输入关键词" autofocus>
      <button class="btn btn-primary" type="submit">${icon('search', 14)} 搜索</button>
    </form>

    <div id="search-result"></div>
  </div>`;

  root.querySelector<HTMLFormElement>('#search-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = String(new FormData(e.currentTarget as HTMLFormElement).get('q') ?? '').trim();
    location.hash = v ? `#/search?q=${encodeURIComponent(v)}` : '#/search';
  });

  if (!q) return;

  const box = root.querySelector<HTMLElement>('#search-result')!;
  try {
    const r = await api.search(q);
    const total = r.posts.length + r.users.length + r.albums.length;
    if (!total) {
      box.innerHTML = `<div class="card empty"><div class="empty-mark">${icon('search', 22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;
      return;
    }

    box.innerHTML = `
      ${
        r.users.length
          ? `<h2 class="result-title">用户 <span>${r.users.length}</span></h2>
             <div class="card user-list">${r.users
               .map(
                 (u) => `<a class="user-row" href="#/u/${esc(u.uin)}">
                   <img src="${esc(u.avatar)}" alt="" loading="lazy" decoding="async">
                   <div><b>${esc(u.nickname)}</b><span>@${esc(u.uin)} · ${esc(u.signature || '')}</span></div>
                   ${icon('chevron', 14)}
                 </a>`,
               )
               .join('')}</div>`
          : ''
      }
      ${
        r.posts.length
          ? `<h2 class="result-title">文章 <span>${r.posts.length}</span></h2>
             <div class="post-list card">${r.posts.map(postRowHTML).join('')}</div>`
          : ''
      }
      ${
        r.albums.length
          ? `<h2 class="result-title">相册 <span>${r.albums.length}</span></h2>
             <div class="album-grid">${r.albums
               .map(
                 (a) => `<a class="album-card card" href="#/album/${a.id}">
                   <div class="album-cover">${a.cover ? `<img src="${esc(a.cover)}" alt="" loading="lazy" decoding="async">` : ''}</div>
                   <div class="album-info"><h3>${esc(a.name)}</h3><p>${a.count} 张</p></div>
                 </a>`,
               )
               .join('')}</div>`
          : ''
      }`;
  } catch (err) {
    toast((err as Error).message, 'err');
  }
}
