package api

import (
	"context"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"qzone/ent"
	"qzone/ent/comment"
	"qzone/ent/post"
	"qzone/ent/postlike"
	"qzone/ent/user"
)

const defaultCover = ""

type postReq struct {
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Summary    string   `json:"summary"`
	Cover      string   `json:"cover"`
	Category   string   `json:"category"`
	Images     []string `json:"images"`
	Visibility string   `json:"visibility"`
	Pinned     bool     `json:"pinned"`
}

// listPosts 列出某个空间的文章；私密内容只对作者本人可见。
func (s *Server) listPosts(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	q := r.URL.Query()

	owner := me
	if uin := strings.TrimSpace(q.Get("uin")); uin != "" && uin != me.Uin {
		u, err := s.db.User.Query().Where(user.Uin(uin)).Only(ctx)
		if err != nil {
			writeErr(w, err)
			return
		}
		owner = u
	}
	limit, _ := strconv.Atoi(q.Get("limit"))
	if limit <= 0 || limit > 50 {
		limit = 8
	}

	query := s.db.Post.Query().WithAuthor().Where(post.HasAuthorWith(user.ID(owner.ID)))
	if owner.ID != me.ID {
		query = query.Where(post.VisibilityNEQ("private"))
	}
	if kw := strings.TrimSpace(q.Get("q")); kw != "" {
		query = query.Where(post.Or(
			post.TitleContainsFold(kw),
			post.ContentContainsFold(kw),
		))
	}
	if cat := strings.TrimSpace(q.Get("category")); cat != "" && cat != "全部" {
		query = query.Where(post.CategoryEQ(cat))
	}
	if before := q.Get("before"); before != "" {
		if t, err := time.Parse(time.RFC3339, before); err == nil {
			query = query.Where(post.CreatedAtLT(t))
		}
	}
	switch q.Get("sort") {
	case "popular":
		query = query.Order(ent.Desc(post.FieldViews), ent.Desc(post.FieldCreatedAt))
	default:
		query = query.Order(ent.Desc(post.FieldPinned), ent.Desc(post.FieldCreatedAt))
	}

	total, err := query.Clone().Count(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	rows, err := query.Limit(limit + 1).All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	hasMore := len(rows) > limit
	if hasMore {
		rows = rows[:limit]
	}

	views, err := s.postViews(ctx, rows, me.ID, false)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"posts": views, "hasMore": hasMore, "total": total})
}

func (s *Server) createPost(w http.ResponseWriter, r *http.Request, me *ent.User) {
	var req postReq
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	req.Content = strings.TrimSpace(req.Content)
	req.Title = strings.TrimSpace(req.Title)
	if req.Content == "" && len(req.Images) == 0 {
		fail(w, http.StatusBadRequest, "写点什么再发布吧")
		return
	}
	if len([]rune(req.Content)) > 60000 {
		fail(w, http.StatusBadRequest, "正文过长（上限 6 万字）")
		return
	}
	if len(req.Images) > 9 {
		fail(w, http.StatusBadRequest, "最多 9 张图片")
		return
	}
	vis := req.Visibility
	switch vis {
	case "public", "unlisted", "private":
	default:
		vis = "public"
	}

	summary := strings.TrimSpace(req.Summary)
	if summary == "" {
		summary = deriveSummary(req.Content)
	}

	p, err := s.db.Post.Create().
		SetAuthor(me).
		SetTitle(clip(req.Title, 80)).
		SetContent(req.Content).
		SetSummary(clip(summary, 200)).
		SetCover(req.Cover).
		SetCategory(defaultIfEmpty(req.Category, "随笔")).
		SetImages(req.Images).
		SetVisibility(vis).
		SetPinned(req.Pinned).
		Save(r.Context())
	if err != nil {
		writeErr(w, err)
		return
	}
	views, err := s.postViews(r.Context(), []*ent.Post{p}, me.ID, true)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, views[0])
}

func (s *Server) getPost(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的文章编号")
		return
	}
	p, err := s.db.Post.Query().WithAuthor().Where(post.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if !visible(p.Visibility, p.Edges.Author.ID, me.ID) {
		fail(w, http.StatusForbidden, "这篇内容仅作者本人可见")
		return
	}
	// 浏览量 +1（作者自己看不计）
	if p.Edges.Author.ID != me.ID {
		_, _ = s.db.Post.UpdateOneID(p.ID).AddViews(1).Save(ctx)
		p.Views++
	}
	views, err := s.postViews(ctx, []*ent.Post{p}, me.ID, true)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, views[0])
}

