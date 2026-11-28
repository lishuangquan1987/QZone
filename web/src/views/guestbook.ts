import { api, type GuestbookView } from '../api';
import { me } from '../state';
import { avatarHTML, esc, icon, modal, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 留言板。 */
export async function renderGuestbook(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const u = me();
  const owner = ctx.params.uin || u.uin;
  const isSelf = owner === u.uin;
  const target = isSelf ? u : (await api.user(owner)).user;

  root.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${isSelf ? '来过的人，留下了这些话。' : `给 ${esc(target.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${avatarHTML(u.avatar, u.nickname, 36)}
        <span>${isSelf ? '给自己留一句话' : `给 ${esc(target.nickname)} 留一句话`}</span>
      </div>
      <form id="gb-form">
        <textarea name="content" rows="3" maxlength="500" placeholder="写文章…（纯文本，最多 500 字）" required></textarea>
        <div class="guest-write-foot">
          <span class="muted" id="gb-count">0 / 500</span>
          <button class="btn btn-primary btn-sm" type="submit">发表留言</button>
        </div>
      </form>
    </section>

    <div id="gb-list" class="gb-list"></div>
  </div>`;

  const list = root.querySelector<HTMLElement>('#gb-list')!;
  const ta = root.querySelector<HTMLTextAreaElement>('#gb-form textarea')!;
  const counter = root.querySelector<HTMLElement>('#gb-count')!;
  ta.addEventListener('input', () => {
    counter.textContent = `${ta.value.length} / 500`;
  });

  const item = (g: GuestbookView) => `<article class="gb-item card" data-gid="${g.id}">
      ${avatarHTML(g.author.avatar, g.author.nickname, 40, g.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${esc(g.author.uin)}">${esc(g.author.nickname)}</a>
          <time>${timeAgo(g.at)}</time>
          <span class="spacer"></span>
          ${g.canEdit ? `<button class="text-btn" data-reply="${g.id}">回复</button>` : ''}
          ${g.canDel ? `<button class="text-btn danger" data-del="${g.id}">删除</button>` : ''}
        </div>
        <p class="gb-text">${esc(g.content)}</p>
        ${g.reply ? `<div class="gb-reply"><b>${esc(target.nickname)}：</b>${esc(g.reply)}</div>` : ''}
      </div>
    </article>`;

  // 游标分页：首页一次 100 条，更早的留言用「加载更多」翻
  let nextBefore: string | null = null;
  let loadingMore = false;

  const moreBtn = (): string =>
    nextBefore
      ? `<div class="load-more"><button class="btn btn-ghost btn-sm" id="gb-more">加载更早的留言</button></div>`
      : '';

  const load = async () => {
    const r = await api.guestbook(owner);
    nextBefore = r.hasMore ? (r.nextBefore ?? null) : null;
    list.innerHTML = r.entries.length
      ? r.entries.map(item).join('') + moreBtn()
      : `<div class="card empty"><div class="empty-mark">${icon('mail', 22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`;
  };
  await load();

  list.addEventListener('click', async (e) => {
    if (!(e.target as HTMLElement).closest('#gb-more')) return;
    if (loadingMore || !nextBefore) return;
    loadingMore = true;
    const btn = list.querySelector<HTMLButtonElement>('#gb-more');
    if (btn) btn.disabled = true;
    try {
      const r = await api.guestbook(owner, nextBefore);
      nextBefore = r.hasMore ? (r.nextBefore ?? null) : null;
      btn?.parentElement?.remove();
      list.insertAdjacentHTML('beforeend', r.entries.map(item).join('') + moreBtn());
    } finally {
      loadingMore = false;
    }
  });

  root.querySelector<HTMLFormElement>('#gb-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = ta.value.trim();
    if (!content) return;
    try {
      await api.createGuestbook(owner, content);
      ta.value = '';
      counter.textContent = '0 / 500';
      toast('留言成功', 'ok');
      await load();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  list.addEventListener('click', async (e) => {
    const t = e.target as HTMLElement;
    const del = t.closest<HTMLElement>('[data-del]');
    if (del) {
      if (!confirm('确定删除这条留言吗？')) return;
      try {
        await api.deleteGuestbook(Number(del.dataset.del));
        await load();
        toast('已删除', 'ok');
      } catch (err) {
        toast((err as Error).message, 'err');
      }
      return;
    }
    const reply = t.closest<HTMLElement>('[data-reply]');
    if (reply) {
      const id = Number(reply.dataset.reply);
      await modal({
        title: '回复留言',
        body: `<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>`,
        confirmText: '回复',
        onConfirm: async (box) => {
          const v = box.querySelector<HTMLTextAreaElement>('#reply-text')!.value.trim();
          if (!v) {
            toast('回复不能为空', 'err');
            return false;
          }
          await api.replyGuestbook(id, v);
          await load();
          toast('已回复', 'ok');
          return true;
        },
      });
    }
  });
}
