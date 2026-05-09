/* =============================================
   PORTFOLIO SCRIPT v4
   — data.json + localStorage persistence
   — Lightbox (video + image + keyboard nav)
   — Image portfolio support (img/portfolio/)
   — Dynamic theme system
   — Full admin panel
   ============================================= */

/* ================================================
   FALLBACK DATA
   ================================================ */
const FALLBACK_DATA = {
    reelUrl: "https://player.vimeo.com/video/1169127503?title=0&byline=0&portrait=0",
    portfolio: [
        {type:"video",id:"devW0oJUFRk",title:"KPop Demon Hunters"},
        {type:"video",id:"dex4vsSgK8A",title:"football bluelock"},
        {type:"video",id:"5oIfkuYBtLg",title:"hand"},
        {type:"video",id:"p2Zyb89sXoY",title:"lifting heavy"},
        {type:"video",id:"xzfF2g12BP4",title:"Static - FLAVOR FOLEY (Fan 3D Animation)"},
        {type:"video",id:"50XBFJeMdfA",title:"\u0e40\u0e21\u0e37\u0e48\u0e2d Lava Chicken \u0e2d\u0e22\u0e39\u0e48\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e44\u0e17\u0e22"},
        {type:"video",id:"9KTGKXc4XYc",title:"Iron Landing"},
        {type:"video",id:"-HGcIdC-sAg",title:"\u0e27\u0e48\u0e32\u0e14\u0e49\u0e27\u0e22\u0e01\u0e32\u0e23\u0e2b\u0e32\u0e04\u0e49\u0e2d\u0e19"},
        {type:"video",id:"R0XCXMMP5G8",title:"Midterm Final"},
        {type:"video",id:"4tB731jNpTw",title:"Project CRA Charity Run#5"},
        {type:"video",id:"V8pVpn3ftBQ",title:"bouncy ball"},
        {type:"video",id:"w_EWc5K7SHs",title:"ZENT - Overital"},
        {type:"video",id:"KYIcZnQCRDM",title:"Boxing"},
        {type:"video",id:"2F-CXlheMWo",title:"Walk cycle 003"},
        {type:"video",id:"HmKEqZBP7N8",title:"Jumpha: character select animation"},
        {type:"video",id:"K_jDPXL4zdk",title:"ZENT Overital"},
        {type:"video",id:"dEO1n5XmTnA",title:"\u0e40\u0e2d\u0e32\u0e02\u0e49\u0e2d\u0e04\u0e34\u0e14\u0e21\u0e32\u0e1d\u0e32\u0e01"},
        {type:"video",id:"ixTTWdGs1UY",title:"AE1"},
        {type:"video",id:"jRConNGJ1Zc",title:"AE2"}
    ],
    site: {
        title: "Rachapon Thatprasert",
        subtitle: "3D Animator / Character Animation",
        url: "https://www.rachaponthat-portfolio.com",
        logo1: "", deco: "", bgImg: "", bgImgOpacity: 0.15
    },
    reel: {
        label: "Showreel 2024",
        title: "3D Animation Reel",
        caption: "Character animation \u00b7 Body mechanics \u00b7 Facial performance",
        embedUrl: "https://player.vimeo.com/video/1169127503?title=0&byline=0&portrait=0",
        source: "vimeo"
    },
    about: {
        nameTH: "\u0e23\u0e31\u0e0a\u0e1e\u0e25 \u0e17\u0e31\u0e28\u0e1b\u0e23\u0e30\u0e40\u0e2a\u0e23\u0e34\u0e10",
        nameEN: "Rachapon Thatprasert",
        email: "hypurr.con@gmail.com",
        resumeUrl: "resume.pdf",
        bio: "\u0e1c\u0e21\u0e2b\u0e25\u0e07\u0e43\u0e2b\u0e25\u0e31\u0e07\u0e43\u0e19\u0e42\u0e25\u0e01\u0e02\u0e2d\u0e07 3D Animation \u0e21\u0e32\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48\u0e40\u0e14\u0e47\u0e01\n\n\u0e19\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e42\u0e1b\u0e23\u0e40\u0e08\u0e01\u0e15\u0e4c\u0e43\u0e19\u0e21\u0e2b\u0e32\u0e27\u0e34\u0e17\u0e22\u0e32\u0e25\u0e31\u0e22 \u0e1c\u0e21\u0e22\u0e31\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e2d\u0e19\u0e40\u0e17\u0e19\u0e15\u0e4c\u0e1c\u0e48\u0e32\u0e19\u0e0a\u0e48\u0e2d\u0e07 Hypurr",
        skills: ["Character Animation","Body Mechanics","Facial Performance","Maya","Blender","After Effects"],
        profileImg: "",
        socials: [
            {label:"YouTube", url:"https://www.youtube.com/@Hypurr00"},
            {label:"TikTok",  url:"https://www.tiktok.com/@hypurr_r"}
        ]
    },
    theme: "cyan",
    themeBg: "deep"
};

/* ================================================
   STATE
   ================================================ */
let D = null;
var hasUnsaved = false;
const LS_KEY = "pf_data_v4";

function saveToLocal() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(D)); } catch(e) {}
}
function loadFromLocal() {
    try { var r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; } catch(e) { return null; }
}

/* ================================================
   THEME
   ================================================ */
