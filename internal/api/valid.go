package api

import (
	"errors"
	"net/url"
	"os"
	"strings"
	"time"
)

// appLoc 是业务时区：签到日界、今日访客、消息时间都按它算。
// 容器里由 TZ=Asia/Shanghai 指定；裸机没设或加载失败时退回系统本地时区。
var appLoc = func() *time.Location {
	name := strings.TrimSpace(os.Getenv("TZ"))
	if name == "" {
		return time.Local
	}
	if l, err := time.LoadLocation(name); err == nil {
		return l
	}
	return time.Local
}()

// startOfDay 返回业务时区当天的 0 点。
// 不能用 t.Truncate(24h)：那是按 UTC 对齐的，东八区会差 8 小时。
func startOfDay(t time.Time) time.Time {
	y, m, d := t.In(appLoc).Date()
	return time.Date(y, m, d, 0, 0, 0, 0, appLoc)
}

// dayKey 是「哪一天」的比较键，同样按业务时区。
func dayKey(t time.Time) string {
	return t.In(appLoc).Format("2006-01-02")
}

// safeAssetURL 只放行站内媒体路径与 https 外链。
//
// 头像、封面、配图这些字段如果允许任意地址，访客打开页面时浏览器就会去请求
// 第三方（泄露 IP 与来源页），也能塞超长 data: 把库撑大。
// 空串表示「清空」，是合法的。
func safeAssetURL(raw string, allowMusic bool) (string, bool) {
	v := strings.TrimSpace(raw)
	if v == "" {
		return "", true
	}
	if len(v) > 512 {
		return "", false
	}
	if strings.HasPrefix(v, "/media/") {
		return v, true
	}
	if allowMusic && strings.HasPrefix(v, "/api/music/stream?") {
		return v, true
	}
	u, err := url.Parse(v)
	if err != nil || u.Scheme != "https" || u.Host == "" || u.User != nil {
		return "", false
	}
	return v, true
}

// uploadOwner 从 /media/<uin>/<年月>/<文件名> 里取出空间号。
func uploadOwner(raw string) (string, bool) {
	rest, ok := strings.CutPrefix(raw, "/media/")
	if !ok {
		return "", false
	}
	i := strings.IndexByte(rest, '/')
	if i <= 0 {
		return "", false
	}
	return rest[:i], true
}

// normalizePost 统一 create / update 的字段校验。
// 之前只有新建会校验长度与配图数量，PATCH 可以绕过去。
func normalizePost(req *postReq) error {
	req.Content = strings.TrimSpace(req.Content)
	req.Title = strings.TrimSpace(req.Title)
	if req.Content == "" && len(req.Images) == 0 {
		return errors.New("写点什么再发布吧")
	}
	if len([]rune(req.Content)) > 60000 {
		return errors.New("正文过长（上限 6 万字）")
	}
	if len(req.Images) > 9 {
		return errors.New("最多 9 张图片")
	}
	for i, u := range req.Images {
		v, ok := safeAssetURL(u, false)
		if !ok {
			return errors.New("配图地址不合法")
		}
		req.Images[i] = v
	}
	cover, ok := safeAssetURL(req.Cover, false)
	if !ok {
		return errors.New("封面地址不合法")
	}
	req.Cover = cover
	if len([]rune(req.Title)) > 80 {
		req.Title = string([]rune(req.Title)[:80])
	}
	return nil
}
