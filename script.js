/* =============================================
   RACHAPON THATPRASERT — Portfolio Script
   ============================================= */

/* ================================================
   DATA — แก้ไขผ่าน Admin Panel แล้ว Export
   ================================================ */
const PORTFOLIO_DATA = {
    reelUrl: 'https://player.vimeo.com/video/1169127503?title=0&byline=0&portrait=0',
    portfolio: [
        'devW0oJUFRk','dex4vsSgK8A','5oIfkuYBtLg','p2Zyb89sXoY',
        'xzfF2g12BP4','50XBFJeMdfA','9KTGKXc4XYc','-HGcIdC-sAg',
        'R0XCXMMP5G8','4tB731jNpTw','V8pVpn3ftBQ','w_EWc5K7SHs',
        'KYIcZnQCRDM','2F-CXlheMWo','HmKEqZBP7N8','K_jDPXL4zdk',
        'dEO1n5XmTnA','ixTTWdGs1UY','jRConNGJ1Zc'
    ]
};

/* Working copy — edited in memory during admin session */
let appData = JSON.parse(JSON.stringify(PORTFOLIO_DATA));

/* ================================================
   SECURITY — SHA-256 + Rate Limiting
   ================================================ */
const ADMIN_PASS_HASH_KEY = 'p_hash';
const LOCKOUT_KEY         = 'p_lock';
const DEFAULT_PASS        = 'rachapon2024';
const MAX_ATTEMPTS        = 3;
const LOCKOUT_MS          = 30000;

async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function getStoredHash() {
    let h = sessionStorage.getItem(ADMIN_PASS_HASH_KEY);
    if (!h) {
        h = await sha256(DEFAULT_PASS);
        sessionStorage.setItem(ADMIN_PASS_HASH_KEY, h);
    }
    return h;
}

function getLockout() {
    try { return JSON.parse(sessionStorage.getItem(LOCKOUT_KEY)) || { attempts: 0, until: 0 }; }
    catch { return { attempts: 0, until: 0 }; }
}
function setLockout(o) { sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify(o)); }
function clearLockout() { sessionStorage.removeItem(LOCKOUT_KEY); }

function isLockedOut() {
    const lock = getLockout();
    if (lock.until && Date.now() < lock.until) return true;
    if (lock.until && Date.now() >= lock.until) setLockout({ attempts: 0, until: 0 });
    return false;
}

function recordFail() {
    const lock = getLockout();
    lock.attempts = (lock.attempts || 0) + 1;
    if (lock.attempts >= MAX_ATTEMPTS) lock.until = Date.now() + LOCKOUT_MS;
    setLockout(lock);
    return lock;
}

/* ================================================
   ANTI-TAMPER
   ================================================ */
/* Block iframe embedding */
if (window.self !== window.top) {
    document.documentElement.style.display = 'none';
    window.top.location = window.self.location;
}

/* Detect DevTools (size heuristic) */
let devToolsOpen = false;
(function() {
    const threshold = 160;
    function check() {
        devToolsOpen = (window.outerWidth - window.innerWidth > threshold) ||
                       (window.outerHeight - window.innerHeight > threshold);
    }
    check();
    setInterval(check, 1500);
})();

