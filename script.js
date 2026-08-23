window.dataLayer = window.dataLayer || [];

let currentModalImages = [];
let currentModalIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Аналитика: отслеживание кликов по кнопкам WhatsApp
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const masterName = btn.getAttribute('data-target') || 'General';
            window.dataLayer.push({
                event: 'contact_whatsapp',
                lead_type: 'WhatsApp Click',
                target_master: masterName
            });
            console.log(`[DataLayer] Lead Event: WhatsApp (${masterName})`);
        });
    });

    // 2. Аналитика: звонки
    const callButtons = document.querySelectorAll('a[href^="tel:"]');
    callButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.dataLayer.push({
                event: 'contact_call',
                lead_type: 'Direct Call'
            });
            console.log('[DataLayer] Lead Event: Direct Call');
        });
    });

    // 3. Инициализация слайдеров и полноэкранного просмотра
    initCardSliders();
    initLightbox();
});

function switchCardImage(card, newIndex) {
    const images = card.querySelectorAll('.slide-img');
    const dots = card.querySelectorAll('.dot');
    const total = images.length;

    if (total <= 1) return;

    if (newIndex >= total) newIndex = 0;
    if (newIndex < 0) newIndex = total - 1;

    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    images[newIndex].classList.add('active');
    if (dots[newIndex]) {
        dots[newIndex].classList.add('active');
    }
    card.setAttribute('data-current', newIndex);
}

window.changeSlide = function(dotElement, slideIndex) {
    const card = dotElement.closest('.team-card');
    switchCardImage(card, slideIndex);
};

function initCardSliders() {
    const cards = document.querySelectorAll('.team-card');

    cards.forEach(card => {
        const wrapper = card.querySelector('.team-image-wrapper');
        if (!wrapper) return;

        let startX = 0;
        let startY = 0;
        let isTouchMoved = false;

        wrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isTouchMoved = false;
        }, { passive: true });

        wrapper.addEventListener('touchmove', (e) => {
            const diffX = Math.abs(e.touches[0].clientX - startX);
            const diffY = Math.abs(e.touches[0].clientY - startY);
            if (diffX > 10 || diffY > 10) {
                isTouchMoved = true;
            }
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const threshold = 35;
            let current = parseInt(card.getAttribute('data-current') || '0', 10);

            if (Math.abs(diffX) > threshold) {
                // Это был свайп
                if (diffX > 0) {
                    switchCardImage(card, current + 1);
                } else {
                    switchCardImage(card, current - 1);
                }
            } else if (!isTouchMoved) {
                // Это был короткий тап -> открываем полноэкранный режим
                if (!e.target.closest('.slider-dots')) {
                    openModalForCard(card);
                }
            }
        }, { passive: true });

        // Клик мыши на ПК
        wrapper.addEventListener('click', (e) => {
            if (e.target.closest('.slider-dots')) return;
            openModalForCard(card);
        });
    });
}

// Полноэкранный Lightbox
function openModalForCard(card) {
    const imgs = card.querySelectorAll('.slide-img');
    currentModalImages = Array.from(imgs).map(img => img.src);
    currentModalIndex = parseInt(card.getAttribute('data-current') || '0', 10);
    
    updateModalView();
    document.getElementById('imageModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateModalView() {
    const modalImg = document.getElementById('modalImg');
    const curSpan = document.getElementById('modalCurrentIndex');
    const totalSpan = document.getElementById('modalTotalCount');

    modalImg.src = currentModalImages[currentModalIndex];
    curSpan.textContent = currentModalIndex + 1;
    totalSpan.textContent = currentModalImages.length;
}

function initLightbox() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-content-wrapper')) {
            closeModal();
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
        updateModalView();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
        updateModalView();
    });

    // Свайпы внутри полноэкранного режима
    let mStartX = 0;
    modal.addEventListener('touchstart', (e) => {
        mStartX = e.touches[0].clientX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        const mEndX = e.changedTouches[0].clientX;
        const diff = mStartX - mEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
            } else {
                currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
            }
            updateModalView();
        }
    }, { passive: true });
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('active');
    document.body.style.overflow = '';
}