package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Guestbook struct{ ent.Schema }

func (Guestbook) Fields() []ent.Field {
	return []ent.Field{
		field.Int("owner_id"),
		field.Int("author_id"),
		field.Text("content"),
		field.String("reply").Default(""),
		field.Time("created_at").Default(time.Now),
	}
}

func (Guestbook) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).Ref("guestbook_wall").Unique().Required().Field("owner_id"),
		edge.From("author", User.Type).Ref("guestbook_entries").Unique().Required().Field("author_id"),
	}
}
