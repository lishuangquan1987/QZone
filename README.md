# 个人空间 · Go + ent + SQLite + TypeScript

一个可直接运行的**多用户个人主页 / 博客系统**：Markdown 写作、图片真实上传、背景音乐真实播放，界面按现代博客设计（而非复刻 QQ 空间的旧版式）。

[![CI](https://github.com/lishuangquan1987/QZone/actions/workflows/ci.yml/badge.svg)](https://github.com/lishuangquan1987/QZone/actions/workflows/ci.yml)
[![Demo](https://github.com/lishuangquan1987/QZone/actions/workflows/pages.yml/badge.svg)](https://lishuangquan1987.github.io/QZone/)

**在线演示**：<https://lishuangquan1987.github.io/QZone/> —— 由 GitHub Actions 推送到 GitHub Pages 的静态演示版，登录即用（`294388344 / qzone123`），数据只存在你自己的浏览器里。

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

## 部署

仓库自带三条 GitHub Actions 流水线，`.github/workflows/` 下可查：

| 工作流 | 触发 | 产出 |
| --- | --- | --- |
| `ci.yml` | push 到 `main` / `master`、PR、手动 | 前端构建 + `go vet` + `go test` + 静态编译 + 启动冒烟测试 + 镜像可构建性 |
| `pages.yml` | push 到 `main` / `master`（`web/**` 变更）/ 手动 | **GitHub Pages 静态演示站** |
| `release.yml` | 推 `v*` tag | 5 个平台的单文件二进制（zip）+ `ghcr.io` 多架构镜像 |

### 方式一：Docker（推荐自建）

```bash
docker compose up -d            # 数据落在 ./data，端口 8080
# 或
docker run -d -p 8080:8080 -v $PWD/data:/data ghcr.io/lishuangquan1987/qzone:latest
```

镜像基于 `alpine`，`CGO_ENABLED=0` 静态链接，单进程单文件，数据卷挂 `/data` 即可迁移。

### 方式二：单文件二进制

从 [Releases](https://github.com/lishuangquan1987/QZone/releases) 下载对应平台的 zip，解压后直接运行：

```bash
./qzone -addr :8080 -data ./data
```

前端已经通过 `go:embed` 打进二进制，不需要额外资源文件。

### 方式三：GitHub Pages（静态演示）

`pages.yml` 用 `VITE_DEMO=1` 构建，前端会自动切换到**浏览器内的模拟后端**（`web/src/demo.ts`），把同一套界面和交互跑在 localStorage 上：

- 可以注册、登录、写文章、传图、建相册、留言、点赞、搜索，刷新后数据仍在
- 没有服务端，照片以 dataURL 存在浏览器里；换浏览器 / 清缓存 = 一份新的演示数据
- 适合给别人看「长什么样」，不适合放真实数据

启用步骤：仓库 **Settings → Pages → Source 选 `GitHub Actions`**，然后 push 一次或手动运行 `Deploy demo to Pages`。

> 为什么不能直接把 Go 服务放到 Pages？Pages 只托管静态文件，没有进程、没有文件系统，SQLite 和上传目录都无处可放。要真实数据请用方式一 / 二。

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
│   ├── styles.css           # 现代博客版式、浅色 / 深色两套变量
│   ├── theme.ts             # 外观模式（浅色 / 深色 / 跟随系统）
│   ├── demo.ts              # 静态演示后端（VITE_DEMO=1 时启用，Pages 用）
│   └── views/               # auth / home / posts / post / editor / albums …
├── tools/                   # Playwright 验收脚本（可选）
└── data/                    # 运行时生成：qzone.db + uploads/
```

---

## 性能

自建部署没有 CDN，所以性能主要靠服务端与渲染层自己兜住：

| 优化 | 做法 | 效果 |
| --- | --- | --- |
| 传输压缩 | `internal/api/gzip.go`：文本类响应按 1KB 阈值 gzip，音频与 `Range` 请求直接放行 | JS 156KB → **52KB**，CSS 65KB → 14KB |
| 静态缓存 | `/assets/*` 带内容哈希 → `max-age=31536000, immutable`；其它静态资源一周；入口 HTML `no-cache` + ETag（命中 304） | 回访几乎零下载 |
| 滚动流畅 | 极光渐变底从 `background-attachment: fixed` 改为固定定位伪元素 + `translateZ(0)` 独立图层 | 滚动时不再整屏重绘 |
| 合成开销 | 全站 12 处 `backdrop-filter` 收敛到 4 处（顶栏降到 12px、手机端关闭） | 减少每帧模糊层 |
| 长列表 | 文章行 / 消息行 `content-visibility: auto` + 估算高度 | 视口外不参与排版绘制 |
| 图片 | 统一 `loading="lazy"` + `decoding="async"`，照片带 `width/height` 预留位 | 不阻塞首帧、无布局抖动 |
| 数据复用 | `web/src/api.ts` 的 GET 结果 15 秒内存缓存，任何写操作整体失效 | 站内来回切换 30ms 左右 |
| 感知速度 | 路由超过 150ms 才显示顶部进度条；写作页离开补存草稿 | 慢请求有反馈，不闪一下 |
| 事件回收 | 视图级 `AbortController`，路由切换统一 abort | 反复进出首页不再叠加监听器 |

实测（1440×950，Slow 4G + 4× CPU 限速）：FCP **924ms**、首屏传输 JS **51KB** / CSS **14KB**；本地路由切换 30–70ms，无 50ms 以上长任务。

## 设计系统

界面按「编辑型个人博客」定调，而不是社交产品的旧版式。

| 项 | 规则 |
| --- | --- |
| 强调色 | 单一强调色，默认松墨 `#2f5d50`；其余四套主题（陶土 / 靛青 / 墨黑 / 绛粉）同样为低饱和 |
| 中性色 | 统一暖灰：`#1b1a17` / `#4b4741` / `#857e73`，纸面 `#f7f4ee`，卡片 `#fffdfa` |
| 深色 | 单独一套中性色（纸面 `#131412`、卡片 `#191a17`、正文 `#ece8de`），强调色不重配，由原色 `color-mix` 提亮派生 |
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
- **媒体也走鉴权**：`/media/` 要求登录，并按所在相册的可见范围判断；未登录 401、他人 403、主人 200
- 登录按「IP + 空间号」做 5 分钟 8 次的滑动窗口；启动时清理过期会话；响应带 `nosniff / X-Frame-Options / Referrer-Policy`；SVG 响应加 `sandbox` CSP

**内容（说说与日志已合并）**
- 一篇文章 = 标题（可空）+ Markdown 正文 + 封面 + 分类 + 配图 + 可见范围（公开 / 不公开列出 / 仅自己）
- **全宽写作工作台**：整页铺满（不再有 1120px 内容栏 + 侧栏挤压），编辑区随窗口高度撑满，页面不滚动
  - 编辑 / 分屏 / 预览三种视图，**分屏比例可拖拽**（双击复位），状态记在 localStorage
  - 左侧**大纲**抽屉：按 `#` 级标题生成，点击跳到对应段落；右侧**设置**抽屉：封面、分类、可见范围、置顶
  - 分屏时左右**滚动同步**；`Tab / Shift+Tab` 整行缩进；回车自动续写 `-` `1.` `- [ ]` `>`，空项再回车退出列表
  - 工具栏分组（标题 / 强调 / 引用与代码 / 列表 / 链接与插图 / 表格与分割线）、`Ctrl+B/I/E/K`、`Ctrl+1/2/3`、`Ctrl+Shift+C`、`Ctrl+/` 快捷键面板
  - 所有插入走 `execCommand('insertText')`，保留浏览器原生撤销栈；`F11` 全屏写作（Fullscreen API）
  - 底部状态栏：字数（中文按字、英文按词）、阅读时长、光标行列、保存状态
- **直接粘贴截图**（`Ctrl+V`）或把图片拖进编辑区即可插图；图片在浏览器端先压缩再上传
- 草稿每 1.2 秒自动存本地，重进编辑器会提示「恢复 / 丢弃」
- 详情页：衬线标题排版、代码块 / 引用 / 表格 / 图片样式、阅读时长、浏览量、点赞、评论（支持回复与删除）
- 归档页：分类筛选、按时间 / 阅读量排序、分页

**相册**
- 创建 / 删除相册，三种可见范围：**公开 / 隐藏（不在列表出现，知道链接才能看）/ 仅自己**
- 建好之后随时可在相册详情页「设置」里改名、改描述、改可见范围（`PATCH /api/albums/{id}`，只有主人能改）
- 列表卡片会给未公开相册打上「隐藏 / 仅自己」角标
- **真实上传**：文件落到 `data/uploads/<空间号>/<年月>/<随机名>`，记录尺寸与体积
- 网格浏览、灯箱看图（← → / Esc / 滑动切换 / 缩略图跳转 / 一次点击即关）、点赞、删除照片
- 删除照片后封面自动补位，相册空了则清空封面，不会留下破图
- 单张上限 30MB（可用 `-max-image` 调整）；超过 2MB 或长边大于 2560 的图片会先在浏览器里压到 WebP，实测 34.4MB 原图压到 2.58MB

**留言 / 消息 / 访客**
- 留言板：留言、主人回复、删除
- 消息中心：点赞、评论、留言、访客四类，未读角标、一键已读
- 访客：谁看过我 / 我看过谁，累计与今日人次

**背景音乐（真实播放）**
- **在线华语曲库 39 首**：分成「华语流行 / 民谣 / 国风 / 治愈纯音 / 摇滚现场 / 轻快小调」六组，收录陈鸿宇《理想三旬》、陈粒《小半》、宋冬野《董小姐》、房东的猫《秋酿》、银临《棠梨煎雪》、痛仰《公路之歌》等，设置页按分类筛选、逐首试听、一键设为背景
  - 音源为 QQ 音乐的公开试听接口，服务端 `GET /api/music/stream?mid=...` 做两件事：①实时换取 `vkey`（播放地址有时效，缓存 25 分钟）；②同源转发音频流并透传 `Range`。CDN 会校验 `Referer`，缺了直接 403，所以必须由服务端带来源页取流
  - 曲目清单与封面（专辑图）在 `internal/api/music.go`，前端只负责展示，播放地址长期有效、换设备也不失效
  - 演示站（GitHub Pages）没有后端换不到 `vkey`，自动改用 3 首 CC BY 4.0 直链兜底，点开仍有声音
- 内置 3 首合成曲目（夜航 / 晨雾 / 远山），服务端程序生成，无版权顾虑，没有外网也能播
- 也支持上传本地音频（MP3 / M4A / OGG / WAV / FLAC，单个 ≤ 50MB，可用 `-max-audio` 调整）或填写公开音频直链
- 左下角播放器：唱片旋转、播放 / 暂停、音量、循环，状态记在 localStorage；遵守浏览器自动播放策略，首次交互后开始
- **版权说明**：在线曲目版权归原权利方（腾讯音乐及各家唱片公司）所有，本项目只做地址解析与转发，**仅供个人非商业试听**；对外站点请换成自己有权使用的音源

**装扮**
- **外观三档**：浅色 / 深色 / 跟随系统。页头、写作页顶栏、登录页各有一个切换按钮，`设置 → 装扮` 里可三选一
  - 深色不另做一套配色：五套强调色统一用 `color-mix` 在深色下提亮，`accent-soft` 同步压深，换主题不用改第二份样式
  - `color-scheme` 一起切换，滚动条、自动填充、原生控件跟着变暗；首屏由内联脚本预置，深色用户不会看到白闪
  - 偏好存在 `localStorage`（不跟账号走：手机想深色、台式想浅色是常事）
- 5 套主题（极光 / 余烬 / 森野 / 墨色 / 樱雾），实时切换并持久化
- 视觉层：顶部玻璃栏、页面极光渐变底、按钮渐变与悬浮、封面色相随分类变化、相册封面缩放与角标；所有颜色仍从 `--accent` 派生，深色自动跟随
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
| GET | `/api/music/library` | 在线华语曲库 + 内置合成曲目（含分组、封面） |
| GET | `/api/music/stream?mid=` | 曲库音源：服务端换 vkey 后同源转发（支持 Range）；`?u=` 兼容旧版白名单直链 |

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

> 完整的评审与待办见 [REVIEW.md](REVIEW.md)。曾经的 P0「`/media/` 目录绕过权限」与「SVG 上传 XSS」已修，剩余项以 P1/P2 为主。

- SQLite 单写者：连接池限制为 1，适合单机；多实例部署需换 PostgreSQL（ent 支持，改驱动即可）。
- 没有实时推送，消息需刷新页面获取。
- 没有富文本粘贴（粘贴的是图片，不是 Word/网页样式）、没有多端实时协作。
- 草稿只存在浏览器 localStorage，换设备不同步。
- 图片上传前会在浏览器端压到 WebP，但没有服务端缩略图；大量高清图时建议接对象存储 + 图片处理。
- 删除文章 / 相册只删数据库记录，磁盘上的原图不会自动清理。
- 示例素材（头像 / 封面 / 照片）是程序生成的渐变 SVG，仅用于演示。
- 在线曲库依赖 QQ 音乐试听接口的可用性：接口若调整或歌曲下架，会返回「暂时无法试听」，换一首或退回内置曲目即可；`vkey` 缓存 25 分钟，失败会自动清缓存重试。对外站点请改用自有授权音源，个人非商业试听也请遵守平台条款。