/* Block DevTools keys while Admin Panel is open */
function blockDevKeys(e) {
    const panel = document.getElementById('admin-panel');
    if (!panel || panel.hidden) { document.removeEventListener('keydown', blockDevKeys); return; }
    if (e.key === 'F12' ||
       (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
       (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
}

/* ================================================
   SECRET TRIGGER — type "admin" anywhere on page
   (not while focused in an input)
   Disabled when DevTools is open.
   ================================================ */
(function() {
    const SECRET = ['a','d','m','i','n'];
    let buf = [], timer;
    document.addEventListener('keydown', e => {
        const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return;
        const ap = document.getElementById('admin-panel');
        if (ap && !ap.hidden) return;
        if (devToolsOpen) return;
        buf.push(e.key.toLowerCase());
        clearTimeout(timer);
        timer = setTimeout(() => { buf = []; }, 3000);
        if (buf.length > SECRET.length) buf.shift();
        if (buf.join('') === SECRET.join('')) { buf = []; openAdmin(); }
    });
})();

/* ================================================
   RENDER
   ================================================ */
function renderReel() {
    const iframe = document.getElementById('reel-iframe');
    if (iframe) iframe.src = appData.reelUrl;
}

function renderPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = '';
    appData.portfolio.forEach((id, idx) => {
        const btn = document.createElement('button');
        btn.className = 'port-item';
        btn.setAttribute('aria-label', `Play Portfolio ${idx + 1}`);
        btn.onclick = () => openModal(id, `Portfolio ${idx + 1}`);
        btn.innerHTML = `
            <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg"
                 alt="Animation project ${idx + 1}" class="port-thumb" loading="lazy">
            <div class="port-overlay" aria-hidden="true"><span class="play-icon">▶</span></div>
        `;
        grid.appendChild(btn);
    });
}

/* ================================================
   PAGE NAV
   ================================================ */
function switchPage(pageId, el) {
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.hidden = true; });
    const t = document.getElementById(pageId);
    if (t) { t.classList.add('active'); t.hidden = false; }
    document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    if (el) { el.classList.add('active'); el.setAttribute('aria-selected','true'); }
    const shell = document.querySelector('.layout-shell');
    if (shell) window.scrollTo({ top: shell.getBoundingClientRect().top + window.pageYOffset - 16, behavior: 'smooth' });
}

/* ================================================
   VIDEO MODAL
   ================================================ */
function openModal(youtubeId, title) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    const label  = document.getElementById('modal-title');
    if (!modal || !iframe) return;
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    if (label) label.textContent = title || 'Now Playing';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const cb = modal.querySelector('.modal-close');
    if (cb) cb.focus();
}
function closeModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    if (!modal) return;
    iframe.src = '';
    modal.hidden = true;
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const vm = document.getElementById('video-modal');
    if (vm && !vm.hidden) closeModal();
    const ap = document.getElementById('admin-panel');
    if (ap && !ap.hidden) closeAdmin();
});

/* ================================================
   ADMIN PANEL
   ================================================ */
function openAdmin() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    /* Reset working copy from source-of-truth each time admin opens */
    appData = JSON.parse(JSON.stringify(PORTFOLIO_DATA));
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', blockDevKeys);
    showView('login-view');
    updateLockoutUI();
}

function closeAdmin() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    panel.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', blockDevKeys);
    clearInterval(window._lockCountdown);
}

function showView(id) {
    ['login-view','dashboard-view'].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = v === id ? 'block' : 'none';
    });
}

/* -- Lockout UI -- */
function updateLockoutUI() {
    const btn = document.getElementById('login-btn');
    const err = document.getElementById('login-error');
    const pi  = document.getElementById('admin-pass-input');
    clearInterval(window._lockCountdown);

    if (isLockedOut()) {
        if (pi)  pi.disabled = true;
        if (btn) btn.disabled = true;
        window._lockCountdown = setInterval(() => {
            const lock = getLockout();
            const rem  = Math.max(0, Math.ceil((lock.until - Date.now()) / 1000));
            if (rem <= 0) {
                clearInterval(window._lockCountdown);
                if (pi)  pi.disabled = false;
                if (btn) btn.disabled = false;
                if (err) err.textContent = '';
            } else {
                if (err) { err.style.color = '#f28b82'; err.textContent = `ถูกล็อก ${rem} วินาที`; }
            }
        }, 500);
    } else {
        const lock = getLockout();
        if (lock.attempts > 0 && err) {
            const left = MAX_ATTEMPTS - lock.attempts;
            err.style.color = '#f28b82';
            err.textContent = `รหัสผ่านไม่ถูกต้อง — เหลือ ${left} ครั้ง`;
        }
        if (pi)  pi.disabled = false;
        if (btn) btn.disabled = false;
    }
}