const THEMES = [
    {id:"lime",   label:"Lime",   accent:"#c8f250", accent2:"#7ef2e2"},
    {id:"cyan",   label:"Cyan",   accent:"#4af0d8", accent2:"#4a9fff"},
    {id:"coral",  label:"Coral",  accent:"#ff7b6b", accent2:"#ffb347"},
    {id:"gold",   label:"Gold",   accent:"#ffd460", accent2:"#ffa040"},
    {id:"violet", label:"Violet", accent:"#c084fc", accent2:"#818cf8"},
    {id:"pink",   label:"Pink",   accent:"#f472b6", accent2:"#fb7185"}
];
const BG_VARS = {
    dark:  {"--bg":"#0a0a0c","--surface":"#111116","--surface2":"#18181f"},
    deep:  {"--bg":"#04040a","--surface":"#0c0c14","--surface2":"#14141e"},
    warm:  {"--bg":"#0e0c0a","--surface":"#181410","--surface2":"#201c18"},
    light: null
};
let currentTheme = "cyan", currentBg = "deep";

function applyTheme(tid, bid) {
    if (tid) currentTheme = tid;
    if (bid) currentBg = bid;
    const t = THEMES.find(x => x.id === currentTheme) || THEMES[1];
    const root = document.documentElement;
    root.style.setProperty("--accent",  t.accent);
    root.style.setProperty("--accent2", t.accent2);
    const logo = document.querySelector(".logo-img");
    if (logo) logo.style.filter = "drop-shadow(0 0 14px " + hexAlpha(t.accent, 0.4) + ")";
    const deco = document.querySelector(".deco-img");
    if (deco) deco.style.filter = "drop-shadow(0 0 14px " + hexAlpha(t.accent2, 0.4) + ")";
    if (currentBg === "light") {
        root.setAttribute("data-bg","light");
        ["--bg","--surface","--surface2"].forEach(v => root.style.removeProperty(v));
    } else {
        root.removeAttribute("data-bg");
        const bv = BG_VARS[currentBg] || BG_VARS.dark;
        Object.keys(bv).forEach(k => root.style.setProperty(k, bv[k]));
    }
    // apply bg image if set
    applyBgImg();
    try { localStorage.setItem("pf_theme", currentTheme); localStorage.setItem("pf_bg", currentBg); } catch(e){}
    syncSwatchUI();
}
function hexAlpha(hex, a) {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
}
function applyBgImg() {
    const layer = document.getElementById("bg-img-layer"); if (!layer) return;
    const img = D && D.site && D.site.bgImg;
    if (img) {
        layer.style.display = "";
        layer.style.backgroundImage = `url("${img}")`;
        layer.style.opacity = String(D.site.bgImgOpacity != null ? D.site.bgImgOpacity : 0.15);
    } else { layer.style.display = "none"; }
}
function liveBgOpacity(val) {
    const layer = document.getElementById("bg-img-layer");
    if (layer && layer.style.display !== "none") layer.style.opacity = String(parseInt(val)/100);
}
function syncSwatchUI() {
    const sc = document.getElementById("admin-theme-swatches");
    if (sc) sc.querySelectorAll(".theme-swatch").forEach(s => s.classList.toggle("active", s.dataset.theme === currentTheme));
    const bc = document.getElementById("admin-bg-btns");
    if (bc) bc.querySelectorAll(".bg-btn").forEach(b => b.classList.toggle("active", b.dataset.bg === currentBg));
}
function buildSwatches(cid) {
    const el = document.getElementById(cid); if (!el) return;
    el.innerHTML = "";
    THEMES.forEach(t => {
        const btn = document.createElement("button");
        btn.className = "theme-swatch" + (t.id === currentTheme ? " active" : "");
        btn.dataset.theme = t.id; btn.title = t.label; btn.setAttribute("aria-label", t.label);
        btn.style.background = t.accent;
        btn.addEventListener("click", () => { applyTheme(t.id, null); setAdminStatus("\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19 Theme \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON"); });
        el.appendChild(btn);
    });
}

/* ================================================
   LOAD DATA
   ================================================ */
async function loadData() {
    const local = loadFromLocal();
    if (local) {
        D = local;
    } else {
        try {
            const res = await fetch("data.json?t=" + Date.now());
            if (!res.ok) throw new Error();
            D = await res.json();
        } catch(e) {
            D = JSON.parse(JSON.stringify(FALLBACK_DATA));
        }
    }
    migrateData();
    // theme priority: localStorage > data.json > default
    try {
        const lt = localStorage.getItem("pf_theme"), lb = localStorage.getItem("pf_bg");
        currentTheme = lt || (D.theme) || currentTheme;
        currentBg    = lb || (D.themeBg) || currentBg;
    } catch(e) {
        if (D.theme)   currentTheme = D.theme;
        if (D.themeBg) currentBg    = D.themeBg;
    }
}
function migrateData() {
    // ensure sections exist
    if (!D.site)  D.site  = {...FALLBACK_DATA.site};
    if (!D.reel)  D.reel  = {...FALLBACK_DATA.reel};
    if (!D.about) D.about = {...FALLBACK_DATA.about};

    // migrate flat profile → about
    if (D.profile && !D.about.nameEN) {
        const p = D.profile;
        D.about.nameEN    = p.nameEN || D.site.title;
        D.about.nameTH    = p.nameTH || D.about.nameTH;
        D.about.email     = p.email  || D.about.email;
        D.about.bio       = p.bio    || D.about.bio;
        D.about.skills    = p.skills || D.about.skills;
        D.about.resumeUrl = p.resumeUrl || "resume.pdf";
        D.about.socials   = p.socials || D.about.socials;
        D.site.title    = D.site.title    || p.nameEN;
        D.site.subtitle = D.site.subtitle || p.role;
        D.reel.label    = D.reel.label    || ("Showreel " + (p.reelYear||"2024"));
        D.reel.caption  = D.reel.caption  || p.reelCaption;
        D.reel.embedUrl = D.reel.embedUrl || D.reelUrl || "";
    }
    // migrate reelUrl top-level
    if (!D.reel.embedUrl && D.reelUrl) D.reel.embedUrl = D.reelUrl;

    // migrate old youtube/tiktok → socials
    if (D.about && !D.about.socials && D.profile) {
        D.about.socials = [];
        if (D.profile.youtube) D.about.socials.push({label:"YouTube",url:D.profile.youtube});
        if (D.profile.tiktok)  D.about.socials.push({label:"TikTok", url:D.profile.tiktok});
    }
    if (!D.about.socials) D.about.socials = [...FALLBACK_DATA.about.socials];

    // normalize portfolio items
    if (Array.isArray(D.portfolio)) {
        D.portfolio = D.portfolio.map(item =>
            typeof item === "string" ? {type:"video", id:item, title:""}
            : (!item.type ? {...item, type:"video"} : item)
        );
    }
    if (!D.site.bgImgOpacity) D.site.bgImgOpacity = 0.15;
}

