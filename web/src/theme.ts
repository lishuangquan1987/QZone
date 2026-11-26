/**
 * 外观模式（浅色 / 深色 / 跟随系统）。
 *
 * 只存 localStorage：这是「这台设备看着舒服」的偏好，不该跟账号走
 * （手机想深色、台式想浅色很正常），所以不写回后端。
 */
export type Mode = 'light' | 'dark' | 'auto';

const KEY = 'qz.mode';
const mq = window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

function read(): Mode {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'dark' || v === 'light' ? v : 'auto';
  } catch {
    return 'auto';
  }
}

let mode: Mode = read();

export function getMode(): Mode {
  return mode;
}

/** 当前实际渲染出来的外观（auto 时看系统）。 */
export function isDark(): boolean {
  return mode === 'dark' || (mode === 'auto' && mq.matches);
}

function paint(): void {
  const dark = isDark();
  const root = document.documentElement;
  root.dataset.appearance = dark ? 'dark' : 'light';
  // 让滚动条、原生控件（日期选择、自动填充底色）一起变暗
  root.style.colorScheme = dark ? 'dark' : 'light';
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#131412' : '#f7f4ee');
  listeners.forEach((fn) => fn());
}

export function setMode(m: Mode): void {
  mode = m;
  try {
    localStorage.setItem(KEY, m);
  } catch {
    /* 隐私模式下写不进去，当前会话仍生效 */
  }
  paint();
}

/** 浅 ⇄ 深。auto 状态下按「当前看起来的样子」切到反向的显式模式。 */
export function toggleMode(): Mode {
  setMode(isDark() ? 'light' : 'dark');
  return mode;
}

export function onModeChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

mq.addEventListener('change', () => {
  if (mode === 'auto') paint();
});

// 模块加载即定一次，避免 index.html 的内联脚本与运行时判断不一致
paint();

/* ---------- 视图里复用的切换按钮 ---------- */

import { icon } from './ui';

/** 生成切换按钮：当前深色显示太阳（点一下变亮），浅色显示月亮。 */
export function themeToggleHTML(id = 'theme-toggle', size = 17, cls = 'icon-btn'): string {
  return `<button class="${cls} theme-toggle" id="${id}" title="${toggleTip()}" aria-label="切换深色 / 浅色">${icon(isDark() ? 'sun' : 'moon', size)}</button>`;
}

function toggleTip(): string {
  return isDark() ? '切换到浅色' : '切换到深色';
}

/** 绑定按钮；返回解绑函数（视图卸载时调用，避免回调堆积）。 */
export function bindThemeToggle(root: ParentNode, id = 'theme-toggle'): () => void {
  const btn = root.querySelector<HTMLElement>(`#${id}`);
  if (!btn) return () => {};
  const sync = () => {
    if (!btn.isConnected) return;
    btn.innerHTML = icon(isDark() ? 'sun' : 'moon', 17);
    btn.title = toggleTip();
  };
  btn.addEventListener('click', () => {
    toggleMode();
    sync();
  });
  const off = onModeChange(sync);
  return off;
}
