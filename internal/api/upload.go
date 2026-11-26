package api

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"time"

	"qzone/ent"
	"qzone/internal/media"
)

// saveUpload 把上传文件落到 uploads/<uin>/<yyyymm>/<random><ext>，返回可访问 URL。
func (s *Server) saveUpload(r *http.Request, me *ent.User, field string, limit int64, audio bool) (string, error) {
	if err := r.ParseMultipartForm(limit + (4 << 20)); err != nil {
		return "", fmt.Errorf("文件超过上限（%s），或上传格式不正确", humanSize(limit))
	}
	file, hdr, err := r.FormFile(field)
	if err != nil {
		return "", errors.New("没有收到文件")
	}
	defer file.Close()

	ct := hdr.Header.Get("Content-Type")
	var ext string
	var ok bool
	if audio {
		ext, ok = media.AudioExt(hdr.Filename, ct)
	} else {
		ext, ok = media.SafeExt(hdr.Filename, ct)
	}
	if !ok {
		if audio {
			return "", errors.New("仅支持 MP3 / M4A / OGG / WAV / FLAC")
		}
		return "", errors.New("仅支持 JPG / PNG / GIF / WEBP / SVG / AVIF")
	}

	now := time.Now()
	rel := path.Join(me.Uin, now.Format("200601"), randName()+ext)
	abs := filepath.Join(s.uploads, filepath.FromSlash(rel))
	if err := os.MkdirAll(filepath.Dir(abs), 0o755); err != nil {
		return "", err
	}
	dst, err := os.Create(abs)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	n, err := io.Copy(dst, io.LimitReader(file, limit+1))
	if err != nil {
		_ = os.Remove(abs)
		return "", err
	}
	if n > limit {
		_ = os.Remove(abs)
		return "", fmt.Errorf("文件超过上限（%s）", humanSize(limit))
	}
	return "/media/" + filepath.ToSlash(rel), nil
}

func (s *Server) uploadImage(w http.ResponseWriter, r *http.Request, me *ent.User) {
	url, err := s.saveUpload(r, me, "file", s.maxImage, false)
	if err != nil {
		fail(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"url": url})
}

// uploadAudio 上传背景音乐，返回地址后由前端播放器真实播放。
func (s *Server) uploadAudio(w http.ResponseWriter, r *http.Request, me *ent.User) {
	url, err := s.saveUpload(r, me, "file", s.maxAudio, true)
	if err != nil {
		fail(w, http.StatusBadRequest, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"url": url})
}

func randName() string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// humanSize 把字节数写成易读的大小。
func humanSize(n int64) string {
	if n >= 1<<20 {
		v := float64(n) / (1 << 20)
		if v == float64(int64(v)) {
			return fmt.Sprintf("%d MB", int64(v))
		}
		return fmt.Sprintf("%.1f MB", v)
	}
	return fmt.Sprintf("%d KB", n>>10)
}
