var bs=Object.defineProperty;var Lt=t=>{throw TypeError(t)};var fs=(t,e,a)=>e in t?bs(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var q=(t,e,a)=>fs(t,typeof e!="symbol"?e+"":e,a),ks=(t,e,a)=>e.has(t)||Lt("Cannot "+a);var Tt=(t,e,a)=>e.has(t)?Lt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a);var me=(t,e,a)=>(ks(t,e,"access private method"),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();class Ie extends Error{constructor(a,s){super(s);q(this,"status");this.status=a}}async function be(t,e={}){const a=new Headers(e.headers);e.body&&!(e.body instanceof FormData)&&a.set("Content-Type","application/json");let s;try{s=await fetch(t,{credentials:"include",...e,headers:a})}catch{throw new Ie(0,"网络连接失败，请检查服务是否已启动")}if(s.status===401)throw window.dispatchEvent(new CustomEvent("qz:expired")),new Ie(401,"登录状态已失效");const n=await s.text(),r=n?JSON.parse(n):{};if(!s.ok)throw new Ie(s.status,r.error||"请求失败");return r}const N=t=>be(t),H=(t,e)=>be(t,{method:"POST",body:e===void 0?void 0:JSON.stringify(e)}),ye=t=>be(t,{method:"DELETE"}),qt=(t,e)=>be(t,{method:"PATCH",body:JSON.stringify(e)}),$={register:(t,e,a)=>H("/api/auth/register",{uin:t,nickname:e,password:a}),login:(t,e)=>H("/api/auth/login",{uin:t,password:e}),logout:()=>H("/api/auth/logout"),session:()=>N("/api/auth/session"),bootstrap:()=>N("/api/bootstrap"),user:t=>N(`/api/users/${encodeURIComponent(t)}`),updateProfile:t=>qt("/api/users/me",t),signIn:()=>H("/api/users/me/signin"),visitors:(t,e="in")=>N(`/api/users/${encodeURIComponent(t)}/visitors?mode=${e}`),visit:(t,e)=>H(`/api/users/${encodeURIComponent(t)}/visit`,{module:e}),posts:t=>{const e=new URLSearchParams;return Object.entries(t).forEach(([a,s])=>{s!==void 0&&s!==""&&e.set(a,String(s))}),N(`/api/posts?${e}`)},createPost:t=>H("/api/posts",t),post:t=>N(`/api/posts/${t}`),updatePost:(t,e)=>qt(`/api/posts/${t}`,e),deletePost:t=>ye(`/api/posts/${t}`),likePost:t=>H(`/api/posts/${t}/like`),commentPost:(t,e,a)=>H(`/api/posts/${t}/comments`,{content:e,replyTo:a}),deleteComment:(t,e)=>ye(`/api/posts/${t}/comments/${e}`),albums:t=>N(`/api/albums${t?`?uin=${encodeURIComponent(t)}`:""}`),album:t=>N(`/api/albums/${t}`),createAlbum:t=>H("/api/albums",t),deleteAlbum:t=>ye(`/api/albums/${t}`),addPhotos:(t,e,a)=>H(`/api/albums/${t}/photos`,{urls:e,caption:"",...a}),deletePhoto:(t,e)=>ye(`/api/albums/${t}/photos/${e}`),likePhoto:t=>H(`/api/photos/${t}/like`),guestbook:t=>N(`/api/guestbook${t?`?uin=${encodeURIComponent(t)}`:""}`),createGuestbook:(t,e)=>H("/api/guestbook",{owner:t,content:e}),deleteGuestbook:t=>ye(`/api/guestbook/${t}`),replyGuestbook:(t,e)=>H(`/api/guestbook/${t}/reply`,{reply:e}),notifications:()=>N("/api/notifications"),readNotifications:(t=[])=>H("/api/notifications/read",{ids:t}),musicLibrary:()=>N("/api/music/library"),search:t=>N(`/api/search?q=${encodeURIComponent(t)}`),upload:async t=>{const e=new FormData;return e.append("file",t),be("/api/upload",{method:"POST",body:e})},uploadAudio:async t=>{const e=new FormData;return e.append("file",t),be("/api/upload/audio",{method:"POST",body:e})}},Q={boot:null};function ue(){if(!Q.boot)throw new Error("尚未初始化");return Q.boot.me}function vs(t){Q.boot=t}function ge(t){Q.boot&&(Q.boot.me=t)}function Xe(){var t,e;return(e=(t=Q.boot)==null?void 0:t.themes)!=null?e:[]}function Et(){var t,e;return(e=(t=Q.boot)==null?void 0:t.unread)!=null?e:0}function Mt(t){Q.boot&&(Q.boot.unread=t),document.querySelectorAll("[data-unread]").forEach(e=>{e.textContent=t>99?"99+":String(t),e.hidden=t===0})}function Qt(t){var a,s;const e=(a=Xe().find(n=>n.id===t))!=null?a:Xe()[0];document.documentElement.dataset.theme=(s=e==null?void 0:e.id)!=null?s:"aurora",e&&document.documentElement.style.setProperty("--accent",e.accent)}function h(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const ae=t=>String(t).padStart(2,"0");function ne(t){const e=new Date(t).getTime(),a=Date.now()-e,s=6e4;if(a<s)return"刚刚";if(a<60*s)return`${Math.floor(a/s)} 分钟前`;const n=new Date(e),r=new Date;if(n.toDateString()===r.toDateString())return`今天 ${ae(n.getHours())}:${ae(n.getMinutes())}`;const i=new Date(Date.now()-864e5);return n.toDateString()===i.toDateString()?`昨天 ${ae(n.getHours())}:${ae(n.getMinutes())}`:n.getFullYear()===r.getFullYear()?`${n.getMonth()+1} 月 ${n.getDate()} 日`:`${n.getFullYear()} 年 ${n.getMonth()+1} 月 ${n.getDate()} 日`}function At(t){const e=new Date(t);return`${e.getFullYear()}-${ae(e.getMonth()+1)}-${ae(e.getDate())} ${ae(e.getHours())}:${ae(e.getMinutes())}`}const ys={pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',message:'<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',music:'<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',bell:'<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chevron:'<path d="M9 6l6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',star:'<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',logout:'<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',tag:'<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',pin:'<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',listOl:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',table:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',codeInline:'<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',codeBlock:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>'};function g(t,e=16){var s;const a=(s=ys[t])!=null?s:"";return`<svg class="ico" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}function Y(t,e,a=40,s="",n=0){const r=t?`<img src="${h(t)}" alt="${h(e)}" loading="lazy">`:`<span class="avatar-fallback">${h(e.slice(0,1))}</span>`,i=s?`href="#/u/${h(s)}"`:"",l=a>0?` style="width:${a}px;height:${a}px"`:"";return`<a class="avatar" ${i}${l}>${r}${n?`<i class="avatar-level">${n}</i>`:""}</a>`}function v(t,e="info"){let a=document.getElementById("toasts");a||(a=document.createElement("div"),a.id="toasts",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${e}`,s.textContent=t,a.appendChild(s),requestAnimationFrame(()=>s.classList.add("in")),setTimeout(()=>{s.classList.remove("in"),setTimeout(()=>s.remove(),280)},2600)}function tt(t){return new Promise(e=>{var r,i,l,c;const a=document.createElement("div");a.className="modal-mask",a.innerHTML=`
      <div class="modal ${t.wide?"modal-wide":""}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${h(t.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${g("close",18)}</button>
        </header>
        <div class="modal-body">${t.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${h((r=t.cancelText)!=null?r:"取消")}</button>
          <button class="btn btn-primary modal-ok">${h((i=t.confirmText)!=null?i:"确定")}</button>
        </footer>
      </div>`,document.body.appendChild(a),document.body.classList.add("no-scroll");const s=d=>{a.remove(),document.body.classList.remove("no-scroll"),e(d)};a.querySelector(".modal-x").addEventListener("click",()=>s(!1)),a.querySelector(".modal-cancel").addEventListener("click",()=>s(!1)),a.addEventListener("mousedown",d=>{d.target===a&&s(!1)});const n=a.querySelector(".modal-ok");n.addEventListener("click",async()=>{if(!t.onConfirm)return s(!0);n.disabled=!0;try{await t.onConfirm(a)!==!1&&s(!0)}catch(d){v(d.message,"err")}finally{n.disabled=!1}}),(l=t.onMount)==null||l.call(t,a),(c=a.querySelector("input, textarea"))==null||c.focus()})}async function He(t,e,a="删除"){return tt({title:t,body:`<p class="confirm-text">${h(e)}</p>`,confirmText:a})}function Ue(t){t.addEventListener("click",e=>{const a=e.target.closest("[data-zoom]");if(!a||e.target.closest("button"))return;const s=a.dataset.zoom||a.src,n=Array.from(t.querySelectorAll("[data-zoom]")).map(m=>m.dataset.zoom||m.src);let r=Math.max(0,n.indexOf(s));const i=document.createElement("div");i.className="lightbox",i.innerHTML=`
      <button class="lb-close">${g("close",24)}</button>
      <button class="lb-prev">${g("back",24)}</button>
      <img alt="">
      <button class="lb-next">${g("chevron",24)}</button>
      <div class="lb-count"></div>`,document.body.appendChild(i),document.body.classList.add("no-scroll");const l=i.querySelector("img"),c=i.querySelector(".lb-count"),d=()=>{l.src=n[r],c.textContent=`${r+1} / ${n.length}`};d();const p=m=>{m.key==="Escape"&&u(),m.key==="ArrowLeft"&&n.length>1&&(r=(r-1+n.length)%n.length,d()),m.key==="ArrowRight"&&n.length>1&&(r=(r+1)%n.length,d())},u=()=>{i.remove(),document.body.classList.remove("no-scroll"),window.removeEventListener("keydown",p)};i.querySelector(".lb-close").addEventListener("click",u),i.addEventListener("click",m=>{m.target===i&&u()}),i.querySelector(".lb-prev").addEventListener("click",m=>{m.stopPropagation(),n.length>1&&(r=(r-1+n.length)%n.length,d())}),i.querySelector(".lb-next").addEventListener("click",m=>{m.stopPropagation(),n.length>1&&(r=(r+1)%n.length,d())}),window.addEventListener("keydown",p)})}function $s(t,e="",a=""){return`<div class="empty">
    <div class="empty-mark">${g("book",22)}</div>
    <p class="empty-title">${h(t)}</p>
    ${e?`<p class="empty-desc">${h(e)}</p>`:""}
    ${a}
  </div>`}function Be(t=3){return Array.from({length:t}).map(()=>`<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`).join("")}class ws{constructor(){q(this,"audio",null);q(this,"pill",null);q(this,"title","");q(this,"url","");q(this,"armed",!1)}get want(){return localStorage.getItem("qz.bgm")!=="off"}get volume(){const e=Number(localStorage.getItem("qz.bgm.vol"));return Number.isFinite(e)&&e>0?Math.min(e,1):.55}setTrack(e,a){const s=e!==this.url;this.url=e,this.title=a||"未命名音轨",s&&(this.ensureAudio(),this.audio&&(this.audio.src=e,this.audio.volume=this.volume,this.audio.load())),this.render(),s&&e&&this.want&&this.arm()}ensureAudio(){if(this.audio)return;const e=new Audio;e.loop=!0,e.preload="metadata",e.volume=this.volume,e.addEventListener("play",()=>this.render()),e.addEventListener("pause",()=>this.render()),e.addEventListener("error",()=>{this.render(),this.url&&v("背景音乐加载失败，可能是格式不支持","err")}),this.audio=e}arm(){if(this.armed)return;this.armed=!0;const e=a=>{const s=a.target;s&&s.closest(".bgm")||(document.removeEventListener("pointerdown",e),document.removeEventListener("keydown",e),this.want&&this.audio&&this.audio.paused&&this.play())};document.addEventListener("pointerdown",e),document.addEventListener("keydown",e)}async play(){if(this.ensureAudio(),!(!this.audio||!this.url))try{await this.audio.play(),localStorage.setItem("qz.bgm","on")}catch{this.render()}}pause(){var e;(e=this.audio)==null||e.pause(),localStorage.setItem("qz.bgm","off"),this.render()}isPlaying(){return!!this.audio&&!this.audio.paused}toggle(){var e;if(!this.url){v("还没有设置背景音乐，可以在「设置」里上传","err");return}((e=this.audio)==null?void 0:e.paused)!==!1?this.play():this.pause()}setVolume(e){localStorage.setItem("qz.bgm.vol",String(e)),this.audio&&(this.audio.volume=e)}mount(){if(this.pill){this.render();return}const e=document.createElement("div");e.className="bgm",document.body.appendChild(e),this.pill=e,e.addEventListener("click",a=>{const s=a.target;if(s.closest("[data-bgm-toggle]")){this.toggle();return}s.closest(".bgm-meta")&&(location.hash="#/settings?tab=music")}),e.addEventListener("input",a=>{const s=a.target;s.matches(".bgm-vol")&&this.setVolume(Number(s.value))}),this.render(),this.url&&this.want&&this.arm()}unmount(){var e,a;(e=this.pill)==null||e.remove(),this.pill=null,(a=this.audio)==null||a.pause(),document.body.classList.remove("has-bgm")}render(){if(document.body.classList.toggle("has-bgm",!!this.url),!this.pill)return;const e=this.audio?!this.audio.paused:!1,a=Math.round(this.volume*100);window.dispatchEvent(new CustomEvent("qz:bgm",{detail:{playing:e}})),this.pill.innerHTML=`
      <div class="bgm-disc ${e?"spin":""}" data-bgm-toggle title="${e?"暂停":"播放"}">${g("music",16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${h(this.url?this.title:"未设置音轨")}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${e?"暂停":"播放"}">
        ${g(e?"pause":"play",14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${a}" aria-label="音量">
      <div class="bgm-wave ${e?"on":""}"><i></i><i></i><i></i><i></i></div>`}}const P=new ws;window.bgm=P;function xs(t,e){t.innerHTML=`
  <div class="auth">
    <section class="auth-brand">
      <div class="auth-brand-inner">
        <div class="auth-logo">${g("pen",20)}</div>
        <h1>个人空间</h1>
        <p class="auth-lead">写下长一点的东西。照片、文章、留言，都放在自己的域名里。</p>
        <ul class="auth-points">
          <li>${g("book",15)} Markdown 写作，支持插图与代码</li>
          <li>${g("image",15)} 相册真实上传，存放在你自己的服务器</li>
          <li>${g("music",15)} 背景音乐真实播放</li>
          <li>${g("lock",15)} 每篇文章独立设置可见范围</li>
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
  </div>`;const a=t.querySelector("#auth-form"),s=t.querySelector("#auth-submit"),n=t.querySelector("#auth-hint"),r=Array.from(t.querySelectorAll(".auth-tab"));let i="login";const l=c=>{i=c,r.forEach(p=>p.classList.toggle("active",p.dataset.mode===c)),t.querySelectorAll('[data-only="register"]').forEach(p=>{p.hidden=c!=="register"});const d=a.elements.namedItem("nickname");d.required=c==="register",s.textContent=c==="login"?"登录":"创建空间",n.textContent=c==="login"?"还没有账号？点上面的「注册」，30 秒就能开通。":"空间号将作为你的主页地址，注册后不可修改。"};r.forEach(c=>c.addEventListener("click",()=>l(c.dataset.mode))),t.querySelectorAll(".demo-chip").forEach(c=>{c.addEventListener("click",()=>{var d,p;l("login"),a.elements.namedItem("uin").value=(d=c.dataset.uin)!=null?d:"",a.elements.namedItem("password").value=(p=c.dataset.pw)!=null?p:"",s.focus()})}),a.addEventListener("submit",async c=>{var o,b,k;c.preventDefault();const d=new FormData(a),p=String((o=d.get("uin"))!=null?o:"").trim(),u=String((b=d.get("password"))!=null?b:""),m=String((k=d.get("nickname"))!=null?k:"").trim();if(i==="register"&&!m){v("请填写昵称","err");return}s.disabled=!0,s.textContent=i==="login"?"登录中…":"创建中…";try{i==="login"?await $.login(p,u):await $.register(p,m,u),v(i==="login"?"欢迎回来":"空间已开通","ok"),await e()}catch(y){v(h(y.message),"err"),s.disabled=!1,s.textContent=i==="login"?"登录":"创建空间"}})}const Vt={private:"仅自己可见",unlisted:"不公开列出",public:""};function Wt(t){const e=t.cover||t.images[0]||"";return`<article class="feature card" data-post="${t.id}">
    <a class="feature-cover" href="#/post/${t.id}">
      ${e?`<img src="${h(e)}" alt="${h(t.title)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
    </a>
    <div class="feature-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${g("pin",11)}置顶</span>`:""}
        <span class="pill">${h(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${g("lock",11)}${Vt[t.visibility]}</span>`:""}
      </div>
      <h2 class="feature-title"><a href="#/post/${t.id}">${h(t.title||"无标题")}</a></h2>
      <p class="feature-summary">${h(t.summary)}</p>
      <div class="post-meta">
        <span>${ne(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${g("clock",12)} ${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${g("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${g("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
  </article>`}function Ze(t){const e=t.cover||t.images[0]||"";return`<article class="post-row" data-post="${t.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${g("pin",11)}置顶</span>`:""}
        <span class="pill">${h(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${g("lock",11)}${Vt[t.visibility]}</span>`:""}
      </div>
      <h3 class="post-row-title"><a href="#/post/${t.id}">${h(t.title||"无标题")}</a></h3>
      <p class="post-row-summary">${h(t.summary)}</p>
      <div class="post-meta">
        <span>${ne(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${g("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${g("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
    ${e?`<a class="post-row-thumb" href="#/post/${t.id}"><img src="${h(e)}" alt="" loading="lazy"></a>`:""}
  </article>`}function Rt(t){return t.length?`<ul class="comment-list">${t.map(e=>`<li class="comment" data-cid="${e.id}">
        ${Y(e.author.avatar,e.author.nickname,34,e.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${h(e.author.uin)}">${h(e.author.nickname)}</a>
            <time>${ne(e.at)}</time>
            <button class="text-btn" data-reply="${h(e.author.nickname)}">回复</button>
            ${e.canDel?`<button class="text-btn danger" data-del-comment="${e.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${e.replyTo?`<span class="comment-reply">回复 ${h(e.replyTo)}：</span>`:""}${h(e.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function Ss(t){return`<a class="album-card card" href="#/album/${t.id}">
    <div class="album-cover">
      ${t.cover?`<img src="${h(t.cover)}" alt="${h(t.name)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${t.count} 张</span>
    </div>
    <div class="album-info">
      <h3>${h(t.name)}</h3>
      <p>${h(t.description||"还没有描述")}</p>
    </div>
  </a>`}async function Ls(t,e){var r;const a=ue();t.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${h(a.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${Y(a.avatar,a.nickname,0,"",0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${g("pin",12)} ${h(a.city||"未设置城市")} · ${h(a.constellation||"—")}</p>
          <h1>${h(a.nickname)}</h1>
          <p class="hero-sign">${h(a.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${a.posts}</b>文章</span>
            <span><b>${a.photos}</b>照片</span>
            <span><b>${a.visitCount.toLocaleString()}</b>访问</span>
            <span><b>${a.signStreak}</b>连签</span>
          </div>
        </div>
        <div class="hero-actions hero-actions--self">
          <a class="btn btn-primary" href="#/write">${g("pen",15)} 写文章</a>
          <a class="btn btn-ghost" href="#/settings">${g("settings",15)} 设置</a>
        </div>
      </div>
    </section>

    <div class="home-grid">
      <div class="home-main" id="home-main">${Be(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,Ue(t);const s=t.querySelector("#home-main"),n=t.querySelector("#home-rail");try{const[{posts:i,total:l},c]=await Promise.all([$.posts({limit:7}),$.albums()]);if(!i.length)s.innerHTML=`<div class="card empty">
        <div class="empty-mark">${g("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const p=(r=i.find(m=>m.pinned))!=null?r:i[0],u=i.filter(m=>m.id!==p.id);s.innerHTML=`
        ${Wt(p)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${l} 篇 ${g("chevron",12)}</a>
        </div>
        <div class="post-list">${u.map(Ze).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}n.innerHTML=`
      <section class="rail-card">
        <h3>关于我</h3>
        <p class="rail-bio">${h(a.bio?a.bio.split(`
`)[0].replace(/^#+\s*/,""):a.signature||"还没有写自我介绍。")}</p>
        <div class="tag-cloud">${a.tags.map(p=>`<a class="tag" href="#/search?q=${encodeURIComponent(p)}">${h(p)}</a>`).join("")||'<span class="muted">还没有标签</span>'}</div>
        <a class="rail-link" href="#/about">了解更多 ${g("chevron",12)}</a>
      </section>

      <section class="rail-card">
        <h3>背景音乐</h3>
        <div class="rail-music">
          <div class="rail-disc ${Qe()?"spin":""}">${g("music",16)}</div>
          <div class="rail-music-meta">
            <b>${h(a.bgmTitle||"未设置音轨")}</b>
            <span>${a.bgmUrl?"正在循环播放":"去设置里上传一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${Qe()?g("pause",13):g("play",13)} ${Qe()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${c.albums.slice(0,3).map(p=>`<a class="rail-album" href="#/album/${p.id}">
                <img src="${h(p.cover)}" alt="">
                <span>${h(p.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${g("mail",13)} 去留言</a>
      </section>`;const d=n.querySelector("#rail-play");window.addEventListener("qz:bgm",()=>{var p;d&&((p=n.querySelector(".rail-disc"))==null||p.classList.toggle("spin",P.isPlaying()),d.innerHTML=`${P.isPlaying()?g("pause",13):g("play",13)} ${P.isPlaying()?"暂停":"播放"}`)}),d==null||d.addEventListener("click",()=>{P.toggle()})}catch(i){v(i.message,"err")}}function Qe(){return P.isPlaying()}const Ts=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function qs(t,e){const a=e.params.sort==="popular"?"popular":"latest",s=e.params.category||"全部",n=e.params.q||"";t.innerHTML=`<div class="page">
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
        ${Ts.map(m=>`<button class="sort-btn ${m.key===a?"active":""}" data-sort="${m.key}">${m.label}</button>`).join("")}
      </div>
    </div>
    ${n?`<p class="search-note">搜索「${h(n)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${Be(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const r=t.querySelector("#archive-list"),i=t.querySelector("#load-more"),l=t.querySelector("#cat-row");let c,d=[];const p=()=>{const m=new Set(["全部"]);d.forEach(o=>o.category&&m.add(o.category)),l.innerHTML=Array.from(m).map(o=>`<button class="chip ${o===s?"active":""}" data-cat="${h(o)}">${h(o)}</button>`).join("")},u=async m=>{m&&(c=void 0,r.innerHTML=Be(2));const o=await $.posts({category:s,sort:a,q:n,limit:8,before:c});d=m?o.posts:d.concat(o.posts);const b=o.posts.map(Ze).join("");m?r.innerHTML=b:r.insertAdjacentHTML("beforeend",b),o.posts.length&&(c=o.posts[o.posts.length-1].at),i.hidden=!o.hasMore,t.querySelector("#archive-sub").textContent=`共 ${o.total} 篇 · 按${a==="popular"?"阅读量":"时间"}排序`,p(),m&&!o.posts.length&&(r.innerHTML=`<div class="card empty">
        <div class="empty-mark">${g("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await u(!1)}catch(m){v(m.message,"err")}finally{i.disabled=!1}}),l.addEventListener("click",m=>{const o=m.target.closest("[data-cat]");if(!o)return;const b=new URLSearchParams;o.dataset.cat&&o.dataset.cat!=="全部"&&b.set("category",o.dataset.cat),a==="popular"&&b.set("sort","popular"),location.hash=`#/posts${b.toString()?"?"+b.toString():""}`}),t.querySelectorAll("[data-sort]").forEach(m=>{m.addEventListener("click",()=>{const o=new URLSearchParams;s!=="全部"&&o.set("category",s),m.dataset.sort==="popular"&&o.set("sort","popular"),location.hash=`#/posts${o.toString()?"?"+o.toString():""}`})});try{await u(!0)}catch(m){v(m.message,"err"),r.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}function st(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var pe=st();function Xt(t){pe=t}var le={exec:()=>null};function re(t){let e=[];return a=>{let s=Math.max(0,Math.min(3,a-1)),n=e[s];return n||(n=t(s),e[s]=n),n}}function w(t,e=""){let a=typeof t=="string"?t:t.source,s={replace:(n,r)=>{let i=typeof r=="string"?r:r.source;return i=i.replace(R.caret,"$1"),a=a.replace(n,i),s},getRegex:()=>new RegExp(a,e)};return s}var Kt=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),Yt="^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)",R={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,textIndentedContinuation:/^(?:\n(?: {4}| {0,3}\t)[ \t]*[^ \t\n][^\n]*)+/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,blockquoteFenceOpen:/^ {0,3}(`{3,}(?=[^`]*$)|~{3,})/,blockquoteFenceClose:/^ {0,3}(`{3,}|~{3,})[ \t]*$/,blockquoteListItemStart:/^ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|$)/,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableHeader:new RegExp(Yt+"(?:\\n|$)"),tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:re(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:re(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:re(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:re(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:re(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:re(t=>new RegExp(`^ {0,${t}}(?:</?(?:${nt})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:re(t=>new RegExp(`^ {0,${t}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},Es=/^(?:[ \t]*(?:\n|$))+/,Ms=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,As=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*)[ \t]*(?=\n|$)|$)/,Le=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Rs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,at=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,nt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Te=w(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",nt).getRegex(),Jt=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,es=w(Jt).replace(/bull/g,at).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,Te).getRegex(),zs=w(Jt).replace(/bull/g,at).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,Te).getRegex(),it=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Cs=/^[^\n]+/,rt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,Ps=w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",rt).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),Is=w(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,at).getRegex(),lt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,_s=w("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",lt).replace("tag",nt).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),ts=t=>w(it).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html",Te).getRegex(),Hs=ts(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Bs=ts(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),zt=/ {0,3}> ?(?:(?!blank)(paragraph)|[^\n]*)(?:\n|$)/,Ds=w(/^(first)(?:next)*/).replace("first",w(zt).replace("blank",/[ \t]*(?:\n|$)| {4}/).getRegex()).replace("next",w(zt).replace("blank",/[ \t]*(?:\n|$)/).getRegex()).replace(/paragraph/g,Bs).getRegex(),ot={blockquote:Ds,code:Ms,def:Ps,fences:As,heading:Rs,hr:Le,html:_s,lheading:es,list:Is,newline:Es,paragraph:Hs,table:le,text:Cs},Os=w(Yt+"(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",Te).getRegex(),js={...ot,lheading:zs,table:Os,paragraph:w(it).replace("hr",Le).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",R.tableHeader).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",Te).getRegex()},Ns={...ot,html:w(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",lt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:le,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:w(it).replace("hr",Le).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",es).getRegex()},Us=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Zs=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ss=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,Fs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,V=/[\p{P}\p{S}]/u,ke=/[\s\p{P}\p{S}]/u,qe=/[^\s\p{P}\p{S}]/u,Gs=w(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,ke).getRegex(),Qs=/[\p{Pi}\p{Ps}"']/u,as=/(?!~)[\p{P}\p{S}]/u,Vs=/(?!~)[\s\p{P}\p{S}]/u,Ws=/(?:[^\s\p{P}\p{S}]|~)/u,Xs=w(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Kt?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ns=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Ks=w(ns,"u").replace(/punct/g,V).getRegex(),Ys=w(ns,"u").replace(/punct/g,as).getRegex(),Js=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,ea=w(Js,"u").replace(/openQuote/g,Qs).replace(/punct/g,V).getRegex(),is="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ta=w(is,"gu").replace(/notPunctSpace/g,qe).replace(/punctSpace/g,ke).replace(/punct/g,V).getRegex(),sa=w(is,"gu").replace(/notPunctSpace/g,Ws).replace(/punctSpace/g,Vs).replace(/punct/g,as).getRegex(),aa="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",na=w(aa,"gu").replace(/notPunctSpace/g,qe).replace(/punctSpace/g,ke).replace(/punct/g,V).getRegex(),ia=w("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,qe).replace(/punctSpace/g,ke).replace(/punct/g,V).getRegex(),ra="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",la=w(ra,"gu").replace(/notPunctSpace/g,qe).replace(/punctSpace/g,ke).replace(/punct/g,V).getRegex(),oa=w(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,V).getRegex(),ca="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",da=w(ca,"gu").replace(/notPunctSpace/g,qe).replace(/punctSpace/g,ke).replace(/punct/g,V).getRegex(),ua=w(/\\(punct)/,"gu").replace(/punct/g,V).getRegex(),pa=w(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,V).getRegex(),ha=w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ma=w(lt).replace("(?:-->|$)","-->").getRegex(),ga=w("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ma).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),rs=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,De=w(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",rs).getRegex(),Fe=/\\[^ \t\n\x00-\x1f]|\\(?=[ \t\n])|[^ \t\n\x00-\x1f\\()]/,ba=w(/\((?:char)*\)/).replace("char",Fe).getRegex(),fa=w(/\((?:char|p1)*\)/).replace("char",Fe).replace("p1",ba).getRegex(),ka=w(/\((?:char|p2)*\)/).replace("char",Fe).replace("p2",fa).getRegex(),va=w(/(?!<)(?:char|p3)+/).replace("char",Fe).replace("p3",ka).getRegex(),ya=w(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",De).replace("href",w(/<(?:\\.|[^\n<>\\])*>|bareHref|(?=\))/).replace("bareHref",va).getRegex()).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),$a=w(/^!?\[(label)\]\[(ref)\]/).replace("label",De).replace("ref",rt).getRegex(),wa=w(/^!?\[(ref)\](?:\[\])?/).replace("ref",rt).getRegex(),Ct=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,xa=w(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",rs).getRegex(),Sa=w("reflink|nolink(?!\\()","g").replace("reflink",w(/^!?\[(label)\]\[(ref)\]/).replace("label",xa).replace("ref",Ct).getRegex()).replace("nolink",w(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ct).getRegex()).getRegex(),Pt=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,La=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,Ta=w(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,La).getRegex(),ct={_backpedal:le,anyPunctuation:ua,anyPunctuationOutsideCode:pa,autolink:ha,blockSkip:Xs,br:ss,code:Zs,del:le,delLDelim:le,delRDelim:le,emStrongLDelim:Ks,emStrongRDelimAst:ta,emStrongRDelimUnd:ia,escape:Us,link:ya,nolink:wa,punctuation:Gs,reflink:$a,reflinkSearch:Sa,tag:ga,text:Fs,url:le},qa={...ct,emStrongLDelim:ea,emStrongRDelimAst:na,emStrongRDelimUnd:la,link:w(/^!?\[(label)\]\((.*?)\)/).replace("label",De).getRegex(),reflink:w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",De).getRegex()},Ke={...ct,emStrongRDelimAst:sa,emStrongLDelim:Ys,delLDelim:oa,delRDelim:da,url:w(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",Ta).replace("protocol",Pt).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:w(/^(?:[A-Za-z0-9.+-]+(?=@)|[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",Pt).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",Kt?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},Ea={...Ke,br:w(ss).replace("{2,}","*").getRegex(),text:w(Ke.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Re={normal:ot,gfm:js,pedantic:Ns},$e={normal:ct,gfm:Ke,breaks:Ea,pedantic:qa},Ma={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},It=t=>Ma[t];function B(t,e){if(e){if(R.escapeTest.test(t))return t.replace(R.escapeReplace,It)}else if(R.escapeTestNoEncode.test(t))return t.replace(R.escapeReplaceNoEncode,It);return t}function Aa(t){return R.numericCharacterReference.test(t)?t.replace(R.numericCharacterReferenceOrAmpersand,(e,a,s)=>{if(a===void 0&&s===void 0)return"&amp;";let n=a===void 0?Number.parseInt(s,16):Number.parseInt(a,10);return n===0||n>1114111||n>=55296&&n<=57343?"�":n===38?"&amp;":String.fromCodePoint(n)}):t}function _t(t){try{t=encodeURI(t).replace(R.percentDecode,"%")}catch{return null}return t}function Ve(t,e){var r;let a=t.replace(R.findPipe,(i,l,c)=>{let d=!1,p=l;for(;--p>=0&&c[p]==="\\";)d=!d;return d?"|":" |"}),s=a.split(R.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!((r=s.at(-1))!=null&&r.trim())&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(R.slashPipe,"|");return s}function K(t,e,a){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function Ht(t){let e=t.split(`
`),a=e.length-1;for(;a>=0&&R.blankLine.test(e[a]);)a--;return e.length-a<=2?t:e.slice(0,a+1).join(`
`)}function Oe(t){return t.trim().replace(R.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function Bt(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let a=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])a++;else if(t[s]===e[1]&&(a--,a<0))return s;return a>0?-2:-1}var fe=new WeakMap;function dt(t){let e={"*":-1,_:-1},a=-1,s=t.length;for(let n=0;n<s;n++){let r=t[n];if(r!=="*"&&r!=="_"&&r!=="~")continue;let i=n===0?`
`:t[n-1],l=n+1;for(;l<s&&t[l]===r;)l++;i!==" "&&i!=="	"&&i!==`
`&&i!=="\r"&&i!=="\f"&&(r==="~"?a=n:e[r]=n),n=l-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:a}}function Ra(t,e){let a=dt(e),s=fe.get(t);s?s.push(a):fe.set(t,[a])}function za(t){let e=fe.get(t);e&&(e.pop(),e.length===0&&fe.delete(t))}function ls(t,e,a){var n;let s=(n=fe.get(t))==null?void 0:n.at(-1);return s&&s.maskedSrc===e?s.lastPossibleEmStrongCloserIndex[a]:dt(e).lastPossibleEmStrongCloserIndex[a]}function os(t,e){var s;let a=(s=fe.get(t))==null?void 0:s.at(-1);return a&&a.maskedSrc===e?a.lastPossibleDelCloserIndex:dt(e).lastPossibleDelCloserIndex}function ze(t,e=0){let a=e,s="";for(let n of t)if(n==="	"){let r=4-a%4;s+=" ".repeat(r),a+=r}else s+=n,a++;return s}function Ca(t){let e,a=!1;return t.map(s=>{var d,p,u;if(a)return s;let{depth:n,expanded:r,keptIndent:i,content:l}=Pa(s,(d=e==null?void 0:e.depth)!=null?d:1/0);if((e==null?void 0:e.depth)!==n&&(e=void 0),e){let m=(p=R.blockquoteFenceClose.exec(l))==null?void 0:p[1];return!m||m[0]!==e.marker[0]||m.length<e.marker.length?i:(e=void 0,r)}if(a=R.blockquoteListItemStart.test(l),a)return s;let c=(u=R.blockquoteFenceOpen.exec(l))==null?void 0:u[1];return c&&(e={marker:c,depth:n}),r}).join(`
`)}function Pa(t,e){let a=0,s=0,n=0,r=0,i="";for(;n<e;){let p=a,u=s;for(;t[p]===" "||t[p]==="	";)u+=Dt(t[p],u),p++;if(t[p]!==">"||u-r>3)break;i+=" ".repeat(u-s)+">",n++,a=p+1,s=u+1,r=t[a]===" "||t[a]==="	"?s+1:s}if(n===0)return{depth:n,expanded:t,keptIndent:t,content:t};let l="",c="";for(;(t[a]===" "||t[a]==="	")&&s<r+4;){let p=Dt(t[a],s);l+=" ".repeat(p),c+=s<r&&p>1?" ".repeat(p):t[a],s+=p,a++}let d=t.slice(a);return{depth:n,expanded:i+l+d,keptIndent:i+c+d,content:" ".repeat(Math.max(0,s-r))+d}}function Dt(t,e){return t==="	"?4-e%4:1}function Ia(t,e){let a="";for(let s=0;s<t.length;s++){if(t[s]==="`"){let n=e.inline.code.exec(t.slice(s));if(n){a+=n[0],s+=n[0].length-1;continue}}if(t[s]==="\\"&&(t[s+1]==="["||t[s+1]==="]")){a+=t[s+1],s++;continue}a+=t[s]}return a}function Ot(t,e,a,s,n){let r=e.href,i=e.title||null,l=Ia(t[1],n),c=t[0].charAt(0)==="!",d=s.state.inLink,p=s.state.linkEmitted,u=s.state.inRawBlock;s.state.inLink=!0,s.state.linkEmitted=!1;let m=s.inlineTokens(l),o=s.state.linkEmitted;if(s.state.linkEmitted=p,s.state.inLink=d,!c){if(o){s.state.inRawBlock=u;return}s.state.linkEmitted=!0}return{type:c?"image":"link",raw:a,href:r,title:i,text:l,tokens:m}}function _a(t,e,a){let s=t.match(a.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(r=>{let i=r.match(a.other.beginningSpace);if(i===null)return r;let[l]=i;return r.slice(Math.min(l.length,n.length))}).join(`
`)}function jt(t,e,a,s){if(!e.includes("<"))return!1;for(let n=0;n<e.length;n++){if(e[n]==="\\"){n++;continue}if(e[n]==="`"){let l=s.inline.code.exec(e.slice(n));if(l){n+=l[0].length-1;continue}}if(e[n]!=="<")continue;let r=t.slice(a+n),i=s.inline.tag.exec(r)||s.inline.autolink.exec(r);if(i){if(i[0].length>e.length-n)return!0;n+=i[0].length-1}}return!1}var oe=class{constructor(t){q(this,"options");q(this,"rules");q(this,"lexer");this.options=t||pe}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let a=this.options.pedantic?e[0]:Ht(e[0]),s=a.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:a,codeBlockStyle:"indented",text:s}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let a=e[0],s=_a(a,e[3]||"",this.rules);return e[3]!==void 0&&(s===""||s.endsWith(`
`))&&(s+=`
`),{type:"code",raw:a,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let a=e[2].trim();if(this.rules.other.endingHash.test(a)){let s=K(a,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(a=s.trim())}return{type:"heading",raw:K(e[0],`
`),depth:e[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:K(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let a=K(e[0],`
`).split(`
`),s="",n="",r=[];for(;a.length>0;){let i=!1,l=[],c;for(c=0;c<a.length;c++)if(this.rules.other.blockquoteStart.test(a[c]))l.push(a[c]),i=!0;else if(!i)l.push(a[c]);else break;a=a.slice(c);let d=l.join(`
`),p=(this.lexer.state.top&&!this.lexer.state.inBlockquote&&d.includes("	")?Ca(l):d).replace(this.rules.other.blockquoteMarkerWhitespace,(b,k,y)=>y.startsWith(" ")?k+" "+y.slice(1):k+ze(y,k.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${d}`:d,n=n?`${n}
${p}`:p;let u=this.lexer.state.top,m=this.lexer.state.inBlockquote;if(this.lexer.state.top=!0,this.lexer.state.inBlockquote=!0,this.lexer.blockTokens(p,r,!0),this.lexer.state.top=u,this.lexer.state.inBlockquote=m,a.length===0)break;let o=r.at(-1);if((o==null?void 0:o.type)==="code"||(o==null?void 0:o.type)==="heading"||(o==null?void 0:o.type)==="hr"||(o==null?void 0:o.type)==="html"||(o==null?void 0:o.type)==="table")break;if((o==null?void 0:o.type)==="blockquote"){let b=o,k=a.join(`
`),y=b.raw+`
`+k.replace(this.rules.other.blockquoteSetextReplace2,"");this.lexer.state.inBlockquote=!0;let x=this.blockquote(y);this.lexer.state.inBlockquote=m,r[r.length-1]=x;let T=y.substring(x.raw.length).replace(/^\n/,""),_=T?T.split(`
`).length:0,A=_?a.slice(0,-_):a;if(A.length>0&&(s=`${s}
${A.join(`
`)}`),n=n.substring(0,n.length-b.text.length)+x.text,a=a.slice(A.length),a.length>0&&this.rules.other.blockquoteStart.test(a[0]))continue;break}else if((o==null?void 0:o.type)==="list"){let b=o,k=b.raw+`
`+a.join(`
`),y=this.list(k);r[r.length-1]=y;let x=y.raw.length>b.raw.length?k.slice(b.raw.length+1,y.raw.length).split(`
`).length:0;if(x>0){let T=a.slice(0,x).join(`
`);s=`${s}
${T}`,n=`${n}
${T}`}if(a=a.slice(x),a.length>0&&!this.rules.other.blockquoteStart.test(a[0]))break;continue}}return{type:"blockquote",raw:s,tokens:r,text:n}}}list(t){var a;let e=this.rules.block.list.exec(t);if(e){if(!this.options.pedantic&&((a=this.lexer.state.lastToken)==null?void 0:a.type)==="text"&&!this.rules.other.listInterruptsParagraph.test(t))return;let s=t,n=()=>s.length-t.length,r=e[1].trim(),i=r.length>1,l={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let c=this.rules.other.listItemRegex(r),d=!1;for(;t;){let m=!1,o="";if(!(e=c.exec(t))||this.rules.block.hr.test(t))break;let b=n();t=t.substring(e[0].length);let k=e[2].split(`
`,1)[0],y=e[1].length,x=this.options.pedantic?ze(k,y):k.replace(this.rules.other.leadingSpaceTab,J=>ze(J,y)),T=t.split(`
`,1)[0],_=!x.trim(),A=0;if(this.options.pedantic?(A=2,o=x.trimStart()):_?A=y+1:(A=x.search(this.rules.other.nonSpaceChar),A=A>4?1:A,o=x.slice(A),A+=y),_&&this.rules.other.blankLine.test(T)&&(t=t.substring(T.length+1),m=!0),!m){let J=this.rules.other.nextBulletRegex(A),ee=this.rules.other.hrRegex(A),W=this.rules.other.fencesBeginRegex(A),z=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(A):this.rules.other.headingBeginRegex(A),X=this.rules.other.htmlBeginRegex(A),j=this.rules.other.blockquoteBeginRegex(A),te=!1;for(;t;){let G=t.split(`
`,1)[0],D;if(T=G,this.options.pedantic?(T=T.replace(this.rules.other.listReplaceNesting,"  "),D=T):D=T.replace(this.rules.other.leadingSpaceTab,I=>ze(I)),W.test(T)||z.test(T)||X.test(T)||j.test(T)||J.test(T)||ee.test(T))break;if(D.search(this.rules.other.nonSpaceChar)>=A||!T.trim())o+=`
`+D.slice(A),te=!1;else{if(_)break;let I=x;if(!this.options.pedantic&&!o.includes(`
`)&&!x.includes("	")){let O;for(;!ee.test(I)&&(O=this.rules.other.nestedBlockMarker.exec(I));)I=I.slice(O[0].length);if(!I.trim())break}if(I.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||W.test(I)||z.test(I)||X.test(I)||ee.test(I))break;if(!this.options.pedantic&&!te){let O=x.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(O)||this.rules.block.heading.test(O)||this.rules.block.hr.test(O))break}let ve=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(T)&&this.rules.block.lheading.test(`${x}
${T}`)?`    ${D.replace(/^ {0,3}/,"")}`:T;o+=`
`+ve,te=!0}_=!T.trim(),t=t.substring(G.length+1),x=D.slice(A)}}let ie=s.slice(b,n());l.loose||(d?l.loose=!0:this.rules.other.doubleBlankLine.test(ie)&&(d=!0)),l.items.push({type:"list_item",raw:ie,task:!!this.options.gfm&&this.rules.other.listIsTask.test(o),loose:!1,text:o,tokens:[]})}let p=l.items.at(-1);if(p)p.raw=p.raw.trimEnd(),p.text=p.text.trimEnd();else return;l.raw=s.slice(0,n()).trimEnd();let u=[];for(let m of l.items)if(this.lexer.state.top=!1,u.push(this.lexer.inlineQueue.length),m.tokens=this.lexer.blockTokens(m.text,[]),!l.loose){let o=m.tokens.filter(k=>k.type==="space"),b=o.length>0&&o.some(k=>this.rules.other.anyLine.test(k.raw));l.loose=b}for(let m=0;m<l.items.length;m++){let o=l.items[m],b=o.tokens[0];if(o.task&&((b==null?void 0:b.type)==="text"||(b==null?void 0:b.type)==="paragraph")){o.text=o.text.replace(this.rules.other.listReplaceTask,""),b.raw=b.raw.replace(this.rules.other.listReplaceTask,""),b.text=b.text.replace(this.rules.other.listReplaceTask,"");let k=this.lexer.inlineQueue;for(let x=u[m];x<k.length;x++)if(k[x].tokens===b.tokens){k[x].src=k[x].src.replace(this.rules.other.listReplaceTask,"");break}let y=this.rules.other.listTaskCheckbox.exec(o.raw);if(y){let x={type:"checkbox",raw:y[0]+" ",checked:y[0]!=="[ ]"};o.checked=x.checked,l.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=x.raw+o.tokens[0].raw,o.tokens[0].text=x.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(x)):o.tokens.unshift({type:"paragraph",raw:x.raw,text:x.raw,tokens:[x]}):o.tokens.unshift(x)}}else o.task&&(o.task=!1)}if(l.loose)for(let m of l.items){m.loose=!0;for(let o of m.tokens)o.type==="text"&&(o.type="paragraph")}return l}}html(t){var a;let e=this.rules.block.html.exec(t);if(e){if(((a=this.lexer.state.lastToken)==null?void 0:a.type)==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(t))return;let s=Ht(e[0]);return{type:"html",block:!0,raw:s,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:s}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&Bt(e[2],"()")!==-1)return;let a=Oe(e[1]),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:a,raw:K(e[0],`
`),href:s,title:n}}}table(t){var i;let e,a;if(this.options.gfm&&!this.options.pedantic){let l=this.rules.other.tableHeader.exec(t);if(!l||!this.rules.other.tableDelimiter.test(l[2])||(e=Ve(l[1]),a=l[2].replace(this.rules.other.tableAlignChars,"").split("|"),e.length!==a.length))return}let s=this.rules.block.table.exec(t);if(!s||!this.rules.other.tableDelimiter.test(s[2]))return;e!=null||(e=Ve(s[1])),a!=null||(a=s[2].replace(this.rules.other.tableAlignChars,"").split("|"));let n=(i=s[3])!=null&&i.trim()?s[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:K(s[0],`
`),header:[],align:[],rows:[]};if(e.length===a.length){for(let l of a)this.rules.other.tableAlignRight.test(l)?r.align.push("right"):this.rules.other.tableAlignCenter.test(l)?r.align.push("center"):this.rules.other.tableAlignLeft.test(l)?r.align.push("left"):r.align.push(null);for(let l=0;l<e.length;l++)r.header.push({text:e[l],tokens:this.lexer.inline(e[l]),header:!0,align:r.align[l]});for(let l of n)r.rows.push(Ve(l,r.header.length).map((c,d)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:r.align[d]})));return r}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let a=e[1].trim();return{type:"heading",raw:K(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:a,tokens:this.lexer.inline(a)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let a=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:a,tokens:this.lexer.inline(a)}}}text(t){let e=this.rules.block.text.exec(t);if(e){let a=e[0],s=e[0],n=this.rules.other.textIndentedContinuation.exec(t.slice(a.length));return n&&(a+=n[0],s+=n[0].replace(this.rules.other.codeRemoveIndent,"")),{type:"text",raw:a,text:s,tokens:this.lexer.inline(s)}}}escape(t){if(t.charCodeAt(0)!==92)return;let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=t.charCodeAt(0);if(e!==91&&e!==33)return;let a=this.rules.inline.link.exec(t);if(a){let s=a[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&jt(t,a[1],s,this.rules))return;let n=a[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let c=K(n.slice(0,-1),"\\");if((n.length-c.length)%2===0)return}else{let c=Bt(a[2],"()");if(c===-2)return;if(c>-1){let d=(a[0].indexOf("!")===0?5:4)+a[1].length+c;a[2]=a[2].substring(0,c),a[0]=a[0].substring(0,d).trim(),a[3]=""}}let r=K(a[0].slice(0,-1),"\\");if((a[0].length-r.length)%2===0)return;let i=a[2],l="";if(this.options.pedantic){let c=this.rules.other.pedanticHrefTitle.exec(i);c&&(i=c[1],l=c[3])}else l=a[3]?a[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),Ot(a,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},a[0],this.lexer,this.rules)}}reflink(t,e){let a=t.charCodeAt(0);if(a!==91&&a!==33)return;let s;if((s=this.rules.inline.reflink.exec(t))||(s=this.rules.inline.nolink.exec(t))){let n=s[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&jt(t,s[1],n,this.rules))return;let r=e[Oe(s[2]||s[1])];if(!r){let i=s[0].charAt(0);return{type:"text",raw:i,text:i}}return Ot(s,r,s[0],this.lexer,this.rules)}}emStrong(t,e,a=""){var m;let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4])return;let n=s[0][0],r=a===n,i=e.length-t.length,l=i;for(;!this.options.pedantic&&l>0&&e[l-1]===n;)l--;let c=(m=[...e.slice(Math.max(0,l-2),l)].at(-1))!=null?m:"",d=c==="*"||c==="_"||!!this.rules.inline.punctuation.exec(c);l<i&&(a=c);let p=l<i?d:a==="*"||a==="_"||!!this.rules.inline.punctuation.exec(a);if(s[4]&&a.match(this.rules.other.unicodeAlphaNumeric))return;let u=s[1]||s[3]||"";if(!u||!a||p){let o=[...s[0]].length-1,b,k,y=o,x=0,T=i-l+o,_=!this.options.pedantic&&!!c.trim()&&(!!u||n==="*"&&!d);if(n!=="*"&&n!=="_")return;let A=n==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,ie=ls(this,e,n),J=e.length-t.length+o;if(ie<J)return;e=e.slice(-1*t.length+o);let ee=ie-J;for(A.lastIndex=0;(s=A.exec(e))!==null&&!(s.index>ee);){if(b=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!b)continue;if(k=[...b].length,s[3]||s[4]){y+=k;continue}else if((s[5]||s[6]||_)&&T%3&&!((T+k)%3)){if(r&&(s[5]||s[6]))break;x+=k;continue}if(y-=k,y>0)continue;k=Math.min(k,k+y+x);let W=[...s[0]][0].length,z=t.slice(0,o+s.index+W+k);if(Math.min(o,k)%2){let j=z.slice(1,-1);return{type:"em",raw:z,text:j,tokens:this.lexer.inlineTokens(j)}}let X=z.slice(2,-2);return{type:"strong",raw:z,text:X,tokens:this.lexer.inlineTokens(X)}}}}codespan(t){if(t.charCodeAt(0)!==96)return;let e=this.rules.inline.code.exec(t);if(e){let a=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return s&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:e[0],text:a}}}br(t){let e=t.charCodeAt(0);if(e!==32&&e!==92&&e!==10)return;let a=this.rules.inline.br.exec(t);if(a)return{type:"br",raw:a[0]}}del(t,e,a=""){if(t.charCodeAt(0)!==126)return;let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!a||this.rules.inline.punctuation.exec(a))){let n=[...s[0]].length-1,r,i,l=n,c=this.rules.inline.delRDelim,d=os(this,e),p=e.length-t.length+n;if(d<p)return;e=e.slice(-1*t.length+n);let u=d-p;for(c.lastIndex=0;(s=c.exec(e))!==null&&!(s.index>u);){if(r=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!r||(i=[...r].length,i!==n))continue;if(s[3]||s[4]){l+=i;continue}if(l-=i,l>0)continue;i=Math.min(i,i+l);let m=[...s[0]][0].length,o=t.slice(0,n+s.index+m+i),b=o.slice(n,-n);return{type:"del",raw:o,text:b,tokens:this.lexer.inlineTokens(b)}}}}autolink(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.autolink.exec(t);if(e){let a,s;return e[2]==="@"?(a=e[1],s="mailto:"+a):(a=e[1],s=a),{type:"link",raw:e[0],text:a,href:s,autolink:!0,tokens:[{type:"text",raw:a,text:a}]}}}url(t){var a,s;let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=(s=(a=this.rules.inline._backpedal.exec(e[0]))==null?void 0:a[0])!=null?s:"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let a=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:a?e[0]:Aa(e[0]),escaped:a}}}},F,cs,Ye,ds,us,ce,U=(ce=class{constructor(e){Tt(this,F);q(this,"tokens");q(this,"options");q(this,"state");q(this,"inlineQueue");q(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||pe,this.options.tokenizer=this.options.tokenizer||new oe,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0,inBlockquote:!1};let a={other:R,block:Re.normal,inline:$e.normal};this.options.pedantic?(a.block=Re.pedantic,a.inline=$e.pedantic):this.options.gfm&&(a.block=Re.gfm,this.options.breaks?a.inline=$e.breaks:a.inline=$e.gfm),this.tokenizer.rules=a}static get rules(){return{block:Re,inline:$e}}static lex(e,a){return new ce(a).lex(e)}static lexInline(e,a){return new ce(a).inlineTokens(e)}lex(e){e=e.replace(R.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let s=this.inlineQueue[a];this.state.inRawBlock=!1,this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,a=[],s=!1){var c,d,p;this.tokenizer.lexer=this;let n=this.state.lastToken;this.options.pedantic&&(e=e.replace(R.tabCharGlobal,"    ").replace(R.spaceLine,""));let r=1/0,i,l=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===oe.prototype.paragraph;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}this.state.lastToken=a.at(-1);let u;if((d=(c=this.options.extensions)==null?void 0:c.block)!=null&&d.some(o=>(u=o.call({lexer:this},e,a))?(e=e.substring(u.raw.length),a.push(u),!0):!1))continue;if(u=this.tokenizer.space(e)){e=e.substring(u.raw.length);let o=a.at(-1);u.raw.length===1&&o!==void 0?o.raw+=`
`:a.push(u);continue}if(u=this.tokenizer.code(e)){e=e.substring(u.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.text,this.inlineQueue.at(-1).src=o.text):a.push(u);continue}if(u=this.tokenizer.fences(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.heading(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.hr(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.blockquote(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.list(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.html(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.def(e)){e=e.substring(u.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.raw,this.inlineQueue.at(-1).src=o.text):(this.tokens.links[u.tag]||(this.tokens.links[u.tag]={href:u.href,title:u.title}),a.push(u));continue}if(u=this.tokenizer.table(e)){e=e.substring(u.raw.length),a.push(u);continue}if(u=this.tokenizer.lheading(e)){e=e.substring(u.raw.length),a.push(u);continue}let m=e;if((p=this.options.extensions)!=null&&p.startBlock){let o=1/0,b=e.slice(1),k;this.options.extensions.startBlock.forEach(y=>{k=y.call({lexer:this},b),typeof k=="number"&&k>=0&&(o=Math.min(o,k))}),o<1/0&&o>=0&&(m=e.substring(0,o+1))}if(this.state.top&&(u=this.tokenizer.paragraph(m))){let o=a.at(-1);(s||o===i&&l)&&(o==null?void 0:o.type)==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text,i=o):(a.push(u),i=u),s=m.length!==e.length,e=e.substring(u.raw.length);continue}if(u=this.tokenizer.text(e)){e=e.substring(u.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+u.raw,o.text+=`
`+u.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):a.push(u);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=n,a}inline(e,a=[]){return this.inlineQueue.push({src:e,tokens:a}),a}linkInText(e){if(!e.includes("["))return!1;let a=this.tokenizer.rules.inline.link;for(let s of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(a.test(s[0])&&e.charAt(s.index-1)!=="!")return!0;for(let s of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let n=s[0],r=n.lastIndexOf("[");if(!(n.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,Oe(n.slice(r+1,-1))))&&!(r>1&&this.linkInText(n.slice(1,r-1))))return!0}return!1}inlineTokens(e,a=[]){this.tokenizer.lexer=this;let s=this.state.linkParenPossible;this.state.linkParenPossible=e.includes(")");try{return me(this,F,cs).call(this,e,a)}finally{this.state.linkParenPossible=s}}infiniteLoopError(e){let a="Infinite loop on byte: "+e;if(this.options.silent)console.error(a);else throw new Error(a)}},F=new WeakSet,cs=function(e,a){var r;let s=e.includes("*")||e.includes("_")||e.includes("~"),n=s||(r=this.options.hooks)!=null&&r.emStrongMask||this.tokenizer.emStrong!==oe.prototype.emStrong||this.tokenizer.del!==oe.prototype.del?me(this,F,us).call(this,e):e;if(!s)return me(this,F,Ye).call(this,e,n,a);Ra(this.tokenizer,n);try{return me(this,F,Ye).call(this,e,n,a)}finally{za(this.tokenizer)}},Ye=function(e,a,s){var l,c,d;let n=!1,r="",i=1/0;for(;e;){if(e.length<i)i=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}n||(r=""),n=!1;let p;if((c=(l=this.options.extensions)==null?void 0:l.inline)!=null&&c.some(o=>(p=o.call({lexer:this},e,s))?(e=e.substring(p.raw.length),s.push(p),!0):!1))continue;if(p=this.tokenizer.escape(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.tag(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.link(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(p.raw.length);let o=s.at(-1);p.type==="text"&&(o==null?void 0:o.type)==="text"?(o.raw+=p.raw,o.text+=p.text):s.push(p);continue}let u=e[0];if(u==="*"||u==="_"){let o=a.length-e.length;if(ls(this.tokenizer,a,u)<=o){let b=1;for(;b<e.length&&e.charCodeAt(b)===u.charCodeAt(0);)b++;let k=e.substring(0,b),y=s.at(-1);(y==null?void 0:y.type)==="text"&&!y.escaped?(y.raw+=k,y.text+=k):s.push({type:"text",raw:k,text:k,escaped:!1}),e=e.substring(b),r=u,n=!0;continue}}else if(u==="~"){let o=a.length-e.length;if(os(this.tokenizer,a)<=o){let b=1;for(;b<e.length&&e.charCodeAt(b)===126;)b++;let k=e.substring(0,b),y=s.at(-1);(y==null?void 0:y.type)==="text"&&!y.escaped?(y.raw+=k,y.text+=k):s.push({type:"text",raw:k,text:k,escaped:!1}),e=e.substring(b),r=u,n=!0;continue}}if(p=this.tokenizer.emStrong(e,a,r)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.codespan(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.br(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.del(e,a,r)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.autolink(e)){e=e.substring(p.raw.length),s.push(p);continue}if(!this.state.inLink&&(p=this.tokenizer.url(e))){e=e.substring(p.raw.length),s.push(p);continue}let m=e;if((d=this.options.extensions)!=null&&d.startInline){let o=1/0,b=e.slice(1),k;this.options.extensions.startInline.forEach(y=>{k=y.call({lexer:this},b),typeof k=="number"&&k>=0&&(o=Math.min(o,k))}),o<1/0&&o>=0&&(m=e.substring(0,o+1))}if(p=this.tokenizer.inlineText(m)){e=e.substring(p.raw.length),p.raw.slice(-1)!=="_"&&(r=p.raw.slice(-1)),n=!0;let o=s.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=p.raw,o.text+=p.text):s.push(p);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return s},ds=function(e){let{blockSkip:a,tag:s,autolink:n}=this.tokenizer.rules.inline,r="",i=0,l;for(a.lastIndex=0;l=a.exec(e);){let c=l.index+(l[2]?l[2].length:0),d=l.index+l[0].length;if(e.charAt(c)==="<"){let p=e.slice(c),u=s.exec(p)||n.exec(p);if(!u){a.lastIndex=c+1;continue}d=c+u[0].length,a.lastIndex=d}r+=e.slice(i,c)+"["+"a".repeat(d-c-2)+"]",i=d}return r+e.slice(i)},us=function(e){var s,n,r;let a=e;if(this.tokens.links&&e.includes("[")){let i=this.tokenizer.rules.inline.reflinkSearch,l=c=>{let d=c.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,Oe(c.slice(d+1,-1))))return c;if(d>1&&c.charAt(0)!=="!"){let p=c.slice(1,d-1);if(this.linkInText(p))return"["+p.replace(i,l)+"]["+"a".repeat(c.length-d-2)+"]"}return"["+"a".repeat(c.length-2)+"]"};a=a.replace(i,l)}return a=a.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(i,l,c)=>c?"+".repeat(i.length):l?l+i.slice(l.length,-l.length).replace(/`/g,"+")+l:i),a=me(this,F,ds).call(this,a),a=(r=(n=(s=this.options.hooks)==null?void 0:s.emStrongMask)==null?void 0:n.call({lexer:this},a))!=null?r:a,a},ce);function ps(t){return t.map(e=>e.type==="codespan"||e.type==="escape"?{...e,text:B(e.text,!0)}:"tokens"in e&&e.tokens?{...e,tokens:ps(e.tokens)}:e)}var je=class{constructor(t){q(this,"options");q(this,"parser");this.options=t||pe}space(t){return""}code({text:t,lang:e,escaped:a}){var r;let s=(r=(e||"").match(R.notSpaceStart))==null?void 0:r[0],n=t?t.replace(R.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+B(s)+'">'+(a?n:B(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:B(n,!0))+`</code></pre>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${B(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:a,tokens:s,autolink:n}){let r=n?B(a,!0):this.parser.parseInline(s),i=_t(t);if(i===null)return r;t=B(i,n);let l='<a href="'+t+'"';return e&&(l+=' title="'+B(e)+'"'),l+=">"+r+"</a>",l}image({href:t,title:e,text:a,tokens:s}){s&&(a=this.parser.parseInline(ps(s),this.parser.textRenderer));let n=_t(t);if(n===null)return B(a);t=n;let r=`<img src="${B(t)}" alt="${B(a)}"`;return e&&(r+=` title="${B(e)}"`),r+=">",r}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:B(t.text)}},ut=class{constructor(){q(this,"parser")}strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return`
`}checkbox({raw:t}){return t}},Z=class Je{constructor(e){q(this,"options");q(this,"renderer");q(this,"textRenderer");this.options=e||pe,this.options.renderer=this.options.renderer||new je,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ut,this.textRenderer.parser=this}static parse(e,a){return new Je(a).parse(e)}static parseInline(e,a){return new Je(a).parseInline(e)}parse(e){var s;this.renderer.parser=this;let a="";for(let n=0;n<e.length;n++){let r=e[n],i=(s=this.options.extensions)==null?void 0:s.renderers;if(i&&Object.hasOwn(i,r.type)&&i[r.type]){let c=r,d=i[c.type].call({parser:this},c);if(d!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(c.type)){a+=d===!1?"":d!=null?d:"";continue}}let l=r;switch(l.type){case"space":{a+=this.renderer.space(l);break}case"hr":{a+=this.renderer.hr(l);break}case"heading":{a+=this.renderer.heading(l);break}case"code":{a+=this.renderer.code(l);break}case"table":{a+=this.renderer.table(l);break}case"blockquote":{a+=this.renderer.blockquote(l);break}case"list":{a+=this.renderer.list(l);break}case"checkbox":{a+=this.renderer.checkbox(l);break}case"html":{a+=this.renderer.html(l);break}case"def":{a+=this.renderer.def(l);break}case"paragraph":{a+=this.renderer.paragraph(l);break}case"text":{a+=this.renderer.text(l);break}default:{let c='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return a}parseInline(e,a=this.renderer){var n;this.renderer.parser=this;let s="";for(let r=0;r<e.length;r++){let i=e[r],l=(n=this.options.extensions)==null?void 0:n.renderers;if(l&&Object.hasOwn(l,i.type)&&l[i.type]){let d=l[i.type].call({parser:this},i);if(d!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){s+=d===!1?"":d!=null?d:"";continue}}let c=i;switch(c.type){case"escape":{s+=a.text(c);break}case"html":{s+=a.html(c);break}case"link":{s+=a.link(c);break}case"image":{s+=a.image(c);break}case"checkbox":{s+=a.checkbox(c);break}case"strong":{s+=a.strong(c);break}case"em":{s+=a.em(c);break}case"codespan":{s+=a.codespan(c);break}case"br":{s+=a.br(c);break}case"del":{s+=a.del(c);break}case"text":{s+=a.text(c);break}default:{let d='Token with "'+c.type+'" type was not found.';if(this.options.silent)return console.error(d),"";throw new Error(d)}}}return s}},Pe,Se=(Pe=class{constructor(t){q(this,"options");q(this,"block");this.options=t||pe}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?U.lex:U.lexInline}provideParser(t=this.block){return t?Z.parse:Z.parseInline}},q(Pe,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),q(Pe,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),Pe);function se(t,e){if(Array.isArray(e))for(let a=0;a<e.length;a++)t.push(e[a]);else t.push(e)}var Ha=class{constructor(...t){q(this,"defaults",st());q(this,"options",this.setOptions);q(this,"parse",this.parseMarkdown(!0));q(this,"parseInline",this.parseMarkdown(!1));q(this,"Parser",Z);q(this,"Renderer",je);q(this,"TextRenderer",ut);q(this,"Lexer",U);q(this,"Tokenizer",oe);q(this,"Hooks",Se);this.use(...t)}walkTokens(t,e){var s,n;let a=[];for(let r of t)switch(se(a,e.call(this,r)),r.type){case"table":{let i=r;for(let l of i.header)se(a,this.walkTokens(l.tokens,e));for(let l of i.rows)for(let c of l)se(a,this.walkTokens(c.tokens,e));break}case"list":{let i=r;se(a,this.walkTokens(i.items,e));break}default:{let i=r;(n=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&n[i.type]?this.defaults.extensions.childTokens[i.type].forEach(l=>{if(i[l]){let c=i[l].flat(1/0);se(a,this.walkTokens(c,e))}}):i.tokens&&se(a,this.walkTokens(i.tokens,e))}}return a}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(a=>{let s={...a};if(s.async=this.defaults.async||s.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let r=e.renderers[n.name];r?e.renderers[n.name]=function(...i){let l=n.renderer.apply(this,i);return l===!1&&(l=r.apply(this,i)),l}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=e[n.level];r?r.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),a.renderer){let n=this.defaults.renderer||new je(this.defaults);for(let r in a.renderer){if(!(r in n))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;let i=r,l=a.renderer[i],c=n[i];n[i]=(...d)=>{let p=l.apply(n,d);return p===!1&&(p=c.apply(n,d)),p===!1?"":p!=null?p:""}}s.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new oe(this.defaults);for(let r in a.tokenizer){if(!(r in n))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let i=r,l=a.tokenizer[i],c=n[i];n[i]=(...d)=>{let p=l.apply(n,d);return p===!1&&(p=c.apply(n,d)),p}}s.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new Se;for(let r in a.hooks){if(!(r in n))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;let i=r,l=a.hooks[i],c=n[i];Se.passThroughHooks.has(r)?n[i]=d=>{if(n.options.async&&Se.passThroughHooksRespectAsync.has(r))return(async()=>{let u=await l.call(n,d);return c.call(n,u)})();let p=l.call(n,d);return c.call(n,p)}:n[i]=(...d)=>{if(n.options.async)return(async()=>{let u=await l.apply(n,d);return u===!1&&(u=await c.apply(n,d)),u})();let p=l.apply(n,d);return p===!1&&(p=c.apply(n,d)),p}}s.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,r=a.walkTokens;s.walkTokens=function(i){let l=[];return se(l,r.call(this,i)),n&&se(l,n.call(this,i)),l}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return U.lex(t,e!=null?e:this.defaults)}parser(t,e){return Z.parse(t,e!=null?e:this.defaults)}parseMarkdown(t){return(e,a)=>{let s={...a},n={...this.defaults,...s},r=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return r(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(e):e,l=await(n.hooks?await n.hooks.provideLexer(t):t?U.lex:U.lexInline)(i,n),c=n.hooks?await n.hooks.processAllTokens(l):l;n.walkTokens&&await Promise.all(this.walkTokens(c,n.walkTokens));let d=await(n.hooks?await n.hooks.provideParser(t):t?Z.parse:Z.parseInline)(c,n);return n.hooks?await n.hooks.postprocess(d):d})().catch(r);try{n.hooks&&(e=n.hooks.preprocess(e));let i=(n.hooks?n.hooks.provideLexer(t):t?U.lex:U.lexInline)(e,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let l=(n.hooks?n.hooks.provideParser(t):t?Z.parse:Z.parseInline)(i,n);return n.hooks&&(l=n.hooks.postprocess(l)),l}catch(i){return r(i)}}}onError(t,e){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+B(a.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(a);throw a}}},de=new Ha;function M(t,e){return de.parse(t,e)}M.options=M.setOptions=function(t){return de.setOptions(t),M.defaults=de.defaults,Xt(M.defaults),M};M.getDefaults=st;M.defaults=pe;function Ba(...t){return de.use(...t),M.defaults=de.defaults,Xt(M.defaults),M}M.use=Ba;M.walkTokens=function(t,e){return de.walkTokens(t,e)};M.parseInline=de.parseInline;M.Parser=Z;M.parser=Z.parse;M.Renderer=je;M.TextRenderer=ut;M.Lexer=U;M.lexer=U.lex;M.Tokenizer=oe;M.Hooks=Se;M.parse=M;M.options;M.setOptions;M.walkTokens;M.parseInline;Z.parse;U.lex;M.setOptions({gfm:!0,breaks:!0});function pt(t){if(!t)return"";const e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;");return M.parse(e,{async:!1}).replace(/<a href="(https?:\/\/[^"]+)"/g,'<a href="$1" target="_blank" rel="noopener noreferrer"')}async function Da(t,e){var c,d,p;const a=Number(e.params.id);t.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const s=await $.post(a);t.innerHTML=`<div class="page narrow">
    <a class="back-link" href="#/posts">${g("back",14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${s.pinned?`<span class="pill pill-pin">${g("pin",11)}置顶</span>`:""}
          <a class="pill" href="#/posts?category=${encodeURIComponent(s.category)}">${h(s.category)}</a>
          ${s.visibility!=="public"?`<span class="pill pill-lock">${g("lock",11)}${s.visibility==="private"?"仅自己可见":"不公开列出"}</span>`:""}
        </div>
        <h1 class="article-title">${h(s.title||"无标题")}</h1>
        <div class="article-meta">
          ${Y(s.author.avatar,s.author.nickname,34,s.author.uin)}
          <div class="article-meta-text">
            <b>${h(s.author.nickname)}</b>
            <span>${At(s.at)} · ${s.readingTime} 分钟阅读 · ${s.views} 次浏览</span>
          </div>
          ${s.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${s.id}">${g("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${g("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${s.cover&&!((c=s.content)!=null?c:"").includes(s.cover)?`<figure class="article-cover"><img src="${h(s.cover)}" alt="" data-zoom="${h(s.cover)}"></figure>`:""}

      <div class="article-body markdown">${pt((d=s.content)!=null?d:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${s.liked?"active":""}" id="like-btn">
          ${g("heart",16)}<span>${s.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${s.likes.length?`${s.likes.slice(0,8).map(u=>h(u.nickname)).join("、")} 觉得不错`:`写于 ${At(s.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${s.commentNum}</span></h2>
      <div id="comment-area">${Rt(s.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,Ue(t);const n=t.querySelector("#like-btn");n.addEventListener("click",async()=>{try{const u=await $.likePost(s.id);n.classList.toggle("active",u.liked),n.querySelector("span").textContent=String(u.count||"赞")}catch(u){v(u.message,"err")}}),(p=t.querySelector("#del-post"))==null||p.addEventListener("click",async()=>{if(await He("删除文章",`《${s.title}》删除后无法恢复，确定吗？`))try{await $.deletePost(s.id),v("已删除","ok"),location.hash="#/posts"}catch(u){v(u.message,"err")}});let r="";const i=t.querySelector("#reply-hint"),l=t.querySelector("#comment-area");l.addEventListener("click",async u=>{var k,y;const m=u.target,o=m.closest("[data-reply]");if(o){r=(k=o.dataset.reply)!=null?k:"",i.textContent=`回复 ${r}`,t.querySelector("#comment-form textarea").focus();return}const b=m.closest("[data-del-comment]");if(b){if(!await He("删除评论","确定删除这条评论吗？"))return;try{await $.deleteComment(s.id,Number(b.dataset.delComment)),(y=b.closest(".comment"))==null||y.remove(),v("已删除","ok")}catch(x){v(x.message,"err")}}}),t.querySelector("#comment-form").addEventListener("submit",async u=>{u.preventDefault();const o=u.currentTarget.querySelector("textarea"),b=o.value.trim();if(b)try{const k=await $.commentPost(s.id,b,r);s.comments.push(k),l.innerHTML=Rt(s.comments),o.value="",r="",i.textContent="",v("评论已发布","ok")}catch(k){v(k.message,"err")}})}const Nt=2560,Oa=3*1024*1024;function ja(t){return"createImageBitmap"in window?createImageBitmap(t).catch(()=>Ut(t)):Ut(t)}function Ut(t){return new Promise((e,a)=>{const s=URL.createObjectURL(t),n=new Image;n.onload=()=>{URL.revokeObjectURL(s),e(n)},n.onerror=()=>{URL.revokeObjectURL(s),a(new Error("图片解码失败，可能是不支持的格式"))},n.src=s})}function We(t,e,a){return new Promise((s,n)=>{t.toBlob(r=>r?s(r):n(new Error("图片压缩失败")),e,a)})}async function et(t,e=Oa){const a={file:t,width:0,height:0,size:t.size,compressed:!1,originalSize:t.size};if(t.type==="image/gif"||t.type==="image/svg+xml")return a;const s=await ja(t),n="width"in s?s.width:0,r="height"in s?s.height:0;if(!n||!r||(a.width=n,a.height=r,t.size<=2*1024*1024&&Math.max(n,r)<=Nt))return a;const i=Math.min(1,Nt/Math.max(n,r));let l=Math.round(n*i),c=Math.round(r*i);const d=document.createElement("canvas");d.width=l,d.height=c;const p=d.getContext("2d");if(!p)return a;p.imageSmoothingQuality="high",p.drawImage(s,0,0,l,c),"close"in s&&typeof s.close=="function"&&s.close();const u="image/webp";let m=.9,o=await We(d,u,m),b=0;for(;o.size>e&&b<4;)m=Math.max(.6,m-.1),o=await We(d,u,m),o.size>e&&b===3&&(l=Math.round(l*.8),c=Math.round(c*.8),d.width=l,d.height=c,p.drawImage(s,0,0,l,c),o=await We(d,u,m)),b++;const k=t.name.replace(/\.[^.]+$/,"")+".webp",y=new File([o],k,{type:u});return{file:y,width:l,height:c,size:y.size,compressed:!0,originalSize:t.size}}function _e(t){return t>=1024*1024?`${(t/1024/1024).toFixed(1)}MB`:`${Math.round(t/1024)}KB`}const Na=["随笔","城市","旅行","技术","阅读","生活"],Ce="`".repeat(3),Zt=30;async function Ft(t,e){var ft,kt,vt,yt,$t,wt,xt;const a=e.params.id?Number(e.params.id):0;let s=null;if(a&&(s=await $.post(a),!s.canEdit)){t.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}let n=(ft=s==null?void 0:s.cover)!=null?ft:"";const r=(kt=s==null?void 0:s.images)!=null?kt:[],i=`qz.draft.${a||"new"}`;let l=window.innerWidth>=1100?"split":"edit";t.innerHTML=`<div class="page">
    <div class="editor-head">
      <a class="back-link" href="${a?`#/post/${a}`:"#/home"}">${g("back",14)} 返回</a>
      <div class="editor-actions">
        <span class="save-state" id="save-state">未保存</span>
        <div class="mode-switch" id="mode-switch">
          <button data-mode="edit" title="只显示编辑区">编辑</button>
          <button data-mode="split" title="左右分屏">分屏</button>
          <button data-mode="preview" title="只看效果">预览</button>
        </div>
        <button class="btn btn-primary btn-sm" id="save-btn">${g("check",13)} ${a?"保存修改":"发布"}</button>
      </div>
    </div>

    <div id="draft-bar" class="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="editor-grid">
      <div class="editor-main card">
        <input class="title-input" id="title" maxlength="80" placeholder="标题" value="${h((vt=s==null?void 0:s.title)!=null?vt:"")}">

        <div class="md-toolbar" id="toolbar">
          <div class="tb-group">
            <button class="tb-btn" data-cmd="h1" title="一级标题">H1</button>
            <button class="tb-btn" data-cmd="h2" title="二级标题">H2</button>
            <button class="tb-btn" data-cmd="h3" title="三级标题">H3</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="bold" title="加粗（Ctrl+B）"><b>B</b></button>
            <button class="tb-btn" data-cmd="italic" title="斜体（Ctrl+I）"><i>I</i></button>
            <button class="tb-btn" data-cmd="strike" title="删除线"><s>S</s></button>
            <button class="tb-btn" data-cmd="code" title="行内代码">${g("codeInline",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="quote" title="引用">${g("message",15)}</button>
            <button class="tb-btn" data-cmd="codeblock" title="代码块">${g("codeBlock",15)}</button>
            <button class="tb-btn" data-cmd="ul" title="无序列表">${g("listUl",15)}</button>
            <button class="tb-btn" data-cmd="ol" title="有序列表">${g("listOl",15)}</button>
            <button class="tb-btn" data-cmd="task" title="任务列表">${g("task",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="link" title="链接（Ctrl+K）">${g("link",15)}</button>
            <label class="tb-btn" title="插入图片（也可直接粘贴/拖入）">
              ${g("image",15)}<input type="file" id="img-input" accept="image/*" multiple hidden>
            </label>
            <button class="tb-btn" data-cmd="table" title="表格">${g("table",15)}</button>
            <button class="tb-btn" data-cmd="hr" title="分割线">—</button>
          </div>
          <span class="tb-hint">可直接粘贴截图</span>
        </div>

        <div class="editor-split" id="split" data-mode="${l}">
          <textarea class="md-input" id="content" spellcheck="false" placeholder="从这里开始写…

## 小标题
- 列表项
> 引用一段话

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${h((yt=s==null?void 0:s.content)!=null?yt:"")}</textarea>
          <div class="md-preview markdown" id="preview"></div>
        </div>

        <div class="editor-status">
          <span id="stat-words">0 字</span>
          <span class="dot">·</span>
          <span id="stat-read">约 1 分钟</span>
          <span class="dot">·</span>
          <span class="status-note">图片单张上限 ${Zt}MB，超过会自动压缩</span>
        </div>
      </div>

      <aside class="editor-side">
        <section class="rail-card">
          <h3>封面</h3>
          <div class="cover-slot" id="cover-slot">
            ${n?`<img src="${h(n)}" alt="">`:"<span>点击上传封面</span>"}
            <input type="file" id="cover-input" accept="image/*" hidden>
          </div>
        </section>

        <section class="rail-card">
          <h3>文章设置</h3>
          <label class="field">
            <span>分类</span>
            <input class="input" id="category" list="cat-list" maxlength="16" value="${h(($t=s==null?void 0:s.category)!=null?$t:"随笔")}">
            <datalist id="cat-list">${Na.map(f=>`<option value="${f}">`).join("")}</datalist>
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
            ${r.map(f=>`<img src="${h(f)}" alt="" data-zoom="${h(f)}">`).join("")||'<span class="muted">还没有配图</span>'}
          </div>
        </section>
      </aside>
    </div>
  </div>`;const c=t.querySelector("#title"),d=t.querySelector("#content"),p=t.querySelector("#preview"),u=t.querySelector("#split"),m=t.querySelector("#thumbs"),o=t.querySelector("#save-state"),b=t.querySelector("#stat-words"),k=t.querySelector("#stat-read"),y=t.querySelector("#draft-bar");let x=0;const T=()=>{window.clearTimeout(x),x=window.setTimeout(()=>{l!=="edit"&&(p.innerHTML=d.value.trim()?pt(d.value):'<p class="muted">预览会显示在这里</p>')},120)},_=()=>{const S=d.value.replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/[#>*_`~\-|]/g,"").replace(/\s/g,"").length;b.textContent=`${S} 字`,k.textContent=`约 ${Math.max(1,Math.round(S/400))} 分钟`},A=f=>{l=f,u.dataset.mode=f,t.querySelectorAll("#mode-switch button").forEach(S=>{S.classList.toggle("active",S.dataset.mode===f)}),f!=="edit"&&T()};t.querySelectorAll("#mode-switch button").forEach(f=>{f.addEventListener("click",()=>A(f.dataset.mode))});const ie=()=>{try{const f=localStorage.getItem(i);return f?JSON.parse(f):null}catch{return null}},J=()=>({title:c.value,content:d.value,category:t.querySelector("#category").value,visibility:t.querySelector("#visibility").value,pinned:t.querySelector("#pinned").checked,cover:n,savedAt:Date.now()});let ee=0;const W=()=>{window.clearTimeout(ee),o.textContent="未保存",o.classList.add("dirty"),ee=window.setTimeout(()=>{localStorage.setItem(i,JSON.stringify(J()));const f=new Date;o.textContent=`已自动保存 ${String(f.getHours()).padStart(2,"0")}:${String(f.getMinutes()).padStart(2,"0")}`,o.classList.remove("dirty")},1200)},z=ie();if(z&&(z.content!==((wt=s==null?void 0:s.content)!=null?wt:"")||z.title!==((xt=s==null?void 0:s.title)!=null?xt:""))){const f=new Date(z.savedAt);t.querySelector("#draft-text").textContent=`发现 ${f.getMonth()+1} 月 ${f.getDate()} 日 ${String(f.getHours()).padStart(2,"0")}:${String(f.getMinutes()).padStart(2,"0")} 的草稿`,y.hidden=!1,t.querySelector("#draft-restore").addEventListener("click",()=>{c.value=z.title,d.value=z.content,t.querySelector("#category").value=z.category||"随笔",t.querySelector("#visibility").value=z.visibility||"public",t.querySelector("#pinned").checked=!!z.pinned,n=z.cover||n,n&&(t.querySelector("#cover-slot").innerHTML=`<img src="${h(n)}" alt="">`),y.hidden=!0,_(),T(),v("已恢复草稿","ok")}),t.querySelector("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(i),y.hidden=!0})}const X=()=>{_(),T(),W()},j=(f,S=0,L=0)=>{const E=d.selectionStart,C=d.selectionEnd;d.value=d.value.slice(0,E)+f+d.value.slice(C),d.selectionStart=E+S,d.selectionEnd=E+(L||f.length),d.focus(),X()},te=(f,S,L)=>{const E=d.selectionStart,C=d.selectionEnd,he=d.value.slice(E,C)||L;j(f+he+S,f.length,f.length+he.length)},G=(f,S)=>{const L=d.value.lastIndexOf(`
`,Math.max(0,d.selectionStart-1))+1,E=d.value.indexOf(`
`,d.selectionEnd),C=E===-1?d.value.length:E,Ee=(d.value.slice(L,C)||S).split(`
`),Me=Ee.every(Ae=>Ae.startsWith(f)),St=Ee.map(Ae=>Me?Ae.slice(f.length):f+Ae.replace(/^([-*+]\s+|\d+\.\s+|>\s+)/,"")).join(`
`);d.value=d.value.slice(0,L)+St+d.value.slice(C),d.selectionStart=L,d.selectionEnd=L+St.length,d.focus(),X()},D={h1:()=>G("# ","一级标题"),h2:()=>G("## ","二级标题"),h3:()=>G("### ","三级标题"),bold:()=>te("**","**","加粗文字"),italic:()=>te("*","*","斜体文字"),strike:()=>te("~~","~~","删除线"),code:()=>te("`","`","code"),quote:()=>G("> ","引用一段话"),ul:()=>G("- ","列表项"),ol:()=>G("1. ","列表项"),task:()=>G("- [ ] ","待办事项"),codeblock:()=>j(`
${Ce}
// code
${Ce}
`,Ce.length+2,Ce.length+10),hr:()=>j(`
---
`),link:()=>{const f=d.value.slice(d.selectionStart,d.selectionEnd);j(`[${f||"链接文字"}](https://)`,f?f.length+3:1,f?f.length+11:5)},table:()=>j(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};t.querySelector("#toolbar").addEventListener("click",f=>{var L,E;const S=f.target.closest("[data-cmd]");S&&(f.preventDefault(),(E=D[(L=S.dataset.cmd)!=null?L:""])==null||E.call(D))});const I=new Set,ve=async(f,S="图片")=>{for(const L of f){if(!L.type.startsWith("image/")){v("只能插入图片文件","err");continue}const E=`${L.name}-${L.size}`;if(!I.has(E)){I.add(E);try{v(`正在处理 ${L.name||S}…`);const C=await et(L);if(C.size>Zt*1024*1024)throw new Error(`压缩后仍有 ${_e(C.size)}，超过上限`);const{url:he}=await $.upload(C.file);r.push(he);const Ee=(L.name||S).replace(/\.[^.]+$/,"")||S;j(`
![${Ee}](${he})
`),m.innerHTML=r.map(Me=>`<img src="${h(Me)}" alt="" data-zoom="${h(Me)}">`).join(""),v(C.compressed?`已压缩 ${_e(C.originalSize)} → ${_e(C.size)}`:"图片已插入","ok")}catch(C){v(C.message,"err")}finally{I.delete(E)}}}};d.addEventListener("paste",f=>{const S=f.clipboardData;if(!S)return;const L=Array.from(S.items).filter(E=>E.kind==="file"&&E.type.startsWith("image/")).map(E=>E.getAsFile()).filter(E=>!!E);L.length&&(f.preventDefault(),ve(L,"粘贴的图片"))});const O=t.querySelector(".editor-main");O.addEventListener("dragover",f=>{var S;(S=f.dataTransfer)!=null&&S.types.includes("Files")&&(f.preventDefault(),O.classList.add("dropping"))}),O.addEventListener("dragleave",()=>O.classList.remove("dropping")),O.addEventListener("drop",f=>{var L,E;const S=Array.from((E=(L=f.dataTransfer)==null?void 0:L.files)!=null?E:[]).filter(C=>C.type.startsWith("image/"));S.length&&(f.preventDefault(),O.classList.remove("dropping"),ve(S))}),t.querySelector("#img-input").addEventListener("change",async f=>{var E;const S=f.target,L=Array.from((E=S.files)!=null?E:[]);L.length&&await ve(L),S.value=""}),d.addEventListener("keydown",f=>{const S=f.metaKey||f.ctrlKey;if(f.key==="Tab"){f.preventDefault(),j("  ");return}if(!S)return;const L=f.key.toLowerCase();L==="b"?(f.preventDefault(),D.bold()):L==="i"?(f.preventDefault(),D.italic()):L==="k"?(f.preventDefault(),D.link()):L==="s"&&(f.preventDefault(),bt())});const gt=t.querySelector("#cover-slot"),Ge=t.querySelector("#cover-input");gt.addEventListener("click",()=>Ge.click()),Ge.addEventListener("change",async()=>{var S;const f=(S=Ge.files)==null?void 0:S[0];if(f)try{const L=await et(f),{url:E}=await $.upload(L.file);n=E,gt.innerHTML=`<img src="${h(E)}" alt="">`,W(),v("封面已更新","ok")}catch(L){v(L.message,"err")}}),c.addEventListener("input",W),d.addEventListener("input",X),t.querySelectorAll("#category,#visibility,#pinned").forEach(f=>f.addEventListener("change",W));const bt=async()=>{const f={title:c.value.trim(),content:d.value,cover:n,category:t.querySelector("#category").value.trim()||"随笔",visibility:t.querySelector("#visibility").value,pinned:t.querySelector("#pinned").checked,images:r};if(!f.title&&!f.content.trim()){v("写个标题或正文再发布","err");return}const S=t.querySelector("#save-btn");S.disabled=!0,S.textContent="保存中…";try{const L=a?await $.updatePost(a,f):await $.createPost(f);localStorage.removeItem(i),v(a?"已保存":"已发布","ok"),location.hash=`#/post/${L.id}`}catch(L){v(L.message,"err"),S.disabled=!1,S.innerHTML=`${g("check",13)} ${a?"保存修改":"发布"}`}};t.querySelector("#save-btn").addEventListener("click",()=>void bt()),_(),A(l),T(),c.addEventListener("keydown",f=>{f.key==="Enter"&&(f.preventDefault(),d.focus())})}async function Ua(t,e){t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${g("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const a=t.querySelector("#album-grid"),s=async()=>{const n=await $.albums(),r=n.albums.reduce((i,l)=>i+l.count,0);t.querySelector("#album-sub").textContent=`${n.albums.length} 个相册 · 共 ${r} 张照片`,a.innerHTML=n.albums.length?n.albums.map(Ss).join(""):`<div class="card empty"><div class="empty-mark">${g("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await s(),t.querySelector("#new-album").addEventListener("click",async()=>{await tt({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async n=>{const r=n.querySelector("#a-name").value.trim();return r?(await $.createAlbum({name:r,description:n.querySelector("#a-desc").value.trim(),privacy:n.querySelector("#a-priv").value}),v("相册已创建","ok"),await s(),!0):(v("请填写相册名称","err"),!1)}})})}async function Za(t,e){const a=Number(e.params.id);let s=await $.album(a);const n=()=>{var r,i,l;t.innerHTML=`<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${g("back",14)} 全部相册</a>
          <h1>${h(s.name)}</h1>
          <p class="page-sub">${h(s.description||"没有描述")} · ${s.count} 张 · ${ne(s.at)}创建</p>
        </div>
        ${s.canEdit?`<div class="head-btns">
                <label class="btn btn-primary btn-sm" title="单张上限 30MB，超过会自动压缩">${g("upload",14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden>
                </label>
                <button class="btn btn-ghost btn-sm danger" id="del-album">${g("trash",14)}</button>
              </div>`:""}
      </header>
      <div class="photo-grid" id="photo-grid">
        ${(r=s.photos)!=null&&r.length?s.photos.map(c=>`<figure class="photo" data-pid="${c.id}">
                    <img src="${h(c.url)}" alt="${h(c.caption)}" loading="lazy" data-zoom="${h(c.url)}">
                    <figcaption>
                      <span>${h(c.caption||ne(c.at))}</span>
                      <span class="photo-like">${g("heart",12)} ${c.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${c.id}" title="赞">${g("heart",14)}</button>
                      ${s.canEdit?`<button class="photo-btn danger" data-del="${c.id}" title="删除">${g("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${g("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,Ue(t),(i=t.querySelector("#photo-file"))==null||i.addEventListener("change",async c=>{var u;const d=c.target,p=Array.from((u=d.files)!=null?u:[]);if(p.length){v(`正在处理 ${p.length} 张…`);try{const m=[],o=[],b=[],k=[];let y=0;for(const x of p){const T=await et(x),{url:_}=await $.upload(T.file);m.push(_),o.push(T.size),b.push(T.width),k.push(T.height),y+=T.originalSize-T.size}s=await $.addPhotos(s.id,m,{sizes:o,widths:b,heights:k}),v(y>512*1024?`上传完成，压缩节省 ${_e(y)}`:"上传完成","ok"),n()}catch(m){v(m.message,"err")}finally{d.value=""}}}),(l=t.querySelector("#del-album"))==null||l.addEventListener("click",async()=>{if(await He("删除相册",`《${s.name}》及其中 ${s.count} 张照片会一起删除。`))try{await $.deleteAlbum(s.id),v("相册已删除","ok"),location.hash="#/albums"}catch(c){v(c.message,"err")}}),t.querySelector("#photo-grid").addEventListener("click",async c=>{var m;const d=c.target,p=d.closest("[data-like]");if(p){c.stopPropagation();try{const o=await $.likePhoto(Number(p.dataset.like));p.classList.toggle("active",o.liked);const b=(m=p.closest(".photo"))==null?void 0:m.querySelector(".photo-like");b&&(b.innerHTML=`${g("heart",12)} ${o.count}`)}catch(o){v(o.message,"err")}return}const u=d.closest("[data-del]");if(u){if(c.stopPropagation(),!await He("删除照片","确定从相册中删除这张照片吗？"))return;try{await $.deletePhoto(s.id,Number(u.dataset.del)),s=await $.album(s.id),n(),v("已删除","ok")}catch(o){v(o.message,"err")}}})};n()}async function Fa(t,e){const a=ue(),s=e.params.uin||a.uin,n=s===a.uin,r=n?a:(await $.user(s)).user;t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${n?"来过的人，留下了这些话。":`给 ${h(r.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${Y(a.avatar,a.nickname,36)}
        <span>${n?"给自己留一句话":`给 ${h(r.nickname)} 留一句话`}</span>
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
  </div>`;const i=t.querySelector("#gb-list"),l=t.querySelector("#gb-form textarea"),c=t.querySelector("#gb-count");l.addEventListener("input",()=>{c.textContent=`${l.value.length} / 500`});const d=u=>`<article class="gb-item card" data-gid="${u.id}">
      ${Y(u.author.avatar,u.author.nickname,40,u.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${h(u.author.uin)}">${h(u.author.nickname)}</a>
          <time>${ne(u.at)}</time>
          <span class="spacer"></span>
          ${u.canEdit?`<button class="text-btn" data-reply="${u.id}">回复</button>`:""}
          ${u.canDel?`<button class="text-btn danger" data-del="${u.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${h(u.content)}</p>
        ${u.reply?`<div class="gb-reply"><b>${h(r.nickname)}：</b>${h(u.reply)}</div>`:""}
      </div>
    </article>`,p=async()=>{const u=await $.guestbook(s);i.innerHTML=u.entries.length?u.entries.map(d).join(""):`<div class="card empty"><div class="empty-mark">${g("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await p(),t.querySelector("#gb-form").addEventListener("submit",async u=>{u.preventDefault();const m=l.value.trim();if(m)try{await $.createGuestbook(s,m),l.value="",c.textContent="0 / 500",v("留言成功","ok"),await p()}catch(o){v(o.message,"err")}}),i.addEventListener("click",async u=>{const m=u.target,o=m.closest("[data-del]");if(o){if(!confirm("确定删除这条留言吗？"))return;try{await $.deleteGuestbook(Number(o.dataset.del)),await p(),v("已删除","ok")}catch(k){v(k.message,"err")}return}const b=m.closest("[data-reply]");if(b){const k=Number(b.dataset.reply);await tt({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async y=>{const x=y.querySelector("#reply-text").value.trim();return x?(await $.replyGuestbook(k,x),await p(),v("已回复","ok"),!0):(v("回复不能为空","err"),!1)}})}})}async function Ga(t,e){const a=ue(),s=e.params.uin?(await $.user(e.params.uin)).user:a;t.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${h(s.nickname)}</h1>
      <p class="page-sub">${h(s.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${s.bio?pt(s.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
      </article>

      <aside class="about-side">
        <section class="rail-card">
          <h3>档案</h3>
          <dl class="fact-list">
            <div><dt>空间号</dt><dd>${h(s.uin)}</dd></div>
            <div><dt>城市</dt><dd>${h(s.city||"—")}</dd></div>
            <div><dt>星座</dt><dd>${h(s.constellation||"—")}</dd></div>
            <div><dt>加入</dt><dd>${new Date(s.createdAt).getFullYear()} 年</dd></div>
            <div><dt>文章</dt><dd>${s.posts} 篇</dd></div>
            <div><dt>照片</dt><dd>${s.photos} 张</dd></div>
          </dl>
        </section>

        <section class="rail-card">
          <h3>标签</h3>
          <div class="tag-cloud">
            ${s.tags.map(n=>`<span class="tag">${h(n)}</span>`).join("")||'<span class="muted">还没有标签</span>'}
          </div>
        </section>

        <section class="rail-card">
          <h3>找到我</h3>
          <div class="about-links">
            <a href="#/guestbook" class="about-link">${g("mail",14)} 留言板</a>
            <a href="#/posts" class="about-link">${g("book",14)} 全部文章</a>
            <a href="#/albums" class="about-link">${g("image",14)} 相册</a>
          </div>
        </section>
      </aside>
    </div>
  </div>`,s.uin!==a.uin&&$.visit(s.uin,"关于").catch(()=>v("足迹记录失败","err"))}async function Qa(t,e){var c;const a=(c=e.params.uin)!=null?c:"",s=ue();if(a===s.uin){location.hash="#/home";return}t.innerHTML=`<div class="page"><div class="card reading">正在打开 ${h(a)} 的空间…</div></div>`;const{user:n}=await $.user(a);$.visit(n.uin,"主页").catch(()=>{}),t.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${h(n.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${Y(n.avatar,n.nickname,0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${g("pin",12)} ${h(n.city||"—")}</p>
          <h1>${h(n.nickname)}</h1>
          <p class="hero-sign">${h(n.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${n.posts}</b>文章</span>
            <span><b>${n.photos}</b>照片</span>
            <span><b>${n.visitCount.toLocaleString()}</b>访问</span>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/guestbook?uin=${h(n.uin)}">${g("mail",15)} 留言</a>
          <a class="btn btn-ghost" href="#/search?q=${encodeURIComponent(n.nickname)}">${g("search",15)} 搜索</a>
        </div>
      </div>
    </section>

    <div class="list-head">
      <h2>${h(n.nickname)} 的文章</h2>
      <span class="muted">${n.posts} 篇</span>
    </div>
    <div id="space-posts">${Be(2)}</div>
  </div>`,Ue(t);const r=t.querySelector("#space-posts"),i=await $.posts({uin:n.uin,limit:10});if(!i.posts.length){r.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const l=i.posts[0];r.innerHTML=Wt(l)+`<div class="post-list">${i.posts.slice(1).map(Ze).join("")}</div>`}const Gt={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function Va(t){return t.target.startsWith("post:")?`#/post/${t.target.split(":")[1]}`:t.target.startsWith("album:")?`#/album/${t.target.split(":")[1]}`:t.target==="guestbook"?"#/guestbook":t.target==="profile"?`#/u/${h(t.from.uin)}`:"#/home"}async function Wa(t,e){t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${g("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const a=t.querySelector("#msg-list"),s=t.querySelector("#msg-sub"),n=async()=>{const r=await $.notifications();s.textContent=r.unread?`${r.unread} 条未读`:"全部已读",Mt(r.unread),a.innerHTML=r.notifications.length?`<div class="card msg-list">${r.notifications.map(i=>{var c;const l=(c=Gt[i.kind])!=null?c:Gt.system;return`<a class="msg-row ${i.read?"":"unread"}" href="${Va(i)}">
              <span class="msg-icon ${l.cls}">${g(l.icon,16)}</span>
              <div class="msg-body">
                <div class="msg-line">
                  ${Y(i.from.avatar,i.from.nickname,20,i.from.uin)}
                  <b>${h(i.from.nickname)}</b>
                  <span>${h(i.text)}</span>
                </div>
                <time>${ne(i.at)} · ${l.label}</time>
              </div>
              ${i.read?"":'<i class="msg-dot"></i>'}
            </a>`}).join("")}</div>`:`<div class="card empty"><div class="empty-mark">${g("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await n(),t.querySelector("#read-all").addEventListener("click",async()=>{try{const r=await $.readNotifications([]);Mt(r.unread),v("已全部标为已读","ok"),await n()}catch(r){v(r.message,"err")}})}const Xa=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function Ka(t,e){const a=ue(),s=e.params.tab==="out"?"out":"in";t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${g("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${Xa.map(i=>`<button class="seg-btn ${i.key===s?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/visitors?tab=${i.dataset.tab}`})});const n=t.querySelector("#visit-list"),r=await $.visitors(a.uin,s);t.querySelector("#visit-sub").textContent=s==="in"?`累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人`:`你最近访问了 ${r.visitors.length} 个空间`,n.innerHTML=r.visitors.length?`<div class="card visit-list">${r.visitors.map(i=>`<a class="visit-row" href="#/u/${h(i.author.uin)}">
            ${Y(i.author.avatar,i.author.nickname,40,i.author.uin)}
            <div class="visit-main">
              <b>${h(i.author.nickname)}</b>
              <span>${s==="in"?"看了":"访问了"} · ${h(i.module)}</span>
            </div>
            <time>${ne(i.at)}</time>
          </a>`).join("")}</div>`:$s(s==="in"?"还没有人来过":"还没有访问记录",s==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>')}const Ya=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function Ja(t,e){var r;const a=e.params.tab||"profile",s=ue();t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${Ya.map(i=>`<button class="seg-btn ${i.key===a?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/settings?tab=${i.dataset.tab}`})});const n=t.querySelector("#settings-body");if(a==="decorate"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${h(s.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${g("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${Xe().map(i=>`<button class="theme-card ${s.theme===i.id?"active":""}" data-theme="${i.id}">
              <span class="theme-swatch" style="background:${i.accent}"></span>
              <span>${h(i.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,n.querySelector("#cover-file").addEventListener("change",async i=>{var c;const l=(c=i.target.files)==null?void 0:c[0];if(l)try{const{url:d}=await $.upload(l),p=await $.updateProfile({cover:d});ge(p),n.querySelector("#cover-preview").style.backgroundImage=`url('${d}')`,v("封面已更新","ok")}catch(d){v(d.message,"err")}}),n.querySelectorAll("[data-theme]").forEach(i=>{i.addEventListener("click",async()=>{const l=i.dataset.theme;try{const c=await $.updateProfile({theme:l});ge(c),Qt(l),n.querySelectorAll("[data-theme]").forEach(d=>d.classList.remove("active")),i.classList.add("active"),v("主题已切换","ok")}catch(c){v(c.message,"err")}})});return}if(a==="music"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">内置免费音乐</h2>
      <p class="setting-hint">曲目由程序实时合成，无版权限制；点「试听」立即播放，「设为背景音乐」保存到你的空间。</p>
      <div class="music-library" id="music-library"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${P.isPlaying()?"spin":""}">${g("music",16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${h(s.bgmTitle||"还没有设置音轨")}</b>
          <span id="bgm-sub">${s.bgmUrl?"已保存，会在页面左下角循环播放":"上传、选一首内置曲目，或填写直链"}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="preview-btn">${g("play",13)} 试听</button>
      </div>
      <label class="field">
        <span>显示名称</span>
        <input class="input" id="bgm-title" maxlength="60" value="${h(s.bgmTitle)}" placeholder="比如：夜航">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" id="save-bgm">保存设置</button>
        ${s.bgmUrl?'<button class="btn btn-ghost danger" id="clear-bgm">移除背景音乐</button>':""}
      </div>

      <h2 class="setting-title">上传本地音频</h2>
      <p class="setting-hint">支持 MP3 / M4A / OGG / WAV / FLAC，单个文件不超过 50MB。</p>
      <label class="btn btn-ghost btn-sm">${g("upload",14)} 选择音频文件
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
    </section>`;let i=s.bgmUrl,l=s.bgmTitle;const c=()=>{n.querySelector("#bgm-name").textContent=l||"还没有设置音轨",n.querySelector("#bgm-sub").textContent=i?"已选择，保存后生效":"上传、选一首内置曲目，或填写直链",n.querySelector("#bgm-title").value||(n.querySelector("#bgm-title").value=l)},d=(u,m)=>{i=u,l=m,n.querySelector("#bgm-title").value=m,c()};try{const{tracks:u}=await $.musicLibrary(),m=n.querySelector("#music-library");m.innerHTML=u.map(o=>`<article class="lib-card" data-id="${h(o.id)}">
            <div class="lib-main">
              <b>${h(o.title)}</b>
              <span>${h(o.mood)} · ${o.duration} 秒</span>
            </div>
            <div class="lib-actions">
              <button class="btn btn-ghost btn-sm" data-play="${h(o.url)}" data-title="${h(o.title)}">${g("play",12)} 试听</button>
              <button class="btn btn-soft btn-sm" data-pick="${h(o.url)}" data-title="${h(o.title)}">设为背景</button>
            </div>
          </article>`).join(""),m.addEventListener("click",o=>{var x;const b=o.target,k=b.closest("[data-play]");if(k){P.setTrack(k.dataset.play,k.dataset.title),P.isPlaying()||P.toggle(),(x=n.querySelector(".music-disc"))==null||x.classList.add("spin");return}const y=b.closest("[data-pick]");y&&(d(y.dataset.pick,y.dataset.title),v(`已选择《${y.dataset.title}》，记得点保存`,"ok"))})}catch(u){n.querySelector("#music-library").innerHTML=`<span class="muted">曲库加载失败：${h(u.message)}</span>`}const p=n.querySelector("#audio-file");p.addEventListener("change",async()=>{var m;const u=(m=p.files)==null?void 0:m[0];if(u){if(u.size>50*1024*1024){v("音频不能超过 50MB","err");return}v("正在上传音频…");try{const{url:o}=await $.uploadAudio(u);d(o,u.name.replace(/\.[^.]+$/,"")),v("上传完成，点保存生效","ok")}catch(o){v(o.message,"err")}finally{p.value=""}}}),n.querySelector("#bgm-url-save").addEventListener("click",()=>{var o;const m=n.querySelector("#bgm-url").value.trim();if(!m){v("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/)/.test(m)){v("地址需要以 http(s):// 或 /media/ 开头","err");return}d(m,((o=m.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"外部音频"),v("已填入，点保存生效","ok")}),n.querySelector("#preview-btn").addEventListener("click",()=>{if(!i){v("还没有选择音轨","err");return}P.setTrack(i,l),P.toggle(),setTimeout(()=>{var u;return(u=n.querySelector(".music-disc"))==null?void 0:u.classList.toggle("spin",P.isPlaying())},150)}),n.querySelector("#save-bgm").addEventListener("click",async()=>{const u=n.querySelector("#bgm-title").value.trim();try{const m=await $.updateProfile({bgmUrl:i,bgmTitle:u});ge(m),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:m.bgmUrl,bgmTitle:m.bgmTitle}})),v("背景音乐已保存","ok")}catch(m){v(m.message,"err")}}),(r=n.querySelector("#clear-bgm"))==null||r.addEventListener("click",async()=>{try{const u=await $.updateProfile({bgmUrl:"",bgmTitle:""});ge(u),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),v("已移除背景音乐","ok"),await e.reload()}catch(u){v(u.message,"err")}});return}n.innerHTML=`<section class="card setting-card">
    <div class="avatar-line">
      <img src="${h(s.avatar)}" alt="" id="avatar-preview">
      <div>
        <b>${h(s.nickname)}</b>
        <p class="muted">@${h(s.uin)} · Lv.${s.level}</p>
      </div>
      <label class="btn btn-ghost btn-sm">${g("upload",14)} 更换头像
        <input type="file" id="avatar-file" accept="image/*" hidden>
      </label>
    </div>

    <form id="profile-form" class="setting-form">
      <div class="form-2col">
        <label class="field"><span>昵称</span><input class="input" name="nickname" maxlength="20" value="${h(s.nickname)}"></label>
        <label class="field"><span>城市</span><input class="input" name="city" maxlength="20" value="${h(s.city)}"></label>
      </div>
      <label class="field"><span>一句话签名</span><input class="input" name="signature" maxlength="80" value="${h(s.signature)}"></label>
      <label class="field">
        <span>自我介绍（Markdown，会显示在「关于」页）</span>
        <textarea class="input" name="bio" rows="8" maxlength="4000" placeholder="## 关于我&#10;&#10;写文章…">${h(s.bio)}</textarea>
      </label>
      <label class="field"><span>标签（逗号分隔，最多 8 个）</span>
        <input class="input" name="tags" value="${h(s.tags.join(","))}" placeholder="写作, 摄影, 徒步">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" type="submit">保存修改</button>
        <span class="muted">空间号注册后不可修改</span>
      </div>
    </form>
  </section>`,n.querySelector("#avatar-file").addEventListener("change",async i=>{var c;const l=(c=i.target.files)==null?void 0:c[0];if(l)try{const{url:d}=await $.upload(l),p=await $.updateProfile({avatar:d});ge(p),n.querySelector("#avatar-preview").src=d,v("头像已更新","ok")}catch(d){v(d.message,"err")}}),n.querySelector("#profile-form").addEventListener("submit",async i=>{var d,p,u,m,o;i.preventDefault();const l=new FormData(i.currentTarget),c=String((d=l.get("tags"))!=null?d:"").split(/[,，\s]+/).map(b=>b.trim()).filter(Boolean).slice(0,8);try{const b=await $.updateProfile({nickname:String((p=l.get("nickname"))!=null?p:"").trim(),city:String((u=l.get("city"))!=null?u:"").trim(),signature:String((m=l.get("signature"))!=null?m:"").trim(),bio:String((o=l.get("bio"))!=null?o:""),tags:c});ge(b),v("已保存","ok"),await e.reload()}catch(b){v(b.message,"err")}})}async function en(t,e){const a=(e.params.q||"").trim();if(t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SEARCH</p>
        <h1>搜索</h1>
        <p class="page-sub">${a?`“${h(a)}” 的结果`:"找文章、找朋友、找相册"}</p>
      </div>
    </header>

    <form class="search-box card" id="search-form">
      <input class="input" name="q" value="${h(a)}" placeholder="输入关键词" autofocus>
      <button class="btn btn-primary" type="submit">${g("search",14)} 搜索</button>
    </form>

    <div id="search-result"></div>
  </div>`,t.querySelector("#search-form").addEventListener("submit",n=>{var i;n.preventDefault();const r=String((i=new FormData(n.currentTarget).get("q"))!=null?i:"").trim();location.hash=r?`#/search?q=${encodeURIComponent(r)}`:"#/search"}),!a)return;const s=t.querySelector("#search-result");try{const n=await $.search(a);if(!(n.posts.length+n.users.length+n.albums.length)){s.innerHTML=`<div class="card empty"><div class="empty-mark">${g("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}s.innerHTML=`
      ${n.users.length?`<h2 class="result-title">用户 <span>${n.users.length}</span></h2>
             <div class="card user-list">${n.users.map(i=>`<a class="user-row" href="#/u/${h(i.uin)}">
                   <img src="${h(i.avatar)}" alt="">
                   <div><b>${h(i.nickname)}</b><span>@${h(i.uin)} · ${h(i.signature||"")}</span></div>
                   ${g("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${n.posts.length?`<h2 class="result-title">文章 <span>${n.posts.length}</span></h2>
             <div class="post-list card">${n.posts.map(Ze).join("")}</div>`:""}
      ${n.albums.length?`<h2 class="result-title">相册 <span>${n.albums.length}</span></h2>
             <div class="album-grid">${n.albums.map(i=>`<a class="album-card card" href="#/album/${i.id}">
                   <div class="album-cover">${i.cover?`<img src="${h(i.cover)}" alt="">`:""}</div>
                   <div class="album-info"><h3>${h(i.name)}</h3><p>${i.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(n){v(n.message,"err")}}const hs=document.getElementById("app"),tn=[{pattern:/^\/home$/,nav:"home",render:Ls},{pattern:/^\/posts$/,nav:"posts",render:qs},{pattern:/^\/post\/(\d+)$/,nav:"posts",render:Da},{pattern:/^\/write$/,nav:"",render:Ft},{pattern:/^\/edit\/(\d+)$/,nav:"",render:Ft},{pattern:/^\/albums$/,nav:"albums",render:Ua},{pattern:/^\/album\/(\d+)$/,nav:"albums",render:Za},{pattern:/^\/guestbook$/,nav:"guestbook",render:Fa},{pattern:/^\/about$/,nav:"about",render:Ga},{pattern:/^\/u\/([^/]+)$/,nav:"",render:Qa},{pattern:/^\/messages$/,nav:"",render:Wa},{pattern:/^\/visitors$/,nav:"",render:Ka},{pattern:/^\/settings$/,nav:"",render:Ja},{pattern:/^\/search$/,nav:"",render:en}];let ht=!1,we=!1;function sn(){const t=location.hash.replace(/^#/,"")||"/home",[e,a=""]=t.split("?");return{path:e.startsWith("/")?e:`/${e}`,query:new URLSearchParams(a)}}function an(t){var e;for(const a of tn){const s=t.match(a.pattern);if(s)return{def:a,id:(e=s[1])!=null?e:""}}return null}async function ms(){try{const t=await $.session();if(!t.authenticated||!t.user)return!1;const e=await $.bootstrap();return vs({me:e.me,themes:e.themes,unread:e.unread}),Qt(e.me.theme),!0}catch{return!1}}function mt(){ht=!1,Q.boot=null,document.body.classList.remove("signed-in"),P.unmount(),xs(hs,async()=>{await ms()&&gs()})}function xe(t,e,a){return`<a class="nav-link" data-nav="${e}" href="${t}">${a}</a>`}function gs(){const t=ue();document.body.classList.add("signed-in"),hs.innerHTML=`
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${g("pen",15)}</span>
        <span class="brand-text">${h(t.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${xe("#/home","home","首页")}
        ${xe("#/posts","posts","文章")}
        ${xe("#/albums","albums","相册")}
        ${xe("#/guestbook","guestbook","留言板")}
        ${xe("#/about","about","关于")}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${g("search",15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${g("pen",14)}<span>写文章</span></a>
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${g("bell",18)}<i class="badge" data-unread ${Et()?"":"hidden"}>${Et()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${Y(t.avatar,t.nickname,32)}
          <div class="user-menu" id="user-menu" hidden>
            <div class="menu-head">
              <b>${h(t.nickname)}</b>
              <span>@${h(t.uin)}</span>
            </div>
            <a href="#/u/${h(t.uin)}">${g("grid",14)} 我的主页</a>
            <a href="#/visitors">${g("eye",14)} 访客记录</a>
            <a href="#/settings">${g("settings",14)} 空间设置</a>
            <button id="logout-btn">${g("logout",14)} 退出登录</button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main id="view" class="view"></main>

  <nav class="mobile-tabs" aria-label="主导航">
    <a class="mtab" data-nav="home" href="#/home">${g("pen",19)}<span>首页</span></a>
    <a class="mtab" data-nav="posts" href="#/posts">${g("book",19)}<span>文章</span></a>
    <a class="mtab" data-nav="albums" href="#/albums">${g("image",19)}<span>相册</span></a>
    <a class="mtab" data-nav="guestbook" href="#/guestbook">${g("mail",19)}<span>留言</span></a>
    <a class="mtab" data-nav="about" href="#/about">${g("grid",19)}<span>关于</span></a>
  </nav>

  <footer class="site-foot">
    <span>${h(t.nickname)} · 个人空间</span>
    <span class="foot-sep">·</span>
    <span>Go + ent + SQLite · TypeScript</span>
  </footer>`;const e=document.getElementById("head-search");e.addEventListener("submit",s=>{var r;s.preventDefault();const n=String((r=new FormData(e).get("q"))!=null?r:"").trim();n&&(location.hash=`#/search?q=${encodeURIComponent(n)}`)});const a=document.getElementById("user-chip");a.addEventListener("click",s=>{s.target.closest("a,button")||(we=!we,document.getElementById("user-menu").hidden=!we)}),document.addEventListener("click",s=>{!a.contains(s.target)&&we&&(we=!1,document.getElementById("user-menu").hidden=!0)}),document.getElementById("logout-btn").addEventListener("click",async()=>{await $.logout(),v("已退出登录"),mt()}),ht=!0,P.setTrack(t.bgmUrl,t.bgmTitle),P.mount(),Ne()}async function Ne(){var i;if(!ht)return;const t=document.getElementById("view");if(!t)return;const{path:e,query:a}=sn(),s=an(e);if(document.querySelectorAll("[data-nav]").forEach(l=>{l.classList.toggle("active",l.dataset.nav===(s==null?void 0:s.def.nav))}),!s){t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">页面不存在</h2>
      <p class="empty-desc">这条链接可能已经失效。</p>
      <a class="btn btn-primary" href="#/home">回到首页</a>
    </div></div>`;return}const n={...Object.fromEntries(a)};s.id&&(n.id=s.id,s.def.pattern.source.includes("[^/]")&&(n.uin=s.id)),window.scrollTo({top:0});const r={params:n,reload:Ne};try{await s.def.render(t,r)}catch(l){if(l instanceof Ie&&l.status===401)return;t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${h(l.message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`,(i=t.querySelector("#retry"))==null||i.addEventListener("click",()=>void Ne())}}window.addEventListener("hashchange",()=>void Ne());window.addEventListener("qz:expired",()=>mt());(async function(){await ms()?gs():mt()})();window.addEventListener("qz:profile",t=>{const e=t.detail;e&&P.setTrack(e.bgmUrl,e.bgmTitle)});
