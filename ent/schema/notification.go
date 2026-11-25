package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Notification struct{ ent.Schema }

func (Notification) Fields() []ent.Field {
	return []ent.Field{
		field.Int("to_id"),
		field.Int("from_id"),
		field.String("kind").Default("system"),
		field.String("text").Default(""),
		field.String("target").Default(""),
		field.Bool("read").Default(false),
		field.Time("created_at").Default(time.Now),
	}
}

func (Notification) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("to", User.Type).Ref("notifications").Unique().Required().Field("to_id"),
		edge.From("from", User.Type).Ref("sent_notifications").Unique().Required().Field("from_id"),
	}
}
