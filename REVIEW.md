# 项目评审与改进清单

> 评审对象：`lishuangquan1987/QZone`（Go + ent + SQLite + TypeScript 个人空间）
> 评审时间：2026-11-26 · 引用位置按「文件 + 函数」标注，行号可能与最新提交有偏移

## 结论

架构是干净的：单二进制 + `go:embed` 前端、ent schema 即代码、前端零框架手写渲染，部署成本极低。**真正欠账在两处**：

1. **安全边界**——`/media/` 目录完全公开，等于把「私密相册」的保护降级成「URL 猜不到」；
2. **体验**——编辑器被 1120px 内容栏 + 288px 侧栏挤成一条竖条。已重写。

---

## 一、按优先级排列的待完善项

### P0 · 已经有实际影响

| # | 问题 | 位置 | 现状证据 | 建议 |
| --- | --- | --- | --- | --- |
| 1 | ~~媒体目录绕过权限~~ **已修** | `internal/api/server.go` `mediaHandler()` | 私有相册照片 `/media/seed/a-campus.svg` 未登录可直接 200、换账号也能拿 | 先验会话，再按所在相册的 `visible()` 判断；实测未登录 401、他人 403、主人 200，缓存改为 `private` |
| 2 | ~~SVG 上传 = 存储型 XSS~~ **已缓解** | `mediaHandler()` | 允许 `image/svg+xml`，同源直接打开会执行脚本 | 对 `.svg` 响应加 `Content-Security-Policy: default-src 'none'; sandbox` + `nosniff`，直接打开也跑不了脚本 |
| 3 | **`unlisted` 语义失效** | `posts.go` `VisibilityNEQ("private")`、`albums.go:122`、`users.go` 统计 | 「仅链接可见」的文章 / 相册会出现在别人的列表里（已实测复现） | **已修**：列表与统计统一改为 `= public`，详情页仍按「非 private 即可见」放行 |
| 4 | **默认背景音乐 404** | `internal/seed/seed.go` `SetBgmURL("/media/seed/ambient.wav")` | 实际文件叫 `music-night.wav`，登录即弹「背景音乐播放失败，可能是格式不支持」 | **已修**：指向 `media.TrackFile("night")` |

### P1 · 上线前该补

| # | 问题 | 位置 | 建议 |
| --- | --- | --- | --- |
| 5 | Cookie 没有 `Secure`，全站无安全响应头 | `issueSession()` | HTTPS 下加 `Secure`；补 `CSP` / `X-Frame-Options` / `Referrer-Policy` / `nosniff` |
| 6 | ~~登录无速率限制~~ **已修** | `auth.go` `login()` | 按「IP + 空间号」5 分钟 8 次滑动窗口，第 9 次返回 429；登录成功即清零（注册仍未限速） |
| 7 | ~~会话过期不清理~~ **已修** | `main.go` | 启动时 `DELETE FROM sessions WHERE expires_at < now()`，并打印清理条数 |
| 8 | 浏览量可刷 | `getPost()` 每次 GET `AddViews(1)` | 同 IP + 文章 30 分钟内去重，或改用 `post_views` 明细表 |
| 9 | 上传只信任 `Content-Type` | `upload.go` `saveUpload()` | 读前 512 字节做魔数校验（`http.DetectContentType`）；图片重编码以剥离 EXIF；生成缩略图 |
| 10 | 无压缩、无长缓存 | `spaHandler()`、`mediaHandler()` | 静态资源加 `Cache-Control: public,max-age=31536000,immutable`（Vite 带 hash）；文本走 gzip/br；`spaHandler` 不必把整文件读进内存再写回 |
| 11 | 没有一行测试 | 全仓 | 至少给「可见性 / 归属校验」写 `enttest` 用例——P0 里的 1、3 都出在这层 |

### P2 · 产品与体验

