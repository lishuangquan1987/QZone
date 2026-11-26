package api

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"net/http"
	"regexp"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"

	"qzone/ent"
	"qzone/ent/session"
	"qzone/ent/user"
	"qzone/internal/media"
)

var (
	uinPattern = regexp.MustCompile(`^[a-zA-Z0-9_]{3,20}$`)
	errDupUIN  = errors.New("uin exists")
)

func newToken() string {
	b := make([]byte, 24)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func hashPassword(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}

func checkPassword(hash, pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw)) == nil
}

type authReq struct {
	UIN      string `json:"uin"`
	Nickname string `json:"nickname"`
	Password string `json:"password"`
}

// register 开放注册：空间号唯一，昵称可重复。
func (s *Server) register(w http.ResponseWriter, r *http.Request) {
	var req authReq
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	uin := strings.TrimSpace(req.UIN)
	nick := strings.TrimSpace(req.Nickname)
	if !uinPattern.MatchString(uin) {
		fail(w, http.StatusBadRequest, "空间号需为 3-20 位字母、数字或下划线")
		return
	}
	if n := len([]rune(nick)); n < 1 || n > 20 {
		fail(w, http.StatusBadRequest, "昵称需为 1-20 个字")
		return
	}
	if len(req.Password) < 6 {
		fail(w, http.StatusBadRequest, "密码至少 6 位")
		return
	}

	ctx := r.Context()
	exist, err := s.db.User.Query().Where(user.Uin(uin)).Exist(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}
	if exist {
		fail(w, http.StatusConflict, "该空间号已被注册，换一个试试")
		return
	}

	hash, err := hashPassword(req.Password)
	if err != nil {
		writeErr(w, err)
		return
	}

	// 新用户默认生成一套视觉素材，注册完就有完整外观
	seedIdx := time.Now().UnixNano()
	avatar, _ := media.WriteAsset(s.uploads+"/"+uin, "avatar.svg", media.Avatar(int(seedIdx%8)), "/media/"+uin)
	cover, _ := media.WriteAsset(s.uploads+"/"+uin, "cover.svg", media.Cover(int(seedIdx%8)), "/media/"+uin)

	u, err := s.db.User.Create().
		SetUin(uin).
		SetNickname(nick).
		SetPasswordHash(hash).
		SetAvatar(avatar).
		SetCover(cover).
		SetSignature("刚刚开通了自己的空间").
		SetTheme("aurora").
		SetLevel(1).
		SetTags([]string{}).
		Save(ctx)
	if err != nil {
		writeErr(w, err)
		return
	}

	if err := s.issueSession(ctx, w, u); err != nil {
		writeErr(w, err)
		return
	}

	view, err := s.userView(ctx, u, u.ID)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"user": view, "unread": 0})
}

func (s *Server) login(w http.ResponseWriter, r *http.Request) {
	var req authReq
	if err := decode(r, &req); err != nil {
		fail(w, http.StatusBadRequest, "请求格式有误")
		return
	}
	ctx := r.Context()
	uin := strings.TrimSpace(req.UIN)
	limitKey := clientIP(r) + "|" + strings.ToLower(uin)
	if !loginLimiter.allow(limitKey, 8, 5*time.Minute) {
		fail(w, http.StatusTooManyRequests, "尝试次数过多，请 5 分钟后再试")
		return
	}
	u, err := s.db.User.Query().Where(user.Uin(uin)).Only(ctx)
	if err != nil || !checkPassword(u.PasswordHash, req.Password) {
		fail(w, http.StatusUnauthorized, "空间号或密码不正确")
		return
	}
	loginLimiter.reset(limitKey)
	if err := s.issueSession(ctx, w, u); err != nil {
		writeErr(w, err)
		return
	}
	view, err := s.userView(ctx, u, u.ID)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"user":   view,
		"unread": unreadCount(ctx, s.db, u.ID),
	})
}

func (s *Server) logout(w http.ResponseWriter, r *http.Request) {
	if c, err := r.Cookie(sessionCookie); err == nil && c.Value != "" {
		_, _ = s.db.Session.Delete().Where(session.TokenEQ(c.Value)).Exec(r.Context())
	}
	http.SetCookie(w, &http.Cookie{Name: sessionCookie, Value: "", Path: "/", MaxAge: -1, HttpOnly: true})
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) sessionInfo(w http.ResponseWriter, r *http.Request) {
	u := s.currentUser(r)
	if u == nil {
		writeJSON(w, http.StatusOK, map[string]any{"authenticated": false})
		return
	}
	ctx := r.Context()
	view, err := s.userView(ctx, u, u.ID)
	if err != nil {
		writeErr(w, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"authenticated": true,
		"user":          view,
		"unread":        unreadCount(ctx, s.db, u.ID),
	})
}

var _ = ent.IsNotFound
