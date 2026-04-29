/* =============================================
   PORTFOLIO SCRIPT  v3  — Theme + All features
   ============================================= */

/* ---- Embedded fallback data (used if data.json unreachable) ---- */
const FALLBACK_DATA = {
    reelUrl: "https://player.vimeo.com/video/1169127503?title=0&byline=0&portrait=0",
    portfolio: [
        "devW0oJUFRk","dex4vsSgK8A","5oIfkuYBtLg","p2Zyb89sXoY",
        "xzfF2g12BP4","50XBFJeMdfA","9KTGKXc4XYc","-HGcIdC-sAg",
        "R0XCXMMP5G8","4tB731jNpTw","V8pVpn3ftBQ","w_EWc5K7SHs",
        "KYIcZnQCRDM","2F-CXlheMWo","HmKEqZBP7N8","K_jDPXL4zdk",
        "dEO1n5XmTnA","ixTTWdGs1UY","jRConNGJ1Zc"
    ],
    profile: {
        nameTH: "\u0e23\u0e31\u0e0a\u0e1e\u0e25 \u0e17\u0e31\u0e28\u0e1b\u0e23\u0e30\u0e40\u0e2a\u0e23\u0e34\u0e10",
        nameEN: "Rachapon Thatprasert",
        role:   "3D Animator / Character Animation",
        bio:    "\u0e1c\u0e21\u0e2b\u0e25\u0e07\u0e43\u0e2b\u0e25\u0e31\u0e07\u0e43\u0e19\u0e42\u0e25\u0e01\u0e02\u0e2d\u0e07 3D Animation \u0e21\u0e32\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48\u0e40\u0e14\u0e47\u0e01 \u0e22\u0e31\u0e07\u0e23\u0e39\u0e49\u0e2a\u0e36\u0e01\u0e2a\u0e19\u0e38\u0e01\u0e17\u0e38\u0e01\u0e04\u0e23\u0e31\u0e49\u0e07\u0e17\u0e35\u0e48\u0e44\u0e14\u0e49\u0e02\u0e22\u0e31\u0e1a\u0e15\u0e31\u0e27\u0e25\u0e30\u0e04\u0e23\u0e43\u0e2b\u0e49\u0e21\u0e35\u0e0a\u0e35\u0e27\u0e34\u0e15 \u2014 \u0e04\u0e27\u0e32\u0e21\u0e17\u0e49\u0e32\u0e17\u0e32\u0e22\u0e17\u0e35\u0e48\u0e1c\u0e21\u0e2a\u0e19\u0e38\u0e01\u0e01\u0e31\u0e1a\u0e21\u0e31\u0e19\u0e40\u0e2a\u0e21\u0e2d\n\n\u0e19\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e42\u0e1b\u0e23\u0e40\u0e08\u0e01\u0e15\u0e4c\u0e43\u0e19\u0e21\u0e2b\u0e32\u0e27\u0e34\u0e17\u0e22\u0e32\u0e25\u0e31\u0e22 \u0e1c\u0e21\u0e22\u0e31\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e04\u0e2d\u0e19\u0e40\u0e17\u0e19\u0e15\u0e4c\u0e41\u0e2d\u0e19\u0e34\u0e40\u0e21\u0e0a\u0e31\u0e19\u0e1c\u0e48\u0e32\u0e19\u0e0a\u0e48\u0e2d\u0e07 Hypurr \u0e17\u0e31\u0e49\u0e07\u0e1a\u0e19 TikTok \u0e41\u0e25\u0e30 YouTube",
        email:   "hypurr.con@gmail.com",
        socials: [
            { label: "YouTube", url: "https://www.youtube.com/@Hypurr00" },
            { label: "TikTok",  url: "https://www.tiktok.com/@hypurr_r"  }
        ],
        skills:  ["Character Animation","Body Mechanics","Facial Performance","Maya","Blender","After Effects"],
        reelYear:    "2024",
        reelCaption: "Character animation \u00b7 Body mechanics \u00b7 Facial performance"
    }
};

let appData = null;
var hasUnsaved = false;
var LS_DATA_KEY = "pf_data";

function saveToLocal() {
    try {
        // store everything except theme (theme has its own keys)
        localStorage.setItem(LS_DATA_KEY, JSON.stringify(appData));
    } catch(e) {}
}

