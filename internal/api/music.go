package api

import (
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"qzone/ent"
	"qzone/internal/media"
)

// musicLibrary 返回内置免费音乐库。
//
// 说明：QQ 音乐等平台的播放接口需要签名与版权授权，服务端不做抓取；
// 内置曲目由程序合成，可自由用于背景音乐；站外免费曲库（CC BY / CC0）
// 的清单在前端维护，播放时经 /api/music/stream 反代，避免第三方
// 返回 application/octet-stream 导致个别浏览器（Safari）拒绝播放。
func (s *Server) musicLibrary(w http.ResponseWriter, r *http.Request, _ *ent.User) {
	tracks := make([]map[string]any, 0, len(media.Tracks))
	for _, t := range media.Tracks {
		tracks = append(tracks, map[string]any{
			"id":       t.ID,
			"kind":     "builtin",
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

// musicAllowed 是允许反代的免费曲库站点白名单：只放行 https、指定主机与路径前缀，
// 避免这个接口变成任意地址的代理（SSRF）。
var musicAllowed = []struct{ host, prefix string }{
	{"incompetech.com", "/music/royalty-free/mp3-royaltyfree/"},
	{"www.soundhelix.com", "/examples/mp3/"},
}

var musicClient = &http.Client{
	Transport: &http.Transport{
		Proxy:                 http.ProxyFromEnvironment,
		ResponseHeaderTimeout: 15 * time.Second,
		ForceAttemptHTTP2:     true,
		MaxIdleConnsPerHost:   4,
	},
}

func allowedMusicURL(raw string) (*url.URL, bool) {
	if raw == "" || len(raw) > 512 {
		return nil, false
	}
	u, err := url.Parse(raw)
	if err != nil || u.Scheme != "https" || u.User != nil {
		return nil, false
	}
	host := strings.ToLower(u.Hostname())
	for _, a := range musicAllowed {
		if host == a.host && strings.HasPrefix(u.EscapedPath(), a.prefix) {
			return u, true
		}
	}
	return nil, false
}

// musicStream 把白名单内的免费音轨转发给浏览器。
//
// 直接让浏览器连第三方会有两个问题：一是对方返回 application/octet-stream，
// 个别浏览器会拒绝在 <audio> 里播放；二是国内访问境外曲库经常超时。
// 反代之后统一成 audio/mpeg，并保留 Range 支持，可以边下边播、拖动进度。
func (s *Server) musicStream(w http.ResponseWriter, r *http.Request, _ *ent.User) {
	target, ok := allowedMusicURL(r.URL.Query().Get("u"))
	if !ok {
		fail(w, http.StatusBadRequest, "只支持曲库内的免费音源")
		return
	}

	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, target.String(), nil)
	if err != nil {
		fail(w, http.StatusBadRequest, "音源地址不合法")
		return
	}
	if rg := r.Header.Get("Range"); rg != "" {
		req.Header.Set("Range", rg)
	}
	// 部分曲库会拦截空 UA 的请求
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; QZoneBGM/1.0)")

	resp, err := musicClient.Do(req)
	if err != nil {
		fail(w, http.StatusBadGateway, "音源暂时不可用，换个网络或稍后再试")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		fail(w, http.StatusBadGateway, "音源返回异常（"+resp.Status+"）")
		return
	}

	w.Header().Set("Content-Type", "audio/mpeg")
	w.Header().Set("Accept-Ranges", "bytes")
	w.Header().Set("Cache-Control", "public, max-age=604800")
	if cl := resp.Header.Get("Content-Length"); cl != "" {
		w.Header().Set("Content-Length", cl)
	}
	if cr := resp.Header.Get("Content-Range"); cr != "" {
		w.Header().Set("Content-Range", cr)
	}
	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)
}
