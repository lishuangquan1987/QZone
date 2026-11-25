# QQ空间 · Go + TypeScript 复刻

对标 `https://user.qzone.qq.com/294388344`（昵称 **Change~生活**）的空间产品复刻：Go 单二进制后端 + TypeScript 前端，不依赖任何第三方库或外部图床，克隆即可离线运行。

> 说明：目标空间的内容需登录才能查看，本项目**没有**抓取或保存任何真实用户数据。信息架构参照真实页面（顶部导航、发布器、访客三档、个人档等）与公开的产品形态，示例内容为虚构演示数据。

---

## 快速开始

```bash
# 1. 构建前端（产物会被嵌入 Go 二进制）
cd web && npm install && npm run build && cd ..

# 2. 构建并启动后端
go build -o qzone.exe .
./qzone.exe -addr :8080
```

打开 <http://localhost:8080>，演示账号：

| QQ 号 | 密码 |
| --- | --- |
| `294388344` | `qzone123` |

好友账号同样可用（如 `452198703` / `qzone123`），用两个浏览器窗口即可体验「串门、留言、点赞、收到消息」的完整闭环。

### 开发模式（前端热更新）

```bash
./qzone.exe -addr :8080      # 终端 A
cd web && npm run dev        # 终端 B → http://localhost:5173
```

Vite 将 `/api`、`/media` 代理到 `127.0.0.1:8080`。

---

## 目录结构

```
.
├── main.go                     # 入口：embed 前端产物、初始化数据、启动 HTTP
├── internal/
│   ├── api/                    # 路由与处理器
│   │   ├── api.go              # 路由表、视图映射、SPA 托管
│   │   ├── auth.go             # 登录/会话/个人档/签到/访客
│   │   ├── feeds.go            # 说说：发布、点赞、评论、转发
│   │   ├── content.go          # 相册、日志、留言板
│   │   ├── social.go           # 好友、消息、搜索
│   │   ├── upload.go           # 图片上传
│   │   └── errors.go
│   └── store/                  # 数据层
│       ├── models.go           # 实体定义
│       ├── store.go            # JSON 快照 + RWMutex + 原子写
│       ├── seed.go             # 首次启动写入示例空间
│       └── assets.go           # 生成 SVG 素材（头像/封面/照片）
├── web/                        # 前端（Vite + TypeScript，无框架）
│   └── src/
│       ├── main.ts             # 应用外壳、路由、右栏
│       ├── api.ts              # 类型化接口客户端
│       ├── components.ts       # 说说卡片、评论、相册/日志卡片
│       ├── ui.ts               # 图标、时间、弹层、看图、Toast
│       ├── state.ts            # 全局状态与装扮主题
│       ├── styles.css          # 三栏版式与主题变量
│       └── views/              # 各模块页面
├── tools/                      # 截图验收脚本（Playwright，可选）
└── data/                       # 运行时生成：db.json + uploads/
```

---

## 已实现的功能

**账号与空间**
- QQ 号 + 口令登录、HttpOnly 会话 Cookie、退出登录
- 个人档编辑（昵称、签名、心情、城市、标签、头像、封面、背景音乐）
- 空间装扮：4 套主题配色、封面替换，全局生效
- 每日签到：连签天数、阳光值（花藤）

**说说**
- 发布文字 + 最多 9 张图、位置、三种可见范围（公开 / 仅好友 / 自己）
- 点赞、评论（支持 @回复）、删除评论、转发（带源内容快照）
- 时间线分页、全部动态 / 好友动态 / 转发三种视图
- 图片灯箱浏览（左右切换 + 键盘）

**日志**
- 分类筛选、封面、心情/天气、浏览量
- 富文本雏形（按段落排版）、点赞、评论、删除
- Markdown 风格纯文本正文，长文阅读版式

**相册**
- 创建 / 删除相册，三种可见范围
- 批量上传、封面自动取首图、照片点赞、删除照片
- 相册详情页 + 全屏看图

