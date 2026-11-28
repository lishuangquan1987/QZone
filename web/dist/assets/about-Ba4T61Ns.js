import{m as r,c as e,e as s,i as d,t as n}from"./index-BfB-QW1W.js";import{r as l}from"./md-BKUISFuz.js";async function p(c,i){const t=r(),a=i.params.uin?(await e.user(i.params.uin)).user:t;c.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${s(a.nickname)}</h1>
      <p class="page-sub">${s(a.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${a.bio?l(a.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
      </article>

      <aside class="about-side">
        <section class="rail-card">
          <h3>档案</h3>
          <dl class="fact-list">
            <div><dt>空间号</dt><dd>${s(a.uin)}</dd></div>
            <div><dt>城市</dt><dd>${s(a.city||"—")}</dd></div>
            <div><dt>星座</dt><dd>${s(a.constellation||"—")}</dd></div>
            <div><dt>加入</dt><dd>${new Date(a.createdAt).getFullYear()} 年</dd></div>
            <div><dt>文章</dt><dd>${a.posts} 篇</dd></div>
            <div><dt>照片</dt><dd>${a.photos} 张</dd></div>
          </dl>
        </section>

        <section class="rail-card">
          <h3>标签</h3>
          <div class="tag-cloud">
            ${a.tags.map(o=>`<span class="tag">${s(o)}</span>`).join("")||'<span class="muted">还没有标签</span>'}
          </div>
        </section>

        <section class="rail-card">
          <h3>找到我</h3>
          <div class="about-links">
            <a href="#/guestbook" class="about-link">${d("mail",14)} 留言板</a>
            <a href="#/posts" class="about-link">${d("book",14)} 全部文章</a>
            <a href="#/albums" class="about-link">${d("image",14)} 相册</a>
          </div>
        </section>
      </aside>
    </div>
  </div>`,a.uin!==t.uin&&e.visit(a.uin,"关于").catch(()=>n("足迹记录失败","err"))}export{p as renderAbout};
