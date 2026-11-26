var la=Object.defineProperty;var as=t=>{throw TypeError(t)};var oa=(t,e,a)=>e in t?la(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var M=(t,e,a)=>oa(t,typeof e!="symbol"?e+"":e,a),ca=(t,e,a)=>e.has(t)||as("Cannot "+a);var ns=(t,e,a)=>e.has(t)?as("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,a);var Se=(t,e,a)=>(ca(t,e,"access private method"),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(n){if(n.ep)return;n.ep=!0;const l=a(n);fetch(n.href,l)}})();class Xe extends Error{constructor(a,s){super(s);M(this,"status");this.status=a}}async function Ee(t,e={}){const a=new Headers(e.headers);e.body&&!(e.body instanceof FormData)&&a.set("Content-Type","application/json");let s;try{s=await fetch(t,{credentials:"include",...e,headers:a})}catch{throw new Xe(0,"网络连接失败，请检查服务是否已启动")}if(s.status===401)throw window.dispatchEvent(new CustomEvent("qz:expired")),new Xe(401,"登录状态已失效");const n=await s.text(),l=n?JSON.parse(n):{};if(!s.ok)throw new Xe(s.status,l.error||"请求失败");return l}const U=t=>Ee(t),B=(t,e)=>Ee(t,{method:"POST",body:e===void 0?void 0:JSON.stringify(e)}),ze=t=>Ee(t,{method:"DELETE"}),is=(t,e)=>Ee(t,{method:"PATCH",body:JSON.stringify(e)}),S={register:(t,e,a)=>B("/api/auth/register",{uin:t,nickname:e,password:a}),login:(t,e)=>B("/api/auth/login",{uin:t,password:e}),logout:()=>B("/api/auth/logout"),session:()=>U("/api/auth/session"),bootstrap:()=>U("/api/bootstrap"),user:t=>U(`/api/users/${encodeURIComponent(t)}`),updateProfile:t=>is("/api/users/me",t),signIn:()=>B("/api/users/me/signin"),visitors:(t,e="in")=>U(`/api/users/${encodeURIComponent(t)}/visitors?mode=${e}`),visit:(t,e)=>B(`/api/users/${encodeURIComponent(t)}/visit`,{module:e}),posts:t=>{const e=new URLSearchParams;return Object.entries(t).forEach(([a,s])=>{s!==void 0&&s!==""&&e.set(a,String(s))}),U(`/api/posts?${e}`)},createPost:t=>B("/api/posts",t),post:t=>U(`/api/posts/${t}`),updatePost:(t,e)=>is(`/api/posts/${t}`,e),deletePost:t=>ze(`/api/posts/${t}`),likePost:t=>B(`/api/posts/${t}/like`),commentPost:(t,e,a)=>B(`/api/posts/${t}/comments`,{content:e,replyTo:a}),deleteComment:(t,e)=>ze(`/api/posts/${t}/comments/${e}`),albums:t=>U(`/api/albums${t?`?uin=${encodeURIComponent(t)}`:""}`),album:t=>U(`/api/albums/${t}`),createAlbum:t=>B("/api/albums",t),deleteAlbum:t=>ze(`/api/albums/${t}`),addPhotos:(t,e,a)=>B(`/api/albums/${t}/photos`,{urls:e,caption:"",...a}),deletePhoto:(t,e)=>ze(`/api/albums/${t}/photos/${e}`),likePhoto:t=>B(`/api/photos/${t}/like`),guestbook:t=>U(`/api/guestbook${t?`?uin=${encodeURIComponent(t)}`:""}`),createGuestbook:(t,e)=>B("/api/guestbook",{owner:t,content:e}),deleteGuestbook:t=>ze(`/api/guestbook/${t}`),replyGuestbook:(t,e)=>B(`/api/guestbook/${t}/reply`,{reply:e}),notifications:()=>U("/api/notifications"),readNotifications:(t=[])=>B("/api/notifications/read",{ids:t}),musicLibrary:()=>U("/api/music/library"),search:t=>U(`/api/search?q=${encodeURIComponent(t)}`),upload:async t=>{const e=new FormData;return e.append("file",t),Ee("/api/upload",{method:"POST",body:e})},uploadAudio:async t=>{const e=new FormData;return e.append("file",t),Ee("/api/upload/audio",{method:"POST",body:e})}},X={boot:null};function ve(){if(!X.boot)throw new Error("尚未初始化");return X.boot.me}function da(t){X.boot=t}function Le(t){X.boot&&(X.boot.me=t)}function ft(){var t,e;return(e=(t=X.boot)==null?void 0:t.themes)!=null?e:[]}function rs(){var t,e;return(e=(t=X.boot)==null?void 0:t.unread)!=null?e:0}function ls(t){X.boot&&(X.boot.unread=t),document.querySelectorAll("[data-unread]").forEach(e=>{e.textContent=t>99?"99+":String(t),e.hidden=t===0})}function Ls(t){var a,s;const e=(a=ft().find(n=>n.id===t))!=null?a:ft()[0];document.documentElement.dataset.theme=(s=e==null?void 0:e.id)!=null?s:"aurora",e&&document.documentElement.style.setProperty("--theme-accent",e.accent)}function g(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const oe=t=>String(t).padStart(2,"0");function ce(t){const e=new Date(t).getTime(),a=Date.now()-e,s=6e4;if(a<s)return"刚刚";if(a<60*s)return`${Math.floor(a/s)} 分钟前`;const n=new Date(e),l=new Date;if(n.toDateString()===l.toDateString())return`今天 ${oe(n.getHours())}:${oe(n.getMinutes())}`;const i=new Date(Date.now()-864e5);return n.toDateString()===i.toDateString()?`昨天 ${oe(n.getHours())}:${oe(n.getMinutes())}`:n.getFullYear()===l.getFullYear()?`${n.getMonth()+1} 月 ${n.getDate()} 日`:`${n.getFullYear()} 年 ${n.getMonth()+1} 月 ${n.getDate()} 日`}function os(t){const e=new Date(t);return`${e.getFullYear()}-${oe(e.getMonth()+1)}-${oe(e.getDate())} ${oe(e.getHours())}:${oe(e.getMinutes())}`}const ua={pen:'<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',heart:'<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',message:'<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l4.5-4.5L13 17l3-3 4 4"/>',music:'<circle cx="7" cy="17" r="2.6"/><circle cx="18" cy="15" r="2.6"/><path d="M9.6 17V7l8.4-2v10"/>',play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',pause:'<rect x="7" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5.5" width="3.6" height="13" rx="1" fill="currentColor" stroke="none"/>',book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"/><path d="M20 18.5V21H6.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',bell:'<path d="M18 15V10a6 6 0 0 0-12 0v5l-2 3h16z"/><path d="M9.5 18.5a2.6 2.6 0 0 0 5 0"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M15 5l-7 7 7 7"/>',chevron:'<path d="M9 6l6 6-6 6"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',star:'<path d="M12 3.6l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z"/>',logout:'<path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15"/><path d="M17 8l4 4-4 4M21 12h-9"/>',tag:'<path d="M4 12.5V5.5A1.5 1.5 0 0 1 5.5 4h7l7 7-8 8-7.5-6.5z"/><circle cx="8.5" cy="8.5" r="1.3"/>',pin:'<path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V16"/>',lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',moon:'<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2z"/>',monitor:'<rect x="3" y="4.5" width="18" height="12.5" rx="2"/><path d="M9 20.5h6M12 17v3.5"/>',grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.6" cy="6" r="1.2"/><circle cx="4.6" cy="12" r="1.2"/><circle cx="4.6" cy="18" r="1.2"/>',listOl:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 4.6h1v4"/><path d="M3.5 15c0-.7.6-1.2 1.3-1.2s1.2.4 1.2 1c0 1-2.5 1.4-2.5 3.2h2.7"/>',table:'<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9 5v14"/>',codeInline:'<path d="M9 7.5L4.5 12 9 16.5"/><path d="M15 7.5L19.5 12 15 16.5"/>',codeBlock:'<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M9.5 10.5L7.5 12l2 1.5M14.5 10.5l2 1.5-2 1.5"/>',task:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12.2l2.6 2.6L16 9"/>',expand:'<path d="M9 4.5H4.5V9M15 4.5h4.5V9M15 19.5h4.5V15M9 19.5H4.5V15"/>',compress:'<path d="M4.5 9H9V4.5M19.5 9H15V4.5M19.5 15H15v4.5M4.5 15H9v4.5"/>',outline:'<path d="M4 6h16M4 12h10.5M4 18h7"/>'};function b(t,e=16){var s;const a=(s=ua[t])!=null?s:"";return`<svg class="ico" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}function ae(t,e,a=40,s="",n=0){const l=t?`<img src="${g(t)}" alt="${g(e)}" loading="lazy">`:`<span class="avatar-fallback">${g(e.slice(0,1))}</span>`,i=s?`href="#/u/${g(s)}"`:"",o=a>0?` style="width:${a}px;height:${a}px"`:"";return`<a class="avatar" ${i}${o}>${l}${n?`<i class="avatar-level">${n}</i>`:""}</a>`}function w(t,e="info"){let a=document.getElementById("toasts");a||(a=document.createElement("div"),a.id="toasts",document.body.appendChild(a));const s=document.createElement("div");s.className=`toast toast-${e}`,s.textContent=t,a.appendChild(s),requestAnimationFrame(()=>s.classList.add("in")),setTimeout(()=>{s.classList.remove("in"),setTimeout(()=>s.remove(),280)},2600)}function xt(t){return new Promise(e=>{var l,i,o,d;const a=document.createElement("div");a.className="modal-mask",a.innerHTML=`
      <div class="modal ${t.wide?"modal-wide":""}" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h3>${g(t.title)}</h3>
          <button class="icon-btn modal-x" aria-label="关闭">${b("close",18)}</button>
        </header>
        <div class="modal-body">${t.body}</div>
        <footer class="modal-foot">
          <button class="btn btn-ghost modal-cancel">${g((l=t.cancelText)!=null?l:"取消")}</button>
          <button class="btn btn-primary modal-ok">${g((i=t.confirmText)!=null?i:"确定")}</button>
        </footer>
      </div>`,document.body.appendChild(a),document.body.classList.add("no-scroll");const s=h=>{a.remove(),document.body.classList.remove("no-scroll"),e(h)};a.querySelector(".modal-x").addEventListener("click",()=>s(!1)),a.querySelector(".modal-cancel").addEventListener("click",()=>s(!1)),a.addEventListener("mousedown",h=>{h.target===a&&s(!1)});const n=a.querySelector(".modal-ok");n.addEventListener("click",async()=>{if(!t.onConfirm)return s(!0);n.disabled=!0;try{await t.onConfirm(a)!==!1&&s(!0)}catch(h){w(h.message,"err")}finally{n.disabled=!1}}),(o=t.onMount)==null||o.call(t,a),(d=a.querySelector("input, textarea"))==null||d.focus()})}async function Je(t,e,a="删除"){return xt({title:t,body:`<p class="confirm-text">${g(e)}</p>`,confirmText:a})}function it(t){t.addEventListener("click",e=>{const a=e.target.closest("[data-zoom]");if(!a||e.target.closest("button"))return;const s=a.dataset.zoom||a.src,n=Array.from(t.querySelectorAll("[data-zoom]")).map(m=>m.dataset.zoom||m.src);let l=Math.max(0,n.indexOf(s));const i=document.createElement("div");i.className="lightbox",i.innerHTML=`
      <button class="lb-close">${b("close",24)}</button>
      <button class="lb-prev">${b("back",24)}</button>
      <img alt="">
      <button class="lb-next">${b("chevron",24)}</button>
      <div class="lb-count"></div>`,document.body.appendChild(i),document.body.classList.add("no-scroll");const o=i.querySelector("img"),d=i.querySelector(".lb-count"),h=()=>{o.src=n[l],d.textContent=`${l+1} / ${n.length}`};h();const p=m=>{m.key==="Escape"&&c(),m.key==="ArrowLeft"&&n.length>1&&(l=(l-1+n.length)%n.length,h()),m.key==="ArrowRight"&&n.length>1&&(l=(l+1)%n.length,h())},c=()=>{i.remove(),document.body.classList.remove("no-scroll"),window.removeEventListener("keydown",p)};i.querySelector(".lb-close").addEventListener("click",c),i.addEventListener("click",m=>{m.target===i&&c()}),i.querySelector(".lb-prev").addEventListener("click",m=>{m.stopPropagation(),n.length>1&&(l=(l-1+n.length)%n.length,h())}),i.querySelector(".lb-next").addEventListener("click",m=>{m.stopPropagation(),n.length>1&&(l=(l+1)%n.length,h())}),window.addEventListener("keydown",p)})}function pa(t,e="",a=""){return`<div class="empty">
    <div class="empty-mark">${b("book",22)}</div>
    <p class="empty-title">${g(t)}</p>
    ${e?`<p class="empty-desc">${g(e)}</p>`:""}
    ${a}
  </div>`}function et(t=3){return Array.from({length:t}).map(()=>`<div class="card skel-card">
        <div class="skel skel-line w30"></div>
        <div class="skel skel-line w80"></div>
        <div class="skel skel-line w60"></div>
      </div>`).join("")}class ha{constructor(){M(this,"audio",null);M(this,"pill",null);M(this,"title","");M(this,"url","");M(this,"armed",!1)}get want(){return localStorage.getItem("qz.bgm")!=="off"}get volume(){const e=Number(localStorage.getItem("qz.bgm.vol"));return Number.isFinite(e)&&e>0?Math.min(e,1):.55}setTrack(e,a){const s=e!==this.url;this.url=e,this.title=a||"未命名音轨",s&&(this.ensureAudio(),this.audio&&(this.audio.src=e,this.audio.volume=this.volume,this.audio.load())),this.render(),s&&e&&this.want&&this.arm()}ensureAudio(){if(this.audio)return;const e=new Audio;e.loop=!0,e.preload="metadata",e.volume=this.volume,e.addEventListener("play",()=>this.render()),e.addEventListener("pause",()=>this.render()),e.addEventListener("error",()=>{this.render(),this.url&&w("背景音乐加载失败，可能是格式不支持","err")}),this.audio=e}arm(){if(this.armed)return;this.armed=!0;const e=a=>{const s=a.target;s&&s.closest(".bgm")||(document.removeEventListener("pointerdown",e),document.removeEventListener("keydown",e),this.want&&this.audio&&this.audio.paused&&this.play())};document.addEventListener("pointerdown",e),document.addEventListener("keydown",e)}async play(){if(this.ensureAudio(),!(!this.audio||!this.url))try{await this.audio.play(),localStorage.setItem("qz.bgm","on")}catch{this.render()}}pause(){var e;(e=this.audio)==null||e.pause(),localStorage.setItem("qz.bgm","off"),this.render()}isPlaying(){return!!this.audio&&!this.audio.paused}toggle(){var e;if(!this.url){w("还没有设置背景音乐，可以在「设置」里上传","err");return}((e=this.audio)==null?void 0:e.paused)!==!1?this.play():this.pause()}setVolume(e){localStorage.setItem("qz.bgm.vol",String(e)),this.audio&&(this.audio.volume=e)}mount(){if(this.pill){this.render();return}const e=document.createElement("div");e.className="bgm",document.body.appendChild(e),this.pill=e,e.addEventListener("click",a=>{const s=a.target;if(s.closest("[data-bgm-toggle]")){this.toggle();return}s.closest(".bgm-meta")&&(location.hash="#/settings?tab=music")}),e.addEventListener("input",a=>{const s=a.target;s.matches(".bgm-vol")&&this.setVolume(Number(s.value))}),this.render(),this.url&&this.want&&this.arm()}unmount(){var e,a;(e=this.pill)==null||e.remove(),this.pill=null,(a=this.audio)==null||a.pause(),document.body.classList.remove("has-bgm")}render(){if(document.body.classList.toggle("has-bgm",!!this.url),!this.pill)return;const e=this.audio?!this.audio.paused:!1,a=Math.round(this.volume*100);window.dispatchEvent(new CustomEvent("qz:bgm",{detail:{playing:e}})),this.pill.innerHTML=`
      <div class="bgm-disc ${e?"spin":""}" data-bgm-toggle title="${e?"暂停":"播放"}">${b("music",16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${g(this.url?this.title:"未设置音轨")}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${e?"暂停":"播放"}">
        ${b(e?"pause":"play",14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${a}" aria-label="音量">
      <div class="bgm-wave ${e?"on":""}"><i></i><i></i><i></i><i></i></div>`}}const I=new ha;window.bgm=I;const Es="qz.mode",Ts=window.matchMedia("(prefers-color-scheme: dark)"),vt=new Set;function ma(){try{const t=localStorage.getItem(Es);return t==="dark"||t==="light"?t:"auto"}catch{return"auto"}}let Te=ma();function ga(){return Te}function De(){return Te==="dark"||Te==="auto"&&Ts.matches}function St(){var a;const t=De(),e=document.documentElement;e.dataset.appearance=t?"dark":"light",e.style.colorScheme=t?"dark":"light",(a=document.querySelector('meta[name="theme-color"]'))==null||a.setAttribute("content",t?"#131412":"#f7f4ee"),vt.forEach(s=>s())}function Ms(t){Te=t;try{localStorage.setItem(Es,t)}catch{}St()}function ba(){return Ms(De()?"light":"dark"),Te}function fa(t){return vt.add(t),()=>vt.delete(t)}Ts.addEventListener("change",()=>{Te==="auto"&&St()});St();function Lt(t="theme-toggle",e=17,a="icon-btn"){return`<button class="${a} theme-toggle" id="${t}" title="${qs()}" aria-label="切换深色 / 浅色">${b(De()?"sun":"moon",e)}</button>`}function qs(){return De()?"切换到浅色":"切换到深色"}function Et(t,e="theme-toggle"){const a=t.querySelector(`#${e}`);if(!a)return()=>{};const s=()=>{a.isConnected&&(a.innerHTML=b(De()?"sun":"moon",17),a.title=qs())};return a.addEventListener("click",()=>{ba(),s()}),fa(s)}function va(t,e){t.innerHTML=`
  <div class="auth">
    ${Lt("auth-theme",17)}
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
  </div>`,Et(t,"auth-theme");const a=t.querySelector("#auth-form"),s=t.querySelector("#auth-submit"),n=t.querySelector("#auth-hint"),l=Array.from(t.querySelectorAll(".auth-tab"));let i="login";const o=d=>{i=d,l.forEach(p=>p.classList.toggle("active",p.dataset.tab===d)),t.querySelectorAll('[data-only="register"]').forEach(p=>{p.hidden=d!=="register"});const h=a.elements.namedItem("nickname");h.required=d==="register",s.textContent=d==="login"?"登录":"创建空间",n.textContent=d==="login"?"还没有账号？点上面的「注册」，30 秒就能开通。":"空间号将作为你的主页地址，注册后不可修改。"};l.forEach(d=>d.addEventListener("click",()=>o(d.dataset.tab))),t.querySelectorAll(".demo-chip").forEach(d=>{d.addEventListener("click",()=>{var h,p;o("login"),a.elements.namedItem("uin").value=(h=d.dataset.uin)!=null?h:"",a.elements.namedItem("password").value=(p=d.dataset.pw)!=null?p:"",s.focus()})}),a.addEventListener("submit",async d=>{var r,v,y;d.preventDefault();const h=new FormData(a),p=String((r=h.get("uin"))!=null?r:"").trim(),c=String((v=h.get("password"))!=null?v:""),m=String((y=h.get("nickname"))!=null?y:"").trim();if(i==="register"&&!m){w("请填写昵称","err");return}s.disabled=!0,s.textContent=i==="login"?"登录中…":"创建中…";try{i==="login"?await S.login(p,c):await S.register(p,m,c),w(i==="login"?"欢迎回来":"空间已开通","ok"),await e()}catch($){w(g($.message),"err"),s.disabled=!1,s.textContent=i==="login"?"登录":"创建空间"}})}const As={private:"仅自己可见",unlisted:"不公开列出",public:""};function Rs(t){const e=t.cover||t.images[0]||"";return`<article class="feature card${e?"":" no-cover"}" data-post="${t.id}">
    ${e?`<a class="feature-cover" href="#/post/${t.id}"><img src="${g(e)}" alt="${g(t.title)}" loading="lazy"></a>`:""}
    <div class="feature-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        <span class="pill">${g(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${As[t.visibility]}</span>`:""}
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
  </article>`}function rt(t){const e=t.cover||t.images[0]||"";return`<article class="post-row" data-post="${t.id}">
    <div class="post-row-body">
      <div class="post-kicker">
        ${t.pinned?`<span class="pill pill-pin">${b("pin",11)}置顶</span>`:""}
        <span class="pill">${g(t.category)}</span>
        ${t.visibility!=="public"?`<span class="pill pill-lock">${b("lock",11)}${As[t.visibility]}</span>`:""}
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
  </article>`}function cs(t){return t.length?`<ul class="comment-list">${t.map(e=>`<li class="comment" data-cid="${e.id}">
        ${ae(e.author.avatar,e.author.nickname,34,e.author.uin)}
        <div class="comment-main">
          <div class="comment-head">
            <a class="comment-author" href="#/u/${g(e.author.uin)}">${g(e.author.nickname)}</a>
            <time>${ce(e.at)}</time>
            <button class="text-btn" data-reply="${g(e.author.nickname)}">回复</button>
            ${e.canDel?`<button class="text-btn danger" data-del-comment="${e.id}">删除</button>`:""}
          </div>
          <p class="comment-text">${e.replyTo?`<span class="comment-reply">回复 ${g(e.replyTo)}：</span>`:""}${g(e.content)}</p>
        </div>
      </li>`).join("")}</ul>`:'<p class="comment-empty">还没有评论，来说第一句。</p>'}function ka(t){return`<a class="album-card card" href="#/album/${t.id}">
    <div class="album-cover">
      ${t.cover?`<img src="${g(t.cover)}" alt="${g(t.name)}" loading="lazy">`:'<div class="cover-fallback"></div>'}
      <span class="album-count">${t.count} 张</span>
    </div>
    <div class="album-info">
      <h3>${g(t.name)}</h3>
      <p>${g(t.description||"还没有描述")}</p>
    </div>
  </a>`}async function ya(t,e){var l;const a=ve();t.innerHTML=`<div class="page">
    <section class="hero">
      <div class="hero-cover" style="background-image:url('${g(a.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ae(a.avatar,a.nickname,0,"",0)}</div>
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
      <div class="home-main" id="home-main">${et(2)}</div>
      <aside class="rail" id="home-rail"></aside>
    </div>
  </div>`,it(t);const s=t.querySelector("#home-main"),n=t.querySelector("#home-rail");try{const[{posts:i,total:o},d]=await Promise.all([S.posts({limit:7}),S.albums()]);if(!i.length)s.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("pen",22)}</div>
        <p class="empty-title">还没有文章</p>
        <p class="empty-desc">写下第一篇文章，这里就有了开始。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`;else{const p=(l=i.find(m=>m.pinned))!=null?l:i[0],c=i.filter(m=>m.id!==p.id);s.innerHTML=`
        ${Rs(p)}
        <div class="list-head">
          <h2>最新文章</h2>
          <a class="list-more" href="#/posts">全部 ${o} 篇 ${b("chevron",12)}</a>
        </div>
        <div class="post-list">${c.map(rt).join("")||'<p class="muted">暂无更多文章</p>'}</div>`}n.innerHTML=`
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
          <div class="rail-disc ${ht()?"spin":""}">${b("music",16)}</div>
          <div class="rail-music-meta">
            <b>${g(a.bgmTitle||"未设置音轨")}</b>
            <span>${a.bgmUrl?"正在循环播放":"去设置里上传一首"}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm btn-block" id="rail-play">
          ${ht()?b("pause",13):b("play",13)} ${ht()?"暂停":"播放"}
        </button>
      </section>

      <section class="rail-card">
        <h3>最近相册</h3>
        <div class="rail-albums">
          ${d.albums.slice(0,3).map(p=>`<a class="rail-album" href="#/album/${p.id}">
                <img src="${g(p.cover)}" alt="">
                <span>${g(p.name)}</span>
              </a>`).join("")||'<p class="muted">还没有相册</p>'}
        </div>
      </section>

      <section class="rail-card cta-card">
        <h3>留言板</h3>
        <p class="rail-bio">想说什么都可以，我都会看。</p>
        <a class="btn btn-ghost btn-sm btn-block" href="#/guestbook">${b("mail",13)} 去留言</a>
      </section>`;const h=n.querySelector("#rail-play");window.addEventListener("qz:bgm",()=>{var p;h&&((p=n.querySelector(".rail-disc"))==null||p.classList.toggle("spin",I.isPlaying()),h.innerHTML=`${I.isPlaying()?b("pause",13):b("play",13)} ${I.isPlaying()?"暂停":"播放"}`)}),h==null||h.addEventListener("click",()=>{I.toggle()})}catch(i){w(i.message,"err")}}function ht(){return I.isPlaying()}const $a=[{key:"latest",label:"最新"},{key:"popular",label:"最热"}];async function wa(t,e){const a=e.params.sort==="popular"?"popular":"latest",s=e.params.category||"全部",n=e.params.q||"";t.innerHTML=`<div class="page">
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
        ${$a.map(m=>`<button class="sort-btn ${m.key===a?"active":""}" data-sort="${m.key}">${m.label}</button>`).join("")}
      </div>
    </div>
    ${n?`<p class="search-note">搜索「${g(n)}」的结果</p>`:""}
    <div id="archive-list" class="archive-list">${et(3)}</div>
    <button class="btn btn-ghost btn-block" id="load-more" hidden>加载更多</button>
  </div>`;const l=t.querySelector("#archive-list"),i=t.querySelector("#load-more"),o=t.querySelector("#cat-row");let d,h=[];const p=()=>{const m=new Set(["全部"]);h.forEach(r=>r.category&&m.add(r.category)),o.innerHTML=Array.from(m).map(r=>`<button class="chip ${r===s?"active":""}" data-cat="${g(r)}">${g(r)}</button>`).join("")},c=async m=>{m&&(d=void 0,l.innerHTML=et(2));const r=await S.posts({category:s,sort:a,q:n,limit:8,before:d});h=m?r.posts:h.concat(r.posts);const v=r.posts.map(rt).join("");m?l.innerHTML=v:l.insertAdjacentHTML("beforeend",v),r.posts.length&&(d=r.posts[r.posts.length-1].at),i.hidden=!r.hasMore,t.querySelector("#archive-sub").textContent=`共 ${r.total} 篇 · 按${a==="popular"?"阅读量":"时间"}排序`,p(),m&&!r.posts.length&&(l.innerHTML=`<div class="card empty">
        <div class="empty-mark">${b("book",22)}</div>
        <p class="empty-title">这个分类下还没有文章</p>
        <p class="empty-desc">换个分类，或者写文章新的。</p>
        <a class="btn btn-primary" href="#/write">写文章</a>
      </div>`)};i.addEventListener("click",async()=>{i.disabled=!0;try{await c(!1)}catch(m){w(m.message,"err")}finally{i.disabled=!1}}),o.addEventListener("click",m=>{const r=m.target.closest("[data-cat]");if(!r)return;const v=new URLSearchParams;r.dataset.cat&&r.dataset.cat!=="全部"&&v.set("category",r.dataset.cat),a==="popular"&&v.set("sort","popular"),location.hash=`#/posts${v.toString()?"?"+v.toString():""}`}),t.querySelectorAll("[data-sort]").forEach(m=>{m.addEventListener("click",()=>{const r=new URLSearchParams;s!=="全部"&&r.set("category",s),m.dataset.sort==="popular"&&r.set("sort","popular"),location.hash=`#/posts${r.toString()?"?"+r.toString():""}`})});try{await c(!0)}catch(m){w(m.message,"err"),l.innerHTML='<div class="card empty"><p class="empty-title">加载失败</p></div>'}}function Tt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ke=Tt();function Cs(t){ke=t}var me={exec:()=>null};function he(t){let e=[];return a=>{let s=Math.max(0,Math.min(3,a-1)),n=e[s];return n||(n=t(s),e[s]=n),n}}function L(t,e=""){let a=typeof t=="string"?t:t.source,s={replace:(n,l)=>{let i=typeof l=="string"?l:l.source;return i=i.replace(z.caret,"$1"),a=a.replace(n,i),s},getRegex:()=>new RegExp(a,e)};return s}var zs=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),Ps="^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)",z={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,listInterruptsParagraph:/^ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,textIndentedContinuation:/^(?:\n(?: {4}| {0,3}\t)[ \t]*[^ \t\n][^\n]*)+/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+)[ \t]*)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,blockquoteMarkerWhitespace:/^( {0,3}>)(\t[ \t]*)/gm,blockquoteFenceOpen:/^ {0,3}(`{3,}(?=[^`]*$)|~{3,})/,blockquoteFenceClose:/^ {0,3}(`{3,}|~{3,})[ \t]*$/,blockquoteListItemStart:/^ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|$)/,nestedBlockMarker:/^ {0,3}(?:(?:[*+-]|\d{1,9}[.)])(?: |$)|> ?)/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\][ \t]+\S/,listReplaceTask:/^\[[ xX]\][ \t]+/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableHeader:new RegExp(Ps+"(?:\\n|$)"),tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:he(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:he(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:he(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:he(t=>new RegExp(`^ {0,${t}}#{1,6}(?:\\s|$)`)),pedanticHeadingBeginRegex:he(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:he(t=>new RegExp(`^ {0,${t}}(?:</?(?:${qt})(?:[ \\t]+|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:he(t=>new RegExp(`^ {0,${t}}>`)),nestedContainerMarkers:/^(?: {0,3}(?:(?:[*+-]|\d{1,9}[.)])[ \t]+|>[ \t]?))+/},xa=/^(?:[ \t]*(?:\n|$))+/,Sa=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,La=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}(?:(?=`)\1`*|(?=~)\1~*)[ \t]*(?=\n|$)|$)/,Be=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ea=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Mt=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,qt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Oe=L(" {0,3}(?:</?(?:tag)(?:[ \\t]+|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",qt).getRegex(),Is=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+)[ \t]*(?:\n+|$)/,Hs=L(Is).replace(/bull/g,Mt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/\|table/g,"").replace(/html/g,Oe).getRegex(),Ta=L(Is).replace(/bull/g,Mt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).replace(/html/g,Oe).getRegex(),At=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Ma=/^[^\n]+/,Rt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\\n]|\n(?![ \t]*\n))+/,qa=L(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<(?:\\.|[^\n<>\\])*>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Rt).replace("title",/(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\\n]|\n(?!\n))*'|\((?:\\[\s\S]|[^()\\])*\))/).getRegex(),Aa=L(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Mt).getRegex(),Ct=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ra=L("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?:[ \\t]+|\\n|/?>|$)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*?[ \\t]*/?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Ct).replace("tag",qt).replace("attribute",/[ \t]+[a-zA-Z:_][\w.:-]*(?:[ \t]*=[ \t]*"[^"\n]*"|[ \t]*=[ \t]*'[^'\n]*'|[ \t]*=[ \t]*[^\s"'=<>`]+)?/).getRegex(),_s=t=>L(At).replace("hr",Be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html",Oe).getRegex(),Ca=_s(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),za=_s(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),ds=/ {0,3}> ?(?:(?!blank)(paragraph)|[^\n]*)(?:\n|$)/,Pa=L(/^(first)(?:next)*/).replace("first",L(ds).replace("blank",/[ \t]*(?:\n|$)| {4}/).getRegex()).replace("next",L(ds).replace("blank",/[ \t]*(?:\n|$)/).getRegex()).replace(/paragraph/g,za).getRegex(),zt={blockquote:Pa,code:Sa,def:qa,fences:La,heading:Ea,hr:Be,html:Ra,lheading:Hs,list:Aa,newline:xa,paragraph:Ca,table:me,text:Ma},Ia=L(Ps+"(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html",Oe).getRegex(),Ha={...zt,lheading:Ta,table:Ia,paragraph:L(At).replace("hr",Be).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",z.tableHeader).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html",Oe).getRegex()},_a={...zt,html:L(`^ *(?:comment(?: *\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1>(?: *\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?>(?: *\\n{2,}|\\s*$))`).replace("comment",Ct).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:me,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:L(At).replace("hr",Be).replace("heading",` *#{1,6} *[^
]`).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").replace("lheading",Hs).getRegex()},Da=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ba=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ds=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,Oa=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Y=/[\p{P}\p{S}]/u,qe=/[\s\p{P}\p{S}]/u,je=/[^\s\p{P}\p{S}]/u,ja=L(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,qe).getRegex(),Na=/[\p{Pi}\p{Ps}"']/u,Bs=/(?!~)[\p{P}\p{S}]/u,Ua=/(?!~)[\s\p{P}\p{S}]/u,Fa=/(?:[^\s\p{P}\p{S}]|~)/u,Za=L(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",zs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Os=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Va=L(Os,"u").replace(/punct/g,Y).getRegex(),Ga=L(Os,"u").replace(/punct/g,Bs).getRegex(),Qa=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Wa=L(Qa,"u").replace(/openQuote/g,Na).replace(/punct/g,Y).getRegex(),js="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ka=L(js,"gu").replace(/notPunctSpace/g,je).replace(/punctSpace/g,qe).replace(/punct/g,Y).getRegex(),Xa=L(js,"gu").replace(/notPunctSpace/g,Fa).replace(/punctSpace/g,Ua).replace(/punct/g,Bs).getRegex(),Ya="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Ja=L(Ya,"gu").replace(/notPunctSpace/g,je).replace(/punctSpace/g,qe).replace(/punct/g,Y).getRegex(),en=L("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,je).replace(/punctSpace/g,qe).replace(/punct/g,Y).getRegex(),tn="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",sn=L(tn,"gu").replace(/notPunctSpace/g,je).replace(/punctSpace/g,qe).replace(/punct/g,Y).getRegex(),an=L(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Y).getRegex(),nn="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",rn=L(nn,"gu").replace(/notPunctSpace/g,je).replace(/punctSpace/g,qe).replace(/punct/g,Y).getRegex(),ln=L(/\\(punct)/,"gu").replace(/punct/g,Y).getRegex(),on=L(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,Y).getRegex(),cn=L(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),dn=L(Ct).replace("(?:-->|$)","-->").getRegex(),un=L("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",dn).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ns=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,tt=L(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Ns).getRegex(),lt=/\\[^ \t\n\x00-\x1f]|\\(?=[ \t\n])|[^ \t\n\x00-\x1f\\()]/,pn=L(/\((?:char)*\)/).replace("char",lt).getRegex(),hn=L(/\((?:char|p1)*\)/).replace("char",lt).replace("p1",pn).getRegex(),mn=L(/\((?:char|p2)*\)/).replace("char",lt).replace("p2",hn).getRegex(),gn=L(/(?!<)(?:char|p3)+/).replace("char",lt).replace("p3",mn).getRegex(),bn=L(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",tt).replace("href",L(/<(?:\\.|[^\n<>\\])*>|bareHref|(?=\))/).replace("bareHref",gn).getRegex()).replace("title",/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\((?:\\[\s\S]|[^)\\])*\)/).getRegex(),fn=L(/^!?\[(label)\]\[(ref)\]/).replace("label",tt).replace("ref",Rt).getRegex(),vn=L(/^!?\[(ref)\](?:\[\])?/).replace("ref",Rt).getRegex(),us=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,kn=L(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Ns).getRegex(),yn=L("reflink|nolink(?!\\()","g").replace("reflink",L(/^!?\[(label)\]\[(ref)\]/).replace("label",kn).replace("ref",us).getRegex()).replace("nolink",L(/^!?\[(ref)\](?:\[\])?/).replace("ref",us).getRegex()).getRegex(),ps=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,$n=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,wn=L(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,$n).getRegex(),Pt={_backpedal:me,anyPunctuation:ln,anyPunctuationOutsideCode:on,autolink:cn,blockSkip:Za,br:Ds,code:Ba,del:me,delLDelim:me,delRDelim:me,emStrongLDelim:Va,emStrongRDelimAst:Ka,emStrongRDelimUnd:en,escape:Da,link:bn,nolink:vn,punctuation:ja,reflink:fn,reflinkSearch:yn,tag:un,text:Oa,url:me},xn={...Pt,emStrongLDelim:Wa,emStrongRDelimAst:Ja,emStrongRDelimUnd:sn,link:L(/^!?\[(label)\]\((.*?)\)/).replace("label",tt).getRegex(),reflink:L(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",tt).getRegex()},kt={...Pt,emStrongRDelimAst:Xa,emStrongLDelim:Ga,delLDelim:an,delRDelim:rn,url:L(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",wn).replace("protocol",ps).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:L(/^(?:[A-Za-z0-9.+-]+(?=@)|[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|wwwStart|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",ps).replace(/emailProtocol/g,/(?:mailto|xmpp):/).replace("wwwStart",zs?"(?<![^\\s*_~(])www\\.":"www\\.").getRegex()},Sn={...kt,br:L(Ds).replace("{2,}","*").getRegex(),text:L(kt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ve={normal:zt,gfm:Ha,pedantic:_a},Pe={normal:Pt,gfm:kt,breaks:Sn,pedantic:xn},Ln={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},hs=t=>Ln[t];function O(t,e){if(e){if(z.escapeTest.test(t))return t.replace(z.escapeReplace,hs)}else if(z.escapeTestNoEncode.test(t))return t.replace(z.escapeReplaceNoEncode,hs);return t}function En(t){return z.numericCharacterReference.test(t)?t.replace(z.numericCharacterReferenceOrAmpersand,(e,a,s)=>{if(a===void 0&&s===void 0)return"&amp;";let n=a===void 0?Number.parseInt(s,16):Number.parseInt(a,10);return n===0||n>1114111||n>=55296&&n<=57343?"�":n===38?"&amp;":String.fromCodePoint(n)}):t}function ms(t){try{t=encodeURI(t).replace(z.percentDecode,"%")}catch{return null}return t}function mt(t,e){var l;let a=t.replace(z.findPipe,(i,o,d)=>{let h=!1,p=o;for(;--p>=0&&d[p]==="\\";)h=!h;return h?"|":" |"}),s=a.split(z.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!((l=s.at(-1))!=null&&l.trim())&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(z.slashPipe,"|");return s}function se(t,e,a){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function gs(t){let e=t.split(`
`),a=e.length-1;for(;a>=0&&z.blankLine.test(e[a]);)a--;return e.length-a<=2?t:e.slice(0,a+1).join(`
`)}function st(t){return t.trim().replace(z.multipleSpaceGlobal," ").toLowerCase().toUpperCase().toLowerCase()}function bs(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let a=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])a++;else if(t[s]===e[1]&&(a--,a<0))return s;return a>0?-2:-1}var Me=new WeakMap;function It(t){let e={"*":-1,_:-1},a=-1,s=t.length;for(let n=0;n<s;n++){let l=t[n];if(l!=="*"&&l!=="_"&&l!=="~")continue;let i=n===0?`
`:t[n-1],o=n+1;for(;o<s&&t[o]===l;)o++;i!==" "&&i!=="	"&&i!==`
`&&i!=="\r"&&i!=="\f"&&(l==="~"?a=n:e[l]=n),n=o-1}return{maskedSrc:t,lastPossibleEmStrongCloserIndex:e,lastPossibleDelCloserIndex:a}}function Tn(t,e){let a=It(e),s=Me.get(t);s?s.push(a):Me.set(t,[a])}function Mn(t){let e=Me.get(t);e&&(e.pop(),e.length===0&&Me.delete(t))}function Us(t,e,a){var n;let s=(n=Me.get(t))==null?void 0:n.at(-1);return s&&s.maskedSrc===e?s.lastPossibleEmStrongCloserIndex[a]:It(e).lastPossibleEmStrongCloserIndex[a]}function Fs(t,e){var s;let a=(s=Me.get(t))==null?void 0:s.at(-1);return a&&a.maskedSrc===e?a.lastPossibleDelCloserIndex:It(e).lastPossibleDelCloserIndex}function Ge(t,e=0){let a=e,s="";for(let n of t)if(n==="	"){let l=4-a%4;s+=" ".repeat(l),a+=l}else s+=n,a++;return s}function qn(t){let e,a=!1;return t.map(s=>{var h,p,c;if(a)return s;let{depth:n,expanded:l,keptIndent:i,content:o}=An(s,(h=e==null?void 0:e.depth)!=null?h:1/0);if((e==null?void 0:e.depth)!==n&&(e=void 0),e){let m=(p=z.blockquoteFenceClose.exec(o))==null?void 0:p[1];return!m||m[0]!==e.marker[0]||m.length<e.marker.length?i:(e=void 0,l)}if(a=z.blockquoteListItemStart.test(o),a)return s;let d=(c=z.blockquoteFenceOpen.exec(o))==null?void 0:c[1];return d&&(e={marker:d,depth:n}),l}).join(`
`)}function An(t,e){let a=0,s=0,n=0,l=0,i="";for(;n<e;){let p=a,c=s;for(;t[p]===" "||t[p]==="	";)c+=fs(t[p],c),p++;if(t[p]!==">"||c-l>3)break;i+=" ".repeat(c-s)+">",n++,a=p+1,s=c+1,l=t[a]===" "||t[a]==="	"?s+1:s}if(n===0)return{depth:n,expanded:t,keptIndent:t,content:t};let o="",d="";for(;(t[a]===" "||t[a]==="	")&&s<l+4;){let p=fs(t[a],s);o+=" ".repeat(p),d+=s<l&&p>1?" ".repeat(p):t[a],s+=p,a++}let h=t.slice(a);return{depth:n,expanded:i+o+h,keptIndent:i+d+h,content:" ".repeat(Math.max(0,s-l))+h}}function fs(t,e){return t==="	"?4-e%4:1}function Rn(t,e){let a="";for(let s=0;s<t.length;s++){if(t[s]==="`"){let n=e.inline.code.exec(t.slice(s));if(n){a+=n[0],s+=n[0].length-1;continue}}if(t[s]==="\\"&&(t[s+1]==="["||t[s+1]==="]")){a+=t[s+1],s++;continue}a+=t[s]}return a}function vs(t,e,a,s,n){let l=e.href,i=e.title||null,o=Rn(t[1],n),d=t[0].charAt(0)==="!",h=s.state.inLink,p=s.state.linkEmitted,c=s.state.inRawBlock;s.state.inLink=!0,s.state.linkEmitted=!1;let m=s.inlineTokens(o),r=s.state.linkEmitted;if(s.state.linkEmitted=p,s.state.inLink=h,!d){if(r){s.state.inRawBlock=c;return}s.state.linkEmitted=!0}return{type:d?"image":"link",raw:a,href:l,title:i,text:o,tokens:m}}function Cn(t,e,a){let s=t.match(a.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(l=>{let i=l.match(a.other.beginningSpace);if(i===null)return l;let[o]=i;return l.slice(Math.min(o.length,n.length))}).join(`
`)}function ks(t,e,a,s){if(!e.includes("<"))return!1;for(let n=0;n<e.length;n++){if(e[n]==="\\"){n++;continue}if(e[n]==="`"){let o=s.inline.code.exec(e.slice(n));if(o){n+=o[0].length-1;continue}}if(e[n]!=="<")continue;let l=t.slice(a+n),i=s.inline.tag.exec(l)||s.inline.autolink.exec(l);if(i){if(i[0].length>e.length-n)return!0;n+=i[0].length-1}}return!1}var ge=class{constructor(t){M(this,"options");M(this,"rules");M(this,"lexer");this.options=t||ke}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let a=this.options.pedantic?e[0]:gs(e[0]),s=a.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:a,codeBlockStyle:"indented",text:s}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let a=e[0],s=Cn(a,e[3]||"",this.rules);return e[3]!==void 0&&(s===""||s.endsWith(`
`))&&(s+=`
`),{type:"code",raw:a,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let a=e[2].trim();if(this.rules.other.endingHash.test(a)){let s=se(a,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceTabChar.test(s))&&(a=s.trim())}return{type:"heading",raw:se(e[0],`
`),depth:e[1].length,text:a,tokens:this.lexer.inline(a)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:se(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let a=se(e[0],`
`).split(`
`),s="",n="",l=[];for(;a.length>0;){let i=!1,o=[],d;for(d=0;d<a.length;d++)if(this.rules.other.blockquoteStart.test(a[d]))o.push(a[d]),i=!0;else if(!i)o.push(a[d]);else break;a=a.slice(d);let h=o.join(`
`),p=(this.lexer.state.top&&!this.lexer.state.inBlockquote&&h.includes("	")?qn(o):h).replace(this.rules.other.blockquoteMarkerWhitespace,(v,y,$)=>$.startsWith(" ")?y+" "+$.slice(1):y+Ge($,y.length)).replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${h}`:h,n=n?`${n}
${p}`:p;let c=this.lexer.state.top,m=this.lexer.state.inBlockquote;if(this.lexer.state.top=!0,this.lexer.state.inBlockquote=!0,this.lexer.blockTokens(p,l,!0),this.lexer.state.top=c,this.lexer.state.inBlockquote=m,a.length===0)break;let r=l.at(-1);if((r==null?void 0:r.type)==="code"||(r==null?void 0:r.type)==="heading"||(r==null?void 0:r.type)==="hr"||(r==null?void 0:r.type)==="html"||(r==null?void 0:r.type)==="table")break;if((r==null?void 0:r.type)==="blockquote"){let v=r,y=a.join(`
`),$=v.raw+`
`+y.replace(this.rules.other.blockquoteSetextReplace2,"");this.lexer.state.inBlockquote=!0;let E=this.blockquote($);this.lexer.state.inBlockquote=m,l[l.length-1]=E;let T=$.substring(E.raw.length).replace(/^\n/,""),P=T?T.split(`
`).length:0,R=P?a.slice(0,-P):a;if(R.length>0&&(s=`${s}
${R.join(`
`)}`),n=n.substring(0,n.length-v.text.length)+E.text,a=a.slice(R.length),a.length>0&&this.rules.other.blockquoteStart.test(a[0]))continue;break}else if((r==null?void 0:r.type)==="list"){let v=r,y=v.raw+`
`+a.join(`
`),$=this.list(y);l[l.length-1]=$;let E=$.raw.length>v.raw.length?y.slice(v.raw.length+1,$.raw.length).split(`
`).length:0;if(E>0){let T=a.slice(0,E).join(`
`);s=`${s}
${T}`,n=`${n}
${T}`}if(a=a.slice(E),a.length>0&&!this.rules.other.blockquoteStart.test(a[0]))break;continue}}return{type:"blockquote",raw:s,tokens:l,text:n}}}list(t){var a;let e=this.rules.block.list.exec(t);if(e){if(!this.options.pedantic&&((a=this.lexer.state.lastToken)==null?void 0:a.type)==="text"&&!this.rules.other.listInterruptsParagraph.test(t))return;let s=t,n=()=>s.length-t.length,l=e[1].trim(),i=l.length>1,o={type:"list",raw:"",ordered:i,start:i?+l.slice(0,-1):"",loose:!1,items:[]};l=i?`\\d{1,9}\\${l.slice(-1)}`:`\\${l}`,this.options.pedantic&&(l=i?l:"[*+-]");let d=this.rules.other.listItemRegex(l),h=!1;for(;t;){let m=!1,r="";if(!(e=d.exec(t))||this.rules.block.hr.test(t))break;let v=n();t=t.substring(e[0].length);let y=e[2].split(`
`,1)[0],$=e[1].length,E=this.options.pedantic?Ge(y,$):y.replace(this.rules.other.leadingSpaceTab,ne=>Ge(ne,$)),T=t.split(`
`,1)[0],P=!E.trim(),R=0;if(this.options.pedantic?(R=2,r=E.trimStart()):P?R=$+1:(R=E.search(this.rules.other.nonSpaceChar),R=R>4?1:R,r=E.slice(R),R+=$),P&&this.rules.other.blankLine.test(T)&&(t=t.substring(T.length+1),m=!0),!m){let ne=this.rules.other.nextBulletRegex(R),ue=this.rules.other.hrRegex(R),ie=this.rules.other.fencesBeginRegex(R),_=this.options.pedantic?this.rules.other.pedanticHeadingBeginRegex(R):this.rules.other.headingBeginRegex(R),J=this.rules.other.htmlBeginRegex(R),F=this.rules.other.blockquoteBeginRegex(R),ee=!1;for(;t;){let Q=t.split(`
`,1)[0],j;if(T=Q,this.options.pedantic?(T=T.replace(this.rules.other.listReplaceNesting,"  "),j=T):j=T.replace(this.rules.other.leadingSpaceTab,H=>Ge(H)),ie.test(T)||_.test(T)||J.test(T)||F.test(T)||ne.test(T)||ue.test(T))break;if(j.search(this.rules.other.nonSpaceChar)>=R||!T.trim())r+=`
`+j.slice(R),ee=!1;else{if(P)break;let H=E;if(!this.options.pedantic&&!r.includes(`
`)&&!E.includes("	")){let re;for(;!ue.test(H)&&(re=this.rules.other.nestedBlockMarker.exec(H));)H=H.slice(re[0].length);if(!H.trim())break}if(H.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||ie.test(H)||_.test(H)||J.test(H)||ue.test(H))break;if(!this.options.pedantic&&!ee){let re=E.replace(this.rules.other.nestedContainerMarkers,"");if(this.rules.block.fences.test(re)||this.rules.block.heading.test(re)||this.rules.block.hr.test(re))break}let ye=!this.options.pedantic&&/^ {0,3}(?:=+|-+) *$/.test(T)&&this.rules.block.lheading.test(`${E}
${T}`)?`    ${j.replace(/^ {0,3}/,"")}`:T;r+=`
`+ye,ee=!0}P=!T.trim(),t=t.substring(Q.length+1),E=j.slice(R)}}let de=s.slice(v,n());o.loose||(h?o.loose=!0:this.rules.other.doubleBlankLine.test(de)&&(h=!0)),o.items.push({type:"list_item",raw:de,task:!!this.options.gfm&&this.rules.other.listIsTask.test(r),loose:!1,text:r,tokens:[]})}let p=o.items.at(-1);if(p)p.raw=p.raw.trimEnd(),p.text=p.text.trimEnd();else return;o.raw=s.slice(0,n()).trimEnd();let c=[];for(let m of o.items)if(this.lexer.state.top=!1,c.push(this.lexer.inlineQueue.length),m.tokens=this.lexer.blockTokens(m.text,[]),!o.loose){let r=m.tokens.filter(y=>y.type==="space"),v=r.length>0&&r.some(y=>this.rules.other.anyLine.test(y.raw));o.loose=v}for(let m=0;m<o.items.length;m++){let r=o.items[m],v=r.tokens[0];if(r.task&&((v==null?void 0:v.type)==="text"||(v==null?void 0:v.type)==="paragraph")){r.text=r.text.replace(this.rules.other.listReplaceTask,""),v.raw=v.raw.replace(this.rules.other.listReplaceTask,""),v.text=v.text.replace(this.rules.other.listReplaceTask,"");let y=this.lexer.inlineQueue;for(let E=c[m];E<y.length;E++)if(y[E].tokens===v.tokens){y[E].src=y[E].src.replace(this.rules.other.listReplaceTask,"");break}let $=this.rules.other.listTaskCheckbox.exec(r.raw);if($){let E={type:"checkbox",raw:$[0]+" ",checked:$[0]!=="[ ]"};r.checked=E.checked,o.loose?r.tokens[0]&&["paragraph","text"].includes(r.tokens[0].type)&&"tokens"in r.tokens[0]&&r.tokens[0].tokens?(r.tokens[0].raw=E.raw+r.tokens[0].raw,r.tokens[0].text=E.raw+r.tokens[0].text,r.tokens[0].tokens.unshift(E)):r.tokens.unshift({type:"paragraph",raw:E.raw,text:E.raw,tokens:[E]}):r.tokens.unshift(E)}}else r.task&&(r.task=!1)}if(o.loose)for(let m of o.items){m.loose=!0;for(let r of m.tokens)r.type==="text"&&(r.type="paragraph")}return o}}html(t){var a;let e=this.rules.block.html.exec(t);if(e){if(((a=this.lexer.state.lastToken)==null?void 0:a.type)==="paragraph"&&!this.rules.other.htmlBeginRegex(4).test(t))return;let s=gs(e[0]);return{type:"html",block:!0,raw:s,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:s}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&bs(e[2],"()")!==-1)return;let a=st(e[1]),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:a,raw:se(e[0],`
`),href:s,title:n}}}table(t){var i;let e,a;if(this.options.gfm&&!this.options.pedantic){let o=this.rules.other.tableHeader.exec(t);if(!o||!this.rules.other.tableDelimiter.test(o[2])||(e=mt(o[1]),a=o[2].replace(this.rules.other.tableAlignChars,"").split("|"),e.length!==a.length))return}let s=this.rules.block.table.exec(t);if(!s||!this.rules.other.tableDelimiter.test(s[2]))return;e!=null||(e=mt(s[1])),a!=null||(a=s[2].replace(this.rules.other.tableAlignChars,"").split("|"));let n=(i=s[3])!=null&&i.trim()?s[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],l={type:"table",raw:se(s[0],`
`),header:[],align:[],rows:[]};if(e.length===a.length){for(let o of a)this.rules.other.tableAlignRight.test(o)?l.align.push("right"):this.rules.other.tableAlignCenter.test(o)?l.align.push("center"):this.rules.other.tableAlignLeft.test(o)?l.align.push("left"):l.align.push(null);for(let o=0;o<e.length;o++)l.header.push({text:e[o],tokens:this.lexer.inline(e[o]),header:!0,align:l.align[o]});for(let o of n)l.rows.push(mt(o,l.header.length).map((d,h)=>({text:d,tokens:this.lexer.inline(d),header:!1,align:l.align[h]})));return l}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let a=e[1].trim();return{type:"heading",raw:se(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:a,tokens:this.lexer.inline(a)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let a=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:a,tokens:this.lexer.inline(a)}}}text(t){let e=this.rules.block.text.exec(t);if(e){let a=e[0],s=e[0],n=this.rules.other.textIndentedContinuation.exec(t.slice(a.length));return n&&(a+=n[0],s+=n[0].replace(this.rules.other.codeRemoveIndent,"")),{type:"text",raw:a,text:s,tokens:this.lexer.inline(s)}}}escape(t){if(t.charCodeAt(0)!==92)return;let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=t.charCodeAt(0);if(e!==91&&e!==33)return;let a=this.rules.inline.link.exec(t);if(a){let s=a[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&ks(t,a[1],s,this.rules))return;let n=a[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let d=se(n.slice(0,-1),"\\");if((n.length-d.length)%2===0)return}else{let d=bs(a[2],"()");if(d===-2)return;if(d>-1){let h=(a[0].indexOf("!")===0?5:4)+a[1].length+d;a[2]=a[2].substring(0,d),a[0]=a[0].substring(0,h).trim(),a[3]=""}}let l=se(a[0].slice(0,-1),"\\");if((a[0].length-l.length)%2===0)return;let i=a[2],o="";if(this.options.pedantic){let d=this.rules.other.pedanticHrefTitle.exec(i);d&&(i=d[1],o=d[3])}else o=a[3]?a[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),vs(a,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:o&&o.replace(this.rules.inline.anyPunctuation,"$1")},a[0],this.lexer,this.rules)}}reflink(t,e){let a=t.charCodeAt(0);if(a!==91&&a!==33)return;let s;if((s=this.rules.inline.reflink.exec(t))||(s=this.rules.inline.nolink.exec(t))){let n=s[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&ks(t,s[1],n,this.rules))return;let l=e[st(s[2]||s[1])];if(!l){let i=s[0].charAt(0);return{type:"text",raw:i,text:i}}return vs(s,l,s[0],this.lexer,this.rules)}}emStrong(t,e,a=""){var m;let s=this.rules.inline.emStrongLDelim.exec(t);if(!s||!s[1]&&!s[2]&&!s[3]&&!s[4])return;let n=s[0][0],l=a===n,i=e.length-t.length,o=i;for(;!this.options.pedantic&&o>0&&e[o-1]===n;)o--;let d=(m=[...e.slice(Math.max(0,o-2),o)].at(-1))!=null?m:"",h=d==="*"||d==="_"||!!this.rules.inline.punctuation.exec(d);o<i&&(a=d);let p=o<i?h:a==="*"||a==="_"||!!this.rules.inline.punctuation.exec(a);if(s[4]&&a.match(this.rules.other.unicodeAlphaNumeric))return;let c=s[1]||s[3]||"";if(!c||!a||p){let r=[...s[0]].length-1,v,y,$=r,E=0,T=i-o+r,P=!this.options.pedantic&&!!d.trim()&&(!!c||n==="*"&&!h);if(n!=="*"&&n!=="_")return;let R=n==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd,de=Us(this,e,n),ne=e.length-t.length+r;if(de<ne)return;e=e.slice(-1*t.length+r);let ue=de-ne;for(R.lastIndex=0;(s=R.exec(e))!==null&&!(s.index>ue);){if(v=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!v)continue;if(y=[...v].length,s[3]||s[4]){$+=y;continue}else if((s[5]||s[6]||P)&&T%3&&!((T+y)%3)){if(l&&(s[5]||s[6]))break;E+=y;continue}if($-=y,$>0)continue;y=Math.min(y,y+$+E);let ie=[...s[0]][0].length,_=t.slice(0,r+s.index+ie+y);if(Math.min(r,y)%2){let F=_.slice(1,-1);return{type:"em",raw:_,text:F,tokens:this.lexer.inlineTokens(F)}}let J=_.slice(2,-2);return{type:"strong",raw:_,text:J,tokens:this.lexer.inlineTokens(J)}}}}codespan(t){if(t.charCodeAt(0)!==96)return;let e=this.rules.inline.code.exec(t);if(e){let a=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(a),n=this.rules.other.startingSpaceChar.test(a)&&this.rules.other.endingSpaceChar.test(a);return s&&n&&(a=a.substring(1,a.length-1)),{type:"codespan",raw:e[0],text:a}}}br(t){let e=t.charCodeAt(0);if(e!==32&&e!==92&&e!==10)return;let a=this.rules.inline.br.exec(t);if(a)return{type:"br",raw:a[0]}}del(t,e,a=""){if(t.charCodeAt(0)!==126)return;let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!a||this.rules.inline.punctuation.exec(a))){let n=[...s[0]].length-1,l,i,o=n,d=this.rules.inline.delRDelim,h=Fs(this,e),p=e.length-t.length+n;if(h<p)return;e=e.slice(-1*t.length+n);let c=h-p;for(d.lastIndex=0;(s=d.exec(e))!==null&&!(s.index>c);){if(l=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!l||(i=[...l].length,i!==n))continue;if(s[3]||s[4]){o+=i;continue}if(o-=i,o>0)continue;i=Math.min(i,i+o);let m=[...s[0]][0].length,r=t.slice(0,n+s.index+m+i),v=r.slice(n,-n);return{type:"del",raw:r,text:v,tokens:this.lexer.inlineTokens(v)}}}}autolink(t){if(t.charCodeAt(0)!==60)return;let e=this.rules.inline.autolink.exec(t);if(e){let a,s;return e[2]==="@"?(a=e[1],s="mailto:"+a):(a=e[1],s=a),{type:"link",raw:e[0],text:a,href:s,autolink:!0,tokens:[{type:"text",raw:a,text:a}]}}}url(t){var a,s;let e;if(e=this.rules.inline.url.exec(t)){let n,l;if(e[2]==="@")n=e[0],l="mailto:"+n;else{let i;do i=e[0],e[0]=(s=(a=this.rules.inline._backpedal.exec(e[0]))==null?void 0:a[0])!=null?s:"";while(i!==e[0]);n=e[0],e[1]==="www."?l="http://"+e[0]:l=e[0]}return{type:"link",raw:e[0],text:n,href:l,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let a=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:a?e[0]:En(e[0]),escaped:a}}}},G,Zs,yt,Vs,Gs,be,Z=(be=class{constructor(e){ns(this,G);M(this,"tokens");M(this,"options");M(this,"state");M(this,"inlineQueue");M(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ke,this.options.tokenizer=this.options.tokenizer||new ge,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0,inBlockquote:!1};let a={other:z,block:Ve.normal,inline:Pe.normal};this.options.pedantic?(a.block=Ve.pedantic,a.inline=Pe.pedantic):this.options.gfm&&(a.block=Ve.gfm,this.options.breaks?a.inline=Pe.breaks:a.inline=Pe.gfm),this.tokenizer.rules=a}static get rules(){return{block:Ve,inline:Pe}}static lex(e,a){return new be(a).lex(e)}static lexInline(e,a){return new be(a).inlineTokens(e)}lex(e){e=e.replace(z.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let a=0;a<this.inlineQueue.length;a++){let s=this.inlineQueue[a];this.state.inRawBlock=!1,this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,a=[],s=!1){var d,h,p;this.tokenizer.lexer=this;let n=this.state.lastToken;this.options.pedantic&&(e=e.replace(z.tabCharGlobal,"    ").replace(z.spaceLine,""));let l=1/0,i,o=this.options.gfm&&!this.options.pedantic&&this.tokenizer.paragraph===ge.prototype.paragraph;for(;e;){if(e.length<l)l=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}this.state.lastToken=a.at(-1);let c;if((h=(d=this.options.extensions)==null?void 0:d.block)!=null&&h.some(r=>(c=r.call({lexer:this},e,a))?(e=e.substring(c.raw.length),a.push(c),!0):!1))continue;if(c=this.tokenizer.space(e)){e=e.substring(c.raw.length);let r=a.at(-1);c.raw.length===1&&r!==void 0?r.raw+=`
`:a.push(c);continue}if(c=this.tokenizer.code(e)){e=e.substring(c.raw.length);let r=a.at(-1);(r==null?void 0:r.type)==="paragraph"||(r==null?void 0:r.type)==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+c.raw,r.text+=`
`+c.text,this.inlineQueue.at(-1).src=r.text):a.push(c);continue}if(c=this.tokenizer.fences(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.heading(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.hr(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.blockquote(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.list(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.html(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.def(e)){e=e.substring(c.raw.length);let r=a.at(-1);(r==null?void 0:r.type)==="paragraph"||(r==null?void 0:r.type)==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+c.raw,r.text+=`
`+c.raw,this.inlineQueue.at(-1).src=r.text):(this.tokens.links[c.tag]||(this.tokens.links[c.tag]={href:c.href,title:c.title}),a.push(c));continue}if(c=this.tokenizer.table(e)){e=e.substring(c.raw.length),a.push(c);continue}if(c=this.tokenizer.lheading(e)){e=e.substring(c.raw.length),a.push(c);continue}let m=e;if((p=this.options.extensions)!=null&&p.startBlock){let r=1/0,v=e.slice(1),y;this.options.extensions.startBlock.forEach($=>{y=$.call({lexer:this},v),typeof y=="number"&&y>=0&&(r=Math.min(r,y))}),r<1/0&&r>=0&&(m=e.substring(0,r+1))}if(this.state.top&&(c=this.tokenizer.paragraph(m))){let r=a.at(-1);(s||r===i&&o)&&(r==null?void 0:r.type)==="paragraph"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+c.raw,r.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text,i=r):(a.push(c),i=c),s=m.length!==e.length,e=e.substring(c.raw.length);continue}if(c=this.tokenizer.text(e)){e=e.substring(c.raw.length);let r=a.at(-1);(r==null?void 0:r.type)==="text"?(r.raw+=(r.raw.endsWith(`
`)?"":`
`)+c.raw,r.text+=`
`+c.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=r.text):a.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,this.state.lastToken=n,a}inline(e,a=[]){return this.inlineQueue.push({src:e,tokens:a}),a}linkInText(e){if(!e.includes("["))return!1;let a=this.tokenizer.rules.inline.link;for(let s of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(a.test(s[0])&&e.charAt(s.index-1)!=="!")return!0;for(let s of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let n=s[0],l=n.lastIndexOf("[");if(!(n.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,st(n.slice(l+1,-1))))&&!(l>1&&this.linkInText(n.slice(1,l-1))))return!0}return!1}inlineTokens(e,a=[]){this.tokenizer.lexer=this;let s=this.state.linkParenPossible;this.state.linkParenPossible=e.includes(")");try{return Se(this,G,Zs).call(this,e,a)}finally{this.state.linkParenPossible=s}}infiniteLoopError(e){let a="Infinite loop on byte: "+e;if(this.options.silent)console.error(a);else throw new Error(a)}},G=new WeakSet,Zs=function(e,a){var l;let s=e.includes("*")||e.includes("_")||e.includes("~"),n=s||(l=this.options.hooks)!=null&&l.emStrongMask||this.tokenizer.emStrong!==ge.prototype.emStrong||this.tokenizer.del!==ge.prototype.del?Se(this,G,Gs).call(this,e):e;if(!s)return Se(this,G,yt).call(this,e,n,a);Tn(this.tokenizer,n);try{return Se(this,G,yt).call(this,e,n,a)}finally{Mn(this.tokenizer)}},yt=function(e,a,s){var o,d,h;let n=!1,l="",i=1/0;for(;e;){if(e.length<i)i=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}n||(l=""),n=!1;let p;if((d=(o=this.options.extensions)==null?void 0:o.inline)!=null&&d.some(r=>(p=r.call({lexer:this},e,s))?(e=e.substring(p.raw.length),s.push(p),!0):!1))continue;if(p=this.tokenizer.escape(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.tag(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.link(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(p.raw.length);let r=s.at(-1);p.type==="text"&&(r==null?void 0:r.type)==="text"?(r.raw+=p.raw,r.text+=p.text):s.push(p);continue}let c=e[0];if(c==="*"||c==="_"){let r=a.length-e.length;if(Us(this.tokenizer,a,c)<=r){let v=1;for(;v<e.length&&e.charCodeAt(v)===c.charCodeAt(0);)v++;let y=e.substring(0,v),$=s.at(-1);($==null?void 0:$.type)==="text"&&!$.escaped?($.raw+=y,$.text+=y):s.push({type:"text",raw:y,text:y,escaped:!1}),e=e.substring(v),l=c,n=!0;continue}}else if(c==="~"){let r=a.length-e.length;if(Fs(this.tokenizer,a)<=r){let v=1;for(;v<e.length&&e.charCodeAt(v)===126;)v++;let y=e.substring(0,v),$=s.at(-1);($==null?void 0:$.type)==="text"&&!$.escaped?($.raw+=y,$.text+=y):s.push({type:"text",raw:y,text:y,escaped:!1}),e=e.substring(v),l=c,n=!0;continue}}if(p=this.tokenizer.emStrong(e,a,l)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.codespan(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.br(e)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.del(e,a,l)){e=e.substring(p.raw.length),s.push(p);continue}if(p=this.tokenizer.autolink(e)){e=e.substring(p.raw.length),s.push(p);continue}if(!this.state.inLink&&(p=this.tokenizer.url(e))){e=e.substring(p.raw.length),s.push(p);continue}let m=e;if((h=this.options.extensions)!=null&&h.startInline){let r=1/0,v=e.slice(1),y;this.options.extensions.startInline.forEach($=>{y=$.call({lexer:this},v),typeof y=="number"&&y>=0&&(r=Math.min(r,y))}),r<1/0&&r>=0&&(m=e.substring(0,r+1))}if(p=this.tokenizer.inlineText(m)){e=e.substring(p.raw.length),p.raw.slice(-1)!=="_"&&(l=p.raw.slice(-1)),n=!0;let r=s.at(-1);(r==null?void 0:r.type)==="text"?(r.raw+=p.raw,r.text+=p.text):s.push(p);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return s},Vs=function(e){let{blockSkip:a,tag:s,autolink:n}=this.tokenizer.rules.inline,l="",i=0,o;for(a.lastIndex=0;o=a.exec(e);){let d=o.index+(o[2]?o[2].length:0),h=o.index+o[0].length;if(e.charAt(d)==="<"){let p=e.slice(d),c=s.exec(p)||n.exec(p);if(!c){a.lastIndex=d+1;continue}h=d+c[0].length,a.lastIndex=h}l+=e.slice(i,d)+"["+"a".repeat(h-d-2)+"]",i=h}return l+e.slice(i)},Gs=function(e){var s,n,l;let a=e;if(this.tokens.links&&e.includes("[")){let i=this.tokenizer.rules.inline.reflinkSearch,o=d=>{let h=d.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,st(d.slice(h+1,-1))))return d;if(h>1&&d.charAt(0)!=="!"){let p=d.slice(1,h-1);if(this.linkInText(p))return"["+p.replace(i,o)+"]["+"a".repeat(d.length-h-2)+"]"}return"["+"a".repeat(d.length-2)+"]"};a=a.replace(i,o)}return a=a.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(i,o,d)=>d?"+".repeat(i.length):o?o+i.slice(o.length,-o.length).replace(/`/g,"+")+o:i),a=Se(this,G,Vs).call(this,a),a=(l=(n=(s=this.options.hooks)==null?void 0:s.emStrongMask)==null?void 0:n.call({lexer:this},a))!=null?l:a,a},be);function Qs(t){return t.map(e=>e.type==="codespan"||e.type==="escape"?{...e,text:O(e.text,!0)}:"tokens"in e&&e.tokens?{...e,tokens:Qs(e.tokens)}:e)}var at=class{constructor(t){M(this,"options");M(this,"parser");this.options=t||ke}space(t){return""}code({text:t,lang:e,escaped:a}){var l;let s=(l=(e||"").match(z.notSpaceStart))==null?void 0:l[0],n=t?t.replace(z.endingNewline,"")+`
`:"";return s?'<pre><code class="language-'+O(s)+'">'+(a?n:O(n,!0))+`</code></pre>
`:"<pre><code>"+(a?n:O(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,a=t.start,s="";for(let i=0;i<t.items.length;i++){let o=t.items[i];s+=this.listitem(o)}let n=e?"ol":"ul",l=e&&a!==1?' start="'+a+'"':"";return"<"+n+l+`>
`+s+"</"+n+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",a="";for(let n=0;n<t.header.length;n++)a+=this.tablecell(t.header[n]);e+=this.tablerow({text:a});let s="";for(let n=0;n<t.rows.length;n++){let l=t.rows[n];a="";for(let i=0;i<l.length;i++)a+=this.tablecell(l[i]);s+=this.tablerow({text:a})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),a=t.header?"th":"td";return(t.align?`<${a} align="${t.align}">`:`<${a}>`)+e+`</${a}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${O(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:a,tokens:s,autolink:n}){let l=n?O(a,!0):this.parser.parseInline(s),i=ms(t);if(i===null)return l;t=O(i,n);let o='<a href="'+t+'"';return e&&(o+=' title="'+O(e)+'"'),o+=">"+l+"</a>",o}image({href:t,title:e,text:a,tokens:s}){s&&(a=this.parser.parseInline(Qs(s),this.parser.textRenderer));let n=ms(t);if(n===null)return O(a);t=n;let l=`<img src="${O(t)}" alt="${O(a)}"`;return e&&(l+=` title="${O(e)}"`),l+=">",l}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:O(t.text)}},Ht=class{constructor(){M(this,"parser")}strong({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}em({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}codespan({text:t}){return t}del({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}html({text:t}){return t}text({text:t}){return t}link({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}image({text:t,tokens:e}){return e?this.parser.parseInline(e,this):t}br(){return`
`}checkbox({raw:t}){return t}},V=class $t{constructor(e){M(this,"options");M(this,"renderer");M(this,"textRenderer");this.options=e||ke,this.options.renderer=this.options.renderer||new at,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ht,this.textRenderer.parser=this}static parse(e,a){return new $t(a).parse(e)}static parseInline(e,a){return new $t(a).parseInline(e)}parse(e){var s;this.renderer.parser=this;let a="";for(let n=0;n<e.length;n++){let l=e[n],i=(s=this.options.extensions)==null?void 0:s.renderers;if(i&&Object.hasOwn(i,l.type)&&i[l.type]){let d=l,h=i[d.type].call({parser:this},d);if(h!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(d.type)){a+=h===!1?"":h!=null?h:"";continue}}let o=l;switch(o.type){case"space":{a+=this.renderer.space(o);break}case"hr":{a+=this.renderer.hr(o);break}case"heading":{a+=this.renderer.heading(o);break}case"code":{a+=this.renderer.code(o);break}case"table":{a+=this.renderer.table(o);break}case"blockquote":{a+=this.renderer.blockquote(o);break}case"list":{a+=this.renderer.list(o);break}case"checkbox":{a+=this.renderer.checkbox(o);break}case"html":{a+=this.renderer.html(o);break}case"def":{a+=this.renderer.def(o);break}case"paragraph":{a+=this.renderer.paragraph(o);break}case"text":{a+=this.renderer.text(o);break}default:{let d='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(d),"";throw new Error(d)}}}return a}parseInline(e,a=this.renderer){var n;this.renderer.parser=this;let s="";for(let l=0;l<e.length;l++){let i=e[l],o=(n=this.options.extensions)==null?void 0:n.renderers;if(o&&Object.hasOwn(o,i.type)&&o[i.type]){let h=o[i.type].call({parser:this},i);if(h!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){s+=h===!1?"":h!=null?h:"";continue}}let d=i;switch(d.type){case"escape":{s+=a.text(d);break}case"html":{s+=a.html(d);break}case"link":{s+=a.link(d);break}case"image":{s+=a.image(d);break}case"checkbox":{s+=a.checkbox(d);break}case"strong":{s+=a.strong(d);break}case"em":{s+=a.em(d);break}case"codespan":{s+=a.codespan(d);break}case"br":{s+=a.br(d);break}case"del":{s+=a.del(d);break}case"text":{s+=a.text(d);break}default:{let h='Token with "'+d.type+'" type was not found.';if(this.options.silent)return console.error(h),"";throw new Error(h)}}}return s}},Ke,_e=(Ke=class{constructor(t){M(this,"options");M(this,"block");this.options=t||ke}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?Z.lex:Z.lexInline}provideParser(t=this.block){return t?V.parse:V.parseInline}},M(Ke,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),M(Ke,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),Ke);function le(t,e){if(Array.isArray(e))for(let a=0;a<e.length;a++)t.push(e[a]);else t.push(e)}var zn=class{constructor(...t){M(this,"defaults",Tt());M(this,"options",this.setOptions);M(this,"parse",this.parseMarkdown(!0));M(this,"parseInline",this.parseMarkdown(!1));M(this,"Parser",V);M(this,"Renderer",at);M(this,"TextRenderer",Ht);M(this,"Lexer",Z);M(this,"Tokenizer",ge);M(this,"Hooks",_e);this.use(...t)}walkTokens(t,e){var s,n;let a=[];for(let l of t)switch(le(a,e.call(this,l)),l.type){case"table":{let i=l;for(let o of i.header)le(a,this.walkTokens(o.tokens,e));for(let o of i.rows)for(let d of o)le(a,this.walkTokens(d.tokens,e));break}case"list":{let i=l;le(a,this.walkTokens(i.items,e));break}default:{let i=l;(n=(s=this.defaults.extensions)==null?void 0:s.childTokens)!=null&&n[i.type]?this.defaults.extensions.childTokens[i.type].forEach(o=>{if(i[o]){let d=i[o].flat(1/0);le(a,this.walkTokens(d,e))}}):i.tokens&&le(a,this.walkTokens(i.tokens,e))}}return a}use(...t){let e=this.defaults.extensions||{renderers:Object.create(null),childTokens:Object.create(null)};return t.forEach(a=>{let s={...a};if(s.async=this.defaults.async||s.async||!1,a.extensions&&(a.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let l=e.renderers[n.name];l?e.renderers[n.name]=function(...i){let o=n.renderer.apply(this,i);return o===!1&&(o=l.apply(this,i)),o}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let l=e[n.level];l?l.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),a.renderer){let n=this.defaults.renderer||new at(this.defaults);for(let l in a.renderer){if(!(l in n))throw new Error(`renderer '${l}' does not exist`);if(["options","parser"].includes(l))continue;let i=l,o=a.renderer[i],d=n[i];n[i]=(...h)=>{let p=o.apply(n,h);return p===!1&&(p=d.apply(n,h)),p===!1?"":p!=null?p:""}}s.renderer=n}if(a.tokenizer){let n=this.defaults.tokenizer||new ge(this.defaults);for(let l in a.tokenizer){if(!(l in n))throw new Error(`tokenizer '${l}' does not exist`);if(["options","rules","lexer"].includes(l))continue;let i=l,o=a.tokenizer[i],d=n[i];n[i]=(...h)=>{let p=o.apply(n,h);return p===!1&&(p=d.apply(n,h)),p}}s.tokenizer=n}if(a.hooks){let n=this.defaults.hooks||new _e;for(let l in a.hooks){if(!(l in n))throw new Error(`hook '${l}' does not exist`);if(["options","block"].includes(l))continue;let i=l,o=a.hooks[i],d=n[i];_e.passThroughHooks.has(l)?n[i]=h=>{if(n.options.async&&_e.passThroughHooksRespectAsync.has(l))return(async()=>{let c=await o.call(n,h);return d.call(n,c)})();let p=o.call(n,h);return d.call(n,p)}:n[i]=(...h)=>{if(n.options.async)return(async()=>{let c=await o.apply(n,h);return c===!1&&(c=await d.apply(n,h)),c})();let p=o.apply(n,h);return p===!1&&(p=d.apply(n,h)),p}}s.hooks=n}if(a.walkTokens){let n=this.defaults.walkTokens,l=a.walkTokens;s.walkTokens=function(i){let o=[];return le(o,l.call(this,i)),n&&le(o,n.call(this,i)),o}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Z.lex(t,e!=null?e:this.defaults)}parser(t,e){return V.parse(t,e!=null?e:this.defaults)}parseMarkdown(t){return(e,a)=>{let s={...a},n={...this.defaults,...s},l=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return l(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return l(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let i=n.hooks?await n.hooks.preprocess(e):e,o=await(n.hooks?await n.hooks.provideLexer(t):t?Z.lex:Z.lexInline)(i,n),d=n.hooks?await n.hooks.processAllTokens(o):o;n.walkTokens&&await Promise.all(this.walkTokens(d,n.walkTokens));let h=await(n.hooks?await n.hooks.provideParser(t):t?V.parse:V.parseInline)(d,n);return n.hooks?await n.hooks.postprocess(h):h})().catch(l);try{n.hooks&&(e=n.hooks.preprocess(e));let i=(n.hooks?n.hooks.provideLexer(t):t?Z.lex:Z.lexInline)(e,n);n.hooks&&(i=n.hooks.processAllTokens(i)),n.walkTokens&&this.walkTokens(i,n.walkTokens);let o=(n.hooks?n.hooks.provideParser(t):t?V.parse:V.parseInline)(i,n);return n.hooks&&(o=n.hooks.postprocess(o)),o}catch(i){return l(i)}}}onError(t,e){return a=>{if(a.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+O(a.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(a);throw a}}},fe=new zn;function A(t,e){return fe.parse(t,e)}A.options=A.setOptions=function(t){return fe.setOptions(t),A.defaults=fe.defaults,Cs(A.defaults),A};A.getDefaults=Tt;A.defaults=ke;function Pn(...t){return fe.use(...t),A.defaults=fe.defaults,Cs(A.defaults),A}A.use=Pn;A.walkTokens=function(t,e){return fe.walkTokens(t,e)};A.parseInline=fe.parseInline;A.Parser=V;A.parser=V.parse;A.Renderer=at;A.TextRenderer=Ht;A.Lexer=Z;A.lexer=Z.lex;A.Tokenizer=ge;A.Hooks=_e;A.parse=A;A.options;A.setOptions;A.walkTokens;A.parseInline;V.parse;Z.lex;A.setOptions({gfm:!0,breaks:!0});function _t(t){if(!t)return"";const e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;");return A.parse(e,{async:!1}).replace(/<a href="(https?:\/\/[^"]+)"/g,'<a href="$1" target="_blank" rel="noopener noreferrer"')}async function In(t,e){var d,h,p;const a=Number(e.params.id);t.innerHTML='<div class="page narrow"><div class="card reading">正在载入…</div></div>';const s=await S.post(a);t.innerHTML=`<div class="page narrow">
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
          ${ae(s.author.avatar,s.author.nickname,34,s.author.uin)}
          <div class="article-meta-text">
            <b>${g(s.author.nickname)}</b>
            <span>${os(s.at)} · ${s.readingTime} 分钟阅读 · ${s.views} 次浏览</span>
          </div>
          ${s.canEdit?`<div class="article-admin">
                  <a class="btn btn-ghost btn-sm" href="#/edit/${s.id}">${b("pen",13)} 编辑</a>
                  <button class="btn btn-ghost btn-sm danger" id="del-post" title="删除文章">${b("trash",13)}</button>
                </div>`:""}
        </div>
      </header>

      ${s.cover&&!((d=s.content)!=null?d:"").includes(s.cover)?`<figure class="article-cover"><img src="${g(s.cover)}" alt="" data-zoom="${g(s.cover)}"></figure>`:""}

      <div class="article-body markdown">${_t((h=s.content)!=null?h:"")}</div>

      <footer class="article-foot">
        <button class="like-btn ${s.liked?"active":""}" id="like-btn">
          ${b("heart",16)}<span>${s.likeCount||"赞"}</span>
        </button>
        <div class="article-foot-note">
          ${s.likes.length?`${s.likes.slice(0,8).map(c=>g(c.nickname)).join("、")} 觉得不错`:`写于 ${os(s.at)}`}
        </div>
      </footer>
    </article>

    <section class="comments card">
      <h2 class="comments-title">评论 <span>${s.commentNum}</span></h2>
      <div id="comment-area">${cs(s.comments)}</div>
      <form class="comment-form" id="comment-form">
        <textarea name="content" rows="3" maxlength="1000" placeholder="说点什么…" required></textarea>
        <div class="comment-form-foot">
          <span class="muted" id="reply-hint"></span>
          <button class="btn btn-primary btn-sm" type="submit">发表评论</button>
        </div>
      </form>
    </section>
  </div>`,it(t);const n=t.querySelector("#like-btn");n.addEventListener("click",async()=>{try{const c=await S.likePost(s.id);n.classList.toggle("active",c.liked),n.querySelector("span").textContent=String(c.count||"赞")}catch(c){w(c.message,"err")}}),(p=t.querySelector("#del-post"))==null||p.addEventListener("click",async()=>{if(await Je("删除文章",`《${s.title}》删除后无法恢复，确定吗？`))try{await S.deletePost(s.id),w("已删除","ok"),location.hash="#/posts"}catch(c){w(c.message,"err")}});let l="";const i=t.querySelector("#reply-hint"),o=t.querySelector("#comment-area");o.addEventListener("click",async c=>{var y,$;const m=c.target,r=m.closest("[data-reply]");if(r){l=(y=r.dataset.reply)!=null?y:"",i.textContent=`回复 ${l}`,t.querySelector("#comment-form textarea").focus();return}const v=m.closest("[data-del-comment]");if(v){if(!await Je("删除评论","确定删除这条评论吗？"))return;try{await S.deleteComment(s.id,Number(v.dataset.delComment)),($=v.closest(".comment"))==null||$.remove(),w("已删除","ok")}catch(E){w(E.message,"err")}}}),t.querySelector("#comment-form").addEventListener("submit",async c=>{c.preventDefault();const r=c.currentTarget.querySelector("textarea"),v=r.value.trim();if(v)try{const y=await S.commentPost(s.id,v,l);s.comments.push(y),o.innerHTML=cs(s.comments),r.value="",l="",i.textContent="",w("评论已发布","ok")}catch(y){w(y.message,"err")}})}const ys=2560,Hn=3*1024*1024;function _n(t){return"createImageBitmap"in window?createImageBitmap(t).catch(()=>$s(t)):$s(t)}function $s(t){return new Promise((e,a)=>{const s=URL.createObjectURL(t),n=new Image;n.onload=()=>{URL.revokeObjectURL(s),e(n)},n.onerror=()=>{URL.revokeObjectURL(s),a(new Error("图片解码失败，可能是不支持的格式"))},n.src=s})}function gt(t,e,a){return new Promise((s,n)=>{t.toBlob(l=>l?s(l):n(new Error("图片压缩失败")),e,a)})}async function wt(t,e=Hn){const a={file:t,width:0,height:0,size:t.size,compressed:!1,originalSize:t.size};if(t.type==="image/gif"||t.type==="image/svg+xml")return a;const s=await _n(t),n="width"in s?s.width:0,l="height"in s?s.height:0;if(!n||!l||(a.width=n,a.height=l,t.size<=2*1024*1024&&Math.max(n,l)<=ys))return a;const i=Math.min(1,ys/Math.max(n,l));let o=Math.round(n*i),d=Math.round(l*i);const h=document.createElement("canvas");h.width=o,h.height=d;const p=h.getContext("2d");if(!p)return a;p.imageSmoothingQuality="high",p.drawImage(s,0,0,o,d),"close"in s&&typeof s.close=="function"&&s.close();const c="image/webp";let m=.9,r=await gt(h,c,m),v=0;for(;r.size>e&&v<4;)m=Math.max(.6,m-.1),r=await gt(h,c,m),r.size>e&&v===3&&(o=Math.round(o*.8),d=Math.round(d*.8),h.width=o,h.height=d,p.drawImage(s,0,0,o,d),r=await gt(h,c,m)),v++;const y=t.name.replace(/\.[^.]+$/,"")+".webp",$=new File([r],y,{type:c});return{file:$,width:o,height:d,size:$.size,compressed:!0,originalSize:t.size}}function Ye(t){return t>=1024*1024?`${(t/1024/1024).toFixed(1)}MB`:`${Math.round(t/1024)}KB`}const Dn=["随笔","城市","旅行","技术","阅读","生活"],Qe="`".repeat(3),ws=30;let We=null;const Ws="qz.editor.mode",bt="qz.editor.split";async function xs(t,e){var Wt,Kt,Xt,Yt,Jt,es,ts;const a=e.params.id?Number(e.params.id):0;let s=null;if(a&&(s=await S.post(a),!s.canEdit)){t.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}We==null||We();const n=new AbortController;let l=null;We=()=>{n.abort(),l==null||l()};let i=(Wt=s==null?void 0:s.cover)!=null?Wt:"",o=(Kt=s==null?void 0:s.images)!=null?Kt:[];const d=`qz.draft.${a||"new"}`;let h=Bn(),p=Number(localStorage.getItem(bt))||50;document.body.classList.add("writer-mode"),t.innerHTML=`<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${a?`#/post/${a}`:"#/home"}" title="返回">${b("back",16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${g((Xt=s==null?void 0:s.title)!=null?Xt:"")}" autocomplete="off">
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
        ${Lt("btn-theme",16,"wr-ibtn")}
        <button class="wr-ibtn" id="btn-help" title="快捷键（Ctrl+/）">?</button>
        <button class="btn btn-primary btn-sm" id="save-btn">${b("check",13)} ${a?"保存修改":"发布"}</button>
      </div>
    </header>

    <div class="wr-draft" id="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="wr-body" id="body" data-mode="${h}" style="--split:${p}%">
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

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${g((Yt=s==null?void 0:s.content)!=null?Yt:"")}</textarea>
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
              ${i?`<img src="${g(i)}" alt="">`:"<span>点击上传封面</span>"}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${g((Jt=s==null?void 0:s.category)!=null?Jt:"随笔")}">
              <datalist id="cat-list">${Dn.map(u=>`<option value="${u}">`).join("")}</datalist>
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
              ${o.map(u=>`<img src="${g(u)}" alt="" data-zoom="${g(u)}">`).join("")||'<span class="muted">还没有配图</span>'}
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
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${ws}MB 内图片自动压缩</span>
    </footer>

    <div class="wr-help" id="help" hidden>
      <div class="wr-help-card">
        <div class="wr-help-head">
          <b>快捷键</b>
          <button class="wr-ibtn" id="help-close">${b("close",14)}</button>
        </div>
        <div class="wr-help-grid">
          ${[["Ctrl + B / I","加粗 / 斜体"],["Ctrl + E","行内代码"],["Ctrl + K","插入链接"],["Ctrl + 1 / 2 / 3","一 / 二 / 三级标题"],["Ctrl + Shift + C","代码块"],["Ctrl + Shift + 8 / 7","无序 / 有序列表"],["Ctrl + Shift + Q","引用"],["Ctrl + Shift + E / S / V","编辑 / 分屏 / 预览"],["Ctrl + S","保存"],["Tab / Shift + Tab","整行缩进 / 反缩进"],["Ctrl + V","粘贴截图直接插图"],["Ctrl + /","打开本面板"]].map(([u,f])=>`<div class="k"><kbd>${u}</kbd><span>${f}</span></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;const c=u=>t.querySelector(u);l=Et(t,"btn-theme");const m=c("#title"),r=c("#content"),v=c("#preview"),y=c("#body"),$=c("#splitter"),E=c("#pv-scroll"),T=c("#thumbs"),P=c("#save-state"),R=c("#stat-words"),de=c("#stat-read"),ne=c("#stat-cursor"),ue=c("#pv-meta"),ie=c("#draft-bar"),_=c("#outline"),J=c("#outline-list"),F=c("#side"),ee=c("#help"),Q=u=>{h=u,y.dataset.mode=u,localStorage.setItem(Ws,u),t.querySelectorAll("#mode-switch button").forEach(f=>{f.classList.toggle("active",f.dataset.mode===u)}),c("#btn-eye").classList.toggle("on",u==="preview"),u==="preview"?Ne(!0):r.focus()};t.querySelectorAll("#mode-switch button").forEach(u=>{u.addEventListener("click",()=>Q(u.dataset.mode))}),c("#btn-eye").addEventListener("click",()=>Q(h==="edit"?"preview":"edit"));const j=(u,f)=>{u.dataset.open=String(f),u===_&&c("#btn-outline").classList.toggle("on",f),u===F&&c("#btn-side").classList.toggle("on",f)};c("#btn-outline").addEventListener("click",()=>j(_,_.dataset.open!=="true")),c("#btn-side").addEventListener("click",()=>j(F,F.dataset.open!=="true")),t.querySelectorAll("[data-close]").forEach(u=>{u.addEventListener("click",()=>j(u.dataset.close==="side"?F:_,!1))});const H=c("#wr"),ye=c("#btn-full"),re=()=>{var u;document.fullscreenElement?document.exitFullscreen():(u=H.requestFullscreen)==null||u.call(H).catch(()=>w("当前环境不支持全屏","err"))};ye.addEventListener("click",re),document.addEventListener("fullscreenchange",()=>{const u=!!document.fullscreenElement;ye.innerHTML=b(u?"compress":"expand",15),ye.classList.toggle("on",u),ye.title=u?"退出全屏":"全屏写作"},{signal:n.signal});let Ot=0;function Ne(u=!1){window.clearTimeout(Ot);const f=()=>{const k=r.value;v.innerHTML=k.trim()?_t(k):'<p class="muted">预览会显示在这里</p>';const x=v.querySelectorAll("h1,h2,h3,h4,p,li,pre,blockquote,table").length;ue.textContent=`${x} 个段落`};u?f():Ot=window.setTimeout(f,140)}function jt(){var q,C;const u=r.value,f=((q=u.match(/[\u3400-\u9fa5]/g))!=null?q:[]).length,k=((C=u.replace(/[\u3400-\u9fa5]/g," ").match(/[A-Za-z0-9_]+/g))!=null?C:[]).length,x=f+k;R.textContent=`${x.toLocaleString()} 字`,de.textContent=`约 ${Math.max(1,Math.round(x/400))} 分钟`}function $e(){const u=r.selectionStart,f=r.value.slice(0,u),k=f.split(`
`).length,x=u-(f.lastIndexOf(`
`)+1)+1;ne.textContent=`第 ${k} 行 · 第 ${x} 列`}let Nt=0;function Ut(){window.clearTimeout(Nt),Nt=window.setTimeout(()=>{const u=On(r.value);if(!u.length){J.innerHTML='<p class="muted">标题会出现在这里</p>';return}J.innerHTML=u.map((f,k)=>`<button class="ol-item lv${f.level}" data-i="${k}"><span>${g(f.text)}</span></button>`).join(""),J.querySelectorAll(".ol-item").forEach(f=>{f.addEventListener("click",()=>{const k=u[Number(f.dataset.i)];k&&Js(k.offset),window.innerWidth<1e3&&j(_,!1)})})},260)}function Js(u){const f=getComputedStyle(r),k=parseFloat(f.paddingLeft)+parseFloat(f.paddingRight),x=document.createElement("div");x.style.cssText=["position:absolute","visibility:hidden","top:0","left:0",`width:${Math.max(80,r.clientWidth-k)}px`,`font:${f.font}`,`line-height:${f.lineHeight}`,`letter-spacing:${f.letterSpacing}`,"white-space:pre-wrap","overflow-wrap:break-word","word-break:break-word"].join(";");const q=r.value.lastIndexOf(`
`,u-1)+1;x.textContent=r.value.slice(0,q),document.body.appendChild(x);const C=x.getBoundingClientRect().height;x.remove(),r.scrollTop=Math.max(0,C-8),r.focus(),r.setSelectionRange(u,u),$e()}const ea=()=>{try{const u=localStorage.getItem(d);return u?JSON.parse(u):null}catch{return null}},ta=()=>({title:m.value,content:r.value,category:c("#category").value,visibility:c("#visibility").value,pinned:c("#pinned").checked,cover:i,savedAt:Date.now()});let Ft=0;const Ue=()=>{window.clearTimeout(Ft),P.textContent="未保存",P.classList.add("dirty"),Ft=window.setTimeout(()=>{localStorage.setItem(d,JSON.stringify(ta()));const u=new Date;P.textContent=`已存草稿 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")}`,P.classList.remove("dirty")},1200)},W=ea();if(W&&(W.content!==((es=s==null?void 0:s.content)!=null?es:"")||W.title!==((ts=s==null?void 0:s.title)!=null?ts:""))){const u=new Date(W.savedAt);c("#draft-text").textContent=`发现 ${u.getMonth()+1} 月 ${u.getDate()} 日 ${String(u.getHours()).padStart(2,"0")}:${String(u.getMinutes()).padStart(2,"0")} 的草稿`,ie.hidden=!1,c("#draft-restore").addEventListener("click",()=>{m.value=W.title,r.value=W.content,c("#category").value=W.category||"随笔",c("#visibility").value=W.visibility||"public",c("#pinned").checked=!!W.pinned,i=W.cover||i,i&&Gt(i),ie.hidden=!0,ot(),Ne(!0),w("已恢复草稿","ok")}),c("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(d),ie.hidden=!0})}const ot=()=>{jt(),$e(),Ne(),Ut(),Ue()},we=(u,f,k,x,q)=>{r.focus(),r.setSelectionRange(u,f);let C=!1;try{C=document.execCommand("insertText",!1,k)}catch{C=!1}C||r.setRangeText(k,u,f,"end"),r.setSelectionRange(x,q),ot()},Ae=(u,f=0,k=0)=>{const x=r.selectionStart,q=r.selectionEnd;we(x,q,u,x+f,x+(k||u.length))},Fe=(u,f,k)=>{const x=r.selectionStart,q=r.selectionEnd,C=r.value.slice(x,q)||k;we(x,q,u+C+f,x+u.length,x+u.length+C.length)},Zt=()=>{const u=r.selectionStart,f=r.selectionEnd,k=r.value.lastIndexOf(`
`,Math.max(0,u-1))+1,x=r.value.indexOf(`
`,f),q=x===-1?r.value.length:x;return{lineStart:k,lineEnd:q}},pe=(u,f)=>{const{lineStart:k,lineEnd:x}=Zt(),C=(r.value.slice(k,x)||f).split(`
`),K=C.every(D=>D.startsWith(u)),te=C.map(D=>K?D.slice(u.length):u+D.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/,"")).join(`
`);we(k,x,te,k,k+te.length)},N={h1:()=>pe("# ","一级标题"),h2:()=>pe("## ","二级标题"),h3:()=>pe("### ","三级标题"),bold:()=>Fe("**","**","加粗文字"),italic:()=>Fe("*","*","斜体文字"),strike:()=>Fe("~~","~~","删除线"),code:()=>Fe("`","`","code"),quote:()=>pe("> ","引用一段话"),ul:()=>pe("- ","列表项"),ol:()=>pe("1. ","列表项"),task:()=>pe("- [ ] ","待办事项"),codeblock:()=>Ae(`
${Qe}
// code
${Qe}
`,Qe.length+2,Qe.length+9),hr:()=>Ae(`
---
`),link:()=>{const u=r.value.slice(r.selectionStart,r.selectionEnd);Ae(`[${u||"链接文字"}](https://)`,u?u.length+3:1,u?u.length+11:5)},table:()=>Ae(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};c("#toolbar").addEventListener("click",u=>{var k,x;const f=u.target.closest("[data-cmd]");f&&(u.preventDefault(),(x=N[(k=f.dataset.cmd)!=null?k:""])==null||x.call(N))});const sa=/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/,aa=()=>{const u=r.selectionStart;if(u!==r.selectionEnd)return!1;const f=r.value.lastIndexOf(`
`,u-1)+1,k=r.value.slice(f,u),x=k.match(sa);if(!x)return!1;const[,q,C,K]=x;if(!k.slice(x[0].length).trim())return we(f,u,"",f,f),!0;let D=`
`+q;return/^\d+\.$/.test(C)?D+=`${parseInt(C,10)+1}. `:D+=C+" ",K&&(D+="[ ] "),we(u,u,D,u+D.length,u+D.length),!0},na=u=>{var ss;const{lineStart:f,lineEnd:k}=Zt(),q=r.value.slice(f,k).split(`
`),C=q.map(Ce=>u?Ce.replace(/^ {1,2}|^\t/,""):"  "+Ce).join(`
`),K=r.selectionStart===r.selectionEnd;let te=f,D=f+C.length;if(K){const Ce=r.selectionStart-f,ia=((ss=q[0].match(/^ {1,2}|^\t/))!=null?ss:[""])[0].length,ra=u?Math.max(0,Ce-ia):Ce+2;te=f+ra,D=te}we(f,k,C,te,D)};r.addEventListener("keydown",u=>{const f=u.metaKey||u.ctrlKey,k=u.key.toLowerCase();if(u.key==="Tab"){u.preventDefault(),na(u.shiftKey);return}if(!f&&u.key==="Enter"&&!u.altKey&&!u.isComposing&&aa()){u.preventDefault();return}if(f){if(u.shiftKey){k==="c"?(u.preventDefault(),N.codeblock()):u.key==="8"||u.key==="*"?(u.preventDefault(),N.ul()):u.key==="7"||u.key==="&"?(u.preventDefault(),N.ol()):k==="q"?(u.preventDefault(),N.quote()):k==="e"?(u.preventDefault(),Q("edit")):k==="s"?(u.preventDefault(),Q("split")):k==="v"&&(u.preventDefault(),Q("preview"));return}k==="b"?(u.preventDefault(),N.bold()):k==="i"?(u.preventDefault(),N.italic()):k==="k"?(u.preventDefault(),N.link()):k==="e"?(u.preventDefault(),N.code()):k==="s"?(u.preventDefault(),Qt()):k==="1"||k==="2"||k==="3"?(u.preventDefault(),N[`h${k}`]()):k==="/"&&(u.preventDefault(),Re())}}),r.addEventListener("keyup",$e),r.addEventListener("click",$e),r.addEventListener("select",$e),r.addEventListener("input",ot);let ct=!1;const Vt=(u,f)=>{if(h!=="split"||ct)return;ct=!0;const k=u.scrollHeight-u.clientHeight,x=k>0?u.scrollTop/k:0;f.scrollTop=x*(f.scrollHeight-f.clientHeight),requestAnimationFrame(()=>{ct=!1})};r.addEventListener("scroll",()=>Vt(r,E),{passive:!0}),E.addEventListener("scroll",()=>Vt(E,r),{passive:!0}),$.addEventListener("pointerdown",u=>{h!=="split"&&Q("split"),u.preventDefault(),$.setPointerCapture(u.pointerId),$.classList.add("dragging"),document.body.classList.add("wr-resizing");const f=x=>{const q=y.getBoundingClientRect(),C=(x.clientX-q.left)/q.width*100,K=Math.min(78,Math.max(22,C));p=K,y.style.setProperty("--split",`${K}%`)},k=()=>{$.classList.remove("dragging"),document.body.classList.remove("wr-resizing"),localStorage.setItem(bt,String(Math.round(p))),$.removeEventListener("pointermove",f),$.removeEventListener("pointerup",k),$.removeEventListener("pointercancel",k)};$.addEventListener("pointermove",f),$.addEventListener("pointerup",k),$.addEventListener("pointercancel",k)}),$.addEventListener("dblclick",()=>{p=50,y.style.setProperty("--split","50%"),localStorage.setItem(bt,"50")});const dt=new Set,ut=async(u,f="图片")=>{for(const k of u){if(!k.type.startsWith("image/")){w("只能插入图片文件","err");continue}const x=`${k.name}-${k.size}`;if(!dt.has(x)){dt.add(x);try{w(`正在处理 ${k.name||f}…`);const q=await wt(k);if(q.size>ws*1024*1024)throw new Error(`压缩后仍有 ${Ye(q.size)}，超过上限`);const{url:C}=await S.upload(q.file);o.push(C);const K=(k.name||f).replace(/\.[^.]+$/,"")||f;Ae(`
![${K}](${C})
`),T.innerHTML=o.map(te=>`<img src="${g(te)}" alt="">`).join(""),w(q.compressed?`已压缩 ${Ye(q.originalSize)} → ${Ye(q.size)}`:"图片已插入","ok")}catch(q){w(q.message,"err")}finally{dt.delete(x)}}}};r.addEventListener("paste",u=>{const f=u.clipboardData;if(!f)return;const k=Array.from(f.items).filter(x=>x.kind==="file"&&x.type.startsWith("image/")).map(x=>x.getAsFile()).filter(x=>!!x);k.length&&(u.preventDefault(),ut(k,"粘贴的图片"))});const xe=c("#pane-edit");xe.addEventListener("dragover",u=>{var f;(f=u.dataTransfer)!=null&&f.types.includes("Files")&&(u.preventDefault(),xe.classList.add("dropping"))}),xe.addEventListener("dragleave",()=>xe.classList.remove("dropping")),xe.addEventListener("drop",u=>{var k,x;const f=Array.from((x=(k=u.dataTransfer)==null?void 0:k.files)!=null?x:[]).filter(q=>q.type.startsWith("image/"));f.length&&(u.preventDefault(),xe.classList.remove("dropping"),ut(f))}),c("#img-input").addEventListener("change",async u=>{var x;const f=u.target,k=Array.from((x=f.files)!=null?x:[]);k.length&&await ut(k),f.value=""});const Ze=c("#cover-slot"),pt=c("#cover-input"),Gt=u=>{var f,k;(f=Ze.querySelector("img"))==null||f.remove(),(k=Ze.querySelector("span"))==null||k.remove(),Ze.insertAdjacentHTML("afterbegin",u?`<img src="${g(u)}" alt="">`:"<span>点击上传封面</span>")};Ze.addEventListener("click",()=>pt.click()),pt.addEventListener("change",async()=>{var f;const u=(f=pt.files)==null?void 0:f[0];if(u)try{const k=await wt(u),{url:x}=await S.upload(k.file);i=x,Gt(x),Ue(),w("封面已更新","ok")}catch(k){w(k.message,"err")}});function Re(u){const f=u!=null?u:ee.hidden;ee.hidden=!f}c("#btn-help").addEventListener("click",()=>Re()),c("#help-close").addEventListener("click",()=>Re(!1)),ee.addEventListener("click",u=>{u.target===ee&&Re(!1)}),document.addEventListener("keydown",u=>{u.key==="Escape"&&(ee.hidden?_.dataset.open==="true"?j(_,!1):F.dataset.open==="true"&&j(F,!1):Re(!1))},{signal:n.signal}),m.addEventListener("input",Ue),t.querySelectorAll("#category,#visibility,#pinned").forEach(u=>u.addEventListener("change",Ue));const Qt=async()=>{const u={title:m.value.trim(),content:r.value,cover:i,category:c("#category").value.trim()||"随笔",visibility:c("#visibility").value,pinned:c("#pinned").checked,images:o};if(!u.title&&!u.content.trim()){w("写个标题或正文再发布","err");return}const f=c("#save-btn");f.disabled=!0,f.textContent="保存中…";try{const k=a?await S.updatePost(a,u):await S.createPost(u);localStorage.removeItem(d),w(a?"已保存":"已发布","ok"),location.hash=`#/post/${k.id}`}catch(k){w(k.message,"err"),f.disabled=!1,f.innerHTML=`${b("check",13)} ${a?"保存修改":"发布"}`}};c("#save-btn").addEventListener("click",()=>void Qt()),window.addEventListener("beforeunload",u=>{P.classList.contains("dirty")&&r.value.trim()&&(u.preventDefault(),u.returnValue="")},{signal:n.signal}),jt(),$e(),Ut(),Ne(!0),Q(h),m.addEventListener("keydown",u=>{u.key==="Enter"&&(u.preventDefault(),r.focus(),r.setSelectionRange(0,0))}),window.innerWidth<1e3&&!(s!=null&&s.title)?m.focus():(r.focus(),r.setSelectionRange(r.value.length,r.value.length))}function Bn(){const t=localStorage.getItem(Ws);return t==="edit"||t==="split"||t==="preview"?t:window.innerWidth>=1e3?"split":"edit"}function On(t){var n;const e=[],a=/^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;let s;for(;s=a.exec(t);)((n=t.slice(0,s.index).match(/^```/gm))!=null?n:[]).length%2!==1&&e.push({level:s[1].length,text:s[2].replace(/[*_`~]/g,""),offset:s.index});return e}async function jn(t,e){t.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${b("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const a=t.querySelector("#album-grid"),s=async()=>{const n=await S.albums(),l=n.albums.reduce((i,o)=>i+o.count,0);t.querySelector("#album-sub").textContent=`${n.albums.length} 个相册 · 共 ${l} 张照片`,a.innerHTML=n.albums.length?n.albums.map(ka).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await s(),t.querySelector("#new-album").addEventListener("click",async()=>{await xt({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async n=>{const l=n.querySelector("#a-name").value.trim();return l?(await S.createAlbum({name:l,description:n.querySelector("#a-desc").value.trim(),privacy:n.querySelector("#a-priv").value}),w("相册已创建","ok"),await s(),!0):(w("请填写相册名称","err"),!1)}})})}async function Nn(t,e){const a=Number(e.params.id);let s=await S.album(a);const n=()=>{var l,i,o;t.innerHTML=`<div class="page">
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
        ${(l=s.photos)!=null&&l.length?s.photos.map(d=>`<figure class="photo" data-pid="${d.id}">
                    <img src="${g(d.url)}" alt="${g(d.caption)}" loading="lazy" data-zoom="${g(d.url)}">
                    <figcaption>
                      <span>${g(d.caption||ce(d.at))}</span>
                      <span class="photo-like">${b("heart",12)} ${d.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${d.id}" title="赞">${b("heart",14)}</button>
                      ${s.canEdit?`<button class="photo-btn danger" data-del="${d.id}" title="删除">${b("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${b("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,it(t),(i=t.querySelector("#photo-file"))==null||i.addEventListener("change",async d=>{var c;const h=d.target,p=Array.from((c=h.files)!=null?c:[]);if(p.length){w(`正在处理 ${p.length} 张…`);try{const m=[],r=[],v=[],y=[];let $=0;for(const E of p){const T=await wt(E),{url:P}=await S.upload(T.file);m.push(P),r.push(T.size),v.push(T.width),y.push(T.height),$+=T.originalSize-T.size}s=await S.addPhotos(s.id,m,{sizes:r,widths:v,heights:y}),w($>512*1024?`上传完成，压缩节省 ${Ye($)}`:"上传完成","ok"),n()}catch(m){w(m.message,"err")}finally{h.value=""}}}),(o=t.querySelector("#del-album"))==null||o.addEventListener("click",async()=>{if(await Je("删除相册",`《${s.name}》及其中 ${s.count} 张照片会一起删除。`))try{await S.deleteAlbum(s.id),w("相册已删除","ok"),location.hash="#/albums"}catch(d){w(d.message,"err")}}),t.querySelector("#photo-grid").addEventListener("click",async d=>{var m;const h=d.target,p=h.closest("[data-like]");if(p){d.stopPropagation();try{const r=await S.likePhoto(Number(p.dataset.like));p.classList.toggle("active",r.liked);const v=(m=p.closest(".photo"))==null?void 0:m.querySelector(".photo-like");v&&(v.innerHTML=`${b("heart",12)} ${r.count}`)}catch(r){w(r.message,"err")}return}const c=h.closest("[data-del]");if(c){if(d.stopPropagation(),!await Je("删除照片","确定从相册中删除这张照片吗？"))return;try{await S.deletePhoto(s.id,Number(c.dataset.del)),s=await S.album(s.id),n(),w("已删除","ok")}catch(r){w(r.message,"err")}}})};n()}async function Un(t,e){const a=ve(),s=e.params.uin||a.uin,n=s===a.uin,l=n?a:(await S.user(s)).user;t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GUESTBOOK</p>
        <h1>留言板</h1>
        <p class="page-sub">${n?"来过的人，留下了这些话。":`给 ${g(l.nickname)} 留言`}</p>
      </div>
    </header>

    <section class="card guest-write">
      <div class="guest-write-head">
        ${ae(a.avatar,a.nickname,36)}
        <span>${n?"给自己留一句话":`给 ${g(l.nickname)} 留一句话`}</span>
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
  </div>`;const i=t.querySelector("#gb-list"),o=t.querySelector("#gb-form textarea"),d=t.querySelector("#gb-count");o.addEventListener("input",()=>{d.textContent=`${o.value.length} / 500`});const h=c=>`<article class="gb-item card" data-gid="${c.id}">
      ${ae(c.author.avatar,c.author.nickname,40,c.author.uin)}
      <div class="gb-body">
        <div class="gb-head">
          <a class="gb-name" href="#/u/${g(c.author.uin)}">${g(c.author.nickname)}</a>
          <time>${ce(c.at)}</time>
          <span class="spacer"></span>
          ${c.canEdit?`<button class="text-btn" data-reply="${c.id}">回复</button>`:""}
          ${c.canDel?`<button class="text-btn danger" data-del="${c.id}">删除</button>`:""}
        </div>
        <p class="gb-text">${g(c.content)}</p>
        ${c.reply?`<div class="gb-reply"><b>${g(l.nickname)}：</b>${g(c.reply)}</div>`:""}
      </div>
    </article>`,p=async()=>{const c=await S.guestbook(s);i.innerHTML=c.entries.length?c.entries.map(h).join(""):`<div class="card empty"><div class="empty-mark">${b("mail",22)}</div>
          <p class="empty-title">还没有留言</p><p class="empty-desc">成为第一个留言的人。</p></div>`};await p(),t.querySelector("#gb-form").addEventListener("submit",async c=>{c.preventDefault();const m=o.value.trim();if(m)try{await S.createGuestbook(s,m),o.value="",d.textContent="0 / 500",w("留言成功","ok"),await p()}catch(r){w(r.message,"err")}}),i.addEventListener("click",async c=>{const m=c.target,r=m.closest("[data-del]");if(r){if(!confirm("确定删除这条留言吗？"))return;try{await S.deleteGuestbook(Number(r.dataset.del)),await p(),w("已删除","ok")}catch(y){w(y.message,"err")}return}const v=m.closest("[data-reply]");if(v){const y=Number(v.dataset.reply);await xt({title:"回复留言",body:'<textarea class="input" id="reply-text" rows="4" maxlength="500" placeholder="写下回复…"></textarea>',confirmText:"回复",onConfirm:async $=>{const E=$.querySelector("#reply-text").value.trim();return E?(await S.replyGuestbook(y,E),await p(),w("已回复","ok"),!0):(w("回复不能为空","err"),!1)}})}})}async function Fn(t,e){const a=ve(),s=e.params.uin?(await S.user(e.params.uin)).user:a;t.innerHTML=`<div class="page narrow">
    <header class="about-head">
      <p class="page-eyebrow">ABOUT</p>
      <h1>关于 ${g(s.nickname)}</h1>
      <p class="page-sub">${g(s.signature||"")}</p>
    </header>

    <div class="about-grid">
      <article class="card about-card">
        <div class="markdown about-bio">${s.bio?_t(s.bio):'<p class="muted">还没有写自我介绍。</p>'}</div>
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
  </div>`,s.uin!==a.uin&&S.visit(s.uin,"关于").catch(()=>w("足迹记录失败","err"))}async function Zn(t,e){var d;const a=(d=e.params.uin)!=null?d:"",s=ve();if(a===s.uin){location.hash="#/home";return}t.innerHTML=`<div class="page"><div class="card reading">正在打开 ${g(a)} 的空间…</div></div>`;const{user:n}=await S.user(a);S.visit(n.uin,"主页").catch(()=>{}),t.innerHTML=`<div class="page">
    <section class="hero compact">
      <div class="hero-cover" style="background-image:url('${g(n.cover)}')"></div>
      <div class="hero-inner">
        <div class="hero-avatar">${ae(n.avatar,n.nickname,0)}</div>
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
    <div id="space-posts">${et(2)}</div>
  </div>`,it(t);const l=t.querySelector("#space-posts"),i=await S.posts({uin:n.uin,limit:10});if(!i.posts.length){l.innerHTML='<div class="card empty"><p class="empty-title">还没有公开的文章</p></div>';return}const o=i.posts[0];l.innerHTML=Rs(o)+`<div class="post-list">${i.posts.slice(1).map(rt).join("")}</div>`}const Ss={like:{icon:"heart",label:"赞",cls:"k-like"},comment:{icon:"message",label:"评论",cls:"k-comment"},guestbook:{icon:"mail",label:"留言",cls:"k-guest"},visit:{icon:"eye",label:"访客",cls:"k-visit"},system:{icon:"bell",label:"系统",cls:"k-system"}};function Vn(t){return t.target.startsWith("post:")?`#/post/${t.target.split(":")[1]}`:t.target.startsWith("album:")?`#/album/${t.target.split(":")[1]}`:t.target==="guestbook"?"#/guestbook":t.target==="profile"?`#/u/${g(t.from.uin)}`:"#/home"}async function Gn(t,e){t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">INBOX</p>
        <h1>消息</h1>
        <p class="page-sub" id="msg-sub">加载中…</p>
      </div>
      <button class="btn btn-ghost btn-sm" id="read-all">${b("check",14)} 全部已读</button>
    </header>
    <div id="msg-list"></div>
  </div>`;const a=t.querySelector("#msg-list"),s=t.querySelector("#msg-sub"),n=async()=>{const l=await S.notifications();s.textContent=l.unread?`${l.unread} 条未读`:"全部已读",ls(l.unread),a.innerHTML=l.notifications.length?`<div class="card msg-list">${l.notifications.map(i=>{var d;const o=(d=Ss[i.kind])!=null?d:Ss.system;return`<a class="msg-row ${i.read?"":"unread"}" href="${Vn(i)}">
              <span class="msg-icon ${o.cls}">${b(o.icon,16)}</span>
              <div class="msg-body">
                <div class="msg-line">
                  ${ae(i.from.avatar,i.from.nickname,20,i.from.uin)}
                  <b>${g(i.from.nickname)}</b>
                  <span>${g(i.text)}</span>
                </div>
                <time>${ce(i.at)} · ${o.label}</time>
              </div>
              ${i.read?"":'<i class="msg-dot"></i>'}
            </a>`}).join("")}</div>`:`<div class="card empty"><div class="empty-mark">${b("bell",22)}</div>
          <p class="empty-title">没有新消息</p><p class="empty-desc">有人点赞、评论或留言时会出现在这里。</p></div>`};await n(),t.querySelector("#read-all").addEventListener("click",async()=>{try{const l=await S.readNotifications([]);ls(l.unread),w("已全部标为已读","ok"),await n()}catch(l){w(l.message,"err")}})}const Qn=[{key:"in",label:"谁看过我"},{key:"out",label:"我看过谁"}];async function Wn(t,e){const a=ve(),s=e.params.tab==="out"?"out":"in";t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">VISITORS</p>
        <h1>访客</h1>
        <p class="page-sub" id="visit-sub">读取中…</p>
      </div>
      <span class="lock-note">${b("lock",13)} 仅自己可见</span>
    </header>
    <nav class="seg">
      ${Qn.map(i=>`<button class="seg-btn ${i.key===s?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="visit-list"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/visitors?tab=${i.dataset.tab}`})});const n=t.querySelector("#visit-list"),l=await S.visitors(a.uin,s);t.querySelector("#visit-sub").textContent=s==="in"?`累计 ${l.total.toLocaleString()} 人次 · 今日 ${l.today} 人`:`你最近访问了 ${l.visitors.length} 个空间`,n.innerHTML=l.visitors.length?`<div class="card visit-list">${l.visitors.map(i=>`<a class="visit-row" href="#/u/${g(i.author.uin)}">
            ${ae(i.author.avatar,i.author.nickname,40,i.author.uin)}
            <div class="visit-main">
              <b>${g(i.author.nickname)}</b>
              <span>${s==="in"?"看了":"访问了"} · ${g(i.module)}</span>
            </div>
            <time>${ce(i.at)}</time>
          </a>`).join("")}</div>`:pa(s==="in"?"还没有人来过":"还没有访问记录",s==="in"?"多和好友互动，访客会多起来的。":"去别人的主页逛一逛吧。",'<a class="btn btn-primary btn-sm" href="#/search">去搜索好友</a>')}const Kn=[{id:"light",name:"浅色",icon:"sun"},{id:"dark",name:"深色",icon:"moon"},{id:"auto",name:"跟随系统",icon:"monitor"}],Xn=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function Yn(t,e){var l;const a=e.params.tab||"profile",s=ve();t.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${Xn.map(i=>`<button class="seg-btn ${i.key===a?"active":""}" data-tab="${i.key}">${i.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,t.querySelectorAll("[data-tab]").forEach(i=>{i.addEventListener("click",()=>{location.hash=`#/settings?tab=${i.dataset.tab}`})});const n=t.querySelector("#settings-body");if(a==="decorate"){n.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${g(s.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">外观</h2>
      <p class="setting-hint">深色模式适合夜间写作；「跟随系统」会随设备的浅色 / 深色自动切换。这个偏好只保存在当前浏览器，不跟账号走。</p>
      <div class="theme-grid" id="appearance-grid">
        ${Kn.map(i=>`<button class="theme-card ${ga()===i.id?"active":""}" data-appearance="${i.id}">
            <span class="mode-swatch">${b(i.icon,14)}</span>
            <span>${i.name}</span>
          </button>`).join("")}
      </div>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${ft().map(i=>`<button class="theme-card ${s.theme===i.id?"active":""}" data-theme="${i.id}">
              <span class="theme-swatch" style="background:${i.accent}"></span>
              <span>${g(i.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,n.querySelector("#cover-file").addEventListener("change",async i=>{var d;const o=(d=i.target.files)==null?void 0:d[0];if(o)try{const{url:h}=await S.upload(o),p=await S.updateProfile({cover:h});Le(p),n.querySelector("#cover-preview").style.backgroundImage=`url('${h}')`,w("封面已更新","ok")}catch(h){w(h.message,"err")}}),n.querySelectorAll("[data-appearance]").forEach(i=>{i.addEventListener("click",()=>{Ms(i.dataset.appearance),n.querySelectorAll("[data-appearance]").forEach(o=>o.classList.remove("active")),i.classList.add("active")})}),n.querySelectorAll("[data-theme]").forEach(i=>{i.addEventListener("click",async()=>{const o=i.dataset.theme;try{const d=await S.updateProfile({theme:o});Le(d),Ls(o),n.querySelectorAll("[data-theme]").forEach(h=>h.classList.remove("active")),i.classList.add("active"),w("主题已切换","ok")}catch(d){w(d.message,"err")}})});return}if(a==="music"){n.innerHTML=`<section class="card setting-card">
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
    </section>`;let i=s.bgmUrl,o=s.bgmTitle;const d=()=>{n.querySelector("#bgm-name").textContent=o||"还没有设置音轨",n.querySelector("#bgm-sub").textContent=i?"已选择，保存后生效":"上传、选一首内置曲目，或填写直链",n.querySelector("#bgm-title").value||(n.querySelector("#bgm-title").value=o)},h=(c,m)=>{i=c,o=m,n.querySelector("#bgm-title").value=m,d()};try{const{tracks:c}=await S.musicLibrary(),m=n.querySelector("#music-library");m.innerHTML=c.map(r=>`<article class="lib-card" data-id="${g(r.id)}">
            <div class="lib-main">
              <b>${g(r.title)}</b>
              <span>${g(r.mood)} · ${r.duration} 秒</span>
            </div>
            <div class="lib-actions">
              <button class="btn btn-ghost btn-sm" data-play="${g(r.url)}" data-title="${g(r.title)}">${b("play",12)} 试听</button>
              <button class="btn btn-soft btn-sm" data-pick="${g(r.url)}" data-title="${g(r.title)}">设为背景</button>
            </div>
          </article>`).join(""),m.addEventListener("click",r=>{var E;const v=r.target,y=v.closest("[data-play]");if(y){I.setTrack(y.dataset.play,y.dataset.title),I.isPlaying()||I.toggle(),(E=n.querySelector(".music-disc"))==null||E.classList.add("spin");return}const $=v.closest("[data-pick]");$&&(h($.dataset.pick,$.dataset.title),w(`已选择《${$.dataset.title}》，记得点保存`,"ok"))})}catch(c){n.querySelector("#music-library").innerHTML=`<span class="muted">曲库加载失败：${g(c.message)}</span>`}const p=n.querySelector("#audio-file");p.addEventListener("change",async()=>{var m;const c=(m=p.files)==null?void 0:m[0];if(c){if(c.size>50*1024*1024){w("音频不能超过 50MB","err");return}w("正在上传音频…");try{const{url:r}=await S.uploadAudio(c);h(r,c.name.replace(/\.[^.]+$/,"")),w("上传完成，点保存生效","ok")}catch(r){w(r.message,"err")}finally{p.value=""}}}),n.querySelector("#bgm-url-save").addEventListener("click",()=>{var r;const m=n.querySelector("#bgm-url").value.trim();if(!m){w("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/)/.test(m)){w("地址需要以 http(s):// 或 /media/ 开头","err");return}h(m,((r=m.split("/").pop())==null?void 0:r.replace(/\.[^.]+$/,""))||"外部音频"),w("已填入，点保存生效","ok")}),n.querySelector("#preview-btn").addEventListener("click",()=>{if(!i){w("还没有选择音轨","err");return}I.setTrack(i,o),I.toggle(),setTimeout(()=>{var c;return(c=n.querySelector(".music-disc"))==null?void 0:c.classList.toggle("spin",I.isPlaying())},150)}),n.querySelector("#save-bgm").addEventListener("click",async()=>{const c=n.querySelector("#bgm-title").value.trim();try{const m=await S.updateProfile({bgmUrl:i,bgmTitle:c});Le(m),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:m.bgmUrl,bgmTitle:m.bgmTitle}})),w("背景音乐已保存","ok")}catch(m){w(m.message,"err")}}),(l=n.querySelector("#clear-bgm"))==null||l.addEventListener("click",async()=>{try{const c=await S.updateProfile({bgmUrl:"",bgmTitle:""});Le(c),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),w("已移除背景音乐","ok"),await e.reload()}catch(c){w(c.message,"err")}});return}n.innerHTML=`<section class="card setting-card">
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
  </section>`,n.querySelector("#avatar-file").addEventListener("change",async i=>{var d;const o=(d=i.target.files)==null?void 0:d[0];if(o)try{const{url:h}=await S.upload(o),p=await S.updateProfile({avatar:h});Le(p),n.querySelector("#avatar-preview").src=h,w("头像已更新","ok")}catch(h){w(h.message,"err")}}),n.querySelector("#profile-form").addEventListener("submit",async i=>{var h,p,c,m,r;i.preventDefault();const o=new FormData(i.currentTarget),d=String((h=o.get("tags"))!=null?h:"").split(/[,，\s]+/).map(v=>v.trim()).filter(Boolean).slice(0,8);try{const v=await S.updateProfile({nickname:String((p=o.get("nickname"))!=null?p:"").trim(),city:String((c=o.get("city"))!=null?c:"").trim(),signature:String((m=o.get("signature"))!=null?m:"").trim(),bio:String((r=o.get("bio"))!=null?r:""),tags:d});Le(v),w("已保存","ok"),await e.reload()}catch(v){w(v.message,"err")}})}async function Jn(t,e){const a=(e.params.q||"").trim();if(t.innerHTML=`<div class="page">
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
  </div>`,t.querySelector("#search-form").addEventListener("submit",n=>{var i;n.preventDefault();const l=String((i=new FormData(n.currentTarget).get("q"))!=null?i:"").trim();location.hash=l?`#/search?q=${encodeURIComponent(l)}`:"#/search"}),!a)return;const s=t.querySelector("#search-result");try{const n=await S.search(a);if(!(n.posts.length+n.users.length+n.albums.length)){s.innerHTML=`<div class="card empty"><div class="empty-mark">${b("search",22)}</div>
        <p class="empty-title">没有找到相关内容</p><p class="empty-desc">换个关键词试试。</p></div>`;return}s.innerHTML=`
      ${n.users.length?`<h2 class="result-title">用户 <span>${n.users.length}</span></h2>
             <div class="card user-list">${n.users.map(i=>`<a class="user-row" href="#/u/${g(i.uin)}">
                   <img src="${g(i.avatar)}" alt="">
                   <div><b>${g(i.nickname)}</b><span>@${g(i.uin)} · ${g(i.signature||"")}</span></div>
                   ${b("chevron",14)}
                 </a>`).join("")}</div>`:""}
      ${n.posts.length?`<h2 class="result-title">文章 <span>${n.posts.length}</span></h2>
             <div class="post-list card">${n.posts.map(rt).join("")}</div>`:""}
      ${n.albums.length?`<h2 class="result-title">相册 <span>${n.albums.length}</span></h2>
             <div class="album-grid">${n.albums.map(i=>`<a class="album-card card" href="#/album/${i.id}">
                   <div class="album-cover">${i.cover?`<img src="${g(i.cover)}" alt="">`:""}</div>
                   <div class="album-info"><h3>${g(i.name)}</h3><p>${i.count} 张</p></div>
                 </a>`).join("")}</div>`:""}`}catch(n){w(n.message,"err")}}const Ks=document.getElementById("app"),ei=[{pattern:/^\/home$/,nav:"home",render:ya},{pattern:/^\/posts$/,nav:"posts",render:wa},{pattern:/^\/post\/(\d+)$/,nav:"posts",render:In},{pattern:/^\/write$/,nav:"",render:xs},{pattern:/^\/edit\/(\d+)$/,nav:"",render:xs},{pattern:/^\/albums$/,nav:"albums",render:jn},{pattern:/^\/album\/(\d+)$/,nav:"albums",render:Nn},{pattern:/^\/guestbook$/,nav:"guestbook",render:Un},{pattern:/^\/about$/,nav:"about",render:Fn},{pattern:/^\/u\/([^/]+)$/,nav:"",render:Zn},{pattern:/^\/messages$/,nav:"",render:Gn},{pattern:/^\/visitors$/,nav:"",render:Wn},{pattern:/^\/settings$/,nav:"",render:Yn},{pattern:/^\/search$/,nav:"",render:Jn}];let Dt=!1,Ie=!1;function ti(){const t=location.hash.replace(/^#/,"")||"/home",[e,a=""]=t.split("?");return{path:e.startsWith("/")?e:`/${e}`,query:new URLSearchParams(a)}}function si(t){var e;for(const a of ei){const s=t.match(a.pattern);if(s)return{def:a,id:(e=s[1])!=null?e:""}}return null}async function Xs(){try{const t=await S.session();if(!t.authenticated||!t.user)return!1;const e=await S.bootstrap();return da({me:e.me,themes:e.themes,unread:e.unread}),Ls(e.me.theme),!0}catch{return!1}}function Bt(){Dt=!1,X.boot=null,document.body.classList.remove("signed-in"),I.unmount(),va(Ks,async()=>{await Xs()&&Ys()})}function He(t,e,a){return`<a class="nav-link" data-nav="${e}" href="${t}">${a}</a>`}function Ys(){const t=ve();document.body.classList.add("signed-in"),Ks.innerHTML=`
  <header class="site-head">
    <div class="head-inner">
      <a class="brand" href="#/home">
        <span class="brand-mark">${b("pen",15)}</span>
        <span class="brand-text">${g(t.nickname)}<i>的空间</i></span>
      </a>

      <nav class="head-nav">
        ${He("#/home","home","首页")}
        ${He("#/posts","posts","文章")}
        ${He("#/albums","albums","相册")}
        ${He("#/guestbook","guestbook","留言板")}
        ${He("#/about","about","关于")}
      </nav>

      <form class="head-search" id="head-search">
        <span class="hs-icon">${b("search",15)}</span>
        <input name="q" placeholder="搜索文章、好友" autocomplete="off">
      </form>

      <div class="head-actions">
        <a class="btn btn-primary btn-sm write-btn" href="#/write">${b("pen",14)}<span>写文章</span></a>
        ${Lt("theme-toggle",17)}
        <a class="icon-btn badge-host" href="#/messages" title="消息">
          ${b("bell",18)}<i class="badge" data-unread ${rs()?"":"hidden"}>${rs()}</i>
        </a>
        <div class="user-chip" id="user-chip">
          ${ae(t.avatar,t.nickname,32)}
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
  </footer>`;const e=document.getElementById("head-search");e.addEventListener("submit",s=>{var l;s.preventDefault();const n=String((l=new FormData(e).get("q"))!=null?l:"").trim();n&&(location.hash=`#/search?q=${encodeURIComponent(n)}`)}),Et(document,"theme-toggle");const a=document.getElementById("user-chip");a.addEventListener("click",s=>{s.target.closest("a,button")||(Ie=!Ie,document.getElementById("user-menu").hidden=!Ie)}),document.addEventListener("click",s=>{!a.contains(s.target)&&Ie&&(Ie=!1,document.getElementById("user-menu").hidden=!0)}),document.getElementById("logout-btn").addEventListener("click",async()=>{await S.logout(),w("已退出登录"),Bt()}),Dt=!0,I.setTrack(t.bgmUrl,t.bgmTitle),I.mount(),nt()}async function nt(){var i;if(!Dt)return;const t=document.getElementById("view");if(!t)return;const{path:e,query:a}=ti(),s=si(e);if(!e.startsWith("/write")&&!e.startsWith("/edit/")&&document.body.classList.remove("writer-mode"),document.querySelectorAll("[data-nav]").forEach(o=>{o.classList.toggle("active",o.dataset.nav===(s==null?void 0:s.def.nav))}),!s){t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">页面不存在</h2>
      <p class="empty-desc">这条链接可能已经失效。</p>
      <a class="btn btn-primary" href="#/home">回到首页</a>
    </div></div>`;return}const n={...Object.fromEntries(a)};s.id&&(n.id=s.id,s.def.pattern.source.includes("[^/]")&&(n.uin=s.id)),window.scrollTo({top:0});const l={params:n,reload:nt};try{await s.def.render(t,l)}catch(o){if(o instanceof Xe&&o.status===401)return;t.innerHTML=`<div class="page narrow"><div class="card empty">
      <h2 class="empty-title">加载失败</h2>
      <p class="empty-desc">${g(o.message)}</p>
      <button class="btn btn-primary" id="retry">重试</button>
    </div></div>`,(i=t.querySelector("#retry"))==null||i.addEventListener("click",()=>void nt())}}window.addEventListener("hashchange",()=>void nt());window.addEventListener("qz:expired",()=>Bt());(async function(){await Xs()?Ys():Bt()})();window.addEventListener("qz:profile",t=>{const e=t.detail;e&&I.setTrack(e.bgmUrl,e.bgmTitle)});
