import{m as S,c as r,e as n,a as w,t as i,k as q,i as E,l as M}from"./index-BfB-QW1W.js";async function B(o,x){const c=S(),l=x.params.uin||c.uin,v=l===c.uin,y=v?c:(await r.user(l)).user;o.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${v?"来过的人，留下了这些话。":`给 ${n(y.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${w(c.avatar,c.nickname,36)}
        <span>${v?"给自己留一句话":`给 ${n(y.nickname)} 留一句话`}</span>
      </div>
      <form id="gb-form">
        <textarea name="content" rows="3" maxlength="500" placeholder="写文章…（纯文本，最多 500 字）" required></textarea>
        <div class="guest-write-foot">
          <span class="muted" id="gb-count">0 / 500</span>
          <button class="btn btn-primary btn-sm" type="submit">发表留言</button>
        </div>
      </form>
    </section>

    <div id="gb-list" class="gb-list"></div>
  </div>`;const d=o.querySelector("#gb-list"),b=o.querySelector("#gb-form textarea"),g=o.querySelector("#gb-count");b.addEventListener("input",()=>{g.textContent=`${b.value.length} / 500`});const h=e=>`<article class="gb-item card" data-gid="${e.id}">
      ${w(e.author.avatar,e.author.nickname,40,e.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${n(e.author.uin)}">${n(e.author.nickname)}</a>
          <time>${M(e.at)}</time>
          <span class="spacer"></span>
          ${e.canEdit?`<button class="text-btn" data-reply="${e.id}">回复</button>`:""}
          ${e.canDel?`<button class="text-btn danger" data-del="${e.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${n(e.content)}</p>
        ${e.reply?`<div class="gb-reply"><b>${n(y.nickname)}：</b>${n(e.reply)}</div>`:""}
      </div>
    </article>`;let u=null,f=!1;const $=()=>u?'<div class="load-more"><button class="btn btn-ghost btn-sm" id="gb-more">加载更早的留言</button></div>':"",p=async()=>{var t;const e=await r.guestbook(l);u=e.hasMore&&(t=e.nextBefore)!=null?t:null,d.innerHTML=e.entries.length?e.entries.map(h).join("")+$():`<div class="card empty"><div class="empty-mark">${E("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await p(),d.addEventListener("click",async e=>{var a,m;if(!e.target.closest("#gb-more")||f||!u)return;f=!0;const t=d.querySelector("#gb-more");t&&(t.disabled=!0);try{const s=await r.guestbook(l,u);u=s.hasMore&&(a=s.nextBefore)!=null?a:null,(m=t==null?void 0:t.parentElement)==null||m.remove(),d.insertAdjacentHTML("beforeend",s.entries.map(h).join("")+$())}finally{f=!1}}),o.querySelector("#gb-form").addEventListener("submit",async e=>{e.preventDefault();const t=b.value.trim();if(t)try{await r.createGuestbook(l,t),b.value="",g.textContent="0 / 500",i("留言成功","ok"),await p()}catch(a){i(a.message,"err")}}),d.addEventListener("click",async e=>{const t=e.target,a=t.closest("[data-del]");if(a){if(!confirm("确定删除这条留言吗？"))return;try{await r.deleteGuestbook(Number(a.dataset.del)),await p(),i("已删除","ok")}catch(s){i(s.message,"err")}return}const m=t.closest("[data-reply]");if(m){const s=Number(m.dataset.reply);await q({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async L=>{const k=L.querySelector("#reply-text").value.trim();return k?(await r.replyGuestbook(s,k),await p(),i("已回复","ok"),!0):(i("回复不能为空","err"),!1)}})}})}export{B as renderGuestbook};
