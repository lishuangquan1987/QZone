package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type Visit struct{ ent.Schema }

func (Visit) Fields() []ent.Field {
	return []ent.Field{
		field.Int("host_id"),
		field.Int("visitor_id"),
		field.String("module").Default("个人主页"),
		field.Time("created_at").Default(time.Now),
	}
}

func (Visit) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("host", User.Type).Ref("received_visits").Unique().Required().Field("host_id"),
		edge.From("visitor", User.Type).Ref("visits").Unique().Required().Field("visitor_id"),
	}
}

func (Visit) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("created_at"),
		index.Fields("host_id"),
		index.Fields("visitor_id"),
		// 访客去重要按「主人 + 访客 + 时间」查最近一条
		index.Fields("host_id", "visitor_id", "created_at"),
	}
}