func (s *Server) updatePost(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的文章编号")
		return
	}
	p, err := s.db.Post.Query().Where(post.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if p.AuthorID != me.ID {
		fail(w, http.StatusForbidden, "只能修改自己的文章")
		return
	}

	var req postReq
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	upd := s.db.Post.UpdateOneID(id)
	upd.SetTitle(clip(strings.TrimSpace(req.Title), 80)).
		SetContent(strings.TrimSpace(req.Content)).
		SetCover(req.Cover).
		SetCategory(defaultIfEmpty(req.Category, "随笔")).
		SetImages(req.Images).
		SetPinned(req.Pinned)
	if req.Visibility == "public" || req.Visibility == "unlisted" || req.Visibility == "private" {
		upd.SetVisibility(req.Visibility)
	}
	summary := strings.TrimSpace(req.Summary)
	if summary == "" {
		summary = deriveSummary(req.Content)
	}
	upd.SetSummary(clip(summary, 200))

	updated, err := upd.Save(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	updated.Edges.Author = me
	views, err := s.postViews(ctx, []*ent.Post{updated}, me.ID, true)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, views[0])
}

func (s *Server) deletePost(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的文章编号")
		return
	}
	p, err := s.db.Post.Query().Where(post.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if p.AuthorID != me.ID {
		fail(w, http.StatusForbidden, "只能删除自己的文章")
		return
	}
	if err := s.db.Post.DeleteOneID(id).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) likePost(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的文章编号")
		return
	}
	p, err := s.db.Post.Query().WithAuthor().Where(post.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if !visible(p.Visibility, p.Edges.Author.ID, me.ID) {
		fail(w, http.StatusForbidden, "无权操作")
		return
	}

	existing, err := s.db.PostLike.Query().
		Where(postlike.HasPostWith(post.ID(id)), postlike.HasUserWith(user.ID(me.ID))).
		Only(ctx)
	liked := false
	if err == nil {
		if err := s.db.PostLike.DeleteOneID(existing.ID).Exec(ctx); err != nil {
			writeErr(w, err)
			return
		}
	} else if ent.IsNotFound(err) {
		if _, err := s.db.PostLike.Create().SetPost(p).SetUser(me).Save(ctx); err != nil {
			writeErr(w, err)
			return
		}
		liked = true
		if p.Edges.Author.ID != me.ID {
			_, _ = s.db.Notification.Create().
				SetTo(p.Edges.Author).SetFrom(me).SetKind("like").
				SetText("赞了你的文章《" + displayTitle(p) + "》").
				SetTarget("post:" + strconv.Itoa(p.ID)).Save(ctx)
		}
	} else {
		writeErr(w, err)
		return
	}

	count, _ := s.db.PostLike.Query().Where(postlike.HasPostWith(post.ID(id))).Count(ctx)
	writeJSON(w, http.StatusOK, map[string]any{"liked": liked, "count": count})
}

