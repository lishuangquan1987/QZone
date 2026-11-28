import{c as r,i as s,k as P,e as m,l as T,n as H,b as j,t as n,g as x}from"./index-BfB-QW1W.js";import{p as B,m as N}from"./image-BpcH7nHr.js";import{b as I}from"./components-BhGUGN8P.js";async function O(c,S){c.innerHTML=`<div class="page">
    <header class="page-head">
      <div>
        <p class="page-eyebrow">GALLERY</p>
        <h1>相册</h1>
        <p class="page-sub" id="album-sub">正在读取…</p>
      </div>
      <button class="btn btn-primary" id="new-album">${s("plus",15)} 新建相册</button>
    </header>
    <div class="album-grid" id="album-grid"></div>
  </div>`;const w=c.querySelector("#album-grid"),a=async()=>{const t=await r.albums(),b=t.albums.reduce((h,f)=>h+f.count,0),y=t.albums.filter(h=>h.privacy!=="public").length;c.querySelector("#album-sub").textContent=`${t.albums.length} 个相册 · 共 ${b} 张照片`+(y?` · ${y} 个未公开`:""),w.innerHTML=t.albums.length?t.albums.map(I).join(""):`<div class="card empty"><div class="empty-mark">${s("image",22)}</div>
          <p class="empty-title">还没有相册</p><p class="empty-desc">把照片整理进来，它们会真实保存在服务器上。</p></div>`};await a(),c.querySelector("#new-album").addEventListener("click",async()=>{await P({title:"新建相册",body:`<div class="modal-form">
        <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" placeholder="比如：2026 春天"></label>
        <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" placeholder="一句话说明"></label>
        <label class="field"><span>可见范围</span>
          <select class="input" id="a-priv">
            <option value="public">所有人可见</option>
            <option value="unlisted">不公开列出</option>
            <option value="private">仅自己可见</option>
          </select>
        </label>
      </div>`,confirmText:"创建",onConfirm:async t=>{const b=t.querySelector("#a-name").value.trim();return b?(await r.createAlbum({name:b,description:t.querySelector("#a-desc").value.trim(),privacy:t.querySelector("#a-priv").value}),n("相册已创建","ok"),await a(),!0):(n("请填写相册名称","err"),!1)}})})}const $={public:{label:"公开",desc:"出现在相册列表，所有人可看",icon:"globe"},unlisted:{label:"隐藏",desc:"不在列表出现，知道链接才能看",icon:"eyeoff"},private:{label:"仅自己",desc:"只有你登录后能看到",icon:"lock"}};async function R(c,S){const w=Number(S.params.id);let a=await r.album(w);const t=()=>{var y,h,f,L,q;const b=(y=$[a.privacy])!=null?y:$.public;c.innerHTML=`<div class="page">
      <header class="page-head">
        <div>
          <a class="back-link" href="#/albums">${s("back",14)} 全部相册</a>
          <h1>${m(a.name)}</h1>
          <p class="page-sub">${m(a.description||"没有描述")} · ${a.count} 张 · ${T(a.at)}创建
            <span class="pill album-state ${a.privacy}">${s(b.icon,11)}${b.label}</span>
          </p>
        </div>
        ${a.canEdit?`<div class="head-btns">
                <button class="btn btn-ghost btn-sm" id="album-config">${s("settings",14)} 设置</button>
                <label class="btn btn-primary btn-sm" title="单张上限 30MB，超过会自动压缩">${s("upload",14)} 上传照片
                  <input type="file" id="photo-file" accept="image/*" multiple hidden>
                </label>
                <button class="btn btn-ghost btn-sm danger" id="del-album" title="删除相册">${s("trash",14)}</button>
              </div>`:""}
      </header>
      <div class="photo-grid" id="photo-grid">
        ${(h=a.photos)!=null&&h.length?a.photos.map(e=>`<figure class="photo" data-pid="${e.id}">
                    <img src="${m(H(e.url,480))}" alt="${m(e.caption)}" loading="lazy" decoding="async" width="${e.width||800}" height="${e.height||600}" data-zoom="${m(e.url)}">
                    <figcaption>
                      <span>${m(e.caption||T(e.at))}</span>
                      <span class="photo-like">${s("heart",12)} ${e.likeCount}</span>
                    </figcaption>
                    <div class="photo-tools">
                      <button class="photo-btn" data-like="${e.id}" title="赞">${s("heart",14)}</button>
                      ${a.canEdit?`<button class="photo-btn danger" data-del="${e.id}" title="删除">${s("trash",14)}</button>`:""}
                    </div>
                  </figure>`).join(""):`<div class="card empty"><div class="empty-mark">${s("image",22)}</div>
                <p class="empty-title">相册还是空的</p><p class="empty-desc">上传一张照片，它会真实写入磁盘；大图会先在浏览器里压缩。</p></div>`}
      </div>
    </div>`,j(c),(f=c.querySelector("#album-config"))==null||f.addEventListener("click",async()=>{await P({title:"相册设置",body:`<div class="modal-form">
          <label class="field"><span>名称</span><input class="input" id="a-name" maxlength="24" value="${m(a.name)}"></label>
          <label class="field"><span>描述</span><input class="input" id="a-desc" maxlength="120" value="${m(a.description)}" placeholder="一句话说明"></label>
          <div class="field"><span>谁可以看到</span>
            <div class="vis-pick">
              ${Object.entries($).map(([e,l])=>`<label class="vis-opt">
                    <input type="radio" name="vis" value="${e}" ${a.privacy===e?"checked":""}>
                    <span class="vis-ico">${s(l.icon,15)}</span>
                    <b>${l.label}</b>
                    <i>${l.desc}</i>
                  </label>`).join("")}
            </div>
          </div>
        </div>`,confirmText:"保存",onConfirm:async e=>{var u,o;const l=e.querySelector("#a-name").value.trim();if(!l)return n("请填写相册名称","err"),!1;const i=(o=(u=e.querySelector("input[name=vis]:checked"))==null?void 0:u.value)!=null?o:a.privacy;return a=await r.updateAlbum(a.id,{name:l,description:e.querySelector("#a-desc").value.trim(),privacy:i}),n(i==="public"?"已设为公开":`已设为${$[i].label}`,"ok"),t(),!0}})}),(L=c.querySelector("#photo-file"))==null||L.addEventListener("change",async e=>{var u;const l=e.target,i=Array.from((u=l.files)!=null?u:[]);if(i.length){n(`正在处理 ${i.length} 张…`);try{const o=new Array(i.length).fill(null);let d=0;const v=async()=>{for(;d<i.length;){const p=d++,g=await B(i[p]),{url:C}=await r.upload(g.file);o[p]={url:C,size:g.size,w:g.width,h:g.height,saved:g.originalSize-g.size}}};await Promise.all([v(),v(),v()]);const A=[],z=[],E=[],M=[];let k=0;for(const p of o)p&&(A.push(p.url),z.push(p.size),E.push(p.w),M.push(p.h),k+=p.saved);a=await r.addPhotos(a.id,A,{sizes:z,widths:E,heights:M}),n(k>512*1024?`上传完成，压缩节省 ${N(k)}`:"上传完成","ok"),t()}catch(o){n(o.message,"err")}finally{l.value=""}}}),(q=c.querySelector("#del-album"))==null||q.addEventListener("click",async()=>{if(await x("删除相册",`《${a.name}》及其中 ${a.count} 张照片会一起删除。`))try{await r.deleteAlbum(a.id),n("相册已删除","ok"),location.hash="#/albums"}catch(e){n(e.message,"err")}}),c.querySelector("#photo-grid").addEventListener("click",async e=>{var o;const l=e.target,i=l.closest("[data-like]");if(i){e.stopPropagation();try{const d=await r.likePhoto(Number(i.dataset.like));i.classList.toggle("active",d.liked);const v=(o=i.closest(".photo"))==null?void 0:o.querySelector(".photo-like");v&&(v.innerHTML=`${s("heart",12)} ${d.count}`)}catch(d){n(d.message,"err")}return}const u=l.closest("[data-del]");if(u){if(e.stopPropagation(),!await x("删除照片","确定从相册中删除这张照片吗？"))return;try{await r.deletePhoto(a.id,Number(u.dataset.del)),a=await r.album(a.id),t(),n("已删除","ok")}catch(d){n(d.message,"err")}}})};t()}export{$ as ALBUM_VIS,R as renderAlbum,O as renderAlbums};
