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
	for _, a := range rows {
		av := albumView{
			ID: a.ID, Name: a.Name, Description: a.Description, Cover: a.Cover,
			Privacy: a.Privacy, At: timeStr(a.CreatedAt), CanEdit: a.OwnerID == viewerID,
		}
		if u, err := s.db.User.Query().Where(user.ID(a.OwnerID)).Only(ctx); err == nil {
			av.Owner = toBrief(u)
		}
		cnt, err := s.db.Photo.Query().Where(photo.HasAlbumWith(album.ID(a.ID))).Count(ctx)
		if err != nil {
			return nil, err
		}
		av.Count = cnt

		if withPhotos {
			photos, err := s.db.Photo.Query().
				Where(photo.HasAlbumWith(album.ID(a.ID))).
				Order(ent.Asc(photo.FieldCreatedAt)).All(ctx)
			if err != nil {
				return nil, err
			}
			ids := make([]int, 0, len(photos))
			for _, p := range photos {
				ids = append(ids, p.ID)
			}
			likes := []*ent.PhotoLike{}
			if len(ids) > 0 {
				likes, err = s.db.PhotoLike.Query().
					Where(photolike.HasPhotoWith(photo.IDIn(ids...))).
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
	rows, err := q.Order(ent.Desc(album.FieldCreatedAt)).All(ctx)
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
	a, err := s.db.Album.Query().Where(album.ID(id)).Only(ctx)
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

func (s *Server) deleteAlbum(w http.ResponseWriter, r *http.Request, me *ent.User) {
	ctx := r.Context()
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "无效的相册编号")
		return
	}
	a, err := s.db.Album.Query().Where(album.ID(id)).Only(ctx)
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
	a, err := s.db.Album.Query().Where(album.ID(id)).Only(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if a.OwnerID != me.ID {
		fail(w, http.StatusForbidden, "只能往自己的相册里添加照片")
		return
	}
	for i, u := range req.URLs {
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
	if a.Cover == "" {
		if first, err := s.db.Photo.Query().
			Where(photo.HasAlbumWith(album.ID(aid))).
			Order(ent.Asc(photo.FieldCreatedAt)).First(ctx); err == nil {
			_, _ = s.db.Album.UpdateOneID(aid).SetCover(first.URL).Save(ctx)
		}
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
