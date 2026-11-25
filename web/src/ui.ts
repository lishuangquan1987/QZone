/** 通用 UI 工具：转义、时间、图标、弹层、提示、看图。 */

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const pad = (n: number) => String(n).padStart(2, '0');

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const min = 60_000;
  if (diff < min) return '刚刚';
  if (diff < 60 * min) return `${Math.floor(diff / min)} 分钟前`;
  const d = new Date(t);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return `今天 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const y = new Date(Date.now() - 86400_000);
  if (d.toDateString() === y.toDateString()) return `昨天 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (d.getFullYear() === today.getFullYear()) return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export function fullTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const ICONS: Record<string, string> = {
  pen: '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  heart:
    '<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',
  music: '<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  bell: '<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  star: '<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',
  logout: '<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',
  tag: '<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',
  pin: '<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
  listUl:
    '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',
  listOl:
    '<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',
  table:
    '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',
  codeInline: '<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',
  codeBlock: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',
  task: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>',
};

export function icon(name: string, size = 16): string {
  const body = ICONS[name] ?? '';
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export function avatarHTML(avatar: string, nickname: string, size = 40, uin = '', level = 0): string {
  const inner = avatar
    ? `<img src="${esc(avatar)}" alt="${esc(nickname)}" loading="lazy">`
    : `<span class="avatar-fallback">${esc(nickname.slice(0, 1))}</span>`;
  const href = uin ? `href="#/u/${esc(uin)}"` : '';
  const style = size > 0 ? ` style="width:${size}px;height:${size}px"` : '';
  return `<a class="avatar" ${href}${style}>${inner}${
    level ? `<i class="avatar-level">${level}</i>` : ''
  }</a>`;
}

export function toast(message: string, kind: 'info' | 'ok' | 'err' = 'info'): void {
  let box = document.getElementById('toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toasts';
    document.body.appendChild(box);
  }
  const item = document.createElement('div');
  item.className = `toast toast-${kind}`;
  item.textContent = message;
  box.appendChild(item);
  requestAnimationFrame(() => item.classList.add('in'));
  setTimeout(() => {
    item.classList.remove('in');
    setTimeout(() => item.remove(), 280);
  }, 2600);
}

export interface ModalOptions {
  title: string;
  body: string;
  confirmText?: string;
  cancelText?: string;
  wide?: boolean;
  onMount?: (root: HTMLElement) => void;
  onConfirm?: (root: HTMLElement) => boolean | void | Promise<boolean | void>;
}

export function modal(opts: ModalOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-mask';
    wrap.innerHTML = `
      <div class="modal ${opts.wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${esc(opts.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${icon('close', 18)}</button>
        </header>
        <div class="modal-body">${opts.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${esc(opts.cancelText ?? '取消')}</button>
          <button class="btn btn-primary modal-ok">${esc(opts.confirmText ?? '确定')}</button>
        </footer>
      </div>`;
    document.body.appendChild(wrap);
    document.body.classList.add('no-scroll');
    const close = (ok: boolean) => {
      wrap.remove();
      document.body.classList.remove('no-scroll');
      resolve(ok);
    };
    wrap.querySelector('.modal-x')!.addEventListener('click', () => close(false));
    wrap.querySelector('.modal-cancel')!.addEventListener('click', () => close(false));
    wrap.addEventListener('mousedown', (e) => {
      if (e.target === wrap) close(false);
    });
    const ok = wrap.querySelector('.modal-ok') as HTMLButtonElement;
    ok.addEventListener('click', async () => {
      if (!opts.onConfirm) return close(true);
      ok.disabled = true;
      try {
        const r = await opts.onConfirm(wrap);
        if (r !== false) close(true);
      } catch (err) {
        toast((err as Error).message, 'err');
      } finally {
        ok.disabled = false;
      }
    });
    opts.onMount?.(wrap);
    wrap.querySelector<HTMLElement>('input, textarea')?.focus();
  });
}

export async function confirmDialog(title: string, message: string, confirmText = '删除'): Promise<boolean> {
  return modal({ title, body: `<p class="confirm-text">${esc(message)}</p>`, confirmText });
}

export function bindLightbox(root: HTMLElement): void {
  root.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-zoom]');
    if (!target) return;
    if ((e.target as HTMLElement).closest('button')) return;
    const src = target.dataset.zoom || (target as HTMLImageElement).src;
    const group = Array.from(root.querySelectorAll<HTMLElement>('[data-zoom]')).map(
      (n) => n.dataset.zoom || (n as HTMLImageElement).src,
    );
    let idx = Math.max(0, group.indexOf(src));
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <button class="lb-close">${icon('close', 24)}</button>
      <button class="lb-prev">${icon('back', 24)}</button>
      <img alt="">
      <button class="lb-next">${icon('chevron', 24)}</button>
      <div class="lb-count"></div>`;
    document.body.appendChild(box);
    document.body.classList.add('no-scroll');
    const img = box.querySelector('img')!;
    const counter = box.querySelector('.lb-count')!;
    const paint = () => {
      img.src = group[idx];
      counter.textContent = `${idx + 1} / ${group.length}`;
    };
    paint();
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') close();
      if (ev.key === 'ArrowLeft' && group.length > 1) {
        idx = (idx - 1 + group.length) % group.length;
        paint();
      }
      if (ev.key === 'ArrowRight' && group.length > 1) {
        idx = (idx + 1) % group.length;
        paint();
      }
    };
    const close = () => {
      box.remove();
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
    box.querySelector('.lb-close')!.addEventListener('click', close);
    box.addEventListener('click', (ev) => {
      if (ev.target === box) close();
    });
    box.querySelector('.lb-prev')!.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (group.length > 1) {
        idx = (idx - 1 + group.length) % group.length;
        paint();
      }
    });
    box.querySelector('.lb-next')!.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (group.length > 1) {
        idx = (idx + 1) % group.length;
        paint();
      }
    });
    window.addEventListener('keydown', onKey);
  });
}

export function emptyState(title: string, desc = '', actionHTML = ''): string {
  return `<div class="empty">
    <div class="empty-mark">${icon('book', 22)}</div>
    <p class="empty-title">${esc(title)}</p>
    ${desc ? `<p class="empty-desc">${esc(desc)}</p>` : ''}
    ${actionHTML}
  </div>`;
}

export function skeleton(n = 3): string {
  return Array.from({ length: n })
    .map(
      () => `<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`,
    )
    .join('');
}

export function fmtSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