function loadFromLocal() {
    try {
        var raw = localStorage.getItem(LS_DATA_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
}

/* ================================================
   THEME SYSTEM
   ================================================ */
const THEMES = [
    { id: "lime",   label: "Lime",   accent: "#c8f250", accent2: "#7ef2e2" },
    { id: "cyan",   label: "Cyan",   accent: "#4af0d8", accent2: "#4a9fff" },
    { id: "coral",  label: "Coral",  accent: "#ff7b6b", accent2: "#ffb347" },
    { id: "gold",   label: "Gold",   accent: "#ffd460", accent2: "#ffa040" },
    { id: "violet", label: "Violet", accent: "#c084fc", accent2: "#818cf8" },
    { id: "pink",   label: "Pink",   accent: "#f472b6", accent2: "#fb7185" }
];

const BG_VARS = {
    dark:  { "--bg": "#0a0a0c", "--surface": "#111116", "--surface2": "#18181f" },
    deep:  { "--bg": "#04040a", "--surface": "#0c0c14", "--surface2": "#14141e" },
    warm:  { "--bg": "#0e0c0a", "--surface": "#181410", "--surface2": "#201c18" },
    light: null  // handled by data-bg="light" attribute
};

let currentTheme = "lime";
let currentBg    = "dark";

function applyTheme(themeId, bgId) {
    currentTheme = themeId || currentTheme;
    currentBg    = bgId    || currentBg;

    const t = THEMES.find(function(x){ return x.id === currentTheme; }) || THEMES[0];
    const root = document.documentElement;

    // accent colors
    root.style.setProperty("--accent",  t.accent);
    root.style.setProperty("--accent2", t.accent2);

    // accent glow on logo
    const logo = document.querySelector(".logo-img");
    if (logo) logo.style.filter = "drop-shadow(0 0 14px " + hexAlpha(t.accent, 0.4) + ")";
    const deco = document.querySelector(".deco-img");
    if (deco) deco.style.filter = "drop-shadow(0 0 14px " + hexAlpha(t.accent2, 0.4) + ")";

    // bg
    if (currentBg === "light") {
        root.setAttribute("data-bg", "light");
        // reset custom bg vars (CSS handles it via attribute)
        ["--bg","--surface","--surface2"].forEach(function(v){ root.style.removeProperty(v); });
    } else {
        root.removeAttribute("data-bg");
        const bgVars = BG_VARS[currentBg] || BG_VARS.dark;
        Object.keys(bgVars).forEach(function(k){ root.style.setProperty(k, bgVars[k]); });
    }

    // header glow colour
    const headerBefore = document.querySelector("header");
    if (headerBefore) {
        headerBefore.style.setProperty("--glow-accent", hexAlpha(t.accent, 0.07));
    }

    // persist to localStorage so reload keeps theme without needing push
    try {
        localStorage.setItem("pf_theme", currentTheme);
        localStorage.setItem("pf_bg",    currentBg);
    } catch(e){}

    // sync swatch UIs
    syncSwatchUI();
}

function hexAlpha(hex, a) {
    // convert #rrggbb to rgba()
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function syncSwatchUI() {
    // both floating panel and admin panel
    ["admin-theme-swatches"].forEach(function(containerId){
        var el = document.getElementById(containerId);
        if (!el) return;
        el.querySelectorAll(".theme-swatch").forEach(function(s){
            s.classList.toggle("active", s.getAttribute("data-theme") === currentTheme);
        });
    });
    ["admin-bg-btns"].forEach(function(containerId){
        var el = document.getElementById(containerId);
        if (!el) return;
        el.querySelectorAll(".bg-btn").forEach(function(b){
            b.classList.toggle("active", b.getAttribute("data-bg") === currentBg);
        });
    });
}

function buildSwatches(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";
    THEMES.forEach(function(t){
        var btn = document.createElement("button");
        btn.className = "theme-swatch" + (t.id === currentTheme ? " active" : "");
        btn.setAttribute("data-theme", t.id);
        btn.setAttribute("aria-label", t.label);
        btn.setAttribute("title", t.label);
        btn.style.background = t.accent;
        btn.addEventListener("click", function(){
            applyTheme(t.id, null);
            setAdminStatus("\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19 Theme \u0e41\u0e25\u0e49\u0e27 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
        });
        el.appendChild(btn);
    });
}

function initThemePicker() {
    // Restore theme from data.json (set during loadData)
    // Build admin swatch UI
    buildSwatches("admin-theme-swatches");
    applyTheme(currentTheme, currentBg);

    // bg buttons — admin panel only
    var container = document.getElementById("admin-bg-btns");
    if (container) {
        container.addEventListener("click", function(e){
            var btn = e.target.closest(".bg-btn");
            if (!btn) return;
            applyTheme(null, btn.getAttribute("data-bg"));
            setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
        });
    }
}

/* ================================================
   LOAD DATA
   ================================================ */
async function loadData() {
    // 1. Try localStorage first (last-saved state by admin)
    var local = loadFromLocal();
    if (local) {
        appData = local;
    } else {
        // 2. Fall back to data.json (fresh browser / first visit)
        try {
            var res = await fetch("data.json?t=" + Date.now());
            if (!res.ok) throw new Error("not found");
            appData = await res.json();
        } catch(e) {
            appData = JSON.parse(JSON.stringify(FALLBACK_DATA));
        }
    }
    // Migrate old youtube/tiktok fields → socials array
    if (appData.profile && !appData.profile.socials) {
        appData.profile.socials = [];
        if (appData.profile.youtube) appData.profile.socials.push({ label: "YouTube", url: appData.profile.youtube });
        if (appData.profile.tiktok)  appData.profile.socials.push({ label: "TikTok",  url: appData.profile.tiktok  });
    }
    // Theme priority: localStorage theme keys > appData.theme
    try {
        var lsTheme = localStorage.getItem("pf_theme");
        var lsBg    = localStorage.getItem("pf_bg");
        currentTheme = lsTheme || appData.theme   || currentTheme;
        currentBg    = lsBg    || appData.themeBg || currentBg;
    } catch(e) {
        if (appData.theme)   currentTheme = appData.theme;
        if (appData.themeBg) currentBg    = appData.themeBg;
    }
}

/* ================================================
   RENDER
   ================================================ */
function renderAll() {
    renderHeader();
    renderReel();
    renderPortfolio();
    renderAbout();
    renderFooter();
}

function renderHeader() {
    var p = appData.profile;
    setText("header-name", p.nameEN || "—");
    setText("header-role", p.role   || "");
    document.title = (p.nameEN || "Portfolio") + " \u2014 3D Animator";
}

function renderReel() {
    var p = appData.profile;
    var iframe = document.getElementById("reel-iframe");
    // Lazy: only set src when reel tab is active
    if (iframe) iframe.setAttribute("data-src", appData.reelUrl || "");
    setText("reel-year-tag",    "Showreel " + (p.reelYear || ""));
    setText("reel-caption-text", p.reelCaption || "");
}

function lazyLoadReel() {
    var iframe = document.getElementById("reel-iframe");
    if (!iframe) return;
    var src = iframe.getAttribute("data-src");
    if (src && iframe.src !== src) iframe.src = src;
}

function renderPortfolio() {
    var grid = document.getElementById("portfolio-grid");
    if (!grid) return;
    var items = appData.portfolio || [];

    // Show skeletons first
    grid.innerHTML = "";
    items.forEach(function(){ 
        var sk = document.createElement("div");
        sk.className = "port-item skeleton port-skeleton";
        grid.appendChild(sk);
    });

    // Replace skeletons with real thumbnails after a tick
    requestAnimationFrame(function(){
        grid.innerHTML = "";
        items.forEach(function(id, idx){
            var safeId = id.replace(/[^A-Za-z0-9_\-]/g,"");
            var btn = document.createElement("button");
            btn.className = "port-item";
            btn.setAttribute("aria-label", "Play Portfolio " + (idx+1));
            btn.setAttribute("role", "listitem");
            btn.addEventListener("click", function(){ openModal(safeId, "Portfolio " + (idx+1)); });
            btn.innerHTML =
                "<img src=\"https://img.youtube.com/vi/" + safeId + "/hqdefault.jpg\"" +
                " alt=\"Animation project " + (idx+1) + "\" class=\"port-thumb\" loading=\"lazy\">" +
                "<div class=\"port-overlay\" aria-hidden=\"true\">" +
                  "<span class=\"play-icon\">&#9654;</span>" +
                "</div>" +
                "<span class=\"port-num\">" + (idx+1) + "</span>";
            grid.appendChild(btn);
        });
        // count
        var countEl = document.getElementById("portfolio-count");
        if (countEl) countEl.textContent = items.length + " videos";
    });
}

function renderAbout() {
    var p = appData.profile;
    setText("about-name-th", p.nameTH || "");
    var bioEl = document.getElementById("about-bio");
    if (bioEl && p.bio) {
        bioEl.innerHTML = p.bio.split("\n").map(function(l){ return l.trim(); }).filter(Boolean)
            .map(function(l){ return "<p>" + l + "</p>"; }).join("");
    }
    var emailLink = document.getElementById("about-email-link");
    var emailText = document.getElementById("about-email-text");
    if (emailLink && p.email) emailLink.href = "mailto:" + p.email;
    if (emailText && p.email) emailText.textContent = p.email;
    // dynamic socials
    var socialRow = document.getElementById("social-row");
    if (socialRow) {
        socialRow.innerHTML = "";
        (p.socials || []).forEach(function(s) {
            if (!s.label || !s.url) return;
            var a = document.createElement("a");
            a.href = s.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "social-btn";
            a.textContent = s.label;
            socialRow.appendChild(a);
        });
    }
    var skillsEl = document.getElementById("skills-list");
    if (skillsEl && p.skills) {
        skillsEl.innerHTML = p.skills.map(function(s){
            return "<span class=\"skill-chip\">" + s + "</span>";
        }).join("");
    }
}

function renderFooter() {
    var name = appData.profile.nameEN || "";
    setText("footer-name",  name);
    setText("footer-name2", name);
}

/* ================================================
   PAGE NAV
   ================================================ */
function switchPage(pageId, clickedBtn) {
    document.querySelectorAll(".page").forEach(function(p){
        p.classList.remove("active");
        p.hidden = true;
    });
    var target = document.getElementById(pageId);
    if (target) { target.classList.add("active"); target.hidden = false; }

    document.querySelectorAll(".nav-btn[data-page]").forEach(function(b){
        b.classList.remove("active");
        b.setAttribute("aria-selected","false");
    });
    if (clickedBtn) { clickedBtn.classList.add("active"); clickedBtn.setAttribute("aria-selected","true"); }

    // Lazy-load reel iframe only when reels tab is opened
    if (pageId === "reels") lazyLoadReel();

    var shell = document.querySelector(".layout-shell");
    if (shell) window.scrollTo({ top: shell.getBoundingClientRect().top + window.pageYOffset - 16, behavior: "smooth" });
}

/* ================================================
   VIDEO MODAL
   ================================================ */
function openModal(youtubeId, title) {
    var modal  = document.getElementById("video-modal");
    var iframe = document.getElementById("modal-iframe");
    var label  = document.getElementById("modal-title");
    if (!modal || !iframe) return;
    iframe.src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1&rel=0";
    if (label) label.textContent = title || "Now Playing";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var cb = document.getElementById("modal-close-btn");
    if (cb) cb.focus();
}
function closeModal() {
    var modal  = document.getElementById("video-modal");
    var iframe = document.getElementById("modal-iframe");
    if (!modal) return;
    if (iframe) iframe.src = "";
    modal.hidden = true;
    document.body.style.overflow = "";
}

/* ================================================
   ADMIN — type "admin" on keyboard
   ================================================ */
(function(){
    var SECRET = "admin", buf = "", timer = null;
    document.addEventListener("keydown", function(e){
        var tag = document.activeElement ? document.activeElement.tagName.toUpperCase() : "";
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        var ap = document.getElementById("admin-panel");
        if (ap && !ap.hidden) return;
        buf += e.key.toLowerCase();
        clearTimeout(timer);
        timer = setTimeout(function(){ buf = ""; }, 2000);
        if (buf.length > SECRET.length) buf = buf.slice(-SECRET.length);
        if (buf === SECRET) { buf = ""; openAdmin(); }
    });
})();

function openAdmin() {
    var panel = document.getElementById("admin-panel");
    if (!panel) return;
    panel.hidden = false;
    document.body.style.overflow = "hidden";
    var dv = document.getElementById("dashboard-view");
    if (dv) dv.style.display = "block";
    populateDashboard();
    buildSwatches("admin-theme-swatches");
    syncSwatchUI();
}
function closeAdmin(force) {
    if (!force && hasUnsaved) {
        var ok = confirm("\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49 Export JSON\n\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e35\u0e48\u0e41\u0e01\u0e49\u0e44\u0e02\u0e08\u0e30\u0e2b\u0e32\u0e22\u0e2b\u0e32\u0e01\u0e1b\u0e34\u0e14\u0e40\u0e1b\u0e25\u0e48\u0e32\u0e19\u0e40\u0e27\u0e47\u0e1a\n\n\u0e1b\u0e34\u0e14\u0e42\u0e14\u0e22\u0e44\u0e21\u0e48 Export?");
        if (!ok) return;
    }
    hasUnsaved = false;
    var panel = document.getElementById("admin-panel");
    if (!panel) return;
    panel.hidden = true;
    document.body.style.overflow = "";
}


/* ================================================
   SOCIAL LINKS ADMIN
   ================================================ */
function renderSocialAdmin() {
    var list = document.getElementById("social-admin-list");
    if (!list) return;
    var socials = appData.profile.socials || [];
    list.innerHTML = "";
    socials.forEach(function(s, idx) {
        var row = document.createElement("div");
        row.className = "social-admin-row";
        row.innerHTML =
            "<input class=\"social-label-input\" type=\"text\" placeholder=\"ชื่อ เช่น Instagram\" value=\"" + escHtml(s.label) + "\" data-idx=\"" + idx + "\" data-field=\"label\">" +
            "<input class=\"social-url-input\" type=\"text\" placeholder=\"https://...\" value=\"" + escHtml(s.url) + "\" data-idx=\"" + idx + "\" data-field=\"url\">" +
            "<div class=\"admin-actions\">" +
              "<button class=\"abtn\" data-smove=\"" + idx + "\" data-dir=\"-1\"" + (idx===0?" disabled":"") + ">↑</button>" +
              "<button class=\"abtn\" data-smove=\"" + idx + "\" data-dir=\"1\"" + (idx===socials.length-1?" disabled":"") + ">↓</button>" +
              "<button class=\"abtn del\" data-sdel=\"" + idx + "\">✕</button>" +
            "</div>";
        list.appendChild(row);
    });
}

function escHtml(s) {
    return (s || "").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
}

function syncSocialsFromInputs() {
    var inputs = document.querySelectorAll("#social-admin-list input");
    var map = {};
    inputs.forEach(function(inp) {
        var idx = inp.getAttribute("data-idx");
        var field = inp.getAttribute("data-field");
        if (!map[idx]) map[idx] = { label: "", url: "" };
        map[idx][field] = inp.value.trim();
    });
    appData.profile.socials = Object.keys(map).sort(function(a,b){return a-b;}).map(function(k){ return map[k]; });
}

function initSocialAdmin() {
    var list = document.getElementById("social-admin-list");
    if (!list) return;

    // live sync inputs → appData on every keystroke
    list.addEventListener("input", function(e) {
        if (e.target.matches(".social-label-input, .social-url-input")) {
            syncSocialsFromInputs();
            renderAbout();
            saveToLocal();
        }
    });

    // move / delete via delegation
    list.addEventListener("click", function(e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        syncSocialsFromInputs(); // sync before mutating
        var smove = btn.getAttribute("data-smove");
        var sdel  = btn.getAttribute("data-sdel");
        var dir   = btn.getAttribute("data-dir");
        if (sdel !== null) {
            appData.profile.socials.splice(parseInt(sdel,10), 1);
        }
        if (smove !== null) {
            var i = parseInt(smove,10), ni = i + parseInt(dir,10);
            var arr = appData.profile.socials;
            if (ni >= 0 && ni < arr.length) {
                var tmp = arr[i]; arr[i] = arr[ni]; arr[ni] = tmp;
            }
        }
        renderSocialAdmin();
        renderAbout();
        saveToLocal();
        setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
    });

    // Add new button
    var addBtn = document.getElementById("add-social-btn");
    if (addBtn) {
        addBtn.addEventListener("click", function() {
            if (!appData.profile.socials) appData.profile.socials = [];
            appData.profile.socials.push({ label: "", url: "" });
            renderSocialAdmin();
            // focus last label input
            var inputs = list.querySelectorAll(".social-label-input");
            if (inputs.length) inputs[inputs.length-1].focus();
            saveToLocal();
            setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
        });
    }
}

function populateDashboard() {
    setVal("reel-url-input",     appData.reelUrl || "");
    setVal("reel-year-input",    appData.profile.reelYear || "");
    setVal("reel-caption-input", appData.profile.reelCaption || "");
    renderAdminList();
    var p = appData.profile;
    setVal("p-name-en", p.nameEN  || "");
    setVal("p-name-th", p.nameTH  || "");
    setVal("p-role",    p.role    || "");
    setVal("p-email",   p.email   || "");
    renderSocialAdmin();
    var bioEl = document.getElementById("p-bio");
    if (bioEl) bioEl.value = p.bio || "";
    setVal("p-skills", (p.skills || []).join(", "));
    setAdminStatus("");
}

function renderAdminList() {
    var list = document.getElementById("admin-port-list");
    if (!list) return;
    list.innerHTML = "";
    var total = (appData.portfolio || []).length;
    appData.portfolio.forEach(function(id, idx){
        var safeId = id.replace(/[^A-Za-z0-9_\-]/g,"");
        var row = document.createElement("div");
        row.className = "admin-row";
        row.innerHTML =
            "<span class=\"admin-num\">" + (idx+1) + "</span>" +
            "<img src=\"https://img.youtube.com/vi/" + safeId + "/mqdefault.jpg\" class=\"admin-thumb\" loading=\"lazy\" alt=\"\">" +
            "<span class=\"admin-id\" title=\"" + safeId + "\">" + safeId + "</span>" +
            "<div class=\"admin-actions\">" +
              "<button class=\"abtn\" data-move=\"" + idx + "\" data-dir=\"-1\"" + (idx===0?" disabled":"") + " aria-label=\"up\">&#8593;</button>" +
              "<button class=\"abtn\" data-move=\"" + idx + "\" data-dir=\"1\""  + (idx===total-1?" disabled":"") + " aria-label=\"down\">&#8595;</button>" +
              "<button class=\"abtn del\" data-del=\"" + idx + "\" aria-label=\"delete\">&#x2715;</button>" +
            "</div>";
        list.appendChild(row);
    });
    // update count
    var countEl = document.getElementById("portfolio-count");
    if (countEl) countEl.textContent = total + " videos";
    // update admin section title with count
    var title = list.previousElementSibling;
}

/* ---- Reel ---- */
function applyReelUrl() {
    var v = getVal("reel-url-input");
    if (!v) return;
    if (!/^https:\/\//i.test(v)) { showMsg("reel-msg","URL ต้องขึ้นต้นด้วย https://","error"); return; }
    appData.reelUrl = v;
    appData.profile.reelYear    = getVal("reel-year-input")    || appData.profile.reelYear;
    appData.profile.reelCaption = getVal("reel-caption-input") || appData.profile.reelCaption;
    renderReel();
    // re-apply lazy src
    var iframe = document.getElementById("reel-iframe");
    if (iframe) { iframe.setAttribute("data-src", v); iframe.src = v; }
    saveToLocal();
    showMsg("reel-msg","&#10003; \u0e2d\u0e31\u0e1b\u0e40\u0e14\u0e15\u0e41\u0e25\u0e49\u0e27","ok");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}

/* ---- Portfolio ---- */
function addPortItem() {
    var raw = getVal("new-yt-input"), ytId = raw;
    var m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/);
    if (m) ytId = m[1];
    if (!/^[A-Za-z0-9_\-]{11}$/.test(ytId)) { showMsg("add-msg","YouTube ID \u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07","error"); return; }
    if (appData.portfolio.indexOf(ytId) !== -1) { showMsg("add-msg","\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d\u0e19\u0e35\u0e49\u0e21\u0e35\u0e2d\u0e22\u0e39\u0e48\u0e41\u0e25\u0e49\u0e27","error"); return; }
    appData.portfolio.push(ytId);
    setVal("new-yt-input","");
    renderAdminList(); renderPortfolio();
    saveToLocal();
    showMsg("add-msg","&#10003; \u0e40\u0e1e\u0e34\u0e48\u0e21\u0e41\u0e25\u0e49\u0e27","ok");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}
function deleteItem(idx) {
    if (!confirm("\u0e25\u0e1a\u0e27\u0e34\u0e14\u0e35\u0e42\u0e2d\u0e17\u0e35\u0e48 "+(idx+1)+" \u0e2d\u0e2d\u0e01?")) return;
    appData.portfolio.splice(idx,1);
    renderAdminList(); renderPortfolio();
    saveToLocal();
    showMsg("add-msg","&#10003; \u0e25\u0e1a\u0e41\u0e25\u0e49\u0e27","ok");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}
function moveItem(idx, dir) {
    var a = appData.portfolio, ni = idx+dir;
    if (ni < 0 || ni >= a.length) return;
    var tmp = a[idx]; a[idx] = a[ni]; a[ni] = tmp;
    renderAdminList(); renderPortfolio();
    saveToLocal();
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}

/* ---- Profile ---- */
function applyProfile() {
    appData.profile.nameEN  = getVal("p-name-en");
    appData.profile.nameTH  = getVal("p-name-th");
    appData.profile.role    = getVal("p-role");
    appData.profile.email   = getVal("p-email");
    // socials saved via renderSocialAdmin live — already in appData.profile.socials
    var bioEl = document.getElementById("p-bio");
    appData.profile.bio = bioEl ? bioEl.value : "";
    appData.profile.skills = getVal("p-skills").split(",").map(function(s){ return s.trim(); }).filter(Boolean);
    renderHeader(); renderAbout(); renderFooter();
    saveToLocal();
    showMsg("profile-msg","&#10003; \u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e41\u0e25\u0e49\u0e27","ok");
    setAdminStatus("\u0e21\u0e35\u0e01\u0e32\u0e23\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u2014 \u0e2d\u0e22\u0e48\u0e32\u0e25\u0e37\u0e21 Export JSON");
}

/* ---- Admin tabs ---- */
function switchAdminTab(el, tabId) {
    document.querySelectorAll(".atab").forEach(function(t){ t.classList.remove("active"); });
    document.querySelectorAll(".admin-tab-content").forEach(function(t){ t.style.display="none"; });
    el.classList.add("active");
    var tab = document.getElementById(tabId);
    if (tab) tab.style.display = "block";
}

/* ================================================
   JSON EXPORT / IMPORT
   ================================================ */
function exportJSON() {
    // Store current theme choice in data
    appData.theme   = currentTheme;
    appData.themeBg = currentBg;
    var json = JSON.stringify(appData, null, 4);
    var blob = new Blob([json], {type:"application/json"});
    var url  = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "data.json";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    showMsg("export-msg","&#10003; data.json \u0e14\u0e32\u0e27\u0e19\u0e4c\u0e42\u0e2b\u0e25\u0e14\u0e41\u0e25\u0e49\u0e27 \u2014 \u0e19\u0e33\u0e44\u0e1b\u0e41\u0e17\u0e19\u0e17\u0e35\u0e48\u0e44\u0e1f\u0e25\u0e4c\u0e40\u0e14\u0e34\u0e21\u0e41\u0e25\u0e49\u0e27 push GitHub","ok");
    hasUnsaved = false;
    setAdminStatusRaw("\u2713 Export \u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22");
}

function importJSON(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var parsed = JSON.parse(e.target.result);
            if (!parsed.portfolio || !parsed.profile) throw new Error("invalid");
            appData = parsed;
            // apply theme from imported file
            if (parsed.theme)   currentTheme = parsed.theme;
            if (parsed.themeBg) currentBg    = parsed.themeBg;
            applyTheme(currentTheme, currentBg);
            renderAll(); populateDashboard();
            buildSwatches("admin-theme-swatches"); syncSwatchUI();
            saveToLocal();
            showMsg("import-msg","&#10003; \u0e42\u0e2b\u0e25\u0e14\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08 \u2014 \u0e2b\u0e19\u0e49\u0e32\u0e40\u0e27\u0e47\u0e1a\u0e2d\u0e31\u0e1b\u0e40\u0e14\u0e15\u0e41\u0e25\u0e49\u0e27","ok");
            setAdminStatus("");
        } catch(e) {
            showMsg("import-msg","\u0e44\u0e1f\u0e25\u0e4c\u0e44\u0e21\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07 \u2014 \u0e15\u0e49\u0e2d\u0e07\u0e40\u0e1b\u0e47\u0e19 data.json \u0e17\u0e35\u0e48 export \u0e21\u0e32\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a\u0e19\u0e35\u0e49","error");
        }
    };
    reader.readAsText(file);
}

/* ================================================
   HELPERS
   ================================================ */
function setText(id,val)  { var el=document.getElementById(id); if(el) el.textContent=val; }
function setVal(id,val)   { var el=document.getElementById(id); if(el) el.value=val; }
function getVal(id)       { var el=document.getElementById(id); return el?el.value.trim():""; }
function setAdminStatus(m){
    var el=document.getElementById("admin-status");
    if(el) {
        el.textContent = m;
        if (m) {
            el.style.color = "var(--accent)";
            hasUnsaved = true;
        }
    }
}
function clearUnsaved() {
    hasUnsaved = false;
    setAdminStatusRaw("");
}
function setAdminStatusRaw(m){
    var el=document.getElementById("admin-status");
    if(el){ el.textContent=m; }
}
function showMsg(id,text,type) {
    var el=document.getElementById(id); if(!el) return;
    el.innerHTML = text;
    el.style.color = type==="error"?"#f28b82":"var(--accent)";
    clearTimeout(el._t);
    el._t = setTimeout(function(){ el.textContent=""; },4000);
}

/* ================================================
   INIT
   ================================================ */
document.addEventListener("DOMContentLoaded", async function() {

    // Year
    var yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();

    // Load data → render
    await loadData();

    // Init theme BEFORE render so accent color is set
    initThemePicker();
    renderAll();

    // Page state
    document.querySelectorAll(".page").forEach(function(p, i){
        if (i === 0) { p.classList.add("active"); p.hidden = false; }
        else         { p.classList.remove("active"); p.hidden = true; }
    });
    // Lazy-load reel on first view
    lazyLoadReel();

    // Nav
    document.querySelectorAll(".nav-btn[data-page]").forEach(function(btn){
        btn.addEventListener("click", function(){
            switchPage(btn.getAttribute("data-page"), btn);
        });
    });

    // Modal
    var mc = document.getElementById("modal-close-btn");
    var mb = document.getElementById("modal-backdrop");
    if (mc) mc.addEventListener("click", closeModal);
    if (mb) mb.addEventListener("click", closeModal);

    // Admin wiring
    var ac = document.getElementById("admin-close-btn");
    var ab = document.getElementById("admin-backdrop");
    if (ac) ac.addEventListener("click", closeAdmin);
    if (ab) ab.addEventListener("click", closeAdmin);

    var ar  = document.getElementById("apply-reel-btn");    if(ar)  ar.addEventListener("click", applyReelUrl);
    var apb = document.getElementById("add-port-btn");      if(apb) apb.addEventListener("click", addPortItem);
    var apf = document.getElementById("apply-profile-btn"); if(apf) apf.addEventListener("click", applyProfile);
    var ex  = document.getElementById("export-json-btn");   if(ex)  ex.addEventListener("click", exportJSON);
    var im  = document.getElementById("import-json-file");
    if (im) im.addEventListener("change", function(e){ importJSON(e.target.files[0]); e.target.value=""; });

    // Admin tabs
    document.querySelectorAll(".atab").forEach(function(btn){
        btn.addEventListener("click", function(){ switchAdminTab(btn, btn.getAttribute("data-tab")); });
    });

    initSocialAdmin();

    // Portfolio list events
    var pl = document.getElementById("admin-port-list");
    if (pl) pl.addEventListener("click", function(e){
        var btn = e.target.closest("button"); if(!btn) return;
        var del  = btn.getAttribute("data-del");
        var move = btn.getAttribute("data-move");
        var dir  = btn.getAttribute("data-dir");
        if (del  !== null) deleteItem(parseInt(del, 10));
        if (move !== null) moveItem(parseInt(move,10), parseInt(dir,10));
    });

    // Escape key
    document.addEventListener("keydown", function(e){
        if (e.key !== "Escape") return;
        var vm = document.getElementById("video-modal");
        if (vm && !vm.hidden) closeModal();
        var adm = document.getElementById("admin-panel");
        if (adm && !adm.hidden) closeAdmin();

    });

    // Block iframe embedding
    if (window.self !== window.top) {
        document.documentElement.style.display = "none";
        window.top.location = window.self.location;
    }
});
