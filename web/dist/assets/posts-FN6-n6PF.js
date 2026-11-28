import{e as h,s as m,t as u,c as g,i as f}from"./index-BfB-QW1W.js";import{p as w}from"./components-BhGUGN8P.js";const $=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function k(e,n){const o=n.params.sort==="popular"?"popular":"latest",c=n.params.category||"全部",l=n.params.q||"";e.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">ARCHIVE</p>
        <h1>全部文章</h1>
        <p class="page-sub" id="archive-sub">正在整理…</p>
      </div>
    </header>
    <div class="archive-bar">
      <div class="chip-row" id="cat-row"></div>
      <div class="sort-row">
        ${$.map(a=>`<button class="sort-btn ${a.key===o?"active":""}" data-sort="${a.key}">${a.label}</button>`).join("")}
      </div>
    </div>
    ${l?`<p class="search-note">搜索「${h(l)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${m(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const r=e.querySelector("#archive-list"),i=e.querySelector("#load-more"),y=e.querySelector("#cat-row");let p,d=[];const b=()=>{const a=new Set(["全部"]);d.forEach(t=>t.category&&a.add(t.category)),y.innerHTML=Array.from(a).map(t=>`<button class="chip ${t===c?"active":""}" data-cat="${h(t)}">${h(t)}</button>`).join("")},v=async a=>{a&&(p=void 0,r.innerHTML=m(2));const t=await g.posts({category:c,sort:o,q:l,limit:8,before:p});d=a?t.posts:d.concat(t.posts);const s=t.posts.map(w).join("");a?r.innerHTML=s:r.insertAdjacentHTML("beforeend",s),t.posts.length&&(p=t.posts[t.posts.length-1].at),i.hidden=!t.hasMore,e.querySelector("#archive-sub").textContent=`共 ${t.total} 篇 · 按${o==="popular"?"阅读量":"时间"}排序`,b(),a&&!t.posts.length&&(r.innerHTML=`<div class="card empty">
        <div class="empty-mark">${f("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await v(!1)}catch(a){u(a.message,"err")}finally{i.disabled=!1}}),y.addEventListener("click",a=>{const t=a.target.closest("[data-cat]");if(!t)return;const s=new URLSearchParams;t.dataset.cat&&t.dataset.cat!=="全部"&&s.set("category",t.dataset.cat),o==="popular"&&s.set("sort","popular"),location.hash=`#/posts${s.toString()?"?"+s.toString():""}`}),e.querySelectorAll("[data-sort]").forEach(a=>{a.addEventListener("click",()=>{const t=new URLSearchParams;c!=="全部"&&t.set("category",c),a.dataset.sort==="popular"&&t.set("sort","popular"),location.hash=`#/posts${t.toString()?"?"+t.toString():""}`})});try{await v(!0)}catch(a){u(a.message,"err"),r.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}export{k as renderPosts};
