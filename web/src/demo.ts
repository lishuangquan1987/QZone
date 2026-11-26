/**
 * 静态演示后端。
 *
 * `VITE_DEMO=1` 构建时启用：把 HTTP 请求交给本模块，在浏览器里用 localStorage
 * 模拟一套与 Go 服务一致的接口，于是纯静态托管（GitHub Pages）也能跑完整站点。
 * 正式部署（Go 服务）不会加载这段逻辑。
 */
import type {
  AlbumView,
  Brief,
  CommentView,
  GuestbookView,
  NotificationView,
  PhotoView,
  PostView,
  UserView,
} from './api';

const KEY = 'qz.demo.v1';
const SESSION = 'qz.demo.session';

/* ============================ 数据模型 ============================ */

interface DemoUser {
  id: number;
  uin: string;
  password: string;
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
  createdAt: string;
}

interface DemoPost {
  id: number;
  authorId: number;
  title: string;
  content: string;
  cover: string;
  category: string;
  images: string[];
  visibility: 'public' | 'unlisted' | 'private';
  pinned: boolean;
  views: number;
  at: string;
  updatedAt: string;
}

interface DemoAlbum {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  cover: string;
  privacy: 'public' | 'unlisted' | 'private';
  at: string;
}

interface DemoData {
  seq: number;
  users: DemoUser[];
  posts: DemoPost[];
  comments: { id: number; postId: number; authorId: number; content: string; at: string; replyTo: string }[];
  postLikes: { postId: number; userId: number }[];
  albums: DemoAlbum[];
  photos: { id: number; albumId: number; url: string; caption: string; width: number; height: number; size: number; at: string }[];
  photoLikes: { photoId: number; userId: number }[];
  guestbook: { id: number; ownerId: number; authorId: number; content: string; reply: string; at: string }[];
  notifications: { id: number; toId: number; fromId: number; kind: string; text: string; target: string; read: boolean; at: string }[];
  visits: { hostId: number; visitorId: number; module: string; at: string }[];
}

/* ============================ 素材（纯 SVG，离线可用） ============================ */

function svgArt(w: number, h: number, from: string, to: string, kind = 0): string {
  const id = Math.random().toString(36).slice(2, 7);
  const deco =
    kind % 3 === 0
      ? `<circle cx="${w * 0.22}" cy="${h * 0.34}" r="${Math.min(w, h) * 0.2}" fill="#ffffff" opacity="0.16"/>
         <circle cx="${w * 0.74}" cy="${h * 0.68}" r="${Math.min(w, h) * 0.3}" fill="#000000" opacity="0.1"/>`
      : kind % 3 === 1
        ? `<path d="M0 ${h * 0.72} L${w * 0.36} ${h * 0.44} L${w * 0.62} ${h * 0.66} L${w} ${h * 0.32} L${w} ${h} L0 ${h} Z" fill="#ffffff" opacity="0.14"/>
           <path d="M0 ${h * 0.84} L${w * 0.44} ${h * 0.6} L${w * 0.72} ${h * 0.8} L${w} ${h * 0.58} L${w} ${h} L0 ${h} Z" fill="#000000" opacity="0.08"/>`
        : `<rect x="${w * 0.1}" y="${h * 0.18}" width="${w * 0.34}" height="${h * 0.64}" fill="#ffffff" opacity="0.12"/>
           <rect x="${w * 0.56}" y="${h * 0.3}" width="${w * 0.34}" height="${h * 0.52}" fill="#000000" opacity="0.08"/>`;
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g${id})"/>${deco}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
}

function avatarOf(nickname: string, from: string, to: string): string {
  const ch = nickname.slice(0, 1);
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
    <rect width="120" height="120" rx="60" fill="url(#a)"/>
    <text x="60" y="76" font-family="Songti SC, Noto Serif SC, serif" font-size="52" fill="#ffffff" text-anchor="middle">${ch}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
}

/* ============================ 种子数据 ============================ */