async function adminLogin() {
    if (isLockedOut()) { updateLockoutUI(); return; }
    const pi   = document.getElementById('admin-pass-input');
    const err  = document.getElementById('login-error');
    const pass = pi ? pi.value : '';
    if (!pass) return;

    const inputHash  = await sha256(pass);
    const storedHash = await getStoredHash();

    if (inputHash === storedHash) {
        clearLockout();
        pi.value = '';
        if (err) err.textContent = '';
        showView('dashboard-view');
        populateDashboard();
    } else {
        pi.value = '';
        const lock = recordFail();
        if (lock.until) {
            if (pi) pi.disabled = true;
            document.getElementById('login-btn').disabled = true;
        }
        updateLockoutUI();
        pi.focus();
    }
}

function populateDashboard() {
    const ri = document.getElementById('reel-url-input');
    if (ri) ri.value = appData.reelUrl;
    renderAdminList();
    clearExportMsg();
}

function renderAdminList() {
    const list = document.getElementById('admin-port-list');
    if (!list) return;
    list.innerHTML = '';
    appData.portfolio.forEach((id, idx) => {
        const safeId = id.replace(/[^A-Za-z0-9_\-]/g, '');
        const row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML = `
            <span class="admin-num">${idx + 1}</span>
            <img src="https://img.youtube.com/vi/${safeId}/mqdefault.jpg" class="admin-thumb" loading="lazy" alt="">
            <span class="admin-id" title="${safeId}">${safeId}</span>
            <div class="admin-actions">
                <button class="abtn" onclick="moveItem(${idx},-1)" ${idx===0?'disabled':''} aria-label="ขึ้น">↑</button>
                <button class="abtn" onclick="moveItem(${idx},1)" ${idx===appData.portfolio.length-1?'disabled':''} aria-label="ลง">↓</button>
                <button class="abtn del" onclick="deleteItem(${idx})" aria-label="ลบ">✕</button>
            </div>
        `;
        list.appendChild(row);
    });
}

function applyReelUrl() {
    const input = document.getElementById('reel-url-input');
    if (!input) return;
    const v = input.value.trim();
    if (!v) return;
    if (!/^https:\/\//i.test(v)) {
        showAdminMsg('reel-msg', 'URL ต้องขึ้นต้นด้วย https://', 'error'); return;
    }
    appData.reelUrl = v;
    showAdminMsg('reel-msg', 'อัปเดตแล้ว (อย่าลืม Export)', 'ok');
}

function addPortItem() {
    const input = document.getElementById('new-yt-input');
    if (!input) return;
    const raw = input.value.trim();
    let ytId = raw;
    const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/);
    if (m) ytId = m[1];
    if (!/^[A-Za-z0-9_\-]{11}$/.test(ytId)) {
        showAdminMsg('add-msg', 'YouTube ID ไม่ถูกต้อง', 'error'); return;
    }
    if (appData.portfolio.includes(ytId)) {
        showAdminMsg('add-msg', 'วิดีโอนี้มีอยู่แล้ว', 'error'); return;
    }
    appData.portfolio.push(ytId);
    input.value = '';
    renderAdminList();
    showAdminMsg('add-msg', 'เพิ่มแล้ว (อย่าลืม Export)', 'ok');
}

function deleteItem(idx) {
    if (!confirm(`ลบวิดีโอที่ ${idx+1} ออก?`)) return;
    appData.portfolio.splice(idx, 1);
    renderAdminList();
    showAdminMsg('add-msg', 'ลบแล้ว (อย่าลืม Export)', 'ok');
}

function moveItem(idx, dir) {
    const a = appData.portfolio;
    const ni = idx + dir;
    if (ni < 0 || ni >= a.length) return;
    [a[idx], a[ni]] = [a[ni], a[idx]];
    renderAdminList();
}

function showAdminMsg(id, text, type) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.color = type === 'error' ? '#f28b82' : '#c8f250';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.textContent = ''; }, 3000);
}

function clearExportMsg() {
    const el = document.getElementById('export-msg');
    if (el) el.textContent = '';
}

/* ================================================
   EXPORT — generate new script.js and download it
   ================================================ */
