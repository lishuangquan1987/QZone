package media

import (
	"encoding/binary"
	"testing"
)

func pngHeader() []byte {
	b := make([]byte, 16)
	copy(b, []byte{0x89, 'P', 'N', 'G', '\r', '\n', 0x1a, '\n'})
	binary.BigEndian.PutUint32(b[8:], 13)
	copy(b[12:], "IHDR")
	return b
}

func TestContentMatches(t *testing.T) {
	html := []byte("<html><body><script>alert(1)</script></body></html>")
	png := pngHeader()
	jpeg := []byte{0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 'J', 'F', 'I', 'F', 0, 1, 1, 0, 0, 1}
	svg := []byte(`<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"></svg>`)

	cases := []struct {
		name  string
		ext   string
		head  []byte
		audio bool
		want  bool
	}{
		{"png 内容配 png 扩展名", ".png", png, false, true},
		{"html 冒充 png", ".png", html, false, false},
		{"html 冒充 jpg", ".jpg", html, false, false},
		{"jpg 内容配 jpg", ".jpg", jpeg, false, true},
		{"svg 内容配 svg", ".svg", svg, false, true},
		{"html 冒充 svg", ".svg", html, false, false},
		{"文本冒充音频", ".mp3", html, true, false},
		{"二进制音频头", ".mp3", []byte{0xFF, 0xFB, 0x90, 0x64, 0, 0, 0, 0}, true, true},
		{"空文件", ".png", nil, false, false},
	}
	for _, c := range cases {
		if got := ContentMatches(c.ext, c.head, c.audio); got != c.want {
			t.Errorf("%s: ContentMatches(%q,...)=%v，期望 %v", c.name, c.ext, got, c.want)
		}
	}
}

func TestSafeExtRejectsUnknown(t *testing.T) {
	if _, ok := SafeExt("a.exe", "application/octet-stream"); ok {
		t.Fatal("exe 不应通过")
	}
	if ext, ok := SafeExt("a.PNG", ""); !ok || ext != ".png" {
		t.Fatalf("按扩展名应识别 png，得到 %q,%v", ext, ok)
	}
	if _, ok := AudioExt("a.mp4", "video/mp4"); ok {
		t.Fatal("视频不应被当成音频")
	}
	if ext, ok := AudioExt("a.flac", ""); !ok || ext != ".flac" {
		t.Fatalf("按扩展名应识别 flac，得到 %q,%v", ext, ok)
	}
}
