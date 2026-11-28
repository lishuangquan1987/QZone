package api

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

// attemptWindow 是内存里的滑动窗口计数器：key 在 window 内最多 limit 次。
// 只在内存里记，重启即清空，够用且没有外部依赖。
type attemptWindow struct {
	mu   sync.Mutex
	hits map[string][]time.Time
}

func newWindow() *attemptWindow {
	return &attemptWindow{hits: map[string][]time.Time{}}
}

func (w *attemptWindow) allow(key string, limit int, window time.Duration) bool {
	now := time.Now()
	w.mu.Lock()
	defer w.mu.Unlock()
	w.gc(now, window)

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

// gc 防止被随机 key 撑爆内存。
// 之前是一超限就整表清空，攻击者只要灌 5000 个 key 就能把自己的计数也清掉；
// 现在先按「最后一条已过期」逐条淘汰，真的清不掉才兜底整体重置。
func (w *attemptWindow) gc(now time.Time, window time.Duration) {
	if len(w.hits) < 2048 {
		return
	}
	for k, v := range w.hits {
		if len(v) == 0 || now.Sub(v[len(v)-1]) >= window {
			delete(w.hits, k)
		}
	}
	if len(w.hits) > 16384 {
		w.hits = map[string][]time.Time{}
	}
}

var (
	// 单账号维度：同一 IP 对同一空间号，5 分钟 8 次
	loginLimiter = newWindow()
	// 单 IP 维度：防止换着空间号刷（每个号 8 次，换 100 个号就能撞库）
	loginIPLimiter = newWindow()
	// 注册：单 IP 每小时 10 个，挡住脚本批量造号
	registerLimiter = newWindow()
)

// clientIP 取调用方地址。
//
// X-Forwarded-For 只有在自己前面确实有可信反代时才可信：
// 否则攻击者随手写一个 XFF 就能给每次请求换个身份，限速等于没有。
// 打开 -trust-proxy 后取 XFF 的**最后一段**——那是反代追加的真实来源，
// 客户端自己伪造的前缀影响不到它。
func (s *Server) clientIP(r *http.Request) string {
	if s.trustProxy {
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			parts := strings.Split(xff, ",")
			for i := len(parts) - 1; i >= 0; i-- {
				if ip := strings.TrimSpace(parts[i]); ip != "" {
					return ip
				}
			}
		}
	}
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return host
	}
	return r.RemoteAddr
}
