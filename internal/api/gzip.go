package api

import (
	"compress/gzip"
	"net/http"
	"strconv"
	"strings"
)

// withCompression 对文本类响应做 gzip。
//
// 自建部署时 Go 直接吐原始文件，一个 JS 就有 150KB+；Pages 有 CDN 压缩，
// 这里补上之后首屏传输量能降到三分之一左右。
// 音频、图片、视频以及带 Range 的请求直接放行，避免破坏分段下载。
func withCompression(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") ||
			r.Header.Get("Range") != "" ||
			strings.HasPrefix(r.URL.Path, "/media/") ||
			strings.HasPrefix(r.URL.Path, "/api/music/stream") {
			h.ServeHTTP(w, r)
			return
		}
		gw := &gzipResponse{ResponseWriter: w}
		defer gw.close()
		h.ServeHTTP(gw, r)
	})
}

type gzipResponse struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
	decided     bool
	compress    bool
	gz          *gzip.Writer
}

func (g *gzipResponse) WriteHeader(code int) {
	if g.wroteHeader {
		return
	}
	// 先记下状态码，等第一次 Write 时再决定要不要压缩
	g.status = code
}

func (g *gzipResponse) Write(p []byte) (int, error) {
	if !g.decided {
		g.decided = true
		ct := g.Header().Get("Content-Type")
		if ct == "" && len(p) > 0 {
			ct = http.DetectContentType(p)
			g.Header().Set("Content-Type", ct)
		}
		size := len(p)
		if cl := g.Header().Get("Content-Length"); cl != "" {
			if v, err := strconv.Atoi(cl); err == nil {
				size = v
			}
		}
		// 小于 1KB 的响应压缩收益抵不过头部开销
		g.compress = size >= 1024 && compressibleType(ct)
		if g.compress {
			g.Header().Del("Content-Length")
			g.Header().Set("Content-Encoding", "gzip")
			addVary(g.Header(), "Accept-Encoding")
			g.gz = gzip.NewWriter(g.ResponseWriter)
		}
		g.flushHeader()
	}
	if !g.compress {
		return g.ResponseWriter.Write(p)
	}
	return g.gz.Write(p)
}

func (g *gzipResponse) flushHeader() {
	if g.wroteHeader {
		return
	}
	if g.status == 0 {
		g.status = http.StatusOK
	}
	g.wroteHeader = true
	g.ResponseWriter.WriteHeader(g.status)
}

func (g *gzipResponse) close() {
	if !g.decided {
		// 只有状态码、没有响应体（如 204 / 304）
		g.decided = true
		g.flushHeader()
		return
	}
	if g.gz != nil {
		_ = g.gz.Close()
	}
}

func compressibleType(ct string) bool {
	ct = strings.ToLower(ct)
	switch {
	case strings.HasPrefix(ct, "text/"):
		return true
	case strings.HasPrefix(ct, "application/json"),
		strings.HasPrefix(ct, "application/javascript"),
		strings.HasPrefix(ct, "application/xml"),
		strings.HasPrefix(ct, "application/manifest"),
		strings.HasPrefix(ct, "image/svg+xml"):
		return true
	}
	return false
}

// addVary 往 Vary 里追加一个维度，避免重复。
func addVary(h http.Header, v string) {
	for _, cur := range h.Values("Vary") {
		for _, part := range strings.Split(cur, ",") {
			if strings.EqualFold(strings.TrimSpace(part), v) {
				return
			}
		}
	}
	h.Add("Vary", v)
}
