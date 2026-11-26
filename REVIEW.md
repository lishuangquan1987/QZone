# 项目评审与改进清单

> 评审对象：`lishuangquan1987/QZone`（Go + ent + SQLite + TypeScript 个人空间）
> 评审时间：2026-11-26 · 文中 `文件:行号` 均指评审时的代码位置

## 结论

架构是干净的：单二进制 + `go:embed` 前端、ent schema 即代码、前端零框架手写渲染，部署成本极低。**真正欠账在两处**：

1. **安全边界**——`/media/` 目录完全公开，等于把「私密相册」的保护降级成「URL 猜不到」；
2. **体验**——编辑器被 1120px 内容栏 + 288px 侧栏挤成一条竖条。已重写。

---

## 一、按优先级排列的待完善项

### P0 · 已经有实际影响

| # | 问题 | 位置 | 现状证据 | 建议 |
| --- | --- | --- | --- | --- |
| 1 | **媒体目录绕过权限** | `internal/api/server.go` `mediaHandler()` | 私有相册《存档：毕业那年》的照片 `/media/seed/a-campus.svg`，**未登录 curl 直接 200** | 媒体流走鉴权（按 `uploads/<uin>/` 前缀判定归属），或签发短时有效的 HMAC 签名 URL；对象存储同理 |
| 2 | **SVG 上传 = 存储型 XSS** | `internal/media/media.go` `SafeExt()` + `mediaHandler()` | 允许 `image/svg+xml`，并按扩展名原样输出，同源打开即执行脚本 | 禁用 SVG；或强制 `Content-Disposition: attachment` + `Content-Security-Policy: sandbox` + `X-Content-Type-Options: nosniff` |
| 3 | **`unlisted` 语义失效** | `posts.go` `VisibilityNEQ("private")`、`albums.go:122`、`users.go` 统计 | 「仅链接可见」的文章 / 相册会出现在别人的列表里（已实测复现） | **已修**：列表与统计统一改为 `= public`，详情页仍按「非 private 即可见」放行 |
| 4 | **默认背景音乐 404** | `internal/seed/seed.go` `SetBgmURL("/media/seed/ambient.wav")` | 实际文件叫 `music-night.wav`，登录即弹「背景音乐播放失败，可能是格式不支持」 | **已修**：指向 `media.TrackFile("night")` |

### P1 · 上线前该补

| # | 问题 | 位置 | 建议 |
| --- | --- | --- | --- |
| 5 | Cookie 没有 `Secure`，全站无安全响应头 | `issueSession()` | HTTPS 下加 `Secure`；补 `CSP` / `X-Frame-Options` / `Referrer-Policy` / `nosniff` |
| 6 | 登录、注册无速率限制 | `auth.go` `login()` | 按 IP + 空间号做滑动窗口（内存 map 足够）；失败次数过多延迟响应 |
| 7 | 会话过期不清理 | `ent/schema/session.go` | 启动时 + 定时 `DELETE FROM sessions WHERE expires_at < now()` |
| 8 | 浏览量可刷 | `getPost()` 每次 GET `AddViews(1)` | 同 IP + 文章 30 分钟内去重，或改用 `post_views` 明细表 |
| 9 | 上传只信任 `Content-Type` | `upload.go` `saveUpload()` | 读前 512 字节做魔数校验（`http.DetectContentType`）；图片重编码以剥离 EXIF；生成缩略图 |
| 10 | 无压缩、无长缓存 | `spaHandler()`、`mediaHandler()` | 静态资源加 `Cache-Control: public,max-age=31536000,immutable`（Vite 带 hash）；文本走 gzip/br；`spaHandler` 不必把整文件读进内存再写回 |
| 11 | 没有一行测试 | 全仓 | 至少给「可见性 / 归属校验」写 `enttest` 用例——上面 3 个越权问题都出在这层 |

### P2 · 产品与体验