const iso = (daysAgo: number, hour = 10, min = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

function seed(): DemoData {
  const u1: DemoUser = {
    id: 1,
    uin: '294388344',
    password: 'qzone123',
    nickname: 'Change~生活',
    avatar: avatarOf('C', '#2f5d50', '#7aa38f'),
    cover: svgArt(1600, 520, '#2f5d50', '#a9c3ac'),
    signature: '把日子过成可以翻回去的样子。',
    bio: '写字，拍照，偶尔做一点技术。这里是我的公开笔记：城市、阅读、以及一个人怎么把生活过慢。\n\n## 关于这个空间\n\n所有文章用 Markdown 写成，照片是真实上传的，音乐来自自己搭的曲库。',
    city: '杭州',
    constellation: '天秤座',
    gender: 1,
    age: 30,
    level: 32,
    vip: 1,
    theme: 'aurora',
    mood: '平静',
    bgmTitle: '夜航',
    bgmUrl: '',
    tags: ['写作', '城市观察', '摄影', 'Go'],
    visitCount: 12480,
    signStreak: 27,
    sunValue: 1280,
    lastSignIn: iso(0, 8),
    createdAt: iso(420),
  };

  const u2: DemoUser = {
    id: 2,
    uin: 'linwan',
    password: 'qzone123',
    nickname: '林晚',
    avatar: avatarOf('林', '#9a4a33', '#d9a47c'),
    cover: svgArt(1600, 520, '#9a4a33', '#e2b795'),
    signature: '在读一本很慢的书。',
    bio: '编辑，偶尔写字。喜欢在雨天整理旧照片。',
    city: '成都',
    constellation: '双鱼座',
    gender: 2,
    age: 28,
    level: 18,
    vip: 0,
    theme: 'ember',
    mood: '想睡',
    bgmTitle: '晨雾',
    bgmUrl: '',
    tags: ['阅读', '手账'],
    visitCount: 860,
    signStreak: 4,
    sunValue: 210,
    lastSignIn: iso(1, 9),
    createdAt: iso(120),
  };

  const p1 = svgArt(1400, 800, '#2f5d50', '#8fae9a', 1);
  const p2 = svgArt(1400, 800, '#7a6a55', '#d8c8a8', 0);
  const p3 = svgArt(1400, 800, '#3a4a63', '#9fb0c9', 2);
  const p4 = svgArt(1400, 800, '#9a4a33', '#e0a68a', 1);
  const p5 = svgArt(1400, 800, '#4b4741', '#a9a196', 0);

  const posts: DemoPost[] = [
    {
      id: 1,
      authorId: 1,
      title: '秋天的第七天',
      category: '随笔',
      cover: p1,
      images: [p1],
      visibility: 'public',
      pinned: true,
      views: 328,
      at: iso(1, 21),
      updatedAt: iso(1, 21),
      content: `## 一段开头

城市醒来的时候，风已经先到了。我把窗开了一条缝，让早晨的凉气进来。

> 秋天是把日子过慢的季节。

### 三件小事

- 煮一杯咖啡，等它凉一点再喝
- 把昨天没读完的稿子读完
- 出门走四十分钟，不戴耳机

### 一点记录

| 时间 | 做了什么 | 心情 |
| --- | --- | --- |
| 07:20 | 起床，开窗 | 清醒 |
| 09:00 | 读稿 | 专注 |
| 15:30 | 散步 | 松弛 |

![巷口的光](${p2})

写到这里的时候，楼下有人在练习小号，吹的是同一段旋律，反复了七八次，渐渐也顺耳了。

\`\`\`js
const season = ['春', '夏', '秋', '冬'];
console.log(season[2]); // 秋
\`\`\`

秋天适合做减法。把想做的事减到三件，把要去的地方减到两个，把要见的人减到几个真正想见的。剩下的事情，明年再说也不迟。`,
    },
    {
      id: 2,
      authorId: 1,
      title: '一个人住的第三年',
      category: '生活',
      cover: p2,
      images: [p2],
      visibility: 'public',
      pinned: false,
      views: 512,
      at: iso(4, 20, 30),
      updatedAt: iso(4, 20, 30),
      content: `独居这件事，第一年是新鲜，第二年是习惯，第三年才开始有形状。

### 形状是什么

是知道冰箱里剩下什么，是知道周末几点会有阳光斜进厨房，是知道楼下哪家店的老板会多送一碟小菜。

也是知道什么时候该给自己做一顿正经的饭。

1. 买菜不要一次买太多
2. 锅具三件就够：炒锅、汤锅、一个小奶锅
3. 每周留一个晚上什么都不做

> 一个人住最奢侈的不是空间，是不必解释。

第三年我买了一张更大的桌子。不是为了工作，是为了摊开书、摊开照片、摊开一个下午。

![桌面](${p3})`,
    },
    {
      id: 3,
      authorId: 1,
      title: '用 Go 的标准库写一个够用的 Web 服务',
      category: '技术',
      cover: p3,
      images: [p3],
      visibility: 'public',
      pinned: false,
      views: 1840,
      at: iso(9, 22),
      updatedAt: iso(8, 9),
      content: `Go 1.22 之后，\`net/http\` 的 \`ServeMux\` 支持了方法与路径参数，很多小项目已经不需要框架。

### 路由

\`\`\`go
mux := http.NewServeMux()
mux.HandleFunc("GET /api/posts", listPosts)
mux.HandleFunc("GET /api/posts/{id}", getPost)
mux.HandleFunc("POST /api/posts", createPost)
\`\`\`

### 中间件

用函数包装，比引入框架更透明：

\`\`\`go
func withAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := sessionOf(r); err != nil {
			writeJSON(w, 401, map[string]string{"error": "未登录"})
			return
		}
		next.ServeHTTP(w, r)
	})
}
\`\`\`

### 什么时候还是该上框架

- 需要复杂的中间件链和分组
- 需要自动生成 OpenAPI
- 团队规模大，约定比灵活更重要

**结论**：小项目里，标准库 + 一层薄薄的手写中间件，已经足够。`,
    },
    {
      id: 4,
      authorId: 1,
      title: '读《小径分岔的花园》',
      category: '阅读',
      cover: p4,
      images: [],
      visibility: 'public',
      pinned: false,
      views: 274,
      at: iso(16, 23),
      updatedAt: iso(16, 23),
      content: `博尔赫斯写时间，从来不写成一条线。

> 时间永远分岔，通向无数的将来。

读这本书最好的姿势是：读到一半合上，去想自己上一次做选择是什么时候，如果当时选了另一条，现在会站在哪里。

- 《特隆、乌克巴尔、奥比斯·特蒂乌斯》——关于一个虚构世界如何渗进现实
- 《通天塔图书馆》——关于无限与秩序
- 《小径分岔的花园》——关于选择本身

短，但每一页都值得停一下。`,
    },
    {
      id: 5,
      authorId: 1,
      title: '雨天的一些照片',
      category: '城市',
      cover: p5,
      images: [p5, p2],
      visibility: 'public',
      pinned: false,
      views: 96,
      at: iso(22, 18),
      updatedAt: iso(22, 18),
      content: `雨天的城市会把颜色调低一档。

![雨后的街](${p5})

![窗](${p2})

拍不完，就先记下来。`,
    },
    {
      id: 6,
      authorId: 1,
      title: '关于「慢」的一点笔记',
      category: '随笔',
      cover: '',
      images: [],
      visibility: 'public',
      pinned: false,
      views: 41,
      at: iso(30, 9),
      updatedAt: iso(30, 9),
      content: `慢不是拖延，是把注意力放回手上正在做的事。

- 一件一件做
- 做完再说下一件
- 留白不是浪费

就这样。`,
    },
    {
      id: 7,
      authorId: 2,
      title: '在成都的雨天读书',
      category: '阅读',
      cover: p4,
      images: [p4],
      visibility: 'public',
      pinned: false,
      views: 130,
      at: iso(3, 16),
      updatedAt: iso(3, 16),
      content: `雨下了整整两天。

我把去年买的书翻出来，很多只读了三十页。这次从头读，发现当时读不下去，只是那时候的我还没准备好。

> 有些书要等。

顺便记一句：成都的雨不像杭州那样急，它是从早到晚均匀地落，像背景音。`,
    },
    {
      id: 8,
      authorId: 2,
      title: '写给自己的待办',
      category: '随笔',
      cover: '',
      images: [],
      visibility: 'public',
      pinned: false,
      views: 22,
      at: iso(8, 21),
      updatedAt: iso(8, 21),
      content: `- [x] 把照片按年份整理
- [ ] 学会一道新菜
- [ ] 周末去一次美术馆
- [ ] 早点睡`,
    },
  ];

  const albums: DemoAlbum[] = [
    { id: 1, ownerId: 1, name: '城市切片', description: '走过的地方，顺手拍下', cover: p5, privacy: 'public', at: iso(40) },
    { id: 2, ownerId: 1, name: '山与云', description: '夏天的一次远行', cover: p1, privacy: 'public', at: iso(70) },
    { id: 3, ownerId: 1, name: '私人相册', description: '只给自己看的', cover: p3, privacy: 'private', at: iso(12) },
    { id: 4, ownerId: 2, name: '雨天', description: '成都的雨', cover: p4, privacy: 'public', at: iso(6) },
  ];

  const photos: DemoData['photos'] = [
    { id: 1, albumId: 1, url: p5, caption: '午后的街', width: 1400, height: 800, size: 268_000, at: iso(41) },
    { id: 2, albumId: 1, url: p2, caption: '巷口', width: 1400, height: 800, size: 232_000, at: iso(39) },
    { id: 3, albumId: 1, url: p3, caption: '夜里', width: 1400, height: 800, size: 288_000, at: iso(20) },
    { id: 4, albumId: 2, url: p1, caption: '半山', width: 1400, height: 800, size: 312_000, at: iso(72) },
    { id: 5, albumId: 2, url: p4, caption: '落日', width: 1400, height: 800, size: 296_000, at: iso(71) },
    { id: 6, albumId: 3, url: p3, caption: '窗', width: 1400, height: 800, size: 201_000, at: iso(13) },
    { id: 7, albumId: 4, url: p4, caption: '雨', width: 1400, height: 800, size: 244_000, at: iso(6) },
  ];

  return {
    seq: 100,
    users: [u1, u2],
    posts,
    comments: [
      { id: 1, postId: 1, authorId: 2, content: '“秋天适合做减法”这句我很喜欢。', at: iso(1, 22), replyTo: '' },
      { id: 2, postId: 1, authorId: 1, content: '同感，越到年底越想减。', at: iso(0, 9), replyTo: '林晚' },
      { id: 3, postId: 3, authorId: 2, content: '中间件那段很实用，收藏了。', at: iso(8, 10), replyTo: '' },
    ],
    postLikes: [
      { postId: 1, userId: 2 },
      { postId: 3, userId: 2 },
      { postId: 7, userId: 1 },
    ],
    albums,
    photos,
    photoLikes: [
      { photoId: 1, userId: 2 },
      { photoId: 4, userId: 2 },
    ],
    guestbook: [
      { id: 1, ownerId: 1, authorId: 2, content: '来逛逛，文章很好看。', reply: '谢谢，常来。', at: iso(2, 20) },
      { id: 2, ownerId: 1, authorId: 2, content: '那篇 Go 的笔记帮我省了不少事。', reply: '', at: iso(7, 15) },
    ],
    notifications: [
      { id: 1, toId: 1, fromId: 2, kind: 'comment', text: '评论了《秋天的第七天》', target: 'post:1', read: false, at: iso(1, 22) },
      { id: 2, toId: 1, fromId: 2, kind: 'like', text: '赞了你的文章', target: 'post:1', read: false, at: iso(1, 21, 30) },
      { id: 3, toId: 1, fromId: 2, kind: 'guestbook', text: '在你的留言板留言', target: 'guestbook', read: true, at: iso(2, 20) },
      { id: 4, toId: 1, fromId: 2, kind: 'visit', text: '来过你的空间', target: 'profile', read: true, at: iso(2, 19) },
    ],
    visits: [
      { hostId: 1, visitorId: 2, module: '主页', at: iso(2, 19) },
      { hostId: 1, visitorId: 2, module: '文章', at: iso(0, 8) },
      { hostId: 2, visitorId: 1, module: '主页', at: iso(3, 17) },
    ],
  };
}

/* ============================ 存储 ============================ */

let cache: DemoData | null = null;

function db(): DemoData {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      cache = JSON.parse(raw) as DemoData;
      return cache;
    }
  } catch {
    /* 数据损坏就重建 */
  }
  cache = seed();
  persist();
  return cache;
}

