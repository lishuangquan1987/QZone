import type { AlbumView, CommentView, PostView } from './api';
import { avatarHTML, esc, icon, timeAgo } from './ui';

const VIS_LABEL: Record<string, string> = {
  private: '仅自己可见',
  unlisted: '不公开列出',
  public: '',
};

/** 首页头条卡片：大图 + 摘要。 */
export function featuredHTML(p: PostView): string {
  const cover = p.cover || p.images[0] || '';
  return `<article class="feature card${cover ? '' : ' no-cover'}" data-post="${p.id}">
    ${cover ? `<a class="feature-cover" href="#/post/${p.id}"><img src="${esc(cover)}" alt="${esc(p.title)}" loading="lazy"></a>` : ''}
    <div class="feature-body">
      <div class="post-kicker">
        ${p.pinned ? `<span class="pill pill-pin">${icon('pin', 11)}置顶</span>` : ''}
        <span class="pill">${esc(p.category)}</span>
        ${p.visibility !== 'public' ? `<span class="pill pill-lock">${icon('lock', 11)}${VIS_LABEL[p.visibility]}</span>` : ''}
      </div>
      <h2 class="feature-title"><a href="#/post/${p.id}">${esc(p.title || '无标题')}</a></h2>
      <p class="feature-summary">${esc(p.summary)}</p>
      <div class="post-meta">
        <span>${timeAgo(p.at)}</span>
        <span class="meta-dot">·</span>
        <span>${icon('clock', 12)} ${p.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${icon('eye', 12)} ${p.views}</span>
        <span class="meta-dot">·</span>
        <span>${icon('heart', 12)} ${p.likeCount}</span>
      </div>
    </div>
  </article>`;
}

/** 列表行：左侧文字 + 右侧缩略图。 */
export function postRowHTML(p: PostView): string {
  const cover = p.cover || p.images[0] || '';
  return `<article class="post-row" data-post="${p.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${p.pinned ? `<span class="pill pill-pin">${icon('pin', 11)}置顶</span>` : ''}
        <span class="pill">${esc(p.category)}</span>
        ${p.visibility !== 'public' ? `<span class="pill pill-lock">${icon('lock', 11)}${VIS_LABEL[p.visibility]}</span>` : ''}
      </div>
      <h3 class="post-row-title"><a href="#/post/${p.id}">${esc(p.title || '无标题')}</a></h3>
      <p class="post-row-summary">${esc(p.summary)}</p>
      <div class="post-meta">
        <span>${timeAgo(p.at)}</span>
        <span class="meta-dot">·</span>
        <span>${p.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${icon('eye', 12)} ${p.views}</span>
        <span class="meta-dot">·</span>
        <span>${icon('heart', 12)} ${p.likeCount}</span>
      </div>
    </div>
    ${cover ? `<a class="post-row-thumb" href="#/post/${p.id}"><img src="${esc(cover)}" alt="" loading="lazy"></a>` : ''}
  </article>`;
}

/** 评论区列表。 */
export function commentsHTML(list: CommentView[]): string {
  if (!list.length) {
    return `<p class="comment-empty">还没有评论，来说第一句。</p>`;
  }
  return `<ul class="comment-list">${list
    .map(
      (c) => `<li class="comment" data-cid="${c.id}">
        ${avatarHTML(c.author.avatar, c.author.nickname, 34, c.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${esc(c.author.uin)}">${esc(c.author.nickname)}</a>
            <time>${timeAgo(c.at)}</time>
            <button class="text-btn" data-reply="${esc(c.author.nickname)}">回复</button>
            ${c.canDel ? `<button class="text-btn danger" data-del-comment="${c.id}">删除</button>` : ''}
          </div>
          <p class="comment-text">${c.replyTo ? `<span class="comment-reply">回复 ${esc(c.replyTo)}：</span>` : ''}${esc(c.content)}</p>
        </div>
      </li>`,
    )
    .join('')}</ul>`;
}

export function albumCardHTML(a: AlbumView): string {
  return `<a class="album-card card" href="#/album/${a.id}">
    <div class="album-cover">
      ${a.cover ? `<img src="${esc(a.cover)}" alt="${esc(a.name)}" loading="lazy">` : `<div class="cover-fallback"></div>`}
      <span class="album-count">${a.count} 张</span>
    </div>
    <div class="album-info">
      <h3>${esc(a.name)}</h3>
      <p>${esc(a.description || '还没有描述')}</p>
    </div>
  </a>`;
}