/* ================================================
   RENDER
   ================================================ */
function renderAll() { renderMeta(); renderHeader(); renderReel(); renderPortfolio(); renderAbout(); }

function renderMeta() {
    const s = D.site, a = D.about;
    const name  = a.nameEN || s.title || "Portfolio";
    const role  = s.subtitle || "";
    const title = name + " \u2014 " + role;
    const desc  = role + " portfolio \u2014 Character animation and motion.";
    document.title = title;
    const ids = {"og-title":title,"og-desc":desc,"tw-title":title,"tw-desc":desc,"meta-desc":desc};
    Object.keys(ids).forEach(id => { const el=document.getElementById(id); if(el) el.setAttribute("content",ids[id]); });
}

function renderHeader() {
    const s = D.site, a = D.about;
    setText("header-name", a.nameEN || s.title);
    setText("header-sub",  s.subtitle);
    setText("footer-name",   a.nameEN || s.title);
    setText("footer-name-2", a.nameEN || s.title);
    // logo
    const l1 = document.getElementById("header-logo1");
    if (l1) { if (s.logo1) { l1.src = s.logo1; l1.style.display = ""; } else { l1.style.display = "none"; } }
    // favicon
    if (s.logo1) {
        let fav = document.querySelector("link[rel=\"icon\"]");
        if (!fav) { fav = document.createElement("link"); fav.rel="icon"; fav.type="image/png"; document.head.appendChild(fav); }
        fav.href = s.logo1;
    }
    // deco
    const deco = document.querySelector(".deco-img");
    if (deco) { if (s.deco) { deco.src = s.deco; deco.style.display = ""; } else { deco.style.display = "none"; } }
}

function renderReel() {
    const r = D.reel;
    setText("reel-label",   r.label   || "Showreel 2024");
    setText("reel-title",   r.title   || "3D Animation Reel");
    setText("reel-caption", r.caption || "");
    const iframe = document.getElementById("reel-iframe");
    if (iframe) iframe.setAttribute("data-src", r.embedUrl || "");
}
function lazyLoadReel() {
    const iframe = document.getElementById("reel-iframe"); if (!iframe) return;
    const src = iframe.getAttribute("data-src");
    if (src && iframe.src !== src) iframe.src = src;
}

function renderPortfolio() {
    const grid = document.getElementById("portfolio-grid"); if (!grid) return;
    const items = D.portfolio || [];
    grid.innerHTML = "";
    items.forEach((item, idx) => {
        const btn = document.createElement("button");
        btn.className = "port-item";
        const label = item.title || (item.type === "image" ? "Image "+(idx+1) : "Video "+(idx+1));
        btn.setAttribute("aria-label", label);
        btn.setAttribute("role", "listitem");
        btn.addEventListener("click", () => openLightbox(idx));
        let thumb = "";
        if (item.type === "image") {
            thumb = `<img src="img/portfolio/${esc(item.src||"")}" alt="${esc(label)}" class="port-thumb" loading="lazy">`;
        } else {
            const sid = (item.id||"").replace(/[^A-Za-z0-9_\-]/g,"");
            thumb = `<img src="https://img.youtube.com/vi/${sid}/hqdefault.jpg" alt="${esc(label)}" class="port-thumb" loading="lazy">`;
        }
        const icon   = item.type === "image" ? `<span class="play-icon" style="font-size:1.4rem;">&#128247;</span>` : `<span class="play-icon">&#9654;</span>`;
        const badge  = item.type === "image" ? `<span class="port-type-badge">IMG</span>` : "";
        const htitle = item.title ? `<span class="port-hover-title">${esc(item.title)}</span>` : "";
        const num    = `<span class="port-num">${idx+1}</span>`;
        btn.innerHTML = thumb + `<div class="port-overlay" aria-hidden="true">${icon}${htitle}</div>` + badge + num;
        grid.appendChild(btn);
    });
    const countEl = document.getElementById("portfolio-count");
    if (countEl) countEl.textContent = items.length + " works";
}

function renderAbout() {
    const a = D.about;
    setText("about-name-th", a.nameTH || "");
    // profile img
    const pi = document.getElementById("about-profile-img");
    if (pi) { if (a.profileImg) { pi.src = a.profileImg; pi.style.display = ""; } }
    // email
    const el = document.getElementById("about-email-link"); if (el && a.email) el.href = "mailto:"+a.email;
    setText("about-email-text", a.email);
    // bio
    const bio = document.getElementById("about-bio");
    if (bio && a.bio) {
        bio.innerHTML = a.bio.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>`<p>${l}</p>`).join("");
    }
    // skills
    const sk = document.getElementById("about-skills");
    if (sk) sk.innerHTML = (a.skills||[]).map(s=>`<span class="skill-chip">${esc(s)}</span>`).join("");
    // socials
    const sr = document.getElementById("about-socials");
    if (sr) sr.innerHTML = (a.socials||[]).filter(s=>s.label&&s.url)
        .map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" class="social-btn">${esc(s.label)}</a>`).join("");
}

