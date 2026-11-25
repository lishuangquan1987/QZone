import { api, type AlbumView, type JournalView, type PostView } from '../api';
import { bindFeedList, feedItemHTML, journalCardHTML, albumCardHTML } from '../components';
import { me, state } from '../state';
import { avatarHTML, bindLightbox, esc, icon, skeleton, text, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 他人空间：个人档 + 说说 / 日志 / 相册 / 留言。 */
export async function renderSpace(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const uin = ctx.params.uin!;
  const my = me();
  const isSelf = uin === my.uin;
  if (isSelf) {
    location.hash = '#/me';
    return;
  }

  outlet.innerHTML = skeleton(2);
  const { user: u } = await api.user(uin);
  void api.visit(uin, '个人档').catch(() => undefined);

  let tab: 'feeds' | 'journals' | 'albums' | 'guestbook' = 'feeds';

  outlet.innerHTML = `
    <section class="card space-hero">
      <div class="space-cover" style="background-image:url('${esc(u.cover)}')"></div>
      <div class="space-hero-body">
        ${avatarHTML(u.avatar, u.nickname, 72, u.uin, u.level)}
        <div class="space-hero-info">
          <h2>${esc(u.nickname)}
            ${u.vip ? `<span class="hero-vip">${icon('star', 10)}黄钻 ${u.vip}</span>` : ''}
            <span class="hero-level">Lv.${u.level}</span>
          </h2>
          <p class="space-sign">${esc(u.signature || '这个人很懒，什么都没留下')}</p>
          <div class="space-tags">
            <span>${icon('pin', 12)} ${esc(u.city)}</span>
            <span>${esc(u.constellation)}</span>
            ${u.tags.map((t) => `<em class="hero-tag">${esc(t)}</em>`).join('')}
          </div>
        </div>
        <div class="space-actions">
          <a class="btn btn-primary btn-sm" href="#/guestbook?uin=${esc(uin)}">${icon('mail', 14)} 留言</a>
          <button class="btn btn-ghost btn-sm" id="special-btn">${icon('star', 14)} 特别关心</button>
        </div>
      </div>
      <div class="space-stats">
        <div><b>${u.posts}</b><span>说说</span></div>
        <div><b>${u.photos}</b><span>照片</span></div>
        <div><b>${u.journals}</b><span>日志</span></div>
        <div><b>${u.visitCount.toLocaleString()}</b><span>人气</span></div>
        <div><b>${u.signStreak}</b><span>连签</span></div>
      </div>
    </section>

    <nav class="module-tabs">
      <button class="module-tab active" data-stab="feeds">说说<span class="tab-count">${u.posts}</span></button>
      <button class="module-tab" data-stab="journals">日志<span class="tab-count">${u.journals}</span></button>
      <button class="module-tab" data-stab="albums">相册</button>
      <button class="module-tab" data-stab="guestbook">留言<span class="tab-count">${u.messages}</span></button>
    </nav>
    <div id="space-body"></div>`;

  document.title = `${u.nickname}的QQ空间`;

  outlet.querySelector('#special-btn')!.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    try {
      const r = await api.toggleSpecial(uin);
      btn.classList.toggle('is-special', r.special);
      toast(r.special ? '已加入特别关心' : '已取消特别关心', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  const body = outlet.querySelector<HTMLElement>('#space-body')!;

  const paint = async () => {
    body.innerHTML = skeleton(2);
    if (tab === 'feeds') {
      const r = await api.feeds({ uin, limit: 8 });
      body.innerHTML = r.posts.length
        ? r.posts.map((p: PostView) => feedItemHTML(p)).join('')
        : `<div class="card empty"><p class="empty-title">TA 还没有发说说</p></div>`;
      bindFeedList(body, () => paint());
      bindLightbox(body);
      return;
    }
    if (tab === 'journals') {
      const r = await api.journals({ uin });
      body.innerHTML = r.journals.length
        ? r.journals.map((j: JournalView) => journalCardHTML(j)).join('')
        : `<div class="card empty"><p class="empty-title">还没有公开的日志</p></div>`;
      return;
    }
    if (tab === 'albums') {
      const r = await api.albums(uin);
      body.innerHTML = r.albums.length
        ? `<div class="album-grid">${r.albums.map((a: AlbumView) => albumCardHTML(a)).join('')}</div>`
        : `<div class="card empty"><p class="empty-title">还没有可见的相册</p></div>`;
      return;
    }
    const r = await api.guestbook(uin);
    body.innerHTML = r.entries.length
      ? `<div class="card">${r.entries
          .slice(0, 20)
          .map(
            (g) => `<div class="gb-mini">
              ${avatarHTML(g.author.avatar, g.author.nickname, 32, g.author.uin)}
              <div><b>${esc(g.author.nickname)}</b> <time>${timeAgo(g.at)}</time>
                <p>${text(g.content)}</p>
                ${g.reply ? `<p class="gb-mini-reply">主人回复：${text(g.reply)}</p>` : ''}
              </div></div>`,
          )
          .join('')}</div>`
      : `<div class="card empty"><p class="empty-title">留言板还是空的</p></div>`;
  };

  outlet.querySelectorAll<HTMLElement>('[data-stab]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      tab = btn.dataset.stab as typeof tab;
      outlet.querySelectorAll('[data-stab]').forEach((x) => x.classList.remove('active'));
      btn.classList.add('active');
      await paint();
    });
  });

  await paint();
  void state;
}
