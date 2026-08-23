window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Отслеживание кликов по кнопкам WhatsApp
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const masterName = btn.getAttribute('data-target') || 'General';
            
            window.dataLayer.push({
                event: 'contact_whatsapp',
                lead_type: 'WhatsApp Click',
                target_master: masterName
            });
            console.log(`[DataLayer] Lead Event: WhatsApp (${masterName})`);
        });
    });

    // 2. Отслеживание кликов по звонкам (tel:)
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
});
// Функция переключения фото в карточке мастера
window.changeSlide = function(dotElement, slideIndex) {
    const card = dotElement.closest('.team-card');
    const images = card.querySelectorAll('.slide-img');
    const dots = card.querySelectorAll('.dot');

    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (images[slideIndex]) {
        images[slideIndex].classList.add('active');
    }
    dotElement.classList.add('active');
};