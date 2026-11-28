import{e,i as n,c as o,t as p}from"./index-BfB-QW1W.js";import{p as d}from"./components-BhGUGN8P.js";async function u(r,l){const t=(l.params.q||"").trim();if(r.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SEARCH</p>
        <h1>搜索</h1>
        <p class="page-sub">${t?`“${e(t)}” 的结果`:"找文章、找朋友、找相册"}</p>
      </div>
    </header>

    <form class="search-box card" id="search-form">
      <input class="input" name="q" value="${e(t)}" placeholder="输入关键词" autofocus>
      <button class="btn btn-primary" type="submit">${n("search",14)} 搜索</button>
    </form>

    <div id="search-result"></div>
  </div>`,r.querySelector("#search-form").addEventListener("submit",s=>{var a;s.preventDefault();const c=String((a=new FormData(s.currentTarget).get("q"))!=null?a:"").trim();location.hash=c?`#/search?q=${encodeURIComponent(c)}`:"#/search"}),!t)return;const i=r.querySelector("#search-result");try{const s=await o.search(t);if(!(s.posts.length+s.users.length+s.albums.length)){i.innerHTML=`<div class="card empty"><div class="empty-mark">${n("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}i.innerHTML=`
      ${s.users.length?`<h2 class="result-title">用户 <span>${s.users.length}</span></h2>
             <div class="card user-list">${s.users.map(a=>`<a class="user-row" href="#/u/${e(a.uin)}">
                   <img src="${e(a.avatar)}" alt="" loading="lazy" decoding="async">
                   <div><b>${e(a.nickname)}</b><span>@${e(a.uin)} · ${e(a.signature||"")}</span></div>
                   ${n("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${s.posts.length?`<h2 class="result-title">文章 <span>${s.posts.length}</span></h2>
             <div class="post-list card">${s.posts.map(d).join("")}</div>`:""}
      ${s.albums.length?`<h2 class="result-title">相册 <span>${s.albums.length}</span></h2>
             <div class="album-grid">${s.albums.map(a=>`<a class="album-card card" href="#/album/${a.id}">
                   <div class="album-cover">${a.cover?`<img src="${e(a.cover)}" alt="" loading="lazy" decoding="async">`:""}</div>
                   <div class="album-info"><h3>${e(a.name)}</h3><p>${a.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(s){p(s.message,"err")}}export{u as renderSearch};