/* ================================================
   PAGE NAV
   ================================================ */
function switchPage(pageId, el) {
    document.querySelectorAll(".page").forEach(p => { p.classList.remove("active"); p.hidden = true; });
    const t = document.getElementById(pageId); if (t) { t.classList.add("active"); t.hidden = false; }
    document.querySelectorAll(".nav-btn[role='tab']").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
    if (el && el.getAttribute("role")==="tab") { el.classList.add("active"); el.setAttribute("aria-selected","true"); }
    if (pageId === "reels") lazyLoadReel();
    const shell = document.querySelector(".layout-shell");
    if (shell) window.scrollTo({top: shell.getBoundingClientRect().top + window.pageYOffset - 16, behavior:"smooth"});
}

/* ================================================
   LIGHTBOX
   ================================================ */
let lbIdx = 0;
function openLightbox(idx) {
    lbIdx = idx;
    renderLightbox();
    const lb = document.getElementById("lightbox");
    if (lb) { lb.hidden = false; document.body.style.overflow = "hidden"; }
    setTimeout(() => { const cb = document.querySelector("#lightbox .modal-close"); if(cb) cb.focus(); }, 80);
}
function closeLightbox() {
    const lb = document.getElementById("lightbox"); if (!lb) return;
    const c = document.getElementById("lightbox-content");
    if (c) { const fr = c.querySelector("iframe"); if (fr) fr.src = ""; c.innerHTML = ""; }
    lb.hidden = true; document.body.style.overflow = "";
}
function lightboxNav(dir) {
    const next = lbIdx + dir;
    if (next < 0 || next >= D.portfolio.length) return;
    const c = document.getElementById("lightbox-content");
    if (c) { const fr = c.querySelector("iframe"); if (fr) fr.src = ""; }
    lbIdx = next; renderLightbox();
}
function renderLightbox() {
    const items = D.portfolio, idx = lbIdx;
    const item = items[idx];
    setText("lightbox-title", item.title || (item.type==="image"?"Image":"Video")+" "+(idx+1));
    setText("lightbox-counter", (idx+1)+" / "+items.length);
    const prev = document.getElementById("lb-prev"), next = document.getElementById("lb-next");
    if (prev) prev.disabled = idx === 0;
    if (next) next.disabled = idx === items.length-1;
    const c = document.getElementById("lightbox-content"); if (!c) return;
    if (item.type === "image") {
        c.innerHTML = `<img src="img/portfolio/${esc(item.src||"")}" alt="${esc(item.title||"")}" draggable="false">`;
    } else {
        const sid = (item.id||"").replace(/[^A-Za-z0-9_\-]/g,"");
        c.innerHTML = `<iframe src="https://www.youtube.com/embed/${sid}?autoplay=1&rel=0" frameborder="0" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen></iframe>`;
    }
}

/* ================================================
   PDF / RESUME MODAL
   ================================================ */
