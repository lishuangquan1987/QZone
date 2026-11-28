package api

import (
	"bytes"
	"compress/gzip"
	"io/fs"
	"net/http"
	"path"
	"strings"
)

// precompressAssets 启动时把 embed 的文本资源预压一遍 gzip（最高压缩级别）。
//
// 之前 /assets/index.js 每个请求都实时压 156KB，qps 只有纯静态文件的 1/6；
// 哈希文件名意味着构建产物不变，压一次可以服务整个进程生命周期。
// 只压 >1KB 的可压缩类型，全部产物加起来约 70KB 内存。
func precompressAssets(webFS fs.FS) map[string][]byte {
	out := map[string][]byte{}
	entries, err := fs.ReadDir(webFS, "assets")
	if err != nil {
		return out
	}
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		name := "assets/" + e.Name()
		if !compressibleType(contentTypeOf(name)) {
			continue
		}
		raw, err := fs.ReadFile(webFS, name)
		if err != nil || len(raw) < 1024 {
			continue
		}
		var buf bytes.Buffer
		zw, err := gzip.NewWriterLevel(&buf, gzip.BestCompression)
		if err != nil {
			continue
		}
		if _, err := zw.Write(raw); err != nil {
			continue
		}
		if err := zw.Close(); err != nil {
			continue
		}
		out["/"+name] = buf.Bytes()
	}
	return out
}

func acceptsGzip(r *http.Request) bool {
	return strings.Contains(r.Header.Get("Accept-Encoding"), "gzip")
}

func contentTypeOf(p string) string {
	switch strings.ToLower(path.Ext(p)) {
	case ".js", ".mjs":
		return "text/javascript; charset=utf-8"
	case ".css":
		return "text/css; charset=utf-8"
	case ".svg":
		return "image/svg+xml"
	case ".json", ".map":
		return "application/json"
	case ".txt", ".md":
		return "text/plain; charset=utf-8"
	case ".html", ".htm":
		return "text/html; charset=utf-8"
	case ".webmanifest":
		return "application/manifest+json"
	default:
		return ""
	}
}
