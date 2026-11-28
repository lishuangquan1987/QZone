package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type Photo struct{ ent.Schema }

func (Photo) Fields() []ent.Field {
	return []ent.Field{
		field.Int("album_id"),
		field.String("url").NotEmpty(),
		field.String("caption").Default(""),
		field.Int("width").Default(0),
		field.Int("height").Default(0),
		field.Int64("size").Default(0),
		field.Time("created_at").Default(time.Now),
	}
}

func (Photo) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("album_id"),
		// /media/ 的每次请求都要按 url 反查所在相册
		index.Fields("url"),
	}
}

func (Photo) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("album", Album.Type).Ref("photos").Unique().Required().Field("album_id"),
		edge.To("likes", PhotoLike.Type),
	}
}