function openResume() {
    const url = (D.about && D.about.resumeUrl) || "resume.pdf";
    const modal = document.getElementById("pdf-modal"), iframe = document.getElementById("pdf-iframe");
    if (!modal || !iframe) return;
    iframe.src = url + "#toolbar=1";
    modal.hidden = false; document.body.style.overflow = "hidden";
}
function closePdfModal() {
    const modal = document.getElementById("pdf-modal"), iframe = document.getElementById("pdf-iframe");
    if (!modal) return; if (iframe) iframe.src = ""; modal.hidden = true; document.body.style.overflow = "";
}
function downloadPdf() {
    const url = (D.about && D.about.resumeUrl) || "resume.pdf";
    const a = document.createElement("a"); a.href = url; a.download = url.split("/").pop()||"resume.pdf";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

/* ================================================
   KEYBOARD
   ================================================ */
document.addEventListener("keydown", e => {
    const lb = document.getElementById("lightbox");
    if (lb && !lb.hidden) {
        if (e.key === "ArrowLeft")  { lightboxNav(-1); return; }
        if (e.key === "ArrowRight") { lightboxNav(1);  return; }
        if (e.key === "Escape")     { closeLightbox(); return; }
    }
    if (e.key !== "Escape") return;
    const pm = document.getElementById("pdf-modal");    if (pm && !pm.hidden) closePdfModal();
    const ap = document.getElementById("admin-panel");  if (ap && !ap.hidden) closeAdmin();
});

/* ================================================
   ADMIN TRIGGER
   ================================================ */
(function(){
    const SECRET = "admin"; let buf = "", timer = null;
    document.addEventListener("keydown", e => {
        const tag = (document.activeElement||{}).tagName||"";
        if (["INPUT","TEXTAREA","SELECT"].includes(tag.toUpperCase())) return;
        const ap = document.getElementById("admin-panel"); if (ap && !ap.hidden) return;
        buf += e.key.toLowerCase();
        clearTimeout(timer); timer = setTimeout(()=>{ buf=""; }, 2000);
        if (buf.length > SECRET.length) buf = buf.slice(-SECRET.length);
        if (buf === SECRET) { buf = ""; openAdmin(); }
    });
})();

/* ================================================
   ADMIN OPEN / CLOSE
   ================================================ */
function openAdmin() {
    const panel = document.getElementById("admin-panel"); if (!panel) return;
    hasUnsaved = false;
    panel.hidden = false; document.body.style.overflow = "hidden";
    populateDashboard();
    buildSwatches("admin-theme-swatches"); syncSwatchUI();
    // show first tab
    const firstTab = panel.querySelector(".atab"); if (firstTab) firstTab.click();
}
function closeAdmin(force) {
    if (!force && hasUnsaved) {
        if (!confirm("\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49 Export JSON\n\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e35\u0e48\u0e41\u0e01\u0e49\u0e44\u0e02\u0e08\u0e30\u0e2b\u0e32\u0e22\u0e2b\u0e32\u0e01\u0e1b\u0e34\u0e14\u0e40\u0e1b\u0e25\u0e48\u0e32\u0e19\n\n\u0e1b\u0e34\u0e14\u0e42\u0e14\u0e22\u0e44\u0e21\u0e48 Export?")) return;
    }
    hasUnsaved = false;
    const panel = document.getElementById("admin-panel"); if (!panel) return;
    panel.hidden = true; document.body.style.overflow = "";
}

/* ================================================
   POPULATE DASHBOARD
   ================================================ */
function populateDashboard() {
    const s = D.site, r = D.reel, a = D.about;
    setVal("f-site-title",    s.title);
    setVal("f-site-subtitle", s.subtitle);
    setVal("f-site-url",      s.url);
    setVal("f-reel-label",    r.label);
    setVal("f-reel-title",    r.title);
    setVal("f-reel-caption",  r.caption);
    // reel source
    const src = r.source || "vimeo";
    setReelSource(src);
    setVal(src === "youtube" ? "f-reel-yt" : "f-reel-vm", r.embedUrl || "");
    setVal("f-about-nameth",  a.nameTH);
    setVal("f-about-email",   a.email);
    setVal("f-about-resume",  a.resumeUrl || "resume.pdf");
    setVal("f-about-bio",     a.bio || "");
    setVal("f-about-skills",  (a.skills||[]).join(", "));
    // profile img preview
    updateImgPreview("profile", a.profileImg || "");
    updateImgPreview("logo1",   s.logo1 || "");
    updateImgPreview("deco",    s.deco  || "");
    updateImgPreview("bgimg",   s.bgImg || "");
    // fill filename inputs (strip img/ prefix for display)
    setVal("f-logo1-filename", (s.logo1||"").replace(/^img\//,""));
    setVal("f-deco-filename",  (s.deco ||"").replace(/^img\//,""));
    // bg opacity slider
    const opEl = document.getElementById("f-th-opacity"), opValEl = document.getElementById("f-th-opacity-val");
    const pct = Math.round((s.bgImgOpacity || 0.15) * 100);
    if (opEl) opEl.value = pct; if (opValEl) opValEl.textContent = pct + "%";
    renderSocialAdmin();
    renderAdminList();
}

function updateImgPreview(key, src) {
    const ids = {logo1:"prev-logo1", deco:"prev-deco", profile:"prev-profile", bgimg:"prev-bgimg"};
    const box = document.getElementById(ids[key]); if (!box) return;
    box.innerHTML = (src && src.length > 2)
        ? `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.parentElement.innerHTML='<span>ไม่พบรูป</span>'">`
        : "<span>\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e39\u0e1b</span>";
}
/* Browse → just fill in filename (no base64) */
function onImgFilenamePick(key, input) {
    const file = input.files[0]; if (!file) return;
    const fieldId = key === "logo1" ? "f-logo1-filename" : "f-deco-filename";
    setVal(fieldId, file.name);
    input.value = "";
    // show live preview from img/ path
    const path = "img/" + file.name;
    updateImgPreview(key, path);
}
/* Apply filename → set D.site.logo1 / deco as img/filename path */
function applyImgFilename(key) {
    const fieldId = key === "logo1" ? "f-logo1-filename" : "f-deco-filename";
    const fn = getVal(fieldId).replace(/[^A-Za-z0-9_\-\.]/g,"");
    if (!fn) return;
    const path = "img/" + fn;
    if (key === "logo1") { D.site.logo1 = path; }
    if (key === "deco")  { D.site.deco  = path; }
    updateImgPreview(key, path);
    renderHeader();
    saveToLocal();
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}

/* ================================================
   APPLY SECTIONS
   ================================================ */
function applySite() {
    D.site.title    = getVal("f-site-title")    || D.site.title;
    D.site.subtitle = getVal("f-site-subtitle") || D.site.subtitle;
    D.site.url      = getVal("f-site-url")      || D.site.url;
    renderMeta(); renderHeader(); saveToLocal();
    showMsg("msg-site", "\u2713 \u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e41\u0e25\u0e49\u0e27");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}
function applyReel() {
    D.reel.label   = getVal("f-reel-label")   || D.reel.label;
    D.reel.title   = getVal("f-reel-title")   || D.reel.title;
    D.reel.caption = getVal("f-reel-caption") || D.reel.caption;
    const srcBtn = document.querySelector(".logo-mode-btn[data-reel].active");
    const isYT = srcBtn && srcBtn.dataset.reel === "youtube";
    const raw = getVal(isYT ? "f-reel-yt" : "f-reel-vm");
    if (raw) {
        const embed = parseReelUrl(raw, isYT ? "youtube" : "vimeo");
        if (!embed) { showMsg("msg-reel", "URL \u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07","error"); return; }
        D.reel.embedUrl = embed; D.reel.source = isYT ? "youtube" : "vimeo";
    }
    renderReel(); lazyLoadReel(); saveToLocal();
    showMsg("msg-reel", "\u2713 \u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e41\u0e25\u0e49\u0e27");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}
function applyAbout() {
    D.about.nameTH    = getVal("f-about-nameth")  || D.about.nameTH;
    D.about.email     = getVal("f-about-email")   || D.about.email;
    D.about.resumeUrl = getVal("f-about-resume")  || D.about.resumeUrl;
    const bioEl = document.getElementById("f-about-bio"); if (bioEl) D.about.bio = bioEl.value;
    const skRaw = getVal("f-about-skills");
    if (skRaw) D.about.skills = skRaw.split(",").map(s=>s.trim()).filter(Boolean);
    // socials from admin list
    D.about.socials = [];
    document.querySelectorAll(".social-edit-row").forEach(row => {
        const label = row.querySelector(".se-label").value.trim();
        const url   = row.querySelector(".se-url").value.trim();
        if (label && url) D.about.socials.push({label, url});
    });
    renderAbout(); saveToLocal();
    showMsg("msg-about", "\u2713 \u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e41\u0e25\u0e49\u0e27");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}

/* ================================================
   REEL SOURCE
   ================================================ */
function setReelSource(src) {
    document.querySelectorAll(".logo-mode-btn[data-reel]").forEach(b => b.classList.toggle("active", b.dataset.reel === src));
    const ytDiv = document.getElementById("reel-youtube-input"), vmDiv = document.getElementById("reel-vimeo-input");
    if (ytDiv) ytDiv.style.display = src === "youtube" ? "" : "none";
    if (vmDiv) vmDiv.style.display = src === "vimeo"   ? "" : "none";
}
function parseReelUrl(raw, type) {
    raw = raw.trim();
    if (type === "youtube") {
        for (const p of [/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_\-]{11})/,/^([A-Za-z0-9_\-]{11})$/]) {
            const m = raw.match(p); if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`;
        }
    }
    if (type === "vimeo") {
        for (const p of [/vimeo\.com\/(?:video\/)?(\d+)/,/^(\d+)$/]) {
            const m = raw.match(p); if (m) return `https://player.vimeo.com/video/${m[1]}?title=0&byline=0&portrait=0`;
        }
    }
    return null;
}

/* ================================================
   IMAGE PICKERS
   ================================================ */
function onSiteImgPick(key, input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const b64 = e.target.result;
        if (key === "logo1")   { D.site.logo1 = b64; renderHeader(); }
        if (key === "deco")    { D.site.deco  = b64; renderHeader(); }
        if (key === "profile") { D.about.profileImg = b64; renderAbout(); }
        if (key === "bgimg")   { D.site.bgImg = b64; applyBgImg(); }
        updateImgPreview(key, b64); input.value = "";
        saveToLocal(); setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
    };
    reader.readAsDataURL(file);
}
function clearSiteImg(key) {
    if (key === "logo1")   { D.site.logo1 = ""; renderHeader(); setVal("f-logo1-filename",""); }
    if (key === "deco")    { D.site.deco  = ""; renderHeader(); setVal("f-deco-filename",""); }
    if (key === "profile") { D.about.profileImg = ""; renderAbout(); }
    if (key === "bgimg")   { D.site.bgImg = ""; applyBgImg(); }
    updateImgPreview(key, "");
    saveToLocal();
}

/* ================================================
   SOCIALS ADMIN
   ================================================ */
function renderSocialAdmin() {
    const list = document.getElementById("admin-socials-list"); if (!list) return;
    list.innerHTML = "";
    (D.about.socials||[]).forEach(s => {
        const row = document.createElement("div");
        row.className = "social-edit-row";
        row.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:6px;";
        row.innerHTML =
            `<input class="se-label" type="text" value="${esc(s.label)}" placeholder="Label" style="flex:0 0 90px;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">` +
            `<input class="se-url" type="text" value="${esc(s.url)}" placeholder="https://..." style="flex:1;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">` +
            `<button class="abtn del" onclick="this.closest('.social-edit-row').remove()" aria-label="\u0e25\u0e1a">\u2715</button>`;
        list.appendChild(row);
    });
}
function addSocial() {
    const list = document.getElementById("admin-socials-list"); if (!list) return;
    const row = document.createElement("div");
    row.className = "social-edit-row";
    row.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:6px;";
    row.innerHTML =
        `<input class="se-label" type="text" placeholder="Label" style="flex:0 0 90px;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">` +
        `<input class="se-url" type="text" placeholder="https://..." style="flex:1;background:var(--surface2);border:1px solid var(--border-hi);border-radius:var(--radius);color:var(--text);font-size:0.85rem;padding:7px 10px;outline:none;">` +
        `<button class="abtn del" onclick="this.closest('.social-edit-row').remove()" aria-label="\u0e25\u0e1a">\u2715</button>`;
    list.appendChild(row); row.querySelector(".se-label").focus();
}

/* ================================================
   PORTFOLIO ADMIN
   ================================================ */
function renderAdminList() {
    const list = document.getElementById("admin-port-list"); if (!list) return;
    list.innerHTML = "";
    const total = D.portfolio.length;
    const cl = document.getElementById("port-count-label"); if (cl) cl.textContent = total;
    const countEl = document.getElementById("portfolio-count"); if (countEl) countEl.textContent = total + " works";
    D.portfolio.forEach((item, idx) => {
        const row = document.createElement("div"); row.className = "admin-row"; row.style.cssText = "align-items:flex-start;gap:8px;";
        const sid = (item.id||"").replace(/[^A-Za-z0-9_\-]/g,"");
        const thumbSrc = item.type === "image" ? `img/portfolio/${esc(item.src||"")}` : `https://img.youtube.com/vi/${sid}/mqdefault.jpg`;
        const typeBadge = item.type === "image"
            ? `<span style="font-size:0.6rem;background:rgba(74,159,255,0.15);color:var(--accent2);border-radius:3px;padding:1px 5px;">IMG</span>`
            : `<span style="font-size:0.6rem;background:rgba(200,242,80,0.12);color:var(--accent);border-radius:3px;padding:1px 5px;">YT</span>`;
        const idLabel = item.type === "image" ? (item.src||"") : sid;
        const ytBtn = item.type === "video"
            ? `<button class="abtn" data-fetch="${idx}" data-ytid="${sid}" title="\u0e14\u0e36\u0e07\u0e0a\u0e37\u0e48\u0e2d\u0e08\u0e32\u0e01 YouTube" style="font-size:0.6rem;padding:0 5px;flex-shrink:0;">YT</button>` : "";
        row.innerHTML =
            `<span class="admin-num">${idx+1}</span>` +
            `<img src="${thumbSrc}" class="admin-thumb" loading="lazy" alt="" onerror="this.style.opacity=0.3">` +
            `<div class="admin-id-wrap" style="flex:1;min-width:0;">` +
              typeBadge +
              `<span class="admin-id" title="${esc(idLabel)}" style="display:block;margin-top:2px;">${esc(idLabel)}</span>` +
              `<div style="display:flex;gap:4px;align-items:center;margin-top:4px;">` +
                `<input class="admin-title-input port-title-inp" type="text" placeholder="\u0e0a\u0e37\u0e48\u0e2d\u0e1c\u0e25\u0e07\u0e32\u0e19..." value="${esc(item.title||"")}" data-idx="${idx}">` +
                ytBtn +
              `</div>` +
            `</div>` +
            `<div class="admin-actions">` +
              `<button class="abtn" data-move="${idx}" data-dir="-1" ${idx===0?"disabled":""}>&#8593;</button>` +
              `<button class="abtn" data-move="${idx}" data-dir="1" ${idx===total-1?"disabled":""}>&#8595;</button>` +
              `<button class="abtn del" data-del="${idx}" aria-label="\u0e25\u0e1a">&#x2715;</button>` +
            `</div>`;
        list.appendChild(row);
    });
}

function setPortType(type, btn) {
    document.querySelectorAll(".logo-mode-btn[data-ptype]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("port-video-input").style.display = type === "video" ? "" : "none";
    document.getElementById("port-image-input").style.display = type === "image" ? "" : "none";
    const fb = document.getElementById("fetch-yt-title-btn"); if (fb) fb.style.display = type === "video" ? "" : "none";
}
function onPortImgPick(input) {
    const file = input.files[0]; if (!file) return;
    const fni = document.getElementById("new-img-filename"); if (fni) fni.value = file.name;
    input.value = "";
}
function fetchNewYtTitle() {
    const raw = getVal("new-yt-input"); if (!raw) return;
    let ytId = raw; const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/); if (m) ytId = m[1];
    if (!/^[A-Za-z0-9_\-]{11}$/.test(ytId)) return;
    const btn = document.getElementById("fetch-yt-title-btn"); if (btn) { btn.textContent = "..."; btn.disabled = true; }
    fetchYouTubeTitle(ytId, t => {
        if (t) { const ti = document.getElementById("new-port-title"); if (ti) ti.value = t; }
        if (btn) { btn.textContent = "YT"; btn.disabled = false; }
    });
}
function addPortItem() {
    const titleVal = getVal("new-port-title");
    const typeBtn = document.querySelector(".logo-mode-btn[data-ptype].active");
    const ptype = typeBtn ? typeBtn.dataset.ptype : "video";
    if (ptype === "image") {
        const fn = getVal("new-img-filename");
        if (!fn) { showMsg("add-msg","\u0e01\u0e23\u0e38\u0e13\u0e32\u0e43\u0e2a\u0e48\u0e0a\u0e37\u0e48\u0e2d\u0e44\u0e1f\u0e25\u0e4c","error"); return; }
        D.portfolio.push({type:"image", src: fn.replace(/[^A-Za-z0-9_\-\.]/g,""), title:titleVal});
        setVal("new-img-filename",""); setVal("new-port-title","");
        renderAdminList(); renderPortfolio(); saveToLocal();
        showMsg("add-msg","\u2713 \u0e40\u0e1e\u0e34\u0e48\u0e21\u0e23\u0e39\u0e1b\u0e41\u0e25\u0e49\u0e27");
        setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
        return;
    }
    // video
    const raw = getVal("new-yt-input"); let ytId = raw;
    const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/); if (m) ytId = m[1];
    if (!/^[A-Za-z0-9_\-]{11}$/.test(ytId)) { showMsg("add-msg","YouTube ID \u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07","error"); return; }
    if (D.portfolio.some(x => (x.id||x) === ytId)) { showMsg("add-msg","\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d\u0e19\u0e35\u0e49\u0e21\u0e35\u0e2d\u0e22\u0e39\u0e48\u0e41\u0e25\u0e49\u0e27","error"); return; }
    D.portfolio.push({type:"video", id:ytId, title:titleVal});
    setVal("new-yt-input",""); setVal("new-port-title","");
    renderAdminList(); renderPortfolio(); saveToLocal();
    showMsg("add-msg","\u2713 \u0e40\u0e1e\u0e34\u0e48\u0e21\u0e41\u0e25\u0e49\u0e27");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
    if (!titleVal) {
        const newIdx = D.portfolio.length - 1;
        showMsg("add-msg","\u0e01\u0e33\u0e25\u0e31\u0e07\u0e14\u0e36\u0e07\u0e0a\u0e37\u0e48\u0e2d...");
        fetchYouTubeTitle(ytId, t => {
            if (t && D.portfolio[newIdx]) { D.portfolio[newIdx].title = t; renderAdminList(); renderPortfolio(); saveToLocal(); }
            showMsg("add-msg", t ? "\u2713 " + t : "\u2713 \u0e40\u0e1e\u0e34\u0e48\u0e21\u0e41\u0e25\u0e49\u0e27");
        });
    }
}
function deleteItem(idx) {
    const item = D.portfolio[idx];
    const label = item && item.type === "image" ? "\u0e23\u0e39\u0e1b\u0e20\u0e32\u0e1e" : "\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d";
    if (!confirm(`\u0e25\u0e1a${label}\u0e17\u0e35\u0e48 ${idx+1} \u0e2d\u0e2d\u0e01?`)) return;
    D.portfolio.splice(idx, 1); renderAdminList(); renderPortfolio(); saveToLocal();
    showMsg("add-msg","\u2713 \u0e25\u0e1a\u0e41\u0e25\u0e49\u0e27");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}
function moveItem(idx, dir) {
    const a = D.portfolio, ni = idx + dir;
    if (ni < 0 || ni >= a.length) return;
    [a[idx], a[ni]] = [a[ni], a[idx]];
    renderAdminList(); renderPortfolio(); saveToLocal();
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}
function fetchYouTubeTitle(ytId, cb) {
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`)
        .then(r => r.ok ? r.json() : null)
        .then(d => cb(d && d.title ? d.title : ""))
        .catch(() => cb(""));
}

/* ================================================
   JSON EXPORT / IMPORT
   ================================================ */
function exportJSON() {
    D.theme = currentTheme; D.themeBg = currentBg;
    const json = JSON.stringify(D, null, 4);
    const blob = new Blob([json], {type:"application/json"});
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "data.json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    showMsg("export-msg","\u2713 data.json \u0e14\u0e32\u0e27\u0e19\u0e4c\u0e42\u0e2b\u0e25\u0e14\u0e41\u0e25\u0e49\u0e27 \u2014 \u0e19\u0e33\u0e44\u0e1b\u0e41\u0e17\u0e19\u0e41\u0e25\u0e49\u0e27 push GitHub");
    hasUnsaved = false; setAdminStatusRaw("\u2713 Export \u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22");
}
function importJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!parsed.portfolio) throw new Error("invalid");
            D = parsed; migrateData();
            if (parsed.theme)   currentTheme = parsed.theme;
            if (parsed.themeBg) currentBg    = parsed.themeBg;
            applyTheme(currentTheme, currentBg);
            renderAll(); populateDashboard(); buildSwatches("admin-theme-swatches"); syncSwatchUI();
            saveToLocal();
            showMsg("import-msg","\u2713 \u0e42\u0e2b\u0e25\u0e14\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08");
            hasUnsaved = false; setAdminStatusRaw("");
        } catch(e) {
            showMsg("import-msg","\u0e44\u0e1f\u0e25\u0e4c\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07","error");
        }
    };
    reader.readAsText(file);
}

/* ================================================
   HELPERS
   ================================================ */
function setText(id, v)   { const el=document.getElementById(id); if(el) el.textContent=v||""; }
function setVal(id, v)    { const el=document.getElementById(id); if(el) el.value=v||""; }
function getVal(id)       { const el=document.getElementById(id); return el?el.value.trim():""; }
function esc(s)           { return (s||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function showMsg(id,text,type) {
    const el=document.getElementById(id); if(!el) return;
    el.innerHTML=text; el.style.color=type==="error"?"#f28b82":"var(--accent)";
    clearTimeout(el._t); el._t=setTimeout(()=>{el.textContent="";},4000);
}
function setAdminStatus(m) {
    const el=document.getElementById("admin-status");
    if(el){ el.textContent=m; if(m){el.style.color="var(--accent)"; hasUnsaved=true;} }
}
function setAdminStatusRaw(m) { const el=document.getElementById("admin-status"); if(el) el.textContent=m; }

/* ================================================
   INIT
   ================================================ */
document.addEventListener("DOMContentLoaded", async () => {
    const yr = document.getElementById("year"); if (yr) yr.textContent = new Date().getFullYear();

    await loadData();
    applyTheme(currentTheme, currentBg);
    renderAll();

    // page init
    document.querySelectorAll(".page").forEach((p,i)=>{
        if(i===0){p.classList.add("active");p.hidden=false;}
        else{p.classList.remove("active");p.hidden=true;}
    });
    lazyLoadReel();

    // admin backdrop click
    document.getElementById("admin-panel")?.querySelector(".admin-backdrop")?.addEventListener("click", ()=>closeAdmin());
    document.getElementById("pdf-modal")  ?.querySelector(".modal-backdrop") ?.addEventListener("click", closePdfModal);

    // admin-port-list delegation
    const pl = document.getElementById("admin-port-list");
    if (pl) {
        pl.addEventListener("click", e => {
            const btn = e.target.closest("button"); if (!btn) return;
            const del  = btn.dataset.del, move = btn.dataset.move, dir = btn.dataset.dir;
            const fetch = btn.dataset.fetch, ytid = btn.dataset.ytid;
            if (del  != null) deleteItem(parseInt(del));
            if (move != null) moveItem(parseInt(move), parseInt(dir));
            if (fetch != null && ytid) {
                const fi = parseInt(fetch);
                btn.textContent = "..."; btn.disabled = true;
                fetchYouTubeTitle(ytid, t => {
                    if (t && D.portfolio[fi]) { D.portfolio[fi].title = t; saveToLocal(); renderAdminList(); renderPortfolio(); }
                    else { btn.textContent = "YT"; btn.disabled = false; }
                });
            }
        });
        pl.addEventListener("input", e => {
            if (!e.target.matches(".port-title-inp")) return;
            const idx = parseInt(e.target.dataset.idx);
            if (!isNaN(idx) && D.portfolio[idx]) { D.portfolio[idx].title = e.target.value; renderPortfolio(); saveToLocal(); }
        });
    }

    // add-social-btn
    document.getElementById("add-social-btn")?.addEventListener("click", addSocial);

    // import json
    document.getElementById("import-json-file")?.addEventListener("change", e => { importJSON(e.target.files[0]); e.target.value=""; });

    // bg btns
    document.getElementById("admin-bg-btns")?.addEventListener("click", e => {
        const btn = e.target.closest(".bg-btn"); if (!btn) return;
        applyTheme(null, btn.dataset.bg);
        setAdminStatus("\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19 BG \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
    });

    // block iframe embedding
    if (window.self !== window.top) { document.documentElement.style.display="none"; window.top.location=window.self.location; }
});