func (s *Server) commentPost(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的文章编号")
		return
	}
	var req struct {
		Content string `json:"content"`
		ReplyTo string `json:"replyTo"`
	}
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	content := strings.TrimSpace(req.Content)
	if content == "" {
		fail(w, http.StatusBadRequest, "评论不能为空")
		return
	}
	p, err := s.db.Post.Query().WithAuthor().Where(post.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if !visible(p.Visibility, p.Edges.Author.ID, me.ID) {
		fail(w, http.StatusForbidden, "无权评论")
		return
	}
	c, err := s.db.Comment.Create().
		SetPost(p).SetAuthor(me).
		SetContent(clip(content, 1000)).
		SetReplyTo(clip(req.ReplyTo, 20)).
		Save(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if p.Edges.Author.ID != me.ID {
		_, _ = s.db.Notification.Create().
			SetTo(p.Edges.Author).SetFrom(me).SetKind("comment").
			SetText("评论了你的文章《" + displayTitle(p) + "》：" + clip(content, 40)).
			SetTarget("post:" + strconv.Itoa(p.ID)).Save(ctx)
	}
	writeJSON(w, http.StatusCreated, commentView{
		ID: c.ID, Content: c.Content, At: timeStr(c.CreatedAt),
		Author: toBrief(me), ReplyTo: c.ReplyTo, CanDel: true,
	})
}

func (s *Server) deleteComment(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的文章编号")
		return
	}
	cid, err := strconv.Atoi(r.PathValue("cid"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的评论编号")
		return
	}
	p, err := s.db.Post.Query().Where(post.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	c, err := s.db.Comment.Query().Where(comment.ID(cid), comment.HasPostWith(post.ID(id))).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if c.AuthorID != me.ID && p.AuthorID != me.ID {
		fail(w, http.StatusForbidden, "只能删除自己的评论")
		return
	}
	if err := s.db.Comment.DeleteOneID(cid).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

// ---------- 视图组装 ----------

func (s *Server) postViews(ctx context.Context, rows []*ent.Post, viewerID int, withContent bool) ([]postView, error) {
	if len(rows) == 0 {
		return []postView{}, nil
	}
	ids := make([]int, 0, len(rows))
	for _, p := range rows {
		ids = append(ids, p.ID)
	}

	likes, err := s.db.PostLike.Query().
		Where(postlike.HasPostWith(post.IDIn(ids...))).
		WithUser().WithPost().
		Order(ent.Asc(postlike.FieldCreatedAt)).
		All(ctx)
	if err != nil {
		return nil, err
	}
	likeMap := map[int][]brief{}
	likedSet := map[int]bool{}
	for _, l := range likes {
		if l.Edges.Post == nil || l.Edges.User == nil {
			continue
		}
		pid := l.Edges.Post.ID
		likeMap[pid] = append(likeMap[pid], toBrief(l.Edges.User))
		if l.Edges.User.ID == viewerID {
			likedSet[pid] = true
		}
	}

	cms, err := s.db.Comment.Query().
		Where(comment.HasPostWith(post.IDIn(ids...))).
		WithAuthor().
		Order(ent.Asc(comment.FieldCreatedAt)).
		All(ctx)
	if err != nil {
		return nil, err
	}
	cmtMap := map[int][]commentView{}
	for _, c := range cms {
		if c.Edges.Post == nil {
			continue
		}
		pid := c.Edges.Post.ID
		cmtMap[pid] = append(cmtMap[pid], commentView{
			ID: c.ID, Content: c.Content, At: timeStr(c.CreatedAt),
			Author: toBrief(c.Edges.Author), ReplyTo: c.ReplyTo,
			CanDel: c.AuthorID == viewerID,
		})
	}

	out := make([]postView, 0, len(rows))
	for _, p := range rows {
		author := p.Edges.Author
		if author == nil {
			if u, err := s.db.User.Query().Where(user.ID(p.AuthorID)).Only(ctx); err == nil {
				author = u
			}
		}
		// 评论删除权限：评论作者或文章作者
		comments := cmtMap[p.ID]
		if comments == nil {
			comments = []commentView{}
		}
		for i := range comments {
			if comments[i].CanDel || (author != nil && author.ID == viewerID) {
				comments[i].CanDel = true
			}
		}

		pv := postView{
			ID: p.ID, Title: p.Title, Summary: p.Summary, Cover: p.Cover,
			Category: p.Category, Images: p.Images, Visibility: p.Visibility,
			Pinned: p.Pinned, Views: p.Views, At: timeStr(p.CreatedAt),
			UpdatedAt: timeStr(p.UpdatedAt), Author: toBrief(author),
			Likes: likeMap[p.ID], Liked: likedSet[p.ID],
			LikeCount: len(likeMap[p.ID]),
			CommentNum: len(comments),
			CanEdit:    author != nil && author.ID == viewerID,
			ReadingTime: readingTime(p.Content),
		}
		if pv.Images == nil {
			pv.Images = []string{}
		}
		if pv.Likes == nil {
			pv.Likes = []brief{}
		}
		if withContent {
			pv.Content = p.Content
			pv.Comments = comments
		} else {
			pv.Comments = []commentView{}
		}
		out = append(out, pv)
	}
	return out, nil
}

// ---------- 工具 ----------

func displayTitle(p *ent.Post) string {
	if strings.TrimSpace(p.Title) != "" {
		return p.Title
	}
	s := deriveSummary(p.Content)
	if len([]rune(s)) > 16 {
		s = string([]rune(s)[:16]) + "…"
	}
	return s
}

func readingTime(content string) int {
	n := len([]rune(content))
	if n == 0 {
		return 1
	}
	m := n / 400
	if m < 1 {
		return 1
	}
	return m
}

var mdReplacer = strings.NewReplacer(
	"#", " ", "*", " ", "`", " ", ">", " ", "_", " ", "~", " ", "|", " ",
	"-", " ", "[", " ", "]", " ", "(", " ", ")", " ",
)

// deriveSummary 从 Markdown 正文提取纯文本摘要。
func deriveSummary(content string) string {
	txt := content
	// 去掉图片与链接的语法结构，保留可读文字
	for {
		i := strings.Index(txt, "![")
		if i < 0 {
			break
		}
		j := strings.Index(txt[i:], ")")
		if j < 0 {
			break
		}
		txt = txt[:i] + txt[i+j+1:]
	}
	lines := strings.Split(txt, "\n")
	parts := make([]string, 0, len(lines))
	for _, l := range lines {
		l = strings.TrimSpace(l)
		if l == "" || strings.HasPrefix(l, "```") {
			continue
		}
		parts = append(parts, mdReplacer.Replace(l))
	}
	s := strings.Join(parts, " ")
	s = strings.Join(strings.Fields(s), " ")
	r := []rune(s)
	if len(r) > 120 {
		return string(r[:120]) + "…"
	}
	return s
}

func defaultIfEmpty(v, def string) string {
	v = strings.TrimSpace(v)
	if v == "" {
		return def
	}
	return clip(v, 16)
}

func clip(s string, n int) string {
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	return string(r[:n])
}

func clipText(s string, n int) string { return clip(s, n) }

var _ = sort.Strings
