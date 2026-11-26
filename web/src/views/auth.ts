import { api } from '../api';
import { esc, icon, toast } from '../ui';
import { bindThemeToggle, themeToggleHTML } from '../theme';

/** 登录 / 注册：同一页切换，注册后自动登录。 */
export function renderAuth(root: HTMLElement, onSuccess: () => void | Promise<void>): void {
  root.innerHTML = `
  <div class="auth">
    ${themeToggleHTML('auth-theme', 17)}
    <section class="auth-brand">
      <div class="auth-brand-inner">
        <div class="auth-logo">${icon('pen', 20)}</div>
        <h1>个人空间</h1>
        <p class="auth-lead">写下长一点的东西。照片、文章、留言，都放在自己的域名里。</p>
        <ul class="auth-points">
          <li>${icon('book', 15)} Markdown 写作，支持插图与代码</li>
          <li>${icon('image', 15)} 相册真实上传，存放在你自己的服务器</li>
          <li>${icon('music', 15)} 背景音乐真实播放</li>
          <li>${icon('lock', 15)} 每篇文章独立设置可见范围</li>
        </ul>
      </div>
      <div class="auth-foot">Go · ent · SQLite · TypeScript</div>
    </section>

    <section class="auth-panel">
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">登录</button>
          <button class="auth-tab" data-tab="register">注册</button>
        </div>

        <form id="auth-form" class="auth-form">
          <label class="field">
            <span>空间号</span>
            <input class="input" name="uin" autocomplete="username" placeholder="字母、数字或下划线" required>
          </label>
          <label class="field" data-only="register" hidden>
            <span>昵称</span>
            <input class="input" name="nickname" maxlength="20" placeholder="别人看到的名字">
          </label>
          <label class="field">
            <span>密码</span>
            <input class="input" name="password" type="password" autocomplete="current-password" placeholder="至少 6 位" required>
          </label>
          <button class="btn btn-primary btn-lg btn-block" type="submit" id="auth-submit">登录</button>
        </form>

        <p class="auth-hint" id="auth-hint">还没有账号？点上面的「注册」，30 秒就能开通。</p>

        <div class="auth-demo">
          <span>演示账号</span>
          <button type="button" class="demo-chip" data-uin="294388344" data-pw="qzone123">294388344</button>
          <button type="button" class="demo-chip" data-uin="linwan" data-pw="qzone123">linwan</button>
        </div>
      </div>
    </section>
  </div>`;

  bindThemeToggle(root, 'auth-theme');

  const form = root.querySelector<HTMLFormElement>('#auth-form')!;
  const submit = root.querySelector<HTMLButtonElement>('#auth-submit')!;
  const hint = root.querySelector<HTMLElement>('#auth-hint')!;
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('.auth-tab'));
  let mode: 'login' | 'register' = 'login';

  const setAuthTab = (m: 'login' | 'register') => {
    mode = m;
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === m));
    root.querySelectorAll<HTMLElement>('[data-only="register"]').forEach((el) => {
      el.hidden = m !== 'register';
    });
    const nick = form.elements.namedItem('nickname') as HTMLInputElement;
    nick.required = m === 'register';
    submit.textContent = m === 'login' ? '登录' : '创建空间';
    hint.textContent =
      m === 'login' ? '还没有账号？点上面的「注册」，30 秒就能开通。' : '空间号将作为你的主页地址，注册后不可修改。';
  };

  tabs.forEach((t) => t.addEventListener('click', () => setAuthTab(t.dataset.tab as 'login' | 'register')));

  root.querySelectorAll<HTMLElement>('.demo-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      setAuthTab('login');
      (form.elements.namedItem('uin') as HTMLInputElement).value = chip.dataset.uin ?? '';
      (form.elements.namedItem('password') as HTMLInputElement).value = chip.dataset.pw ?? '';
      submit.focus();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const uin = String(data.get('uin') ?? '').trim();
    const pw = String(data.get('password') ?? '');
    const nick = String(data.get('nickname') ?? '').trim();
    if (mode === 'register' && !nick) {
      toast('请填写昵称', 'err');
      return;
    }
    submit.disabled = true;
    submit.textContent = mode === 'login' ? '登录中…' : '创建中…';
    try {
      if (mode === 'login') await api.login(uin, pw);
      else await api.register(uin, nick, pw);
      toast(mode === 'login' ? '欢迎回来' : '空间已开通', 'ok');
      await onSuccess();
    } catch (err) {
      toast(esc((err as Error).message), 'err');
      submit.disabled = false;
      submit.textContent = mode === 'login' ? '登录' : '创建空间';
    }
  });
}
