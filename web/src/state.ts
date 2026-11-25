import type { UserView, FriendView, Theme } from './api';

interface Boot {
  me: UserView;
  friends: FriendView[];
  unread: number;
  themes: Theme[];
}

export const state = {
  boot: null as Boot | null,
  /** 当前浏览的空间主人（自己或他人） */
  spaceUin: '',
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

export function setFriends(list: FriendView[]): void {
  if (state.boot) state.boot.friends = list;
}

export function unread(): number {
  return state.boot?.unread ?? 0;
}

export function setUnread(n: number): void {
  if (state.boot) state.boot.unread = n;
  document.querySelectorAll<HTMLElement>('[data-unread-badge]').forEach((el) => {
    el.textContent = n > 99 ? '99+' : String(n);
    el.hidden = n === 0;
  });
}

export function themes(): Theme[] {
  return state.boot?.themes ?? [];
}

/** 应用装扮主题（写入 data-theme 与强调色）。 */
export function applyTheme(id: string): void {
  document.documentElement.dataset.theme = id || 'classic';
  const t = themes().find((x) => x.id === id);
  if (t) document.documentElement.style.setProperty('--accent', t.accent);
  else document.documentElement.style.removeProperty('--accent');
}
