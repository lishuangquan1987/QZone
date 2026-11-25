import { api } from '../api';
import { renderMarkdown } from '../md';
import { me } from '../state';
import { esc, icon, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 关于：自我介绍（Markdown）+ 档案信息。 */
export async function renderAbout(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const u = me();
  const target = ctx.params.uin ? (await api.user(ctx.params.uin)).user : u;

  root.innerHTML = `<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${esc(target.nickname)}</h1>
      <p class="page-sub">${esc(target.signature || '')}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${
          target.bio ? renderMarkdown(target.bio) : '<p class="muted">还没有写自我介绍。</p>'
        }</div>
      </article>

      <aside class="about-side">
        <section class="rail-card">
          <h3>档案</h3>
          <dl class="fact-list">
            <div><dt>空间号</dt><dd>${esc(target.uin)}</dd></div>
            <div><dt>城市</dt><dd>${esc(target.city || '—')}</dd></div>
            <div><dt>星座</dt><dd>${esc(target.constellation || '—')}</dd></div>
            <div><dt>加入</dt><dd>${new Date(target.createdAt).getFullYear()} 年</dd></div>
            <div><dt>文章</dt><dd>${target.posts} 篇</dd></div>
            <div><dt>照片</dt><dd>${target.photos} 张</dd></div>
          </dl>
        </section>

        <section class="rail-card">
          <h3>标签</h3>
          <div class="tag-cloud">
            ${target.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('') || '<span class="muted">还没有标签</span>'}
          </div>
        </section>

        <section class="rail-card">
          <h3>找到我</h3>
          <div class="about-links">
            <a href="#/guestbook" class="about-link">${icon('mail', 14)} 留言板</a>
            <a href="#/posts" class="about-link">${icon('book', 14)} 全部文章</a>
            <a href="#/albums" class="about-link">${icon('image', 14)} 相册</a>
          </div>
        </section>
      </aside>
    </div>
  </div>`;

  if (target.uin !== u.uin) {
    void api.visit(target.uin, '关于').catch(() => toast('足迹记录失败', 'err'));
  }
}
