package media

import (
	"encoding/binary"
	"fmt"
	"math"
	"os"
	"path"
	"path/filepath"
	"strings"
)

// ---------- 渐变 SVG 素材 ----------
//
// 示例空间的头像、封面与相册照片在首次启动时本地生成，
// 不依赖外网图床，也不携带任何真实用户图片。

var palettes = [][2]string{
	{"#8ec5fc", "#e0c3fc"},
	{"#ffd6a5", "#ff9a8b"},
	{"#a8edea", "#fed6e3"},
	{"#c1dfc4", "#deecdd"},
	{"#f6d365", "#fda085"},
	{"#84fab0", "#8fd3f4"},
	{"#cfd9df", "#e2ebf0"},
	{"#a18cd1", "#fbc2eb"},
}

func palette(i int) [2]string { return palettes[i%len(palettes)] }

// Avatar 生成圆形渐变头像，只含图形，不含文字（小尺寸下文字会糊）。
func Avatar(i int) string {
	c := palette(i)
	return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="` + c[0] + `"/><stop offset="1" stop-color="` + c[1] + `"/>
</linearGradient></defs>
<rect width="240" height="240" fill="url(#g)"/>
<circle cx="120" cy="96" r="40" fill="#ffffff" fill-opacity="0.6"/>
<path d="M44 240c0-42 34-70 76-70s76 28 76 70z" fill="#ffffff" fill-opacity="0.5"/>
</svg>`
}

// Cover 生成横幅封面。
func Cover(i int) string {
	c := palette(i)
	c2 := palette(i + 3)
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="520" viewBox="0 0 1600 520">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="` + c[0] + `"/><stop offset="1" stop-color="` + c[1] + `"/></linearGradient>
<linearGradient id="hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="` + c2[1] + `" stop-opacity="0.9"/><stop offset="1" stop-color="` + c2[0] + `" stop-opacity="0.25"/></linearGradient>
</defs>
<rect width="1600" height="520" fill="url(#sky)"/>

<path d="M0 396 C 220 306 420 372 620 330 C 840 284 1020 366 1220 330 C 1400 298 1500 350 1600 322 L1600 520 L0 520 Z" fill="url(#hill)"/>
<path d="M0 448 C 280 386 480 442 720 414 C 960 386 1180 448 1600 402 L1600 520 L0 520 Z" fill="#ffffff" fill-opacity="0.18"/>
<path d="M0 380 C 300 330 520 372 780 348 C 1040 324 1300 368 1600 336 L1600 400 L0 400 Z" fill="#ffffff" fill-opacity="0.1"/>
<g fill="#ffffff" fill-opacity="0.4"><circle cx="320" cy="140" r="3"/><circle cx="470" cy="96" r="2.2"/><circle cx="620" cy="170" r="2.6"/><circle cx="860" cy="80" r="2"/></g>
</svg>`
}

