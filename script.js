window.dataLayer = window.dataLayer || [];

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

    // 2. Аналитика: отслеживание звонков
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

    // 3. Логика переключения слайдера (Свайпы + Клики)
    initCardSliders();
});

// Универсальная функция смены слайда
function switchCardImage(card, newIndex) {
    const images = card.querySelectorAll('.slide-img');
    const dots = card.querySelectorAll('.dot');
    const total = images.length;

    if (total <= 1) return;

    // Зацикливание (с последнего на первый и наоборот)
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

// Клик по точкам
window.changeSlide = function(dotElement, slideIndex) {
    const card = dotElement.closest('.team-card');
    switchCardImage(card, slideIndex);
};

// Инициализация свайпов для телефонов и кликов для ПК
function initCardSliders() {
    const cards = document.querySelectorAll('.team-card');

    cards.forEach(card => {
        const wrapper = card.querySelector('.team-image-wrapper');
        if (!wrapper) return;

        let startX = 0;
        let endX = 0;

        // Тач-события для мобилок (Свайп)
        wrapper.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe(card, startX, endX);
        }, { passive: true });

        // Клик мышкой на ПК (левая половина — назад, правая — вперед)
        wrapper.addEventListener('click', (e) => {
            // Игнорируем клик, если нажали точно на панель с точками
            if (e.target.closest('.slider-dots')) return;

            const rect = wrapper.getBoundingClientRect();
            const clickPositionX = e.clientX - rect.left;
            let current = parseInt(card.getAttribute('data-current') || '0', 10);

            if (clickPositionX > rect.width / 2) {
                switchCardImage(card, current + 1); // Вперед
            } else {
                switchCardImage(card, current - 1); // Назад
            }
        });
    });
}

function handleSwipe(card, startX, endX) {
    const threshold = 35; // Минимальная длина свайпа в пикселях
    let current = parseInt(card.getAttribute('data-current') || '0', 10);

    if (startX - endX > threshold) {
        // Свайп влево -> следующее фото
        switchCardImage(card, current + 1);
    } else if (endX - startX > threshold) {
        // Свайп вправо -> предыдущее фото
        switchCardImage(card, current - 1);
    }
}