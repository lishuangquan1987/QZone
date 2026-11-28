package api

import (
	"net/http"
	"strconv"
	"strings"

	"qzone/ent"
	"qzone/ent/guestbook"
	"qzone/ent/user"
)

type guestbookView struct {
	ID      int    `json:"id"`
	Content string `json:"content"`
	Reply   string `json:"reply"`
	At      string `json:"at"`
	Author  brief  `json:"author"`
	CanDel  bool   `json:"canDel"`
	CanEdit bool   `json:"canEdit"`
}

func (s *Server) listGuestbook(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	owner := me
	if uin := strings.TrimSpace(r.URL.Query().Get("uin")); uin != "" && uin != me.Uin {
		u, err := s.db.User.Query().Where(user.Uin(uin)).Only(ctx)
		if err != nil {
			writeErr(w, err)
			return
		}
		owner = u
	}
	// 游标分页：before 传上一页最后一条的时间，继续向后翻；
	// 不传就是第一页。hasMore + nextBefore 告诉前端还有没有下一页。
	before := parseCursor(r.URL.Query().Get("before"))
	gq := s.db.Guestbook.Query().
		Where(guestbook.HasOwnerWith(user.ID(owner.ID))).
		WithAuthor().
		Order(ent.Desc(guestbook.FieldCreatedAt)).
		Limit(101)
	if before != nil {
		gq = gq.Where(guestbook.CreatedAtLT(*before))
	}
	rows, err := gq.All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	hasMore := len(rows) > 100
	if hasMore {
		rows = rows[:100]
	}
	out := make([]guestbookView, 0, len(rows))
	for _, g := range rows {
		out = append(out, guestbookView{
			ID: g.ID, Content: g.Content, Reply: g.Reply, At: timeStr(g.CreatedAt),
			Author:  toBrief(g.Edges.Author),
			CanDel:  g.AuthorID == me.ID || g.OwnerID == me.ID,
			CanEdit: g.OwnerID == me.ID,
		})
	}
	resp := map[string]any{"entries": out, "hasMore": hasMore}
	if hasMore && len(rows) > 0 {
		resp["nextBefore"] = timeStr(rows[len(rows)-1].CreatedAt)
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *Server) createGuestbook(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	var req struct {
		Owner   string `json:"owner"`
		Content string `json:"content"`
	}
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	content := strings.TrimSpace(req.Content)
	if content == "" {
		fail(w, http.StatusBadRequest, "留言不能为空")
		return
	}
	owner, err := s.db.User.Query().Where(user.Uin(strings.TrimSpace(req.Owner))).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	g, err := s.db.Guestbook.Create().
		SetOwner(owner).SetAuthor(me).SetContent(clip(content, 500)).Save(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if owner.ID != me.ID {
		_, _ = s.db.Notification.Create().
			SetTo(owner).SetFrom(me).SetKind("guestbook").
			SetText("在你的留言板留言：" + clip(content, 40)).
			SetTarget("guestbook").Save(ctx)
	}
	writeJSON(w, http.StatusCreated, guestbookView{
		ID: g.ID, Content: g.Content, At: timeStr(g.CreatedAt),
		Author: toBrief(me), CanDel: true, CanEdit: false,
	})
}

func (s *Server) deleteGuestbook(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的留言编号")
		return
	}
	g, err := s.db.Guestbook.Query().Where(guestbook.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if g.AuthorID != me.ID && g.OwnerID != me.ID {
		fail(w, http.StatusForbidden, "无权删除该留言")
		return
	}
	if err := s.db.Guestbook.DeleteOneID(id).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) replyGuestbook(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的留言编号")
		return
	}
	var req struct {
		Reply string `json:"reply"`
	}
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	g, err := s.db.Guestbook.Query().Where(guestbook.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if g.OwnerID != me.ID {
		fail(w, http.StatusForbidden, "只有主人可以回复留言")
		return
	}
	if _, err := s.db.Guestbook.UpdateOneID(id).SetReply(clip(strings.TrimSpace(req.Reply), 500)).Save(ctx); err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}
