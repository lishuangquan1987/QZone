package api

import (
	"context"
	"log"
	"strconv"
	"sync"
	"time"

	"qzone/ent"
)

// viewCounter 把浏览量攒在内存里，定时批量落库。
//
// 原来每个详情页 GET 都写一次库：SQLite 只有一个写者，热门文章被反复打开时
// 写锁会把读请求也拖住。这里顺带做了 30 分钟的同 IP 去重，避免刷新刷量。
type viewCounter struct {
	mu      sync.Mutex
	pending map[int]int
	seen    map[string]time.Time
}

func newViewCounter() *viewCounter {
	return &viewCounter{pending: map[int]int{}, seen: map[string]time.Time{}}
}

// hit 记一次浏览，返回这篇文章当前「尚未落库」的累计增量。
func (v *viewCounter) hit(postID int, ip string) int {
	now := time.Now()
	key := ip + "|" + strconv.Itoa(postID)

	v.mu.Lock()
	defer v.mu.Unlock()

	if t, ok := v.seen[key]; ok && now.Sub(t) < 30*time.Minute {
		return v.pending[postID]
	}
	v.seen[key] = now
	v.pending[postID]++

	if len(v.seen) > 20000 {
		for k, t := range v.seen {
			if now.Sub(t) >= 30*time.Minute {
				delete(v.seen, k)
			}
		}
	}
	return v.pending[postID]
}

// pendingFor 返回某篇文章尚未落库的增量，用来给读接口拼出接近实时的数值。
func (v *viewCounter) pendingFor(postID int) int {
	v.mu.Lock()
	defer v.mu.Unlock()
	return v.pending[postID]
}

// flush 把累计值写回数据库；写失败的加回 pending，下次重试。
func (v *viewCounter) flush(ctx context.Context, db *ent.Client) {
	v.mu.Lock()
	batch := v.pending
	v.pending = map[int]int{}
	v.mu.Unlock()

	for id, n := range batch {
		if n <= 0 {
			continue
		}
		if _, err := db.Post.UpdateOneID(id).AddViews(n).Save(ctx); err != nil {
			if ent.IsNotFound(err) {
				continue
			}
			v.mu.Lock()
			v.pending[id] += n
			v.mu.Unlock()
			log.Printf("浏览量落库失败 post=%d: %v", id, err)
		}
	}
}

// startViewFlusher 起一个后台协程，每 20 秒落一次。
func (s *Server) startViewFlusher() {
	go func() {
		t := time.NewTicker(20 * time.Second)
		defer t.Stop()
		for range t.C {
			s.views.flush(context.Background(), s.db)
		}
	}()
}
