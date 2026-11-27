var fa=Object.defineProperty;var us=e=>{throw TypeError(e)};var va=(e,t,a)=>t in e?fa(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var C=(e,t,a)=>va(e,typeof t!="symbol"?t+"":t,a),ka=(e,t,a)=>t.has(e)||us("Cannot "+a);var ps=(e,t,a)=>t.has(e)?us("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a);var Ee=(e,t,a)=>(ka(e,t,"access private method"),a);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();class at extends Error{constructor(a,s){super(s);C(this,"status");this.status=a}}const nt=new Map,ya=15e3,$a=e=>/^\/api\/(posts|albums|guestbook|users|search|music\/library)/.test(e);function wa(){nt.clear()}async function Me(e,t={}){const a=!t.method||t.method==="GET",s=a&&$a(e);if(s){const h=nt.get(e);if(h&&Date.now()-h.at<ya)return h.data}const n=h=>{if(!a){nt.clear();return}s&&nt.set(e,{at:Date.now(),data:h})},r=new Headers(t.headers);t.body&&!(t.body instanceof FormData)&&r.set("Content-Type","application/json");let i;try{i=await fetch(e,{credentials:"include",...t,headers:r})}catch{throw new at(0,"网络连接失败，请检查服务是否已启动")}if(i.status===401)throw window.dispatchEvent(new CustomEvent("qz:expired")),new at(401,"登录状态已失效");const l=await i.text(),d=l?JSON.parse(l):{};if(!i.ok)throw new at(i.status,d.error||"请求失败");return n(d),d}const Z=e=>Me(e),j=(e,t)=>Me(e,{method:"POST",body:t===void 0?void 0:JSON.stringify(t)}),He=e=>Me(e,{method:"DELETE"}),xt=(e,t)=>Me(e,{method:"PATCH",body:JSON.stringify(t)}),T={register:(e,t,a)=>j("/api/auth/register",{uin:e,nickname:t,password:a}),login:(e,t)=>j("/api/auth/login",{uin:e,password:t}),logout:()=>(wa(),j("/api/auth/logout")),session:()=>Z("/api/auth/session"),bootstrap:()=>Z("/api/bootstrap"),user:e=>Z(`/api/users/${encodeURIComponent(e)}`),updateProfile:e=>xt("/api/users/me",e),signIn:()=>j("/api/users/me/signin"),visitors:(e,t="in")=>Z(`/api/users/${encodeURIComponent(e)}/visitors?mode=${t}`),visit:(e,t)=>j(`/api/users/${encodeURIComponent(e)}/visit`,{module:t}),posts:e=>{const t=new URLSearchParams;return Object.entries(e).forEach(([a,s])=>{s!==void 0&&s!==""&&t.set(a,String(s))}),Z(`/api/posts?${t}`)},createPost:e=>j("/api/posts",e),post:e=>Z(`/api/posts/${e}`),updatePost:(e,t)=>xt(`/api/posts/${e}`,t),deletePost:e=>He(`/api/posts/${e}`),likePost:e=>j(`/api/posts/${e}/like`),commentPost:(e,t,a)=>j(`/api/posts/${e}/comments`,{content:t,replyTo:a}),deleteComment:(e,t)=>He(`/api/posts/${e}/comments/${t}`),albums:e=>Z(`/api/albums${e?`?uin=${encodeURIComponent(e)}`:""}`),album:e=>Z(`/api/albums/${e}`),updateAlbum:(e,t)=>xt(`/api/albums/${e}`,t),createAlbum:e=>j("/api/albums",e),deleteAlbum:e=>He(`/api/albums/${e}`),addPhotos:(e,t,a)=>j(`/api/albums/${e}/photos`,{urls:t,caption:"",...a}),deletePhoto:(e,t)=>He(`/api/albums/${e}/photos/${t}`),likePhoto:e=>j(`/api/photos/${e}/like`),guestbook:e=>Z(`/api/guestbook${e?`?uin=${encodeURIComponent(e)}`:""}`),createGuestbook:(e,t)=>j("/api/guestbook",{owner:e,content:t}),deleteGuestbook:e=>He(`/api/guestbook/${e}`),replyGuestbook:(e,t)=>j(`/api/guestbook/${e}/reply`,{reply:t}),notifications:()=>Z("/api/notifications"),readNotifications:(e=[])=>j("/api/notifications/read",{ids:e}),musicLibrary:()=>Z("/api/music/library"),search:e=>Z(`/api/search?q=${encodeURIComponent(e)}`),upload:async e=>{const t=new FormData;return t.append("file",e),Me("/api/upload",{method:"POST",body:t})},uploadAudio:async e=>{const t=new FormData;return t.append("file",e),Me("/api/upload/audio",{method:"POST",body:t})}},J={boot:null};function ve(){if(!J.boot)throw new Error("尚未初始化");return J.boot.me}function xa(e){J.boot=e}function Te(e){J.boot&&(J.boot.me=e)}function Tt(){var e,t;return(t=(e=J.boot)==null?void 0:e.themes)!=null?t:[]}function hs(){var e,t;return(t=(e=J.boot)==null?void 0:e.unread)!=null?t:0}function ms(e){J.boot&&(J.boot.unread=e),document.querySelectorAll("[data-unread]").forEach(t=>{t.textContent=e>99?"99+":String(e),t.hidden=e===0})}function zs(e){var a,s;const t=(a=Tt().find(n=>n.id===e))!=null?a:Tt()[0];document.documentElement.dataset.theme=(s=t==null?void 0:t.id)!=null?s:"aurora",t&&document.documentElement.style.setProperty("--theme-accent",t.accent)}let Mt=new AbortController;function Sa(){return Mt.signal}function La(){Mt.abort(),Mt=new AbortController}function g(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const le=e=>String(e).padStart(2,"0");function oe(e){const t=new Date(e).getTime(),a=Date.now()-t,s=6e4;if(a<s)return"刚刚";if(a<60*s)return`${Math.floor(a/s)} 分钟前`;const n=new Date(t),r=new Date;if(n.toDateString()===r.toDateString())return`今天 ${le(n.getHours())}:${le(n.getMinutes())}`;const i=new Date(Date.now()-864e5);return n.toDateString()===i.toDateString()?`昨天 ${le(n.getHours())}:${le(n.getMinutes())}`:n.getFullYear()===r.getFullYear()?`${n.getMonth()+1} 月 ${n.getDate()} 日`:`${n.getFullYear()} 年 ${n.getMonth()+1} 月 ${n.getDate()} 日`}function gs(e){const t=new Date(e);return`${t.getFullYear()}-${le(t.getMonth()+1)}-${le(t.getDate())} ${le(t.getHours())}:${le(t.getMinutes())}`}const Ea={pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',message:'<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',eyeoff:'<path d="M4 4l16 16"/><path d="M9.6 5.9A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.3 3.9"/><path d="M6.7 7.6A17 17 0 0 0 2.5 12S6 18.5 12 18.5a9.8 9.8 0 0 0 3.7-.7"/><path d="M9.9 10a3 3 0 0 0 4.2 4.2"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',music:'<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',bell:'<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chevron:'<path d="M9 6l6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',star:'<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',logout:'<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',tag:'<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',pin:'<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',moon:'<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2z"/>',monitor:'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9 20.5h6M12 17v3.5"/>',grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',listOl:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',table:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',codeInline:'<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',codeBlock:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>',expand:'<path d="M9 4.5H4.5V9M15 4.5h4.5V9M15 19.5h4.5V15M9 19.5H4.5V15"/>',compress:'<path d="M4.5 9H9V4.5M19.5 9H15V4.5M19.5 15H15v4.5M4.5 15H9v4.5"/>',outline:'<path d="M4 6h16M4 12h10.5M4 18h7"/>'};function b(e,t=16){var s;const a=(s=Ea[e])!=null?s:"";return`<svg class="ico" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}function ne(e,t,a=40,s="",n=0){const r=e?`<img src="${g(e)}" alt="${g(t)}" loading="lazy" decoding="async">`:`<span class="avatar-fallback">${g(t.slice(0,1))}</span>`,i=s?`href="#/u/${g(s)}"`:"",l=a>0?` style="width:${a}px;height:${a}px"`:"";return`<a class="avatar" ${i}${l}>${r}${n?`<i class="avatar-level">${n}</i>`:""}</a>`}function S(e,t="info"){let a=document.getElementById("toasts");a||(a=document.createElement("div"),a.id="toasts",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${t}`,s.textContent=e,a.appendChild(s),requestAnimationFrame(()=>s.classList.add("in")),setTimeout(()=>{s.classList.remove("in"),setTimeout(()=>s.remove(),280)},2600)}function ht(e){return new Promise(t=>{var r,i,l,d;const a=document.createElement("div");a.className="modal-mask",a.innerHTML=`
      <div class="modal ${e.wide?"modal-wide":""}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${g(e.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${b("close",18)}</button>
        </header>
        <div class="modal-body">${e.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${g((r=e.cancelText)!=null?r:"取消")}</button>
          <button class="btn btn-primary modal-ok">${g((i=e.confirmText)!=null?i:"确定")}</button>
        </footer>
      </div>`,document.body.appendChild(a),document.body.classList.add("no-scroll");const s=h=>{a.remove(),document.body.classList.remove("no-scroll"),t(h)};a.querySelector(".modal-x").addEventListener("click",()=>s(!1)),a.querySelector(".modal-cancel").addEventListener("click",()=>s(!1)),a.addEventListener("mousedown",h=>{h.target===a&&s(!1)});const n=a.querySelector(".modal-ok");n.addEventListener("click",async()=>{if(!e.onConfirm)return s(!0);n.disabled=!0;try{await e.onConfirm(a)!==!1&&s(!0)}catch(h){S(h.message,"err")}finally{n.disabled=!1}}),(l=e.onMount)==null||l.call(e,a),(d=a.querySelector("input, textarea"))==null||d.focus()})}async function rt(e,t,a="删除"){return ht({title:e,body:`<p class="confirm-text">${g(t)}</p>`,confirmText:a})}const bs=new WeakSet;function mt(e){bs.has(e)||(bs.add(e),e.addEventListener("click",t=>{const a=t.target;if(a.closest("button, a.album-card, .photo-tools"))return;const s=a.closest("[data-zoom]");if(!s)return;const n=Array.from(e.querySelectorAll("[data-zoom]")),r=n.map(l=>{var d,h,p;return{src:l.dataset.zoom||l.src,caption:l.getAttribute("alt")||((p=(h=(d=l.closest("figure"))==null?void 0:d.querySelector("figcaption"))==null?void 0:h.textContent)==null?void 0:p.trim())||""}}),i=Math.max(0,n.indexOf(s));Ta(r,i,s)}))}function Ta(e,t=0,a){var P;if(!e.length)return;(P=document.querySelector(".lx"))==null||P.remove();let s=Math.min(Math.max(t,0),e.length-1);const n=document.createElement("div");n.className="lx",n.innerHTML=`
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
    <div class="lx-strip"></div>`;const r=n.querySelector(".lx-img"),i=n.querySelector(".lx-stage"),l=n.querySelector(".lx-cap"),d=n.querySelector(".lx-count"),h=n.querySelector(".lx-strip"),p=n.querySelector(".lx-prev"),c=n.querySelector(".lx-next");e.length>1?h.innerHTML=e.map((L,A)=>`<button class="lx-thumb" data-i="${A}" aria-label="第 ${A+1} 张"><img src="${g(L.src)}" alt="" loading="lazy" decoding="async"></button>`).join(""):(h.remove(),p.remove(),c.remove());const f=()=>{const L=e[s];r.classList.remove("ready"),r.alt=L.caption||`图片 ${s+1}`,r.src=L.src,d.textContent=`${s+1} / ${e.length}`,l.textContent=L.caption||"",l.hidden=!L.caption,h.querySelectorAll(".lx-thumb").forEach((A,I)=>{A.classList.toggle("on",I===s),I===s&&A.scrollIntoView({block:"nearest",inline:"center"})}),[s-1,s+1].forEach(A=>{const I=(A+e.length)%e.length;I!==s&&(new Image().src=e[I].src)})},o=L=>{e.length<2||(s=(s+L+e.length)%e.length,f())};let k=!1;const $=()=>{k||(k=!0,n.classList.add("out"),window.removeEventListener("keydown",m),window.setTimeout(()=>{n.remove(),document.querySelector(".lx")||document.body.classList.remove("no-scroll")},160),a&&document.contains(a)&&a.focus({preventScroll:!0}))},m=L=>{L.key==="Escape"?(L.preventDefault(),$()):L.key==="ArrowLeft"?(L.preventDefault(),o(-1)):L.key==="ArrowRight"?(L.preventDefault(),o(1)):L.key==="Home"?(s=0,f()):L.key==="End"&&(s=e.length-1,f())};r.addEventListener("load",()=>r.classList.add("ready")),r.addEventListener("error",()=>r.classList.add("ready")),n.querySelector(".lx-close").addEventListener("click",$),p.addEventListener("click",L=>{L.stopPropagation(),o(-1)}),c.addEventListener("click",L=>{L.stopPropagation(),o(1)}),n.addEventListener("click",L=>{const A=L.target;(A===n||A===i)&&$()}),h.addEventListener("click",L=>{const A=L.target.closest(".lx-thumb");A&&(L.stopPropagation(),s=Number(A.dataset.i),f())});let x=0,v=0;n.addEventListener("touchstart",L=>{x=L.touches[0].clientX,v=L.touches[0].clientY},{passive:!0}),n.addEventListener("touchend",L=>{const A=L.changedTouches[0].clientX-x,I=L.changedTouches[0].clientY-v;Math.abs(A)>55&&Math.abs(A)>Math.abs(I)?o(A<0?1:-1):I>90&&Math.abs(I)>Math.abs(A)*1.4&&$()},{passive:!0}),document.body.appendChild(n),document.body.classList.add("no-scroll"),f(),window.addEventListener("keydown",m),n.querySelector(".lx-close").focus({preventScroll:!0})}function Ma(e,t="",a=""){return`<div class="empty">
    <div class="empty-mark">${b("book",22)}</div>
    <p class="empty-title">${g(e)}</p>
    ${t?`<p class="empty-desc">${g(t)}</p>`:""}
    ${a}
  </div>`}function lt(e=3){return Array.from({length:e}).map(()=>`<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`).join("")}class Aa{constructor(){C(this,"audio",null);C(this,"pill",null);C(this,"title","");C(this,"url","");C(this,"armed",!1)}get want(){return localStorage.getItem("qz.bgm")!=="off"}get volume(){const t=Number(localStorage.getItem("qz.bgm.vol"));return Number.isFinite(t)&&t>0?Math.min(t,1):.55}setTrack(t,a){const s=t!==this.url;this.url=t,this.title=a||"未命名音轨",s&&(this.ensureAudio(),this.audio&&(this.audio.src=t,this.audio.volume=this.volume,this.audio.load())),this.render(),s&&t&&this.want&&this.arm()}ensureAudio(){if(this.audio)return;const t=new Audio;t.loop=!0,t.preload="metadata",t.volume=this.volume,t.addEventListener("play",()=>this.render()),t.addEventListener("pause",()=>this.render()),t.addEventListener("error",()=>{this.render(),this.url&&S("背景音乐加载失败，可能是格式不支持","err")}),this.audio=t}arm(){if(this.armed)return;this.armed=!0;const t=a=>{const s=a.target;s&&s.closest(".bgm")||(document.removeEventListener("pointerdown",t),document.removeEventListener("keydown",t),this.want&&this.audio&&this.audio.paused&&this.play())};document.addEventListener("pointerdown",t),document.addEventListener("keydown",t)}async play(){if(this.ensureAudio(),!(!this.audio||!this.url))try{await this.audio.play(),localStorage.setItem("qz.bgm","on")}catch{this.render()}}pause(){var t;(t=this.audio)==null||t.pause(),localStorage.setItem("qz.bgm","off"),this.render()}isPlaying(){return!!this.audio&&!this.audio.paused}toggle(){var t;if(!this.url){S("还没有设置背景音乐，可以在「设置」里上传","err");return}((t=this.audio)==null?void 0:t.paused)!==!1?this.play():this.pause()}setVolume(t){localStorage.setItem("qz.bgm.vol",String(t)),this.audio&&(this.audio.volume=t)}mount(){if(this.pill){this.render();return}const t=document.createElement("div");t.className="bgm",document.body.appendChild(t),this.pill=t,t.addEventListener("click",a=>{const s=a.target;if(s.closest("[data-bgm-toggle]")){this.toggle();return}s.closest(".bgm-meta")&&(location.hash="#/settings?tab=music")}),t.addEventListener("input",a=>{const s=a.target;s.matches(".bgm-vol")&&this.setVolume(Number(s.value))}),this.render(),this.url&&this.want&&this.arm()}unmount(){var t,a;(t=this.pill)==null||t.remove(),this.pill=null,(a=this.audio)==null||a.pause(),document.body.classList.remove("has-bgm")}render(){if(document.body.classList.toggle("has-bgm",!!this.url),!this.pill)return;const t=this.audio?!this.audio.paused:!1,a=Math.round(this.volume*100);window.dispatchEvent(new CustomEvent("qz:bgm",{detail:{playing:t}})),this.pill.innerHTML=`
      <div class="bgm-disc ${t?"spin":""}" data-bgm-toggle title="${t?"暂停":"播放"}">${b("music",16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${g(this.url?this.title:"未设置音轨")}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${t?"暂停":"播放"}">
        ${b(t?"pause":"play",14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${a}" aria-label="音量">
      <div class="bgm-wave ${t?"on":""}"><i></i><i></i><i></i><i></i></div>`}}const V=new Aa;window.bgm=V;const Is="qz.mode",Ps=window.matchMedia("(prefers-color-scheme: dark)"),At=new Set;function qa(){try{const e=localStorage.getItem(Is);return e==="dark"||e==="light"?e:"auto"}catch{return"auto"}}let Ae=qa();function Ca(){return Ae}function je(){return Ae==="dark"||Ae==="auto"&&Ps.matches}function It(){var a;const e=je(),t=document.documentElement;t.dataset.appearance=e?"dark":"light",t.style.colorScheme=e?"dark":"light",(a=document.querySelector('meta[name="theme-color"]'))==null||a.setAttribute("content",e?"#131412":"#f7f4ee"),At.forEach(s=>s())}function Hs(e){Ae=e;try{localStorage.setItem(Is,e)}catch{}It()}function Ra(){return Hs(je()?"light":"dark"),Ae}function za(e){return At.add(e),()=>At.delete(e)}Ps.addEventListener("change",()=>{Ae==="auto"&&It()});It();function Pt(e="theme-toggle",t=17,a="icon-btn"){return`<button class="${a} theme-toggle" id="${e}" title="${_s()}" aria-label="切换深色 / 浅色">${b(je()?"sun":"moon",t)}</button>`}function _s(){return je()?"切换到浅色":"切换到深色"}function Ht(e,t="theme-toggle"){const a=e.querySelector(`#${t}`);if(!a)return()=>{};const s=()=>{a.isConnected&&(a.innerHTML=b(je()?"sun":"moon",17),a.title=_s())};return a.addEventListener("click",()=>{Ra(),s()}),za(s)}function Ia(e,t){e.innerHTML=`
  <div class="auth">
    ${Pt("auth-theme",17)}
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
  </div>`,Ht(e,"auth-theme");const a=e.querySelector("#auth-form"),s=e.querySelector("#auth-submit"),n=e.querySelector("#auth-hint"),r=Array.from(e.querySelectorAll(".auth-tab"));let i="login";const l=d=>{i=d,r.forEach(p=>p.classList.toggle("active",p.dataset.tab===d)),e.querySelectorAll('[data-only="register"]').forEach(p=>{p.hidden=d!=="register"});const h=a.elements.namedItem("nickname");h.required=d==="register",s.textContent=d==="login"?"登录":"创建空间",n.textContent=d==="login"?"还没有账号？点上面的「注册」，30 秒就能开通。":"空间号将作为你的主页地址，注册后不可修改。"};r.forEach(d=>d.addEventListener("click",()=>l(d.dataset.tab))),e.querySelectorAll(".demo-chip").forEach(d=>{d.addEventListener("click",()=>{var h,p;l("login"),a.elements.namedItem("uin").value=(h=d.dataset.uin)!=null?h:"",a.elements.namedItem("password").value=(p=d.dataset.pw)!=null?p:"",s.focus()})}),a.addEventListener("submit",async d=>{var o,k,$;d.preventDefault();const h=new FormData(a),p=String((o=h.get("uin"))!=null?o:"").trim(),c=String((k=h.get("password"))!=null?k:""),f=String(($=h.get("nickname"))!=null?$:"").trim();if(i==="register"&&!f){S("请填写昵称","err");return}s.disabled=!0,s.textContent=i==="login"?"登录中…":"创建中…";try{i==="login"?await T.login(p,c):await T.register(p,f,c),S(i==="login"?"欢迎回来":"空间已开通","ok"),await t()}catch(m){S(g(m.message),"err"),s.disabled=!1,s.textContent=i==="login"?"登录":"创建空间"}})}const Pa={城市:30,技术:212,旅行:168,随笔:282,生活:8,摄影:196,读书:248,音乐:330};function Ds(e){var s;if(!e)return 40;const t=Pa[e];if(t!==void 0)return t;let a=0;for(const n of e)a=(a*31+((s=n.codePointAt(0))!=null?s:0))%360;return a}function Bs(e){return`<span class="pill cat" style="--cat:${Ds(e)}">${g(e)}</span>`}const Os={private:"仅自己可见",unlisted:"不公开列出",public:""};function js(e){const t=e.cover||e.images[0]||"";return`<article class="feature card${t?"":" no-cover"}" data-post="${e.id}">
    ${t?`<a class="feature-cover" href="#/post/${e.id}"><img src="${g(t)}" alt="${g(e.title)}" loading="lazy" decoding="async"></a>`:""}
    <div class="feature-body">
      <div class="post-kicker">
        ${e.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        ${Bs(e.category)}
        ${e.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${Os[e.visibility]}</span>`:""}
      </div>
      <h2 class="feature-title"><a href="#/post/${e.id}">${g(e.title||"无标题")}</a></h2>
      <p class="feature-summary">${g(e.summary)}</p>
      <div class="post-meta">
        <span>${oe(e.at)}</span>
        <span class="meta-dot">·</span>
        <span>${b("clock",12)} ${e.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${e.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${e.likeCount}</span>
      </div>
    </div>
  </article>`}function gt(e){const t=e.cover||e.images[0]||"";return`<article class="post-row" data-post="${e.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${e.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        ${Bs(e.category)}
        ${e.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${Os[e.visibility]}</span>`:""}
      </div>
      <h3 class="post-row-title"><a href="#/post/${e.id}">${g(e.title||"无标题")}</a></h3>
      <p class="post-row-summary">${g(e.summary)}</p>
      <div class="post-meta">
        <span>${oe(e.at)}</span>
        <span class="meta-dot">·</span>
        <span>${e.readingTime} 分钟</span>
        <span class="meta-dot">·</span>
        <span>${b("eye",12)} ${e.views}</span>
        <span class="meta-dot">·</span>
        <span>${b("heart",12)} ${e.likeCount}</span>
      </div>
    </div>
    ${t?`<a class="post-row-thumb" href="#/post/${e.id}"><img src="${g(t)}" alt="" loading="lazy" decoding="async"></a>`:""}
  </article>`}function fs(e){return e.length?`<ul class="comment-list">${e.map(t=>`<li class="comment" data-cid="${t.id}">
        ${ne(t.author.avatar,t.author.nickname,34,t.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${g(t.author.uin)}">${g(t.author.nickname)}</a>
            <time>${oe(t.at)}</time>
            <button class="text-btn" data-reply="${g(t.author.nickname)}">回复</button>
            ${t.canDel?`<button class="text-btn danger" data-del-comment="${t.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${t.replyTo?`<span class="comment-reply">回复 ${g(t.replyTo)}：</span>`:""}${g(t.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function Ha(e){const t=e.privacy==="public"?"":`<span class="album-vis">${b(e.privacy==="private"?"lock":"eyeoff",12)}${e.privacy==="private"?"仅自己":"隐藏"}</span>`;return`<a class="album-card card" href="#/album/${e.id}">
    <div class="album-cover">
      ${e.cover?`<img src="${g(e.cover)}" alt="${g(e.name)}" loading="lazy" decoding="async">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${e.count} 张</span>
      ${t}
      <span class="album-shade" aria-hidden="true"></span>
    </div>
    <div class="album-info">
      <h3>${g(e.name)}</h3>
      <p>${g(e.description||"还没有描述")}</p>
    </div>
  </a>`}async function _a(e,t){var r;const a=ve();e.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${g(a.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ne(a.avatar,a.nickname,0,"",0)}</div>
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
      <div class="home-main" id="home-main">${lt(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,mt(e);const s=e.querySelector("#home-main"),n=e.querySelector("#home-rail");try{const[{posts:i,total:l},d]=await Promise.all([T.posts({limit:7}),T.albums()]);if(!i.length)s.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const c=(r=i.find(o=>o.pinned))!=null?r:i[0],f=i.filter(o=>o.id!==c.id);s.innerHTML=`
        ${js(c)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${l} 篇 ${b("chevron",12)}</a>
        </div>
        <div class="post-list">${f.map(gt).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}n.innerHTML=`
      <section class="rail-card">
        <h3>关于我</h3>
        <p class="rail-bio">${g(a.bio?a.bio.split(`
`)[0].replace(/^#+\s*/,""):a.signature||"还没有写自我介绍。")}</p>
        <div class="tag-cloud">${a.tags.map(c=>`<a class="tag" href="#/search?q=${encodeURIComponent(c)}">${g(c)}</a>`).join("")||'<span class="muted">还没有标签</span>'}</div>
        <a class="rail-link" href="#/about">了解更多 ${b("chevron",12)}</a>
      </section>

      <section class="rail-card">
        <h3>背景音乐</h3>
        <div class="rail-music">
          <div class="rail-disc ${Ke()?"spin":""}">${b("music",16)}</div>
          <div class="rail-music-meta">
            <b>${g(a.bgmTitle||"未设置音轨")}</b>
            <span id="rail-music-state">${a.bgmUrl?Ke()?"正在循环播放":"已暂停 · 点下面的按钮继续":"去设置里挑一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${Ke()?b("pause",13):b("play",13)} ${Ke()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${d.albums.slice(0,3).map(c=>`<a class="rail-album" href="#/album/${c.id}">
                <img src="${g(c.cover)}" alt="" loading="lazy" decoding="async">
                <span>${g(c.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${b("mail",13)} 去留言</a>
      </section>`;const h=n.querySelector("#rail-play"),p=n.querySelector("#rail-music-state");window.addEventListener("qz:bgm",()=>{var f;if(!h||!h.isConnected)return;const c=V.isPlaying();(f=n.querySelector(".rail-disc"))==null||f.classList.toggle("spin",c),h.innerHTML=`${b(c?"pause":"play",13)} ${c?"暂停":"播放"}`,p&&(p.textContent=c?"正在循环播放":"已暂停 · 点下面的按钮继续")},{signal:Sa()}),h==null||h.addEventListener("click",()=>{V.toggle()})}catch(i){S(i.message,"err")}}function Ke(){return V.isPlaying()}const Da=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function Ba(e,t){const a=t.params.sort==="popular"?"popular":"latest",s=t.params.category||"全部",n=t.params.q||"";e.innerHTML=`<div class="page">
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
        ${Da.map(f=>`<button class="sort-btn ${f.key===a?"active":""}" data-sort="${f.key}">${f.label}</button>`).join("")}
      </div>
    </div>
    ${n?`<p class="search-note">搜索「${g(n)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${lt(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const r=e.querySelector("#archive-list"),i=e.querySelector("#load-more"),l=e.querySelector("#cat-row");let d,h=[];const p=()=>{const f=new Set(["全部"]);h.forEach(o=>o.category&&f.add(o.category)),l.innerHTML=Array.from(f).map(o=>`<button class="chip ${o===s?"active":""}" data-cat="${g(o)}">${g(o)}</button>`).join("")},c=async f=>{f&&(d=void 0,r.innerHTML=lt(2));const o=await T.posts({category:s,sort:a,q:n,limit:8,before:d});h=f?o.posts:h.concat(o.posts);const k=o.posts.map(gt).join("");f?r.innerHTML=k:r.insertAdjacentHTML("beforeend",k),o.posts.length&&(d=o.posts[o.posts.length-1].at),i.hidden=!o.hasMore,e.querySelector("#archive-sub").textContent=`共 ${o.total} 篇 · 按${a==="popular"?"阅读量":"时间"}排序`,p(),f&&!o.posts.length&&(r.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await c(!1)}catch(f){S(f.message,"err")}finally{i.disabled=!1}}),l.addEventListener("click",f=>{const o=f.target.closest("[data-cat]");if(!o)return;const k=new URLSearchParams;o.dataset.cat&&o.dataset.cat!=="全部"&&k.set("category",o.dataset.cat),a==="popular"&&k.set("sort","popular"),location.hash=`#/posts${k.toString()?"?"+k.toString():""}`}),e.querySelectorAll("[data-sort]").forEach(f=>{f.addEventListener("click",()=>{const o=new URLSearchParams;s!=="全部"&&o.set("category",s),f.dataset.sort==="popular"&&o.set("sort","popular"),location.hash=`#/posts${o.toString()?"?"+o.toString():""}`})});try{await c(!0)}catch(f){S(f.message,"err"),r.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}function _t(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ke=_t();function Ns(e){ke=e}var me={exec:()=>null};function pe(e){let t=[];return a=>{let s=Math.max(0,Math.min(3,a-1)),n=t[s];return n||(n=e(s),t[s]=n),n}}function M(e,t=""){let a=typeof e=="string"?e:e.source,s={replace:(n,r)=>{let i=typeof r=="string"?r:r.source;return i=i.replace(H.caret,"$1"),a=a.replace(n,i),s},getRegex:()=>new RegExp(a,t)};return s}var Us=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),Fs="^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)",H={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,textIndentedContinuation:/^(?:\n(?: {4}| {0,3}\t)[ \t]*[^ \t\n][^\n]*)+/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,blockquoteFenceOpen:/^ {0,3}(`{3,}(?=[^`]*$)|~{3,})/,blockquoteFenceClose:/^ {0,3}(`{3,}|~{3,})[ \t]*$/,blockquoteListItemStart:/^ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|$)/,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableHeader:new RegExp(Fs+"(?:\\n|$)"),tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:pe(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:pe(e=>new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:pe(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:pe(e=>new RegExp(`^ {0,${e}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:pe(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:pe(e=>new RegExp(`^ {0,${e}}(?:</?(?:${Bt})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:pe(e=>new RegExp(`^ {0,${e}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},Oa=/^(?:[ \t]*(?:\n|$))+/,ja=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Na=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*)[ \t]*(?=\n|$)|$)/,Ne=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ua=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Dt=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Bt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Ue=M(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",Bt).getRegex(),Zs=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,Vs=M(Zs).replace(/bull/g,Dt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,Ue).getRegex(),Fa=M(Zs).replace(/bull/g,Dt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,Ue).getRegex(),Ot=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Za=/^[^\n]+/,jt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,Va=M(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",jt).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),Ga=M(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Dt).getRegex(),Nt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Wa=M("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Nt).replace("tag",Bt).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),Gs=e=>M(Ot).replace("hr",Ne).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",e).replace("html",Ue).getRegex(),Qa=Gs(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Ka=Gs(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),vs=/ {0,3}> ?(?:(?!blank)(paragraph)|[^\n]*)(?:\n|$)/,Xa=M(/^(first)(?:next)*/).replace("first",M(vs).replace("blank",/[ \t]*(?:\n|$)| {4}/).getRegex()).replace("next",M(vs).replace("blank",/[ \t]*(?:\n|$)/).getRegex()).replace(/paragraph/g,Ka).getRegex(),Ut={blockquote:Xa,code:ja,def:Va,fences:Na,heading:Ua,hr:Ne,html:Wa,lheading:Vs,list:Ga,newline:Oa,paragraph:Qa,table:me,text:Za},Ya=M(Fs+"(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ne).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",Ue).getRegex(),Ja={...Ut,lheading:Fa,table:Ya,paragraph:M(Ot).replace("hr",Ne).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",H.tableHeader).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",Ue).getRegex()},en={...Ut,html:M(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",Nt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:me,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(Ot).replace("hr",Ne).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",Vs).getRegex()},tn=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,sn=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ws=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,an=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ee=/[\p{P}\p{S}]/u,Ce=/[\s\p{P}\p{S}]/u,Fe=/[^\s\p{P}\p{S}]/u,nn=M(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ce).getRegex(),rn=/[\p{Pi}\p{Ps}"']/u,Qs=/(?!~)[\p{P}\p{S}]/u,ln=/(?!~)[\s\p{P}\p{S}]/u,on=/(?:[^\s\p{P}\p{S}]|~)/u,cn=M(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Us?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Ks=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,dn=M(Ks,"u").replace(/punct/g,ee).getRegex(),un=M(Ks,"u").replace(/punct/g,Qs).getRegex(),pn=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,hn=M(pn,"u").replace(/openQuote/g,rn).replace(/punct/g,ee).getRegex(),Xs="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",mn=M(Xs,"gu").replace(/notPunctSpace/g,Fe).replace(/punctSpace/g,Ce).replace(/punct/g,ee).getRegex(),gn=M(Xs,"gu").replace(/notPunctSpace/g,on).replace(/punctSpace/g,ln).replace(/punct/g,Qs).getRegex(),bn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",fn=M(bn,"gu").replace(/notPunctSpace/g,Fe).replace(/punctSpace/g,Ce).replace(/punct/g,ee).getRegex(),vn=M("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Fe).replace(/punctSpace/g,Ce).replace(/punct/g,ee).getRegex(),kn="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",yn=M(kn,"gu").replace(/notPunctSpace/g,Fe).replace(/punctSpace/g,Ce).replace(/punct/g,ee).getRegex(),$n=M(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ee).getRegex(),wn="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",xn=M(wn,"gu").replace(/notPunctSpace/g,Fe).replace(/punctSpace/g,Ce).replace(/punct/g,ee).getRegex(),Sn=M(/\\(punct)/,"gu").replace(/punct/g,ee).getRegex(),Ln=M(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,ee).getRegex(),En=M(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Tn=M(Nt).replace("(?:-->|$)","-->").getRegex(),Mn=M("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Tn).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ys=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,ot=M(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Ys).getRegex(),bt=/\\[^ \t\n\x00-\x1f]|\\(?=[ \t\n])|[^ \t\n\x00-\x1f\\()]/,An=M(/\((?:char)*\)/).replace("char",bt).getRegex(),qn=M(/\((?:char|p1)*\)/).replace("char",bt).replace("p1",An).getRegex(),Cn=M(/\((?:char|p2)*\)/).replace("char",bt).replace("p2",qn).getRegex(),Rn=M(/(?!<)(?:char|p3)+/).replace("char",bt).replace("p3",Cn).getRegex(),zn=M(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",ot).replace("href",M(/<(?:\\.|[^\n<>\\])*>|bareHref|(?=\))/).replace("bareHref",Rn).getRegex()).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),In=M(/^!?\[(label)\]\[(ref)\]/).replace("label",ot).replace("ref",jt).getRegex(),Pn=M(/^!?\[(ref)\](?:\[\])?/).replace("ref",jt).getRegex(),ks=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,Hn=M(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Ys).getRegex(),_n=M("reflink|nolink(?!\\()","g").replace("reflink",M(/^!?\[(label)\]\[(ref)\]/).replace("label",Hn).replace("ref",ks).getRegex()).replace("nolink",M(/^!?\[(ref)\](?:\[\])?/).replace("ref",ks).getRegex()).getRegex(),ys=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Dn=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,Bn=M(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,Dn).getRegex(),Ft={_backpedal:me,anyPunctuation:Sn,anyPunctuationOutsideCode:Ln,autolink:En,blockSkip:cn,br:Ws,code:sn,del:me,delLDelim:me,delRDelim:me,emStrongLDelim:dn,emStrongRDelimAst:mn,emStrongRDelimUnd:vn,escape:tn,link:zn,nolink:Pn,punctuation:nn,reflink:In,reflinkSearch:_n,tag:Mn,text:an,url:me},On={...Ft,emStrongLDelim:hn,emStrongRDelimAst:fn,emStrongRDelimUnd:yn,link:M(/^!?\[(label)\]\((.*?)\)/).replace("label",ot).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ot).getRegex()},qt={...Ft,emStrongRDelimAst:gn,emStrongLDelim:un,delLDelim:$n,delRDelim:xn,url:M(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",Bn).replace("protocol",ys).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:M(/^(?:[A-Za-z0-9.+-]+(?=@)|[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",ys).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",Us?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},jn={...qt,br:M(Ws).replace("{2,}","*").getRegex(),text:M(qt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Xe={normal:Ut,gfm:Ja,pedantic:en},_e={normal:Ft,gfm:qt,breaks:jn,pedantic:On},Nn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},$s=e=>Nn[e];function N(e,t){if(t){if(H.escapeTest.test(e))return e.replace(H.escapeReplace,$s)}else if(H.escapeTestNoEncode.test(e))return e.replace(H.escapeReplaceNoEncode,$s);return e}function Un(e){return H.numericCharacterReference.test(e)?e.replace(H.numericCharacterReferenceOrAmpersand,(t,a,s)=>{if(a===void 0&&s===void 0)return"&amp;";let n=a===void 0?Number.parseInt(s,16):Number.parseInt(a,10);return n===0||n>1114111||n>=55296&&n<=57343?"�":n===38?"&amp;":String.fromCodePoint(n)}):e}function ws(e){try{e=encodeURI(e).replace(H.percentDecode,"%")}catch{return null}return e}function St(e,t){var r;let a=e.replace(H.findPipe,(i,l,d)=>{let h=!1,p=l;for(;--p>=0&&d[p]==="\\";)h=!h;return h?"|":" |"}),s=a.split(H.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!((r=s.at(-1))!=null&&r.trim())&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(H.slashPipe,"|");return s}function ae(e,t,a){let s=e.length;if(s===0)return"";let n=0;for(;n<s&&e.charAt(s-n-1)===t;)n++;return e.slice(0,s-n)}function xs(e){let t=e.split(`
`),a=t.length-1;for(;a>=0&&H.blankLine.test(t[a]);)a--;return t.length-a<=2?e:t.slice(0,a+1).join(`
`)}function ct(e){return e.trim().replace(H.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function Ss(e,t){if(e.indexOf(t[0])===-1&&e.indexOf(t[1])===-1)return-1;let a=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])a++;else if(e[s]===t[1]&&(a--,a<0))return s;return a>0?-2:-1}var qe=new WeakMap;function Zt(e){let t={"*":-1,_:-1},a=-1,s=e.length;for(let n=0;n<s;n++){let r=e[n];if(r!=="*"&&r!=="_"&&r!=="~")continue;let i=n===0?`
`:e[n-1],l=n+1;for(;l<s&&e[l]===r;)l++;i!==" "&&i!=="	"&&i!==`
`&&i!=="\r"&&i!=="\f"&&(r==="~"?a=n:t[r]=n),n=l-1}return{maskedSrc:e,lastPossibleEmStrongCloserIndex:t,lastPossibleDelCloserIndex:a}}function Fn(e,t){let a=Zt(t),s=qe.get(e);s?s.push(a):qe.set(e,[a])}function Zn(e){let t=qe.get(e);t&&(t.pop(),t.length===0&&qe.delete(e))}function Js(e,t,a){var n;let s=(n=qe.get(e))==null?void 0:n.at(-1);return s&&s.maskedSrc===t?s.lastPossibleEmStrongCloserIndex[a]:Zt(t).lastPossibleEmStrongCloserIndex[a]}function ea(e,t){var s;let a=(s=qe.get(e))==null?void 0:s.at(-1);return a&&a.maskedSrc===t?a.lastPossibleDelCloserIndex:Zt(t).lastPossibleDelCloserIndex}function Ye(e,t=0){let a=t,s="";for(let n of e)if(n==="	"){let r=4-a%4;s+=" ".repeat(r),a+=r}else s+=n,a++;return s}function Vn(e){let t,a=!1;return e.map(s=>{var h,p,c;if(a)return s;let{depth:n,expanded:r,keptIndent:i,content:l}=Gn(s,(h=t==null?void 0:t.depth)!=null?h:1/0);if((t==null?void 0:t.depth)!==n&&(t=void 0),t){let f=(p=H.blockquoteFenceClose.exec(l))==null?void 0:p[1];return!f||f[0]!==t.marker[0]||f.length<t.marker.length?i:(t=void 0,r)}if(a=H.blockquoteListItemStart.test(l),a)return s;let d=(c=H.blockquoteFenceOpen.exec(l))==null?void 0:c[1];return d&&(t={marker:d,depth:n}),r}).join(`
`)}function Gn(e,t){let a=0,s=0,n=0,r=0,i="";for(;n<t;){let p=a,c=s;for(;e[p]===" "||e[p]==="	";)c+=Ls(e[p],c),p++;if(e[p]!==">"||c-r>3)break;i+=" ".repeat(c-s)+">",n++,a=p+1,s=c+1,r=e[a]===" "||e[a]==="	"?s+1:s}if(n===0)return{depth:n,expanded:e,keptIndent:e,content:e};let l="",d="";for(;(e[a]===" "||e[a]==="	")&&s<r+4;){let p=Ls(e[a],s);l+=" ".repeat(p),d+=s<r&&p>1?" ".repeat(p):e[a],s+=p,a++}let h=e.slice(a);return{depth:n,expanded:i+l+h,keptIndent:i+d+h,content:" ".repeat(Math.max(0,s-r))+h}}function Ls(e,t){return e==="	"?4-t%4:1}function Wn(e,t){let a="";for(let s=0;s<e.length;s++){if(e[s]==="`"){let n=t.inline.code.exec(e.slice(s));if(n){a+=n[0],s+=n[0].length-1;continue}}if(e[s]==="\\"&&(e[s+1]==="["||e[s+1]==="]")){a+=e[s+1],s++;continue}a+=e[s]}return a}function Es(e,t,a,s,n){let r=t.href,i=t.title||null,l=Wn(e[1],n),d=e[0].charAt(0)==="!",h=s.state.inLink,p=s.state.linkEmitted,c=s.state.inRawBlock;s.state.inLink=!0,s.state.linkEmitted=!1;let f=s.inlineTokens(l),o=s.state.linkEmitted;if(s.state.linkEmitted=p,s.state.inLink=h,!d){if(o){s.state.inRawBlock=c;return}s.state.linkEmitted=!0}return{type:d?"image":"link",raw:a,href:r,title:i,text:l,tokens:f}}function Qn(e,t,a){let s=e.match(a.other.indentCodeCompensation);if(s===null)return t;let n=s[1];return t.split(`
`).map(r=>{let i=r.match(a.other.beginningSpace);if(i===null)return r;let[l]=i;return r.slice(Math.min(l.length,n.length))}).join(`
`)}function Ts(e,t,a,s){if(!t.includes("<"))return!1;for(let n=0;n<t.length;n++){if(t[n]==="\\"){n++;continue}if(t[n]==="`"){let l=s.inline.code.exec(t.slice(n));if(l){n+=l[0].length-1;continue}}if(t[n]!=="<")continue;let r=e.slice(a+n),i=s.inline.tag.exec(r)||s.inline.autolink.exec(r);if(i){if(i[0].length>t.length-n)return!0;n+=i[0].length-1}}return!1}var ge=class{constructor(e){C(this,"options");C(this,"rules");C(this,"lexer");this.options=e||ke}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let a=this.options.pedantic?t[0]:xs(t[0]),s=a.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:a,codeBlockStyle:"indented",text:s}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let a=t[0],s=Qn(a,t[3]||"",this.rules);return t[3]!==void 0&&(s===""||s.endsWith(`
`))&&(s+=`
`),{type:"code",raw:a,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let a=t[2].trim();if(this.rules.other.endingHash.test(a)){let s=ae(a,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(a=s.trim())}return{type:"heading",raw:ae(t[0],`
`),depth:t[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:ae(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let a=ae(t[0],`
`).split(`
`),s="",n="",r=[];for(;a.length>0;){let i=!1,l=[],d;for(d=0;d<a.length;d++)if(this.rules.other.blockquoteStart.test(a[d]))l.push(a[d]),i=!0;else if(!i)l.push(a[d]);else break;a=a.slice(d);let h=l.join(`
`),p=(this.lexer.state.top&&!this.lexer.state.inBlockquote&&h.includes("	")?Vn(l):h).replace(this.rules.other.blockquoteMarkerWhitespace,(k,$,m)=>m.startsWith(" ")?$+" "+m.slice(1):$+Ye(m,$.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${h}`:h,n=n?`${n}
${p}`:p;let c=this.lexer.state.top,f=this.lexer.state.inBlockquote;if(this.lexer.state.top=!0,this.lexer.state.inBlockquote=!0,this.lexer.blockTokens(p,r,!0),this.lexer.state.top=c,this.lexer.state.inBlockquote=f,a.length===0)break;let o=r.at(-1);if((o==null?void 0:o.type)==="code"||(o==null?void 0:o.type)==="heading"||(o==null?void 0:o.type)==="hr"||(o==null?void 0:o.type)==="html"||(o==null?void 0:o.type)==="table")break;if((o==null?void 0:o.type)==="blockquote"){let k=o,$=a.join(`
`),m=k.raw+`
`+$.replace(this.rules.other.blockquoteSetextReplace2,"");this.lexer.state.inBlockquote=!0;let x=this.blockquote(m);this.lexer.state.inBlockquote=f,r[r.length-1]=x;let v=m.substring(x.raw.length).replace(/^\n/,""),P=v?v.split(`
`).length:0,L=P?a.slice(0,-P):a;if(L.length>0&&(s=`${s}
${L.join(`
`)}`),n=n.substring(0,n.length-k.text.length)+x.text,a=a.slice(L.length),a.length>0&&this.rules.other.blockquoteStart.test(a[0]))continue;break}else if((o==null?void 0:o.type)==="list"){let k=o,$=k.raw+`
`+a.join(`
`),m=this.list($);r[r.length-1]=m;let x=m.raw.length>k.raw.length?$.slice(k.raw.length+1,m.raw.length).split(`
`).length:0;if(x>0){let v=a.slice(0,x).join(`
`);s=`${s}
${v}`,n=`${n}
${v}`}if(a=a.slice(x),a.length>0&&!this.rules.other.blockquoteStart.test(a[0]))break;continue}}return{type:"blockquote",raw:s,tokens:r,text:n}}}list(e){var a;let t=this.rules.block.list.exec(e);if(t){if(!this.options.pedantic&&((a=this.lexer.state.lastToken)==null?void 0:a.type)==="text"&&!this.rules.other.listInterruptsParagraph.test(e))return;let s=e,n=()=>s.length-e.length,r=t[1].trim(),i=r.length>1,l={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let d=this.rules.other.listItemRegex(r),h=!1;for(;e;){let f=!1,o="";if(!(t=d.exec(e))||this.rules.block.hr.test(e))break;let k=n();e=e.substring(t[0].length);let $=t[2].split(`
`,1)[0],m=t[1].length,x=this.options.pedantic?Ye($,m):$.replace(this.rules.other.leadingSpaceTab,I=>Ye(I,m)),v=e.split(`
`,1)[0],P=!x.trim(),L=0;if(this.options.pedantic?(L=2,o=x.trimStart()):P?L=m+1:(L=x.search(this.rules.other.nonSpaceChar),L=L>4?1:L,o=x.slice(L),L+=m),P&&this.rules.other.blankLine.test(v)&&(e=e.substring(v.length+1),f=!0),!f){let I=this.rules.other.nextBulletRegex(L),D=this.rules.other.hrRegex(L),G=this.rules.other.fencesBeginRegex(L),te=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(L):this.rules.other.headingBeginRegex(L),ce=this.rules.other.htmlBeginRegex(L),ye=this.rules.other.blockquoteBeginRegex(L),Re=!1;for(;e;){let $e=e.split(`
`,1)[0],B;if(v=$e,this.options.pedantic?(v=v.replace(this.rules.other.listReplaceNesting,"  "),B=v):B=v.replace(this.rules.other.leadingSpaceTab,_=>Ye(_)),G.test(v)||te.test(v)||ce.test(v)||ye.test(v)||I.test(v)||D.test(v))break;if(B.search(this.rules.other.nonSpaceChar)>=L||!v.trim())o+=`
`+B.slice(L),Re=!1;else{if(P)break;let _=x;if(!this.options.pedantic&&!o.includes(`
`)&&!x.includes("	")){let U;for(;!D.test(_)&&(U=this.rules.other.nestedBlockMarker.exec(_));)_=_.slice(U[0].length);if(!_.trim())break}if(_.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||G.test(_)||te.test(_)||ce.test(_)||D.test(_))break;if(!this.options.pedantic&&!Re){let U=x.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(U)||this.rules.block.heading.test(U)||this.rules.block.hr.test(U))break}let ie=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(v)&&this.rules.block.lheading.test(`${x}
${v}`)?`    ${B.replace(/^ {0,3}/,"")}`:v;o+=`
`+ie,Re=!0}P=!v.trim(),e=e.substring($e.length+1),x=B.slice(L)}}let A=s.slice(k,n());l.loose||(h?l.loose=!0:this.rules.other.doubleBlankLine.test(A)&&(h=!0)),l.items.push({type:"list_item",raw:A,task:!!this.options.gfm&&this.rules.other.listIsTask.test(o),loose:!1,text:o,tokens:[]})}let p=l.items.at(-1);if(p)p.raw=p.raw.trimEnd(),p.text=p.text.trimEnd();else return;l.raw=s.slice(0,n()).trimEnd();let c=[];for(let f of l.items)if(this.lexer.state.top=!1,c.push(this.lexer.inlineQueue.length),f.tokens=this.lexer.blockTokens(f.text,[]),!l.loose){let o=f.tokens.filter($=>$.type==="space"),k=o.length>0&&o.some($=>this.rules.other.anyLine.test($.raw));l.loose=k}for(let f=0;f<l.items.length;f++){let o=l.items[f],k=o.tokens[0];if(o.task&&((k==null?void 0:k.type)==="text"||(k==null?void 0:k.type)==="paragraph")){o.text=o.text.replace(this.rules.other.listReplaceTask,""),k.raw=k.raw.replace(this.rules.other.listReplaceTask,""),k.text=k.text.replace(this.rules.other.listReplaceTask,"");let $=this.lexer.inlineQueue;for(let x=c[f];x<$.length;x++)if($[x].tokens===k.tokens){$[x].src=$[x].src.replace(this.rules.other.listReplaceTask,"");break}let m=this.rules.other.listTaskCheckbox.exec(o.raw);if(m){let x={type:"checkbox",raw:m[0]+" ",checked:m[0]!=="[ ]"};o.checked=x.checked,l.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=x.raw+o.tokens[0].raw,o.tokens[0].text=x.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(x)):o.tokens.unshift({type:"paragraph",raw:x.raw,text:x.raw,tokens:[x]}):o.tokens.unshift(x)}}else o.task&&(o.task=!1)}if(l.loose)for(let f of l.items){f.loose=!0;for(let o of f.tokens)o.type==="text"&&(o.type="paragraph")}return l}}html(e){var a;let t=this.rules.block.html.exec(e);if(t){if(((a=this.lexer.state.lastToken)==null?void 0:a.type)==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(e))return;let s=xs(t[0]);return{type:"html",block:!0,raw:s,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:s}}}def(e){let t=this.rules.block.def.exec(e);if(t){if(!this.rules.other.startAngleBracket.test(t[2])&&Ss(t[2],"()")!==-1)return;let a=ct(t[1]),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:a,raw:ae(t[0],`
`),href:s,title:n}}}table(e){var i;let t,a;if(this.options.gfm&&!this.options.pedantic){let l=this.rules.other.tableHeader.exec(e);if(!l||!this.rules.other.tableDelimiter.test(l[2])||(t=St(l[1]),a=l[2].replace(this.rules.other.tableAlignChars,"").split("|"),t.length!==a.length))return}let s=this.rules.block.table.exec(e);if(!s||!this.rules.other.tableDelimiter.test(s[2]))return;t!=null||(t=St(s[1])),a!=null||(a=s[2].replace(this.rules.other.tableAlignChars,"").split("|"));let n=(i=s[3])!=null&&i.trim()?s[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:ae(s[0],`
`),header:[],align:[],rows:[]};if(t.length===a.length){for(let l of a)this.rules.other.tableAlignRight.test(l)?r.align.push("right"):this.rules.other.tableAlignCenter.test(l)?r.align.push("center"):this.rules.other.tableAlignLeft.test(l)?r.align.push("left"):r.align.push(null);for(let l=0;l<t.length;l++)r.header.push({text:t[l],tokens:this.lexer.inline(t[l]),header:!0,align:r.align[l]});for(let l of n)r.rows.push(St(l,r.header.length).map((d,h)=>({text:d,tokens:this.lexer.inline(d),header:!1,align:r.align[h]})));return r}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let a=t[1].trim();return{type:"heading",raw:ae(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:a,tokens:this.lexer.inline(a)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let a=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:a,tokens:this.lexer.inline(a)}}}text(e){let t=this.rules.block.text.exec(e);if(t){let a=t[0],s=t[0],n=this.rules.other.textIndentedContinuation.exec(e.slice(a.length));return n&&(a+=n[0],s+=n[0].replace(this.rules.other.codeRemoveIndent,"")),{type:"text",raw:a,text:s,tokens:this.lexer.inline(s)}}}escape(e){if(e.charCodeAt(0)!==92)return;let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){if(e.charCodeAt(0)!==60)return;let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){if(this.lexer.state.linkParenPossible===!1)return;let t=e.charCodeAt(0);if(t!==91&&t!==33)return;let a=this.rules.inline.link.exec(e);if(a){let s=a[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Ts(e,a[1],s,this.rules))return;let n=a[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let d=ae(n.slice(0,-1),"\\");if((n.length-d.length)%2===0)return}else{let d=Ss(a[2],"()");if(d===-2)return;if(d>-1){let h=(a[0].indexOf("!")===0?5:4)+a[1].length+d;a[2]=a[2].substring(0,d),a[0]=a[0].substring(0,h).trim(),a[3]=""}}let r=ae(a[0].slice(0,-1),"\\");if((a[0].length-r.length)%2===0)return;let i=a[2],l="";if(this.options.pedantic){let d=this.rules.other.pedanticHrefTitle.exec(i);d&&(i=d[1],l=d[3])}else l=a[3]?a[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),Es(a,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:l&&l.replace(this.rules.inline.anyPunctuation,"$1")},a[0],this.lexer,this.rules)}}reflink(e,t){let a=e.charCodeAt(0);if(a!==91&&a!==33)return;let s;if((s=this.rules.inline.reflink.exec(e))||(s=this.rules.inline.nolink.exec(e))){let n=s[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Ts(e,s[1],n,this.rules))return;let r=t[ct(s[2]||s[1])];if(!r){let i=s[0].charAt(0);return{type:"text",raw:i,text:i}}return Es(s,r,s[0],this.lexer,this.rules)}}emStrong(e,t,a=""){var f;let s=this.rules.inline.emStrongLDelim.exec(e);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4])return;let n=s[0][0],r=a===n,i=t.length-e.length,l=i;for(;!this.options.pedantic&&l>0&&t[l-1]===n;)l--;let d=(f=[...t.slice(Math.max(0,l-2),l)].at(-1))!=null?f:"",h=d==="*"||d==="_"||!!this.rules.inline.punctuation.exec(d);l<i&&(a=d);let p=l<i?h:a==="*"||a==="_"||!!this.rules.inline.punctuation.exec(a);if(s[4]&&a.match(this.rules.other.unicodeAlphaNumeric))return;let c=s[1]||s[3]||"";if(!c||!a||p){let o=[...s[0]].length-1,k,$,m=o,x=0,v=i-l+o,P=!this.options.pedantic&&!!d.trim()&&(!!c||n==="*"&&!h);if(n!=="*"&&n!=="_")return;let L=n==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,A=Js(this,t,n),I=t.length-e.length+o;if(A<I)return;t=t.slice(-1*e.length+o);let D=A-I;for(L.lastIndex=0;(s=L.exec(t))!==null&&!(s.index>D);){if(k=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!k)continue;if($=[...k].length,s[3]||s[4]){m+=$;continue}else if((s[5]||s[6]||P)&&v%3&&!((v+$)%3)){if(r&&(s[5]||s[6]))break;x+=$;continue}if(m-=$,m>0)continue;$=Math.min($,$+m+x);let G=[...s[0]][0].length,te=e.slice(0,o+s.index+G+$);if(Math.min(o,$)%2){let ye=te.slice(1,-1);return{type:"em",raw:te,text:ye,tokens:this.lexer.inlineTokens(ye)}}let ce=te.slice(2,-2);return{type:"strong",raw:te,text:ce,tokens:this.lexer.inlineTokens(ce)}}}}codespan(e){if(e.charCodeAt(0)!==96)return;let t=this.rules.inline.code.exec(e);if(t){let a=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return s&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:t[0],text:a}}}br(e){let t=e.charCodeAt(0);if(t!==32&&t!==92&&t!==10)return;let a=this.rules.inline.br.exec(e);if(a)return{type:"br",raw:a[0]}}del(e,t,a=""){if(e.charCodeAt(0)!==126)return;let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!a||this.rules.inline.punctuation.exec(a))){let n=[...s[0]].length-1,r,i,l=n,d=this.rules.inline.delRDelim,h=ea(this,t),p=t.length-e.length+n;if(h<p)return;t=t.slice(-1*e.length+n);let c=h-p;for(d.lastIndex=0;(s=d.exec(t))!==null&&!(s.index>c);){if(r=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!r||(i=[...r].length,i!==n))continue;if(s[3]||s[4]){l+=i;continue}if(l-=i,l>0)continue;i=Math.min(i,i+l);let f=[...s[0]][0].length,o=e.slice(0,n+s.index+f+i),k=o.slice(n,-n);return{type:"del",raw:o,text:k,tokens:this.lexer.inlineTokens(k)}}}}autolink(e){if(e.charCodeAt(0)!==60)return;let t=this.rules.inline.autolink.exec(e);if(t){let a,s;return t[2]==="@"?(a=t[1],s="mailto:"+a):(a=t[1],s=a),{type:"link",raw:t[0],text:a,href:s,autolink:!0,tokens:[{type:"text",raw:a,text:a}]}}}url(e){var a,s;let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else{let i;do i=t[0],t[0]=(s=(a=this.rules.inline._backpedal.exec(t[0]))==null?void 0:a[0])!=null?s:"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let a=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:a?t[0]:Un(t[0]),escaped:a}}}},K,ta,Ct,sa,aa,be,W=(be=class{constructor(t){ps(this,K);C(this,"tokens");C(this,"options");C(this,"state");C(this,"inlineQueue");C(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=t||ke,this.options.tokenizer=this.options.tokenizer||new ge,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0,inBlockquote:!1};let a={other:H,block:Xe.normal,inline:_e.normal};this.options.pedantic?(a.block=Xe.pedantic,a.inline=_e.pedantic):this.options.gfm&&(a.block=Xe.gfm,this.options.breaks?a.inline=_e.breaks:a.inline=_e.gfm),this.tokenizer.rules=a}static get rules(){return{block:Xe,inline:_e}}static lex(t,a){return new be(a).lex(t)}static lexInline(t,a){return new be(a).inlineTokens(t)}lex(t){t=t.replace(H.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let s=this.inlineQueue[a];this.state.inRawBlock=!1,this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,a=[],s=!1){var d,h,p;this.tokenizer.lexer=this;let n=this.state.lastToken;this.options.pedantic&&(t=t.replace(H.tabCharGlobal,"    ").replace(H.spaceLine,""));let r=1/0,i,l=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===ge.prototype.paragraph;for(;t;){if(t.length<r)r=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}this.state.lastToken=a.at(-1);let c;if((h=(d=this.options.extensions)==null?void 0:d.block)!=null&&h.some(o=>(c=o.call({lexer:this},t,a))?(t=t.substring(c.raw.length),a.push(c),!0):!1))continue;if(c=this.tokenizer.space(t)){t=t.substring(c.raw.length);let o=a.at(-1);c.raw.length===1&&o!==void 0?o.raw+=`
`:a.push(c);continue}if(c=this.tokenizer.code(t)){t=t.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.at(-1).src=o.text):a.push(c);continue}if(c=this.tokenizer.fences(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.heading(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.hr(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.blockquote(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.list(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.html(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.def(t)){t=t.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="paragraph"||(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.raw,this.inlineQueue.at(-1).src=o.text):(this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title}),a.push(c));continue}if(c=this.tokenizer.table(t)){t=t.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.lheading(t)){t=t.substring(c.raw.length),a.push(c);continue}let f=t;if((p=this.options.extensions)!=null&&p.startBlock){let o=1/0,k=t.slice(1),$;this.options.extensions.startBlock.forEach(m=>{$=m.call({lexer:this},k),typeof $=="number"&&$>=0&&(o=Math.min(o,$))}),o<1/0&&o>=0&&(f=t.substring(0,o+1))}if(this.state.top&&(c=this.tokenizer.paragraph(f))){let o=a.at(-1);(s||o===i&&l)&&(o==null?void 0:o.type)==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text,i=o):(a.push(c),i=c),s=f.length!==t.length,t=t.substring(c.raw.length);continue}if(c=this.tokenizer.text(t)){t=t.substring(c.raw.length);let o=a.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+c.raw,o.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):a.push(c);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=n,a}inline(t,a=[]){return this.inlineQueue.push({src:t,tokens:a}),a}linkInText(t){if(!t.includes("["))return!1;let a=this.tokenizer.rules.inline.link;for(let s of t.matchAll(this.tokenizer.rules.inline.blockSkip))if(a.test(s[0])&&t.charAt(s.index-1)!=="!")return!0;for(let s of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let n=s[0],r=n.lastIndexOf("[");if(!(n.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,ct(n.slice(r+1,-1))))&&!(r>1&&this.linkInText(n.slice(1,r-1))))return!0}return!1}inlineTokens(t,a=[]){this.tokenizer.lexer=this;let s=this.state.linkParenPossible;this.state.linkParenPossible=t.includes(")");try{return Ee(this,K,ta).call(this,t,a)}finally{this.state.linkParenPossible=s}}infiniteLoopError(t){let a="Infinite loop on byte: "+t;if(this.options.silent)console.error(a);else throw new Error(a)}},K=new WeakSet,ta=function(t,a){var r;let s=t.includes("*")||t.includes("_")||t.includes("~"),n=s||(r=this.options.hooks)!=null&&r.emStrongMask||this.tokenizer.emStrong!==ge.prototype.emStrong||this.tokenizer.del!==ge.prototype.del?Ee(this,K,aa).call(this,t):t;if(!s)return Ee(this,K,Ct).call(this,t,n,a);Fn(this.tokenizer,n);try{return Ee(this,K,Ct).call(this,t,n,a)}finally{Zn(this.tokenizer)}},Ct=function(t,a,s){var l,d,h;let n=!1,r="",i=1/0;for(;t;){if(t.length<i)i=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}n||(r=""),n=!1;let p;if((d=(l=this.options.extensions)==null?void 0:l.inline)!=null&&d.some(o=>(p=o.call({lexer:this},t,s))?(t=t.substring(p.raw.length),s.push(p),!0):!1))continue;if(p=this.tokenizer.escape(t)){t=t.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.tag(t)){t=t.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.link(t)){t=t.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(p.raw.length);let o=s.at(-1);p.type==="text"&&(o==null?void 0:o.type)==="text"?(o.raw+=p.raw,o.text+=p.text):s.push(p);continue}let c=t[0];if(c==="*"||c==="_"){let o=a.length-t.length;if(Js(this.tokenizer,a,c)<=o){let k=1;for(;k<t.length&&t.charCodeAt(k)===c.charCodeAt(0);)k++;let $=t.substring(0,k),m=s.at(-1);(m==null?void 0:m.type)==="text"&&!m.escaped?(m.raw+=$,m.text+=$):s.push({type:"text",raw:$,text:$,escaped:!1}),t=t.substring(k),r=c,n=!0;continue}}else if(c==="~"){let o=a.length-t.length;if(ea(this.tokenizer,a)<=o){let k=1;for(;k<t.length&&t.charCodeAt(k)===126;)k++;let $=t.substring(0,k),m=s.at(-1);(m==null?void 0:m.type)==="text"&&!m.escaped?(m.raw+=$,m.text+=$):s.push({type:"text",raw:$,text:$,escaped:!1}),t=t.substring(k),r=c,n=!0;continue}}if(p=this.tokenizer.emStrong(t,a,r)){t=t.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.codespan(t)){t=t.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.br(t)){t=t.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.del(t,a,r)){t=t.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.autolink(t)){t=t.substring(p.raw.length),s.push(p);continue}if(!this.state.inLink&&(p=this.tokenizer.url(t))){t=t.substring(p.raw.length),s.push(p);continue}let f=t;if((h=this.options.extensions)!=null&&h.startInline){let o=1/0,k=t.slice(1),$;this.options.extensions.startInline.forEach(m=>{$=m.call({lexer:this},k),typeof $=="number"&&$>=0&&(o=Math.min(o,$))}),o<1/0&&o>=0&&(f=t.substring(0,o+1))}if(p=this.tokenizer.inlineText(f)){t=t.substring(p.raw.length),p.raw.slice(-1)!=="_"&&(r=p.raw.slice(-1)),n=!0;let o=s.at(-1);(o==null?void 0:o.type)==="text"?(o.raw+=p.raw,o.text+=p.text):s.push(p);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return s},sa=function(t){let{blockSkip:a,tag:s,autolink:n}=this.tokenizer.rules.inline,r="",i=0,l;for(a.lastIndex=0;l=a.exec(t);){let d=l.index+(l[2]?l[2].length:0),h=l.index+l[0].length;if(t.charAt(d)==="<"){let p=t.slice(d),c=s.exec(p)||n.exec(p);if(!c){a.lastIndex=d+1;continue}h=d+c[0].length,a.lastIndex=h}r+=t.slice(i,d)+"["+"a".repeat(h-d-2)+"]",i=h}return r+t.slice(i)},aa=function(t){var s,n,r;let a=t;if(this.tokens.links&&t.includes("[")){let i=this.tokenizer.rules.inline.reflinkSearch,l=d=>{let h=d.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,ct(d.slice(h+1,-1))))return d;if(h>1&&d.charAt(0)!=="!"){let p=d.slice(1,h-1);if(this.linkInText(p))return"["+p.replace(i,l)+"]["+"a".repeat(d.length-h-2)+"]"}return"["+"a".repeat(d.length-2)+"]"};a=a.replace(i,l)}return a=a.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(i,l,d)=>d?"+".repeat(i.length):l?l+i.slice(l.length,-l.length).replace(/`/g,"+")+l:i),a=Ee(this,K,sa).call(this,a),a=(r=(n=(s=this.options.hooks)==null?void 0:s.emStrongMask)==null?void 0:n.call({lexer:this},a))!=null?r:a,a},be);function na(e){return e.map(t=>t.type==="codespan"||t.type==="escape"?{...t,text:N(t.text,!0)}:"tokens"in t&&t.tokens?{...t,tokens:na(t.tokens)}:t)}var dt=class{constructor(e){C(this,"options");C(this,"parser");this.options=e||ke}space(e){return""}code({text:e,lang:t,escaped:a}){var r;let s=(r=(t||"").match(H.notSpaceStart))==null?void 0:r[0],n=e?e.replace(H.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+N(s)+'">'+(a?n:N(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:N(n,!0))+`</code></pre>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${N(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,text:a,tokens:s,autolink:n}){let r=n?N(a,!0):this.parser.parseInline(s),i=ws(e);if(i===null)return r;e=N(i,n);let l='<a href="'+e+'"';return t&&(l+=' title="'+N(t)+'"'),l+=">"+r+"</a>",l}image({href:e,title:t,text:a,tokens:s}){s&&(a=this.parser.parseInline(na(s),this.parser.textRenderer));let n=ws(e);if(n===null)return N(a);e=n;let r=`<img src="${N(e)}" alt="${N(a)}"`;return t&&(r+=` title="${N(t)}"`),r+=">",r}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:N(e.text)}},Vt=class{constructor(){C(this,"parser")}strong({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}em({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}codespan({text:e}){return e}del({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}html({text:e}){return e}text({text:e}){return e}link({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}image({text:e,tokens:t}){return t?this.parser.parseInline(t,this):e}br(){return`
`}checkbox({raw:e}){return e}},Q=class Rt{constructor(t){C(this,"options");C(this,"renderer");C(this,"textRenderer");this.options=t||ke,this.options.renderer=this.options.renderer||new dt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Vt,this.textRenderer.parser=this}static parse(t,a){return new Rt(a).parse(t)}static parseInline(t,a){return new Rt(a).parseInline(t)}parse(t){var s;this.renderer.parser=this;let a="";for(let n=0;n<t.length;n++){let r=t[n],i=(s=this.options.extensions)==null?void 0:s.renderers;if(i&&Object.hasOwn(i,r.type)&&i[r.type]){let d=r,h=i[d.type].call({parser:this},d);if(h!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(d.type)){a+=h===!1?"":h!=null?h:"";continue}}let l=r;switch(l.type){case"space":{a+=this.renderer.space(l);break}case"hr":{a+=this.renderer.hr(l);break}case"heading":{a+=this.renderer.heading(l);break}case"code":{a+=this.renderer.code(l);break}case"table":{a+=this.renderer.table(l);break}case"blockquote":{a+=this.renderer.blockquote(l);break}case"list":{a+=this.renderer.list(l);break}case"checkbox":{a+=this.renderer.checkbox(l);break}case"html":{a+=this.renderer.html(l);break}case"def":{a+=this.renderer.def(l);break}case"paragraph":{a+=this.renderer.paragraph(l);break}case"text":{a+=this.renderer.text(l);break}default:{let d='Token with "'+l.type+'" type was not found.';if(this.options.silent)return console.error(d),"";throw new Error(d)}}}return a}parseInline(t,a=this.renderer){var n;this.renderer.parser=this;let s="";for(let r=0;r<t.length;r++){let i=t[r],l=(n=this.options.extensions)==null?void 0:n.renderers;if(l&&Object.hasOwn(l,i.type)&&l[i.type]){let h=l[i.type].call({parser:this},i);if(h!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){s+=h===!1?"":h!=null?h:"";continue}}let d=i;switch(d.type){case"escape":{s+=a.text(d);break}case"html":{s+=a.html(d);break}case"link":{s+=a.link(d);break}case"image":{s+=a.image(d);break}case"checkbox":{s+=a.checkbox(d);break}case"strong":{s+=a.strong(d);break}case"em":{s+=a.em(d);break}case"codespan":{s+=a.codespan(d);break}case"br":{s+=a.br(d);break}case"del":{s+=a.del(d);break}case"text":{s+=a.text(d);break}default:{let h='Token with "'+d.type+'" type was not found.';if(this.options.silent)return console.error(h),"";throw new Error(h)}}}return s}},st,Oe=(st=class{constructor(e){C(this,"options");C(this,"block");this.options=e||ke}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?W.lex:W.lexInline}provideParser(e=this.block){return e?Q.parse:Q.parseInline}},C(st,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),C(st,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),st);function re(e,t){if(Array.isArray(t))for(let a=0;a<t.length;a++)e.push(t[a]);else e.push(t)}var Kn=class{constructor(...e){C(this,"defaults",_t());C(this,"options",this.setOptions);C(this,"parse",this.parseMarkdown(!0));C(this,"parseInline",this.parseMarkdown(!1));C(this,"Parser",Q);C(this,"Renderer",dt);C(this,"TextRenderer",Vt);C(this,"Lexer",W);C(this,"Tokenizer",ge);C(this,"Hooks",Oe);this.use(...e)}walkTokens(e,t){var s,n;let a=[];for(let r of e)switch(re(a,t.call(this,r)),r.type){case"table":{let i=r;for(let l of i.header)re(a,this.walkTokens(l.tokens,t));for(let l of i.rows)for(let d of l)re(a,this.walkTokens(d.tokens,t));break}case"list":{let i=r;re(a,this.walkTokens(i.items,t));break}default:{let i=r;(n=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&n[i.type]?this.defaults.extensions.childTokens[i.type].forEach(l=>{if(i[l]){let d=i[l].flat(1/0);re(a,this.walkTokens(d,t))}}):i.tokens&&re(a,this.walkTokens(i.tokens,t))}}return a}use(...e){let t=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return e.forEach(a=>{let s={...a};if(s.async=this.defaults.async||s.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let r=t.renderers[n.name];r?t.renderers[n.name]=function(...i){let l=n.renderer.apply(this,i);return l===!1&&(l=r.apply(this,i)),l}:t.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let r=t[n.level];r?r.unshift(n.tokenizer):t[n.level]=[n.tokenizer],n.start&&(n.level==="block"?t.startBlock?t.startBlock.push(n.start):t.startBlock=[n.start]:n.level==="inline"&&(t.startInline?t.startInline.push(n.start):t.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(t.childTokens[n.name]=n.childTokens)}),s.extensions=t),a.renderer){let n=this.defaults.renderer||new dt(this.defaults);for(let r in a.renderer){if(!(r in n))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;let i=r,l=a.renderer[i],d=n[i];n[i]=(...h)=>{let p=l.apply(n,h);return p===!1&&(p=d.apply(n,h)),p===!1?"":p!=null?p:""}}s.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new ge(this.defaults);for(let r in a.tokenizer){if(!(r in n))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;let i=r,l=a.tokenizer[i],d=n[i];n[i]=(...h)=>{let p=l.apply(n,h);return p===!1&&(p=d.apply(n,h)),p}}s.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new Oe;for(let r in a.hooks){if(!(r in n))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;let i=r,l=a.hooks[i],d=n[i];Oe.passThroughHooks.has(r)?n[i]=h=>{if(n.options.async&&Oe.passThroughHooksRespectAsync.has(r))return(async()=>{let c=await l.call(n,h);return d.call(n,c)})();let p=l.call(n,h);return d.call(n,p)}:n[i]=(...h)=>{if(n.options.async)return(async()=>{let c=await l.apply(n,h);return c===!1&&(c=await d.apply(n,h)),c})();let p=l.apply(n,h);return p===!1&&(p=d.apply(n,h)),p}}s.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,r=a.walkTokens;s.walkTokens=function(i){let l=[];return re(l,r.call(this,i)),n&&re(l,n.call(this,i)),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return W.lex(e,t!=null?t:this.defaults)}parser(e,t){return Q.parse(e,t!=null?t:this.defaults)}parseMarkdown(e){return(t,a)=>{let s={...a},n={...this.defaults,...s},r=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return r(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=e),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(t):t,l=await(n.hooks?await n.hooks.provideLexer(e):e?W.lex:W.lexInline)(i,n),d=n.hooks?await n.hooks.processAllTokens(l):l;n.walkTokens&&await Promise.all(this.walkTokens(d,n.walkTokens));let h=await(n.hooks?await n.hooks.provideParser(e):e?Q.parse:Q.parseInline)(d,n);return n.hooks?await n.hooks.postprocess(h):h})().catch(r);try{n.hooks&&(t=n.hooks.preprocess(t));let i=(n.hooks?n.hooks.provideLexer(e):e?W.lex:W.lexInline)(t,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let l=(n.hooks?n.hooks.provideParser(e):e?Q.parse:Q.parseInline)(i,n);return n.hooks&&(l=n.hooks.postprocess(l)),l}catch(i){return r(i)}}}onError(e,t){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+N(a.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(a);throw a}}},fe=new Kn;function z(e,t){return fe.parse(e,t)}z.options=z.setOptions=function(e){return fe.setOptions(e),z.defaults=fe.defaults,Ns(z.defaults),z};z.getDefaults=_t;z.defaults=ke;function Xn(...e){return fe.use(...e),z.defaults=fe.defaults,Ns(z.defaults),z}z.use=Xn;z.walkTokens=function(e,t){return fe.walkTokens(e,t)};z.parseInline=fe.parseInline;z.Parser=Q;z.parser=Q.parse;z.Renderer=dt;z.TextRenderer=Vt;z.Lexer=W;z.lexer=W.lex;z.Tokenizer=ge;z.Hooks=Oe;z.parse=z;z.options;z.setOptions;z.walkTokens;z.parseInline;Q.parse;W.lex;z.setOptions({gfm:!0,breaks:!0});function Gt(e){if(!e)return"";const t=e.replace(/&/g,"&amp;").replace(/</g,"&lt;"),a=z.parse(t,{async:!1}),s=document.createElement("template");s.innerHTML=a;for(const n of Array.from(s.content.querySelectorAll("a"))){const r=(n.getAttribute("href")||"").trim();/^https?:\/\//i.test(r)?(n.setAttribute("target","_blank"),n.setAttribute("rel","noopener noreferrer")):/^(mailto:|#|\/)/i.test(r)||n.removeAttribute("href")}for(const n of Array.from(s.content.querySelectorAll("img"))){const r=(n.getAttribute("src")||"").trim();/^(https?:\/\/|\/|data:image\/)/i.test(r)||n.removeAttribute("src")}return s.innerHTML}async function Yn(e,t){var d,h,p;const a=Number(t.params.id);e.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const s=await T.post(a);e.innerHTML=`<div class="page narrow">
    <a class="back-link" href="#/posts">${b("back",14)} 返回文章列表</a>
    <article class="article">
      <header class="article-head">
        <div class="post-kicker">
          ${s.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
          <a class="pill cat" style="--cat:${Ds(s.category)}" href="#/posts?category=${encodeURIComponent(s.category)}">${g(s.category)}</a>
          ${s.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${s.visibility==="private"?"仅自己可见":"不公开列出"}</span>`:""}
        </div>
        <h1 class="article-title">${g(s.title||"无标题")}</h1>
        <div class="article-meta">
          ${ne(s.author.avatar,s.author.nickname,34,s.author.uin)}
          <div class="article-meta-text">
            <b>${g(s.author.nickname)}</b>
            <span>${gs(s.at)} · ${s.readingTime} 分钟阅读 · ${s.views} 次浏览</span>
          </div>
          ${s.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${s.id}">${b("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${b("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${s.cover&&!((d=s.content)!=null?d:"").includes(s.cover)?`<figure class="article-cover"><img src="${g(s.cover)}" alt="" decoding="async" data-zoom="${g(s.cover)}"></figure>`:""}

      <div class="article-body markdown">${Gt((h=s.content)!=null?h:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${s.liked?"active":""}" id="like-btn">
          ${b("heart",16)}<span>${s.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${s.likes.length?`${s.likes.slice(0,8).map(c=>g(c.nickname)).join("、")} 觉得不错`:`写于 ${gs(s.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${s.commentNum}</span></h2>
      <div id="comment-area">${fs(s.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,mt(e);const n=e.querySelector("#like-btn");n.addEventListener("click",async()=>{try{const c=await T.likePost(s.id);n.classList.toggle("active",c.liked),n.querySelector("span").textContent=String(c.count||"赞")}catch(c){S(c.message,"err")}}),(p=e.querySelector("#del-post"))==null||p.addEventListener("click",async()=>{if(await rt("删除文章",`《${s.title}》删除后无法恢复，确定吗？`))try{await T.deletePost(s.id),S("已删除","ok"),location.hash="#/posts"}catch(c){S(c.message,"err")}});let r="";const i=e.querySelector("#reply-hint"),l=e.querySelector("#comment-area");l.addEventListener("click",async c=>{var $,m;const f=c.target,o=f.closest("[data-reply]");if(o){r=($=o.dataset.reply)!=null?$:"",i.textContent=`回复 ${r}`,e.querySelector("#comment-form textarea").focus();return}const k=f.closest("[data-del-comment]");if(k){if(!await rt("删除评论","确定删除这条评论吗？"))return;try{await T.deleteComment(s.id,Number(k.dataset.delComment)),(m=k.closest(".comment"))==null||m.remove(),S("已删除","ok")}catch(x){S(x.message,"err")}}}),e.querySelector("#comment-form").addEventListener("submit",async c=>{c.preventDefault();const o=c.currentTarget.querySelector("textarea"),k=o.value.trim();if(k)try{const $=await T.commentPost(s.id,k,r);s.comments.push($),l.innerHTML=fs(s.comments),o.value="",r="",i.textContent="",S("评论已发布","ok")}catch($){S($.message,"err")}})}const Ms=2560,Jn=3*1024*1024;function ei(e){return"createImageBitmap"in window?createImageBitmap(e).catch(()=>As(e)):As(e)}function As(e){return new Promise((t,a)=>{const s=URL.createObjectURL(e),n=new Image;n.onload=()=>{URL.revokeObjectURL(s),t(n)},n.onerror=()=>{URL.revokeObjectURL(s),a(new Error("图片解码失败，可能是不支持的格式"))},n.src=s})}function Lt(e,t,a){return new Promise((s,n)=>{e.toBlob(r=>r?s(r):n(new Error("图片压缩失败")),t,a)})}async function zt(e,t=Jn){const a={file:e,width:0,height:0,size:e.size,compressed:!1,originalSize:e.size};if(e.type==="image/gif"||e.type==="image/svg+xml")return a;const s=await ei(e),n="width"in s?s.width:0,r="height"in s?s.height:0;if(!n||!r||(a.width=n,a.height=r,e.size<=2*1024*1024&&Math.max(n,r)<=Ms))return a;const i=Math.min(1,Ms/Math.max(n,r));let l=Math.round(n*i),d=Math.round(r*i);const h=document.createElement("canvas");h.width=l,h.height=d;const p=h.getContext("2d");if(!p)return a;p.imageSmoothingQuality="high",p.drawImage(s,0,0,l,d),"close"in s&&typeof s.close=="function"&&s.close();const c="image/webp";let f=.9,o=await Lt(h,c,f),k=0;for(;o.size>t&&k<4;)f=Math.max(.6,f-.1),o=await Lt(h,c,f),o.size>t&&k===3&&(l=Math.round(l*.8),d=Math.round(d*.8),h.width=l,h.height=d,p.drawImage(s,0,0,l,d),o=await Lt(h,c,f)),k++;const $=e.name.replace(/\.[^.]+$/,"")+".webp",m=new File([o],$,{type:c});return{file:m,width:l,height:d,size:m.size,compressed:!0,originalSize:e.size}}function it(e){return e>=1024*1024?`${(e/1024/1024).toFixed(1)}MB`:`${Math.round(e/1024)}KB`}const ti=["随笔","城市","旅行","技术","阅读","生活"],Je="`".repeat(3),qs=30;let et=null;const ia="qz.editor.mode",Et="qz.editor.split";async function Cs(e,t){var as,ns,is,rs,ls,os,cs;const a=t.params.id?Number(t.params.id):0;let s=null;if(a&&(s=await T.post(a),!s.canEdit)){e.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}et==null||et();const n=new AbortController;let r=null,i=!1,l=0,d=0,h=0,p=!1;et=()=>{if(i=!0,window.clearTimeout(l),window.clearTimeout(d),window.clearTimeout(h),!p)try{G.classList.contains("dirty")&&v.value.trim()&&localStorage.setItem(o,JSON.stringify(Yt()))}catch{}n.abort(),r==null||r(),document.body.classList.remove("writer-mode")};let c=(as=s==null?void 0:s.cover)!=null?as:"",f=(ns=s==null?void 0:s.images)!=null?ns:[];const o=`qz.draft.${a||"new"}`;let k=si(),$=Number(localStorage.getItem(Et))||50;document.body.classList.add("writer-mode"),e.innerHTML=`<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${a?`#/post/${a}`:"#/home"}" title="返回">${b("back",16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${g((is=s==null?void 0:s.title)!=null?is:"")}" autocomplete="off">
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
        ${Pt("btn-theme",16,"wr-ibtn")}
        <button class="wr-ibtn" id="btn-help" title="快捷键（Ctrl+/）">?</button>
        <button class="btn btn-primary btn-sm" id="save-btn">${b("check",13)} ${a?"保存修改":"发布"}</button>
      </div>
    </header>

    <div class="wr-draft" id="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="wr-body" id="body" data-mode="${k}" style="--split:${$}%">
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

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${g((rs=s==null?void 0:s.content)!=null?rs:"")}</textarea>
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
              ${c?`<img src="${g(c)}" alt="">`:"<span>点击上传封面</span>"}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${g((ls=s==null?void 0:s.category)!=null?ls:"随笔")}">
              <datalist id="cat-list">${ti.map(u=>`<option value="${u}">`).join("")}</datalist>
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
              ${f.map(u=>`<img src="${g(u)}" alt="" data-zoom="${g(u)}">`).join("")||'<span class="muted">还没有配图</span>'}
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
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${qs}MB 内图片自动压缩</span>
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
  </div>`;const m=u=>e.querySelector(u);r=Ht(e,"btn-theme");const x=m("#title"),v=m("#content"),P=m("#preview"),L=m("#body"),A=m("#splitter"),I=m("#pv-scroll"),D=m("#thumbs"),G=m("#save-state"),te=m("#stat-words"),ce=m("#stat-read"),ye=m("#stat-cursor"),Re=m("#pv-meta"),$e=m("#draft-bar"),B=m("#outline"),_=m("#outline-list"),ie=m("#side"),U=m("#help"),de=u=>{k=u,L.dataset.mode=u,localStorage.setItem(ia,u),e.querySelectorAll("#mode-switch button").forEach(y=>{y.classList.toggle("active",y.dataset.mode===u)}),m("#btn-eye").classList.toggle("on",u==="preview"),u==="preview"?Ve(!0):v.focus()};e.querySelectorAll("#mode-switch button").forEach(u=>{u.addEventListener("click",()=>de(u.dataset.mode))}),m("#btn-eye").addEventListener("click",()=>de(k==="edit"?"preview":"edit"));const we=(u,y)=>{u.dataset.open=String(y),u===B&&m("#btn-outline").classList.toggle("on",y),u===ie&&m("#btn-side").classList.toggle("on",y)};m("#btn-outline").addEventListener("click",()=>we(B,B.dataset.open!=="true")),m("#btn-side").addEventListener("click",()=>we(ie,ie.dataset.open!=="true")),e.querySelectorAll("[data-close]").forEach(u=>{u.addEventListener("click",()=>we(u.dataset.close==="side"?ie:B,!1))});const ft=m("#wr"),Ze=m("#btn-full"),ca=()=>{var u;document.fullscreenElement?document.exitFullscreen():(u=ft.requestFullscreen)==null||u.call(ft).catch(()=>S("当前环境不支持全屏","err"))};Ze.addEventListener("click",ca),document.addEventListener("fullscreenchange",()=>{const u=!!document.fullscreenElement;Ze.innerHTML=b(u?"compress":"expand",15),Ze.classList.toggle("on",u),Ze.title=u?"退出全屏":"全屏写作"},{signal:n.signal});function Ve(u=!1){window.clearTimeout(d);const y=()=>{if(i)return;const w=v.value;P.innerHTML=w.trim()?Gt(w):'<p class="muted">预览会显示在这里</p>';const E=P.querySelectorAll("h1,h2,h3,h4,p,li,pre,blockquote,table").length;Re.textContent=`${E} 个段落`};u?y():d=window.setTimeout(y,140)}function Kt(){var q,R;const u=v.value,y=((q=u.match(/[\u3400-\u9fa5]/g))!=null?q:[]).length,w=((R=u.replace(/[\u3400-\u9fa5]/g," ").match(/[A-Za-z0-9_]+/g))!=null?R:[]).length,E=y+w;te.textContent=`${E.toLocaleString()} 字`,ce.textContent=`约 ${Math.max(1,Math.round(E/400))} 分钟`}function xe(){const u=v.selectionStart,y=v.value.slice(0,u),w=y.split(`
`).length,E=u-(y.lastIndexOf(`
`)+1)+1;ye.textContent=`第 ${w} 行 · 第 ${E} 列`}function Xt(){window.clearTimeout(h),h=window.setTimeout(()=>{if(i)return;const u=ai(v.value);if(!u.length){_.innerHTML='<p class="muted">标题会出现在这里</p>';return}_.innerHTML=u.map((y,w)=>`<button class="ol-item lv${y.level}" data-i="${w}"><span>${g(y.text)}</span></button>`).join(""),_.querySelectorAll(".ol-item").forEach(y=>{y.addEventListener("click",()=>{const w=u[Number(y.dataset.i)];w&&da(w.offset),window.innerWidth<1e3&&we(B,!1)})})},260)}function da(u){const y=getComputedStyle(v),w=parseFloat(y.paddingLeft)+parseFloat(y.paddingRight),E=document.createElement("div");E.style.cssText=["position:absolute","visibility:hidden","top:0","left:0",`width:${Math.max(80,v.clientWidth-w)}px`,`font:${y.font}`,`line-height:${y.lineHeight}`,`letter-spacing:${y.letterSpacing}`,"white-space:pre-wrap","overflow-wrap:break-word","word-break:break-word"].join(";");const q=v.value.lastIndexOf(`
`,u-1)+1;E.textContent=v.value.slice(0,q),document.body.appendChild(E);const R=E.getBoundingClientRect().height;E.remove(),v.scrollTop=Math.max(0,R-8),v.focus(),v.setSelectionRange(u,u),xe()}const ua=()=>{try{const u=localStorage.getItem(o);return u?JSON.parse(u):null}catch{return null}},Yt=()=>{var u,y,w,E,q,R;return{title:x.value,content:v.value,category:(y=(u=m("#category"))==null?void 0:u.value)!=null?y:"随笔",visibility:(E=(w=m("#visibility"))==null?void 0:w.value)!=null?E:"public",pinned:(R=(q=m("#pinned"))==null?void 0:q.checked)!=null?R:!1,cover:c,savedAt:Date.now()}},Ge=()=>{window.clearTimeout(l),G.textContent="未保存",G.classList.add("dirty"),l=window.setTimeout(()=>{if(i||p)return;localStorage.setItem(o,JSON.stringify(Yt()));const u=new Date;G.textContent=`已存草稿 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")}`,G.classList.remove("dirty")},1200)},X=ua();if(X&&(X.content!==((os=s==null?void 0:s.content)!=null?os:"")||X.title!==((cs=s==null?void 0:s.title)!=null?cs:""))){const u=new Date(X.savedAt);m("#draft-text").textContent=`发现 ${u.getMonth()+1} 月 ${u.getDate()} 日 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")} 的草稿`,$e.hidden=!1,m("#draft-restore").addEventListener("click",()=>{x.value=X.title,v.value=X.content,m("#category").value=X.category||"随笔",m("#visibility").value=X.visibility||"public",m("#pinned").checked=!!X.pinned,c=X.cover||c,c&&ts(c),$e.hidden=!0,vt(),Ve(!0),S("已恢复草稿","ok")}),m("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(o),$e.hidden=!0})}const vt=()=>{Kt(),xe(),Ve(),Xt(),Ge()},Se=(u,y,w,E,q)=>{v.focus(),v.setSelectionRange(u,y);let R=!1;try{R=document.execCommand("insertText",!1,w)}catch{R=!1}R||v.setRangeText(w,u,y,"end"),v.setSelectionRange(E,q),vt()},ze=(u,y=0,w=0)=>{const E=v.selectionStart,q=v.selectionEnd;Se(E,q,u,E+y,E+(w||u.length))},We=(u,y,w)=>{const E=v.selectionStart,q=v.selectionEnd,R=v.value.slice(E,q)||w;Se(E,q,u+R+y,E+u.length,E+u.length+R.length)},Jt=()=>{const u=v.selectionStart,y=v.selectionEnd,w=v.value.lastIndexOf(`
`,Math.max(0,u-1))+1,E=v.value.indexOf(`
`,y),q=E===-1?v.value.length:E;return{lineStart:w,lineEnd:q}},ue=(u,y)=>{const{lineStart:w,lineEnd:E}=Jt(),R=(v.value.slice(w,E)||y).split(`
`),Y=R.every(O=>O.startsWith(u)),se=R.map(O=>Y?O.slice(u.length):u+O.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/,"")).join(`
`);Se(w,E,se,w,w+se.length)},F={h1:()=>ue("# ","一级标题"),h2:()=>ue("## ","二级标题"),h3:()=>ue("### ","三级标题"),bold:()=>We("**","**","加粗文字"),italic:()=>We("*","*","斜体文字"),strike:()=>We("~~","~~","删除线"),code:()=>We("`","`","code"),quote:()=>ue("> ","引用一段话"),ul:()=>ue("- ","列表项"),ol:()=>ue("1. ","列表项"),task:()=>ue("- [ ] ","待办事项"),codeblock:()=>ze(`
${Je}
// code
${Je}
`,Je.length+2,Je.length+9),hr:()=>ze(`
---
`),link:()=>{const u=v.value.slice(v.selectionStart,v.selectionEnd);ze(`[${u||"链接文字"}](https://)`,u?u.length+3:1,u?u.length+11:5)},table:()=>ze(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};m("#toolbar").addEventListener("click",u=>{var w,E;const y=u.target.closest("[data-cmd]");y&&(u.preventDefault(),(E=F[(w=y.dataset.cmd)!=null?w:""])==null||E.call(F))});const pa=/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/,ha=()=>{const u=v.selectionStart;if(u!==v.selectionEnd)return!1;const y=v.value.lastIndexOf(`
`,u-1)+1,w=v.value.slice(y,u),E=w.match(pa);if(!E)return!1;const[,q,R,Y]=E;if(!w.slice(E[0].length).trim())return Se(y,u,"",y,y),!0;let O=`
`+q;return/^\d+\.$/.test(R)?O+=`${parseInt(R,10)+1}. `:O+=R+" ",Y&&(O+="[ ] "),Se(u,u,O,u+O.length,u+O.length),!0},ma=u=>{var ds;const{lineStart:y,lineEnd:w}=Jt(),q=v.value.slice(y,w).split(`
`),R=q.map(Pe=>u?Pe.replace(/^ {1,2}|^\t/,""):"  "+Pe).join(`
`),Y=v.selectionStart===v.selectionEnd;let se=y,O=y+R.length;if(Y){const Pe=v.selectionStart-y,ga=((ds=q[0].match(/^ {1,2}|^\t/))!=null?ds:[""])[0].length,ba=u?Math.max(0,Pe-ga):Pe+2;se=y+ba,O=se}Se(y,w,R,se,O)};v.addEventListener("keydown",u=>{const y=u.metaKey||u.ctrlKey,w=u.key.toLowerCase();if(u.key==="Tab"){u.preventDefault(),ma(u.shiftKey);return}if(!y&&u.key==="Enter"&&!u.altKey&&!u.isComposing&&ha()){u.preventDefault();return}if(y){if(u.shiftKey){w==="c"?(u.preventDefault(),F.codeblock()):u.key==="8"||u.key==="*"?(u.preventDefault(),F.ul()):u.key==="7"||u.key==="&"?(u.preventDefault(),F.ol()):w==="q"?(u.preventDefault(),F.quote()):w==="e"?(u.preventDefault(),de("edit")):w==="s"?(u.preventDefault(),de("split")):w==="v"&&(u.preventDefault(),de("preview"));return}w==="b"?(u.preventDefault(),F.bold()):w==="i"?(u.preventDefault(),F.italic()):w==="k"?(u.preventDefault(),F.link()):w==="e"?(u.preventDefault(),F.code()):w==="s"?(u.preventDefault(),ss()):w==="1"||w==="2"||w==="3"?(u.preventDefault(),F[`h${w}`]()):w==="/"&&(u.preventDefault(),Ie())}}),v.addEventListener("keyup",xe),v.addEventListener("click",xe),v.addEventListener("select",xe),v.addEventListener("input",vt);let kt=!1;const es=(u,y)=>{if(k!=="split"||kt)return;kt=!0;const w=u.scrollHeight-u.clientHeight,E=w>0?u.scrollTop/w:0;y.scrollTop=E*(y.scrollHeight-y.clientHeight),requestAnimationFrame(()=>{kt=!1})};v.addEventListener("scroll",()=>es(v,I),{passive:!0}),I.addEventListener("scroll",()=>es(I,v),{passive:!0}),A.addEventListener("pointerdown",u=>{k!=="split"&&de("split"),u.preventDefault(),A.setPointerCapture(u.pointerId),A.classList.add("dragging"),document.body.classList.add("wr-resizing");const y=E=>{const q=L.getBoundingClientRect(),R=(E.clientX-q.left)/q.width*100,Y=Math.min(78,Math.max(22,R));$=Y,L.style.setProperty("--split",`${Y}%`)},w=()=>{A.classList.remove("dragging"),document.body.classList.remove("wr-resizing"),localStorage.setItem(Et,String(Math.round($))),A.removeEventListener("pointermove",y),A.removeEventListener("pointerup",w),A.removeEventListener("pointercancel",w)};A.addEventListener("pointermove",y),A.addEventListener("pointerup",w),A.addEventListener("pointercancel",w)}),A.addEventListener("dblclick",()=>{$=50,L.style.setProperty("--split","50%"),localStorage.setItem(Et,"50")});const yt=new Set,$t=async(u,y="图片")=>{for(const w of u){if(!w.type.startsWith("image/")){S("只能插入图片文件","err");continue}const E=`${w.name}-${w.size}`;if(!yt.has(E)){yt.add(E);try{S(`正在处理 ${w.name||y}…`);const q=await zt(w);if(q.size>qs*1024*1024)throw new Error(`压缩后仍有 ${it(q.size)}，超过上限`);const{url:R}=await T.upload(q.file);f.push(R);const Y=(w.name||y).replace(/\.[^.]+$/,"")||y;ze(`
![${Y}](${R})
`),D.innerHTML=f.map(se=>`<img src="${g(se)}" alt="">`).join(""),S(q.compressed?`已压缩 ${it(q.originalSize)} → ${it(q.size)}`:"图片已插入","ok")}catch(q){S(q.message,"err")}finally{yt.delete(E)}}}};v.addEventListener("paste",u=>{const y=u.clipboardData;if(!y)return;const w=Array.from(y.items).filter(E=>E.kind==="file"&&E.type.startsWith("image/")).map(E=>E.getAsFile()).filter(E=>!!E);w.length&&(u.preventDefault(),$t(w,"粘贴的图片"))});const Le=m("#pane-edit");Le.addEventListener("dragover",u=>{var y;(y=u.dataTransfer)!=null&&y.types.includes("Files")&&(u.preventDefault(),Le.classList.add("dropping"))}),Le.addEventListener("dragleave",()=>Le.classList.remove("dropping")),Le.addEventListener("drop",u=>{var w,E;const y=Array.from((E=(w=u.dataTransfer)==null?void 0:w.files)!=null?E:[]).filter(q=>q.type.startsWith("image/"));y.length&&(u.preventDefault(),Le.classList.remove("dropping"),$t(y))}),m("#img-input").addEventListener("change",async u=>{var E;const y=u.target,w=Array.from((E=y.files)!=null?E:[]);w.length&&await $t(w),y.value=""});const Qe=m("#cover-slot"),wt=m("#cover-input"),ts=u=>{var y,w;(y=Qe.querySelector("img"))==null||y.remove(),(w=Qe.querySelector("span"))==null||w.remove(),Qe.insertAdjacentHTML("afterbegin",u?`<img src="${g(u)}" alt="">`:"<span>点击上传封面</span>")};Qe.addEventListener("click",()=>wt.click()),wt.addEventListener("change",async()=>{var y;const u=(y=wt.files)==null?void 0:y[0];if(u)try{const w=await zt(u),{url:E}=await T.upload(w.file);c=E,ts(E),Ge(),S("封面已更新","ok")}catch(w){S(w.message,"err")}});function Ie(u){const y=u!=null?u:U.hidden;U.hidden=!y}m("#btn-help").addEventListener("click",()=>Ie()),m("#help-close").addEventListener("click",()=>Ie(!1)),U.addEventListener("click",u=>{u.target===U&&Ie(!1)}),document.addEventListener("keydown",u=>{u.key==="Escape"&&(U.hidden?B.dataset.open==="true"?we(B,!1):ie.dataset.open==="true"&&we(ie,!1):Ie(!1))},{signal:n.signal}),x.addEventListener("input",Ge),e.querySelectorAll("#category,#visibility,#pinned").forEach(u=>u.addEventListener("change",Ge));const ss=async()=>{const u={title:x.value.trim(),content:v.value,cover:c,category:m("#category").value.trim()||"随笔",visibility:m("#visibility").value,pinned:m("#pinned").checked,images:f};if(!u.title&&!u.content.trim()){S("写个标题或正文再发布","err");return}const y=m("#save-btn");y.disabled=!0,y.textContent="保存中…";try{const w=a?await T.updatePost(a,u):await T.createPost(u);p=!0,window.clearTimeout(l),localStorage.removeItem(o),S(a?"已保存":"已发布","ok"),location.hash=`#/post/${w.id}`}catch(w){S(w.message,"err"),y.disabled=!1,y.innerHTML=`${b("check",13)} ${a?"保存修改":"发布"}`}};m("#save-btn").addEventListener("click",()=>void ss()),window.addEventListener("beforeunload",u=>{G.classList.contains("dirty")&&v.value.trim()&&(u.preventDefault(),u.returnValue="")},{signal:n.signal}),Kt(),xe(),Xt(),Ve(!0),de(k),x.addEventListener("keydown",u=>{u.key==="Enter"&&(u.preventDefault(),v.focus(),v.setSelectionRange(0,0))}),window.innerWidth<1e3&&!(s!=null&&s.title)?x.focus():(v.focus(),v.setSelectionRange(v.value.length,v.value.length))}function si(){const e=localStorage.getItem(ia);return e==="edit"||e==="split"||e==="preview"?e:window.innerWidth>=1e3?"split":"edit"}function ai(e){var n;const t=[],a=/^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;let s;for(;s=a.exec(e);)((n=e.slice(0,s.index).match(/^```/gm))!=null?n:[]).length%2!==1&&t.push({level:s[1].length,text:s[2].replace(/[*_`~]/g,""),offset:s.index});return t}async function ni(e,t){e.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${b("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const a=e.querySelector("#album-grid"),s=async()=>{const n=await T.albums(),r=n.albums.reduce((l,d)=>l+d.count,0),i=n.albums.filter(l=>l.privacy!=="public").length;e.querySelector("#album-sub").textContent=`${n.albums.length} 个相册 · 共 ${r} 张照片`+(i?` · ${i} 个未公开`:""),a.innerHTML=n.albums.length?n.albums.map(Ha).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await s(),e.querySelector("#new-album").addEventListener("click",async()=>{await ht({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async n=>{const r=n.querySelector("#a-name").value.trim();return r?(await T.createAlbum({name:r,description:n.querySelector("#a-desc").value.trim(),privacy:n.querySelector("#a-priv").value}),S("相册已创建","ok"),await s(),!0):(S("请填写相册名称","err"),!1)}})})}const tt={public:{label:"公开",desc:"出现在相册列表，所有人可看",icon:"globe"},unlisted:{label:"隐藏",desc:"不在列表出现，知道链接才能看",icon:"eyeoff"},private:{label:"仅自己",desc:"只有你登录后能看到",icon:"lock"}};async function ii(e,t){const a=Number(t.params.id);let s=await T.album(a);const n=()=>{var i,l,d,h,p;const r=(i=tt[s.privacy])!=null?i:tt.public;e.innerHTML=`<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${b("back",14)} 全部相册</a>
          <h1>${g(s.name)}</h1>
          <p class="page-sub">${g(s.description||"没有描述")} · ${s.count} 张 · ${oe(s.at)}创建
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
                    <img src="${g(c.url)}" alt="${g(c.caption)}" loading="lazy" decoding="async" width="${c.width||800}" height="${c.height||600}" data-zoom="${g(c.url)}">
                    <figcaption>
                      <span>${g(c.caption||oe(c.at))}</span>
                      <span class="photo-like">${b("heart",12)} ${c.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${c.id}" title="赞">${b("heart",14)}</button>
                      ${s.canEdit?`<button class="photo-btn danger" data-del="${c.id}" title="删除">${b("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,mt(e),(d=e.querySelector("#album-config"))==null||d.addEventListener("click",async()=>{await ht({title:"相册设置",body:`<div class="modal-form">
          <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" value="${g(s.name)}"></label>
          <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" value="${g(s.description)}" placeholder="一句话说明"></label>
          <div class="field"><span>谁可以看到</span>
            <div class="vis-pick">
              ${Object.entries(tt).map(([c,f])=>`<label class="vis-opt">
                    <input type="radio" name="vis" value="${c}" ${s.privacy===c?"checked":""}>
                    <span class="vis-ico">${b(f.icon,15)}</span>
                    <b>${f.label}</b>
                    <i>${f.desc}</i>
                  </label>`).join("")}
            </div>
          </div>
        </div>`,confirmText:"保存",onConfirm:async c=>{var k,$;const f=c.querySelector("#a-name").value.trim();if(!f)return S("请填写相册名称","err"),!1;const o=($=(k=c.querySelector("input[name=vis]:checked"))==null?void 0:k.value)!=null?$:s.privacy;return s=await T.updateAlbum(s.id,{name:f,description:c.querySelector("#a-desc").value.trim(),privacy:o}),S(o==="public"?"已设为公开":`已设为${tt[o].label}`,"ok"),n(),!0}})}),(h=e.querySelector("#photo-file"))==null||h.addEventListener("change",async c=>{var k;const f=c.target,o=Array.from((k=f.files)!=null?k:[]);if(o.length){S(`正在处理 ${o.length} 张…`);try{const $=[],m=[],x=[],v=[];let P=0;for(const L of o){const A=await zt(L),{url:I}=await T.upload(A.file);$.push(I),m.push(A.size),x.push(A.width),v.push(A.height),P+=A.originalSize-A.size}s=await T.addPhotos(s.id,$,{sizes:m,widths:x,heights:v}),S(P>512*1024?`上传完成，压缩节省 ${it(P)}`:"上传完成","ok"),n()}catch($){S($.message,"err")}finally{f.value=""}}}),(p=e.querySelector("#del-album"))==null||p.addEventListener("click",async()=>{if(await rt("删除相册",`《${s.name}》及其中 ${s.count} 张照片会一起删除。`))try{await T.deleteAlbum(s.id),S("相册已删除","ok"),location.hash="#/albums"}catch(c){S(c.message,"err")}}),e.querySelector("#photo-grid").addEventListener("click",async c=>{var $;const f=c.target,o=f.closest("[data-like]");if(o){c.stopPropagation();try{const m=await T.likePhoto(Number(o.dataset.like));o.classList.toggle("active",m.liked);const x=($=o.closest(".photo"))==null?void 0:$.querySelector(".photo-like");x&&(x.innerHTML=`${b("heart",12)} ${m.count}`)}catch(m){S(m.message,"err")}return}const k=f.closest("[data-del]");if(k){if(c.stopPropagation(),!await rt("删除照片","确定从相册中删除这张照片吗？"))return;try{await T.deletePhoto(s.id,Number(k.dataset.del)),s=await T.album(s.id),n(),S("已删除","ok")}catch(m){S(m.message,"err")}}})};n()}async function ri(e,t){const a=ve(),s=t.params.uin||a.uin,n=s===a.uin,r=n?a:(await T.user(s)).user;e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${n?"来过的人，留下了这些话。":`给 ${g(r.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${ne(a.avatar,a.nickname,36)}
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
  </div>`;const i=e.querySelector("#gb-list"),l=e.querySelector("#gb-form textarea"),d=e.querySelector("#gb-count");l.addEventListener("input",()=>{d.textContent=`${l.value.length} / 500`});const h=c=>`<article class="gb-item card" data-gid="${c.id}">
      ${ne(c.author.avatar,c.author.nickname,40,c.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${g(c.author.uin)}">${g(c.author.nickname)}</a>
          <time>${oe(c.at)}</time>
          <span class="spacer"></span>
          ${c.canEdit?`<button class="text-btn" data-reply="${c.id}">回复</button>`:""}
          ${c.canDel?`<button class="text-btn danger" data-del="${c.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${g(c.content)}</p>
        ${c.reply?`<div class="gb-reply"><b>${g(r.nickname)}：</b>${g(c.reply)}</div>`:""}
      </div>
    </article>`,p=async()=>{const c=await T.guestbook(s);i.innerHTML=c.entries.length?c.entries.map(h).join(""):`<div class="card empty"><div class="empty-mark">${b("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await p(),e.querySelector("#gb-form").addEventListener("submit",async c=>{c.preventDefault();const f=l.value.trim();if(f)try{await T.createGuestbook(s,f),l.value="",d.textContent="0 / 500",S("留言成功","ok"),await p()}catch(o){S(o.message,"err")}}),i.addEventListener("click",async c=>{const f=c.target,o=f.closest("[data-del]");if(o){if(!confirm("确定删除这条留言吗？"))return;try{await T.deleteGuestbook(Number(o.dataset.del)),await p(),S("已删除","ok")}catch($){S($.message,"err")}return}const k=f.closest("[data-reply]");if(k){const $=Number(k.dataset.reply);await ht({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async m=>{const x=m.querySelector("#reply-text").value.trim();return x?(await T.replyGuestbook($,x),await p(),S("已回复","ok"),!0):(S("回复不能为空","err"),!1)}})}})}async function li(e,t){const a=ve(),s=t.params.uin?(await T.user(t.params.uin)).user:a;e.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${g(s.nickname)}</h1>
      <p class="page-sub">${g(s.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${s.bio?Gt(s.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
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
  </div>`,s.uin!==a.uin&&T.visit(s.uin,"关于").catch(()=>S("足迹记录失败","err"))}async function oi(e,t){var d;const a=(d=t.params.uin)!=null?d:"",s=ve();if(a===s.uin){location.hash="#/home";return}e.innerHTML=`<div class="page"><div class="card reading">正在打开 ${g(a)} 的空间…</div></div>`;const{user:n}=await T.user(a);T.visit(n.uin,"主页").catch(()=>{}),e.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${g(n.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ne(n.avatar,n.nickname,0)}</div>
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
    <div id="space-posts">${lt(2)}</div>
  </div>`,mt(e);const r=e.querySelector("#space-posts"),i=await T.posts({uin:n.uin,limit:10});if(!i.posts.length){r.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const l=i.posts[0];r.innerHTML=js(l)+`<div class="post-list">${i.posts.slice(1).map(gt).join("")}</div>`}const Rs={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function ci(e){return e.target.startsWith("post:")?`#/post/${e.target.split(":")[1]}`:e.target.startsWith("album:")?`#/album/${e.target.split(":")[1]}`:e.target==="guestbook"?"#/guestbook":e.target==="profile"?`#/u/${g(e.from.uin)}`:"#/home"}async function di(e,t){e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${b("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const a=e.querySelector("#msg-list"),s=e.querySelector("#msg-sub"),n=async()=>{const r=await T.notifications();s.textContent=r.unread?`${r.unread} 条未读`:"全部已读",ms(r.unread),a.innerHTML=r.notifications.length?`<div class="card msg-list">${r.notifications.map(i=>{var d;const l=(d=Rs[i.kind])!=null?d:Rs.system;return`<a class="msg-row ${i.read?"":"unread"}" href="${ci(i)}">
              <span class="msg-icon ${l.cls}">${b(l.icon,16)}</span>
              <div class="msg-body">
                <div class="msg-line">
                  ${ne(i.from.avatar,i.from.nickname,20,i.from.uin)}
                  <b>${g(i.from.nickname)}</b>
                  <span>${g(i.text)}</span>
                </div>
                <time>${oe(i.at)} · ${l.label}</time>
              </div>
              ${i.read?"":'<i class="msg-dot"></i>'}
            </a>`}).join("")}</div>`:`<div class="card empty"><div class="empty-mark">${b("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await n(),e.querySelector("#read-all").addEventListener("click",async()=>{try{const r=await T.readNotifications([]);ms(r.unread),S("已全部标为已读","ok"),await n()}catch(r){S(r.message,"err")}})}const ui=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function pi(e,t){const a=ve(),s=t.params.tab==="out"?"out":"in";e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${b("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${ui.map(i=>`<button class="seg-btn ${i.key===s?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,e.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/visitors?tab=${i.dataset.tab}`})});const n=e.querySelector("#visit-list"),r=await T.visitors(a.uin,s);e.querySelector("#visit-sub").textContent=s==="in"?`累计 ${r.total.toLocaleString()} 人次 · 今日 ${r.today} 人`:`你最近访问了 ${r.visitors.length} 个空间`,n.innerHTML=r.visitors.length?`<div class="card visit-list">${r.visitors.map(i=>`<a class="visit-row" href="#/u/${g(i.author.uin)}">
            ${ne(i.author.avatar,i.author.nickname,40,i.author.uin)}
            <div class="visit-main">
              <b>${g(i.author.nickname)}</b>
              <span>${s==="in"?"看了":"访问了"} · ${g(i.module)}</span>
            </div>
            <time>${oe(i.at)}</time>
          </a>`).join("")}</div>`:Ma(s==="in"?"还没有人来过":"还没有访问记录",s==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>')}const hi="https://incompetech.com/music/royalty-free/mp3-royaltyfree/",he=e=>hi+e,mi=[{id:"mc-medi01",title:"Meditation Impromptu 01",mood:"安静 · 钢琴",seconds:213,url:he("Meditation Impromptu 01.mp3")},{id:"mc-medi02",title:"Meditation Impromptu 02",mood:"安静 · 夜读",seconds:249,url:he("Meditation Impromptu 02.mp3")},{id:"mc-medi03",title:"Meditation Impromptu 03",mood:"安静 · 舒展",seconds:255,url:he("Meditation Impromptu 03.mp3")},{id:"mc-dreamer",title:"Dreamer",mood:"舒缓 · 梦境",seconds:204,url:he("Dreamer.mp3")},{id:"mc-thought",title:"Deliberate Thought",mood:"沉思 · 专注",seconds:177,url:he("Deliberate Thought.mp3")},{id:"mc-gymno",title:"Gymnopédie No. 2",mood:"古典 · 钢琴",seconds:159,url:he("Gymnopedie No 2.mp3")},{id:"mc-atlantis",title:"Atlantean Twilight",mood:"神秘 · 深蓝",seconds:171,url:he("Atlantean Twilight.mp3")}],gi="Kevin MacLeod · incompetech.com · CC BY 4.0";function bi(e){return`/api/music/stream?${new URLSearchParams({u:e.url})}`}function fi(e){if(!Number.isFinite(e)||e<=0)return"--:--";const t=Math.floor(e/60),a=Math.round(e%60);return`${t}:${String(a).padStart(2,"0")}`}const vi=[{id:"light",name:"浅色",icon:"sun"},{id:"dark",name:"深色",icon:"moon"},{id:"auto",name:"跟随系统",icon:"monitor"}],ki=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function yi(e,t){var r;const a=t.params.tab||"profile",s=ve();e.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${ki.map(i=>`<button class="seg-btn ${i.key===a?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,e.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/settings?tab=${i.dataset.tab}`})});const n=e.querySelector("#settings-body");if(a==="decorate"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${g(s.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">外观</h2>
      <p class="setting-hint">深色模式适合夜间写作；「跟随系统」会随设备的浅色 / 深色自动切换。这个偏好只保存在当前浏览器，不跟账号走。</p>
      <div class="theme-grid" id="appearance-grid">
        ${vi.map(i=>`<button class="theme-card ${Ca()===i.id?"active":""}" data-appearance="${i.id}">
            <span class="mode-swatch">${b(i.icon,14)}</span>
            <span>${i.name}</span>
          </button>`).join("")}
      </div>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${Tt().map(i=>`<button class="theme-card ${s.theme===i.id?"active":""}" data-theme="${i.id}">
              <span class="theme-swatch" style="background:${i.accent}"></span>
              <span>${g(i.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,n.querySelector("#cover-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:h}=await T.upload(l),p=await T.updateProfile({cover:h});Te(p),n.querySelector("#cover-preview").style.backgroundImage=`url('${h}')`,S("封面已更新","ok")}catch(h){S(h.message,"err")}}),n.querySelectorAll("[data-appearance]").forEach(i=>{i.addEventListener("click",()=>{Hs(i.dataset.appearance),n.querySelectorAll("[data-appearance]").forEach(l=>l.classList.remove("active")),i.classList.add("active")})}),n.querySelectorAll("[data-theme]").forEach(i=>{i.addEventListener("click",async()=>{const l=i.dataset.theme;try{const d=await T.updateProfile({theme:l});Te(d),zs(l),n.querySelectorAll("[data-theme]").forEach(h=>h.classList.remove("active")),i.classList.add("active"),S("主题已切换","ok")}catch(d){S(d.message,"err")}})});return}if(a==="music"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">在线免费曲库</h2>
      <p class="setting-hint">来自 Kevin MacLeod 的 incompetech.com，<b>CC BY 4.0</b> 授权，可免费用作背景音乐。播放走本站代理，避开跨域与格式兼容问题。</p>
      <div class="music-library" id="music-online"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">内置合成曲目</h2>
      <p class="setting-hint">程序实时合成，完全无版权顾虑，没有外网也能播放。</p>
      <div class="music-library" id="music-builtin"><span class="muted">加载中…</span></div>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${V.isPlaying()?"spin":""}">${b("music",16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${g(s.bgmTitle||"还没有设置音轨")}</b>
          <span id="bgm-sub">${s.bgmUrl?"已保存，会在页面左下角循环播放":"从上面的曲库挑一首，或上传自己的音频"}</span>
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
        说明：QQ 音乐等平台的播放接口需要签名与版权授权，本项目不抓取这些内容。在线曲库为 CC BY 4.0（署名：Kevin MacLeod, incompetech.com），内置曲目由程序合成，你也可以上传自己的音频或填写有权使用的直链。
      </p>
    </section>`;let i=s.bgmUrl,l=s.bgmTitle;const d=()=>{n.querySelector("#bgm-name").textContent=l||"还没有设置音轨",n.querySelector("#bgm-sub").textContent=i?"已选择，保存后生效":"从上面的曲库挑一首，或上传自己的音频",n.querySelector("#bgm-title").value||(n.querySelector("#bgm-title").value=l)},h=(m,x)=>{i=m,l=x,n.querySelector("#bgm-title").value=x,d()};let p=null,c="";const f=()=>{p&&(p.pause(),p.src="",p=null),c="",n.querySelectorAll(".lib-play").forEach(m=>{m.classList.remove("on"),m.innerHTML=`${b("play",12)}<span>试听</span>`})};window.addEventListener("hashchange",f,{once:!0});const o=m=>`
      <article class="lib-card" data-id="${g(m.id)}">
        <div class="lib-main">
          <b>${g(m.title)}</b>
          <span>${g(m.mood)} · ${fi(m.seconds)}${m.badge?` · <em class="lib-badge">${g(m.badge)}</em>`:""}</span>
        </div>
        <div class="lib-actions">
          <button class="btn btn-ghost btn-sm lib-play" data-play="${g(m.url)}" data-key="${g(m.id)}">${b("play",12)}<span>试听</span></button>
          <button class="btn btn-soft btn-sm" data-pick="${g(m.url)}" data-title="${g(m.title)}">设为背景</button>
        </div>
      </article>`,k=n.querySelector("#music-online");k.innerHTML=mi.map(m=>o({...m,url:bi(m),badge:"CC BY"})).join("")+`<p class="lib-credit">${b("music",11)} 署名：${g(gi)}</p>`;try{const{tracks:m}=await T.musicLibrary();n.querySelector("#music-builtin").innerHTML=m.length?m.map(x=>o({id:x.id,title:x.title,mood:x.mood,seconds:x.duration,url:x.url,badge:"无版权"})).join(""):'<p class="muted">没有内置曲目</p>'}catch(m){n.querySelector("#music-builtin").innerHTML=`<span class="muted">曲库加载失败：${g(m.message)}</span>`}n.querySelector(".setting-card").addEventListener("click",m=>{var L;const x=m.target,v=x.closest(".lib-play");if(v){const A=v.dataset.play,I=(L=v.dataset.key)!=null?L:A;if(c===I&&p&&!p.paused){f();return}f();const D=new Audio(A);p=D,D.volume=.7,c=I,v.classList.add("loading"),v.innerHTML='<span class="lib-spin"></span><span>载入中</span>',D.addEventListener("ended",f,{once:!0}),D.addEventListener("playing",()=>{p===D&&(v.classList.remove("loading"),v.classList.add("on"),v.innerHTML=`${b("pause",12)}<span>暂停</span>`)},{once:!0}),D.addEventListener("error",()=>{f(),S("试听失败：音源暂时不可用，换一首或稍后再试","err")},{once:!0}),D.play().catch(()=>{f(),S("试听失败：音源暂时不可用，换一首或稍后再试","err")});return}const P=x.closest("[data-pick]");P&&(h(P.dataset.pick,P.dataset.title),S(`已选择《${P.dataset.title}》，记得点保存`,"ok"))});const $=n.querySelector("#audio-file");$.addEventListener("change",async()=>{var x;const m=(x=$.files)==null?void 0:x[0];if(m){if(m.size>50*1024*1024){S("音频不能超过 50MB","err");return}S("正在上传音频…");try{const{url:v}=await T.uploadAudio(m);h(v,m.name.replace(/\.[^.]+$/,"")),S("上传完成，点保存生效","ok")}catch(v){S(v.message,"err")}finally{$.value=""}}}),n.querySelector("#bgm-url-save").addEventListener("click",()=>{var v;const x=n.querySelector("#bgm-url").value.trim();if(!x){S("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/)/.test(x)){S("地址需要以 http(s):// 或 /media/ 开头","err");return}h(x,((v=x.split("/").pop())==null?void 0:v.replace(/\.[^.]+$/,""))||"外部音频"),S("已填入，点保存生效","ok")}),n.querySelector("#preview-btn").addEventListener("click",()=>{if(!i){S("还没有选择音轨","err");return}V.setTrack(i,l),V.toggle(),setTimeout(()=>{var m;return(m=n.querySelector(".music-disc"))==null?void 0:m.classList.toggle("spin",V.isPlaying())},150)}),n.querySelector("#save-bgm").addEventListener("click",async()=>{const m=n.querySelector("#bgm-title").value.trim();try{const x=await T.updateProfile({bgmUrl:i,bgmTitle:m});Te(x),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:x.bgmUrl,bgmTitle:x.bgmTitle}})),S("背景音乐已保存","ok")}catch(x){S(x.message,"err")}}),(r=n.querySelector("#clear-bgm"))==null||r.addEventListener("click",async()=>{try{const m=await T.updateProfile({bgmUrl:"",bgmTitle:""});Te(m),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),S("已移除背景音乐","ok"),await t.reload()}catch(m){S(m.message,"err")}});return}n.innerHTML=`<section class="card setting-card">
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
  </section>`,n.querySelector("#avatar-file").addEventListener("change",async i=>{var d;const l=(d=i.target.files)==null?void 0:d[0];if(l)try{const{url:h}=await T.upload(l),p=await T.updateProfile({avatar:h});Te(p),n.querySelector("#avatar-preview").src=h,S("头像已更新","ok")}catch(h){S(h.message,"err")}}),n.querySelector("#profile-form").addEventListener("submit",async i=>{var h,p,c,f,o;i.preventDefault();const l=new FormData(i.currentTarget),d=String((h=l.get("tags"))!=null?h:"").split(/[,，\s]+/).map(k=>k.trim()).filter(Boolean).slice(0,8);try{const k=await T.updateProfile({nickname:String((p=l.get("nickname"))!=null?p:"").trim(),city:String((c=l.get("city"))!=null?c:"").trim(),signature:String((f=l.get("signature"))!=null?f:"").trim(),bio:String((o=l.get("bio"))!=null?o:""),tags:d});Te(k),S("已保存","ok"),await t.reload()}catch(k){S(k.message,"err")}})}async function $i(e,t){const a=(t.params.q||"").trim();if(e.innerHTML=`<div class="page">
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
  </div>`,e.querySelector("#search-form").addEventListener("submit",n=>{var i;n.preventDefault();const r=String((i=new FormData(n.currentTarget).get("q"))!=null?i:"").trim();location.hash=r?`#/search?q=${encodeURIComponent(r)}`:"#/search"}),!a)return;const s=e.querySelector("#search-result");try{const n=await T.search(a);if(!(n.posts.length+n.users.length+n.albums.length)){s.innerHTML=`<div class="card empty"><div class="empty-mark">${b("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}s.innerHTML=`
      ${n.users.length?`<h2 class="result-title">用户 <span>${n.users.length}</span></h2>
             <div class="card user-list">${n.users.map(i=>`<a class="user-row" href="#/u/${g(i.uin)}">
                   <img src="${g(i.avatar)}" alt="" loading="lazy" decoding="async">
                   <div><b>${g(i.nickname)}</b><span>@${g(i.uin)} · ${g(i.signature||"")}</span></div>
                   ${b("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${n.posts.length?`<h2 class="result-title">文章 <span>${n.posts.length}</span></h2>
             <div class="post-list card">${n.posts.map(gt).join("")}</div>`:""}
      ${n.albums.length?`<h2 class="result-title">相册 <span>${n.albums.length}</span></h2>
             <div class="album-grid">${n.albums.map(i=>`<a class="album-card card" href="#/album/${i.id}">
                   <div class="album-cover">${i.cover?`<img src="${g(i.cover)}" alt="" loading="lazy" decoding="async">`:""}</div>
                   <div class="album-info"><h3>${g(i.name)}</h3><p>${i.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(n){S(n.message,"err")}}const ra=document.getElementById("app"),wi=[{pattern:/^\/home$/,nav:"home",render:_a},{pattern:/^\/posts$/,nav:"posts",render:Ba},{pattern:/^\/post\/(\d+)$/,nav:"posts",render:Yn},{pattern:/^\/write$/,nav:"",render:Cs},{pattern:/^\/edit\/(\d+)$/,nav:"",render:Cs},{pattern:/^\/albums$/,nav:"albums",render:ni},{pattern:/^\/album\/(\d+)$/,nav:"albums",render:ii},{pattern:/^\/guestbook$/,nav:"guestbook",render:ri},{pattern:/^\/about$/,nav:"about",render:li},{pattern:/^\/u\/([^/]+)$/,nav:"",render:oi},{pattern:/^\/messages$/,nav:"",render:di},{pattern:/^\/visitors$/,nav:"",render:pi},{pattern:/^\/settings$/,nav:"",render:yi},{pattern:/^\/search$/,nav:"",render:$i}];let Wt=!1,De=!1,ut=0;function xi(){let e=document.getElementById("route-bar");return e||(e=document.createElement("i"),e.id="route-bar",document.body.appendChild(e)),e.className="",window.clearTimeout(ut),ut=window.setTimeout(()=>{e&&e.className===""&&(e.className="on")},150),e}function Si(e){if(window.clearTimeout(ut),e.className!=="on"){e.className="";return}e.className="done",ut=window.setTimeout(()=>{e.className==="done"&&(e.className="")},320)}function Li(){const e=location.hash.replace(/^#/,"")||"/home",[t,a=""]=e.split("?");return{path:t.startsWith("/")?t:`/${t}`,query:new URLSearchParams(a)}}function Ei(e){var t;for(const a of wi){const s=e.match(a.pattern);if(s)return{def:a,id:(t=s[1])!=null?t:""}}return null}async function la(){try{const e=await T.session();if(!e.authenticated||!e.user)return!1;const t=await T.bootstrap();return xa({me:t.me,themes:t.themes,unread:t.unread}),zs(t.me.theme),!0}catch{return!1}}function Qt(){Wt=!1,J.boot=null,document.body.classList.remove("signed-in"),V.unmount(),Ia(ra,async()=>{await la()&&oa()})}function Be(e,t,a){return`<a class="nav-link" data-nav="${t}" href="${e}">${a}</a>`}function oa(){const e=ve();document.body.classList.add("signed-in"),ra.innerHTML=`
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${b("pen",15)}</span>
        <span class="brand-text">${g(e.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${Be("#/home","home","首页")}
        ${Be("#/posts","posts","文章")}
        ${Be("#/albums","albums","相册")}
        ${Be("#/guestbook","guestbook","留言板")}
        ${Be("#/about","about","关于")}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${b("search",15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${b("pen",14)}<span>写文章</span></a>
        ${Pt("theme-toggle",17)}
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${b("bell",18)}<i class="badge" data-unread ${hs()?"":"hidden"}>${hs()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${ne(e.avatar,e.nickname,32)}
          <div class="user-menu" id="user-menu" hidden>
            <div class="menu-head">
              <b>${g(e.nickname)}</b>
              <span>@${g(e.uin)}</span>
            </div>
            <a href="#/u/${g(e.uin)}">${b("grid",14)} 我的主页</a>
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
    <span>${g(e.nickname)} · 个人空间</span>
    <span class="foot-sep">·</span>
    <span>Go + ent + SQLite · TypeScript</span>
  </footer>`;const t=document.getElementById("head-search");t.addEventListener("submit",s=>{var r;s.preventDefault();const n=String((r=new FormData(t).get("q"))!=null?r:"").trim();n&&(location.hash=`#/search?q=${encodeURIComponent(n)}`)}),Ht(document,"theme-toggle");const a=document.getElementById("user-chip");a.addEventListener("click",s=>{s.target.closest("a,button")||(De=!De,document.getElementById("user-menu").hidden=!De)}),document.addEventListener("click",s=>{!a.contains(s.target)&&De&&(De=!1,document.getElementById("user-menu").hidden=!0)}),document.getElementById("logout-btn").addEventListener("click",async()=>{await T.logout(),S("已退出登录"),Qt()}),Wt=!0,V.setTrack(e.bgmUrl,e.bgmTitle),V.mount(),pt()}async function pt(){var r;if(!Wt)return;const e=document.getElementById("view");if(!e)return;const{path:t,query:a}=Li(),s=Ei(t);!t.startsWith("/write")&&!t.startsWith("/edit/")&&document.body.classList.remove("writer-mode"),document.querySelectorAll("[data-nav]").forEach(i=>{i.classList.toggle("active",i.dataset.nav===(s==null?void 0:s.def.nav))}),La();const n=xi();try{if(!s){e.innerHTML=`<div class="page narrow"><div class="card empty">
        <h2 class="empty-title">页面不存在</h2>
        <p class="empty-desc">这条链接可能已经失效。</p>
        <a class="btn btn-primary" href="#/home">回到首页</a>
      </div></div>`;return}const i={...Object.fromEntries(a)};s.id&&(i.id=s.id,s.def.pattern.source.includes("[^/]")&&(i.uin=s.id)),window.scrollTo({top:0});const l={params:i,reload:pt};await s.def.render(e,l)}catch(i){if(i instanceof at&&i.status===401)return;e.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${g(i.message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`,(r=e.querySelector("#retry"))==null||r.addEventListener("click",()=>void pt())}finally{Si(n)}}window.addEventListener("hashchange",()=>void pt());window.addEventListener("qz:expired",()=>Qt());(async function(){await la()?oa():Qt()})();window.addEventListener("qz:profile",e=>{const t=e.detail;t&&V.setTrack(t.bgmUrl,t.bgmTitle)});
