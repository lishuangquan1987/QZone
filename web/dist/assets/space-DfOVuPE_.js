import{m as l,e as a,c as t,a as h,i as c,s as m,b as u}from"./index-BfB-QW1W.js";import{f as $,p as b}from"./components-BhGUGN8P.js";async function L(i,p){var r;const e=(r=p.params.uin)!=null?r:"",d=l();if(e===d.uin){location.hash="#/home";return}i.innerHTML=`<div class="page"><div class="card reading">正在打开 ${a(e)} 的空间…</div></div>`;const{user:s}=await t.user(e);t.visit(s.uin,"主页").catch(()=>{}),i.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${a(s.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${h(s.avatar,s.nickname,0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${c("pin",12)} ${a(s.city||"—")}</p>
          <h1>${a(s.nickname)}</h1>
          <p class="hero-sign">${a(s.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${s.posts}</b>文章</span>
            <span><b>${s.photos}</b>照片</span>
            <span><b>${s.visitCount.toLocaleString()}</b>访问</span>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/guestbook?uin=${a(s.uin)}">${c("mail",15)} 留言</a>
          <a class="btn btn-ghost" href="#/search?q=${encodeURIComponent(s.nickname)}">${c("search",15)} 搜索</a>
        </div>
      </div>
    </section>

    <div class="list-head">
      <h2>${a(s.nickname)} 的文章</h2>
      <span class="muted">${s.posts} 篇</span>
    </div>
    <div id="space-posts">${m(2)}</div>
  </div>`,u(i);const o=i.querySelector("#space-posts"),n=await t.posts({uin:s.uin,limit:10});if(!n.posts.length){o.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const v=n.posts[0];o.innerHTML=$(v)+`<div class="post-list">${n.posts.slice(1).map(b).join("")}</div>`}export{L as renderSpace};
