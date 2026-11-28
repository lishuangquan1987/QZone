package api

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"qzone/ent"
	"qzone/ent/notification"
	"qzone/ent/photo"
	"qzone/ent/session"
	"qzone/ent/user"
)

// Server 承载数据库客户端、上传目录与前端静态资源。
type Server struct {
	db       *ent.Client
	sqlDB    *sql.DB // statsFor 等手写聚合 SQL 用；ent 只做结构化查询
	uploads  string
	webFS    fs.FS
	web      http.Handler
	webIndex []byte
	// precompressed 是启动时对 embed 静态资源预压好的 gzip 产物（key = 请求路径）。
	// 之前每个请求实时压 156KB 的 JS，qps 只有其它静态资源的 1/6。
	precompressed map[string][]byte
	maxImage      int64
	maxAudio      int64
	trustProxy    bool
	views         *viewCounter
}

// Options 是运行期可调参数。
type Options struct {
	MaxImage int64 // 单张图片上限（字节）
	MaxAudio int64 // 单段音频上限（字节）
	// TrustProxy 表示前面有可信反代（Nginx / Caddy / 云负载均衡）。
	// 只有打开时才会采信 X-Forwarded-For，否则一律用 TCP 来源地址。
	TrustProxy bool
}

const sessionCookie = "qz_session"

func New(db *ent.Client, sqlDB *sql.DB, uploads string, webFS fs.FS, opt Options) *Server {
	if opt.MaxImage <= 0 {
		opt.MaxImage = 30 << 20
	}
	if opt.MaxAudio <= 0 {
		opt.MaxAudio = 50 << 20
	}
	s := &Server{
		db: db, sqlDB: sqlDB, uploads: uploads, webFS: webFS,
		maxImage: opt.MaxImage, maxAudio: opt.MaxAudio, trustProxy: opt.TrustProxy,
		views: newViewCounter(),
	}
	s.startViewFlusher()
	if webFS != nil {
		if raw, err := fs.ReadFile(webFS, "index.html"); err == nil {
			s.webIndex = raw
		}
		s.web = http.FileServerFS(webFS)
		s.precompressed = precompressAssets(webFS)
	}
	return s
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/auth/register", s.register)
	mux.HandleFunc("POST /api/auth/login", s.login)
	mux.HandleFunc("POST /api/auth/logout", s.logout)
	mux.HandleFunc("GET /api/auth/session", s.sessionInfo)

	mux.HandleFunc("GET /api/bootstrap", s.auth(s.bootstrap))
	mux.HandleFunc("GET /api/users/{uin}", s.auth(s.getUser))
	mux.HandleFunc("PATCH /api/users/me", s.auth(s.updateProfile))
	mux.HandleFunc("POST /api/users/me/signin", s.auth(s.signIn))
	mux.HandleFunc("GET /api/users/{uin}/visitors", s.auth(s.visitors))
	mux.HandleFunc("POST /api/users/{uin}/visit", s.auth(s.recordVisit))

	mux.HandleFunc("GET /api/posts", s.auth(s.listPosts))
	mux.HandleFunc("POST /api/posts", s.auth(s.createPost))
	mux.HandleFunc("GET /api/posts/{id}", s.auth(s.getPost))
	mux.HandleFunc("PATCH /api/posts/{id}", s.auth(s.updatePost))
	mux.HandleFunc("DELETE /api/posts/{id}", s.auth(s.deletePost))
	mux.HandleFunc("POST /api/posts/{id}/like", s.auth(s.likePost))
	mux.HandleFunc("POST /api/posts/{id}/comments", s.auth(s.commentPost))
	mux.HandleFunc("DELETE /api/posts/{id}/comments/{cid}", s.auth(s.deleteComment))

	mux.HandleFunc("GET /api/albums", s.auth(s.listAlbums))
	mux.HandleFunc("POST /api/albums", s.auth(s.createAlbum))
	mux.HandleFunc("GET /api/albums/{id}", s.auth(s.getAlbum))
	mux.HandleFunc("PATCH /api/albums/{id}", s.auth(s.updateAlbum))
	mux.HandleFunc("DELETE /api/albums/{id}", s.auth(s.deleteAlbum))
	mux.HandleFunc("POST /api/albums/{id}/photos", s.auth(s.addPhotos))
	mux.HandleFunc("DELETE /api/albums/{id}/photos/{pid}", s.auth(s.deletePhoto))
	mux.HandleFunc("POST /api/photos/{id}/like", s.auth(s.likePhoto))

	mux.HandleFunc("GET /api/guestbook", s.auth(s.listGuestbook))
	mux.HandleFunc("POST /api/guestbook", s.auth(s.createGuestbook))
	mux.HandleFunc("DELETE /api/guestbook/{id}", s.auth(s.deleteGuestbook))
	mux.HandleFunc("POST /api/guestbook/{id}/reply", s.auth(s.replyGuestbook))

	mux.HandleFunc("GET /api/notifications", s.auth(s.listNotifications))
	mux.HandleFunc("POST /api/notifications/read", s.auth(s.readNotifications))
	mux.HandleFunc("GET /api/search", s.auth(s.search))
	mux.HandleFunc("GET /api/music/library", s.auth(s.musicLibrary))
	mux.HandleFunc("GET /api/music/stream", s.auth(s.musicStream))

	mux.HandleFunc("POST /api/upload", s.auth(s.uploadImage))
	mux.HandleFunc("POST /api/upload/audio", s.auth(s.uploadAudio))

	mux.HandleFunc("GET /healthz", s.healthz)

	mux.Handle("/media/", http.StripPrefix("/media/", s.mediaHandler()))
	mux.Handle("/", s.spaHandler())
	return securityHeaders(withCompression(withAccessLog(mux)))
}

