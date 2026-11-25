import { api } from '../api';
import { applyTheme, me, setMe, themes, state } from '../state';
import { esc, icon, toast } from '../ui';
import type { ViewCtx } from '../types';

const TABS = [
  { key: 'profile', label: '个人档' },
  { key: 'decorate', label: '空间装扮' },
  { key: 'privacy', label: '权限设置' },
];

/** 个人档 / 装扮 / 权限。 */
export async function renderSettings(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const tab = ctx.params.tab || 'profile';
  const u = me();

  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('gear', 18)} 空间设置</h2>
        <p class="module-sub">修改资料、更换装扮与了解可见性规则。</p>
      </div>
    </section>
    <nav class="module-tabs">
      ${TABS.map(
        (t) => `<button class="module-tab ${t.key === tab ? 'active' : ''}" data-stab="${t.key}">${t.label}</button>`,
      ).join('')}
    </nav>
    <div id="settings-body"></div>`;

  outlet.querySelectorAll<HTMLElement>('[data-stab]').forEach((b) => {
    b.addEventListener('click', () => {
      location.hash = `#/settings?tab=${b.dataset.stab}`;
    });
  });

  const body = outlet.querySelector<HTMLElement>('#settings-body')!;

  if (tab === 'decorate') {
    body.innerHTML = `
      <section class="card decorate-card">
        <h3 class="form-title">空间封面</h3>
        <div class="cover-preview" style="background-image:url('${esc(u.cover)}')"></div>
        <label class="btn btn-ghost btn-sm">${icon('camera', 14)} 更换封面
          <input type="file" id="cover-file" accept="image/*" hidden>
        </label>
        <h3 class="form-title">主题配色</h3>
        <div class="theme-grid">
          ${themes()
            .map(
              (t) => `<button class="theme-card ${u.theme === t.id ? 'active' : ''}" data-theme-id="${t.id}">
                <span class="theme-swatch" style="background:${t.accent}"></span>
                <span class="theme-name">${esc(t.name)}</span>
              </button>`,
            )
            .join('')}
        </div>
        <h3 class="form-title">背景音乐</h3>
        <div class="inline-form">
          <input class="input" id="bgm-input" value="${esc(u.bgMusic)}" placeholder="如：晴天 - 周杰伦" maxlength="60">
          <button class="btn btn-primary btn-sm" id="bgm-save">保存</button>
        </div>
      </section>`;

    body.querySelector<HTMLInputElement>('#cover-file')!.addEventListener('change', async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      try {
        const { url } = await api.upload(f);
        const updated = await api.updateProfile({ cover: url });
        setMe(updated);
        toast('封面已更新，刷新后全局生效', 'ok');
        await ctx.reload();
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });

    body.querySelectorAll<HTMLElement>('[data-theme-id]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.themeId!;
        try {
          const updated = await api.updateProfile({ theme: id });
          setMe(updated);
          applyTheme(id);
          body.querySelectorAll('[data-theme-id]').forEach((x) => x.classList.remove('active'));
          btn.classList.add('active');
          toast('装扮已应用', 'ok');
        } catch (err) {
          toast((err as Error).message, 'err');
        }
      });
    });

    body.querySelector('#bgm-save')!.addEventListener('click', async () => {
      const v = body.querySelector<HTMLInputElement>('#bgm-input')!.value.trim();
      try {
        const updated = await api.updateProfile({ bgMusic: v });
        setMe(updated);
        toast('已保存背景音乐', 'ok');
        await ctx.reload();
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });
    return;
  }

  if (tab === 'privacy') {
    body.innerHTML = `
      <section class="card privacy-card">
        <h3 class="form-title">内容可见范围</h3>
        <p class="form-hint">每条说说、相册、日志都可以单独设置可见性，发布时会按所选范围过滤。</p>
        <div class="rules">
          <div class="rule"><b>所有人可见</b><span>任何能访问你空间的人都可以看到。</span></div>
          <div class="rule"><b>仅好友可见</b><span>只有好友列表里的人能看到，非好友访问时会被过滤。</span></div>
          <div class="rule"><b>仅自己可见</b><span>进入自己的空间才能看到，其他人（包括好友）都不可见。</span></div>
        </div>
        <h3 class="form-title">访客记录</h3>
        <p class="form-hint">谁会留下足迹：任何访问你空间的登录用户，都会记录到「谁看过我」，并在你的消息中心生成一条访客消息。</p>
      </section>`;
    return;
  }

  body.innerHTML = `
    <section class="card profile-form-card">
      <div class="avatar-edit">
        <img src="${esc(u.avatar)}" alt="" id="avatar-preview">
        <label class="btn btn-ghost btn-sm">${icon('camera', 14)} 更换头像
          <input type="file" id="avatar-file" accept="image/*" hidden>
        </label>
      </div>
      <form class="profile-form" id="profile-form">
        <div class="form-grid">
          <label class="field"><span>昵称</span><input class="input" name="nickname" maxlength="20" value="${esc(u.nickname)}"></label>
          <label class="field"><span>城市</span><input class="input" name="city" maxlength="20" value="${esc(u.city)}"></label>
          <label class="field"><span>心情</span><input class="input" name="mood" maxlength="20" value="${esc(u.mood)}"></label>
          <label class="field"><span>背景音乐</span><input class="input" name="bgMusic" maxlength="60" value="${esc(u.bgMusic)}"></label>
        </div>
        <label class="field"><span>个性签名</span>
          <input class="input" name="signature" maxlength="60" value="${esc(u.signature)}"></label>
        <label class="field"><span>标签（逗号分隔，最多 8 个）</span>
          <input class="input" name="tags" value="${esc(u.tags.join(','))}"></label>
        <div class="form-foot">
          <button class="btn btn-primary" type="submit">保存修改</button>
          <span class="form-hint">QQ 号 ${esc(u.uin)} · Lv.${u.level} · ${u.vip ? `黄钻 ${u.vip} 级` : '未开通黄钻'}</span>
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
      toast('头像已更新，刷新后全局生效', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  body.querySelector<HTMLFormElement>('#profile-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.currentTarget as HTMLFormElement;
    const data = new FormData(f);
    const tags = String(data.get('tags') ?? '')
      .split(/[,，\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
    try {
      const updated = await api.updateProfile({
        nickname: String(data.get('nickname') ?? '').trim(),
        city: String(data.get('city') ?? '').trim(),
        mood: String(data.get('mood') ?? '').trim(),
        signature: String(data.get('signature') ?? '').trim(),
        bgMusic: String(data.get('bgMusic') ?? '').trim(),
        tags,
      });
      setMe(updated);
      toast('已保存', 'ok');
      await ctx.reload();
      ctx.refreshRail();
    } catch (err) {
      toast((err as Error).message, 'err');
    }
  });

  void state;
}