| # | 建议 | 理由 |
| --- | --- | --- |
| 12 | 搜索加防抖 + 分页 + 关键词高亮 | 目前每敲一次回车就全表 `ContainsFold` |
| 13 | 相册生成缩略图（WebP，宽 480） | 现在首屏直出原图，一屏 9 张就是几十 MB |
| 14 | 消息用 SSE 推送未读数 | 已有通知表，加一个 `/api/events` 长连接即可，代码量很小 |
| 15 | RSS / sitemap / Open Graph | 个人博客的传播入口，目前分享出去是白卡片 |
| 16 | ~~深色模式~~ **已实现** | 原先主题只换强调色，`--bg/--card/--ink` 是写死的一套；现收敛成语义变量 + `html[data-appearance='dark']` 一套覆盖，见「四、深色外观」 |
| 17 | 一键导出 | SQLite 文件好备份，但缺「文章 Markdown + 媒体 zip」的导出 |
| 18 | 可访问性 | 视图切换按钮缺 `aria-pressed`，Toast 缺 `role="status"`，`modal` 无焦点陷阱 |
| 19 | 草稿箱 | 草稿只在 localStorage，换设备就没了 |
| 20 | ~~`gofmt -l` 列出 6 个文件~~ **已修** | 已 `gofmt -w`；建议再在 CI 加一条 `gofmt -l` 校验 |
| 21 | 上传只校验扩展名 / 声明类型，未读魔数 | `upload.go` | 伪造 `Content-Type: image/png` 的文件会原样落盘；`nosniff` 挡住了执行，但仍建议按 `http.DetectContentType` 校验 |
| 22 | 删除文章 / 相册不清理磁盘文件 | `posts.go`、`albums.go` | 数据库记录删了，`uploads/` 里的原图还在，长期会涨；可在删除时顺带 `os.Remove` |

---

### 本轮修掉的其它问题

| 问题 | 说明 |
| --- | --- |
| 灯箱要连点几次才关掉 | `bindLightbox()` 在相册每次重绘（点赞、删除、上传）时重复绑定，一次点击叠出多层遮罩；改为每个容器只绑一次，并在打开前清掉残留层 |
| 相册无法修改可见范围 | 新增 `PATCH /api/albums/{id}`（仅主人），详情页「设置」可选公开 / 隐藏 / 仅自己；演示模式同步实现 |
| 删掉封面照片后列表破图 | `deletePhoto()` 原本只在 `cover == ""` 时补封面；改成删除后重算：有照片取最早一张，空了就清空 |
| 离开写作页报 `Cannot read properties of null` | 草稿防抖计时器在 DOM 已被替换后触发；增加 `disposed` 标志、清理所有计时器，并在离开时补存草稿 |
| 发布后残留「未发布草稿」 | 保存成功后清掉防抖计时器，避免它在 `localStorage.remove` 之后又写回 |
| Markdown 链接可执行 `javascript:` | `renderMarkdown()` 加了基于 `<template>` 的协议过滤，只保留 http(s)/mailto/站内路径 |
| 启动日志地址拼接错误 | `http://localhost%s` 与 `127.0.0.1:8123` 拼成 `localhost127.0.0.1`，按 `:port` / `0.0.0.0:port` 归一化 |


### 第四轮：数据层与安全收口

这一轮不做新功能，只把「量一上来就露馅」的地方补掉。实测库：5000 篇文章 / 20018 张照片 / 45 个相册。