// healthz 给容器探活用：能读库就算健康。
func (s *Server) healthz(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	if _, err := s.db.User.Query().Limit(1).Exist(ctx); err != nil {
		fail(w, http.StatusServiceUnavailable, "数据库不可用")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// accessLog 记录接口调用与慢请求；静态资源只在出错时记，避免刷屏。
func withAccessLog(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &logWriter{ResponseWriter: w, status: http.StatusOK}
		h.ServeHTTP(rec, r)
		if rec.status == http.StatusNotModified {
			return
		}
		cost := time.Since(start)
		isAPI := strings.HasPrefix(r.URL.Path, "/api/")
		if !isAPI && rec.status < 400 && cost < 500*time.Millisecond {
			return
		}
		log.Printf("%s %s %d %s", r.Method, r.URL.Path, rec.status, cost.Round(time.Millisecond))
	})
}

// logWriter 只用于取状态码，Flush 要透传（将来加 SSE 时不用再改）。
type logWriter struct {
	http.ResponseWriter
	status int
}

func (w *logWriter) WriteHeader(c int) {
	w.status = c
	w.ResponseWriter.WriteHeader(c)
}

func (w *logWriter) Flush() {
	if f, ok := w.ResponseWriter.(http.Flusher); ok {
		f.Flush()
	}
}

// securityHeaders 补几个成本极低、收益明确的响应头。
func securityHeaders(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("Referrer-Policy", "same-origin")
		w.Header().Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
		h.ServeHTTP(w, r)
	})
}

// ---------- 通用响应 ----------

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func fail(w http.ResponseWriter, code int, msg string) {
	writeJSON(w, code, map[string]string{"error": msg})
}

func decode(r *http.Request, v any) error {
	return json.NewDecoder(http.MaxBytesReader(nil, r.Body, 4<<20)).Decode(v)
}

var (
	errForbidden = errors.New("forbidden")
	errNotFound  = errors.New("not found")
)

func writeErr(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, errForbidden):
		fail(w, http.StatusForbidden, "没有权限执行该操作")
	case errors.Is(err, errNotFound), ent.IsNotFound(err):
		fail(w, http.StatusNotFound, "内容不存在或已删除")
	case ent.IsConstraintError(err):
		fail(w, http.StatusConflict, "该内容已存在")
	default:
		fail(w, http.StatusInternalServerError, "服务器开小差了，请稍后再试")
	}
}

