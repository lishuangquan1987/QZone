package api

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/url"
	"path"
	"strings"
	"sync"
	"time"

	"qzone/ent"
	"qzone/internal/media"
)

// 在线曲库：华语流行 / 民谣 / 国风 / 治愈纯音 / 摇滚 / 轻快小调。
//
// 音源来自腾讯音乐（QQ 音乐）的公开试听接口，本站只做两件事：
//  1. 服务端实时换取 vkey（播放地址有时效，不能写死在前端）；
//  2. 同源转发音频流——直连 CDN 会被 Referer 校验拦成 403，
//     转发之后 <audio> 也不受跨域与格式嗅探影响，能正常拖动进度。
//
// 曲目均为平台上允许免费试听的作品；版权归原权利方所有，仅供个人非商业试听。

type qqTrack struct {
	MID      string
	Title    string
	Artist   string
	Album    string
	AlbumMID string
	Seconds  int
	Group    string
}

var qqGroups = []map[string]string{
	{"key": "pop", "label": "华语流行", "desc": "耳熟能详的旋律，适合当背景"},
	{"key": "folk", "label": "民谣", "desc": "吉他与故事，安静的下午"},
	{"key": "guofeng", "label": "国风", "desc": "古筝、琵琶与戏腔"},
	{"key": "chill", "label": "治愈纯音", "desc": "钢琴与自然声，写东西时听"},
	{"key": "rock", "label": "摇滚现场", "desc": "有点力气，适合深夜"},
	{"key": "easy", "label": "轻快小调", "desc": "轻电子与夏日感"},
}