| 问题 | 处理 | 实测 |
| --- | --- | --- |
| 外键与高频过滤条件全无索引 | 在 `ent/schema/*.go` 声明 12 个索引（`photos(url)`、`photos(album_id)`、`posts(author_id,visibility,created_at)`、`comments(post_id)`、`albums(owner_id)`、`notifications(to_id,read)`、`visits(host_id)`、`visits(visitor_id)`、`visits(host_id,visitor_id,created_at)`、`sessions(expires_at)`、`guestbooks(owner_id)`、`posts(visibility)`） | `/api/albums` 单次 **54ms → 3.6ms**；并发 10 的 p95 **603ms → 37ms** |
| 坑：手工 `CREATE INDEX` 会被启动迁移删掉 | `Schema.Create(WithDropIndex(true))` 会清理 schema 里没有的索引，实测重启后 14 个自定义索引归零 | 必须写进 schema，不能只对线上库执行 SQL |
| 相册列表 N+1：每个相册查一次 owner + 一次 count | `WithOwner()` 一次带出 + `GROUP BY album_id` 一次聚合 | 45 个相册从 90 次查询降到 3 次 |
| 文章列表把所有评论正文查出来，只为数条数 | 列表页只做 `COUNT` 聚合；详情页才取明细，且限 200 条 | 列表响应从 O(评论数) 降到 O(文章数) |
| 点赞返回全量用户数组 | 只带前 24 个头像 + `likeCount`（前端本来也只显示 8 个昵称） | 大V 文章响应体不再随点赞数膨胀 |
| `X-Forwarded-For` 无条件信任，限速可绕过 | 新增 `-trust-proxy`，默认不采信；开启时取 XFF **最后一段**（反代追加的真实来源） | 伪造 XFF 连试仍被 429 |
| 注册无频率限制（bcrypt 可被当 CPU 放大器） | 单 IP 每小时 10 次 | 第 11 次 429 |
| 登录只按「IP + 空间号」限速，换号即可放大 | 增加单 IP 30 次 / 5 分钟的兜底维度 | — |
| 限速表满了会整体清空，攻击者灌 key 即可自清 | 改为先按过期逐条淘汰，清不掉才重置 | — |
| PATCH 文章绕过字数与配图上限 | `create` / `update` 共用 `normalizePost()` | 10 张图 PATCH 返回 400 |
| 头像 / 封面 / 背景音乐 / 配图可填任意地址 | 只放行 `/media/` 与 `https://`；访客浏览器不再被引去请求第三方 | `data:`、`javascript:`、`http://` 均 400 |
| 时区日界按 UTC 算 | 新增 `appLoc`（跟随 `TZ`）与 `startOfDay()`；签到、今日访客、消息时间统一 | 东八区 0–8 点不再算错日期 |
| 上传只信扩展名与声明类型 | 读前 512 字节做内容嗅探（`media.ContentMatches`），SVG 额外要求出现 `<svg` | 内容是 HTML 的 `a.png` 返回 400 |
| `/media/` 对「不在相册里」的地址一律放行 | 头像/封面/BGM 放行，其余上传图只有本人可见 | 他人访问未入库图 403、本人 200 |
| 访客记录每次进页面都写一条，刷新即刷屏 | 同 host+visitor 30 分钟内只记一次 | 连续 3 次访问只新增 1 条 |
| 浏览量每个 GET 都写库（单写者下会堵读） | 内存计数 + 20 秒批量 `AddViews` + 同 IP 30 分钟去重 | 详情页不再产生写事务 |
| 相册直出原图 | `?w=480` 服务端缩放（CatmullRom → JPEG 82），落盘 `.thumb/<宽>/`，白名单 4 档 | 1.85MB → 69KB；二次请求 0.8ms |
| 缺少运维能力 | `/healthz`、访问日志（API 全记、静态只记错误与慢请求）、`SIGTERM` 优雅关闭、`-backup-to` 热备份 | 备份 `PRAGMA integrity_check` 通过 |
| `go test ./...` 一直是空跑 | 新增 `valid_test.go` / `ratelimit_test.go` / `sniff_test.go`，覆盖可见性矩阵、字段校验、限速窗口、XFF、时区、内容嗅探 | `go test ./...` 真实执行 |
| 静态资源缺失被 SPA 回退成 200 HTML | `/assets/*` 找不到直接 404 | 避免浏览器把 HTML 当 JS 解析 |
| 静态文件被整块读进内存再写回 | 改为 `fs.Stat` 判断后直接交给 `FileServer`（可 sendfile） | 去掉每个请求一次全量拷贝 |
| 首屏 `session` + `bootstrap` 两次串行请求 | `session` 直接带回 themes，去掉 `bootstrap` 调用 | 省一个 RTT |
| 快速切换路由时旧视图覆盖新视图 | 路由序号，过期结果直接丢弃 | — |


### 第三轮：性能与曲库

