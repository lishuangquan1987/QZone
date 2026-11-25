import { api } from '../api';
import { esc, icon, toast } from '../ui';

/** 登录页：账号密码 + 演示账号快填。 */
export function renderLogin(root: HTMLElement, onSuccess: () => void | Promise<void>): void {
  root.innerHTML = `
  <div class="login-page">
    <div class="login-brand">
      <div class="login-brand-inner">
        <div class="login-logo-box">${icon('star', 22)}</div>
        <h1 class="login-brand-title">QQ空间</h1>
        <p class="login-brand-sub">记录生活 · 分享心情 · 留住每一段时光</p>
        <ul class="login-features">
          <li>${icon('feed', 15)} 说说、日志、相册、留言板，一个地方装下全部回忆</li>
          <li>${icon('users', 15)} 好友动态与特别关心，谁来看过你一目了然</li>
          <li>${icon('lock', 15)} 每条内容都能单独设置可见范围</li>
        </ul>
      </div>
      <div class="login-brand-foot">Go + TypeScript 复刻实现</div>
    </div>

    <div class="login-panel">
      <form class="login-card" id="login-form">
        <h2>登录</h2>
        <p class="login-tip">使用 QQ 号与空间密码登录</p>
        <label class="field">
          <span>QQ 号</span>
          <input name="uin" inputmode="numeric" autocomplete="username" placeholder="请输入 QQ 号" required>
        </label>
        <label class="field">
          <span>密码</span>
          <input name="password" type="password" autocomplete="current-password" placeholder="请输入密码" required>
        </label>
        <button class="btn btn-primary btn-block btn-lg" type="submit" id="login-submit">登 录</button>
        <div class="login-demo">
          <p>演示账号</p>
          <button type="button" class="demo-chip" data-uin="294388344" data-pw="qzone123">
            294388344 / qzone123
          </button>
        </div>
        <p class="login-note">本机复刻环境，账号数据保存在 <code>data/db.json</code></p>
      </form>
    </div>
  </div>`;

  const form = root.querySelector<HTMLFormElement>('#login-form')!;
  const submit = root.querySelector<HTMLButtonElement>('#login-submit')!;

  root.querySelector('.demo-chip')!.addEventListener('click', (e) => {
    const el = e.currentTarget as HTMLElement;
    (form.elements.namedItem('uin') as HTMLInputElement).value = el.dataset.uin ?? '';
    (form.elements.namedItem('password') as HTMLInputElement).value = el.dataset.pw ?? '';
    submit.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const uin = String(data.get('uin') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (!uin || !password) {
      toast('请填写 QQ 号和密码', 'err');
      return;
    }
    submit.disabled = true;
    submit.textContent = '登录中…';
    try {
      const r = await api.login(uin, password);
      toast(`欢迎回来，${r.user.nickname}`, 'ok');
      await onSuccess();
    } catch (err) {
      toast(esc((err as Error).message), 'err');
      submit.disabled = false;
      submit.textContent = '登 录';
    }
  });
}