// 封面统一取专辑图；同一专辑的封面地址由 QQ 音乐 CDN 提供。
var qqTracks = []qqTrack{
	{"000DwlYJ09mLoO", "哪里都是你", "队长", "哪里都是你", "", 222, "pop"},
	{"001hs89m3C5p3g", "小半", "陈粒", "小梦大半", "004fAhFe0fdHYF", 297, "pop"},
	{"0031HkWT37OzaR", "胡广生", "任素汐", "胡广生", "000MtVCd2qgzd9", 214, "pop"},
	{"0007wGEd2R755D", "九月底", "余佳运", "九月底", "001zatqo1OOPqI", 257, "pop"},
	{"000DltsM4gJHXv", "无问", "毛不易", "无问", "0026ttFc17IeE3", 258, "pop"},
	{"001C6s7N03kFvq", "孤单心事", "颜人中", "孤单心事", "004cZV9E0J8e9v", 264, "pop"},
	{"000IZJIT1DUv5S", "千禧", "徐秉龙", "新声请指教 第8期", "001q96aE2WH5GR", 200, "pop"},
	{"0035mrh61ePNVn", "少年不识愁滋味", "隔壁老樊", "少年不识愁滋味", "0021Vw4425hcKK", 235, "pop"},

	{"002Yzfab3R9lMM", "理想三旬", "陈鸿宇", "浓烟下的诗歌电台", "002kvhDj0nU7Qo", 210, "folk"},
	{"004P9zLK3JjSMX", "七月上", "Jam", "阿敬的单曲集", "001Rw2V03hCiZl", 190, "folk"},
	{"000MZHWX1kO45o", "董小姐", "宋冬野", "摩登天空", "0025RyVO3KEYyr", 333, "folk"},
	{"003gF7ZM2nUz6i", "秋酿", "房东的猫", "我们正青春", "0043l00O4JGJra", 226, "folk"},
	{"004BTpWp1yrDxU", "借我", "谢春花", "硬地围炉夜 2017", "0045sIn32B1Ec3", 188, "folk"},
	{"001w6VBG4NghkY", "让我偷偷看你", "赵雷", "阿弥陀佛么么哒", "002fLWFx0LLy6x", 254, "folk"},
	{"0000xYPh1yUoyt", "不说再见", "好妹妹乐队", "不说再见", "000I4CFA03SRGW", 296, "folk"},
	{"001lu0MR39TXiO", "春分的夜", "程璧", "我想和你虚度时光", "001PnqyE4MzQk0", 286, "folk"},

	{"000A1xry3KwdhW", "棠梨煎雪", "银临", "腐草为萤", "004U7LFy1HJCs0", 245, "guofeng"},
	{"000PghTZ1AgWfU", "盗将行", "花粥 / 马雨阳", "粥请客 (二)", "003iJBH73UYvmi", 198, "guofeng"},
	{"003BSJQ10mR12I", "九万字", "黄诗扶", "人间不值得", "003Y4SZD0uCEZs", 232, "guofeng"},
	{"001oYJLO3EvPz1", "倾尽天下", "河图", "倾尽天下", "003O6GVe4Yxc6P", 265, "guofeng"},
	{"000h0AZw2SMaVH", "故梦", "双笙", "笙声不息", "0032Q2Tz2yteKs", 284, "guofeng"},
	{"0040Zf023qgtAq", "雨碎江南·印象", "墨明棋妙", "中国风 R&B", "003oPZEv2LIifn", 245, "guofeng"},
	{"001OoawU2zOSAF", "采薇", "HITA", "百变", "001Kx66H3MVw3C", 322, "guofeng"},

	{"0016hfoy28wyTn", "城南花已开", "三亩地", "城南花已开", "001JyIeM0hK5lO", 271, "chill"},
	{"000r9ORF499MEt", "萤火之森", "CMJ", "萤火之森", "000ORbzR2KTXcT", 152, "chill"},
	{"002OsIFu1uqspM", "Merry Christmas Mr. Lawrence", "坂本龙一", "Three", "002NSlUO1Isxd3", 331, "chill"},
	{"003SsnJo1NBuP2", "故乡的原风景", "宗次郎", "背景音乐之旅", "0031UXjr3kzYTo", 282, "chill"},
	{"002TcTOF1vvP8o", "一叶知心", "巫娜", "茶界 II", "001VJKzk1hGnFG", 321, "chill"},
	{"003BiYM71E0j7X", "梦中的婚礼", "Richard Clayderman", "水边的阿狄丽娜", "003iw6EK2YWEju", 162, "chill"},

	{"001V2NRr2XSbXj", "公路之歌", "痛仰乐队", "不要停止我的音乐", "0003u8cl1Ui859", 184, "rock"},
	{"0006FdfE0PBsrp", "西湖", "痛仰乐队", "不要停止我的音乐", "0003u8cl1Ui859", 253, "rock"},
	{"001v129s1AnU1f", "再见杰克", "痛仰乐队", "不要停止我的音乐", "0003u8cl1Ui859", 273, "rock"},
	{"0042vhqB1khjiU", "花火", "梁博", "梦响新歌声", "002PWh9F3uGJuP", 123, "rock"},
	{"003O0EzK1AhipD", "都选C", "乔杉 / 缝纫机乐队", "都选C", "002FofpE4gPLSp", 179, "rock"},
	{"002Fc5Be34LLWm", "大风吹", "刘惜君 / 王赫野", "天赐的声音", "002pgY7c3LgAqu", 223, "rock"},

	{"000StA784ADxFU", "Lover Boy 88", "Phum Viphurit", "Lover Boy 88", "004BSWBb4KNlLl", 196, "easy"},
	{"003JxK030ab67a", "夏日期待", "Gifty", "夏日期待", "001S3yjt1spkoP", 230, "easy"},
	{"000VcdxM1UKrV6", "Summer's Day", "jinsang", "Summer's Day", "002AuxRn2HmIu8", 180, "easy"},
	{"002uoh7A3NVn3P", "晚风", "鹿晗", "晚风", "004fp5Mo1iQTzW", 185, "easy"},
}