**留言板 / 好友 / 访客**
- 留言、主人回复、删除
- 好友列表、特别关心开关、最近来访时间
- 访客三档：谁看过我 / 我看过谁 / 被挡访客（黄钻占位）
- 访问他人空间：封面、统计、说说 / 日志 / 相册 / 留言四个标签

**消息与检索**
- 点赞、评论、留言、访客四类消息，未读角标，一键已读
- 全局搜索：说说、日志、相册、用户

**权限模型**
- 每条内容独立 `visibility`，服务端按「是否好友 / 是否本人」过滤，前端拿不到越权数据

## 未实现（有意留白）

| 项目 | 原因 |
| --- | --- |
| QQ 互联扫码登录 | 需要真实 AppID 与回调域名，且不应把真实账号交给我方 |
| 黄钻付费、装扮商城、游戏/直播 | 涉及支付与第三方业务 |
| 视频说说、直播、音乐版权播放 | 需要转码与版权资源 |
| 定时说说、私密评论、话题、@好友 | 可基于现有模型扩展，未在本版实现 |
| 实时推送 | 当前为请求-响应，未引入 WebSocket |
| 多实例部署 | 单文件 JSON 存储，仅适合单进程 |

安全提示：口令使用 `sha256(uin:password)` 摘要，仅用于本地演示；生产应改为 bcrypt/argon2，并加上 CSRF 与速率限制。

---

## 接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/auth/login` | 登录，签发会话 |
| GET | `/api/auth/session` | 会话探测 |
| GET | `/api/bootstrap` | 首屏：我、好友、主题、未读数 |
| GET | `/api/users/{uin}` | 空间档案与统计 |
| PATCH | `/api/users/me` | 修改个人档 |
| POST | `/api/users/me/signin` | 每日签到 |
| GET | `/api/users/{uin}/visitors?mode=in\|out` | 访客足迹 |
| POST | `/api/users/{uin}/visit` | 记录访问 |
| GET/POST | `/api/feeds` | 说说列表（`scope`、`before`、`q`）/ 发布 |
| POST | `/api/feeds/{id}/like` | 点赞切换 |
| POST | `/api/feeds/{id}/comments` | 评论 |
| POST | `/api/feeds/{id}/repost` | 转发 |
| GET/POST | `/api/albums` | 相册列表 / 创建 |
| GET | `/api/albums/{id}` | 相册详情（含照片） |
| POST | `/api/albums/{id}/photos` | 批量添加照片 |
| GET/POST | `/api/journals` | 日志列表 / 新建 |
| GET | `/api/journals/{id}` | 日志详情（浏览量 +1） |
| GET/POST | `/api/guestbook` | 留言列表 / 发表 |
| POST | `/api/guestbook/{id}/reply` | 主人回复 |
| GET | `/api/friends` | 好友列表 |
| POST | `/api/friends/{uin}/special` | 特别关心开关 |
| GET | `/api/notifications` | 消息中心 |
| GET | `/api/search?q=` | 全站搜索 |
| POST | `/api/upload` | 图片上传（≤8MB） |

---

## 数据存储

`data/db.json` 保存全部实体，`data/uploads/` 保存图片。写入流程为「内存修改 → MarshalIndent → 临时文件 → rename」，保证崩溃时磁盘上始终是完整快照。

首次启动若 `db.json` 为空，会生成 7 个账号、10 条说说、6 个相册（24 张照片）、5 篇日志、9 条留言、访客与消息记录，以及 50 余个 SVG 素材（渐变头像、封面、照片），全部离线生成，不依赖外网。

想恢复初始状态：停止服务后删除 `data/` 目录再启动即可。

---

## 验收方式

```bash
# 可选：安装 Playwright 后按路由整页截图
node tools/qa.mjs "#/home" "#/journals" "#/albums" "#/u/452198703"
```

截图输出到 `.qa/`，可用来核对版式回归。开发期间已用该脚本验证桌面 1440px 与移动 414px 两种视口。
