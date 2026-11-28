package api

import (
	"context"
	"net/http"
	"strings"
	"time"

	"qzone/ent"
	"qzone/ent/album"
	"qzone/ent/guestbook"
	"qzone/ent/notification"
	"qzone/ent/photo"
	"qzone/ent/post"
	"qzone/ent/user"
	"qzone/ent/visit"
)

// userView 汇总个人主页档案与统计。
func (s *Server) userView(ctx context.Context, u *ent.User, viewerID int) (userView, error) {
	posts, journals, photos, messages, today, err := s.statsFor(ctx, u, viewerID)
	if err != nil {
		return userView{}, err
	}
	return buildUserView(u, viewerID, posts, journals, photos, messages, today), nil
}

// ---------- 个人主页 ----------

type profilePatch struct {
	Nickname  *string   `json:"nickname"`
	Signature *string   `json:"signature"`
	Bio       *string   `json:"bio"`
	Mood      *string   `json:"mood"`
	City      *string   `json:"city"`
	Avatar    *string   `json:"avatar"`
	Cover     *string   `json:"cover"`
	Theme     *string   `json:"theme"`
	BgmTitle  *string   `json:"bgmTitle"`
	BgmURL    *string   `json:"bgmUrl"`
	Tags      *[]string `json:"tags"`
}

func (s *Server) updateProfile(w http.ResponseWriter, r *http.Request, me *ent.User) {
	var p profilePatch
	if err := decode(r, &p); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	ctx := r.Context()
	upd := s.db.User.UpdateOneID(me.ID)
	if p.Nickname != nil {
		n := strings.TrimSpace(*p.Nickname)
		if l := len([]rune(n)); l < 1 || l > 20 {
			fail(w, http.StatusBadRequest, "昵称需为 1-20 个字")
			return
		}
		upd.SetNickname(n)
	}
	if p.Signature != nil {
		upd.SetSignature(clip(*p.Signature, 80))
	}
	if p.Bio != nil {
		upd.SetBio(clipText(*p.Bio, 4000))
	}
	if p.Mood != nil {
		upd.SetMood(clip(*p.Mood, 20))
	}
	if p.City != nil {
		upd.SetCity(clip(*p.City, 20))
	}
	if p.Avatar != nil {
		v, ok := safeAssetURL(*p.Avatar, false)
		if !ok {
			fail(w, http.StatusBadRequest, "头像地址不合法")
			return
		}
		if v != "" {
			upd.SetAvatar(v)
		}
	}
	if p.Cover != nil {
		v, ok := safeAssetURL(*p.Cover, false)
		if !ok {
			fail(w, http.StatusBadRequest, "封面地址不合法")
			return
		}
		if v != "" {
			upd.SetCover(v)
		}
	}
	if p.Theme != nil {
		upd.SetTheme(*p.Theme)
	}
	if p.BgmTitle != nil {
		upd.SetBgmTitle(clip(*p.BgmTitle, 60))
	}
	if p.BgmURL != nil {
		v, ok := safeAssetURL(*p.BgmURL, true)
		if !ok {
			fail(w, http.StatusBadRequest, "背景音乐地址不合法")
			return
		}
		upd.SetBgmURL(v)
	}
	if p.Tags != nil && len(*p.Tags) <= 8 {
		upd.SetTags(*p.Tags)
	}
	u, err := upd.Save(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	view, err := s.userView(ctx, u, me.ID)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, view)
}

// signIn 每日签到。
func (s *Server) signIn(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	now := time.Now()
	today := dayKey(now)
	yesterday := dayKey(now.AddDate(0, 0, -1))

	if me.LastSignIn == today {
		writeJSON(w, http.StatusOK, map[string]any{
			"already": true, "streak": me.SignStreak, "sunValue": me.SunValue,
		})
		return
	}
	streak := 1
	if me.LastSignIn == yesterday {
		streak = me.SignStreak + 1
	}
	sun := me.SunValue + 20 + min(streak, 10)
	u, err := s.db.User.UpdateOneID(me.ID).
		SetLastSignIn(today).SetSignStreak(streak).SetSunValue(sun).Save(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"already": false, "streak": u.SignStreak, "sunValue": u.SunValue,
	})
}

type visitorView struct {
	Author brief  `json:"author"`
	Module string `json:"module"`
	At     string `json:"at"`
}

