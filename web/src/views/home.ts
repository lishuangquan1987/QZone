import { api, type PostView } from '../api';
import { bindFeedList, feedItemHTML } from '../components';
import { me } from '../state';
import { bindLightbox, esc, icon, skeleton, toast } from '../ui';
import type { ViewCtx } from '../types';

const SCOPES = [
  { key: 'mine', label: '全部动态' },
  { key: 'friends', label: '好友动态' },
  { key: 'reposts', label: '转发' },
];

/** 说说模块：发布器 + 时间线。 */
export async function renderHome(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const u = me();
  const scope = ctx.params.scope || 'mine';

  outlet.innerHTML = `
    <section class="card composer" id="composer">
      <div class="composer-top">
        <img class="composer-avatar" src="${esc(u.avatar)}" alt="">
        <button class="composer-fake" id="composer-open">说点儿什么吧…</button>
      </div>
      <div class="composer-editor" hidden>
        <textarea class="composer-input" id="composer-input" rows="3" maxlength="2000"
          placeholder="这一刻的想法…"></textarea>
        <div class="composer-images" id="composer-images"></div>
        <div class="composer-bar">
          <div class="composer-tools">
            <label class="tool" title="照片">
              ${icon('camera', 16)}<span>照片</span>
              <input type="file" id="composer-file" accept="image/*" multiple hidden>
            </label>
            <input class="composer-loc" id="composer-loc" maxlength="30" placeholder="所在位置">
            <select class="composer-vis" id="composer-vis" title="可见范围">
              <option value="public">所有人可见</option>
              <option value="friends">仅好友可见</option>
              <option value="private">仅自己可见</option>
            </select>
          </div>
          <div class="composer-actions">
            <span class="composer-count" id="composer-count">0/2000</span>
            <button class="btn btn-ghost btn-sm" id="composer-cancel">取消</button>
            <button class="btn btn-primary btn-sm" id="composer-send">发表</button>
          </div>
        </div>
      </div>
    </section>

    <nav class="module-tabs">
      ${SCOPES.map(
        (s) =>
          `<button class="module-tab ${s.key === scope ? 'active' : ''}" data-scope="${s.key}">${s.label}</button>`,
      ).join('')}
      <span class="tabs-spacer"></span>
      <a class="tabs-link" href="#/journals">写日志 ${icon('chevron', 12)}</a>
    </nav>

    <div id="feed-list" class="feed-list">${skeleton(3)}</div>
    <button class="btn btn-ghost btn-block load-more" id="load-more" hidden>加载更多</button>`;

  const list = outlet.querySelector<HTMLElement>('#feed-list')!;
  const more = outlet.querySelector<HTMLButtonElement>('#load-more')!;
  let cursor: string | undefined;
  let done = false;

  const load = async (reset: boolean) => {
    if (reset) {
      cursor = undefined;
      done = false;
      list.innerHTML = skeleton(2);
    }
    const r = await api.feeds({ scope: scope === 'mine' ? 'mine' : scope, limit: 6, before: cursor });
    const html = r.posts.map(feedItemHTML).join('');
    if (reset) list.innerHTML = html;
    else list.insertAdjacentHTML('beforeend', html);
    if (r.posts.length) cursor = r.posts[r.posts.length - 1].at;
    done = !r.hasMore;
    more.hidden = done;
    if (reset && !r.posts.length) {
      list.innerHTML = `<div class="card empty">
        <div class="empty-mark">${icon('feed', 24)}</div>
        <p class="empty-title">这里还是空的</p>
        <p class="empty-desc">发一条说说，记录此刻的心情。</p>
      </div>`;
    }
  };

  more.addEventListener('click', async () => {
    more.disabled = true;
    try {
      await load(false);
    } finally {
      more.disabled = false;
    }
  });

  await load(true);
  bindFeedList(list, () => load(true));
  bindLightbox(list);

  outlet.querySelectorAll<HTMLElement>('[data-scope]').forEach((btn) => {
    btn.addEventListener('click', () => {
      location.hash = `#/home?scope=${btn.dataset.scope}`;
    });
  });

  bindComposer(outlet, () => load(true));
}

