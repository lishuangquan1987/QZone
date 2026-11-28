import{c as W,i as d,e as k,h as _t,j as Vt,t as h}from"./index-BfB-QW1W.js";import{p as xt,m as bt}from"./image-BpcH7nHr.js";import{r as Jt}from"./md-BKUISFuz.js";const Gt=["随笔","城市","旅行","技术","阅读","生活"],Y="`".repeat(3),Ht=30;let tt=null;const qt="qz.editor.mode",ft="qz.editor.split";async function te(u,R){var Et,St,Ct,Tt,It,Mt,Dt;const p=R.params.id?Number(R.params.id):0;let a=null;if(p&&(a=await W.post(p),!a.canEdit)){u.innerHTML='<div class="page narrow"><div class="card empty"><p class="empty-title">只能编辑自己的文章</p></div></div>';return}tt==null||tt();const L=new AbortController;let z=null,j=!1,N=0,et=0,nt=0,st=!1;tt=()=>{if(j=!0,window.clearTimeout(N),window.clearTimeout(et),window.clearTimeout(nt),!st)try{D.classList.contains("dirty")&&i.value.trim()&&localStorage.setItem(B,JSON.stringify(wt()))}catch{}L.abort(),z==null||z(),document.body.classList.remove("writer-mode")};let y=(Et=a==null?void 0:a.cover)!=null?Et:"",_=(St=a==null?void 0:a.images)!=null?St:[];const B=`qz.draft.${p||"new"}`;let I=Qt(),V=Number(localStorage.getItem(ft))||50;document.body.classList.add("writer-mode"),u.innerHTML=`<div class="wr" id="wr">
    <header class="wr-bar">
      <a class="wr-back" href="${p?`#/post/${p}`:"#/home"}" title="返回">${d("back",16)}</a>
      <input class="wr-title" id="title" maxlength="80" placeholder="标题" value="${k((Ct=a==null?void 0:a.title)!=null?Ct:"")}" autocomplete="off">
      <span class="wr-state" id="save-state">未保存</span>
      <div class="wr-modes" id="mode-switch">
        <button data-mode="edit" title="只显示编辑区（Ctrl+Shift+E）">编辑</button>
        <button data-mode="split" title="左右分屏（Ctrl+Shift+S）">分屏</button>
        <button data-mode="preview" title="只看效果（Ctrl+Shift+V）">预览</button>
      </div>
      <div class="wr-tools">
        <button class="wr-ibtn" id="btn-outline" title="大纲">${d("outline",16)}</button>
        <button class="wr-ibtn wr-only-mobile" id="btn-eye" title="预览">${d("eye",16)}</button>
        <button class="wr-ibtn" id="btn-side" title="封面与可见范围">${d("settings",16)}</button>
        <button class="wr-ibtn" id="btn-full" title="全屏写作（F11）">${d("expand",15)}</button>
        ${_t("btn-theme",16,"wr-ibtn")}
        <button class="wr-ibtn" id="btn-help" title="快捷键（Ctrl+/）">?</button>
        <button class="btn btn-primary btn-sm" id="save-btn">${d("check",13)} ${p?"保存修改":"发布"}</button>
      </div>
    </header>

    <div class="wr-draft" id="draft-bar" hidden>
      <span id="draft-text">发现未发布的草稿</span>
      <button class="btn btn-ghost btn-sm" id="draft-restore">恢复草稿</button>
      <button class="text-btn" id="draft-discard">丢弃</button>
    </div>

    <div class="wr-body" id="body" data-mode="${I}" style="--split:${V}%">
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
            <button class="tb-btn" data-cmd="code" title="行内代码（Ctrl+E）">${d("codeInline",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="quote" title="引用">${d("message",15)}</button>
            <button class="tb-btn" data-cmd="codeblock" title="代码块（Ctrl+Shift+C）">${d("codeBlock",15)}</button>
            <button class="tb-btn" data-cmd="ul" title="无序列表">${d("listUl",15)}</button>
            <button class="tb-btn" data-cmd="ol" title="有序列表">${d("listOl",15)}</button>
            <button class="tb-btn" data-cmd="task" title="任务列表">${d("task",15)}</button>
          </div>
          <div class="tb-group">
            <button class="tb-btn" data-cmd="link" title="链接（Ctrl+K）">${d("link",15)}</button>
            <label class="tb-btn" title="插入图片（也可直接粘贴或拖入）">
              ${d("image",15)}<input type="file" id="img-input" accept="image/*" multiple hidden>
            </label>
            <button class="tb-btn" data-cmd="table" title="表格">${d("table",15)}</button>
            <button class="tb-btn" data-cmd="hr" title="分割线">—</button>
          </div>
          <span class="tb-hint" id="tb-hint">Ctrl+V 直接粘贴截图</span>
        </div>
        <div class="wr-scroll" id="edit-scroll">
          <textarea class="wr-input" id="content" spellcheck="false" wrap="soft" placeholder="从这里开始写…

## 小标题
- 列表项，回车自动续行
> 引用一段话

直接按 Ctrl+V 粘贴截图，图片会先压缩再插入正文。">${k((Tt=a==null?void 0:a.content)!=null?Tt:"")}</textarea>
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
          <button class="wr-ibtn" data-close="outline" title="关闭">${d("close",14)}</button>
        </div>
        <div class="wr-outline-list" id="outline-list"></div>
      </aside>

      <aside class="wr-drawer wr-side" id="side" data-open="false">
        <div class="wr-drawer-head">
          <b>文章设置</b>
          <button class="wr-ibtn" data-close="side" title="关闭">${d("close",14)}</button>
        </div>
        <div class="wr-drawer-body">
          <section class="rail-card">
            <h3>封面</h3>
            <div class="cover-slot" id="cover-slot">
              ${y?`<img src="${k(y)}" alt="">`:"<span>点击上传封面</span>"}
              <input type="file" id="cover-input" accept="image/*" hidden>
            </div>
          </section>
          <section class="rail-card">
            <h3>文章设置</h3>
            <label class="field">
              <span>分类</span>
              <input class="input" id="category" list="cat-list" maxlength="16" value="${k((It=a==null?void 0:a.category)!=null?It:"随笔")}">
              <datalist id="cat-list">${Gt.map(t=>`<option value="${t}">`).join("")}</datalist>
            </label>
            <label class="field">
              <span>可见范围</span>
              <select class="input" id="visibility">
                <option value="public" ${(a==null?void 0:a.visibility)==="public"?"selected":""}>所有人可见</option>
                <option value="unlisted" ${(a==null?void 0:a.visibility)==="unlisted"?"selected":""}>不公开列出（仅链接可见）</option>
                <option value="private" ${(a==null?void 0:a.visibility)==="private"?"selected":""}>仅自己可见</option>
              </select>
            </label>
            <label class="checkline">
              <input type="checkbox" id="pinned" ${a!=null&&a.pinned?"checked":""}>
              <span>在首页置顶</span>
            </label>
          </section>
          <section class="rail-card">
            <h3>正文配图</h3>
            <div class="editor-thumbs" id="thumbs">
              ${_.map(t=>`<img src="${k(t)}" alt="" data-zoom="${k(t)}">`).join("")||'<span class="muted">还没有配图</span>'}
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
      <span class="wr-hint">Tab 缩进 · 回车续行 · ${Ht}MB 内图片自动压缩</span>
    </footer>

    <div class="wr-help" id="help" hidden>
      <div class="wr-help-card">
        <div class="wr-help-head">
          <b>快捷键</b>
          <button class="wr-ibtn" id="help-close">${d("close",14)}</button>
        </div>
        <div class="wr-help-grid">
          ${[["Ctrl + B / I","加粗 / 斜体"],["Ctrl + E","行内代码"],["Ctrl + K","插入链接"],["Ctrl + 1 / 2 / 3","一 / 二 / 三级标题"],["Ctrl + Shift + C","代码块"],["Ctrl + Shift + 8 / 7","无序 / 有序列表"],["Ctrl + Shift + Q","引用"],["Ctrl + Shift + E / S / V","编辑 / 分屏 / 预览"],["Ctrl + S","保存"],["Tab / Shift + Tab","整行缩进 / 反缩进"],["Ctrl + V","粘贴截图直接插图"],["Ctrl + /","打开本面板"]].map(([t,e])=>`<div class="k"><kbd>${t}</kbd><span>${e}</span></div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;const l=t=>u.querySelector(t);z=Vt(u,"btn-theme");const M=l("#title"),i=l("#content"),mt=l("#preview"),J=l("#body"),f=l("#splitter"),it=l("#pv-scroll"),At=l("#thumbs"),D=l("#save-state"),Ot=l("#stat-words"),Rt=l("#stat-read"),zt=l("#stat-cursor"),jt=l("#pv-meta"),lt=l("#draft-bar"),E=l("#outline"),at=l("#outline-list"),x=l("#side"),F=l("#help"),S=t=>{I=t,J.dataset.mode=t,localStorage.setItem(qt,t),u.querySelectorAll("#mode-switch button").forEach(e=>{e.classList.toggle("active",e.dataset.mode===t)}),l("#btn-eye").classList.toggle("on",t==="preview"),t==="preview"?Q(!0):i.focus()};u.querySelectorAll("#mode-switch button").forEach(t=>{t.addEventListener("click",()=>S(t.dataset.mode))}),l("#btn-eye").addEventListener("click",()=>S(I==="edit"?"preview":"edit"));const H=(t,e)=>{t.dataset.open=String(e),t===E&&l("#btn-outline").classList.toggle("on",e),t===x&&l("#btn-side").classList.toggle("on",e)};l("#btn-outline").addEventListener("click",()=>H(E,E.dataset.open!=="true")),l("#btn-side").addEventListener("click",()=>H(x,x.dataset.open!=="true")),u.querySelectorAll("[data-close]").forEach(t=>{t.addEventListener("click",()=>H(t.dataset.close==="side"?x:E,!1))});const ot=l("#wr"),G=l("#btn-full"),Bt=()=>{var t;document.fullscreenElement?document.exitFullscreen():(t=ot.requestFullscreen)==null||t.call(ot).catch(()=>h("当前环境不支持全屏","err"))};G.addEventListener("click",Bt),document.addEventListener("fullscreenchange",()=>{const t=!!document.fullscreenElement;G.innerHTML=t?d("compress",15):d("expand",15),G.classList.toggle("on",t),G.title=t?"退出全屏":"全屏写作"},{signal:L.signal});function Q(t=!1){window.clearTimeout(et);const e=()=>{if(j)return;const n=i.value;mt.innerHTML=n.trim()?Jt(n):'<p class="muted">预览会显示在这里</p>';const s=mt.querySelectorAll("h1,h2,h3,h4,p,li,pre,blockquote,table").length;jt.textContent=`${s} 个段落`};t?e():et=window.setTimeout(e,140)}function ht(){var o,r;const t=i.value,e=((o=t.match(/[\u3400-\u9fa5]/g))!=null?o:[]).length,n=((r=t.replace(/[\u3400-\u9fa5]/g," ").match(/[A-Za-z0-9_]+/g))!=null?r:[]).length,s=e+n;Ot.textContent=`${s.toLocaleString()} 字`,Rt.textContent=`约 ${Math.max(1,Math.round(s/400))} 分钟`}function q(){const t=i.selectionStart,e=i.value.slice(0,t),n=e.split(`
`).length,s=t-(e.lastIndexOf(`
`)+1)+1;zt.textContent=`第 ${n} 行 · 第 ${s} 列`}function gt(){window.clearTimeout(nt),nt=window.setTimeout(()=>{if(j)return;const t=Ut(i.value);if(!t.length){at.innerHTML='<p class="muted">标题会出现在这里</p>';return}at.innerHTML=t.map((e,n)=>`<button class="ol-item lv${e.level}" data-i="${n}"><span>${k(e.text)}</span></button>`).join(""),at.querySelectorAll(".ol-item").forEach(e=>{e.addEventListener("click",()=>{const n=t[Number(e.dataset.i)];n&&Ft(n.offset),window.innerWidth<1e3&&H(E,!1)})})},260)}function Ft(t){const e=getComputedStyle(i),n=parseFloat(e.paddingLeft)+parseFloat(e.paddingRight),s=document.createElement("div");s.style.cssText=["position:absolute","visibility:hidden","top:0","left:0",`width:${Math.max(80,i.clientWidth-n)}px`,`font:${e.font}`,`line-height:${e.lineHeight}`,`letter-spacing:${e.letterSpacing}`,"white-space:pre-wrap","overflow-wrap:break-word","word-break:break-word"].join(";");const o=i.value.lastIndexOf(`
`,t-1)+1;s.textContent=i.value.slice(0,o),document.body.appendChild(s);const r=s.getBoundingClientRect().height;s.remove(),i.scrollTop=Math.max(0,r-8),i.focus(),i.setSelectionRange(t,t),q()}const Pt=()=>{try{const t=localStorage.getItem(B);return t?JSON.parse(t):null}catch{return null}},wt=()=>{var t,e,n,s,o,r;return{title:M.value,content:i.value,category:(e=(t=l("#category"))==null?void 0:t.value)!=null?e:"随笔",visibility:(s=(n=l("#visibility"))==null?void 0:n.value)!=null?s:"public",pinned:(r=(o=l("#pinned"))==null?void 0:o.checked)!=null?r:!1,cover:y,savedAt:Date.now()}},U=()=>{window.clearTimeout(N),D.textContent="未保存",D.classList.add("dirty"),N=window.setTimeout(()=>{if(j||st)return;localStorage.setItem(B,JSON.stringify(wt()));const t=new Date;D.textContent=`已存草稿 ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`,D.classList.remove("dirty")},1200)},g=Pt();if(g&&(g.content!==((Mt=a==null?void 0:a.content)!=null?Mt:"")||g.title!==((Dt=a==null?void 0:a.title)!=null?Dt:""))){const t=new Date(g.savedAt);l("#draft-text").textContent=`发现 ${t.getMonth()+1} 月 ${t.getDate()} 日 ${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")} 的草稿`,lt.hidden=!1,l("#draft-restore").addEventListener("click",()=>{M.value=g.title,i.value=g.content,l("#category").value=g.category||"随笔",l("#visibility").value=g.visibility||"public",l("#pinned").checked=!!g.pinned,y=g.cover||y,y&&kt(y),lt.hidden=!0,rt(),Q(!0),h("已恢复草稿","ok")}),l("#draft-discard").addEventListener("click",()=>{localStorage.removeItem(B),lt.hidden=!0})}const rt=()=>{ht(),q(),Q(),gt(),U()},A=(t,e,n,s,o)=>{i.focus(),i.setSelectionRange(t,e);let r=!1;try{r=document.execCommand("insertText",!1,n)}catch{r=!1}r||i.setRangeText(n,t,e,"end"),i.setSelectionRange(s,o),rt()},P=(t,e=0,n=0)=>{const s=i.selectionStart,o=i.selectionEnd;A(s,o,t,s+e,s+(n||t.length))},X=(t,e,n)=>{const s=i.selectionStart,o=i.selectionEnd,r=i.value.slice(s,o)||n;A(s,o,t+r+e,s+t.length,s+t.length+r.length)},yt=()=>{const t=i.selectionStart,e=i.selectionEnd,n=i.value.lastIndexOf(`
`,Math.max(0,t-1))+1,s=i.value.indexOf(`
`,e),o=s===-1?i.value.length:s;return{lineStart:n,lineEnd:o}},C=(t,e)=>{const{lineStart:n,lineEnd:s}=yt(),r=(i.value.slice(n,s)||e).split(`
`),b=r.every(c=>c.startsWith(t)),m=r.map(c=>b?c.slice(t.length):t+c.replace(/^([-*+]\s+|\d+\.\s+|>\s+|#{1,6}\s+)/,"")).join(`
`);A(n,s,m,n,n+m.length)},v={h1:()=>C("# ","一级标题"),h2:()=>C("## ","二级标题"),h3:()=>C("### ","三级标题"),bold:()=>X("**","**","加粗文字"),italic:()=>X("*","*","斜体文字"),strike:()=>X("~~","~~","删除线"),code:()=>X("`","`","code"),quote:()=>C("> ","引用一段话"),ul:()=>C("- ","列表项"),ol:()=>C("1. ","列表项"),task:()=>C("- [ ] ","待办事项"),codeblock:()=>P(`
${Y}
// code
${Y}
`,Y.length+2,Y.length+9),hr:()=>P(`
---
`),link:()=>{const t=i.value.slice(i.selectionStart,i.selectionEnd);P(`[${t||"链接文字"}](https://)`,t?t.length+3:1,t?t.length+11:5)},table:()=>P(`
| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |
`)};l("#toolbar").addEventListener("click",t=>{var n,s;const e=t.target.closest("[data-cmd]");e&&(t.preventDefault(),(s=v[(n=e.dataset.cmd)!=null?n:""])==null||s.call(v))});const Kt=/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/,Wt=()=>{const t=i.selectionStart;if(t!==i.selectionEnd)return!1;const e=i.value.lastIndexOf(`
`,t-1)+1,n=i.value.slice(e,t),s=n.match(Kt);if(!s)return!1;const[,o,r,b]=s;if(!n.slice(s[0].length).trim())return A(e,t,"",e,e),!0;let c=`
`+o;return/^\d+\.$/.test(r)?c+=`${parseInt(r,10)+1}. `:c+=r+" ",b&&(c+="[ ] "),A(t,t,c,t+c.length,t+c.length),!0},Nt=t=>{var T;const{lineStart:e,lineEnd:n}=yt(),o=i.value.slice(e,n).split(`
`),r=o.map($=>t?$.replace(/^ {1,2}|^\t/,""):"  "+$).join(`
`),b=i.selectionStart===i.selectionEnd;let m=e,c=e+r.length;if(b){const $=i.selectionStart-e,w=((T=o[0].match(/^ {1,2}|^\t/))!=null?T:[""])[0].length,vt=t?Math.max(0,$-w):$+2;m=e+vt,c=m}A(e,n,r,m,c)};i.addEventListener("keydown",t=>{const e=t.metaKey||t.ctrlKey,n=t.key.toLowerCase();if(t.key==="Tab"){t.preventDefault(),Nt(t.shiftKey);return}if(!e&&t.key==="Enter"&&!t.altKey&&!t.isComposing&&Wt()){t.preventDefault();return}if(e){if(t.shiftKey){n==="c"?(t.preventDefault(),v.codeblock()):t.key==="8"||t.key==="*"?(t.preventDefault(),v.ul()):t.key==="7"||t.key==="&"?(t.preventDefault(),v.ol()):n==="q"?(t.preventDefault(),v.quote()):n==="e"?(t.preventDefault(),S("edit")):n==="s"?(t.preventDefault(),S("split")):n==="v"&&(t.preventDefault(),S("preview"));return}n==="b"?(t.preventDefault(),v.bold()):n==="i"?(t.preventDefault(),v.italic()):n==="k"?(t.preventDefault(),v.link()):n==="e"?(t.preventDefault(),v.code()):n==="s"?(t.preventDefault(),Lt()):n==="1"||n==="2"||n==="3"?(t.preventDefault(),v[`h${n}`]()):n==="/"&&(t.preventDefault(),K())}}),i.addEventListener("keyup",q),i.addEventListener("click",q),i.addEventListener("select",q),i.addEventListener("input",rt);let ct=!1;const $t=(t,e)=>{if(I!=="split"||ct)return;ct=!0;const n=t.scrollHeight-t.clientHeight,s=n>0?t.scrollTop/n:0;e.scrollTop=s*(e.scrollHeight-e.clientHeight),requestAnimationFrame(()=>{ct=!1})};i.addEventListener("scroll",()=>$t(i,it),{passive:!0}),it.addEventListener("scroll",()=>$t(it,i),{passive:!0}),f.addEventListener("pointerdown",t=>{I!=="split"&&S("split"),t.preventDefault(),f.setPointerCapture(t.pointerId),f.classList.add("dragging"),document.body.classList.add("wr-resizing");const e=s=>{const o=J.getBoundingClientRect(),r=(s.clientX-o.left)/o.width*100,b=Math.min(78,Math.max(22,r));V=b,J.style.setProperty("--split",`${b}%`)},n=()=>{f.classList.remove("dragging"),document.body.classList.remove("wr-resizing"),localStorage.setItem(ft,String(Math.round(V))),f.removeEventListener("pointermove",e),f.removeEventListener("pointerup",n),f.removeEventListener("pointercancel",n)};f.addEventListener("pointermove",e),f.addEventListener("pointerup",n),f.addEventListener("pointercancel",n)}),f.addEventListener("dblclick",()=>{V=50,J.style.setProperty("--split","50%"),localStorage.setItem(ft,"50")});const dt=new Set,ut=async(t,e="图片")=>{const n=t.filter(c=>c.type.startsWith("image/")?!0:(h("只能插入图片文件","err"),!1));if(!n.length)return;const s=new Array(n.length).fill(null);let o=0;const r=async()=>{for(;o<n.length;){const c=o++,T=n[c],$=`${T.name}-${T.size}`;if(!dt.has($)){dt.add($);try{const w=await xt(T);if(w.size>Ht*1024*1024)throw new Error(`压缩后仍有 ${bt(w.size)}，超过上限`);const{url:vt}=await W.upload(w.file);s[c]={url:vt,name:(T.name||e).replace(/\.[^.]+$/,"")||e,note:w.compressed?`已压缩 ${bt(w.originalSize)} → ${bt(w.size)}`:null}}catch(w){h(w.message,"err")}finally{dt.delete($)}}}};h(n.length>1?`正在处理 ${n.length} 张…`:`正在处理 ${n[0].name||e}…`),await Promise.all([r(),r(),r()]);let b=0;for(const c of s)c&&(_.push(c.url),P(`
![${c.name}](${c.url})
`),c.note&&b++);At.innerHTML=_.map(c=>`<img src="${k(c)}" alt="">`).join("");const m=s.filter(Boolean).length;m&&h(b?`${m} 张已插入，其中 ${b} 张经过压缩`:`${m} 张图片已插入`,"ok")};i.addEventListener("paste",t=>{const e=t.clipboardData;if(!e)return;const n=Array.from(e.items).filter(s=>s.kind==="file"&&s.type.startsWith("image/")).map(s=>s.getAsFile()).filter(s=>!!s);n.length&&(t.preventDefault(),ut(n,"粘贴的图片"))});const O=l("#pane-edit");O.addEventListener("dragover",t=>{var e;(e=t.dataTransfer)!=null&&e.types.includes("Files")&&(t.preventDefault(),O.classList.add("dropping"))}),O.addEventListener("dragleave",()=>O.classList.remove("dropping")),O.addEventListener("drop",t=>{var n,s;const e=Array.from((s=(n=t.dataTransfer)==null?void 0:n.files)!=null?s:[]).filter(o=>o.type.startsWith("image/"));e.length&&(t.preventDefault(),O.classList.remove("dropping"),ut(e))}),l("#img-input").addEventListener("change",async t=>{var s;const e=t.target,n=Array.from((s=e.files)!=null?s:[]);n.length&&await ut(n),e.value=""});const Z=l("#cover-slot"),pt=l("#cover-input"),kt=t=>{var e,n;(e=Z.querySelector("img"))==null||e.remove(),(n=Z.querySelector("span"))==null||n.remove(),Z.insertAdjacentHTML("afterbegin",t?`<img src="${k(t)}" alt="">`:"<span>点击上传封面</span>")};Z.addEventListener("click",()=>pt.click()),pt.addEventListener("change",async()=>{var e;const t=(e=pt.files)==null?void 0:e[0];if(t)try{const n=await xt(t),{url:s}=await W.upload(n.file);y=s,kt(s),U(),h("封面已更新","ok")}catch(n){h(n.message,"err")}});function K(t){const e=t!=null?t:F.hidden;F.hidden=!e}l("#btn-help").addEventListener("click",()=>K()),l("#help-close").addEventListener("click",()=>K(!1)),F.addEventListener("click",t=>{t.target===F&&K(!1)}),document.addEventListener("keydown",t=>{t.key==="Escape"&&(F.hidden?E.dataset.open==="true"?H(E,!1):x.dataset.open==="true"&&H(x,!1):K(!1))},{signal:L.signal}),M.addEventListener("input",U),u.querySelectorAll("#category,#visibility,#pinned").forEach(t=>t.addEventListener("change",U));const Lt=async()=>{const t={title:M.value.trim(),content:i.value,cover:y,category:l("#category").value.trim()||"随笔",visibility:l("#visibility").value,pinned:l("#pinned").checked,images:_};if(!t.title&&!t.content.trim()){h("写个标题或正文再发布","err");return}const e=l("#save-btn");e.disabled=!0,e.textContent="保存中…";try{const n=p?await W.updatePost(p,t):await W.createPost(t);st=!0,window.clearTimeout(N),localStorage.removeItem(B),h(p?"已保存":"已发布","ok"),location.hash=`#/post/${n.id}`}catch(n){h(n.message,"err"),e.disabled=!1,e.innerHTML=`${d("check",13)} ${p?"保存修改":"发布"}`}};l("#save-btn").addEventListener("click",()=>void Lt()),window.addEventListener("beforeunload",t=>{D.classList.contains("dirty")&&i.value.trim()&&(t.preventDefault(),t.returnValue="")},{signal:L.signal}),ht(),q(),gt(),Q(!0),S(I),M.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),i.focus(),i.setSelectionRange(0,0))}),window.innerWidth<1e3&&!(a!=null&&a.title)?M.focus():(i.focus(),i.setSelectionRange(i.value.length,i.value.length))}function Qt(){const u=localStorage.getItem(qt);return u==="edit"||u==="split"||u==="preview"?u:window.innerWidth>=1e3?"split":"edit"}function Ut(u){var L;const R=[],p=/^(#{1,6})[ \t]+(.+?)[ \t]*$/gm;let a;for(;a=p.exec(u);)((L=u.slice(0,a.index).match(/^```/gm))!=null?L:[]).length%2!==1&&R.push({level:a[1].length,text:a[2].replace(/[*_`~]/g,""),offset:a.index});return R}export{te as renderEditor};