| 问题 | 处理 |
| --- | --- |
| 一次访问要拉 156KB JS + 65KB CSS，自建部署没有压缩 | 新增 gzip 中间件（文本类 ≥1KB 才压，音频与 Range 放行），实测 JS 51KB / CSS 14KB |
| 静态资源无缓存头，每次回访全量重下 | `/assets/*` 内容哈希 → 一年 immutable；入口 HTML `no-cache` + ETag，命中 304 |
| 滚动发涩 | `background-attachment: fixed` 的多层径向渐变改为固定伪元素独立图层；`backdrop-filter` 从 12 处收敛到 4 处，手机端顶栏直接关闭 |
| 长列表一次渲染到底 | 文章行 / 消息行加 `content-visibility: auto` |
| 图片解码抢占主线程、无占位 | 统一 `decoding="async"`、照片补 `width/height`；修掉由此引起的照片被拉成长条的回归 |
| 站内来回切换每次都重新请求 | GET 结果 15 秒内存缓存，写操作与登出整体失效；实测回访 30ms 级 |
| 首页音乐卡反复进出叠加监听器 | 引入视图级 `AbortController`，路由切换统一 abort；顺带修「已暂停却显示正在循环播放」 |
| 慢接口没有任何反馈 | 路由超过 150ms 才出现的顶部进度条 |
| 曲库只有 3 首合成音轨，演示站还没有声音 | 新增 7 首 CC BY 4.0 免费曲目（incompetech.com），设置页可试听 / 设为背景；播放走白名单反代，统一 `audio/mpeg` 并支持 Range；演示站退回直链 |

## 二、这次改了什么

| 文件 | 改动 |
| --- | --- |
| `web/src/views/editor.ts` | 编辑器整页重写（见下节） |
| `web/src/styles.css` | 删除旧 `.editor-*` 样式，新增 `.wr-*` 工作台样式（含移动端）；颜色收敛为语义变量（`--surface / --sunken / --raised / --faint / --code-*`），新增深色覆盖 |
| `web/src/theme.ts` | **新增**：外观模式（浅色 / 深色 / 跟随系统），写 `html[data-appearance]`、同步 `color-scheme` 与 `theme-color` |
| `web/src/state.ts` | `applyTheme` 只写 `--theme-accent`，强调色阶交给 CSS 按深浅派生 |
| `web/src/views/settings.ts` | 装扮页新增「外观」三选一 |
| `web/src/main.ts` / `views/auth.ts` / `views/editor.ts` | 页头、登录页、写作页顶栏各加一个切换按钮 |
| `web/index.html` | 首屏前内联预置外观，避免深色用户白闪 |
| `web/src/components.ts` | 修无封面文章卡片留 300px 空白（改为不渲染封面区） |
| `web/src/styles.css` | 修裸 `textarea`（留言 / 评论）没有背景色，深色下露出 UA 灰底 |
| `web/src/demo.ts` | **新增**：浏览器内模拟后端，`VITE_DEMO=1` 时接管全部 `/api/*` |
| `web/src/api.ts` | 请求层支持演示后端；导出 `DEMO` 开关 |
| `web/src/main.ts` | 路由切换时复位 `writer-mode`；打印演示提示 |
| `web/vite.config.ts` | 支持 `VITE_BASE`（GitHub Pages 子路径） |
| `internal/api/posts.go` / `albums.go` / `users.go` | 修 `unlisted` 出现在他人列表、统计口径不一致 |
| `internal/seed/seed.go` | 修默认背景音乐指向不存在的文件 |
| `web/src/styles.css` | 修点胶囊头像不展开用户菜单（`pointer-events`） |
| `main.go` | 增加 `version` 变量，由 `-ldflags` 注入 |
| `.github/workflows/ci.yml` | 构建 + 静态检查 + 编译 + 启动冒烟测试 + 镜像校验 |
| `.github/workflows/pages.yml` | 静态演示站部署到 GitHub Pages |
| `.github/workflows/release.yml` | 打 tag 出 5 平台二进制 + GHCR 多架构镜像 |
| `Dockerfile` / `compose.yaml` / `.dockerignore` | 多阶段构建、非 root 运行、数据卷 |
| `README.md` | 徽章、在线演示、部署三方案、编辑器说明 |

---

## 三、编辑器：从「卡片里的一条缝」到「整页工作台」

### 前后对比

