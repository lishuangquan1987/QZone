import type { Theme, UserView } from './api';

interface Boot {
  me: UserView;
  themes: Theme[];
  unread: number;
}

export const state = {
  boot: null as Boot | null,
} as const;

export function me(): UserView {
  if (!state.boot) throw new Error('尚未初始化');
  return state.boot.me;
}

export function setBoot(b: Boot): void {
  (state.boot as Boot | null) = b;
}

export function setMe(u: UserView): void {
  if (state.boot) state.boot.me = u;
}

export function themes(): Theme[] {
  return state.boot?.themes ?? [];
}

export function unread(): number {
  return state.boot?.unread ?? 0;
}

export function setUnread(n: number): void {
  if (state.boot) state.boot.unread = n;
  document.querySelectorAll<HTMLElement>('[data-unread]').forEach((el) => {
    el.textContent = n > 99 ? '99+' : String(n);
    el.hidden = n === 0;
  });
}

/** 应用强调色主题。深浅外观由 CSS 从 --theme-accent 派生，这里只交原始色值。 */
export function applyTheme(id: string): void {
  const theme = themes().find((t) => t.id === id) ?? themes()[0];
  document.documentElement.dataset.theme = theme?.id ?? 'aurora';
  if (theme) document.documentElement.style.setProperty('--theme-accent', theme.accent);
}

/**
 * 视图级事件生命周期。
 *
 * 每次路由切换前统一 abort，视图里挂到 window / document 的监听器
 * 用 { signal: viewSignal() } 注册即可自动回收，避免反复进出页面时叠加。
 */
let viewAC = new AbortController();

export function viewSignal(): AbortSignal {
  return viewAC.signal;
}

export function resetViewAbort(): void {
  viewAC.abort();
  viewAC = new AbortController();
}