var qqByMID = func() map[string]qqTrack {
	m := make(map[string]qqTrack, len(qqTracks))
	for _, t := range qqTracks {
		m[t.MID] = t
	}
	return m
}()

const qqCredit = "音源：QQ 音乐试听 · 版权归原权利方，仅供个人非商业试听"

func qqCover(albumMID string) string {
	if albumMID == "" {
		return ""
	}
	return "https://y.gtimg.cn/music/photo_new/T002R300x300M000" + albumMID + ".jpg"
}

// musicLibrary 返回内置合成曲目与在线华语曲库。
func (s *Server) musicLibrary(w http.ResponseWriter, r *http.Request, _ *ent.User) {
	builtin := make([]map[string]any, 0, len(media.Tracks))
	for _, t := range media.Tracks {
		builtin = append(builtin, map[string]any{
			"id":       t.ID,
			"kind":     "builtin",
			"title":    t.Title,
			"artist":   "程序合成",
			"mood":     t.Mood,
			"duration": t.Seconds,
			"url":      "/media/seed/" + media.TrackFile(t.ID),
			"source":   "内置 · 程序合成",
		})
	}

	online := make([]map[string]any, 0, len(qqTracks))
	for _, t := range qqTracks {
		online = append(online, map[string]any{
			"id":       t.MID,
			"kind":     "online",
			"title":    t.Title,
			"artist":   t.Artist,
			"album":    t.Album,
			"group":    t.Group,
			"duration": t.Seconds,
			"cover":    qqCover(t.AlbumMID),
			"url":      "/api/music/stream?mid=" + t.MID,
			"source":   "QQ 音乐 · 试听",
		})
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"tracks": builtin,
		"online": online,
		"groups": qqGroups,
		"credit": qqCredit,
		"note":   "内置曲目由程序合成，无版权限制；在线曲库为平台免费试听作品，仅供个人非商业使用。",
	})
}

// musicAllowed 是允许反代的站外免费曲库白名单（兼容旧版已保存的直链）。
var musicAllowed = []struct{ host, prefix string }{
	{"incompetech.com", "/music/royalty-free/mp3-royaltyfree/"},
}

var musicClient = &http.Client{
	Transport: &http.Transport{
		Proxy:                 http.ProxyFromEnvironment,
		ResponseHeaderTimeout: 15 * time.Second,
		ForceAttemptHTTP2:     true,
		MaxIdleConnsPerHost:   8,
	},
}

const browserUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

var errTrackUnavailable = errors.New("track unavailable")

type qqPlay struct {
	target string
	exp    time.Time
}

var (
	qqMu    sync.Mutex
	qqCache = map[string]qqPlay{}
)

