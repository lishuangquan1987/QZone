import { api, type PostView } from '../api';
import { catHue, commentsHTML } from '../components';
import { renderMarkdown } from '../md';
import { avatarHTML, bindLightbox, confirmDialog, esc, fullTime, icon, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 文章详情：Markdown 正文、点赞、评论。 */
export async function renderPost(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const id = Number(ctx.params.id);
  root.innerHTML = `<div class="page narrow"><div class="card reading">正在载入…</div></div>`;
  const p: PostView = await api.post(id);

  root.innerHTML = `<div class="page narrow">
    <a class="back-link" href="#/posts">${icon('back', 14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${p.pinned ? `<span class="pill pill-pin">${icon('pin', 11)}置顶</span>` : ''}
          <a class="pill cat" style="--cat:${catHue(p.category)}" href="#/posts?category=${encodeURIComponent(p.category)}">${esc(p.category)}</a>
          ${
            p.visibility !== 'public'
              ? `<span class="pill pill-lock">${icon('lock', 11)}${p.visibility === 'private' ? '仅自己可见' : '不公开列出'}</span>`
              : ''
          }
        </div>
        <h1 class="article-title">${esc(p.title || '无标题')}</h1>
        <div class="article-meta">
          ${avatarHTML(p.author.avatar, p.author.nickname, 34, p.author.uin)}
          <div class="article-meta-text">
            <b>${esc(p.author.nickname)}</b>
            <span>${fullTime(p.at)} · ${p.readingTime} 分钟阅读 · ${p.views} 次浏览</span>
          </div>
          ${
            p.canEdit
              ? `<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${p.id}">${icon('pen', 13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${icon('trash', 13)}</button>
                </div>`
              : ''
          }
        </div>
      </header>

      ${
        p.cover && !(p.content ?? '').includes(p.cover)
          ? `<figure class="article-cover"><img src="${esc(p.cover)}" alt="" decoding="async" data-zoom="${esc(p.cover)}"></figure>`
          : ''
      }

      <div class="article-body markdown">${renderMarkdown(p.content ?? '')}</div>

      <footer class="article-foot">
        <button class="like-btn ${p.liked ? 'active' : ''}" id="like-btn">
          ${icon('heart', 16)}<span>${p.likeCount || '赞'}</span>
        </button>
        <div class="article-foot-note">
          ${p.likes.length ? `${p.likes.slice(0, 8).map((l) => esc(l.nickname)).join('、')} 觉得不错` : `写于 ${fullTime(p.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${p.commentNum}</span></h2>
      <div id="comment-area">${commentsHTML(p.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`;

  bindLightbox(root);

  const likeBtn = root.querySelector<HTMLElement>('#like-btn')!;
  likeBtn.addEventListener('click', async () => {
    try {
      const r = await api.likePost(p.id);
      likeBtn.classList.toggle('active', r.liked);
      likeBtn.querySelector('span')!.textContent = String(r.count || '赞');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  root.querySelector('#del-post')?.addEventListener('click', async () => {
    if (!(await confirmDialog('删除文章', `《${p.title}》删除后无法恢复，确定吗？`))) return;
    try {
      await api.deletePost(p.id);
      toast('已删除', 'ok');
      location.hash = '#/posts';
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  let replyTo = '';
  const hint = root.querySelector<HTMLElement>('#reply-hint')!;
  const area = root.querySelector<HTMLElement>('#comment-area')!;

  area.addEventListener('click', async (e) => {
    const t = e.target as HTMLElement;
    const reply = t.closest<HTMLElement>('[data-reply]');
    if (reply) {
      replyTo = reply.dataset.reply ?? '';
      hint.textContent = `回复 ${replyTo}`;
      root.querySelector<HTMLTextAreaElement>('#comment-form textarea')!.focus();
      return;
    }
    const del = t.closest<HTMLElement>('[data-del-comment]');
    if (del) {
      if (!(await confirmDialog('删除评论', '确定删除这条评论吗？'))) return;
      try {
        await api.deleteComment(p.id, Number(del.dataset.delComment));
        del.closest('.comment')?.remove();
        toast('已删除', 'ok');
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    }
  });

  root.querySelector<HTMLFormElement>('#comment-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const ta = form.querySelector('textarea')!;
    const content = ta.value.trim();
    if (!content) return;
    try {
      const c = await api.commentPost(p.id, content, replyTo);
      p.comments.push(c);
      area.innerHTML = commentsHTML(p.comments);
      ta.value = '';
      replyTo = '';
      hint.textContent = '';
      toast('评论已发布', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });
}
