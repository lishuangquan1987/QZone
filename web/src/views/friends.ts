import { api } from '../api';
import { me } from '../state';
import { avatarHTML, esc, icon, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 好友列表：特别关心 + 全部好友。 */
export async function renderFriends(outlet: HTMLElement, _ctx: ViewCtx): Promise<void> {
  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('users', 18)} 好友</h2>
        <p class="module-sub" id="friend-sub">加载中…</p>
      </div>
      <a class="btn btn-ghost btn-sm" href="#/search">寻找好友</a>
    </section>
    <div id="friends-body"></div>`;

  const body = outlet.querySelector<HTMLElement>('#friends-body')!;
  const u = me();

  const load = async () => {
    const { friends } = await api.friends(u.uin);
    outlet.querySelector('#friend-sub')!.textContent = `${friends.length} 位好友 · ${friends.filter((f) => f.special).length} 位特别关心`;
    if (!friends.length) {
      body.innerHTML = `<div class="card empty"><p class="empty-title">还没有好友</p></div>`;
      return;
    }

    const card = (f: (typeof friends)[number]) => `<article class="friend-card card" data-uin="${esc(f.uin)}">
        <div class="friend-top">
          ${avatarHTML(f.avatar, f.nickname, 56, f.uin, f.level)}
          <div class="friend-info">
            <a class="friend-name" href="#/u/${esc(f.uin)}">${esc(f.nickname)}
              ${f.vip ? `<span class="vip-dot">${icon('star', 10)}</span>` : ''}
            </a>
            <p class="friend-sign">${esc(f.signature || '这个人很懒…')}</p>
            <p class="friend-visit">${f.lastVisit ? `最近来访 ${timeAgo(f.lastVisit)}` : '还没有来访记录'}</p>
          </div>
        </div>
        <div class="friend-actions">
          <button class="btn btn-ghost btn-sm ${f.special ? 'is-special' : ''}" data-special="${esc(f.uin)}">
            ${icon('star', 13)} ${f.special ? '特别关心' : '设为关心'}
          </button>
          <a class="btn btn-ghost btn-sm" href="#/u/${esc(f.uin)}">逛空间</a>
          <a class="btn btn-ghost btn-sm" href="#/guestbook?uin=${esc(f.uin)}">留言</a>
        </div>
      </article>`;

    const special = friends.filter((f) => f.special);
    body.innerHTML = `
      ${
        special.length
          ? `<h3 class="section-title">${icon('star', 15)} 特别关心</h3>
             <div class="friend-grid">${special.map(card).join('')}</div>`
          : ''
      }
      <h3 class="section-title">全部好友</h3>
      <div class="friend-grid">${friends.map(card).join('')}</div>`;

    body.querySelectorAll<HTMLElement>('[data-special]').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const r = await api.toggleSpecial(btn.dataset.special!);
          toast(r.special ? '已加入特别关心' : '已取消特别关心', 'ok');
          await load();
        } catch (err) {
          toast((err as Error).message, 'err');
        }
      });
    });
  };

  await load();
}
