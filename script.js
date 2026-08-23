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