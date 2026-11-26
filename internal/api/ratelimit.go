package api

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

// 登录失败的滑动窗口限速：同一来源 + 同一空间号在 5 分钟内最多试 8 次，
// 防止脚本把密码当字典刷。只在内存里记，重启即清空，够用且没有外部依赖。
type attemptWindow struct {
	mu   sync.Mutex
	hits map[string][]time.Time
}

func (w *attemptWindow) allow(key string, limit int, window time.Duration) bool {
	now := time.Now()
	w.mu.Lock()
	defer w.mu.Unlock()
	if len(w.hits) > 5000 { // 简单兜底，避免被随机 key 撑爆内存
		w.hits = map[string][]time.Time{}
	}
	list := w.hits[key]
	keep := list[:0]
	for _, t := range list {
		if now.Sub(t) < window {
			keep = append(keep, t)
		}
	}
	if len(keep) >= limit {
		w.hits[key] = keep
		return false
	}
	w.hits[key] = append(keep, now)
	return true
}

func (w *attemptWindow) reset(key string) {
	w.mu.Lock()
	delete(w.hits, key)
	w.mu.Unlock()
}

var loginLimiter = &attemptWindow{hits: map[string][]time.Time{}}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if i := strings.IndexByte(xff, ','); i > 0 {
			return strings.TrimSpace(xff[:i])
		}
		return strings.TrimSpace(xff)
	}
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return host
	}
	return r.RemoteAddr
}