function persist(): void {
  if (!cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // 配额满了（上传了大图）：本次会话仍可用，只是不落盘
    console.warn('[demo] 本地存储已满，改动不会持久化');
  }
}

const nextId = (): number => {
  const d = db();
  d.seq += 1;
  return d.seq;
};

/* ============================ 视图组装 ============================ */

type Res = { status: number; body: any };

const ok = (body: unknown): Res => ({ status: 200, body });
const bad = (status: number, error: string): Res => ({ status, body: { error } });

function currentUser(): DemoUser | null {
  const uin = localStorage.getItem(SESSION);
  if (!uin) return null;
  return db().users.find((u) => u.uin === uin) ?? null;
}

function unreadOf(u: DemoUser): number {
  return db().notifications.filter((n) => n.toId === u.id && !n.read).length;
}

function brief(u: DemoUser): Brief {
  return { id: u.id, uin: u.uin, nickname: u.nickname, avatar: u.avatar, level: u.level, vip: u.vip };
}

function readingTime(text: string): number {
  const n = text.replace(/[#>*_`~\-|\s!\[\]()]/g, '').length;
  return Math.max(1, Math.round(n / 400));
}

function plain(text: string, max = 120): string {
  const s = text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

function visibleTo(p: DemoPost, viewer: DemoUser | null): boolean {
  if (viewer && p.authorId === viewer.id) return true;
  return p.visibility === 'public';
}

function commentView(c: DemoData['comments'][number], viewer: DemoUser | null): CommentView {
  const author = db().users.find((u) => u.id === c.authorId)!;
  return {
    id: c.id,
    content: c.content,
    at: c.at,
    author: brief(author),
    replyTo: c.replyTo || undefined,
    canDel: !!viewer && (viewer.id === c.authorId || ownsPost(c.postId, viewer.id)),
  };
}

function ownsPost(postId: number, userId: number): boolean {
  return db().posts.some((p) => p.id === postId && p.authorId === userId);
}

function postView(p: DemoPost, viewer: DemoUser | null, detail = false): PostView {
  const author = db().users.find((u) => u.id === p.authorId)!;
  const likes = db().postLikes.filter((l) => l.postId === p.id);
  const comments = db()
    .comments.filter((c) => c.postId === p.id)
    .sort((a, b) => a.at.localeCompare(b.at));
  return {
    id: p.id,
    title: p.title,
    summary: plain(p.content),
    content: detail ? p.content : undefined,
    cover: p.cover,
    category: p.category,
    images: p.images,
    visibility: p.visibility,
    pinned: p.pinned,
    views: p.views,
    readingTime: readingTime(p.content),
    at: p.at,
    updatedAt: p.updatedAt,
    author: brief(author),
    likes: likes.map((l) => brief(db().users.find((u) => u.id === l.userId)!)),
    liked: !!viewer && likes.some((l) => l.userId === viewer.id),
    likeCount: likes.length,
    comments: detail ? comments.map((c) => commentView(c, viewer)) : [],
    commentNum: comments.length,
    canEdit: !!viewer && viewer.id === p.authorId,
  };
}

function photoView(ph: DemoData['photos'][number], viewer: DemoUser | null): PhotoView {
  const likes = db().photoLikes.filter((l) => l.photoId === ph.id);
  return {
    id: ph.id,
    url: ph.url,
    caption: ph.caption,
    width: ph.width,
    height: ph.height,
    size: ph.size,
    at: ph.at,
    likes: likes.map((l) => brief(db().users.find((u) => u.id === l.userId)!)),
    likeCount: likes.length,
    liked: !!viewer && likes.some((l) => l.userId === viewer.id),
    canDel: !!viewer && db().albums.some((a) => a.id === ph.albumId && a.ownerId === viewer.id),
  };
}

function albumView(a: DemoAlbum, viewer: DemoUser | null, detail = false): AlbumView {
  const owner = db().users.find((u) => u.id === a.ownerId)!;
  const photos = db().photos.filter((p) => p.albumId === a.id).sort((x, y) => y.at.localeCompare(x.at));
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    cover: a.cover || photos[0]?.url || '',
    privacy: a.privacy,
    at: a.at,
    count: photos.length,
    owner: brief(owner),
    canEdit: !!viewer && viewer.id === a.ownerId,
    photos: detail ? photos.map((p) => photoView(p, viewer)) : undefined,
  };
}

function albumVisible(a: DemoAlbum, viewer: DemoUser | null): boolean {
  if (viewer && a.ownerId === viewer.id) return true;
  return a.privacy === 'public';
}

function userView(u: DemoUser, viewer: DemoUser | null): UserView {
  const d = db();
  const visible = d.posts.filter((p) => p.authorId === u.id && visibleTo(p, viewer));
  const albums = d.albums.filter((a) => a.ownerId === u.id && albumVisible(a, viewer));
  const photoIds = d.photos.filter((p) => albums.some((a) => a.id === p.albumId)).map((p) => p.id);
  const today = new Date().toDateString();
  return {
    id: u.id,
    uin: u.uin,
    nickname: u.nickname,
    avatar: u.avatar,
    cover: u.cover,
    signature: u.signature,
    bio: u.bio,
    city: u.city,
    constellation: u.constellation,
    gender: u.gender,
    age: u.age,
    level: u.level,
    vip: u.vip,
    theme: u.theme,
    mood: u.mood,
    bgmTitle: u.bgmTitle,
    bgmUrl: u.bgmUrl,
    tags: u.tags,
    visitCount: u.visitCount,
    signStreak: u.signStreak,
    sunValue: u.sunValue,
    lastSignIn: u.lastSignIn,
    isSelf: !!viewer && viewer.id === u.id,
    posts: visible.length,
    journals: visible.filter((p) => p.category === '随笔').length,
    photos: photoIds.length,
    messages: d.notifications.filter((n) => n.toId === u.id && !n.read).length,
    todayVisit: d.visits.filter((v) => v.hostId === u.id && new Date(v.at).toDateString() === today).length + (u.id === 1 ? 6 : 1),
    createdAt: u.createdAt,
  };
}

function notify(toId: number, fromId: number, kind: string, text: string, target: string): void {
  if (toId === fromId) return;
  db().notifications.unshift({ id: nextId(), toId, fromId, kind, text, target, read: false, at: new Date().toISOString() });
}

/* ============================ 路由 ============================ */

export async function demoRequest(path: string, init: RequestInit = {}): Promise<Res> {
  const method = (init.method ?? 'GET').toUpperCase();
  const url = new URL(path, 'http://demo.local');
  const seg = url.pathname.split('/').filter(Boolean); // api / xxx / ...
  const body = (): any => {
    if (typeof init.body !== 'string') return {};
    try {
      return JSON.parse(init.body);
    } catch {
      return {};
    }
  };
  const me = currentUser();
  const d = db();
  const r = seg.slice(1); // 去掉 api

  /* ---------- 账号 ---------- */
  if (r[0] === 'auth') {
    if (r[1] === 'login' && method === 'POST') {
      const b = body();
      const u = d.users.find((x) => x.uin === String(b.uin).trim());
      if (!u || u.password !== b.password) return bad(400, '空间号或密码不正确');
      persist();
      localStorage.setItem(SESSION, u.uin);
      return ok({ user: userView(u, u), unread: unreadOf(u) });
    }
    if (r[1] === 'register' && method === 'POST') {
      const b = body();
      const uin = String(b.uin ?? '').trim();
      if (!/^[A-Za-z0-9_]{3,20}$/.test(uin)) return bad(400, '空间号需 3–20 位字母、数字或下划线');
      if (d.users.some((x) => x.uin === uin)) return bad(400, '这个空间号已经被占用了');
      if (String(b.password ?? '').length < 6) return bad(400, '密码至少 6 位');
      const u: DemoUser = {
        ...seed().users[0],
        id: nextId(),
        uin,
        password: String(b.password),
        nickname: String(b.nickname ?? uin).slice(0, 20),
        avatar: avatarOf(String(b.nickname ?? uin), '#2f5d50', '#8fae9a'),
        cover: svgArt(1600, 520, '#2f5d50', '#b7cbb6'),
        signature: '刚刚开通的空间。',
        bio: '',
        bgmTitle: '',
        bgmUrl: '',
        tags: [],
        visitCount: 0,
        signStreak: 0,
        sunValue: 0,
        lastSignIn: '',
        createdAt: new Date().toISOString(),
      };
      d.users.push(u);
      persist();
      localStorage.setItem(SESSION, uin);
      return ok({ user: userView(u, u), unread: 0 });
    }
    if (r[1] === 'logout') {
      localStorage.removeItem(SESSION);
      return ok({ ok: true });
    }
    if (r[1] === 'session') {
      if (!me) return ok({ authenticated: false });
      return ok({ authenticated: true, user: userView(me, me), unread: unreadOf(me) });
    }
  }

  if (r[0] === 'bootstrap') {
    if (!me) return bad(401, '未登录');
    return ok({ me: userView(me, me), unread: unreadOf(me), themes: THEMES });
  }

  if (!me) return bad(401, '未登录');

  /* ---------- 用户 ---------- */
  if (r[0] === 'users') {
    if (r[1] === 'me') {
      if (r[2] === 'signin' && method === 'POST') {
        const today = new Date().toDateString();
        const already = new Date(me.lastSignIn).toDateString() === today;
        if (!already) {
          me.signStreak += 1;
          me.sunValue += 10;
          me.lastSignIn = new Date().toISOString();
        }
        persist();
        return ok({ already, streak: me.signStreak, sunValue: me.sunValue });
      }
      if (method === 'PATCH') {
        const b = body();
        const allowed = ['nickname', 'signature', 'bio', 'city', 'constellation', 'gender', 'age', 'theme', 'mood', 'bgmTitle', 'bgmUrl', 'avatar', 'cover', 'tags'];
        allowed.forEach((k) => {
          if (b[k] !== undefined) (me as any)[k] = b[k];
        });
        persist();
        return ok(userView(me, me));
      }
    }
    const target = d.users.find((u) => u.uin === decodeURIComponent(r[1] ?? ''));
    if (!target) return bad(404, '空间不存在');
    if (r[2] === 'visitors') {
      if (target.id !== me.id) return bad(403, '只有主人可以查看访客记录');
      const mode = url.searchParams.get('mode') === 'out' ? 'out' : 'in';
      const rows = d.visits
        .filter((v) => (mode === 'in' ? v.hostId === target.id : v.visitorId === target.id))
        .sort((a, b) => b.at.localeCompare(a.at));
      return ok({
        visitors: rows.map((v) => ({
          author: brief(d.users.find((u) => u.id === (mode === 'in' ? v.visitorId : v.hostId))!),
          module: v.module,
          at: v.at,
        })),
        total: target.visitCount,
        today: rows.filter((v) => new Date(v.at).toDateString() === new Date().toDateString()).length,
      });
    }
    if (r[2] === 'visit' && method === 'POST') {
      if (target.id !== me.id) {
        target.visitCount += 1;
        d.visits.unshift({ hostId: target.id, visitorId: me.id, module: String(body().module ?? '主页'), at: new Date().toISOString() });
        notify(target.id, me.id, 'visit', '来过你的空间', 'profile');
        persist();
      }
      return ok({ ok: true });
    }
    return ok({ user: userView(target, me) });
  }

  /* ---------- 文章 ---------- */
  if (r[0] === 'posts') {
    if (r.length === 1) {
      if (method === 'GET') {
        const q = url.searchParams;
        const uin = q.get('uin');
        const cat = q.get('category') ?? '';
        const kw = (q.get('q') ?? '').trim().toLowerCase();
        const before = q.get('before');
        const limit = Number(q.get('limit') ?? 8);
        const sort = q.get('sort') === 'popular' ? 'popular' : 'latest';
        const owner = uin ? d.users.find((u) => u.uin === uin) : null;
        let list = d.posts.filter((p) => visibleTo(p, me));
        if (owner) list = list.filter((p) => p.authorId === owner.id);
        if (cat && cat !== '全部') list = list.filter((p) => p.category === cat);
        if (kw) list = list.filter((p) => (p.title + p.content).toLowerCase().includes(kw));
        list.sort((a, b) => (sort === 'popular' ? b.views - a.views : b.at.localeCompare(a.at)));
        const total = list.length;
        if (before) list = list.filter((p) => p.at < before);
        const page = list.slice(0, limit);
        return ok({ posts: page.map((p) => postView(p, me)), hasMore: list.length > page.length, total });
      }
      if (method === 'POST') {
        const b = body();
        const p: DemoPost = {
          id: nextId(),
          authorId: me.id,
          title: String(b.title ?? ''),
          content: String(b.content ?? ''),
          cover: String(b.cover ?? ''),
          category: String(b.category ?? '随笔'),
          images: Array.isArray(b.images) ? b.images : [],
          visibility: (b.visibility ?? 'public') as DemoPost['visibility'],
          pinned: !!b.pinned,
          views: 0,
          at: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        d.posts.unshift(p);
        persist();
        return ok(postView(p, me, true));
      }
    }

    const post = d.posts.find((p) => p.id === Number(r[1]));
    if (!post) return bad(404, '文章不存在');
    if (!visibleTo(post, me)) return bad(403, '没有权限查看这篇文章');

    if (r.length === 2) {
      if (method === 'GET') {
        post.views += 1;
        persist();
        return ok(postView(post, me, true));
      }
      if (method === 'PATCH') {
        if (post.authorId !== me.id) return bad(403, '只能编辑自己的文章');
        const b = body();
        post.title = String(b.title ?? post.title);
        post.content = String(b.content ?? post.content);
        post.cover = String(b.cover ?? post.cover);
        post.category = String(b.category ?? post.category);
        post.images = Array.isArray(b.images) ? b.images : post.images;
        post.visibility = (b.visibility ?? post.visibility) as DemoPost['visibility'];
        post.pinned = b.pinned ?? post.pinned;
        post.updatedAt = new Date().toISOString();
        persist();
        return ok(postView(post, me, true));
      }
      if (method === 'DELETE') {
        if (post.authorId !== me.id) return bad(403, '只能删除自己的文章');
        d.posts = d.posts.filter((p) => p.id !== post.id);
        d.comments = d.comments.filter((c) => c.postId !== post.id);
        d.postLikes = d.postLikes.filter((l) => l.postId !== post.id);
        persist();
        return ok({ ok: true });
      }
    }

    if (r[2] === 'like' && method === 'POST') {
      const i = d.postLikes.findIndex((l) => l.postId === post.id && l.userId === me.id);
      if (i >= 0) d.postLikes.splice(i, 1);
      else {
        d.postLikes.push({ postId: post.id, userId: me.id });
        notify(post.authorId, me.id, 'like', `赞了《${post.title || '无标题'}》`, `post:${post.id}`);
      }
      persist();
      const count = d.postLikes.filter((l) => l.postId === post.id).length;
      return ok({ liked: i < 0, count });
    }

    if (r[2] === 'comments') {
      if (method === 'POST') {
        const b = body();
        const content = String(b.content ?? '').trim();
        if (!content) return bad(400, '评论不能为空');
        const c = { id: nextId(), postId: post.id, authorId: me.id, content, at: new Date().toISOString(), replyTo: String(b.replyTo ?? '') };
        d.comments.push(c);
        notify(post.authorId, me.id, 'comment', `评论了《${post.title || '无标题'}》`, `post:${post.id}`);
        persist();
        return ok(commentView(c, me));
      }
      if (method === 'DELETE') {
        const cid = Number(r[3]);
        const idx = d.comments.findIndex((c) => c.id === cid && c.postId === post.id);
        if (idx < 0) return bad(404, '评论不存在');
        const c = d.comments[idx];
        if (c.authorId !== me.id && post.authorId !== me.id) return bad(403, '没有权限删除这条评论');
        d.comments.splice(idx, 1);
        persist();
        return ok({ ok: true });
      }
    }
  }

  /* ---------- 相册 ---------- */
  if (r[0] === 'albums') {
    if (r.length === 1) {
      if (method === 'GET') {
        const uin = url.searchParams.get('uin');
        const owner = uin ? d.users.find((u) => u.uin === uin) : me;
        if (!owner) return bad(404, '空间不存在');
        const list = d.albums.filter((a) => a.ownerId === owner.id && albumVisible(a, me));
        return ok({ albums: list.map((a) => albumView(a, me)) });
      }
      if (method === 'POST') {
        const b = body();
        const name = String(b.name ?? '').trim();
        if (!name) return bad(400, '请填写相册名称');
        const a: DemoAlbum = {
          id: nextId(),
          ownerId: me.id,
          name,
          description: String(b.description ?? ''),
          cover: '',
          privacy: (b.privacy ?? 'public') as DemoAlbum['privacy'],
          at: new Date().toISOString(),
        };
        d.albums.unshift(a);
        persist();
        return ok(albumView(a, me, true));
      }
    }
    const album = d.albums.find((a) => a.id === Number(r[1]));
    if (!album) return bad(404, '相册不存在');
    if (!albumVisible(album, me)) return bad(403, '没有权限查看这个相册');

    if (r.length === 2) {
      if (method === 'GET') return ok(albumView(album, me, true));
      if (method === 'DELETE') {
        if (album.ownerId !== me.id) return bad(403, '只能删除自己的相册');
        const ids = d.photos.filter((p) => p.albumId === album.id).map((p) => p.id);
        d.photos = d.photos.filter((p) => p.albumId !== album.id);
        d.photoLikes = d.photoLikes.filter((l) => !ids.includes(l.photoId));
        d.albums = d.albums.filter((a) => a.id !== album.id);
        persist();
        return ok({ ok: true });
      }
    }

    if (r[2] === 'photos') {
      if (method === 'POST') {
        if (album.ownerId !== me.id) return bad(403, '只能给自己的相册上传');
        const b = body();
        const urls: string[] = Array.isArray(b.urls) ? b.urls : [];
        urls.forEach((u, i) => {
          d.photos.push({
            id: nextId(),
            albumId: album.id,
            url: u,
            caption: String(b.caption ?? ''),
            width: Number(b.widths?.[i] ?? 1200),
            height: Number(b.heights?.[i] ?? 800),
            size: Number(b.sizes?.[i] ?? 0),
            at: new Date().toISOString(),
          });
        });
        if (!album.cover && urls[0]) album.cover = urls[0];
        persist();
        return ok(albumView(album, me, true));
      }
      if (method === 'DELETE') {
        const pid = Number(r[3]);
        if (album.ownerId !== me.id) return bad(403, '只能删除自己相册里的照片');
        d.photos = d.photos.filter((p) => !(p.id === pid && p.albumId === album.id));
        d.photoLikes = d.photoLikes.filter((l) => l.photoId !== pid);
        if (album.cover && !d.photos.some((p) => p.albumId === album.id)) album.cover = '';
        persist();
        return ok({ ok: true });
      }
    }
  }

  if (r[0] === 'photos' && r[2] === 'like' && method === 'POST') {
    const pid = Number(r[1]);
    const i = d.photoLikes.findIndex((l) => l.photoId === pid && l.userId === me.id);
    if (i >= 0) d.photoLikes.splice(i, 1);
    else d.photoLikes.push({ photoId: pid, userId: me.id });
    persist();
    return ok({ liked: i < 0, count: d.photoLikes.filter((l) => l.photoId === pid).length });
  }

  /* ---------- 留言板 ---------- */
  if (r[0] === 'guestbook') {
    if (r.length === 1) {
      if (method === 'GET') {
        const uin = url.searchParams.get('uin');
        const owner = uin ? d.users.find((u) => u.uin === uin) : me;
        if (!owner) return bad(404, '空间不存在');
        const list = d.guestbook.filter((g) => g.ownerId === owner.id).sort((a, b) => b.at.localeCompare(a.at));
        return ok({
          entries: list.map<GuestbookView>((g) => ({
            id: g.id,
            content: g.content,
            reply: g.reply,
            at: g.at,
            author: brief(d.users.find((u) => u.id === g.authorId)!),
            canDel: g.authorId === me.id || g.ownerId === me.id,
            canEdit: g.ownerId === me.id,
          })),
        });
      }
      if (method === 'POST') {
        const b = body();
        const owner = d.users.find((u) => u.uin === String(b.owner ?? me.uin));
        if (!owner) return bad(404, '空间不存在');
        const content = String(b.content ?? '').trim();
        if (!content) return bad(400, '留言不能为空');
        const g = { id: nextId(), ownerId: owner.id, authorId: me.id, content, reply: '', at: new Date().toISOString() };
        d.guestbook.push(g);
        notify(owner.id, me.id, 'guestbook', '在你的留言板留言', 'guestbook');
        persist();
        return ok({ id: g.id, content, reply: '', at: g.at, author: brief(me), canDel: true, canEdit: false });
      }
    }
    const g = d.guestbook.find((x) => x.id === Number(r[1]));
    if (!g) return bad(404, '留言不存在');
    if (r[2] === 'reply' && method === 'POST') {
      if (g.ownerId !== me.id) return bad(403, '只有主人可以回复');
      g.reply = String(body().reply ?? '').trim();
      persist();
      return ok({ ok: true });
    }
    if (method === 'DELETE') {
      if (g.ownerId !== me.id && g.authorId !== me.id) return bad(403, '没有权限删除');
      d.guestbook = d.guestbook.filter((x) => x.id !== g.id);
      persist();
      return ok({ ok: true });
    }
  }

  /* ---------- 消息 ---------- */
  if (r[0] === 'notifications') {
    if (method === 'GET') {
      const list = d.notifications.filter((n) => n.toId === me.id).sort((a, b) => b.at.localeCompare(a.at));
      return ok({
        notifications: list.map<NotificationView>((n) => ({
          id: n.id,
          kind: n.kind,
          text: n.text,
          target: n.target,
          read: n.read,
          at: n.at,
          from: brief(d.users.find((u) => u.id === n.fromId)!),
        })),
        unread: list.filter((n) => !n.read).length,
      });
    }
    if (r[1] === 'read' && method === 'POST') {
      const ids: number[] = body().ids ?? [];
      d.notifications.forEach((n) => {
        if (n.toId === me.id && (!ids.length || ids.includes(n.id))) n.read = true;
      });
      persist();
      return ok({ unread: d.notifications.filter((n) => n.toId === me.id && !n.read).length });
    }
  }

  /* ---------- 音乐 ---------- */
  if (r[0] === 'music' && r[1] === 'library') {
    return ok({
      tracks: [
        { id: 'demo-1', title: '夜航（演示）', mood: '安静', duration: 0, url: '', source: 'builtin' },
        { id: 'demo-2', title: '晨雾（演示）', mood: '清晨', duration: 0, url: '', source: 'builtin' },
        { id: 'demo-3', title: '远山（演示）', mood: '辽阔', duration: 0, url: '', source: 'builtin' },
      ],
      note: '演示模式不包含音频文件，上传本地音频或填写直链即可播放。',
    });
  }

  /* ---------- 搜索 ---------- */
  if (r[0] === 'search') {
    const kw = (url.searchParams.get('q') ?? '').trim();
    if (!kw) return ok({ posts: [], users: [], albums: [], keyword: kw });
    const lower = kw.toLowerCase();
    return ok({
      keyword: kw,
      posts: d.posts
        .filter((p) => visibleTo(p, me) && (p.title + p.content).toLowerCase().includes(lower))
        .map((p) => postView(p, me)),
      users: d.users
        .filter((u) => (u.nickname + u.uin + u.signature).toLowerCase().includes(lower))
        .map((u) => userView(u, me)),
      albums: d.albums
        .filter((a) => albumVisible(a, me) && (a.name + a.description).toLowerCase().includes(lower))
        .map((a) => albumView(a, me)),
    });
  }

  /* ---------- 上传 ---------- */
  if (r[0] === 'upload') {
    const fd = init.body;
    if (!(fd instanceof FormData)) return bad(400, '缺少文件');
    const file = fd.get('file');
    if (!(file instanceof File)) return bad(400, '缺少文件');
    const url = await readAsDataURL(file);
    return ok({ url });
  }

  return bad(404, `演示模式未实现该接口：${method} ${url.pathname}`);
}

const THEMES = [
  { id: 'aurora', name: '极光', accent: '#2f5d50' },
  { id: 'ember', name: '余烬', accent: '#9a4a33' },
  { id: 'forest', name: '森野', accent: '#3a4a63' },
  { id: 'ink', name: '墨色', accent: '#33302b' },
  { id: 'sakura', name: '樱雾', accent: '#9c5468' },
];

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error('读取文件失败'));
    fr.readAsDataURL(file);
  });
}

/** 演示站点的小提示，只打印一次。 */
export function demoNotice(): void {
  console.info(
    '%c演示模式%c 数据存在浏览器 localStorage，不会上传到任何服务器。演示账号 294388344 / qzone123。',
    'background:#2f5d50;color:#fff;padding:2px 6px;border-radius:4px',
    'color:#4b4741',
  );
}
