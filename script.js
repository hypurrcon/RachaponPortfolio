// Rachapon Thatprasert — portfolio
// All content lives in index.html. This file only adds the video viewer and resume viewer.

(function () {
    "use strict";

    // Clean up data saved by the old admin panel, so returning visitors
    // never see an outdated copy of the site.
    try { ["pf_data_v4", "pf_theme", "pf_bg"].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Works grid ---------- */
    var items = Array.prototype.slice.call(document.querySelectorAll(".works-grid li[data-id]"));
    var works = items.map(function (li, i) {
        var id = li.getAttribute("data-id").replace(/[^A-Za-z0-9_-]/g, "");
        var title = li.textContent.trim();
        var lang = li.getAttribute("lang");

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "work";
        btn.innerHTML =
            '<span class="work-thumb">' +
                '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">' +
                '<span class="work-play" aria-hidden="true">▶</span>' +
            "</span>" +
            '<span class="work-title"></span>';
        var t = btn.querySelector(".work-title");
        t.textContent = title;
        if (lang) t.setAttribute("lang", lang);
        btn.addEventListener("click", function () { openVideo(i, btn); });

        li.textContent = "";
        li.removeAttribute("lang");
        li.appendChild(btn);
        return { id: id, title: title, lang: lang };
    });

    /* ---------- Video viewer ---------- */
    var viewer = document.getElementById("viewer");
    var stage = document.getElementById("viewer-video");
    var vTitle = document.getElementById("viewer-title");
    var vCount = document.getElementById("viewer-count");
    var prevBtn = viewer.querySelector('[data-step="-1"]');
    var nextBtn = viewer.querySelector('[data-step="1"]');
    var current = 0, opener = null;

    function showVideo(i) {
        current = i;
        var w = works[i];
        vTitle.textContent = w.title;
        if (w.lang) vTitle.setAttribute("lang", w.lang); else vTitle.removeAttribute("lang");
        vCount.textContent = (i + 1) + " / " + works.length;
        prevBtn.disabled = i === 0;
        nextBtn.disabled = i === works.length - 1;
        stage.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + w.id +
            '?autoplay=1&rel=0" title="" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
        stage.firstChild.title = w.title;
    }
    function openVideo(i, fromEl) {
        opener = fromEl;
        showVideo(i);
        viewer.showModal();
        document.body.style.overflow = "hidden";
    }
    function step(d) {
        var n = current + d;
        if (n >= 0 && n < works.length) showVideo(n);
    }

    prevBtn.addEventListener("click", function () { step(-1); });
    nextBtn.addEventListener("click", function () { step(1); });
    viewer.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
    });
    viewer.addEventListener("close", function () {
        stage.innerHTML = ""; // stops playback
        document.body.style.overflow = "";
        if (opener) opener.focus();
    });

    /* ---------- Resume viewer ---------- */
    // Phones and tablets can't show a PDF inside a page well, so they just follow the link.
    var resume = document.getElementById("resume");
    var pdfFrame = resume.querySelector(".pdf-frame");
    var canEmbedPdf = window.matchMedia("(min-width: 900px) and (hover: hover)").matches;

    document.querySelectorAll(".js-resume").forEach(function (link) {
        link.addEventListener("click", function (e) {
            if (!canEmbedPdf) return;
            e.preventDefault();
            pdfFrame.src = link.getAttribute("href");
            resume.showModal();
            document.body.style.overflow = "hidden";
        });
    });
    resume.addEventListener("close", function () {
        pdfFrame.removeAttribute("src");
        document.body.style.overflow = "";
    });

    /* ---------- Shared dialog behaviour ---------- */
    [viewer, resume].forEach(function (d) {
        d.querySelector("[data-close]").addEventListener("click", function () { d.close(); });
        // Click on the dark backdrop closes the dialog.
        d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    });
})();