// resolveQQ 用 songmid 换出可播放的直链。vkey 有时效，缓存 25 分钟。
func resolveQQ(ctx context.Context, mid string) (string, error) {
	qqMu.Lock()
	if p, ok := qqCache[mid]; ok && time.Now().Before(p.exp) {
		qqMu.Unlock()
		return p.target, nil
	}
	qqMu.Unlock()

	body := `{"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey",` +
		`"param":{"guid":"10000","songmid":["` + mid + `"],"songtype":[0],` +
		`"uin":"0","loginflag":1,"platform":"20"}},` +
		`"loginUin":"0","comm":{"uin":"0","format":"json","ct":24,"cv":0}}`

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://u.y.qq.com/cgi-bin/musicu.fcg", strings.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Referer", "https://y.qq.com/")
	req.Header.Set("User-Agent", browserUA)

	resp, err := musicClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return "", errTrackUnavailable
	}

	var out struct {
		Req0 struct {
			Data struct {
				Midurlinfo []struct {
					PURL string `json:"purl"`
				} `json:"midurlinfo"`
			} `json:"data"`
		} `json:"req_0"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&out); err != nil {
		return "", err
	}

	var purl string
	for _, it := range out.Req0.Data.Midurlinfo {
		if it.PURL != "" {
			purl = it.PURL
			break
		}
	}
	if purl == "" {
		return "", errTrackUnavailable
	}

	target := "https://ws.stream.qqmusic.qq.com/" + strings.TrimPrefix(purl, "/")
	qqMu.Lock()
	qqCache[mid] = qqPlay{target: target, exp: time.Now().Add(25 * time.Minute)}
	qqMu.Unlock()
	return target, nil
}

func allowedMusicURL(raw string) (string, bool) {
	if raw == "" || len(raw) > 512 {
		return "", false
	}
	u, err := url.Parse(raw)
	if err != nil || u.Scheme != "https" || u.User != nil {
		return "", false
	}
	host := strings.ToLower(u.Hostname())
	// 归一化路径，避免 ../../ 跳出白名单目录
	p := path.Clean(u.EscapedPath())
	for _, a := range musicAllowed {
		if host == a.host && strings.HasPrefix(p, a.prefix) {
			return u.String(), true
		}
	}
	return "", false
}

// musicStream 把曲库音轨转发给浏览器。
//
// 支持两种寻址：
//   - ?mid=xxx        在线曲库（服务端换 vkey 后转发，保留 Range）
//   - ?u=https://...  旧版站外直链（白名单域名，兼容已保存的设置）
func (s *Server) musicStream(w http.ResponseWriter, r *http.Request, _ *ent.User) {
	var target string
	mid := r.URL.Query().Get("mid")
	if mid != "" {
		if _, ok := qqByMID[mid]; !ok {
			fail(w, http.StatusNotFound, "曲库里没有这首")
			return
		}
		u, err := resolveQQ(r.Context(), mid)
		if err != nil {
			if errors.Is(err, errTrackUnavailable) {
				fail(w, http.StatusBadGateway, "这首歌暂时无法试听，换一首试试")
				return
			}
			fail(w, http.StatusBadGateway, "音源连接失败，稍后再试")
			return
		}
		target = u
	} else {
		u, ok := allowedMusicURL(r.URL.Query().Get("u"))
		if !ok {
			fail(w, http.StatusBadRequest, "只支持曲库内的音源")
			return
		}
		target = u
	}

	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, target, nil)
	if err != nil {
		fail(w, http.StatusBadRequest, "音源地址不合法")
		return
	}
	// CDN 会校验来源页，缺 Referer 直接 403
	req.Header.Set("Referer", "https://y.qq.com/")
	req.Header.Set("User-Agent", browserUA)
	req.Header.Set("Accept-Encoding", "identity")
	if rg := r.Header.Get("Range"); rg != "" {
		req.Header.Set("Range", rg)
	}
	if ir := r.Header.Get("If-Range"); ir != "" {
		req.Header.Set("If-Range", ir)
	}

	resp, err := musicClient.Do(req)
	if err != nil {
		fail(w, http.StatusBadGateway, "音源暂时不可用，换个网络或稍后再试")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		// vkey 可能在缓存期内失效，清掉让下次请求重新解析
		if mid != "" {
			qqMu.Lock()
			delete(qqCache, mid)
			qqMu.Unlock()
		}
		fail(w, http.StatusBadGateway, "音源返回异常（"+resp.Status+"）")
		return
	}

	ct := resp.Header.Get("Content-Type")
	if ct == "" || strings.HasPrefix(ct, "application/octet-stream") {
		ct = "audio/mp4"
	}
	w.Header().Set("Content-Type", ct)
	w.Header().Set("Accept-Ranges", "bytes")
	w.Header().Set("Cache-Control", "private, max-age=3600")
	for _, h := range []string{"Content-Length", "Content-Range", "ETag", "Last-Modified"} {
		if v := resp.Header.Get(h); v != "" {
			w.Header().Set(h, v)
		}
	}
	w.WriteHeader(resp.StatusCode)
	_, _ = io.Copy(w, resp.Body)
}
