package api

import (
	"strings"
	"testing"
	"time"
)

func TestVisible(t *testing.T) {
	cases := []struct {
		name     string
		vis      string
		owner    int
		viewer   int
		expected bool
	}{
		{"本人看私密", "private", 1, 1, true},
		{"他人看私密", "private", 1, 2, false},
		{"他人看公开", "public", 1, 2, true},
		{"他人看仅链接", "unlisted", 1, 2, true},
		{"本人看仅链接", "unlisted", 1, 1, true},
	}
	for _, c := range cases {
		if got := visible(c.vis, c.owner, c.viewer); got != c.expected {
			t.Errorf("%s: visible(%q,%d,%d)=%v，期望 %v", c.name, c.vis, c.owner, c.viewer, got, c.expected)
		}
	}
}

func TestSafeAssetURL(t *testing.T) {
	ok := []string{
		"",
		"/media/294388344/202611/a.webp",
		"https://example.com/a.png",
	}
	bad := []string{
		"javascript:alert(1)",
		"data:image/svg+xml,<svg onload=alert(1)>",
		"http://example.com/a.png", // 只放行 https
		"//example.com/a.png",
		"file:///etc/passwd",
		"https://user:pass@example.com/a.png",
		"https://" + strings.Repeat("a", 600) + ".com/x.png",
	}
	for _, v := range ok {
		if _, got := safeAssetURL(v, false); !got {
			t.Errorf("safeAssetURL(%q) 应放行", v)
		}
	}
	for _, v := range bad {
		if _, got := safeAssetURL(v, false); got {
			t.Errorf("safeAssetURL(%q) 应拒绝", v)
		}
	}
	// 音乐直链只在对 bgm 校验时放行
	if _, got := safeAssetURL("/api/music/stream?mid=abc", false); got {
		t.Error("普通字段不应放行音源地址")
	}
	if _, got := safeAssetURL("/api/music/stream?mid=abc", true); !got {
		t.Error("背景音乐字段应放行音源地址")
	}
}

func TestNormalizePost(t *testing.T) {
	cases := []struct {
		name string
		req  postReq
		want string // 期望的错误片段，空表示应通过
	}{
		{"正常", postReq{Title: "你好", Content: "正文", Images: []string{"/media/a/b.webp"}}, ""},
		{"空内容", postReq{}, "写点什么"},
		{"超长正文", postReq{Content: strings.Repeat("字", 60001)}, "正文过长"},
		{"十张图", postReq{Content: "x", Images: make([]string, 10)}, "最多 9 张"},
		{"非法配图", postReq{Content: "x", Images: []string{"javascript:alert(1)"}}, "配图地址"},
		{"非法封面", postReq{Content: "x", Cover: "data:text/html,x"}, "封面地址"},
	}
	for _, c := range cases {
		err := normalizePost(&c.req)
		if c.want == "" {
			if err != nil {
				t.Errorf("%s: 不应报错，得到 %v", c.name, err)
			}
			continue
		}
		if err == nil || !strings.Contains(err.Error(), c.want) {
			t.Errorf("%s: 期望错误包含 %q，得到 %v", c.name, c.want, err)
		}
	}
}

func TestStartOfDayUsesAppLocation(t *testing.T) {
	now := time.Date(2026, 3, 1, 7, 30, 0, 0, appLoc)
	start := startOfDay(now)
	if start.Hour() != 0 || start.Minute() != 0 || start.Second() != 0 {
		t.Fatalf("当天起点应为 0 点，得到 %v", start)
	}
	if start.Location() != appLoc {
		t.Fatalf("时区应为 %v，得到 %v", appLoc, start.Location())
	}
	if d := now.Sub(start); d != 7*time.Hour+30*time.Minute {
		t.Fatalf("距零点应为 7h30m，得到 %v", d)
	}
	// 跨日：23:59 与次日 00:01 必须落在不同的 key
	if dayKey(now) == dayKey(now.Add(17*time.Hour)) {
		t.Fatal("跨日应产生不同的日期键")
	}
}

func TestUploadOwner(t *testing.T) {
	cases := map[string]string{
		"/media/294388344/202611/a.jpg": "294388344",
		"/media/linwan/a.jpg":           "linwan",
		"/media/a.jpg":                  "",
		"/api/whatever":                 "",
	}
	for in, want := range cases {
		got, ok := uploadOwner(in)
		if want == "" {
			if ok {
				t.Errorf("uploadOwner(%q) 应失败，得到 %q", in, got)
			}
			continue
		}
		if !ok || got != want {
			t.Errorf("uploadOwner(%q)=%q,%v，期望 %q", in, got, ok, want)
		}
	}
}

func TestDeriveSummaryStripsMarkdown(t *testing.T) {
	in := "# 标题\n\n![图](/media/a.webp)\n\n正文**加粗**内容"
	got := deriveSummary(in)
	if strings.Contains(got, "#") || strings.Contains(got, "![") || strings.Contains(got, "**") {
		t.Fatalf("摘要应去掉 Markdown 标记，得到 %q", got)
	}
	if !strings.Contains(got, "正文") {
		t.Fatalf("摘要应保留正文，得到 %q", got)
	}
}
