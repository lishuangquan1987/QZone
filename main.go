package main

import (
	"context"
	"embed"
	"flag"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
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
	trustProxy := flag.Bool("trust-proxy", false, "前面有可信反代时打开，才会采信 X-Forwarded-For")
	backupTo := flag.String("backup-to", "", "把数据库快照写到该文件后退出（VACUUM INTO）")
	flag.Parse()

	uploads := filepath.Join(*dataDir, "uploads")
	if err := os.MkdirAll(uploads, 0o755); err != nil {
		log.Fatalf("创建上传目录失败: %v", err)
	}

	client, sqlDB, err := db.Open(filepath.Join(*dataDir, "qzone.db"))
	if err != nil {
		log.Fatalf("打开数据库失败: %v", err)
	}
	defer client.Close()

	ctx := context.Background()
	if *backupTo != "" {
		if err := db.Backup(ctx, sqlDB, *backupTo); err != nil {
			log.Fatalf("备份失败: %v", err)
		}
		log.Printf("已备份到 %s", *backupTo)
		return
	}
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

	srv := api.New(client, sqlDB, uploads, sub, api.Options{
		MaxImage:   int64(*maxImageMB) << 20,
		MaxAudio:   int64(*maxAudioMB) << 20,
		TrustProxy: *trustProxy,
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

	// 收到 SIGTERM（docker stop）时先把在途请求处理完，再关库。
	// 之前是直接被杀掉，长请求会断在半路。
	sigCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-sigCtx.Done()
		log.Println("收到退出信号，等待在途请求结束…")
		shutCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := httpSrv.Shutdown(shutCtx); err != nil {
			log.Printf("关闭时出错: %v", err)
		}
	}()

	if err := httpSrv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("服务退出: %v", err)
	}
	log.Println("已退出")
}
