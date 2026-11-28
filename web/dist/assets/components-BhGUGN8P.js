import{e as t,n as e,i,l,a as d}from"./index-BfB-QW1W.js";const m={城市:30,技术:212,旅行:168,随笔:282,生活:8,摄影:196,读书:248,音乐:330};function $(a){var c;if(!a)return 40;const s=m[a];if(s!==void 0)return s;let n=0;for(const p of a)n=(n*31+((c=p.codePointAt(0))!=null?c:0))%360;return n}function o(a){return`<span class="pill cat" style="--cat:${$(a)}">${t(a)}</span>`}const r={private:"仅自己可见",unlisted:"不公开列出",public:""};function v(a){const s=a.cover||a.images[0]||"";return`<article class="feature card${s?"":" no-cover"}" data-post="${a.id}">
    ${s?`<a class="feature-cover" href="#/post/${a.id}"><img src="${t(e(s,800))}" alt="${t(a.title)}" loading="lazy" decoding="async"></a>`:""}
    <div class="feature-body">
      <div class="post-kicker">
        ${a.pinned?`<span class="pill pill-pin">${i("pin",11)}置顶</span>`:""}
        ${o(a.category)}
        ${a.visibility!=="public"?`<span class="pill pill-lock">${i("lock",11)}${r[a.visibility]}</span>`:""}
      </div>
      <h2 class="feature-title"><a href="#/post/${a.id}">${t(a.title||"无标题")}</a></h2>
      <p class="feature-summary">${t(a.summary)}</p>
      <div class="post-meta">
        <span>${l(a.at)}</span>
        <span class="meta-dot">·</span>
        <span>${i("clock",12)} ${a.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${i("eye",12)} ${a.views}</span>
        <span class="meta-dot">·</span>
        <span>${i("heart",12)} ${a.likeCount}</span>
      </div>
    </div>
  </article>`}function y(a){const s=a.cover||a.images[0]||"";return`<article class="post-row" data-post="${a.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${a.pinned?`<span class="pill pill-pin">${i("pin",11)}置顶</span>`:""}
        ${o(a.category)}
        ${a.visibility!=="public"?`<span class="pill pill-lock">${i("lock",11)}${r[a.visibility]}</span>`:""}
      </div>
      <h3 class="post-row-title"><a href="#/post/${a.id}">${t(a.title||"无标题")}</a></h3>
      <p class="post-row-summary">${t(a.summary)}</p>
      <div class="post-meta">
        <span>${l(a.at)}</span>
        <span class="meta-dot">·</span>
        <span>${a.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${i("eye",12)} ${a.views}</span>
        <span class="meta-dot">·</span>
        <span>${i("heart",12)} ${a.likeCount}</span>
      </div>
    </div>
    ${s?`<a class="post-row-thumb" href="#/post/${a.id}"><img src="${t(e(s,400))}" alt="" loading="lazy" decoding="async"></a>`:""}
  </article>`}function h(a){return a.length?`<ul class="comment-list">${a.map(s=>`<li class="comment" data-cid="${s.id}">
        ${d(s.author.avatar,s.author.nickname,34,s.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${t(s.author.uin)}">${t(s.author.nickname)}</a>
            <time>${l(s.at)}</time>
            <button class="text-btn" data-reply="${t(s.author.nickname)}">回复</button>
            ${s.canDel?`<button class="text-btn danger" data-del-comment="${s.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${s.replyTo?`<span class="comment-reply">回复 ${t(s.replyTo)}：</span>`:""}${t(s.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function f(a){const s=a.privacy==="public"?"":`<span class="album-vis">${i(a.privacy==="private"?"lock":"eyeoff",12)}${a.privacy==="private"?"仅自己":"隐藏"}</span>`;return`<a class="album-card card" href="#/album/${a.id}">
    <div class="album-cover">
      ${a.cover?`<img src="${t(e(a.cover,800))}" alt="${t(a.name)}" loading="lazy" decoding="async">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${a.count} 张</span>
      ${s}
      <span class="album-shade" aria-hidden="true"></span>
    </div>
    <div class="album-info">
      <h3>${t(a.name)}</h3>
      <p>${t(a.description||"还没有描述")}</p>
    </div>
  </a>`}export{h as a,f as b,$ as c,v as f,y as p};
