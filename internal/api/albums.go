package api

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"qzone/ent"
	"qzone/ent/album"
	"qzone/ent/photo"
	"qzone/ent/photolike"
	"qzone/ent/user"
)

type photoView struct {
	ID        int     `json:"id"`
	URL       string  `json:"url"`
	Caption   string  `json:"caption"`
	Width     int     `json:"width"`
	Height    int     `json:"height"`
	Size      int64   `json:"size"`
	At        string  `json:"at"`
	Likes     []brief `json:"likes"`
	LikeCount int     `json:"likeCount"`
	Liked     bool    `json:"liked"`
	CanDel    bool    `json:"canDel"`
}

type albumView struct {
	ID          int         `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Cover       string      `json:"cover"`
	Privacy     string      `json:"privacy"`
	At          string      `json:"at"`
	Count       int         `json:"count"`
	Owner       brief       `json:"owner"`
	CanEdit     bool        `json:"canEdit"`
	Photos      []photoView `json:"photos,omitempty"`
}

func (s *Server) albumViews(ctx context.Context, rows []*ent.Album, viewerID int, withPhotos bool) ([]albumView, error) {
	out := make([]albumView, 0, len(rows))
	if len(rows) == 0 {
		return out, nil
	}
	ids := make([]int, 0, len(rows))
	for _, a := range rows {
		ids = append(ids, a.ID)
	}

	// 照片数一次聚合：之前是每个相册查一次 count，列表 40 个相册就是 40 次
	counts := make(map[int]int, len(ids))
	var agg []struct {
		AlbumID int `json:"album_id"`
		Count   int `json:"count"`
	}
	if err := s.db.Photo.Query().
		Where(photo.HasAlbumWith(album.IDIn(ids...))).
		GroupBy(photo.FieldAlbumID).
		Aggregate(ent.Count()).
		Scan(ctx, &agg); err != nil {
		return nil, err
	}
	for _, r := range agg {
		counts[r.AlbumID] = r.Count
	}

	// 正常调用方都带 WithOwner；缺的（比如刚 Create 完）一次性补齐
	var missing []int
	for _, a := range rows {
		if a.Edges.Owner == nil {
			missing = append(missing, a.OwnerID)
		}
	}
	owners := make(map[int]*ent.User, len(missing))
	if len(missing) > 0 {
		us, err := s.db.User.Query().Where(user.IDIn(missing...)).All(ctx)
		if err != nil {
			return nil, err
		}
		for _, u := range us {
			owners[u.ID] = u
		}
	}

	for _, a := range rows {
		owner := a.Edges.Owner
		if owner == nil {
			owner = owners[a.OwnerID]
		}
		av := albumView{
			ID: a.ID, Name: a.Name, Description: a.Description, Cover: a.Cover,
			Privacy: a.Privacy, At: timeStr(a.CreatedAt), CanEdit: a.OwnerID == viewerID,
			Count: counts[a.ID], Owner: toBrief(owner),
		}

		if withPhotos {
			photos, err := s.db.Photo.Query().
				Where(photo.HasAlbumWith(album.ID(a.ID))).
				Order(ent.Asc(photo.FieldCreatedAt)).All(ctx)
			if err != nil {
				return nil, err
			}
			pids := make([]int, 0, len(photos))
			for _, p := range photos {
				pids = append(pids, p.ID)
			}
			likes := []*ent.PhotoLike{}
			if len(pids) > 0 {
				likes, err = s.db.PhotoLike.Query().
					Where(photolike.HasPhotoWith(photo.IDIn(pids...))).
					WithUser().WithPhoto().All(ctx)
				if err != nil {
					return nil, err
				}
			}
			likeMap := map[int][]brief{}
			likedSet := map[int]bool{}
			for _, l := range likes {
				if l.Edges.Photo == nil || l.Edges.User == nil {
					continue
				}
				likeMap[l.Edges.Photo.ID] = append(likeMap[l.Edges.Photo.ID], toBrief(l.Edges.User))
				if l.Edges.User.ID == viewerID {
					likedSet[l.Edges.Photo.ID] = true
				}
			}
			av.Photos = make([]photoView, 0, len(photos))
			for _, p := range photos {
				pv := photoView{
					ID: p.ID, URL: p.URL, Caption: p.Caption, Width: p.Width, Height: p.Height,
					Size: p.Size, At: timeStr(p.CreatedAt), Likes: likeMap[p.ID],
					LikeCount: len(likeMap[p.ID]), Liked: likedSet[p.ID], CanDel: a.OwnerID == viewerID,
				}
				if pv.Likes == nil {
					pv.Likes = []brief{}
				}
				av.Photos = append(av.Photos, pv)
			}
		}
		out = append(out, av)
	}
	return out, nil
}

func (s *Server) listAlbums(w http.ResponseWriter, r *http.Request, me *ent.User) {
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
	q := s.db.Album.Query().Where(album.HasOwnerWith(user.ID(owner.ID)))
	if owner.ID != me.ID {
		// 与文章一致：不公开列出的相册只能通过链接访问，不进别人的列表
		q = q.Where(album.PrivacyEQ("public"))
	}
	rows, err := q.WithOwner().Order(ent.Desc(album.FieldCreatedAt)).All(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	views, err := s.albumViews(ctx, rows, me.ID, false)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"albums": views})
}

func (s *Server) createAlbum(w http.ResponseWriter, r *http.Request, me *ent.User) {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Privacy     string `json:"privacy"`
	}
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		fail(w, http.StatusBadRequest, "相册名称不能为空")
		return
	}
	if req.Privacy != "public" && req.Privacy != "unlisted" && req.Privacy != "private" {
		req.Privacy = "public"
	}
	a, err := s.db.Album.Create().
		SetOwner(me).SetName(clip(req.Name, 24)).
		SetDescription(clip(req.Description, 120)).
		SetPrivacy(req.Privacy).Save(r.Context())
	if err != nil {
		writeErr(w, err)
		return
	}
	views, err := s.albumViews(r.Context(), []*ent.Album{a}, me.ID, false)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, views[0])
}

func (s *Server) getAlbum(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的相册编号")
		return
	}
	a, err := s.db.Album.Query().Where(album.ID(id)).WithOwner().Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if !visible(a.Privacy, a.OwnerID, me.ID) {
		fail(w, http.StatusForbidden, "该相册仅主人可见")
		return
	}
	views, err := s.albumViews(ctx, []*ent.Album{a}, me.ID, true)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, views[0])
}

func (s *Server) updateAlbum(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的相册编号")
		return
	}
	a, err := s.db.Album.Query().Where(album.ID(id)).WithOwner().Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if a.OwnerID != me.ID {
		fail(w, http.StatusForbidden, "只能修改自己的相册")
		return
	}
	var req struct {
		Name        *string `json:"name"`
		Description *string `json:"description"`
		Privacy     *string `json:"privacy"`
	}
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	upd := s.db.Album.UpdateOneID(id)
	if req.Name != nil {
		name := strings.TrimSpace(*req.Name)
		if name == "" {
			fail(w, http.StatusBadRequest, "相册名称不能为空")
			return
		}
		upd.SetName(clip(name, 24))
	}
	if req.Description != nil {
		upd.SetDescription(clip(strings.TrimSpace(*req.Description), 120))
	}
	if req.Privacy != nil {
		p := *req.Privacy
		if p != "public" && p != "unlisted" && p != "private" {
			fail(w, http.StatusBadRequest, "可见范围只能是 public / unlisted / private")
			return
		}
		upd.SetPrivacy(p)
	}
	a, err = upd.Save(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	views, err := s.albumViews(ctx, []*ent.Album{a}, me.ID, false)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, views[0])
}

func (s *Server) deleteAlbum(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的相册编号")
		return
	}
	a, err := s.db.Album.Query().Where(album.ID(id)).WithOwner().Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if a.OwnerID != me.ID {
		fail(w, http.StatusForbidden, "只能删除自己的相册")
		return
	}
	// 先删照片及其点赞，再删相册
	photoIDs, err := s.db.Photo.Query().Where(photo.HasAlbumWith(album.ID(id))).IDs(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if len(photoIDs) > 0 {
		if _, err := s.db.PhotoLike.Delete().Where(photolike.HasPhotoWith(photo.IDIn(photoIDs...))).Exec(ctx); err != nil {
			writeErr(w, err)
			return
		}
		if _, err := s.db.Photo.Delete().Where(photo.IDIn(photoIDs...)).Exec(ctx); err != nil {
			writeErr(w, err)
			return
		}
	}
	if err := s.db.Album.DeleteOneID(id).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) addPhotos(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的相册编号")
		return
	}
	var req struct {
		URLs    []string `json:"urls"`
		Caption string   `json:"caption"`
		Widths  []int    `json:"widths"`
		Heights []int    `json:"heights"`
		Sizes   []int64  `json:"sizes"`
	}
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	if len(req.URLs) == 0 {
		fail(w, http.StatusBadRequest, "请先选择图片")
		return
	}
	if len(req.URLs) > 30 {
		fail(w, http.StatusBadRequest, "一次最多添加 30 张")
		return
	}
	a, err := s.db.Album.Query().Where(album.ID(id)).WithOwner().Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if a.OwnerID != me.ID {
		fail(w, http.StatusForbidden, "只能往自己的相册里添加照片")
		return
	}
	for i, u := range req.URLs {
		clean, ok := safeAssetURL(u, false)
		if !ok {
			fail(w, http.StatusBadRequest, "照片地址不合法")
			return
		}
		u = clean
		b := s.db.Photo.Create().SetAlbum(a).SetURL(u).SetCaption(clip(req.Caption, 60))
		if i < len(req.Widths) {
			b.SetWidth(req.Widths[i])
		}
		if i < len(req.Heights) {
			b.SetHeight(req.Heights[i])
		}
		if i < len(req.Sizes) {
			b.SetSize(req.Sizes[i])
		}
		if _, err := b.Save(ctx); err != nil {
			writeErr(w, err)
			return
		}
	}
	if a.Cover == "" {
		_, _ = s.db.Album.UpdateOneID(a.ID).SetCover(req.URLs[0]).Save(ctx)
	}
	views, err := s.albumViews(ctx, []*ent.Album{a}, me.ID, true)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, views[0])
}

func (s *Server) deletePhoto(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	aid, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的相册编号")
		return
	}
	pid, err := strconv.Atoi(r.PathValue("pid"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的照片编号")
		return
	}
	a, err := s.db.Album.Query().Where(album.ID(aid)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if a.OwnerID != me.ID {
		fail(w, http.StatusForbidden, "只能删除自己相册里的照片")
		return
	}
	if _, err := s.db.PhotoLike.Delete().Where(photolike.HasPhotoWith(photo.ID(pid))).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	if err := s.db.Photo.DeleteOneID(pid).Exec(ctx); err != nil {
		writeErr(w, err)
		return
	}
	// 封面跟着照片走：删掉的正好是封面就换一张，相册空了就清空，
	// 否则列表里会留下一个指向已删文件的破图。
	first, ferr := s.db.Photo.Query().
		Where(photo.HasAlbumWith(album.ID(aid))).
		Order(ent.Asc(photo.FieldCreatedAt)).First(ctx)
	upd := s.db.Album.UpdateOneID(aid)
	if ferr == nil {
		if a.Cover != first.URL {
			_, _ = upd.SetCover(first.URL).Save(ctx)
		}
	} else if a.Cover != "" {
		_, _ = upd.SetCover("").Save(ctx)
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) likePhoto(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的照片编号")
		return
	}
	p, err := s.db.Photo.Query().WithAlbum().Where(photo.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if p.Edges.Album != nil && !visible(p.Edges.Album.Privacy, p.Edges.Album.OwnerID, me.ID) {
		fail(w, http.StatusForbidden, "无权操作")
		return
	}
	existing, err := s.db.PhotoLike.Query().
		Where(photolike.HasPhotoWith(photo.ID(id)), photolike.HasUserWith(user.ID(me.ID))).
		Only(ctx)
	liked := false
	if err == nil {
		_ = s.db.PhotoLike.DeleteOneID(existing.ID).Exec(ctx)
	} else if ent.IsNotFound(err) {
		if _, err := s.db.PhotoLike.Create().SetPhoto(p).SetUser(me).Save(ctx); err != nil {
			writeErr(w, err)
			return
		}
		liked = true
		if p.Edges.Album != nil && p.Edges.Album.OwnerID != me.ID {
			owner, err := s.db.User.Query().Where(user.ID(p.Edges.Album.OwnerID)).Only(ctx)
			if err == nil {
				_, _ = s.db.Notification.Create().
					SetTo(owner).SetFrom(me).SetKind("like").
					SetText("赞了你的照片").SetTarget("album:" + strconv.Itoa(p.Edges.Album.ID)).Save(ctx)
			}
		}
	}
	count, _ := s.db.PhotoLike.Query().Where(photolike.HasPhotoWith(photo.ID(id))).Count(ctx)
	writeJSON(w, http.StatusOK, map[string]any{"liked": liked, "count": count})
}

var _ = time.Now
