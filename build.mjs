// Builds the site into dist/ from content/site.json.
// Vercel runs this automatically on every deploy (see vercel.json).
// You never need to edit this file to change content — use /admin instead.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";

const C = JSON.parse(readFileSync("content/site.json", "utf8"));
const OUT = "dist";

// Accent colour presets (picked in /admin → ธีม → สีหลัก)
const ACCENTS = {
    cyan:   ["#4af0d8", "#4a9fff"],
    lime:   ["#c8f250", "#7ef2e2"],
    coral:  ["#ff7b6b", "#ffb347"],
    gold:   ["#ffd460", "#ffa040"],
    violet: ["#c084fc", "#818cf8"],
    pink:   ["#f472b6", "#fb7185"],
};

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const hasThai = (s) => /[฀-๿]/.test(s || "");
const langAttr = (s) => (hasThai(s) ? ' lang="th"' : "");
// Make CMS paths ("/img/uploads/x.jpg") work whether or not they start with "/"
const asset = (p) => (!p ? "" : /^(https?:)?\/\//.test(p) ? p : "/" + String(p).replace(/^\/+/, ""));

function youtubeId(raw) {
    raw = String(raw || "").trim();
    const m = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/) || raw.match(/^([A-Za-z0-9_-]{11})$/);
    return m ? m[1] : "";
}
function reelEmbed(raw) {
    raw = String(raw || "").trim();
    const vm = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/) || raw.match(/^(\d{6,})$/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?title=0&byline=0&portrait=0&dnt=1`;
    const yt = youtubeId(raw);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt}?rel=0`;
    return "";
}

/* ---------- data ---------- */
const site = C.site || {}, reel = C.reel || {}, about = C.about || {};
const theme = C.theme || {};
const accentName = theme.accent || site.accent || "cyan";
const [accent, accent2] = ACCENTS[accentName] || ACCENTS.cyan;
// Background image: on/off, picture, and opacity 0–100 (%)
const bgOpacity = Math.min(100, Math.max(0, Number(theme.bgOpacity ?? 15) || 0)) / 100;
const bgLayer = theme.bgEnabled && theme.bgImage && bgOpacity > 0
    ? `<div class="bg-layer" aria-hidden="true" style="background-image:url('${esc(asset(theme.bgImage))}');opacity:${bgOpacity}"></div>\n`
    : "";
const name = site.name || "Portfolio";
const pageTitle = site.role ? `${name} — ${site.role}` : name;
const description = `${site.role || "Portfolio"} — ${reel.caption || ""}`.trim();
const siteUrl = (site.url || "").replace(/\/+$/, "");
const reelSrc = reelEmbed(reel.video);

const works = (C.portfolio || []).map((w) => {
    if (w.type === "image") {
        return w.image ? { kind: "image", src: asset(w.image), thumb: asset(w.image), title: w.title || "" } : null;
    }
    const id = youtubeId(w.youtube);
    return id ? { kind: "video", src: id, thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, title: w.title || "" } : null;
}).filter(Boolean);

const paragraphs = String(about.bio || "").split(/\n\s*\n|\n/).map((s) => s.trim()).filter(Boolean);

/* ---------- page ---------- */
const workItems = works.map((w, i) => `
            <li>
                <button type="button" class="work" data-kind="${w.kind}" data-src="${esc(w.src)}" data-title="${esc(w.title)}" aria-label="${esc(w.title || `Work ${i + 1}`)}">
                    <img src="${esc(w.thumb)}" alt="" loading="lazy" width="480" height="360">
                    <span class="work-shade" aria-hidden="true"></span>
                    <span class="work-play" aria-hidden="true">${w.kind === "image" ? "⤢" : "▶"}</span>
                    ${w.title ? `<span class="work-title"${langAttr(w.title)}>${esc(w.title)}</span>` : ""}
                </button>
            </li>`).join("");

