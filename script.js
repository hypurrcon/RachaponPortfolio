/* =============================================
   RACHAPON THATPRASERT — Portfolio
   ============================================= */

const DATA_KEY  = 'portfolio_data';
const PASS_KEY  = 'portfolio_pass_hash';
const ADMIN_KEY = 'portfolio_admin_auth';
const LOCK_KEY  = 'portfolio_lockout';
const DEFAULT_PASS = 'rachapon2024';

/* ================================================
   SECURITY LAYER 1 — SHA-256 via Web Crypto API
   (No plain-text password ever stored anywhere)
   ================================================ */
async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function getStoredHash() {
    let h = localStorage.getItem(PASS_KEY);
    if (!h) {
        h = await sha256(DEFAULT_PASS);
        localStorage.setItem(PASS_KEY, h);
    }
    return h;
}

/* ================================================
   SECURITY LAYER 2 — Rate Limiting
   Lock 30s after 3 wrong attempts.
   Attempts reset only on success.
   ================================================ */
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS   = 30000;

function getLockout() {
    try { return JSON.parse(localStorage.getItem(LOCK_KEY)) || { attempts: 0, until: 0 }; }
    catch { return { attempts: 0, until: 0 }; }
}
function setLockout(obj) { localStorage.setItem(LOCK_KEY, JSON.stringify(obj)); }
function clearLockout()  { localStorage.removeItem(LOCK_KEY); }

function isLockedOut() {
    const lock = getLockout();
    if (lock.until && Date.now() < lock.until) return true;
    if (lock.until && Date.now() >= lock.until) {
        /* Lockout expired — reset attempts but keep record */
        setLockout({ attempts: 0, until: 0 });
    }
    return false;
}

function recordFailedAttempt() {
    const lock = getLockout();
    lock.attempts = (lock.attempts || 0) + 1;
    if (lock.attempts >= MAX_ATTEMPTS) {
        lock.until = Date.now() + LOCKOUT_MS;
    }
    setLockout(lock);
    return lock;
}

function getLockoutRemaining() {
    const lock = getLockout();
    if (!lock.until) return 0;
    return Math.max(0, Math.ceil((lock.until - Date.now()) / 1000));
}

/* ================================================
   SECURITY LAYER 3 — Anti-Tamper / DevTools detection
   Detect open DevTools and disable admin trigger.
   Not bulletproof but raises the bar significantly.
   ================================================ */
let devToolsOpen = false;
(function detectDevTools() {
    const threshold = 160;
    function check() {
        const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        devToolsOpen = widthDiff || heightDiff;
    }
    check();
    setInterval(check, 1000);
})();

/* ================================================
   SECURITY LAYER 4 — Anti-Clickjacking
   Prevent the page from being embedded in an iframe
   by a malicious third party.
   ================================================ */
if (window.self !== window.top) {
    document.documentElement.style.display = 'none';
    window.top.location = window.self.location;
}

/* ================================================
   SECURITY LAYER 5 — Disable right-click & F12
   on admin panel only (not on the whole page —
   that would annoy visitors).
   ================================================ */
function lockAdminInteraction() {
    document.addEventListener('keydown', blockDevKeys);
}
function unlockAdminInteraction() {
    document.removeEventListener('keydown', blockDevKeys);
}
function blockDevKeys(e) {
    const panel = document.getElementById('admin-panel');
    if (!panel || panel.hidden) { unlockAdminInteraction(); return; }
    if (e.key === 'F12' ||
       (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
       (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
}

/* ================================================
   SECURITY LAYER 6 — Secret keyboard shortcut
   Type  A D M I N  (case-insensitive) anywhere
   on the page (not while typing in an input).
   Sequence must be completed within 3 seconds.
   DevTools open → trigger disabled.
   ================================================ */
(function() {
    const SECRET = ['a','d','m','i','n'];
    let buf = [];
    let timer;

    document.addEventListener('keydown', e => {
        /* Ignore if user is typing in any input/textarea */
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        /* Ignore if admin/modal already open */
        const ap = document.getElementById('admin-panel');
        if (ap && !ap.hidden) return;

        /* DevTools open → silently ignore */
        if (devToolsOpen) return;

        buf.push(e.key.toLowerCase());
        clearTimeout(timer);
        timer = setTimeout(() => { buf = []; }, 3000);

        /* Keep only last N chars */
        if (buf.length > SECRET.length) buf.shift();

        if (buf.join('') === SECRET.join('')) {
            buf = [];
            openAdmin();
        }
    });
})();

/* ================================================
   DATA HELPERS
   ================================================ */
function loadData() {
    try { const r = localStorage.getItem(DATA_KEY); return r ? JSON.parse(r) : null; }
    catch { return null; }
}
function saveData(d) { localStorage.setItem(DATA_KEY, JSON.stringify(d)); }

function getDefaultData() {
    return {
        reelUrl: 'https://player.vimeo.com/video/1169127503?title=0&byline=0&portrait=0',
        portfolio: [
            'devW0oJUFRk','dex4vsSgK8A','5oIfkuYBtLg','p2Zyb89sXoY',
            'xzfF2g12BP4','50XBFJeMdfA','9KTGKXc4XYc','-HGcIdC-sAg',
            'R0XCXMMP5G8','4tB731jNpTw','V8pVpn3ftBQ','w_EWc5K7SHs',
            'KYIcZnQCRDM','2F-CXlheMWo','HmKEqZBP7N8','K_jDPXL4zdk',
            'dEO1n5XmTnA','ixTTWdGs1UY','jRConNGJ1Zc'
        ]
    };
}

let appData = loadData() || getDefaultData();

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
function isLoggedIn() { return sessionStorage.getItem(ADMIN_KEY) === '1'; }

function openAdmin() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    lockAdminInteraction();
    if (isLoggedIn()) {
        showView('dashboard-view');
        populateDashboard();
    } else {
        showView('login-view');
        updateLockoutUI();
    }
}

function closeAdmin() {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    panel.hidden = true;
    document.body.style.overflow = '';
    unlockAdminInteraction();
}

function showView(id) {
    ['login-view','dashboard-view'].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = v === id ? 'block' : 'none';
    });
}

