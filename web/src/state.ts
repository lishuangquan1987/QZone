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

/** 应用主题：写入 data-theme 与强调色。 */
export function applyTheme(id: string): void {
  const theme = themes().find((t) => t.id === id) ?? themes()[0];
  document.documentElement.dataset.theme = theme?.id ?? 'aurora';
  if (theme) document.documentElement.style.setProperty('--accent', theme.accent);
}
