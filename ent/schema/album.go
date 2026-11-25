package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Album struct{ ent.Schema }

func (Album) Fields() []ent.Field {
	return []ent.Field{
		field.Int("owner_id"),
		field.String("name").NotEmpty(),
		field.String("description").Default(""),
		field.String("cover").Default(""),
		field.String("privacy").Default("public"),
		field.Time("created_at").Default(time.Now),
	}
}

func (Album) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("owner", User.Type).Ref("albums").Unique().Required().Field("owner_id"),
		edge.To("photos", Photo.Type),
	}
}
