package api

import (
	"context"
	"encoding/json"
	"errors"
	"io/fs"
	"net/http"
	"os"
	"path"
	"sort"
	"strings"
	"time"

	"qzone/ent"
	"qzone/ent/notification"
	"qzone/ent/session"
	"qzone/ent/user"
)

// Server 承载数据库客户端、上传目录与前端静态资源。
type Server struct {
	db       *ent.Client
	uploads  string
	webFS    fs.FS
	web      http.Handler
	webIndex []byte
}

const sessionCookie = "qz_session"

func New(db *ent.Client, uploads string, webFS fs.FS) *Server {
	s := &Server{db: db, uploads: uploads, webFS: webFS}
	if webFS != nil {
		if raw, err := fs.ReadFile(webFS, "index.html"); err == nil {
			s.webIndex = raw
		}
		s.web = http.FileServerFS(webFS)
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

	mux.HandleFunc("POST /api/upload", s.auth(s.uploadImage))
	mux.HandleFunc("POST /api/upload/audio", s.auth(s.uploadAudio))

	mux.Handle("/media/", http.StripPrefix("/media/", s.mediaHandler()))
	mux.Handle("/", s.spaHandler())
	return mux
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
	ID          int      `json:"id"`
	UIN         string   `json:"uin"`
	Nickname    string   `json:"nickname"`
	Avatar      string   `json:"avatar"`
	Cover       string   `json:"cover"`
	Signature   string   `json:"signature"`
	Bio         string   `json:"bio"`
	City        string   `json:"city"`
	Constel     string   `json:"constellation"`
	Gender      int      `json:"gender"`
	Age         int      `json:"age"`
	Level       int      `json:"level"`
	Vip         int      `json:"vip"`
	Theme       string   `json:"theme"`
	Mood        string   `json:"mood"`
	BgmTitle    string   `json:"bgmTitle"`
	BgmURL      string   `json:"bgmUrl"`
	Tags        []string `json:"tags"`
	VisitCount  int      `json:"visitCount"`
	SignStreak  int      `json:"signStreak"`
	SunValue    int      `json:"sunValue"`
	LastSignIn  string   `json:"lastSignIn"`
	IsSelf      bool     `json:"isSelf"`
	Posts       int      `json:"posts"`
	Journals    int      `json:"journals"`
	Photos      int      `json:"photos"`
	Messages    int      `json:"messages"`
	TodayVisit  int      `json:"todayVisit"`
	CreatedAt   string   `json:"createdAt"`
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
		w.Header().Set("Cache-Control", "public, max-age=604800")
		fsrv.ServeHTTP(w, r)
	})
}

func (s *Server) spaHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			fail(w, http.StatusNotFound, "接口不存在")
			return
		}
		clean := path.Clean(r.URL.Path)
		if clean != "/" && s.web != nil {
			rec := &statusRecorder{header: http.Header{}}
			s.web.ServeHTTP(rec, r)
			if rec.status != http.StatusNotFound {
				for k, vs := range rec.header {
					for _, v := range vs {
						w.Header().Add(k, v)
					}
				}
				w.WriteHeader(rec.status)
				_, _ = w.Write(rec.body)
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
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write(index)
	})
}

type statusRecorder struct {
	header http.Header
	status int
	body   []byte
}

func (r *statusRecorder) Header() http.Header { return r.header }
func (r *statusRecorder) WriteHeader(c int)   { r.status = c }
func (r *statusRecorder) Write(b []byte) (int, error) {
	if r.status == 0 {
		r.status = http.StatusOK
	}
	r.body = append(r.body, b...)
	return len(b), nil
}

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


