import{i as l,c,o as p,t as v,a as $,e as d,l as M}from"./index-BfB-QW1W.js";const y={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function w(t){return t.target.startsWith("post:")?`#/post/${t.target.split(":")[1]}`:t.target.startsWith("album:")?`#/album/${t.target.split(":")[1]}`:t.target==="guestbook"?"#/guestbook":t.target==="profile"?`#/u/${d(t.from.uin)}`:"#/home"}async function H(t,L){t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${l("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const i=t.querySelector("#msg-list"),k=t.querySelector("#msg-sub");let r=null,n=!1;const m=()=>r?'<div class="load-more"><button class="btn btn-ghost btn-sm" id="msg-more">加载更早的消息</button></div>':"",u=e=>{var a;const s=(a=y[e.kind])!=null?a:y.system;return`<a class="msg-row ${e.read?"":"unread"}" href="${w(e)}">
      <span class="msg-icon ${s.cls}">${l(s.icon,16)}</span>
      <div class="msg-body">
        <div class="msg-line">
          ${$(e.from.avatar,e.from.nickname,20,e.from.uin)}
          <b>${d(e.from.nickname)}</b>
          <span>${d(e.text)}</span>
        </div>
        <time>${M(e.at)} · ${s.label}</time>
      </div>
      ${e.read?"":'<i class="msg-dot"></i>'}
    </a>`},h=e=>`<div class="card msg-list">${e.map(u).join("")}</div>`,g=async()=>{var s;const e=await c.notifications();k.textContent=e.unread?`${e.unread} 条未读`:"全部已读",p(e.unread),r=e.hasMore&&(s=e.nextBefore)!=null?s:null,i.innerHTML=e.notifications.length?h(e.notifications)+m():`<div class="card empty"><div class="empty-mark">${l("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await g(),i.addEventListener("click",async e=>{var b,f;if(!e.target.closest("#msg-more")||n||!r)return;n=!0;const s=i.querySelector("#msg-more"),a=i.querySelector(".card.msg-list");s&&(s.disabled=!0);try{const o=await c.notifications(r);r=o.hasMore&&(b=o.nextBefore)!=null?b:null,(f=s==null?void 0:s.parentElement)==null||f.remove(),a==null||a.insertAdjacentHTML("beforeend",o.notifications.map(u).join("")),i.insertAdjacentHTML("beforeend",m())}finally{n=!1}}),t.querySelector("#read-all").addEventListener("click",async()=>{try{const e=await c.readNotifications([]);p(e.unread),v("已全部标为已读","ok"),await g()}catch(e){v(e.message,"err")}})}export{H as renderMessages};