| 维度 | 改前 | 改后 |
| --- | --- | --- |
| 可用宽度 | `min(1120px, 100%-48px)` 减去 288px 侧栏 ≈ 600–800px | 视口全宽，编辑区一直铺到窗口边缘 |
| 高度 | `min-height: 460px`，随内容增长，页面整体滚动 | `calc(100dvh - 页头)`，页面不滚，编辑区内部滚动 |
| 侧栏 | 常驻 288px，挤占正文 | 变成右侧抽屉，默认收起（设置按钮唤出） |
| 分屏比例 | 固定 1:1 | 拖拽分割线自由调整（22%–78%），双击复位，记 localStorage |
| 大纲 | 无 | 左侧抽屉，按 `#` 级标题生成，点击跳转（含代码块内的 `#` 过滤） |
| 滚动 | 两栏各滚各的 | 分屏时按比例同步 |
| 回车 | 只会换行 | 自动续写 `-` / `1.` / `- [ ]` / `>`；空项再回车退出列表 |
| Tab | 插入两个空格 | 整行（或选区）缩进 / 反缩进 |
| 撤销 | 工具栏插入后按 Ctrl+Z 无效 | 所有插入走 `execCommand('insertText')`，保留原生撤销栈 |
| 状态栏 | 字数 + 阅读时长 | 字数（中文按字、英文按词）/ 阅读时长 / 光标行列 / 保存状态 |
| 快捷键 | 4 个 | 12 个，附 `Ctrl+/` 面板 |

### 快捷键一览

| 按键 | 作用 |
| --- | --- |
| `Ctrl+B` / `Ctrl+I` | 加粗 / 斜体 |
| `Ctrl+E` | 行内代码 |
| `Ctrl+K` | 链接 |
| `Ctrl+1/2/3` | 一 / 二 / 三级标题 |
| `Ctrl+Shift+C` | 代码块 |
| `Ctrl+Shift+8` / `Ctrl+Shift+7` | 无序 / 有序列表 |
| `Ctrl+Shift+Q` | 引用 |
| `Ctrl+Shift+E / S / V` | 编辑 / 分屏 / 预览 |
| `Ctrl+S` | 保存 |
| `Tab` / `Shift+Tab` | 整行缩进 / 反缩进 |
| `Ctrl+V` | 粘贴截图直接上传插图 |
| `Ctrl+/` | 快捷键面板 |
| `F11` | 全屏写作（Fullscreen API） |

### 两个实现细节

- **大纲跳转**：textarea 里没有 DOM 节点可滚，改成「用同宽同字体的隐藏 div 量出目标行之前的高度」，再设 `scrollTop`；比按比例估算准，且只在点击时算一次。
- **保留撤销**：直接改 `textarea.value` 会清空浏览器撤销栈，所以插入统一走 `document.execCommand('insertText')`（先 `setSelectionRange` 覆盖选区），失败再降级 `setRangeText`。

---

## 四、深色外观

不是「加一层反色滤镜」，而是把颜色收成一套变量，再用一套深色值覆盖。

| 做法 | 说明 |
| --- | --- |
| 语义化 | 新增 `--surface`（控件底）/ `--surface-2`（浅底）/ `--sunken`（分段器凹槽）/ `--raised`（凹槽里的选中块）/ `--faint`（极弱文字）/ `--on-accent`、`--on-ink`（主色上的文字）/ `--code-*`、`--pre-*` |
| 强调色派生 | `--accent-ink`、`--accent-soft`、深色下的 `--accent` 全部由 `--theme-accent` 用 `color-mix` 算出，五套主题自动适配，不用维护 5×2 份色值 |
| 反相处理 | Toast（深底白字 → 浅底深字）、`accent-soft` 语义块（置顶 / 点赞 / 通知类别）、草稿条、`pre` 代码块，各自单独设深色值而不是简单反转 |
| 原生控件 | `color-scheme: dark` 让滚动条、日期选择、自动填充底色一起变暗；`input:-webkit-autofill` 单独压掉 Chrome 的白底 |
| 首屏 | `index.html` 里 6 行内联脚本先读 `localStorage` 定下 `data-appearance`，避免深色用户先看到一帧白 |
| 切换入口 | 页头、写作页顶栏、登录页右上角三个按钮；`设置 → 装扮` 里可明确选「跟随系统」 |

