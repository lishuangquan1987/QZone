package seed

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"golang.org/x/crypto/bcrypt"

	"qzone/ent"
	"qzone/internal/media"
)

// Run 写入一套可用的示例空间：两个账号、若干 Markdown 文章、相册与留言。
// 仅在数据库为空时调用。
func Run(ctx context.Context, db *ent.Client, uploads string) error {
	dir := filepath.Join(uploads, "seed")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}

	asset := func(name, body string) string {
		p, err := media.WriteAsset(dir, name, body, "/media/seed")
		if err != nil {
			return ""
		}
		return p
	}

	hash, err := bcrypt.GenerateFromPassword([]byte("qzone123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// 背景音乐：本地生成的环境音，可直接被浏览器播放
	bgmPath := filepath.Join(dir, "ambient.wav")
	if _, err := os.Stat(bgmPath); os.IsNotExist(err) {
		if err := os.WriteFile(bgmPath, media.AmbientWAV(48), 0o644); err != nil {
			return err
		}
	}

	owner, err := db.User.Create().
		SetUin("294388344").
		SetNickname("Change~生活").
		SetPasswordHash(string(hash)).
		SetAvatar(asset("avatar-owner.svg", media.Avatar(1))).
		SetCover(asset("cover-owner.svg", media.Cover(1))).
		SetSignature("在城市的缝隙里，记录一点缓慢的东西。").
		SetBio(bioText).
		SetCity("广州").
		SetConstellation("天蝎座").
		SetGender(1).
		SetAge(29).
		SetLevel(48).
		SetVip(9).
		SetTheme("aurora").
		SetMood("晴").
		SetBgmTitle("Ambient · 程序生成的环境音").
		SetBgmURL("/media/seed/ambient.wav").
		SetTags([]string{"写作", "摄影", "徒步", "手冲咖啡"}).
		SetSignStreak(37).
		SetSunValue(1280).
		SetVisitCount(18426).
		Save(ctx)
	if err != nil {
		return err
	}

	friend, err := db.User.Create().
		SetUin("linwan").
		SetNickname("林晚").
		SetPasswordHash(string(hash)).
		SetAvatar(asset("avatar-linwan.svg", media.Avatar(2))).
		SetCover(asset("cover-linwan.svg", media.Cover(2))).
		SetSignature("慢慢来，比较快。").
		SetBio("在苏州写代码，也写点别的。\n\n这里放一些读过的书和走过的路。\n").
		SetCity("苏州").
		SetConstellation("巨蟹座").
		SetGender(2).
		SetAge(27).
		SetLevel(41).
		SetVip(7).
		SetTheme("sakura").
		SetMood("多云").
		SetTags([]string{"阅读", "园艺", "猫"}).
		SetSignStreak(12).
		SetSunValue(640).
		SetVisitCount(2613).
		Save(ctx)
	if err != nil {
		return err
	}

	// ---------- 文章 ----------
	type postSeed struct {
		author   *ent.User
		title    string
		summary  string
		category string
		content  string
		cover    string
		images   []string
		views    int
		ago      time.Duration
		pinned   bool
		vis      string
	}

	pic := func(name string, i int) string { return asset(name, media.Photo(i)) }

	p1 := pic("p-winter.svg", 3)
	p2 := pic("p-lake.svg", 4)
	p3 := pic("p-hike.svg", 5)
	p4 := pic("p-desk.svg", 6)

	posts := []postSeed{
		{
			author: owner, title: "凌晨三点的西湖", category: "城市",
			summary: "风把云吹成了一层一层的，湖面像一块没打磨完的玻璃。",
			cover:   p1, images: []string{p1}, views: 1288, ago: 9 * time.Hour, pinned: true,
			content: `凌晨三点的西湖，和白天完全是两个地方。

没有游客，没有举着自拍杆的人，只有几个夜跑的和一个在长椅上睡觉的。风把云吹成了一层一层的，湖面像一块没打磨完的玻璃。

我沿着白堤走了四十分钟，只遇到两个人。

> 城市最安静的时刻，往往藏在所有人都睡着之后。

## 几张照片

![断桥的方向](` + p1 + `)

拍照这件事，我越来越不追求「好看」了。好看的照片太多了，我想拍的是**那一刻我确实站在那里**。

- 光圈 f/2.8，快门 1/15，手持
- 白平衡偏冷，故意没修
- 回来之后只调了对比度

下次想试试带三脚架，拍一张真正的长曝光。`,
		},
		{
			author: owner, title: "把十四年的空间搬回本地", category: "技术",
			summary: "3182 条说说，482 篇日志，9 个相册共 2741 张图，11.4 GB。",
			cover:   p4, views: 2310, ago: 3 * 24 * time.Hour,
			content: `起因是某天发现一条 2013 年的说说图片挂了，只剩下一个红色的叉。

于是我写了脚本，把说说、日志、相册、留言全部抓下来，图片按年月归档，正文转成 Markdown，落到一块移动硬盘和一份对象存储里。

| 类型 | 数量 | 体积 |
| --- | --- | --- |
| 说说 | 3182 条 | 0.4 GB |
| 日志 | 482 篇 | 1.2 GB |
| 相册 | 2741 张 | 9.8 GB |

最麻烦的不是抓取，是图片去重和时区。早期说说的时间戳没有时区，按服务器本地时间存，跨年那几天会错位一小时。

~~~python
def normalize(ts, tz="Asia/Shanghai"):
    if ts.tzinfo is None:
        return ts.replace(tzinfo=ZoneInfo(tz))
    return ts.astimezone(ZoneInfo(tz))
~~~

现在这些东西躺在两个地方，谁也不依赖谁。这大概就是「数字时代的搬家」。`,
		},
		{
			author: owner, title: "梅雨季的杭州", category: "城市",
			summary: "空气是拧不干的毛巾，但荷叶铺满了整个湖面。",
			cover:   p2, images: []string{p2}, views: 642, ago: 12 * 24 * time.Hour,
			content: `杭州的六月，空气是拧不干的毛巾。

早上出门，伞是累赘，不打又不行。地铁口的台阶永远是湿的，每个人走路都带着一点小心翼翼。

但梅雨季有梅雨季的好处。西湖边的树绿得发黑，荷叶铺满整个湖面，雨点打上去是一层细密的响。游客少，长椅上能坐很久。

我在曲院风荷坐了一个下午，什么也没干。

![雨里的荷](` + p2 + `)

回程时雨停了，天边裂开一条很窄的橙色的缝。`,
		},
		{
			author: owner, title: "四千米处重新学习呼吸", category: "旅行",
			summary: "在低海拔生活太久的人，会把呼吸当成理所当然。",
			cover:   p3, images: []string{p3, p1}, views: 1902, ago: 20 * 24 * time.Hour,
			content: `第一天从日隆镇往上走，走了二十分钟就开始喘。向导说别急，把步子放小，跟着呼吸走。

在低海拔生活太久的人，会把呼吸当成理所当然。到了四千米，呼吸变成一件需要被安排的事：**吸气四步，呼气四步，不能乱。**

第三天翻垭口，风大到说不出话。我在一块石头后面坐了很久，看着云从山谷里升起来，一层一层地把远处的雪线盖住。那一刻什么都没想。

![垭口](` + p3 + `)

下山之后回到镇上，第一件事是洗澡，第二件事是吃了一整碗面。

## 装备清单

1. 冲锋衣（必须带抓绒）
2. 登山杖（膝盖不好的人别硬撑）
3. 保温杯，比想象中重要
4. 头灯 + 备用电池`,
		},
		{
			author: owner, title: "关于「记录」这件事", category: "随笔",
			summary: "写下来不是为了被看见，是为了让自己确认：这一天确实发生过。",
			ago:     26 * 24 * time.Hour, views: 908,
			content: `有人问我，写这些东西有人看吗。

没有。大部分文章阅读量是两位数，其中一半是我自己刷新出来的。

但我还是写。

> 写下来不是为了被看见，是为了让自己确认：这一天确实发生过。

二十岁的时候我追求表达，觉得话说得漂亮最重要。现在更在意准确：那天到底几点、什么天气、我当时到底是什么心情。形容词是最不可靠的东西。

所以我会记一些很笨的细节：

- 面馆的招牌是断的
- 便利店的关东煮剩了最后两串
- 楼下的猫在第三个台阶上蹲着

这些细节没有意义，但它们构成了那一天。`,
		},
		{
			author: owner, title: "周末的咖啡参数", category: "生活",
			summary: "记录一组最近稳定出品的参数，方便下次复现。",
			ago:     30 * 24 * time.Hour, views: 233,
			content: `最近稳定下来的一组手冲参数，记一下。

- 豆子：埃塞俄比亚 耶加雪菲，水洗
- 粉水比：1:15
- 水温：92℃
- 研磨：中细，接近白砂糖
- 时间：2 分 10 秒左右

三段式注水：30g 焖蒸 30 秒，然后注到 150g，最后注到 225g。

比之前好喝的原因大概是水温提了两度，酸甜更清楚了。`,
		},
		{
			author: friend, title: "窗台上的第三盆薄荷", category: "生活",
			summary: "前两盆死因不明，这一盆的死因很明确：被猫啃的。",
			views:    412,
			ago:      28 * time.Hour,
			content: `薄荷是第三盆了。前两盆死因不明，这一盆的死因很明确：被猫啃的。

它每天六点准时踩我的脸，理由是碗空了。我一度想把它送走，直到某个加班到凌晨的晚上，推门看见它蹲在门口，尾巴一圈一圈地扫着地板。

那就留着吧。

## 养猫之后学到的三件事

1. 没有「我的」杯子，只有「暂时没被推下去」的杯子
2. 植物要放在它够不到的地方，而不是「应该够不到」的地方
3. 凌晨三点的跑动是正常现象，不是灵异事件`,
		},
		{
			author: friend, title: "读《额尔古纳河右岸》", category: "阅读",
			summary: "一个民族的百年，被讲成了一个老人的一夜。",
			views:    188,
			ago:      5 * 24 * time.Hour,
			content: `这本书我读了很久，不是因为难读，是因为舍不得读完。

一个民族的百年，被讲成了一个老人的一夜。她坐在火堆边，把亲人一个一个地送走，语气平静得像在说别人的事。

> 我是雨和雪的老熟人了，我有九十岁了。雨雪看老了我，我也把它们给看老了。

我喜欢这种把死亡写得像季节更替的笔法。没有嚎啕，只有「他走了」，然后继续往下讲。

合上书那天苏州下了很大的雨。`,
		},
	}

	created := make([]*ent.Post, 0, len(posts))
	for _, ps := range posts {
		b := db.Post.Create().
			SetAuthor(ps.author).
			SetTitle(ps.title).
			SetSummary(ps.summary).
			SetCategory(ps.category).
			SetContent(ps.content).
			SetViews(ps.views).
			SetPinned(ps.pinned).
			SetCreatedAt(time.Now().Add(-ps.ago)).
			SetUpdatedAt(time.Now().Add(-ps.ago))
		if ps.cover != "" {
			b.SetCover(ps.cover)
		}
		if ps.vis != "" {
			b.SetVisibility(ps.vis)
		}
		if len(ps.images) > 0 {
			b.SetImages(ps.images)
		}
		p, err := b.Save(ctx)
		if err != nil {
			return err
		}
		created = append(created, p)
	}

	// 点赞与评论
	if len(created) >= 2 {
		_, _ = db.PostLike.Create().SetPost(created[0]).SetUser(friend).Save(ctx)
		_, _ = db.PostLike.Create().SetPost(created[1]).SetUser(friend).Save(ctx)
		_, _ = db.PostLike.Create().SetPost(created[0]).SetUser(owner).Save(ctx)

		_, _ = db.Comment.Create().SetPost(created[0]).SetAuthor(friend).
			SetContent("这张真的可以挂墙上了。").Save(ctx)
		_, _ = db.Comment.Create().SetPost(created[0]).SetAuthor(owner).
			SetContent("下次带你去，四点半出发。").SetReplyTo("林晚").Save(ctx)
		_, _ = db.Comment.Create().SetPost(created[2]).SetAuthor(friend).
			SetContent("杭州的梅雨季我待过一年，确实像毛巾。").Save(ctx)
		_, _ = db.Comment.Create().SetPost(created[6]).SetAuthor(owner).
			SetContent("第三条太真实了，我家猫也是。").Save(ctx)
	}

	// ---------- 相册 ----------
	type albumSeed struct {
		name, desc, privacy string
		photos              []string
		ago                 time.Duration
	}
	albums := []albumSeed{
		{
			name: "西湖四时", desc: "同一个湖，一年四季都不一样。", privacy: "public", ago: 30 * 24 * time.Hour,
			photos: []string{p1, p2, pic("a-lotus.svg", 7), pic("a-snow.svg", 8), pic("a-boat.svg", 9), pic("a-night.svg", 10)},
		},
		{
			name: "川西 2026", desc: "四姑娘山到稻城，八天，一千四百公里。", privacy: "unlisted", ago: 20 * 24 * time.Hour,
			photos: []string{p3, pic("a-road.svg", 11), pic("a-star.svg", 12), pic("a-tent.svg", 13)},
		},
		{
			name: "桌面与咖啡", desc: "日常的秩序感。", privacy: "public", ago: 8 * 24 * time.Hour,
			photos: []string{p4, pic("a-cup.svg", 14), pic("a-book.svg", 15)},
		},
		{
			name: "存档：毕业那年", desc: "不轻易打开。", privacy: "private", ago: 200 * 24 * time.Hour,
			photos: []string{pic("a-campus.svg", 16), pic("a-luggage.svg", 17)},
		},
	}

	for _, as := range albums {
		a, err := db.Album.Create().
			SetOwner(owner).SetName(as.name).SetDescription(as.desc).
			SetPrivacy(as.privacy).SetCover(as.photos[0]).
			SetCreatedAt(time.Now().Add(-as.ago)).Save(ctx)
		if err != nil {
			return err
		}
		for i, u := range as.photos {
			_, err := db.Photo.Create().
				SetAlbum(a).SetURL(u).SetCaption(fmt.Sprintf("第 %d 张", i+1)).
				SetWidth(1200).SetHeight(900).
				SetCreatedAt(time.Now().Add(-as.ago + time.Duration(i)*time.Hour)).Save(ctx)
			if err != nil {
				return err
			}
		}
	}

	// 朋友的相册
	if a, err := db.Album.Create().
		SetOwner(friend).SetName("窗台上的猫").
		SetDescription("它占据了家里所有能晒到太阳的位置。").
		SetCover(asset("a-cat.svg", media.Photo(18))).
		SetCreatedAt(time.Now().Add(-10 * 24 * time.Hour)).Save(ctx); err == nil {
		for i, u := range []string{
			asset("a-cat2.svg", media.Photo(18)),
			asset("a-cat3.svg", media.Photo(19)),
			asset("a-cat4.svg", media.Photo(20)),
		} {
			_, _ = db.Photo.Create().SetAlbum(a).SetURL(u).
				SetCaption(fmt.Sprintf("第 %d 张", i+1)).SetWidth(1200).SetHeight(900).Save(ctx)
		}
	}

	// ---------- 留言 ----------
	gb := []struct {
		owner  *ent.User
		author *ent.User
		text   string
		reply  string
		ago    time.Duration
	}{
		{owner, friend, "路过，新的版式很好看，字也排得舒服。", "谢谢，还在调。", 2 * 24 * time.Hour},
		{owner, friend, "那篇川西的装备清单能抄一份吗，下个月要去。", "随便抄，登山杖一定要带。", 6 * 24 * time.Hour},
		{owner, friend, "生日快乐（虽然晚了三天）。", "", 9 * 24 * time.Hour},
		{friend, owner, "来踩踩，薄荷那篇笑死。", "猫的功劳。", 3 * 24 * time.Hour},
	}
	for _, g := range gb {
		b := db.Guestbook.Create().SetOwner(g.owner).SetAuthor(g.author).
			SetContent(g.text).SetCreatedAt(time.Now().Add(-g.ago))
		if g.reply != "" {
			b.SetReply(g.reply)
		}
		if _, err := b.Save(ctx); err != nil {
			return err
		}
	}

	// ---------- 访客 ----------
	modules := []string{"主页", "文章", "相册", "留言板"}
	for i := 0; i < 9; i++ {
		visitor := friend
		host := owner
		if i%3 == 2 {
			visitor, host = owner, friend
		}
		if _, err := db.Visit.Create().
			SetHost(host).SetVisitor(visitor).
			SetModule(modules[i%len(modules)]).
			SetCreatedAt(time.Now().Add(-time.Duration(i*7+1) * time.Hour)).Save(ctx); err != nil {
			return err
		}
	}

	// ---------- 消息 ----------
	notes := []struct {
		kind, text string
		ago        time.Duration
		read       bool
	}{
		{"comment", "评论了你的文章《凌晨三点的西湖》：这张真的可以挂墙上了。", 8 * time.Hour, false},
		{"like", "赞了你的文章《把十四年的空间搬回本地》", 9 * time.Hour, false},
		{"guestbook", "在你的留言板留言：路过，新的版式很好看。", 2 * 24 * time.Hour, false},
		{"visit", "访问了你的主页 · 文章", 6 * time.Hour, true},
		{"system", "本周你的主页被访问 23 次，比上周多 5 次。", 12 * time.Hour, true},
	}
	for _, n := range notes {
		if _, err := db.Notification.Create().
			SetTo(owner).SetFrom(friend).SetKind(n.kind).SetText(n.text).
			SetRead(n.read).SetCreatedAt(time.Now().Add(-n.ago)).Save(ctx); err != nil {
			return err
		}
	}

	return nil
}

const bioText = `写代码为生，写字为乐。住在广州，偶尔跑去山里。

## 关于这个空间

这里是我的个人主页：长一点的东西放「文章」，短一点的念头也放「文章」，照片放「相册」。

不追热点，不写教程，只记录我确实经历过的事。

## 最近在做

- 把一个十四年的 QQ 空间搬回本地
- 学做手冲，目前仍不稳定
- 每周走一次山路

## 联系

留言板随便写，我都会看。
`
