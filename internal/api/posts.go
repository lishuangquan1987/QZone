package api

import (
	"context"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	entsql "entgo.io/ent/dialect/sql"
	predicate "qzone/ent/predicate"

	"qzone/ent"
	"qzone/ent/comment"
	"qzone/ent/post"
	"qzone/ent/postlike"
	"qzone/ent/user"
)

const defaultCover = ""

// searchPredicate 搜索谓词：≥3 个字符走 FTS5 trigram 索引，更短的词
// trigram 覆盖不到，回退 LIKE。MATCH 的词按短语语义匹配子串，
// 内部双引号按 FTS5 规则转义成两个双引号，防注入由参数化 + 转义兜底。
func searchPredicate(kw string) predicate.Post {
	if utf8.RuneCountInString(kw) >= 3 {
		phrase := strings.ReplaceAll(kw, `"`, `""`)
		return func(s *entsql.Selector) {
			s.Where(entsql.ExprP(
				`id IN (SELECT rowid FROM posts_fts WHERE posts_fts MATCH ?)`,
				`"`+phrase+`"`))
		}
	}
	return post.Or(
		post.TitleContainsFold(kw),
		post.ContentContainsFold(kw),
	)
}

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
		// 「不公开列出」= 只有拿到链接的人能看，不应出现在别人的列表里
		query = query.Where(post.VisibilityEQ("public"))
	}
	if kw := strings.TrimSpace(q.Get("q")); kw != "" {
		query = query.Where(searchPredicate(kw))
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
	if err := normalizePost(&req); err != nil {
		fail(w, http.StatusBadRequest, err.Error())
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
	p.Edges.Author = me
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
	// 浏览量：作者自己看不计，同 IP 30 分钟内只算一次，攒在内存里定时落库
	if p.Edges.Author.ID != me.ID {
		s.views.hit(p.ID, s.clientIP(r))
	}
	// 未落库的增量对所有人都可见，否则作者自己要等 20 秒才看到数字变化
	p.Views += s.views.pendingFor(p.ID)
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
	// 和新建走同一套校验，否则 PATCH 能绕过字数与配图上限
	if err := normalizePost(&req); err != nil {
		fail(w, http.StatusBadRequest, err.Error())
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
	// 手动级联：评论与点赞先删，避免外键约束阻塞
	if _, err := s.db.Comment.Delete().Where(comment.HasPostWith(post.ID(id))).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	if _, err := s.db.PostLike.Delete().Where(postlike.HasPostWith(post.ID(id))).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	if err := s.db.Post.DeleteOneID(id).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	// 文章没了：封面与配图若无其它引用（照片表、其它文章、资料），磁盘一并回收
	urls := make([]string, 0, len(p.Images)+1)
	if p.Cover != "" {
		urls = append(urls, p.Cover)
	}
	urls = append(urls, p.Images...)
	go s.maybeRemoveMedia(context.Background(), me.ID, urls)
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

const (
	// 详情页最多回传的点赞头像与评论条数：再多前端也不展示，只会把响应撑大
	likeDetailLimit  = 24
	commentDetailMax = 200
)

// postViews 把文章行组装成视图。
//
// 列表页（withContent=false）只回传计数，不拉评论正文与点赞明细：
// 之前 8 篇文章会把全部评论内容查出来，只为数一下条数。
func (s *Server) postViews(ctx context.Context, rows []*ent.Post, viewerID int, withContent bool) ([]postView, error) {
	if len(rows) == 0 {
		return []postView{}, nil
	}
	ids := make([]int, 0, len(rows))
	for _, p := range rows {
		ids = append(ids, p.ID)
	}

	// 点赞总数：一次 GROUP BY 拿全
	var likeAgg []struct {
		PostID int `json:"post_id"`
		Count  int `json:"count"`
	}
	if err := s.db.PostLike.Query().
		Where(postlike.HasPostWith(post.IDIn(ids...))).
		GroupBy(postlike.FieldPostID).
		Aggregate(ent.Count()).
		Scan(ctx, &likeAgg); err != nil {
		return nil, err
	}
	likeCount := make(map[int]int, len(likeAgg))
	for _, r := range likeAgg {
		likeCount[r.PostID] = r.Count
	}

	// 当前用户赞过哪些：只取一列
	var mine []struct {
		PostID int `json:"post_id"`
	}
	if err := s.db.PostLike.Query().
		Where(postlike.HasPostWith(post.IDIn(ids...)), postlike.HasUserWith(user.ID(viewerID))).
		Select(postlike.FieldPostID).
		Scan(ctx, &mine); err != nil {
		return nil, err
	}
	likedSet := make(map[int]bool, len(mine))
	for _, m := range mine {
		likedSet[m.PostID] = true
	}

	likeMap := map[int][]brief{}
	cmtMap := map[int][]commentView{}
	cmtCount := map[int]int{}

	// 评论总数：两种情况都要，用聚合比 len(明细) 更准（明细有条数上限）
	var cmtAgg []struct {
		PostID int `json:"post_id"`
		Count  int `json:"count"`
	}
	if err := s.db.Comment.Query().
		Where(comment.HasPostWith(post.IDIn(ids...))).
		GroupBy(comment.FieldPostID).
		Aggregate(ent.Count()).
		Scan(ctx, &cmtAgg); err != nil {
		return nil, err
	}
	for _, r := range cmtAgg {
		cmtCount[r.PostID] = r.Count
	}

	if withContent {
		likes, err := s.db.PostLike.Query().
			Where(postlike.HasPostWith(post.IDIn(ids...))).
			WithUser().WithPost().
			Order(ent.Asc(postlike.FieldCreatedAt)).
			Limit(likeDetailLimit).
			All(ctx)
		if err != nil {
			return nil, err
		}
		for _, l := range likes {
			if l.Edges.Post == nil || l.Edges.User == nil {
				continue
			}
			likeMap[l.Edges.Post.ID] = append(likeMap[l.Edges.Post.ID], toBrief(l.Edges.User))
		}

		cms, err := s.db.Comment.Query().
			Where(comment.HasPostWith(post.IDIn(ids...))).
			WithAuthor().WithPost().
			Order(ent.Asc(comment.FieldCreatedAt)).
			Limit(commentDetailMax).
			All(ctx)
		if err != nil {
			return nil, err
		}
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
	}

	// 作者缺失时批量补齐，避免逐篇查一次
	var missing []int
	for _, p := range rows {
		if p.Edges.Author == nil {
			missing = append(missing, p.AuthorID)
		}
	}
	authors := make(map[int]*ent.User, len(missing))
	if len(missing) > 0 {
		us, err := s.db.User.Query().Where(user.IDIn(missing...)).All(ctx)
		if err != nil {
			return nil, err
		}
		for _, u := range us {
			authors[u.ID] = u
		}
	}

	out := make([]postView, 0, len(rows))
	for _, p := range rows {
		author := p.Edges.Author
		if author == nil {
			author = authors[p.AuthorID]
		}

		comments := cmtMap[p.ID]
		if comments == nil {
			comments = []commentView{}
		}
		// 评论删除权限：评论作者或文章作者
		if author != nil && author.ID == viewerID {
			for i := range comments {
				comments[i].CanDel = true
			}
		}

		likes := likeMap[p.ID]
		if likes == nil {
			likes = []brief{}
		}

		pv := postView{
			ID: p.ID, Title: p.Title, Summary: p.Summary, Cover: p.Cover,
			Category: p.Category, Images: p.Images, Visibility: p.Visibility,
			Pinned: p.Pinned, Views: p.Views, At: timeStr(p.CreatedAt),
			UpdatedAt: timeStr(p.UpdatedAt), Author: toBrief(author),
			Likes: likes, Liked: likedSet[p.ID],
			LikeCount:   likeCount[p.ID],
			CommentNum:  cmtCount[p.ID],
			CanEdit:     author != nil && author.ID == viewerID,
			ReadingTime: readingTime(p.Content),
		}
		if pv.Images == nil {
			pv.Images = []string{}
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
