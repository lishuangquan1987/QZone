import{m as j,e as l,i as b,q as G,r as B,c as g,u as w,t as n,w as z,x as I,d as f}from"./index-BfB-QW1W.js";const D=[{key:"pop",label:"华语流行",desc:"耳熟能详的旋律，适合当背景"},{key:"folk",label:"民谣",desc:"吉他与故事，安静的下午"},{key:"guofeng",label:"国风",desc:"古筝、琵琶与戏腔"},{key:"chill",label:"治愈纯音",desc:"钢琴与自然声，写东西时听"},{key:"rock",label:"摇滚现场",desc:"有点力气，适合深夜"},{key:"easy",label:"轻快小调",desc:"轻电子与夏日感"}],F="音源：QQ 音乐试听 · 版权归原权利方，仅供个人非商业试听";function N(v){if(!Number.isFinite(v)||v<=0)return"--:--";const E=Math.floor(v/60),$=Math.round(v%60);return`${E}:${String($).padStart(2,"0")}`}const R=[{id:"light",name:"浅色",icon:"sun"},{id:"dark",name:"深色",icon:"moon"},{id:"auto",name:"跟随系统",icon:"monitor"}],O=[{key:"profile",label:"个人档"},{key:"decorate",label:"装扮"},{key:"music",label:"背景音乐"}];async function K(v,E){var P;const $=E.params.tab||"profile",c=j();v.innerHTML=`<div class="page narrow">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">SETTINGS</p>
        <h1>空间设置</h1>
        <p class="page-sub">这些设置只影响你自己的空间。</p>
      </div>
    </header>
    <nav class="seg">
      ${O.map(t=>`<button class="seg-btn ${t.key===$?"active":""}" data-tab="${t.key}" aria-pressed="${t.key===$}">${t.label}</button>`).join("")}
    </nav>
    <div id="settings-body"></div>
  </div>`,v.querySelectorAll("[data-tab]").forEach(t=>{t.addEventListener("click",()=>{location.hash=`#/settings?tab=${t.dataset.tab}`})});const d=v.querySelector("#settings-body");if($==="decorate"){d.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">空间封面</h2>
      <div class="cover-preview" style="background-image:url('${l(c.cover)}')" id="cover-preview"></div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换封面
        <input type="file" id="cover-file" accept="image/*" hidden>
      </label>

      <h2 class="setting-title">外观</h2>
      <p class="setting-hint">深色模式适合夜间写作；「跟随系统」会随设备的浅色 / 深色自动切换。这个偏好只保存在当前浏览器，不跟账号走。</p>
      <div class="theme-grid" id="appearance-grid">
        ${R.map(t=>`<button class="theme-card ${G()===t.id?"active":""}" data-appearance="${t.id}">
            <span class="mode-swatch">${b(t.icon,14)}</span>
            <span>${t.name}</span>
          </button>`).join("")}
      </div>

      <h2 class="setting-title">主题配色</h2>
      <p class="setting-hint">主题会改变链接、按钮与强调色，立刻生效。</p>
      <div class="theme-grid">
        ${B().map(t=>`<button class="theme-card ${c.theme===t.id?"active":""}" data-theme="${t.id}">
              <span class="theme-swatch" style="background:${t.accent}"></span>
              <span>${l(t.name)}</span>
            </button>`).join("")}
      </div>
    </section>`,d.querySelector("#cover-file").addEventListener("change",async t=>{var s;const r=(s=t.target.files)==null?void 0:s[0];if(r)try{const{url:o}=await g.upload(r),u=await g.updateProfile({cover:o});w(u),d.querySelector("#cover-preview").style.backgroundImage=`url('${o}')`,n("封面已更新","ok")}catch(o){n(o.message,"err")}}),d.querySelectorAll("[data-appearance]").forEach(t=>{t.addEventListener("click",()=>{z(t.dataset.appearance),d.querySelectorAll("[data-appearance]").forEach(r=>r.classList.remove("active")),t.classList.add("active")})}),d.querySelectorAll("[data-theme]").forEach(t=>{t.addEventListener("click",async()=>{const r=t.dataset.theme;try{const s=await g.updateProfile({theme:r});w(s),I(r),d.querySelectorAll("[data-theme]").forEach(o=>o.classList.remove("active")),t.classList.add("active"),n("主题已切换","ok")}catch(s){n(s.message,"err")}})});return}if($==="music"){d.innerHTML=`<section class="card setting-card">
      <h2 class="setting-title">在线华语曲库</h2>
      <p class="setting-hint">流行、民谣、国风、治愈纯音都有。点「试听」先听，满意再「设为背景」。</p>
      <div class="lib-tabs" id="lib-tabs"></div>
      <div class="lib-grid" id="music-online"><p class="muted">正在载入曲库…</p></div>
      <p class="lib-credit" id="lib-credit">${l(F)}</p>

      <h2 class="setting-title">当前背景音乐</h2>
      <div class="music-current">
        <div class="music-disc ${f.isPlaying()?"spin":""}">${b("music",16)}</div>
        <div class="music-current-meta">
          <b id="bgm-name">${l(c.bgmTitle||"还没有设置音轨")}</b>
          <span id="bgm-sub">${c.bgmUrl?"已保存，会在页面左下角循环播放":"从上面的曲库挑一首，或上传自己的音频"}</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="preview-btn">${b("play",13)} 试听</button>
      </div>
      <label class="field">
        <span>显示名称</span>
        <input class="input" id="bgm-title" maxlength="60" value="${l(c.bgmTitle)}" placeholder="比如：理想三旬">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" id="save-bgm">保存设置</button>
        ${c.bgmUrl?'<button class="btn btn-ghost danger" id="clear-bgm">移除背景音乐</button>':""}
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
    </section>`;let t=c.bgmUrl,r=c.bgmTitle;const s=e=>d.querySelector(e),o=()=>{s("#bgm-name").textContent=r||"还没有设置音轨",s("#bgm-sub").textContent=t?"已选择，保存后生效":"从上面的曲库挑一首，或上传自己的音频";const e=s("#bgm-title");e.value||(e.value=r)},u=(e,a)=>{t=e,r=a,s("#bgm-title").value=a,o(),M()};let p=null,k="";const m=()=>{p&&(p.pause(),p.src="",p=null),k="",d.querySelectorAll(".lib-play").forEach(e=>{e.classList.remove("on","loading"),e.innerHTML=b("play",12)})};window.addEventListener("hashchange",m,{once:!0});const y=e=>`
      <article class="lib-card${t===e.url?" picked":""}" data-id="${l(e.id)}">
        ${e.cover?`<img class="lib-cover" src="${l(e.cover)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:`<span class="lib-cover lib-cover-ph">${b("music",15)}</span>`}
        <div class="lib-main">
          <b>${l(e.title)}</b>
          <span>${l(e.artist||e.source||"曲库")} · ${N(e.duration)}</span>
        </div>
        <div class="lib-actions">
          <button class="btn btn-ghost btn-sm lib-play" data-play="${l(e.url)}" data-key="${l(e.id)}" aria-label="试听">${b("play",12)}</button>
          <button class="btn btn-soft btn-sm" data-pick="${l(e.url)}" data-title="${l(e.artist?`${e.title} - ${e.artist}`:e.title)}">设为背景</button>
        </div>
      </article>`;let x=D,S=[],T="all";const H=()=>{const e=[{key:"all",label:"全部"},...x];s("#lib-tabs").innerHTML=e.map(a=>`<button class="lib-tab ${a.key===T?"on":""}" data-group="${a.key}">${l(a.label)}</button>`).join("")},M=()=>{const e=T==="all"?S:S.filter(a=>a.group===T);s("#music-online").innerHTML=e.length?e.map(y).join(""):'<p class="muted">这个分类暂时没有曲目，换一个看看。</p>'};s("#lib-tabs").addEventListener("click",e=>{const a=e.target.closest("[data-group]");a&&(T=a.dataset.group,m(),H(),M())}),(async()=>{var e,a;try{const i=await g.musicLibrary();S=i.online||[],(e=i.groups)!=null&&e.length&&(x=i.groups),i.credit&&(s("#lib-credit").textContent=i.credit),H(),M(),s("#music-builtin").innerHTML=(a=i.tracks)!=null&&a.length?i.tracks.map(L=>y({...L,cover:void 0})).join(""):'<p class="muted">没有内置曲目</p>'}catch(i){s("#music-online").innerHTML=`<p class="muted">曲库加载失败：${l(i.message)}</p>`}})(),d.querySelector(".setting-card").addEventListener("click",e=>{var U;const a=e.target,i=a.closest(".lib-play");if(i){const A=i.dataset.play,C=(U=i.dataset.key)!=null?U:A;if(!A){n("演示站没有这首的播放地址","err");return}if(k===C&&p&&!p.paused){m();return}m();const h=new Audio(A);p=h,h.volume=.7,k=C,i.classList.add("loading"),i.innerHTML='<span class="lib-spin"></span>',h.addEventListener("ended",m,{once:!0}),h.addEventListener("playing",()=>{p===h&&(i.classList.remove("loading"),i.classList.add("on"),i.innerHTML=b("pause",12))},{once:!0}),h.addEventListener("error",()=>{m(),n("试听失败：音源暂时不可用，换一首或稍后再试","err")},{once:!0}),h.play().catch(()=>{m(),n("试听失败：音源暂时不可用，换一首或稍后再试","err")});return}const L=a.closest("[data-pick]");L&&(u(L.dataset.pick,L.dataset.title),n(`已选择《${L.dataset.title}》，记得点保存`,"ok"))});const q=s("#audio-file");q.addEventListener("change",async()=>{var a;const e=(a=q.files)==null?void 0:a[0];if(e){if(e.size>50*1024*1024){n("音频不能超过 50MB","err");return}n("正在上传音频…");try{const{url:i}=await g.uploadAudio(e);u(i,e.name.replace(/\.[^.]+$/,"")),n("上传完成，点保存生效","ok")}catch(i){n(i.message,"err")}finally{q.value=""}}}),s("#bgm-url-save").addEventListener("click",()=>{var i;const a=s("#bgm-url").value.trim();if(!a){n("请填写音频地址","err");return}if(!/^(https?:\/\/|\/media\/|\/api\/music\/stream)/.test(a)){n("地址需要以 http(s):// 或 /media/ 开头","err");return}u(a,((i=a.split("/").pop())==null?void 0:i.replace(/\.[^.]+$/,""))||"外部音频"),n("已填入，点保存生效","ok")}),s("#preview-btn").addEventListener("click",()=>{if(!t){n("还没有选择音轨","err");return}f.setTrack(t,r),f.toggle(),setTimeout(()=>{var e;return(e=d.querySelector(".music-disc"))==null?void 0:e.classList.toggle("spin",f.isPlaying())},150)}),s("#save-bgm").addEventListener("click",async()=>{const e=s("#bgm-title").value.trim();try{const a=await g.updateProfile({bgmUrl:t,bgmTitle:e});w(a),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:a.bgmUrl,bgmTitle:a.bgmTitle}})),t&&(f.setTrack(t,e||r),f.isPlaying()||f.toggle()),n("背景音乐已保存","ok")}catch(a){n(a.message,"err")}}),(P=s("#clear-bgm"))==null||P.addEventListener("click",async()=>{try{const e=await g.updateProfile({bgmUrl:"",bgmTitle:""});w(e),window.dispatchEvent(new CustomEvent("qz:profile",{detail:{bgmUrl:"",bgmTitle:""}})),n("已移除背景音乐","ok"),await E.reload()}catch(e){n(e.message,"err")}});return}d.innerHTML=`<section class="card setting-card">
    <div class="avatar-line">
      <img src="${l(c.avatar)}" alt="" id="avatar-preview">
      <div>
        <b>${l(c.nickname)}</b>
        <p class="muted">@${l(c.uin)} · Lv.${c.level}</p>
      </div>
      <label class="btn btn-ghost btn-sm">${b("upload",14)} 更换头像
        <input type="file" id="avatar-file" accept="image/*" hidden>
      </label>
    </div>

    <form id="profile-form" class="setting-form">
      <div class="form-2col">
        <label class="field"><span>昵称</span><input class="input" name="nickname" maxlength="20" value="${l(c.nickname)}"></label>
        <label class="field"><span>城市</span><input class="input" name="city" maxlength="20" value="${l(c.city)}"></label>
      </div>
      <label class="field"><span>一句话签名</span><input class="input" name="signature" maxlength="80" value="${l(c.signature)}"></label>
      <label class="field">
        <span>自我介绍（Markdown，会显示在「关于」页）</span>
        <textarea class="input" name="bio" rows="8" maxlength="4000" placeholder="## 关于我&#10;&#10;写文章…">${l(c.bio)}</textarea>
      </label>
      <label class="field"><span>标签（逗号分隔，最多 8 个）</span>
        <input class="input" name="tags" value="${l(c.tags.join(","))}" placeholder="写作, 摄影, 徒步">
      </label>
      <div class="setting-actions">
        <button class="btn btn-primary" type="submit">保存修改</button>
        <span class="muted">空间号注册后不可修改</span>
      </div>
    </form>
  </section>`,d.querySelector("#avatar-file").addEventListener("change",async t=>{var s;const r=(s=t.target.files)==null?void 0:s[0];if(r)try{const{url:o}=await g.upload(r),u=await g.updateProfile({avatar:o});w(u),d.querySelector("#avatar-preview").src=o,n("头像已更新","ok")}catch(o){n(o.message,"err")}}),d.querySelector("#profile-form").addEventListener("submit",async t=>{var o,u,p,k,m;t.preventDefault();const r=new FormData(t.currentTarget),s=String((o=r.get("tags"))!=null?o:"").split(/[,，\s]+/).map(y=>y.trim()).filter(Boolean).slice(0,8);try{const y=await g.updateProfile({nickname:String((u=r.get("nickname"))!=null?u:"").trim(),city:String((p=r.get("city"))!=null?p:"").trim(),signature:String((k=r.get("signature"))!=null?k:"").trim(),bio:String((m=r.get("bio"))!=null?m:""),tags:s});w(y),n("已保存","ok"),await E.reload()}catch(y){n(y.message,"err")}})}export{K as renderSettings};