func (s *Server) visitors(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	uin := r.PathValue("uin")
	mode := r.URL.Query().Get("mode")

	host, err := s.db.User.Query().Where(user.Uin(uin)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if host.ID != me.ID {
		fail(w, http.StatusForbidden, "只有主人可以查看访客记录")
		return
	}

	q := s.db.Visit.Query().WithVisitor().WithHost()
	if mode == "out" {
		q = q.Where(visit.HasVisitorWith(user.ID(me.ID)))
	} else {
		q = q.Where(visit.HasHostWith(user.ID(me.ID)))
	}
	rows, err := q.Order(ent.Desc(visit.FieldCreatedAt)).Limit(60).All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}

	start := startOfDay(time.Now())
	out := make([]visitorView, 0, len(rows))
	today := 0
	for _, v := range rows {
		var b brief
		if mode == "out" {
			b = toBrief(v.Edges.Host)
		} else {
			b = toBrief(v.Edges.Visitor)
			if v.CreatedAt.After(start) {
				today++
			}
		}
		out = append(out, visitorView{Author: b, Module: v.Module, At: timeStr(v.CreatedAt)})
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"visitors": out, "total": host.VisitCount, "today": today,
	})
}

// recordVisit 记录访客足迹并产生一条消息。
func (s *Server) recordVisit(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	var body struct {
		Module string `json:"module"`
	}
	_ = decode(r, &body)
	if body.Module == "" {
		body.Module = "个人主页"
	}
	host, err := s.db.User.Query().Where(user.Uin(r.PathValue("uin"))).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if host.ID == me.ID {
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
		return
	}
	// 同一访客 30 分钟内重复进页面（刷新、来回切换）不重复计数，也不重复发消息
	recent, err := s.db.Visit.Query().
		Where(
			visit.HasHostWith(user.ID(host.ID)),
			visit.HasVisitorWith(user.ID(me.ID)),
			visit.CreatedAtGTE(time.Now().Add(-30*time.Minute)),
		).Exist(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if recent {
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
		return
	}
	if _, err := s.db.Visit.Create().
		SetHost(host).SetVisitor(me).SetModule(clip(body.Module, 16)).
		Save(ctx); err != nil {
		writeErr(w, err)
		return
	}
	_, _ = s.db.User.UpdateOneID(host.ID).AddVisitCount(1).Save(ctx)
	_, _ = s.db.Notification.Create().
		SetTo(host).SetFrom(me).SetKind("visit").
		SetText("访问了你的主页 · " + body.Module).SetTarget("profile").
		Save(ctx)
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) getUser(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	u, err := s.db.User.Query().Where(user.Uin(r.PathValue("uin"))).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	view, err := s.userView(ctx, u, me.ID)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"user": view})
}

func (s *Server) bootstrap(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	view, err := s.userView(ctx, me, me.ID)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"me":     view,
		"unread": unreadCount(ctx, s.db, me.ID),
		"themes": themeList(),
	})
}

// themeList 是可选强调色。首屏和会话探测都会带上，避免客户端连发两次请求。
func themeList() []map[string]string {
	return []map[string]string{
		{"id": "aurora", "name": "松墨", "accent": "#2f5d50"},
		{"id": "ember", "name": "陶土", "accent": "#9a4a33"},
		{"id": "forest", "name": "靛青", "accent": "#3a4a63"},
		{"id": "ink", "name": "墨黑", "accent": "#33302b"},
		{"id": "sakura", "name": "绛粉", "accent": "#9c5468"},
	}
}

// ---------- 统计 ----------

func (s *Server) statsFor(ctx context.Context, u *ent.User, viewerID int) (posts, journals, photos, messages, today int, err error) {
	// 统计口径与列表一致：别人只看得到 public，本人看全部
	visiblePosts := post.Or(post.VisibilityEQ("public"), post.AuthorID(viewerID))

	posts, err = s.db.Post.Query().
		Where(post.HasAuthorWith(user.ID(u.ID)), visiblePosts).Count(ctx)
	if err != nil {
		return
	}
	journals, err = s.db.Post.Query().
		Where(post.HasAuthorWith(user.ID(u.ID)), visiblePosts, post.TitleNEQ("")).Count(ctx)
	if err != nil {
		return
	}
	photos, err = s.db.Photo.Query().
		Where(photo.HasAlbumWith(
			album.HasOwnerWith(user.ID(u.ID)),
			album.Or(album.PrivacyEQ("public"), album.HasOwnerWith(user.ID(viewerID))),
		)).Count(ctx)
	if err != nil {
		return
	}
	messages, err = s.db.Guestbook.Query().
		Where(guestbook.HasOwnerWith(user.ID(u.ID))).Count(ctx)
	if err != nil {
		return
	}
	start := startOfDay(time.Now())
	today, err = s.db.Visit.Query().
		Where(visit.HasHostWith(user.ID(u.ID)), visit.CreatedAtGTE(start)).Count(ctx)
	return
}

var _ = notification.KindEQ
