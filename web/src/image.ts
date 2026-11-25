/**
 * 图片预处理：浏览器端先缩放再上传。
 * 手机原图动辄 8–15MB，直接传既慢又容易被服务端上限挡住；
 * 这里在不明显损失观感的前提下压到 3MB 以内。
 */

export interface PreparedImage {
  file: File;
  width: number;
  height: number;
  size: number;
  compressed: boolean;
  originalSize: number;
}

const MAX_SIDE = 2560;
const MAX_BYTES = 3 * 1024 * 1024;

function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file).catch(() => loadImageElement(file));
  }
  return loadImageElement(file);
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片解码失败，可能是不支持的格式'));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('图片压缩失败'))), type, quality);
  });
}

/**
 * 按需压缩：长边超过 2560 或体积超过 2MB 时缩放重编码。
 * 动图与 SVG 不处理（保留原样）。
 */
export async function prepareImage(file: File, maxBytes = MAX_BYTES): Promise<PreparedImage> {
  const passthrough: PreparedImage = {
    file,
    width: 0,
    height: 0,
    size: file.size,
    compressed: false,
    originalSize: file.size,
  };
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return passthrough;

  const bitmap = await loadBitmap(file);
  const w = 'width' in bitmap ? bitmap.width : 0;
  const h = 'height' in bitmap ? bitmap.height : 0;
  if (!w || !h) return passthrough;

  passthrough.width = w;
  passthrough.height = h;
  if (file.size <= 2 * 1024 * 1024 && Math.max(w, h) <= MAX_SIDE) return passthrough;

  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  let cw = Math.round(w * scale);
  let ch = Math.round(h * scale);

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) return passthrough;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, cw, ch);
  if ('close' in bitmap && typeof bitmap.close === 'function') bitmap.close();

  const type = 'image/webp';
  let quality = 0.9;
  let blob = await toBlob(canvas, type, quality);

  // 仍然偏大就降质量，最多再试三轮；再不达标就缩尺寸
  let guard = 0;
  while (blob.size > maxBytes && guard < 4) {
    quality = Math.max(0.6, quality - 0.1);
    blob = await toBlob(canvas, type, quality);
    if (blob.size > maxBytes && guard === 3) {
      cw = Math.round(cw * 0.8);
      ch = Math.round(ch * 0.8);
      canvas.width = cw;
      canvas.height = ch;
      ctx.drawImage(bitmap as CanvasImageSource, 0, 0, cw, ch);
      blob = await toBlob(canvas, type, quality);
    }
    guard++;
  }

  const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
  const out = new File([blob], name, { type });
  return {
    file: out,
    width: cw,
    height: ch,
    size: out.size,
    compressed: true,
    originalSize: file.size,
  };
}

export function mb(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  return `${Math.round(bytes / 1024)}KB`;
}
