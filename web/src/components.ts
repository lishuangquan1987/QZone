import { api, type AlbumView, type CommentView, type JournalView, type PostView } from './api';
import { avatarHTML, confirmDialog, esc, icon, modal, text, timeAgo, toast } from './ui';

/** 说说卡片。 */
export function feedItemHTML(p: PostView): string {
  const vis =
    p.visibility === 'private'
      ? `<span class="tag tag-lock">${icon('lock', 12)}私密</span>`
      : p.visibility === 'friends'
        ? `<span class="tag tag-soft">仅好友</span>`
        : '';
  const likeNames = p.likes.map((l) => esc(l.nickname)).join('、');
  const repost = p.repostOf
    ? `<blockquote class="repost-quote">
        <a class="repost-author" href="#/u/${esc(p.repostOf.author.uin)}">@${esc(p.repostOf.author.nickname)}</a>
        <div class="repost-text">${text(p.repostOf.content)}</div>
        ${
          p.repostOf.images.length
            ? `<div class="repost-imgs">${p.repostOf.images
                .slice(0, 3)
                .map((u) => `<img src="${esc(u)}" alt="" data-zoom="${esc(u)}">`)
                .join('')}</div>`
            : ''
        }
      </blockquote>`
    : '';

  return `<article class="feed card" data-feed="${esc(p.id)}">
    <div class="feed-head">
      ${avatarHTML(p.author.avatar, p.author.nickname, 44, p.author.uin, p.author.level)}
      <div class="feed-meta">
        <div class="feed-name-row">
          <a class="feed-name" href="#/u/${esc(p.author.uin)}">${esc(p.author.nickname)}</a>
          ${p.author.vip ? `<span class="vip-dot" title="黄钻 ${p.author.vip} 级">${icon('star', 11)}</span>` : ''}
          ${vis}
        </div>
        <div class="feed-sub">
          <time title="${esc(p.at)}">${timeAgo(p.at)}</time>
          ${p.location ? `<span class="dot">·</span><span class="feed-loc">${icon('pin', 11)}${esc(p.location)}</span>` : ''}
        </div>
      </div>
      ${p.canDelete ? `<button class="text-btn danger" data-act="del-feed" data-id="${esc(p.id)}">删除</button>` : ''}
    </div>
    ${p.content ? `<div class="feed-content">${text(p.content)}</div>` : ''}
    ${p.images.length ? `<div class="feed-images n${Math.min(p.images.length, 3)}">${p.images
      .map(
        (u) =>
          `<img src="${esc(u)}" alt="" loading="lazy" data-zoom="${esc(u)}">`,
      )
      .join('')}</div>` : ''}
    ${repost}
    <div class="feed-actions">
      <button class="act ${p.liked ? 'active' : ''}" data-act="like" data-id="${esc(p.id)}">
        ${icon('heart', 15)}<span class="act-like-count">${p.likes.length || '赞'}</span>
      </button>
      <button class="act" data-act="toggle-comment" data-id="${esc(p.id)}">
        ${icon('feed', 15)}<span>${p.comments.length || '评论'}</span>
      </button>
      <button class="act" data-act="repost" data-id="${esc(p.id)}">${icon('refresh', 15)}<span>转发</span></button>
    </div>
    ${
      likeNames || p.comments.length
        ? `<div class="feed-social">
            ${likeNames ? `<div class="like-row">${icon('heart', 13)}<span>${likeNames}</span></div>` : ''}
            ${p.comments.length ? commentListHTML(p.comments, p.id) : ''}
          </div>`
        : ''
    }
    <form class="comment-form" data-form="${esc(p.id)}" hidden>
      <input name="content" maxlength="500" placeholder="说点什么…" autocomplete="off" required>
      <input type="hidden" name="replyTo">
      <button class="btn btn-primary btn-sm" type="submit">发送</button>
    </form>
  </article>`;
}

export function commentListHTML(comments: CommentView[], ownerId: string): string {
  return `<ul class="comment-list">${comments
    .map(
      (c) => `<li class="comment" data-cid="${esc(c.id)}">
        <a class="comment-author" href="#/u/${esc(c.author.uin)}">${esc(c.author.nickname)}</a>
        <span class="comment-sep">：</span>
        ${c.replyTo ? `<span class="comment-reply">回复 ${esc(c.replyTo)}：</span>` : ''}
        <span class="comment-text">${text(c.content)}</span>
        <button class="text-btn" data-act="reply" data-owner="${esc(ownerId)}" data-name="${esc(c.author.nickname)}" data-uin="${esc(c.author.uin)}">回复</button>
        ${c.canDel ? `<button class="text-btn danger" data-act="del-comment" data-owner="${esc(ownerId)}" data-cid="${esc(c.id)}">删除</button>` : ''}
      </li>`,
    )
    .join('')}</ul>`;
}

