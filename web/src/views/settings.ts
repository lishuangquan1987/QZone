import { api } from '../api';
import { bgm } from '../music';
import { mmss, REMOTE_CREDIT, REMOTE_TRACKS, streamURL } from '../music-tracks';
import { applyTheme, me, setMe, themes } from '../state';
import { getMode, setMode, type Mode } from '../theme';
import { esc, icon, toast } from '../ui';
import type { ViewCtx } from '../types';

const APPEARANCES: { id: Mode; name: string; icon: string }[] = [
  { id: 'light', name: '浅色', icon: 'sun' },
  { id: 'dark', name: '深色', icon: 'moon' },
  { id: 'auto', name: '跟随系统', icon: 'monitor' },
];

const TABS = [
  { key: 'profile', label: '个人档' },
  { key: 'decorate', label: '装扮' },
  { key: 'music', label: '背景音乐' },
];

/** 空间设置：个人档 / 装扮 / 背景音乐。 */
export async function renderSettings(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const tab = ctx.params.tab || 'profile';
  const u = me();

  root.innerHTML = `<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${TABS.map((t) => `<button class="seg-btn ${t.key === tab ? 'active' : ''}" data-tab="${t.key}">${t.label}</button>`).join('')}
    </nav>
    <div id="settings-body"></div>
  </div>`;

  root.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => {
    b.addEventListener('click', () => {
      location.hash = `#/settings?tab=${b.dataset.tab}`;
    });
  });

  const body = root.querySelector<HTMLElement>('#settings-body')!;

  if (tab === 'decorate') {
    body.innerHTML = `<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${esc(u.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${icon('upload', 14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">外观</h2>
      <p class="setting-hint">深色模式适合夜间写作；「跟随系统」会随设备的浅色 / 深色自动切换。这个偏好只保存在当前浏览器，不跟账号走。</p>
      <div class="theme-grid" id="appearance-grid">
        ${APPEARANCES.map(
          (a) => `<button class="theme-card ${getMode() === a.id ? 'active' : ''}" data-appearance="${a.id}">
            <span class="mode-swatch">${icon(a.icon, 14)}</span>
            <span>${a.name}</span>
          </button>`,
        ).join('')}
      </div>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${themes()
          .map(
            (t) => `<button class="theme-card ${u.theme === t.id ? 'active' : ''}" data-theme="${t.id}">
              <span class="theme-swatch" style="background:${t.accent}"></span>
              <span>${esc(t.name)}</span>
            </button>`,
          )
          .join('')}
      </div>
    </section>`;

    body.querySelector<HTMLInputElement>('#cover-file')!.addEventListener('change', async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      try {
        const { url } = await api.upload(f);
        const updated = await api.updateProfile({ cover: url });
        setMe(updated);
        body.querySelector<HTMLElement>('#cover-preview')!.style.backgroundImage = `url('${url}')`;
        toast('封面已更新', 'ok');
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });

    body.querySelectorAll<HTMLElement>('[data-appearance]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setMode(btn.dataset.appearance as Mode);
        body.querySelectorAll('[data-appearance]').forEach((x) => x.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    body.querySelectorAll<HTMLElement>('[data-theme]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.theme!;
        try {
          const updated = await api.updateProfile({ theme: id });
          setMe(updated);
          applyTheme(id);
          body.querySelectorAll('[data-theme]').forEach((x) => x.classList.remove('active'));
          btn.classList.add('active');
          toast('主题已切换', 'ok');
        } catch (err) {
          toast((err as Error).message, 'err');
        }
      });
    });
    return;
  }

  if (tab === 'music') {
    body.innerHTML = `<section class="card setting-card">
      <h2 class="setting-title">在线免费曲库</h2>
      <p class="setting-hint">来自 Kevin MacLeod 的 incompetech.com，<b>CC BY 4.0</b> 授权，可免费用作背景音乐。播放走本站代理，避开跨域与格式兼容问题。</p>
      <div class="music-library" id="music-online"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">内置合成曲目</h2>
      <p class="setting-hint">程序实时合成，完全无版权顾虑，没有外网也能播放。</p>
      <div class="music-library" id="music-builtin"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${bgm.isPlaying() ? 'spin' : ''}">${icon('music', 16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${esc(u.bgmTitle || '还没有设置音轨')}</b>
          <span id="bgm-sub">${u.bgmUrl ? '已保存，会在页面左下角循环播放' : '从上面的曲库挑一首，或上传自己的音频'}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="preview-btn">${icon('play', 13)} 试听</button>
      </div>
      <label class="field">
        <span>显示名称</span>
        <input class="input" id="bgm-title" maxlength="60" value="${esc(u.bgmTitle)}" placeholder="比如：夜航">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" id="save-bgm">保存设置</button>
        ${u.bgmUrl ? `<button class="btn btn-ghost danger" id="clear-bgm">移除背景音乐</button>` : ''}
      </div>

      <h2 class="setting-title">上传本地音频</h2>
      <p class="setting-hint">支持 MP3 / M4A / OGG / WAV / FLAC，单个文件不超过 50MB。</p>
      <label class="btn btn-ghost btn-sm">${icon('upload', 14)} 选择音频文件
        <input type="file" id="audio-file" accept="audio/*" hidden>
      </label>

      <h2 class="setting-title">使用音频直链</h2>
      <p class="setting-hint">填写任意可公开访问的音频地址（http/https 或站内 /media 路径）。</p>
      <div class="inline-form">
        <input class="input" id="bgm-url" placeholder="https://example.com/song.mp3">
        <button class="btn btn-primary btn-sm" id="bgm-url-save">使用</button>
      </div>
      <p class="setting-hint" style="margin-top:14px">
        说明：QQ 音乐等平台的播放接口需要签名与版权授权，本项目不抓取这些内容。在线曲库为 CC BY 4.0（署名：Kevin MacLeod, incompetech.com），内置曲目由程序合成，你也可以上传自己的音频或填写有权使用的直链。
      </p>
    </section>`;

    let pendingUrl = u.bgmUrl;
    let pendingTitle = u.bgmTitle;

    const syncCurrent = () => {
      (body.querySelector('#bgm-name') as HTMLElement).textContent = pendingTitle || '还没有设置音轨';
      (body.querySelector('#bgm-sub') as HTMLElement).textContent = pendingUrl
        ? '已选择，保存后生效'
        : '从上面的曲库挑一首，或上传自己的音频';
      if (!(body.querySelector('#bgm-title') as HTMLInputElement).value) {
        (body.querySelector('#bgm-title') as HTMLInputElement).value = pendingTitle;
      }
    };

    const pick = (url: string, title: string) => {
      pendingUrl = url;
      pendingTitle = title;
      (body.querySelector('#bgm-title') as HTMLInputElement).value = title;
      syncCurrent();
    };

    // 曲库：在线免费 + 内置合成。试听用独立 Audio，避免把当前背景音乐顶掉。
    let preview: HTMLAudioElement | null = null;
    let previewKey = '';

    const stopPreview = () => {
      if (preview) {
        preview.pause();
        preview.src = '';
        preview = null;
      }
      previewKey = '';
      body.querySelectorAll<HTMLElement>('.lib-play').forEach((b) => {
        b.classList.remove('on');
        b.innerHTML = `${icon('play', 12)}<span>试听</span>`;
      });
    };
    // 离开设置页时停掉试听，避免声音跟着走
    window.addEventListener('hashchange', stopPreview, { once: true });

    const cardHTML = (o: { id: string; title: string; mood: string; seconds: number; url: string; badge: string }) => `
      <article class="lib-card" data-id="${esc(o.id)}">
        <div class="lib-main">
          <b>${esc(o.title)}</b>
          <span>${esc(o.mood)} · ${mmss(o.seconds)}${o.badge ? ` · <em class="lib-badge">${esc(o.badge)}</em>` : ''}</span>
        </div>
        <div class="lib-actions">
          <button class="btn btn-ghost btn-sm lib-play" data-play="${esc(o.url)}" data-key="${esc(o.id)}">${icon('play', 12)}<span>试听</span></button>
          <button class="btn btn-soft btn-sm" data-pick="${esc(o.url)}" data-title="${esc(o.title)}">设为背景</button>
        </div>
      </article>`;

    const online = body.querySelector<HTMLElement>('#music-online')!;
    online.innerHTML =
      REMOTE_TRACKS.map((t) => cardHTML({ ...t, url: streamURL(t), badge: 'CC BY' })).join('') +
      `<p class="lib-credit">${icon('music', 11)} 署名：${esc(REMOTE_CREDIT)}</p>`;

    try {
      const { tracks } = await api.musicLibrary();
      body.querySelector<HTMLElement>('#music-builtin')!.innerHTML = tracks.length
        ? tracks
            .map((t) =>
              cardHTML({ id: t.id, title: t.title, mood: t.mood, seconds: t.duration, url: t.url, badge: '无版权' }),
            )
            .join('')
        : `<p class="muted">没有内置曲目</p>`;
    } catch (err) {
      body.querySelector<HTMLElement>('#music-builtin')!.innerHTML =
        `<span class="muted">曲库加载失败：${esc((err as Error).message)}</span>`;
    }

    body.querySelector('.setting-card')!.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const play = t.closest<HTMLElement>('.lib-play');
      if (play) {
        const url = play.dataset.play!;
        const key = play.dataset.key ?? url;
        if (previewKey === key && preview && !preview.paused) {
          stopPreview();
          return;
        }
        stopPreview();
        const audio = new Audio(url);
        preview = audio;
        audio.volume = 0.7;
        previewKey = key;
        play.classList.add('loading');
        play.innerHTML = `<span class="lib-spin"></span><span>载入中</span>`;
        audio.addEventListener('ended', stopPreview, { once: true });
        audio.addEventListener(
          'playing',
          () => {
            if (preview !== audio) return;
            play.classList.remove('loading');
            play.classList.add('on');
            play.innerHTML = `${icon('pause', 12)}<span>暂停</span>`;
          },
          { once: true },
        );
        audio.addEventListener(
          'error',
          () => {
            stopPreview();
            toast('试听失败：音源暂时不可用，换一首或稍后再试', 'err');
          },
          { once: true },
        );
        void audio.play().catch(() => {
          stopPreview();
          toast('试听失败：音源暂时不可用，换一首或稍后再试', 'err');
        });
        return;
      }
      const pickBtn = t.closest<HTMLElement>('[data-pick]');
      if (pickBtn) {
        pick(pickBtn.dataset.pick!, pickBtn.dataset.title!);
        toast(`已选择《${pickBtn.dataset.title}》，记得点保存`, 'ok');
      }
    });

    // 上传
    const audioInput = body.querySelector<HTMLInputElement>('#audio-file')!;
    audioInput.addEventListener('change', async () => {
      const f = audioInput.files?.[0];
      if (!f) return;
      if (f.size > 50 * 1024 * 1024) {
        toast('音频不能超过 50MB', 'err');
        return;
      }
      toast('正在上传音频…');
      try {
        const { url } = await api.uploadAudio(f);
        pick(url, f.name.replace(/\.[^.]+$/, ''));
        toast('上传完成，点保存生效', 'ok');
      } catch (err) {
        toast((err as Error).message, 'err');
      } finally {
        audioInput.value = '';
      }
    });

    // 直链
    body.querySelector('#bgm-url-save')!.addEventListener('click', () => {
      const input = body.querySelector<HTMLInputElement>('#bgm-url')!;
      const v = input.value.trim();
      if (!v) {
        toast('请填写音频地址', 'err');
        return;
      }
      if (!/^(https?:\/\/|\/media\/)/.test(v)) {
        toast('地址需要以 http(s):// 或 /media/ 开头', 'err');
        return;
      }
      pick(v, v.split('/').pop()?.replace(/\.[^.]+$/, '') || '外部音频');
      toast('已填入，点保存生效', 'ok');
    });

    // 试听 / 保存 / 移除
    body.querySelector('#preview-btn')!.addEventListener('click', () => {
      if (!pendingUrl) {
        toast('还没有选择音轨', 'err');
        return;
      }
      bgm.setTrack(pendingUrl, pendingTitle);
      bgm.toggle();
      setTimeout(() => body.querySelector('.music-disc')?.classList.toggle('spin', bgm.isPlaying()), 150);
    });

    body.querySelector('#save-bgm')!.addEventListener('click', async () => {
      const title = (body.querySelector('#bgm-title') as HTMLInputElement).value.trim();
      try {
        const updated = await api.updateProfile({ bgmUrl: pendingUrl, bgmTitle: title });
        setMe(updated);
        window.dispatchEvent(new CustomEvent('qz:profile', { detail: { bgmUrl: updated.bgmUrl, bgmTitle: updated.bgmTitle } }));
        toast('背景音乐已保存', 'ok');
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });

    body.querySelector('#clear-bgm')?.addEventListener('click', async () => {
      try {
        const updated = await api.updateProfile({ bgmUrl: '', bgmTitle: '' });
        setMe(updated);
        window.dispatchEvent(new CustomEvent('qz:profile', { detail: { bgmUrl: '', bgmTitle: '' } }));
        toast('已移除背景音乐', 'ok');
        await ctx.reload();
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });
    return;
  }

  // 个人档
  body.innerHTML = `<section class="card setting-card">
    <div class="avatar-line">
      <img src="${esc(u.avatar)}" alt="" id="avatar-preview">
      <div>
        <b>${esc(u.nickname)}</b>
        <p class="muted">@${esc(u.uin)} · Lv.${u.level}</p>
      </div>
      <label class="btn btn-ghost btn-sm">${icon('upload', 14)} 更换头像
        <input type="file" id="avatar-file" accept="image/*" hidden>
      </label>
    </div>

    <form id="profile-form" class="setting-form">
      <div class="form-2col">
        <label class="field"><span>昵称</span><input class="input" name="nickname" maxlength="20" value="${esc(u.nickname)}"></label>
        <label class="field"><span>城市</span><input class="input" name="city" maxlength="20" value="${esc(u.city)}"></label>
      </div>
      <label class="field"><span>一句话签名</span><input class="input" name="signature" maxlength="80" value="${esc(u.signature)}"></label>
      <label class="field">
        <span>自我介绍（Markdown，会显示在「关于」页）</span>
        <textarea class="input" name="bio" rows="8" maxlength="4000" placeholder="## 关于我&#10;&#10;写文章…">${esc(u.bio)}</textarea>
      </label>
      <label class="field"><span>标签（逗号分隔，最多 8 个）</span>
        <input class="input" name="tags" value="${esc(u.tags.join(','))}" placeholder="写作, 摄影, 徒步">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" type="submit">保存修改</button>
        <span class="muted">空间号注册后不可修改</span>
      </div>
    </form>
  </section>`;

  body.querySelector<HTMLInputElement>('#avatar-file')!.addEventListener('change', async (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    try {
      const { url } = await api.upload(f);
      const updated = await api.updateProfile({ avatar: url });
      setMe(updated);
      (body.querySelector('#avatar-preview') as HTMLImageElement).src = url;
      toast('头像已更新', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  body.querySelector<HTMLFormElement>('#profile-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const tags = String(data.get('tags') ?? '')
      .split(/[,，\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    try {
      const updated = await api.updateProfile({
        nickname: String(data.get('nickname') ?? '').trim(),
        city: String(data.get('city') ?? '').trim(),
        signature: String(data.get('signature') ?? '').trim(),
        bio: String(data.get('bio') ?? ''),
        tags,
      });
      setMe(updated);
      toast('已保存', 'ok');
      await ctx.reload();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });
}
