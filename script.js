// ฟังก์ชันสลับหน้าเมนูหลัก
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

// ฟังก์ชันเปิด Modal วิดีโอเมื่อคลิกที่รูป
function openModal(youtubeId) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('modal-iframe');
    
    // ใส่ลิงก์ YouTube พร้อม ?autoplay=1 เพื่อให้วิดีโอเล่นอัตโนมัติ
    iframe.src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1";
    
    // แสดง Modal แบบจัดให้อยู่กึ่งกลางหน้าจอ
    modal.style.display = 'flex';
}

// ฟังก์ชันปิด Modal วิดีโอ (เมื่อคลิกกากบาท หรือคลิกพื้นหลังสีดำ)
function closeModal(event) {
    // ปิดเมื่อไม่ได้กดโดนกล่องวิดีโอ หรือกดโดนปุ่มกากบาท
    if (!event || event.target.id === 'video-modal' || event.target.classList.contains('close-btn')) {
        const modal = document.getElementById('video-modal');
        const iframe = document.getElementById('modal-iframe');
        
        // ล้าง src ออก เพื่อให้ YouTube หยุดเล่นทันที
        iframe.src = "";
        
        // ซ่อนกล่อง Modal
        modal.style.display = 'none';
    }
}