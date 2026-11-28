package api

import (
	"net/http"
	"strings"

	"qzone/ent"
	"qzone/ent/album"
	"qzone/ent/notification"
	"qzone/ent/post"
	"qzone/ent/user"
)

type notificationView struct {
	ID     int    `json:"id"`
	Kind   string `json:"kind"`
	Text   string `json:"text"`
	Target string `json:"target"`
	Read   bool   `json:"read"`
	At     string `json:"at"`
	From   brief  `json:"from"`
}

func (s *Server) listNotifications(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	// 游标分页：不传 before 是第一页，之后由 nextBefore 继续；unread 只在第一页统计
	before := parseCursor(r.URL.Query().Get("before"))
	nq := s.db.Notification.Query().
		Where(notification.HasToWith(user.ID(me.ID))).
		WithFrom().
		Order(ent.Desc(notification.FieldCreatedAt)).
		Limit(81)
	if before != nil {
		nq = nq.Where(notification.CreatedAtLT(*before))
	}
	rows, err := nq.All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	hasMore := len(rows) > 80
	if hasMore {
		rows = rows[:80]
	}
	out := make([]notificationView, 0, len(rows))
	unread := 0
	for _, n := range rows {
		if !n.Read && before == nil {
			unread++
		}
		out = append(out, notificationView{
			ID: n.ID, Kind: n.Kind, Text: n.Text, Target: n.Target,
			Read: n.Read, At: timeStr(n.CreatedAt), From: toBrief(n.Edges.From),
		})
	}
	resp := map[string]any{"notifications": out, "unread": unread, "hasMore": hasMore}
	if hasMore && len(rows) > 0 {
		resp["nextBefore"] = timeStr(rows[len(rows)-1].CreatedAt)
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *Server) readNotifications(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	var req struct {
		IDs []int `json:"ids"`
	}
	_ = decode(r, &req)
	q := s.db.Notification.Update().Where(notification.HasToWith(user.ID(me.ID)))
	if len(req.IDs) > 0 {
		q = q.Where(notification.IDIn(req.IDs...))
	}
	if _, err := q.SetRead(true).Save(ctx); err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"unread": unreadCount(ctx, s.db, me.ID)})
}

type searchResp struct {
	Posts   []postView  `json:"posts"`
	Users   []userView  `json:"users"`
	Albums  []albumView `json:"albums"`
	Keyword string      `json:"keyword"`
}

func (s *Server) search(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	kw := strings.TrimSpace(r.URL.Query().Get("q"))
	resp := searchResp{Keyword: kw, Posts: []postView{}, Users: []userView{}, Albums: []albumView{}}
	if kw == "" {
		writeJSON(w, http.StatusOK, resp)
		return
	}

	posts, err := s.db.Post.Query().
		WithAuthor().
		Where(
			post.VisibilityEQ("public"),
			post.Or(post.TitleContainsFold(kw), post.ContentContainsFold(kw), post.CategoryContainsFold(kw)),
		).
		Order(ent.Desc(post.FieldCreatedAt)).Limit(12).All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if resp.Posts, err = s.postViews(ctx, posts, me.ID, false); err != nil {
		writeErr(w, err)
		return
	}

	users, err := s.db.User.Query().
		Where(user.Or(user.NicknameContainsFold(kw), user.UinContainsFold(kw))).
		Limit(8).All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	for _, u := range users {
		v, err := s.userView(ctx, u, me.ID)
		if err != nil {
			continue
		}
		resp.Users = append(resp.Users, v)
	}

	albums, err := s.db.Album.Query().
		WithOwner().
		Where(album.PrivacyEQ("public"), album.Or(album.NameContainsFold(kw), album.DescriptionContainsFold(kw))).
		Limit(8).All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if resp.Albums, err = s.albumViews(ctx, albums, me.ID, false); err != nil {
		writeErr(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}
