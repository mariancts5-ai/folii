/* Constanta Folii Auto — Content Editor (admin only) */

(function () {

    // ── Default content (matches current HTML) ────────────────────────
    const DEFAULTS = {
        companyName: 'CONSTANTA FOLII',
        companyAccent: 'AUTO',

        heroTag: 'Montaj auto \u2022 Constan\u021ba',
        heroTitle: 'Parbrize & folii auto',
        heroTitleEm: 'montaj profesional',
        heroDesc: 'Montez parbrize \u0219i aplic folii auto de peste 20 de ani. Materiale certificate, garan\u021bie inclus\u0103, programare rapid\u0103.',
        phone: '0721 289 892',
        phoneSchedule: 'L-V: 08-18 \u2022 S: 09-14',
        address: 'Bulevardul Tomis 358',
        addressSub: 'Constan\u021ba',
        btnCallText: 'Sun\u0103 acum',
        btnWaText: 'WhatsApp',

        galleryVisible: true,
        galleryLabel: 'Portofoliu',
        galleryTitle: 'Lucr\u0103ri recente',
        galleryCaptions: ['Lucrare 1','Lucrare 2','Lucrare 3','Lucrare 4','Lucrare 5','Lucrare 6','Lucrare 7','Lucrare 8','Videoclip'],

        servicesVisible: true,
        servicesLabel: 'Servicii',
        servicesTitle: 'Ce fac',
        servicesSub: 'Lucrez cu 3M, SunTek, XPEL \u0219i Saint-Gobain.',
        services: [
            { icon: 'fas fa-shield-halved', name: 'Montare parbriz', desc: 'Parbrize originale sau aftermarket, orice marc\u0103. Adezivi premium, montaj \u00een 60-90 min.', price: 'de la 350 RON \u2022 garan\u021bie 2 ani' },
            { icon: 'fas fa-car-side', name: 'Folii auto fumurii', desc: 'Folii ceramice \u0219i carbon pentru geamuri laterale \u0219i lunet\u0103. Protec\u021bie UV 99%.', price: 'de la 450 RON \u2022 garan\u021bie 5 ani' },
            { icon: 'fas fa-layer-group', name: 'Folii PPF', desc: 'Folie transparent\u0103 de protec\u021bie vopsea. Previne zg\u00e2rieturile \u0219i impactul pietri\u0219ului.', price: 'de la 800 RON \u2022 garan\u021bie 7 ani' },
            { icon: 'fas fa-sun', name: 'Folii parbriz atermice', desc: 'Blocheaz\u0103 c\u0103ldura infra\u0219u cu vizibilitate perfect\u0103. Omologate RAR.', price: 'de la 500 RON \u2022 garan\u021bie 5 ani' },
        ],

        brandsVisible: true,
        brands: ['3M', 'SunTek', 'XPEL', 'Saint-Gobain', 'Llumar', 'Pilkington'],

        mapVisible: true,
        mapBadgeText: 'CONSTANTA',
        mapBadgeSchedule: 'L-V: 08-18 \u2022 S: 09-14',

        footerDesc: 'Montaj parbrize \u0219i folii auto \u00een Constan\u021ba. Experien\u021b\u0103, garan\u021bie, materiale premium.',
        footerEmail: 'contact@constanta-folii.ro',
        scheduleWeekday: 'Luni - Vineri: 08:00 - 18:00',
        scheduleSat: 'S\u00e2mb\u0103t\u0103: 09:00 - 14:00',
        scheduleSun: 'Duminic\u0103: \u00eenchis',
        copyright: '\u00a9 2026 Constanta Folii Auto',
        footerAddress: 'Bulevardul Tomis 358, 900001 Constan\u021ba',
    };

    const SERVICE_ICONS = [
        { value: 'fas fa-shield-halved', label: '\u{1f6e1} Scut' },
        { value: 'fas fa-car-side', label: '\u{1f697} Ma\u0219in\u0103' },
        { value: 'fas fa-layer-group', label: '\u{1f4da} Straturi' },
        { value: 'fas fa-sun', label: '\u2600 Soare' },
        { value: 'fas fa-car', label: '\u{1f698} Auto' },
        { value: 'fas fa-wrench', label: '\u{1f527} Cheie' },
        { value: 'fas fa-eye', label: '\u{1f441} Ochi' },
        { value: 'fas fa-droplet', label: '\u{1f4a7} Pic\u0103tur\u0103' },
        { value: 'fas fa-brush', label: '\u{1f58c} Pensul\u0103' },
        { value: 'fas fa-window-maximize', label: '\u{1fa9f} Fereastr\u0103' },
        { value: 'fas fa-temperature-low', label: '\u{1f321} Temperatur\u0103' },
        { value: 'fas fa-spray-can', label: '\u{1f4a8} Spray' },
    ];

    let content = JSON.parse(JSON.stringify(DEFAULTS));

    // ── Apply content to DOM ──────────────────────────────────────────
    function applyContent(c) {
        // Company name (nav + footer logos)
        document.querySelectorAll('.logo').forEach(el => {
            el.innerHTML = c.companyName + ' <span>' + c.companyAccent + '</span>';
        });

        // Hero
        const heroTag = document.querySelector('.hero-tag');
        if (heroTag) heroTag.textContent = c.heroTag;

        const heroH1 = document.querySelector('.hero-left h1');
        if (heroH1) heroH1.innerHTML = c.heroTitle + '<br><em>' + c.heroTitleEm + '</em>';

        const heroDesc = document.querySelector('.hero-desc');
        if (heroDesc) heroDesc.textContent = c.heroDesc;

        // Phone & address
        const contacts = document.querySelectorAll('.hero-contact');
        if (contacts[0]) {
            contacts[0].querySelector('strong').textContent = c.phone;
            contacts[0].querySelector('.sub').textContent = c.phoneSchedule;
        }
        if (contacts[1]) {
            contacts[1].querySelector('strong').textContent = c.address;
            contacts[1].querySelector('.sub').textContent = c.addressSub;
        }

        // CTA buttons text
        const btnCall = document.querySelector('.btn-call');
        if (btnCall) btnCall.innerHTML = '<i class="fas fa-phone"></i> ' + c.btnCallText;
        const btnWa = document.querySelector('#hero-cta .btn-wa');
        if (btnWa) btnWa.innerHTML = '<i class="fab fa-whatsapp"></i> ' + c.btnWaText;

        // Update phone links
        var phoneClean = c.phone.replace(/[\s\-]/g, '');
        var phoneIntl = '+40' + phoneClean.replace(/^0/, '');
        var waNum = '40' + phoneClean.replace(/^0/, '');
        document.querySelectorAll('a[href^="tel:"]').forEach(function(a) { a.href = 'tel:' + phoneIntl; });
        document.querySelectorAll('a[href*="wa.me"]').forEach(function(a) { a.href = 'https://wa.me/' + waNum; });

        // Gallery
        var galerie = document.getElementById('galerie');
        if (galerie) {
            galerie.style.display = c.galleryVisible ? '' : 'none';
            var gLabel = galerie.querySelector('.section-label');
            var gTitle = galerie.querySelector('.section-title');
            if (gLabel) gLabel.textContent = c.galleryLabel;
            if (gTitle) gTitle.textContent = c.galleryTitle;
            // Captions
            if (c.galleryCaptions) {
                var items = galerie.querySelectorAll('.gallery-item');
                items.forEach(function(item, i) {
                    var cap = item.querySelector('.gallery-cap span');
                    if (cap && c.galleryCaptions[i] !== undefined) cap.textContent = c.galleryCaptions[i];
                });
            }
        }

        // Services
        var servicii = document.getElementById('servicii');
        if (servicii) {
            servicii.style.display = c.servicesVisible ? '' : 'none';
            var sLabel = servicii.querySelector('.section-label');
            var sTitle = servicii.querySelector('.section-title');
            var sSub = servicii.querySelector('.section-sub');
            if (sLabel) sLabel.textContent = c.servicesLabel;
            if (sTitle) sTitle.textContent = c.servicesTitle;
            if (sSub) sSub.textContent = c.servicesSub;
            // Rebuild services
            var list = servicii.querySelector('.services-list');
            if (list && c.services) {
                list.innerHTML = c.services.map(function(s) {
                    return '<div class="svc reveal visible">' +
                        '<div class="svc-icon"><i class="' + s.icon + '"></i></div>' +
                        '<div><h3>' + s.name + '</h3>' +
                        '<p>' + s.desc + '</p>' +
                        '<div class="price">' + s.price + '</div></div></div>';
                }).join('');
            }
        }

        // Brands
        var brands = document.querySelector('.brands');
        if (brands) {
            brands.style.display = c.brandsVisible ? '' : 'none';
            var inner = brands.querySelector('.brands-inner');
            if (inner && c.brands) {
                inner.innerHTML = c.brands.map(function(b) { return '<span>' + b + '</span>'; }).join('');
            }
        }

        // Map
        var mapRight = document.querySelector('.hero-right');
        if (mapRight) mapRight.style.display = c.mapVisible ? '' : 'none';
        var mapBadge = document.querySelector('.map-badge');
        if (mapBadge) mapBadge.innerHTML = '<strong>' + c.mapBadgeText + '</strong>\n' + c.mapBadgeSchedule;

        // Footer
        var footerP = document.querySelector('.footer-brand p');
        if (footerP) footerP.textContent = c.footerDesc;
        var emailLink = document.querySelector('.footer-col a[href^="mailto:"]');
        if (emailLink) {
            emailLink.href = 'mailto:' + c.footerEmail;
            emailLink.innerHTML = '<i class="fas fa-envelope"></i> ' + c.footerEmail;
        }
        var scheduleCols = document.querySelectorAll('.footer-col');
        if (scheduleCols[1]) {
            var lis = scheduleCols[1].querySelectorAll('li');
            if (lis[0]) lis[0].textContent = c.scheduleWeekday;
            if (lis[1]) lis[1].textContent = c.scheduleSat;
            if (lis[2]) lis[2].textContent = c.scheduleSun;
        }
        var footerBot = document.querySelector('.footer-bottom');
        if (footerBot) {
            var spans = footerBot.querySelectorAll('span');
            if (spans[0]) spans[0].innerHTML = c.copyright;
            if (spans[1]) spans[1].textContent = c.footerAddress;
        }
    }

    // ── Public API ────────────────────────────────────────────────────
    window.__getSiteContent = function () { return JSON.parse(JSON.stringify(content)); };
    window.__applySiteContent = function (c) {
        content = JSON.parse(JSON.stringify(DEFAULTS));
        Object.keys(c).forEach(function(k) { content[k] = c[k]; });
        applyContent(content);
    };

    // Hook into existing theme config
    var origGet = window.__getCurrentThemeConfig;
    if (origGet) {
        window.__getCurrentThemeConfig = function () {
            var cfg = origGet();
            cfg.content = JSON.parse(JSON.stringify(content));
            return cfg;
        };
    }
    var origApply = window.__applyThemeFromConfig;
    if (origApply) {
        window.__applyThemeFromConfig = function (cfg) {
            origApply(cfg);
            if (cfg.content) {
                content = JSON.parse(JSON.stringify(DEFAULTS));
                Object.keys(cfg.content).forEach(function(k) { content[k] = cfg.content[k]; });
                applyContent(content);
            }
        };
    }

    // ── Admin only: Content Editor ────────────────────────────────────
    var isAdmin = new URLSearchParams(window.location.search).has('admin');
    if (!isAdmin) return;

    // Inject editor styles
    var edStyle = document.createElement('style');
    edStyle.textContent = '\
        #ce-overlay { position:fixed; inset:0; z-index:100000; background:rgba(0,0,0,0.8); backdrop-filter:blur(6px);\
            display:none; align-items:center; justify-content:center; }\
        #ce-overlay.open { display:flex; }\
        #ce-modal { background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:14px;\
            width:520px; max-width:95vw; max-height:85vh; display:flex; flex-direction:column;\
            box-shadow:0 32px 80px rgba(0,0,0,0.7); }\
        .ce-header { display:flex; justify-content:space-between; align-items:center;\
            padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.06); flex-shrink:0; }\
        .ce-header h2 { font-family:var(--display); font-size:0.95rem; font-weight:700; color:rgba(255,255,255,0.85); margin:0; }\
        .ce-close { background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer; font-size:1.1rem; padding:4px; }\
        .ce-close:hover { color:rgba(255,255,255,0.6); }\
        .ce-body { overflow-y:auto; flex:1; padding:0; }\
        .ce-section { border-bottom:1px solid rgba(255,255,255,0.04); }\
        .ce-section:last-child { border-bottom:none; }\
        .ce-sec-header { display:flex; align-items:center; justify-content:space-between; padding:12px 20px; cursor:pointer;\
            font-size:0.78rem; font-weight:600; color:rgba(255,255,255,0.5); letter-spacing:0.5px;\
            transition:background 0.2s; user-select:none; }\
        .ce-sec-header:hover { background:rgba(255,255,255,0.02); }\
        .ce-sec-header i { width:18px; text-align:center; margin-right:8px; font-size:0.72rem; }\
        .ce-sec-header .ce-chevron { font-size:0.65rem; color:rgba(255,255,255,0.2); transition:transform 0.2s; }\
        .ce-section.open .ce-chevron { transform:rotate(90deg); }\
        .ce-sec-body { display:none; padding:4px 20px 16px; }\
        .ce-section.open .ce-sec-body { display:block; }\
        .ce-field { margin-bottom:10px; }\
        .ce-field-label { font-size:0.68rem; color:rgba(255,255,255,0.35); margin-bottom:4px; font-weight:500; }\
        .ce-field input, .ce-field textarea, .ce-field select { width:100%; padding:7px 10px; background:#1a1a1a;\
            border:1px solid rgba(255,255,255,0.08); border-radius:6px; color:rgba(255,255,255,0.8);\
            font-family:var(--font); font-size:0.78rem; outline:none; box-sizing:border-box;\
            transition:border-color 0.2s; }\
        .ce-field input:focus, .ce-field textarea:focus, .ce-field select:focus { border-color:var(--accent); }\
        .ce-field textarea { resize:vertical; min-height:50px; }\
        .ce-field select option { background:#111; }\
        .ce-toggle-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }\
        .ce-toggle-row span { font-size:0.75rem; color:rgba(255,255,255,0.45); }\
        .ce-switch { position:relative; width:36px; height:20px; flex-shrink:0; }\
        .ce-switch input { opacity:0; width:0; height:0; position:absolute; }\
        .ce-switch-track { position:absolute; cursor:pointer; inset:0; background:#333; border-radius:20px; transition:0.3s; }\
        .ce-switch-track::before { content:""; position:absolute; height:16px; width:16px; left:2px; bottom:2px;\
            background:#777; border-radius:50%; transition:0.3s; }\
        .ce-switch input:checked + .ce-switch-track { background:var(--accent); }\
        .ce-switch input:checked + .ce-switch-track::before { transform:translateX(16px); background:#fff; }\
        .ce-list-item { background:#1a1a1a; border:1px solid rgba(255,255,255,0.05); border-radius:8px;\
            padding:10px 12px; margin-bottom:8px; position:relative; }\
        .ce-list-item .ce-field { margin-bottom:6px; }\
        .ce-list-item .ce-field:last-child { margin-bottom:0; }\
        .ce-remove-btn { position:absolute; top:8px; right:8px; background:none; border:none;\
            color:rgba(255,100,100,0.5); cursor:pointer; font-size:0.7rem; padding:2px 6px; }\
        .ce-remove-btn:hover { color:rgba(255,100,100,0.9); }\
        .ce-add-btn { display:block; width:100%; padding:8px; background:rgba(255,255,255,0.03);\
            border:1px dashed rgba(255,255,255,0.1); border-radius:8px; color:rgba(255,255,255,0.3);\
            cursor:pointer; font-size:0.75rem; text-align:center; transition:all 0.2s; margin-top:4px; }\
        .ce-add-btn:hover { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.5);\
            border-color:rgba(255,255,255,0.2); }\
        .ce-footer { padding:12px 20px; border-top:1px solid rgba(255,255,255,0.06); flex-shrink:0;\
            display:flex; gap:10px; }\
        .ce-save-btn { flex:1; padding:10px; background:var(--accent); color:#111; border:none; border-radius:8px;\
            font-family:var(--font); font-weight:700; font-size:0.82rem; cursor:pointer; transition:opacity 0.2s; }\
        .ce-save-btn:hover { opacity:0.88; }\
        .ce-save-btn:disabled { opacity:0.4; cursor:not-allowed; }\
        .ce-cancel-btn { padding:10px 20px; background:none; border:1px solid rgba(255,255,255,0.1);\
            border-radius:8px; color:rgba(255,255,255,0.4); cursor:pointer; font-family:var(--font);\
            font-size:0.82rem; transition:all 0.2s; }\
        .ce-cancel-btn:hover { border-color:rgba(255,255,255,0.2); color:rgba(255,255,255,0.6); }\
        #ce-open-btn { margin:8px 16px; width:calc(100% - 32px); padding:9px 0; background:rgba(255,255,255,0.05);\
            border:1px solid rgba(255,255,255,0.08); border-radius:8px; color:rgba(255,255,255,0.5);\
            font-family:var(--font); font-weight:600; font-size:0.78rem; cursor:pointer; transition:all 0.2s; }\
        #ce-open-btn:hover { background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.7); }\
    ';
    document.head.appendChild(edStyle);

    // ── Editor schema ─────────────────────────────────────────────────
    var SECTIONS = [
        { id: 'company', title: 'Firm\u0103', icon: 'fa-building', fields: [
            { key: 'companyName', label: 'Nume firm\u0103', type: 'text' },
            { key: 'companyAccent', label: 'Cuv\u00e2nt accent (colorat)', type: 'text' },
        ]},
        { id: 'hero', title: 'Sec\u021biunea principal\u0103', icon: 'fa-home', fields: [
            { key: 'heroTag', label: 'Etichet\u0103 (sub nav)', type: 'text' },
            { key: 'heroTitle', label: 'Titlu principal', type: 'text' },
            { key: 'heroTitleEm', label: 'Subtitlu (italic/accent)', type: 'text' },
            { key: 'heroDesc', label: 'Descriere', type: 'textarea' },
            { key: 'phone', label: 'Num\u0103r telefon', type: 'text' },
            { key: 'phoneSchedule', label: 'Program (l\u00e2ng\u0103 telefon)', type: 'text' },
            { key: 'address', label: 'Adres\u0103', type: 'text' },
            { key: 'addressSub', label: 'Ora\u0219 (sub adres\u0103)', type: 'text' },
            { key: 'btnCallText', label: 'Text buton apel', type: 'text' },
            { key: 'btnWaText', label: 'Text buton WhatsApp', type: 'text' },
        ]},
        { id: 'gallery', title: 'Galerie', icon: 'fa-images', toggle: 'galleryVisible', fields: [
            { key: 'galleryLabel', label: 'Etichet\u0103 sec\u021biune', type: 'text' },
            { key: 'galleryTitle', label: 'Titlu sec\u021biune', type: 'text' },
        ], list: 'galleryCaptions' },
        { id: 'services', title: 'Servicii', icon: 'fa-wrench', toggle: 'servicesVisible', fields: [
            { key: 'servicesLabel', label: 'Etichet\u0103 sec\u021biune', type: 'text' },
            { key: 'servicesTitle', label: 'Titlu sec\u021biune', type: 'text' },
            { key: 'servicesSub', label: 'Subtitlu', type: 'text' },
        ], list: 'services' },
        { id: 'brands', title: 'Branduri partenere', icon: 'fa-tags', toggle: 'brandsVisible', list: 'brands' },
        { id: 'map', title: 'Hart\u0103', icon: 'fa-map', toggle: 'mapVisible', fields: [
            { key: 'mapBadgeText', label: 'Text badge', type: 'text' },
            { key: 'mapBadgeSchedule', label: 'Program badge', type: 'text' },
        ]},
        { id: 'footer', title: 'Footer', icon: 'fa-info-circle', fields: [
            { key: 'footerDesc', label: 'Descriere firm\u0103', type: 'textarea' },
            { key: 'footerEmail', label: 'Email contact', type: 'text' },
            { key: 'scheduleWeekday', label: 'Program L-V', type: 'text' },
            { key: 'scheduleSat', label: 'Program s\u00e2mb\u0103t\u0103', type: 'text' },
            { key: 'scheduleSun', label: 'Program duminic\u0103', type: 'text' },
            { key: 'copyright', label: 'Text copyright', type: 'text' },
            { key: 'footerAddress', label: 'Adres\u0103 complet\u0103', type: 'text' },
        ]},
    ];

    // ── Build modal ───────────────────────────────────────────────────
    var overlay = document.createElement('div');
    overlay.id = 'ce-overlay';
    overlay.innerHTML = '<div id="ce-modal">' +
        '<div class="ce-header"><h2><i class="fas fa-pen" style="margin-right:8px;font-size:0.8rem;opacity:0.5"></i>Editare con\u021binut</h2>' +
        '<button class="ce-close"><i class="fas fa-xmark"></i></button></div>' +
        '<div class="ce-body" id="ce-body"></div>' +
        '<div class="ce-footer">' +
        '<button class="ce-cancel-btn" id="ce-cancel">\u00cenchide</button>' +
        '<button class="ce-save-btn" id="ce-save">Salveaz\u0103 con\u021binut</button>' +
        '</div></div>';
    document.body.appendChild(overlay);

    overlay.querySelector('.ce-close').addEventListener('click', function () { overlay.classList.remove('open'); });
    document.getElementById('ce-cancel').addEventListener('click', function () { overlay.classList.remove('open'); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.classList.remove('open'); });

    window.__openContentEditor = function () {
        rebuildEditor();
        overlay.classList.add('open');
    };

    // ── Open button in slider panel ───────────────────────────────────
    var panel = document.getElementById('slider-panel');
    if (panel) {
        var spBody = document.getElementById('sp-body');
        var openBtn = document.createElement('button');
        openBtn.id = 'ce-open-btn';
        openBtn.innerHTML = '<i class="fas fa-pen" style="margin-right:6px;font-size:0.7rem;opacity:0.5"></i>Editare con\u021binut';
        openBtn.addEventListener('click', function () { window.__openContentEditor(); });
        panel.insertBefore(openBtn, spBody);
    }

    // ── Rebuild editor fields ─────────────────────────────────────────
    function rebuildEditor() {
        var body = document.getElementById('ce-body');
        body.innerHTML = '';

        SECTIONS.forEach(function (sec, si) {
            var section = document.createElement('div');
            section.className = 'ce-section' + (si === 0 ? ' open' : '');

            // Header
            var header = document.createElement('div');
            header.className = 'ce-sec-header';
            header.innerHTML = '<span><i class="fas ' + sec.icon + '"></i>' + sec.title + '</span>' +
                '<i class="fas fa-chevron-right ce-chevron"></i>';
            header.addEventListener('click', function () { section.classList.toggle('open'); });
            section.appendChild(header);

            // Body
            var secBody = document.createElement('div');
            secBody.className = 'ce-sec-body';

            // Toggle
            if (sec.toggle) {
                secBody.appendChild(makeToggle('Sec\u021biune vizibil\u0103', sec.toggle));
            }

            // Fields
            if (sec.fields) {
                sec.fields.forEach(function (f) {
                    secBody.appendChild(makeField(f.label, f.key, f.type));
                });
            }

            // List editors
            if (sec.list === 'galleryCaptions') {
                secBody.appendChild(makeCaptionList());
            } else if (sec.list === 'services') {
                secBody.appendChild(makeServicesList());
            } else if (sec.list === 'brands') {
                secBody.appendChild(makeBrandsList());
            }

            section.appendChild(secBody);
            body.appendChild(section);
        });
    }

    // ── Field helpers ─────────────────────────────────────────────────
    function makeField(label, key, type) {
        var div = document.createElement('div');
        div.className = 'ce-field';
        div.innerHTML = '<div class="ce-field-label">' + label + '</div>';
        var el;
        if (type === 'textarea') {
            el = document.createElement('textarea');
            el.rows = 3;
        } else {
            el = document.createElement('input');
            el.type = 'text';
        }
        el.value = content[key] || '';
        el.addEventListener('input', function () {
            content[key] = el.value;
            applyContent(content);
        });
        div.appendChild(el);
        return div;
    }

    function makeToggle(label, key) {
        var row = document.createElement('div');
        row.className = 'ce-toggle-row';
        row.innerHTML = '<span>' + label + '</span>';
        var sw = document.createElement('label');
        sw.className = 'ce-switch';
        var inp = document.createElement('input');
        inp.type = 'checkbox';
        inp.checked = !!content[key];
        inp.addEventListener('change', function () {
            content[key] = inp.checked;
            applyContent(content);
        });
        var track = document.createElement('span');
        track.className = 'ce-switch-track';
        sw.appendChild(inp);
        sw.appendChild(track);
        row.appendChild(sw);
        return row;
    }

    // ── Gallery captions list ─────────────────────────────────────────
    function makeCaptionList() {
        var wrap = document.createElement('div');
        wrap.innerHTML = '<div class="ce-field-label" style="margin-top:8px">Subtitr\u0103ri galerie</div>';
        (content.galleryCaptions || []).forEach(function (cap, i) {
            var item = document.createElement('div');
            item.className = 'ce-list-item';
            item.style.padding = '6px 10px';
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:8px';
            var label = document.createElement('span');
            label.style.cssText = 'font-size:0.68rem;color:rgba(255,255,255,0.25);width:14px;flex-shrink:0';
            label.textContent = (i + 1) + '';
            var inp = document.createElement('input');
            inp.type = 'text';
            inp.value = cap;
            inp.style.cssText = 'flex:1;padding:5px 8px;background:#222;border:1px solid rgba(255,255,255,0.06);border-radius:5px;color:rgba(255,255,255,0.7);font-size:0.75rem;font-family:var(--font);outline:none;box-sizing:border-box';
            inp.addEventListener('input', (function (idx) {
                return function () {
                    content.galleryCaptions[idx] = inp.value;
                    applyContent(content);
                };
            })(i));
            row.appendChild(label);
            row.appendChild(inp);
            item.appendChild(row);
            wrap.appendChild(item);
        });
        return wrap;
    }

    // ── Services list ─────────────────────────────────────────────────
    function makeServicesList() {
        var wrap = document.createElement('div');
        wrap.innerHTML = '<div class="ce-field-label" style="margin-top:8px">Servicii</div>';
        var listEl = document.createElement('div');
        listEl.id = 'ce-services-list';

        function renderServices() {
            listEl.innerHTML = '';
            content.services.forEach(function (svc, i) {
                var item = document.createElement('div');
                item.className = 'ce-list-item';

                // Remove button
                var rmBtn = document.createElement('button');
                rmBtn.className = 'ce-remove-btn';
                rmBtn.innerHTML = '<i class="fas fa-trash"></i>';
                rmBtn.addEventListener('click', function () {
                    content.services.splice(i, 1);
                    renderServices();
                    applyContent(content);
                });
                item.appendChild(rmBtn);

                // Icon select
                var iconField = document.createElement('div');
                iconField.className = 'ce-field';
                iconField.innerHTML = '<div class="ce-field-label">Icon\u0103</div>';
                var iconSel = document.createElement('select');
                iconSel.style.cssText = 'width:100%;padding:5px 8px;background:#222;border:1px solid rgba(255,255,255,0.06);border-radius:5px;color:rgba(255,255,255,0.7);font-size:0.75rem;font-family:var(--font);outline:none';
                SERVICE_ICONS.forEach(function (ic) {
                    var opt = document.createElement('option');
                    opt.value = ic.value;
                    opt.textContent = ic.label;
                    if (ic.value === svc.icon) opt.selected = true;
                    iconSel.appendChild(opt);
                });
                iconSel.addEventListener('change', function () {
                    content.services[i].icon = iconSel.value;
                    applyContent(content);
                });
                iconField.appendChild(iconSel);
                item.appendChild(iconField);

                // Name
                item.appendChild(makeServiceField('Denumire', svc.name, function (v) { content.services[i].name = v; }));
                // Desc
                var descField = document.createElement('div');
                descField.className = 'ce-field';
                descField.innerHTML = '<div class="ce-field-label">Descriere</div>';
                var descTa = document.createElement('textarea');
                descTa.rows = 2;
                descTa.value = svc.desc;
                descTa.style.cssText = 'width:100%;padding:5px 8px;background:#222;border:1px solid rgba(255,255,255,0.06);border-radius:5px;color:rgba(255,255,255,0.7);font-size:0.75rem;font-family:var(--font);outline:none;resize:vertical;min-height:36px;box-sizing:border-box';
                descTa.addEventListener('input', function () {
                    content.services[i].desc = descTa.value;
                    applyContent(content);
                });
                descField.appendChild(descTa);
                item.appendChild(descField);
                // Price
                item.appendChild(makeServiceField('Pre\u021b', svc.price, function (v) { content.services[i].price = v; }));

                listEl.appendChild(item);
            });
        }
        renderServices();
        wrap.appendChild(listEl);

        // Add button
        var addBtn = document.createElement('button');
        addBtn.className = 'ce-add-btn';
        addBtn.innerHTML = '<i class="fas fa-plus" style="margin-right:6px"></i>Adaug\u0103 serviciu';
        addBtn.addEventListener('click', function () {
            content.services.push({ icon: 'fas fa-wrench', name: 'Serviciu nou', desc: 'Descriere serviciu', price: 'de la ... RON' });
            renderServices();
            applyContent(content);
        });
        wrap.appendChild(addBtn);
        return wrap;
    }

    function makeServiceField(label, value, onChange) {
        var div = document.createElement('div');
        div.className = 'ce-field';
        div.innerHTML = '<div class="ce-field-label">' + label + '</div>';
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.value = value;
        inp.style.cssText = 'width:100%;padding:5px 8px;background:#222;border:1px solid rgba(255,255,255,0.06);border-radius:5px;color:rgba(255,255,255,0.7);font-size:0.75rem;font-family:var(--font);outline:none;box-sizing:border-box';
        inp.addEventListener('input', function () { onChange(inp.value); applyContent(content); });
        div.appendChild(inp);
        return div;
    }

    // ── Brands list ───────────────────────────────────────────────────
    function makeBrandsList() {
        var wrap = document.createElement('div');
        wrap.innerHTML = '<div class="ce-field-label" style="margin-top:4px">Branduri</div>';
        var listEl = document.createElement('div');
        listEl.id = 'ce-brands-list';

        function renderBrands() {
            listEl.innerHTML = '';
            content.brands.forEach(function (b, i) {
                var item = document.createElement('div');
                item.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px';
                var inp = document.createElement('input');
                inp.type = 'text';
                inp.value = b;
                inp.style.cssText = 'flex:1;padding:5px 8px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.06);border-radius:5px;color:rgba(255,255,255,0.7);font-size:0.75rem;font-family:var(--font);outline:none;box-sizing:border-box';
                inp.addEventListener('input', function () {
                    content.brands[i] = inp.value;
                    applyContent(content);
                });
                var rmBtn = document.createElement('button');
                rmBtn.style.cssText = 'background:none;border:none;color:rgba(255,100,100,0.4);cursor:pointer;font-size:0.7rem;padding:4px';
                rmBtn.innerHTML = '<i class="fas fa-xmark"></i>';
                rmBtn.addEventListener('click', function () {
                    content.brands.splice(i, 1);
                    renderBrands();
                    applyContent(content);
                });
                item.appendChild(inp);
                item.appendChild(rmBtn);
                listEl.appendChild(item);
            });
        }
        renderBrands();
        wrap.appendChild(listEl);

        var addBtn = document.createElement('button');
        addBtn.className = 'ce-add-btn';
        addBtn.innerHTML = '<i class="fas fa-plus" style="margin-right:6px"></i>Adaug\u0103 brand';
        addBtn.addEventListener('click', function () {
            content.brands.push('Brand nou');
            renderBrands();
            applyContent(content);
        });
        wrap.appendChild(addBtn);
        return wrap;
    }

    // ── Save handler ──────────────────────────────────────────────────
    document.getElementById('ce-save').addEventListener('click', async function () {
        var btn = this;
        var sb = window.__sb;
        if (!sb || !window.__getCurrentThemeConfig) return;

        var config = window.__getCurrentThemeConfig();
        btn.disabled = true;
        btn.textContent = 'Se salveaz\u0103\u2026';

        var result = await sb
            .from('settings')
            .update({ config: config, updated_at: new Date().toISOString() })
            .eq('id', 1)
            .select();

        btn.disabled = false;
        if (result.error) {
            btn.textContent = '\u2715 Eroare: ' + result.error.message;
            setTimeout(function () { btn.textContent = 'Salveaz\u0103 con\u021binut'; }, 3000);
        } else if (!result.data || result.data.length === 0) {
            btn.textContent = '\u2715 Acces refuzat (RLS)';
            setTimeout(function () { btn.textContent = 'Salveaz\u0103 con\u021binut'; }, 3000);
        } else {
            btn.textContent = '\u2713 Salvat!';
            setTimeout(function () { btn.textContent = 'Salveaz\u0103 con\u021binut'; }, 2000);
        }
    });

})();