const socials = (about.socials || []).filter((s) => s && s.label && s.url)
    .map((s) => `<a href="${esc(s.url)}" class="social-btn" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("\n                    ");

const skills = (about.skills || []).filter(Boolean)
    .map((s) => `<li>${esc(s)}</li>`).join("");

const html = `<!DOCTYPE html>
<html lang="en" style="--accent:${accent};--accent2:${accent2}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(pageTitle)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="theme-color" content="#06070c">
    ${siteUrl ? `<link rel="canonical" href="${esc(siteUrl)}/">` : ""}
    <meta property="og:type" content="website">
    <meta property="og:title" content="${esc(pageTitle)}">
    <meta property="og:description" content="${esc(description)}">
    ${siteUrl ? `<meta property="og:url" content="${esc(siteUrl)}/">` : ""}
    ${siteUrl && about.photo ? `<meta property="og:image" content="${esc(siteUrl + asset(about.photo))}">` : ""}
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="/img/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Sarabun:wght@400;500;600&display=swap">
    <link rel="stylesheet" href="/style.css">
    <script>
        // Pick the tab from the URL before the page paints (no flicker).
        (function(){var t=location.hash.slice(1);if(["reels","portfolio","about"].indexOf(t)>-1)document.documentElement.dataset.tab=t;})();
    </script>
</head>
<body>
${bgLayer}
<a href="#main" class="skip-link">Skip to content</a>

<header class="site-header">
    <div class="header-inner">
        ${site.logo ? `<img src="${esc(asset(site.logo))}" alt="" class="header-logo" width="120" height="95">` : "<span></span>"}
        <div class="header-text">
            <h1 class="site-title">${esc(name)}</h1>
            ${site.role ? `<p class="site-sub">${esc(site.role)}</p>` : ""}
        </div>
        ${site.deco ? `<img src="${esc(asset(site.deco))}" alt="" class="header-deco" width="120" height="104">` : "<span></span>"}
    </div>
</header>

<nav class="tab-nav" aria-label="Sections">
    <div class="tab-track">
        <a href="#reels" class="tab" data-tab="reels">Reels</a>
        <a href="#portfolio" class="tab" data-tab="portfolio">Portfolio</a>
        <a href="#about" class="tab" data-tab="about">About</a>
        ${about.resume ? `<a href="${esc(asset(about.resume))}" class="tab tab-ext js-resume" target="_blank" rel="noopener">Resume <span aria-hidden="true">↗</span></a>` : ""}
    </div>
</nav>

<main id="main" class="shell">

    <section id="reels" class="page" aria-labelledby="reels-title">
        <div class="section-head">
            ${reel.label ? `<span class="label-tag">${esc(reel.label)}</span>` : ""}
            <h2 id="reels-title">${esc(reel.title || "Showreel")}</h2>
        </div>
        <div class="reel-frame">
            ${reelSrc ? `<iframe src="${esc(reelSrc)}" title="${esc(reel.title || "Showreel")}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>` : ""}
        </div>
        ${reel.caption ? `<p class="reel-caption">${esc(reel.caption)}</p>` : ""}
    </section>

    <section id="portfolio" class="page" aria-labelledby="portfolio-title">
        <div class="section-head">
            <span class="label-tag">Works</span>
            <h2 id="portfolio-title">Portfolio</h2>
        </div>
        <ul class="works-grid">${workItems}
        </ul>
        <p class="works-count">${works.length} works</p>
    </section>

    <section id="about" class="page" aria-labelledby="about-title">
        <div class="about-wrap">
            <div class="about-left">
                ${about.photo ? `<div class="profile-ring"><img src="${esc(asset(about.photo))}" alt="${esc(name)}" class="profile-img" width="800" height="800" loading="lazy"></div>` : ""}
                <div class="contact-block">
                    ${about.email ? `<a href="mailto:${esc(about.email)}" class="contact-link">${esc(about.email)}</a>` : ""}
                    ${socials ? `<div class="social-row">
                    ${socials}
                    </div>` : ""}
                </div>
            </div>
            <div class="about-right">
                <span class="label-tag">About me</span>
                <h2 id="about-title" class="about-name"${langAttr(about.nameTH || name)}>${esc(about.nameTH || name)}</h2>
                <div class="about-bio">
                    ${paragraphs.map((p) => `<p${langAttr(p)}>${esc(p)}</p>`).join("\n                    ")}
                </div>
                ${skills ? `<ul class="skills-list" aria-label="Skills">${skills}</ul>` : ""}
                ${about.resume ? `<a href="${esc(asset(about.resume))}" class="resume-cta js-resume" target="_blank" rel="noopener">View resume <span aria-hidden="true">↗</span></a>` : ""}
            </div>
        </div>
    </section>

</main>

<footer class="site-footer">
    <p>© ${new Date().getFullYear()} ${esc(name)}</p>
</footer>

<dialog class="viewer" id="viewer" aria-labelledby="viewer-title">
    <div class="viewer-bar">
        <p id="viewer-title" class="viewer-title"></p>
        <span class="viewer-count" id="viewer-count"></span>
        <button type="button" class="icon-btn" data-close aria-label="Close">✕</button>
    </div>
    <div class="viewer-stage">
        <button type="button" class="icon-btn viewer-nav" data-step="-1" aria-label="Previous">‹</button>
        <div class="viewer-media" id="viewer-media"></div>
        <button type="button" class="icon-btn viewer-nav" data-step="1" aria-label="Next">›</button>
    </div>
</dialog>

${about.resume ? `<dialog class="viewer viewer-pdf" id="resume" aria-label="Resume">
    <div class="viewer-bar">
        <p class="viewer-title">Resume</p>
        <a href="${esc(asset(about.resume))}" download class="pdf-dl">Download</a>
        <button type="button" class="icon-btn" data-close aria-label="Close">✕</button>
    </div>
    <iframe class="pdf-frame" title="Resume"></iframe>
</dialog>` : ""}

<script src="/script.js" defer></script>
</body>
</html>
`;

/* ---------- write dist/ ---------- */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/index.html`, html);
for (const p of ["style.css", "script.js", "img", "admin", "resume.pdf", "uploads"]) {
    if (existsSync(p)) cpSync(p, `${OUT}/${p}`, { recursive: true });
}
console.log(`Built ${OUT}/index.html — ${works.length} works, accent: ${accentName}, background: ${bgLayer ? Math.round(bgOpacity * 100) + "%" : "off"}`);
