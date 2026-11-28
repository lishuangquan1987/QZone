import{m as f,i as g,c as y,p as k,e as c,a as S,l as L}from"./index-BfB-QW1W.js";const M=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function w(r,$){var b;const d=f(),e=$.params.tab==="out"?"out":"in";r.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${g("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${M.map(t=>`<button class="seg-btn ${t.key===e?"active":""}" data-tab="${t.key}" aria-pressed="${t.key===e}">${t.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,r.querySelectorAll("[data-tab]").forEach(t=>{t.addEventListener("click",()=>{location.hash=`#/visitors?tab=${t.dataset.tab}`})});const s=r.querySelector("#visit-list"),u=t=>`<a class="visit-row" href="#/u/${c(t.author.uin)}">
      ${S(t.author.avatar,t.author.nickname,40,t.author.uin)}
      <div class="visit-main">
        <b>${c(t.author.nickname)}</b>
        <span>${e==="in"?"看了":"访问了"} · ${c(t.module)}</span>
      </div>
      <time>${L(t.at)}</time>
    </a>`;let i=null,o=!1;const v=()=>i?'<div class="load-more"><button class="btn btn-ghost btn-sm" id="visit-more">加载更早的记录</button></div>':"",a=await y.visitors(d.uin,e);r.querySelector("#visit-sub").textContent=e==="in"?`累计 ${a.total.toLocaleString()} 人次 · 今日 ${a.today} 人`:`你最近访问了 ${a.visitors.length} 个空间`,i=a.hasMore&&(b=a.nextBefore)!=null?b:null,s.innerHTML=a.visitors.length?`<div class="card visit-list">${a.visitors.map(u).join("")}</div>${v()}`:k(e==="in"?"还没有人来过":"还没有访问记录",e==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>'),s.addEventListener("click",async t=>{var m,p,h;if(!t.target.closest("#visit-more")||o||!i)return;o=!0;const n=s.querySelector("#visit-more");n&&(n.disabled=!0);try{const l=await y.visitors(d.uin,e,i);i=l.hasMore&&(m=l.nextBefore)!=null?m:null,(p=n==null?void 0:n.parentElement)==null||p.remove(),(h=s.querySelector(".card.visit-list"))==null||h.insertAdjacentHTML("beforeend",l.visitors.map(u).join("")),s.insertAdjacentHTML("beforeend",v())}finally{o=!1}})}export{w as renderVisitors};
