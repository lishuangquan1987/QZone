var va=Object.defineProperty;var hs=e=>{throw TypeError(e)};var ka=(e,t,a)=>t in e?va(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var R=(e,t,a)=>ka(e,typeof t!="symbol"?t+"":t,a),ya=(e,t,a)=>t.has(e)||hs("Cannot "+a);var ms=(e,t,a)=>t.has(e)?hs("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a);var Ae=(e,t,a)=>(ya(e,t,"access private method"),a);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();class je extends Error{constructor(a,s){super(s);R(this,"status");this.status=a}}const it=new Map,$a=15e3,wa=e=>/^\/api\/(posts|albums|guestbook|users|search|music\/library)/.test(e);function xa(){it.clear()}async function Ce(e,t={}){const a=!t.method||t.method==="GET",s=a&&wa(e);if(s){const p=it.get(e);if(p&&Date.now()-p.at<$a)return p.data}const n=p=>{if(!a){it.clear();return}s&&it.set(e,{at:Date.now(),data:p})},r=new Headers(t.headers);t.body&&!(t.body instanceof FormData)&&r.set("Content-Type","application/json");let i;try{i=await fetch(e,{credentials:"include",...t,headers:r})}catch{throw new je(0,"网络连接失败，请检查服务是否已启动")}if(i.status===401)throw window.dispatchEvent(new CustomEvent("qz:expired")),new je(401,"登录状态已失效");const l=await i.text();let d={};if(l)try{d=JSON.parse(l)}catch{throw new je(i.status||502,i.ok?"服务器响应格式异常":`服务暂时不可用（${i.status}）`)}if(!i.ok)throw new je(i.status,d.error||"请求失败");return n(d),d}const K=e=>Ce(e),F=(e,t)=>Ce(e,{method:"POST",body:t===void 0?void 0:JSON.stringify(t)}),_e=e=>Ce(e,{method:"DELETE"}),Et=(e,t)=>Ce(e,{method:"PATCH",body:JSON.stringify(t)}),A={register:(e,t,a)=>F("/api/auth/register",{uin:e,nickname:t,password:a}),login:(e,t)=>F("/api/auth/login",{uin:e,password:t}),logout:()=>(xa(),F("/api/auth/logout")),session:()=>K("/api/auth/session"),bootstrap:()=>K("/api/bootstrap"),user:e=>K(`/api/users/${encodeURIComponent(e)}`),updateProfile:e=>Et("/api/users/me",e),signIn:()=>F("/api/users/me/signin"),visitors:(e,t="in")=>K(`/api/users/${encodeURIComponent(e)}/visitors?mode=${t}`),visit:(e,t)=>F(`/api/users/${encodeURIComponent(e)}/visit`,{module:t}),posts:e=>{const t=new URLSearchParams;return Object.entries(e).forEach(([a,s])=>{s!==void 0&&s!==""&&t.set(a,String(s))}),K(`/api/posts?${t}`)},createPost:e=>F("/api/posts",e),post:e=>K(`/api/posts/${e}`),updatePost:(e,t)=>Et(`/api/posts/${e}`,t),deletePost:e=>_e(`/api/posts/${e}`),likePost:e=>F(`/api/posts/${e}/like`),commentPost:(e,t,a)=>F(`/api/posts/${e}/comments`,{content:t,replyTo:a}),deleteComment:(e,t)=>_e(`/api/posts/${e}/comments/${t}`),albums:e=>K(`/api/albums${e?`?uin=${encodeURIComponent(e)}`:""}`),album:e=>K(`/api/albums/${e}`),updateAlbum:(e,t)=>Et(`/api/albums/${e}`,t),createAlbum:e=>F("/api/albums",e),deleteAlbum:e=>_e(`/api/albums/${e}`),addPhotos:(e,t,a)=>F(`/api/albums/${e}/photos`,{urls:t,caption:"",...a}),deletePhoto:(e,t)=>_e(`/api/albums/${e}/photos/${t}`),likePhoto:e=>F(`/api/photos/${e}/like`),guestbook:e=>K(`/api/guestbook${e?`?uin=${encodeURIComponent(e)}`:""}`),createGuestbook:(e,t)=>F("/api/guestbook",{owner:e,content:t}),deleteGuestbook:e=>_e(`/api/guestbook/${e}`),replyGuestbook:(e,t)=>F(`/api/guestbook/${e}/reply`,{reply:t}),notifications:()=>K("/api/notifications"),readNotifications:(e=[])=>F("/api/notifications/read",{ids:e}),musicLibrary:()=>K("/api/music/library"),search:e=>K(`/api/search?q=${encodeURIComponent(e)}`),upload:async e=>{const t=new FormData;return t.append("file",e),Ce("/api/upload",{method:"POST",body:t})},uploadAudio:async e=>{const t=new FormData;return t.append("file",e),Ce("/api/upload/audio",{method:"POST",body:t})}},ne={boot:null};function we(){if(!ne.boot)throw new Error("尚未初始化");return ne.boot.me}function Sa(e){ne.boot=e}function qe(e){ne.boot&&(ne.boot.me=e)}function qt(){var e,t;return(t=(e=ne.boot)==null?void 0:e.themes)!=null?t:[]}function gs(){var e,t;return(t=(e=ne.boot)==null?void 0:e.unread)!=null?t:0}function bs(e){ne.boot&&(ne.boot.unread=e),document.querySelectorAll("[data-unread]").forEach(t=>{t.textContent=e>99?"99+":String(e),t.hidden=e===0})}function Hs(e){var a,s;const t=(a=qt().find(n=>n.id===e))!=null?a:qt()[0];document.documentElement.dataset.theme=(s=t==null?void 0:t.id)!=null?s:"aurora",t&&document.documentElement.style.setProperty("--theme-accent",t.accent)}let Ct=new AbortController;function La(){return Ct.signal}function Ea(){Ct.abort(),Ct=new AbortController}function mt(e,t=480){return!e||!e.startsWith("/media/")||e.includes("?w=")?e:`${e}${e.includes("?")?"&":"?"}w=${t}`}function m(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const pe=e=>String(e).padStart(2,"0");function he(e){const t=new Date(e).getTime(),a=Date.now()-t,s=6e4;if(a<s)return"刚刚";if(a<60*s)return`${Math.floor(a/s)} 分钟前`;const n=new Date(t),r=new Date;if(n.toDateString()===r.toDateString())return`今天 ${pe(n.getHours())}:${pe(n.getMinutes())}`;const i=new Date(Date.now()-864e5);return n.toDateString()===i.toDateString()?`昨天 ${pe(n.getHours())}:${pe(n.getMinutes())}`:n.getFullYear()===r.getFullYear()?`${n.getMonth()+1} 月 ${n.getDate()} 日`:`${n.getFullYear()} 年 ${n.getMonth()+1} 月 ${n.getDate()} 日`}function fs(e){const t=new Date(e);return`${t.getFullYear()}-${pe(t.getMonth()+1)}-${pe(t.getDate())} ${pe(t.getHours())}:${pe(t.getMinutes())}`}const Ta={pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',message:'<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',eyeoff:'<path d="M4 4l16 16"/><path d="M9.6 5.9A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.3 3.9"/><path d="M6.7 7.6A17 17 0 0 0 2.5 12S6 18.5 12 18.5a9.8 9.8 0 0 0 3.7-.7"/><path d="M9.9 10a3 3 0 0 0 4.2 4.2"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',music:'<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',bell:'<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chevron:'<path d="M9 6l6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',star:'<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',logout:'<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',tag:'<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',pin:'<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',moon:'<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2z"/>',monitor:'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9 20.5h6M12 17v3.5"/>',grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',listOl:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',table:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',codeInline:'<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',codeBlock:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>',expand:'<path d="M9 4.5H4.5V9M15 4.5h4.5V9M15 19.5h4.5V15M9 19.5H4.5V15"/>',compress:'<path d="M4.5 9H9V4.5M19.5 9H15V4.5M19.5 15H15v4.5M4.5 15H9v4.5"/>',outline:'<path d="M4 6h16M4 12h10.5M4 18h7"/>'};function b(e,t=16){var s;const a=(s=Ta[e])!=null?s:"";return`<svg class="ico" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}function ce(e,t,a=40,s="",n=0){const r=e?`<img src="${m(e)}" alt="${m(t)}" loading="lazy" decoding="async">`:`<span class="avatar-fallback">${m(t.slice(0,1))}</span>`,i=s?`href="#/u/${m(s)}"`:"",l=a>0?` style="width:${a}px;height:${a}px"`:"";return`<a class="avatar" ${i}${l}>${r}${n?`<i class="avatar-level">${n}</i>`:""}</a>`}function S(e,t="info"){let a=document.getElementById("toasts");a||(a=document.createElement("div"),a.id="toasts",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${t}`,s.textContent=e,a.appendChild(s),requestAnimationFrame(()=>s.classList.add("in")),setTimeout(()=>{s.classList.remove("in"),setTimeout(()=>s.remove(),280)},2600)}function gt(e){return new Promise(t=>{var r,i,l,d;const a=document.createElement("div");a.className="modal-mask",a.innerHTML=`
      <div class="modal ${e.wide?"modal-wide":""}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${m(e.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${b("close",18)}</button>
        </header>
        <div class="modal-body">${e.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${m((r=e.cancelText)!=null?r:"取消")}</button>
          <button class="btn btn-primary modal-ok">${m((i=e.confirmText)!=null?i:"确定")}</button>
        </footer>
      </div>`,document.body.appendChild(a),document.body.classList.add("no-scroll");const s=p=>{a.remove(),document.body.classList.remove("no-scroll"),t(p)};a.querySelector(".modal-x").addEventListener("click",()=>s(!1)),a.querySelector(".modal-cancel").addEventListener("click",()=>s(!1)),a.addEventListener("mousedown",p=>{p.target===a&&s(!1)});const n=a.querySelector(".modal-ok");n.addEventListener("click",async()=>{if(!e.onConfirm)return s(!0);n.disabled=!0;try{await e.onConfirm(a)!==!1&&s(!0)}catch(p){S(p.message,"err")}finally{n.disabled=!1}}),(l=e.onMount)==null||l.call(e,a),(d=a.querySelector("input, textarea"))==null||d.focus()})}async function lt(e,t,a="删除"){return gt({title:e,body:`<p class="confirm-text">${m(t)}</p>`,confirmText:a})}const vs=new WeakSet;function bt(e){vs.has(e)||(vs.add(e),e.addEventListener("click",t=>{const a=t.target;if(a.closest("button, a.album-card, .photo-tools"))return;const s=a.closest("[data-zoom]");if(!s)return;const n=Array.from(e.querySelectorAll("[data-zoom]")),r=n.map(l=>{var d,p,h;return{src:l.dataset.zoom||l.src,caption:l.getAttribute("alt")||((h=(p=(d=l.closest("figure"))==null?void 0:d.querySelector("figcaption"))==null?void 0:p.textContent)==null?void 0:h.trim())||""}}),i=Math.max(0,n.indexOf(s));Ma(r,i,s)}))}function Ma(e,t=0,a){var B;if(!e.length)return;(B=document.querySelector(".lx"))==null||B.remove();let s=Math.min(Math.max(t,0),e.length-1);const n=document.createElement("div");n.className="lx",n.innerHTML=`
    <div class="lx-top">
      <span class="lx-count"></span>
      <button class="lx-btn lx-close" aria-label="关闭">${b("close",22)}</button>
    </div>
    <button class="lx-nav lx-prev" aria-label="上一张">${b("chevron",26)}</button>
    <figure class="lx-stage">
      <img class="lx-img" alt="">
      <span class="lx-spin" aria-hidden="true"></span>
      <figcaption class="lx-cap"></figcaption>
    </figure>
    <button class="lx-nav lx-next" aria-label="下一张">${b("chevron",26)}</button>
    <div class="lx-strip"></div>`;const r=n.querySelector(".lx-img"),i=n.querySelector(".lx-stage"),l=n.querySelector(".lx-cap"),d=n.querySelector(".lx-count"),p=n.querySelector(".lx-strip"),h=n.querySelector(".lx-prev"),c=n.querySelector(".lx-next");e.length>1?p.innerHTML=e.map((L,$)=>`<button class="lx-thumb" data-i="${$}" aria-label="第 ${$+1} 张"><img src="${m(L.src)}" alt="" loading="lazy" decoding="async"></button>`).join(""):(p.remove(),h.remove(),c.remove());const f=()=>{const L=e[s];r.classList.remove("ready"),r.alt=L.caption||`图片 ${s+1}`,r.src=L.src,d.textContent=`${s+1} / ${e.length}`,l.textContent=L.caption||"",l.hidden=!L.caption,p.querySelectorAll(".lx-thumb").forEach(($,M)=>{$.classList.toggle("on",M===s),M===s&&$.scrollIntoView({block:"nearest",inline:"center"})}),[s-1,s+1].forEach($=>{const M=($+e.length)%e.length;M!==s&&(new Image().src=e[M].src)})},o=L=>{e.length<2||(s=(s+L+e.length)%e.length,f())};let v=!1;const w=()=>{v||(v=!0,n.classList.add("out"),window.removeEventListener("keydown",g),window.setTimeout(()=>{n.remove(),document.querySelector(".lx")||document.body.classList.remove("no-scroll")},160),a&&document.contains(a)&&a.focus({preventScroll:!0}))},g=L=>{L.key==="Escape"?(L.preventDefault(),w()):L.key==="ArrowLeft"?(L.preventDefault(),o(-1)):L.key==="ArrowRight"?(L.preventDefault(),o(1)):L.key==="Home"?(s=0,f()):L.key==="End"&&(s=e.length-1,f())};r.addEventListener("load",()=>r.classList.add("ready")),r.addEventListener("error",()=>r.classList.add("ready")),n.querySelector(".lx-close").addEventListener("click",w),h.addEventListener("click",L=>{L.stopPropagation(),o(-1)}),c.addEventListener("click",L=>{L.stopPropagation(),o(1)}),n.addEventListener("click",L=>{const $=L.target;($===n||$===i)&&w()}),p.addEventListener("click",L=>{const $=L.target.closest(".lx-thumb");$&&(L.stopPropagation(),s=Number($.dataset.i),f())});let T=0,k=0;n.addEventListener("touchstart",L=>{T=L.touches[0].clientX,k=L.touches[0].clientY},{passive:!0}),n.addEventListener("touchend",L=>{const $=L.changedTouches[0].clientX-T,M=L.changedTouches[0].clientY-k;Math.abs($)>55&&Math.abs($)>Math.abs(M)?o($<0?1:-1):M>90&&Math.abs(M)>Math.abs($)*1.4&&w()},{passive:!0}),document.body.appendChild(n),document.body.classList.add("no-scroll"),f(),window.addEventListener("keydown",g),n.querySelector(".lx-close").focus({preventScroll:!0})}function Aa(e,t="",a=""){return`<div class="empty">
    <div class="empty-mark">${b("book",22)}</div>
    <p class="empty-title">${m(e)}</p>
    ${t?`<p class="empty-desc">${m(t)}</p>`:""}
    ${a}
  </div>`}function ot(e=3){return Array.from({length:e}).map(()=>`<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`).join("")}class qa{constructor(){R(this,"audio",null);R(this,"pill",null);R(this,"title","");R(this,"url","");R(this,"armed",!1)}get want(){return localStorage.getItem("qz.bgm")!=="off"}get volume(){const t=Number(localStorage.getItem("qz.bgm.vol"));return Number.isFinite(t)&&t>0?Math.min(t,1):.55}setTrack(t,a){const s=t!==this.url;this.url=t,this.title=a||"未命名音轨",s&&(this.ensureAudio(),this.audio&&(this.audio.src=t,this.audio.volume=this.volume,this.audio.load())),this.render(),s&&t&&this.want&&this.arm()}ensureAudio(){if(this.audio)return;const t=new Audio;t.loop=!0,t.preload="metadata",t.volume=this.volume,t.addEventListener("play",()=>this.render()),t.addEventListener("pause",()=>this.render()),t.addEventListener("error",()=>{this.render(),this.url&&S("背景音乐加载失败，可能是格式不支持","err")}),this.audio=t}arm(){if(this.armed)return;this.armed=!0;const t=a=>{const s=a.target;s&&s.closest(".bgm")||(document.removeEventListener("pointerdown",t),document.removeEventListener("keydown",t),this.want&&this.audio&&this.audio.paused&&this.play())};document.addEventListener("pointerdown",t),document.addEventListener("keydown",t)}async play(){if(this.ensureAudio(),!(!this.audio||!this.url))try{await this.audio.play(),localStorage.setItem("qz.bgm","on")}catch{this.render()}}pause(){var t;(t=this.audio)==null||t.pause(),localStorage.setItem("qz.bgm","off"),this.render()}isPlaying(){return!!this.audio&&!this.audio.paused}toggle(){var t;if(!this.url){S("还没有设置背景音乐，可以在「设置」里上传","err");return}((t=this.audio)==null?void 0:t.paused)!==!1?this.play():this.pause()}setVolume(t){localStorage.setItem("qz.bgm.vol",String(t)),this.audio&&(this.audio.volume=t)}mount(){if(this.pill){this.render();return}const t=document.createElement("div");t.className="bgm",document.body.appendChild(t),this.pill=t,t.addEventListener("click",a=>{const s=a.target;if(s.closest("[data-bgm-toggle]")){this.toggle();return}s.closest(".bgm-meta")&&(location.hash="#/settings?tab=music")}),t.addEventListener("input",a=>{const s=a.target;s.matches(".bgm-vol")&&this.setVolume(Number(s.value))}),this.render(),this.url&&this.want&&this.arm()}unmount(){var t,a;(t=this.pill)==null||t.remove(),this.pill=null,(a=this.audio)==null||a.pause(),document.body.classList.remove("has-bgm")}render(){if(document.body.classList.toggle("has-bgm",!!this.url),!this.pill)return;const t=this.audio?!this.audio.paused:!1,a=Math.round(this.volume*100);window.dispatchEvent(new CustomEvent("qz:bgm",{detail:{playing:t}})),this.pill.innerHTML=`
      <div class="bgm-disc ${t?"spin":""}" data-bgm-toggle title="${t?"暂停":"播放"}">${b("music",16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${m(this.url?this.title:"未设置音轨")}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${t?"暂停":"播放"}">
        ${b(t?"pause":"play",14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${a}" aria-label="音量">
      <div class="bgm-wave ${t?"on":""}"><i></i><i></i><i></i><i></i></div>`}}const j=new qa;window.bgm=j;const _s="qz.mode",Ds=window.matchMedia("(prefers-color-scheme: dark)"),Rt=new Set;function Ca(){try{const e=localStorage.getItem(_s);return e==="dark"||e==="light"?e:"auto"}catch{return"auto"}}let Re=Ca();function Ra(){return Re}function Ue(){return Re==="dark"||Re==="auto"&&Ds.matches}function _t(){var a;const e=Ue(),t=document.documentElement;t.dataset.appearance=e?"dark":"light",t.style.colorScheme=e?"dark":"light",(a=document.querySelector('meta[name="theme-color"]'))==null||a.setAttribute("content",e?"#131412":"#f7f4ee"),Rt.forEach(s=>s())}function Bs(e){Re=e;try{localStorage.setItem(_s,e)}catch{}_t()}function za(){return Bs(Ue()?"light":"dark"),Re}function Ia(e){return Rt.add(e),()=>Rt.delete(e)}Ds.addEventListener("change",()=>{Re==="auto"&&_t()});_t();function Dt(e="theme-toggle",t=17,a="icon-btn"){return`<button class="${a} theme-toggle" id="${e}" title="${Os()}" aria-label="切换深色 / 浅色">${b(Ue()?"sun":"moon",t)}</button>`}function Os(){return Ue()?"切换到浅色":"切换到深色"}function Bt(e,t="theme-toggle"){const a=e.querySelector(`#${t}`);if(!a)return()=>{};const s=()=>{a.isConnected&&(a.innerHTML=b(Ue()?"sun":"moon",17),a.title=Os())};return a.addEventListener("click",()=>{za(),s()}),Ia(s)}function Pa(e,t){e.innerHTML=`
  <div class="auth">
    ${Dt("auth-theme",17)}
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
  </div>`,Bt(e,"auth-theme");const a=e.querySelector("#auth-form"),s=e.querySelector("#auth-submit"),n=e.querySelector("#auth-hint"),r=Array.from(e.querySelectorAll(".auth-tab"));let i="login";const l=d=>{i=d,r.forEach(h=>h.classList.toggle("active",h.dataset.tab===d)),e.querySelectorAll('[data-only="register"]').forEach(h=>{h.hidden=d!=="register"});const p=a.elements.namedItem("nickname");p.required=d==="register",s.textContent=d==="login"?"登录":"创建空间",n.textContent=d==="login"?"还没有账号？点上面的「注册」，30 秒就能开通。":"空间号将作为你的主页地址，注册后不可修改。"};r.forEach(d=>d.addEventListener("click",()=>l(d.dataset.tab))),e.querySelectorAll(".demo-chip").forEach(d=>{d.addEventListener("click",()=>{var p,h;l("login"),a.elements.namedItem("uin").value=(p=d.dataset.uin)!=null?p:"",a.elements.namedItem("password").value=(h=d.dataset.pw)!=null?h:"",s.focus()})}),a.addEventListener("submit",async d=>{var o,v,w;d.preventDefault();const p=new FormData(a),h=String((o=p.get("uin"))!=null?o:"").trim(),c=String((v=p.get("password"))!=null?v:""),f=String((w=p.get("nickname"))!=null?w:"").trim();if(i==="register"&&!f){S("请填写昵称","err");return}s.disabled=!0,s.textContent=i==="login"?"登录中…":"创建中…";try{i==="login"?await A.login(h,c):await A.register(h,f,c),S(i==="login"?"欢迎回来":"空间已开通","ok"),await t()}catch(g){S(m(g.message),"err"),s.disabled=!1,s.textContent=i==="login"?"登录":"创建空间"}})}const Ha={城市:30,技术:212,旅行:168,随笔:282,生活:8,摄影:196,读书:248,音乐:330};function js(e){var s;if(!e)return 40;const t=Ha[e];if(t!==void 0)return t;let a=0;for(const n of e)a=(a*31+((s=n.codePointAt(0))!=null?s:0))%360;return a}function Ns(e){return`<span class="pill cat" style="--cat:${js(e)}">${m(e)}</span>`}const Us={private:"仅自己可见",unlisted:"不公开列出",public:""};function Fs(e){const t=e.cover||e.images[0]||"";return`<article class="feature card${t?"":" no-cover"}" data-post="${e.id}">
    ${t?`<a class="feature-cover" href="#/post/${e.id}"><img src="${m(mt(t,800))}" alt="${m(e.title)}" loading="lazy" decoding="async"></a>`:""}
    <div class="feature-body">
      <div class="post-kicker">
        ${e.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        ${Ns(e.category)}
        ${e.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${Us[e.visibility]}</span>`:""}
      </div>
      <h2 class="feature-title"><a href="#/post/${e.id}">${m(e.title||"无标题")}</a></h2>
      <p class="feature-summary">${m(e.summary)}</p>
      <div class="post-meta">
        <span>${he(e.at)}</span>
        <span class="meta-dot">·</span>
        <span>${b("clock",12)} ${e.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${e.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${e.likeCount}</span>
      </div>
    </div>
  </article>`}function ft(e){const t=e.cover||e.images[0]||"";return`<article class="post-row" data-post="${e.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${e.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        ${Ns(e.category)}
        ${e.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${Us[e.visibility]}</span>`:""}
      </div>
      <h3 class="post-row-title"><a href="#/post/${e.id}">${m(e.title||"无标题")}</a></h3>
      <p class="post-row-summary">${m(e.summary)}</p>
      <div class="post-meta">
        <span>${he(e.at)}</span>
        <span class="meta-dot">·</span>
        <span>${e.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${e.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${e.likeCount}</span>
      </div>
    </div>
    ${t?`<a class="post-row-thumb" href="#/post/${e.id}"><img src="${m(mt(t,400))}" alt="" loading="lazy" decoding="async"></a>`:""}
  </article>`}function ks(e){return e.length?`<ul class="comment-list">${e.map(t=>`<li class="comment" data-cid="${t.id}">
        ${ce(t.author.avatar,t.author.nickname,34,t.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${m(t.author.uin)}">${m(t.author.nickname)}</a>
            <time>${he(t.at)}</time>
            <button class="text-btn" data-reply="${m(t.author.nickname)}">回复</button>
            ${t.canDel?`<button class="text-btn danger" data-del-comment="${t.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${t.replyTo?`<span class="comment-reply">回复 ${m(t.replyTo)}：</span>`:""}${m(t.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function _a(e){const t=e.privacy==="public"?"":`<span class="album-vis">${b(e.privacy==="private"?"lock":"eyeoff",12)}${e.privacy==="private"?"仅自己":"隐藏"}</span>`;return`<a class="album-card card" href="#/album/${e.id}">
    <div class="album-cover">
      ${e.cover?`<img src="${m(mt(e.cover,800))}" alt="${m(e.name)}" loading="lazy" decoding="async">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${e.count} 张</span>
      ${t}
      <span class="album-shade" aria-hidden="true"></span>
    </div>
    <div class="album-info">
      <h3>${m(e.name)}</h3>
      <p>${m(e.description||"还没有描述")}</p>
    </div>
  </a>`}async function Da(e,t){var r;const a=we();e.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${m(a.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ce(a.avatar,a.nickname,0,"",0)}</div>
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
      <div class="home-main" id="home-main">${ot(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,bt(e);const s=e.querySelector("#home-main"),n=e.querySelector("#home-rail");try{const[{posts:i,total:l},d]=await Promise.all([A.posts({limit:7}),A.albums()]);if(!i.length)s.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const c=(r=i.find(o=>o.pinned))!=null?r:i[0],f=i.filter(o=>o.id!==c.id);s.innerHTML=`
        ${Fs(c)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${l} 篇 ${b("chevron",12)}</a>
        </div>
        <div class="post-list">${f.map(ft).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}n.innerHTML=`
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
          <div class="rail-disc ${Ye()?"spin":""}">${b("music",16)}</div>
          <div class="rail-music-meta">
            <b>${m(a.bgmTitle||"未设置音轨")}</b>
            <span id="rail-music-state">${a.bgmUrl?Ye()?"正在循环播放":"已暂停 · 点下面的按钮继续":"去设置里挑一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${Ye()?b("pause",13):b("play",13)} ${Ye()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${d.albums.slice(0,3).map(c=>`<a class="rail-album" href="#/album/${c.id}">
                <img src="${m(c.cover)}" alt="" loading="lazy" decoding="async">
                <span>${m(c.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${b("mail",13)} 去留言</a>
      </section>`;const p=n.querySelector("#rail-play"),h=n.querySelector("#rail-music-state");window.addEventListener("qz:bgm",()=>{var f;if(!p||!p.isConnected)return;const c=j.isPlaying();(f=n.querySelector(".rail-disc"))==null||f.classList.toggle("spin",c),p.innerHTML=`${b(c?"pause":"play",13)} ${c?"暂停":"播放"}`,h&&(h.textContent=c?"正在循环播放":"已暂停 · 点下面的按钮继续")},{signal:La()}),p==null||p.addEventListener("click",()=>{j.toggle()})}catch(i){S(i.message,"err")}}function Ye(){return j.isPlaying()}const Ba=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function Oa(e,t){const a=t.params.sort==="popular"?"popular":"latest",s=t.params.category||"全部",n=t.params.q||"";e.innerHTML=`<div class="page">
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
        ${Ba.map(f=>`<button class="sort-btn ${f.key===a?"active":""}" data-sort="${f.key}">${f.label}</button>`).join("")}
      </div>
    </div>
    ${n?`<p class="search-note">搜索「${m(n)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${ot(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const r=e.querySelector("#archive-list"),i=e.querySelector("#load-more"),l=e.querySelector("#cat-row");let d,p=[];const h=()=>{const f=new Set(["全部"]);p.forEach(o=>o.category&&f.add(o.category)),l.innerHTML=Array.from(f).map(o=>`<button class="chip ${o===s?"active":""}" data-cat="${m(o)}">${m(o)}</button>`).join("")},c=async f=>{f&&(d=void 0,r.innerHTML=ot(2));const o=await A.posts({category:s,sort:a,q:n,limit:8,before:d});p=f?o.posts:p.concat(o.posts);const v=o.posts.map(ft).join("");f?r.innerHTML=v:r.insertAdjacentHTML("beforeend",v),o.posts.length&&(d=o.posts[o.posts.length-1].at),i.hidden=!o.hasMore,e.querySelector("#archive-sub").textContent=`共 ${o.total} 篇 · 按${a==="popular"?"阅读量":"时间"}排序`,h(),f&&!o.posts.length&&(r.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await c(!1)}catch(f){S(f.message,"err")}finally{i.disabled=!1}}),l.addEventListener("click",f=>{const o=f.target.closest("[data-cat]");if(!o)return;const v=new URLSearchParams;o.dataset.cat&&o.dataset.cat!=="全部"&&v.set("category",o.dataset.cat),a==="popular"&&v.set("sort","popular"),location.hash=`#/posts${v.toString()?"?"+v.toString():""}`}),e.querySelectorAll("[data-sort]").forEach(f=>{f.addEventListener("click",()=>{const o=new URLSearchParams;s!=="全部"&&o.set("category",s),f.dataset.sort==="popular"&&o.set("sort","popular"),location.hash=`#/posts${o.toString()?"?"+o.toString():""}`})});try{await c(!0)}catch(f){S(f.message,"err"),r.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}function Ot(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var xe=Ot();function Zs(e){xe=e}var ve={exec:()=>null};function fe(e){let t=[];return a=>{let s=Math.max(0,Math.min(3,a-1)),n=t[s];return n||(n=e(s),t[s]=n),n}}function q(e,t=""){let a=typeof e=="string"?e:e.source,s={replace:(n,r)=>{let i=typeof r=="string"?r:r.source;return i=i.replace(D.caret,"$1"),a=a.replace(n,i),s},getRegex:()=>new RegExp(a,t)};return s}var Vs=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),Gs="^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)",D={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,textIndentedContinuation:/^(?:\n(?: {4}| {0,3}\t)[ \t]*[^ \t\n][^\n]*)+/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,blockquoteFenceOpen:/^ {0,3}(`{3,}(?=[^`]*$)|~{3,})/,blockquoteFenceClose:/^ {0,3}(`{3,}|~{3,})[ \t]*$/,blockquoteListItemStart:/^ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|$)/,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableHeader:new RegExp(Gs+"(?:\\n|$)"),tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:fe(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:fe(e=>new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:fe(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:fe(e=>new RegExp(`^ {0,${e}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:fe(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:fe(e=>new RegExp(`^ {0,${e}}(?:</?(?:${Nt})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:fe(e=>new RegExp(`^ {0,${e}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},ja=/^(?:[ \t]*(?:\n|$))+/,Na=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ua=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*)[ \t]*(?=\n|$)|$)/,Fe=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Fa=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,jt=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Nt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ze=q(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",Nt).getRegex(),Ws=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,Qs=q(Ws).replace(/bull/g,jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,Ze).getRegex(),Za=q(Ws).replace(/bull/g,jt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,Ze).getRegex(),Ut=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Va=/^[^\n]+/,Ft=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,Ga=q(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ft).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),Wa=q(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,jt).getRegex(),Zt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Qa=q("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Zt).replace("tag",Nt).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),Ks=e=>q(Ut).replace("hr",Fe).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",e).replace("html",Ze).getRegex(),Ka=Ks(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Xa=Ks(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),ys=/ {0,3}> ?(?:(?!blank)(paragraph)|[^\n]*)(?:\n|$)/,Ya=q(/^(first)(?:next)*/).replace("first",q(ys).replace("blank",/[ \t]*(?:\n|$)| {4}/).getRegex()).replace("next",q(ys).replace("blank",/[ \t]*(?:\n|$)/).getRegex()).replace(/paragraph/g,Xa).getRegex(),Vt={blockquote:Ya,code:Na,def:Ga,fences:Ua,heading:Fa,hr:Fe,html:Qa,lheading:Qs,list:Wa,newline:ja,paragraph:Ka,table:ve,text:Va},Ja=q(Gs+"(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Fe).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",Ze).getRegex(),en={...Vt,lheading:Za,table:Ja,paragraph:q(Ut).replace("hr",Fe).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",D.tableHeader).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",Ze).getRegex()},tn={...Vt,html:q(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",Zt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ve,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:q(Ut).replace("hr",Fe).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",Qs).getRegex()},sn=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,an=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Xs=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,nn=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ie=/[\p{P}\p{S}]/u,Ie=/[\s\p{P}\p{S}]/u,Ve=/[^\s\p{P}\p{S}]/u,rn=q(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ie).getRegex(),ln=/[\p{Pi}\p{Ps}"']/u,Ys=/(?!~)[\p{P}\p{S}]/u,on=/(?!~)[\s\p{P}\p{S}]/u,cn=/(?:[^\s\p{P}\p{S}]|~)/u,dn=q(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Vs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Js=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,un=q(Js,"u").replace(/punct/g,ie).getRegex(),pn=q(Js,"u").replace(/punct/g,Ys).getRegex(),hn=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,mn=q(hn,"u").replace(/openQuote/g,ln).replace(/punct/g,ie).getRegex(),ea="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",gn=q(ea,"gu").replace(/notPunctSpace/g,Ve).replace(/punctSpace/g,Ie).replace(/punct/g,ie).getRegex(),bn=q(ea,"gu").replace(/notPunctSpace/g,cn).replace(/punctSpace/g,on).replace(/punct/g,Ys).getRegex(),fn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",vn=q(fn,"gu").replace(/notPunctSpace/g,Ve).replace(/punctSpace/g,Ie).replace(/punct/g,ie).getRegex(),kn=q("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Ve).replace(/punctSpace/g,Ie).replace(/punct/g,ie).getRegex(),yn="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",$n=q(yn,"gu").replace(/notPunctSpace/g,Ve).replace(/punctSpace/g,Ie).replace(/punct/g,ie).getRegex(),wn=q(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ie).getRegex(),xn="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Sn=q(xn,"gu").replace(/notPunctSpace/g,Ve).replace(/punctSpace/g,Ie).replace(/punct/g,ie).getRegex(),Ln=q(/\\(punct)/,"gu").replace(/punct/g,ie).getRegex(),En=q(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,ie).getRegex(),Tn=q(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Mn=q(Zt).replace("(?:-->|$)","-->").getRegex(),An=q("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Mn).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ta=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,ct=q(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",ta).getRegex(),vt=/\\[^ \t\n\x00-\x1f]|\\(?=[ \t\n])|[^ \t\n\x00-\x1f\\()]/,qn=q(/\((?:char)*\)/).replace("char",vt).getRegex(),Cn=q(/\((?:char|p1)*\)/).replace("char",vt).replace("p1",qn).getRegex(),Rn=q(/\((?:char|p2)*\)/).replace("char",vt).replace("p2",Cn).getRegex(),zn=q(/(?!<)(?:char|p3)+/).replace("char",vt).replace("p3",Rn).getRegex(),In=q(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",ct).replace("href",q(/<(?:\\.|[^\n<>\\])*>|bareHref|(?=\))/).replace("bareHref",zn).getRegex()).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),Pn=q(/^!?\[(label)\]\[(ref)\]/).replace("label",ct).replace("ref",Ft).getRegex(),Hn=q(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ft).getRegex(),$s=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,_n=q(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",ta).getRegex(),Dn=q("reflink|nolink(?!\\()","g").replace("reflink",q(/^!?\[(label)\]\[(ref)\]/).replace("label",_n).replace("ref",$s).getRegex()).replace("nolink",q(/^!?\[(ref)\](?:\[\])?/).replace("ref",$s).getRegex()).getRegex(),ws=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Bn=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,On=q(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,Bn).getRegex(),Gt={_backpedal:ve,anyPunctuation:Ln,anyPunctuationOutsideCode:En,autolink:Tn,blockSkip:dn,br:Xs,code:an,del:ve,delLDelim:ve,delRDelim:ve,emStrongLDelim:un,emStrongRDelimAst:gn,emStrongRDelimUnd:kn,escape:sn,link:In,nolink:Hn,punctuation:rn,reflink:Pn,reflinkSearch:Dn,tag:An,text:nn,url:ve},jn={...Gt,emStrongLDelim:mn,emStrongRDelimAst:vn,emStrongRDelimUnd:$n,link:q(/^!?\[(label)\]\((.*?)\)/).replace("label",ct).getRegex(),reflink:q(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ct).getRegex()},zt={...Gt,emStrongRDelimAst:bn,emStrongLDelim:pn,delLDelim:wn,delRDelim:Sn,url:q(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",On).replace("protocol",ws).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:q(/^(?:[A-Za-z0-9.+-]+(?=@)|[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",ws).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",Vs?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},Nn={...zt,br:q(Xs).replace("{2,}","*").getRegex(),text:q(zt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Je={normal:Vt,gfm:en,pedantic:tn},De={normal:Gt,gfm:zt,breaks:Nn,pedantic:jn},Un={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},xs=e=>Un[e];function Z(e,t){if(t){if(D.escapeTest.test(e))return e.replace(D.escapeReplace,xs)}else if(D.escapeTestNoEncode.test(e))return e.replace(D.escapeReplaceNoEncode,xs);return e}function Fn(e){return D.numericCharacterReference.test(e)?e.replace(D.numericCharacterReferenceOrAmpersand,(t,a,s)=>{if(a===void 0&&s===void 0)return"&amp;";let n=a===void 0?Number.parseInt(s,16):Number.parseInt(a,10);return n===0||n>1114111||n>=55296&&n<=57343?"�":n===38?"&amp;":String.fromCodePoint(n)}):e}function Ss(e){try{e=encodeURI(e).replace(D.percentDecode,"%")}catch{return null}return e}function Tt(e,t){var r;let a=e.replace(D.findPipe,(i,l,d)=>{let p=!1,h=l;for(;--h>=0&&d[h]==="\\";)p=!p;return p?"|":" |"}),s=a.split(D.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!((r=s.at(-1))!=null&&r.trim())&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(D.slashPipe,"|");return s}function oe(e,t,a){let s=e.length;if(s===0)return"";let n=0;for(;n<s&&e.charAt(s-n-1)===t;)n++;return e.slice(0,s-n)}function Ls(e){let t=e.split(`
`),a=t.length-1;for(;a>=0&&D.blankLine.test(t[a]);)a--;return t.length-a<=2?e:t.slice(0,a+1).join(`
`)}function dt(e){return e.trim().replace(D.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function Es(e,t){if(e.indexOf(t[0])===-1&&e.indexOf(t[1])===-1)return-1;let a=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])a++;else if(e[s]===t[1]&&(a--,a<0))return s;return a>0?-2:-1}var ze=new WeakMap;function Wt(e){let t={"*":-1,_:-1},a=-1,s=e.length;for(let n=0;n<s;n++){let r=e[n];if(r!=="*"&&r!=="_"&&r!=="~")continue;let i=n===0?`
`:e[n-1],l=n+1;for(;l<s&&e[l]===r;)l++;i!==" "&&i!=="	"&&i!==`
`&&i!=="\r"&&i!=="\f"&&(r==="~"?a=n:t[r]=n),n=l-1}return{maskedSrc:e,lastPossibleEmStrongCloserIndex:t,lastPossibleDelCloserIndex:a}}function Zn(e,t){let a=Wt(t),s=ze.get(e);s?s.push(a):ze.set(e,[a])}function Vn(e){let t=ze.get(e);t&&(t.pop(),t.length===0&&ze.delete(e))}function sa(e,t,a){var n;let s=(n=ze.get(e))==null?void 0:n.at(-1);return s&&s.maskedSrc===t?s.lastPossibleEmStrongCloserIndex[a]:Wt(t).lastPossibleEmStrongCloserIndex[a]}function aa(e,t){var s;let a=(s=ze.get(e))==null?void 0:s.at(-1);return a&&a.maskedSrc===t?a.lastPossibleDelCloserIndex:Wt(t).lastPossibleDelCloserIndex}function et(e,t=0){let a=t,s="";for(let n of e)if(n==="	"){let r=4-a%4;s+=" ".repeat(r),a+=r}else s+=n,a++;return s}function Gn(e){let t,a=!1;return e.map(s=>{var p,h,c;if(a)return s;let{depth:n,expanded:r,keptIndent:i,content:l}=Wn(s,(p=t==null?void 0:t.depth)!=null?p:1/0);if((t==null?void 0:t.depth)!==n&&(t=void 0),t){let f=(h=D.blockquoteFenceClose.exec(l))==null?void 0:h[1];return!f||f[0]!==t.marker[0]||f.length<t.marker.length?i:(t=void 0,r)}if(a=D.blockquoteListItemStart.test(l),a)return s;let d=(c=D.blockquoteFenceOpen.exec(l))==null?void 0:c[1];return d&&(t={marker:d,depth:n}),r}).join(`
`)}function Wn(e,t){let a=0,s=0,n=0,r=0,i="";for(;n<t;){let h=a,c=s;for(;e[h]===" "||e[h]==="	";)c+=Ts(e[h],c),h++;if(e[h]!==">"||c-r>3)break;i+=" ".repeat(c-s)+">",n++,a=h+1,s=c+1,r=e[a]===" "||e[a]==="	"?s+1:s}if(n===0)return{depth:n,expanded:e,keptIndent:e,content:e};let l="",d="";for(;(e[a]===" "||e[a]==="	")&&s<r+4;){let h=Ts(e[a],s);l+=" ".repeat(h),d+=s<r&&h>1?" ".repeat(h):e[a],s+=h,a++}let p=e.slice(a);return{depth:n,expanded:i+l+p,keptIndent:i+d+p,content:" ".repeat(Math.max(0,s-r))+p}}function Ts(e,t){return e==="	"?4-t%4:1}function Qn(e,t){let a="";for(let s=0;s<e.length;s++){if(e[s]==="`"){let n=t.inline.code.exec(e.slice(s));if(n){a+=n[0],s+=n[0].length-1;continue}}if(e[s]==="\\"&&(e[s+1]==="["||e[s+1]==="]")){a+=e[s+1],s++;continue}a+=e[s]}return a}function Ms(e,t,a,s,n){let r=t.href,i=t.title||null,l=Qn(e[1],n),d=e[0].charAt(0)==="!",p=s.state.inLink,h=s.state.linkEmitted,c=s.state.inRawBlock;s.state.inLink=!0,s.state.linkEmitted=!1;let f=s.inlineTokens(l),o=s.state.linkEmitted;if(s.state.linkEmitted=h,s.state.inLink=p,!d){if(o){s.state.inRawBlock=c;return}s.state.linkEmitted=!0}return{type:d?"image":"link",raw:a,href:r,title:i,text:l,tokens:f}}function Kn(e,t,a){let s=e.match(a.other.indentCodeCompensation);if(s===null)return t;let n=s[1];return t.split(`
`).map(r=>{let i=r.match(a.other.beginningSpace);if(i===null)return r;let[l]=i;return r.slice(Math.min(l.length,n.length))}).join(`
`)}function As(e,t,a,s){if(!t.includes("<"))return!1;for(let n=0;n<t.length;n++){if(t[n]==="\\"){n++;continue}if(t[n]==="`"){let l=s.inline.code.exec(t.slice(n));if(l){n+=l[0].length-1;continue}}if(t[n]!=="<")continue;let r=e.slice(a+n),i=s.inline.tag.exec(r)||s.inline.autolink.exec(r);if(i){if(i[0].length>t.length-n)return!0;n+=i[0].length-1}}return!1}var ke=class{constructor(e){R(this,"options");R(this,"rules");R(this,"lexer");this.options=e||xe}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let a=this.options.pedantic?t[0]:Ls(t[0]),s=a.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:a,codeBlockStyle:"indented",text:s}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let a=t[0],s=Kn(a,t[3]||"",this.rules);return t[3]!==void 0&&(s===""||s.endsWith(`
`))&&(s+=`
`),{type:"code",raw:a,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let a=t[2].trim();if(this.rules.other.endingHash.test(a)){let s=oe(a,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(a=s.trim())}return{type:"heading",raw:oe(t[0],`
`),depth:t[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:oe(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let a=oe(t[0],`
`).split(`
`),s="",n="",r=[];for(;a.length>0;){let i=!1,l=[],d;for(d=0;d<a.length;d++)if(this.rules.other.blockquoteStart.test(a[d]))l.push(a[d]),i=!0;else if(!i)l.push(a[d]);else break;a=a.slice(d);let p=l.join(`
`),h=(this.lexer.state.top&&!this.lexer.state.inBlockquote&&p.includes("	")?Gn(l):p).replace(this.rules.other.blockquoteMarkerWhitespace,(v,w,g)=>g.startsWith(" ")?w+" "+g.slice(1):w+et(g,w.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${p}`:p,n=n?`${n}
${h}`:h;let c=this.lexer.state.top,f=this.lexer.state.inBlockquote;if(this.lexer.state.top=!0,this.lexer.state.inBlockquote=!0,this.lexer.blockTokens(h,r,!0),this.lexer.state.top=c,this.lexer.state.inBlockquote=f,a.length===0)break;let o=r.at(-1);if((o==null?void 0:o.type)==="code"||(o==null?void 0:o.type)==="heading"||(o==null?void 0:o.type)==="hr"||(o==null?void 0:o.type)==="html"||(o==null?void 0:o.type)==="table")break;if((o==null?void 0:o.type)==="blockquote"){let v=o,w=a.join(`
`),g=v.raw+`
`+w.replace(this.rules.other.blockquoteSetextReplace2,"");this.lexer.state.inBlockquote=!0;let T=this.blockquote(g);this.lexer.state.inBlockquote=f,r[r.length-1]=T;let k=g.substring(T.raw.length).replace(/^\n/,""),B=k?k.split(`
`).length:0,L=B?a.slice(0,-B):a;if(L.length>0&&(s=`${s}
${L.join(`
`)}`),n=n.substring(0,n.length-v.text.length)+T.text,a=a.slice(L.length),a.length>0&&this.rules.other.blockquoteStart.test(a[0]))continue;break}else if((o==null?void 0:o.type)==="list"){let v=o,w=v.raw+`
`+a.join(`
`),g=this.list(w);r[r.length-1]=g;let T=g.raw.length>v.raw.length?w.slice(v.raw.length+1,g.raw.length).split(`
`).length:0;if(T>0){let k=a.slice(0,T).join(`
`);s=`${s}
${k}`,n=`${n}
${k}`}if(a=a.slice(T),a.length>0&&!this.rules.other.blockquoteStart.test(a[0]))break;continue}}return{type:"blockquote",raw:s,tokens:r,text:n}}}list(e){var a;let t=this.rules.block.list.exec(e);if(t){if(!this.options.pedantic&&((a=this.lexer.state.lastToken)==null?void 0:a.type)==="text"&&!this.rules.other.listInterruptsParagraph.test(e))return;let s=e,n=()=>s.length-e.length,r=t[1].trim(),i=r.length>1,l={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let d=this.rules.other.listItemRegex(r),p=!1;for(;e;){let f=!1,o="";if(!(t=d.exec(e))||this.rules.block.hr.test(e))break;let v=n();e=e.substring(t[0].length);let w=t[2].split(`
`,1)[0],g=t[1].length,T=this.options.pedantic?et(w,g):w.replace(this.rules.other.leadingSpaceTab,M=>et(M,g)),k=e.split(`
`,1)[0],B=!T.trim(),L=0;if(this.options.pedantic?(L=2,o=T.trimStart()):B?L=g+1:(L=T.search(this.rules.other.nonSpaceChar),L=L>4?1:L,o=T.slice(L),L+=g),B&&this.rules.other.blankLine.test(k)&&(e=e.substring(k.length+1),f=!0),!f){let M=this.rules.other.nextBulletRegex(L),C=this.rules.other.hrRegex(L),_=this.rules.other.fencesBeginRegex(L),N=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(L):this.rules.other.headingBeginRegex(L),X=this.rules.other.htmlBeginRegex(L),re=this.rules.other.blockquoteBeginRegex(L),V=!1;for(;e;){let Se=e.split(`
`,1)[0],U;if(k=Se,this.options.pedantic?(k=k.replace(this.rules.other.listReplaceNesting,"  "),U=k):U=k.replace(this.rules.other.leadingSpaceTab,O=>et(O)),_.test(k)||N.test(k)||X.test(k)||re.test(k)||M.test(k)||C.test(k))break;if(U.search(this.rules.other.nonSpaceChar)>=L||!k.trim())o+=`
`+U.slice(L),V=!1;else{if(B)break;let O=T;if(!this.options.pedantic&&!o.includes(`
`)&&!T.includes("	")){let G;for(;!C.test(O)&&(G=this.rules.other.nestedBlockMarker.exec(O));)O=O.slice(G[0].length);if(!O.trim())break}if(O.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||_.test(O)||N.test(O)||X.test(O)||C.test(O))break;if(!this.options.pedantic&&!V){let G=T.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(G)||this.rules.block.heading.test(G)||this.rules.block.hr.test(G))break}let de=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(k)&&this.rules.block.lheading.test(`${T}
${k}`)?`    ${U.replace(/^ {0,3}/,"")}`:k;o+=`
`+de,V=!0}B=!k.trim(),e=e.substring(Se.length+1),T=U.slice(L)}}let $=s.slice(v,n());l.loose||(p?l.loose=!0:this.rules.other.doubleBlankLine.test($)&&(p=!0)),l.items.push({type:"list_item",raw:$,task:!!this.options.gfm&&this.rules.other.listIsTask.test(o),loose:!1,text:o,tokens:[]})}let h=l.items.at(-1);if(h)h.raw=h.raw.trimEnd(),h.text=h.text.trimEnd();else return;l.raw=s.slice(0,n()).trimEnd();let c=[];for(let f of l.items)if(this.lexer.state.top=!1,c.push(this.lexer.inlineQueue.length),f.tokens=this.lexer.blockTokens(f.text,[]),!l.loose){let o=f.tokens.filter(w=>w.type==="space"),v=o.length>0&&o.some(w=>this.rules.other.anyLine.test(w.raw));l.loose=v}for(let f=0;f<l.items.length;f++){let o=l.items[f],v=o.tokens[0];if(o.task&&((v==null?void 0:v.type)==="text"||(v==null?void 0:v.type)==="paragraph")){o.text=o.text.replace(this.rules.other.listReplaceTask,""),v.raw=v.raw.replace(this.rules.other.listReplaceTask,""),v.text=v.text.replace(this.rules.other.listReplaceTask,"");let w=this.lexer.inlineQueue;for(let T=c[f];T<w.length;T++)if(w[T].tokens===v.tokens){w[T].src=w[T].src.replace(this.rules.other.listReplaceTask,"");break}let g=this.rules.other.listTaskCheckbox.exec(o.raw);if(g){let T={type:"checkbox",raw:g[0]+" ",checked:g[0]!=="[ ]"};o.checked=T.checked,l.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=T.raw+o.tokens[0].raw,o.tokens[0].text=T.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(T)):o.tokens.unshift({type:"paragraph",raw:T.raw,text:T.raw,tokens:[T]}):o.tokens.unshift(T)}}else o.task&&(o.task=!1)}if(l.loose)for(let f of l.items){f.loose=!0;for(let o of f.tokens)o.type==="text"&&(o.type="paragraph")}return l}}html(e){var a;let t=this.rules.block.html.exec(e);if(t){if(((a=this.lexer.state.lastToken)==null?void 0:a.type)==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(e))return;let s=Ls(t[0]);return{type:"html",block:!0,raw:s,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:s}}}def(e){let t=this.rules.block.def.exec(e);if(t){if(!this.rules.other.startAngleBracket.test(t[2])&&Es(t[2],"()")!==-1)return;let a=dt(t[1]),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:a,raw:oe(t[0],`
`),href:s,title:n}}}table(e){var i;let t,a;if(this.options.gfm&&!this.options.pedantic){let l=this.rules.other.tableHeader.exec(e);if(!l||!this.rules.other.tableDelimiter.test(l[2])||(t=Tt(l[1]),a=l[2].replace(this.rules.other.tableAlignChars,"").split("|"),t.length!==a.length))return}let s=this.rules.block.table.exec(e);if(!s||!this.rules.other.tableDelimiter.test(s[2]))return;t!=null||(t=Tt(s[1])),a!=null||(a=s[2].replace(this.rules.other.tableAlignChars,"").split("|"));let n=(i=s[3])!=null&&i.trim()?s[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:oe(s[0],`
`),header:[],align:[],rows:[]};if(t.length===a.length){for(let l of a)this.rules.other.tableAlignRight.test(l)?r.align.push("right"):this.rules.other.tableAlignCenter.test(l)?r.align.push("center"):this.rules.other.tableAlignLeft.test(l)?r.align.push("left"):r.align.push(null);for(let l=0;l<t.length;l++)r.header.push({text:t[l],tokens:this.lexer.inline(t[l]),header:!0,align:r.align[l]});for(let l of n)r.rows.push(Tt(l,r.header.length).map((d,p)=>({text:d,tokens:this.lexer.inline(d),header:!1,align:r.align[p]})));return r}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let a=t[1].trim();return{type:"heading",raw:oe(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:a,tokens:this.lexer.inline(a)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let a=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:a,tokens:this.lexer.inline(a)}}}text(e){let t=this.rules.block.text.exec(e);if(t){let a=t[0],s=t[0],n=this.rules.other.textIndentedContinuation.exec(e.slice(a.length));return n&&(a+=n[0],s+=n[0].replace(this.rules.other.codeRemoveIndent,"")),{type:"text",raw:a,text:s,tokens:this.lexer.inline(s)}}}escape(e){if(e.charCodeAt(0)!==92)return;let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){if(e.charCodeAt(0)!==60)return;let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){if(this.lexer.state.linkParenPossible===!1)return;let t=e.charCodeAt(0);if(t!==91&&t!==33)return;let a=this.rules.inline.link.exec(e);if(a){let s=a[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&As(e,a[1],s,this.rules))return;let n=a[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let d=oe(n.slice(0,-1),"\\");if((n.length-d.length)%2===0)return}else{let d=Es(a[2],"()");if(d===-2)return;if(d>-1){let p=(a[0].indexOf("!")===0?5:4)+a[1].length+d;a[2]=a[2].substring(0,d),a[0]=a[0].substring(0,p).trim(),a[3]=""}}let r=oe(a[0].slice(0,-1),"\\");if((a[0].length-r.length)%2===0)return;let i=a[2],l="";if(this.options.pedantic){let d=this.rules.other.pedanticHrefTitle.exec(i);d&&(i=d[1],l=d[3])}else l=a[3]?a[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),Ms(a,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},a[0],this.lexer,this.rules)}}reflink(e,t){let a=e.charCodeAt(0);if(a!==91&&a!==33)return;let s;if((s=this.rules.inline.reflink.exec(e))||(s=this.rules.inline.nolink.exec(e))){let n=s[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&As(e,s[1],n,this.rules))return;let r=t[dt(s[2]||s[1])];if(!r){let i=s[0].charAt(0);return{type:"text",raw:i,text:i}}return Ms(s,r,s[0],this.lexer,this.rules)}}emStrong(e,t,a=""){var f;let s=this.rules.inline.emStrongLDelim.exec(e);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4])return;let n=s[0][0],r=a===n,i=t.length-e.length,l=i;for(;!this.options.pedantic&&l>0&&t[l-1]===n;)l--;let d=(f=[...t.slice(Math.max(0,l-2),l)].at(-1))!=null?f:"",p=d==="*"||d==="_"||!!this.rules.inline.punctuation.exec(d);l<i&&(a=d);let h=l<i?p:a==="*"||a==="_"||!!this.rules.inline.punctuation.exec(a);if(s[4]&&a.match(this.rules.other.unicodeAlphaNumeric))return;let c=s[1]||s[3]||"";if(!c||!a||h){let o=[...s[0]].length-1,v,w,g=o,T=0,k=i-l+o,B=!this.options.pedantic&&!!d.trim()&&(!!c||n==="*"&&!p);if(n!=="*"&&n!=="_")return;let L=n==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,$=sa(this,t,n),M=t.length-e.length+o;if($<M)return;t=t.slice(-1*e.length+o);let C=$-M;for(L.lastIndex=0;(s=L.exec(t))!==null&&!(s.index>C);){if(v=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!v)continue;if(w=[...v].length,s[3]||s[4]){g+=w;continue}else if((s[5]||s[6]||B)&&k%3&&!((k+w)%3)){if(r&&(s[5]||s[6]))break;T+=w;continue}if(g-=w,g>0)continue;w=Math.min(w,w+g+T);let _=[...s[0]][0].length,N=e.slice(0,o+s.index+_+w);if(Math.min(o,w)%2){let re=N.slice(1,-1);return{type:"em",raw:N,text:re,tokens:this.lexer.inlineTokens(re)}}let X=N.slice(2,-2);return{type:"strong",raw:N,text:X,tokens:this.lexer.inlineTokens(X)}}}}codespan(e){if(e.charCodeAt(0)!==96)return;let t=this.rules.inline.code.exec(e);if(t){let a=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return s&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:t[0],text:a}}}br(e){let t=e.charCodeAt(0);if(t!==32&&t!==92&&t!==10)return;let a=this.rules.inline.br.exec(e);if(a)return{type:"br",raw:a[0]}}del(e,t,a=""){if(e.charCodeAt(0)!==126)return;let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!a||this.rules.inline.punctuation.exec(a))){let n=[...s[0]].length-1,r,i,l=n,d=this.rules.inline.delRDelim,p=aa(this,t),h=t.length-e.length+n;if(p<h)return;t=t.slice(-1*e.length+n);let c=p-h;for(d.lastIndex=0;(s=d.exec(t))!==null&&!(s.index>c);){if(r=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!r||(i=[...r].length,i!==n))continue;if(s[3]||s[4]){l+=i;continue}if(l-=i,l>0)continue;i=Math.min(i,i+l);let f=[...s[0]][0].length,o=e.slice(0,n+s.index+f+i),v=o.slice(n,-n);return{type:"del",raw:o,text:v,tokens:this.lexer.inlineTokens(v)}}}}autolink(e){if(e.charCodeAt(0)!==60)return;let t=this.rules.inline.autolink.exec(e);if(t){let a,s;return t[2]==="@"?(a=t[1],s="mailto:"+a):(a=t[1],s=a),{type:"link",raw:t[0],text:a,href:s,autolink:!0,tokens:[{type:"text",raw:a,text:a}]}}}url(e){var a,s;let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else{let i;do i=t[0],t[0]=(s=(a=this.rules.inline._backpedal.exec(t[0]))==null?void 0:a[0])!=null?s:"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let a=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:a?t[0]:Fn(t[0]),escaped:a}}}},te,na,It,ia,ra,ye,J=(ye=class{constructor(t){ms(this,te);R(this,"tokens");R(this,"options");R(this,"state");R(this,"inlineQueue");R(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||xe,this.options.tokenizer=this.options.tokenizer||new ke,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0,inBlockquote:!1};let a={other:D,block:Je.normal,inline:De.normal};this.options.pedantic?(a.block=Je.pedantic,a.inline=De.pedantic):this.options.gfm&&(a.block=Je.gfm,this.options.breaks?a.inline=De.breaks:a.inline=De.gfm),this.tokenizer.rules=a}static get rules(){return{block:Je,inline:De}}static lex(t,a){return new ye(a).lex(t)}static lexInline(t,a){return new ye(a).inlineTokens(t)}lex(t){t=t.replace(D.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let s=this.inlineQueue[a];this.state.inRawBlock=!1,this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,a=[],s=!1){var d,p,h;this.tokenizer.lexer=this;let n=this.state.lastToken;this.options.pedantic&&(t=t.replace(D.tabCharGlobal,"    ").replace(D.spaceLine,""));let r=1/0,i,l=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===ke.prototype.paragraph;for(;t;){if(t.length<r)r=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}this.state.lastToken=a.at(-1);let c;if((p=(d=this.options.extensions)==null?void 0:d.block)!=null&&p.some(o=>(c=o.call({lexer:this},t,a))?(t=t.substring(c.raw.length),a.push(c),!0):!1))continue;if(c=this.tokenizer.space(t)){t=t.substring(c.raw.length);let o=a.at(-1);c.raw.length===1&&o!==void 0?o.raw+=`
`:a.push(c);continue}if(c=this.tokenizer.code(t)){t=t.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.at(-1).src=o.text):a.push(c);continue}if(c=this.tokenizer.fences(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.heading(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.hr(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.blockquote(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.list(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.html(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.def(t)){t=t.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.raw,this.inlineQueue.at(-1).src=o.text):(this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title}),a.push(c));continue}if(c=this.tokenizer.table(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.lheading(t)){t=t.substring(c.raw.length),a.push(c);continue}let f=t;if((h=this.options.extensions)!=null&&h.startBlock){let o=1/0,v=t.slice(1),w;this.options.extensions.startBlock.forEach(g=>{w=g.call({lexer:this},v),typeof w=="number"&&w>=0&&(o=Math.min(o,w))}),o<1/0&&o>=0&&(f=t.substring(0,o+1))}if(this.state.top&&(c=this.tokenizer.paragraph(f))){let o=a.at(-1);(s||o===i&&l)&&(o==null?void 0:o.type)==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text,i=o):(a.push(c),i=c),s=f.length!==t.length,t=t.substring(c.raw.length);continue}if(c=this.tokenizer.text(t)){t=t.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):a.push(c);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=n,a}inline(t,a=[]){return this.inlineQueue.push({src:t,tokens:a}),a}linkInText(t){if(!t.includes("["))return!1;let a=this.tokenizer.rules.inline.link;for(let s of t.matchAll(this.tokenizer.rules.inline.blockSkip))if(a.test(s[0])&&t.charAt(s.index-1)!=="!")return!0;for(let s of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let n=s[0],r=n.lastIndexOf("[");if(!(n.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,dt(n.slice(r+1,-1))))&&!(r>1&&this.linkInText(n.slice(1,r-1))))return!0}return!1}inlineTokens(t,a=[]){this.tokenizer.lexer=this;let s=this.state.linkParenPossible;this.state.linkParenPossible=t.includes(")");try{return Ae(this,te,na).call(this,t,a)}finally{this.state.linkParenPossible=s}}infiniteLoopError(t){let a="Infinite loop on byte: "+t;if(this.options.silent)console.error(a);else throw new Error(a)}},te=new WeakSet,na=function(t,a){var r;let s=t.includes("*")||t.includes("_")||t.includes("~"),n=s||(r=this.options.hooks)!=null&&r.emStrongMask||this.tokenizer.emStrong!==ke.prototype.emStrong||this.tokenizer.del!==ke.prototype.del?Ae(this,te,ra).call(this,t):t;if(!s)return Ae(this,te,It).call(this,t,n,a);Zn(this.tokenizer,n);try{return Ae(this,te,It).call(this,t,n,a)}finally{Vn(this.tokenizer)}},It=function(t,a,s){var l,d,p;let n=!1,r="",i=1/0;for(;t;){if(t.length<i)i=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}n||(r=""),n=!1;let h;if((d=(l=this.options.extensions)==null?void 0:l.inline)!=null&&d.some(o=>(h=o.call({lexer:this},t,s))?(t=t.substring(h.raw.length),s.push(h),!0):!1))continue;if(h=this.tokenizer.escape(t)){t=t.substring(h.raw.length),s.push(h);continue}if(h=this.tokenizer.tag(t)){t=t.substring(h.raw.length),s.push(h);continue}if(h=this.tokenizer.link(t)){t=t.substring(h.raw.length),s.push(h);continue}if(h=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(h.raw.length);let o=s.at(-1);h.type==="text"&&(o==null?void 0:o.type)==="text"?(o.raw+=h.raw,o.text+=h.text):s.push(h);continue}let c=t[0];if(c==="*"||c==="_"){let o=a.length-t.length;if(sa(this.tokenizer,a,c)<=o){let v=1;for(;v<t.length&&t.charCodeAt(v)===c.charCodeAt(0);)v++;let w=t.substring(0,v),g=s.at(-1);(g==null?void 0:g.type)==="text"&&!g.escaped?(g.raw+=w,g.text+=w):s.push({type:"text",raw:w,text:w,escaped:!1}),t=t.substring(v),r=c,n=!0;continue}}else if(c==="~"){let o=a.length-t.length;if(aa(this.tokenizer,a)<=o){let v=1;for(;v<t.length&&t.charCodeAt(v)===126;)v++;let w=t.substring(0,v),g=s.at(-1);(g==null?void 0:g.type)==="text"&&!g.escaped?(g.raw+=w,g.text+=w):s.push({type:"text",raw:w,text:w,escaped:!1}),t=t.substring(v),r=c,n=!0;continue}}if(h=this.tokenizer.emStrong(t,a,r)){t=t.substring(h.raw.length),s.push(h);continue}if(h=this.tokenizer.codespan(t)){t=t.substring(h.raw.length),s.push(h);continue}if(h=this.tokenizer.br(t)){t=t.substring(h.raw.length),s.push(h);continue}if(h=this.tokenizer.del(t,a,r)){t=t.substring(h.raw.length),s.push(h);continue}if(h=this.tokenizer.autolink(t)){t=t.substring(h.raw.length),s.push(h);continue}if(!this.state.inLink&&(h=this.tokenizer.url(t))){t=t.substring(h.raw.length),s.push(h);continue}let f=t;if((p=this.options.extensions)!=null&&p.startInline){let o=1/0,v=t.slice(1),w;this.options.extensions.startInline.forEach(g=>{w=g.call({lexer:this},v),typeof w=="number"&&w>=0&&(o=Math.min(o,w))}),o<1/0&&o>=0&&(f=t.substring(0,o+1))}if(h=this.tokenizer.inlineText(f)){t=t.substring(h.raw.length),h.raw.slice(-1)!=="_"&&(r=h.raw.slice(-1)),n=!0;let o=s.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=h.raw,o.text+=h.text):s.push(h);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return s},ia=function(t){let{blockSkip:a,tag:s,autolink:n}=this.tokenizer.rules.inline,r="",i=0,l;for(a.lastIndex=0;l=a.exec(t);){let d=l.index+(l[2]?l[2].length:0),p=l.index+l[0].length;if(t.charAt(d)==="<"){let h=t.slice(d),c=s.exec(h)||n.exec(h);if(!c){a.lastIndex=d+1;continue}p=d+c[0].length,a.lastIndex=p}r+=t.slice(i,d)+"["+"a".repeat(p-d-2)+"]",i=p}return r+t.slice(i)},ra=function(t){var s,n,r;let a=t;if(this.tokens.links&&t.includes("[")){let i=this.tokenizer.rules.inline.reflinkSearch,l=d=>{let p=d.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,dt(d.slice(p+1,-1))))return d;if(p>1&&d.charAt(0)!=="!"){let h=d.slice(1,p-1);if(this.linkInText(h))return"["+h.replace(i,l)+"]["+"a".repeat(d.length-p-2)+"]"}return"["+"a".repeat(d.length-2)+"]"};a=a.replace(i,l)}return a=a.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(i,l,d)=>d?"+".repeat(i.length):l?l+i.slice(l.length,-l.length).replace(/`/g,"+")+l:i),a=Ae(this,te,ia).call(this,a),a=(r=(n=(s=this.options.hooks)==null?void 0:s.emStrongMask)==null?void 0:n.call({lexer:this},a))!=null?r:a,a},ye);function la(e){return e.map(t=>t.type==="codespan"||t.type==="escape"?{...t,text:Z(t.text,!0)}:"tokens"in t&&t.tokens?{...t,tokens:la(t.tokens)}:t)}var ut=class{constructor(e){R(this,"options");R(this,"parser");this.options=e||xe}space(e){return""}code({text:e,lang:t,escaped:a}){var r;let s=(r=(t||"").match(D.notSpaceStart))==null?void 0:r[0],n=e?e.replace(D.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+Z(s)+'">'+(a?n:Z(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:Z(n,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,a=e.start,s="";for(let i=0;i<e.items.length;i++){let l=e.items[i];s+=this.listitem(l)}let n=t?"ol":"ul",r=t&&a!==1?' start="'+a+'"':"";return"<"+n+r+`>
`+s+"</"+n+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",a="";for(let n=0;n<e.header.length;n++)a+=this.tablecell(e.header[n]);t+=this.tablerow({text:a});let s="";for(let n=0;n<e.rows.length;n++){let r=e.rows[n];a="";for(let i=0;i<r.length;i++)a+=this.tablecell(r[i]);s+=this.tablerow({text:a})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),a=e.header?"th":"td";return(e.align?`<${a} align="${e.align}">`:`<${a}>`)+t+`</${a}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Z(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,text:a,tokens:s,autolink:n}){let r=n?Z(a,!0):this.parser.parseInline(s),i=Ss(e);if(i===null)return r;e=Z(i,n);let l='<a href="'+e+'"';return t&&(l+=' title="'+Z(t)+'"'),l+=">"+r+"</a>",l}image({href:e,title:t,text:a,tokens:s}){s&&(a=this.parser.parseInline(la(s),this.parser.textRenderer));let n=Ss(e);if(n===null)return Z(a);e=n;let r=`<img src="${Z(e)}" alt="${Z(a)}"`;return t&&(r+=` title="${Z(t)}"`),r+=">",r}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Z(e.text)}},Qt=class{constructor(){R(this,"parser")}strong({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}em({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}codespan({text:e}){return e}del({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}html({text:e}){return e}text({text:e}){return e}link({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}image({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}br(){return`
`}checkbox({raw:e}){return e}},ee=class Pt{constructor(t){R(this,"options");R(this,"renderer");R(this,"textRenderer");this.options=t||xe,this.options.renderer=this.options.renderer||new ut,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Qt,this.textRenderer.parser=this}static parse(t,a){return new Pt(a).parse(t)}static parseInline(t,a){return new Pt(a).parseInline(t)}parse(t){var s;this.renderer.parser=this;let a="";for(let n=0;n<t.length;n++){let r=t[n],i=(s=this.options.extensions)==null?void 0:s.renderers;if(i&&Object.hasOwn(i,r.type)&&i[r.type]){let d=r,p=i[d.type].call({parser:this},d);if(p!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(d.type)){a+=p===!1?"":p!=null?p:"";continue}}let l=r;switch(l.type){case"space":{a+=this.renderer.space(l);break}case"hr":{a+=this.renderer.hr(l);break}case"heading":{a+=this.renderer.heading(l);break}case"code":{a+=this.renderer.code(l);break}case"table":{a+=this.renderer.table(l);break}case"blockquote":{a+=this.renderer.blockquote(l);break}case"list":{a+=this.renderer.list(l);break}case"checkbox":{a+=this.renderer.checkbox(l);break}case"html":{a+=this.renderer.html(l);break}case"def":{a+=this.renderer.def(l);break}case"paragraph":{a+=this.renderer.paragraph(l);break}case"text":{a+=this.renderer.text(l);break}default:{let d='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(d),"";throw new Error(d)}}}return a}parseInline(t,a=this.renderer){var n;this.renderer.parser=this;let s="";for(let r=0;r<t.length;r++){let i=t[r],l=(n=this.options.extensions)==null?void 0:n.renderers;if(l&&Object.hasOwn(l,i.type)&&l[i.type]){let p=l[i.type].call({parser:this},i);if(p!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){s+=p===!1?"":p!=null?p:"";continue}}let d=i;switch(d.type){case"escape":{s+=a.text(d);break}case"html":{s+=a.html(d);break}case"link":{s+=a.link(d);break}case"image":{s+=a.image(d);break}case"checkbox":{s+=a.checkbox(d);break}case"strong":{s+=a.strong(d);break}case"em":{s+=a.em(d);break}case"codespan":{s+=a.codespan(d);break}case"br":{s+=a.br(d);break}case"del":{s+=a.del(d);break}case"text":{s+=a.text(d);break}default:{let p='Token with "'+d.type+'" type was not found.';if(this.options.silent)return console.error(p),"";throw new Error(p)}}}return s}},nt,Ne=(nt=class{constructor(e){R(this,"options");R(this,"block");this.options=e||xe}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?J.lex:J.lexInline}provideParser(e=this.block){return e?ee.parse:ee.parseInline}},R(nt,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),R(nt,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),nt);function ue(e,t){if(Array.isArray(t))for(let a=0;a<t.length;a++)e.push(t[a]);else e.push(t)}var Xn=class{constructor(...e){R(this,"defaults",Ot());R(this,"options",this.setOptions);R(this,"parse",this.parseMarkdown(!0));R(this,"parseInline",this.parseMarkdown(!1));R(this,"Parser",ee);R(this,"Renderer",ut);R(this,"TextRenderer",Qt);R(this,"Lexer",J);R(this,"Tokenizer",ke);R(this,"Hooks",Ne);this.use(...e)}walkTokens(e,t){var s,n;let a=[];for(let r of e)switch(ue(a,t.call(this,r)),r.type){case"table":{let i=r;for(let l of i.header)ue(a,this.walkTokens(l.tokens,t));for(let l of i.rows)for(let d of l)ue(a,this.walkTokens(d.tokens,t));break}case"list":{let i=r;ue(a,this.walkTokens(i.items,t));break}default:{let i=r;(n=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&n[i.type]?this.defaults.extensions.childTokens[i.type].forEach(l=>{if(i[l]){let d=i[l].flat(1/0);ue(a,this.walkTokens(d,t))}}):i.tokens&&ue(a,this.walkTokens(i.tokens,t))}}return a}use(...e){let t=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return e.forEach(a=>{let s={...a};if(s.async=this.defaults.async||s.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let r=t.renderers[n.name];r?t.renderers[n.name]=function(...i){let l=n.renderer.apply(this,i);return l===!1&&(l=r.apply(this,i)),l}:t.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=t[n.level];r?r.unshift(n.tokenizer):t[n.level]=[n.tokenizer],n.start&&(n.level==="block"?t.startBlock?t.startBlock.push(n.start):t.startBlock=[n.start]:n.level==="inline"&&(t.startInline?t.startInline.push(n.start):t.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(t.childTokens[n.name]=n.childTokens)}),s.extensions=t),a.renderer){let n=this.defaults.renderer||new ut(this.defaults);for(let r in a.renderer){if(!(r in n))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;let i=r,l=a.renderer[i],d=n[i];n[i]=(...p)=>{let h=l.apply(n,p);return h===!1&&(h=d.apply(n,p)),h===!1?"":h!=null?h:""}}s.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new ke(this.defaults);for(let r in a.tokenizer){if(!(r in n))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let i=r,l=a.tokenizer[i],d=n[i];n[i]=(...p)=>{let h=l.apply(n,p);return h===!1&&(h=d.apply(n,p)),h}}s.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new Ne;for(let r in a.hooks){if(!(r in n))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;let i=r,l=a.hooks[i],d=n[i];Ne.passThroughHooks.has(r)?n[i]=p=>{if(n.options.async&&Ne.passThroughHooksRespectAsync.has(r))return(async()=>{let c=await l.call(n,p);return d.call(n,c)})();let h=l.call(n,p);return d.call(n,h)}:n[i]=(...p)=>{if(n.options.async)return(async()=>{let c=await l.apply(n,p);return c===!1&&(c=await d.apply(n,p)),c})();let h=l.apply(n,p);return h===!1&&(h=d.apply(n,p)),h}}s.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,r=a.walkTokens;s.walkTokens=function(i){let l=[];return ue(l,r.call(this,i)),n&&ue(l,n.call(this,i)),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return J.lex(e,t!=null?t:this.defaults)}parser(e,t){return ee.parse(e,t!=null?t:this.defaults)}parseMarkdown(e){return(t,a)=>{let s={...a},n={...this.defaults,...s},r=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return r(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=e),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(t):t,l=await(n.hooks?await n.hooks.provideLexer(e):e?J.lex:J.lexInline)(i,n),d=n.hooks?await n.hooks.processAllTokens(l):l;n.walkTokens&&await Promise.all(this.walkTokens(d,n.walkTokens));let p=await(n.hooks?await n.hooks.provideParser(e):e?ee.parse:ee.parseInline)(d,n);return n.hooks?await n.hooks.postprocess(p):p})().catch(r);try{n.hooks&&(t=n.hooks.preprocess(t));let i=(n.hooks?n.hooks.provideLexer(e):e?J.lex:J.lexInline)(t,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let l=(n.hooks?n.hooks.provideParser(e):e?ee.parse:ee.parseInline)(i,n);return n.hooks&&(l=n.hooks.postprocess(l)),l}catch(i){return r(i)}}}onError(e,t){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Z(a.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(a);throw a}}},$e=new Xn;function P(e,t){return $e.parse(e,t)}P.options=P.setOptions=function(e){return $e.setOptions(e),P.defaults=$e.defaults,Zs(P.defaults),P};P.getDefaults=Ot;P.defaults=xe;function Yn(...e){return $e.use(...e),P.defaults=$e.defaults,Zs(P.defaults),P}P.use=Yn;P.walkTokens=function(e,t){return $e.walkTokens(e,t)};P.parseInline=$e.parseInline;P.Parser=ee;P.parser=ee.parse;P.Renderer=ut;P.TextRenderer=Qt;P.Lexer=J;P.lexer=J.lex;P.Tokenizer=ke;P.Hooks=Ne;P.parse=P;P.options;P.setOptions;P.walkTokens;P.parseInline;ee.parse;J.lex;P.setOptions({gfm:!0,breaks:!0});function Kt(e){if(!e)return"";const t=e.replace(/&/g,"&amp;").replace(/</g,"&lt;"),a=P.parse(t,{async:!1}),s=document.createElement("template");s.innerHTML=a;for(const n of Array.from(s.content.querySelectorAll("a"))){const r=(n.getAttribute("href")||"").trim();/^https?:\/\//i.test(r)?(n.setAttribute("target","_blank"),n.setAttribute("rel","noopener noreferrer")):/^(mailto:|#|\/)/i.test(r)||n.removeAttribute("href")}for(const n of Array.from(s.content.querySelectorAll("img"))){const r=(n.getAttribute("src")||"").trim();/^(https?:\/\/|\/|data:image\/)/i.test(r)||n.removeAttribute("src")}return s.innerHTML}async function Jn(e,t){var d,p,h;const a=Number(t.params.id);e.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const s=await A.post(a);e.innerHTML=`<div class="page narrow">
    <a class="back-link" href="#/posts">${b("back",14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${s.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
          <a class="pill cat" style="--cat:${js(s.category)}" href="#/posts?category=${encodeURIComponent(s.category)}">${m(s.category)}</a>
          ${s.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${s.visibility==="private"?"仅自己可见":"不公开列出"}</span>`:""}
        </div>
        <h1 class="article-title">${m(s.title||"无标题")}</h1>
        <div class="article-meta">
          ${ce(s.author.avatar,s.author.nickname,34,s.author.uin)}
          <div class="article-meta-text">
            <b>${m(s.author.nickname)}</b>
            <span>${fs(s.at)} · ${s.readingTime} 分钟阅读 · ${s.views} 次浏览</span>
          </div>
          ${s.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${s.id}">${b("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${b("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${s.cover&&!((d=s.content)!=null?d:"").includes(s.cover)?`<figure class="article-cover"><img src="${m(s.cover)}" alt="" decoding="async" data-zoom="${m(s.cover)}"></figure>`:""}

      <div class="article-body markdown">${Kt((p=s.content)!=null?p:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${s.liked?"active":""}" id="like-btn">
          ${b("heart",16)}<span>${s.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${s.likes.length?`${s.likes.slice(0,8).map(c=>m(c.nickname)).join("、")} 觉得不错`:`写于 ${fs(s.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${s.commentNum}</span></h2>
      <div id="comment-area">${ks(s.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,bt(e);const n=e.querySelector("#like-btn");n.addEventListener("click",async()=>{try{const c=await A.likePost(s.id);n.classList.toggle("active",c.liked),n.querySelector("span").textContent=String(c.count||"赞")}catch(c){S(c.message,"err")}}),(h=e.querySelector("#del-post"))==null||h.addEventListener("click",async()=>{if(await lt("删除文章",`《${s.title}》删除后无法恢复，确定吗？`))try{await A.deletePost(s.id),S("已删除","ok"),location.hash="#/posts"}catch(c){S(c.message,"err")}});let r="";const i=e.querySelector("#reply-hint"),l=e.querySelector("#comment-area");l.addEventListener("click",async c=>{var w,g;const f=c.target,o=f.closest("[data-reply]");if(o){r=(w=o.dataset.reply)!=null?w:"",i.textContent=`回复 ${r}`,e.querySelector("#comment-form textarea").focus();return}const v=f.closest("[data-del-comment]");if(v){if(!await lt("删除评论","确定删除这条评论吗？"))return;try{await A.deleteComment(s.id,Number(v.dataset.delComment)),(g=v.closest(".comment"))==null||g.remove(),S("已删除","ok")}catch(T){S(T.message,"err")}}}),e.querySelector("#comment-form").addEventListener("submit",async c=>{c.preventDefault();const o=c.currentTarget.querySelector("textarea"),v=o.value.trim();if(v)try{const w=await A.commentPost(s.id,v,r);s.comments.push(w),l.innerHTML=ks(s.comments),o.value="",r="",i.textContent="",S("评论已发布","ok")}catch(w){S(w.message,"err")}})}const qs=2560,ei=3*1024*1024;function ti(e){return"createImageBitmap"in window?createImageBitmap(e).catch(()=>Cs(e)):Cs(e)}function Cs(e){return new Promise((t,a)=>{const s=URL.createObjectURL(e),n=new Image;n.onload=()=>{URL.revokeObjectURL(s),t(n)},n.onerror=()=>{URL.revokeObjectURL(s),a(new Error("图片解码失败，可能是不支持的格式"))},n.src=s})}function Mt(e,t,a){return new Promise((s,n)=>{e.toBlob(r=>r?s(r):n(new Error("图片压缩失败")),t,a)})}async function Ht(e,t=ei){const a={file:e,width:0,height:0,size:e.size,compressed:!1,originalSize:e.size};if(e.type==="image/gif"||e.type==="image/svg+xml")return a;const s=await ti(e),n="width"in s?s.width:0,r="height"in s?s.height:0;if(!n||!r||(a.width=n,a.height=r,e.size<=2*1024*1024&&Math.max(n,r)<=qs))return a;const i=Math.min(1,qs/Math.max(n,r));let l=Math.round(n*i),d=Math.round(r*i);const p=document.createElement("canvas");p.width=l,p.height=d;const h=p.getContext("2d");if(!h)return a;h.imageSmoothingQuality="high",h.drawImage(s,0,0,l,d),"close"in s&&typeof s.close=="function"&&s.close();const c="image/webp";let f=.9,o=await Mt(p,c,f),v=0;for(;o.size>t&&v<4;)f=Math.max(.6,f-.1),o=await Mt(p,c,f),o.size>t&&v===3&&(l=Math.round(l*.8),d=Math.round(d*.8),p.width=l,p.height=d,h.drawImage(s,0,0,l,d),o=await Mt(p,c,f)),v++;const w=e.name.replace(/\.[^.]+$/,"")+".webp",g=new File([o],w,{type:c});return{file:g,width:l,height:d,size:g.size,compressed:!0,originalSize:e.size}}function rt(e){return e>=1024*1024?`${(e/1024/1024).toFixed(1)}MB`:`${Math.round(e/1024)}KB`}const si=["随笔","城市","旅行","技术","阅读","生活"],tt="`".repeat(3),Rs=30;let st=null;const oa="qz.editor.mode",At="qz.editor.split";async function zs(e,t){var rs,ls,os,cs,ds,us,ps;const a=t.params.id?Number(t.params.id):0;let s=null;if(a&&(s=await A.post(a),!s.canEdit)){e.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}st==null||st();const n=new AbortController;let r=null,i=!1,l=0,d=0,p=0,h=!1;st=()=>{if(i=!0,window.clearTimeout(l),window.clearTimeout(d),window.clearTimeout(p),!h)try{_.classList.contains("dirty")&&k.value.trim()&&localStorage.setItem(o,JSON.stringify(ts()))}catch{}n.abort(),r==null||r(),document.body.classList.remove("writer-mode")};let c=(rs=s==null?void 0:s.cover)!=null?rs:"",f=(ls=s==null?void 0:s.images)!=null?ls:[];const o=`qz.draft.${a||"new"}`;let v=ai(),w=Number(localStorage.getItem(At))||50;document.body.classList.add("writer-mode"),e.innerHTML=`<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${a?`#/post/${a}`:"#/home"}" title="返回">${b("back",16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${m((os=s==null?void 0:s.title)!=null?os:"")}" autocomplete="off">
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
        ${Dt("btn-theme",16,"wr-ibtn")}
        <button class="wr-ibtn" id="btn-help" title="快捷键（Ctrl+/）">?</button>
        <button class="btn btn-primary btn-sm" id="save-btn">${b("check",13)} ${a?"保存修改":"发布"}</button>
      </div>
    </header>

    <div class="wr-draft" id="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="wr-body" id="body" data-mode="${v}" style="--split:${w}%">
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

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${m((cs=s==null?void 0:s.content)!=null?cs:"")}</textarea>
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
              ${c?`<img src="${m(c)}" alt="">`:"<span>点击上传封面</span>"}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${m((ds=s==null?void 0:s.category)!=null?ds:"随笔")}">
              <datalist id="cat-list">${si.map(u=>`<option value="${u}">`).join("")}</datalist>
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
              ${f.map(u=>`<img src="${m(u)}" alt="" data-zoom="${m(u)}">`).join("")||'<span class="muted">还没有配图</span>'}
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
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${Rs}MB 内图片自动压缩</span>
    </footer>

    <div class="wr-help" id="help" hidden>
      <div class="wr-help-card">
        <div class="wr-help-head">
          <b>快捷键</b>
          <button class="wr-ibtn" id="help-close">${b("close",14)}</button>
        </div>
        <div class="wr-help-grid">
          ${[["Ctrl + B / I","加粗 / 斜体"],["Ctrl + E","行内代码"],["Ctrl + K","插入链接"],["Ctrl + 1 / 2 / 3","一 / 二 / 三级标题"],["Ctrl + Shift + C","代码块"],["Ctrl + Shift + 8 / 7","无序 / 有序列表"],["Ctrl + Shift + Q","引用"],["Ctrl + Shift + E / S / V","编辑 / 分屏 / 预览"],["Ctrl + S","保存"],["Tab / Shift + Tab","整行缩进 / 反缩进"],["Ctrl + V","粘贴截图直接插图"],["Ctrl + /","打开本面板"]].map(([u,y])=>`<div class="k"><kbd>${u}</kbd><span>${y}</span></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;const g=u=>e.querySelector(u);r=Bt(e,"btn-theme");const T=g("#title"),k=g("#content"),B=g("#preview"),L=g("#body"),$=g("#splitter"),M=g("#pv-scroll"),C=g("#thumbs"),_=g("#save-state"),N=g("#stat-words"),X=g("#stat-read"),re=g("#stat-cursor"),V=g("#pv-meta"),Se=g("#draft-bar"),U=g("#outline"),O=g("#outline-list"),de=g("#side"),G=g("#help"),me=u=>{v=u,L.dataset.mode=u,localStorage.setItem(oa,u),e.querySelectorAll("#mode-switch button").forEach(y=>{y.classList.toggle("active",y.dataset.mode===u)}),g("#btn-eye").classList.toggle("on",u==="preview"),u==="preview"?We(!0):k.focus()};e.querySelectorAll("#mode-switch button").forEach(u=>{u.addEventListener("click",()=>me(u.dataset.mode))}),g("#btn-eye").addEventListener("click",()=>me(v==="edit"?"preview":"edit"));const Le=(u,y)=>{u.dataset.open=String(y),u===U&&g("#btn-outline").classList.toggle("on",y),u===de&&g("#btn-side").classList.toggle("on",y)};g("#btn-outline").addEventListener("click",()=>Le(U,U.dataset.open!=="true")),g("#btn-side").addEventListener("click",()=>Le(de,de.dataset.open!=="true")),e.querySelectorAll("[data-close]").forEach(u=>{u.addEventListener("click",()=>Le(u.dataset.close==="side"?de:U,!1))});const kt=g("#wr"),Ge=g("#btn-full"),pa=()=>{var u;document.fullscreenElement?document.exitFullscreen():(u=kt.requestFullscreen)==null||u.call(kt).catch(()=>S("当前环境不支持全屏","err"))};Ge.addEventListener("click",pa),document.addEventListener("fullscreenchange",()=>{const u=!!document.fullscreenElement;Ge.innerHTML=b(u?"compress":"expand",15),Ge.classList.toggle("on",u),Ge.title=u?"退出全屏":"全屏写作"},{signal:n.signal});function We(u=!1){window.clearTimeout(d);const y=()=>{if(i)return;const x=k.value;B.innerHTML=x.trim()?Kt(x):'<p class="muted">预览会显示在这里</p>';const E=B.querySelectorAll("h1,h2,h3,h4,p,li,pre,blockquote,table").length;V.textContent=`${E} 个段落`};u?y():d=window.setTimeout(y,140)}function Jt(){var z,I;const u=k.value,y=((z=u.match(/[\u3400-\u9fa5]/g))!=null?z:[]).length,x=((I=u.replace(/[\u3400-\u9fa5]/g," ").match(/[A-Za-z0-9_]+/g))!=null?I:[]).length,E=y+x;N.textContent=`${E.toLocaleString()} 字`,X.textContent=`约 ${Math.max(1,Math.round(E/400))} 分钟`}function Ee(){const u=k.selectionStart,y=k.value.slice(0,u),x=y.split(`
`).length,E=u-(y.lastIndexOf(`
`)+1)+1;re.textContent=`第 ${x} 行 · 第 ${E} 列`}function es(){window.clearTimeout(p),p=window.setTimeout(()=>{if(i)return;const u=ni(k.value);if(!u.length){O.innerHTML='<p class="muted">标题会出现在这里</p>';return}O.innerHTML=u.map((y,x)=>`<button class="ol-item lv${y.level}" data-i="${x}"><span>${m(y.text)}</span></button>`).join(""),O.querySelectorAll(".ol-item").forEach(y=>{y.addEventListener("click",()=>{const x=u[Number(y.dataset.i)];x&&ha(x.offset),window.innerWidth<1e3&&Le(U,!1)})})},260)}function ha(u){const y=getComputedStyle(k),x=parseFloat(y.paddingLeft)+parseFloat(y.paddingRight),E=document.createElement("div");E.style.cssText=["position:absolute","visibility:hidden","top:0","left:0",`width:${Math.max(80,k.clientWidth-x)}px`,`font:${y.font}`,`line-height:${y.lineHeight}`,`letter-spacing:${y.letterSpacing}`,"white-space:pre-wrap","overflow-wrap:break-word","word-break:break-word"].join(";");const z=k.value.lastIndexOf(`
`,u-1)+1;E.textContent=k.value.slice(0,z),document.body.appendChild(E);const I=E.getBoundingClientRect().height;E.remove(),k.scrollTop=Math.max(0,I-8),k.focus(),k.setSelectionRange(u,u),Ee()}const ma=()=>{try{const u=localStorage.getItem(o);return u?JSON.parse(u):null}catch{return null}},ts=()=>{var u,y,x,E,z,I;return{title:T.value,content:k.value,category:(y=(u=g("#category"))==null?void 0:u.value)!=null?y:"随笔",visibility:(E=(x=g("#visibility"))==null?void 0:x.value)!=null?E:"public",pinned:(I=(z=g("#pinned"))==null?void 0:z.checked)!=null?I:!1,cover:c,savedAt:Date.now()}},Qe=()=>{window.clearTimeout(l),_.textContent="未保存",_.classList.add("dirty"),l=window.setTimeout(()=>{if(i||h)return;localStorage.setItem(o,JSON.stringify(ts()));const u=new Date;_.textContent=`已存草稿 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")}`,_.classList.remove("dirty")},1200)},se=ma();if(se&&(se.content!==((us=s==null?void 0:s.content)!=null?us:"")||se.title!==((ps=s==null?void 0:s.title)!=null?ps:""))){const u=new Date(se.savedAt);g("#draft-text").textContent=`发现 ${u.getMonth()+1} 月 ${u.getDate()} 日 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")} 的草稿`,Se.hidden=!1,g("#draft-restore").addEventListener("click",()=>{T.value=se.title,k.value=se.content,g("#category").value=se.category||"随笔",g("#visibility").value=se.visibility||"public",g("#pinned").checked=!!se.pinned,c=se.cover||c,c&&ns(c),Se.hidden=!0,yt(),We(!0),S("已恢复草稿","ok")}),g("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(o),Se.hidden=!0})}const yt=()=>{Jt(),Ee(),We(),es(),Qe()},Te=(u,y,x,E,z)=>{k.focus(),k.setSelectionRange(u,y);let I=!1;try{I=document.execCommand("insertText",!1,x)}catch{I=!1}I||k.setRangeText(x,u,y,"end"),k.setSelectionRange(E,z),yt()},Pe=(u,y=0,x=0)=>{const E=k.selectionStart,z=k.selectionEnd;Te(E,z,u,E+y,E+(x||u.length))},Ke=(u,y,x)=>{const E=k.selectionStart,z=k.selectionEnd,I=k.value.slice(E,z)||x;Te(E,z,u+I+y,E+u.length,E+u.length+I.length)},ss=()=>{const u=k.selectionStart,y=k.selectionEnd,x=k.value.lastIndexOf(`
`,Math.max(0,u-1))+1,E=k.value.indexOf(`
`,y),z=E===-1?k.value.length:E;return{lineStart:x,lineEnd:z}},ge=(u,y)=>{const{lineStart:x,lineEnd:E}=ss(),I=(k.value.slice(x,E)||y).split(`
`),Q=I.every(H=>H.startsWith(u)),Y=I.map(H=>Q?H.slice(u.length):u+H.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/,"")).join(`
`);Te(x,E,Y,x,x+Y.length)},W={h1:()=>ge("# ","一级标题"),h2:()=>ge("## ","二级标题"),h3:()=>ge("### ","三级标题"),bold:()=>Ke("**","**","加粗文字"),italic:()=>Ke("*","*","斜体文字"),strike:()=>Ke("~~","~~","删除线"),code:()=>Ke("`","`","code"),quote:()=>ge("> ","引用一段话"),ul:()=>ge("- ","列表项"),ol:()=>ge("1. ","列表项"),task:()=>ge("- [ ] ","待办事项"),codeblock:()=>Pe(`
${tt}
// code
${tt}
`,tt.length+2,tt.length+9),hr:()=>Pe(`
---
`),link:()=>{const u=k.value.slice(k.selectionStart,k.selectionEnd);Pe(`[${u||"链接文字"}](https://)`,u?u.length+3:1,u?u.length+11:5)},table:()=>Pe(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};g("#toolbar").addEventListener("click",u=>{var x,E;const y=u.target.closest("[data-cmd]");y&&(u.preventDefault(),(E=W[(x=y.dataset.cmd)!=null?x:""])==null||E.call(W))});const ga=/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/,ba=()=>{const u=k.selectionStart;if(u!==k.selectionEnd)return!1;const y=k.value.lastIndexOf(`
`,u-1)+1,x=k.value.slice(y,u),E=x.match(ga);if(!E)return!1;const[,z,I,Q]=E;if(!x.slice(E[0].length).trim())return Te(y,u,"",y,y),!0;let H=`
`+z;return/^\d+\.$/.test(I)?H+=`${parseInt(I,10)+1}. `:H+=I+" ",Q&&(H+="[ ] "),Te(u,u,H,u+H.length,u+H.length),!0},fa=u=>{var be;const{lineStart:y,lineEnd:x}=ss(),z=k.value.slice(y,x).split(`
`),I=z.map(le=>u?le.replace(/^ {1,2}|^\t/,""):"  "+le).join(`
`),Q=k.selectionStart===k.selectionEnd;let Y=y,H=y+I.length;if(Q){const le=k.selectionStart-y,ae=((be=z[0].match(/^ {1,2}|^\t/))!=null?be:[""])[0].length,Lt=u?Math.max(0,le-ae):le+2;Y=y+Lt,H=Y}Te(y,x,I,Y,H)};k.addEventListener("keydown",u=>{const y=u.metaKey||u.ctrlKey,x=u.key.toLowerCase();if(u.key==="Tab"){u.preventDefault(),fa(u.shiftKey);return}if(!y&&u.key==="Enter"&&!u.altKey&&!u.isComposing&&ba()){u.preventDefault();return}if(y){if(u.shiftKey){x==="c"?(u.preventDefault(),W.codeblock()):u.key==="8"||u.key==="*"?(u.preventDefault(),W.ul()):u.key==="7"||u.key==="&"?(u.preventDefault(),W.ol()):x==="q"?(u.preventDefault(),W.quote()):x==="e"?(u.preventDefault(),me("edit")):x==="s"?(u.preventDefault(),me("split")):x==="v"&&(u.preventDefault(),me("preview"));return}x==="b"?(u.preventDefault(),W.bold()):x==="i"?(u.preventDefault(),W.italic()):x==="k"?(u.preventDefault(),W.link()):x==="e"?(u.preventDefault(),W.code()):x==="s"?(u.preventDefault(),is()):x==="1"||x==="2"||x==="3"?(u.preventDefault(),W[`h${x}`]()):x==="/"&&(u.preventDefault(),He())}}),k.addEventListener("keyup",Ee),k.addEventListener("click",Ee),k.addEventListener("select",Ee),k.addEventListener("input",yt);let $t=!1;const as=(u,y)=>{if(v!=="split"||$t)return;$t=!0;const x=u.scrollHeight-u.clientHeight,E=x>0?u.scrollTop/x:0;y.scrollTop=E*(y.scrollHeight-y.clientHeight),requestAnimationFrame(()=>{$t=!1})};k.addEventListener("scroll",()=>as(k,M),{passive:!0}),M.addEventListener("scroll",()=>as(M,k),{passive:!0}),$.addEventListener("pointerdown",u=>{v!=="split"&&me("split"),u.preventDefault(),$.setPointerCapture(u.pointerId),$.classList.add("dragging"),document.body.classList.add("wr-resizing");const y=E=>{const z=L.getBoundingClientRect(),I=(E.clientX-z.left)/z.width*100,Q=Math.min(78,Math.max(22,I));w=Q,L.style.setProperty("--split",`${Q}%`)},x=()=>{$.classList.remove("dragging"),document.body.classList.remove("wr-resizing"),localStorage.setItem(At,String(Math.round(w))),$.removeEventListener("pointermove",y),$.removeEventListener("pointerup",x),$.removeEventListener("pointercancel",x)};$.addEventListener("pointermove",y),$.addEventListener("pointerup",x),$.addEventListener("pointercancel",x)}),$.addEventListener("dblclick",()=>{w=50,L.style.setProperty("--split","50%"),localStorage.setItem(At,"50")});const wt=new Set,xt=async(u,y="图片")=>{const x=u.filter(H=>H.type.startsWith("image/")?!0:(S("只能插入图片文件","err"),!1));if(!x.length)return;const E=new Array(x.length).fill(null);let z=0;const I=async()=>{for(;z<x.length;){const H=z++,be=x[H],le=`${be.name}-${be.size}`;if(!wt.has(le)){wt.add(le);try{const ae=await Ht(be);if(ae.size>Rs*1024*1024)throw new Error(`压缩后仍有 ${rt(ae.size)}，超过上限`);const{url:Lt}=await A.upload(ae.file);E[H]={url:Lt,name:(be.name||y).replace(/\.[^.]+$/,"")||y,note:ae.compressed?`已压缩 ${rt(ae.originalSize)} → ${rt(ae.size)}`:null}}catch(ae){S(ae.message,"err")}finally{wt.delete(le)}}}};S(x.length>1?`正在处理 ${x.length} 张…`:`正在处理 ${x[0].name||y}…`),await Promise.all([I(),I(),I()]);let Q=0;for(const H of E)H&&(f.push(H.url),Pe(`
![${H.name}](${H.url})
`),H.note&&Q++);C.innerHTML=f.map(H=>`<img src="${m(H)}" alt="">`).join("");const Y=E.filter(Boolean).length;Y&&S(Q?`${Y} 张已插入，其中 ${Q} 张经过压缩`:`${Y} 张图片已插入`,"ok")};k.addEventListener("paste",u=>{const y=u.clipboardData;if(!y)return;const x=Array.from(y.items).filter(E=>E.kind==="file"&&E.type.startsWith("image/")).map(E=>E.getAsFile()).filter(E=>!!E);x.length&&(u.preventDefault(),xt(x,"粘贴的图片"))});const Me=g("#pane-edit");Me.addEventListener("dragover",u=>{var y;(y=u.dataTransfer)!=null&&y.types.includes("Files")&&(u.preventDefault(),Me.classList.add("dropping"))}),Me.addEventListener("dragleave",()=>Me.classList.remove("dropping")),Me.addEventListener("drop",u=>{var x,E;const y=Array.from((E=(x=u.dataTransfer)==null?void 0:x.files)!=null?E:[]).filter(z=>z.type.startsWith("image/"));y.length&&(u.preventDefault(),Me.classList.remove("dropping"),xt(y))}),g("#img-input").addEventListener("change",async u=>{var E;const y=u.target,x=Array.from((E=y.files)!=null?E:[]);x.length&&await xt(x),y.value=""});const Xe=g("#cover-slot"),St=g("#cover-input"),ns=u=>{var y,x;(y=Xe.querySelector("img"))==null||y.remove(),(x=Xe.querySelector("span"))==null||x.remove(),Xe.insertAdjacentHTML("afterbegin",u?`<img src="${m(u)}" alt="">`:"<span>点击上传封面</span>")};Xe.addEventListener("click",()=>St.click()),St.addEventListener("change",async()=>{var y;const u=(y=St.files)==null?void 0:y[0];if(u)try{const x=await Ht(u),{url:E}=await A.upload(x.file);c=E,ns(E),Qe(),S("封面已更新","ok")}catch(x){S(x.message,"err")}});function He(u){const y=u!=null?u:G.hidden;G.hidden=!y}g("#btn-help").addEventListener("click",()=>He()),g("#help-close").addEventListener("click",()=>He(!1)),G.addEventListener("click",u=>{u.target===G&&He(!1)}),document.addEventListener("keydown",u=>{u.key==="Escape"&&(G.hidden?U.dataset.open==="true"?Le(U,!1):de.dataset.open==="true"&&Le(de,!1):He(!1))},{signal:n.signal}),T.addEventListener("input",Qe),e.querySelectorAll("#category,#visibility,#pinned").forEach(u=>u.addEventListener("change",Qe));const is=async()=>{const u={title:T.value.trim(),content:k.value,cover:c,category:g("#category").value.trim()||"随笔",visibility:g("#visibility").value,pinned:g("#pinned").checked,images:f};if(!u.title&&!u.content.trim()){S("写个标题或正文再发布","err");return}const y=g("#save-btn");y.disabled=!0,y.textContent="保存中…";try{const x=a?await A.updatePost(a,u):await A.createPost(u);h=!0,window.clearTimeout(l),localStorage.removeItem(o),S(a?"已保存":"已发布","ok"),location.hash=`#/post/${x.id}`}catch(x){S(x.message,"err"),y.disabled=!1,y.innerHTML=`${b("check",13)} ${a?"保存修改":"发布"}`}};g("#save-btn").addEventListener("click",()=>void is()),window.addEventListener("beforeunload",u=>{_.classList.contains("dirty")&&k.value.trim()&&(u.preventDefault(),u.returnValue="")},{signal:n.signal}),Jt(),Ee(),es(),We(!0),me(v),T.addEventListener("keydown",u=>{u.key==="Enter"&&(u.preventDefault(),k.focus(),k.setSelectionRange(0,0))}),window.innerWidth<1e3&&!(s!=null&&s.title)?T.focus():(k.focus(),k.setSelectionRange(k.value.length,k.value.length))}function ai(){const e=localStorage.getItem(oa);return e==="edit"||e==="split"||e==="preview"?e:window.innerWidth>=1e3?"split":"edit"}function ni(e){var n;const t=[],a=/^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;let s;for(;s=a.exec(e);)((n=e.slice(0,s.index).match(/^```/gm))!=null?n:[]).length%2!==1&&t.push({level:s[1].length,text:s[2].replace(/[*_`~]/g,""),offset:s.index});return t}async function ii(e,t){e.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${b("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const a=e.querySelector("#album-grid"),s=async()=>{const n=await A.albums(),r=n.albums.reduce((l,d)=>l+d.count,0),i=n.albums.filter(l=>l.privacy!=="public").length;e.querySelector("#album-sub").textContent=`${n.albums.length} 个相册 · 共 ${r} 张照片`+(i?` · ${i} 个未公开`:""),a.innerHTML=n.albums.length?n.albums.map(_a).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await s(),e.querySelector("#new-album").addEventListener("click",async()=>{await gt({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async n=>{const r=n.querySelector("#a-name").value.trim();return r?(await A.createAlbum({name:r,description:n.querySelector("#a-desc").value.trim(),privacy:n.querySelector("#a-priv").value}),S("相册已创建","ok"),await s(),!0):(S("请填写相册名称","err"),!1)}})})}const at={public:{label:"公开",desc:"出现在相册列表，所有人可看",icon:"globe"},unlisted:{label:"隐藏",desc:"不在列表出现，知道链接才能看",icon:"eyeoff"},private:{label:"仅自己",desc:"只有你登录后能看到",icon:"lock"}};async function ri(e,t){const a=Number(t.params.id);let s=await A.album(a);const n=()=>{var i,l,d,p,h;const r=(i=at[s.privacy])!=null?i:at.public;e.innerHTML=`<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${b("back",14)} 全部相册</a>
          <h1>${m(s.name)}</h1>
          <p class="page-sub">${m(s.description||"没有描述")} · ${s.count} 张 · ${he(s.at)}创建
            <span class="pill album-state ${s.privacy}">${b(r.icon,11)}${r.label}</span>
          </p>
        </div>
        ${s.canEdit?`<div class="head-btns">
                <button class="btn btn-ghost btn-sm" id="album-config">${b("settings",14)} 设置</button>
                <label class="btn btn-primary btn-sm" title="单张上限 30MB，超过会自动压缩">${b("upload",14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden>
                </label>
                <button class="btn btn-ghost btn-sm danger" id="del-album" title="删除相册">${b("trash",14)}</button>
              </div>`:""}
      </header>
      <div class="photo-grid" id="photo-grid">
        ${(l=s.photos)!=null&&l.length?s.photos.map(c=>`<figure class="photo" data-pid="${c.id}">
                    <img src="${m(mt(c.url,480))}" alt="${m(c.caption)}" loading="lazy" decoding="async" width="${c.width||800}" height="${c.height||600}" data-zoom="${m(c.url)}">
                    <figcaption>
                      <span>${m(c.caption||he(c.at))}</span>
                      <span class="photo-like">${b("heart",12)} ${c.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${c.id}" title="赞">${b("heart",14)}</button>
                      ${s.canEdit?`<button class="photo-btn danger" data-del="${c.id}" title="删除">${b("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,bt(e),(d=e.querySelector("#album-config"))==null||d.addEventListener("click",async()=>{await gt({title:"相册设置",body:`<div class="modal-form">
          <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" value="${m(s.name)}"></label>
          <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" value="${m(s.description)}" placeholder="一句话说明"></label>
          <div class="field"><span>谁可以看到</span>
            <div class="vis-pick">
              ${Object.entries(at).map(([c,f])=>`<label class="vis-opt">
                    <input type="radio" name="vis" value="${c}" ${s.privacy===c?"checked":""}>
                    <span class="vis-ico">${b(f.icon,15)}</span>
                    <b>${f.label}</b>
                    <i>${f.desc}</i>
                  </label>`).join("")}
            </div>
          </div>
        </div>`,confirmText:"保存",onConfirm:async c=>{var v,w;const f=c.querySelector("#a-name").value.trim();if(!f)return S("请填写相册名称","err"),!1;const o=(w=(v=c.querySelector("input[name=vis]:checked"))==null?void 0:v.value)!=null?w:s.privacy;return s=await A.updateAlbum(s.id,{name:f,description:c.querySelector("#a-desc").value.trim(),privacy:o}),S(o==="public"?"已设为公开":`已设为${at[o].label}`,"ok"),n(),!0}})}),(p=e.querySelector("#photo-file"))==null||p.addEventListener("change",async c=>{var v;const f=c.target,o=Array.from((v=f.files)!=null?v:[]);if(o.length){S(`正在处理 ${o.length} 张…`);try{const w=new Array(o.length).fill(null);let g=0;const T=async()=>{for(;g<o.length;){const C=g++,_=await Ht(o[C]),{url:N}=await A.upload(_.file);w[C]={url:N,size:_.size,w:_.width,h:_.height,saved:_.originalSize-_.size}}};await Promise.all([T(),T(),T()]);const k=[],B=[],L=[],$=[];let M=0;for(const C of w)C&&(k.push(C.url),B.push(C.size),L.push(C.w),$.push(C.h),M+=C.saved);s=await A.addPhotos(s.id,k,{sizes:B,widths:L,heights:$}),S(M>512*1024?`上传完成，压缩节省 ${rt(M)}`:"上传完成","ok"),n()}catch(w){S(w.message,"err")}finally{f.value=""}}}),(h=e.querySelector("#del-album"))==null||h.addEventListener("click",async()=>{if(await lt("删除相册",`《${s.name}》及其中 ${s.count} 张照片会一起删除。`))try{await A.deleteAlbum(s.id),S("相册已删除","ok"),location.hash="#/albums"}catch(c){S(c.message,"err")}}),e.querySelector("#photo-grid").addEventListener("click",async c=>{var w;const f=c.target,o=f.closest("[data-like]");if(o){c.stopPropagation();try{const g=await A.likePhoto(Number(o.dataset.like));o.classList.toggle("active",g.liked);const T=(w=o.closest(".photo"))==null?void 0:w.querySelector(".photo-like");T&&(T.innerHTML=`${b("heart",12)} ${g.count}`)}catch(g){S(g.message,"err")}return}const v=f.closest("[data-del]");if(v){if(c.stopPropagation(),!await lt("删除照片","确定从相册中删除这张照片吗？"))return;try{await A.deletePhoto(s.id,Number(v.dataset.del)),s=await A.album(s.id),n(),S("已删除","ok")}catch(g){S(g.message,"err")}}})};n()}async function li(e,t){const a=we(),s=t.params.uin||a.uin,n=s===a.uin,r=n?a:(await A.user(s)).user;e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${n?"来过的人，留下了这些话。":`给 ${m(r.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${ce(a.avatar,a.nickname,36)}
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
  </div>`;const i=e.querySelector("#gb-list"),l=e.querySelector("#gb-form textarea"),d=e.querySelector("#gb-count");l.addEventListener("input",()=>{d.textContent=`${l.value.length} / 500`});const p=c=>`<article class="gb-item card" data-gid="${c.id}">
      ${ce(c.author.avatar,c.author.nickname,40,c.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${m(c.author.uin)}">${m(c.author.nickname)}</a>
          <time>${he(c.at)}</time>
          <span class="spacer"></span>
          ${c.canEdit?`<button class="text-btn" data-reply="${c.id}">回复</button>`:""}
          ${c.canDel?`<button class="text-btn danger" data-del="${c.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${m(c.content)}</p>
        ${c.reply?`<div class="gb-reply"><b>${m(r.nickname)}：</b>${m(c.reply)}</div>`:""}
      </div>
    </article>`,h=async()=>{const c=await A.guestbook(s);i.innerHTML=c.entries.length?c.entries.map(p).join(""):`<div class="card empty"><div class="empty-mark">${b("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await h(),e.querySelector("#gb-form").addEventListener("submit",async c=>{c.preventDefault();const f=l.value.trim();if(f)try{await A.createGuestbook(s,f),l.value="",d.textContent="0 / 500",S("留言成功","ok"),await h()}catch(o){S(o.message,"err")}}),i.addEventListener("click",async c=>{const f=c.target,o=f.closest("[data-del]");if(o){if(!confirm("确定删除这条留言吗？"))return;try{await A.deleteGuestbook(Number(o.dataset.del)),await h(),S("已删除","ok")}catch(w){S(w.message,"err")}return}const v=f.closest("[data-reply]");if(v){const w=Number(v.dataset.reply);await gt({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async g=>{const T=g.querySelector("#reply-text").value.trim();return T?(await A.replyGuestbook(w,T),await h(),S("已回复","ok"),!0):(S("回复不能为空","err"),!1)}})}})}async function oi(e,t){const a=we(),s=t.params.uin?(await A.user(t.params.uin)).user:a;e.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${m(s.nickname)}</h1>
      <p class="page-sub">${m(s.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${s.bio?Kt(s.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
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
  </div>`,s.uin!==a.uin&&A.visit(s.uin,"关于").catch(()=>S("足迹记录失败","err"))}async function ci(e,t){var d;const a=(d=t.params.uin)!=null?d:"",s=we();if(a===s.uin){location.hash="#/home";return}e.innerHTML=`<div class="page"><div class="card reading">正在打开 ${m(a)} 的空间…</div></div>`;const{user:n}=await A.user(a);A.visit(n.uin,"主页").catch(()=>{}),e.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${m(n.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ce(n.avatar,n.nickname,0)}</div>
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
    <div id="space-posts">${ot(2)}</div>
  </div>`,bt(e);const r=e.querySelector("#space-posts"),i=await A.posts({uin:n.uin,limit:10});if(!i.posts.length){r.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const l=i.posts[0];r.innerHTML=Fs(l)+`<div class="post-list">${i.posts.slice(1).map(ft).join("")}</div>`}const Is={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function di(e){return e.target.startsWith("post:")?`#/post/${e.target.split(":")[1]}`:e.target.startsWith("album:")?`#/album/${e.target.split(":")[1]}`:e.target==="guestbook"?"#/guestbook":e.target==="profile"?`#/u/${m(e.from.uin)}`:"#/home"}async function ui(e,t){e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${b("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const a=e.querySelector("#msg-list"),s=e.querySelector("#msg-sub"),n=async()=>{const r=await A.notifications();s.textContent=r.unread?`${r.unread} 条未读`:"全部已读",bs(r.unread),a.innerHTML=r.notifications.length?`<div class="card msg-list">${r.notifications.map(i=>{var d;const l=(d=Is[i.kind])!=null?d:Is.system;return`<a class="msg-row ${i.read?"":"unread"}" href="${di(i)}">
              <span class="msg-icon ${l.cls}">${b(l.icon,16)}</span>
              <div class="msg-body">
                <div class="msg-line">
                  ${ce(i.from.avatar,i.from.nickname,20,i.from.uin)}
                  <b>${m(i.from.nickname)}</b>
                  <span>${m(i.text)}</span>
                </div>
                <time>${he(i.at)} · ${l.label}</time>
              </div>
              ${i.read?"":'<i class="msg-dot"></i>'}
            </a>`}).join("")}</div>`:`<div class="card empty"><div class="empty-mark">${b("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await n(),e.querySelector("#read-all").addEventListener("click",async()=>{try{const r=await A.readNotifications([]);bs(r.unread),S("已全部标为已读","ok"),await n()}catch(r){S(r.message,"err")}})}const pi=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function hi(e,t){const a=we(),s=t.params.tab==="out"?"out":"in";e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${b("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${pi.map(i=>`<button class="seg-btn ${i.key===s?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,e.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/visitors?tab=${i.dataset.tab}`})});const n=e.querySelector("#visit-list"),r=await A.visitors(a.uin,s);e.querySelector("#visit-sub").textContent=s==="in"?`累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人`:`你最近访问了 ${r.visitors.length} 个空间`,n.innerHTML=r.visitors.length?`<div class="card visit-list">${r.visitors.map(i=>`<a class="visit-row" href="#/u/${m(i.author.uin)}">
            ${ce(i.author.avatar,i.author.nickname,40,i.author.uin)}
            <div class="visit-main">
              <b>${m(i.author.nickname)}</b>
              <span>${s==="in"?"看了":"访问了"} · ${m(i.module)}</span>
            </div>
            <time>${he(i.at)}</time>
          </a>`).join("")}</div>`:Aa(s==="in"?"还没有人来过":"还没有访问记录",s==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>')}const mi=[{key:"pop",label:"华语流行",desc:"耳熟能详的旋律，适合当背景"},{key:"folk",label:"民谣",desc:"吉他与故事，安静的下午"},{key:"guofeng",label:"国风",desc:"古筝、琵琶与戏腔"},{key:"chill",label:"治愈纯音",desc:"钢琴与自然声，写东西时听"},{key:"rock",label:"摇滚现场",desc:"有点力气，适合深夜"},{key:"easy",label:"轻快小调",desc:"轻电子与夏日感"}],gi="音源：QQ 音乐试听 · 版权归原权利方，仅供个人非商业试听";function bi(e){if(!Number.isFinite(e)||e<=0)return"--:--";const t=Math.floor(e/60),a=Math.round(e%60);return`${t}:${String(a).padStart(2,"0")}`}const fi=[{id:"light",name:"浅色",icon:"sun"},{id:"dark",name:"深色",icon:"moon"},{id:"auto",name:"跟随系统",icon:"monitor"}],vi=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function ki(e,t){var r;const a=t.params.tab||"profile",s=we();e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${vi.map(i=>`<button class="seg-btn ${i.key===a?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,e.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/settings?tab=${i.dataset.tab}`})});const n=e.querySelector("#settings-body");if(a==="decorate"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${m(s.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">外观</h2>
      <p class="setting-hint">深色模式适合夜间写作；「跟随系统」会随设备的浅色 / 深色自动切换。这个偏好只保存在当前浏览器，不跟账号走。</p>
      <div class="theme-grid" id="appearance-grid">
        ${fi.map(i=>`<button class="theme-card ${Ra()===i.id?"active":""}" data-appearance="${i.id}">
            <span class="mode-swatch">${b(i.icon,14)}</span>
            <span>${i.name}</span>
          </button>`).join("")}
      </div>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${qt().map(i=>`<button class="theme-card ${s.theme===i.id?"active":""}" data-theme="${i.id}">
              <span class="theme-swatch" style="background:${i.accent}"></span>
              <span>${m(i.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,n.querySelector("#cover-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:p}=await A.upload(l),h=await A.updateProfile({cover:p});qe(h),n.querySelector("#cover-preview").style.backgroundImage=`url('${p}')`,S("封面已更新","ok")}catch(p){S(p.message,"err")}}),n.querySelectorAll("[data-appearance]").forEach(i=>{i.addEventListener("click",()=>{Bs(i.dataset.appearance),n.querySelectorAll("[data-appearance]").forEach(l=>l.classList.remove("active")),i.classList.add("active")})}),n.querySelectorAll("[data-theme]").forEach(i=>{i.addEventListener("click",async()=>{const l=i.dataset.theme;try{const d=await A.updateProfile({theme:l});qe(d),Hs(l),n.querySelectorAll("[data-theme]").forEach(p=>p.classList.remove("active")),i.classList.add("active"),S("主题已切换","ok")}catch(d){S(d.message,"err")}})});return}if(a==="music"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">在线华语曲库</h2>
      <p class="setting-hint">流行、民谣、国风、治愈纯音都有。点「试听」先听，满意再「设为背景」。</p>
      <div class="lib-tabs" id="lib-tabs"></div>
      <div class="lib-grid" id="music-online"><p class="muted">正在载入曲库…</p></div>
      <p class="lib-credit" id="lib-credit">${m(gi)}</p>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${j.isPlaying()?"spin":""}">${b("music",16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${m(s.bgmTitle||"还没有设置音轨")}</b>
          <span id="bgm-sub">${s.bgmUrl?"已保存，会在页面左下角循环播放":"从上面的曲库挑一首，或上传自己的音频"}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="preview-btn">${b("play",13)} 试听</button>
      </div>
      <label class="field">
        <span>显示名称</span>
        <input class="input" id="bgm-title" maxlength="60" value="${m(s.bgmTitle)}" placeholder="比如：理想三旬">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" id="save-bgm">保存设置</button>
        ${s.bgmUrl?'<button class="btn btn-ghost danger" id="clear-bgm">移除背景音乐</button>':""}
      </div>

      <details class="fold">
        <summary>内置合成曲目（无版权，断网也能放）</summary>
        <div class="music-library" id="music-builtin"><span class="muted">加载中…</span></div>
      </details>

      <details class="fold">
        <summary>上传本地音频 / 使用直链</summary>
        <p class="setting-hint">支持 MP3 / M4A / OGG / WAV / FLAC，单个文件不超过 50MB。</p>
        <label class="btn btn-ghost btn-sm">${b("upload",14)} 选择音频文件
          <input type="file" id="audio-file" accept="audio/*" hidden>
        </label>
        <div class="inline-form" style="margin-top:12px">
          <input class="input" id="bgm-url" placeholder="https://example.com/song.mp3">
          <button class="btn btn-primary btn-sm" id="bgm-url-save">使用</button>
        </div>
      </details>
    </section>`;let i=s.bgmUrl,l=s.bgmTitle;const d=$=>n.querySelector($),p=()=>{d("#bgm-name").textContent=l||"还没有设置音轨",d("#bgm-sub").textContent=i?"已选择，保存后生效":"从上面的曲库挑一首，或上传自己的音频";const $=d("#bgm-title");$.value||($.value=l)},h=($,M)=>{i=$,l=M,d("#bgm-title").value=M,p(),B()};let c=null,f="";const o=()=>{c&&(c.pause(),c.src="",c=null),f="",n.querySelectorAll(".lib-play").forEach($=>{$.classList.remove("on","loading"),$.innerHTML=b("play",12)})};window.addEventListener("hashchange",o,{once:!0});const v=$=>`
      <article class="lib-card${i===$.url?" picked":""}" data-id="${m($.id)}">
        ${$.cover?`<img class="lib-cover" src="${m($.cover)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:`<span class="lib-cover lib-cover-ph">${b("music",15)}</span>`}
        <div class="lib-main">
          <b>${m($.title)}</b>
          <span>${m($.artist||$.source||"曲库")} · ${bi($.duration)}</span>
        </div>
        <div class="lib-actions">
          <button class="btn btn-ghost btn-sm lib-play" data-play="${m($.url)}" data-key="${m($.id)}" aria-label="试听">${b("play",12)}</button>
          <button class="btn btn-soft btn-sm" data-pick="${m($.url)}" data-title="${m($.artist?`${$.title} - ${$.artist}`:$.title)}">设为背景</button>
        </div>
      </article>`;let w=mi,g=[],T="all";const k=()=>{const $=[{key:"all",label:"全部"},...w];d("#lib-tabs").innerHTML=$.map(M=>`<button class="lib-tab ${M.key===T?"on":""}" data-group="${M.key}">${m(M.label)}</button>`).join("")},B=()=>{const $=T==="all"?g:g.filter(M=>M.group===T);d("#music-online").innerHTML=$.length?$.map(v).join(""):'<p class="muted">这个分类暂时没有曲目，换一个看看。</p>'};d("#lib-tabs").addEventListener("click",$=>{const M=$.target.closest("[data-group]");M&&(T=M.dataset.group,o(),k(),B())}),(async()=>{var $,M;try{const C=await A.musicLibrary();g=C.online||[],($=C.groups)!=null&&$.length&&(w=C.groups),C.credit&&(d("#lib-credit").textContent=C.credit),k(),B(),d("#music-builtin").innerHTML=(M=C.tracks)!=null&&M.length?C.tracks.map(_=>v({..._,cover:void 0})).join(""):'<p class="muted">没有内置曲目</p>'}catch(C){d("#music-online").innerHTML=`<p class="muted">曲库加载失败：${m(C.message)}</p>`}})(),n.querySelector(".setting-card").addEventListener("click",$=>{var N;const M=$.target,C=M.closest(".lib-play");if(C){const X=C.dataset.play,re=(N=C.dataset.key)!=null?N:X;if(!X){S("演示站没有这首的播放地址","err");return}if(f===re&&c&&!c.paused){o();return}o();const V=new Audio(X);c=V,V.volume=.7,f=re,C.classList.add("loading"),C.innerHTML='<span class="lib-spin"></span>',V.addEventListener("ended",o,{once:!0}),V.addEventListener("playing",()=>{c===V&&(C.classList.remove("loading"),C.classList.add("on"),C.innerHTML=b("pause",12))},{once:!0}),V.addEventListener("error",()=>{o(),S("试听失败：音源暂时不可用，换一首或稍后再试","err")},{once:!0}),V.play().catch(()=>{o(),S("试听失败：音源暂时不可用，换一首或稍后再试","err")});return}const _=M.closest("[data-pick]");_&&(h(_.dataset.pick,_.dataset.title),S(`已选择《${_.dataset.title}》，记得点保存`,"ok"))});const L=d("#audio-file");L.addEventListener("change",async()=>{var M;const $=(M=L.files)==null?void 0:M[0];if($){if($.size>50*1024*1024){S("音频不能超过 50MB","err");return}S("正在上传音频…");try{const{url:C}=await A.uploadAudio($);h(C,$.name.replace(/\.[^.]+$/,"")),S("上传完成，点保存生效","ok")}catch(C){S(C.message,"err")}finally{L.value=""}}}),d("#bgm-url-save").addEventListener("click",()=>{var C;const M=d("#bgm-url").value.trim();if(!M){S("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/|\/api\/music\/stream)/.test(M)){S("地址需要以 http(s):// 或 /media/ 开头","err");return}h(M,((C=M.split("/").pop())==null?void 0:C.replace(/\.[^.]+$/,""))||"外部音频"),S("已填入，点保存生效","ok")}),d("#preview-btn").addEventListener("click",()=>{if(!i){S("还没有选择音轨","err");return}j.setTrack(i,l),j.toggle(),setTimeout(()=>{var $;return($=n.querySelector(".music-disc"))==null?void 0:$.classList.toggle("spin",j.isPlaying())},150)}),d("#save-bgm").addEventListener("click",async()=>{const $=d("#bgm-title").value.trim();try{const M=await A.updateProfile({bgmUrl:i,bgmTitle:$});qe(M),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:M.bgmUrl,bgmTitle:M.bgmTitle}})),i&&(j.setTrack(i,$||l),j.isPlaying()||j.toggle()),S("背景音乐已保存","ok")}catch(M){S(M.message,"err")}}),(r=d("#clear-bgm"))==null||r.addEventListener("click",async()=>{try{const $=await A.updateProfile({bgmUrl:"",bgmTitle:""});qe($),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),S("已移除背景音乐","ok"),await t.reload()}catch($){S($.message,"err")}});return}n.innerHTML=`<section class="card setting-card">
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
  </section>`,n.querySelector("#avatar-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:p}=await A.upload(l),h=await A.updateProfile({avatar:p});qe(h),n.querySelector("#avatar-preview").src=p,S("头像已更新","ok")}catch(p){S(p.message,"err")}}),n.querySelector("#profile-form").addEventListener("submit",async i=>{var p,h,c,f,o;i.preventDefault();const l=new FormData(i.currentTarget),d=String((p=l.get("tags"))!=null?p:"").split(/[,，\s]+/).map(v=>v.trim()).filter(Boolean).slice(0,8);try{const v=await A.updateProfile({nickname:String((h=l.get("nickname"))!=null?h:"").trim(),city:String((c=l.get("city"))!=null?c:"").trim(),signature:String((f=l.get("signature"))!=null?f:"").trim(),bio:String((o=l.get("bio"))!=null?o:""),tags:d});qe(v),S("已保存","ok"),await t.reload()}catch(v){S(v.message,"err")}})}async function yi(e,t){const a=(t.params.q||"").trim();if(e.innerHTML=`<div class="page">
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
  </div>`,e.querySelector("#search-form").addEventListener("submit",n=>{var i;n.preventDefault();const r=String((i=new FormData(n.currentTarget).get("q"))!=null?i:"").trim();location.hash=r?`#/search?q=${encodeURIComponent(r)}`:"#/search"}),!a)return;const s=e.querySelector("#search-result");try{const n=await A.search(a);if(!(n.posts.length+n.users.length+n.albums.length)){s.innerHTML=`<div class="card empty"><div class="empty-mark">${b("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}s.innerHTML=`
      ${n.users.length?`<h2 class="result-title">用户 <span>${n.users.length}</span></h2>
             <div class="card user-list">${n.users.map(i=>`<a class="user-row" href="#/u/${m(i.uin)}">
                   <img src="${m(i.avatar)}" alt="" loading="lazy" decoding="async">
                   <div><b>${m(i.nickname)}</b><span>@${m(i.uin)} · ${m(i.signature||"")}</span></div>
                   ${b("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${n.posts.length?`<h2 class="result-title">文章 <span>${n.posts.length}</span></h2>
             <div class="post-list card">${n.posts.map(ft).join("")}</div>`:""}
      ${n.albums.length?`<h2 class="result-title">相册 <span>${n.albums.length}</span></h2>
             <div class="album-grid">${n.albums.map(i=>`<a class="album-card card" href="#/album/${i.id}">
                   <div class="album-cover">${i.cover?`<img src="${m(i.cover)}" alt="" loading="lazy" decoding="async">`:""}</div>
                   <div class="album-info"><h3>${m(i.name)}</h3><p>${i.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(n){S(n.message,"err")}}const ca=document.getElementById("app"),$i=[{pattern:/^\/home$/,nav:"home",render:Da},{pattern:/^\/posts$/,nav:"posts",render:Oa},{pattern:/^\/post\/(\d+)$/,nav:"posts",render:Jn},{pattern:/^\/write$/,nav:"",render:zs},{pattern:/^\/edit\/(\d+)$/,nav:"",render:zs},{pattern:/^\/albums$/,nav:"albums",render:ii},{pattern:/^\/album\/(\d+)$/,nav:"albums",render:ri},{pattern:/^\/guestbook$/,nav:"guestbook",render:li},{pattern:/^\/about$/,nav:"about",render:oi},{pattern:/^\/u\/([^/]+)$/,nav:"",render:ci},{pattern:/^\/messages$/,nav:"",render:ui},{pattern:/^\/visitors$/,nav:"",render:hi},{pattern:/^\/settings$/,nav:"",render:ki},{pattern:/^\/search$/,nav:"",render:yi}];let Xt=!1,Be=!1,pt=0;function wi(){let e=document.getElementById("route-bar");return e||(e=document.createElement("i"),e.id="route-bar",document.body.appendChild(e)),e.className="",window.clearTimeout(pt),pt=window.setTimeout(()=>{e&&e.className===""&&(e.className="on")},150),e}function xi(e){if(window.clearTimeout(pt),e.className!=="on"){e.className="";return}e.className="done",pt=window.setTimeout(()=>{e.className==="done"&&(e.className="")},320)}function Si(){const e=location.hash.replace(/^#/,"")||"/home",[t,a=""]=e.split("?");return{path:t.startsWith("/")?t:`/${t}`,query:new URLSearchParams(a)}}function Li(e){var t;for(const a of $i){const s=e.match(a.pattern);if(s)return{def:a,id:(t=s[1])!=null?t:""}}return null}async function da(){var e,t;try{const a=await A.session();return!a.authenticated||!a.user?!1:(Sa({me:a.user,themes:(e=a.themes)!=null?e:[],unread:(t=a.unread)!=null?t:0}),Hs(a.user.theme),!0)}catch{return!1}}function Yt(){Xt=!1,ne.boot=null,document.body.classList.remove("signed-in"),j.unmount(),Pa(ca,async()=>{await da()&&ua()})}function Oe(e,t,a){return`<a class="nav-link" data-nav="${t}" href="${e}">${a}</a>`}function ua(){const e=we();document.body.classList.add("signed-in"),ca.innerHTML=`
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${b("pen",15)}</span>
        <span class="brand-text">${m(e.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${Oe("#/home","home","首页")}
        ${Oe("#/posts","posts","文章")}
        ${Oe("#/albums","albums","相册")}
        ${Oe("#/guestbook","guestbook","留言板")}
        ${Oe("#/about","about","关于")}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${b("search",15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${b("pen",14)}<span>写文章</span></a>
        ${Dt("theme-toggle",17)}
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${b("bell",18)}<i class="badge" data-unread ${gs()?"":"hidden"}>${gs()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${ce(e.avatar,e.nickname,32)}
          <div class="user-menu" id="user-menu" hidden>
            <div class="menu-head">
              <b>${m(e.nickname)}</b>
              <span>@${m(e.uin)}</span>
            </div>
            <a href="#/u/${m(e.uin)}">${b("grid",14)} 我的主页</a>
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
    <span>${m(e.nickname)} · 个人空间</span>
    <span class="foot-sep">·</span>
    <span>Go + ent + SQLite · TypeScript</span>
  </footer>`;const t=document.getElementById("head-search");t.addEventListener("submit",s=>{var r;s.preventDefault();const n=String((r=new FormData(t).get("q"))!=null?r:"").trim();n&&(location.hash=`#/search?q=${encodeURIComponent(n)}`)}),Bt(document,"theme-toggle");const a=document.getElementById("user-chip");a.addEventListener("click",s=>{s.target.closest("a,button")||(Be=!Be,document.getElementById("user-menu").hidden=!Be)}),document.addEventListener("click",s=>{!a.contains(s.target)&&Be&&(Be=!1,document.getElementById("user-menu").hidden=!0)}),document.getElementById("logout-btn").addEventListener("click",async()=>{await A.logout(),S("已退出登录"),Yt()}),Xt=!0,j.setTrack(e.bgmUrl,e.bgmTitle),j.mount(),ht()}let Ps=0;async function ht(){var i;if(!Xt)return;const e=document.getElementById("view");if(!e)return;const t=++Ps,{path:a,query:s}=Si(),n=Li(a);!a.startsWith("/write")&&!a.startsWith("/edit/")&&document.body.classList.remove("writer-mode"),document.querySelectorAll("[data-nav]").forEach(l=>{l.classList.toggle("active",l.dataset.nav===(n==null?void 0:n.def.nav))}),Ea();const r=wi();try{if(!n){e.innerHTML=`<div class="page narrow"><div class="card empty">
        <h2 class="empty-title">页面不存在</h2>
        <p class="empty-desc">这条链接可能已经失效。</p>
        <a class="btn btn-primary" href="#/home">回到首页</a>
      </div></div>`;return}const l={...Object.fromEntries(s)};n.id&&(l.id=n.id,n.def.pattern.source.includes("[^/]")&&(l.uin=n.id)),window.scrollTo({top:0});const d={params:l,reload:ht};if(await n.def.render(e,d),t!==Ps)return}catch(l){if(l instanceof je&&l.status===401)return;e.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${m(l.message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`,(i=e.querySelector("#retry"))==null||i.addEventListener("click",()=>void ht())}finally{xi(r)}}window.addEventListener("hashchange",()=>void ht());window.addEventListener("qz:expired",()=>Yt());(async function(){await da()?ua():Yt()})();window.addEventListener("qz:profile",e=>{const t=e.detail;t&&j.setTrack(t.bgmUrl,t.bgmTitle)});
