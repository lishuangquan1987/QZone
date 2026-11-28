package api

import (
	"context"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"qzone/ent/photo"
	"qzone/ent/post"
	"qzone/ent/user"
)

// ---------- 媒体文件回收 ----------
//
// 照片 / 相册 / 文章的数据库记录删掉之后，uploads/ 里的原图和 .thumb/ 缓存
// 不会自己消失。回收规则很简单：
//
//   1. 先删数据库记录（调用方已做）；
//   2. 再检查这个 URL 是否还被引用——其它照片记录、文章的封面 / 配图、
//      用户资料的头像 / 封面 / BGM；
//   3. 一个引用都没有了，才把磁盘文件与缩略图删掉。只要文章还在引用，
//      文件就保留，配图不会变成破图；
//   4. /media/seed/ 是出厂示例素材，永远不动。
//
// 检查放在删除响应之后异步执行，接口延迟不受影响；检查全是幂等查询，
// 并发删除同一 URL 最多造成重复检查，不会误删仍被引用的文件。

// maybeRemoveMedia 对每个 url 做引用检查，无引用则删除磁盘文件与缩略图。
func (s *Server) maybeRemoveMedia(ctx context.Context, ownerID int, urls []string) {
	for _, url := range urls {
		if s.stillReferenced(ctx, ownerID, url) {
			continue
		}
		rel := strings.TrimPrefix(url, "/media/")
		if rel == url || strings.HasPrefix(rel, "seed/") || strings.Contains(rel, "..") || strings.HasPrefix(rel, "/") {
			continue
		}
		full := filepath.Join(s.uploads, filepath.FromSlash(rel))
		st, err := os.Stat(full)
		if err != nil || st.IsDir() {
			continue
		}
		_ = os.Remove(full)
		// 缩略图按宽度分目录缓存，一并清理
		for width := range thumbWidths {
			thumbRel := filepath.Join(".thumb", strconv.Itoa(width), strings.TrimSuffix(rel, filepath.Ext(rel))+".jpg")
			_ = os.Remove(filepath.Join(s.uploads, thumbRel))
		}
	}
}

// stillReferenced 检查 url 是否还被数据库引用（其它照片、文章、资料）。
// 查询出错时返回 true——宁可多留文件，不冒破图的风险。
func (s *Server) stillReferenced(ctx context.Context, ownerID int, url string) bool {
	if n, err := s.db.Photo.Query().Where(photo.URLEQ(url)).Count(ctx); err != nil || n > 0 {
		return err != nil || n > 0
	}
	posts, err := s.db.Post.Query().
		Where(post.AuthorID(ownerID)).
		Select(post.FieldCover, post.FieldImages).
		All(ctx)
	if err != nil {
		return true
	}
	for _, p := range posts {
		if p.Cover == url || containsString(p.Images, url) {
			return true
		}
	}
	u, err := s.db.User.Query().
		Where(user.ID(ownerID)).
		Select(user.FieldAvatar, user.FieldCover, user.FieldBgmURL).
		First(ctx)
	if err != nil {
		return true
	}
	return u.Avatar == url || u.Cover == url || u.BgmURL == url
}

func containsString(list []string, v string) bool {
	for _, s := range list {
		if s == v {
			return true
		}
	}
	return false
}
