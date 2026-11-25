import { api, type PostView } from '../api';
import { featuredHTML, postRowHTML } from '../components';
import { me } from '../state';
import { avatarHTML, bindLightbox, esc, icon, skeleton, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 他人主页：档案 + 公开文章。 */
export async function renderSpace(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const uin = ctx.params.uin ?? '';
  const mine = me();
  if (uin === mine.uin) {
    location.hash = '#/home';
    return;
  }

  root.innerHTML = `<div class="page"><div class="card reading">正在打开 ${esc(uin)} 的空间…</div></div>`;
  const { user: u } = await api.user(uin);
  void api.visit(u.uin, '主页').catch(() => undefined);

  root.innerHTML = `<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${esc(u.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${avatarHTML(u.avatar, u.nickname, 0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${icon('pin', 12)} ${esc(u.city || '—')}</p>
          <h1>${esc(u.nickname)}</h1>
          <p class="hero-sign">${esc(u.signature || '这个人正在写文章。')}</p>
          <div class="hero-stats">
            <span><b>${u.posts}</b>文章</span>
            <span><b>${u.photos}</b>照片</span>
            <span><b>${u.visitCount.toLocaleString()}</b>访问</span>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/guestbook?uin=${esc(u.uin)}">${icon('mail', 15)} 留言</a>
          <a class="btn btn-ghost" href="#/search?q=${encodeURIComponent(u.nickname)}">${icon('search', 15)} 搜索</a>
        </div>
      </div>
    </section>

    <div class="list-head">
      <h2>${esc(u.nickname)} 的文章</h2>
      <span class="muted">${u.posts} 篇</span>
    </div>
    <div id="space-posts">${skeleton(2)}</div>
  </div>`;

  bindLightbox(root);
  const box = root.querySelector<HTMLElement>('#space-posts')!;
  const r = await api.posts({ uin: u.uin, limit: 10 });
  if (!r.posts.length) {
    box.innerHTML = `<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>`;
    return;
  }
  const featured: PostView = r.posts[0];
  box.innerHTML = featuredHTML(featured) + `<div class="post-list">${r.posts.slice(1).map(postRowHTML).join('')}</div>`;
  void toast;
}
