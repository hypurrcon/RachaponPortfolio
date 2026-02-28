function switchPage(pageId, clickedElement) {
    const allPages = document.querySelectorAll('.page-section');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    const allNavBtns = document.querySelectorAll('.nav-btn');
    allNavBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    if (clickedElement) {
        clickedElement.classList.add('active');
    }

    const whiteBox = document.querySelector('.white-box');
    if (whiteBox) {
        const yOffset = -20; 
        const y = whiteBox.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}

function openModal(youtubeId) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    
    iframe.src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1";
    
    modal.style.display = 'flex';
}

function closeModal(event) {
    if (!event || event.target.id === 'video-modal' || event.target.classList.contains('close-btn')) {
        const modal = document.getElementById('video-modal');
        const iframe = document.getElementById('modal-iframe');
        
        iframe.src = "";
        
        modal.style.display = 'none';
    }
}