package db

import (
	"context"
	"database/sql"
	"fmt"
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
func Open(path string) (*ent.Client, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return nil, err
	}
	dsn := fmt.Sprintf("file:%s?_pragma=busy_timeout(8000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)&_pragma=synchronous(NORMAL)", filepath.ToSlash(path))
	drv, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}
	drv.SetMaxOpenConns(1) // SQLite 单写者，串行化避免 SQLITE_BUSY
	drv.SetMaxIdleConns(1)
	drv.SetConnMaxLifetime(time.Hour)

	client := ent.NewClient(ent.Driver(entsql.OpenDB(dialect.SQLite, drv)))
	if err := client.Schema.Create(context.Background(),
		schema.WithDropIndex(true),
	); err != nil {
		client.Close()
		return nil, err
	}
	return client, nil
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
