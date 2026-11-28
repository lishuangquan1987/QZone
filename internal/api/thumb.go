package api

import (
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"golang.org/x/image/draw"
	_ "golang.org/x/image/webp" // 注册 webp 解码器；前端压缩后上传的就是 webp

	// image.Decode 是按注册的解码器分发的：缺了对应格式就解不出来，
	// buildThumb 会静默失败回退原图。jpg 由 image/jpeg 编码时顺带注册。
	_ "image/gif"
	_ "image/png"
)

// 只允许这几个宽度，避免 ?w= 任意值把磁盘塞满
var thumbWidths = map[int]bool{240: true, 400: true, 480: true, 800: true}

// 解码一张 30MB 的原图很吃内存，同时最多做两张
var thumbGate = make(chan struct{}, 2)

var thumbLocks sync.Map

func thumbLock(key string) *sync.Mutex {
	v, _ := thumbLocks.LoadOrStore(key, &sync.Mutex{})
	return v.(*sync.Mutex)
}

// serveThumb 尝试用缩略图响应；返回 false 表示这张图不做缩略图，交给原图。
func (s *Server) serveThumb(w http.ResponseWriter, r *http.Request, rel string, width int) bool {
	switch strings.ToLower(filepath.Ext(rel)) {
	case ".jpg", ".jpeg", ".png", ".webp", ".gif":
	default:
		return false
	}

	// bench.jpg -> .thumb/480/.../bench.jpg（换个扩展名就会变成 bench.jpg.jpg）
	thumbName := strings.TrimSuffix(rel, filepath.Ext(rel)) + ".jpg"
	dst := filepath.Join(s.uploads, ".thumb", strconv.Itoa(width), filepath.FromSlash(thumbName))
	if st, err := os.Stat(dst); err == nil && st.Size() > 0 {
		serveThumbFile(w, r, dst)
		return true
	}

	mu := thumbLock(rel + "|" + strconv.Itoa(width))
	mu.Lock()
	defer mu.Unlock()

	// 等锁期间可能已经被别的请求生成好了
	if st, err := os.Stat(dst); err == nil && st.Size() > 0 {
		serveThumbFile(w, r, dst)
		return true
	}

	thumbGate <- struct{}{}
	err := s.buildThumb(rel, dst, width)
	<-thumbGate
	if err != nil {
		return false
	}
	serveThumbFile(w, r, dst)
	return true
}

func serveThumbFile(w http.ResponseWriter, r *http.Request, name string) {
	w.Header().Set("Content-Type", "image/jpeg")
	w.Header().Set("Cache-Control", "private, max-age=604800")
	http.ServeFile(w, r, name)
}

func (s *Server) buildThumb(rel, dst string, width int) error {
	src := filepath.Join(s.uploads, filepath.FromSlash(rel))
	f, err := os.Open(src)
	if err != nil {
		return err
	}
	defer f.Close()

	// 先读尺寸：超大图直接放弃缩略图，别把内存打爆
	cfg, _, err := image.DecodeConfig(f)
	if err != nil {
		return err
	}
	if cfg.Width <= 0 || cfg.Height <= 0 || cfg.Width > 12000 || cfg.Height > 12000 {
		return fmt.Errorf("尺寸超出范围")
	}
	if _, err := f.Seek(0, io.SeekStart); err != nil {
		return err
	}

	img, _, err := image.Decode(f)
	if err != nil {
		return err
	}

	b := img.Bounds()
	w := width
	if b.Dx() < w {
		w = b.Dx()
	}
	h := b.Dy() * w / b.Dx()
	if h <= 0 {
		h = 1
	}
	canvas := image.NewRGBA(image.Rect(0, 0, w, h))
	draw.CatmullRom.Scale(canvas, canvas.Bounds(), img, b, draw.Over, nil)

	if err := os.MkdirAll(filepath.Dir(dst), 0o755); err != nil {
		return err
	}
	tmp := dst + ".tmp"
	out, err := os.Create(tmp)
	if err != nil {
		return err
	}
	if err := jpeg.Encode(out, canvas, &jpeg.Options{Quality: 82}); err != nil {
		_ = out.Close()
		_ = os.Remove(tmp)
		return err
	}
	if err := out.Close(); err != nil {
		_ = os.Remove(tmp)
		return err
	}
	return os.Rename(tmp, dst)
}