/** 为容器内所有说说绑定事件（事件委托，容器可重复渲染）。 */
export function bindFeedList(container: HTMLElement, reload: () => void | Promise<void>): void {
  container.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act!;
    const feed = btn.closest<HTMLElement>('[data-feed]');
    const feedId = feed?.dataset.feed ?? btn.dataset.id ?? '';

    try {
      if (act === 'like') {
        const r = await api.likeFeed(feedId);
        btn.classList.toggle('active', r.liked);
        const c = btn.querySelector('.act-like-count');
        if (c) c.textContent = String(r.count || '赞');
      } else if (act === 'toggle-comment') {
        const form = feed?.querySelector<HTMLFormElement>('.comment-form');
        if (form) {
          form.hidden = !form.hidden;
          if (!form.hidden) form.querySelector('input')?.focus();
        }
      } else if (act === 'del-feed') {
        if (await confirmDialog('删除说说', '删除后无法恢复，确定删除这条说说吗？')) {
          await api.deleteFeed(feedId);
          toast('已删除', 'ok');
          await reload();
        }
      } else if (act === 'repost') {
        const ok = await modal({
          title: '转发到我的空间',
          body: `<textarea class="textarea" name="content" rows="3" placeholder="说点什么（可留空）"></textarea>`,
          confirmText: '转发',
          onConfirm: async (root) => {
            const ta = root.querySelector<HTMLTextAreaElement>('textarea')!;
            await api.repostFeed(feedId, ta.value.trim());
            toast('已转发', 'ok');
            await reload();
          },
        });
        void ok;
      } else if (act === 'reply') {
        const form = btn.closest('.feed')?.querySelector<HTMLFormElement>('.comment-form');
        if (form) {
          form.hidden = false;
          (form.querySelector('input[name=replyTo]') as HTMLInputElement).value = btn.dataset.uin ?? '';
          const input = form.querySelector<HTMLInputElement>('input[name=content]')!;
          input.placeholder = `回复 ${btn.dataset.name}：`;
          input.focus();
        }
      } else if (act === 'del-comment') {
        if (await confirmDialog('删除评论', '确定删除这条评论吗？')) {
          await api.deleteFeedComment(btn.dataset.owner!, btn.dataset.cid!);
          await reload();
        }
      }
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  container.addEventListener('submit', async (e) => {
    const form = (e.target as HTMLElement).closest<HTMLFormElement>('.comment-form');
    if (!form) return;
    e.preventDefault();
    const data = new FormData(form);
    const content = String(data.get('content') ?? '').trim();
    if (!content) return;
    try {
      await api.commentFeed(form.dataset.form!, content, String(data.get('replyTo') ?? ''));
      form.reset();
      form.hidden = true;
      await reload();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });
}

export function albumCardHTML(a: AlbumView): string {
  const cover = a.cover
    ? `<img src="${esc(a.cover)}" alt="${esc(a.name)}" loading="lazy">`
    : `<div class="album-empty">${icon('image', 24)}</div>`;
  const lock = a.privacy === 'private' ? `<span class="tag tag-lock">${icon('lock', 11)}私密</span>` : a.privacy === 'friends' ? `<span class="tag tag-soft">仅好友</span>` : '';
  return `<a class="album-card card" href="#/a/${esc(a.id)}">
    <div class="album-cover">${cover}<span class="album-count">${a.count} 张</span></div>
    <div class="album-info">
      <div class="album-name">${esc(a.name)} ${lock}</div>
      <div class="album-desc">${esc(a.description || '还没有相册描述')}</div>
    </div>
  </a>`;
}

export function journalCardHTML(j: JournalView): string {
  return `<article class="journal-card card">
    <a class="journal-cover" href="#/j/${esc(j.id)}">
      ${j.cover ? `<img src="${esc(j.cover)}" alt="${esc(j.title)}" loading="lazy">` : ''}
    </a>
    <div class="journal-body">
      <h3 class="journal-title"><a href="#/j/${esc(j.id)}">${esc(j.title)}</a></h3>
      <p class="journal-excerpt">${esc(j.excerpt)}</p>
      <div class="journal-meta">
        <span class="tag">${esc(j.category)}</span>
        <span>${timeAgo(j.at)}</span>
        <span class="dot">·</span>
        <span>${icon('eye', 12)} ${j.views}</span>
        <span class="dot">·</span>
        <span>${icon('heart', 12)} ${j.likes.length}</span>
      </div>
    </div>
  </article>`;
}
