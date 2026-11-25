package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// Post 是合并后的「文章」：短则可当说说，长则是一篇博客日志，正文为 Markdown。
type Post struct{ ent.Schema }

func (Post) Fields() []ent.Field {
	return []ent.Field{
		field.Int("author_id"),
		field.String("title").Default(""),
		field.Text("content").Default("").Comment("Markdown 正文"),
		field.String("summary").Default(""),
		field.String("cover").Default(""),
		field.String("category").Default("随笔"),
		field.Strings("images").Default([]string{}),
		field.String("visibility").Default("public").Comment("public|unlisted|private"),
		field.Bool("pinned").Default(false),
		field.Int("views").Default(0),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (Post) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("author", User.Type).Ref("posts").Unique().Required().Field("author_id"),
		edge.To("comments", Comment.Type),
		edge.To("likes", PostLike.Type),
	}
}

func (Post) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("created_at"),
		index.Fields("category"),
	}
}
