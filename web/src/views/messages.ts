import { api, type NotificationView } from '../api';
import { avatarHTML, esc, icon, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

const KIND: Record<string, { icon: string; label: string }> = {
  like: { icon: 'heart', label: '赞' },
  comment: { icon: 'feed', label: '评论' },
  guestbook: { icon: 'mail', label: '留言' },
  visit: { icon: 'eye', label: '访客' },
  system: { icon: 'bell', label: '系统' },
};

function targetHref(n: NotificationView): string {
  if (n.target.startsWith('journal:')) return `#/journals`;
  if (n.target === 'guestbook') return '#/guestbook';
  if (n.target === 'visitors') return '#/visitors';
  if (n.target === 'profile') return `#/u/${esc(n.from.uin)}`;
  return '#/home';
}

/** 消息中心。 */
export async function renderMessages(outlet: HTMLElement, _ctx: ViewCtx): Promise<void> {
  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('bell', 18)} 消息中心</h2>
        <p class="module-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">全部标为已读</button>
    </section>
    <div id="msg-list"></div>`;

  const list = outlet.querySelector<HTMLElement>('#msg-list')!;
  const sub = outlet.querySelector('#msg-sub')!;

  const load = async () => {
    const r = await api.notifications();
    sub.textContent = r.unread ? `${r.unread} 条未读` : '全部已读';
    list.innerHTML = r.notifications.length
      ? `<div class="card msg-table">${r.notifications
          .map((n) => {
            const k = KIND[n.kind] ?? KIND.system;
            return `<a class="msg-row ${n.read ? '' : 'unread'}" href="${targetHref(n)}" data-nid="${esc(n.id)}">
              <span class="msg-kind msg-${esc(n.kind)}">${icon(k.icon, 15)}</span>
              <div class="msg-main">
                <div class="msg-line">${avatarHTML(n.from.avatar, n.from.nickname, 22, n.from.uin)}
                  <b>${esc(n.from.nickname)}</b><span class="msg-text">${esc(n.text)}</span></div>
                <time>${timeAgo(n.at)} · ${k.label}</time>
              </div>
              ${n.read ? '' : '<i class="msg-dot"></i>'}
            </a>`;
          })
          .join('')}</div>`
      : `<div class="card empty"><div class="empty-mark">${icon('bell', 24)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞或留言时会出现在这里。</p></div>`;
  };
  await load();

  outlet.querySelector('#read-all')!.addEventListener('click', async () => {
    try {
      const r = await api.readNotifications([]);
      toast('已全部标为已读', 'ok');
      sub.textContent = r.unread ? `${r.unread} 条未读` : '全部已读';
      document.querySelectorAll<HTMLElement>('[data-unread-badge]').forEach((el) => {
        el.hidden = true;
      });
      await load();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });
}
