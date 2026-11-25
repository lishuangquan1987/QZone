# 个人空间 · Go + ent + SQLite + TypeScript

一个可直接运行的**多用户个人主页 / 博客系统**：Markdown 写作、图片真实上传、背景音乐真实播放，界面按现代博客设计（而非复刻 QQ 空间的旧版式）。

> 早期版本是对 `user.qzone.qq.com/294388344` 的功能复刻；本版按需求重写为「个人主页方向」：说说与日志合并成文章，数据层换成 ent + 纯 Go SQLite，开放注册，每个账号的数据彼此隔离。

---

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| HTTP | Go 1.22+ `net/http` | 标准库路由，无 Web 框架 |
| ORM | [ent](https://entgo.io) v0.14 | schema 即代码，`go run entgo.io/ent/cmd/ent generate ./ent/schema` |
| 数据库 | SQLite（`modernc.org/sqlite`） | **纯 Go 实现，无需 cgo**，可静态编译 / 交叉编译 |
| 鉴权 | bcrypt + 会话表 | HttpOnly Cookie，30 天有效期 |
| 前端 | Vite + TypeScript | 无框架，手写渲染与样式 |
| Markdown | marked | 渲染前先转义 HTML，避免注入 |

---

## 运行

```bash
# 1. 前端构建（产物通过 go:embed 打进二进制）
cd web && npm install && npm run build && cd ..

# 2. 启动
go build -o qzone.exe .
./qzone.exe -addr :8080                 # 默认图片 30MB / 音频 50MB
./qzone.exe -addr :8080 -max-image 50 -max-audio 100
```

打开 <http://localhost:8080>。

| 演示账号 | 密码 | 内容 |
| --- | --- | --- |
| `294388344` | `qzone123` | 6 篇文章、4 个相册、留言、访客记录 |
| `linwan` | `qzone123` | 2 篇文章、1 个相册（用于验证数据隔离） |

也可以直接点「注册」新建账号——新账号会自动获得一套封面与头像，空间即刻可用。

开发模式（前端热更新）：

```bash
./qzone.exe -addr :8080      # 终端 A
cd web && npm run dev        # 终端 B → http://localhost:5173
```

---

## 目录

```
.
├── main.go                  # 启动：打开 SQLite、迁移、播种、托管前端
├── ent/                     # ent 生成的实体代码
│   └── schema/              # 数据模型定义（User / Post / Album / Photo …）
├── internal/
│   ├── db/db.go             # modernc SQLite 连接 + ent 驱动 + 自动迁移
│   ├── media/media.go       # 示例素材（SVG）与环境音（WAV）生成
│   ├── seed/seed.go         # 首次启动写入示例空间
│   └── api/                 # 路由与处理器
│       ├── server.go        # 路由表、视图组装、静态托管
│       ├── auth.go          # 注册 / 登录 / 会话
│       ├── users.go         # 个人档、统计、签到、访客
│       ├── posts.go         # 文章 CRUD、点赞、评论
│       ├── albums.go        # 相册与照片
│       ├── guestbook.go     # 留言板
│       ├── social.go        # 消息与搜索
│       └── upload.go        # 图片 / 音频上传
├── web/src/
│   ├── main.ts              # 应用外壳与路由
│   ├── api.ts               # 类型化接口客户端
│   ├── md.ts                # 安全的 Markdown 渲染
│   ├── music.ts             # 背景音乐播放器
│   ├── styles.css           # 现代博客版式与主题
│   └── views/               # auth / home / posts / post / editor / albums …
├── tools/                   # Playwright 验收脚本（可选）
└── data/                    # 运行时生成：qzone.db + uploads/
```

---

## 设计系统

界面按「编辑型个人博客」定调，而不是社交产品的旧版式。

| 项 | 规则 |
| --- | --- |
| 强调色 | 单一强调色，默认松墨 `#2f5d50`；其余四套主题（陶土 / 靛青 / 墨黑 / 绛粉）同样为低饱和 |
| 中性色 | 统一暖灰：`#1b1a17` / `#4b4741` / `#857e73`，纸面 `#f7f4ee`，卡片 `#fffdfa` |
| 圆角 | 卡片 14 / 控件 8 / 媒体 10 / 通栏 16 / 胶囊 999，不混用其他数值 |
| 字体 | 标题宋体（Songti SC / Noto Serif SC），正文系统无衬线；数字 `tabular-nums` |
| 层次 | 卡片靠 1px 暖色描边 + 极浅投影分层，不用渐变与毛玻璃 |
| 状态 | 骨架屏、空态（含引导动作）、行内错误、Toast、未读角标齐全；`focus-visible` 有可见轮廓 |
| 动效 | 只保留状态反馈；`prefers-reduced-motion` 下动画与过渡关闭 |

**响应式**

- ≥1000px：顶部导航 + 首页双栏（正文 + 侧栏）
- <1000px：隐藏顶部导航，改为底部五项页签（首页 / 文章 / 相册 / 留言 / 关于）
- <720px：hero 收紧为纵向堆叠，文章头部作者与时间分行、操作按钮另起一行；播放器变成底部信息条（位于页签之上），正文为其留出底部安全区
- 相册两列、编辑器预览折叠、表单单列，逐页验证无横向溢出


---

## 功能

**账号与隔离**
- 开放注册（空间号 3–20 位字母数字下划线 + 昵称 + 密码 ≥ 6 位），注册即登录
- bcrypt 口令摘要、会话表、HttpOnly Cookie
- **所有读写按作者 / 主人过滤**：私密内容只有本人可见，他人的文章只能读不能改删，访客记录仅主人可查

**内容（说说与日志已合并）**
- 一篇文章 = 标题（可空）+ Markdown 正文 + 封面 + 分类 + 配图 + 可见范围（公开 / 不公开列出 / 仅自己）
- 编辑器（CSDN 风格）：工具栏分组（标题 / 强调 / 引用与代码 / 列表 / 链接与插图 / 表格与分割线）、编辑 · 分屏 · 预览三种视图、`Ctrl+B/I/K` 快捷键、`Ctrl+S` 保存
- **直接粘贴截图**（`Ctrl+V`）或把图片拖进编辑区即可插图；图片在浏览器端先压缩再上传
- 草稿每 1.2 秒自动存本地，重进编辑器会提示「恢复 / 丢弃」
- 详情页：衬线标题排版、代码块 / 引用 / 表格 / 图片样式、阅读时长、浏览量、点赞、评论（支持回复与删除）
- 归档页：分类筛选、按时间 / 阅读量排序、分页

**相册**
- 创建 / 删除相册，三种可见范围
- **真实上传**：文件落到 `data/uploads/<空间号>/<年月>/<随机名>`，记录尺寸与体积
- 网格浏览、灯箱看图（← → / Esc）、点赞、删除照片
- 单张上限 30MB（可用 `-max-image` 调整）；超过 2MB 或长边大于 2560 的图片会先在浏览器里压到 WebP，实测 34.4MB 原图压到 2.58MB

**留言 / 消息 / 访客**
- 留言板：留言、主人回复、删除
- 消息中心：点赞、评论、留言、访客四类，未读角标、一键已读
- 访客：谁看过我 / 我看过谁，累计与今日人次

**背景音乐（真实播放）**
- 内置 3 首免费曲目（夜航 / 晨雾 / 远山），由服务端程序合成，无版权限制，可直接试听与选用
- 也支持上传本地音频（MP3 / M4A / OGG / WAV / FLAC，单个 ≤ 50MB，可用 `-max-audio` 调整）或填写公开音频直链
- 左下角播放器：唱片旋转、播放 / 暂停、音量、循环，状态记在 localStorage；遵守浏览器自动播放策略，首次交互后开始
- **关于 QQ 音乐**：其播放接口需要签名与版权授权（实测搜索返回 `code 2001`），本项目不抓取；如需自有曲库可在此基础上接授权 API，接口层已把「曲目来源」抽象成 `url + title`

**装扮**
- 5 套主题（极光 / 余烬 / 森野 / 墨色 / 樱雾），实时切换并持久化
- 封面、头像、音乐均可替换

---

## 数据模型

```
User ─┬─< Post ─< Comment
      │        └─< PostLike >─ User
      ├─< Album ─< Photo ─< PhotoLike >─ User
      ├─< Guestbook (owner / author)
      ├─< Visit (host / visitor)
      ├─< Notification (to / from)
      └─< Session
```

外键字段显式声明（`author_id`、`owner_id` …），删除文章 / 相册时在处理器里先清理评论与点赞，避免外键阻塞。

---

## 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/auth/register` | 注册并自动登录 |
| POST | `/api/auth/login` | 登录 |
| GET | `/api/auth/session` | 会话探测 |
| GET | `/api/bootstrap` | 首屏：我、主题、未读数 |
| GET | `/api/users/{uin}` | 他人主页档案 |
| PATCH | `/api/users/me` | 修改个人档（含背景音乐） |
| POST | `/api/users/me/signin` | 每日签到 |
| GET | `/api/users/{uin}/visitors?mode=in\|out` | 访客（仅主人） |
| POST | `/api/users/{uin}/visit` | 记录足迹 |
| GET/POST | `/api/posts` | 文章列表 / 新建 |
| GET/PATCH/DELETE | `/api/posts/{id}` | 详情（浏览量+1）/ 修改 / 删除 |
| POST | `/api/posts/{id}/like` | 点赞切换 |
| POST | `/api/posts/{id}/comments` | 评论 |
| DELETE | `/api/posts/{id}/comments/{cid}` | 删除评论 |
| GET/POST | `/api/albums` | 相册列表 / 新建 |
| GET/DELETE | `/api/albums/{id}` | 详情 / 删除 |
| POST | `/api/albums/{id}/photos` | 批量添加照片 |
| DELETE | `/api/albums/{id}/photos/{pid}` | 删除照片 |
| POST | `/api/photos/{id}/like` | 照片点赞 |
| GET/POST | `/api/guestbook` | 留言列表 / 发表 |
| POST | `/api/guestbook/{id}/reply` | 主人回复 |
| GET | `/api/notifications` | 消息中心 |
| GET | `/api/search?q=` | 全站搜索 |
| POST | `/api/upload` | 图片上传（默认 ≤30MB） |
| POST | `/api/upload/audio` | 音频上传（默认 ≤50MB） |
| GET | `/api/music/library` | 内置免费音乐库 |

---

## 验收

```bash
# 视觉验收（Playwright）：按路由整页截图到 .qa/
node tools/qa.mjs "#/home" "#/posts" "#/post/1"

# 功能验收：登录 → 背景音乐播放 → 写作并插图 → 建相册上传
node tools/e2e.cjs
```

当前实测结果：背景音乐可播放（`currentTime` 递增）、编辑器插图后正文含 `![](...)`、相册上传落盘、文章评论正常返回、控制台无报错；跨账号访问私密相册返回 403，未登录返回 401。

移动端（iPhone 13 视口）逐页检查：9 个页面无横向溢出、无控制台错误；底部页签五个入口跳转与选中态正确，触控高度 43px + 内边距。

> 注意：Chrome 的整页（fullPage）截图在超出视口区域会漏绘部分 SVG 图像，出现「白色块」。核对版式请用视口截图或元素截图，`tools/qa.mjs` 默认输出整页图，仅作结构参考。

---

## 已知边界

- SQLite 单写者：连接池限制为 1，适合单机；多实例部署需换 PostgreSQL（ent 支持，改驱动即可）。
- 没有实时推送，消息需刷新页面获取。
- 没有富文本粘贴、草稿自动保存、协作编辑。
- 图片未做缩略图与压缩，原图直出；大量高清图时建议接对象存储 + 图片处理。
- 示例素材（头像 / 封面 / 照片）是程序生成的渐变 SVG，仅用于演示。
