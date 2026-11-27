import { api, type PostView } from '../api';
import { featuredHTML, postRowHTML } from '../components';
import { bgm } from '../music';
import { me, viewSignal } from '../state';
import { avatarHTML, bindLightbox, esc, icon, skeleton, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 首页：个人档案 + 置顶文章 + 最新文章 + 侧栏。 */
export async function renderHome(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const u = me();
  root.innerHTML = `<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${esc(u.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${avatarHTML(u.avatar, u.nickname, 0, '', 0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${icon('pin', 12)} ${esc(u.city || '未设置城市')} · ${esc(u.constellation || '—')}</p>
          <h1>${esc(u.nickname)}</h1>
          <p class="hero-sign">${esc(u.signature || '这个人正在写文章。')}</p>
          <div class="hero-stats">
            <span><b>${u.posts}</b>文章</span>
            <span><b>${u.photos}</b>照片</span>
            <span><b>${u.visitCount.toLocaleString()}</b>访问</span>
            <span><b>${u.signStreak}</b>连签</span>
          </div>
        </div>
        <div class="hero-actions hero-actions--self">
          <a class="btn btn-primary" href="#/write">${icon('pen', 15)} 写文章</a>
          <a class="btn btn-ghost" href="#/settings">${icon('settings', 15)} 设置</a>
        </div>
      </div>
    </section>

    <div class="home-grid">
      <div class="home-main" id="home-main">${skeleton(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`;

  bindLightbox(root);

  const main = root.querySelector<HTMLElement>('#home-main')!;
  const rail = root.querySelector<HTMLElement>('#home-rail')!;

  try {
    const [{ posts, total }, albums] = await Promise.all([api.posts({ limit: 7 }), api.albums()]);

    if (!posts.length) {
      main.innerHTML = `<div class="card empty">
        <div class="empty-mark">${icon('pen', 22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;
    } else {
      const featured = posts.find((p) => p.pinned) ?? posts[0];
      const rest = posts.filter((p) => p.id !== featured.id);
      main.innerHTML = `
        ${featuredHTML(featured)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${total} 篇 ${icon('chevron', 12)}</a>
        </div>
        <div class="post-list">${rest.map(postRowHTML).join('') || '<p class="muted">暂无更多文章</p>'}</div>`;
    }

    rail.innerHTML = `
      <section class="rail-card">
        <h3>关于我</h3>
        <p class="rail-bio">${esc(u.bio ? u.bio.split('\n')[0].replace(/^#+\s*/, '') : u.signature || '还没有写自我介绍。')}</p>
        <div class="tag-cloud">${u.tags.map((t) => `<a class="tag" href="#/search?q=${encodeURIComponent(t)}">${esc(t)}</a>`).join('') || '<span class="muted">还没有标签</span>'}</div>
        <a class="rail-link" href="#/about">了解更多 ${icon('chevron', 12)}</a>
      </section>

      <section class="rail-card">
        <h3>背景音乐</h3>
        <div class="rail-music">
          <div class="rail-disc ${bgmPlaying() ? 'spin' : ''}">${icon('music', 16)}</div>
          <div class="rail-music-meta">
            <b>${esc(u.bgmTitle || '未设置音轨')}</b>
            <span id="rail-music-state">${u.bgmUrl ? (bgmPlaying() ? '正在循环播放' : '已暂停 · 点下面的按钮继续') : '去设置里挑一首'}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${bgmPlaying() ? icon('pause', 13) : icon('play', 13)} ${bgmPlaying() ? '暂停' : '播放'}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${albums.albums
            .slice(0, 3)
            .map(
              (a) => `<a class="rail-album" href="#/album/${a.id}">
                <img src="${esc(a.cover)}" alt="" loading="lazy" decoding="async">
                <span>${esc(a.name)}</span>
              </a>`,
            )
            .join('') || '<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${icon('mail', 13)} 去留言</a>
      </section>`;

    const playBtn = rail.querySelector<HTMLElement>('#rail-play');
    const stateText = rail.querySelector<HTMLElement>('#rail-music-state');
    window.addEventListener(
      'qz:bgm',
      () => {
        if (!playBtn || !playBtn.isConnected) return;
        const playing = bgm.isPlaying();
        rail.querySelector('.rail-disc')?.classList.toggle('spin', playing);
        playBtn.innerHTML = `${playing ? icon('pause', 13) : icon('play', 13)} ${playing ? '暂停' : '播放'}`;
        if (stateText) stateText.textContent = playing ? '正在循环播放' : '已暂停 · 点下面的按钮继续';
      },
      { signal: viewSignal() },
    );
    playBtn?.addEventListener('click', () => {
      bgm.toggle();
    });
  } catch (err) {
    toast((err as Error).message, 'err');
  }

  void timeAgo;
  void ctx;
}

function bgmPlaying(): boolean {
  return bgm.isPlaying();
}

export type { PostView };
