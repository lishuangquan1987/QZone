package api

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"
)

func TestAttemptWindowLimit(t *testing.T) {
	w := newWindow()
	key := "1.2.3.4|alice"
	for i := 0; i < 8; i++ {
		if !w.allow(key, 8, time.Minute) {
			t.Fatalf("第 %d 次应放行", i+1)
		}
	}
	if w.allow(key, 8, time.Minute) {
		t.Fatal("第 9 次应被拦住")
	}
	// 另一个 key 不受影响
	if !w.allow("1.2.3.4|bob", 8, time.Minute) {
		t.Fatal("换账号不应受影响")
	}
	// 登录成功后清零，允许继续
	w.reset(key)
	if !w.allow(key, 8, time.Minute) {
		t.Fatal("reset 后应重新可用")
	}
}

func TestAttemptWindowIsolation(t *testing.T) {
	w := newWindow()
	for i := 0; i < 4; i++ {
		w.allow("a", 4, time.Minute)
	}
	if w.allow("a", 4, time.Minute) {
		t.Fatal("a 应已达上限")
	}
	if !w.allow("b", 4, time.Minute) {
		t.Fatal("b 不应被 a 影响")
	}
}

func TestClientIPIgnoresXFFByDefault(t *testing.T) {
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	r.RemoteAddr = "192.0.2.10:5555"
	r.Header.Set("X-Forwarded-For", "1.1.1.1")

	s := &Server{}
	if got := s.clientIP(r); got != "192.0.2.10" {
		t.Fatalf("未开 trustProxy 时应使用 TCP 来源，得到 %q", got)
	}
}

func TestClientIPTakesLastHopWhenTrusted(t *testing.T) {
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	r.RemoteAddr = "10.0.0.1:5555"
	// 客户端自己伪造了前两段，反代在末尾追加真实 IP
	r.Header.Set("X-Forwarded-For", "1.1.1.1, 2.2.2.2, 203.0.113.7")

	s := &Server{trustProxy: true}
	if got := s.clientIP(r); got != "203.0.113.7" {
		t.Fatalf("应取最后一段，得到 %q", got)
	}
}

func TestViewCounterDeduplicates(t *testing.T) {
	v := newViewCounter()

	if got := v.hit(7, "1.1.1.1"); got != 1 {
		t.Fatalf("第一次应返回 1，得到 %d", got)
	}
	for i := 0; i < 3; i++ {
		if got := v.hit(7, "1.1.1.1"); got != 1 {
			t.Fatalf("同 IP 重复访问不应累加，得到 %d", got)
		}
	}
	if got := v.hit(7, "2.2.2.2"); got != 2 {
		t.Fatalf("换 IP 应累加到 2，得到 %d", got)
	}
	if got := v.pendingFor(7); got != 2 {
		t.Fatalf("pendingFor 应为 2，得到 %d", got)
	}
	if got := v.pendingFor(8); got != 0 {
		t.Fatalf("未访问过的文章应为 0，得到 %d", got)
	}
}

func TestThumbWidthsWhitelist(t *testing.T) {
	for _, w := range []int{240, 400, 480, 800} {
		if !thumbWidths[w] {
			t.Errorf("宽度 %d 应在白名单里", w)
		}
	}
	for _, w := range []int{0, 1, 999, 4096} {
		if thumbWidths[w] {
			t.Errorf("宽度 %d 不应在白名单里", w)
		}
	}
	// 防止误塞进离谱值
	buf := make([]byte, 0, 8)
	buf = strconv.AppendInt(buf, 999, 10)
	if string(buf) != "999" {
		t.Fatal("sanity check failed")
	}
}
