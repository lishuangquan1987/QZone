package api

import (
	"net/http"

	"qzone/ent"
	"qzone/internal/media"
)

// musicLibrary 返回内置免费音乐库。
//
// 说明：QQ 音乐等平台的播放接口需要签名与版权授权，服务端不做抓取；
// 这里的曲目由程序合成，可自由用于背景音乐，也支持用户上传或填写公开直链。
func (s *Server) musicLibrary(w http.ResponseWriter, r *http.Request, _ *ent.User) {
	tracks := make([]map[string]any, 0, len(media.Tracks))
	for _, t := range media.Tracks {
		tracks = append(tracks, map[string]any{
			"id":       t.ID,
			"title":    t.Title,
			"mood":     t.Mood,
			"duration": t.Seconds,
			"url":      "/media/seed/" + media.TrackFile(t.ID),
			"source":   "内置 · 程序合成",
		})
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"tracks": tracks,
		"note":   "内置曲目由程序合成，无版权限制；也可上传本地音频或粘贴公开可访问的音频直链。",
	})
}