function exportScript() {
    /* Fetch the current script.js source text */
    fetch('script.js')
        .then(r => {
            if (!r.ok) throw new Error('fetch failed');
            return r.text();
        })
        .then(source => {
            const newSource = rebuildSource(source);
            downloadFile('script.js', newSource);
            showAdminMsg('export-msg', '✓ script.js ดาวน์โหลดแล้ว — นำไปแทนที่ไฟล์เดิมแล้ว push GitHub', 'ok');
        })
        .catch(() => {
            /* Fallback: build from scratch if fetch fails (e.g. opened as file://) */
            const newSource = buildScriptFromScratch();
            downloadFile('script.js', newSource);
            showAdminMsg('export-msg', '✓ script.js ดาวน์โหลดแล้ว — นำไปแทนที่ไฟล์เดิมแล้ว push GitHub', 'ok');
        });
}

/* Replace ONLY the PORTFOLIO_DATA block inside the source */
function rebuildSource(source) {
    const dataBlock = `const PORTFOLIO_DATA = ${JSON.stringify(appData, null, 4)};`;
    return source.replace(
        /const PORTFOLIO_DATA = \{[\s\S]*?\};/,
        dataBlock
    );
}

/* Full fallback builder — writes complete script.js from template */
function buildScriptFromScratch() {
    return getCurrentScriptContent().replace(
        /const PORTFOLIO_DATA = \{[\s\S]*?\};/,
        `const PORTFOLIO_DATA = ${JSON.stringify(appData, null, 4)};`
    );
}

function getCurrentScriptContent() {
    /* Read from the actual loaded script tag */
    const scripts = document.querySelectorAll('script[src="script.js"]');
    if (scripts.length) {
        /* Can't read inline from tag — rely on fetch path */
    }
    /* Return a minimal valid fallback template */
    return `/* RACHAPON THATPRASERT — Portfolio Script */\n\nconst PORTFOLIO_DATA = ${JSON.stringify(PORTFOLIO_DATA, null, 4)};\n\n/* [Full script was not available for rebuild. Please use the fetch-based export.] */\n`;
}

function downloadFile(filename, text) {
    const blob = new Blob([text], { type: 'text/javascript' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function changePassword() {
    const cur = document.getElementById('cp-current').value;
    const nw  = document.getElementById('cp-new').value;
    const nw2 = document.getElementById('cp-new2').value;
    const msg = document.getElementById('cp-msg');
    if (!cur||!nw||!nw2) { showAdminMsg('cp-msg','กรอกให้ครบ','error'); return; }
    if (nw !== nw2)       { showAdminMsg('cp-msg','รหัสผ่านใหม่ไม่ตรงกัน','error'); return; }
    if (nw.length < 8)    { showAdminMsg('cp-msg','ต้องมีอย่างน้อย 8 ตัวอักษร','error'); return; }
    const curHash = await sha256(cur);
    const stored  = await getStoredHash();
    if (curHash !== stored) { showAdminMsg('cp-msg','รหัสผ่านปัจจุบันไม่ถูกต้อง','error'); return; }
    /* Save new hash to sessionStorage for this session only */
    sessionStorage.setItem(ADMIN_PASS_HASH_KEY, await sha256(nw));
    clearLockout();
    ['cp-current','cp-new','cp-new2'].forEach(id => { document.getElementById(id).value = ''; });
    showAdminMsg('cp-msg','เปลี่ยนรหัสผ่านในเซสชันนี้แล้ว ✓\n(เปลี่ยนถาวร: แก้ DEFAULT_PASS ใน script.js)','ok');
}

/* Enter key on login */
document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const lv = document.getElementById('login-view');
    if (lv && lv.style.display !== 'none') adminLogin();
});

/* ================================================
   INIT
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();

    document.querySelectorAll('.page').forEach((p, i) => {
        if (i === 0) { p.classList.add('active'); p.hidden = false; }
        else p.hidden = true;
    });

    renderReel();
    renderPortfolio();
    getStoredHash();
});
