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
<circle cx="1290" cy="126" r="72" fill="#ffffff" fill-opacity="0.55"/>
<circle cx="1290" cy="126" r="150" fill="#ffffff" fill-opacity="0.12"/>
<path d="M0 396 C 220 306 420 372 620 330 C 840 284 1020 366 1220 330 C 1400 298 1500 350 1600 322 L1600 520 L0 520 Z" fill="url(#hill)"/>
<path d="M0 448 C 280 386 480 442 720 414 C 960 386 1180 448 1600 402 L1600 520 L0 520 Z" fill="#ffffff" fill-opacity="0.24"/>
<g fill="#ffffff" fill-opacity="0.4"><circle cx="320" cy="140" r="3"/><circle cx="470" cy="96" r="2.2"/><circle cx="620" cy="170" r="2.6"/><circle cx="860" cy="80" r="2"/></g>
</svg>`
}

// Photo 生成一张抽象「照片」，用于示例相册。
func Photo(i int) string {
	c := palette(i)
	c2 := palette(i + 5)
	cx := 190 + (i*137)%700
	cy := 150 + (i*89)%300
	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="` + c[0] + `"/><stop offset="1" stop-color="` + c[1] + `"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffffff" stop-opacity="0.8"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="` + c2[0] + `" stop-opacity="0.6"/><stop offset="1" stop-color="` + c2[1] + `" stop-opacity="0.12"/></linearGradient>
</defs>
<rect width="1200" height="900" fill="url(#bg)"/>
<circle cx="` + itoa(cx) + `" cy="` + itoa(cy) + `" r="300" fill="url(#glow)"/>
<circle cx="` + itoa(cx) + `" cy="` + itoa(cy) + `" r="96" fill="#ffffff" fill-opacity="0.6"/>
<path d="M0 690 C 200 610 380 690 590 632 C 800 574 980 664 1200 610 L1200 900 L0 900 Z" fill="url(#band)"/>
<path d="M0 780 C 240 720 450 782 700 748 C 950 714 1050 772 1200 738 L1200 900 L0 900 Z" fill="` + c2[1] + `" fill-opacity="0.4"/>
<g fill="#ffffff" fill-opacity="0.5"><circle cx="180" cy="220" r="3.5"/><circle cx="320" cy="150" r="2.6"/><circle cx="960" cy="200" r="3"/><circle cx="1040" cy="120" r="2.4"/></g>
</svg>`
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

// ---------- 示例背景音乐 ----------
//
// 生成一段可直接播放的 WAV（44.1kHz / 16bit / 单声道），
// 由几个缓慢变化的和弦叠加而成，用作演示空间的背景音乐。

const sampleRate = 44100

func AmbientWAV(seconds int) []byte {
	frames := sampleRate * seconds
	data := make([]byte, frames*2)

	// 每个和弦持续 8 秒，音高（Hz）取自 A 小调色彩的和声
	chords := [][]float64{
		{220.00, 261.63, 329.63}, // Am
		{174.61, 220.00, 261.63}, // F
		{196.00, 246.94, 293.66}, // G
		{164.81, 196.00, 246.94}, // Em
	}
	seg := 8 * sampleRate

	for i := 0; i < frames; i++ {
		// 交叉淡化两个相邻和弦，避免爆音
		pos := float64(i) / float64(seg)
		idx := int(pos) % len(chords)
		next := (idx + 1) % len(chords)
		frac := pos - math.Floor(pos)
		mix := smoothstep(0.72, 1.0, frac)

		var v float64
		for k, f := range chords[idx] {
			v += math.Sin(2*math.Pi*f*float64(i)/sampleRate) * (1 - mix) * amp(k)
		}
		for k, f := range chords[next] {
			v += math.Sin(2*math.Pi*f*float64(i)/sampleRate) * mix * amp(k)
		}
		// 缓慢的音量起伏，听感更像环境音
		breath := 0.72 + 0.28*math.Sin(2*math.Pi*float64(i)/float64(sampleRate*14))
		v *= breath * 0.17

		// 首尾淡入淡出
		edge := 1.0
		if i < sampleRate {
			edge = float64(i) / sampleRate
		}
		if tail := frames - i; tail < sampleRate {
			edge = float64(tail) / sampleRate
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
	binary.LittleEndian.PutUint32(h[16:], 16)          // fmt 块长度
	binary.LittleEndian.PutUint16(h[20:], 1)           // PCM
	binary.LittleEndian.PutUint16(h[22:], 1)           // 单声道
	binary.LittleEndian.PutUint32(h[24:], sampleRate)  // 采样率
	binary.LittleEndian.PutUint32(h[28:], sampleRate*2) // 字节率
	binary.LittleEndian.PutUint16(h[32:], 2)           // 块对齐
	binary.LittleEndian.PutUint16(h[34:], 16)          // 位深
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
