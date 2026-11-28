import{c as l,i,e as r,a as q,f as h,b as S,t as s,g}from"./index-BfB-QW1W.js";import{c as T,a as k}from"./components-BhGUGN8P.js";import{r as C}from"./md-BKUISFuz.js";async function P(a,w){var y,b,f;const x=Number(w.params.id);a.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const t=await l.post(x);a.innerHTML=`<div class="page narrow">
    <a class="back-link" href="#/posts">${i("back",14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${t.pinned?`<span class="pill pill-pin">${i("pin",11)}置顶</span>`:""}
          <a class="pill cat" style="--cat:${T(t.category)}" href="#/posts?category=${encodeURIComponent(t.category)}">${r(t.category)}</a>
          ${t.visibility!=="public"?`<span class="pill pill-lock">${i("lock",11)}${t.visibility==="private"?"仅自己可见":"不公开列出"}</span>`:""}
        </div>
        <h1 class="article-title">${r(t.title||"无标题")}</h1>
        <div class="article-meta">
          ${q(t.author.avatar,t.author.nickname,34,t.author.uin)}
          <div class="article-meta-text">
            <b>${r(t.author.nickname)}</b>
            <span>${h(t.at)} · ${t.readingTime} 分钟阅读 · ${t.views} 次浏览</span>
          </div>
          ${t.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${t.id}">${i("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${i("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${t.cover&&!((y=t.content)!=null?y:"").includes(t.cover)?`<figure class="article-cover"><img src="${r(t.cover)}" alt="" decoding="async" data-zoom="${r(t.cover)}"></figure>`:""}

      <div class="article-body markdown">${C((b=t.content)!=null?b:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${t.liked?"active":""}" id="like-btn">
          ${i("heart",16)}<span>${t.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${t.likes.length?`${t.likes.slice(0,8).map(e=>r(e.nickname)).join("、")} 觉得不错`:`写于 ${h(t.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${t.commentNum}</span></h2>
      <div id="comment-area">${k(t.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,S(a);const d=a.querySelector("#like-btn");d.addEventListener("click",async()=>{try{const e=await l.likePost(t.id);d.classList.toggle("active",e.liked),d.querySelector("span").textContent=String(e.count||"赞")}catch(e){s(e.message,"err")}}),(f=a.querySelector("#del-post"))==null||f.addEventListener("click",async()=>{if(await g("删除文章",`《${t.title}》删除后无法恢复，确定吗？`))try{await l.deletePost(t.id),s("已删除","ok"),location.hash="#/posts"}catch(e){s(e.message,"err")}});let m="";const u=a.querySelector("#reply-hint"),v=a.querySelector("#comment-area");v.addEventListener("click",async e=>{var c,$;const p=e.target,o=p.closest("[data-reply]");if(o){m=(c=o.dataset.reply)!=null?c:"",u.textContent=`回复 ${m}`,a.querySelector("#comment-form textarea").focus();return}const n=p.closest("[data-del-comment]");if(n){if(!await g("删除评论","确定删除这条评论吗？"))return;try{await l.deleteComment(t.id,Number(n.dataset.delComment)),($=n.closest(".comment"))==null||$.remove(),s("已删除","ok")}catch(L){s(L.message,"err")}}}),a.querySelector("#comment-form").addEventListener("submit",async e=>{e.preventDefault();const o=e.currentTarget.querySelector("textarea"),n=o.value.trim();if(n)try{const c=await l.commentPost(t.id,n,m);t.comments.push(c),v.innerHTML=k(t.comments),o.value="",m="",u.textContent="",s("评论已发布","ok")}catch(c){s(c.message,"err")}})}export{P as renderPost};
