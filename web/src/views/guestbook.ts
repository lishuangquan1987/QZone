import { api, type GuestbookView } from '../api';
import { me } from '../state';
import { avatarHTML, esc, icon, modal, text, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 留言板。 */
export async function renderGuestbook(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const u = me();
  const owner = ctx.params.uin || u.uin;
  const isSelf = owner === u.uin;

  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('mail', 18)} 留言板</h2>
        <p class="module-sub">来过，就留一句话。</p>
      </div>
    </section>

    <section class="card guest-form-card">
      <div class="guest-form-head">
        <img class="composer-avatar" src="${esc(u.avatar)}" alt="">
        <span>${isSelf ? '给自己留一句话' : '给 TA 留一句话'}</span>
      </div>
      <form id="guest-form" class="guest-form">
        <textarea class="textarea" name="content" rows="3" maxlength="300" placeholder="写留言…（最多 300 字）" required></textarea>
        <div class="guest-form-foot">
          <span class="guest-count" id="guest-count">0/300</span>
          <button class="btn btn-primary btn-sm" type="submit">发表留言</button>
        </div>
      </form>
    </section>

    <div id="guest-list" class="guest-list"></div>`;

  const list = outlet.querySelector<HTMLElement>('#guest-list')!;
  const textarea = outlet.querySelector<HTMLTextAreaElement>('#guest-form textarea')!;
  const counter = outlet.querySelector('#guest-count')!;
  textarea.addEventListener('input', () => {
    counter.textContent = `${textarea.value.length}/300`;
  });

  const entryHTML = (g: GuestbookView) => `<article class="card guest-item" data-gid="${esc(g.id)}">
      ${avatarHTML(g.author.avatar, g.author.nickname, 40, g.author.uin, g.author.level)}
      <div class="guest-body">
        <div class="guest-meta">
          <a class="guest-name" href="#/u/${esc(g.author.uin)}">${esc(g.author.nickname)}</a>
          <time title="${esc(g.at)}">${timeAgo(g.at)}</time>
          <span class="tabs-spacer"></span>
          ${g.canDelete ? `<button class="text-btn danger" data-gdel="${esc(g.id)}">删除</button>` : ''}
        </div>
        <p class="guest-text">${text(g.content)}</p>
        ${
          g.reply
            ? `<div class="guest-reply"><b>主人回复：</b>${text(g.reply)}</div>`
            : isSelf
              ? `<button class="text-btn" data-greply="${esc(g.id)}">回复</button>`
              : ''
        }
      </div>
    </article>`;

  const load = async () => {
    const r = await api.guestbook(owner);
    list.innerHTML = r.entries.length
      ? r.entries.map(entryHTML).join('')
      : `<div class="card empty"><div class="empty-mark">${icon('mail', 24)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`;
  };
  await load();

  outlet.querySelector<HTMLFormElement>('#guest-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = textarea.value.trim();
    if (!content) return;
    try {
      await api.createGuestbook(owner, content);
      textarea.value = '';
      counter.textContent = '0/300';
      toast('留言成功', 'ok');
      await load();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  list.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const delBtn = target.closest<HTMLElement>('[data-gdel]');
    if (delBtn) {
      const ok = await modal({
        title: '删除留言',
        body: '<p class="confirm-text">删除后无法恢复，确定删除这条留言吗？</p>',
        confirmText: '删除',
      });
      if (!ok) return;
      try {
        await api.deleteGuestbook(delBtn.dataset.gdel!);
        await load();
        toast('已删除', 'ok');
      } catch (err) {
        toast((err as Error).message, 'err');
      }
      return;
    }
    const replyBtn = target.closest<HTMLElement>('[data-greply]');
    if (replyBtn) {
      const id = replyBtn.dataset.greply!;
      await modal({
        title: '回复留言',
        body: `<textarea class="textarea" id="reply-text" rows="3" maxlength="300" placeholder="写下回复…"></textarea>`,
        confirmText: '回复',
        onConfirm: async (root) => {
          const v = root.querySelector<HTMLTextAreaElement>('#reply-text')!.value.trim();
          if (!v) {
            toast('回复内容不能为空', 'err');
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
