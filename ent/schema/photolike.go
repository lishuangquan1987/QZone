package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type PhotoLike struct{ ent.Schema }

func (PhotoLike) Fields() []ent.Field {
	return []ent.Field{
		field.Int("photo_id"),
		field.Int("user_id"),
		field.Time("created_at").Default(time.Now),
	}
}

func (PhotoLike) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("photo", Photo.Type).Ref("likes").Unique().Required().Field("photo_id"),
		edge.From("user", User.Type).Ref("photo_likes").Unique().Required().Field("user_id"),
	}
}

func (PhotoLike) Indexes() []ent.Index {
	return []ent.Index{index.Edges("photo", "user").Unique()}
}
