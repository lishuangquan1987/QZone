import{m as $,e,a as y,i,s as f,b as L,c as h,d as p,v as k,t as T}from"./index-BfB-QW1W.js";import{f as H,p as w}from"./components-BhGUGN8P.js";async function x(l,M){var b;const s=$();l.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${e(s.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${y(s.avatar,s.nickname,0,"",0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${i("pin",12)} ${e(s.city||"未设置城市")} · ${e(s.constellation||"—")}</p>
          <h1>${e(s.nickname)}</h1>
          <p class="hero-sign">${e(s.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${s.posts}</b>文章</span>
            <span><b>${s.photos}</b>照片</span>
            <span><b>${s.visitCount.toLocaleString()}</b>访问</span>
            <span><b>${s.signStreak}</b>连签</span>
          </div>
        </div>
        <div class="hero-actions hero-actions--self">
          <a class="btn btn-primary" href="#/write">${i("pen",15)} 写文章</a>
          <a class="btn btn-ghost" href="#/settings">${i("settings",15)} 设置</a>
        </div>
      </div>
    </section>

    <div class="home-grid">
      <div class="home-main" id="home-main">${f(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,L(l);const m=l.querySelector("#home-main"),c=l.querySelector("#home-rail");try{const[{posts:t,total:g},u]=await Promise.all([h.posts({limit:7}),h.albums()]);if(!t.length)m.innerHTML=`<div class="card empty">
        <div class="empty-mark">${i("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const a=(b=t.find(d=>d.pinned))!=null?b:t[0],r=t.filter(d=>d.id!==a.id);m.innerHTML=`
        ${H(a)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${g} 篇 ${i("chevron",12)}</a>
        </div>
        <div class="post-list">${r.map(w).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}c.innerHTML=`
      <section class="rail-card">
        <h3>关于我</h3>
        <p class="rail-bio">${e(s.bio?s.bio.split(`
`)[0].replace(/^#+\s*/,""):s.signature||"还没有写自我介绍。")}</p>
        <div class="tag-cloud">${s.tags.map(a=>`<a class="tag" href="#/search?q=${encodeURIComponent(a)}">${e(a)}</a>`).join("")||'<span class="muted">还没有标签</span>'}</div>
        <a class="rail-link" href="#/about">了解更多 ${i("chevron",12)}</a>
      </section>

      <section class="rail-card">
        <h3>背景音乐</h3>
        <div class="rail-music">
          <div class="rail-disc ${o()?"spin":""}">${i("music",16)}</div>
          <div class="rail-music-meta">
            <b>${e(s.bgmTitle||"未设置音轨")}</b>
            <span id="rail-music-state">${s.bgmUrl?o()?"正在循环播放":"已暂停 · 点下面的按钮继续":"去设置里挑一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${o()?i("pause",13):i("play",13)} ${o()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${u.albums.slice(0,3).map(a=>`<a class="rail-album" href="#/album/${a.id}">
                <img src="${e(a.cover)}" alt="" loading="lazy" decoding="async">
                <span>${e(a.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${i("mail",13)} 去留言</a>
      </section>`;const n=c.querySelector("#rail-play"),v=c.querySelector("#rail-music-state");window.addEventListener("qz:bgm",()=>{var r;if(!n||!n.isConnected)return;const a=p.isPlaying();(r=c.querySelector(".rail-disc"))==null||r.classList.toggle("spin",a),n.innerHTML=`${a?i("pause",13):i("play",13)} ${a?"暂停":"播放"}`,v&&(v.textContent=a?"正在循环播放":"已暂停 · 点下面的按钮继续")},{signal:k()}),n==null||n.addEventListener("click",()=>{p.toggle()})}catch(t){T(t.message,"err")}}function o(){return p.isPlaying()}export{x as renderHome};
