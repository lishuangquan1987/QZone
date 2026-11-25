import { api, type AlbumView, type PhotoView } from '../api';
import { albumCardHTML } from '../components';
import { bindLightbox, confirmDialog, esc, icon, modal, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 相册列表。 */
export async function renderAlbums(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  outlet.innerHTML = `
    <section class="card module-head">
      <div>
        <h2 class="module-title">${icon('image', 18)} 相册</h2>
        <p class="module-sub">照片会褪色，存档不会。</p>
      </div>
      <button class="btn btn-primary" id="new-album">${icon('plus', 15)} 创建相册</button>
    </section>
    <div id="album-grid" class="album-grid"></div>`;

  const grid = outlet.querySelector<HTMLElement>('#album-grid')!;
  const load = async () => {
    const r = await api.albums(ctx.params.uin || '');
    const total = r.albums.reduce((n, a) => n + a.count, 0);
    grid.innerHTML = r.albums.length
      ? r.albums.map(albumCardHTML).join('')
      : `<div class="card empty"><div class="empty-mark">${icon('image', 24)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">创建一个相册，把照片归档。</p></div>`;
    const sub = outlet.querySelector('.module-sub');
    if (sub) sub.textContent = `${r.albums.length} 个相册 · 共 ${total} 张照片`;
  };
  await load();

  outlet.querySelector('#new-album')!.addEventListener('click', async () => {
    const ok = await modal({
      title: '创建相册',
      body: `<form class="editor-form" id="album-form">
        <input class="input input-title" name="name" maxlength="24" placeholder="相册名称" required>
        <textarea class="textarea" name="description" rows="3" maxlength="120" placeholder="相册描述（可选）"></textarea>
        <select class="input" name="privacy">
          <option value="public">所有人可见</option>
          <option value="friends">仅好友可见</option>
          <option value="private">仅自己可见</option>
        </select>
      </form>`,
      confirmText: '创建',
      onConfirm: async (root) => {
        const f = root.querySelector<HTMLFormElement>('#album-form')!;
        const data = new FormData(f);
        const name = String(data.get('name') ?? '').trim();
        if (!name) {
          toast('请填写相册名称', 'err');
          return false;
        }
        await api.createAlbum({
          name,
          description: String(data.get('description') ?? ''),
          privacy: String(data.get('privacy') ?? 'public'),
        });
        toast('相册已创建', 'ok');
        await load();
        return true;
      },
    });
    void ok;
  });
}

/** 相册详情。 */
export async function renderAlbumDetail(outlet: HTMLElement, ctx: ViewCtx): Promise<void> {
  const id = ctx.params.id!;
  let album: AlbumView = await api.album(id);

  const photoHTML = (p: PhotoView) => `<figure class="photo" data-photo="${esc(p.id)}">
      <img src="${esc(p.url)}" alt="${esc(p.caption)}" loading="lazy" data-zoom="${esc(p.url)}">
      <figcaption class="photo-cap">
        <span>${esc(p.caption || '')}</span>
        <span class="photo-likes">${icon('heart', 12)} ${p.likes.length}</span>
      </figcaption>
      <div class="photo-tools">
        <button class="photo-btn" data-plike="${esc(p.id)}" title="赞">${icon('heart', 15)}</button>
        ${album.canEdit ? `<button class="photo-btn danger" data-pdel="${esc(p.id)}" title="删除">${icon('trash', 15)}</button>` : ''}
      </div>
    </figure>`;

  const paint = () => {
    outlet.innerHTML = `
      <section class="card module-head">
        <div>
          <a class="back-link" href="#/albums">${icon('back', 14)} 全部相册</a>
          <h2 class="module-title">${esc(album.name)}</h2>
          <p class="module-sub">${esc(album.description || '还没有描述')} · ${album.count} 张 · ${timeAgo(album.at)}创建</p>
        </div>
        <div class="head-actions">
          ${
            album.canEdit
              ? `<label class="btn btn-primary btn-sm">${icon('plus', 14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden></label>
                 <button class="btn btn-ghost btn-sm danger" id="del-album">${icon('trash', 14)} 删除相册</button>`
              : ''
          }
        </div>
      </section>
      <div class="photo-grid" id="photo-grid">
        ${
          album.photos?.length
            ? album.photos.map(photoHTML).join('')
            : `<div class="card empty"><div class="empty-mark">${icon('image', 24)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传第一张照片吧。</p></div>`
        }
      </div>`;

    bindLightbox(outlet);

    outlet.querySelector<HTMLInputElement>('#photo-file')?.addEventListener('change', async (e) => {
      const files = Array.from((e.target as HTMLInputElement).files ?? []);
      if (!files.length) return;
      toast(`正在上传 ${files.length} 张…`);
      try {
        const urls: string[] = [];
        for (const f of files) {
          if (f.size > 8 * 1024 * 1024) throw new Error(`${f.name} 超过 8MB`);
          const { url } = await api.upload(f);
          urls.push(url);
        }
        album = await api.addPhotos(album.id, urls, '');
        toast('上传完成', 'ok');
        paint();
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });

    outlet.querySelector('#del-album')?.addEventListener('click', async () => {
      if (!(await confirmDialog('删除相册', `《${album.name}》及其中 ${album.count} 张照片将一并删除。`))) return;
      try {
        await api.deleteAlbum(album.id);
        toast('相册已删除', 'ok');
        location.hash = '#/albums';
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });

    outlet.querySelector('#photo-grid')!.addEventListener('click', async (e) => {
      const like = (e.target as HTMLElement).closest<HTMLElement>('[data-plike]');
      if (like) {
        e.stopPropagation();
        try {
          const r = await api.likePhoto(like.dataset.plike!);
          like.classList.toggle('active', r.liked);
          const p = album.photos?.find((x) => x.id === like.dataset.plike);
          if (p) p.likes.length = r.count;
          const cap = like.closest('.photo')?.querySelector('.photo-likes');
          if (cap) cap.innerHTML = `${icon('heart', 12)} ${r.count}`;
        } catch (err) {
          toast((err as Error).message, 'err');
        }
        return;
      }
      const delBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-pdel]');
      if (delBtn) {
        e.stopPropagation();
        if (!(await confirmDialog('删除照片', '确定从相册中删除这张照片吗？'))) return;
        try {
          await api.deletePhoto(album.id, delBtn.dataset.pdel!);
          album = await api.album(album.id);
          paint();
          toast('已删除', 'ok');
        } catch (err) {
          toast((err as Error).message, 'err');
        }
      }
    });
  };

  paint();
}
