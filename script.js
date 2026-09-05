window.dataLayer = window.dataLayer || [];

// База данных мастеров с двуязычным описанием
const mastersData = {
    eliza: {
        name: "Eliza",
        age: "24",
        height: "160 cm",
        weight: "49 kg",
        breast: "3",
        langs: "PL, EN, RU, UA",
        desc_pl: "Masaż relaksacyjny, tantryczny oraz rytuały body-to-body w pełnej dyskrecji.",
        desc_en: "Relaxation massage, tantric sessions, and body-to-body rituals with complete discretion.",
        photos: [
            "/img/girl1_1.jpg",
            "/img/girl1_2.jpg",
            "/img/girl1_3.jpg",
            "/img/girl1_4.jpg",
            "/img/girl1_5.jpg"
        ]
    },
    lucja: {
        name: "Łucja",
        age: "24",
        height: "165 cm",
        weight: "49 kg",
        breast: "3",
        langs: "PL, EN, DE",
        desc_pl: "Masaż relaksacyjny, tantryczny oraz rytuały body-to-body w pełnej dyskrecji.",
        desc_en: "Relaxation massage, tantric sessions, and body-to-body rituals with complete discretion.",
        photos: [
            "/img/girl2_1.jpg",
            "/img/girl2_2.jpg",
            "/img/girl2_3.jpg"
        ]
    },
    alina: {
        name: "Alina",
        age: "26",
        height: "170 cm",
        weight: "49 kg",
        breast: "2",
        langs: "PL, EN, RU, UA",
        desc_pl: "Masaż tantryczny, relaksacyjny oraz zmysłowe rytuały w atmosferze pełnego spokoju i dyskrecji.",
        desc_en: "Tantric massage, relaxation, and sensual rituals in an atmosphere of tranquility and absolute discretion.",
        photos: [
            "/img/girl3_1.jpg",
            "/img/girl3_2.jpg",
            "/img/girl3_3.jpg",
            "/img/girl3_4.jpg"
        ]
    },
    dagmara: {
        name: "Dagmara",
        age: "20",
        height: "167 cm",
        weight: "66 kg",
        breast: "4",
        langs: "PL, EN",
        desc_pl: "Masaż relaksacyjny, tantryczny oraz rytuały body-to-body w pełnej dyskrecji.",
        desc_en: "Relaxation massage, tantric sessions, and body-to-body rituals with complete discretion.",
        photos: [
            "/img/girl4_1.jpg",
            "/img/girl4_2.jpg",
            "/img/girl4_3.jpg",
            "/img/girl4_4.jpg"
        ]
    }
};

let activeMasterKey = null;
let currentPhotoIdx = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Перехват кликов для GTM / DataLayer
    document.addEventListener('click', (e) => {
        const waLink = e.target.closest('a[href*="wa.me"]');
        if (waLink) {
            const master = waLink.getAttribute('data-target') || (activeMasterKey ? mastersData[activeMasterKey].name : 'General');
            window.dataLayer.push({
                event: 'contact_whatsapp',
                target_master: master
            });
            console.log(`[DataLayer] Lead: WhatsApp -> ${master}`);
        }

        const telLink = e.target.closest('a[href^="tel:"]');
        if (telLink) {
            window.dataLayer.push({
                event: 'contact_call'
            });
            console.log('[DataLayer] Lead: Call Click');
        }
    });

    initModalSwipes();
});

// Открытие модалки профиля
window.openMasterModal = function(masterKey) {
    const master = mastersData[masterKey];
    if (!master) return;

    activeMasterKey = masterKey;
    currentPhotoIdx = 0;

    const isEnglish = document.documentElement.lang === 'en';

    document.getElementById('modalMasterName').textContent = master.name;
    document.getElementById('modalMasterLangs').textContent = `🗣 ${master.langs}`;
    document.getElementById('modalParamAge').textContent = master.age;
    document.getElementById('modalParamHeight').textContent = master.height;
    document.getElementById('modalParamWeight').textContent = master.weight;
    document.getElementById('modalParamBreast').textContent = master.breast;
    
    // Выбор описания по текущему языку страницы
    document.getElementById('modalMasterDesc').textContent = isEnglish ? master.desc_en : master.desc_pl;

    // Ссылка брони WhatsApp
    const phone = "48502855086";
    const waText = isEnglish 
        ? `Hello, I would like to book a session with ${master.name}`
        : `Dzień dobry, chciałbym umówić wizytę do ${master.name}`;
    
    const bookBtn = document.getElementById('modalBookingBtn');
    bookBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(waText)}`;
    bookBtn.setAttribute('data-target', master.name);

    updateModalPhoto();
    document.getElementById('masterModal').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeMasterModal = function() {
    document.getElementById('masterModal').classList.remove('active');
    document.body.style.overflow = '';
};

function updateModalPhoto() {
    const master = mastersData[activeMasterKey];
    if (!master) return;

    const img = document.getElementById('modalProfileImg');
    const counter = document.getElementById('modalPhotoCounter');

    img.src = master.photos[currentPhotoIdx];
    counter.textContent = `${currentPhotoIdx + 1} / ${master.photos.length}`;
}

window.nextModalPhoto = function() {
    const master = mastersData[activeMasterKey];
    if (!master) return;
    currentPhotoIdx = (currentPhotoIdx + 1) % master.photos.length;
    updateModalPhoto();
};

window.prevModalPhoto = function() {
    const master = mastersData[activeMasterKey];
    if (!master) return;
    currentPhotoIdx = (currentPhotoIdx - 1 + master.photos.length) % master.photos.length;
    updateModalPhoto();
};

function initModalSwipes() {
    const box = document.querySelector('.modal-slider-box');
    if (!box) return;

    let startX = 0;

    box.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    box.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) window.nextModalPhoto();
            else window.prevModalPhoto();
        }
    }, { passive: true });
}