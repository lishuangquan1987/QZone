/**
 * 接口客户端。会话走 HttpOnly Cookie，401 时广播 auth-expired。
 * 所有内容按用户隔离，前端只拿到当前账号有权查看的数据。
 */

export interface Brief {
  id: number;
  uin: string;
  nickname: string;
  avatar: string;
  level: number;
  vip: number;
}

export interface UserView {
  id: number;
  uin: string;
  nickname: string;
  avatar: string;
  cover: string;
  signature: string;
  bio: string;
  city: string;
  constellation: string;
  gender: number;
  age: number;
  level: number;
  vip: number;
  theme: string;
  mood: string;
  bgmTitle: string;
  bgmUrl: string;
  tags: string[];
  visitCount: number;
  signStreak: number;
  sunValue: number;
  lastSignIn: string;
  isSelf: boolean;
  posts: number;
  journals: number;
  photos: number;
  messages: number;
  todayVisit: number;
  createdAt: string;
}

export interface CommentView {
  id: number;
  content: string;
  at: string;
  author: Brief;
  replyTo?: string;
  canDel: boolean;
}

export interface PostView {
  id: number;
  title: string;
  summary: string;
  content?: string;
  cover: string;
  category: string;
  images: string[];
  visibility: 'public' | 'unlisted' | 'private';
  pinned: boolean;
  views: number;
  readingTime: number;
  at: string;
  updatedAt: string;
  author: Brief;
  likes: Brief[];
  liked: boolean;
  likeCount: number;
  comments: CommentView[];
  commentNum: number;
  canEdit: boolean;
}

export interface PhotoView {
  id: number;
  url: string;
  caption: string;
  width: number;
  height: number;
  size: number;
  at: string;
  likes: Brief[];
  likeCount: number;
  liked: boolean;
  canDel: boolean;
}

export interface AlbumView {
  id: number;
  name: string;
  description: string;
  cover: string;
  privacy: 'public' | 'unlisted' | 'private';
  at: string;
  count: number;
  owner: Brief;
  canEdit: boolean;
  photos?: PhotoView[];
}

export interface GuestbookView {
  id: number;
  content: string;
  reply: string;
  at: string;
  author: Brief;
  canDel: boolean;
  canEdit: boolean;
}

export interface NotificationView {
  id: number;
  kind: string;
  text: string;
  target: string;
  read: boolean;
  at: string;
  from: Brief;
}

export interface MusicTrack {
  id: string;
  title: string;
  mood: string;
  duration: number;
  url: string;
  source: string;
}

export interface Theme {
  id: string;
  name: string;
  accent: string;
}

import { DEMO } from './env';

export { DEMO };

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // 静态演示模式：请求交给浏览器内的模拟后端（GitHub Pages 托管时使用）
  if (DEMO) {
    // 演示后端单独成 chunk，正式部署不会加载
    const { demoRequest } = await import('./demo');
    const res = await demoRequest(path, init);
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('qz:expired'));
      throw new ApiError(401, (res.body as { error?: string }).error ?? '登录状态已失效');
    }
    if (res.status >= 400) throw new ApiError(res.status, (res.body as { error?: string }).error ?? '请求失败');
    return res.body as T;
  }

  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  let res: Response;
  try {
    res = await fetch(path, { credentials: 'include', ...init, headers });
  } catch {
    throw new ApiError(0, '网络连接失败，请检查服务是否已启动');
  }
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('qz:expired'));
    throw new ApiError(401, '登录状态已失效');
  }
  const raw = await res.text();
  const data = raw ? JSON.parse(raw) : {};
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error || '请求失败');
  return data as T;
}

const get = <T>(p: string) => request<T>(p);
const post = <T>(p: string, b?: unknown) =>
  request<T>(p, { method: 'POST', body: b === undefined ? undefined : JSON.stringify(b) });
const del = <T>(p: string) => request<T>(p, { method: 'DELETE' });
const patch = <T>(p: string, b: unknown) => request<T>(p, { method: 'PATCH', body: JSON.stringify(b) });

export interface PostInput {
  title: string;
  content: string;
  summary?: string;
  cover?: string;
  category?: string;
  images?: string[];
  visibility?: string;
  pinned?: boolean;
}

