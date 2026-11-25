package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// User 是空间主人，也是登录账号。uin 即登录名与空间地址。
type User struct{ ent.Schema }

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("uin").Unique().NotEmpty().Comment("登录账号 / 空间地址"),
		field.String("nickname").NotEmpty(),
		field.String("password_hash").Sensitive(),
		field.String("avatar").Default(""),
		field.String("cover").Default(""),
		field.String("signature").Default(""),
		field.Text("bio").Default("").Comment("关于页自我介绍，Markdown"),
		field.String("city").Default(""),
		field.String("constellation").Default(""),
		field.Int("gender").Default(0),
		field.Int("age").Default(0),
		field.Int("level").Default(1),
		field.Int("vip").Default(0),
		field.String("theme").Default("aurora"),
		field.String("mood").Default(""),
		field.String("bgm_title").Default(""),
		field.String("bgm_url").Default(""),
		field.Strings("tags"),
		field.Int("sun_value").Default(0),
		field.Int("sign_streak").Default(0),
		field.String("last_sign_in").Default(""),
		field.Int("visit_count").Default(0),
		field.Time("created_at").Default(time.Now).Immutable(),
	}
}

func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("posts", Post.Type),
		edge.To("comments", Comment.Type),
		edge.To("albums", Album.Type),
		edge.To("guestbook_wall", Guestbook.Type),
		edge.To("guestbook_entries", Guestbook.Type),
		edge.To("post_likes", PostLike.Type),
		edge.To("photo_likes", PhotoLike.Type),
		edge.To("received_visits", Visit.Type),
		edge.To("visits", Visit.Type),
		edge.To("notifications", Notification.Type),
		edge.To("sent_notifications", Notification.Type),
		edge.To("sessions", Session.Type),
	}
}
