import { api } from '../api';
import { esc, icon } from '../ui';
import type { ViewCtx } from '../types';

/** 全局搜索：说说 / 日志 / 相册 / 人。 */
export async function renderSearch(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const q = (ctx.params.q || '').trim();

  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('search', 18)} 搜索</h2>
        <p class="module-sub">${q ? `“${esc(q)}” 的搜索结果` : '输入关键词，搜索说说、日志、相册和好友'}</p>
      </div>
    </section>
    <form class="card search-bar" id="search-form">
      <input class="input" name="q" value="${esc(q)}" placeholder="搜索关键词" autofocus>
      <button class="btn btn-primary" type="submit">搜索</button>
    </form>
    <div id="search-result"></div>`;

  outlet.querySelector<HTMLFormElement>('#search-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = (new FormData(e.currentTarget as HTMLFormElement).get('q') as string).trim();
    location.hash = v ? `#/search?q=${encodeURIComponent(v)}` : '#/search';
  });

  if (!q) return;

  const box = outlet.querySelector<HTMLElement>('#search-result')!;
  const r = await api.search(q);
  const total = r.posts.length + r.journals.length + r.albums.length + r.users.length;
  if (!total) {
    box.innerHTML = `<div class="card empty"><div class="empty-mark">${icon('search', 24)}</div>
      <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;
    return;
  }

  box.innerHTML = `
    ${
      r.users.length
        ? `<h3 class="section-title">好友 / 用户 <span class="count">${r.users.length}</span></h3>
           <div class="result-users card">${r.users
             .map(
               (u) => `<a class="result-user" href="#/u/${esc(u.uin)}">
                 <img src="${esc(u.avatar)}" alt=""><div><b>${esc(u.nickname)}</b>
                 <span>${esc(u.uin)} · ${esc(u.signature || '')}</span></div>${icon('chevron', 14)}</a>`,
             )
             .join('')}</div>`
        : ''
    }
    ${
      r.posts.length
        ? `<h3 class="section-title">说说 <span class="count">${r.posts.length}</span></h3>
           <div class="card result-simple">${r.posts
             .map(
               (p) => `<a class="result-line" href="#/u/${esc(p.author.uin)}">
                 <b>${esc(p.author.nickname)}</b><span>${esc(p.content.slice(0, 80))}</span></a>`,
             )
             .join('')}</div>`
        : ''
    }
    ${
      r.journals.length
        ? `<h3 class="section-title">日志 <span class="count">${r.journals.length}</span></h3>
           <div class="card result-simple">${r.journals
             .map(
               (j) => `<a class="result-line" href="#/j/${esc(j.id)}">
                 <b>${esc(j.title)}</b><span>${esc(j.excerpt)}</span></a>`,
             )
             .join('')}</div>`
        : ''
    }
    ${
      r.albums.length
        ? `<h3 class="section-title">相册 <span class="count">${r.albums.length}</span></h3>
           <div class="result-albums">${r.albums
             .map(
               (a) => `<a class="result-album" href="#/a/${esc(a.id)}">
                 <img src="${esc(a.cover)}" alt=""><span>${esc(a.name)} · ${a.count} 张</span></a>`,
             )
             .join('')}</div>`
        : ''
    }`;
}