// ---------- 会话 ----------

type authed func(http.ResponseWriter, *http.Request, *ent.User)

func (s *Server) auth(fn authed) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := s.currentUser(r)
		if u == nil {
			fail(w, http.StatusUnauthorized, "登录状态已失效，请重新登录")
			return
		}
		fn(w, r, u)
	}
}

func (s *Server) currentUser(r *http.Request) *ent.User {
	c, err := r.Cookie(sessionCookie)
	if err != nil || c.Value == "" {
		return nil
	}
	ctx := r.Context()
	sess, err := s.db.Session.Query().
		Where(session.TokenEQ(c.Value)).
		WithUser().
		Only(ctx)
	if err != nil || sess.ExpiresAt.Before(time.Now()) {
		return nil
	}
	return sess.Edges.User
}

func (s *Server) issueSession(ctx context.Context, w http.ResponseWriter, u *ent.User) error {
	token := newToken()
	_, err := s.db.Session.Create().
		SetToken(token).
		SetExpiresAt(time.Now().Add(30 * 24 * time.Hour)).
		SetUser(u).
		Save(ctx)
	if err != nil {
		return err
	}
	http.SetCookie(w, &http.Cookie{
		Name: sessionCookie, Value: token, Path: "/", HttpOnly: true,
		SameSite: http.SameSiteLaxMode, MaxAge: 30 * 24 * 3600,
	})
	return nil
}

// ---------- 视图 ----------

