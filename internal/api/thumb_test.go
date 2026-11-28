package api

import (
	"image"
	"image/color"
	"image/gif"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
	"testing"
)

// 回归：image.Decode 按注册的解码器分发，缺注册就静默回退原图。
// 曾经只注册了 webp，PNG/GIF 上传的图永远拿不到缩略图。
func TestBuildThumbAllFormats(t *testing.T) {
	dir := t.TempDir()
	s := &Server{uploads: dir}

	src := filepath.Join(dir, "img.png")
	f, err := os.Create(src)
	if err != nil {
		t.Fatal(err)
	}
	if err := png.Encode(f, colorful(400, 300)); err != nil {
		t.Fatal(err)
	}
	f.Close()

	dst := filepath.Join(dir, ".thumb", "800", "img.jpg")
	if err := s.buildThumb("img.png", dst, 800); err != nil {
		t.Fatalf("PNG 缩略图生成失败: %v", err)
	}
	if st, err := os.Stat(dst); err != nil || st.Size() == 0 {
		t.Fatalf("PNG 缩略图文件不存在或为空: %v", err)
	}

	// GIF
	g := filepath.Join(dir, "anim.gif")
	fg, _ := os.Create(g)
	if err := gif.Encode(fg, colorful(500, 200), nil); err != nil {
		t.Fatal(err)
	}
	fg.Close()
	dstG := filepath.Join(dir, ".thumb", "400", "anim.jpg")
	if err := s.buildThumb("anim.gif", dstG, 400); err != nil {
		t.Fatalf("GIF 缩略图生成失败: %v", err)
	}

	// JPEG（顺带确认 jpg 路径仍正常）
	j := filepath.Join(dir, "photo.jpg")
	fj, _ := os.Create(j)
	if err := jpeg.Encode(fj, colorful(900, 600), &jpeg.Options{Quality: 80}); err != nil {
		t.Fatal(err)
	}
	fj.Close()
	dstJ := filepath.Join(dir, ".thumb", "240", "photo.jpg")
	if err := s.buildThumb("photo.jpg", dstJ, 240); err != nil {
		t.Fatalf("JPEG 缩略图生成失败: %v", err)
	}

	// 宽度正确：不放大（原图 400 宽则保持原宽）
	data, err := os.Open(dst)
	if err != nil {
		t.Fatal(err)
	}
	defer data.Close()
	cfg, _, err := image.DecodeConfig(data)
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Width != 400 || cfg.Height != 300 {
		t.Errorf("缩略图尺寸 = %dx%d，期望 400x300（不放大）", cfg.Width, cfg.Height)
	}
}

func TestServeThumbFallsBackGracefully(t *testing.T) {
	dir := t.TempDir()
	s := &Server{uploads: dir}
	// 源文件不存在时必须返回 false（走原图分支），而不是 500
	if s.serveThumb(nil, nil, "missing.png", 800) {
		t.Error("源文件缺失时 serveThumb 应返回 false")
	}
}

func colorful(w, h int) image.Image {
	img := image.NewRGBA(image.Rect(0, 0, w, h))
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			img.Set(x, y, color.RGBA{uint8(x * 255 / w), uint8(y * 255 / h), 128, 255})
		}
	}
	return img
}
