import { api, type AlbumView } from '../api';
import { mb, prepareImage } from '../image';
import { albumCardHTML } from '../components';
import { bindLightbox, confirmDialog, esc, icon, modal, timeAgo, toast } from '../ui';
import type { ViewCtx } from '../types';

/** 相册列表。 */
export async function renderAlbums(root: HTMLElement, _ctx: ViewCtx): Promise<void> {
  root.innerHTML = `<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${icon('plus', 15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;

  const grid = root.querySelector<HTMLElement>('#album-grid')!;
  const load = async () => {
    const r = await api.albums();
    const total = r.albums.reduce((n, a) => n + a.count, 0);
    root.querySelector('#album-sub')!.textContent = `${r.albums.length} 个相册 · 共 ${total} 张照片`;
    grid.innerHTML = r.albums.length
      ? r.albums.map(albumCardHTML).join('')
      : `<div class="card empty"><div class="empty-mark">${icon('image', 22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`;
  };
  await load();

  root.querySelector('#new-album')!.addEventListener('click', async () => {
    await modal({
      title: '新建相册',
      body: `<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,
      confirmText: '创建',
      onConfirm: async (box) => {
        const name = box.querySelector<HTMLInputElement>('#a-name')!.value.trim();
        if (!name) {
          toast('请填写相册名称', 'err');
          return false;
        }
        await api.createAlbum({
          name,
          description: box.querySelector<HTMLInputElement>('#a-desc')!.value.trim(),
          privacy: box.querySelector<HTMLSelectElement>('#a-priv')!.value,
        });
        toast('相册已创建', 'ok');
        await load();
        return true;
      },
    });
  });
}

/** 相册详情：批量上传真实图片到文件系统。 */
export async function renderAlbum(root: HTMLElement, ctx: ViewCtx): Promise<void> {
  const id = Number(ctx.params.id);
  let album: AlbumView = await api.album(id);

  const paint = () => {
    root.innerHTML = `<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${icon('back', 14)} 全部相册</a>
          <h1>${esc(album.name)}</h1>
          <p class="page-sub">${esc(album.description || '没有描述')} · ${album.count} 张 · ${timeAgo(album.at)}创建</p>
        </div>
        ${
          album.canEdit
            ? `<div class="head-btns">
                <label class="btn btn-primary btn-sm" title="单张上限 30MB，超过会自动压缩">${icon('upload', 14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden>
                </label>
                <button class="btn btn-ghost btn-sm danger" id="del-album">${icon('trash', 14)}</button>
              </div>`
            : ''
        }
      </header>
      <div class="photo-grid" id="photo-grid">
        ${
          album.photos?.length
            ? album.photos
                .map(
                  (p) => `<figure class="photo" data-pid="${p.id}">
                    <img src="${esc(p.url)}" alt="${esc(p.caption)}" loading="lazy" data-zoom="${esc(p.url)}">
                    <figcaption>
                      <span>${esc(p.caption || timeAgo(p.at))}</span>
                      <span class="photo-like">${icon('heart', 12)} ${p.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${p.id}" title="赞">${icon('heart', 14)}</button>
                      ${album.canEdit ? `<button class="photo-btn danger" data-del="${p.id}" title="删除">${icon('trash', 14)}</button>` : ''}
                    </div>
                  </figure>`,
                )
                .join('')
            : `<div class="card empty"><div class="empty-mark">${icon('image', 22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`
        }
      </div>
    </div>`;

    bindLightbox(root);

    root.querySelector<HTMLInputElement>('#photo-file')?.addEventListener('change', async (e) => {
      const input = e.target as HTMLInputElement;
      const files = Array.from(input.files ?? []);
      if (!files.length) return;
      toast(`正在处理 ${files.length} 张…`);
      try {
        const urls: string[] = [];
        const sizes: number[] = [];
        const widths: number[] = [];
        const heights: number[] = [];
        let savedBytes = 0;
        for (const f of files) {
          const prepared = await prepareImage(f);
          const { url } = await api.upload(prepared.file);
          urls.push(url);
          sizes.push(prepared.size);
          widths.push(prepared.width);
          heights.push(prepared.height);
          savedBytes += prepared.originalSize - prepared.size;
        }
        album = await api.addPhotos(album.id, urls, { sizes, widths, heights });
        toast(savedBytes > 512 * 1024 ? `上传完成，压缩节省 ${mb(savedBytes)}` : '上传完成', 'ok');
        paint();
      } catch (err) {
        toast((err as Error).message, 'err');
      } finally {
        input.value = '';
      }
    });

    root.querySelector('#del-album')?.addEventListener('click', async () => {
      if (!(await confirmDialog('删除相册', `《${album.name}》及其中 ${album.count} 张照片会一起删除。`))) return;
      try {
        await api.deleteAlbum(album.id);
        toast('相册已删除', 'ok');
        location.hash = '#/albums';
      } catch (err) {
        toast((err as Error).message, 'err');
      }
    });

    root.querySelector('#photo-grid')!.addEventListener('click', async (e) => {
      const t = e.target as HTMLElement;
      const like = t.closest<HTMLElement>('[data-like]');
      if (like) {
        e.stopPropagation();
        try {
          const r = await api.likePhoto(Number(like.dataset.like));
          like.classList.toggle('active', r.liked);
          const cap = like.closest('.photo')?.querySelector('.photo-like');
          if (cap) cap.innerHTML = `${icon('heart', 12)} ${r.count}`;
        } catch (err) {
          toast((err as Error).message, 'err');
        }
        return;
      }
      const del = t.closest<HTMLElement>('[data-del]');
      if (del) {
        e.stopPropagation();
        if (!(await confirmDialog('删除照片', '确定从相册中删除这张照片吗？'))) return;
        try {
          await api.deletePhoto(album.id, Number(del.dataset.del));
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