一个坑值得记下来：`.wr-body` 原来就用 `data-mode="split|edit|preview"` 表示视图模式，所以外观属性命名为 `data-appearance`，避免两套状态抢同一个属性名。

---

## 五、托管方案

| 方案 | 能跑什么 | 数据 | 适用 |
| --- | --- | --- | --- |
| GitHub Pages（`pages.yml`） | 前端 + 浏览器内模拟后端 | localStorage | 给别人看效果、放简历链接 |
| Docker（`release.yml` → GHCR） | 完整 Go 服务 | SQLite 文件卷 | 自建服务器 / NAS / VPS |
| 单文件二进制（Releases） | 完整 Go 服务 | 本地目录 | 最省事，`./qzone -data ./data` |

**Pages 为什么必须是「演示模式」**：Pages 只发静态文件，没有进程也没有文件系统，`SQLite` 和 `uploads/` 都放不下。所以 `web/src/demo.ts` 在浏览器里实现了一套与 Go 服务同形的接口（注册登录、文章 CRUD、点赞评论、相册、留言、通知、搜索、上传转 dataURL），把 `localStorage` 当数据库。代价是数据只在单浏览器里、图片以 dataURL 存储（约 5MB 配额），因此**不要往上面放真实内容**。

启用：仓库 `Settings → Pages → Source` 选 `GitHub Actions`，推一次 `main` 或手动跑 `Deploy demo to Pages`。

---

## 六、验证记录

| 项 | 方式 | 结果 |
| --- | --- | --- |
| 编辑器布局 | Playwright 1512×950 / 390×844 截图 | 整页铺满；writer 模式下 `scrollHeight == innerHeight`（950），页面不滚动；移动端横向溢出 0 |
| 列表续行 / Tab / 撤销 / 分屏拖拽 | Playwright 断言 | 通过（`- 第一项↵第二项↵↵` → 自动续行并退出列表；拖拽 756px → 556px） |
| 大纲跳转 | 3,457 字长文，5 个标题 | 大纲 5 项全部识别，点击后 `textarea.scrollTop` 1612 → 1758 |
| 演示站 12 个路由 | Playwright 逐页访问 | 全部渲染，控制台 0 报错；写作 → 发布 → 刷新 → 评论闭环通过 |
| 深色外观 | 14 个路由 × 深浅两套，脚本扫描 `#view` 内近白大块 | 无浅色残留；强调色采样：深色墨绿 `#899f92`、深色陶土 `#c09583`，配深色文字对比达标 |
| 跟随系统 | `colorScheme: dark/light` 两个上下文 | 分别解析为 `dark` / `light`；清除偏好后自动跟随 |
| 镜像 | `docker build` + `docker run -v ...:/data` | 首页 200，首次启动自动播种 |
| CI / Pages / Release | 本地无法执行 | 语法与步骤已对齐官方 action 版本，首次推送后在 Actions 页确认 |
| 在线华语曲库 | 39 首逐条 `Range` 拉流 | 39/39 返回 200/206，`audio/mp4`，拖动进度正常（`Content-Range` 正确） |
| 曲库 UI | Playwright 1440 / 390 | 6 个分组筛选正确（国风 7 首）；保存后自动播放，切路由不中断；移动端卡片 320px 无溢出 |
| 全站回归 | 13 路由 × 明暗 × 3 视口 | 横向溢出 0、控制台报错 0 |

---

## 七、下一件事

P0/P1 已收口。接下来收益最大的是 **上传文件的引用计数**：

删除文章 / 相册时只删数据库记录，磁盘原图会一直留着；但直接删文件又会误删被多篇文章共用的图。建议加一张 `media(url, owner_id, ref_type, ref_id)` 表，上传时登记、引用时插一行、删除时按 `url` 判断还有没有其他引用，没有才 `os.Remove`。顺带能做出「空间占用统计」和「孤立文件清理」。

其次才是搜索：文章量到几万时 `LIKE %kw%` 会明显变慢，SQLite FTS5 可以解决，但要引入影子表与同步逻辑，等内容量真的上来再做。