| # | 建议 | 理由 |
| --- | --- | --- |
| 12 | 搜索加防抖 + 分页 + 关键词高亮 | 目前每敲一次回车就全表 `ContainsFold` |
| 13 | 相册生成缩略图（WebP，宽 480） | 现在首屏直出原图，一屏 9 张就是几十 MB |
| 14 | 消息用 SSE 推送未读数 | 已有通知表，加一个 `/api/events` 长连接即可，代码量很小 |
| 15 | RSS / sitemap / Open Graph | 个人博客的传播入口，目前分享出去是白卡片 |
| 16 | 深色模式 | 主题只换强调色，`--bg/--card/--ink` 还是硬编码一套 |
| 17 | 一键导出 | SQLite 文件好备份，但缺「文章 Markdown + 媒体 zip」的导出 |
| 18 | 可访问性 | 视图切换按钮缺 `aria-pressed`，Toast 缺 `role="status"`，`modal` 无焦点陷阱 |
| 19 | 草稿箱 | 草稿只在 localStorage，换设备就没了 |
| 20 | `gofmt -l` 目前会列出 6 个文件（`internal/api/*.go` 的结构体字段对齐） | 一次性 `gofmt -w` 清理，然后在 CI 加 `gofmt -l` 校验，避免后续 diff 里混入空白噪音 |

---

## 二、这次改了什么

| 文件 | 改动 |
| --- | --- |
| `web/src/views/editor.ts` | 编辑器整页重写（见下节） |
| `web/src/styles.css` | 删除旧 `.editor-*` 样式，新增 `.wr-*` 工作台样式（含移动端） |
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

## 四、托管方案

| 方案 | 能跑什么 | 数据 | 适用 |
| --- | --- | --- | --- |
| GitHub Pages（`pages.yml`） | 前端 + 浏览器内模拟后端 | localStorage | 给别人看效果、放简历链接 |
| Docker（`release.yml` → GHCR） | 完整 Go 服务 | SQLite 文件卷 | 自建服务器 / NAS / VPS |
| 单文件二进制（Releases） | 完整 Go 服务 | 本地目录 | 最省事，`./qzone -data ./data` |

**Pages 为什么必须是「演示模式」**：Pages 只发静态文件，没有进程也没有文件系统，`SQLite` 和 `uploads/` 都放不下。所以 `web/src/demo.ts` 在浏览器里实现了一套与 Go 服务同形的接口（注册登录、文章 CRUD、点赞评论、相册、留言、通知、搜索、上传转 dataURL），把 `localStorage` 当数据库。代价是数据只在单浏览器里、图片以 dataURL 存储（约 5MB 配额），因此**不要往上面放真实内容**。

启用：仓库 `Settings → Pages → Source` 选 `GitHub Actions`，推一次 `main` 或手动跑 `Deploy demo to Pages`。

---

## 五、验证记录

| 项 | 方式 | 结果 |
| --- | --- | --- |
| 编辑器布局 | Playwright 1512×950 / 390×844 截图 | 整页铺满；writer 模式下 `scrollHeight == innerHeight`（950），页面不滚动；移动端横向溢出 0 |
| 列表续行 / Tab / 撤销 / 分屏拖拽 | Playwright 断言 | 通过（`- 第一项↵第二项↵↵` → 自动续行并退出列表；拖拽 756px → 556px） |
| 大纲跳转 | 3,457 字长文，5 个标题 | 大纲 5 项全部识别，点击后 `textarea.scrollTop` 1612 → 1758 |
| 演示站 12 个路由 | Playwright 逐页访问 | 全部渲染，控制台 0 报错；写作 → 发布 → 刷新 → 评论闭环通过 |
| 镜像 | `docker build` + `docker run -v ...:/data` | 首页 200，首次启动自动播种 |
| CI / Pages / Release | 本地无法执行 | 语法与步骤已对齐官方 action 版本，首次推送后在 Actions 页确认 |

---

## 六、如果只做一件事

把 **`/media/` 的权限**补上。现在「私密相册」的安全性，取决于别人猜不到 `a-campus.svg` 这种文件名——而示例素材的文件名是固定且可枚举的。改法不复杂：给媒体 URL 加 `?sig=<hmac>&exp=<ts>`，或让 `/media/<uin>/...` 走一次会话校验。
