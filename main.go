package main

import (
	"context"
	"embed"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"qzone/ent/session"
	"qzone/internal/api"
	"qzone/internal/db"
	"qzone/internal/seed"
)

// 前端构建产物随二进制发布，部署只需一个可执行文件。
//
//go:embed all:web/dist
var webDist embed.FS

// version 由构建参数注入：-ldflags "-X main.version=v1.2.0"
var version = "dev"

func main() {
	addr := flag.String("addr", ":8080", "监听地址")
	dataDir := flag.String("data", "data", "数据与上传目录")
	maxImageMB := flag.Int("max-image", 30, "单张图片上限（MB）")
	maxAudioMB := flag.Int("max-audio", 50, "单段音频上限（MB）")
	flag.Parse()

	uploads := filepath.Join(*dataDir, "uploads")
	if err := os.MkdirAll(uploads, 0o755); err != nil {
		log.Fatalf("创建上传目录失败: %v", err)
	}

	client, err := db.Open(filepath.Join(*dataDir, "qzone.db"))
	if err != nil {
		log.Fatalf("打开数据库失败: %v", err)
	}
	defer client.Close()

	ctx := context.Background()
	// 过期会话不会自己消失，启动时顺手清掉
	if n, err := client.Session.Delete().Where(session.ExpiresAtLT(time.Now())).Exec(ctx); err == nil && n > 0 {
		log.Printf("清理过期会话 %d 条", n)
	}
	empty, err := db.Empty(ctx, client)
	if err != nil {
		log.Fatalf("检查数据库失败: %v", err)
	}
	if empty {
		log.Println("首次启动，正在创建示例空间…")
		if err := seed.Run(ctx, client, uploads); err != nil {
			log.Fatalf("初始化示例数据失败: %v", err)
		}
	}

	sub, err := fs.Sub(webDist, "web/dist")
	if err != nil {
		log.Fatalf("前端资源异常: %v", err)
	}

	srv := api.New(client, uploads, sub, api.Options{
		MaxImage: int64(*maxImageMB) << 20,
		MaxAudio: int64(*maxAudioMB) << 20,
	})
	httpSrv := &http.Server{
		Addr:              *addr,
		Handler:           srv.Handler(),
		ReadHeaderTimeout: 10 * time.Second,
	}

	display := *addr
	if strings.HasPrefix(display, ":") {
		display = "localhost" + display
	}
	if strings.HasPrefix(display, "0.0.0.0:") {
		display = "localhost:" + strings.TrimPrefix(display, "0.0.0.0:")
	}
	log.Printf("个人空间 %s 已启动: http://%s", version, display)
	log.Printf("演示账号: 294388344 / qzone123 · linwan / qzone123")
	if err := httpSrv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("服务退出: %v", err)
	}
}
