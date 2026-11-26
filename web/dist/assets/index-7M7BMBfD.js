var Gs=Object.defineProperty;var Gt=t=>{throw TypeError(t)};var Qs=(t,e,a)=>e in t?Gs(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var M=(t,e,a)=>Qs(t,typeof e!="symbol"?e+"":e,a),Ws=(t,e,a)=>e.has(t)||Gt("Cannot "+a);var Qt=(t,e,a)=>e.has(t)?Gt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a);var xe=(t,e,a)=>(Ws(t,e,"access private method"),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();class Ve extends Error{constructor(a,s){super(s);M(this,"status");this.status=a}}async function Le(t,e={}){const a=new Headers(e.headers);e.body&&!(e.body instanceof FormData)&&a.set("Content-Type","application/json");let s;try{s=await fetch(t,{credentials:"include",...e,headers:a})}catch{throw new Ve(0,"网络连接失败，请检查服务是否已启动")}if(s.status===401)throw window.dispatchEvent(new CustomEvent("qz:expired")),new Ve(401,"登录状态已失效");const n=await s.text(),r=n?JSON.parse(n):{};if(!s.ok)throw new Ve(s.status,r.error||"请求失败");return r}const F=t=>Le(t),D=(t,e)=>Le(t,{method:"POST",body:e===void 0?void 0:JSON.stringify(e)}),Re=t=>Le(t,{method:"DELETE"}),Wt=(t,e)=>Le(t,{method:"PATCH",body:JSON.stringify(e)}),L={register:(t,e,a)=>D("/api/auth/register",{uin:t,nickname:e,password:a}),login:(t,e)=>D("/api/auth/login",{uin:t,password:e}),logout:()=>D("/api/auth/logout"),session:()=>F("/api/auth/session"),bootstrap:()=>F("/api/bootstrap"),user:t=>F(`/api/users/${encodeURIComponent(t)}`),updateProfile:t=>Wt("/api/users/me",t),signIn:()=>D("/api/users/me/signin"),visitors:(t,e="in")=>F(`/api/users/${encodeURIComponent(t)}/visitors?mode=${e}`),visit:(t,e)=>D(`/api/users/${encodeURIComponent(t)}/visit`,{module:e}),posts:t=>{const e=new URLSearchParams;return Object.entries(t).forEach(([a,s])=>{s!==void 0&&s!==""&&e.set(a,String(s))}),F(`/api/posts?${e}`)},createPost:t=>D("/api/posts",t),post:t=>F(`/api/posts/${t}`),updatePost:(t,e)=>Wt(`/api/posts/${t}`,e),deletePost:t=>Re(`/api/posts/${t}`),likePost:t=>D(`/api/posts/${t}/like`),commentPost:(t,e,a)=>D(`/api/posts/${t}/comments`,{content:e,replyTo:a}),deleteComment:(t,e)=>Re(`/api/posts/${t}/comments/${e}`),albums:t=>F(`/api/albums${t?`?uin=${encodeURIComponent(t)}`:""}`),album:t=>F(`/api/albums/${t}`),createAlbum:t=>D("/api/albums",t),deleteAlbum:t=>Re(`/api/albums/${t}`),addPhotos:(t,e,a)=>D(`/api/albums/${t}/photos`,{urls:e,caption:"",...a}),deletePhoto:(t,e)=>Re(`/api/albums/${t}/photos/${e}`),likePhoto:t=>D(`/api/photos/${t}/like`),guestbook:t=>F(`/api/guestbook${t?`?uin=${encodeURIComponent(t)}`:""}`),createGuestbook:(t,e)=>D("/api/guestbook",{owner:t,content:e}),deleteGuestbook:t=>Re(`/api/guestbook/${t}`),replyGuestbook:(t,e)=>D(`/api/guestbook/${t}/reply`,{reply:e}),notifications:()=>F("/api/notifications"),readNotifications:(t=[])=>D("/api/notifications/read",{ids:t}),musicLibrary:()=>F("/api/music/library"),search:t=>F(`/api/search?q=${encodeURIComponent(t)}`),upload:async t=>{const e=new FormData;return e.append("file",t),Le("/api/upload",{method:"POST",body:e})},uploadAudio:async t=>{const e=new FormData;return e.append("file",t),Le("/api/upload/audio",{method:"POST",body:e})}},te={boot:null};function fe(){if(!te.boot)throw new Error("尚未初始化");return te.boot.me}function Ks(t){te.boot=t}function Se(t){te.boot&&(te.boot.me=t)}function pt(){var t,e;return(e=(t=te.boot)==null?void 0:t.themes)!=null?e:[]}function Kt(){var t,e;return(e=(t=te.boot)==null?void 0:t.unread)!=null?e:0}function Xt(t){te.boot&&(te.boot.unread=t),document.querySelectorAll("[data-unread]").forEach(e=>{e.textContent=t>99?"99+":String(t),e.hidden=t===0})}function gs(t){var a,s;const e=(a=pt().find(n=>n.id===t))!=null?a:pt()[0];document.documentElement.dataset.theme=(s=e==null?void 0:e.id)!=null?s:"aurora",e&&document.documentElement.style.setProperty("--accent",e.accent)}function g(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const oe=t=>String(t).padStart(2,"0");function ce(t){const e=new Date(t).getTime(),a=Date.now()-e,s=6e4;if(a<s)return"刚刚";if(a<60*s)return`${Math.floor(a/s)} 分钟前`;const n=new Date(e),r=new Date;if(n.toDateString()===r.toDateString())return`今天 ${oe(n.getHours())}:${oe(n.getMinutes())}`;const i=new Date(Date.now()-864e5);return n.toDateString()===i.toDateString()?`昨天 ${oe(n.getHours())}:${oe(n.getMinutes())}`:n.getFullYear()===r.getFullYear()?`${n.getMonth()+1} 月 ${n.getDate()} 日`:`${n.getFullYear()} 年 ${n.getMonth()+1} 月 ${n.getDate()} 日`}function Yt(t){const e=new Date(t);return`${e.getFullYear()}-${oe(e.getMonth()+1)}-${oe(e.getDate())} ${oe(e.getHours())}:${oe(e.getMinutes())}`}const Xs={pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',message:'<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',music:'<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',bell:'<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chevron:'<path d="M9 6l6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',star:'<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',logout:'<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',tag:'<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',pin:'<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',listOl:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',table:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',codeInline:'<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',codeBlock:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>',expand:'<path d="M9 4.5H4.5V9M15 4.5h4.5V9M15 19.5h4.5V15M9 19.5H4.5V15"/>',compress:'<path d="M4.5 9H9V4.5M19.5 9H15V4.5M19.5 15H15v4.5M4.5 15H9v4.5"/>',outline:'<path d="M4 6h16M4 12h10.5M4 18h7"/>'};function b(t,e=16){var s;const a=(s=Xs[t])!=null?s:"";return`<svg class="ico" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}function ie(t,e,a=40,s="",n=0){const r=t?`<img src="${g(t)}" alt="${g(e)}" loading="lazy">`:`<span class="avatar-fallback">${g(e.slice(0,1))}</span>`,i=s?`href="#/u/${g(s)}"`:"",o=a>0?` style="width:${a}px;height:${a}px"`:"";return`<a class="avatar" ${i}${o}>${r}${n?`<i class="avatar-level">${n}</i>`:""}</a>`}function $(t,e="info"){let a=document.getElementById("toasts");a||(a=document.createElement("div"),a.id="toasts",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${e}`,s.textContent=t,a.appendChild(s),requestAnimationFrame(()=>s.classList.add("in")),setTimeout(()=>{s.classList.remove("in"),setTimeout(()=>s.remove(),280)},2600)}function ft(t){return new Promise(e=>{var r,i,o,u;const a=document.createElement("div");a.className="modal-mask",a.innerHTML=`
      <div class="modal ${t.wide?"modal-wide":""}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${g(t.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${b("close",18)}</button>
        </header>
        <div class="modal-body">${t.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${g((r=t.cancelText)!=null?r:"取消")}</button>
          <button class="btn btn-primary modal-ok">${g((i=t.confirmText)!=null?i:"确定")}</button>
        </footer>
      </div>`,document.body.appendChild(a),document.body.classList.add("no-scroll");const s=d=>{a.remove(),document.body.classList.remove("no-scroll"),e(d)};a.querySelector(".modal-x").addEventListener("click",()=>s(!1)),a.querySelector(".modal-cancel").addEventListener("click",()=>s(!1)),a.addEventListener("mousedown",d=>{d.target===a&&s(!1)});const n=a.querySelector(".modal-ok");n.addEventListener("click",async()=>{if(!t.onConfirm)return s(!0);n.disabled=!0;try{await t.onConfirm(a)!==!1&&s(!0)}catch(d){$(d.message,"err")}finally{n.disabled=!1}}),(o=t.onMount)==null||o.call(t,a),(u=a.querySelector("input, textarea"))==null||u.focus()})}async function Qe(t,e,a="删除"){return ft({title:t,body:`<p class="confirm-text">${g(e)}</p>`,confirmText:a})}function et(t){t.addEventListener("click",e=>{const a=e.target.closest("[data-zoom]");if(!a||e.target.closest("button"))return;const s=a.dataset.zoom||a.src,n=Array.from(t.querySelectorAll("[data-zoom]")).map(m=>m.dataset.zoom||m.src);let r=Math.max(0,n.indexOf(s));const i=document.createElement("div");i.className="lightbox",i.innerHTML=`
      <button class="lb-close">${b("close",24)}</button>
      <button class="lb-prev">${b("back",24)}</button>
      <img alt="">
      <button class="lb-next">${b("chevron",24)}</button>
      <div class="lb-count"></div>`,document.body.appendChild(i),document.body.classList.add("no-scroll");const o=i.querySelector("img"),u=i.querySelector(".lb-count"),d=()=>{o.src=n[r],u.textContent=`${r+1} / ${n.length}`};d();const p=m=>{m.key==="Escape"&&l(),m.key==="ArrowLeft"&&n.length>1&&(r=(r-1+n.length)%n.length,d()),m.key==="ArrowRight"&&n.length>1&&(r=(r+1)%n.length,d())},l=()=>{i.remove(),document.body.classList.remove("no-scroll"),window.removeEventListener("keydown",p)};i.querySelector(".lb-close").addEventListener("click",l),i.addEventListener("click",m=>{m.target===i&&l()}),i.querySelector(".lb-prev").addEventListener("click",m=>{m.stopPropagation(),n.length>1&&(r=(r-1+n.length)%n.length,d())}),i.querySelector(".lb-next").addEventListener("click",m=>{m.stopPropagation(),n.length>1&&(r=(r+1)%n.length,d())}),window.addEventListener("keydown",p)})}function Ys(t,e="",a=""){return`<div class="empty">
    <div class="empty-mark">${b("book",22)}</div>
    <p class="empty-title">${g(t)}</p>
    ${e?`<p class="empty-desc">${g(e)}</p>`:""}
    ${a}
  </div>`}function We(t=3){return Array.from({length:t}).map(()=>`<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`).join("")}class Js{constructor(){M(this,"audio",null);M(this,"pill",null);M(this,"title","");M(this,"url","");M(this,"armed",!1)}get want(){return localStorage.getItem("qz.bgm")!=="off"}get volume(){const e=Number(localStorage.getItem("qz.bgm.vol"));return Number.isFinite(e)&&e>0?Math.min(e,1):.55}setTrack(e,a){const s=e!==this.url;this.url=e,this.title=a||"未命名音轨",s&&(this.ensureAudio(),this.audio&&(this.audio.src=e,this.audio.volume=this.volume,this.audio.load())),this.render(),s&&e&&this.want&&this.arm()}ensureAudio(){if(this.audio)return;const e=new Audio;e.loop=!0,e.preload="metadata",e.volume=this.volume,e.addEventListener("play",()=>this.render()),e.addEventListener("pause",()=>this.render()),e.addEventListener("error",()=>{this.render(),this.url&&$("背景音乐加载失败，可能是格式不支持","err")}),this.audio=e}arm(){if(this.armed)return;this.armed=!0;const e=a=>{const s=a.target;s&&s.closest(".bgm")||(document.removeEventListener("pointerdown",e),document.removeEventListener("keydown",e),this.want&&this.audio&&this.audio.paused&&this.play())};document.addEventListener("pointerdown",e),document.addEventListener("keydown",e)}async play(){if(this.ensureAudio(),!(!this.audio||!this.url))try{await this.audio.play(),localStorage.setItem("qz.bgm","on")}catch{this.render()}}pause(){var e;(e=this.audio)==null||e.pause(),localStorage.setItem("qz.bgm","off"),this.render()}isPlaying(){return!!this.audio&&!this.audio.paused}toggle(){var e;if(!this.url){$("还没有设置背景音乐，可以在「设置」里上传","err");return}((e=this.audio)==null?void 0:e.paused)!==!1?this.play():this.pause()}setVolume(e){localStorage.setItem("qz.bgm.vol",String(e)),this.audio&&(this.audio.volume=e)}mount(){if(this.pill){this.render();return}const e=document.createElement("div");e.className="bgm",document.body.appendChild(e),this.pill=e,e.addEventListener("click",a=>{const s=a.target;if(s.closest("[data-bgm-toggle]")){this.toggle();return}s.closest(".bgm-meta")&&(location.hash="#/settings?tab=music")}),e.addEventListener("input",a=>{const s=a.target;s.matches(".bgm-vol")&&this.setVolume(Number(s.value))}),this.render(),this.url&&this.want&&this.arm()}unmount(){var e,a;(e=this.pill)==null||e.remove(),this.pill=null,(a=this.audio)==null||a.pause(),document.body.classList.remove("has-bgm")}render(){if(document.body.classList.toggle("has-bgm",!!this.url),!this.pill)return;const e=this.audio?!this.audio.paused:!1,a=Math.round(this.volume*100);window.dispatchEvent(new CustomEvent("qz:bgm",{detail:{playing:e}})),this.pill.innerHTML=`
      <div class="bgm-disc ${e?"spin":""}" data-bgm-toggle title="${e?"暂停":"播放"}">${b("music",16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${g(this.url?this.title:"未设置音轨")}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${e?"暂停":"播放"}">
        ${b(e?"pause":"play",14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${a}" aria-label="音量">
      <div class="bgm-wave ${e?"on":""}"><i></i><i></i><i></i><i></i></div>`}}const I=new Js;window.bgm=I;function ea(t,e){t.innerHTML=`
  <div class="auth">
    <section class="auth-brand">
      <div class="auth-brand-inner">
        <div class="auth-logo">${b("pen",20)}</div>
        <h1>个人空间</h1>
        <p class="auth-lead">写下长一点的东西。照片、文章、留言，都放在自己的域名里。</p>
        <ul class="auth-points">
          <li>${b("book",15)} Markdown 写作，支持插图与代码</li>
          <li>${b("image",15)} 相册真实上传，存放在你自己的服务器</li>
          <li>${b("music",15)} 背景音乐真实播放</li>
          <li>${b("lock",15)} 每篇文章独立设置可见范围</li>
        </ul>
      </div>
      <div class="auth-foot">Go · ent · SQLite · TypeScript</div>
    </section>

    <section class="auth-panel">
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab active" data-mode="login">登录</button>
          <button class="auth-tab" data-mode="register">注册</button>
        </div>

        <form id="auth-form" class="auth-form">
          <label class="field">
            <span>空间号</span>
            <input class="input" name="uin" autocomplete="username" placeholder="字母、数字或下划线" required>
          </label>
          <label class="field" data-only="register" hidden>
            <span>昵称</span>
            <input class="input" name="nickname" maxlength="20" placeholder="别人看到的名字">
          </label>
          <label class="field">
            <span>密码</span>
            <input class="input" name="password" type="password" autocomplete="current-password" placeholder="至少 6 位" required>
          </label>
          <button class="btn btn-primary btn-lg btn-block" type="submit" id="auth-submit">登录</button>
        </form>

        <p class="auth-hint" id="auth-hint">还没有账号？点上面的「注册」，30 秒就能开通。</p>

        <div class="auth-demo">
          <span>演示账号</span>
          <button type="button" class="demo-chip" data-uin="294388344" data-pw="qzone123">294388344</button>
          <button type="button" class="demo-chip" data-uin="linwan" data-pw="qzone123">linwan</button>
        </div>
      </div>
    </section>
  </div>`;const a=t.querySelector("#auth-form"),s=t.querySelector("#auth-submit"),n=t.querySelector("#auth-hint"),r=Array.from(t.querySelectorAll(".auth-tab"));let i="login";const o=u=>{i=u,r.forEach(p=>p.classList.toggle("active",p.dataset.mode===u)),t.querySelectorAll('[data-only="register"]').forEach(p=>{p.hidden=u!=="register"});const d=a.elements.namedItem("nickname");d.required=u==="register",s.textContent=u==="login"?"登录":"创建空间",n.textContent=u==="login"?"还没有账号？点上面的「注册」，30 秒就能开通。":"空间号将作为你的主页地址，注册后不可修改。"};r.forEach(u=>u.addEventListener("click",()=>o(u.dataset.mode))),t.querySelectorAll(".demo-chip").forEach(u=>{u.addEventListener("click",()=>{var d,p;o("login"),a.elements.namedItem("uin").value=(d=u.dataset.uin)!=null?d:"",a.elements.namedItem("password").value=(p=u.dataset.pw)!=null?p:"",s.focus()})}),a.addEventListener("submit",async u=>{var c,f,y;u.preventDefault();const d=new FormData(a),p=String((c=d.get("uin"))!=null?c:"").trim(),l=String((f=d.get("password"))!=null?f:""),m=String((y=d.get("nickname"))!=null?y:"").trim();if(i==="register"&&!m){$("请填写昵称","err");return}s.disabled=!0,s.textContent=i==="login"?"登录中…":"创建中…";try{i==="login"?await L.login(p,l):await L.register(p,m,l),$(i==="login"?"欢迎回来":"空间已开通","ok"),await e()}catch(w){$(g(w.message),"err"),s.disabled=!1,s.textContent=i==="login"?"登录":"创建空间"}})}const bs={private:"仅自己可见",unlisted:"不公开列出",public:""};function fs(t){const e=t.cover||t.images[0]||"";return`<article class="feature card" data-post="${t.id}">
    <a class="feature-cover" href="#/post/${t.id}">
      ${e?`<img src="${g(e)}" alt="${g(t.title)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
    </a>
    <div class="feature-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        <span class="pill">${g(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${bs[t.visibility]}</span>`:""}
      </div>
      <h2 class="feature-title"><a href="#/post/${t.id}">${g(t.title||"无标题")}</a></h2>
      <p class="feature-summary">${g(t.summary)}</p>
      <div class="post-meta">
        <span>${ce(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${b("clock",12)} ${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
  </article>`}function tt(t){const e=t.cover||t.images[0]||"";return`<article class="post-row" data-post="${t.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        <span class="pill">${g(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${bs[t.visibility]}</span>`:""}
      </div>
      <h3 class="post-row-title"><a href="#/post/${t.id}">${g(t.title||"无标题")}</a></h3>
      <p class="post-row-summary">${g(t.summary)}</p>
      <div class="post-meta">
        <span>${ce(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
    ${e?`<a class="post-row-thumb" href="#/post/${t.id}"><img src="${g(e)}" alt="" loading="lazy"></a>`:""}
  </article>`}function Jt(t){return t.length?`<ul class="comment-list">${t.map(e=>`<li class="comment" data-cid="${e.id}">
        ${ie(e.author.avatar,e.author.nickname,34,e.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${g(e.author.uin)}">${g(e.author.nickname)}</a>
            <time>${ce(e.at)}</time>
            <button class="text-btn" data-reply="${g(e.author.nickname)}">回复</button>
            ${e.canDel?`<button class="text-btn danger" data-del-comment="${e.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${e.replyTo?`<span class="comment-reply">回复 ${g(e.replyTo)}：</span>`:""}${g(e.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function ta(t){return`<a class="album-card card" href="#/album/${t.id}">
    <div class="album-cover">
      ${t.cover?`<img src="${g(t.cover)}" alt="${g(t.name)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${t.count} 张</span>
    </div>
    <div class="album-info">
      <h3>${g(t.name)}</h3>
      <p>${g(t.description||"还没有描述")}</p>
    </div>
  </a>`}async function sa(t,e){var r;const a=fe();t.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${g(a.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ie(a.avatar,a.nickname,0,"",0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${b("pin",12)} ${g(a.city||"未设置城市")} · ${g(a.constellation||"—")}</p>
          <h1>${g(a.nickname)}</h1>
          <p class="hero-sign">${g(a.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${a.posts}</b>文章</span>
            <span><b>${a.photos}</b>照片</span>
            <span><b>${a.visitCount.toLocaleString()}</b>访问</span>
            <span><b>${a.signStreak}</b>连签</span>
          </div>
        </div>
        <div class="hero-actions hero-actions--self">
          <a class="btn btn-primary" href="#/write">${b("pen",15)} 写文章</a>
          <a class="btn btn-ghost" href="#/settings">${b("settings",15)} 设置</a>
        </div>
      </div>
    </section>

    <div class="home-grid">
      <div class="home-main" id="home-main">${We(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,et(t);const s=t.querySelector("#home-main"),n=t.querySelector("#home-rail");try{const[{posts:i,total:o},u]=await Promise.all([L.posts({limit:7}),L.albums()]);if(!i.length)s.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const p=(r=i.find(m=>m.pinned))!=null?r:i[0],l=i.filter(m=>m.id!==p.id);s.innerHTML=`
        ${fs(p)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${o} 篇 ${b("chevron",12)}</a>
        </div>
        <div class="post-list">${l.map(tt).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}n.innerHTML=`
      <section class="rail-card">
        <h3>关于我</h3>
        <p class="rail-bio">${g(a.bio?a.bio.split(`
`)[0].replace(/^#+\s*/,""):a.signature||"还没有写自我介绍。")}</p>
        <div class="tag-cloud">${a.tags.map(p=>`<a class="tag" href="#/search?q=${encodeURIComponent(p)}">${g(p)}</a>`).join("")||'<span class="muted">还没有标签</span>'}</div>
        <a class="rail-link" href="#/about">了解更多 ${b("chevron",12)}</a>
      </section>

      <section class="rail-card">
        <h3>背景音乐</h3>
        <div class="rail-music">
          <div class="rail-disc ${ot()?"spin":""}">${b("music",16)}</div>
          <div class="rail-music-meta">
            <b>${g(a.bgmTitle||"未设置音轨")}</b>
            <span>${a.bgmUrl?"正在循环播放":"去设置里上传一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${ot()?b("pause",13):b("play",13)} ${ot()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${u.albums.slice(0,3).map(p=>`<a class="rail-album" href="#/album/${p.id}">
                <img src="${g(p.cover)}" alt="">
                <span>${g(p.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${b("mail",13)} 去留言</a>
      </section>`;const d=n.querySelector("#rail-play");window.addEventListener("qz:bgm",()=>{var p;d&&((p=n.querySelector(".rail-disc"))==null||p.classList.toggle("spin",I.isPlaying()),d.innerHTML=`${I.isPlaying()?b("pause",13):b("play",13)} ${I.isPlaying()?"暂停":"播放"}`)}),d==null||d.addEventListener("click",()=>{I.toggle()})}catch(i){$(i.message,"err")}}function ot(){return I.isPlaying()}const aa=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function na(t,e){const a=e.params.sort==="popular"?"popular":"latest",s=e.params.category||"全部",n=e.params.q||"";t.innerHTML=`<div class="page">
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
        ${aa.map(m=>`<button class="sort-btn ${m.key===a?"active":""}" data-sort="${m.key}">${m.label}</button>`).join("")}
      </div>
    </div>
    ${n?`<p class="search-note">搜索「${g(n)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${We(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const r=t.querySelector("#archive-list"),i=t.querySelector("#load-more"),o=t.querySelector("#cat-row");let u,d=[];const p=()=>{const m=new Set(["全部"]);d.forEach(c=>c.category&&m.add(c.category)),o.innerHTML=Array.from(m).map(c=>`<button class="chip ${c===s?"active":""}" data-cat="${g(c)}">${g(c)}</button>`).join("")},l=async m=>{m&&(u=void 0,r.innerHTML=We(2));const c=await L.posts({category:s,sort:a,q:n,limit:8,before:u});d=m?c.posts:d.concat(c.posts);const f=c.posts.map(tt).join("");m?r.innerHTML=f:r.insertAdjacentHTML("beforeend",f),c.posts.length&&(u=c.posts[c.posts.length-1].at),i.hidden=!c.hasMore,t.querySelector("#archive-sub").textContent=`共 ${c.total} 篇 · 按${a==="popular"?"阅读量":"时间"}排序`,p(),m&&!c.posts.length&&(r.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await l(!1)}catch(m){$(m.message,"err")}finally{i.disabled=!1}}),o.addEventListener("click",m=>{const c=m.target.closest("[data-cat]");if(!c)return;const f=new URLSearchParams;c.dataset.cat&&c.dataset.cat!=="全部"&&f.set("category",c.dataset.cat),a==="popular"&&f.set("sort","popular"),location.hash=`#/posts${f.toString()?"?"+f.toString():""}`}),t.querySelectorAll("[data-sort]").forEach(m=>{m.addEventListener("click",()=>{const c=new URLSearchParams;s!=="全部"&&c.set("category",s),m.dataset.sort==="popular"&&c.set("sort","popular"),location.hash=`#/posts${c.toString()?"?"+c.toString():""}`})});try{await l(!0)}catch(m){$(m.message,"err"),r.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}function vt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ve=vt();function vs(t){ve=t}var he={exec:()=>null};function pe(t){let e=[];return a=>{let s=Math.max(0,Math.min(3,a-1)),n=e[s];return n||(n=t(s),e[s]=n),n}}function E(t,e=""){let a=typeof t=="string"?t:t.source,s={replace:(n,r)=>{let i=typeof r=="string"?r:r.source;return i=i.replace(z.caret,"$1"),a=a.replace(n,i),s},getRegex:()=>new RegExp(a,e)};return s}var ks=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),ys="^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)",z={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,textIndentedContinuation:/^(?:\n(?: {4}| {0,3}\t)[ \t]*[^ \t\n][^\n]*)+/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,blockquoteFenceOpen:/^ {0,3}(`{3,}(?=[^`]*$)|~{3,})/,blockquoteFenceClose:/^ {0,3}(`{3,}|~{3,})[ \t]*$/,blockquoteListItemStart:/^ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|$)/,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableHeader:new RegExp(ys+"(?:\\n|$)"),tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:pe(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:pe(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:pe(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:pe(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:pe(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:pe(t=>new RegExp(`^ {0,${t}}(?:</?(?:${yt})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:pe(t=>new RegExp(`^ {0,${t}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},ia=/^(?:[ \t]*(?:\n|$))+/,ra=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,la=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*)[ \t]*(?=\n|$)|$)/,He=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,oa=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,kt=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,yt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",_e=E(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",yt).getRegex(),$s=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,ws=E($s).replace(/bull/g,kt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,_e).getRegex(),ca=E($s).replace(/bull/g,kt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,_e).getRegex(),$t=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,da=/^[^\n]+/,wt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,ua=E(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",wt).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),pa=E(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,kt).getRegex(),xt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ha=E("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",xt).replace("tag",yt).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),xs=t=>E($t).replace("hr",He).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html",_e).getRegex(),ma=xs(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),ga=xs(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),es=/ {0,3}> ?(?:(?!blank)(paragraph)|[^\n]*)(?:\n|$)/,ba=E(/^(first)(?:next)*/).replace("first",E(es).replace("blank",/[ \t]*(?:\n|$)| {4}/).getRegex()).replace("next",E(es).replace("blank",/[ \t]*(?:\n|$)/).getRegex()).replace(/paragraph/g,ga).getRegex(),St={blockquote:ba,code:ra,def:ua,fences:la,heading:oa,hr:He,html:ha,lheading:ws,list:pa,newline:ia,paragraph:ma,table:he,text:da},fa=E(ys+"(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",He).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",_e).getRegex(),va={...St,lheading:ca,table:fa,paragraph:E($t).replace("hr",He).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",z.tableHeader).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",_e).getRegex()},ka={...St,html:E(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",xt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:he,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:E($t).replace("hr",He).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",ws).getRegex()},ya=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,$a=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ss=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,wa=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,se=/[\p{P}\p{S}]/u,Te=/[\s\p{P}\p{S}]/u,De=/[^\s\p{P}\p{S}]/u,xa=E(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Te).getRegex(),Sa=/[\p{Pi}\p{Ps}"']/u,Ls=/(?!~)[\p{P}\p{S}]/u,La=/(?!~)[\s\p{P}\p{S}]/u,Ea=/(?:[^\s\p{P}\p{S}]|~)/u,Ta=E(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ks?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Es=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Ma=E(Es,"u").replace(/punct/g,se).getRegex(),qa=E(Es,"u").replace(/punct/g,Ls).getRegex(),Aa=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Ra=E(Aa,"u").replace(/openQuote/g,Sa).replace(/punct/g,se).getRegex(),Ts="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ca=E(Ts,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,se).getRegex(),za=E(Ts,"gu").replace(/notPunctSpace/g,Ea).replace(/punctSpace/g,La).replace(/punct/g,Ls).getRegex(),Ia="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Pa=E(Ia,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,se).getRegex(),Ha=E("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,se).getRegex(),_a="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",Da=E(_a,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,se).getRegex(),Ba=E(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,se).getRegex(),Oa="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",ja=E(Oa,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,se).getRegex(),Na=E(/\\(punct)/,"gu").replace(/punct/g,se).getRegex(),Ua=E(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,se).getRegex(),Fa=E(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Za=E(xt).replace("(?:-->|$)","-->").getRegex(),Va=E("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Za).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ms=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,Ke=E(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Ms).getRegex(),st=/\\[^ \t\n\x00-\x1f]|\\(?=[ \t\n])|[^ \t\n\x00-\x1f\\()]/,Ga=E(/\((?:char)*\)/).replace("char",st).getRegex(),Qa=E(/\((?:char|p1)*\)/).replace("char",st).replace("p1",Ga).getRegex(),Wa=E(/\((?:char|p2)*\)/).replace("char",st).replace("p2",Qa).getRegex(),Ka=E(/(?!<)(?:char|p3)+/).replace("char",st).replace("p3",Wa).getRegex(),Xa=E(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",Ke).replace("href",E(/<(?:\\.|[^\n<>\\])*>|bareHref|(?=\))/).replace("bareHref",Ka).getRegex()).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),Ya=E(/^!?\[(label)\]\[(ref)\]/).replace("label",Ke).replace("ref",wt).getRegex(),Ja=E(/^!?\[(ref)\](?:\[\])?/).replace("ref",wt).getRegex(),ts=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,en=E(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Ms).getRegex(),tn=E("reflink|nolink(?!\\()","g").replace("reflink",E(/^!?\[(label)\]\[(ref)\]/).replace("label",en).replace("ref",ts).getRegex()).replace("nolink",E(/^!?\[(ref)\](?:\[\])?/).replace("ref",ts).getRegex()).getRegex(),ss=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,sn=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,an=E(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,sn).getRegex(),Lt={_backpedal:he,anyPunctuation:Na,anyPunctuationOutsideCode:Ua,autolink:Fa,blockSkip:Ta,br:Ss,code:$a,del:he,delLDelim:he,delRDelim:he,emStrongLDelim:Ma,emStrongRDelimAst:Ca,emStrongRDelimUnd:Ha,escape:ya,link:Xa,nolink:Ja,punctuation:xa,reflink:Ya,reflinkSearch:tn,tag:Va,text:wa,url:he},nn={...Lt,emStrongLDelim:Ra,emStrongRDelimAst:Pa,emStrongRDelimUnd:Da,link:E(/^!?\[(label)\]\((.*?)\)/).replace("label",Ke).getRegex(),reflink:E(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ke).getRegex()},ht={...Lt,emStrongRDelimAst:za,emStrongLDelim:qa,delLDelim:Ba,delRDelim:ja,url:E(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",an).replace("protocol",ss).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:E(/^(?:[A-Za-z0-9.+-]+(?=@)|[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",ss).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",ks?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},rn={...ht,br:E(Ss).replace("{2,}","*").getRegex(),text:E(ht.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ne={normal:St,gfm:va,pedantic:ka},Ce={normal:Lt,gfm:ht,breaks:rn,pedantic:nn},ln={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},as=t=>ln[t];function B(t,e){if(e){if(z.escapeTest.test(t))return t.replace(z.escapeReplace,as)}else if(z.escapeTestNoEncode.test(t))return t.replace(z.escapeReplaceNoEncode,as);return t}function on(t){return z.numericCharacterReference.test(t)?t.replace(z.numericCharacterReferenceOrAmpersand,(e,a,s)=>{if(a===void 0&&s===void 0)return"&amp;";let n=a===void 0?Number.parseInt(s,16):Number.parseInt(a,10);return n===0||n>1114111||n>=55296&&n<=57343?"�":n===38?"&amp;":String.fromCodePoint(n)}):t}function ns(t){try{t=encodeURI(t).replace(z.percentDecode,"%")}catch{return null}return t}function ct(t,e){var r;let a=t.replace(z.findPipe,(i,o,u)=>{let d=!1,p=o;for(;--p>=0&&u[p]==="\\";)d=!d;return d?"|":" |"}),s=a.split(z.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!((r=s.at(-1))!=null&&r.trim())&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(z.slashPipe,"|");return s}function ne(t,e,a){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function is(t){let e=t.split(`
`),a=e.length-1;for(;a>=0&&z.blankLine.test(e[a]);)a--;return e.length-a<=2?t:e.slice(0,a+1).join(`
`)}function Xe(t){return t.trim().replace(z.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function rs(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let a=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])a++;else if(t[s]===e[1]&&(a--,a<0))return s;return a>0?-2:-1}var Ee=new WeakMap;function Et(t){let e={"*":-1,_:-1},a=-1,s=t.length;for(let n=0;n<s;n++){let r=t[n];if(r!=="*"&&r!=="_"&&r!=="~")continue;let i=n===0?`
`:t[n-1],o=n+1;for(;o<s&&t[o]===r;)o++;i!==" "&&i!=="	"&&i!==`
`&&i!=="\r"&&i!=="\f"&&(r==="~"?a=n:e[r]=n),n=o-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:a}}function cn(t,e){let a=Et(e),s=Ee.get(t);s?s.push(a):Ee.set(t,[a])}function dn(t){let e=Ee.get(t);e&&(e.pop(),e.length===0&&Ee.delete(t))}function qs(t,e,a){var n;let s=(n=Ee.get(t))==null?void 0:n.at(-1);return s&&s.maskedSrc===e?s.lastPossibleEmStrongCloserIndex[a]:Et(e).lastPossibleEmStrongCloserIndex[a]}function As(t,e){var s;let a=(s=Ee.get(t))==null?void 0:s.at(-1);return a&&a.maskedSrc===e?a.lastPossibleDelCloserIndex:Et(e).lastPossibleDelCloserIndex}function Ue(t,e=0){let a=e,s="";for(let n of t)if(n==="	"){let r=4-a%4;s+=" ".repeat(r),a+=r}else s+=n,a++;return s}function un(t){let e,a=!1;return t.map(s=>{var d,p,l;if(a)return s;let{depth:n,expanded:r,keptIndent:i,content:o}=pn(s,(d=e==null?void 0:e.depth)!=null?d:1/0);if((e==null?void 0:e.depth)!==n&&(e=void 0),e){let m=(p=z.blockquoteFenceClose.exec(o))==null?void 0:p[1];return!m||m[0]!==e.marker[0]||m.length<e.marker.length?i:(e=void 0,r)}if(a=z.blockquoteListItemStart.test(o),a)return s;let u=(l=z.blockquoteFenceOpen.exec(o))==null?void 0:l[1];return u&&(e={marker:u,depth:n}),r}).join(`
`)}function pn(t,e){let a=0,s=0,n=0,r=0,i="";for(;n<e;){let p=a,l=s;for(;t[p]===" "||t[p]==="	";)l+=ls(t[p],l),p++;if(t[p]!==">"||l-r>3)break;i+=" ".repeat(l-s)+">",n++,a=p+1,s=l+1,r=t[a]===" "||t[a]==="	"?s+1:s}if(n===0)return{depth:n,expanded:t,keptIndent:t,content:t};let o="",u="";for(;(t[a]===" "||t[a]==="	")&&s<r+4;){let p=ls(t[a],s);o+=" ".repeat(p),u+=s<r&&p>1?" ".repeat(p):t[a],s+=p,a++}let d=t.slice(a);return{depth:n,expanded:i+o+d,keptIndent:i+u+d,content:" ".repeat(Math.max(0,s-r))+d}}function ls(t,e){return t==="	"?4-e%4:1}function hn(t,e){let a="";for(let s=0;s<t.length;s++){if(t[s]==="`"){let n=e.inline.code.exec(t.slice(s));if(n){a+=n[0],s+=n[0].length-1;continue}}if(t[s]==="\\"&&(t[s+1]==="["||t[s+1]==="]")){a+=t[s+1],s++;continue}a+=t[s]}return a}function os(t,e,a,s,n){let r=e.href,i=e.title||null,o=hn(t[1],n),u=t[0].charAt(0)==="!",d=s.state.inLink,p=s.state.linkEmitted,l=s.state.inRawBlock;s.state.inLink=!0,s.state.linkEmitted=!1;let m=s.inlineTokens(o),c=s.state.linkEmitted;if(s.state.linkEmitted=p,s.state.inLink=d,!u){if(c){s.state.inRawBlock=l;return}s.state.linkEmitted=!0}return{type:u?"image":"link",raw:a,href:r,title:i,text:o,tokens:m}}function mn(t,e,a){let s=t.match(a.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(r=>{let i=r.match(a.other.beginningSpace);if(i===null)return r;let[o]=i;return r.slice(Math.min(o.length,n.length))}).join(`
`)}function cs(t,e,a,s){if(!e.includes("<"))return!1;for(let n=0;n<e.length;n++){if(e[n]==="\\"){n++;continue}if(e[n]==="`"){let o=s.inline.code.exec(e.slice(n));if(o){n+=o[0].length-1;continue}}if(e[n]!=="<")continue;let r=t.slice(a+n),i=s.inline.tag.exec(r)||s.inline.autolink.exec(r);if(i){if(i[0].length>e.length-n)return!0;n+=i[0].length-1}}return!1}var me=class{constructor(t){M(this,"options");M(this,"rules");M(this,"lexer");this.options=t||ve}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let a=this.options.pedantic?e[0]:is(e[0]),s=a.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:a,codeBlockStyle:"indented",text:s}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let a=e[0],s=mn(a,e[3]||"",this.rules);return e[3]!==void 0&&(s===""||s.endsWith(`
`))&&(s+=`
`),{type:"code",raw:a,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let a=e[2].trim();if(this.rules.other.endingHash.test(a)){let s=ne(a,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(a=s.trim())}return{type:"heading",raw:ne(e[0],`
`),depth:e[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:ne(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let a=ne(e[0],`
`).split(`
`),s="",n="",r=[];for(;a.length>0;){let i=!1,o=[],u;for(u=0;u<a.length;u++)if(this.rules.other.blockquoteStart.test(a[u]))o.push(a[u]),i=!0;else if(!i)o.push(a[u]);else break;a=a.slice(u);let d=o.join(`
`),p=(this.lexer.state.top&&!this.lexer.state.inBlockquote&&d.includes("	")?un(o):d).replace(this.rules.other.blockquoteMarkerWhitespace,(f,y,w)=>w.startsWith(" ")?y+" "+w.slice(1):y+Ue(w,y.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${d}`:d,n=n?`${n}
${p}`:p;let l=this.lexer.state.top,m=this.lexer.state.inBlockquote;if(this.lexer.state.top=!0,this.lexer.state.inBlockquote=!0,this.lexer.blockTokens(p,r,!0),this.lexer.state.top=l,this.lexer.state.inBlockquote=m,a.length===0)break;let c=r.at(-1);if((c==null?void 0:c.type)==="code"||(c==null?void 0:c.type)==="heading"||(c==null?void 0:c.type)==="hr"||(c==null?void 0:c.type)==="html"||(c==null?void 0:c.type)==="table")break;if((c==null?void 0:c.type)==="blockquote"){let f=c,y=a.join(`
`),w=f.raw+`
`+y.replace(this.rules.other.blockquoteSetextReplace2,"");this.lexer.state.inBlockquote=!0;let S=this.blockquote(w);this.lexer.state.inBlockquote=m,r[r.length-1]=S;let T=w.substring(S.raw.length).replace(/^\n/,""),O=T?T.split(`
`).length:0,R=O?a.slice(0,-O):a;if(R.length>0&&(s=`${s}
${R.join(`
`)}`),n=n.substring(0,n.length-f.text.length)+S.text,a=a.slice(R.length),a.length>0&&this.rules.other.blockquoteStart.test(a[0]))continue;break}else if((c==null?void 0:c.type)==="list"){let f=c,y=f.raw+`
`+a.join(`
`),w=this.list(y);r[r.length-1]=w;let S=w.raw.length>f.raw.length?y.slice(f.raw.length+1,w.raw.length).split(`
`).length:0;if(S>0){let T=a.slice(0,S).join(`
`);s=`${s}
${T}`,n=`${n}
${T}`}if(a=a.slice(S),a.length>0&&!this.rules.other.blockquoteStart.test(a[0]))break;continue}}return{type:"blockquote",raw:s,tokens:r,text:n}}}list(t){var a;let e=this.rules.block.list.exec(t);if(e){if(!this.options.pedantic&&((a=this.lexer.state.lastToken)==null?void 0:a.type)==="text"&&!this.rules.other.listInterruptsParagraph.test(t))return;let s=t,n=()=>s.length-t.length,r=e[1].trim(),i=r.length>1,o={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let u=this.rules.other.listItemRegex(r),d=!1;for(;t;){let m=!1,c="";if(!(e=u.exec(t))||this.rules.block.hr.test(t))break;let f=n();t=t.substring(e[0].length);let y=e[2].split(`
`,1)[0],w=e[1].length,S=this.options.pedantic?Ue(y,w):y.replace(this.rules.other.leadingSpaceTab,X=>Ue(X,w)),T=t.split(`
`,1)[0],O=!S.trim(),R=0;if(this.options.pedantic?(R=2,c=S.trimStart()):O?R=w+1:(R=S.search(this.rules.other.nonSpaceChar),R=R>4?1:R,c=S.slice(R),R+=w),O&&this.rules.other.blankLine.test(T)&&(t=t.substring(T.length+1),m=!0),!m){let X=this.rules.other.nextBulletRegex(R),j=this.rules.other.hrRegex(R),re=this.rules.other.fencesBeginRegex(R),P=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(R):this.rules.other.headingBeginRegex(R),Z=this.rules.other.htmlBeginRegex(R),N=this.rules.other.blockquoteBeginRegex(R),Y=!1;for(;t;){let ke=t.split(`
`,1)[0],V;if(T=ke,this.options.pedantic?(T=T.replace(this.rules.other.listReplaceNesting,"  "),V=T):V=T.replace(this.rules.other.leadingSpaceTab,H=>Ue(H)),re.test(T)||P.test(T)||Z.test(T)||N.test(T)||X.test(T)||j.test(T))break;if(V.search(this.rules.other.nonSpaceChar)>=R||!T.trim())c+=`
`+V.slice(R),Y=!1;else{if(O)break;let H=S;if(!this.options.pedantic&&!c.includes(`
`)&&!S.includes("	")){let G;for(;!j.test(H)&&(G=this.rules.other.nestedBlockMarker.exec(H));)H=H.slice(G[0].length);if(!H.trim())break}if(H.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||re.test(H)||P.test(H)||Z.test(H)||j.test(H))break;if(!this.options.pedantic&&!Y){let G=S.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(G)||this.rules.block.heading.test(G)||this.rules.block.hr.test(G))break}let Be=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(T)&&this.rules.block.lheading.test(`${S}
${T}`)?`    ${V.replace(/^ {0,3}/,"")}`:T;c+=`
`+Be,Y=!0}O=!T.trim(),t=t.substring(ke.length+1),S=V.slice(R)}}let de=s.slice(f,n());o.loose||(d?o.loose=!0:this.rules.other.doubleBlankLine.test(de)&&(d=!0)),o.items.push({type:"list_item",raw:de,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]})}let p=o.items.at(-1);if(p)p.raw=p.raw.trimEnd(),p.text=p.text.trimEnd();else return;o.raw=s.slice(0,n()).trimEnd();let l=[];for(let m of o.items)if(this.lexer.state.top=!1,l.push(this.lexer.inlineQueue.length),m.tokens=this.lexer.blockTokens(m.text,[]),!o.loose){let c=m.tokens.filter(y=>y.type==="space"),f=c.length>0&&c.some(y=>this.rules.other.anyLine.test(y.raw));o.loose=f}for(let m=0;m<o.items.length;m++){let c=o.items[m],f=c.tokens[0];if(c.task&&((f==null?void 0:f.type)==="text"||(f==null?void 0:f.type)==="paragraph")){c.text=c.text.replace(this.rules.other.listReplaceTask,""),f.raw=f.raw.replace(this.rules.other.listReplaceTask,""),f.text=f.text.replace(this.rules.other.listReplaceTask,"");let y=this.lexer.inlineQueue;for(let S=l[m];S<y.length;S++)if(y[S].tokens===f.tokens){y[S].src=y[S].src.replace(this.rules.other.listReplaceTask,"");break}let w=this.rules.other.listTaskCheckbox.exec(c.raw);if(w){let S={type:"checkbox",raw:w[0]+" ",checked:w[0]!=="[ ]"};c.checked=S.checked,o.loose?c.tokens[0]&&["paragraph","text"].includes(c.tokens[0].type)&&"tokens"in c.tokens[0]&&c.tokens[0].tokens?(c.tokens[0].raw=S.raw+c.tokens[0].raw,c.tokens[0].text=S.raw+c.tokens[0].text,c.tokens[0].tokens.unshift(S)):c.tokens.unshift({type:"paragraph",raw:S.raw,text:S.raw,tokens:[S]}):c.tokens.unshift(S)}}else c.task&&(c.task=!1)}if(o.loose)for(let m of o.items){m.loose=!0;for(let c of m.tokens)c.type==="text"&&(c.type="paragraph")}return o}}html(t){var a;let e=this.rules.block.html.exec(t);if(e){if(((a=this.lexer.state.lastToken)==null?void 0:a.type)==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(t))return;let s=is(e[0]);return{type:"html",block:!0,raw:s,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:s}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&rs(e[2],"()")!==-1)return;let a=Xe(e[1]),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:a,raw:ne(e[0],`
`),href:s,title:n}}}table(t){var i;let e,a;if(this.options.gfm&&!this.options.pedantic){let o=this.rules.other.tableHeader.exec(t);if(!o||!this.rules.other.tableDelimiter.test(o[2])||(e=ct(o[1]),a=o[2].replace(this.rules.other.tableAlignChars,"").split("|"),e.length!==a.length))return}let s=this.rules.block.table.exec(t);if(!s||!this.rules.other.tableDelimiter.test(s[2]))return;e!=null||(e=ct(s[1])),a!=null||(a=s[2].replace(this.rules.other.tableAlignChars,"").split("|"));let n=(i=s[3])!=null&&i.trim()?s[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:ne(s[0],`
`),header:[],align:[],rows:[]};if(e.length===a.length){for(let o of a)this.rules.other.tableAlignRight.test(o)?r.align.push("right"):this.rules.other.tableAlignCenter.test(o)?r.align.push("center"):this.rules.other.tableAlignLeft.test(o)?r.align.push("left"):r.align.push(null);for(let o=0;o<e.length;o++)r.header.push({text:e[o],tokens:this.lexer.inline(e[o]),header:!0,align:r.align[o]});for(let o of n)r.rows.push(ct(o,r.header.length).map((u,d)=>({text:u,tokens:this.lexer.inline(u),header:!1,align:r.align[d]})));return r}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let a=e[1].trim();return{type:"heading",raw:ne(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:a,tokens:this.lexer.inline(a)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let a=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:a,tokens:this.lexer.inline(a)}}}text(t){let e=this.rules.block.text.exec(t);if(e){let a=e[0],s=e[0],n=this.rules.other.textIndentedContinuation.exec(t.slice(a.length));return n&&(a+=n[0],s+=n[0].replace(this.rules.other.codeRemoveIndent,"")),{type:"text",raw:a,text:s,tokens:this.lexer.inline(s)}}}escape(t){if(t.charCodeAt(0)!==92)return;let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=t.charCodeAt(0);if(e!==91&&e!==33)return;let a=this.rules.inline.link.exec(t);if(a){let s=a[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&cs(t,a[1],s,this.rules))return;let n=a[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let u=ne(n.slice(0,-1),"\\");if((n.length-u.length)%2===0)return}else{let u=rs(a[2],"()");if(u===-2)return;if(u>-1){let d=(a[0].indexOf("!")===0?5:4)+a[1].length+u;a[2]=a[2].substring(0,u),a[0]=a[0].substring(0,d).trim(),a[3]=""}}let r=ne(a[0].slice(0,-1),"\\");if((a[0].length-r.length)%2===0)return;let i=a[2],o="";if(this.options.pedantic){let u=this.rules.other.pedanticHrefTitle.exec(i);u&&(i=u[1],o=u[3])}else o=a[3]?a[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),os(a,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:o&&o.replace(this.rules.inline.anyPunctuation,"$1")},a[0],this.lexer,this.rules)}}reflink(t,e){let a=t.charCodeAt(0);if(a!==91&&a!==33)return;let s;if((s=this.rules.inline.reflink.exec(t))||(s=this.rules.inline.nolink.exec(t))){let n=s[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&cs(t,s[1],n,this.rules))return;let r=e[Xe(s[2]||s[1])];if(!r){let i=s[0].charAt(0);return{type:"text",raw:i,text:i}}return os(s,r,s[0],this.lexer,this.rules)}}emStrong(t,e,a=""){var m;let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4])return;let n=s[0][0],r=a===n,i=e.length-t.length,o=i;for(;!this.options.pedantic&&o>0&&e[o-1]===n;)o--;let u=(m=[...e.slice(Math.max(0,o-2),o)].at(-1))!=null?m:"",d=u==="*"||u==="_"||!!this.rules.inline.punctuation.exec(u);o<i&&(a=u);let p=o<i?d:a==="*"||a==="_"||!!this.rules.inline.punctuation.exec(a);if(s[4]&&a.match(this.rules.other.unicodeAlphaNumeric))return;let l=s[1]||s[3]||"";if(!l||!a||p){let c=[...s[0]].length-1,f,y,w=c,S=0,T=i-o+c,O=!this.options.pedantic&&!!u.trim()&&(!!l||n==="*"&&!d);if(n!=="*"&&n!=="_")return;let R=n==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,de=qs(this,e,n),X=e.length-t.length+c;if(de<X)return;e=e.slice(-1*t.length+c);let j=de-X;for(R.lastIndex=0;(s=R.exec(e))!==null&&!(s.index>j);){if(f=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!f)continue;if(y=[...f].length,s[3]||s[4]){w+=y;continue}else if((s[5]||s[6]||O)&&T%3&&!((T+y)%3)){if(r&&(s[5]||s[6]))break;S+=y;continue}if(w-=y,w>0)continue;y=Math.min(y,y+w+S);let re=[...s[0]][0].length,P=t.slice(0,c+s.index+re+y);if(Math.min(c,y)%2){let N=P.slice(1,-1);return{type:"em",raw:P,text:N,tokens:this.lexer.inlineTokens(N)}}let Z=P.slice(2,-2);return{type:"strong",raw:P,text:Z,tokens:this.lexer.inlineTokens(Z)}}}}codespan(t){if(t.charCodeAt(0)!==96)return;let e=this.rules.inline.code.exec(t);if(e){let a=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return s&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:e[0],text:a}}}br(t){let e=t.charCodeAt(0);if(e!==32&&e!==92&&e!==10)return;let a=this.rules.inline.br.exec(t);if(a)return{type:"br",raw:a[0]}}del(t,e,a=""){if(t.charCodeAt(0)!==126)return;let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!a||this.rules.inline.punctuation.exec(a))){let n=[...s[0]].length-1,r,i,o=n,u=this.rules.inline.delRDelim,d=As(this,e),p=e.length-t.length+n;if(d<p)return;e=e.slice(-1*t.length+n);let l=d-p;for(u.lastIndex=0;(s=u.exec(e))!==null&&!(s.index>l);){if(r=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!r||(i=[...r].length,i!==n))continue;if(s[3]||s[4]){o+=i;continue}if(o-=i,o>0)continue;i=Math.min(i,i+o);let m=[...s[0]][0].length,c=t.slice(0,n+s.index+m+i),f=c.slice(n,-n);return{type:"del",raw:c,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.autolink.exec(t);if(e){let a,s;return e[2]==="@"?(a=e[1],s="mailto:"+a):(a=e[1],s=a),{type:"link",raw:e[0],text:a,href:s,autolink:!0,tokens:[{type:"text",raw:a,text:a}]}}}url(t){var a,s;let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=(s=(a=this.rules.inline._backpedal.exec(e[0]))==null?void 0:a[0])!=null?s:"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let a=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:a?e[0]:on(e[0]),escaped:a}}}},K,Rs,mt,Cs,zs,ge,Q=(ge=class{constructor(e){Qt(this,K);M(this,"tokens");M(this,"options");M(this,"state");M(this,"inlineQueue");M(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ve,this.options.tokenizer=this.options.tokenizer||new me,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0,inBlockquote:!1};let a={other:z,block:Ne.normal,inline:Ce.normal};this.options.pedantic?(a.block=Ne.pedantic,a.inline=Ce.pedantic):this.options.gfm&&(a.block=Ne.gfm,this.options.breaks?a.inline=Ce.breaks:a.inline=Ce.gfm),this.tokenizer.rules=a}static get rules(){return{block:Ne,inline:Ce}}static lex(e,a){return new ge(a).lex(e)}static lexInline(e,a){return new ge(a).inlineTokens(e)}lex(e){e=e.replace(z.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let s=this.inlineQueue[a];this.state.inRawBlock=!1,this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,a=[],s=!1){var u,d,p;this.tokenizer.lexer=this;let n=this.state.lastToken;this.options.pedantic&&(e=e.replace(z.tabCharGlobal,"    ").replace(z.spaceLine,""));let r=1/0,i,o=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===me.prototype.paragraph;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}this.state.lastToken=a.at(-1);let l;if((d=(u=this.options.extensions)==null?void 0:u.block)!=null&&d.some(c=>(l=c.call({lexer:this},e,a))?(e=e.substring(l.raw.length),a.push(l),!0):!1))continue;if(l=this.tokenizer.space(e)){e=e.substring(l.raw.length);let c=a.at(-1);l.raw.length===1&&c!==void 0?c.raw+=`
`:a.push(l);continue}if(l=this.tokenizer.code(e)){e=e.substring(l.raw.length);let c=a.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+l.raw,c.text+=`
`+l.text,this.inlineQueue.at(-1).src=c.text):a.push(l);continue}if(l=this.tokenizer.fences(e)){e=e.substring(l.raw.length),a.push(l);continue}if(l=this.tokenizer.heading(e)){e=e.substring(l.raw.length),a.push(l);continue}if(l=this.tokenizer.hr(e)){e=e.substring(l.raw.length),a.push(l);continue}if(l=this.tokenizer.blockquote(e)){e=e.substring(l.raw.length),a.push(l);continue}if(l=this.tokenizer.list(e)){e=e.substring(l.raw.length),a.push(l);continue}if(l=this.tokenizer.html(e)){e=e.substring(l.raw.length),a.push(l);continue}if(l=this.tokenizer.def(e)){e=e.substring(l.raw.length);let c=a.at(-1);(c==null?void 0:c.type)==="paragraph"||(c==null?void 0:c.type)==="text"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+l.raw,c.text+=`
`+l.raw,this.inlineQueue.at(-1).src=c.text):(this.tokens.links[l.tag]||(this.tokens.links[l.tag]={href:l.href,title:l.title}),a.push(l));continue}if(l=this.tokenizer.table(e)){e=e.substring(l.raw.length),a.push(l);continue}if(l=this.tokenizer.lheading(e)){e=e.substring(l.raw.length),a.push(l);continue}let m=e;if((p=this.options.extensions)!=null&&p.startBlock){let c=1/0,f=e.slice(1),y;this.options.extensions.startBlock.forEach(w=>{y=w.call({lexer:this},f),typeof y=="number"&&y>=0&&(c=Math.min(c,y))}),c<1/0&&c>=0&&(m=e.substring(0,c+1))}if(this.state.top&&(l=this.tokenizer.paragraph(m))){let c=a.at(-1);(s||c===i&&o)&&(c==null?void 0:c.type)==="paragraph"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+l.raw,c.text+=`
`+l.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text,i=c):(a.push(l),i=l),s=m.length!==e.length,e=e.substring(l.raw.length);continue}if(l=this.tokenizer.text(e)){e=e.substring(l.raw.length);let c=a.at(-1);(c==null?void 0:c.type)==="text"?(c.raw+=(c.raw.endsWith(`
`)?"":`
`)+l.raw,c.text+=`
`+l.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=c.text):a.push(l);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=n,a}inline(e,a=[]){return this.inlineQueue.push({src:e,tokens:a}),a}linkInText(e){if(!e.includes("["))return!1;let a=this.tokenizer.rules.inline.link;for(let s of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(a.test(s[0])&&e.charAt(s.index-1)!=="!")return!0;for(let s of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let n=s[0],r=n.lastIndexOf("[");if(!(n.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,Xe(n.slice(r+1,-1))))&&!(r>1&&this.linkInText(n.slice(1,r-1))))return!0}return!1}inlineTokens(e,a=[]){this.tokenizer.lexer=this;let s=this.state.linkParenPossible;this.state.linkParenPossible=e.includes(")");try{return xe(this,K,Rs).call(this,e,a)}finally{this.state.linkParenPossible=s}}infiniteLoopError(e){let a="Infinite loop on byte: "+e;if(this.options.silent)console.error(a);else throw new Error(a)}},K=new WeakSet,Rs=function(e,a){var r;let s=e.includes("*")||e.includes("_")||e.includes("~"),n=s||(r=this.options.hooks)!=null&&r.emStrongMask||this.tokenizer.emStrong!==me.prototype.emStrong||this.tokenizer.del!==me.prototype.del?xe(this,K,zs).call(this,e):e;if(!s)return xe(this,K,mt).call(this,e,n,a);cn(this.tokenizer,n);try{return xe(this,K,mt).call(this,e,n,a)}finally{dn(this.tokenizer)}},mt=function(e,a,s){var o,u,d;let n=!1,r="",i=1/0;for(;e;){if(e.length<i)i=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}n||(r=""),n=!1;let p;if((u=(o=this.options.extensions)==null?void 0:o.inline)!=null&&u.some(c=>(p=c.call({lexer:this},e,s))?(e=e.substring(p.raw.length),s.push(p),!0):!1))continue;if(p=this.tokenizer.escape(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.tag(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.link(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(p.raw.length);let c=s.at(-1);p.type==="text"&&(c==null?void 0:c.type)==="text"?(c.raw+=p.raw,c.text+=p.text):s.push(p);continue}let l=e[0];if(l==="*"||l==="_"){let c=a.length-e.length;if(qs(this.tokenizer,a,l)<=c){let f=1;for(;f<e.length&&e.charCodeAt(f)===l.charCodeAt(0);)f++;let y=e.substring(0,f),w=s.at(-1);(w==null?void 0:w.type)==="text"&&!w.escaped?(w.raw+=y,w.text+=y):s.push({type:"text",raw:y,text:y,escaped:!1}),e=e.substring(f),r=l,n=!0;continue}}else if(l==="~"){let c=a.length-e.length;if(As(this.tokenizer,a)<=c){let f=1;for(;f<e.length&&e.charCodeAt(f)===126;)f++;let y=e.substring(0,f),w=s.at(-1);(w==null?void 0:w.type)==="text"&&!w.escaped?(w.raw+=y,w.text+=y):s.push({type:"text",raw:y,text:y,escaped:!1}),e=e.substring(f),r=l,n=!0;continue}}if(p=this.tokenizer.emStrong(e,a,r)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.codespan(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.br(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.del(e,a,r)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.autolink(e)){e=e.substring(p.raw.length),s.push(p);continue}if(!this.state.inLink&&(p=this.tokenizer.url(e))){e=e.substring(p.raw.length),s.push(p);continue}let m=e;if((d=this.options.extensions)!=null&&d.startInline){let c=1/0,f=e.slice(1),y;this.options.extensions.startInline.forEach(w=>{y=w.call({lexer:this},f),typeof y=="number"&&y>=0&&(c=Math.min(c,y))}),c<1/0&&c>=0&&(m=e.substring(0,c+1))}if(p=this.tokenizer.inlineText(m)){e=e.substring(p.raw.length),p.raw.slice(-1)!=="_"&&(r=p.raw.slice(-1)),n=!0;let c=s.at(-1);(c==null?void 0:c.type)==="text"?(c.raw+=p.raw,c.text+=p.text):s.push(p);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return s},Cs=function(e){let{blockSkip:a,tag:s,autolink:n}=this.tokenizer.rules.inline,r="",i=0,o;for(a.lastIndex=0;o=a.exec(e);){let u=o.index+(o[2]?o[2].length:0),d=o.index+o[0].length;if(e.charAt(u)==="<"){let p=e.slice(u),l=s.exec(p)||n.exec(p);if(!l){a.lastIndex=u+1;continue}d=u+l[0].length,a.lastIndex=d}r+=e.slice(i,u)+"["+"a".repeat(d-u-2)+"]",i=d}return r+e.slice(i)},zs=function(e){var s,n,r;let a=e;if(this.tokens.links&&e.includes("[")){let i=this.tokenizer.rules.inline.reflinkSearch,o=u=>{let d=u.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,Xe(u.slice(d+1,-1))))return u;if(d>1&&u.charAt(0)!=="!"){let p=u.slice(1,d-1);if(this.linkInText(p))return"["+p.replace(i,o)+"]["+"a".repeat(u.length-d-2)+"]"}return"["+"a".repeat(u.length-2)+"]"};a=a.replace(i,o)}return a=a.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(i,o,u)=>u?"+".repeat(i.length):o?o+i.slice(o.length,-o.length).replace(/`/g,"+")+o:i),a=xe(this,K,Cs).call(this,a),a=(r=(n=(s=this.options.hooks)==null?void 0:s.emStrongMask)==null?void 0:n.call({lexer:this},a))!=null?r:a,a},ge);function Is(t){return t.map(e=>e.type==="codespan"||e.type==="escape"?{...e,text:B(e.text,!0)}:"tokens"in e&&e.tokens?{...e,tokens:Is(e.tokens)}:e)}var Ye=class{constructor(t){M(this,"options");M(this,"parser");this.options=t||ve}space(t){return""}code({text:t,lang:e,escaped:a}){var r;let s=(r=(e||"").match(z.notSpaceStart))==null?void 0:r[0],n=t?t.replace(z.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+B(s)+'">'+(a?n:B(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:B(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,a=t.start,s="";for(let i=0;i<t.items.length;i++){let o=t.items[i];s+=this.listitem(o)}let n=e?"ol":"ul",r=e&&a!==1?' start="'+a+'"':"";return"<"+n+r+`>
`+s+"</"+n+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",a="";for(let n=0;n<t.header.length;n++)a+=this.tablecell(t.header[n]);e+=this.tablerow({text:a});let s="";for(let n=0;n<t.rows.length;n++){let r=t.rows[n];a="";for(let i=0;i<r.length;i++)a+=this.tablecell(r[i]);s+=this.tablerow({text:a})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),a=t.header?"th":"td";return(t.align?`<${a} align="${t.align}">`:`<${a}>`)+e+`</${a}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${B(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:a,tokens:s,autolink:n}){let r=n?B(a,!0):this.parser.parseInline(s),i=ns(t);if(i===null)return r;t=B(i,n);let o='<a href="'+t+'"';return e&&(o+=' title="'+B(e)+'"'),o+=">"+r+"</a>",o}image({href:t,title:e,text:a,tokens:s}){s&&(a=this.parser.parseInline(Is(s),this.parser.textRenderer));let n=ns(t);if(n===null)return B(a);t=n;let r=`<img src="${B(t)}" alt="${B(a)}"`;return e&&(r+=` title="${B(e)}"`),r+=">",r}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:B(t.text)}},Tt=class{constructor(){M(this,"parser")}strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return`
`}checkbox({raw:t}){return t}},W=class gt{constructor(e){M(this,"options");M(this,"renderer");M(this,"textRenderer");this.options=e||ve,this.options.renderer=this.options.renderer||new Ye,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Tt,this.textRenderer.parser=this}static parse(e,a){return new gt(a).parse(e)}static parseInline(e,a){return new gt(a).parseInline(e)}parse(e){var s;this.renderer.parser=this;let a="";for(let n=0;n<e.length;n++){let r=e[n],i=(s=this.options.extensions)==null?void 0:s.renderers;if(i&&Object.hasOwn(i,r.type)&&i[r.type]){let u=r,d=i[u.type].call({parser:this},u);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(u.type)){a+=d===!1?"":d!=null?d:"";continue}}let o=r;switch(o.type){case"space":{a+=this.renderer.space(o);break}case"hr":{a+=this.renderer.hr(o);break}case"heading":{a+=this.renderer.heading(o);break}case"code":{a+=this.renderer.code(o);break}case"table":{a+=this.renderer.table(o);break}case"blockquote":{a+=this.renderer.blockquote(o);break}case"list":{a+=this.renderer.list(o);break}case"checkbox":{a+=this.renderer.checkbox(o);break}case"html":{a+=this.renderer.html(o);break}case"def":{a+=this.renderer.def(o);break}case"paragraph":{a+=this.renderer.paragraph(o);break}case"text":{a+=this.renderer.text(o);break}default:{let u='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(u),"";throw new Error(u)}}}return a}parseInline(e,a=this.renderer){var n;this.renderer.parser=this;let s="";for(let r=0;r<e.length;r++){let i=e[r],o=(n=this.options.extensions)==null?void 0:n.renderers;if(o&&Object.hasOwn(o,i.type)&&o[i.type]){let d=o[i.type].call({parser:this},i);if(d!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){s+=d===!1?"":d!=null?d:"";continue}}let u=i;switch(u.type){case"escape":{s+=a.text(u);break}case"html":{s+=a.html(u);break}case"link":{s+=a.link(u);break}case"image":{s+=a.image(u);break}case"checkbox":{s+=a.checkbox(u);break}case"strong":{s+=a.strong(u);break}case"em":{s+=a.em(u);break}case"codespan":{s+=a.codespan(u);break}case"br":{s+=a.br(u);break}case"del":{s+=a.del(u);break}case"text":{s+=a.text(u);break}default:{let d='Token with "'+u.type+'" type was not found.';if(this.options.silent)return console.error(d),"";throw new Error(d)}}}return s}},Ze,Pe=(Ze=class{constructor(t){M(this,"options");M(this,"block");this.options=t||ve}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?Q.lex:Q.lexInline}provideParser(t=this.block){return t?W.parse:W.parseInline}},M(Ze,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),M(Ze,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),Ze);function le(t,e){if(Array.isArray(e))for(let a=0;a<e.length;a++)t.push(e[a]);else t.push(e)}var gn=class{constructor(...t){M(this,"defaults",vt());M(this,"options",this.setOptions);M(this,"parse",this.parseMarkdown(!0));M(this,"parseInline",this.parseMarkdown(!1));M(this,"Parser",W);M(this,"Renderer",Ye);M(this,"TextRenderer",Tt);M(this,"Lexer",Q);M(this,"Tokenizer",me);M(this,"Hooks",Pe);this.use(...t)}walkTokens(t,e){var s,n;let a=[];for(let r of t)switch(le(a,e.call(this,r)),r.type){case"table":{let i=r;for(let o of i.header)le(a,this.walkTokens(o.tokens,e));for(let o of i.rows)for(let u of o)le(a,this.walkTokens(u.tokens,e));break}case"list":{let i=r;le(a,this.walkTokens(i.items,e));break}default:{let i=r;(n=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&n[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{if(i[o]){let u=i[o].flat(1/0);le(a,this.walkTokens(u,e))}}):i.tokens&&le(a,this.walkTokens(i.tokens,e))}}return a}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(a=>{let s={...a};if(s.async=this.defaults.async||s.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let r=e.renderers[n.name];r?e.renderers[n.name]=function(...i){let o=n.renderer.apply(this,i);return o===!1&&(o=r.apply(this,i)),o}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=e[n.level];r?r.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),a.renderer){let n=this.defaults.renderer||new Ye(this.defaults);for(let r in a.renderer){if(!(r in n))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;let i=r,o=a.renderer[i],u=n[i];n[i]=(...d)=>{let p=o.apply(n,d);return p===!1&&(p=u.apply(n,d)),p===!1?"":p!=null?p:""}}s.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new me(this.defaults);for(let r in a.tokenizer){if(!(r in n))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let i=r,o=a.tokenizer[i],u=n[i];n[i]=(...d)=>{let p=o.apply(n,d);return p===!1&&(p=u.apply(n,d)),p}}s.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new Pe;for(let r in a.hooks){if(!(r in n))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;let i=r,o=a.hooks[i],u=n[i];Pe.passThroughHooks.has(r)?n[i]=d=>{if(n.options.async&&Pe.passThroughHooksRespectAsync.has(r))return(async()=>{let l=await o.call(n,d);return u.call(n,l)})();let p=o.call(n,d);return u.call(n,p)}:n[i]=(...d)=>{if(n.options.async)return(async()=>{let l=await o.apply(n,d);return l===!1&&(l=await u.apply(n,d)),l})();let p=o.apply(n,d);return p===!1&&(p=u.apply(n,d)),p}}s.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,r=a.walkTokens;s.walkTokens=function(i){let o=[];return le(o,r.call(this,i)),n&&le(o,n.call(this,i)),o}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Q.lex(t,e!=null?e:this.defaults)}parser(t,e){return W.parse(t,e!=null?e:this.defaults)}parseMarkdown(t){return(e,a)=>{let s={...a},n={...this.defaults,...s},r=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return r(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(e):e,o=await(n.hooks?await n.hooks.provideLexer(t):t?Q.lex:Q.lexInline)(i,n),u=n.hooks?await n.hooks.processAllTokens(o):o;n.walkTokens&&await Promise.all(this.walkTokens(u,n.walkTokens));let d=await(n.hooks?await n.hooks.provideParser(t):t?W.parse:W.parseInline)(u,n);return n.hooks?await n.hooks.postprocess(d):d})().catch(r);try{n.hooks&&(e=n.hooks.preprocess(e));let i=(n.hooks?n.hooks.provideLexer(t):t?Q.lex:Q.lexInline)(e,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let o=(n.hooks?n.hooks.provideParser(t):t?W.parse:W.parseInline)(i,n);return n.hooks&&(o=n.hooks.postprocess(o)),o}catch(i){return r(i)}}}onError(t,e){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+B(a.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(a);throw a}}},be=new gn;function A(t,e){return be.parse(t,e)}A.options=A.setOptions=function(t){return be.setOptions(t),A.defaults=be.defaults,vs(A.defaults),A};A.getDefaults=vt;A.defaults=ve;function bn(...t){return be.use(...t),A.defaults=be.defaults,vs(A.defaults),A}A.use=bn;A.walkTokens=function(t,e){return be.walkTokens(t,e)};A.parseInline=be.parseInline;A.Parser=W;A.parser=W.parse;A.Renderer=Ye;A.TextRenderer=Tt;A.Lexer=Q;A.lexer=Q.lex;A.Tokenizer=me;A.Hooks=Pe;A.parse=A;A.options;A.setOptions;A.walkTokens;A.parseInline;W.parse;Q.lex;A.setOptions({gfm:!0,breaks:!0});function Mt(t){if(!t)return"";const e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;");return A.parse(e,{async:!1}).replace(/<a href="(https?:\/\/[^"]+)"/g,'<a href="$1" target="_blank" rel="noopener noreferrer"')}async function fn(t,e){var u,d,p;const a=Number(e.params.id);t.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const s=await L.post(a);t.innerHTML=`<div class="page narrow">
    <a class="back-link" href="#/posts">${b("back",14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${s.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
          <a class="pill" href="#/posts?category=${encodeURIComponent(s.category)}">${g(s.category)}</a>
          ${s.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${s.visibility==="private"?"仅自己可见":"不公开列出"}</span>`:""}
        </div>
        <h1 class="article-title">${g(s.title||"无标题")}</h1>
        <div class="article-meta">
          ${ie(s.author.avatar,s.author.nickname,34,s.author.uin)}
          <div class="article-meta-text">
            <b>${g(s.author.nickname)}</b>
            <span>${Yt(s.at)} · ${s.readingTime} 分钟阅读 · ${s.views} 次浏览</span>
          </div>
          ${s.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${s.id}">${b("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${b("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${s.cover&&!((u=s.content)!=null?u:"").includes(s.cover)?`<figure class="article-cover"><img src="${g(s.cover)}" alt="" data-zoom="${g(s.cover)}"></figure>`:""}

      <div class="article-body markdown">${Mt((d=s.content)!=null?d:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${s.liked?"active":""}" id="like-btn">
          ${b("heart",16)}<span>${s.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${s.likes.length?`${s.likes.slice(0,8).map(l=>g(l.nickname)).join("、")} 觉得不错`:`写于 ${Yt(s.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${s.commentNum}</span></h2>
      <div id="comment-area">${Jt(s.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,et(t);const n=t.querySelector("#like-btn");n.addEventListener("click",async()=>{try{const l=await L.likePost(s.id);n.classList.toggle("active",l.liked),n.querySelector("span").textContent=String(l.count||"赞")}catch(l){$(l.message,"err")}}),(p=t.querySelector("#del-post"))==null||p.addEventListener("click",async()=>{if(await Qe("删除文章",`《${s.title}》删除后无法恢复，确定吗？`))try{await L.deletePost(s.id),$("已删除","ok"),location.hash="#/posts"}catch(l){$(l.message,"err")}});let r="";const i=t.querySelector("#reply-hint"),o=t.querySelector("#comment-area");o.addEventListener("click",async l=>{var y,w;const m=l.target,c=m.closest("[data-reply]");if(c){r=(y=c.dataset.reply)!=null?y:"",i.textContent=`回复 ${r}`,t.querySelector("#comment-form textarea").focus();return}const f=m.closest("[data-del-comment]");if(f){if(!await Qe("删除评论","确定删除这条评论吗？"))return;try{await L.deleteComment(s.id,Number(f.dataset.delComment)),(w=f.closest(".comment"))==null||w.remove(),$("已删除","ok")}catch(S){$(S.message,"err")}}}),t.querySelector("#comment-form").addEventListener("submit",async l=>{l.preventDefault();const c=l.currentTarget.querySelector("textarea"),f=c.value.trim();if(f)try{const y=await L.commentPost(s.id,f,r);s.comments.push(y),o.innerHTML=Jt(s.comments),c.value="",r="",i.textContent="",$("评论已发布","ok")}catch(y){$(y.message,"err")}})}const ds=2560,vn=3*1024*1024;function kn(t){return"createImageBitmap"in window?createImageBitmap(t).catch(()=>us(t)):us(t)}function us(t){return new Promise((e,a)=>{const s=URL.createObjectURL(t),n=new Image;n.onload=()=>{URL.revokeObjectURL(s),e(n)},n.onerror=()=>{URL.revokeObjectURL(s),a(new Error("图片解码失败，可能是不支持的格式"))},n.src=s})}function dt(t,e,a){return new Promise((s,n)=>{t.toBlob(r=>r?s(r):n(new Error("图片压缩失败")),e,a)})}async function bt(t,e=vn){const a={file:t,width:0,height:0,size:t.size,compressed:!1,originalSize:t.size};if(t.type==="image/gif"||t.type==="image/svg+xml")return a;const s=await kn(t),n="width"in s?s.width:0,r="height"in s?s.height:0;if(!n||!r||(a.width=n,a.height=r,t.size<=2*1024*1024&&Math.max(n,r)<=ds))return a;const i=Math.min(1,ds/Math.max(n,r));let o=Math.round(n*i),u=Math.round(r*i);const d=document.createElement("canvas");d.width=o,d.height=u;const p=d.getContext("2d");if(!p)return a;p.imageSmoothingQuality="high",p.drawImage(s,0,0,o,u),"close"in s&&typeof s.close=="function"&&s.close();const l="image/webp";let m=.9,c=await dt(d,l,m),f=0;for(;c.size>e&&f<4;)m=Math.max(.6,m-.1),c=await dt(d,l,m),c.size>e&&f===3&&(o=Math.round(o*.8),u=Math.round(u*.8),d.width=o,d.height=u,p.drawImage(s,0,0,o,u),c=await dt(d,l,m)),f++;const y=t.name.replace(/\.[^.]+$/,"")+".webp",w=new File([c],y,{type:l});return{file:w,width:o,height:u,size:w.size,compressed:!0,originalSize:t.size}}function Ge(t){return t>=1024*1024?`${(t/1024/1024).toFixed(1)}MB`:`${Math.round(t/1024)}KB`}const yn=["随笔","城市","旅行","技术","阅读","生活"],Fe="`".repeat(3),ps=30,Ps="qz.editor.mode",ut="qz.editor.split";async function hs(t,e){var Bt,Ot,jt,Nt,Ut,Ft,Zt;const a=e.params.id?Number(e.params.id):0;let s=null;if(a&&(s=await L.post(a),!s.canEdit)){t.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}let n=(Bt=s==null?void 0:s.cover)!=null?Bt:"",r=(Ot=s==null?void 0:s.images)!=null?Ot:[];const i=`qz.draft.${a||"new"}`;let o=$n(),u=Number(localStorage.getItem(ut))||50;document.body.classList.add("writer-mode"),t.innerHTML=`<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${a?`#/post/${a}`:"#/home"}" title="返回">${b("back",16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${g((jt=s==null?void 0:s.title)!=null?jt:"")}" autocomplete="off">
      <span class="wr-state" id="save-state">未保存</span>
      <div class="wr-modes" id="mode-switch">
        <button data-mode="edit" title="只显示编辑区（Ctrl+Shift+E）">编辑</button>
        <button data-mode="split" title="左右分屏（Ctrl+Shift+S）">分屏</button>
        <button data-mode="preview" title="只看效果（Ctrl+Shift+V）">预览</button>
      </div>
      <div class="wr-tools">
        <button class="wr-ibtn" id="btn-outline" title="大纲">${b("outline",16)}</button>
        <button class="wr-ibtn wr-only-mobile" id="btn-eye" title="预览">${b("eye",16)}</button>
        <button class="wr-ibtn" id="btn-side" title="封面与可见范围">${b("settings",16)}</button>
        <button class="wr-ibtn" id="btn-full" title="全屏写作（F11）">${b("expand",15)}</button>
        <button class="wr-ibtn" id="btn-help" title="快捷键（Ctrl+/）">?</button>
        <button class="btn btn-primary btn-sm" id="save-btn">${b("check",13)} ${a?"保存修改":"发布"}</button>
      </div>
    </header>

    <div class="wr-draft" id="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="wr-body" id="body" data-mode="${o}" style="--split:${u}%">
      <section class="wr-pane wr-edit" id="pane-edit">
        <div class="wr-toolbar" id="toolbar">
          <div class="tb-group">
            <button class="tb-btn" data-cmd="h1" title="一级标题（Ctrl+1）">H1</button>
            <button class="tb-btn" data-cmd="h2" title="二级标题（Ctrl+2）">H2</button>
            <button class="tb-btn" data-cmd="h3" title="三级标题（Ctrl+3）">H3</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="bold" title="加粗（Ctrl+B）"><b>B</b></button>
            <button class="tb-btn" data-cmd="italic" title="斜体（Ctrl+I）"><i>I</i></button>
            <button class="tb-btn" data-cmd="strike" title="删除线"><s>S</s></button>
            <button class="tb-btn" data-cmd="code" title="行内代码（Ctrl+E）">${b("codeInline",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="quote" title="引用">${b("message",15)}</button>
            <button class="tb-btn" data-cmd="codeblock" title="代码块（Ctrl+Shift+C）">${b("codeBlock",15)}</button>
            <button class="tb-btn" data-cmd="ul" title="无序列表">${b("listUl",15)}</button>
            <button class="tb-btn" data-cmd="ol" title="有序列表">${b("listOl",15)}</button>
            <button class="tb-btn" data-cmd="task" title="任务列表">${b("task",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="link" title="链接（Ctrl+K）">${b("link",15)}</button>
            <label class="tb-btn" title="插入图片（也可直接粘贴或拖入）">
              ${b("image",15)}<input type="file" id="img-input" accept="image/*" multiple hidden>
            </label>
            <button class="tb-btn" data-cmd="table" title="表格">${b("table",15)}</button>
            <button class="tb-btn" data-cmd="hr" title="分割线">—</button>
          </div>
          <span class="tb-hint" id="tb-hint">Ctrl+V 直接粘贴截图</span>
        </div>
        <div class="wr-scroll" id="edit-scroll">
          <textarea class="wr-input" id="content" spellcheck="false" wrap="soft" placeholder="从这里开始写…

## 小标题
- 列表项，回车自动续行
> 引用一段话

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${g((Nt=s==null?void 0:s.content)!=null?Nt:"")}</textarea>
        </div>
      </section>

      <div class="wr-splitter" id="splitter" title="拖动调整左右比例"><i></i></div>

      <section class="wr-pane wr-preview" id="pane-preview">
        <div class="wr-pv-bar">
          <span>预览</span>
          <span class="wr-pv-meta" id="pv-meta"></span>
        </div>
        <div class="wr-scroll" id="pv-scroll">
          <div class="md-preview markdown" id="preview"></div>
        </div>
      </section>

      <aside class="wr-drawer wr-outline" id="outline" data-open="false">
        <div class="wr-drawer-head">
          <b>大纲</b>
          <button class="wr-ibtn" data-close="outline" title="关闭">${b("close",14)}</button>
        </div>
        <div class="wr-outline-list" id="outline-list"></div>
      </aside>

      <aside class="wr-drawer wr-side" id="side" data-open="false">
        <div class="wr-drawer-head">
          <b>文章设置</b>
          <button class="wr-ibtn" data-close="side" title="关闭">${b("close",14)}</button>
        </div>
        <div class="wr-drawer-body">
          <section class="rail-card">
            <h3>封面</h3>
            <div class="cover-slot" id="cover-slot">
              ${n?`<img src="${g(n)}" alt="">`:"<span>点击上传封面</span>"}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${g((Ut=s==null?void 0:s.category)!=null?Ut:"随笔")}">
              <datalist id="cat-list">${yn.map(h=>`<option value="${h}">`).join("")}</datalist>
            </label>
            <label class="field">
              <span>可见范围</span>
              <select class="input" id="visibility">
                <option value="public" ${(s==null?void 0:s.visibility)==="public"?"selected":""}>所有人可见</option>
                <option value="unlisted" ${(s==null?void 0:s.visibility)==="unlisted"?"selected":""}>不公开列出（仅链接可见）</option>
                <option value="private" ${(s==null?void 0:s.visibility)==="private"?"selected":""}>仅自己可见</option>
              </select>
            </label>
            <label class="checkline">
              <input type="checkbox" id="pinned" ${s!=null&&s.pinned?"checked":""}>
              <span>在首页置顶</span>
            </label>
          </section>
          <section class="rail-card">
            <h3>正文配图</h3>
            <div class="editor-thumbs" id="thumbs">
              ${r.map(h=>`<img src="${g(h)}" alt="" data-zoom="${g(h)}">`).join("")||'<span class="muted">还没有配图</span>'}
            </div>
          </section>
        </div>
      </aside>
    </div>

    <footer class="wr-status">
      <span id="stat-words">0 字</span>
      <span class="dot">·</span>
      <span id="stat-read">约 1 分钟</span>
      <span class="dot">·</span>
      <span id="stat-cursor">第 1 行</span>
      <span class="wr-grow"></span>
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${ps}MB 内图片自动压缩</span>
    </footer>

    <div class="wr-help" id="help" hidden>
      <div class="wr-help-card">
        <div class="wr-help-head">
          <b>快捷键</b>
          <button class="wr-ibtn" id="help-close">${b("close",14)}</button>
        </div>
        <div class="wr-help-grid">
          ${[["Ctrl + B / I","加粗 / 斜体"],["Ctrl + E","行内代码"],["Ctrl + K","插入链接"],["Ctrl + 1 / 2 / 3","一 / 二 / 三级标题"],["Ctrl + Shift + C","代码块"],["Ctrl + Shift + 8 / 7","无序 / 有序列表"],["Ctrl + Shift + Q","引用"],["Ctrl + Shift + E / S / V","编辑 / 分屏 / 预览"],["Ctrl + S","保存"],["Tab / Shift + Tab","整行缩进 / 反缩进"],["Ctrl + V","粘贴截图直接插图"],["Ctrl + /","打开本面板"]].map(([h,v])=>`<div class="k"><kbd>${h}</kbd><span>${v}</span></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;const d=h=>t.querySelector(h),p=d("#title"),l=d("#content"),m=d("#preview"),c=d("#body"),f=d("#splitter"),y=d("#pv-scroll"),w=d("#thumbs"),S=d("#save-state"),T=d("#stat-words"),O=d("#stat-read"),R=d("#stat-cursor"),de=d("#pv-meta"),X=d("#draft-bar"),j=d("#outline"),re=d("#outline-list"),P=d("#side"),Z=d("#help"),N=h=>{o=h,c.dataset.mode=h,localStorage.setItem(Ps,h),t.querySelectorAll("#mode-switch button").forEach(v=>{v.classList.toggle("active",v.dataset.mode===h)}),d("#btn-eye").classList.toggle("on",h==="preview"),h==="preview"?G(!0):l.focus()};t.querySelectorAll("#mode-switch button").forEach(h=>{h.addEventListener("click",()=>N(h.dataset.mode))}),d("#btn-eye").addEventListener("click",()=>N(o==="edit"?"preview":"edit"));const Y=(h,v)=>{h.dataset.open=String(v),h===j&&d("#btn-outline").classList.toggle("on",v),h===P&&d("#btn-side").classList.toggle("on",v)};d("#btn-outline").addEventListener("click",()=>Y(j,j.dataset.open!=="true")),d("#btn-side").addEventListener("click",()=>Y(P,P.dataset.open!=="true")),t.querySelectorAll("[data-close]").forEach(h=>{h.addEventListener("click",()=>Y(h.dataset.close==="side"?P:j,!1))});const ke=d("#wr"),V=d("#btn-full"),H=()=>{var h;document.fullscreenElement?document.exitFullscreen():(h=ke.requestFullscreen)==null||h.call(ke).catch(()=>$("当前环境不支持全屏","err"))};V.addEventListener("click",H),document.addEventListener("fullscreenchange",()=>{const h=!!document.fullscreenElement;V.innerHTML=b(h?"compress":"expand",15),V.classList.toggle("on",h),V.title=h?"退出全屏":"全屏写作"});let Be=0;function G(h=!1){window.clearTimeout(Be);const v=()=>{const k=l.value;m.innerHTML=k.trim()?Mt(k):'<p class="muted">预览会显示在这里</p>';const x=m.querySelectorAll("h1,h2,h3,h4,p,li,pre,blockquote,table").length;de.textContent=`${x} 个段落`};h?v():Be=window.setTimeout(v,140)}function Rt(){var q,C;const h=l.value,v=((q=h.match(/[\u3400-\u9fa5]/g))!=null?q:[]).length,k=((C=h.replace(/[\u3400-\u9fa5]/g," ").match(/[A-Za-z0-9_]+/g))!=null?C:[]).length,x=v+k;T.textContent=`${x.toLocaleString()} 字`,O.textContent=`约 ${Math.max(1,Math.round(x/400))} 分钟`}function ye(){const h=l.selectionStart,v=l.value.slice(0,h),k=v.split(`
`).length,x=h-(v.lastIndexOf(`
`)+1)+1;R.textContent=`第 ${k} 行 · 第 ${x} 列`}let Ct=0;function zt(){window.clearTimeout(Ct),Ct=window.setTimeout(()=>{const h=wn(l.value);if(!h.length){re.innerHTML='<p class="muted">标题会出现在这里</p>';return}re.innerHTML=h.map((v,k)=>`<button class="ol-item lv${v.level}" data-i="${k}"><span>${g(v.text)}</span></button>`).join(""),re.querySelectorAll(".ol-item").forEach(v=>{v.addEventListener("click",()=>{const k=h[Number(v.dataset.i)];k&&Bs(k.offset),window.innerWidth<1e3&&Y(j,!1)})})},260)}function Bs(h){const v=getComputedStyle(l),k=parseFloat(v.paddingLeft)+parseFloat(v.paddingRight),x=document.createElement("div");x.style.cssText=["position:absolute","visibility:hidden","top:0","left:0",`width:${Math.max(80,l.clientWidth-k)}px`,`font:${v.font}`,`line-height:${v.lineHeight}`,`letter-spacing:${v.letterSpacing}`,"white-space:pre-wrap","overflow-wrap:break-word","word-break:break-word"].join(";");const q=l.value.lastIndexOf(`
`,h-1)+1;x.textContent=l.value.slice(0,q),document.body.appendChild(x);const C=x.getBoundingClientRect().height;x.remove(),l.scrollTop=Math.max(0,C-8),l.focus(),l.setSelectionRange(h,h),ye()}const Os=()=>{try{const h=localStorage.getItem(i);return h?JSON.parse(h):null}catch{return null}},js=()=>({title:p.value,content:l.value,category:d("#category").value,visibility:d("#visibility").value,pinned:d("#pinned").checked,cover:n,savedAt:Date.now()});let It=0;const Oe=()=>{window.clearTimeout(It),S.textContent="未保存",S.classList.add("dirty"),It=window.setTimeout(()=>{localStorage.setItem(i,JSON.stringify(js()));const h=new Date;S.textContent=`已存草稿 ${String(h.getHours()).padStart(2,"0")}:${String(h.getMinutes()).padStart(2,"0")}`,S.classList.remove("dirty")},1200)},J=Os();if(J&&(J.content!==((Ft=s==null?void 0:s.content)!=null?Ft:"")||J.title!==((Zt=s==null?void 0:s.title)!=null?Zt:""))){const h=new Date(J.savedAt);d("#draft-text").textContent=`发现 ${h.getMonth()+1} 月 ${h.getDate()} 日 ${String(h.getHours()).padStart(2,"0")}:${String(h.getMinutes()).padStart(2,"0")} 的草稿`,X.hidden=!1,d("#draft-restore").addEventListener("click",()=>{p.value=J.title,l.value=J.content,d("#category").value=J.category||"随笔",d("#visibility").value=J.visibility||"public",d("#pinned").checked=!!J.pinned,n=J.cover||n,n&&(d("#cover-slot").innerHTML=`<img src="${g(n)}" alt="">`),X.hidden=!0,at(),G(!0),$("已恢复草稿","ok")}),d("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(i),X.hidden=!0})}const at=()=>{Rt(),ye(),G(),zt(),Oe()},$e=(h,v,k,x,q)=>{l.focus(),l.setSelectionRange(h,v);let C=!1;try{C=document.execCommand("insertText",!1,k)}catch{C=!1}C||l.setRangeText(k,h,v,"end"),l.setSelectionRange(x,q),at()},Me=(h,v=0,k=0)=>{const x=l.selectionStart,q=l.selectionEnd;$e(x,q,h,x+v,x+(k||h.length))},je=(h,v,k)=>{const x=l.selectionStart,q=l.selectionEnd,C=l.value.slice(x,q)||k;$e(x,q,h+C+v,x+h.length,x+h.length+C.length)},Pt=()=>{const h=l.selectionStart,v=l.selectionEnd,k=l.value.lastIndexOf(`
`,Math.max(0,h-1))+1,x=l.value.indexOf(`
`,v),q=x===-1?l.value.length:x;return{lineStart:k,lineEnd:q}},ue=(h,v)=>{const{lineStart:k,lineEnd:x}=Pt(),C=(l.value.slice(k,x)||v).split(`
`),ee=C.every(_=>_.startsWith(h)),ae=C.map(_=>ee?_.slice(h.length):h+_.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/,"")).join(`
`);$e(k,x,ae,k,k+ae.length)},U={h1:()=>ue("# ","一级标题"),h2:()=>ue("## ","二级标题"),h3:()=>ue("### ","三级标题"),bold:()=>je("**","**","加粗文字"),italic:()=>je("*","*","斜体文字"),strike:()=>je("~~","~~","删除线"),code:()=>je("`","`","code"),quote:()=>ue("> ","引用一段话"),ul:()=>ue("- ","列表项"),ol:()=>ue("1. ","列表项"),task:()=>ue("- [ ] ","待办事项"),codeblock:()=>Me(`
${Fe}
// code
${Fe}
`,Fe.length+2,Fe.length+9),hr:()=>Me(`
---
`),link:()=>{const h=l.value.slice(l.selectionStart,l.selectionEnd);Me(`[${h||"链接文字"}](https://)`,h?h.length+3:1,h?h.length+11:5)},table:()=>Me(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};d("#toolbar").addEventListener("click",h=>{var k,x;const v=h.target.closest("[data-cmd]");v&&(h.preventDefault(),(x=U[(k=v.dataset.cmd)!=null?k:""])==null||x.call(U))});const Ns=/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/,Us=()=>{const h=l.selectionStart;if(h!==l.selectionEnd)return!1;const v=l.value.lastIndexOf(`
`,h-1)+1,k=l.value.slice(v,h),x=k.match(Ns);if(!x)return!1;const[,q,C,ee]=x;if(!k.slice(x[0].length).trim())return $e(v,h,"",v,v),!0;let _=`
`+q;return/^\d+\.$/.test(C)?_+=`${parseInt(C,10)+1}. `:_+=C+" ",ee&&(_+="[ ] "),$e(h,h,_,h+_.length,h+_.length),!0},Fs=h=>{var Vt;const{lineStart:v,lineEnd:k}=Pt(),q=l.value.slice(v,k).split(`
`),C=q.map(Ae=>h?Ae.replace(/^ {1,2}|^\t/,""):"  "+Ae).join(`
`),ee=l.selectionStart===l.selectionEnd;let ae=v,_=v+C.length;if(ee){const Ae=l.selectionStart-v,Zs=((Vt=q[0].match(/^ {1,2}|^\t/))!=null?Vt:[""])[0].length,Vs=h?Math.max(0,Ae-Zs):Ae+2;ae=v+Vs,_=ae}$e(v,k,C,ae,_)};l.addEventListener("keydown",h=>{const v=h.metaKey||h.ctrlKey,k=h.key.toLowerCase();if(h.key==="Tab"){h.preventDefault(),Fs(h.shiftKey);return}if(!v&&h.key==="Enter"&&!h.altKey&&!h.isComposing&&Us()){h.preventDefault();return}if(v){if(h.shiftKey){k==="c"?(h.preventDefault(),U.codeblock()):h.key==="8"||h.key==="*"?(h.preventDefault(),U.ul()):h.key==="7"||h.key==="&"?(h.preventDefault(),U.ol()):k==="q"?(h.preventDefault(),U.quote()):k==="e"?(h.preventDefault(),N("edit")):k==="s"?(h.preventDefault(),N("split")):k==="v"&&(h.preventDefault(),N("preview"));return}k==="b"?(h.preventDefault(),U.bold()):k==="i"?(h.preventDefault(),U.italic()):k==="k"?(h.preventDefault(),U.link()):k==="e"?(h.preventDefault(),U.code()):k==="s"?(h.preventDefault(),Dt()):k==="1"||k==="2"||k==="3"?(h.preventDefault(),U[`h${k}`]()):k==="/"&&(h.preventDefault(),qe())}}),l.addEventListener("keyup",ye),l.addEventListener("click",ye),l.addEventListener("select",ye),l.addEventListener("input",at);let nt=!1;const Ht=(h,v)=>{if(o!=="split"||nt)return;nt=!0;const k=h.scrollHeight-h.clientHeight,x=k>0?h.scrollTop/k:0;v.scrollTop=x*(v.scrollHeight-v.clientHeight),requestAnimationFrame(()=>{nt=!1})};l.addEventListener("scroll",()=>Ht(l,y),{passive:!0}),y.addEventListener("scroll",()=>Ht(y,l),{passive:!0}),f.addEventListener("pointerdown",h=>{o!=="split"&&N("split"),h.preventDefault(),f.setPointerCapture(h.pointerId),f.classList.add("dragging"),document.body.classList.add("wr-resizing");const v=x=>{const q=c.getBoundingClientRect(),C=(x.clientX-q.left)/q.width*100,ee=Math.min(78,Math.max(22,C));u=ee,c.style.setProperty("--split",`${ee}%`)},k=()=>{f.classList.remove("dragging"),document.body.classList.remove("wr-resizing"),localStorage.setItem(ut,String(Math.round(u))),f.removeEventListener("pointermove",v),f.removeEventListener("pointerup",k),f.removeEventListener("pointercancel",k)};f.addEventListener("pointermove",v),f.addEventListener("pointerup",k),f.addEventListener("pointercancel",k)}),f.addEventListener("dblclick",()=>{u=50,c.style.setProperty("--split","50%"),localStorage.setItem(ut,"50")});const it=new Set,rt=async(h,v="图片")=>{for(const k of h){if(!k.type.startsWith("image/")){$("只能插入图片文件","err");continue}const x=`${k.name}-${k.size}`;if(!it.has(x)){it.add(x);try{$(`正在处理 ${k.name||v}…`);const q=await bt(k);if(q.size>ps*1024*1024)throw new Error(`压缩后仍有 ${Ge(q.size)}，超过上限`);const{url:C}=await L.upload(q.file);r.push(C);const ee=(k.name||v).replace(/\.[^.]+$/,"")||v;Me(`
![${ee}](${C})
`),w.innerHTML=r.map(ae=>`<img src="${g(ae)}" alt="">`).join(""),$(q.compressed?`已压缩 ${Ge(q.originalSize)} → ${Ge(q.size)}`:"图片已插入","ok")}catch(q){$(q.message,"err")}finally{it.delete(x)}}}};l.addEventListener("paste",h=>{const v=h.clipboardData;if(!v)return;const k=Array.from(v.items).filter(x=>x.kind==="file"&&x.type.startsWith("image/")).map(x=>x.getAsFile()).filter(x=>!!x);k.length&&(h.preventDefault(),rt(k,"粘贴的图片"))});const we=d("#pane-edit");we.addEventListener("dragover",h=>{var v;(v=h.dataTransfer)!=null&&v.types.includes("Files")&&(h.preventDefault(),we.classList.add("dropping"))}),we.addEventListener("dragleave",()=>we.classList.remove("dropping")),we.addEventListener("drop",h=>{var k,x;const v=Array.from((x=(k=h.dataTransfer)==null?void 0:k.files)!=null?x:[]).filter(q=>q.type.startsWith("image/"));v.length&&(h.preventDefault(),we.classList.remove("dropping"),rt(v))}),d("#img-input").addEventListener("change",async h=>{var x;const v=h.target,k=Array.from((x=v.files)!=null?x:[]);k.length&&await rt(k),v.value=""});const _t=d("#cover-slot"),lt=d("#cover-input");_t.addEventListener("click",()=>lt.click()),lt.addEventListener("change",async()=>{var v;const h=(v=lt.files)==null?void 0:v[0];if(h)try{const k=await bt(h),{url:x}=await L.upload(k.file);n=x,_t.innerHTML=`<img src="${g(x)}" alt="">`,Oe(),$("封面已更新","ok")}catch(k){$(k.message,"err")}});function qe(h){const v=h!=null?h:Z.hidden;Z.hidden=!v}d("#btn-help").addEventListener("click",()=>qe()),d("#help-close").addEventListener("click",()=>qe(!1)),Z.addEventListener("click",h=>{h.target===Z&&qe(!1)}),document.addEventListener("keydown",h=>{h.key==="Escape"&&(Z.hidden?j.dataset.open==="true"?Y(j,!1):P.dataset.open==="true"&&Y(P,!1):qe(!1))}),p.addEventListener("input",Oe),t.querySelectorAll("#category,#visibility,#pinned").forEach(h=>h.addEventListener("change",Oe));const Dt=async()=>{const h={title:p.value.trim(),content:l.value,cover:n,category:d("#category").value.trim()||"随笔",visibility:d("#visibility").value,pinned:d("#pinned").checked,images:r};if(!h.title&&!h.content.trim()){$("写个标题或正文再发布","err");return}const v=d("#save-btn");v.disabled=!0,v.textContent="保存中…";try{const k=a?await L.updatePost(a,h):await L.createPost(h);localStorage.removeItem(i),$(a?"已保存":"已发布","ok"),location.hash=`#/post/${k.id}`}catch(k){$(k.message,"err"),v.disabled=!1,v.innerHTML=`${b("check",13)} ${a?"保存修改":"发布"}`}};d("#save-btn").addEventListener("click",()=>void Dt()),window.addEventListener("beforeunload",h=>{S.classList.contains("dirty")&&l.value.trim()&&(h.preventDefault(),h.returnValue="")}),Rt(),ye(),zt(),G(!0),N(o),p.addEventListener("keydown",h=>{h.key==="Enter"&&(h.preventDefault(),l.focus(),l.setSelectionRange(0,0))}),window.innerWidth<1e3&&!(s!=null&&s.title)?p.focus():(l.focus(),l.setSelectionRange(l.value.length,l.value.length))}function $n(){const t=localStorage.getItem(Ps);return t==="edit"||t==="split"||t==="preview"?t:window.innerWidth>=1e3?"split":"edit"}function wn(t){var n;const e=[],a=/^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;let s;for(;s=a.exec(t);)((n=t.slice(0,s.index).match(/^```/gm))!=null?n:[]).length%2!==1&&e.push({level:s[1].length,text:s[2].replace(/[*_`~]/g,""),offset:s.index});return e}async function xn(t,e){t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${b("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const a=t.querySelector("#album-grid"),s=async()=>{const n=await L.albums(),r=n.albums.reduce((i,o)=>i+o.count,0);t.querySelector("#album-sub").textContent=`${n.albums.length} 个相册 · 共 ${r} 张照片`,a.innerHTML=n.albums.length?n.albums.map(ta).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await s(),t.querySelector("#new-album").addEventListener("click",async()=>{await ft({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async n=>{const r=n.querySelector("#a-name").value.trim();return r?(await L.createAlbum({name:r,description:n.querySelector("#a-desc").value.trim(),privacy:n.querySelector("#a-priv").value}),$("相册已创建","ok"),await s(),!0):($("请填写相册名称","err"),!1)}})})}async function Sn(t,e){const a=Number(e.params.id);let s=await L.album(a);const n=()=>{var r,i,o;t.innerHTML=`<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${b("back",14)} 全部相册</a>
          <h1>${g(s.name)}</h1>
          <p class="page-sub">${g(s.description||"没有描述")} · ${s.count} 张 · ${ce(s.at)}创建</p>
        </div>
        ${s.canEdit?`<div class="head-btns">
                <label class="btn btn-primary btn-sm" title="单张上限 30MB，超过会自动压缩">${b("upload",14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden>
                </label>
                <button class="btn btn-ghost btn-sm danger" id="del-album">${b("trash",14)}</button>
              </div>`:""}
      </header>
      <div class="photo-grid" id="photo-grid">
        ${(r=s.photos)!=null&&r.length?s.photos.map(u=>`<figure class="photo" data-pid="${u.id}">
                    <img src="${g(u.url)}" alt="${g(u.caption)}" loading="lazy" data-zoom="${g(u.url)}">
                    <figcaption>
                      <span>${g(u.caption||ce(u.at))}</span>
                      <span class="photo-like">${b("heart",12)} ${u.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${u.id}" title="赞">${b("heart",14)}</button>
                      ${s.canEdit?`<button class="photo-btn danger" data-del="${u.id}" title="删除">${b("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,et(t),(i=t.querySelector("#photo-file"))==null||i.addEventListener("change",async u=>{var l;const d=u.target,p=Array.from((l=d.files)!=null?l:[]);if(p.length){$(`正在处理 ${p.length} 张…`);try{const m=[],c=[],f=[],y=[];let w=0;for(const S of p){const T=await bt(S),{url:O}=await L.upload(T.file);m.push(O),c.push(T.size),f.push(T.width),y.push(T.height),w+=T.originalSize-T.size}s=await L.addPhotos(s.id,m,{sizes:c,widths:f,heights:y}),$(w>512*1024?`上传完成，压缩节省 ${Ge(w)}`:"上传完成","ok"),n()}catch(m){$(m.message,"err")}finally{d.value=""}}}),(o=t.querySelector("#del-album"))==null||o.addEventListener("click",async()=>{if(await Qe("删除相册",`《${s.name}》及其中 ${s.count} 张照片会一起删除。`))try{await L.deleteAlbum(s.id),$("相册已删除","ok"),location.hash="#/albums"}catch(u){$(u.message,"err")}}),t.querySelector("#photo-grid").addEventListener("click",async u=>{var m;const d=u.target,p=d.closest("[data-like]");if(p){u.stopPropagation();try{const c=await L.likePhoto(Number(p.dataset.like));p.classList.toggle("active",c.liked);const f=(m=p.closest(".photo"))==null?void 0:m.querySelector(".photo-like");f&&(f.innerHTML=`${b("heart",12)} ${c.count}`)}catch(c){$(c.message,"err")}return}const l=d.closest("[data-del]");if(l){if(u.stopPropagation(),!await Qe("删除照片","确定从相册中删除这张照片吗？"))return;try{await L.deletePhoto(s.id,Number(l.dataset.del)),s=await L.album(s.id),n(),$("已删除","ok")}catch(c){$(c.message,"err")}}})};n()}async function Ln(t,e){const a=fe(),s=e.params.uin||a.uin,n=s===a.uin,r=n?a:(await L.user(s)).user;t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${n?"来过的人，留下了这些话。":`给 ${g(r.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${ie(a.avatar,a.nickname,36)}
        <span>${n?"给自己留一句话":`给 ${g(r.nickname)} 留一句话`}</span>
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
  </div>`;const i=t.querySelector("#gb-list"),o=t.querySelector("#gb-form textarea"),u=t.querySelector("#gb-count");o.addEventListener("input",()=>{u.textContent=`${o.value.length} / 500`});const d=l=>`<article class="gb-item card" data-gid="${l.id}">
      ${ie(l.author.avatar,l.author.nickname,40,l.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${g(l.author.uin)}">${g(l.author.nickname)}</a>
          <time>${ce(l.at)}</time>
          <span class="spacer"></span>
          ${l.canEdit?`<button class="text-btn" data-reply="${l.id}">回复</button>`:""}
          ${l.canDel?`<button class="text-btn danger" data-del="${l.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${g(l.content)}</p>
        ${l.reply?`<div class="gb-reply"><b>${g(r.nickname)}：</b>${g(l.reply)}</div>`:""}
      </div>
    </article>`,p=async()=>{const l=await L.guestbook(s);i.innerHTML=l.entries.length?l.entries.map(d).join(""):`<div class="card empty"><div class="empty-mark">${b("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await p(),t.querySelector("#gb-form").addEventListener("submit",async l=>{l.preventDefault();const m=o.value.trim();if(m)try{await L.createGuestbook(s,m),o.value="",u.textContent="0 / 500",$("留言成功","ok"),await p()}catch(c){$(c.message,"err")}}),i.addEventListener("click",async l=>{const m=l.target,c=m.closest("[data-del]");if(c){if(!confirm("确定删除这条留言吗？"))return;try{await L.deleteGuestbook(Number(c.dataset.del)),await p(),$("已删除","ok")}catch(y){$(y.message,"err")}return}const f=m.closest("[data-reply]");if(f){const y=Number(f.dataset.reply);await ft({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async w=>{const S=w.querySelector("#reply-text").value.trim();return S?(await L.replyGuestbook(y,S),await p(),$("已回复","ok"),!0):($("回复不能为空","err"),!1)}})}})}async function En(t,e){const a=fe(),s=e.params.uin?(await L.user(e.params.uin)).user:a;t.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${g(s.nickname)}</h1>
      <p class="page-sub">${g(s.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${s.bio?Mt(s.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
      </article>

      <aside class="about-side">
        <section class="rail-card">
          <h3>档案</h3>
          <dl class="fact-list">
            <div><dt>空间号</dt><dd>${g(s.uin)}</dd></div>
            <div><dt>城市</dt><dd>${g(s.city||"—")}</dd></div>
            <div><dt>星座</dt><dd>${g(s.constellation||"—")}</dd></div>
            <div><dt>加入</dt><dd>${new Date(s.createdAt).getFullYear()} 年</dd></div>
            <div><dt>文章</dt><dd>${s.posts} 篇</dd></div>
            <div><dt>照片</dt><dd>${s.photos} 张</dd></div>
          </dl>
        </section>

        <section class="rail-card">
          <h3>标签</h3>
          <div class="tag-cloud">
            ${s.tags.map(n=>`<span class="tag">${g(n)}</span>`).join("")||'<span class="muted">还没有标签</span>'}
          </div>
        </section>

        <section class="rail-card">
          <h3>找到我</h3>
          <div class="about-links">
            <a href="#/guestbook" class="about-link">${b("mail",14)} 留言板</a>
            <a href="#/posts" class="about-link">${b("book",14)} 全部文章</a>
            <a href="#/albums" class="about-link">${b("image",14)} 相册</a>
          </div>
        </section>
      </aside>
    </div>
  </div>`,s.uin!==a.uin&&L.visit(s.uin,"关于").catch(()=>$("足迹记录失败","err"))}async function Tn(t,e){var u;const a=(u=e.params.uin)!=null?u:"",s=fe();if(a===s.uin){location.hash="#/home";return}t.innerHTML=`<div class="page"><div class="card reading">正在打开 ${g(a)} 的空间…</div></div>`;const{user:n}=await L.user(a);L.visit(n.uin,"主页").catch(()=>{}),t.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${g(n.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ie(n.avatar,n.nickname,0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${b("pin",12)} ${g(n.city||"—")}</p>
          <h1>${g(n.nickname)}</h1>
          <p class="hero-sign">${g(n.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${n.posts}</b>文章</span>
            <span><b>${n.photos}</b>照片</span>
            <span><b>${n.visitCount.toLocaleString()}</b>访问</span>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/guestbook?uin=${g(n.uin)}">${b("mail",15)} 留言</a>
          <a class="btn btn-ghost" href="#/search?q=${encodeURIComponent(n.nickname)}">${b("search",15)} 搜索</a>
        </div>
      </div>
    </section>

    <div class="list-head">
      <h2>${g(n.nickname)} 的文章</h2>
      <span class="muted">${n.posts} 篇</span>
    </div>
    <div id="space-posts">${We(2)}</div>
  </div>`,et(t);const r=t.querySelector("#space-posts"),i=await L.posts({uin:n.uin,limit:10});if(!i.posts.length){r.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const o=i.posts[0];r.innerHTML=fs(o)+`<div class="post-list">${i.posts.slice(1).map(tt).join("")}</div>`}const ms={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function Mn(t){return t.target.startsWith("post:")?`#/post/${t.target.split(":")[1]}`:t.target.startsWith("album:")?`#/album/${t.target.split(":")[1]}`:t.target==="guestbook"?"#/guestbook":t.target==="profile"?`#/u/${g(t.from.uin)}`:"#/home"}async function qn(t,e){t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${b("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const a=t.querySelector("#msg-list"),s=t.querySelector("#msg-sub"),n=async()=>{const r=await L.notifications();s.textContent=r.unread?`${r.unread} 条未读`:"全部已读",Xt(r.unread),a.innerHTML=r.notifications.length?`<div class="card msg-list">${r.notifications.map(i=>{var u;const o=(u=ms[i.kind])!=null?u:ms.system;return`<a class="msg-row ${i.read?"":"unread"}" href="${Mn(i)}">
              <span class="msg-icon ${o.cls}">${b(o.icon,16)}</span>
              <div class="msg-body">
                <div class="msg-line">
                  ${ie(i.from.avatar,i.from.nickname,20,i.from.uin)}
                  <b>${g(i.from.nickname)}</b>
                  <span>${g(i.text)}</span>
                </div>
                <time>${ce(i.at)} · ${o.label}</time>
              </div>
              ${i.read?"":'<i class="msg-dot"></i>'}
            </a>`}).join("")}</div>`:`<div class="card empty"><div class="empty-mark">${b("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await n(),t.querySelector("#read-all").addEventListener("click",async()=>{try{const r=await L.readNotifications([]);Xt(r.unread),$("已全部标为已读","ok"),await n()}catch(r){$(r.message,"err")}})}const An=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function Rn(t,e){const a=fe(),s=e.params.tab==="out"?"out":"in";t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${b("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${An.map(i=>`<button class="seg-btn ${i.key===s?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/visitors?tab=${i.dataset.tab}`})});const n=t.querySelector("#visit-list"),r=await L.visitors(a.uin,s);t.querySelector("#visit-sub").textContent=s==="in"?`累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人`:`你最近访问了 ${r.visitors.length} 个空间`,n.innerHTML=r.visitors.length?`<div class="card visit-list">${r.visitors.map(i=>`<a class="visit-row" href="#/u/${g(i.author.uin)}">
            ${ie(i.author.avatar,i.author.nickname,40,i.author.uin)}
            <div class="visit-main">
              <b>${g(i.author.nickname)}</b>
              <span>${s==="in"?"看了":"访问了"} · ${g(i.module)}</span>
            </div>
            <time>${ce(i.at)}</time>
          </a>`).join("")}</div>`:Ys(s==="in"?"还没有人来过":"还没有访问记录",s==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>')}const Cn=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function zn(t,e){var r;const a=e.params.tab||"profile",s=fe();t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${Cn.map(i=>`<button class="seg-btn ${i.key===a?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/settings?tab=${i.dataset.tab}`})});const n=t.querySelector("#settings-body");if(a==="decorate"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${g(s.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${pt().map(i=>`<button class="theme-card ${s.theme===i.id?"active":""}" data-theme="${i.id}">
              <span class="theme-swatch" style="background:${i.accent}"></span>
              <span>${g(i.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,n.querySelector("#cover-file").addEventListener("change",async i=>{var u;const o=(u=i.target.files)==null?void 0:u[0];if(o)try{const{url:d}=await L.upload(o),p=await L.updateProfile({cover:d});Se(p),n.querySelector("#cover-preview").style.backgroundImage=`url('${d}')`,$("封面已更新","ok")}catch(d){$(d.message,"err")}}),n.querySelectorAll("[data-theme]").forEach(i=>{i.addEventListener("click",async()=>{const o=i.dataset.theme;try{const u=await L.updateProfile({theme:o});Se(u),gs(o),n.querySelectorAll("[data-theme]").forEach(d=>d.classList.remove("active")),i.classList.add("active"),$("主题已切换","ok")}catch(u){$(u.message,"err")}})});return}if(a==="music"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">内置免费音乐</h2>
      <p class="setting-hint">曲目由程序实时合成，无版权限制；点「试听」立即播放，「设为背景音乐」保存到你的空间。</p>
      <div class="music-library" id="music-library"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${I.isPlaying()?"spin":""}">${b("music",16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${g(s.bgmTitle||"还没有设置音轨")}</b>
          <span id="bgm-sub">${s.bgmUrl?"已保存，会在页面左下角循环播放":"上传、选一首内置曲目，或填写直链"}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="preview-btn">${b("play",13)} 试听</button>
      </div>
      <label class="field">
        <span>显示名称</span>
        <input class="input" id="bgm-title" maxlength="60" value="${g(s.bgmTitle)}" placeholder="比如：夜航">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" id="save-bgm">保存设置</button>
        ${s.bgmUrl?'<button class="btn btn-ghost danger" id="clear-bgm">移除背景音乐</button>':""}
      </div>

      <h2 class="setting-title">上传本地音频</h2>
      <p class="setting-hint">支持 MP3 / M4A / OGG / WAV / FLAC，单个文件不超过 50MB。</p>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 选择音频文件
        <input type="file" id="audio-file" accept="audio/*" hidden>
      </label>

      <h2 class="setting-title">使用音频直链</h2>
      <p class="setting-hint">填写任意可公开访问的音频地址（http/https 或站内 /media 路径）。</p>
      <div class="inline-form">
        <input class="input" id="bgm-url" placeholder="https://example.com/song.mp3">
        <button class="btn btn-primary btn-sm" id="bgm-url-save">使用</button>
      </div>
      <p class="setting-hint" style="margin-top:14px">
        说明：QQ 音乐等平台的播放接口需要签名与版权授权，本项目不抓取这些内容；这里提供的是可自由使用的合成曲目、你自己上传的音频，或你有权使用的直链。
      </p>
    </section>`;let i=s.bgmUrl,o=s.bgmTitle;const u=()=>{n.querySelector("#bgm-name").textContent=o||"还没有设置音轨",n.querySelector("#bgm-sub").textContent=i?"已选择，保存后生效":"上传、选一首内置曲目，或填写直链",n.querySelector("#bgm-title").value||(n.querySelector("#bgm-title").value=o)},d=(l,m)=>{i=l,o=m,n.querySelector("#bgm-title").value=m,u()};try{const{tracks:l}=await L.musicLibrary(),m=n.querySelector("#music-library");m.innerHTML=l.map(c=>`<article class="lib-card" data-id="${g(c.id)}">
            <div class="lib-main">
              <b>${g(c.title)}</b>
              <span>${g(c.mood)} · ${c.duration} 秒</span>
            </div>
            <div class="lib-actions">
              <button class="btn btn-ghost btn-sm" data-play="${g(c.url)}" data-title="${g(c.title)}">${b("play",12)} 试听</button>
              <button class="btn btn-soft btn-sm" data-pick="${g(c.url)}" data-title="${g(c.title)}">设为背景</button>
            </div>
          </article>`).join(""),m.addEventListener("click",c=>{var S;const f=c.target,y=f.closest("[data-play]");if(y){I.setTrack(y.dataset.play,y.dataset.title),I.isPlaying()||I.toggle(),(S=n.querySelector(".music-disc"))==null||S.classList.add("spin");return}const w=f.closest("[data-pick]");w&&(d(w.dataset.pick,w.dataset.title),$(`已选择《${w.dataset.title}》，记得点保存`,"ok"))})}catch(l){n.querySelector("#music-library").innerHTML=`<span class="muted">曲库加载失败：${g(l.message)}</span>`}const p=n.querySelector("#audio-file");p.addEventListener("change",async()=>{var m;const l=(m=p.files)==null?void 0:m[0];if(l){if(l.size>50*1024*1024){$("音频不能超过 50MB","err");return}$("正在上传音频…");try{const{url:c}=await L.uploadAudio(l);d(c,l.name.replace(/\.[^.]+$/,"")),$("上传完成，点保存生效","ok")}catch(c){$(c.message,"err")}finally{p.value=""}}}),n.querySelector("#bgm-url-save").addEventListener("click",()=>{var c;const m=n.querySelector("#bgm-url").value.trim();if(!m){$("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/)/.test(m)){$("地址需要以 http(s):// 或 /media/ 开头","err");return}d(m,((c=m.split("/").pop())==null?void 0:c.replace(/\.[^.]+$/,""))||"外部音频"),$("已填入，点保存生效","ok")}),n.querySelector("#preview-btn").addEventListener("click",()=>{if(!i){$("还没有选择音轨","err");return}I.setTrack(i,o),I.toggle(),setTimeout(()=>{var l;return(l=n.querySelector(".music-disc"))==null?void 0:l.classList.toggle("spin",I.isPlaying())},150)}),n.querySelector("#save-bgm").addEventListener("click",async()=>{const l=n.querySelector("#bgm-title").value.trim();try{const m=await L.updateProfile({bgmUrl:i,bgmTitle:l});Se(m),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:m.bgmUrl,bgmTitle:m.bgmTitle}})),$("背景音乐已保存","ok")}catch(m){$(m.message,"err")}}),(r=n.querySelector("#clear-bgm"))==null||r.addEventListener("click",async()=>{try{const l=await L.updateProfile({bgmUrl:"",bgmTitle:""});Se(l),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),$("已移除背景音乐","ok"),await e.reload()}catch(l){$(l.message,"err")}});return}n.innerHTML=`<section class="card setting-card">
    <div class="avatar-line">
      <img src="${g(s.avatar)}" alt="" id="avatar-preview">
      <div>
        <b>${g(s.nickname)}</b>
        <p class="muted">@${g(s.uin)} · Lv.${s.level}</p>
      </div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换头像
        <input type="file" id="avatar-file" accept="image/*" hidden>
      </label>
    </div>

    <form id="profile-form" class="setting-form">
      <div class="form-2col">
        <label class="field"><span>昵称</span><input class="input" name="nickname" maxlength="20" value="${g(s.nickname)}"></label>
        <label class="field"><span>城市</span><input class="input" name="city" maxlength="20" value="${g(s.city)}"></label>
      </div>
      <label class="field"><span>一句话签名</span><input class="input" name="signature" maxlength="80" value="${g(s.signature)}"></label>
      <label class="field">
        <span>自我介绍（Markdown，会显示在「关于」页）</span>
        <textarea class="input" name="bio" rows="8" maxlength="4000" placeholder="## 关于我&#10;&#10;写文章…">${g(s.bio)}</textarea>
      </label>
      <label class="field"><span>标签（逗号分隔，最多 8 个）</span>
        <input class="input" name="tags" value="${g(s.tags.join(","))}" placeholder="写作, 摄影, 徒步">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" type="submit">保存修改</button>
        <span class="muted">空间号注册后不可修改</span>
      </div>
    </form>
  </section>`,n.querySelector("#avatar-file").addEventListener("change",async i=>{var u;const o=(u=i.target.files)==null?void 0:u[0];if(o)try{const{url:d}=await L.upload(o),p=await L.updateProfile({avatar:d});Se(p),n.querySelector("#avatar-preview").src=d,$("头像已更新","ok")}catch(d){$(d.message,"err")}}),n.querySelector("#profile-form").addEventListener("submit",async i=>{var d,p,l,m,c;i.preventDefault();const o=new FormData(i.currentTarget),u=String((d=o.get("tags"))!=null?d:"").split(/[,，\s]+/).map(f=>f.trim()).filter(Boolean).slice(0,8);try{const f=await L.updateProfile({nickname:String((p=o.get("nickname"))!=null?p:"").trim(),city:String((l=o.get("city"))!=null?l:"").trim(),signature:String((m=o.get("signature"))!=null?m:"").trim(),bio:String((c=o.get("bio"))!=null?c:""),tags:u});Se(f),$("已保存","ok"),await e.reload()}catch(f){$(f.message,"err")}})}async function In(t,e){const a=(e.params.q||"").trim();if(t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SEARCH</p>
        <h1>搜索</h1>
        <p class="page-sub">${a?`“${g(a)}” 的结果`:"找文章、找朋友、找相册"}</p>
      </div>
    </header>

    <form class="search-box card" id="search-form">
      <input class="input" name="q" value="${g(a)}" placeholder="输入关键词" autofocus>
      <button class="btn btn-primary" type="submit">${b("search",14)} 搜索</button>
    </form>

    <div id="search-result"></div>
  </div>`,t.querySelector("#search-form").addEventListener("submit",n=>{var i;n.preventDefault();const r=String((i=new FormData(n.currentTarget).get("q"))!=null?i:"").trim();location.hash=r?`#/search?q=${encodeURIComponent(r)}`:"#/search"}),!a)return;const s=t.querySelector("#search-result");try{const n=await L.search(a);if(!(n.posts.length+n.users.length+n.albums.length)){s.innerHTML=`<div class="card empty"><div class="empty-mark">${b("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}s.innerHTML=`
      ${n.users.length?`<h2 class="result-title">用户 <span>${n.users.length}</span></h2>
             <div class="card user-list">${n.users.map(i=>`<a class="user-row" href="#/u/${g(i.uin)}">
                   <img src="${g(i.avatar)}" alt="">
                   <div><b>${g(i.nickname)}</b><span>@${g(i.uin)} · ${g(i.signature||"")}</span></div>
                   ${b("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${n.posts.length?`<h2 class="result-title">文章 <span>${n.posts.length}</span></h2>
             <div class="post-list card">${n.posts.map(tt).join("")}</div>`:""}
      ${n.albums.length?`<h2 class="result-title">相册 <span>${n.albums.length}</span></h2>
             <div class="album-grid">${n.albums.map(i=>`<a class="album-card card" href="#/album/${i.id}">
                   <div class="album-cover">${i.cover?`<img src="${g(i.cover)}" alt="">`:""}</div>
                   <div class="album-info"><h3>${g(i.name)}</h3><p>${i.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(n){$(n.message,"err")}}const Hs=document.getElementById("app"),Pn=[{pattern:/^\/home$/,nav:"home",render:sa},{pattern:/^\/posts$/,nav:"posts",render:na},{pattern:/^\/post\/(\d+)$/,nav:"posts",render:fn},{pattern:/^\/write$/,nav:"",render:hs},{pattern:/^\/edit\/(\d+)$/,nav:"",render:hs},{pattern:/^\/albums$/,nav:"albums",render:xn},{pattern:/^\/album\/(\d+)$/,nav:"albums",render:Sn},{pattern:/^\/guestbook$/,nav:"guestbook",render:Ln},{pattern:/^\/about$/,nav:"about",render:En},{pattern:/^\/u\/([^/]+)$/,nav:"",render:Tn},{pattern:/^\/messages$/,nav:"",render:qn},{pattern:/^\/visitors$/,nav:"",render:Rn},{pattern:/^\/settings$/,nav:"",render:zn},{pattern:/^\/search$/,nav:"",render:In}];let qt=!1,ze=!1;function Hn(){const t=location.hash.replace(/^#/,"")||"/home",[e,a=""]=t.split("?");return{path:e.startsWith("/")?e:`/${e}`,query:new URLSearchParams(a)}}function _n(t){var e;for(const a of Pn){const s=t.match(a.pattern);if(s)return{def:a,id:(e=s[1])!=null?e:""}}return null}async function _s(){try{const t=await L.session();if(!t.authenticated||!t.user)return!1;const e=await L.bootstrap();return Ks({me:e.me,themes:e.themes,unread:e.unread}),gs(e.me.theme),!0}catch{return!1}}function At(){qt=!1,te.boot=null,document.body.classList.remove("signed-in"),I.unmount(),ea(Hs,async()=>{await _s()&&Ds()})}function Ie(t,e,a){return`<a class="nav-link" data-nav="${e}" href="${t}">${a}</a>`}function Ds(){const t=fe();document.body.classList.add("signed-in"),Hs.innerHTML=`
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${b("pen",15)}</span>
        <span class="brand-text">${g(t.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${Ie("#/home","home","首页")}
        ${Ie("#/posts","posts","文章")}
        ${Ie("#/albums","albums","相册")}
        ${Ie("#/guestbook","guestbook","留言板")}
        ${Ie("#/about","about","关于")}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${b("search",15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${b("pen",14)}<span>写文章</span></a>
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${b("bell",18)}<i class="badge" data-unread ${Kt()?"":"hidden"}>${Kt()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${ie(t.avatar,t.nickname,32)}
          <div class="user-menu" id="user-menu" hidden>
            <div class="menu-head">
              <b>${g(t.nickname)}</b>
              <span>@${g(t.uin)}</span>
            </div>
            <a href="#/u/${g(t.uin)}">${b("grid",14)} 我的主页</a>
            <a href="#/visitors">${b("eye",14)} 访客记录</a>
            <a href="#/settings">${b("settings",14)} 空间设置</a>
            <button id="logout-btn">${b("logout",14)} 退出登录</button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main id="view" class="view"></main>

  <nav class="mobile-tabs" aria-label="主导航">
    <a class="mtab" data-nav="home" href="#/home">${b("pen",19)}<span>首页</span></a>
    <a class="mtab" data-nav="posts" href="#/posts">${b("book",19)}<span>文章</span></a>
    <a class="mtab" data-nav="albums" href="#/albums">${b("image",19)}<span>相册</span></a>
    <a class="mtab" data-nav="guestbook" href="#/guestbook">${b("mail",19)}<span>留言</span></a>
    <a class="mtab" data-nav="about" href="#/about">${b("grid",19)}<span>关于</span></a>
  </nav>

  <footer class="site-foot">
    <span>${g(t.nickname)} · 个人空间</span>
    <span class="foot-sep">·</span>
    <span>Go + ent + SQLite · TypeScript</span>
  </footer>`;const e=document.getElementById("head-search");e.addEventListener("submit",s=>{var r;s.preventDefault();const n=String((r=new FormData(e).get("q"))!=null?r:"").trim();n&&(location.hash=`#/search?q=${encodeURIComponent(n)}`)});const a=document.getElementById("user-chip");a.addEventListener("click",s=>{s.target.closest("a,button")||(ze=!ze,document.getElementById("user-menu").hidden=!ze)}),document.addEventListener("click",s=>{!a.contains(s.target)&&ze&&(ze=!1,document.getElementById("user-menu").hidden=!0)}),document.getElementById("logout-btn").addEventListener("click",async()=>{await L.logout(),$("已退出登录"),At()}),qt=!0,I.setTrack(t.bgmUrl,t.bgmTitle),I.mount(),Je()}async function Je(){var i;if(!qt)return;const t=document.getElementById("view");if(!t)return;const{path:e,query:a}=Hn(),s=_n(e);if(!e.startsWith("/write")&&!e.startsWith("/edit/")&&document.body.classList.remove("writer-mode"),document.querySelectorAll("[data-nav]").forEach(o=>{o.classList.toggle("active",o.dataset.nav===(s==null?void 0:s.def.nav))}),!s){t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">页面不存在</h2>
      <p class="empty-desc">这条链接可能已经失效。</p>
      <a class="btn btn-primary" href="#/home">回到首页</a>
    </div></div>`;return}const n={...Object.fromEntries(a)};s.id&&(n.id=s.id,s.def.pattern.source.includes("[^/]")&&(n.uin=s.id)),window.scrollTo({top:0});const r={params:n,reload:Je};try{await s.def.render(t,r)}catch(o){if(o instanceof Ve&&o.status===401)return;t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${g(o.message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`,(i=t.querySelector("#retry"))==null||i.addEventListener("click",()=>void Je())}}window.addEventListener("hashchange",()=>void Je());window.addEventListener("qz:expired",()=>At());(async function(){await _s()?Ds():At()})();window.addEventListener("qz:profile",t=>{const e=t.detail;e&&I.setTrack(e.bgmUrl,e.bgmTitle)});