type brief struct {
	ID       int    `json:"id"`
	UIN      string `json:"uin"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
	Level    int    `json:"level"`
	Vip      int    `json:"vip"`
}

type userView struct {
	ID         int      `json:"id"`
	UIN        string   `json:"uin"`
	Nickname   string   `json:"nickname"`
	Avatar     string   `json:"avatar"`
	Cover      string   `json:"cover"`
	Signature  string   `json:"signature"`
	Bio        string   `json:"bio"`
	City       string   `json:"city"`
	Constel    string   `json:"constellation"`
	Gender     int      `json:"gender"`
	Age        int      `json:"age"`
	Level      int      `json:"level"`
	Vip        int      `json:"vip"`
	Theme      string   `json:"theme"`
	Mood       string   `json:"mood"`
	BgmTitle   string   `json:"bgmTitle"`
	BgmURL     string   `json:"bgmUrl"`
	Tags       []string `json:"tags"`
	VisitCount int      `json:"visitCount"`
	SignStreak int      `json:"signStreak"`
	SunValue   int      `json:"sunValue"`
	LastSignIn string   `json:"lastSignIn"`
	IsSelf     bool     `json:"isSelf"`
	Posts      int      `json:"posts"`
	Journals   int      `json:"journals"`
	Photos     int      `json:"photos"`
	Messages   int      `json:"messages"`
	TodayVisit int      `json:"todayVisit"`
	CreatedAt  string   `json:"createdAt"`
}

type commentView struct {
	ID      int    `json:"id"`
	Content string `json:"content"`
	At      string `json:"at"`
	Author  brief  `json:"author"`
	ReplyTo string `json:"replyTo,omitempty"`
	CanDel  bool   `json:"canDel"`
}

type postView struct {
	ID          int           `json:"id"`
	Title       string        `json:"title"`
	Summary     string        `json:"summary"`
	Content     string        `json:"content,omitempty"`
	Cover       string        `json:"cover"`
	Category    string        `json:"category"`
	Images      []string      `json:"images"`
	Visibility  string        `json:"visibility"`
	Pinned      bool          `json:"pinned"`
	Views       int           `json:"views"`
	ReadingTime int           `json:"readingTime"`
	At          string        `json:"at"`
	UpdatedAt   string        `json:"updatedAt"`
	Author      brief         `json:"author"`
	Likes       []brief       `json:"likes"`
	Liked       bool          `json:"liked"`
	LikeCount   int           `json:"likeCount"`
	Comments    []commentView `json:"comments"`
	CommentNum  int           `json:"commentNum"`
	CanEdit     bool          `json:"canEdit"`
}

func toBrief(u *ent.User) brief {
	if u == nil {
		return brief{Nickname: "已注销"}
	}
	return brief{ID: u.ID, UIN: u.Uin, Nickname: u.Nickname, Avatar: u.Avatar, Level: u.Level, Vip: u.Vip}
}

func timeStr(t time.Time) string { return t.Format(time.RFC3339) }

func buildUserView(u *ent.User, viewerID int, posts, journals, photos, messages, today int) userView {
	return userView{
		ID: u.ID, UIN: u.Uin, Nickname: u.Nickname, Avatar: u.Avatar, Cover: u.Cover,
		Signature: u.Signature, Bio: u.Bio, City: u.City, Constel: u.Constellation,
		Gender: u.Gender, Age: u.Age, Level: u.Level, Vip: u.Vip, Theme: u.Theme,
		Mood: u.Mood, BgmTitle: u.BgmTitle, BgmURL: u.BgmURL, Tags: u.Tags,
		VisitCount: u.VisitCount, SignStreak: u.SignStreak, SunValue: u.SunValue,
		LastSignIn: u.LastSignIn, IsSelf: u.ID == viewerID,
		Posts: posts, Journals: journals, Photos: photos, Messages: messages,
		TodayVisit: today, CreatedAt: timeStr(u.CreatedAt),
	}
}

// ---------- 内容可见性 ----------

// visible 判断 viewer 能否查看 owner 的内容。
func visible(visibility string, ownerID, viewerID int) bool {
	if ownerID == viewerID {
		return true
	}
	return visibility != "private"
}

// ---------- 静态资源 ----------

func (s *Server) mediaHandler() http.Handler {
	fsrv := http.FileServer(http.Dir(s.uploads))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 整个站点都要求登录，媒体文件不能成为绕过权限的后门：
		// 先验会话，再按所在相册的可见范围判断这张照片能不能给当前用户看。
		me := s.currentUser(r)
		if me == nil {
			fail(w, http.StatusUnauthorized, "请先登录")
			return
		}
		rel := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
		url := "/media/" + rel
		if !s.mediaVisible(r.Context(), url, me.ID) {
			fail(w, http.StatusForbidden, "没有权限查看这张图片")
			return
		}
		// ?w=480 走缩略图：相册一屏 20 张原图就是几十 MB
		if raw := r.URL.Query().Get("w"); raw != "" {
			if width, err := strconv.Atoi(raw); err == nil && thumbWidths[width] {
				if s.serveThumb(w, r, strings.TrimPrefix(rel, "/"), width) {
					return
				}
			}
		}
		// 同一个地址对不同用户可能结果不同，只能私有缓存
		w.Header().Set("Cache-Control", "private, max-age=604800")
		w.Header().Set("Vary", "Cookie")
		// 上传的 SVG 直接打开时会执行脚本：用 sandbox 把它关进无同源的小黑屋
		if strings.HasSuffix(strings.ToLower(r.URL.Path), ".svg") {
			w.Header().Set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox")
		}
		fsrv.ServeHTTP(w, r)
	})
}

// mediaVisible 判断媒体地址是否对 viewer 可见。只有相册里的照片受相册可见范围约束，
// 头像、封面等其它素材维持原样。
func (s *Server) mediaVisible(ctx context.Context, url string, viewer int) bool {
	p, err := s.db.Photo.Query().Where(photo.URLEQ(url)).WithAlbum().First(ctx)
	if err == nil {
		if p.Edges.Album == nil {
			return true
		}
		return visible(p.Edges.Album.Privacy, p.Edges.Album.OwnerID, viewer)
	}
	if !ent.IsNotFound(err) {
		return false
	}

	// 不在相册里的文件：头像、封面、背景音乐本来就是公开素材
	_, err = s.db.User.Query().Where(user.Or(
		user.AvatarEQ(url),
		user.CoverEQ(url),
		user.BgmURLEQ(url),
	)).Only(ctx)
	if err == nil {
		return true
	}
	if !ent.IsNotFound(err) {
		return false
	}

	// 其余（上传了但还没加进相册的图）只给本人看，避免「拿到链接就能看」
	uin, ok := uploadOwner(url)
	if !ok {
		return false
	}
	owner, err := s.db.User.Query().Where(user.Uin(uin)).Only(ctx)
	return err == nil && owner.ID == viewer
}

func (s *Server) spaHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			fail(w, http.StatusNotFound, "接口不存在")
			return
		}
		clean := path.Clean(r.URL.Path)
		if clean != "/" && s.web != nil {
			// 先 stat 判断文件是否存在，存在就直接交给 FileServer。
			// 之前是先用缓冲 ResponseWriter 接住整个文件再写回，等于每个静态请求
			// 都多一次全量内存拷贝，也失去了 sendfile。
			if st, err := fs.Stat(s.webFS, strings.TrimPrefix(clean, "/")); err == nil && !st.IsDir() {
				// assets 下的文件名带内容哈希，可以放心长缓存；其它静态文件一周
				if strings.HasPrefix(clean, "/assets/") {
					w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
					// 启动时已压好的 gzip 产物直接吐，省掉每请求实时压缩
					if gz, ok := s.precompressed[clean]; ok && acceptsGzip(r) {
						w.Header().Set("Content-Type", contentTypeOf(clean))
						w.Header().Set("Content-Encoding", "gzip")
						w.Header().Set("Content-Length", strconv.Itoa(len(gz)))
						addVary(w.Header(), "Accept-Encoding")
						_, _ = w.Write(gz)
						return
					}
				} else {
					w.Header().Set("Cache-Control", "public, max-age=604800")
				}
				s.web.ServeHTTP(w, r)
				return
			}
			// 带哈希的静态资源找不到就是真没了，不要回退成 index.html
			if strings.HasPrefix(clean, "/assets/") {
				fail(w, http.StatusNotFound, "资源不存在")
				return
			}
		}
		index := s.webIndex
		if len(index) == 0 {
			if raw, err := os.ReadFile("web/dist/index.html"); err == nil {
				index = raw
			}
		}
		if len(index) == 0 {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			_, _ = w.Write([]byte(`<!doctype html><meta charset="utf-8"><title>空间</title>
<body style="font-family:system-ui;padding:40px">前端尚未构建，请先执行 <code>cd web &amp;&amp; npm run build</code>。</body>`))
			return
		}
		// 入口文件每次都要回源确认（1KB 左右，代价很小），但用 ETag 让重复访问直接 304
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "no-cache")
		etag := indexETag(index)
		w.Header().Set("ETag", etag)
		if match := r.Header.Get("If-None-Match"); match != "" && strings.Contains(match, etag) {
			w.WriteHeader(http.StatusNotModified)
			return
		}
		_, _ = w.Write(index)
	})
}

// indexETag 用内容哈希做入口文件的 ETag（同一份构建产物只算一次）。
func indexETag(body []byte) string {
	indexETagOnce.Do(func() {
		sum := sha256.Sum256(body)
		indexETagCache = `"` + fmt.Sprintf("%x", sum[:8]) + `"`
	})
	return indexETagCache
}

var (
	indexETagOnce  sync.Once
	indexETagCache string
)

// ---------- 杂项 ----------

func sortByTimeDesc[T any](items []T, at func(T) time.Time) {
	sort.SliceStable(items, func(i, j int) bool { return at(items[i]).After(at(items[j])) })
}

func unreadCount(ctx context.Context, c *ent.Client, userID int) int {
	n, _ := c.Notification.Query().
		Where(notification.HasToWith(user.ID(userID)), notification.ReadEQ(false)).
		Count(ctx)
	return n
}

func containsName(ss []string, v string) bool {
	for _, s := range ss {
		if s == v {
			return true
		}
	}
	return false
}
