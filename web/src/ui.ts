/** 通用 UI 工具：转义、时间、图标、弹层、提示、图片查看器。 */

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 保留换行的文本渲染。 */
export function text(s: string): string {
  return esc(s).replace(/\n/g, '<br>');
}

const pad = (n: number) => String(n).padStart(2, '0');

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const min = 60_000;
  if (diff < min) return '刚刚';
  if (diff < 60 * min) return `${Math.floor(diff / min)} 分钟前`;
  const d = new Date(t);
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return `今天 ${hm}`;
  const yesterday = new Date(Date.now() - 86400_000);
  if (d.toDateString() === yesterday.toDateString()) return `昨天 ${hm}`;
  if (d.getFullYear() === today.getFullYear()) return `${d.getMonth() + 1}月${d.getDate()}日 ${hm}`;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function fullTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function dayLabel(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 线性图标（stroke 跟随文字色）。 */
const ICONS: Record<string, string> = {
  feed: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M18 20c0-2.2-.7-3.9-2-5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  bell: '<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
  star: '<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',
  camera: '<rect x="3" y="6.5" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="3.4"/><path d="M8.5 6.5l1.3-2h4.4l1.3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
  music: '<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',
  pin: '<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  edit: '<path d="M4 20h4l10-10-4-4L4 16z"/><path d="M14 6l4 4"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  logout: '<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/>',
};

export function icon(name: keyof typeof ICONS | string, size = 16): string {
  const body = ICONS[name] ?? '';
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

/** 头像 HTML，附带等级角标。 */
export function avatarHTML(avatar: string, nickname: string, size = 40, uin = '', level = 0): string {
  const img = avatar
    ? `<img src="${esc(avatar)}" alt="${esc(nickname)}" loading="lazy">`
    : `<span class="avatar-fallback">${esc(nickname.slice(0, 1))}</span>`;
  const href = uin ? `href="#/u/${esc(uin)}"` : '';
  return `<a class="avatar" ${href} style="width:${size}px;height:${size}px">${img}${
    level ? `<i class="avatar-level">${level}</i>` : ''
  }</a>`;
}

export function toast(message: string, kind: 'info' | 'ok' | 'err' = 'info'): void {
  const box = document.getElementById('toasts') ?? (() => {
    const el = document.createElement('div');
    el.id = 'toasts';
    document.body.appendChild(el);
    return el;
  })();
  const item = document.createElement('div');
  item.className = `toast toast-${kind}`;
  item.textContent = message;
  box.appendChild(item);
  requestAnimationFrame(() => item.classList.add('in'));
  setTimeout(() => {
    item.classList.remove('in');
    setTimeout(() => item.remove(), 260);
  }, 2400);
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

/** 通用对话框，返回是否确认。 */
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
    const first = wrap.querySelector<HTMLElement>('input, textarea');
    first?.focus();
  });
}

export async function confirmDialog(title: string, message: string, confirmText = '删除'): Promise<boolean> {
  return modal({
    title,
    body: `<p class="confirm-text">${esc(message)}</p>`,
    confirmText,
  });
}

/** 图片查看器：点击 [data-zoom] 打开，支持左右切换。 */
export function bindLightbox(root: HTMLElement): void {
  root.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-zoom]');
    if (!target) return;
    const src = target.dataset.zoom || (target as HTMLImageElement).src;
    const group = Array.from(root.querySelectorAll<HTMLElement>('[data-zoom]')).map(
      (n) => n.dataset.zoom || (n as HTMLImageElement).src,
    );
    let idx = Math.max(0, group.indexOf(src));
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `
      <button class="lb-close">${icon('close', 26)}</button>
      <button class="lb-prev">${icon('back', 26)}</button>
      <img alt="">
      <button class="lb-next">${icon('chevron', 26)}</button>
      <div class="lb-count"></div>`;
    document.body.appendChild(box);
    document.body.classList.add('no-scroll');
    const img = box.querySelector('img')!;
    const counter = box.querySelector('.lb-count')!;
    const render = () => {
      img.src = group[idx];
      counter.textContent = `${idx + 1} / ${group.length}`;
    };
    render();
    const close = () => {
      box.remove();
      document.body.classList.remove('no-scroll');
    };
    box.querySelector('.lb-close')!.addEventListener('click', close);
    box.addEventListener('click', (ev) => {
      if (ev.target === box) close();
    });
    box.querySelector('.lb-prev')!.addEventListener('click', (ev) => {
      ev.stopPropagation();
      idx = (idx - 1 + group.length) % group.length;
      render();
    });
    box.querySelector('.lb-next')!.addEventListener('click', (ev) => {
      ev.stopPropagation();
      idx = (idx + 1) % group.length;
      render();
    });
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        close();
        window.removeEventListener('keydown', onKey);
      }
      if (ev.key === 'ArrowLeft') box.querySelector<HTMLElement>('.lb-prev')!.click();
      if (ev.key === 'ArrowRight') box.querySelector<HTMLElement>('.lb-next')!.click();
    };
    window.addEventListener('keydown', onKey);
  });
}

export function emptyState(title: string, desc = '', actionHTML = ''): string {
  return `<div class="empty">
    <div class="empty-mark">${icon('image', 26)}</div>
    <p class="empty-title">${esc(title)}</p>
    ${desc ? `<p class="empty-desc">${esc(desc)}</p>` : ''}
    ${actionHTML}
  </div>`;
}

export function skeleton(n = 3): string {
  return Array.from({ length: n })
    .map(
      () => `<div class="card skel-card">
        <div class="skel skel-avatar"></div>
        <div class="skel-lines">
          <div class="skel skel-line w40"></div>
          <div class="skel skel-line w90"></div>
          <div class="skel skel-line w70"></div>
        </div>
      </div>`,
    )
    .join('');
}
