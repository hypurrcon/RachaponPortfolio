/* =============================================
   RACHAPON THATPRASERT — Portfolio Script
   ============================================= */

// ---------- Year in footer ----------
(function () {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
})();

// ---------- Page switcher ----------
function switchPage(pageId, clickedElement) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
    });

    // Show target
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        target.hidden = false;
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    if (clickedElement) {
        clickedElement.classList.add('active');
        clickedElement.setAttribute('aria-selected', 'true');
    }

    // Smooth scroll to top of layout
    const shell = document.querySelector('.layout-shell');
    if (shell) {
        const y = shell.getBoundingClientRect().top + window.pageYOffset - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

// ---------- Modal ----------
function openModal(youtubeId, title) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    const label  = document.getElementById('modal-title');

    if (!modal || !iframe) return;

    iframe.src = 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1&rel=0';
    if (label) label.textContent = title || 'Now Playing';

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus the close button for keyboard users
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    const modal  = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');

    if (!modal) return;

    iframe.src = '';
    modal.hidden = true;
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('video-modal');
        if (modal && !modal.hidden) closeModal();
    }
});

// ---------- Keyboard nav on portfolio items ----------
document.addEventListener('DOMContentLoaded', function () {
    // Ensure only first page is shown
    document.querySelectorAll('.page').forEach((p, i) => {
        if (i === 0) {
            p.classList.add('active');
            p.hidden = false;
        } else {
            p.hidden = true;
        }
    });
});
