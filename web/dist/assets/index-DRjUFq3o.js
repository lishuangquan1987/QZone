var Ks=Object.defineProperty;var Kt=t=>{throw TypeError(t)};var Xs=(t,e,a)=>e in t?Ks(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var M=(t,e,a)=>Xs(t,typeof e!="symbol"?e+"":e,a),Ys=(t,e,a)=>e.has(t)||Kt("Cannot "+a);var Xt=(t,e,a)=>e.has(t)?Kt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a);var xe=(t,e,a)=>(Ys(t,e,"access private method"),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();class Qe extends Error{constructor(a,s){super(s);M(this,"status");this.status=a}}async function Le(t,e={}){const a=new Headers(e.headers);e.body&&!(e.body instanceof FormData)&&a.set("Content-Type","application/json");let s;try{s=await fetch(t,{credentials:"include",...e,headers:a})}catch{throw new Qe(0,"网络连接失败，请检查服务是否已启动")}if(s.status===401)throw window.dispatchEvent(new CustomEvent("qz:expired")),new Qe(401,"登录状态已失效");const n=await s.text(),r=n?JSON.parse(n):{};if(!s.ok)throw new Qe(s.status,r.error||"请求失败");return r}const U=t=>Le(t),_=(t,e)=>Le(t,{method:"POST",body:e===void 0?void 0:JSON.stringify(e)}),Re=t=>Le(t,{method:"DELETE"}),Yt=(t,e)=>Le(t,{method:"PATCH",body:JSON.stringify(e)}),S={register:(t,e,a)=>_("/api/auth/register",{uin:t,nickname:e,password:a}),login:(t,e)=>_("/api/auth/login",{uin:t,password:e}),logout:()=>_("/api/auth/logout"),session:()=>U("/api/auth/session"),bootstrap:()=>U("/api/bootstrap"),user:t=>U(`/api/users/${encodeURIComponent(t)}`),updateProfile:t=>Yt("/api/users/me",t),signIn:()=>_("/api/users/me/signin"),visitors:(t,e="in")=>U(`/api/users/${encodeURIComponent(t)}/visitors?mode=${e}`),visit:(t,e)=>_(`/api/users/${encodeURIComponent(t)}/visit`,{module:e}),posts:t=>{const e=new URLSearchParams;return Object.entries(t).forEach(([a,s])=>{s!==void 0&&s!==""&&e.set(a,String(s))}),U(`/api/posts?${e}`)},createPost:t=>_("/api/posts",t),post:t=>U(`/api/posts/${t}`),updatePost:(t,e)=>Yt(`/api/posts/${t}`,e),deletePost:t=>Re(`/api/posts/${t}`),likePost:t=>_(`/api/posts/${t}/like`),commentPost:(t,e,a)=>_(`/api/posts/${t}/comments`,{content:e,replyTo:a}),deleteComment:(t,e)=>Re(`/api/posts/${t}/comments/${e}`),albums:t=>U(`/api/albums${t?`?uin=${encodeURIComponent(t)}`:""}`),album:t=>U(`/api/albums/${t}`),createAlbum:t=>_("/api/albums",t),deleteAlbum:t=>Re(`/api/albums/${t}`),addPhotos:(t,e,a)=>_(`/api/albums/${t}/photos`,{urls:e,caption:"",...a}),deletePhoto:(t,e)=>Re(`/api/albums/${t}/photos/${e}`),likePhoto:t=>_(`/api/photos/${t}/like`),guestbook:t=>U(`/api/guestbook${t?`?uin=${encodeURIComponent(t)}`:""}`),createGuestbook:(t,e)=>_("/api/guestbook",{owner:t,content:e}),deleteGuestbook:t=>Re(`/api/guestbook/${t}`),replyGuestbook:(t,e)=>_(`/api/guestbook/${t}/reply`,{reply:e}),notifications:()=>U("/api/notifications"),readNotifications:(t=[])=>_("/api/notifications/read",{ids:t}),musicLibrary:()=>U("/api/music/library"),search:t=>U(`/api/search?q=${encodeURIComponent(t)}`),upload:async t=>{const e=new FormData;return e.append("file",t),Le("/api/upload",{method:"POST",body:e})},uploadAudio:async t=>{const e=new FormData;return e.append("file",t),Le("/api/upload/audio",{method:"POST",body:e})}},J={boot:null};function ve(){if(!J.boot)throw new Error("尚未初始化");return J.boot.me}function Js(t){J.boot=t}function Se(t){J.boot&&(J.boot.me=t)}function mt(){var t,e;return(e=(t=J.boot)==null?void 0:t.themes)!=null?e:[]}function Jt(){var t,e;return(e=(t=J.boot)==null?void 0:t.unread)!=null?e:0}function es(t){J.boot&&(J.boot.unread=t),document.querySelectorAll("[data-unread]").forEach(e=>{e.textContent=t>99?"99+":String(t),e.hidden=t===0})}function vs(t){var a,s;const e=(a=mt().find(n=>n.id===t))!=null?a:mt()[0];document.documentElement.dataset.theme=(s=e==null?void 0:e.id)!=null?s:"aurora",e&&document.documentElement.style.setProperty("--accent",e.accent)}function m(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const ce=t=>String(t).padStart(2,"0");function de(t){const e=new Date(t).getTime(),a=Date.now()-e,s=6e4;if(a<s)return"刚刚";if(a<60*s)return`${Math.floor(a/s)} 分钟前`;const n=new Date(e),r=new Date;if(n.toDateString()===r.toDateString())return`今天 ${ce(n.getHours())}:${ce(n.getMinutes())}`;const i=new Date(Date.now()-864e5);return n.toDateString()===i.toDateString()?`昨天 ${ce(n.getHours())}:${ce(n.getMinutes())}`:n.getFullYear()===r.getFullYear()?`${n.getMonth()+1} 月 ${n.getDate()} 日`:`${n.getFullYear()} 年 ${n.getMonth()+1} 月 ${n.getDate()} 日`}function ts(t){const e=new Date(t);return`${e.getFullYear()}-${ce(e.getMonth()+1)}-${ce(e.getDate())} ${ce(e.getHours())}:${ce(e.getMinutes())}`}const ea={pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',message:'<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',music:'<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',bell:'<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chevron:'<path d="M9 6l6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',star:'<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',logout:'<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',tag:'<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',pin:'<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',listOl:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',table:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',codeInline:'<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',codeBlock:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>',expand:'<path d="M9 4.5H4.5V9M15 4.5h4.5V9M15 19.5h4.5V15M9 19.5H4.5V15"/>',compress:'<path d="M4.5 9H9V4.5M19.5 9H15V4.5M19.5 15H15v4.5M4.5 15H9v4.5"/>',outline:'<path d="M4 6h16M4 12h10.5M4 18h7"/>'};function b(t,e=16){var s;const a=(s=ea[t])!=null?s:"";return`<svg class="ico" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}function re(t,e,a=40,s="",n=0){const r=t?`<img src="${m(t)}" alt="${m(e)}" loading="lazy">`:`<span class="avatar-fallback">${m(e.slice(0,1))}</span>`,i=s?`href="#/u/${m(s)}"`:"",l=a>0?` style="width:${a}px;height:${a}px"`:"";return`<a class="avatar" ${i}${l}>${r}${n?`<i class="avatar-level">${n}</i>`:""}</a>`}function $(t,e="info"){let a=document.getElementById("toasts");a||(a=document.createElement("div"),a.id="toasts",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${e}`,s.textContent=t,a.appendChild(s),requestAnimationFrame(()=>s.classList.add("in")),setTimeout(()=>{s.classList.remove("in"),setTimeout(()=>s.remove(),280)},2600)}function yt(t){return new Promise(e=>{var r,i,l,d;const a=document.createElement("div");a.className="modal-mask",a.innerHTML=`
      <div class="modal ${t.wide?"modal-wide":""}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${m(t.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${b("close",18)}</button>
        </header>
        <div class="modal-body">${t.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${m((r=t.cancelText)!=null?r:"取消")}</button>
          <button class="btn btn-primary modal-ok">${m((i=t.confirmText)!=null?i:"确定")}</button>
        </footer>
      </div>`,document.body.appendChild(a),document.body.classList.add("no-scroll");const s=g=>{a.remove(),document.body.classList.remove("no-scroll"),e(g)};a.querySelector(".modal-x").addEventListener("click",()=>s(!1)),a.querySelector(".modal-cancel").addEventListener("click",()=>s(!1)),a.addEventListener("mousedown",g=>{g.target===a&&s(!1)});const n=a.querySelector(".modal-ok");n.addEventListener("click",async()=>{if(!t.onConfirm)return s(!0);n.disabled=!0;try{await t.onConfirm(a)!==!1&&s(!0)}catch(g){$(g.message,"err")}finally{n.disabled=!1}}),(l=t.onMount)==null||l.call(t,a),(d=a.querySelector("input, textarea"))==null||d.focus()})}async function Ke(t,e,a="删除"){return yt({title:t,body:`<p class="confirm-text">${m(e)}</p>`,confirmText:a})}function st(t){t.addEventListener("click",e=>{const a=e.target.closest("[data-zoom]");if(!a||e.target.closest("button"))return;const s=a.dataset.zoom||a.src,n=Array.from(t.querySelectorAll("[data-zoom]")).map(p=>p.dataset.zoom||p.src);let r=Math.max(0,n.indexOf(s));const i=document.createElement("div");i.className="lightbox",i.innerHTML=`
      <button class="lb-close">${b("close",24)}</button>
      <button class="lb-prev">${b("back",24)}</button>
      <img alt="">
      <button class="lb-next">${b("chevron",24)}</button>
      <div class="lb-count"></div>`,document.body.appendChild(i),document.body.classList.add("no-scroll");const l=i.querySelector("img"),d=i.querySelector(".lb-count"),g=()=>{l.src=n[r],d.textContent=`${r+1} / ${n.length}`};g();const c=p=>{p.key==="Escape"&&u(),p.key==="ArrowLeft"&&n.length>1&&(r=(r-1+n.length)%n.length,g()),p.key==="ArrowRight"&&n.length>1&&(r=(r+1)%n.length,g())},u=()=>{i.remove(),document.body.classList.remove("no-scroll"),window.removeEventListener("keydown",c)};i.querySelector(".lb-close").addEventListener("click",u),i.addEventListener("click",p=>{p.target===i&&u()}),i.querySelector(".lb-prev").addEventListener("click",p=>{p.stopPropagation(),n.length>1&&(r=(r-1+n.length)%n.length,g())}),i.querySelector(".lb-next").addEventListener("click",p=>{p.stopPropagation(),n.length>1&&(r=(r+1)%n.length,g())}),window.addEventListener("keydown",c)})}function ta(t,e="",a=""){return`<div class="empty">
    <div class="empty-mark">${b("book",22)}</div>
    <p class="empty-title">${m(t)}</p>
    ${e?`<p class="empty-desc">${m(e)}</p>`:""}
    ${a}
  </div>`}function Xe(t=3){return Array.from({length:t}).map(()=>`<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`).join("")}class sa{constructor(){M(this,"audio",null);M(this,"pill",null);M(this,"title","");M(this,"url","");M(this,"armed",!1)}get want(){return localStorage.getItem("qz.bgm")!=="off"}get volume(){const e=Number(localStorage.getItem("qz.bgm.vol"));return Number.isFinite(e)&&e>0?Math.min(e,1):.55}setTrack(e,a){const s=e!==this.url;this.url=e,this.title=a||"未命名音轨",s&&(this.ensureAudio(),this.audio&&(this.audio.src=e,this.audio.volume=this.volume,this.audio.load())),this.render(),s&&e&&this.want&&this.arm()}ensureAudio(){if(this.audio)return;const e=new Audio;e.loop=!0,e.preload="metadata",e.volume=this.volume,e.addEventListener("play",()=>this.render()),e.addEventListener("pause",()=>this.render()),e.addEventListener("error",()=>{this.render(),this.url&&$("背景音乐加载失败，可能是格式不支持","err")}),this.audio=e}arm(){if(this.armed)return;this.armed=!0;const e=a=>{const s=a.target;s&&s.closest(".bgm")||(document.removeEventListener("pointerdown",e),document.removeEventListener("keydown",e),this.want&&this.audio&&this.audio.paused&&this.play())};document.addEventListener("pointerdown",e),document.addEventListener("keydown",e)}async play(){if(this.ensureAudio(),!(!this.audio||!this.url))try{await this.audio.play(),localStorage.setItem("qz.bgm","on")}catch{this.render()}}pause(){var e;(e=this.audio)==null||e.pause(),localStorage.setItem("qz.bgm","off"),this.render()}isPlaying(){return!!this.audio&&!this.audio.paused}toggle(){var e;if(!this.url){$("还没有设置背景音乐，可以在「设置」里上传","err");return}((e=this.audio)==null?void 0:e.paused)!==!1?this.play():this.pause()}setVolume(e){localStorage.setItem("qz.bgm.vol",String(e)),this.audio&&(this.audio.volume=e)}mount(){if(this.pill){this.render();return}const e=document.createElement("div");e.className="bgm",document.body.appendChild(e),this.pill=e,e.addEventListener("click",a=>{const s=a.target;if(s.closest("[data-bgm-toggle]")){this.toggle();return}s.closest(".bgm-meta")&&(location.hash="#/settings?tab=music")}),e.addEventListener("input",a=>{const s=a.target;s.matches(".bgm-vol")&&this.setVolume(Number(s.value))}),this.render(),this.url&&this.want&&this.arm()}unmount(){var e,a;(e=this.pill)==null||e.remove(),this.pill=null,(a=this.audio)==null||a.pause(),document.body.classList.remove("has-bgm")}render(){if(document.body.classList.toggle("has-bgm",!!this.url),!this.pill)return;const e=this.audio?!this.audio.paused:!1,a=Math.round(this.volume*100);window.dispatchEvent(new CustomEvent("qz:bgm",{detail:{playing:e}})),this.pill.innerHTML=`
      <div class="bgm-disc ${e?"spin":""}" data-bgm-toggle title="${e?"暂停":"播放"}">${b("music",16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${m(this.url?this.title:"未设置音轨")}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${e?"暂停":"播放"}">
        ${b(e?"pause":"play",14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${a}" aria-label="音量">
      <div class="bgm-wave ${e?"on":""}"><i></i><i></i><i></i><i></i></div>`}}const I=new sa;window.bgm=I;function aa(t,e){t.innerHTML=`
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
  </div>`;const a=t.querySelector("#auth-form"),s=t.querySelector("#auth-submit"),n=t.querySelector("#auth-hint"),r=Array.from(t.querySelectorAll(".auth-tab"));let i="login";const l=d=>{i=d,r.forEach(c=>c.classList.toggle("active",c.dataset.mode===d)),t.querySelectorAll('[data-only="register"]').forEach(c=>{c.hidden=d!=="register"});const g=a.elements.namedItem("nickname");g.required=d==="register",s.textContent=d==="login"?"登录":"创建空间",n.textContent=d==="login"?"还没有账号？点上面的「注册」，30 秒就能开通。":"空间号将作为你的主页地址，注册后不可修改。"};r.forEach(d=>d.addEventListener("click",()=>l(d.dataset.mode))),t.querySelectorAll(".demo-chip").forEach(d=>{d.addEventListener("click",()=>{var g,c;l("login"),a.elements.namedItem("uin").value=(g=d.dataset.uin)!=null?g:"",a.elements.namedItem("password").value=(c=d.dataset.pw)!=null?c:"",s.focus()})}),a.addEventListener("submit",async d=>{var o,v,y;d.preventDefault();const g=new FormData(a),c=String((o=g.get("uin"))!=null?o:"").trim(),u=String((v=g.get("password"))!=null?v:""),p=String((y=g.get("nickname"))!=null?y:"").trim();if(i==="register"&&!p){$("请填写昵称","err");return}s.disabled=!0,s.textContent=i==="login"?"登录中…":"创建中…";try{i==="login"?await S.login(c,u):await S.register(c,p,u),$(i==="login"?"欢迎回来":"空间已开通","ok"),await e()}catch(w){$(m(w.message),"err"),s.disabled=!1,s.textContent=i==="login"?"登录":"创建空间"}})}const ks={private:"仅自己可见",unlisted:"不公开列出",public:""};function ys(t){const e=t.cover||t.images[0]||"";return`<article class="feature card" data-post="${t.id}">
    <a class="feature-cover" href="#/post/${t.id}">
      ${e?`<img src="${m(e)}" alt="${m(t.title)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
    </a>
    <div class="feature-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        <span class="pill">${m(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${ks[t.visibility]}</span>`:""}
      </div>
      <h2 class="feature-title"><a href="#/post/${t.id}">${m(t.title||"无标题")}</a></h2>
      <p class="feature-summary">${m(t.summary)}</p>
      <div class="post-meta">
        <span>${de(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${b("clock",12)} ${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
  </article>`}function at(t){const e=t.cover||t.images[0]||"";return`<article class="post-row" data-post="${t.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        <span class="pill">${m(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${ks[t.visibility]}</span>`:""}
      </div>
      <h3 class="post-row-title"><a href="#/post/${t.id}">${m(t.title||"无标题")}</a></h3>
      <p class="post-row-summary">${m(t.summary)}</p>
      <div class="post-meta">
        <span>${de(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
    ${e?`<a class="post-row-thumb" href="#/post/${t.id}"><img src="${m(e)}" alt="" loading="lazy"></a>`:""}
  </article>`}function ss(t){return t.length?`<ul class="comment-list">${t.map(e=>`<li class="comment" data-cid="${e.id}">
        ${re(e.author.avatar,e.author.nickname,34,e.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${m(e.author.uin)}">${m(e.author.nickname)}</a>
            <time>${de(e.at)}</time>
            <button class="text-btn" data-reply="${m(e.author.nickname)}">回复</button>
            ${e.canDel?`<button class="text-btn danger" data-del-comment="${e.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${e.replyTo?`<span class="comment-reply">回复 ${m(e.replyTo)}：</span>`:""}${m(e.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function na(t){return`<a class="album-card card" href="#/album/${t.id}">
    <div class="album-cover">
      ${t.cover?`<img src="${m(t.cover)}" alt="${m(t.name)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${t.count} 张</span>
    </div>
    <div class="album-info">
      <h3>${m(t.name)}</h3>
      <p>${m(t.description||"还没有描述")}</p>
    </div>
  </a>`}async function ia(t,e){var r;const a=ve();t.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${m(a.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${re(a.avatar,a.nickname,0,"",0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${b("pin",12)} ${m(a.city||"未设置城市")} · ${m(a.constellation||"—")}</p>
          <h1>${m(a.nickname)}</h1>
          <p class="hero-sign">${m(a.signature||"这个人正在写文章。")}</p>
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
      <div class="home-main" id="home-main">${Xe(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,st(t);const s=t.querySelector("#home-main"),n=t.querySelector("#home-rail");try{const[{posts:i,total:l},d]=await Promise.all([S.posts({limit:7}),S.albums()]);if(!i.length)s.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const c=(r=i.find(p=>p.pinned))!=null?r:i[0],u=i.filter(p=>p.id!==c.id);s.innerHTML=`
        ${ys(c)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${l} 篇 ${b("chevron",12)}</a>
        </div>
        <div class="post-list">${u.map(at).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}n.innerHTML=`
      <section class="rail-card">
        <h3>关于我</h3>
        <p class="rail-bio">${m(a.bio?a.bio.split(`
`)[0].replace(/^#+\s*/,""):a.signature||"还没有写自我介绍。")}</p>
        <div class="tag-cloud">${a.tags.map(c=>`<a class="tag" href="#/search?q=${encodeURIComponent(c)}">${m(c)}</a>`).join("")||'<span class="muted">还没有标签</span>'}</div>
        <a class="rail-link" href="#/about">了解更多 ${b("chevron",12)}</a>
      </section>

      <section class="rail-card">
        <h3>背景音乐</h3>
        <div class="rail-music">
          <div class="rail-disc ${ut()?"spin":""}">${b("music",16)}</div>
          <div class="rail-music-meta">
            <b>${m(a.bgmTitle||"未设置音轨")}</b>
            <span>${a.bgmUrl?"正在循环播放":"去设置里上传一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${ut()?b("pause",13):b("play",13)} ${ut()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${d.albums.slice(0,3).map(c=>`<a class="rail-album" href="#/album/${c.id}">
                <img src="${m(c.cover)}" alt="">
                <span>${m(c.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${b("mail",13)} 去留言</a>
      </section>`;const g=n.querySelector("#rail-play");window.addEventListener("qz:bgm",()=>{var c;g&&((c=n.querySelector(".rail-disc"))==null||c.classList.toggle("spin",I.isPlaying()),g.innerHTML=`${I.isPlaying()?b("pause",13):b("play",13)} ${I.isPlaying()?"暂停":"播放"}`)}),g==null||g.addEventListener("click",()=>{I.toggle()})}catch(i){$(i.message,"err")}}function ut(){return I.isPlaying()}const ra=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function la(t,e){const a=e.params.sort==="popular"?"popular":"latest",s=e.params.category||"全部",n=e.params.q||"";t.innerHTML=`<div class="page">
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
        ${ra.map(p=>`<button class="sort-btn ${p.key===a?"active":""}" data-sort="${p.key}">${p.label}</button>`).join("")}
      </div>
    </div>
    ${n?`<p class="search-note">搜索「${m(n)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${Xe(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const r=t.querySelector("#archive-list"),i=t.querySelector("#load-more"),l=t.querySelector("#cat-row");let d,g=[];const c=()=>{const p=new Set(["全部"]);g.forEach(o=>o.category&&p.add(o.category)),l.innerHTML=Array.from(p).map(o=>`<button class="chip ${o===s?"active":""}" data-cat="${m(o)}">${m(o)}</button>`).join("")},u=async p=>{p&&(d=void 0,r.innerHTML=Xe(2));const o=await S.posts({category:s,sort:a,q:n,limit:8,before:d});g=p?o.posts:g.concat(o.posts);const v=o.posts.map(at).join("");p?r.innerHTML=v:r.insertAdjacentHTML("beforeend",v),o.posts.length&&(d=o.posts[o.posts.length-1].at),i.hidden=!o.hasMore,t.querySelector("#archive-sub").textContent=`共 ${o.total} 篇 · 按${a==="popular"?"阅读量":"时间"}排序`,c(),p&&!o.posts.length&&(r.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await u(!1)}catch(p){$(p.message,"err")}finally{i.disabled=!1}}),l.addEventListener("click",p=>{const o=p.target.closest("[data-cat]");if(!o)return;const v=new URLSearchParams;o.dataset.cat&&o.dataset.cat!=="全部"&&v.set("category",o.dataset.cat),a==="popular"&&v.set("sort","popular"),location.hash=`#/posts${v.toString()?"?"+v.toString():""}`}),t.querySelectorAll("[data-sort]").forEach(p=>{p.addEventListener("click",()=>{const o=new URLSearchParams;s!=="全部"&&o.set("category",s),p.dataset.sort==="popular"&&o.set("sort","popular"),location.hash=`#/posts${o.toString()?"?"+o.toString():""}`})});try{await u(!0)}catch(p){$(p.message,"err"),r.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}function $t(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ke=$t();function $s(t){ke=t}var ge={exec:()=>null};function he(t){let e=[];return a=>{let s=Math.max(0,Math.min(3,a-1)),n=e[s];return n||(n=t(s),e[s]=n),n}}function L(t,e=""){let a=typeof t=="string"?t:t.source,s={replace:(n,r)=>{let i=typeof r=="string"?r:r.source;return i=i.replace(z.caret,"$1"),a=a.replace(n,i),s},getRegex:()=>new RegExp(a,e)};return s}var ws=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),xs="^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)",z={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,textIndentedContinuation:/^(?:\n(?: {4}| {0,3}\t)[ \t]*[^ \t\n][^\n]*)+/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,blockquoteFenceOpen:/^ {0,3}(`{3,}(?=[^`]*$)|~{3,})/,blockquoteFenceClose:/^ {0,3}(`{3,}|~{3,})[ \t]*$/,blockquoteListItemStart:/^ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|$)/,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableHeader:new RegExp(xs+"(?:\\n|$)"),tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:he(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:he(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:he(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:he(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:he(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:he(t=>new RegExp(`^ {0,${t}}(?:</?(?:${xt})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:he(t=>new RegExp(`^ {0,${t}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},oa=/^(?:[ \t]*(?:\n|$))+/,ca=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,da=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*)[ \t]*(?=\n|$)|$)/,He=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ua=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,wt=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,xt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",_e=L(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",xt).getRegex(),Ss=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,Ls=L(Ss).replace(/bull/g,wt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,_e).getRegex(),pa=L(Ss).replace(/bull/g,wt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,_e).getRegex(),St=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,ha=/^[^\n]+/,Lt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,ga=L(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Lt).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),ma=L(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,wt).getRegex(),Et=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ba=L("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Et).replace("tag",xt).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),Es=t=>L(St).replace("hr",He).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html",_e).getRegex(),fa=Es(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),va=Es(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),as=/ {0,3}> ?(?:(?!blank)(paragraph)|[^\n]*)(?:\n|$)/,ka=L(/^(first)(?:next)*/).replace("first",L(as).replace("blank",/[ \t]*(?:\n|$)| {4}/).getRegex()).replace("next",L(as).replace("blank",/[ \t]*(?:\n|$)/).getRegex()).replace(/paragraph/g,va).getRegex(),Tt={blockquote:ka,code:ca,def:ga,fences:da,heading:ua,hr:He,html:ba,lheading:Ls,list:ma,newline:oa,paragraph:fa,table:ge,text:ha},ya=L(xs+"(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",He).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",_e).getRegex(),$a={...Tt,lheading:pa,table:ya,paragraph:L(St).replace("hr",He).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",z.tableHeader).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",_e).getRegex()},wa={...Tt,html:L(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",Et).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ge,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:L(St).replace("hr",He).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",Ls).getRegex()},xa=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Sa=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ts=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,La=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ee=/[\p{P}\p{S}]/u,Te=/[\s\p{P}\p{S}]/u,De=/[^\s\p{P}\p{S}]/u,Ea=L(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Te).getRegex(),Ta=/[\p{Pi}\p{Ps}"']/u,Ms=/(?!~)[\p{P}\p{S}]/u,Ma=/(?!~)[\s\p{P}\p{S}]/u,qa=/(?:[^\s\p{P}\p{S}]|~)/u,Aa=L(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ws?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),qs=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Ra=L(qs,"u").replace(/punct/g,ee).getRegex(),Ca=L(qs,"u").replace(/punct/g,Ms).getRegex(),za=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Pa=L(za,"u").replace(/openQuote/g,Ta).replace(/punct/g,ee).getRegex(),As="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ia=L(As,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,ee).getRegex(),Ha=L(As,"gu").replace(/notPunctSpace/g,qa).replace(/punctSpace/g,Ma).replace(/punct/g,Ms).getRegex(),_a="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Da=L(_a,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,ee).getRegex(),Ba=L("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,ee).getRegex(),Oa="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",ja=L(Oa,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,ee).getRegex(),Na=L(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ee).getRegex(),Ua="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Fa=L(Ua,"gu").replace(/notPunctSpace/g,De).replace(/punctSpace/g,Te).replace(/punct/g,ee).getRegex(),Za=L(/\\(punct)/,"gu").replace(/punct/g,ee).getRegex(),Va=L(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,ee).getRegex(),Ga=L(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Qa=L(Et).replace("(?:-->|$)","-->").getRegex(),Wa=L("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Qa).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Rs=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,Ye=L(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Rs).getRegex(),nt=/\\[^ \t\n\x00-\x1f]|\\(?=[ \t\n])|[^ \t\n\x00-\x1f\\()]/,Ka=L(/\((?:char)*\)/).replace("char",nt).getRegex(),Xa=L(/\((?:char|p1)*\)/).replace("char",nt).replace("p1",Ka).getRegex(),Ya=L(/\((?:char|p2)*\)/).replace("char",nt).replace("p2",Xa).getRegex(),Ja=L(/(?!<)(?:char|p3)+/).replace("char",nt).replace("p3",Ya).getRegex(),en=L(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",Ye).replace("href",L(/<(?:\\.|[^\n<>\\])*>|bareHref|(?=\))/).replace("bareHref",Ja).getRegex()).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),tn=L(/^!?\[(label)\]\[(ref)\]/).replace("label",Ye).replace("ref",Lt).getRegex(),sn=L(/^!?\[(ref)\](?:\[\])?/).replace("ref",Lt).getRegex(),ns=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,an=L(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Rs).getRegex(),nn=L("reflink|nolink(?!\\()","g").replace("reflink",L(/^!?\[(label)\]\[(ref)\]/).replace("label",an).replace("ref",ns).getRegex()).replace("nolink",L(/^!?\[(ref)\](?:\[\])?/).replace("ref",ns).getRegex()).getRegex(),is=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,rn=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,ln=L(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,rn).getRegex(),Mt={_backpedal:ge,anyPunctuation:Za,anyPunctuationOutsideCode:Va,autolink:Ga,blockSkip:Aa,br:Ts,code:Sa,del:ge,delLDelim:ge,delRDelim:ge,emStrongLDelim:Ra,emStrongRDelimAst:Ia,emStrongRDelimUnd:Ba,escape:xa,link:en,nolink:sn,punctuation:Ea,reflink:tn,reflinkSearch:nn,tag:Wa,text:La,url:ge},on={...Mt,emStrongLDelim:Pa,emStrongRDelimAst:Da,emStrongRDelimUnd:ja,link:L(/^!?\[(label)\]\((.*?)\)/).replace("label",Ye).getRegex(),reflink:L(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ye).getRegex()},bt={...Mt,emStrongRDelimAst:Ha,emStrongLDelim:Ca,delLDelim:Na,delRDelim:Fa,url:L(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",ln).replace("protocol",is).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:L(/^(?:[A-Za-z0-9.+-]+(?=@)|[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",is).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",ws?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},cn={...bt,br:L(Ts).replace("{2,}","*").getRegex(),text:L(bt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ue={normal:Tt,gfm:$a,pedantic:wa},Ce={normal:Mt,gfm:bt,breaks:cn,pedantic:on},dn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},rs=t=>dn[t];function D(t,e){if(e){if(z.escapeTest.test(t))return t.replace(z.escapeReplace,rs)}else if(z.escapeTestNoEncode.test(t))return t.replace(z.escapeReplaceNoEncode,rs);return t}function un(t){return z.numericCharacterReference.test(t)?t.replace(z.numericCharacterReferenceOrAmpersand,(e,a,s)=>{if(a===void 0&&s===void 0)return"&amp;";let n=a===void 0?Number.parseInt(s,16):Number.parseInt(a,10);return n===0||n>1114111||n>=55296&&n<=57343?"�":n===38?"&amp;":String.fromCodePoint(n)}):t}function ls(t){try{t=encodeURI(t).replace(z.percentDecode,"%")}catch{return null}return t}function pt(t,e){var r;let a=t.replace(z.findPipe,(i,l,d)=>{let g=!1,c=l;for(;--c>=0&&d[c]==="\\";)g=!g;return g?"|":" |"}),s=a.split(z.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!((r=s.at(-1))!=null&&r.trim())&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(z.slashPipe,"|");return s}function ie(t,e,a){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function os(t){let e=t.split(`
`),a=e.length-1;for(;a>=0&&z.blankLine.test(e[a]);)a--;return e.length-a<=2?t:e.slice(0,a+1).join(`
`)}function Je(t){return t.trim().replace(z.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function cs(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let a=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])a++;else if(t[s]===e[1]&&(a--,a<0))return s;return a>0?-2:-1}var Ee=new WeakMap;function qt(t){let e={"*":-1,_:-1},a=-1,s=t.length;for(let n=0;n<s;n++){let r=t[n];if(r!=="*"&&r!=="_"&&r!=="~")continue;let i=n===0?`
`:t[n-1],l=n+1;for(;l<s&&t[l]===r;)l++;i!==" "&&i!=="	"&&i!==`
`&&i!=="\r"&&i!=="\f"&&(r==="~"?a=n:e[r]=n),n=l-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:a}}function pn(t,e){let a=qt(e),s=Ee.get(t);s?s.push(a):Ee.set(t,[a])}function hn(t){let e=Ee.get(t);e&&(e.pop(),e.length===0&&Ee.delete(t))}function Cs(t,e,a){var n;let s=(n=Ee.get(t))==null?void 0:n.at(-1);return s&&s.maskedSrc===e?s.lastPossibleEmStrongCloserIndex[a]:qt(e).lastPossibleEmStrongCloserIndex[a]}function zs(t,e){var s;let a=(s=Ee.get(t))==null?void 0:s.at(-1);return a&&a.maskedSrc===e?a.lastPossibleDelCloserIndex:qt(e).lastPossibleDelCloserIndex}function Fe(t,e=0){let a=e,s="";for(let n of t)if(n==="	"){let r=4-a%4;s+=" ".repeat(r),a+=r}else s+=n,a++;return s}function gn(t){let e,a=!1;return t.map(s=>{var g,c,u;if(a)return s;let{depth:n,expanded:r,keptIndent:i,content:l}=mn(s,(g=e==null?void 0:e.depth)!=null?g:1/0);if((e==null?void 0:e.depth)!==n&&(e=void 0),e){let p=(c=z.blockquoteFenceClose.exec(l))==null?void 0:c[1];return!p||p[0]!==e.marker[0]||p.length<e.marker.length?i:(e=void 0,r)}if(a=z.blockquoteListItemStart.test(l),a)return s;let d=(u=z.blockquoteFenceOpen.exec(l))==null?void 0:u[1];return d&&(e={marker:d,depth:n}),r}).join(`
`)}function mn(t,e){let a=0,s=0,n=0,r=0,i="";for(;n<e;){let c=a,u=s;for(;t[c]===" "||t[c]==="	";)u+=ds(t[c],u),c++;if(t[c]!==">"||u-r>3)break;i+=" ".repeat(u-s)+">",n++,a=c+1,s=u+1,r=t[a]===" "||t[a]==="	"?s+1:s}if(n===0)return{depth:n,expanded:t,keptIndent:t,content:t};let l="",d="";for(;(t[a]===" "||t[a]==="	")&&s<r+4;){let c=ds(t[a],s);l+=" ".repeat(c),d+=s<r&&c>1?" ".repeat(c):t[a],s+=c,a++}let g=t.slice(a);return{depth:n,expanded:i+l+g,keptIndent:i+d+g,content:" ".repeat(Math.max(0,s-r))+g}}function ds(t,e){return t==="	"?4-e%4:1}function bn(t,e){let a="";for(let s=0;s<t.length;s++){if(t[s]==="`"){let n=e.inline.code.exec(t.slice(s));if(n){a+=n[0],s+=n[0].length-1;continue}}if(t[s]==="\\"&&(t[s+1]==="["||t[s+1]==="]")){a+=t[s+1],s++;continue}a+=t[s]}return a}function us(t,e,a,s,n){let r=e.href,i=e.title||null,l=bn(t[1],n),d=t[0].charAt(0)==="!",g=s.state.inLink,c=s.state.linkEmitted,u=s.state.inRawBlock;s.state.inLink=!0,s.state.linkEmitted=!1;let p=s.inlineTokens(l),o=s.state.linkEmitted;if(s.state.linkEmitted=c,s.state.inLink=g,!d){if(o){s.state.inRawBlock=u;return}s.state.linkEmitted=!0}return{type:d?"image":"link",raw:a,href:r,title:i,text:l,tokens:p}}function fn(t,e,a){let s=t.match(a.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(r=>{let i=r.match(a.other.beginningSpace);if(i===null)return r;let[l]=i;return r.slice(Math.min(l.length,n.length))}).join(`
`)}function ps(t,e,a,s){if(!e.includes("<"))return!1;for(let n=0;n<e.length;n++){if(e[n]==="\\"){n++;continue}if(e[n]==="`"){let l=s.inline.code.exec(e.slice(n));if(l){n+=l[0].length-1;continue}}if(e[n]!=="<")continue;let r=t.slice(a+n),i=s.inline.tag.exec(r)||s.inline.autolink.exec(r);if(i){if(i[0].length>e.length-n)return!0;n+=i[0].length-1}}return!1}var me=class{constructor(t){M(this,"options");M(this,"rules");M(this,"lexer");this.options=t||ke}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let a=this.options.pedantic?e[0]:os(e[0]),s=a.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:a,codeBlockStyle:"indented",text:s}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let a=e[0],s=fn(a,e[3]||"",this.rules);return e[3]!==void 0&&(s===""||s.endsWith(`
`))&&(s+=`
`),{type:"code",raw:a,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let a=e[2].trim();if(this.rules.other.endingHash.test(a)){let s=ie(a,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(a=s.trim())}return{type:"heading",raw:ie(e[0],`
`),depth:e[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:ie(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let a=ie(e[0],`
`).split(`
`),s="",n="",r=[];for(;a.length>0;){let i=!1,l=[],d;for(d=0;d<a.length;d++)if(this.rules.other.blockquoteStart.test(a[d]))l.push(a[d]),i=!0;else if(!i)l.push(a[d]);else break;a=a.slice(d);let g=l.join(`
`),c=(this.lexer.state.top&&!this.lexer.state.inBlockquote&&g.includes("	")?gn(l):g).replace(this.rules.other.blockquoteMarkerWhitespace,(v,y,w)=>w.startsWith(" ")?y+" "+w.slice(1):y+Fe(w,y.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${g}`:g,n=n?`${n}
${c}`:c;let u=this.lexer.state.top,p=this.lexer.state.inBlockquote;if(this.lexer.state.top=!0,this.lexer.state.inBlockquote=!0,this.lexer.blockTokens(c,r,!0),this.lexer.state.top=u,this.lexer.state.inBlockquote=p,a.length===0)break;let o=r.at(-1);if((o==null?void 0:o.type)==="code"||(o==null?void 0:o.type)==="heading"||(o==null?void 0:o.type)==="hr"||(o==null?void 0:o.type)==="html"||(o==null?void 0:o.type)==="table")break;if((o==null?void 0:o.type)==="blockquote"){let v=o,y=a.join(`
`),w=v.raw+`
`+y.replace(this.rules.other.blockquoteSetextReplace2,"");this.lexer.state.inBlockquote=!0;let E=this.blockquote(w);this.lexer.state.inBlockquote=p,r[r.length-1]=E;let T=w.substring(E.raw.length).replace(/^\n/,""),B=T?T.split(`
`).length:0,R=B?a.slice(0,-B):a;if(R.length>0&&(s=`${s}
${R.join(`
`)}`),n=n.substring(0,n.length-v.text.length)+E.text,a=a.slice(R.length),a.length>0&&this.rules.other.blockquoteStart.test(a[0]))continue;break}else if((o==null?void 0:o.type)==="list"){let v=o,y=v.raw+`
`+a.join(`
`),w=this.list(y);r[r.length-1]=w;let E=w.raw.length>v.raw.length?y.slice(v.raw.length+1,w.raw.length).split(`
`).length:0;if(E>0){let T=a.slice(0,E).join(`
`);s=`${s}
${T}`,n=`${n}
${T}`}if(a=a.slice(E),a.length>0&&!this.rules.other.blockquoteStart.test(a[0]))break;continue}}return{type:"blockquote",raw:s,tokens:r,text:n}}}list(t){var a;let e=this.rules.block.list.exec(t);if(e){if(!this.options.pedantic&&((a=this.lexer.state.lastToken)==null?void 0:a.type)==="text"&&!this.rules.other.listInterruptsParagraph.test(t))return;let s=t,n=()=>s.length-t.length,r=e[1].trim(),i=r.length>1,l={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let d=this.rules.other.listItemRegex(r),g=!1;for(;t;){let p=!1,o="";if(!(e=d.exec(t))||this.rules.block.hr.test(t))break;let v=n();t=t.substring(e[0].length);let y=e[2].split(`
`,1)[0],w=e[1].length,E=this.options.pedantic?Fe(y,w):y.replace(this.rules.other.leadingSpaceTab,le=>Fe(le,w)),T=t.split(`
`,1)[0],B=!E.trim(),R=0;if(this.options.pedantic?(R=2,o=E.trimStart()):B?R=w+1:(R=E.search(this.rules.other.nonSpaceChar),R=R>4?1:R,o=E.slice(R),R+=w),B&&this.rules.other.blankLine.test(T)&&(t=t.substring(T.length+1),p=!0),!p){let le=this.rules.other.nextBulletRegex(R),te=this.rules.other.hrRegex(R),O=this.rules.other.fencesBeginRegex(R),F=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(R):this.rules.other.headingBeginRegex(R),j=this.rules.other.htmlBeginRegex(R),W=this.rules.other.blockquoteBeginRegex(R),Z=!1;for(;t;){let se=t.split(`
`,1)[0],K;if(T=se,this.options.pedantic?(T=T.replace(this.rules.other.listReplaceNesting,"  "),K=T):K=T.replace(this.rules.other.leadingSpaceTab,P=>Fe(P)),O.test(T)||F.test(T)||j.test(T)||W.test(T)||le.test(T)||te.test(T))break;if(K.search(this.rules.other.nonSpaceChar)>=R||!T.trim())o+=`
`+K.slice(R),Z=!1;else{if(B)break;let P=E;if(!this.options.pedantic&&!o.includes(`
`)&&!E.includes("	")){let ae;for(;!te.test(P)&&(ae=this.rules.other.nestedBlockMarker.exec(P));)P=P.slice(ae[0].length);if(!P.trim())break}if(P.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||O.test(P)||F.test(P)||j.test(P)||te.test(P))break;if(!this.options.pedantic&&!Z){let ae=E.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(ae)||this.rules.block.heading.test(ae)||this.rules.block.hr.test(ae))break}let it=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(T)&&this.rules.block.lheading.test(`${E}
${T}`)?`    ${K.replace(/^ {0,3}/,"")}`:T;o+=`
`+it,Z=!0}B=!T.trim(),t=t.substring(se.length+1),E=K.slice(R)}}let ue=s.slice(v,n());l.loose||(g?l.loose=!0:this.rules.other.doubleBlankLine.test(ue)&&(g=!0)),l.items.push({type:"list_item",raw:ue,task:!!this.options.gfm&&this.rules.other.listIsTask.test(o),loose:!1,text:o,tokens:[]})}let c=l.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;l.raw=s.slice(0,n()).trimEnd();let u=[];for(let p of l.items)if(this.lexer.state.top=!1,u.push(this.lexer.inlineQueue.length),p.tokens=this.lexer.blockTokens(p.text,[]),!l.loose){let o=p.tokens.filter(y=>y.type==="space"),v=o.length>0&&o.some(y=>this.rules.other.anyLine.test(y.raw));l.loose=v}for(let p=0;p<l.items.length;p++){let o=l.items[p],v=o.tokens[0];if(o.task&&((v==null?void 0:v.type)==="text"||(v==null?void 0:v.type)==="paragraph")){o.text=o.text.replace(this.rules.other.listReplaceTask,""),v.raw=v.raw.replace(this.rules.other.listReplaceTask,""),v.text=v.text.replace(this.rules.other.listReplaceTask,"");let y=this.lexer.inlineQueue;for(let E=u[p];E<y.length;E++)if(y[E].tokens===v.tokens){y[E].src=y[E].src.replace(this.rules.other.listReplaceTask,"");break}let w=this.rules.other.listTaskCheckbox.exec(o.raw);if(w){let E={type:"checkbox",raw:w[0]+" ",checked:w[0]!=="[ ]"};o.checked=E.checked,l.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=E.raw+o.tokens[0].raw,o.tokens[0].text=E.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(E)):o.tokens.unshift({type:"paragraph",raw:E.raw,text:E.raw,tokens:[E]}):o.tokens.unshift(E)}}else o.task&&(o.task=!1)}if(l.loose)for(let p of l.items){p.loose=!0;for(let o of p.tokens)o.type==="text"&&(o.type="paragraph")}return l}}html(t){var a;let e=this.rules.block.html.exec(t);if(e){if(((a=this.lexer.state.lastToken)==null?void 0:a.type)==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(t))return;let s=os(e[0]);return{type:"html",block:!0,raw:s,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:s}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&cs(e[2],"()")!==-1)return;let a=Je(e[1]),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:a,raw:ie(e[0],`
`),href:s,title:n}}}table(t){var i;let e,a;if(this.options.gfm&&!this.options.pedantic){let l=this.rules.other.tableHeader.exec(t);if(!l||!this.rules.other.tableDelimiter.test(l[2])||(e=pt(l[1]),a=l[2].replace(this.rules.other.tableAlignChars,"").split("|"),e.length!==a.length))return}let s=this.rules.block.table.exec(t);if(!s||!this.rules.other.tableDelimiter.test(s[2]))return;e!=null||(e=pt(s[1])),a!=null||(a=s[2].replace(this.rules.other.tableAlignChars,"").split("|"));let n=(i=s[3])!=null&&i.trim()?s[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:ie(s[0],`
`),header:[],align:[],rows:[]};if(e.length===a.length){for(let l of a)this.rules.other.tableAlignRight.test(l)?r.align.push("right"):this.rules.other.tableAlignCenter.test(l)?r.align.push("center"):this.rules.other.tableAlignLeft.test(l)?r.align.push("left"):r.align.push(null);for(let l=0;l<e.length;l++)r.header.push({text:e[l],tokens:this.lexer.inline(e[l]),header:!0,align:r.align[l]});for(let l of n)r.rows.push(pt(l,r.header.length).map((d,g)=>({text:d,tokens:this.lexer.inline(d),header:!1,align:r.align[g]})));return r}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let a=e[1].trim();return{type:"heading",raw:ie(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:a,tokens:this.lexer.inline(a)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let a=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:a,tokens:this.lexer.inline(a)}}}text(t){let e=this.rules.block.text.exec(t);if(e){let a=e[0],s=e[0],n=this.rules.other.textIndentedContinuation.exec(t.slice(a.length));return n&&(a+=n[0],s+=n[0].replace(this.rules.other.codeRemoveIndent,"")),{type:"text",raw:a,text:s,tokens:this.lexer.inline(s)}}}escape(t){if(t.charCodeAt(0)!==92)return;let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=t.charCodeAt(0);if(e!==91&&e!==33)return;let a=this.rules.inline.link.exec(t);if(a){let s=a[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&ps(t,a[1],s,this.rules))return;let n=a[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let d=ie(n.slice(0,-1),"\\");if((n.length-d.length)%2===0)return}else{let d=cs(a[2],"()");if(d===-2)return;if(d>-1){let g=(a[0].indexOf("!")===0?5:4)+a[1].length+d;a[2]=a[2].substring(0,d),a[0]=a[0].substring(0,g).trim(),a[3]=""}}let r=ie(a[0].slice(0,-1),"\\");if((a[0].length-r.length)%2===0)return;let i=a[2],l="";if(this.options.pedantic){let d=this.rules.other.pedanticHrefTitle.exec(i);d&&(i=d[1],l=d[3])}else l=a[3]?a[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),us(a,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},a[0],this.lexer,this.rules)}}reflink(t,e){let a=t.charCodeAt(0);if(a!==91&&a!==33)return;let s;if((s=this.rules.inline.reflink.exec(t))||(s=this.rules.inline.nolink.exec(t))){let n=s[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&ps(t,s[1],n,this.rules))return;let r=e[Je(s[2]||s[1])];if(!r){let i=s[0].charAt(0);return{type:"text",raw:i,text:i}}return us(s,r,s[0],this.lexer,this.rules)}}emStrong(t,e,a=""){var p;let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4])return;let n=s[0][0],r=a===n,i=e.length-t.length,l=i;for(;!this.options.pedantic&&l>0&&e[l-1]===n;)l--;let d=(p=[...e.slice(Math.max(0,l-2),l)].at(-1))!=null?p:"",g=d==="*"||d==="_"||!!this.rules.inline.punctuation.exec(d);l<i&&(a=d);let c=l<i?g:a==="*"||a==="_"||!!this.rules.inline.punctuation.exec(a);if(s[4]&&a.match(this.rules.other.unicodeAlphaNumeric))return;let u=s[1]||s[3]||"";if(!u||!a||c){let o=[...s[0]].length-1,v,y,w=o,E=0,T=i-l+o,B=!this.options.pedantic&&!!d.trim()&&(!!u||n==="*"&&!g);if(n!=="*"&&n!=="_")return;let R=n==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,ue=Cs(this,e,n),le=e.length-t.length+o;if(ue<le)return;e=e.slice(-1*t.length+o);let te=ue-le;for(R.lastIndex=0;(s=R.exec(e))!==null&&!(s.index>te);){if(v=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!v)continue;if(y=[...v].length,s[3]||s[4]){w+=y;continue}else if((s[5]||s[6]||B)&&T%3&&!((T+y)%3)){if(r&&(s[5]||s[6]))break;E+=y;continue}if(w-=y,w>0)continue;y=Math.min(y,y+w+E);let O=[...s[0]][0].length,F=t.slice(0,o+s.index+O+y);if(Math.min(o,y)%2){let W=F.slice(1,-1);return{type:"em",raw:F,text:W,tokens:this.lexer.inlineTokens(W)}}let j=F.slice(2,-2);return{type:"strong",raw:F,text:j,tokens:this.lexer.inlineTokens(j)}}}}codespan(t){if(t.charCodeAt(0)!==96)return;let e=this.rules.inline.code.exec(t);if(e){let a=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return s&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:e[0],text:a}}}br(t){let e=t.charCodeAt(0);if(e!==32&&e!==92&&e!==10)return;let a=this.rules.inline.br.exec(t);if(a)return{type:"br",raw:a[0]}}del(t,e,a=""){if(t.charCodeAt(0)!==126)return;let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!a||this.rules.inline.punctuation.exec(a))){let n=[...s[0]].length-1,r,i,l=n,d=this.rules.inline.delRDelim,g=zs(this,e),c=e.length-t.length+n;if(g<c)return;e=e.slice(-1*t.length+n);let u=g-c;for(d.lastIndex=0;(s=d.exec(e))!==null&&!(s.index>u);){if(r=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!r||(i=[...r].length,i!==n))continue;if(s[3]||s[4]){l+=i;continue}if(l-=i,l>0)continue;i=Math.min(i,i+l);let p=[...s[0]][0].length,o=t.slice(0,n+s.index+p+i),v=o.slice(n,-n);return{type:"del",raw:o,text:v,tokens:this.lexer.inlineTokens(v)}}}}autolink(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.autolink.exec(t);if(e){let a,s;return e[2]==="@"?(a=e[1],s="mailto:"+a):(a=e[1],s=a),{type:"link",raw:e[0],text:a,href:s,autolink:!0,tokens:[{type:"text",raw:a,text:a}]}}}url(t){var a,s;let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=(s=(a=this.rules.inline._backpedal.exec(e[0]))==null?void 0:a[0])!=null?s:"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let a=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:a?e[0]:un(e[0]),escaped:a}}}},Q,Ps,ft,Is,Hs,be,V=(be=class{constructor(e){Xt(this,Q);M(this,"tokens");M(this,"options");M(this,"state");M(this,"inlineQueue");M(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ke,this.options.tokenizer=this.options.tokenizer||new me,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0,inBlockquote:!1};let a={other:z,block:Ue.normal,inline:Ce.normal};this.options.pedantic?(a.block=Ue.pedantic,a.inline=Ce.pedantic):this.options.gfm&&(a.block=Ue.gfm,this.options.breaks?a.inline=Ce.breaks:a.inline=Ce.gfm),this.tokenizer.rules=a}static get rules(){return{block:Ue,inline:Ce}}static lex(e,a){return new be(a).lex(e)}static lexInline(e,a){return new be(a).inlineTokens(e)}lex(e){e=e.replace(z.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let s=this.inlineQueue[a];this.state.inRawBlock=!1,this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,a=[],s=!1){var d,g,c;this.tokenizer.lexer=this;let n=this.state.lastToken;this.options.pedantic&&(e=e.replace(z.tabCharGlobal,"    ").replace(z.spaceLine,""));let r=1/0,i,l=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===me.prototype.paragraph;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}this.state.lastToken=a.at(-1);let u;if((g=(d=this.options.extensions)==null?void 0:d.block)!=null&&g.some(o=>(u=o.call({lexer:this},e,a))?(e=e.substring(u.raw.length),a.push(u),!0):!1))continue;if(u=this.tokenizer.space(e)){e=e.substring(u.raw.length);let o=a.at(-1);u.raw.length===1&&o!==void 0?o.raw+=`
`:a.push(u);continue}if(u=this.tokenizer.code(e)){e=e.substring(u.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.text,this.inlineQueue.at(-1).src=o.text):a.push(u);continue}if(u=this.tokenizer.fences(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.heading(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.hr(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.blockquote(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.list(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.html(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.def(e)){e=e.substring(u.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.raw,this.inlineQueue.at(-1).src=o.text):(this.tokens.links[u.tag]||(this.tokens.links[u.tag]={href:u.href,title:u.title}),a.push(u));continue}if(u=this.tokenizer.table(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.lheading(e)){e=e.substring(u.raw.length),a.push(u);continue}let p=e;if((c=this.options.extensions)!=null&&c.startBlock){let o=1/0,v=e.slice(1),y;this.options.extensions.startBlock.forEach(w=>{y=w.call({lexer:this},v),typeof y=="number"&&y>=0&&(o=Math.min(o,y))}),o<1/0&&o>=0&&(p=e.substring(0,o+1))}if(this.state.top&&(u=this.tokenizer.paragraph(p))){let o=a.at(-1);(s||o===i&&l)&&(o==null?void 0:o.type)==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text,i=o):(a.push(u),i=u),s=p.length!==e.length,e=e.substring(u.raw.length);continue}if(u=this.tokenizer.text(e)){e=e.substring(u.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):a.push(u);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=n,a}inline(e,a=[]){return this.inlineQueue.push({src:e,tokens:a}),a}linkInText(e){if(!e.includes("["))return!1;let a=this.tokenizer.rules.inline.link;for(let s of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(a.test(s[0])&&e.charAt(s.index-1)!=="!")return!0;for(let s of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let n=s[0],r=n.lastIndexOf("[");if(!(n.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,Je(n.slice(r+1,-1))))&&!(r>1&&this.linkInText(n.slice(1,r-1))))return!0}return!1}inlineTokens(e,a=[]){this.tokenizer.lexer=this;let s=this.state.linkParenPossible;this.state.linkParenPossible=e.includes(")");try{return xe(this,Q,Ps).call(this,e,a)}finally{this.state.linkParenPossible=s}}infiniteLoopError(e){let a="Infinite loop on byte: "+e;if(this.options.silent)console.error(a);else throw new Error(a)}},Q=new WeakSet,Ps=function(e,a){var r;let s=e.includes("*")||e.includes("_")||e.includes("~"),n=s||(r=this.options.hooks)!=null&&r.emStrongMask||this.tokenizer.emStrong!==me.prototype.emStrong||this.tokenizer.del!==me.prototype.del?xe(this,Q,Hs).call(this,e):e;if(!s)return xe(this,Q,ft).call(this,e,n,a);pn(this.tokenizer,n);try{return xe(this,Q,ft).call(this,e,n,a)}finally{hn(this.tokenizer)}},ft=function(e,a,s){var l,d,g;let n=!1,r="",i=1/0;for(;e;){if(e.length<i)i=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}n||(r=""),n=!1;let c;if((d=(l=this.options.extensions)==null?void 0:l.inline)!=null&&d.some(o=>(c=o.call({lexer:this},e,s))?(e=e.substring(c.raw.length),s.push(c),!0):!1))continue;if(c=this.tokenizer.escape(e)){e=e.substring(c.raw.length),s.push(c);continue}if(c=this.tokenizer.tag(e)){e=e.substring(c.raw.length),s.push(c);continue}if(c=this.tokenizer.link(e)){e=e.substring(c.raw.length),s.push(c);continue}if(c=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(c.raw.length);let o=s.at(-1);c.type==="text"&&(o==null?void 0:o.type)==="text"?(o.raw+=c.raw,o.text+=c.text):s.push(c);continue}let u=e[0];if(u==="*"||u==="_"){let o=a.length-e.length;if(Cs(this.tokenizer,a,u)<=o){let v=1;for(;v<e.length&&e.charCodeAt(v)===u.charCodeAt(0);)v++;let y=e.substring(0,v),w=s.at(-1);(w==null?void 0:w.type)==="text"&&!w.escaped?(w.raw+=y,w.text+=y):s.push({type:"text",raw:y,text:y,escaped:!1}),e=e.substring(v),r=u,n=!0;continue}}else if(u==="~"){let o=a.length-e.length;if(zs(this.tokenizer,a)<=o){let v=1;for(;v<e.length&&e.charCodeAt(v)===126;)v++;let y=e.substring(0,v),w=s.at(-1);(w==null?void 0:w.type)==="text"&&!w.escaped?(w.raw+=y,w.text+=y):s.push({type:"text",raw:y,text:y,escaped:!1}),e=e.substring(v),r=u,n=!0;continue}}if(c=this.tokenizer.emStrong(e,a,r)){e=e.substring(c.raw.length),s.push(c);continue}if(c=this.tokenizer.codespan(e)){e=e.substring(c.raw.length),s.push(c);continue}if(c=this.tokenizer.br(e)){e=e.substring(c.raw.length),s.push(c);continue}if(c=this.tokenizer.del(e,a,r)){e=e.substring(c.raw.length),s.push(c);continue}if(c=this.tokenizer.autolink(e)){e=e.substring(c.raw.length),s.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(e))){e=e.substring(c.raw.length),s.push(c);continue}let p=e;if((g=this.options.extensions)!=null&&g.startInline){let o=1/0,v=e.slice(1),y;this.options.extensions.startInline.forEach(w=>{y=w.call({lexer:this},v),typeof y=="number"&&y>=0&&(o=Math.min(o,y))}),o<1/0&&o>=0&&(p=e.substring(0,o+1))}if(c=this.tokenizer.inlineText(p)){e=e.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(r=c.raw.slice(-1)),n=!0;let o=s.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=c.raw,o.text+=c.text):s.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return s},Is=function(e){let{blockSkip:a,tag:s,autolink:n}=this.tokenizer.rules.inline,r="",i=0,l;for(a.lastIndex=0;l=a.exec(e);){let d=l.index+(l[2]?l[2].length:0),g=l.index+l[0].length;if(e.charAt(d)==="<"){let c=e.slice(d),u=s.exec(c)||n.exec(c);if(!u){a.lastIndex=d+1;continue}g=d+u[0].length,a.lastIndex=g}r+=e.slice(i,d)+"["+"a".repeat(g-d-2)+"]",i=g}return r+e.slice(i)},Hs=function(e){var s,n,r;let a=e;if(this.tokens.links&&e.includes("[")){let i=this.tokenizer.rules.inline.reflinkSearch,l=d=>{let g=d.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,Je(d.slice(g+1,-1))))return d;if(g>1&&d.charAt(0)!=="!"){let c=d.slice(1,g-1);if(this.linkInText(c))return"["+c.replace(i,l)+"]["+"a".repeat(d.length-g-2)+"]"}return"["+"a".repeat(d.length-2)+"]"};a=a.replace(i,l)}return a=a.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(i,l,d)=>d?"+".repeat(i.length):l?l+i.slice(l.length,-l.length).replace(/`/g,"+")+l:i),a=xe(this,Q,Is).call(this,a),a=(r=(n=(s=this.options.hooks)==null?void 0:s.emStrongMask)==null?void 0:n.call({lexer:this},a))!=null?r:a,a},be);function _s(t){return t.map(e=>e.type==="codespan"||e.type==="escape"?{...e,text:D(e.text,!0)}:"tokens"in e&&e.tokens?{...e,tokens:_s(e.tokens)}:e)}var et=class{constructor(t){M(this,"options");M(this,"parser");this.options=t||ke}space(t){return""}code({text:t,lang:e,escaped:a}){var r;let s=(r=(e||"").match(z.notSpaceStart))==null?void 0:r[0],n=t?t.replace(z.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+D(s)+'">'+(a?n:D(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:D(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,a=t.start,s="";for(let i=0;i<t.items.length;i++){let l=t.items[i];s+=this.listitem(l)}let n=e?"ol":"ul",r=e&&a!==1?' start="'+a+'"':"";return"<"+n+r+`>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${D(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:a,tokens:s,autolink:n}){let r=n?D(a,!0):this.parser.parseInline(s),i=ls(t);if(i===null)return r;t=D(i,n);let l='<a href="'+t+'"';return e&&(l+=' title="'+D(e)+'"'),l+=">"+r+"</a>",l}image({href:t,title:e,text:a,tokens:s}){s&&(a=this.parser.parseInline(_s(s),this.parser.textRenderer));let n=ls(t);if(n===null)return D(a);t=n;let r=`<img src="${D(t)}" alt="${D(a)}"`;return e&&(r+=` title="${D(e)}"`),r+=">",r}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:D(t.text)}},At=class{constructor(){M(this,"parser")}strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return`
`}checkbox({raw:t}){return t}},G=class vt{constructor(e){M(this,"options");M(this,"renderer");M(this,"textRenderer");this.options=e||ke,this.options.renderer=this.options.renderer||new et,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new At,this.textRenderer.parser=this}static parse(e,a){return new vt(a).parse(e)}static parseInline(e,a){return new vt(a).parseInline(e)}parse(e){var s;this.renderer.parser=this;let a="";for(let n=0;n<e.length;n++){let r=e[n],i=(s=this.options.extensions)==null?void 0:s.renderers;if(i&&Object.hasOwn(i,r.type)&&i[r.type]){let d=r,g=i[d.type].call({parser:this},d);if(g!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(d.type)){a+=g===!1?"":g!=null?g:"";continue}}let l=r;switch(l.type){case"space":{a+=this.renderer.space(l);break}case"hr":{a+=this.renderer.hr(l);break}case"heading":{a+=this.renderer.heading(l);break}case"code":{a+=this.renderer.code(l);break}case"table":{a+=this.renderer.table(l);break}case"blockquote":{a+=this.renderer.blockquote(l);break}case"list":{a+=this.renderer.list(l);break}case"checkbox":{a+=this.renderer.checkbox(l);break}case"html":{a+=this.renderer.html(l);break}case"def":{a+=this.renderer.def(l);break}case"paragraph":{a+=this.renderer.paragraph(l);break}case"text":{a+=this.renderer.text(l);break}default:{let d='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(d),"";throw new Error(d)}}}return a}parseInline(e,a=this.renderer){var n;this.renderer.parser=this;let s="";for(let r=0;r<e.length;r++){let i=e[r],l=(n=this.options.extensions)==null?void 0:n.renderers;if(l&&Object.hasOwn(l,i.type)&&l[i.type]){let g=l[i.type].call({parser:this},i);if(g!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){s+=g===!1?"":g!=null?g:"";continue}}let d=i;switch(d.type){case"escape":{s+=a.text(d);break}case"html":{s+=a.html(d);break}case"link":{s+=a.link(d);break}case"image":{s+=a.image(d);break}case"checkbox":{s+=a.checkbox(d);break}case"strong":{s+=a.strong(d);break}case"em":{s+=a.em(d);break}case"codespan":{s+=a.codespan(d);break}case"br":{s+=a.br(d);break}case"del":{s+=a.del(d);break}case"text":{s+=a.text(d);break}default:{let g='Token with "'+d.type+'" type was not found.';if(this.options.silent)return console.error(g),"";throw new Error(g)}}}return s}},Ge,Ie=(Ge=class{constructor(t){M(this,"options");M(this,"block");this.options=t||ke}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?V.lex:V.lexInline}provideParser(t=this.block){return t?G.parse:G.parseInline}},M(Ge,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),M(Ge,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),Ge);function oe(t,e){if(Array.isArray(e))for(let a=0;a<e.length;a++)t.push(e[a]);else t.push(e)}var vn=class{constructor(...t){M(this,"defaults",$t());M(this,"options",this.setOptions);M(this,"parse",this.parseMarkdown(!0));M(this,"parseInline",this.parseMarkdown(!1));M(this,"Parser",G);M(this,"Renderer",et);M(this,"TextRenderer",At);M(this,"Lexer",V);M(this,"Tokenizer",me);M(this,"Hooks",Ie);this.use(...t)}walkTokens(t,e){var s,n;let a=[];for(let r of t)switch(oe(a,e.call(this,r)),r.type){case"table":{let i=r;for(let l of i.header)oe(a,this.walkTokens(l.tokens,e));for(let l of i.rows)for(let d of l)oe(a,this.walkTokens(d.tokens,e));break}case"list":{let i=r;oe(a,this.walkTokens(i.items,e));break}default:{let i=r;(n=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&n[i.type]?this.defaults.extensions.childTokens[i.type].forEach(l=>{if(i[l]){let d=i[l].flat(1/0);oe(a,this.walkTokens(d,e))}}):i.tokens&&oe(a,this.walkTokens(i.tokens,e))}}return a}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(a=>{let s={...a};if(s.async=this.defaults.async||s.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let r=e.renderers[n.name];r?e.renderers[n.name]=function(...i){let l=n.renderer.apply(this,i);return l===!1&&(l=r.apply(this,i)),l}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=e[n.level];r?r.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),a.renderer){let n=this.defaults.renderer||new et(this.defaults);for(let r in a.renderer){if(!(r in n))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;let i=r,l=a.renderer[i],d=n[i];n[i]=(...g)=>{let c=l.apply(n,g);return c===!1&&(c=d.apply(n,g)),c===!1?"":c!=null?c:""}}s.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new me(this.defaults);for(let r in a.tokenizer){if(!(r in n))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let i=r,l=a.tokenizer[i],d=n[i];n[i]=(...g)=>{let c=l.apply(n,g);return c===!1&&(c=d.apply(n,g)),c}}s.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new Ie;for(let r in a.hooks){if(!(r in n))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;let i=r,l=a.hooks[i],d=n[i];Ie.passThroughHooks.has(r)?n[i]=g=>{if(n.options.async&&Ie.passThroughHooksRespectAsync.has(r))return(async()=>{let u=await l.call(n,g);return d.call(n,u)})();let c=l.call(n,g);return d.call(n,c)}:n[i]=(...g)=>{if(n.options.async)return(async()=>{let u=await l.apply(n,g);return u===!1&&(u=await d.apply(n,g)),u})();let c=l.apply(n,g);return c===!1&&(c=d.apply(n,g)),c}}s.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,r=a.walkTokens;s.walkTokens=function(i){let l=[];return oe(l,r.call(this,i)),n&&oe(l,n.call(this,i)),l}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return V.lex(t,e!=null?e:this.defaults)}parser(t,e){return G.parse(t,e!=null?e:this.defaults)}parseMarkdown(t){return(e,a)=>{let s={...a},n={...this.defaults,...s},r=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return r(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(e):e,l=await(n.hooks?await n.hooks.provideLexer(t):t?V.lex:V.lexInline)(i,n),d=n.hooks?await n.hooks.processAllTokens(l):l;n.walkTokens&&await Promise.all(this.walkTokens(d,n.walkTokens));let g=await(n.hooks?await n.hooks.provideParser(t):t?G.parse:G.parseInline)(d,n);return n.hooks?await n.hooks.postprocess(g):g})().catch(r);try{n.hooks&&(e=n.hooks.preprocess(e));let i=(n.hooks?n.hooks.provideLexer(t):t?V.lex:V.lexInline)(e,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let l=(n.hooks?n.hooks.provideParser(t):t?G.parse:G.parseInline)(i,n);return n.hooks&&(l=n.hooks.postprocess(l)),l}catch(i){return r(i)}}}onError(t,e){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+D(a.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(a);throw a}}},fe=new vn;function A(t,e){return fe.parse(t,e)}A.options=A.setOptions=function(t){return fe.setOptions(t),A.defaults=fe.defaults,$s(A.defaults),A};A.getDefaults=$t;A.defaults=ke;function kn(...t){return fe.use(...t),A.defaults=fe.defaults,$s(A.defaults),A}A.use=kn;A.walkTokens=function(t,e){return fe.walkTokens(t,e)};A.parseInline=fe.parseInline;A.Parser=G;A.parser=G.parse;A.Renderer=et;A.TextRenderer=At;A.Lexer=V;A.lexer=V.lex;A.Tokenizer=me;A.Hooks=Ie;A.parse=A;A.options;A.setOptions;A.walkTokens;A.parseInline;G.parse;V.lex;A.setOptions({gfm:!0,breaks:!0});function Rt(t){if(!t)return"";const e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;");return A.parse(e,{async:!1}).replace(/<a href="(https?:\/\/[^"]+)"/g,'<a href="$1" target="_blank" rel="noopener noreferrer"')}async function yn(t,e){var d,g,c;const a=Number(e.params.id);t.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const s=await S.post(a);t.innerHTML=`<div class="page narrow">
    <a class="back-link" href="#/posts">${b("back",14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${s.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
          <a class="pill" href="#/posts?category=${encodeURIComponent(s.category)}">${m(s.category)}</a>
          ${s.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${s.visibility==="private"?"仅自己可见":"不公开列出"}</span>`:""}
        </div>
        <h1 class="article-title">${m(s.title||"无标题")}</h1>
        <div class="article-meta">
          ${re(s.author.avatar,s.author.nickname,34,s.author.uin)}
          <div class="article-meta-text">
            <b>${m(s.author.nickname)}</b>
            <span>${ts(s.at)} · ${s.readingTime} 分钟阅读 · ${s.views} 次浏览</span>
          </div>
          ${s.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${s.id}">${b("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${b("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${s.cover&&!((d=s.content)!=null?d:"").includes(s.cover)?`<figure class="article-cover"><img src="${m(s.cover)}" alt="" data-zoom="${m(s.cover)}"></figure>`:""}

      <div class="article-body markdown">${Rt((g=s.content)!=null?g:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${s.liked?"active":""}" id="like-btn">
          ${b("heart",16)}<span>${s.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${s.likes.length?`${s.likes.slice(0,8).map(u=>m(u.nickname)).join("、")} 觉得不错`:`写于 ${ts(s.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${s.commentNum}</span></h2>
      <div id="comment-area">${ss(s.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,st(t);const n=t.querySelector("#like-btn");n.addEventListener("click",async()=>{try{const u=await S.likePost(s.id);n.classList.toggle("active",u.liked),n.querySelector("span").textContent=String(u.count||"赞")}catch(u){$(u.message,"err")}}),(c=t.querySelector("#del-post"))==null||c.addEventListener("click",async()=>{if(await Ke("删除文章",`《${s.title}》删除后无法恢复，确定吗？`))try{await S.deletePost(s.id),$("已删除","ok"),location.hash="#/posts"}catch(u){$(u.message,"err")}});let r="";const i=t.querySelector("#reply-hint"),l=t.querySelector("#comment-area");l.addEventListener("click",async u=>{var y,w;const p=u.target,o=p.closest("[data-reply]");if(o){r=(y=o.dataset.reply)!=null?y:"",i.textContent=`回复 ${r}`,t.querySelector("#comment-form textarea").focus();return}const v=p.closest("[data-del-comment]");if(v){if(!await Ke("删除评论","确定删除这条评论吗？"))return;try{await S.deleteComment(s.id,Number(v.dataset.delComment)),(w=v.closest(".comment"))==null||w.remove(),$("已删除","ok")}catch(E){$(E.message,"err")}}}),t.querySelector("#comment-form").addEventListener("submit",async u=>{u.preventDefault();const o=u.currentTarget.querySelector("textarea"),v=o.value.trim();if(v)try{const y=await S.commentPost(s.id,v,r);s.comments.push(y),l.innerHTML=ss(s.comments),o.value="",r="",i.textContent="",$("评论已发布","ok")}catch(y){$(y.message,"err")}})}const hs=2560,$n=3*1024*1024;function wn(t){return"createImageBitmap"in window?createImageBitmap(t).catch(()=>gs(t)):gs(t)}function gs(t){return new Promise((e,a)=>{const s=URL.createObjectURL(t),n=new Image;n.onload=()=>{URL.revokeObjectURL(s),e(n)},n.onerror=()=>{URL.revokeObjectURL(s),a(new Error("图片解码失败，可能是不支持的格式"))},n.src=s})}function ht(t,e,a){return new Promise((s,n)=>{t.toBlob(r=>r?s(r):n(new Error("图片压缩失败")),e,a)})}async function kt(t,e=$n){const a={file:t,width:0,height:0,size:t.size,compressed:!1,originalSize:t.size};if(t.type==="image/gif"||t.type==="image/svg+xml")return a;const s=await wn(t),n="width"in s?s.width:0,r="height"in s?s.height:0;if(!n||!r||(a.width=n,a.height=r,t.size<=2*1024*1024&&Math.max(n,r)<=hs))return a;const i=Math.min(1,hs/Math.max(n,r));let l=Math.round(n*i),d=Math.round(r*i);const g=document.createElement("canvas");g.width=l,g.height=d;const c=g.getContext("2d");if(!c)return a;c.imageSmoothingQuality="high",c.drawImage(s,0,0,l,d),"close"in s&&typeof s.close=="function"&&s.close();const u="image/webp";let p=.9,o=await ht(g,u,p),v=0;for(;o.size>e&&v<4;)p=Math.max(.6,p-.1),o=await ht(g,u,p),o.size>e&&v===3&&(l=Math.round(l*.8),d=Math.round(d*.8),g.width=l,g.height=d,c.drawImage(s,0,0,l,d),o=await ht(g,u,p)),v++;const y=t.name.replace(/\.[^.]+$/,"")+".webp",w=new File([o],y,{type:u});return{file:w,width:l,height:d,size:w.size,compressed:!0,originalSize:t.size}}function We(t){return t>=1024*1024?`${(t/1024/1024).toFixed(1)}MB`:`${Math.round(t/1024)}KB`}const xn=["随笔","城市","旅行","技术","阅读","生活"],Ze="`".repeat(3),ms=30;let Ve=null;const Ds="qz.editor.mode",gt="qz.editor.split";async function bs(t,e){var Nt,Ut,Ft,Zt,Vt,Gt,Qt;const a=e.params.id?Number(e.params.id):0;let s=null;if(a&&(s=await S.post(a),!s.canEdit)){t.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}Ve==null||Ve();const n=new AbortController;Ve=()=>n.abort();let r=(Nt=s==null?void 0:s.cover)!=null?Nt:"",i=(Ut=s==null?void 0:s.images)!=null?Ut:[];const l=`qz.draft.${a||"new"}`;let d=Sn(),g=Number(localStorage.getItem(gt))||50;document.body.classList.add("writer-mode"),t.innerHTML=`<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${a?`#/post/${a}`:"#/home"}" title="返回">${b("back",16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${m((Ft=s==null?void 0:s.title)!=null?Ft:"")}" autocomplete="off">
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

    <div class="wr-body" id="body" data-mode="${d}" style="--split:${g}%">
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

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${m((Zt=s==null?void 0:s.content)!=null?Zt:"")}</textarea>
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
              ${r?`<img src="${m(r)}" alt="">`:"<span>点击上传封面</span>"}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${m((Vt=s==null?void 0:s.category)!=null?Vt:"随笔")}">
              <datalist id="cat-list">${xn.map(h=>`<option value="${h}">`).join("")}</datalist>
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
              ${i.map(h=>`<img src="${m(h)}" alt="" data-zoom="${m(h)}">`).join("")||'<span class="muted">还没有配图</span>'}
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
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${ms}MB 内图片自动压缩</span>
    </footer>

    <div class="wr-help" id="help" hidden>
      <div class="wr-help-card">
        <div class="wr-help-head">
          <b>快捷键</b>
          <button class="wr-ibtn" id="help-close">${b("close",14)}</button>
        </div>
        <div class="wr-help-grid">
          ${[["Ctrl + B / I","加粗 / 斜体"],["Ctrl + E","行内代码"],["Ctrl + K","插入链接"],["Ctrl + 1 / 2 / 3","一 / 二 / 三级标题"],["Ctrl + Shift + C","代码块"],["Ctrl + Shift + 8 / 7","无序 / 有序列表"],["Ctrl + Shift + Q","引用"],["Ctrl + Shift + E / S / V","编辑 / 分屏 / 预览"],["Ctrl + S","保存"],["Tab / Shift + Tab","整行缩进 / 反缩进"],["Ctrl + V","粘贴截图直接插图"],["Ctrl + /","打开本面板"]].map(([h,f])=>`<div class="k"><kbd>${h}</kbd><span>${f}</span></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;const c=h=>t.querySelector(h),u=c("#title"),p=c("#content"),o=c("#preview"),v=c("#body"),y=c("#splitter"),w=c("#pv-scroll"),E=c("#thumbs"),T=c("#save-state"),B=c("#stat-words"),R=c("#stat-read"),ue=c("#stat-cursor"),le=c("#pv-meta"),te=c("#draft-bar"),O=c("#outline"),F=c("#outline-list"),j=c("#side"),W=c("#help"),Z=h=>{d=h,v.dataset.mode=h,localStorage.setItem(Ds,h),t.querySelectorAll("#mode-switch button").forEach(f=>{f.classList.toggle("active",f.dataset.mode===h)}),c("#btn-eye").classList.toggle("on",h==="preview"),h==="preview"?Be(!0):p.focus()};t.querySelectorAll("#mode-switch button").forEach(h=>{h.addEventListener("click",()=>Z(h.dataset.mode))}),c("#btn-eye").addEventListener("click",()=>Z(d==="edit"?"preview":"edit"));const se=(h,f)=>{h.dataset.open=String(f),h===O&&c("#btn-outline").classList.toggle("on",f),h===j&&c("#btn-side").classList.toggle("on",f)};c("#btn-outline").addEventListener("click",()=>se(O,O.dataset.open!=="true")),c("#btn-side").addEventListener("click",()=>se(j,j.dataset.open!=="true")),t.querySelectorAll("[data-close]").forEach(h=>{h.addEventListener("click",()=>se(h.dataset.close==="side"?j:O,!1))});const K=c("#wr"),P=c("#btn-full"),it=()=>{var h;document.fullscreenElement?document.exitFullscreen():(h=K.requestFullscreen)==null||h.call(K).catch(()=>$("当前环境不支持全屏","err"))};P.addEventListener("click",it),document.addEventListener("fullscreenchange",()=>{const h=!!document.fullscreenElement;P.innerHTML=b(h?"compress":"expand",15),P.classList.toggle("on",h),P.title=h?"退出全屏":"全屏写作"},{signal:n.signal});let ae=0;function Be(h=!1){window.clearTimeout(ae);const f=()=>{const k=p.value;o.innerHTML=k.trim()?Rt(k):'<p class="muted">预览会显示在这里</p>';const x=o.querySelectorAll("h1,h2,h3,h4,p,li,pre,blockquote,table").length;le.textContent=`${x} 个段落`};h?f():ae=window.setTimeout(f,140)}function Pt(){var q,C;const h=p.value,f=((q=h.match(/[\u3400-\u9fa5]/g))!=null?q:[]).length,k=((C=h.replace(/[\u3400-\u9fa5]/g," ").match(/[A-Za-z0-9_]+/g))!=null?C:[]).length,x=f+k;B.textContent=`${x.toLocaleString()} 字`,R.textContent=`约 ${Math.max(1,Math.round(x/400))} 分钟`}function ye(){const h=p.selectionStart,f=p.value.slice(0,h),k=f.split(`
`).length,x=h-(f.lastIndexOf(`
`)+1)+1;ue.textContent=`第 ${k} 行 · 第 ${x} 列`}let It=0;function Ht(){window.clearTimeout(It),It=window.setTimeout(()=>{const h=Ln(p.value);if(!h.length){F.innerHTML='<p class="muted">标题会出现在这里</p>';return}F.innerHTML=h.map((f,k)=>`<button class="ol-item lv${f.level}" data-i="${k}"><span>${m(f.text)}</span></button>`).join(""),F.querySelectorAll(".ol-item").forEach(f=>{f.addEventListener("click",()=>{const k=h[Number(f.dataset.i)];k&&Ns(k.offset),window.innerWidth<1e3&&se(O,!1)})})},260)}function Ns(h){const f=getComputedStyle(p),k=parseFloat(f.paddingLeft)+parseFloat(f.paddingRight),x=document.createElement("div");x.style.cssText=["position:absolute","visibility:hidden","top:0","left:0",`width:${Math.max(80,p.clientWidth-k)}px`,`font:${f.font}`,`line-height:${f.lineHeight}`,`letter-spacing:${f.letterSpacing}`,"white-space:pre-wrap","overflow-wrap:break-word","word-break:break-word"].join(";");const q=p.value.lastIndexOf(`
`,h-1)+1;x.textContent=p.value.slice(0,q),document.body.appendChild(x);const C=x.getBoundingClientRect().height;x.remove(),p.scrollTop=Math.max(0,C-8),p.focus(),p.setSelectionRange(h,h),ye()}const Us=()=>{try{const h=localStorage.getItem(l);return h?JSON.parse(h):null}catch{return null}},Fs=()=>({title:u.value,content:p.value,category:c("#category").value,visibility:c("#visibility").value,pinned:c("#pinned").checked,cover:r,savedAt:Date.now()});let _t=0;const Oe=()=>{window.clearTimeout(_t),T.textContent="未保存",T.classList.add("dirty"),_t=window.setTimeout(()=>{localStorage.setItem(l,JSON.stringify(Fs()));const h=new Date;T.textContent=`已存草稿 ${String(h.getHours()).padStart(2,"0")}:${String(h.getMinutes()).padStart(2,"0")}`,T.classList.remove("dirty")},1200)},X=Us();if(X&&(X.content!==((Gt=s==null?void 0:s.content)!=null?Gt:"")||X.title!==((Qt=s==null?void 0:s.title)!=null?Qt:""))){const h=new Date(X.savedAt);c("#draft-text").textContent=`发现 ${h.getMonth()+1} 月 ${h.getDate()} 日 ${String(h.getHours()).padStart(2,"0")}:${String(h.getMinutes()).padStart(2,"0")} 的草稿`,te.hidden=!1,c("#draft-restore").addEventListener("click",()=>{u.value=X.title,p.value=X.content,c("#category").value=X.category||"随笔",c("#visibility").value=X.visibility||"public",c("#pinned").checked=!!X.pinned,r=X.cover||r,r&&Ot(r),te.hidden=!0,rt(),Be(!0),$("已恢复草稿","ok")}),c("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(l),te.hidden=!0})}const rt=()=>{Pt(),ye(),Be(),Ht(),Oe()},$e=(h,f,k,x,q)=>{p.focus(),p.setSelectionRange(h,f);let C=!1;try{C=document.execCommand("insertText",!1,k)}catch{C=!1}C||p.setRangeText(k,h,f,"end"),p.setSelectionRange(x,q),rt()},Me=(h,f=0,k=0)=>{const x=p.selectionStart,q=p.selectionEnd;$e(x,q,h,x+f,x+(k||h.length))},je=(h,f,k)=>{const x=p.selectionStart,q=p.selectionEnd,C=p.value.slice(x,q)||k;$e(x,q,h+C+f,x+h.length,x+h.length+C.length)},Dt=()=>{const h=p.selectionStart,f=p.selectionEnd,k=p.value.lastIndexOf(`
`,Math.max(0,h-1))+1,x=p.value.indexOf(`
`,f),q=x===-1?p.value.length:x;return{lineStart:k,lineEnd:q}},pe=(h,f)=>{const{lineStart:k,lineEnd:x}=Dt(),C=(p.value.slice(k,x)||f).split(`
`),Y=C.every(H=>H.startsWith(h)),ne=C.map(H=>Y?H.slice(h.length):h+H.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/,"")).join(`
`);$e(k,x,ne,k,k+ne.length)},N={h1:()=>pe("# ","一级标题"),h2:()=>pe("## ","二级标题"),h3:()=>pe("### ","三级标题"),bold:()=>je("**","**","加粗文字"),italic:()=>je("*","*","斜体文字"),strike:()=>je("~~","~~","删除线"),code:()=>je("`","`","code"),quote:()=>pe("> ","引用一段话"),ul:()=>pe("- ","列表项"),ol:()=>pe("1. ","列表项"),task:()=>pe("- [ ] ","待办事项"),codeblock:()=>Me(`
${Ze}
// code
${Ze}
`,Ze.length+2,Ze.length+9),hr:()=>Me(`
---
`),link:()=>{const h=p.value.slice(p.selectionStart,p.selectionEnd);Me(`[${h||"链接文字"}](https://)`,h?h.length+3:1,h?h.length+11:5)},table:()=>Me(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};c("#toolbar").addEventListener("click",h=>{var k,x;const f=h.target.closest("[data-cmd]");f&&(h.preventDefault(),(x=N[(k=f.dataset.cmd)!=null?k:""])==null||x.call(N))});const Zs=/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/,Vs=()=>{const h=p.selectionStart;if(h!==p.selectionEnd)return!1;const f=p.value.lastIndexOf(`
`,h-1)+1,k=p.value.slice(f,h),x=k.match(Zs);if(!x)return!1;const[,q,C,Y]=x;if(!k.slice(x[0].length).trim())return $e(f,h,"",f,f),!0;let H=`
`+q;return/^\d+\.$/.test(C)?H+=`${parseInt(C,10)+1}. `:H+=C+" ",Y&&(H+="[ ] "),$e(h,h,H,h+H.length,h+H.length),!0},Gs=h=>{var Wt;const{lineStart:f,lineEnd:k}=Dt(),q=p.value.slice(f,k).split(`
`),C=q.map(Ae=>h?Ae.replace(/^ {1,2}|^\t/,""):"  "+Ae).join(`
`),Y=p.selectionStart===p.selectionEnd;let ne=f,H=f+C.length;if(Y){const Ae=p.selectionStart-f,Qs=((Wt=q[0].match(/^ {1,2}|^\t/))!=null?Wt:[""])[0].length,Ws=h?Math.max(0,Ae-Qs):Ae+2;ne=f+Ws,H=ne}$e(f,k,C,ne,H)};p.addEventListener("keydown",h=>{const f=h.metaKey||h.ctrlKey,k=h.key.toLowerCase();if(h.key==="Tab"){h.preventDefault(),Gs(h.shiftKey);return}if(!f&&h.key==="Enter"&&!h.altKey&&!h.isComposing&&Vs()){h.preventDefault();return}if(f){if(h.shiftKey){k==="c"?(h.preventDefault(),N.codeblock()):h.key==="8"||h.key==="*"?(h.preventDefault(),N.ul()):h.key==="7"||h.key==="&"?(h.preventDefault(),N.ol()):k==="q"?(h.preventDefault(),N.quote()):k==="e"?(h.preventDefault(),Z("edit")):k==="s"?(h.preventDefault(),Z("split")):k==="v"&&(h.preventDefault(),Z("preview"));return}k==="b"?(h.preventDefault(),N.bold()):k==="i"?(h.preventDefault(),N.italic()):k==="k"?(h.preventDefault(),N.link()):k==="e"?(h.preventDefault(),N.code()):k==="s"?(h.preventDefault(),jt()):k==="1"||k==="2"||k==="3"?(h.preventDefault(),N[`h${k}`]()):k==="/"&&(h.preventDefault(),qe())}}),p.addEventListener("keyup",ye),p.addEventListener("click",ye),p.addEventListener("select",ye),p.addEventListener("input",rt);let lt=!1;const Bt=(h,f)=>{if(d!=="split"||lt)return;lt=!0;const k=h.scrollHeight-h.clientHeight,x=k>0?h.scrollTop/k:0;f.scrollTop=x*(f.scrollHeight-f.clientHeight),requestAnimationFrame(()=>{lt=!1})};p.addEventListener("scroll",()=>Bt(p,w),{passive:!0}),w.addEventListener("scroll",()=>Bt(w,p),{passive:!0}),y.addEventListener("pointerdown",h=>{d!=="split"&&Z("split"),h.preventDefault(),y.setPointerCapture(h.pointerId),y.classList.add("dragging"),document.body.classList.add("wr-resizing");const f=x=>{const q=v.getBoundingClientRect(),C=(x.clientX-q.left)/q.width*100,Y=Math.min(78,Math.max(22,C));g=Y,v.style.setProperty("--split",`${Y}%`)},k=()=>{y.classList.remove("dragging"),document.body.classList.remove("wr-resizing"),localStorage.setItem(gt,String(Math.round(g))),y.removeEventListener("pointermove",f),y.removeEventListener("pointerup",k),y.removeEventListener("pointercancel",k)};y.addEventListener("pointermove",f),y.addEventListener("pointerup",k),y.addEventListener("pointercancel",k)}),y.addEventListener("dblclick",()=>{g=50,v.style.setProperty("--split","50%"),localStorage.setItem(gt,"50")});const ot=new Set,ct=async(h,f="图片")=>{for(const k of h){if(!k.type.startsWith("image/")){$("只能插入图片文件","err");continue}const x=`${k.name}-${k.size}`;if(!ot.has(x)){ot.add(x);try{$(`正在处理 ${k.name||f}…`);const q=await kt(k);if(q.size>ms*1024*1024)throw new Error(`压缩后仍有 ${We(q.size)}，超过上限`);const{url:C}=await S.upload(q.file);i.push(C);const Y=(k.name||f).replace(/\.[^.]+$/,"")||f;Me(`
![${Y}](${C})
`),E.innerHTML=i.map(ne=>`<img src="${m(ne)}" alt="">`).join(""),$(q.compressed?`已压缩 ${We(q.originalSize)} → ${We(q.size)}`:"图片已插入","ok")}catch(q){$(q.message,"err")}finally{ot.delete(x)}}}};p.addEventListener("paste",h=>{const f=h.clipboardData;if(!f)return;const k=Array.from(f.items).filter(x=>x.kind==="file"&&x.type.startsWith("image/")).map(x=>x.getAsFile()).filter(x=>!!x);k.length&&(h.preventDefault(),ct(k,"粘贴的图片"))});const we=c("#pane-edit");we.addEventListener("dragover",h=>{var f;(f=h.dataTransfer)!=null&&f.types.includes("Files")&&(h.preventDefault(),we.classList.add("dropping"))}),we.addEventListener("dragleave",()=>we.classList.remove("dropping")),we.addEventListener("drop",h=>{var k,x;const f=Array.from((x=(k=h.dataTransfer)==null?void 0:k.files)!=null?x:[]).filter(q=>q.type.startsWith("image/"));f.length&&(h.preventDefault(),we.classList.remove("dropping"),ct(f))}),c("#img-input").addEventListener("change",async h=>{var x;const f=h.target,k=Array.from((x=f.files)!=null?x:[]);k.length&&await ct(k),f.value=""});const Ne=c("#cover-slot"),dt=c("#cover-input"),Ot=h=>{var f,k;(f=Ne.querySelector("img"))==null||f.remove(),(k=Ne.querySelector("span"))==null||k.remove(),Ne.insertAdjacentHTML("afterbegin",h?`<img src="${m(h)}" alt="">`:"<span>点击上传封面</span>")};Ne.addEventListener("click",()=>dt.click()),dt.addEventListener("change",async()=>{var f;const h=(f=dt.files)==null?void 0:f[0];if(h)try{const k=await kt(h),{url:x}=await S.upload(k.file);r=x,Ot(x),Oe(),$("封面已更新","ok")}catch(k){$(k.message,"err")}});function qe(h){const f=h!=null?h:W.hidden;W.hidden=!f}c("#btn-help").addEventListener("click",()=>qe()),c("#help-close").addEventListener("click",()=>qe(!1)),W.addEventListener("click",h=>{h.target===W&&qe(!1)}),document.addEventListener("keydown",h=>{h.key==="Escape"&&(W.hidden?O.dataset.open==="true"?se(O,!1):j.dataset.open==="true"&&se(j,!1):qe(!1))},{signal:n.signal}),u.addEventListener("input",Oe),t.querySelectorAll("#category,#visibility,#pinned").forEach(h=>h.addEventListener("change",Oe));const jt=async()=>{const h={title:u.value.trim(),content:p.value,cover:r,category:c("#category").value.trim()||"随笔",visibility:c("#visibility").value,pinned:c("#pinned").checked,images:i};if(!h.title&&!h.content.trim()){$("写个标题或正文再发布","err");return}const f=c("#save-btn");f.disabled=!0,f.textContent="保存中…";try{const k=a?await S.updatePost(a,h):await S.createPost(h);localStorage.removeItem(l),$(a?"已保存":"已发布","ok"),location.hash=`#/post/${k.id}`}catch(k){$(k.message,"err"),f.disabled=!1,f.innerHTML=`${b("check",13)} ${a?"保存修改":"发布"}`}};c("#save-btn").addEventListener("click",()=>void jt()),window.addEventListener("beforeunload",h=>{T.classList.contains("dirty")&&p.value.trim()&&(h.preventDefault(),h.returnValue="")},{signal:n.signal}),Pt(),ye(),Ht(),Be(!0),Z(d),u.addEventListener("keydown",h=>{h.key==="Enter"&&(h.preventDefault(),p.focus(),p.setSelectionRange(0,0))}),window.innerWidth<1e3&&!(s!=null&&s.title)?u.focus():(p.focus(),p.setSelectionRange(p.value.length,p.value.length))}function Sn(){const t=localStorage.getItem(Ds);return t==="edit"||t==="split"||t==="preview"?t:window.innerWidth>=1e3?"split":"edit"}function Ln(t){var n;const e=[],a=/^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;let s;for(;s=a.exec(t);)((n=t.slice(0,s.index).match(/^```/gm))!=null?n:[]).length%2!==1&&e.push({level:s[1].length,text:s[2].replace(/[*_`~]/g,""),offset:s.index});return e}async function En(t,e){t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${b("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const a=t.querySelector("#album-grid"),s=async()=>{const n=await S.albums(),r=n.albums.reduce((i,l)=>i+l.count,0);t.querySelector("#album-sub").textContent=`${n.albums.length} 个相册 · 共 ${r} 张照片`,a.innerHTML=n.albums.length?n.albums.map(na).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await s(),t.querySelector("#new-album").addEventListener("click",async()=>{await yt({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async n=>{const r=n.querySelector("#a-name").value.trim();return r?(await S.createAlbum({name:r,description:n.querySelector("#a-desc").value.trim(),privacy:n.querySelector("#a-priv").value}),$("相册已创建","ok"),await s(),!0):($("请填写相册名称","err"),!1)}})})}async function Tn(t,e){const a=Number(e.params.id);let s=await S.album(a);const n=()=>{var r,i,l;t.innerHTML=`<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${b("back",14)} 全部相册</a>
          <h1>${m(s.name)}</h1>
          <p class="page-sub">${m(s.description||"没有描述")} · ${s.count} 张 · ${de(s.at)}创建</p>
        </div>
        ${s.canEdit?`<div class="head-btns">
                <label class="btn btn-primary btn-sm" title="单张上限 30MB，超过会自动压缩">${b("upload",14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden>
                </label>
                <button class="btn btn-ghost btn-sm danger" id="del-album">${b("trash",14)}</button>
              </div>`:""}
      </header>
      <div class="photo-grid" id="photo-grid">
        ${(r=s.photos)!=null&&r.length?s.photos.map(d=>`<figure class="photo" data-pid="${d.id}">
                    <img src="${m(d.url)}" alt="${m(d.caption)}" loading="lazy" data-zoom="${m(d.url)}">
                    <figcaption>
                      <span>${m(d.caption||de(d.at))}</span>
                      <span class="photo-like">${b("heart",12)} ${d.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${d.id}" title="赞">${b("heart",14)}</button>
                      ${s.canEdit?`<button class="photo-btn danger" data-del="${d.id}" title="删除">${b("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,st(t),(i=t.querySelector("#photo-file"))==null||i.addEventListener("change",async d=>{var u;const g=d.target,c=Array.from((u=g.files)!=null?u:[]);if(c.length){$(`正在处理 ${c.length} 张…`);try{const p=[],o=[],v=[],y=[];let w=0;for(const E of c){const T=await kt(E),{url:B}=await S.upload(T.file);p.push(B),o.push(T.size),v.push(T.width),y.push(T.height),w+=T.originalSize-T.size}s=await S.addPhotos(s.id,p,{sizes:o,widths:v,heights:y}),$(w>512*1024?`上传完成，压缩节省 ${We(w)}`:"上传完成","ok"),n()}catch(p){$(p.message,"err")}finally{g.value=""}}}),(l=t.querySelector("#del-album"))==null||l.addEventListener("click",async()=>{if(await Ke("删除相册",`《${s.name}》及其中 ${s.count} 张照片会一起删除。`))try{await S.deleteAlbum(s.id),$("相册已删除","ok"),location.hash="#/albums"}catch(d){$(d.message,"err")}}),t.querySelector("#photo-grid").addEventListener("click",async d=>{var p;const g=d.target,c=g.closest("[data-like]");if(c){d.stopPropagation();try{const o=await S.likePhoto(Number(c.dataset.like));c.classList.toggle("active",o.liked);const v=(p=c.closest(".photo"))==null?void 0:p.querySelector(".photo-like");v&&(v.innerHTML=`${b("heart",12)} ${o.count}`)}catch(o){$(o.message,"err")}return}const u=g.closest("[data-del]");if(u){if(d.stopPropagation(),!await Ke("删除照片","确定从相册中删除这张照片吗？"))return;try{await S.deletePhoto(s.id,Number(u.dataset.del)),s=await S.album(s.id),n(),$("已删除","ok")}catch(o){$(o.message,"err")}}})};n()}async function Mn(t,e){const a=ve(),s=e.params.uin||a.uin,n=s===a.uin,r=n?a:(await S.user(s)).user;t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${n?"来过的人，留下了这些话。":`给 ${m(r.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${re(a.avatar,a.nickname,36)}
        <span>${n?"给自己留一句话":`给 ${m(r.nickname)} 留一句话`}</span>
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
  </div>`;const i=t.querySelector("#gb-list"),l=t.querySelector("#gb-form textarea"),d=t.querySelector("#gb-count");l.addEventListener("input",()=>{d.textContent=`${l.value.length} / 500`});const g=u=>`<article class="gb-item card" data-gid="${u.id}">
      ${re(u.author.avatar,u.author.nickname,40,u.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${m(u.author.uin)}">${m(u.author.nickname)}</a>
          <time>${de(u.at)}</time>
          <span class="spacer"></span>
          ${u.canEdit?`<button class="text-btn" data-reply="${u.id}">回复</button>`:""}
          ${u.canDel?`<button class="text-btn danger" data-del="${u.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${m(u.content)}</p>
        ${u.reply?`<div class="gb-reply"><b>${m(r.nickname)}：</b>${m(u.reply)}</div>`:""}
      </div>
    </article>`,c=async()=>{const u=await S.guestbook(s);i.innerHTML=u.entries.length?u.entries.map(g).join(""):`<div class="card empty"><div class="empty-mark">${b("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await c(),t.querySelector("#gb-form").addEventListener("submit",async u=>{u.preventDefault();const p=l.value.trim();if(p)try{await S.createGuestbook(s,p),l.value="",d.textContent="0 / 500",$("留言成功","ok"),await c()}catch(o){$(o.message,"err")}}),i.addEventListener("click",async u=>{const p=u.target,o=p.closest("[data-del]");if(o){if(!confirm("确定删除这条留言吗？"))return;try{await S.deleteGuestbook(Number(o.dataset.del)),await c(),$("已删除","ok")}catch(y){$(y.message,"err")}return}const v=p.closest("[data-reply]");if(v){const y=Number(v.dataset.reply);await yt({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async w=>{const E=w.querySelector("#reply-text").value.trim();return E?(await S.replyGuestbook(y,E),await c(),$("已回复","ok"),!0):($("回复不能为空","err"),!1)}})}})}async function qn(t,e){const a=ve(),s=e.params.uin?(await S.user(e.params.uin)).user:a;t.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${m(s.nickname)}</h1>
      <p class="page-sub">${m(s.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${s.bio?Rt(s.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
      </article>

      <aside class="about-side">
        <section class="rail-card">
          <h3>档案</h3>
          <dl class="fact-list">
            <div><dt>空间号</dt><dd>${m(s.uin)}</dd></div>
            <div><dt>城市</dt><dd>${m(s.city||"—")}</dd></div>
            <div><dt>星座</dt><dd>${m(s.constellation||"—")}</dd></div>
            <div><dt>加入</dt><dd>${new Date(s.createdAt).getFullYear()} 年</dd></div>
            <div><dt>文章</dt><dd>${s.posts} 篇</dd></div>
            <div><dt>照片</dt><dd>${s.photos} 张</dd></div>
          </dl>
        </section>

        <section class="rail-card">
          <h3>标签</h3>
          <div class="tag-cloud">
            ${s.tags.map(n=>`<span class="tag">${m(n)}</span>`).join("")||'<span class="muted">还没有标签</span>'}
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
  </div>`,s.uin!==a.uin&&S.visit(s.uin,"关于").catch(()=>$("足迹记录失败","err"))}async function An(t,e){var d;const a=(d=e.params.uin)!=null?d:"",s=ve();if(a===s.uin){location.hash="#/home";return}t.innerHTML=`<div class="page"><div class="card reading">正在打开 ${m(a)} 的空间…</div></div>`;const{user:n}=await S.user(a);S.visit(n.uin,"主页").catch(()=>{}),t.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${m(n.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${re(n.avatar,n.nickname,0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${b("pin",12)} ${m(n.city||"—")}</p>
          <h1>${m(n.nickname)}</h1>
          <p class="hero-sign">${m(n.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${n.posts}</b>文章</span>
            <span><b>${n.photos}</b>照片</span>
            <span><b>${n.visitCount.toLocaleString()}</b>访问</span>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/guestbook?uin=${m(n.uin)}">${b("mail",15)} 留言</a>
          <a class="btn btn-ghost" href="#/search?q=${encodeURIComponent(n.nickname)}">${b("search",15)} 搜索</a>
        </div>
      </div>
    </section>

    <div class="list-head">
      <h2>${m(n.nickname)} 的文章</h2>
      <span class="muted">${n.posts} 篇</span>
    </div>
    <div id="space-posts">${Xe(2)}</div>
  </div>`,st(t);const r=t.querySelector("#space-posts"),i=await S.posts({uin:n.uin,limit:10});if(!i.posts.length){r.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const l=i.posts[0];r.innerHTML=ys(l)+`<div class="post-list">${i.posts.slice(1).map(at).join("")}</div>`}const fs={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function Rn(t){return t.target.startsWith("post:")?`#/post/${t.target.split(":")[1]}`:t.target.startsWith("album:")?`#/album/${t.target.split(":")[1]}`:t.target==="guestbook"?"#/guestbook":t.target==="profile"?`#/u/${m(t.from.uin)}`:"#/home"}async function Cn(t,e){t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${b("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const a=t.querySelector("#msg-list"),s=t.querySelector("#msg-sub"),n=async()=>{const r=await S.notifications();s.textContent=r.unread?`${r.unread} 条未读`:"全部已读",es(r.unread),a.innerHTML=r.notifications.length?`<div class="card msg-list">${r.notifications.map(i=>{var d;const l=(d=fs[i.kind])!=null?d:fs.system;return`<a class="msg-row ${i.read?"":"unread"}" href="${Rn(i)}">
              <span class="msg-icon ${l.cls}">${b(l.icon,16)}</span>
              <div class="msg-body">
                <div class="msg-line">
                  ${re(i.from.avatar,i.from.nickname,20,i.from.uin)}
                  <b>${m(i.from.nickname)}</b>
                  <span>${m(i.text)}</span>
                </div>
                <time>${de(i.at)} · ${l.label}</time>
              </div>
              ${i.read?"":'<i class="msg-dot"></i>'}
            </a>`}).join("")}</div>`:`<div class="card empty"><div class="empty-mark">${b("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await n(),t.querySelector("#read-all").addEventListener("click",async()=>{try{const r=await S.readNotifications([]);es(r.unread),$("已全部标为已读","ok"),await n()}catch(r){$(r.message,"err")}})}const zn=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function Pn(t,e){const a=ve(),s=e.params.tab==="out"?"out":"in";t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${b("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${zn.map(i=>`<button class="seg-btn ${i.key===s?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/visitors?tab=${i.dataset.tab}`})});const n=t.querySelector("#visit-list"),r=await S.visitors(a.uin,s);t.querySelector("#visit-sub").textContent=s==="in"?`累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人`:`你最近访问了 ${r.visitors.length} 个空间`,n.innerHTML=r.visitors.length?`<div class="card visit-list">${r.visitors.map(i=>`<a class="visit-row" href="#/u/${m(i.author.uin)}">
            ${re(i.author.avatar,i.author.nickname,40,i.author.uin)}
            <div class="visit-main">
              <b>${m(i.author.nickname)}</b>
              <span>${s==="in"?"看了":"访问了"} · ${m(i.module)}</span>
            </div>
            <time>${de(i.at)}</time>
          </a>`).join("")}</div>`:ta(s==="in"?"还没有人来过":"还没有访问记录",s==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>')}const In=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function Hn(t,e){var r;const a=e.params.tab||"profile",s=ve();t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${In.map(i=>`<button class="seg-btn ${i.key===a?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/settings?tab=${i.dataset.tab}`})});const n=t.querySelector("#settings-body");if(a==="decorate"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${m(s.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${mt().map(i=>`<button class="theme-card ${s.theme===i.id?"active":""}" data-theme="${i.id}">
              <span class="theme-swatch" style="background:${i.accent}"></span>
              <span>${m(i.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,n.querySelector("#cover-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:g}=await S.upload(l),c=await S.updateProfile({cover:g});Se(c),n.querySelector("#cover-preview").style.backgroundImage=`url('${g}')`,$("封面已更新","ok")}catch(g){$(g.message,"err")}}),n.querySelectorAll("[data-theme]").forEach(i=>{i.addEventListener("click",async()=>{const l=i.dataset.theme;try{const d=await S.updateProfile({theme:l});Se(d),vs(l),n.querySelectorAll("[data-theme]").forEach(g=>g.classList.remove("active")),i.classList.add("active"),$("主题已切换","ok")}catch(d){$(d.message,"err")}})});return}if(a==="music"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">内置免费音乐</h2>
      <p class="setting-hint">曲目由程序实时合成，无版权限制；点「试听」立即播放，「设为背景音乐」保存到你的空间。</p>
      <div class="music-library" id="music-library"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${I.isPlaying()?"spin":""}">${b("music",16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${m(s.bgmTitle||"还没有设置音轨")}</b>
          <span id="bgm-sub">${s.bgmUrl?"已保存，会在页面左下角循环播放":"上传、选一首内置曲目，或填写直链"}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="preview-btn">${b("play",13)} 试听</button>
      </div>
      <label class="field">
        <span>显示名称</span>
        <input class="input" id="bgm-title" maxlength="60" value="${m(s.bgmTitle)}" placeholder="比如：夜航">
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
    </section>`;let i=s.bgmUrl,l=s.bgmTitle;const d=()=>{n.querySelector("#bgm-name").textContent=l||"还没有设置音轨",n.querySelector("#bgm-sub").textContent=i?"已选择，保存后生效":"上传、选一首内置曲目，或填写直链",n.querySelector("#bgm-title").value||(n.querySelector("#bgm-title").value=l)},g=(u,p)=>{i=u,l=p,n.querySelector("#bgm-title").value=p,d()};try{const{tracks:u}=await S.musicLibrary(),p=n.querySelector("#music-library");p.innerHTML=u.map(o=>`<article class="lib-card" data-id="${m(o.id)}">
            <div class="lib-main">
              <b>${m(o.title)}</b>
              <span>${m(o.mood)} · ${o.duration} 秒</span>
            </div>
            <div class="lib-actions">
              <button class="btn btn-ghost btn-sm" data-play="${m(o.url)}" data-title="${m(o.title)}">${b("play",12)} 试听</button>
              <button class="btn btn-soft btn-sm" data-pick="${m(o.url)}" data-title="${m(o.title)}">设为背景</button>
            </div>
          </article>`).join(""),p.addEventListener("click",o=>{var E;const v=o.target,y=v.closest("[data-play]");if(y){I.setTrack(y.dataset.play,y.dataset.title),I.isPlaying()||I.toggle(),(E=n.querySelector(".music-disc"))==null||E.classList.add("spin");return}const w=v.closest("[data-pick]");w&&(g(w.dataset.pick,w.dataset.title),$(`已选择《${w.dataset.title}》，记得点保存`,"ok"))})}catch(u){n.querySelector("#music-library").innerHTML=`<span class="muted">曲库加载失败：${m(u.message)}</span>`}const c=n.querySelector("#audio-file");c.addEventListener("change",async()=>{var p;const u=(p=c.files)==null?void 0:p[0];if(u){if(u.size>50*1024*1024){$("音频不能超过 50MB","err");return}$("正在上传音频…");try{const{url:o}=await S.uploadAudio(u);g(o,u.name.replace(/\.[^.]+$/,"")),$("上传完成，点保存生效","ok")}catch(o){$(o.message,"err")}finally{c.value=""}}}),n.querySelector("#bgm-url-save").addEventListener("click",()=>{var o;const p=n.querySelector("#bgm-url").value.trim();if(!p){$("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/)/.test(p)){$("地址需要以 http(s):// 或 /media/ 开头","err");return}g(p,((o=p.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"外部音频"),$("已填入，点保存生效","ok")}),n.querySelector("#preview-btn").addEventListener("click",()=>{if(!i){$("还没有选择音轨","err");return}I.setTrack(i,l),I.toggle(),setTimeout(()=>{var u;return(u=n.querySelector(".music-disc"))==null?void 0:u.classList.toggle("spin",I.isPlaying())},150)}),n.querySelector("#save-bgm").addEventListener("click",async()=>{const u=n.querySelector("#bgm-title").value.trim();try{const p=await S.updateProfile({bgmUrl:i,bgmTitle:u});Se(p),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:p.bgmUrl,bgmTitle:p.bgmTitle}})),$("背景音乐已保存","ok")}catch(p){$(p.message,"err")}}),(r=n.querySelector("#clear-bgm"))==null||r.addEventListener("click",async()=>{try{const u=await S.updateProfile({bgmUrl:"",bgmTitle:""});Se(u),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),$("已移除背景音乐","ok"),await e.reload()}catch(u){$(u.message,"err")}});return}n.innerHTML=`<section class="card setting-card">
    <div class="avatar-line">
      <img src="${m(s.avatar)}" alt="" id="avatar-preview">
      <div>
        <b>${m(s.nickname)}</b>
        <p class="muted">@${m(s.uin)} · Lv.${s.level}</p>
      </div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换头像
        <input type="file" id="avatar-file" accept="image/*" hidden>
      </label>
    </div>

    <form id="profile-form" class="setting-form">
      <div class="form-2col">
        <label class="field"><span>昵称</span><input class="input" name="nickname" maxlength="20" value="${m(s.nickname)}"></label>
        <label class="field"><span>城市</span><input class="input" name="city" maxlength="20" value="${m(s.city)}"></label>
      </div>
      <label class="field"><span>一句话签名</span><input class="input" name="signature" maxlength="80" value="${m(s.signature)}"></label>
      <label class="field">
        <span>自我介绍（Markdown，会显示在「关于」页）</span>
        <textarea class="input" name="bio" rows="8" maxlength="4000" placeholder="## 关于我&#10;&#10;写文章…">${m(s.bio)}</textarea>
      </label>
      <label class="field"><span>标签（逗号分隔，最多 8 个）</span>
        <input class="input" name="tags" value="${m(s.tags.join(","))}" placeholder="写作, 摄影, 徒步">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" type="submit">保存修改</button>
        <span class="muted">空间号注册后不可修改</span>
      </div>
    </form>
  </section>`,n.querySelector("#avatar-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:g}=await S.upload(l),c=await S.updateProfile({avatar:g});Se(c),n.querySelector("#avatar-preview").src=g,$("头像已更新","ok")}catch(g){$(g.message,"err")}}),n.querySelector("#profile-form").addEventListener("submit",async i=>{var g,c,u,p,o;i.preventDefault();const l=new FormData(i.currentTarget),d=String((g=l.get("tags"))!=null?g:"").split(/[,，\s]+/).map(v=>v.trim()).filter(Boolean).slice(0,8);try{const v=await S.updateProfile({nickname:String((c=l.get("nickname"))!=null?c:"").trim(),city:String((u=l.get("city"))!=null?u:"").trim(),signature:String((p=l.get("signature"))!=null?p:"").trim(),bio:String((o=l.get("bio"))!=null?o:""),tags:d});Se(v),$("已保存","ok"),await e.reload()}catch(v){$(v.message,"err")}})}async function _n(t,e){const a=(e.params.q||"").trim();if(t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SEARCH</p>
        <h1>搜索</h1>
        <p class="page-sub">${a?`“${m(a)}” 的结果`:"找文章、找朋友、找相册"}</p>
      </div>
    </header>

    <form class="search-box card" id="search-form">
      <input class="input" name="q" value="${m(a)}" placeholder="输入关键词" autofocus>
      <button class="btn btn-primary" type="submit">${b("search",14)} 搜索</button>
    </form>

    <div id="search-result"></div>
  </div>`,t.querySelector("#search-form").addEventListener("submit",n=>{var i;n.preventDefault();const r=String((i=new FormData(n.currentTarget).get("q"))!=null?i:"").trim();location.hash=r?`#/search?q=${encodeURIComponent(r)}`:"#/search"}),!a)return;const s=t.querySelector("#search-result");try{const n=await S.search(a);if(!(n.posts.length+n.users.length+n.albums.length)){s.innerHTML=`<div class="card empty"><div class="empty-mark">${b("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}s.innerHTML=`
      ${n.users.length?`<h2 class="result-title">用户 <span>${n.users.length}</span></h2>
             <div class="card user-list">${n.users.map(i=>`<a class="user-row" href="#/u/${m(i.uin)}">
                   <img src="${m(i.avatar)}" alt="">
                   <div><b>${m(i.nickname)}</b><span>@${m(i.uin)} · ${m(i.signature||"")}</span></div>
                   ${b("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${n.posts.length?`<h2 class="result-title">文章 <span>${n.posts.length}</span></h2>
             <div class="post-list card">${n.posts.map(at).join("")}</div>`:""}
      ${n.albums.length?`<h2 class="result-title">相册 <span>${n.albums.length}</span></h2>
             <div class="album-grid">${n.albums.map(i=>`<a class="album-card card" href="#/album/${i.id}">
                   <div class="album-cover">${i.cover?`<img src="${m(i.cover)}" alt="">`:""}</div>
                   <div class="album-info"><h3>${m(i.name)}</h3><p>${i.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(n){$(n.message,"err")}}const Bs=document.getElementById("app"),Dn=[{pattern:/^\/home$/,nav:"home",render:ia},{pattern:/^\/posts$/,nav:"posts",render:la},{pattern:/^\/post\/(\d+)$/,nav:"posts",render:yn},{pattern:/^\/write$/,nav:"",render:bs},{pattern:/^\/edit\/(\d+)$/,nav:"",render:bs},{pattern:/^\/albums$/,nav:"albums",render:En},{pattern:/^\/album\/(\d+)$/,nav:"albums",render:Tn},{pattern:/^\/guestbook$/,nav:"guestbook",render:Mn},{pattern:/^\/about$/,nav:"about",render:qn},{pattern:/^\/u\/([^/]+)$/,nav:"",render:An},{pattern:/^\/messages$/,nav:"",render:Cn},{pattern:/^\/visitors$/,nav:"",render:Pn},{pattern:/^\/settings$/,nav:"",render:Hn},{pattern:/^\/search$/,nav:"",render:_n}];let Ct=!1,ze=!1;function Bn(){const t=location.hash.replace(/^#/,"")||"/home",[e,a=""]=t.split("?");return{path:e.startsWith("/")?e:`/${e}`,query:new URLSearchParams(a)}}function On(t){var e;for(const a of Dn){const s=t.match(a.pattern);if(s)return{def:a,id:(e=s[1])!=null?e:""}}return null}async function Os(){try{const t=await S.session();if(!t.authenticated||!t.user)return!1;const e=await S.bootstrap();return Js({me:e.me,themes:e.themes,unread:e.unread}),vs(e.me.theme),!0}catch{return!1}}function zt(){Ct=!1,J.boot=null,document.body.classList.remove("signed-in"),I.unmount(),aa(Bs,async()=>{await Os()&&js()})}function Pe(t,e,a){return`<a class="nav-link" data-nav="${e}" href="${t}">${a}</a>`}function js(){const t=ve();document.body.classList.add("signed-in"),Bs.innerHTML=`
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${b("pen",15)}</span>
        <span class="brand-text">${m(t.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${Pe("#/home","home","首页")}
        ${Pe("#/posts","posts","文章")}
        ${Pe("#/albums","albums","相册")}
        ${Pe("#/guestbook","guestbook","留言板")}
        ${Pe("#/about","about","关于")}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${b("search",15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${b("pen",14)}<span>写文章</span></a>
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${b("bell",18)}<i class="badge" data-unread ${Jt()?"":"hidden"}>${Jt()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${re(t.avatar,t.nickname,32)}
          <div class="user-menu" id="user-menu" hidden>
            <div class="menu-head">
              <b>${m(t.nickname)}</b>
              <span>@${m(t.uin)}</span>
            </div>
            <a href="#/u/${m(t.uin)}">${b("grid",14)} 我的主页</a>
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
    <span>${m(t.nickname)} · 个人空间</span>
    <span class="foot-sep">·</span>
    <span>Go + ent + SQLite · TypeScript</span>
  </footer>`;const e=document.getElementById("head-search");e.addEventListener("submit",s=>{var r;s.preventDefault();const n=String((r=new FormData(e).get("q"))!=null?r:"").trim();n&&(location.hash=`#/search?q=${encodeURIComponent(n)}`)});const a=document.getElementById("user-chip");a.addEventListener("click",s=>{s.target.closest("a,button")||(ze=!ze,document.getElementById("user-menu").hidden=!ze)}),document.addEventListener("click",s=>{!a.contains(s.target)&&ze&&(ze=!1,document.getElementById("user-menu").hidden=!0)}),document.getElementById("logout-btn").addEventListener("click",async()=>{await S.logout(),$("已退出登录"),zt()}),Ct=!0,I.setTrack(t.bgmUrl,t.bgmTitle),I.mount(),tt()}async function tt(){var i;if(!Ct)return;const t=document.getElementById("view");if(!t)return;const{path:e,query:a}=Bn(),s=On(e);if(!e.startsWith("/write")&&!e.startsWith("/edit/")&&document.body.classList.remove("writer-mode"),document.querySelectorAll("[data-nav]").forEach(l=>{l.classList.toggle("active",l.dataset.nav===(s==null?void 0:s.def.nav))}),!s){t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">页面不存在</h2>
      <p class="empty-desc">这条链接可能已经失效。</p>
      <a class="btn btn-primary" href="#/home">回到首页</a>
    </div></div>`;return}const n={...Object.fromEntries(a)};s.id&&(n.id=s.id,s.def.pattern.source.includes("[^/]")&&(n.uin=s.id)),window.scrollTo({top:0});const r={params:n,reload:tt};try{await s.def.render(t,r)}catch(l){if(l instanceof Qe&&l.status===401)return;t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${m(l.message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`,(i=t.querySelector("#retry"))==null||i.addEventListener("click",()=>void tt())}}window.addEventListener("hashchange",()=>void tt());window.addEventListener("qz:expired",()=>zt());(async function(){await Os()?js():zt()})();window.addEventListener("qz:profile",t=>{const e=t.detail;e&&I.setTrack(e.bgmUrl,e.bgmTitle)});