// Photo 生成一张抽象「照片」：分层山脊 / 雾面 / 远山与水面三种构图，
// 按索引轮换，避免整片纯色，也避免过大的白色光斑。
func Photo(i int) string {
	c := palette(i)
	c2 := palette(i + 5)
	c3 := palette(i + 2)

	sunX := itoa(300 + (i*137)%700)
	sunY := itoa(180 + (i*61)%180)
	horizon := 520 + (i*37)%120

	var bokeh string
	for k := 0; k < 4; k++ {
		bx := itoa(120 + (i*173+k*211)%960)
		by := itoa(90 + (i*97+k*157)%560)
		br := itoa(6 + (i+k*13)%16)
		bokeh += `<circle cx="` + bx + `" cy="` + by + `" r="` + br + `" fill="#ffffff" fill-opacity="0.26"/>`
	}

	vig := `<radialGradient id="vig" cx="0.5" cy="0.45" r="0.78"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.16"/></radialGradient>`
	open := `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><defs>`
	close := `<rect width="1200" height="900" fill="url(#vig)"/></svg>`

	switch i % 3 {
	case 0: // 地平线 + 起伏山脊
		v := ``
		v += `<linearGradient id="sky" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="{c0}"/><stop offset="0.6" stop-color="{c1}"/><stop offset="1" stop-color="{c3}"/></linearGradient>`
		v += `<radialGradient id="sun" cx="0.5" cy="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>`
		v += vig
		v += `</defs><rect width="1200" height="900" fill="url(#sky)"/>`
		v += `<circle cx="{sunX}" cy="{sunY}" r="160" fill="url(#sun)"/>`
		v += `<path d="M0 {h1} C 240 {h2} 420 {h3} 640 {h4} C 860 {h5} 1020 {h6} 1200 {h7} L1200 900 L0 900 Z" fill="{c3}" fill-opacity="0.5"/>`
		v += `<path d="M0 {h8} C 260 {h9} 470 {h10} 700 {h11} C 920 {h12} 1060 {h13} 1200 {h14} L1200 900 L0 900 Z" fill="{c2a}" fill-opacity="0.78"/>`
		v += bokeh + close

		kv := map[string]string{
			"c0": c[0], "c1": c[1], "c3": c3[1], "c2a": c2[0],
			"sunX": sunX, "sunY": sunY,
			"h1": itoa(horizon), "h2": itoa(horizon - 60), "h3": itoa(horizon + 10), "h4": itoa(horizon - 30),
			"h5": itoa(horizon + 20), "h6": itoa(horizon - 50), "h7": itoa(horizon - 20),
			"h8": itoa(horizon + 110), "h9": itoa(horizon + 40), "h10": itoa(horizon + 130),
			"h11": itoa(horizon + 60), "h12": itoa(horizon + 140), "h13": itoa(horizon + 30), "h14": itoa(horizon + 90),
		}
		return fill(open+v, kv)

	case 1: // 雾面与光斑
		v := ``
		v += `<linearGradient id="sky" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0" stop-color="{c0}"/><stop offset="0.55" stop-color="{c1}"/><stop offset="1" stop-color="{c3}"/></linearGradient>`
		v += `<radialGradient id="mist" cx="0.62" cy="0.36" r="0.52"><stop offset="0" stop-color="#ffffff" stop-opacity="0.3"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>`
		v += vig
		v += `</defs><rect width="1200" height="900" fill="url(#sky)"/><rect width="1200" height="900" fill="url(#mist)"/>`
		v += bokeh
		v += `<rect y="660" width="1200" height="240" fill="{c2a}" fill-opacity="0.16"/>`
		v += `<rect y="740" width="1200" height="160" fill="{c2b}" fill-opacity="0.14"/>`
		v += close
		return fill(open+v, map[string]string{"c0": c[0], "c1": c[1], "c3": c[1], "c2a": c3[1], "c2b": c2[0]})

	default: // 远山与水面倒影
		v := ``
		v += `<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c0}"/><stop offset="1" stop-color="{c1}"/></linearGradient>`
		v += `<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{c2a}" stop-opacity="0.45"/><stop offset="1" stop-color="{c2b}" stop-opacity="0.9"/></linearGradient>`
		v += vig
		v += `</defs><rect width="1200" height="900" fill="url(#sky)"/>`
		v += `<path d="M0 400 L200 250 L360 380 L520 210 L700 400 Z" fill="{c3}" fill-opacity="0.4"/>`
		v += `<path d="M420 430 L640 270 L820 430 Z" fill="{c3}" fill-opacity="0.3"/>`
		v += `<rect y="430" width="1200" height="470" fill="url(#water)"/>`
		v += `<rect y="472" width="1200" height="2" fill="#ffffff" fill-opacity="0.45"/>`
		v += `<rect y="546" width="1200" height="2" fill="#ffffff" fill-opacity="0.28"/>`
		v += `<rect y="634" width="1200" height="2" fill="#ffffff" fill-opacity="0.16"/>`
		v += bokeh + close
		return fill(open+v, map[string]string{
			"c0": c[0], "c1": c[1], "c3": c3[0], "c2a": c2[1], "c2b": c2[0],
		})
	}
}

// fill 用 {key} 占位符替换，避免格式化字符串的参数错位。
func fill(tpl string, kv map[string]string) string {
	for k, v := range kv {
		tpl = strings.ReplaceAll(tpl, "{"+k+"}", v)
	}
	return tpl
}

func itoa(n int) string { return fmt.Sprintf("%d", n) }

// WriteAsset 把文本素材写到磁盘，返回可直接访问的 URL 路径。
func WriteAsset(dir, name, body, urlPrefix string) (string, error) {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", err
	}
	if err := os.WriteFile(filepath.Join(dir, name), []byte(body), 0o644); err != nil {
		return "", err
	}
	return path.Join(urlPrefix, name), nil
}

// ---------- 内置免费音乐 ----------
//
// 这些音轨由程序实时合成（缓慢和弦 + 呼吸式音量），不依赖任何外部曲库，
// 也不会涉及第三方版权。用于「背景音乐库」的免费曲目。

type Track struct {
	ID      string
	Title   string
	Mood    string
	Seconds int
}

// Tracks 是内置音乐库；文件由 SeedAssets 写入 uploads。
var Tracks = []Track{
	{ID: "night", Title: "夜航", Mood: "安静 · 深夜", Seconds: 40},
	{ID: "dawn", Title: "晨雾", Mood: "清澈 · 清晨", Seconds: 36},
	{ID: "walk", Title: "远山", Mood: "舒展 · 行走", Seconds: 40},
}

func TrackFile(id string) string { return "music-" + id + ".wav" }

const sampleRate = 44100