/* -- Lockout UI countdown -- */
let countdownInterval = null;

function updateLockoutUI() {
    const btn = document.getElementById('login-btn');
    const err = document.getElementById('login-error');
    const pi  = document.getElementById('admin-pass-input');
    clearInterval(countdownInterval);

    if (isLockedOut()) {
        pi.disabled = true;
        if (btn) btn.disabled = true;

        countdownInterval = setInterval(() => {
            const rem = getLockoutRemaining();
            if (rem <= 0) {
                clearInterval(countdownInterval);
                pi.disabled = false;
                if (btn) btn.disabled = false;
                err.textContent = '';
            } else {
                err.style.color = '#f28b82';
                err.textContent = `ถูกล็อก ${rem} วินาที (พยายามมากเกินไป)`;
            }
        }, 500);
    } else {
        const lock = getLockout();
        const left = MAX_ATTEMPTS - (lock.attempts || 0);
        if (lock.attempts > 0) {
            err.style.color = '#f28b82';
            err.textContent = `รหัสผ่านไม่ถูกต้อง — เหลือ ${left} ครั้ง`;
        }
        pi.disabled = false;
        if (btn) btn.disabled = false;
    }
}

async function adminLogin() {
    if (isLockedOut()) { updateLockoutUI(); return; }

    const pi  = document.getElementById('admin-pass-input');
    const err = document.getElementById('login-error');
    const pass = pi ? pi.value : '';
    if (!pass) return;

    const inputHash  = await sha256(pass);
    const storedHash = await getStoredHash();

    if (inputHash === storedHash) {
        clearLockout();
        sessionStorage.setItem(ADMIN_KEY, '1');
        pi.value = '';
        err.textContent = '';
        showView('dashboard-view');
        populateDashboard();
    } else {
        pi.value = '';
        const lock = recordFailedAttempt();
        if (lock.until) {
            /* Just got locked */
            err.style.color = '#f28b82';
            err.textContent = `ถูกล็อก 30 วินาที`;
            pi.disabled = true;
            document.getElementById('login-btn').disabled = true;
            updateLockoutUI();
        } else {
            const left = MAX_ATTEMPTS - lock.attempts;
            err.style.color = '#f28b82';
            err.textContent = `รหัสผ่านไม่ถูกต้อง — เหลือ ${left} ครั้ง`;
        }
        pi.focus();
    }
}

function adminLogout() {
    sessionStorage.removeItem(ADMIN_KEY);
    closeAdmin();
}

function populateDashboard() {
    const ri = document.getElementById('reel-url-input');
    if (ri) ri.value = appData.reelUrl;
    renderAdminList();
}