/** 发布器交互。 */
function bindComposer(outlet: HTMLElement, onPosted: () => Promise<void>): void {
  const box = outlet.querySelector<HTMLElement>('#composer')!;
  const openBtn = outlet.querySelector<HTMLButtonElement>('#composer-open')!;
  const editor = outlet.querySelector<HTMLElement>('.composer-editor')!;
  const input = outlet.querySelector<HTMLTextAreaElement>('#composer-input')!;
  const imageBox = outlet.querySelector<HTMLElement>('#composer-images')!;
  const fileInput = outlet.querySelector<HTMLInputElement>('#composer-file')!;
  const counter = outlet.querySelector<HTMLElement>('#composer-count')!;
  const sendBtn = outlet.querySelector<HTMLButtonElement>('#composer-send')!;
  const cancelBtn = outlet.querySelector<HTMLButtonElement>('#composer-cancel')!;
  const vis = outlet.querySelector<HTMLSelectElement>('#composer-vis')!;
  const loc = outlet.querySelector<HTMLInputElement>('#composer-loc')!;

  let images: string[] = [];
  let busy = false;

  const expand = () => {
    openBtn.hidden = true;
    editor.hidden = false;
    input.focus();
  };
  openBtn.addEventListener('click', expand);

  input.addEventListener('input', () => {
    counter.textContent = `${input.value.length}/2000`;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 260)}px`;
  });

  const renderImages = () => {
    imageBox.innerHTML = images
      .map(
        (url, i) => `<div class="composer-thumb">
          <img src="${esc(url)}" alt="" data-zoom="${esc(url)}">
          <button type="button" data-remove="${i}" aria-label="移除">${icon('close', 12)}</button>
        </div>`,
      )
      .join('');
  };

  imageBox.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-remove]');
    if (!btn) return;
    images.splice(Number(btn.dataset.remove), 1);
    renderImages();
  });

  fileInput.addEventListener('change', async () => {
    if (!fileInput.files?.length) return;
    const room = 9 - images.length;
    if (room <= 0) {
      toast('最多 9 张图片', 'err');
      return;
    }
    try {
      const picked = Array.from(fileInput.files).slice(0, room);
      toast(`正在上传 ${picked.length} 张图片…`);
      for (const f of picked) {
        if (f.size > 8 * 1024 * 1024) throw new Error(`${f.name} 超过 8MB`);
        const { url } = await api.upload(f);
        images.push(url);
        renderImages();
      }
      toast('上传完成', 'ok');
    } catch (err) {
      toast((err as Error).message, 'err');
    } finally {
      fileInput.value = '';
    }
  });

  cancelBtn.addEventListener('click', () => {
    input.value = '';
    images = [];
    renderImages();
    counter.textContent = '0/2000';
    editor.hidden = true;
    openBtn.hidden = false;
    box.classList.remove('expanded');
  });

  sendBtn.addEventListener('click', async () => {
    if (busy) return;
    const content = input.value.trim();
    if (!content && !images.length) {
      toast('说点什么吧', 'err');
      return;
    }
    busy = true;
    sendBtn.disabled = true;
    sendBtn.textContent = '发表中…';
    try {
      await api.createFeed({ content, images, visibility: vis.value, location: loc.value.trim() });
      toast('发表成功', 'ok');
      input.value = '';
      images = [];
      renderImages();
      counter.textContent = '0/2000';
      loc.value = '';
      editor.hidden = true;
      openBtn.hidden = false;
      await onPosted();
    } catch (err) {
      toast((err as Error).message, 'err');
    } finally {
      busy = false;
      sendBtn.disabled = false;
      sendBtn.textContent = '发表';
    }
  });
}

/* 供其他视图复用：只读时间线 */
export async function renderFeedBlock(container: HTMLElement, params: { uin?: string; scope?: string }): Promise<void> {
  container.innerHTML = skeleton(2);
  const r = await api.feeds({ ...params, limit: 6 });
  container.innerHTML = r.posts.length
    ? r.posts.map((p: PostView) => feedItemHTML(p)).join('')
    : `<div class="card empty"><p class="empty-title">还没有内容</p></div>`;
  bindFeedList(container, () => renderFeedBlock(container, params));
  bindLightbox(container);
}