// chordsFor 返回四个和弦（Hz）与每段时长（秒）、整体音量。
func chordsFor(kind string) ([][]float64, int, float64) {
	switch kind {
	case "dawn":
		return [][]float64{
			{261.63, 329.63, 392.00},
			{196.00, 261.63, 329.63},
			{220.00, 261.63, 329.63},
			{174.61, 220.00, 261.63},
		}, 9, 0.15
	case "walk":
		return [][]float64{
			{146.83, 185.00, 220.00},
			{110.00, 146.83, 185.00},
			{123.47, 146.83, 185.00},
			{98.00, 123.47, 146.83},
		}, 7, 0.16
	default: // night
		return [][]float64{
			{110.00, 130.81, 164.81},
			{87.31, 110.00, 130.81},
			{98.00, 123.47, 146.83},
			{82.41, 98.00, 123.47},
		}, 10, 0.17
	}
}

// AmbientTrack 合成一段循环无缝的环境音（44.1kHz / 16bit / 单声道 PCM）。
func AmbientTrack(kind string, seconds int) []byte {
	chords, segSec, gain := chordsFor(kind)
	frames := sampleRate * seconds
	seg := segSec * sampleRate
	data := make([]byte, frames*2)

	for i := 0; i < frames; i++ {
		pos := float64(i) / float64(seg)
		idx := int(pos) % len(chords)
		next := (idx + 1) % len(chords)
		mix := smoothstep(0.7, 1.0, pos-math.Floor(pos))

		var v float64
		for k, f := range chords[idx] {
			v += math.Sin(2*math.Pi*f*float64(i)/sampleRate) * (1 - mix) * amp(k)
		}
		for k, f := range chords[next] {
			v += math.Sin(2*math.Pi*f*float64(i)/sampleRate) * mix * amp(k)
		}

		// 呼吸：让长音有起伏，听起来不像测试音
		breath := 0.78 + 0.22*math.Sin(2*math.Pi*float64(i)/float64(sampleRate*13))
		v *= breath * gain

		// 首尾各 1.2 秒淡入淡出，循环时不会有爆音
		edge := 1.0
		fade := int(sampleRate * 1.2)
		if i < fade {
			edge = float64(i) / float64(fade)
		}
		if tail := frames - i; tail < fade {
			edge = float64(tail) / float64(fade)
		}
		v *= edge

		s := int16(math.Max(-1, math.Min(1, v)) * 32767)
		binary.LittleEndian.PutUint16(data[i*2:], uint16(s))
	}
	return append(wavHeader(len(data)), data...)
}

func amp(i int) float64 {
	return []float64{1.0, 0.62, 0.45}[i%3]
}

func smoothstep(a, b, x float64) float64 {
	if x <= a {
		return 0
	}
	if x >= b {
		return 1
	}
	t := (x - a) / (b - a)
	return t * t * (3 - 2*t)
}

func wavHeader(dataLen int) []byte {
	h := make([]byte, 44)
	copy(h[0:], "RIFF")
	binary.LittleEndian.PutUint32(h[4:], uint32(36+dataLen))
	copy(h[8:], "WAVEfmt ")
	binary.LittleEndian.PutUint32(h[16:], 16)
	binary.LittleEndian.PutUint16(h[20:], 1)
	binary.LittleEndian.PutUint16(h[22:], 1)
	binary.LittleEndian.PutUint32(h[24:], sampleRate)
	binary.LittleEndian.PutUint32(h[28:], sampleRate*2)
	binary.LittleEndian.PutUint16(h[32:], 2)
	binary.LittleEndian.PutUint16(h[34:], 16)
	copy(h[36:], "data")
	binary.LittleEndian.PutUint32(h[40:], uint32(dataLen))
	return h
}

// SafeExt 校验并归一化图片扩展名。
func SafeExt(name, contentType string) (string, bool) {
	switch strings.ToLower(contentType) {
	case "image/jpeg":
		return ".jpg", true
	case "image/png":
		return ".png", true
	case "image/gif":
		return ".gif", true
	case "image/webp":
		return ".webp", true
	case "image/svg+xml":
		return ".svg", true
	case "image/avif":
		return ".avif", true
	}
	ext := strings.ToLower(filepath.Ext(name))
	switch ext {
	case ".jpg", ".jpeg":
		return ".jpg", true
	case ".png", ".gif", ".webp", ".svg", ".avif":
		return ext, true
	}
	return "", false
}

// AudioExt 校验音频类型。
func AudioExt(name, contentType string) (string, bool) {
	switch strings.ToLower(contentType) {
	case "audio/mpeg":
		return ".mp3", true
	case "audio/mp4", "audio/x-m4a", "audio/aac":
		return ".m4a", true
	case "audio/ogg":
		return ".ogg", true
	case "audio/wav", "audio/x-wav", "audio/wave":
		return ".wav", true
	case "audio/flac":
		return ".flac", true
	}
	switch strings.ToLower(filepath.Ext(name)) {
	case ".mp3", ".m4a", ".aac", ".ogg", ".wav", ".flac":
		return strings.ToLower(filepath.Ext(name)), true
	}
	return "", false
}
