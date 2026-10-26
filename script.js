// Rachapon Thatprasert — portfolio
// Page content is built from content/site.json (edit it at /admin).
// This file only handles tabs, the lightbox and the resume viewer.

(function () {
    "use strict";
    var root = document.documentElement;

    // Remove data saved by the old admin panel so returning visitors never see an outdated copy.
    try { ["pf_data_v4", "pf_theme", "pf_bg"].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}

    /* ---------- Tabs ---------- */
    var TABS = ["reels", "portfolio", "about"];
    var reelFrame = document.querySelector(".reel-frame iframe");
    var reelSrc = reelFrame ? reelFrame.src : "";

    function showTab(t) {
        if (TABS.indexOf(t) < 0) t = "reels";
        root.dataset.tab = t;
        document.querySelectorAll(".tab[data-tab]").forEach(function (a) {
            if (a.dataset.tab === t) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
        });
        // Leaving Reels stops the showreel; coming back reloads it.
        if (reelFrame) {
            if (t === "reels" && !reelFrame.getAttribute("src")) reelFrame.src = reelSrc;
            if (t !== "reels" && reelFrame.getAttribute("src")) reelFrame.removeAttribute("src");
        }
    }
    document.querySelectorAll(".tab[data-tab]").forEach(function (a) {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            var t = a.dataset.tab;
            if (root.dataset.tab !== t) history.pushState(null, "", "#" + t);
            showTab(t);
            var nav = document.querySelector(".tab-nav");
            if (nav && nav.getBoundingClientRect().top <= 12) {
                window.scrollTo({ top: nav.offsetTop - 12 + 1, behavior: "smooth" });
            }
        });
    });
    window.addEventListener("popstate", function () { showTab(location.hash.slice(1)); });
    showTab(location.hash.slice(1));

    /* ---------- Lightbox ---------- */
    var works = Array.prototype.slice.call(document.querySelectorAll(".work"));
    var viewer = document.getElementById("viewer");
    var media = document.getElementById("viewer-media");
    var vTitle = document.getElementById("viewer-title");
    var vCount = document.getElementById("viewer-count");
    var prev = viewer.querySelector('[data-step="-1"]');
    var next = viewer.querySelector('[data-step="1"]');
    var current = 0, opener = null;

    function render(i) {
        current = i;
        var w = works[i], kind = w.dataset.kind, src = w.dataset.src, title = w.dataset.title || "";
        vTitle.textContent = title;
        if (/[฀-๿]/.test(title)) vTitle.setAttribute("lang", "th"); else vTitle.removeAttribute("lang");
        vCount.textContent = (i + 1) + " / " + works.length;
        prev.disabled = i === 0;
        next.disabled = i === works.length - 1;
        media.textContent = "";
        var el;
        if (kind === "image") {
            el = document.createElement("img");
            el.src = src; el.alt = title;
        } else {
            el = document.createElement("iframe");
            el.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(src) + "?autoplay=1&rel=0";
            el.title = title || "Video";
            el.allow = "autoplay; fullscreen; picture-in-picture";
            el.allowFullscreen = true;
        }
        media.appendChild(el);
    }
    function step(d) { var n = current + d; if (n >= 0 && n < works.length) render(n); }

    works.forEach(function (w, i) {
        w.addEventListener("click", function () {
            opener = w; render(i);
            viewer.showModal(); document.body.style.overflow = "hidden";
        });
    });
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    viewer.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
    });
    viewer.addEventListener("close", function () {
        media.textContent = ""; // stops playback
        document.body.style.overflow = "";
        if (opener) opener.focus();
    });

    /* ---------- Resume ---------- */
    // Phones can't show a PDF inside a page well, so there the link just opens the PDF.
    var resume = document.getElementById("resume");
    if (resume) {
        var frame = resume.querySelector(".pdf-frame");
        var canEmbed = window.matchMedia("(min-width: 900px) and (hover: hover)").matches;
        document.querySelectorAll(".js-resume").forEach(function (a) {
            a.addEventListener("click", function (e) {
                if (!canEmbed) return;
                e.preventDefault();
                frame.src = a.getAttribute("href");
                resume.showModal(); document.body.style.overflow = "hidden";
            });
        });
        resume.addEventListener("close", function () {
            frame.removeAttribute("src"); document.body.style.overflow = "";
        });
    }

    /* ---------- Shared dialog behaviour ---------- */
    [viewer, resume].forEach(function (d) {
        if (!d) return;
        d.querySelector("[data-close]").addEventListener("click", function () { d.close(); });
        d.addEventListener("click", function (e) { if (e.target === d) d.close(); }); // backdrop click
    });
})();