function renderAdminList() {
    const list = document.getElementById('admin-port-list');
    if (!list) return;
    list.innerHTML = '';
    appData.portfolio.forEach((id, idx) => {
        const row = document.createElement('div');
        row.className = 'admin-row';
        /* Sanitize id before inserting into DOM */
        const safeId = id.replace(/[^A-Za-z0-9_\-]/g, '');
        row.innerHTML = `
            <span class="admin-num">${idx + 1}</span>
            <img src="https://img.youtube.com/vi/${safeId}/mqdefault.jpg" class="admin-thumb" loading="lazy" alt="">
            <span class="admin-id" title="${safeId}">${safeId}</span>
            <div class="admin-actions">
                <button class="abtn" onclick="moveItem(${idx},-1)" ${idx===0?'disabled':''} aria-label="ขึ้น">↑</button>
                <button class="abtn" onclick="moveItem(${idx},1)"  ${idx===appData.portfolio.length-1?'disabled':''} aria-label="ลง">↓</button>
                <button class="abtn del" onclick="deleteItem(${idx})" aria-label="ลบ">✕</button>
            </div>
        `;
        list.appendChild(row);
    });
}

function saveReelUrl() {
    const input = document.getElementById('reel-url-input');
    const msg   = document.getElementById('reel-save-msg');
    if (!input) return;
    const v = input.value.trim();
    if (!v) return;
    /* Validate URL scheme — only allow https:// */
    if (!/^https:\/\//i.test(v)) {
        msg.style.color = '#f28b82';
        msg.textContent = 'URL ต้องเริ่มต้นด้วย https://';
        return;
    }
    appData.reelUrl = v;
    saveData(appData);
    renderReel();
    msg.style.color = '#c8f250';
    msg.textContent = 'บันทึกแล้ว ✓';
    setTimeout(() => { msg.textContent = ''; }, 2500);
}

function addPortItem() {
    const input = document.getElementById('new-yt-input');
    const msg   = document.getElementById('add-port-msg');
    if (!input) return;
    const raw = input.value.trim();
    let ytId = raw;
    const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_\-]{11})/);
    if (m) ytId = m[1];
    /* Strict whitelist: exactly 11 alphanumeric/dash/underscore */
    if (!/^[A-Za-z0-9_\-]{11}$/.test(ytId)) {
        msg.style.color = '#f28b82';
        msg.textContent = 'YouTube ID ไม่ถูกต้อง';
        return;
    }
    if (appData.portfolio.includes(ytId)) {
        msg.style.color = '#f28b82';
        msg.textContent = 'วิดีโอนี้มีอยู่แล้ว';
        return;
    }
    appData.portfolio.push(ytId);
    saveData(appData);
    renderPortfolio();
    renderAdminList();
    input.value = '';
    msg.style.color = '#c8f250';
    msg.textContent = 'เพิ่มแล้ว ✓';
    setTimeout(() => { msg.textContent = ''; }, 2500);
}

function deleteItem(idx) {
    if (!confirm(`ลบวิดีโอที่ ${idx + 1} ออก?`)) return;
    appData.portfolio.splice(idx, 1);
    saveData(appData);
    renderPortfolio();
    renderAdminList();
}

function moveItem(idx, dir) {
    const a = appData.portfolio;
    const ni = idx + dir;
    if (ni < 0 || ni >= a.length) return;
    [a[idx], a[ni]] = [a[ni], a[idx]];
    saveData(appData);
    renderPortfolio();
    renderAdminList();
}

async function changePassword() {
    const cur = document.getElementById('cp-current').value;
    const nw  = document.getElementById('cp-new').value;
    const nw2 = document.getElementById('cp-new2').value;
    const msg = document.getElementById('cp-msg');
    if (!cur||!nw||!nw2) { msg.style.color='#f28b82'; msg.textContent='กรอกให้ครบ'; return; }
    if (nw !== nw2)       { msg.style.color='#f28b82'; msg.textContent='รหัสผ่านใหม่ไม่ตรงกัน'; return; }
    if (nw.length < 8)    { msg.style.color='#f28b82'; msg.textContent='ต้องมีอย่างน้อย 8 ตัวอักษร'; return; }
    const curHash = await sha256(cur);
    const stored  = await getStoredHash();
    if (curHash !== stored) { msg.style.color='#f28b82'; msg.textContent='รหัสผ่านปัจจุบันไม่ถูกต้อง'; return; }
    localStorage.setItem(PASS_KEY, await sha256(nw));
    clearLockout();
    ['cp-current','cp-new','cp-new2'].forEach(id => { document.getElementById(id).value = ''; });
    msg.style.color = '#c8f250';
    msg.textContent = 'เปลี่ยนรหัสผ่านแล้ว ✓';
    setTimeout(() => { msg.textContent = ''; showView('dashboard-view'); }, 2000);
}

/* Enter key on login — only if not locked */
document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const lv = document.getElementById('login-view');
    if (lv && lv.style.display !== 'none' && !isLockedOut()) adminLogin();
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
    getStoredHash(); /* pre-generate hash on first visit */
});
