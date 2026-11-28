package media

import (
	"net/http"
	"strings"
)

// ContentMatches 用文件头判断「内容是否真的像这个扩展名」。
//
// 扩展名与客户端声明的 Content-Type 都是用户可以随便写的，
// 一个 .png 里塞 HTML 也能落盘。nosniff 能挡住执行，但没必要留这种文件。
// 音频容器（m4a/flac/ogg）的魔数五花八门，这里只在明显是文本时拒绝。
func ContentMatches(ext string, head []byte, audio bool) bool {
	if len(head) == 0 {
		return false
	}
	if audio {
		ct := http.DetectContentType(head)
		return !strings.HasPrefix(ct, "text/") && !strings.Contains(ct, "html")
	}

	switch ext {
	case ".svg":
		s := strings.ToLower(string(head))
		return strings.Contains(s, "<svg") || strings.HasPrefix(strings.TrimSpace(s), "<?xml")
	case ".jpg", ".jpeg":
		return http.DetectContentType(head) == "image/jpeg"
	case ".png":
		return http.DetectContentType(head) == "image/png"
	case ".gif":
		return http.DetectContentType(head) == "image/gif"
	case ".webp":
		return http.DetectContentType(head) == "image/webp"
	case ".avif":
		// 标准库还不认识 avif，只能确认不是文本
		return !strings.HasPrefix(http.DetectContentType(head), "text/")
	}
	return false
}