export const api = {
  register: (uin: string, nickname: string, password: string) =>
    post<{ user: UserView; unread: number }>('/api/auth/register', { uin, nickname, password }),
  login: (uin: string, password: string) =>
    post<{ user: UserView; unread: number }>('/api/auth/login', { uin, password }),
  logout: () => post<{ ok: boolean }>('/api/auth/logout'),
  session: () => get<{ authenticated: boolean; user?: UserView; unread?: number }>('/api/auth/session'),

  bootstrap: () => get<{ me: UserView; unread: number; themes: Theme[] }>('/api/bootstrap'),
  user: (uin: string) => get<{ user: UserView }>(`/api/users/${encodeURIComponent(uin)}`),
  updateProfile: (body: Record<string, unknown>) => patch<UserView>('/api/users/me', body),
  signIn: () => post<{ already: boolean; streak: number; sunValue: number }>('/api/users/me/signin'),
  visitors: (uin: string, mode: 'in' | 'out' = 'in') =>
    get<{ visitors: { author: Brief; module: string; at: string }[]; total: number; today: number }>(
      `/api/users/${encodeURIComponent(uin)}/visitors?mode=${mode}`,
    ),
  visit: (uin: string, module: string) =>
    post<{ ok: boolean }>(`/api/users/${encodeURIComponent(uin)}/visit`, { module }),

  posts: (q: { uin?: string; q?: string; category?: string; before?: string; limit?: number; sort?: string }) => {
    const qs = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    });
    return get<{ posts: PostView[]; hasMore: boolean; total: number }>(`/api/posts?${qs}`);
  },
  createPost: (body: PostInput) => post<PostView>('/api/posts', body),
  post: (id: number) => get<PostView>(`/api/posts/${id}`),
  updatePost: (id: number, body: PostInput) => patch<PostView>(`/api/posts/${id}`, body),
  deletePost: (id: number) => del<{ ok: boolean }>(`/api/posts/${id}`),
  likePost: (id: number) => post<{ liked: boolean; count: number }>(`/api/posts/${id}/like`),
  commentPost: (id: number, content: string, replyTo?: string) =>
    post<CommentView>(`/api/posts/${id}/comments`, { content, replyTo }),
  deleteComment: (id: number, cid: number) => del<{ ok: boolean }>(`/api/posts/${id}/comments/${cid}`),

  albums: (uin?: string) =>
    get<{ albums: AlbumView[] }>(`/api/albums${uin ? `?uin=${encodeURIComponent(uin)}` : ''}`),
  album: (id: number) => get<AlbumView>(`/api/albums/${id}`),
  createAlbum: (body: { name: string; description: string; privacy: string }) =>
    post<AlbumView>('/api/albums', body),
  deleteAlbum: (id: number) => del<{ ok: boolean }>(`/api/albums/${id}`),
  addPhotos: (id: number, urls: string[], meta?: { widths?: number[]; heights?: number[]; sizes?: number[] }) =>
    post<AlbumView>(`/api/albums/${id}/photos`, { urls, caption: '', ...meta }),
  deletePhoto: (aid: number, pid: number) => del<{ ok: boolean }>(`/api/albums/${aid}/photos/${pid}`),
  likePhoto: (id: number) => post<{ liked: boolean; count: number }>(`/api/photos/${id}/like`),

  guestbook: (uin?: string) =>
    get<{ entries: GuestbookView[] }>(`/api/guestbook${uin ? `?uin=${encodeURIComponent(uin)}` : ''}`),
  createGuestbook: (owner: string, content: string) =>
    post<GuestbookView>('/api/guestbook', { owner, content }),
  deleteGuestbook: (id: number) => del<{ ok: boolean }>(`/api/guestbook/${id}`),
  replyGuestbook: (id: number, reply: string) => post<{ ok: boolean }>(`/api/guestbook/${id}/reply`, { reply }),

  notifications: () => get<{ notifications: NotificationView[]; unread: number }>('/api/notifications'),
  readNotifications: (ids: number[] = []) => post<{ unread: number }>('/api/notifications/read', { ids }),

  musicLibrary: () => get<{ tracks: MusicTrack[]; note: string }>('/api/music/library'),

  search: (q: string) =>
    get<{ posts: PostView[]; users: UserView[]; albums: AlbumView[]; keyword: string }>(
      `/api/search?q=${encodeURIComponent(q)}`,
    ),

  upload: async (file: File): Promise<{ url: string }> => {
    const fd = new FormData();
    fd.append('file', file);
    return request<{ url: string }>('/api/upload', { method: 'POST', body: fd });
  },
  uploadAudio: async (file: File): Promise<{ url: string }> => {
    const fd = new FormData();
    fd.append('file', file);
    return request<{ url: string }>('/api/upload/audio', { method: 'POST', body: fd });
  },
};
