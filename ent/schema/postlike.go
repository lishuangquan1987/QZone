package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type PostLike struct{ ent.Schema }

func (PostLike) Fields() []ent.Field {
	return []ent.Field{
		field.Int("post_id"),
		field.Int("user_id"),
		field.Time("created_at").Default(time.Now),
	}
}

func (PostLike) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("post", Post.Type).Ref("likes").Unique().Required().Field("post_id"),
		edge.From("user", User.Type).Ref("post_likes").Unique().Required().Field("user_id"),
	}
}

func (PostLike) Indexes() []ent.Index {
	return []ent.Index{index.Edges("post", "user").Unique()}
}
