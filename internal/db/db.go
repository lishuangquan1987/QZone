package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/schema"
	_ "modernc.org/sqlite" // 纯 Go SQLite 驱动，无需 cgo

	"qzone/ent"
	"qzone/ent/user"
)

// Open 打开（必要时创建）SQLite 数据库，返回 ent 客户端。
//
// 使用 modernc.org/sqlite：纯 Go 实现，可静态编译、跨平台交叉编译不需要 CGO。
func Open(path string) (*ent.Client, *sql.DB, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return nil, nil, err
	}
	dsn := fmt.Sprintf("file:%s?_pragma=busy_timeout(10000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)&_pragma=synchronous(NORMAL)", filepath.ToSlash(path))
	drv, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, nil, err
	}
	// WAL 模式允许多读 + 单写。个人站的写并发极低（浏览量批量落库、发文章），
	// 读并发才是常态：把池子放开，读请求不再排队在单连接后串行等待。
	// 偶发的写锁冲突由 busy_timeout 兜底（等待最多 10 秒）。
	drv.SetMaxOpenConns(8)
	drv.SetMaxIdleConns(8)
	drv.SetConnMaxLifetime(time.Hour)

	client := ent.NewClient(ent.Driver(entsql.OpenDB(dialect.SQLite, drv)))
	if err := client.Schema.Create(context.Background(),
		schema.WithDropIndex(true),
	); err != nil {
		client.Close()
		return nil, nil, err
	}
	if err := ensurePostsFTS(drv); err != nil {
		log.Printf("警告：FTS5 全文索引初始化失败，搜索回退 LIKE：%v", err)
	}
	return client, drv, nil
}

// ensurePostsFTS 建 posts 的全文索引（FTS5 trigram）。
//
// LIKE %kw% 对 5000 篇文章要 5.7ms，2 万篇会线性恶化；trigram 分词器
// 支持任意子串（含中文），正好匹配搜索框的语义。external content 模式
// 不复制正文，靠触发器与 posts 表保持同步，存量文章首次启动时回填。
// 注意：WithDropIndex 的迁移只管理 ent schema 声明的对象，不会动这张表。
func ensurePostsFTS(d *sql.DB) error {
	ctx := context.Background()
	stmts := []string{
		`CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
			title, content, content='posts', content_rowid='id', tokenize='trigram')`,
		`CREATE TRIGGER IF NOT EXISTS posts_fts_insert AFTER INSERT ON posts BEGIN
			INSERT INTO posts_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
		END`,
		`CREATE TRIGGER IF NOT EXISTS posts_fts_delete AFTER DELETE ON posts BEGIN
			INSERT INTO posts_fts(posts_fts, rowid, title, content)
				VALUES ('delete', old.id, old.title, old.content);
		END`,
		`CREATE TRIGGER IF NOT EXISTS posts_fts_update AFTER UPDATE ON posts BEGIN
			INSERT INTO posts_fts(posts_fts, rowid, title, content)
				VALUES ('delete', old.id, old.title, old.content);
			INSERT INTO posts_fts(rowid, title, content) VALUES (new.id, new.title, new.content);
		END`,
		// 回填存量：external content 表的 SELECT 直接读 posts，不能用
		// NOT IN(rowid) 判断是否已回填（永远为假，索引会一直空着）。
		// rebuild 是 FTS5 内置命令，从 content 表整表重建索引，幂等且快。
		`INSERT INTO posts_fts(posts_fts) VALUES ('rebuild')`,
	}
	for _, q := range stmts {
		if _, err := d.ExecContext(ctx, q); err != nil {
			return err
		}
	}
	return nil
}

// Backup 用 VACUUM INTO 生成一份一致的快照。
// 直接 cp 一个正在写入的 SQLite 文件（还有 -wal）可能拿到半截数据。
func Backup(ctx context.Context, d *sql.DB, dst string) error {
	if err := os.MkdirAll(filepath.Dir(dst), 0o755); err != nil {
		return err
	}
	_ = os.Remove(dst) // VACUUM INTO 要求目标文件不存在
	_, err := d.ExecContext(ctx, "VACUUM INTO ?", filepath.ToSlash(dst))
	return err
}

// Empty 判断库中是否还没有任何账号。
func Empty(ctx context.Context, c *ent.Client) (bool, error) {
	n, err := c.User.Query().Count(ctx)
	if err != nil {
		return false, err
	}
	return n == 0, nil
}

// FindByUIN 按空间号查询用户。
func FindByUIN(ctx context.Context, c *ent.Client, uin string) (*ent.User, error) {
	return c.User.Query().Where(user.Uin(uin)).Only(ctx)
}
