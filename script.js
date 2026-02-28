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

    if(pageId === 'portfolio') {
        closeProject();
    }

    const whiteBox = document.querySelector('.white-box');
    if (whiteBox) {
        const yOffset = -20; 
        const y = whiteBox.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}

// อัปเดตฟังก์ชันรับพารามิเตอร์ 5 ตัว: ชื่อ, ตำแหน่ง, คำอธิบาย, ลิงก์รูปแบนเนอร์, รหัสยูทูป
function openProject(title, subtitle, description, bannerImg, youtubeId) {
    document.getElementById('portfolio-grid-view').style.display = 'none';
    
    // ใส่ข้อมูลข้อความ
    document.getElementById('detail-title').innerText = title;
    document.getElementById('detail-subtitle').innerText = subtitle;
    document.getElementById('detail-desc').innerText = description;
    
    // จัดการรูปภาพแบนเนอร์ฝั่งขวา
    const bannerElement = document.getElementById('detail-banner');
    if (bannerImg && bannerImg !== '') {
        bannerElement.src = bannerImg;
        bannerElement.style.display = 'inline-block';
    } else {
        // ถ้าผลงานไหนไม่มีรูปโลโก้ ให้ซ่อนไว้ ข้อความฝั่งซ้ายจะขยายเต็มอัตโนมัติ
        bannerElement.style.display = 'none';
    }
    
    document.getElementById('detail-iframe').src = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1";
    
    document.getElementById('portfolio-detail-view').style.display = 'block';

    const whiteBox = document.querySelector('.white-box');
    if (whiteBox) {
        const y = whiteBox.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}

function closeProject() {
    document.getElementById('detail-iframe').src = "";
    document.getElementById('portfolio-detail-view').style.display = 'none';
    document.getElementById('portfolio-grid-view').style.display = 'block';
}