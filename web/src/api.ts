/**
 * 后端接口客户端。所有请求带 Cookie（Go 侧 HttpOnly 会话），
 * 401 时广播 auth-expired 事件，由 shell 统一跳转登录页。
 */

export interface Brief {
  uin: string;
  nickname: string;
  avatar: string;
  level: number;
  vip: number;
}

export interface UserView {
  uin: string;
  nickname: string;
  avatar: string;
  cover: string;
  signature: string;
  gender: number;
  age: number;
  city: string;
  constellation: string;
  level: number;
  vip: number;
  theme: string;
  mood: string;
  bgMusic: string;
  tags: string[];
  visitCount: number;
  friendCount: number;
  signStreak: number;
  sunValue: number;
  lastSignIn: string;
  isSelf: boolean;
  isFriend: boolean;
  posts: number;
  journals: number;
  photos: number;
  messages: number;
  todayVisit: number;
}

export interface CommentView {
  id: string;
  content: string;
  at: string;
  author: Brief;
  replyTo?: string;
  canDel: boolean;
}

export interface PostView {
  id: string;
  content: string;
  images: string[];
  location: string;
  visibility: 'public' | 'friends' | 'private';
  at: string;
  author: Brief;
  likes: Brief[];
  liked: boolean;
  comments: CommentView[];
  repostOf?: PostView;
  canDelete: boolean;
}

export interface PhotoView {
  id: string;
  url: string;
  caption: string;
  at: string;
  likes: Brief[];
  liked: boolean;
  comments: CommentView[];
  canDelete: boolean;
}

export interface AlbumView {
  id: string;
  name: string;
  description: string;
  cover: string;
  privacy: string;
  at: string;
  count: number;
  owner: Brief;
  canEdit: boolean;
  photos?: PhotoView[];
}

export interface JournalView {
  id: string;
  title: string;
  category: string;
  cover: string;
  content?: string;
  excerpt: string;
  mood: string;
  weather: string;
  views: number;
  at: string;
  author: Brief;
  likes: Brief[];
  liked: boolean;
  comments: CommentView[];
  canEdit: boolean;
}

export interface GuestbookView {
  id: string;
  content: string;
  reply: string;
  at: string;
  author: Brief;
  canDelete: boolean;
}

export interface FriendView {
  uin: string;
  nickname: string;
  avatar: string;
  signature: string;
  level: number;
  vip: number;
  special: boolean;
  lastVisit: string;
}

export interface NotificationView {
  id: string;
  kind: string;
  text: string;
  target: string;
  read: boolean;
  at: string;
  from: Brief;
}

export interface Theme {
  id: string;
  name: string;
  accent: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  let res: Response;
  try {
    res = await fetch(path, { credentials: 'include', ...init, headers });
  } catch {
    throw new ApiError(0, '网络连接失败，请检查服务是否启动');
  }
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('qz:expired'));
    throw new ApiError(401, '登录状态已失效');
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new ApiError(res.status, (data as { error?: string }).error || '请求失败');
  }
  return data as T;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' });
const patch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });

export const api = {
  login: (uin: string, password: string) => post<{ user: UserView; unread: number }>('/api/auth/login', { uin, password }),
  logout: () => post<{ ok: boolean }>('/api/auth/logout'),
  session: () =>
    get<{ authenticated: boolean; user?: UserView; unread?: number }>('/api/auth/session'),

  bootstrap: () =>
    get<{ me: UserView; friends: FriendView[]; unread: number; themes: Theme[] }>('/api/bootstrap'),

  user: (uin: string) => get<{ user: UserView }>(`/api/users/${uin}`),
  updateProfile: (body: Record<string, unknown>) => patch<UserView>('/api/users/me', body),
  signIn: () => post<{ already: boolean; streak: number; sunValue: number }>('/api/users/me/signin'),
  visitors: (uin: string, mode: 'in' | 'out' = 'in') =>
    get<{ visitors: { author: Brief; module: string; at: string }[]; total: number; today: number }>(
      `/api/users/${uin}/visitors?mode=${mode}`,
    ),
  visit: (uin: string, module: string) => post<{ ok: boolean }>(`/api/users/${uin}/visit`, { module }),

  feeds: (params: { uin?: string; scope?: string; before?: string; limit?: number; q?: string }) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    });
    return get<{ posts: PostView[]; hasMore: boolean; total: number }>(`/api/feeds?${qs}`);
  },
  createFeed: (body: { content: string; images: string[]; visibility: string; location?: string }) =>
    post<PostView>('/api/feeds', body),
  deleteFeed: (id: string) => del<{ ok: boolean }>(`/api/feeds/${id}`),
  likeFeed: (id: string) => post<{ liked: boolean; count: number }>(`/api/feeds/${id}/like`),
  commentFeed: (id: string, content: string, replyTo?: string) =>
    post<CommentView>(`/api/feeds/${id}/comments`, { content, replyTo }),
  deleteFeedComment: (id: string, cid: string) => del<{ ok: boolean }>(`/api/feeds/${id}/comments/${cid}`),
  repostFeed: (id: string, content: string) => post<PostView>(`/api/feeds/${id}/repost`, { content }),

  albums: (uin: string) => get<{ albums: AlbumView[] }>(`/api/albums?uin=${uin}`),
  album: (id: string) => get<AlbumView>(`/api/albums/${id}`),
  createAlbum: (body: { name: string; description: string; privacy: string }) =>
    post<AlbumView>('/api/albums', body),
  deleteAlbum: (id: string) => del<{ ok: boolean }>(`/api/albums/${id}`),
  addPhotos: (id: string, urls: string[], caption: string) =>
    post<AlbumView>(`/api/albums/${id}/photos`, { urls, caption }),
  deletePhoto: (aid: string, pid: string) => del<{ ok: boolean }>(`/api/albums/${aid}/photos/${pid}`),
  likePhoto: (id: string) => post<{ liked: boolean; count: number }>(`/api/photos/${id}/like`),
  commentPhoto: (id: string, content: string, replyTo?: string) =>
    post<CommentView>(`/api/photos/${id}/comments`, { content, replyTo }),

  journals: (params: { uin?: string; category?: string; q?: string }) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) qs.set(k, String(v));
    });
    return get<{ journals: JournalView[] }>(`/api/journals?${qs}`);
  },
  journal: (id: string) => get<JournalView>(`/api/journals/${id}`),
  createJournal: (body: Record<string, unknown>) => post<JournalView>('/api/journals', body),
  deleteJournal: (id: string) => del<{ ok: boolean }>(`/api/journals/${id}`),
  deleteJournalComment: (id: string, cid: string) =>
    del<{ ok: boolean }>(`/api/journals/${id}/comments/${cid}`),
  likeJournal: (id: string) => post<{ liked: boolean; count: number }>(`/api/journals/${id}/like`),
  commentJournal: (id: string, content: string, replyTo?: string) =>
    post<CommentView>(`/api/journals/${id}/comments`, { content, replyTo }),

  guestbook: (uin: string) => get<{ entries: GuestbookView[] }>(`/api/guestbook?uin=${uin}`),
  createGuestbook: (owner: string, content: string) =>
    post<GuestbookView>('/api/guestbook', { owner, content }),
  deleteGuestbook: (id: string) => del<{ ok: boolean }>(`/api/guestbook/${id}`),
  replyGuestbook: (id: string, reply: string) => post<{ ok: boolean }>(`/api/guestbook/${id}/reply`, { reply }),

  friends: (uin: string) => get<{ friends: FriendView[] }>(`/api/friends?uin=${uin}`),
  toggleSpecial: (uin: string) => post<{ special: boolean }>(`/api/friends/${uin}/special`),

  notifications: () =>
    get<{ notifications: NotificationView[]; unread: number }>('/api/notifications'),
  readNotifications: (ids: string[] = []) => post<{ unread: number }>('/api/notifications/read', { ids }),

  search: (q: string) =>
    get<{ posts: PostView[]; journals: JournalView[]; users: FriendView[]; albums: AlbumView[]; keyword: string }>(
      `/api/search?q=${encodeURIComponent(q)}`,
    ),

  upload: async (file: File): Promise<{ url: string }> => {
    const fd = new FormData();
    fd.append('file', file);
    return request<{ url: string }>('/api/upload', { method: 'POST', body: fd });
  },
};
