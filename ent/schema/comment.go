package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type Comment struct{ ent.Schema }

func (Comment) Fields() []ent.Field {
	return []ent.Field{
		field.Int("post_id"),
		field.Int("author_id"),
		field.Text("content"),
		field.String("reply_to").Default("").Comment("被回复者昵称，冗余存储便于渲染"),
		field.Time("created_at").Default(time.Now),
	}
}

func (Comment) Indexes() []ent.Index {
	return []ent.Index{index.Fields("post_id")}
}

func (Comment) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("post", Post.Type).Ref("comments").Unique().Required().Field("post_id"),
		edge.From("author", User.Type).Ref("comments").Unique().Required().Field("author_id"),
	}
}
