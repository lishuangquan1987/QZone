var ha=Object.defineProperty;var ls=t=>{throw TypeError(t)};var ma=(t,e,a)=>e in t?ha(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var C=(t,e,a)=>ma(t,typeof e!="symbol"?e+"":e,a),ga=(t,e,a)=>e.has(t)||ls("Cannot "+a);var os=(t,e,a)=>e.has(t)?ls("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a);var Le=(t,e,a)=>(ga(t,e,"access private method"),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();class tt extends Error{constructor(a,s){super(s);C(this,"status");this.status=a}}async function Te(t,e={}){const a=new Headers(e.headers);e.body&&!(e.body instanceof FormData)&&a.set("Content-Type","application/json");let s;try{s=await fetch(t,{credentials:"include",...e,headers:a})}catch{throw new tt(0,"网络连接失败，请检查服务是否已启动")}if(s.status===401)throw window.dispatchEvent(new CustomEvent("qz:expired")),new tt(401,"登录状态已失效");const n=await s.text(),r=n?JSON.parse(n):{};if(!s.ok)throw new tt(s.status,r.error||"请求失败");return r}const Z=t=>Te(t),j=(t,e)=>Te(t,{method:"POST",body:e===void 0?void 0:JSON.stringify(e)}),Pe=t=>Te(t,{method:"DELETE"}),kt=(t,e)=>Te(t,{method:"PATCH",body:JSON.stringify(e)}),T={register:(t,e,a)=>j("/api/auth/register",{uin:t,nickname:e,password:a}),login:(t,e)=>j("/api/auth/login",{uin:t,password:e}),logout:()=>j("/api/auth/logout"),session:()=>Z("/api/auth/session"),bootstrap:()=>Z("/api/bootstrap"),user:t=>Z(`/api/users/${encodeURIComponent(t)}`),updateProfile:t=>kt("/api/users/me",t),signIn:()=>j("/api/users/me/signin"),visitors:(t,e="in")=>Z(`/api/users/${encodeURIComponent(t)}/visitors?mode=${e}`),visit:(t,e)=>j(`/api/users/${encodeURIComponent(t)}/visit`,{module:e}),posts:t=>{const e=new URLSearchParams;return Object.entries(t).forEach(([a,s])=>{s!==void 0&&s!==""&&e.set(a,String(s))}),Z(`/api/posts?${e}`)},createPost:t=>j("/api/posts",t),post:t=>Z(`/api/posts/${t}`),updatePost:(t,e)=>kt(`/api/posts/${t}`,e),deletePost:t=>Pe(`/api/posts/${t}`),likePost:t=>j(`/api/posts/${t}/like`),commentPost:(t,e,a)=>j(`/api/posts/${t}/comments`,{content:e,replyTo:a}),deleteComment:(t,e)=>Pe(`/api/posts/${t}/comments/${e}`),albums:t=>Z(`/api/albums${t?`?uin=${encodeURIComponent(t)}`:""}`),album:t=>Z(`/api/albums/${t}`),updateAlbum:(t,e)=>kt(`/api/albums/${t}`,e),createAlbum:t=>j("/api/albums",t),deleteAlbum:t=>Pe(`/api/albums/${t}`),addPhotos:(t,e,a)=>j(`/api/albums/${t}/photos`,{urls:e,caption:"",...a}),deletePhoto:(t,e)=>Pe(`/api/albums/${t}/photos/${e}`),likePhoto:t=>j(`/api/photos/${t}/like`),guestbook:t=>Z(`/api/guestbook${t?`?uin=${encodeURIComponent(t)}`:""}`),createGuestbook:(t,e)=>j("/api/guestbook",{owner:t,content:e}),deleteGuestbook:t=>Pe(`/api/guestbook/${t}`),replyGuestbook:(t,e)=>j(`/api/guestbook/${t}/reply`,{reply:e}),notifications:()=>Z("/api/notifications"),readNotifications:(t=[])=>j("/api/notifications/read",{ids:t}),musicLibrary:()=>Z("/api/music/library"),search:t=>Z(`/api/search?q=${encodeURIComponent(t)}`),upload:async t=>{const e=new FormData;return e.append("file",t),Te("/api/upload",{method:"POST",body:e})},uploadAudio:async t=>{const e=new FormData;return e.append("file",t),Te("/api/upload/audio",{method:"POST",body:e})}},Y={boot:null};function fe(){if(!Y.boot)throw new Error("尚未初始化");return Y.boot.me}function ba(t){Y.boot=t}function Ee(t){Y.boot&&(Y.boot.me=t)}function St(){var t,e;return(e=(t=Y.boot)==null?void 0:t.themes)!=null?e:[]}function cs(){var t,e;return(e=(t=Y.boot)==null?void 0:t.unread)!=null?e:0}function ds(t){Y.boot&&(Y.boot.unread=t),document.querySelectorAll("[data-unread]").forEach(e=>{e.textContent=t>99?"99+":String(t),e.hidden=t===0})}function qs(t){var a,s;const e=(a=St().find(n=>n.id===t))!=null?a:St()[0];document.documentElement.dataset.theme=(s=e==null?void 0:e.id)!=null?s:"aurora",e&&document.documentElement.style.setProperty("--theme-accent",e.accent)}function m(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const re=t=>String(t).padStart(2,"0");function le(t){const e=new Date(t).getTime(),a=Date.now()-e,s=6e4;if(a<s)return"刚刚";if(a<60*s)return`${Math.floor(a/s)} 分钟前`;const n=new Date(e),r=new Date;if(n.toDateString()===r.toDateString())return`今天 ${re(n.getHours())}:${re(n.getMinutes())}`;const i=new Date(Date.now()-864e5);return n.toDateString()===i.toDateString()?`昨天 ${re(n.getHours())}:${re(n.getMinutes())}`:n.getFullYear()===r.getFullYear()?`${n.getMonth()+1} 月 ${n.getDate()} 日`:`${n.getFullYear()} 年 ${n.getMonth()+1} 月 ${n.getDate()} 日`}function us(t){const e=new Date(t);return`${e.getFullYear()}-${re(e.getMonth()+1)}-${re(e.getDate())} ${re(e.getHours())}:${re(e.getMinutes())}`}const fa={pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',message:'<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',eyeoff:'<path d="M4 4l16 16"/><path d="M9.6 5.9A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.3 3.9"/><path d="M6.7 7.6A17 17 0 0 0 2.5 12S6 18.5 12 18.5a9.8 9.8 0 0 0 3.7-.7"/><path d="M9.9 10a3 3 0 0 0 4.2 4.2"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',music:'<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',bell:'<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chevron:'<path d="M9 6l6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',star:'<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',logout:'<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',tag:'<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',pin:'<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',moon:'<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2z"/>',monitor:'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9 20.5h6M12 17v3.5"/>',grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',listOl:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',table:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',codeInline:'<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',codeBlock:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>',expand:'<path d="M9 4.5H4.5V9M15 4.5h4.5V9M15 19.5h4.5V15M9 19.5H4.5V15"/>',compress:'<path d="M4.5 9H9V4.5M19.5 9H15V4.5M19.5 15H15v4.5M4.5 15H9v4.5"/>',outline:'<path d="M4 6h16M4 12h10.5M4 18h7"/>'};function f(t,e=16){var s;const a=(s=fa[t])!=null?s:"";return`<svg class="ico" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}function ae(t,e,a=40,s="",n=0){const r=t?`<img src="${m(t)}" alt="${m(e)}" loading="lazy">`:`<span class="avatar-fallback">${m(e.slice(0,1))}</span>`,i=s?`href="#/u/${m(s)}"`:"",l=a>0?` style="width:${a}px;height:${a}px"`:"";return`<a class="avatar" ${i}${l}>${r}${n?`<i class="avatar-level">${n}</i>`:""}</a>`}function x(t,e="info"){let a=document.getElementById("toasts");a||(a=document.createElement("div"),a.id="toasts",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${e}`,s.textContent=t,a.appendChild(s),requestAnimationFrame(()=>s.classList.add("in")),setTimeout(()=>{s.classList.remove("in"),setTimeout(()=>s.remove(),280)},2600)}function ct(t){return new Promise(e=>{var r,i,l,d;const a=document.createElement("div");a.className="modal-mask",a.innerHTML=`
      <div class="modal ${t.wide?"modal-wide":""}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${m(t.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${f("close",18)}</button>
        </header>
        <div class="modal-body">${t.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${m((r=t.cancelText)!=null?r:"取消")}</button>
          <button class="btn btn-primary modal-ok">${m((i=t.confirmText)!=null?i:"确定")}</button>
        </footer>
      </div>`,document.body.appendChild(a),document.body.classList.add("no-scroll");const s=h=>{a.remove(),document.body.classList.remove("no-scroll"),e(h)};a.querySelector(".modal-x").addEventListener("click",()=>s(!1)),a.querySelector(".modal-cancel").addEventListener("click",()=>s(!1)),a.addEventListener("mousedown",h=>{h.target===a&&s(!1)});const n=a.querySelector(".modal-ok");n.addEventListener("click",async()=>{if(!t.onConfirm)return s(!0);n.disabled=!0;try{await t.onConfirm(a)!==!1&&s(!0)}catch(h){x(h.message,"err")}finally{n.disabled=!1}}),(l=t.onMount)==null||l.call(t,a),(d=a.querySelector("input, textarea"))==null||d.focus()})}async function at(t,e,a="删除"){return ct({title:t,body:`<p class="confirm-text">${m(e)}</p>`,confirmText:a})}const ps=new WeakSet;function dt(t){ps.has(t)||(ps.add(t),t.addEventListener("click",e=>{const a=e.target;if(a.closest("button, a.album-card, .photo-tools"))return;const s=a.closest("[data-zoom]");if(!s)return;const n=Array.from(t.querySelectorAll("[data-zoom]")),r=n.map(l=>{var d,h,p;return{src:l.dataset.zoom||l.src,caption:l.getAttribute("alt")||((p=(h=(d=l.closest("figure"))==null?void 0:d.querySelector("figcaption"))==null?void 0:h.textContent)==null?void 0:p.trim())||""}}),i=Math.max(0,n.indexOf(s));va(r,i,s)}))}function va(t,e=0,a){var H;if(!t.length)return;(H=document.querySelector(".lx"))==null||H.remove();let s=Math.min(Math.max(e,0),t.length-1);const n=document.createElement("div");n.className="lx",n.innerHTML=`
    <div class="lx-top">
      <span class="lx-count"></span>
      <button class="lx-btn lx-close" aria-label="关闭">${f("close",22)}</button>
    </div>
    <button class="lx-nav lx-prev" aria-label="上一张">${f("chevron",26)}</button>
    <figure class="lx-stage">
      <img class="lx-img" alt="">
      <span class="lx-spin" aria-hidden="true"></span>
      <figcaption class="lx-cap"></figcaption>
    </figure>
    <button class="lx-nav lx-next" aria-label="下一张">${f("chevron",26)}</button>
    <div class="lx-strip"></div>`;const r=n.querySelector(".lx-img"),i=n.querySelector(".lx-stage"),l=n.querySelector(".lx-cap"),d=n.querySelector(".lx-count"),h=n.querySelector(".lx-strip"),p=n.querySelector(".lx-prev"),c=n.querySelector(".lx-next");t.length>1?h.innerHTML=t.map((S,q)=>`<button class="lx-thumb" data-i="${q}" aria-label="第 ${q+1} 张"><img src="${m(S.src)}" alt="" loading="lazy"></button>`).join(""):(h.remove(),p.remove(),c.remove());const g=()=>{const S=t[s];r.classList.remove("ready"),r.alt=S.caption||`图片 ${s+1}`,r.src=S.src,d.textContent=`${s+1} / ${t.length}`,l.textContent=S.caption||"",l.hidden=!S.caption,h.querySelectorAll(".lx-thumb").forEach((q,P)=>{q.classList.toggle("on",P===s),P===s&&q.scrollIntoView({block:"nearest",inline:"center"})}),[s-1,s+1].forEach(q=>{const P=(q+t.length)%t.length;P!==s&&(new Image().src=t[P].src)})},o=S=>{t.length<2||(s=(s+S+t.length)%t.length,g())};let v=!1;const $=()=>{v||(v=!0,n.classList.add("out"),window.removeEventListener("keydown",b),window.setTimeout(()=>{n.remove(),document.querySelector(".lx")||document.body.classList.remove("no-scroll")},160),a&&document.contains(a)&&a.focus({preventScroll:!0}))},b=S=>{S.key==="Escape"?(S.preventDefault(),$()):S.key==="ArrowLeft"?(S.preventDefault(),o(-1)):S.key==="ArrowRight"?(S.preventDefault(),o(1)):S.key==="Home"?(s=0,g()):S.key==="End"&&(s=t.length-1,g())};r.addEventListener("load",()=>r.classList.add("ready")),r.addEventListener("error",()=>r.classList.add("ready")),n.querySelector(".lx-close").addEventListener("click",$),p.addEventListener("click",S=>{S.stopPropagation(),o(-1)}),c.addEventListener("click",S=>{S.stopPropagation(),o(1)}),n.addEventListener("click",S=>{const q=S.target;(q===n||q===i)&&$()}),h.addEventListener("click",S=>{const q=S.target.closest(".lx-thumb");q&&(S.stopPropagation(),s=Number(q.dataset.i),g())});let E=0,y=0;n.addEventListener("touchstart",S=>{E=S.touches[0].clientX,y=S.touches[0].clientY},{passive:!0}),n.addEventListener("touchend",S=>{const q=S.changedTouches[0].clientX-E,P=S.changedTouches[0].clientY-y;Math.abs(q)>55&&Math.abs(q)>Math.abs(P)?o(q<0?1:-1):P>90&&Math.abs(P)>Math.abs(q)*1.4&&$()},{passive:!0}),document.body.appendChild(n),document.body.classList.add("no-scroll"),g(),window.addEventListener("keydown",b),n.querySelector(".lx-close").focus({preventScroll:!0})}function ka(t,e="",a=""){return`<div class="empty">
    <div class="empty-mark">${f("book",22)}</div>
    <p class="empty-title">${m(t)}</p>
    ${e?`<p class="empty-desc">${m(e)}</p>`:""}
    ${a}
  </div>`}function nt(t=3){return Array.from({length:t}).map(()=>`<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`).join("")}class ya{constructor(){C(this,"audio",null);C(this,"pill",null);C(this,"title","");C(this,"url","");C(this,"armed",!1)}get want(){return localStorage.getItem("qz.bgm")!=="off"}get volume(){const e=Number(localStorage.getItem("qz.bgm.vol"));return Number.isFinite(e)&&e>0?Math.min(e,1):.55}setTrack(e,a){const s=e!==this.url;this.url=e,this.title=a||"未命名音轨",s&&(this.ensureAudio(),this.audio&&(this.audio.src=e,this.audio.volume=this.volume,this.audio.load())),this.render(),s&&e&&this.want&&this.arm()}ensureAudio(){if(this.audio)return;const e=new Audio;e.loop=!0,e.preload="metadata",e.volume=this.volume,e.addEventListener("play",()=>this.render()),e.addEventListener("pause",()=>this.render()),e.addEventListener("error",()=>{this.render(),this.url&&x("背景音乐加载失败，可能是格式不支持","err")}),this.audio=e}arm(){if(this.armed)return;this.armed=!0;const e=a=>{const s=a.target;s&&s.closest(".bgm")||(document.removeEventListener("pointerdown",e),document.removeEventListener("keydown",e),this.want&&this.audio&&this.audio.paused&&this.play())};document.addEventListener("pointerdown",e),document.addEventListener("keydown",e)}async play(){if(this.ensureAudio(),!(!this.audio||!this.url))try{await this.audio.play(),localStorage.setItem("qz.bgm","on")}catch{this.render()}}pause(){var e;(e=this.audio)==null||e.pause(),localStorage.setItem("qz.bgm","off"),this.render()}isPlaying(){return!!this.audio&&!this.audio.paused}toggle(){var e;if(!this.url){x("还没有设置背景音乐，可以在「设置」里上传","err");return}((e=this.audio)==null?void 0:e.paused)!==!1?this.play():this.pause()}setVolume(e){localStorage.setItem("qz.bgm.vol",String(e)),this.audio&&(this.audio.volume=e)}mount(){if(this.pill){this.render();return}const e=document.createElement("div");e.className="bgm",document.body.appendChild(e),this.pill=e,e.addEventListener("click",a=>{const s=a.target;if(s.closest("[data-bgm-toggle]")){this.toggle();return}s.closest(".bgm-meta")&&(location.hash="#/settings?tab=music")}),e.addEventListener("input",a=>{const s=a.target;s.matches(".bgm-vol")&&this.setVolume(Number(s.value))}),this.render(),this.url&&this.want&&this.arm()}unmount(){var e,a;(e=this.pill)==null||e.remove(),this.pill=null,(a=this.audio)==null||a.pause(),document.body.classList.remove("has-bgm")}render(){if(document.body.classList.toggle("has-bgm",!!this.url),!this.pill)return;const e=this.audio?!this.audio.paused:!1,a=Math.round(this.volume*100);window.dispatchEvent(new CustomEvent("qz:bgm",{detail:{playing:e}})),this.pill.innerHTML=`
      <div class="bgm-disc ${e?"spin":""}" data-bgm-toggle title="${e?"暂停":"播放"}">${f("music",16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${m(this.url?this.title:"未设置音轨")}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${e?"暂停":"播放"}">
        ${f(e?"pause":"play",14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${a}" aria-label="音量">
      <div class="bgm-wave ${e?"on":""}"><i></i><i></i><i></i><i></i></div>`}}const _=new ya;window.bgm=_;const As="qz.mode",Cs=window.matchMedia("(prefers-color-scheme: dark)"),Lt=new Set;function $a(){try{const t=localStorage.getItem(As);return t==="dark"||t==="light"?t:"auto"}catch{return"auto"}}let Me=$a();function wa(){return Me}function Oe(){return Me==="dark"||Me==="auto"&&Cs.matches}function At(){var a;const t=Oe(),e=document.documentElement;e.dataset.appearance=t?"dark":"light",e.style.colorScheme=t?"dark":"light",(a=document.querySelector('meta[name="theme-color"]'))==null||a.setAttribute("content",t?"#131412":"#f7f4ee"),Lt.forEach(s=>s())}function Rs(t){Me=t;try{localStorage.setItem(As,t)}catch{}At()}function xa(){return Rs(Oe()?"light":"dark"),Me}function Sa(t){return Lt.add(t),()=>Lt.delete(t)}Cs.addEventListener("change",()=>{Me==="auto"&&At()});At();function Ct(t="theme-toggle",e=17,a="icon-btn"){return`<button class="${a} theme-toggle" id="${t}" title="${zs()}" aria-label="切换深色 / 浅色">${f(Oe()?"sun":"moon",e)}</button>`}function zs(){return Oe()?"切换到浅色":"切换到深色"}function Rt(t,e="theme-toggle"){const a=t.querySelector(`#${e}`);if(!a)return()=>{};const s=()=>{a.isConnected&&(a.innerHTML=f(Oe()?"sun":"moon",17),a.title=zs())};return a.addEventListener("click",()=>{xa(),s()}),Sa(s)}function La(t,e){t.innerHTML=`
  <div class="auth">
    ${Ct("auth-theme",17)}
    <section class="auth-brand">
      <div class="auth-brand-inner">
        <div class="auth-logo">${f("pen",20)}</div>
        <h1>个人空间</h1>
        <p class="auth-lead">写下长一点的东西。照片、文章、留言，都放在自己的域名里。</p>
        <ul class="auth-points">
          <li>${f("book",15)} Markdown 写作，支持插图与代码</li>
          <li>${f("image",15)} 相册真实上传，存放在你自己的服务器</li>
          <li>${f("music",15)} 背景音乐真实播放</li>
          <li>${f("lock",15)} 每篇文章独立设置可见范围</li>
        </ul>
      </div>
      <div class="auth-foot">Go · ent · SQLite · TypeScript</div>
    </section>

    <section class="auth-panel">
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">登录</button>
          <button class="auth-tab" data-tab="register">注册</button>
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
  </div>`,Rt(t,"auth-theme");const a=t.querySelector("#auth-form"),s=t.querySelector("#auth-submit"),n=t.querySelector("#auth-hint"),r=Array.from(t.querySelectorAll(".auth-tab"));let i="login";const l=d=>{i=d,r.forEach(p=>p.classList.toggle("active",p.dataset.tab===d)),t.querySelectorAll('[data-only="register"]').forEach(p=>{p.hidden=d!=="register"});const h=a.elements.namedItem("nickname");h.required=d==="register",s.textContent=d==="login"?"登录":"创建空间",n.textContent=d==="login"?"还没有账号？点上面的「注册」，30 秒就能开通。":"空间号将作为你的主页地址，注册后不可修改。"};r.forEach(d=>d.addEventListener("click",()=>l(d.dataset.tab))),t.querySelectorAll(".demo-chip").forEach(d=>{d.addEventListener("click",()=>{var h,p;l("login"),a.elements.namedItem("uin").value=(h=d.dataset.uin)!=null?h:"",a.elements.namedItem("password").value=(p=d.dataset.pw)!=null?p:"",s.focus()})}),a.addEventListener("submit",async d=>{var o,v,$;d.preventDefault();const h=new FormData(a),p=String((o=h.get("uin"))!=null?o:"").trim(),c=String((v=h.get("password"))!=null?v:""),g=String(($=h.get("nickname"))!=null?$:"").trim();if(i==="register"&&!g){x("请填写昵称","err");return}s.disabled=!0,s.textContent=i==="login"?"登录中…":"创建中…";try{i==="login"?await T.login(p,c):await T.register(p,g,c),x(i==="login"?"欢迎回来":"空间已开通","ok"),await e()}catch(b){x(m(b.message),"err"),s.disabled=!1,s.textContent=i==="login"?"登录":"创建空间"}})}const Ea={城市:30,技术:212,旅行:168,随笔:282,生活:8,摄影:196,读书:248,音乐:330};function Is(t){var s;if(!t)return 40;const e=Ea[t];if(e!==void 0)return e;let a=0;for(const n of t)a=(a*31+((s=n.codePointAt(0))!=null?s:0))%360;return a}function Ps(t){return`<span class="pill cat" style="--cat:${Is(t)}">${m(t)}</span>`}const Hs={private:"仅自己可见",unlisted:"不公开列出",public:""};function _s(t){const e=t.cover||t.images[0]||"";return`<article class="feature card${e?"":" no-cover"}" data-post="${t.id}">
    ${e?`<a class="feature-cover" href="#/post/${t.id}"><img src="${m(e)}" alt="${m(t.title)}" loading="lazy"></a>`:""}
    <div class="feature-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${f("pin",11)}置顶</span>`:""}
        ${Ps(t.category)}
        ${t.visibility!=="public"?`<span class="pill pill-lock">${f("lock",11)}${Hs[t.visibility]}</span>`:""}
      </div>
      <h2 class="feature-title"><a href="#/post/${t.id}">${m(t.title||"无标题")}</a></h2>
      <p class="feature-summary">${m(t.summary)}</p>
      <div class="post-meta">
        <span>${le(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${f("clock",12)} ${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${f("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${f("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
  </article>`}function ut(t){const e=t.cover||t.images[0]||"";return`<article class="post-row" data-post="${t.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${f("pin",11)}置顶</span>`:""}
        ${Ps(t.category)}
        ${t.visibility!=="public"?`<span class="pill pill-lock">${f("lock",11)}${Hs[t.visibility]}</span>`:""}
      </div>
      <h3 class="post-row-title"><a href="#/post/${t.id}">${m(t.title||"无标题")}</a></h3>
      <p class="post-row-summary">${m(t.summary)}</p>
      <div class="post-meta">
        <span>${le(t.at)}</span>
        <span class="meta-dot">·</span>
        <span>${t.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${f("eye",12)} ${t.views}</span>
        <span class="meta-dot">·</span>
        <span>${f("heart",12)} ${t.likeCount}</span>
      </div>
    </div>
    ${e?`<a class="post-row-thumb" href="#/post/${t.id}"><img src="${m(e)}" alt="" loading="lazy"></a>`:""}
  </article>`}function hs(t){return t.length?`<ul class="comment-list">${t.map(e=>`<li class="comment" data-cid="${e.id}">
        ${ae(e.author.avatar,e.author.nickname,34,e.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${m(e.author.uin)}">${m(e.author.nickname)}</a>
            <time>${le(e.at)}</time>
            <button class="text-btn" data-reply="${m(e.author.nickname)}">回复</button>
            ${e.canDel?`<button class="text-btn danger" data-del-comment="${e.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${e.replyTo?`<span class="comment-reply">回复 ${m(e.replyTo)}：</span>`:""}${m(e.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function Ta(t){const e=t.privacy==="public"?"":`<span class="album-vis">${f(t.privacy==="private"?"lock":"eyeoff",12)}${t.privacy==="private"?"仅自己":"隐藏"}</span>`;return`<a class="album-card card" href="#/album/${t.id}">
    <div class="album-cover">
      ${t.cover?`<img src="${m(t.cover)}" alt="${m(t.name)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${t.count} 张</span>
      ${e}
      <span class="album-shade" aria-hidden="true"></span>
    </div>
    <div class="album-info">
      <h3>${m(t.name)}</h3>
      <p>${m(t.description||"还没有描述")}</p>
    </div>
  </a>`}async function Ma(t,e){var r;const a=fe();t.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${m(a.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ae(a.avatar,a.nickname,0,"",0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${f("pin",12)} ${m(a.city||"未设置城市")} · ${m(a.constellation||"—")}</p>
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
          <a class="btn btn-primary" href="#/write">${f("pen",15)} 写文章</a>
          <a class="btn btn-ghost" href="#/settings">${f("settings",15)} 设置</a>
        </div>
      </div>
    </section>

    <div class="home-grid">
      <div class="home-main" id="home-main">${nt(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,dt(t);const s=t.querySelector("#home-main"),n=t.querySelector("#home-rail");try{const[{posts:i,total:l},d]=await Promise.all([T.posts({limit:7}),T.albums()]);if(!i.length)s.innerHTML=`<div class="card empty">
        <div class="empty-mark">${f("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const p=(r=i.find(g=>g.pinned))!=null?r:i[0],c=i.filter(g=>g.id!==p.id);s.innerHTML=`
        ${_s(p)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${l} 篇 ${f("chevron",12)}</a>
        </div>
        <div class="post-list">${c.map(ut).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}n.innerHTML=`
      <section class="rail-card">
        <h3>关于我</h3>
        <p class="rail-bio">${m(a.bio?a.bio.split(`
`)[0].replace(/^#+\s*/,""):a.signature||"还没有写自我介绍。")}</p>
        <div class="tag-cloud">${a.tags.map(p=>`<a class="tag" href="#/search?q=${encodeURIComponent(p)}">${m(p)}</a>`).join("")||'<span class="muted">还没有标签</span>'}</div>
        <a class="rail-link" href="#/about">了解更多 ${f("chevron",12)}</a>
      </section>

      <section class="rail-card">
        <h3>背景音乐</h3>
        <div class="rail-music">
          <div class="rail-disc ${yt()?"spin":""}">${f("music",16)}</div>
          <div class="rail-music-meta">
            <b>${m(a.bgmTitle||"未设置音轨")}</b>
            <span>${a.bgmUrl?"正在循环播放":"去设置里上传一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${yt()?f("pause",13):f("play",13)} ${yt()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${d.albums.slice(0,3).map(p=>`<a class="rail-album" href="#/album/${p.id}">
                <img src="${m(p.cover)}" alt="">
                <span>${m(p.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${f("mail",13)} 去留言</a>
      </section>`;const h=n.querySelector("#rail-play");window.addEventListener("qz:bgm",()=>{var p;h&&((p=n.querySelector(".rail-disc"))==null||p.classList.toggle("spin",_.isPlaying()),h.innerHTML=`${_.isPlaying()?f("pause",13):f("play",13)} ${_.isPlaying()?"暂停":"播放"}`)}),h==null||h.addEventListener("click",()=>{_.toggle()})}catch(i){x(i.message,"err")}}function yt(){return _.isPlaying()}const qa=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function Aa(t,e){const a=e.params.sort==="popular"?"popular":"latest",s=e.params.category||"全部",n=e.params.q||"";t.innerHTML=`<div class="page">
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
        ${qa.map(g=>`<button class="sort-btn ${g.key===a?"active":""}" data-sort="${g.key}">${g.label}</button>`).join("")}
      </div>
    </div>
    ${n?`<p class="search-note">搜索「${m(n)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${nt(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const r=t.querySelector("#archive-list"),i=t.querySelector("#load-more"),l=t.querySelector("#cat-row");let d,h=[];const p=()=>{const g=new Set(["全部"]);h.forEach(o=>o.category&&g.add(o.category)),l.innerHTML=Array.from(g).map(o=>`<button class="chip ${o===s?"active":""}" data-cat="${m(o)}">${m(o)}</button>`).join("")},c=async g=>{g&&(d=void 0,r.innerHTML=nt(2));const o=await T.posts({category:s,sort:a,q:n,limit:8,before:d});h=g?o.posts:h.concat(o.posts);const v=o.posts.map(ut).join("");g?r.innerHTML=v:r.insertAdjacentHTML("beforeend",v),o.posts.length&&(d=o.posts[o.posts.length-1].at),i.hidden=!o.hasMore,t.querySelector("#archive-sub").textContent=`共 ${o.total} 篇 · 按${a==="popular"?"阅读量":"时间"}排序`,p(),g&&!o.posts.length&&(r.innerHTML=`<div class="card empty">
        <div class="empty-mark">${f("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await c(!1)}catch(g){x(g.message,"err")}finally{i.disabled=!1}}),l.addEventListener("click",g=>{const o=g.target.closest("[data-cat]");if(!o)return;const v=new URLSearchParams;o.dataset.cat&&o.dataset.cat!=="全部"&&v.set("category",o.dataset.cat),a==="popular"&&v.set("sort","popular"),location.hash=`#/posts${v.toString()?"?"+v.toString():""}`}),t.querySelectorAll("[data-sort]").forEach(g=>{g.addEventListener("click",()=>{const o=new URLSearchParams;s!=="全部"&&o.set("category",s),g.dataset.sort==="popular"&&o.set("sort","popular"),location.hash=`#/posts${o.toString()?"?"+o.toString():""}`})});try{await c(!0)}catch(g){x(g.message,"err"),r.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}function zt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ve=zt();function Ds(t){ve=t}var he={exec:()=>null};function pe(t){let e=[];return a=>{let s=Math.max(0,Math.min(3,a-1)),n=e[s];return n||(n=t(s),e[s]=n),n}}function M(t,e=""){let a=typeof t=="string"?t:t.source,s={replace:(n,r)=>{let i=typeof r=="string"?r:r.source;return i=i.replace(I.caret,"$1"),a=a.replace(n,i),s},getRegex:()=>new RegExp(a,e)};return s}var Bs=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),Os="^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)",I={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,textIndentedContinuation:/^(?:\n(?: {4}| {0,3}\t)[ \t]*[^ \t\n][^\n]*)+/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,blockquoteFenceOpen:/^ {0,3}(`{3,}(?=[^`]*$)|~{3,})/,blockquoteFenceClose:/^ {0,3}(`{3,}|~{3,})[ \t]*$/,blockquoteListItemStart:/^ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|$)/,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableHeader:new RegExp(Os+"(?:\\n|$)"),tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:pe(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:pe(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:pe(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:pe(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:pe(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:pe(t=>new RegExp(`^ {0,${t}}(?:</?(?:${Pt})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:pe(t=>new RegExp(`^ {0,${t}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},Ca=/^(?:[ \t]*(?:\n|$))+/,Ra=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,za=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*)[ \t]*(?=\n|$)|$)/,je=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ia=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,It=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Pt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ne=M(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",Pt).getRegex(),js=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,Ns=M(js).replace(/bull/g,It).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,Ne).getRegex(),Pa=M(js).replace(/bull/g,It).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,Ne).getRegex(),Ht=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Ha=/^[^\n]+/,_t=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,_a=M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",_t).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),Da=M(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,It).getRegex(),Dt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ba=M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Dt).replace("tag",Pt).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),Us=t=>M(Ht).replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html",Ne).getRegex(),Oa=Us(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),ja=Us(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),ms=/ {0,3}> ?(?:(?!blank)(paragraph)|[^\n]*)(?:\n|$)/,Na=M(/^(first)(?:next)*/).replace("first",M(ms).replace("blank",/[ \t]*(?:\n|$)| {4}/).getRegex()).replace("next",M(ms).replace("blank",/[ \t]*(?:\n|$)/).getRegex()).replace(/paragraph/g,ja).getRegex(),Bt={blockquote:Na,code:Ra,def:_a,fences:za,heading:Ia,hr:je,html:Ba,lheading:Ns,list:Da,newline:Ca,paragraph:Oa,table:he,text:Ha},Ua=M(Os+"(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",Ne).getRegex(),Fa={...Bt,lheading:Pa,table:Ua,paragraph:M(Ht).replace("hr",je).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",I.tableHeader).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",Ne).getRegex()},Za={...Bt,html:M(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",Dt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:he,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(Ht).replace("hr",je).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",Ns).getRegex()},Va=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ga=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Fs=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,Wa=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,J=/[\p{P}\p{S}]/u,Ae=/[\s\p{P}\p{S}]/u,Ue=/[^\s\p{P}\p{S}]/u,Qa=M(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ae).getRegex(),Xa=/[\p{Pi}\p{Ps}"']/u,Zs=/(?!~)[\p{P}\p{S}]/u,Ka=/(?!~)[\s\p{P}\p{S}]/u,Ya=/(?:[^\s\p{P}\p{S}]|~)/u,Ja=M(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Bs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Vs=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,en=M(Vs,"u").replace(/punct/g,J).getRegex(),tn=M(Vs,"u").replace(/punct/g,Zs).getRegex(),sn=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,an=M(sn,"u").replace(/openQuote/g,Xa).replace(/punct/g,J).getRegex(),Gs="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",nn=M(Gs,"gu").replace(/notPunctSpace/g,Ue).replace(/punctSpace/g,Ae).replace(/punct/g,J).getRegex(),rn=M(Gs,"gu").replace(/notPunctSpace/g,Ya).replace(/punctSpace/g,Ka).replace(/punct/g,Zs).getRegex(),ln="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",on=M(ln,"gu").replace(/notPunctSpace/g,Ue).replace(/punctSpace/g,Ae).replace(/punct/g,J).getRegex(),cn=M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Ue).replace(/punctSpace/g,Ae).replace(/punct/g,J).getRegex(),dn="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",un=M(dn,"gu").replace(/notPunctSpace/g,Ue).replace(/punctSpace/g,Ae).replace(/punct/g,J).getRegex(),pn=M(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,J).getRegex(),hn="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",mn=M(hn,"gu").replace(/notPunctSpace/g,Ue).replace(/punctSpace/g,Ae).replace(/punct/g,J).getRegex(),gn=M(/\\(punct)/,"gu").replace(/punct/g,J).getRegex(),bn=M(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,J).getRegex(),fn=M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),vn=M(Dt).replace("(?:-->|$)","-->").getRegex(),kn=M("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",vn).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ws=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,it=M(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Ws).getRegex(),pt=/\\[^ \t\n\x00-\x1f]|\\(?=[ \t\n])|[^ \t\n\x00-\x1f\\()]/,yn=M(/\((?:char)*\)/).replace("char",pt).getRegex(),$n=M(/\((?:char|p1)*\)/).replace("char",pt).replace("p1",yn).getRegex(),wn=M(/\((?:char|p2)*\)/).replace("char",pt).replace("p2",$n).getRegex(),xn=M(/(?!<)(?:char|p3)+/).replace("char",pt).replace("p3",wn).getRegex(),Sn=M(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",it).replace("href",M(/<(?:\\.|[^\n<>\\])*>|bareHref|(?=\))/).replace("bareHref",xn).getRegex()).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),Ln=M(/^!?\[(label)\]\[(ref)\]/).replace("label",it).replace("ref",_t).getRegex(),En=M(/^!?\[(ref)\](?:\[\])?/).replace("ref",_t).getRegex(),gs=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,Tn=M(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Ws).getRegex(),Mn=M("reflink|nolink(?!\\()","g").replace("reflink",M(/^!?\[(label)\]\[(ref)\]/).replace("label",Tn).replace("ref",gs).getRegex()).replace("nolink",M(/^!?\[(ref)\](?:\[\])?/).replace("ref",gs).getRegex()).getRegex(),bs=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,qn=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,An=M(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,qn).getRegex(),Ot={_backpedal:he,anyPunctuation:gn,anyPunctuationOutsideCode:bn,autolink:fn,blockSkip:Ja,br:Fs,code:Ga,del:he,delLDelim:he,delRDelim:he,emStrongLDelim:en,emStrongRDelimAst:nn,emStrongRDelimUnd:cn,escape:Va,link:Sn,nolink:En,punctuation:Qa,reflink:Ln,reflinkSearch:Mn,tag:kn,text:Wa,url:he},Cn={...Ot,emStrongLDelim:an,emStrongRDelimAst:on,emStrongRDelimUnd:un,link:M(/^!?\[(label)\]\((.*?)\)/).replace("label",it).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",it).getRegex()},Et={...Ot,emStrongRDelimAst:rn,emStrongLDelim:tn,delLDelim:pn,delRDelim:mn,url:M(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",An).replace("protocol",bs).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:M(/^(?:[A-Za-z0-9.+-]+(?=@)|[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",bs).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",Bs?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},Rn={...Et,br:M(Fs).replace("{2,}","*").getRegex(),text:M(Et.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Qe={normal:Bt,gfm:Fa,pedantic:Za},He={normal:Ot,gfm:Et,breaks:Rn,pedantic:Cn},zn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},fs=t=>zn[t];function N(t,e){if(e){if(I.escapeTest.test(t))return t.replace(I.escapeReplace,fs)}else if(I.escapeTestNoEncode.test(t))return t.replace(I.escapeReplaceNoEncode,fs);return t}function In(t){return I.numericCharacterReference.test(t)?t.replace(I.numericCharacterReferenceOrAmpersand,(e,a,s)=>{if(a===void 0&&s===void 0)return"&amp;";let n=a===void 0?Number.parseInt(s,16):Number.parseInt(a,10);return n===0||n>1114111||n>=55296&&n<=57343?"�":n===38?"&amp;":String.fromCodePoint(n)}):t}function vs(t){try{t=encodeURI(t).replace(I.percentDecode,"%")}catch{return null}return t}function $t(t,e){var r;let a=t.replace(I.findPipe,(i,l,d)=>{let h=!1,p=l;for(;--p>=0&&d[p]==="\\";)h=!h;return h?"|":" |"}),s=a.split(I.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!((r=s.at(-1))!=null&&r.trim())&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(I.slashPipe,"|");return s}function se(t,e,a){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function ks(t){let e=t.split(`
`),a=e.length-1;for(;a>=0&&I.blankLine.test(e[a]);)a--;return e.length-a<=2?t:e.slice(0,a+1).join(`
`)}function rt(t){return t.trim().replace(I.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function ys(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let a=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])a++;else if(t[s]===e[1]&&(a--,a<0))return s;return a>0?-2:-1}var qe=new WeakMap;function jt(t){let e={"*":-1,_:-1},a=-1,s=t.length;for(let n=0;n<s;n++){let r=t[n];if(r!=="*"&&r!=="_"&&r!=="~")continue;let i=n===0?`
`:t[n-1],l=n+1;for(;l<s&&t[l]===r;)l++;i!==" "&&i!=="	"&&i!==`
`&&i!=="\r"&&i!=="\f"&&(r==="~"?a=n:e[r]=n),n=l-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:a}}function Pn(t,e){let a=jt(e),s=qe.get(t);s?s.push(a):qe.set(t,[a])}function Hn(t){let e=qe.get(t);e&&(e.pop(),e.length===0&&qe.delete(t))}function Qs(t,e,a){var n;let s=(n=qe.get(t))==null?void 0:n.at(-1);return s&&s.maskedSrc===e?s.lastPossibleEmStrongCloserIndex[a]:jt(e).lastPossibleEmStrongCloserIndex[a]}function Xs(t,e){var s;let a=(s=qe.get(t))==null?void 0:s.at(-1);return a&&a.maskedSrc===e?a.lastPossibleDelCloserIndex:jt(e).lastPossibleDelCloserIndex}function Xe(t,e=0){let a=e,s="";for(let n of t)if(n==="	"){let r=4-a%4;s+=" ".repeat(r),a+=r}else s+=n,a++;return s}function _n(t){let e,a=!1;return t.map(s=>{var h,p,c;if(a)return s;let{depth:n,expanded:r,keptIndent:i,content:l}=Dn(s,(h=e==null?void 0:e.depth)!=null?h:1/0);if((e==null?void 0:e.depth)!==n&&(e=void 0),e){let g=(p=I.blockquoteFenceClose.exec(l))==null?void 0:p[1];return!g||g[0]!==e.marker[0]||g.length<e.marker.length?i:(e=void 0,r)}if(a=I.blockquoteListItemStart.test(l),a)return s;let d=(c=I.blockquoteFenceOpen.exec(l))==null?void 0:c[1];return d&&(e={marker:d,depth:n}),r}).join(`
`)}function Dn(t,e){let a=0,s=0,n=0,r=0,i="";for(;n<e;){let p=a,c=s;for(;t[p]===" "||t[p]==="	";)c+=$s(t[p],c),p++;if(t[p]!==">"||c-r>3)break;i+=" ".repeat(c-s)+">",n++,a=p+1,s=c+1,r=t[a]===" "||t[a]==="	"?s+1:s}if(n===0)return{depth:n,expanded:t,keptIndent:t,content:t};let l="",d="";for(;(t[a]===" "||t[a]==="	")&&s<r+4;){let p=$s(t[a],s);l+=" ".repeat(p),d+=s<r&&p>1?" ".repeat(p):t[a],s+=p,a++}let h=t.slice(a);return{depth:n,expanded:i+l+h,keptIndent:i+d+h,content:" ".repeat(Math.max(0,s-r))+h}}function $s(t,e){return t==="	"?4-e%4:1}function Bn(t,e){let a="";for(let s=0;s<t.length;s++){if(t[s]==="`"){let n=e.inline.code.exec(t.slice(s));if(n){a+=n[0],s+=n[0].length-1;continue}}if(t[s]==="\\"&&(t[s+1]==="["||t[s+1]==="]")){a+=t[s+1],s++;continue}a+=t[s]}return a}function ws(t,e,a,s,n){let r=e.href,i=e.title||null,l=Bn(t[1],n),d=t[0].charAt(0)==="!",h=s.state.inLink,p=s.state.linkEmitted,c=s.state.inRawBlock;s.state.inLink=!0,s.state.linkEmitted=!1;let g=s.inlineTokens(l),o=s.state.linkEmitted;if(s.state.linkEmitted=p,s.state.inLink=h,!d){if(o){s.state.inRawBlock=c;return}s.state.linkEmitted=!0}return{type:d?"image":"link",raw:a,href:r,title:i,text:l,tokens:g}}function On(t,e,a){let s=t.match(a.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(r=>{let i=r.match(a.other.beginningSpace);if(i===null)return r;let[l]=i;return r.slice(Math.min(l.length,n.length))}).join(`
`)}function xs(t,e,a,s){if(!e.includes("<"))return!1;for(let n=0;n<e.length;n++){if(e[n]==="\\"){n++;continue}if(e[n]==="`"){let l=s.inline.code.exec(e.slice(n));if(l){n+=l[0].length-1;continue}}if(e[n]!=="<")continue;let r=t.slice(a+n),i=s.inline.tag.exec(r)||s.inline.autolink.exec(r);if(i){if(i[0].length>e.length-n)return!0;n+=i[0].length-1}}return!1}var me=class{constructor(t){C(this,"options");C(this,"rules");C(this,"lexer");this.options=t||ve}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let a=this.options.pedantic?e[0]:ks(e[0]),s=a.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:a,codeBlockStyle:"indented",text:s}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let a=e[0],s=On(a,e[3]||"",this.rules);return e[3]!==void 0&&(s===""||s.endsWith(`
`))&&(s+=`
`),{type:"code",raw:a,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let a=e[2].trim();if(this.rules.other.endingHash.test(a)){let s=se(a,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(a=s.trim())}return{type:"heading",raw:se(e[0],`
`),depth:e[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:se(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let a=se(e[0],`
`).split(`
`),s="",n="",r=[];for(;a.length>0;){let i=!1,l=[],d;for(d=0;d<a.length;d++)if(this.rules.other.blockquoteStart.test(a[d]))l.push(a[d]),i=!0;else if(!i)l.push(a[d]);else break;a=a.slice(d);let h=l.join(`
`),p=(this.lexer.state.top&&!this.lexer.state.inBlockquote&&h.includes("	")?_n(l):h).replace(this.rules.other.blockquoteMarkerWhitespace,(v,$,b)=>b.startsWith(" ")?$+" "+b.slice(1):$+Xe(b,$.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${h}`:h,n=n?`${n}
${p}`:p;let c=this.lexer.state.top,g=this.lexer.state.inBlockquote;if(this.lexer.state.top=!0,this.lexer.state.inBlockquote=!0,this.lexer.blockTokens(p,r,!0),this.lexer.state.top=c,this.lexer.state.inBlockquote=g,a.length===0)break;let o=r.at(-1);if((o==null?void 0:o.type)==="code"||(o==null?void 0:o.type)==="heading"||(o==null?void 0:o.type)==="hr"||(o==null?void 0:o.type)==="html"||(o==null?void 0:o.type)==="table")break;if((o==null?void 0:o.type)==="blockquote"){let v=o,$=a.join(`
`),b=v.raw+`
`+$.replace(this.rules.other.blockquoteSetextReplace2,"");this.lexer.state.inBlockquote=!0;let E=this.blockquote(b);this.lexer.state.inBlockquote=g,r[r.length-1]=E;let y=b.substring(E.raw.length).replace(/^\n/,""),H=y?y.split(`
`).length:0,S=H?a.slice(0,-H):a;if(S.length>0&&(s=`${s}
${S.join(`
`)}`),n=n.substring(0,n.length-v.text.length)+E.text,a=a.slice(S.length),a.length>0&&this.rules.other.blockquoteStart.test(a[0]))continue;break}else if((o==null?void 0:o.type)==="list"){let v=o,$=v.raw+`
`+a.join(`
`),b=this.list($);r[r.length-1]=b;let E=b.raw.length>v.raw.length?$.slice(v.raw.length+1,b.raw.length).split(`
`).length:0;if(E>0){let y=a.slice(0,E).join(`
`);s=`${s}
${y}`,n=`${n}
${y}`}if(a=a.slice(E),a.length>0&&!this.rules.other.blockquoteStart.test(a[0]))break;continue}}return{type:"blockquote",raw:s,tokens:r,text:n}}}list(t){var a;let e=this.rules.block.list.exec(t);if(e){if(!this.options.pedantic&&((a=this.lexer.state.lastToken)==null?void 0:a.type)==="text"&&!this.rules.other.listInterruptsParagraph.test(t))return;let s=t,n=()=>s.length-t.length,r=e[1].trim(),i=r.length>1,l={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let d=this.rules.other.listItemRegex(r),h=!1;for(;t;){let g=!1,o="";if(!(e=d.exec(t))||this.rules.block.hr.test(t))break;let v=n();t=t.substring(e[0].length);let $=e[2].split(`
`,1)[0],b=e[1].length,E=this.options.pedantic?Xe($,b):$.replace(this.rules.other.leadingSpaceTab,P=>Xe(P,b)),y=t.split(`
`,1)[0],H=!E.trim(),S=0;if(this.options.pedantic?(S=2,o=E.trimStart()):H?S=b+1:(S=E.search(this.rules.other.nonSpaceChar),S=S>4?1:S,o=E.slice(S),S+=b),H&&this.rules.other.blankLine.test(y)&&(t=t.substring(y.length+1),g=!0),!g){let P=this.rules.other.nextBulletRegex(S),oe=this.rules.other.hrRegex(S),V=this.rules.other.fencesBeginRegex(S),ee=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(S):this.rules.other.headingBeginRegex(S),ce=this.rules.other.htmlBeginRegex(S),ke=this.rules.other.blockquoteBeginRegex(S),Ce=!1;for(;t;){let ye=t.split(`
`,1)[0],B;if(y=ye,this.options.pedantic?(y=y.replace(this.rules.other.listReplaceNesting,"  "),B=y):B=y.replace(this.rules.other.leadingSpaceTab,D=>Xe(D)),V.test(y)||ee.test(y)||ce.test(y)||ke.test(y)||P.test(y)||oe.test(y))break;if(B.search(this.rules.other.nonSpaceChar)>=S||!y.trim())o+=`
`+B.slice(S),Ce=!1;else{if(H)break;let D=E;if(!this.options.pedantic&&!o.includes(`
`)&&!E.includes("	")){let U;for(;!oe.test(D)&&(U=this.rules.other.nestedBlockMarker.exec(D));)D=D.slice(U[0].length);if(!D.trim())break}if(D.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||V.test(D)||ee.test(D)||ce.test(D)||oe.test(D))break;if(!this.options.pedantic&&!Ce){let U=E.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(U)||this.rules.block.heading.test(U)||this.rules.block.hr.test(U))break}let ne=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(y)&&this.rules.block.lheading.test(`${E}
${y}`)?`    ${B.replace(/^ {0,3}/,"")}`:y;o+=`
`+ne,Ce=!0}H=!y.trim(),t=t.substring(ye.length+1),E=B.slice(S)}}let q=s.slice(v,n());l.loose||(h?l.loose=!0:this.rules.other.doubleBlankLine.test(q)&&(h=!0)),l.items.push({type:"list_item",raw:q,task:!!this.options.gfm&&this.rules.other.listIsTask.test(o),loose:!1,text:o,tokens:[]})}let p=l.items.at(-1);if(p)p.raw=p.raw.trimEnd(),p.text=p.text.trimEnd();else return;l.raw=s.slice(0,n()).trimEnd();let c=[];for(let g of l.items)if(this.lexer.state.top=!1,c.push(this.lexer.inlineQueue.length),g.tokens=this.lexer.blockTokens(g.text,[]),!l.loose){let o=g.tokens.filter($=>$.type==="space"),v=o.length>0&&o.some($=>this.rules.other.anyLine.test($.raw));l.loose=v}for(let g=0;g<l.items.length;g++){let o=l.items[g],v=o.tokens[0];if(o.task&&((v==null?void 0:v.type)==="text"||(v==null?void 0:v.type)==="paragraph")){o.text=o.text.replace(this.rules.other.listReplaceTask,""),v.raw=v.raw.replace(this.rules.other.listReplaceTask,""),v.text=v.text.replace(this.rules.other.listReplaceTask,"");let $=this.lexer.inlineQueue;for(let E=c[g];E<$.length;E++)if($[E].tokens===v.tokens){$[E].src=$[E].src.replace(this.rules.other.listReplaceTask,"");break}let b=this.rules.other.listTaskCheckbox.exec(o.raw);if(b){let E={type:"checkbox",raw:b[0]+" ",checked:b[0]!=="[ ]"};o.checked=E.checked,l.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=E.raw+o.tokens[0].raw,o.tokens[0].text=E.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(E)):o.tokens.unshift({type:"paragraph",raw:E.raw,text:E.raw,tokens:[E]}):o.tokens.unshift(E)}}else o.task&&(o.task=!1)}if(l.loose)for(let g of l.items){g.loose=!0;for(let o of g.tokens)o.type==="text"&&(o.type="paragraph")}return l}}html(t){var a;let e=this.rules.block.html.exec(t);if(e){if(((a=this.lexer.state.lastToken)==null?void 0:a.type)==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(t))return;let s=ks(e[0]);return{type:"html",block:!0,raw:s,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:s}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&ys(e[2],"()")!==-1)return;let a=rt(e[1]),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:a,raw:se(e[0],`
`),href:s,title:n}}}table(t){var i;let e,a;if(this.options.gfm&&!this.options.pedantic){let l=this.rules.other.tableHeader.exec(t);if(!l||!this.rules.other.tableDelimiter.test(l[2])||(e=$t(l[1]),a=l[2].replace(this.rules.other.tableAlignChars,"").split("|"),e.length!==a.length))return}let s=this.rules.block.table.exec(t);if(!s||!this.rules.other.tableDelimiter.test(s[2]))return;e!=null||(e=$t(s[1])),a!=null||(a=s[2].replace(this.rules.other.tableAlignChars,"").split("|"));let n=(i=s[3])!=null&&i.trim()?s[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:se(s[0],`
`),header:[],align:[],rows:[]};if(e.length===a.length){for(let l of a)this.rules.other.tableAlignRight.test(l)?r.align.push("right"):this.rules.other.tableAlignCenter.test(l)?r.align.push("center"):this.rules.other.tableAlignLeft.test(l)?r.align.push("left"):r.align.push(null);for(let l=0;l<e.length;l++)r.header.push({text:e[l],tokens:this.lexer.inline(e[l]),header:!0,align:r.align[l]});for(let l of n)r.rows.push($t(l,r.header.length).map((d,h)=>({text:d,tokens:this.lexer.inline(d),header:!1,align:r.align[h]})));return r}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let a=e[1].trim();return{type:"heading",raw:se(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:a,tokens:this.lexer.inline(a)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let a=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:a,tokens:this.lexer.inline(a)}}}text(t){let e=this.rules.block.text.exec(t);if(e){let a=e[0],s=e[0],n=this.rules.other.textIndentedContinuation.exec(t.slice(a.length));return n&&(a+=n[0],s+=n[0].replace(this.rules.other.codeRemoveIndent,"")),{type:"text",raw:a,text:s,tokens:this.lexer.inline(s)}}}escape(t){if(t.charCodeAt(0)!==92)return;let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=t.charCodeAt(0);if(e!==91&&e!==33)return;let a=this.rules.inline.link.exec(t);if(a){let s=a[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&xs(t,a[1],s,this.rules))return;let n=a[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let d=se(n.slice(0,-1),"\\");if((n.length-d.length)%2===0)return}else{let d=ys(a[2],"()");if(d===-2)return;if(d>-1){let h=(a[0].indexOf("!")===0?5:4)+a[1].length+d;a[2]=a[2].substring(0,d),a[0]=a[0].substring(0,h).trim(),a[3]=""}}let r=se(a[0].slice(0,-1),"\\");if((a[0].length-r.length)%2===0)return;let i=a[2],l="";if(this.options.pedantic){let d=this.rules.other.pedanticHrefTitle.exec(i);d&&(i=d[1],l=d[3])}else l=a[3]?a[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),ws(a,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},a[0],this.lexer,this.rules)}}reflink(t,e){let a=t.charCodeAt(0);if(a!==91&&a!==33)return;let s;if((s=this.rules.inline.reflink.exec(t))||(s=this.rules.inline.nolink.exec(t))){let n=s[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&xs(t,s[1],n,this.rules))return;let r=e[rt(s[2]||s[1])];if(!r){let i=s[0].charAt(0);return{type:"text",raw:i,text:i}}return ws(s,r,s[0],this.lexer,this.rules)}}emStrong(t,e,a=""){var g;let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4])return;let n=s[0][0],r=a===n,i=e.length-t.length,l=i;for(;!this.options.pedantic&&l>0&&e[l-1]===n;)l--;let d=(g=[...e.slice(Math.max(0,l-2),l)].at(-1))!=null?g:"",h=d==="*"||d==="_"||!!this.rules.inline.punctuation.exec(d);l<i&&(a=d);let p=l<i?h:a==="*"||a==="_"||!!this.rules.inline.punctuation.exec(a);if(s[4]&&a.match(this.rules.other.unicodeAlphaNumeric))return;let c=s[1]||s[3]||"";if(!c||!a||p){let o=[...s[0]].length-1,v,$,b=o,E=0,y=i-l+o,H=!this.options.pedantic&&!!d.trim()&&(!!c||n==="*"&&!h);if(n!=="*"&&n!=="_")return;let S=n==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,q=Qs(this,e,n),P=e.length-t.length+o;if(q<P)return;e=e.slice(-1*t.length+o);let oe=q-P;for(S.lastIndex=0;(s=S.exec(e))!==null&&!(s.index>oe);){if(v=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!v)continue;if($=[...v].length,s[3]||s[4]){b+=$;continue}else if((s[5]||s[6]||H)&&y%3&&!((y+$)%3)){if(r&&(s[5]||s[6]))break;E+=$;continue}if(b-=$,b>0)continue;$=Math.min($,$+b+E);let V=[...s[0]][0].length,ee=t.slice(0,o+s.index+V+$);if(Math.min(o,$)%2){let ke=ee.slice(1,-1);return{type:"em",raw:ee,text:ke,tokens:this.lexer.inlineTokens(ke)}}let ce=ee.slice(2,-2);return{type:"strong",raw:ee,text:ce,tokens:this.lexer.inlineTokens(ce)}}}}codespan(t){if(t.charCodeAt(0)!==96)return;let e=this.rules.inline.code.exec(t);if(e){let a=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return s&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:e[0],text:a}}}br(t){let e=t.charCodeAt(0);if(e!==32&&e!==92&&e!==10)return;let a=this.rules.inline.br.exec(t);if(a)return{type:"br",raw:a[0]}}del(t,e,a=""){if(t.charCodeAt(0)!==126)return;let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!a||this.rules.inline.punctuation.exec(a))){let n=[...s[0]].length-1,r,i,l=n,d=this.rules.inline.delRDelim,h=Xs(this,e),p=e.length-t.length+n;if(h<p)return;e=e.slice(-1*t.length+n);let c=h-p;for(d.lastIndex=0;(s=d.exec(e))!==null&&!(s.index>c);){if(r=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!r||(i=[...r].length,i!==n))continue;if(s[3]||s[4]){l+=i;continue}if(l-=i,l>0)continue;i=Math.min(i,i+l);let g=[...s[0]][0].length,o=t.slice(0,n+s.index+g+i),v=o.slice(n,-n);return{type:"del",raw:o,text:v,tokens:this.lexer.inlineTokens(v)}}}}autolink(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.autolink.exec(t);if(e){let a,s;return e[2]==="@"?(a=e[1],s="mailto:"+a):(a=e[1],s=a),{type:"link",raw:e[0],text:a,href:s,autolink:!0,tokens:[{type:"text",raw:a,text:a}]}}}url(t){var a,s;let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let i;do i=e[0],e[0]=(s=(a=this.rules.inline._backpedal.exec(e[0]))==null?void 0:a[0])!=null?s:"";while(i!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let a=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:a?e[0]:In(e[0]),escaped:a}}}},Q,Ks,Tt,Ys,Js,ge,G=(ge=class{constructor(e){os(this,Q);C(this,"tokens");C(this,"options");C(this,"state");C(this,"inlineQueue");C(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ve,this.options.tokenizer=this.options.tokenizer||new me,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0,inBlockquote:!1};let a={other:I,block:Qe.normal,inline:He.normal};this.options.pedantic?(a.block=Qe.pedantic,a.inline=He.pedantic):this.options.gfm&&(a.block=Qe.gfm,this.options.breaks?a.inline=He.breaks:a.inline=He.gfm),this.tokenizer.rules=a}static get rules(){return{block:Qe,inline:He}}static lex(e,a){return new ge(a).lex(e)}static lexInline(e,a){return new ge(a).inlineTokens(e)}lex(e){e=e.replace(I.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let s=this.inlineQueue[a];this.state.inRawBlock=!1,this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,a=[],s=!1){var d,h,p;this.tokenizer.lexer=this;let n=this.state.lastToken;this.options.pedantic&&(e=e.replace(I.tabCharGlobal,"    ").replace(I.spaceLine,""));let r=1/0,i,l=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===me.prototype.paragraph;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}this.state.lastToken=a.at(-1);let c;if((h=(d=this.options.extensions)==null?void 0:d.block)!=null&&h.some(o=>(c=o.call({lexer:this},e,a))?(e=e.substring(c.raw.length),a.push(c),!0):!1))continue;if(c=this.tokenizer.space(e)){e=e.substring(c.raw.length);let o=a.at(-1);c.raw.length===1&&o!==void 0?o.raw+=`
`:a.push(c);continue}if(c=this.tokenizer.code(e)){e=e.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.at(-1).src=o.text):a.push(c);continue}if(c=this.tokenizer.fences(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.heading(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.hr(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.blockquote(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.list(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.html(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.def(e)){e=e.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.raw,this.inlineQueue.at(-1).src=o.text):(this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title}),a.push(c));continue}if(c=this.tokenizer.table(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.lheading(e)){e=e.substring(c.raw.length),a.push(c);continue}let g=e;if((p=this.options.extensions)!=null&&p.startBlock){let o=1/0,v=e.slice(1),$;this.options.extensions.startBlock.forEach(b=>{$=b.call({lexer:this},v),typeof $=="number"&&$>=0&&(o=Math.min(o,$))}),o<1/0&&o>=0&&(g=e.substring(0,o+1))}if(this.state.top&&(c=this.tokenizer.paragraph(g))){let o=a.at(-1);(s||o===i&&l)&&(o==null?void 0:o.type)==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text,i=o):(a.push(c),i=c),s=g.length!==e.length,e=e.substring(c.raw.length);continue}if(c=this.tokenizer.text(e)){e=e.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):a.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=n,a}inline(e,a=[]){return this.inlineQueue.push({src:e,tokens:a}),a}linkInText(e){if(!e.includes("["))return!1;let a=this.tokenizer.rules.inline.link;for(let s of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(a.test(s[0])&&e.charAt(s.index-1)!=="!")return!0;for(let s of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let n=s[0],r=n.lastIndexOf("[");if(!(n.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,rt(n.slice(r+1,-1))))&&!(r>1&&this.linkInText(n.slice(1,r-1))))return!0}return!1}inlineTokens(e,a=[]){this.tokenizer.lexer=this;let s=this.state.linkParenPossible;this.state.linkParenPossible=e.includes(")");try{return Le(this,Q,Ks).call(this,e,a)}finally{this.state.linkParenPossible=s}}infiniteLoopError(e){let a="Infinite loop on byte: "+e;if(this.options.silent)console.error(a);else throw new Error(a)}},Q=new WeakSet,Ks=function(e,a){var r;let s=e.includes("*")||e.includes("_")||e.includes("~"),n=s||(r=this.options.hooks)!=null&&r.emStrongMask||this.tokenizer.emStrong!==me.prototype.emStrong||this.tokenizer.del!==me.prototype.del?Le(this,Q,Js).call(this,e):e;if(!s)return Le(this,Q,Tt).call(this,e,n,a);Pn(this.tokenizer,n);try{return Le(this,Q,Tt).call(this,e,n,a)}finally{Hn(this.tokenizer)}},Tt=function(e,a,s){var l,d,h;let n=!1,r="",i=1/0;for(;e;){if(e.length<i)i=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}n||(r=""),n=!1;let p;if((d=(l=this.options.extensions)==null?void 0:l.inline)!=null&&d.some(o=>(p=o.call({lexer:this},e,s))?(e=e.substring(p.raw.length),s.push(p),!0):!1))continue;if(p=this.tokenizer.escape(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.tag(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.link(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(p.raw.length);let o=s.at(-1);p.type==="text"&&(o==null?void 0:o.type)==="text"?(o.raw+=p.raw,o.text+=p.text):s.push(p);continue}let c=e[0];if(c==="*"||c==="_"){let o=a.length-e.length;if(Qs(this.tokenizer,a,c)<=o){let v=1;for(;v<e.length&&e.charCodeAt(v)===c.charCodeAt(0);)v++;let $=e.substring(0,v),b=s.at(-1);(b==null?void 0:b.type)==="text"&&!b.escaped?(b.raw+=$,b.text+=$):s.push({type:"text",raw:$,text:$,escaped:!1}),e=e.substring(v),r=c,n=!0;continue}}else if(c==="~"){let o=a.length-e.length;if(Xs(this.tokenizer,a)<=o){let v=1;for(;v<e.length&&e.charCodeAt(v)===126;)v++;let $=e.substring(0,v),b=s.at(-1);(b==null?void 0:b.type)==="text"&&!b.escaped?(b.raw+=$,b.text+=$):s.push({type:"text",raw:$,text:$,escaped:!1}),e=e.substring(v),r=c,n=!0;continue}}if(p=this.tokenizer.emStrong(e,a,r)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.codespan(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.br(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.del(e,a,r)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.autolink(e)){e=e.substring(p.raw.length),s.push(p);continue}if(!this.state.inLink&&(p=this.tokenizer.url(e))){e=e.substring(p.raw.length),s.push(p);continue}let g=e;if((h=this.options.extensions)!=null&&h.startInline){let o=1/0,v=e.slice(1),$;this.options.extensions.startInline.forEach(b=>{$=b.call({lexer:this},v),typeof $=="number"&&$>=0&&(o=Math.min(o,$))}),o<1/0&&o>=0&&(g=e.substring(0,o+1))}if(p=this.tokenizer.inlineText(g)){e=e.substring(p.raw.length),p.raw.slice(-1)!=="_"&&(r=p.raw.slice(-1)),n=!0;let o=s.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=p.raw,o.text+=p.text):s.push(p);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return s},Ys=function(e){let{blockSkip:a,tag:s,autolink:n}=this.tokenizer.rules.inline,r="",i=0,l;for(a.lastIndex=0;l=a.exec(e);){let d=l.index+(l[2]?l[2].length:0),h=l.index+l[0].length;if(e.charAt(d)==="<"){let p=e.slice(d),c=s.exec(p)||n.exec(p);if(!c){a.lastIndex=d+1;continue}h=d+c[0].length,a.lastIndex=h}r+=e.slice(i,d)+"["+"a".repeat(h-d-2)+"]",i=h}return r+e.slice(i)},Js=function(e){var s,n,r;let a=e;if(this.tokens.links&&e.includes("[")){let i=this.tokenizer.rules.inline.reflinkSearch,l=d=>{let h=d.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,rt(d.slice(h+1,-1))))return d;if(h>1&&d.charAt(0)!=="!"){let p=d.slice(1,h-1);if(this.linkInText(p))return"["+p.replace(i,l)+"]["+"a".repeat(d.length-h-2)+"]"}return"["+"a".repeat(d.length-2)+"]"};a=a.replace(i,l)}return a=a.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(i,l,d)=>d?"+".repeat(i.length):l?l+i.slice(l.length,-l.length).replace(/`/g,"+")+l:i),a=Le(this,Q,Ys).call(this,a),a=(r=(n=(s=this.options.hooks)==null?void 0:s.emStrongMask)==null?void 0:n.call({lexer:this},a))!=null?r:a,a},ge);function ea(t){return t.map(e=>e.type==="codespan"||e.type==="escape"?{...e,text:N(e.text,!0)}:"tokens"in e&&e.tokens?{...e,tokens:ea(e.tokens)}:e)}var lt=class{constructor(t){C(this,"options");C(this,"parser");this.options=t||ve}space(t){return""}code({text:t,lang:e,escaped:a}){var r;let s=(r=(e||"").match(I.notSpaceStart))==null?void 0:r[0],n=t?t.replace(I.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+N(s)+'">'+(a?n:N(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:N(n,!0))+`</code></pre>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${N(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:a,tokens:s,autolink:n}){let r=n?N(a,!0):this.parser.parseInline(s),i=vs(t);if(i===null)return r;t=N(i,n);let l='<a href="'+t+'"';return e&&(l+=' title="'+N(e)+'"'),l+=">"+r+"</a>",l}image({href:t,title:e,text:a,tokens:s}){s&&(a=this.parser.parseInline(ea(s),this.parser.textRenderer));let n=vs(t);if(n===null)return N(a);t=n;let r=`<img src="${N(t)}" alt="${N(a)}"`;return e&&(r+=` title="${N(e)}"`),r+=">",r}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:N(t.text)}},Nt=class{constructor(){C(this,"parser")}strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return`
`}checkbox({raw:t}){return t}},W=class Mt{constructor(e){C(this,"options");C(this,"renderer");C(this,"textRenderer");this.options=e||ve,this.options.renderer=this.options.renderer||new lt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Nt,this.textRenderer.parser=this}static parse(e,a){return new Mt(a).parse(e)}static parseInline(e,a){return new Mt(a).parseInline(e)}parse(e){var s;this.renderer.parser=this;let a="";for(let n=0;n<e.length;n++){let r=e[n],i=(s=this.options.extensions)==null?void 0:s.renderers;if(i&&Object.hasOwn(i,r.type)&&i[r.type]){let d=r,h=i[d.type].call({parser:this},d);if(h!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(d.type)){a+=h===!1?"":h!=null?h:"";continue}}let l=r;switch(l.type){case"space":{a+=this.renderer.space(l);break}case"hr":{a+=this.renderer.hr(l);break}case"heading":{a+=this.renderer.heading(l);break}case"code":{a+=this.renderer.code(l);break}case"table":{a+=this.renderer.table(l);break}case"blockquote":{a+=this.renderer.blockquote(l);break}case"list":{a+=this.renderer.list(l);break}case"checkbox":{a+=this.renderer.checkbox(l);break}case"html":{a+=this.renderer.html(l);break}case"def":{a+=this.renderer.def(l);break}case"paragraph":{a+=this.renderer.paragraph(l);break}case"text":{a+=this.renderer.text(l);break}default:{let d='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(d),"";throw new Error(d)}}}return a}parseInline(e,a=this.renderer){var n;this.renderer.parser=this;let s="";for(let r=0;r<e.length;r++){let i=e[r],l=(n=this.options.extensions)==null?void 0:n.renderers;if(l&&Object.hasOwn(l,i.type)&&l[i.type]){let h=l[i.type].call({parser:this},i);if(h!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){s+=h===!1?"":h!=null?h:"";continue}}let d=i;switch(d.type){case"escape":{s+=a.text(d);break}case"html":{s+=a.html(d);break}case"link":{s+=a.link(d);break}case"image":{s+=a.image(d);break}case"checkbox":{s+=a.checkbox(d);break}case"strong":{s+=a.strong(d);break}case"em":{s+=a.em(d);break}case"codespan":{s+=a.codespan(d);break}case"br":{s+=a.br(d);break}case"del":{s+=a.del(d);break}case"text":{s+=a.text(d);break}default:{let h='Token with "'+d.type+'" type was not found.';if(this.options.silent)return console.error(h),"";throw new Error(h)}}}return s}},et,Be=(et=class{constructor(t){C(this,"options");C(this,"block");this.options=t||ve}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?G.lex:G.lexInline}provideParser(t=this.block){return t?W.parse:W.parseInline}},C(et,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),C(et,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),et);function ie(t,e){if(Array.isArray(e))for(let a=0;a<e.length;a++)t.push(e[a]);else t.push(e)}var jn=class{constructor(...t){C(this,"defaults",zt());C(this,"options",this.setOptions);C(this,"parse",this.parseMarkdown(!0));C(this,"parseInline",this.parseMarkdown(!1));C(this,"Parser",W);C(this,"Renderer",lt);C(this,"TextRenderer",Nt);C(this,"Lexer",G);C(this,"Tokenizer",me);C(this,"Hooks",Be);this.use(...t)}walkTokens(t,e){var s,n;let a=[];for(let r of t)switch(ie(a,e.call(this,r)),r.type){case"table":{let i=r;for(let l of i.header)ie(a,this.walkTokens(l.tokens,e));for(let l of i.rows)for(let d of l)ie(a,this.walkTokens(d.tokens,e));break}case"list":{let i=r;ie(a,this.walkTokens(i.items,e));break}default:{let i=r;(n=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&n[i.type]?this.defaults.extensions.childTokens[i.type].forEach(l=>{if(i[l]){let d=i[l].flat(1/0);ie(a,this.walkTokens(d,e))}}):i.tokens&&ie(a,this.walkTokens(i.tokens,e))}}return a}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(a=>{let s={...a};if(s.async=this.defaults.async||s.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let r=e.renderers[n.name];r?e.renderers[n.name]=function(...i){let l=n.renderer.apply(this,i);return l===!1&&(l=r.apply(this,i)),l}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=e[n.level];r?r.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),a.renderer){let n=this.defaults.renderer||new lt(this.defaults);for(let r in a.renderer){if(!(r in n))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;let i=r,l=a.renderer[i],d=n[i];n[i]=(...h)=>{let p=l.apply(n,h);return p===!1&&(p=d.apply(n,h)),p===!1?"":p!=null?p:""}}s.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new me(this.defaults);for(let r in a.tokenizer){if(!(r in n))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let i=r,l=a.tokenizer[i],d=n[i];n[i]=(...h)=>{let p=l.apply(n,h);return p===!1&&(p=d.apply(n,h)),p}}s.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new Be;for(let r in a.hooks){if(!(r in n))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;let i=r,l=a.hooks[i],d=n[i];Be.passThroughHooks.has(r)?n[i]=h=>{if(n.options.async&&Be.passThroughHooksRespectAsync.has(r))return(async()=>{let c=await l.call(n,h);return d.call(n,c)})();let p=l.call(n,h);return d.call(n,p)}:n[i]=(...h)=>{if(n.options.async)return(async()=>{let c=await l.apply(n,h);return c===!1&&(c=await d.apply(n,h)),c})();let p=l.apply(n,h);return p===!1&&(p=d.apply(n,h)),p}}s.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,r=a.walkTokens;s.walkTokens=function(i){let l=[];return ie(l,r.call(this,i)),n&&ie(l,n.call(this,i)),l}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return G.lex(t,e!=null?e:this.defaults)}parser(t,e){return W.parse(t,e!=null?e:this.defaults)}parseMarkdown(t){return(e,a)=>{let s={...a},n={...this.defaults,...s},r=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return r(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(e):e,l=await(n.hooks?await n.hooks.provideLexer(t):t?G.lex:G.lexInline)(i,n),d=n.hooks?await n.hooks.processAllTokens(l):l;n.walkTokens&&await Promise.all(this.walkTokens(d,n.walkTokens));let h=await(n.hooks?await n.hooks.provideParser(t):t?W.parse:W.parseInline)(d,n);return n.hooks?await n.hooks.postprocess(h):h})().catch(r);try{n.hooks&&(e=n.hooks.preprocess(e));let i=(n.hooks?n.hooks.provideLexer(t):t?G.lex:G.lexInline)(e,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let l=(n.hooks?n.hooks.provideParser(t):t?W.parse:W.parseInline)(i,n);return n.hooks&&(l=n.hooks.postprocess(l)),l}catch(i){return r(i)}}}onError(t,e){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+N(a.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(a);throw a}}},be=new jn;function z(t,e){return be.parse(t,e)}z.options=z.setOptions=function(t){return be.setOptions(t),z.defaults=be.defaults,Ds(z.defaults),z};z.getDefaults=zt;z.defaults=ve;function Nn(...t){return be.use(...t),z.defaults=be.defaults,Ds(z.defaults),z}z.use=Nn;z.walkTokens=function(t,e){return be.walkTokens(t,e)};z.parseInline=be.parseInline;z.Parser=W;z.parser=W.parse;z.Renderer=lt;z.TextRenderer=Nt;z.Lexer=G;z.lexer=G.lex;z.Tokenizer=me;z.Hooks=Be;z.parse=z;z.options;z.setOptions;z.walkTokens;z.parseInline;W.parse;G.lex;z.setOptions({gfm:!0,breaks:!0});function Ut(t){if(!t)return"";const e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;"),a=z.parse(e,{async:!1}),s=document.createElement("template");s.innerHTML=a;for(const n of Array.from(s.content.querySelectorAll("a"))){const r=(n.getAttribute("href")||"").trim();/^https?:\/\//i.test(r)?(n.setAttribute("target","_blank"),n.setAttribute("rel","noopener noreferrer")):/^(mailto:|#|\/)/i.test(r)||n.removeAttribute("href")}for(const n of Array.from(s.content.querySelectorAll("img"))){const r=(n.getAttribute("src")||"").trim();/^(https?:\/\/|\/|data:image\/)/i.test(r)||n.removeAttribute("src")}return s.innerHTML}async function Un(t,e){var d,h,p;const a=Number(e.params.id);t.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const s=await T.post(a);t.innerHTML=`<div class="page narrow">
    <a class="back-link" href="#/posts">${f("back",14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${s.pinned?`<span class="pill pill-pin">${f("pin",11)}置顶</span>`:""}
          <a class="pill cat" style="--cat:${Is(s.category)}" href="#/posts?category=${encodeURIComponent(s.category)}">${m(s.category)}</a>
          ${s.visibility!=="public"?`<span class="pill pill-lock">${f("lock",11)}${s.visibility==="private"?"仅自己可见":"不公开列出"}</span>`:""}
        </div>
        <h1 class="article-title">${m(s.title||"无标题")}</h1>
        <div class="article-meta">
          ${ae(s.author.avatar,s.author.nickname,34,s.author.uin)}
          <div class="article-meta-text">
            <b>${m(s.author.nickname)}</b>
            <span>${us(s.at)} · ${s.readingTime} 分钟阅读 · ${s.views} 次浏览</span>
          </div>
          ${s.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${s.id}">${f("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${f("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${s.cover&&!((d=s.content)!=null?d:"").includes(s.cover)?`<figure class="article-cover"><img src="${m(s.cover)}" alt="" data-zoom="${m(s.cover)}"></figure>`:""}

      <div class="article-body markdown">${Ut((h=s.content)!=null?h:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${s.liked?"active":""}" id="like-btn">
          ${f("heart",16)}<span>${s.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${s.likes.length?`${s.likes.slice(0,8).map(c=>m(c.nickname)).join("、")} 觉得不错`:`写于 ${us(s.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${s.commentNum}</span></h2>
      <div id="comment-area">${hs(s.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,dt(t);const n=t.querySelector("#like-btn");n.addEventListener("click",async()=>{try{const c=await T.likePost(s.id);n.classList.toggle("active",c.liked),n.querySelector("span").textContent=String(c.count||"赞")}catch(c){x(c.message,"err")}}),(p=t.querySelector("#del-post"))==null||p.addEventListener("click",async()=>{if(await at("删除文章",`《${s.title}》删除后无法恢复，确定吗？`))try{await T.deletePost(s.id),x("已删除","ok"),location.hash="#/posts"}catch(c){x(c.message,"err")}});let r="";const i=t.querySelector("#reply-hint"),l=t.querySelector("#comment-area");l.addEventListener("click",async c=>{var $,b;const g=c.target,o=g.closest("[data-reply]");if(o){r=($=o.dataset.reply)!=null?$:"",i.textContent=`回复 ${r}`,t.querySelector("#comment-form textarea").focus();return}const v=g.closest("[data-del-comment]");if(v){if(!await at("删除评论","确定删除这条评论吗？"))return;try{await T.deleteComment(s.id,Number(v.dataset.delComment)),(b=v.closest(".comment"))==null||b.remove(),x("已删除","ok")}catch(E){x(E.message,"err")}}}),t.querySelector("#comment-form").addEventListener("submit",async c=>{c.preventDefault();const o=c.currentTarget.querySelector("textarea"),v=o.value.trim();if(v)try{const $=await T.commentPost(s.id,v,r);s.comments.push($),l.innerHTML=hs(s.comments),o.value="",r="",i.textContent="",x("评论已发布","ok")}catch($){x($.message,"err")}})}const Ss=2560,Fn=3*1024*1024;function Zn(t){return"createImageBitmap"in window?createImageBitmap(t).catch(()=>Ls(t)):Ls(t)}function Ls(t){return new Promise((e,a)=>{const s=URL.createObjectURL(t),n=new Image;n.onload=()=>{URL.revokeObjectURL(s),e(n)},n.onerror=()=>{URL.revokeObjectURL(s),a(new Error("图片解码失败，可能是不支持的格式"))},n.src=s})}function wt(t,e,a){return new Promise((s,n)=>{t.toBlob(r=>r?s(r):n(new Error("图片压缩失败")),e,a)})}async function qt(t,e=Fn){const a={file:t,width:0,height:0,size:t.size,compressed:!1,originalSize:t.size};if(t.type==="image/gif"||t.type==="image/svg+xml")return a;const s=await Zn(t),n="width"in s?s.width:0,r="height"in s?s.height:0;if(!n||!r||(a.width=n,a.height=r,t.size<=2*1024*1024&&Math.max(n,r)<=Ss))return a;const i=Math.min(1,Ss/Math.max(n,r));let l=Math.round(n*i),d=Math.round(r*i);const h=document.createElement("canvas");h.width=l,h.height=d;const p=h.getContext("2d");if(!p)return a;p.imageSmoothingQuality="high",p.drawImage(s,0,0,l,d),"close"in s&&typeof s.close=="function"&&s.close();const c="image/webp";let g=.9,o=await wt(h,c,g),v=0;for(;o.size>e&&v<4;)g=Math.max(.6,g-.1),o=await wt(h,c,g),o.size>e&&v===3&&(l=Math.round(l*.8),d=Math.round(d*.8),h.width=l,h.height=d,p.drawImage(s,0,0,l,d),o=await wt(h,c,g)),v++;const $=t.name.replace(/\.[^.]+$/,"")+".webp",b=new File([o],$,{type:c});return{file:b,width:l,height:d,size:b.size,compressed:!0,originalSize:t.size}}function st(t){return t>=1024*1024?`${(t/1024/1024).toFixed(1)}MB`:`${Math.round(t/1024)}KB`}const Vn=["随笔","城市","旅行","技术","阅读","生活"],Ke="`".repeat(3),Es=30;let Ye=null;const ta="qz.editor.mode",xt="qz.editor.split";async function Ts(t,e){var Jt,es,ts,ss,as,ns,is;const a=e.params.id?Number(e.params.id):0;let s=null;if(a&&(s=await T.post(a),!s.canEdit)){t.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}Ye==null||Ye();const n=new AbortController;let r=null,i=!1,l=0,d=0,h=0,p=!1;Ye=()=>{if(i=!0,window.clearTimeout(l),window.clearTimeout(d),window.clearTimeout(h),!p)try{V.classList.contains("dirty")&&y.value.trim()&&localStorage.setItem(o,JSON.stringify(Wt()))}catch{}n.abort(),r==null||r(),document.body.classList.remove("writer-mode")};let c=(Jt=s==null?void 0:s.cover)!=null?Jt:"",g=(es=s==null?void 0:s.images)!=null?es:[];const o=`qz.draft.${a||"new"}`;let v=Gn(),$=Number(localStorage.getItem(xt))||50;document.body.classList.add("writer-mode"),t.innerHTML=`<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${a?`#/post/${a}`:"#/home"}" title="返回">${f("back",16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${m((ts=s==null?void 0:s.title)!=null?ts:"")}" autocomplete="off">
      <span class="wr-state" id="save-state">未保存</span>
      <div class="wr-modes" id="mode-switch">
        <button data-mode="edit" title="只显示编辑区（Ctrl+Shift+E）">编辑</button>
        <button data-mode="split" title="左右分屏（Ctrl+Shift+S）">分屏</button>
        <button data-mode="preview" title="只看效果（Ctrl+Shift+V）">预览</button>
      </div>
      <div class="wr-tools">
        <button class="wr-ibtn" id="btn-outline" title="大纲">${f("outline",16)}</button>
        <button class="wr-ibtn wr-only-mobile" id="btn-eye" title="预览">${f("eye",16)}</button>
        <button class="wr-ibtn" id="btn-side" title="封面与可见范围">${f("settings",16)}</button>
        <button class="wr-ibtn" id="btn-full" title="全屏写作（F11）">${f("expand",15)}</button>
        ${Ct("btn-theme",16,"wr-ibtn")}
        <button class="wr-ibtn" id="btn-help" title="快捷键（Ctrl+/）">?</button>
        <button class="btn btn-primary btn-sm" id="save-btn">${f("check",13)} ${a?"保存修改":"发布"}</button>
      </div>
    </header>

    <div class="wr-draft" id="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="wr-body" id="body" data-mode="${v}" style="--split:${$}%">
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
            <button class="tb-btn" data-cmd="code" title="行内代码（Ctrl+E）">${f("codeInline",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="quote" title="引用">${f("message",15)}</button>
            <button class="tb-btn" data-cmd="codeblock" title="代码块（Ctrl+Shift+C）">${f("codeBlock",15)}</button>
            <button class="tb-btn" data-cmd="ul" title="无序列表">${f("listUl",15)}</button>
            <button class="tb-btn" data-cmd="ol" title="有序列表">${f("listOl",15)}</button>
            <button class="tb-btn" data-cmd="task" title="任务列表">${f("task",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="link" title="链接（Ctrl+K）">${f("link",15)}</button>
            <label class="tb-btn" title="插入图片（也可直接粘贴或拖入）">
              ${f("image",15)}<input type="file" id="img-input" accept="image/*" multiple hidden>
            </label>
            <button class="tb-btn" data-cmd="table" title="表格">${f("table",15)}</button>
            <button class="tb-btn" data-cmd="hr" title="分割线">—</button>
          </div>
          <span class="tb-hint" id="tb-hint">Ctrl+V 直接粘贴截图</span>
        </div>
        <div class="wr-scroll" id="edit-scroll">
          <textarea class="wr-input" id="content" spellcheck="false" wrap="soft" placeholder="从这里开始写…

## 小标题
- 列表项，回车自动续行
> 引用一段话

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${m((ss=s==null?void 0:s.content)!=null?ss:"")}</textarea>
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
          <button class="wr-ibtn" data-close="outline" title="关闭">${f("close",14)}</button>
        </div>
        <div class="wr-outline-list" id="outline-list"></div>
      </aside>

      <aside class="wr-drawer wr-side" id="side" data-open="false">
        <div class="wr-drawer-head">
          <b>文章设置</b>
          <button class="wr-ibtn" data-close="side" title="关闭">${f("close",14)}</button>
        </div>
        <div class="wr-drawer-body">
          <section class="rail-card">
            <h3>封面</h3>
            <div class="cover-slot" id="cover-slot">
              ${c?`<img src="${m(c)}" alt="">`:"<span>点击上传封面</span>"}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${m((as=s==null?void 0:s.category)!=null?as:"随笔")}">
              <datalist id="cat-list">${Vn.map(u=>`<option value="${u}">`).join("")}</datalist>
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
              ${g.map(u=>`<img src="${m(u)}" alt="" data-zoom="${m(u)}">`).join("")||'<span class="muted">还没有配图</span>'}
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
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${Es}MB 内图片自动压缩</span>
    </footer>

    <div class="wr-help" id="help" hidden>
      <div class="wr-help-card">
        <div class="wr-help-head">
          <b>快捷键</b>
          <button class="wr-ibtn" id="help-close">${f("close",14)}</button>
        </div>
        <div class="wr-help-grid">
          ${[["Ctrl + B / I","加粗 / 斜体"],["Ctrl + E","行内代码"],["Ctrl + K","插入链接"],["Ctrl + 1 / 2 / 3","一 / 二 / 三级标题"],["Ctrl + Shift + C","代码块"],["Ctrl + Shift + 8 / 7","无序 / 有序列表"],["Ctrl + Shift + Q","引用"],["Ctrl + Shift + E / S / V","编辑 / 分屏 / 预览"],["Ctrl + S","保存"],["Tab / Shift + Tab","整行缩进 / 反缩进"],["Ctrl + V","粘贴截图直接插图"],["Ctrl + /","打开本面板"]].map(([u,k])=>`<div class="k"><kbd>${u}</kbd><span>${k}</span></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;const b=u=>t.querySelector(u);r=Rt(t,"btn-theme");const E=b("#title"),y=b("#content"),H=b("#preview"),S=b("#body"),q=b("#splitter"),P=b("#pv-scroll"),oe=b("#thumbs"),V=b("#save-state"),ee=b("#stat-words"),ce=b("#stat-read"),ke=b("#stat-cursor"),Ce=b("#pv-meta"),ye=b("#draft-bar"),B=b("#outline"),D=b("#outline-list"),ne=b("#side"),U=b("#help"),de=u=>{v=u,S.dataset.mode=u,localStorage.setItem(ta,u),t.querySelectorAll("#mode-switch button").forEach(k=>{k.classList.toggle("active",k.dataset.mode===u)}),b("#btn-eye").classList.toggle("on",u==="preview"),u==="preview"?Ze(!0):y.focus()};t.querySelectorAll("#mode-switch button").forEach(u=>{u.addEventListener("click",()=>de(u.dataset.mode))}),b("#btn-eye").addEventListener("click",()=>de(v==="edit"?"preview":"edit"));const $e=(u,k)=>{u.dataset.open=String(k),u===B&&b("#btn-outline").classList.toggle("on",k),u===ne&&b("#btn-side").classList.toggle("on",k)};b("#btn-outline").addEventListener("click",()=>$e(B,B.dataset.open!=="true")),b("#btn-side").addEventListener("click",()=>$e(ne,ne.dataset.open!=="true")),t.querySelectorAll("[data-close]").forEach(u=>{u.addEventListener("click",()=>$e(u.dataset.close==="side"?ne:B,!1))});const ht=b("#wr"),Fe=b("#btn-full"),ia=()=>{var u;document.fullscreenElement?document.exitFullscreen():(u=ht.requestFullscreen)==null||u.call(ht).catch(()=>x("当前环境不支持全屏","err"))};Fe.addEventListener("click",ia),document.addEventListener("fullscreenchange",()=>{const u=!!document.fullscreenElement;Fe.innerHTML=f(u?"compress":"expand",15),Fe.classList.toggle("on",u),Fe.title=u?"退出全屏":"全屏写作"},{signal:n.signal});function Ze(u=!1){window.clearTimeout(d);const k=()=>{if(i)return;const w=y.value;H.innerHTML=w.trim()?Ut(w):'<p class="muted">预览会显示在这里</p>';const L=H.querySelectorAll("h1,h2,h3,h4,p,li,pre,blockquote,table").length;Ce.textContent=`${L} 个段落`};u?k():d=window.setTimeout(k,140)}function Vt(){var A,R;const u=y.value,k=((A=u.match(/[\u3400-\u9fa5]/g))!=null?A:[]).length,w=((R=u.replace(/[\u3400-\u9fa5]/g," ").match(/[A-Za-z0-9_]+/g))!=null?R:[]).length,L=k+w;ee.textContent=`${L.toLocaleString()} 字`,ce.textContent=`约 ${Math.max(1,Math.round(L/400))} 分钟`}function we(){const u=y.selectionStart,k=y.value.slice(0,u),w=k.split(`
`).length,L=u-(k.lastIndexOf(`
`)+1)+1;ke.textContent=`第 ${w} 行 · 第 ${L} 列`}function Gt(){window.clearTimeout(h),h=window.setTimeout(()=>{if(i)return;const u=Wn(y.value);if(!u.length){D.innerHTML='<p class="muted">标题会出现在这里</p>';return}D.innerHTML=u.map((k,w)=>`<button class="ol-item lv${k.level}" data-i="${w}"><span>${m(k.text)}</span></button>`).join(""),D.querySelectorAll(".ol-item").forEach(k=>{k.addEventListener("click",()=>{const w=u[Number(k.dataset.i)];w&&ra(w.offset),window.innerWidth<1e3&&$e(B,!1)})})},260)}function ra(u){const k=getComputedStyle(y),w=parseFloat(k.paddingLeft)+parseFloat(k.paddingRight),L=document.createElement("div");L.style.cssText=["position:absolute","visibility:hidden","top:0","left:0",`width:${Math.max(80,y.clientWidth-w)}px`,`font:${k.font}`,`line-height:${k.lineHeight}`,`letter-spacing:${k.letterSpacing}`,"white-space:pre-wrap","overflow-wrap:break-word","word-break:break-word"].join(";");const A=y.value.lastIndexOf(`
`,u-1)+1;L.textContent=y.value.slice(0,A),document.body.appendChild(L);const R=L.getBoundingClientRect().height;L.remove(),y.scrollTop=Math.max(0,R-8),y.focus(),y.setSelectionRange(u,u),we()}const la=()=>{try{const u=localStorage.getItem(o);return u?JSON.parse(u):null}catch{return null}},Wt=()=>{var u,k,w,L,A,R;return{title:E.value,content:y.value,category:(k=(u=b("#category"))==null?void 0:u.value)!=null?k:"随笔",visibility:(L=(w=b("#visibility"))==null?void 0:w.value)!=null?L:"public",pinned:(R=(A=b("#pinned"))==null?void 0:A.checked)!=null?R:!1,cover:c,savedAt:Date.now()}},Ve=()=>{window.clearTimeout(l),V.textContent="未保存",V.classList.add("dirty"),l=window.setTimeout(()=>{if(i||p)return;localStorage.setItem(o,JSON.stringify(Wt()));const u=new Date;V.textContent=`已存草稿 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")}`,V.classList.remove("dirty")},1200)},X=la();if(X&&(X.content!==((ns=s==null?void 0:s.content)!=null?ns:"")||X.title!==((is=s==null?void 0:s.title)!=null?is:""))){const u=new Date(X.savedAt);b("#draft-text").textContent=`发现 ${u.getMonth()+1} 月 ${u.getDate()} 日 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")} 的草稿`,ye.hidden=!1,b("#draft-restore").addEventListener("click",()=>{E.value=X.title,y.value=X.content,b("#category").value=X.category||"随笔",b("#visibility").value=X.visibility||"public",b("#pinned").checked=!!X.pinned,c=X.cover||c,c&&Kt(c),ye.hidden=!0,mt(),Ze(!0),x("已恢复草稿","ok")}),b("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(o),ye.hidden=!0})}const mt=()=>{Vt(),we(),Ze(),Gt(),Ve()},xe=(u,k,w,L,A)=>{y.focus(),y.setSelectionRange(u,k);let R=!1;try{R=document.execCommand("insertText",!1,w)}catch{R=!1}R||y.setRangeText(w,u,k,"end"),y.setSelectionRange(L,A),mt()},Re=(u,k=0,w=0)=>{const L=y.selectionStart,A=y.selectionEnd;xe(L,A,u,L+k,L+(w||u.length))},Ge=(u,k,w)=>{const L=y.selectionStart,A=y.selectionEnd,R=y.value.slice(L,A)||w;xe(L,A,u+R+k,L+u.length,L+u.length+R.length)},Qt=()=>{const u=y.selectionStart,k=y.selectionEnd,w=y.value.lastIndexOf(`
`,Math.max(0,u-1))+1,L=y.value.indexOf(`
`,k),A=L===-1?y.value.length:L;return{lineStart:w,lineEnd:A}},ue=(u,k)=>{const{lineStart:w,lineEnd:L}=Qt(),R=(y.value.slice(w,L)||k).split(`
`),K=R.every(O=>O.startsWith(u)),te=R.map(O=>K?O.slice(u.length):u+O.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/,"")).join(`
`);xe(w,L,te,w,w+te.length)},F={h1:()=>ue("# ","一级标题"),h2:()=>ue("## ","二级标题"),h3:()=>ue("### ","三级标题"),bold:()=>Ge("**","**","加粗文字"),italic:()=>Ge("*","*","斜体文字"),strike:()=>Ge("~~","~~","删除线"),code:()=>Ge("`","`","code"),quote:()=>ue("> ","引用一段话"),ul:()=>ue("- ","列表项"),ol:()=>ue("1. ","列表项"),task:()=>ue("- [ ] ","待办事项"),codeblock:()=>Re(`
${Ke}
// code
${Ke}
`,Ke.length+2,Ke.length+9),hr:()=>Re(`
---
`),link:()=>{const u=y.value.slice(y.selectionStart,y.selectionEnd);Re(`[${u||"链接文字"}](https://)`,u?u.length+3:1,u?u.length+11:5)},table:()=>Re(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};b("#toolbar").addEventListener("click",u=>{var w,L;const k=u.target.closest("[data-cmd]");k&&(u.preventDefault(),(L=F[(w=k.dataset.cmd)!=null?w:""])==null||L.call(F))});const oa=/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/,ca=()=>{const u=y.selectionStart;if(u!==y.selectionEnd)return!1;const k=y.value.lastIndexOf(`
`,u-1)+1,w=y.value.slice(k,u),L=w.match(oa);if(!L)return!1;const[,A,R,K]=L;if(!w.slice(L[0].length).trim())return xe(k,u,"",k,k),!0;let O=`
`+A;return/^\d+\.$/.test(R)?O+=`${parseInt(R,10)+1}. `:O+=R+" ",K&&(O+="[ ] "),xe(u,u,O,u+O.length,u+O.length),!0},da=u=>{var rs;const{lineStart:k,lineEnd:w}=Qt(),A=y.value.slice(k,w).split(`
`),R=A.map(Ie=>u?Ie.replace(/^ {1,2}|^\t/,""):"  "+Ie).join(`
`),K=y.selectionStart===y.selectionEnd;let te=k,O=k+R.length;if(K){const Ie=y.selectionStart-k,ua=((rs=A[0].match(/^ {1,2}|^\t/))!=null?rs:[""])[0].length,pa=u?Math.max(0,Ie-ua):Ie+2;te=k+pa,O=te}xe(k,w,R,te,O)};y.addEventListener("keydown",u=>{const k=u.metaKey||u.ctrlKey,w=u.key.toLowerCase();if(u.key==="Tab"){u.preventDefault(),da(u.shiftKey);return}if(!k&&u.key==="Enter"&&!u.altKey&&!u.isComposing&&ca()){u.preventDefault();return}if(k){if(u.shiftKey){w==="c"?(u.preventDefault(),F.codeblock()):u.key==="8"||u.key==="*"?(u.preventDefault(),F.ul()):u.key==="7"||u.key==="&"?(u.preventDefault(),F.ol()):w==="q"?(u.preventDefault(),F.quote()):w==="e"?(u.preventDefault(),de("edit")):w==="s"?(u.preventDefault(),de("split")):w==="v"&&(u.preventDefault(),de("preview"));return}w==="b"?(u.preventDefault(),F.bold()):w==="i"?(u.preventDefault(),F.italic()):w==="k"?(u.preventDefault(),F.link()):w==="e"?(u.preventDefault(),F.code()):w==="s"?(u.preventDefault(),Yt()):w==="1"||w==="2"||w==="3"?(u.preventDefault(),F[`h${w}`]()):w==="/"&&(u.preventDefault(),ze())}}),y.addEventListener("keyup",we),y.addEventListener("click",we),y.addEventListener("select",we),y.addEventListener("input",mt);let gt=!1;const Xt=(u,k)=>{if(v!=="split"||gt)return;gt=!0;const w=u.scrollHeight-u.clientHeight,L=w>0?u.scrollTop/w:0;k.scrollTop=L*(k.scrollHeight-k.clientHeight),requestAnimationFrame(()=>{gt=!1})};y.addEventListener("scroll",()=>Xt(y,P),{passive:!0}),P.addEventListener("scroll",()=>Xt(P,y),{passive:!0}),q.addEventListener("pointerdown",u=>{v!=="split"&&de("split"),u.preventDefault(),q.setPointerCapture(u.pointerId),q.classList.add("dragging"),document.body.classList.add("wr-resizing");const k=L=>{const A=S.getBoundingClientRect(),R=(L.clientX-A.left)/A.width*100,K=Math.min(78,Math.max(22,R));$=K,S.style.setProperty("--split",`${K}%`)},w=()=>{q.classList.remove("dragging"),document.body.classList.remove("wr-resizing"),localStorage.setItem(xt,String(Math.round($))),q.removeEventListener("pointermove",k),q.removeEventListener("pointerup",w),q.removeEventListener("pointercancel",w)};q.addEventListener("pointermove",k),q.addEventListener("pointerup",w),q.addEventListener("pointercancel",w)}),q.addEventListener("dblclick",()=>{$=50,S.style.setProperty("--split","50%"),localStorage.setItem(xt,"50")});const bt=new Set,ft=async(u,k="图片")=>{for(const w of u){if(!w.type.startsWith("image/")){x("只能插入图片文件","err");continue}const L=`${w.name}-${w.size}`;if(!bt.has(L)){bt.add(L);try{x(`正在处理 ${w.name||k}…`);const A=await qt(w);if(A.size>Es*1024*1024)throw new Error(`压缩后仍有 ${st(A.size)}，超过上限`);const{url:R}=await T.upload(A.file);g.push(R);const K=(w.name||k).replace(/\.[^.]+$/,"")||k;Re(`
![${K}](${R})
`),oe.innerHTML=g.map(te=>`<img src="${m(te)}" alt="">`).join(""),x(A.compressed?`已压缩 ${st(A.originalSize)} → ${st(A.size)}`:"图片已插入","ok")}catch(A){x(A.message,"err")}finally{bt.delete(L)}}}};y.addEventListener("paste",u=>{const k=u.clipboardData;if(!k)return;const w=Array.from(k.items).filter(L=>L.kind==="file"&&L.type.startsWith("image/")).map(L=>L.getAsFile()).filter(L=>!!L);w.length&&(u.preventDefault(),ft(w,"粘贴的图片"))});const Se=b("#pane-edit");Se.addEventListener("dragover",u=>{var k;(k=u.dataTransfer)!=null&&k.types.includes("Files")&&(u.preventDefault(),Se.classList.add("dropping"))}),Se.addEventListener("dragleave",()=>Se.classList.remove("dropping")),Se.addEventListener("drop",u=>{var w,L;const k=Array.from((L=(w=u.dataTransfer)==null?void 0:w.files)!=null?L:[]).filter(A=>A.type.startsWith("image/"));k.length&&(u.preventDefault(),Se.classList.remove("dropping"),ft(k))}),b("#img-input").addEventListener("change",async u=>{var L;const k=u.target,w=Array.from((L=k.files)!=null?L:[]);w.length&&await ft(w),k.value=""});const We=b("#cover-slot"),vt=b("#cover-input"),Kt=u=>{var k,w;(k=We.querySelector("img"))==null||k.remove(),(w=We.querySelector("span"))==null||w.remove(),We.insertAdjacentHTML("afterbegin",u?`<img src="${m(u)}" alt="">`:"<span>点击上传封面</span>")};We.addEventListener("click",()=>vt.click()),vt.addEventListener("change",async()=>{var k;const u=(k=vt.files)==null?void 0:k[0];if(u)try{const w=await qt(u),{url:L}=await T.upload(w.file);c=L,Kt(L),Ve(),x("封面已更新","ok")}catch(w){x(w.message,"err")}});function ze(u){const k=u!=null?u:U.hidden;U.hidden=!k}b("#btn-help").addEventListener("click",()=>ze()),b("#help-close").addEventListener("click",()=>ze(!1)),U.addEventListener("click",u=>{u.target===U&&ze(!1)}),document.addEventListener("keydown",u=>{u.key==="Escape"&&(U.hidden?B.dataset.open==="true"?$e(B,!1):ne.dataset.open==="true"&&$e(ne,!1):ze(!1))},{signal:n.signal}),E.addEventListener("input",Ve),t.querySelectorAll("#category,#visibility,#pinned").forEach(u=>u.addEventListener("change",Ve));const Yt=async()=>{const u={title:E.value.trim(),content:y.value,cover:c,category:b("#category").value.trim()||"随笔",visibility:b("#visibility").value,pinned:b("#pinned").checked,images:g};if(!u.title&&!u.content.trim()){x("写个标题或正文再发布","err");return}const k=b("#save-btn");k.disabled=!0,k.textContent="保存中…";try{const w=a?await T.updatePost(a,u):await T.createPost(u);p=!0,window.clearTimeout(l),localStorage.removeItem(o),x(a?"已保存":"已发布","ok"),location.hash=`#/post/${w.id}`}catch(w){x(w.message,"err"),k.disabled=!1,k.innerHTML=`${f("check",13)} ${a?"保存修改":"发布"}`}};b("#save-btn").addEventListener("click",()=>void Yt()),window.addEventListener("beforeunload",u=>{V.classList.contains("dirty")&&y.value.trim()&&(u.preventDefault(),u.returnValue="")},{signal:n.signal}),Vt(),we(),Gt(),Ze(!0),de(v),E.addEventListener("keydown",u=>{u.key==="Enter"&&(u.preventDefault(),y.focus(),y.setSelectionRange(0,0))}),window.innerWidth<1e3&&!(s!=null&&s.title)?E.focus():(y.focus(),y.setSelectionRange(y.value.length,y.value.length))}function Gn(){const t=localStorage.getItem(ta);return t==="edit"||t==="split"||t==="preview"?t:window.innerWidth>=1e3?"split":"edit"}function Wn(t){var n;const e=[],a=/^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;let s;for(;s=a.exec(t);)((n=t.slice(0,s.index).match(/^```/gm))!=null?n:[]).length%2!==1&&e.push({level:s[1].length,text:s[2].replace(/[*_`~]/g,""),offset:s.index});return e}async function Qn(t,e){t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${f("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const a=t.querySelector("#album-grid"),s=async()=>{const n=await T.albums(),r=n.albums.reduce((l,d)=>l+d.count,0),i=n.albums.filter(l=>l.privacy!=="public").length;t.querySelector("#album-sub").textContent=`${n.albums.length} 个相册 · 共 ${r} 张照片`+(i?` · ${i} 个未公开`:""),a.innerHTML=n.albums.length?n.albums.map(Ta).join(""):`<div class="card empty"><div class="empty-mark">${f("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await s(),t.querySelector("#new-album").addEventListener("click",async()=>{await ct({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async n=>{const r=n.querySelector("#a-name").value.trim();return r?(await T.createAlbum({name:r,description:n.querySelector("#a-desc").value.trim(),privacy:n.querySelector("#a-priv").value}),x("相册已创建","ok"),await s(),!0):(x("请填写相册名称","err"),!1)}})})}const Je={public:{label:"公开",desc:"出现在相册列表，所有人可看",icon:"globe"},unlisted:{label:"隐藏",desc:"不在列表出现，知道链接才能看",icon:"eyeoff"},private:{label:"仅自己",desc:"只有你登录后能看到",icon:"lock"}};async function Xn(t,e){const a=Number(e.params.id);let s=await T.album(a);const n=()=>{var i,l,d,h,p;const r=(i=Je[s.privacy])!=null?i:Je.public;t.innerHTML=`<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${f("back",14)} 全部相册</a>
          <h1>${m(s.name)}</h1>
          <p class="page-sub">${m(s.description||"没有描述")} · ${s.count} 张 · ${le(s.at)}创建
            <span class="pill album-state ${s.privacy}">${f(r.icon,11)}${r.label}</span>
          </p>
        </div>
        ${s.canEdit?`<div class="head-btns">
                <button class="btn btn-ghost btn-sm" id="album-config">${f("settings",14)} 设置</button>
                <label class="btn btn-primary btn-sm" title="单张上限 30MB，超过会自动压缩">${f("upload",14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden>
                </label>
                <button class="btn btn-ghost btn-sm danger" id="del-album" title="删除相册">${f("trash",14)}</button>
              </div>`:""}
      </header>
      <div class="photo-grid" id="photo-grid">
        ${(l=s.photos)!=null&&l.length?s.photos.map(c=>`<figure class="photo" data-pid="${c.id}">
                    <img src="${m(c.url)}" alt="${m(c.caption)}" loading="lazy" data-zoom="${m(c.url)}">
                    <figcaption>
                      <span>${m(c.caption||le(c.at))}</span>
                      <span class="photo-like">${f("heart",12)} ${c.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${c.id}" title="赞">${f("heart",14)}</button>
                      ${s.canEdit?`<button class="photo-btn danger" data-del="${c.id}" title="删除">${f("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${f("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,dt(t),(d=t.querySelector("#album-config"))==null||d.addEventListener("click",async()=>{await ct({title:"相册设置",body:`<div class="modal-form">
          <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" value="${m(s.name)}"></label>
          <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" value="${m(s.description)}" placeholder="一句话说明"></label>
          <div class="field"><span>谁可以看到</span>
            <div class="vis-pick">
              ${Object.entries(Je).map(([c,g])=>`<label class="vis-opt">
                    <input type="radio" name="vis" value="${c}" ${s.privacy===c?"checked":""}>
                    <span class="vis-ico">${f(g.icon,15)}</span>
                    <b>${g.label}</b>
                    <i>${g.desc}</i>
                  </label>`).join("")}
            </div>
          </div>
        </div>`,confirmText:"保存",onConfirm:async c=>{var v,$;const g=c.querySelector("#a-name").value.trim();if(!g)return x("请填写相册名称","err"),!1;const o=($=(v=c.querySelector("input[name=vis]:checked"))==null?void 0:v.value)!=null?$:s.privacy;return s=await T.updateAlbum(s.id,{name:g,description:c.querySelector("#a-desc").value.trim(),privacy:o}),x(o==="public"?"已设为公开":`已设为${Je[o].label}`,"ok"),n(),!0}})}),(h=t.querySelector("#photo-file"))==null||h.addEventListener("change",async c=>{var v;const g=c.target,o=Array.from((v=g.files)!=null?v:[]);if(o.length){x(`正在处理 ${o.length} 张…`);try{const $=[],b=[],E=[],y=[];let H=0;for(const S of o){const q=await qt(S),{url:P}=await T.upload(q.file);$.push(P),b.push(q.size),E.push(q.width),y.push(q.height),H+=q.originalSize-q.size}s=await T.addPhotos(s.id,$,{sizes:b,widths:E,heights:y}),x(H>512*1024?`上传完成，压缩节省 ${st(H)}`:"上传完成","ok"),n()}catch($){x($.message,"err")}finally{g.value=""}}}),(p=t.querySelector("#del-album"))==null||p.addEventListener("click",async()=>{if(await at("删除相册",`《${s.name}》及其中 ${s.count} 张照片会一起删除。`))try{await T.deleteAlbum(s.id),x("相册已删除","ok"),location.hash="#/albums"}catch(c){x(c.message,"err")}}),t.querySelector("#photo-grid").addEventListener("click",async c=>{var $;const g=c.target,o=g.closest("[data-like]");if(o){c.stopPropagation();try{const b=await T.likePhoto(Number(o.dataset.like));o.classList.toggle("active",b.liked);const E=($=o.closest(".photo"))==null?void 0:$.querySelector(".photo-like");E&&(E.innerHTML=`${f("heart",12)} ${b.count}`)}catch(b){x(b.message,"err")}return}const v=g.closest("[data-del]");if(v){if(c.stopPropagation(),!await at("删除照片","确定从相册中删除这张照片吗？"))return;try{await T.deletePhoto(s.id,Number(v.dataset.del)),s=await T.album(s.id),n(),x("已删除","ok")}catch(b){x(b.message,"err")}}})};n()}async function Kn(t,e){const a=fe(),s=e.params.uin||a.uin,n=s===a.uin,r=n?a:(await T.user(s)).user;t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${n?"来过的人，留下了这些话。":`给 ${m(r.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${ae(a.avatar,a.nickname,36)}
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
  </div>`;const i=t.querySelector("#gb-list"),l=t.querySelector("#gb-form textarea"),d=t.querySelector("#gb-count");l.addEventListener("input",()=>{d.textContent=`${l.value.length} / 500`});const h=c=>`<article class="gb-item card" data-gid="${c.id}">
      ${ae(c.author.avatar,c.author.nickname,40,c.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${m(c.author.uin)}">${m(c.author.nickname)}</a>
          <time>${le(c.at)}</time>
          <span class="spacer"></span>
          ${c.canEdit?`<button class="text-btn" data-reply="${c.id}">回复</button>`:""}
          ${c.canDel?`<button class="text-btn danger" data-del="${c.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${m(c.content)}</p>
        ${c.reply?`<div class="gb-reply"><b>${m(r.nickname)}：</b>${m(c.reply)}</div>`:""}
      </div>
    </article>`,p=async()=>{const c=await T.guestbook(s);i.innerHTML=c.entries.length?c.entries.map(h).join(""):`<div class="card empty"><div class="empty-mark">${f("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await p(),t.querySelector("#gb-form").addEventListener("submit",async c=>{c.preventDefault();const g=l.value.trim();if(g)try{await T.createGuestbook(s,g),l.value="",d.textContent="0 / 500",x("留言成功","ok"),await p()}catch(o){x(o.message,"err")}}),i.addEventListener("click",async c=>{const g=c.target,o=g.closest("[data-del]");if(o){if(!confirm("确定删除这条留言吗？"))return;try{await T.deleteGuestbook(Number(o.dataset.del)),await p(),x("已删除","ok")}catch($){x($.message,"err")}return}const v=g.closest("[data-reply]");if(v){const $=Number(v.dataset.reply);await ct({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async b=>{const E=b.querySelector("#reply-text").value.trim();return E?(await T.replyGuestbook($,E),await p(),x("已回复","ok"),!0):(x("回复不能为空","err"),!1)}})}})}async function Yn(t,e){const a=fe(),s=e.params.uin?(await T.user(e.params.uin)).user:a;t.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${m(s.nickname)}</h1>
      <p class="page-sub">${m(s.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${s.bio?Ut(s.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
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
            <a href="#/guestbook" class="about-link">${f("mail",14)} 留言板</a>
            <a href="#/posts" class="about-link">${f("book",14)} 全部文章</a>
            <a href="#/albums" class="about-link">${f("image",14)} 相册</a>
          </div>
        </section>
      </aside>
    </div>
  </div>`,s.uin!==a.uin&&T.visit(s.uin,"关于").catch(()=>x("足迹记录失败","err"))}async function Jn(t,e){var d;const a=(d=e.params.uin)!=null?d:"",s=fe();if(a===s.uin){location.hash="#/home";return}t.innerHTML=`<div class="page"><div class="card reading">正在打开 ${m(a)} 的空间…</div></div>`;const{user:n}=await T.user(a);T.visit(n.uin,"主页").catch(()=>{}),t.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${m(n.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ae(n.avatar,n.nickname,0)}</div>
        <div class="hero-text">
          <p class="hero-eyebrow">${f("pin",12)} ${m(n.city||"—")}</p>
          <h1>${m(n.nickname)}</h1>
          <p class="hero-sign">${m(n.signature||"这个人正在写文章。")}</p>
          <div class="hero-stats">
            <span><b>${n.posts}</b>文章</span>
            <span><b>${n.photos}</b>照片</span>
            <span><b>${n.visitCount.toLocaleString()}</b>访问</span>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/guestbook?uin=${m(n.uin)}">${f("mail",15)} 留言</a>
          <a class="btn btn-ghost" href="#/search?q=${encodeURIComponent(n.nickname)}">${f("search",15)} 搜索</a>
        </div>
      </div>
    </section>

    <div class="list-head">
      <h2>${m(n.nickname)} 的文章</h2>
      <span class="muted">${n.posts} 篇</span>
    </div>
    <div id="space-posts">${nt(2)}</div>
  </div>`,dt(t);const r=t.querySelector("#space-posts"),i=await T.posts({uin:n.uin,limit:10});if(!i.posts.length){r.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const l=i.posts[0];r.innerHTML=_s(l)+`<div class="post-list">${i.posts.slice(1).map(ut).join("")}</div>`}const Ms={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function ei(t){return t.target.startsWith("post:")?`#/post/${t.target.split(":")[1]}`:t.target.startsWith("album:")?`#/album/${t.target.split(":")[1]}`:t.target==="guestbook"?"#/guestbook":t.target==="profile"?`#/u/${m(t.from.uin)}`:"#/home"}async function ti(t,e){t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${f("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const a=t.querySelector("#msg-list"),s=t.querySelector("#msg-sub"),n=async()=>{const r=await T.notifications();s.textContent=r.unread?`${r.unread} 条未读`:"全部已读",ds(r.unread),a.innerHTML=r.notifications.length?`<div class="card msg-list">${r.notifications.map(i=>{var d;const l=(d=Ms[i.kind])!=null?d:Ms.system;return`<a class="msg-row ${i.read?"":"unread"}" href="${ei(i)}">
              <span class="msg-icon ${l.cls}">${f(l.icon,16)}</span>
              <div class="msg-body">
                <div class="msg-line">
                  ${ae(i.from.avatar,i.from.nickname,20,i.from.uin)}
                  <b>${m(i.from.nickname)}</b>
                  <span>${m(i.text)}</span>
                </div>
                <time>${le(i.at)} · ${l.label}</time>
              </div>
              ${i.read?"":'<i class="msg-dot"></i>'}
            </a>`}).join("")}</div>`:`<div class="card empty"><div class="empty-mark">${f("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await n(),t.querySelector("#read-all").addEventListener("click",async()=>{try{const r=await T.readNotifications([]);ds(r.unread),x("已全部标为已读","ok"),await n()}catch(r){x(r.message,"err")}})}const si=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function ai(t,e){const a=fe(),s=e.params.tab==="out"?"out":"in";t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${f("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${si.map(i=>`<button class="seg-btn ${i.key===s?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/visitors?tab=${i.dataset.tab}`})});const n=t.querySelector("#visit-list"),r=await T.visitors(a.uin,s);t.querySelector("#visit-sub").textContent=s==="in"?`累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人`:`你最近访问了 ${r.visitors.length} 个空间`,n.innerHTML=r.visitors.length?`<div class="card visit-list">${r.visitors.map(i=>`<a class="visit-row" href="#/u/${m(i.author.uin)}">
            ${ae(i.author.avatar,i.author.nickname,40,i.author.uin)}
            <div class="visit-main">
              <b>${m(i.author.nickname)}</b>
              <span>${s==="in"?"看了":"访问了"} · ${m(i.module)}</span>
            </div>
            <time>${le(i.at)}</time>
          </a>`).join("")}</div>`:ka(s==="in"?"还没有人来过":"还没有访问记录",s==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>')}const ni=[{id:"light",name:"浅色",icon:"sun"},{id:"dark",name:"深色",icon:"moon"},{id:"auto",name:"跟随系统",icon:"monitor"}],ii=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function ri(t,e){var r;const a=e.params.tab||"profile",s=fe();t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${ii.map(i=>`<button class="seg-btn ${i.key===a?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/settings?tab=${i.dataset.tab}`})});const n=t.querySelector("#settings-body");if(a==="decorate"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${m(s.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${f("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">外观</h2>
      <p class="setting-hint">深色模式适合夜间写作；「跟随系统」会随设备的浅色 / 深色自动切换。这个偏好只保存在当前浏览器，不跟账号走。</p>
      <div class="theme-grid" id="appearance-grid">
        ${ni.map(i=>`<button class="theme-card ${wa()===i.id?"active":""}" data-appearance="${i.id}">
            <span class="mode-swatch">${f(i.icon,14)}</span>
            <span>${i.name}</span>
          </button>`).join("")}
      </div>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${St().map(i=>`<button class="theme-card ${s.theme===i.id?"active":""}" data-theme="${i.id}">
              <span class="theme-swatch" style="background:${i.accent}"></span>
              <span>${m(i.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,n.querySelector("#cover-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:h}=await T.upload(l),p=await T.updateProfile({cover:h});Ee(p),n.querySelector("#cover-preview").style.backgroundImage=`url('${h}')`,x("封面已更新","ok")}catch(h){x(h.message,"err")}}),n.querySelectorAll("[data-appearance]").forEach(i=>{i.addEventListener("click",()=>{Rs(i.dataset.appearance),n.querySelectorAll("[data-appearance]").forEach(l=>l.classList.remove("active")),i.classList.add("active")})}),n.querySelectorAll("[data-theme]").forEach(i=>{i.addEventListener("click",async()=>{const l=i.dataset.theme;try{const d=await T.updateProfile({theme:l});Ee(d),qs(l),n.querySelectorAll("[data-theme]").forEach(h=>h.classList.remove("active")),i.classList.add("active"),x("主题已切换","ok")}catch(d){x(d.message,"err")}})});return}if(a==="music"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">内置免费音乐</h2>
      <p class="setting-hint">曲目由程序实时合成，无版权限制；点「试听」立即播放，「设为背景音乐」保存到你的空间。</p>
      <div class="music-library" id="music-library"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${_.isPlaying()?"spin":""}">${f("music",16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${m(s.bgmTitle||"还没有设置音轨")}</b>
          <span id="bgm-sub">${s.bgmUrl?"已保存，会在页面左下角循环播放":"上传、选一首内置曲目，或填写直链"}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="preview-btn">${f("play",13)} 试听</button>
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
      <label class="btn btn-ghost btn-sm">${f("upload",14)} 选择音频文件
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
    </section>`;let i=s.bgmUrl,l=s.bgmTitle;const d=()=>{n.querySelector("#bgm-name").textContent=l||"还没有设置音轨",n.querySelector("#bgm-sub").textContent=i?"已选择，保存后生效":"上传、选一首内置曲目，或填写直链",n.querySelector("#bgm-title").value||(n.querySelector("#bgm-title").value=l)},h=(c,g)=>{i=c,l=g,n.querySelector("#bgm-title").value=g,d()};try{const{tracks:c}=await T.musicLibrary(),g=n.querySelector("#music-library");g.innerHTML=c.map(o=>`<article class="lib-card" data-id="${m(o.id)}">
            <div class="lib-main">
              <b>${m(o.title)}</b>
              <span>${m(o.mood)} · ${o.duration} 秒</span>
            </div>
            <div class="lib-actions">
              <button class="btn btn-ghost btn-sm" data-play="${m(o.url)}" data-title="${m(o.title)}">${f("play",12)} 试听</button>
              <button class="btn btn-soft btn-sm" data-pick="${m(o.url)}" data-title="${m(o.title)}">设为背景</button>
            </div>
          </article>`).join(""),g.addEventListener("click",o=>{var E;const v=o.target,$=v.closest("[data-play]");if($){_.setTrack($.dataset.play,$.dataset.title),_.isPlaying()||_.toggle(),(E=n.querySelector(".music-disc"))==null||E.classList.add("spin");return}const b=v.closest("[data-pick]");b&&(h(b.dataset.pick,b.dataset.title),x(`已选择《${b.dataset.title}》，记得点保存`,"ok"))})}catch(c){n.querySelector("#music-library").innerHTML=`<span class="muted">曲库加载失败：${m(c.message)}</span>`}const p=n.querySelector("#audio-file");p.addEventListener("change",async()=>{var g;const c=(g=p.files)==null?void 0:g[0];if(c){if(c.size>50*1024*1024){x("音频不能超过 50MB","err");return}x("正在上传音频…");try{const{url:o}=await T.uploadAudio(c);h(o,c.name.replace(/\.[^.]+$/,"")),x("上传完成，点保存生效","ok")}catch(o){x(o.message,"err")}finally{p.value=""}}}),n.querySelector("#bgm-url-save").addEventListener("click",()=>{var o;const g=n.querySelector("#bgm-url").value.trim();if(!g){x("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/)/.test(g)){x("地址需要以 http(s):// 或 /media/ 开头","err");return}h(g,((o=g.split("/").pop())==null?void 0:o.replace(/\.[^.]+$/,""))||"外部音频"),x("已填入，点保存生效","ok")}),n.querySelector("#preview-btn").addEventListener("click",()=>{if(!i){x("还没有选择音轨","err");return}_.setTrack(i,l),_.toggle(),setTimeout(()=>{var c;return(c=n.querySelector(".music-disc"))==null?void 0:c.classList.toggle("spin",_.isPlaying())},150)}),n.querySelector("#save-bgm").addEventListener("click",async()=>{const c=n.querySelector("#bgm-title").value.trim();try{const g=await T.updateProfile({bgmUrl:i,bgmTitle:c});Ee(g),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:g.bgmUrl,bgmTitle:g.bgmTitle}})),x("背景音乐已保存","ok")}catch(g){x(g.message,"err")}}),(r=n.querySelector("#clear-bgm"))==null||r.addEventListener("click",async()=>{try{const c=await T.updateProfile({bgmUrl:"",bgmTitle:""});Ee(c),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),x("已移除背景音乐","ok"),await e.reload()}catch(c){x(c.message,"err")}});return}n.innerHTML=`<section class="card setting-card">
    <div class="avatar-line">
      <img src="${m(s.avatar)}" alt="" id="avatar-preview">
      <div>
        <b>${m(s.nickname)}</b>
        <p class="muted">@${m(s.uin)} · Lv.${s.level}</p>
      </div>
      <label class="btn btn-ghost btn-sm">${f("upload",14)} 更换头像
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
  </section>`,n.querySelector("#avatar-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:h}=await T.upload(l),p=await T.updateProfile({avatar:h});Ee(p),n.querySelector("#avatar-preview").src=h,x("头像已更新","ok")}catch(h){x(h.message,"err")}}),n.querySelector("#profile-form").addEventListener("submit",async i=>{var h,p,c,g,o;i.preventDefault();const l=new FormData(i.currentTarget),d=String((h=l.get("tags"))!=null?h:"").split(/[,，\s]+/).map(v=>v.trim()).filter(Boolean).slice(0,8);try{const v=await T.updateProfile({nickname:String((p=l.get("nickname"))!=null?p:"").trim(),city:String((c=l.get("city"))!=null?c:"").trim(),signature:String((g=l.get("signature"))!=null?g:"").trim(),bio:String((o=l.get("bio"))!=null?o:""),tags:d});Ee(v),x("已保存","ok"),await e.reload()}catch(v){x(v.message,"err")}})}async function li(t,e){const a=(e.params.q||"").trim();if(t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SEARCH</p>
        <h1>搜索</h1>
        <p class="page-sub">${a?`“${m(a)}” 的结果`:"找文章、找朋友、找相册"}</p>
      </div>
    </header>

    <form class="search-box card" id="search-form">
      <input class="input" name="q" value="${m(a)}" placeholder="输入关键词" autofocus>
      <button class="btn btn-primary" type="submit">${f("search",14)} 搜索</button>
    </form>

    <div id="search-result"></div>
  </div>`,t.querySelector("#search-form").addEventListener("submit",n=>{var i;n.preventDefault();const r=String((i=new FormData(n.currentTarget).get("q"))!=null?i:"").trim();location.hash=r?`#/search?q=${encodeURIComponent(r)}`:"#/search"}),!a)return;const s=t.querySelector("#search-result");try{const n=await T.search(a);if(!(n.posts.length+n.users.length+n.albums.length)){s.innerHTML=`<div class="card empty"><div class="empty-mark">${f("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}s.innerHTML=`
      ${n.users.length?`<h2 class="result-title">用户 <span>${n.users.length}</span></h2>
             <div class="card user-list">${n.users.map(i=>`<a class="user-row" href="#/u/${m(i.uin)}">
                   <img src="${m(i.avatar)}" alt="">
                   <div><b>${m(i.nickname)}</b><span>@${m(i.uin)} · ${m(i.signature||"")}</span></div>
                   ${f("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${n.posts.length?`<h2 class="result-title">文章 <span>${n.posts.length}</span></h2>
             <div class="post-list card">${n.posts.map(ut).join("")}</div>`:""}
      ${n.albums.length?`<h2 class="result-title">相册 <span>${n.albums.length}</span></h2>
             <div class="album-grid">${n.albums.map(i=>`<a class="album-card card" href="#/album/${i.id}">
                   <div class="album-cover">${i.cover?`<img src="${m(i.cover)}" alt="">`:""}</div>
                   <div class="album-info"><h3>${m(i.name)}</h3><p>${i.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(n){x(n.message,"err")}}const sa=document.getElementById("app"),oi=[{pattern:/^\/home$/,nav:"home",render:Ma},{pattern:/^\/posts$/,nav:"posts",render:Aa},{pattern:/^\/post\/(\d+)$/,nav:"posts",render:Un},{pattern:/^\/write$/,nav:"",render:Ts},{pattern:/^\/edit\/(\d+)$/,nav:"",render:Ts},{pattern:/^\/albums$/,nav:"albums",render:Qn},{pattern:/^\/album\/(\d+)$/,nav:"albums",render:Xn},{pattern:/^\/guestbook$/,nav:"guestbook",render:Kn},{pattern:/^\/about$/,nav:"about",render:Yn},{pattern:/^\/u\/([^/]+)$/,nav:"",render:Jn},{pattern:/^\/messages$/,nav:"",render:ti},{pattern:/^\/visitors$/,nav:"",render:ai},{pattern:/^\/settings$/,nav:"",render:ri},{pattern:/^\/search$/,nav:"",render:li}];let Ft=!1,_e=!1;function ci(){const t=location.hash.replace(/^#/,"")||"/home",[e,a=""]=t.split("?");return{path:e.startsWith("/")?e:`/${e}`,query:new URLSearchParams(a)}}function di(t){var e;for(const a of oi){const s=t.match(a.pattern);if(s)return{def:a,id:(e=s[1])!=null?e:""}}return null}async function aa(){try{const t=await T.session();if(!t.authenticated||!t.user)return!1;const e=await T.bootstrap();return ba({me:e.me,themes:e.themes,unread:e.unread}),qs(e.me.theme),!0}catch{return!1}}function Zt(){Ft=!1,Y.boot=null,document.body.classList.remove("signed-in"),_.unmount(),La(sa,async()=>{await aa()&&na()})}function De(t,e,a){return`<a class="nav-link" data-nav="${e}" href="${t}">${a}</a>`}function na(){const t=fe();document.body.classList.add("signed-in"),sa.innerHTML=`
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${f("pen",15)}</span>
        <span class="brand-text">${m(t.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${De("#/home","home","首页")}
        ${De("#/posts","posts","文章")}
        ${De("#/albums","albums","相册")}
        ${De("#/guestbook","guestbook","留言板")}
        ${De("#/about","about","关于")}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${f("search",15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${f("pen",14)}<span>写文章</span></a>
        ${Ct("theme-toggle",17)}
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${f("bell",18)}<i class="badge" data-unread ${cs()?"":"hidden"}>${cs()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${ae(t.avatar,t.nickname,32)}
          <div class="user-menu" id="user-menu" hidden>
            <div class="menu-head">
              <b>${m(t.nickname)}</b>
              <span>@${m(t.uin)}</span>
            </div>
            <a href="#/u/${m(t.uin)}">${f("grid",14)} 我的主页</a>
            <a href="#/visitors">${f("eye",14)} 访客记录</a>
            <a href="#/settings">${f("settings",14)} 空间设置</a>
            <button id="logout-btn">${f("logout",14)} 退出登录</button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main id="view" class="view"></main>

  <nav class="mobile-tabs" aria-label="主导航">
    <a class="mtab" data-nav="home" href="#/home">${f("pen",19)}<span>首页</span></a>
    <a class="mtab" data-nav="posts" href="#/posts">${f("book",19)}<span>文章</span></a>
    <a class="mtab" data-nav="albums" href="#/albums">${f("image",19)}<span>相册</span></a>
    <a class="mtab" data-nav="guestbook" href="#/guestbook">${f("mail",19)}<span>留言</span></a>
    <a class="mtab" data-nav="about" href="#/about">${f("grid",19)}<span>关于</span></a>
  </nav>

  <footer class="site-foot">
    <span>${m(t.nickname)} · 个人空间</span>
    <span class="foot-sep">·</span>
    <span>Go + ent + SQLite · TypeScript</span>
  </footer>`;const e=document.getElementById("head-search");e.addEventListener("submit",s=>{var r;s.preventDefault();const n=String((r=new FormData(e).get("q"))!=null?r:"").trim();n&&(location.hash=`#/search?q=${encodeURIComponent(n)}`)}),Rt(document,"theme-toggle");const a=document.getElementById("user-chip");a.addEventListener("click",s=>{s.target.closest("a,button")||(_e=!_e,document.getElementById("user-menu").hidden=!_e)}),document.addEventListener("click",s=>{!a.contains(s.target)&&_e&&(_e=!1,document.getElementById("user-menu").hidden=!0)}),document.getElementById("logout-btn").addEventListener("click",async()=>{await T.logout(),x("已退出登录"),Zt()}),Ft=!0,_.setTrack(t.bgmUrl,t.bgmTitle),_.mount(),ot()}async function ot(){var i;if(!Ft)return;const t=document.getElementById("view");if(!t)return;const{path:e,query:a}=ci(),s=di(e);if(!e.startsWith("/write")&&!e.startsWith("/edit/")&&document.body.classList.remove("writer-mode"),document.querySelectorAll("[data-nav]").forEach(l=>{l.classList.toggle("active",l.dataset.nav===(s==null?void 0:s.def.nav))}),!s){t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">页面不存在</h2>
      <p class="empty-desc">这条链接可能已经失效。</p>
      <a class="btn btn-primary" href="#/home">回到首页</a>
    </div></div>`;return}const n={...Object.fromEntries(a)};s.id&&(n.id=s.id,s.def.pattern.source.includes("[^/]")&&(n.uin=s.id)),window.scrollTo({top:0});const r={params:n,reload:ot};try{await s.def.render(t,r)}catch(l){if(l instanceof tt&&l.status===401)return;t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${m(l.message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`,(i=t.querySelector("#retry"))==null||i.addEventListener("click",()=>void ot())}}window.addEventListener("hashchange",()=>void ot());window.addEventListener("qz:expired",()=>Zt());(async function(){await aa()?na():Zt()})();window.addEventListener("qz:profile",t=>{const e=t.detail;e&&_.setTrack(e.bgmUrl,e.bgmTitle)});
