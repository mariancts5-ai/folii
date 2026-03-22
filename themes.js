/* Constanta Folii Auto — Theme tuning. No gradients. */

(function() {

    // ── Fonts ──────────────────────────────────────────────────────────
    const FONTS = [
        { name: 'Inter',         body: "'Inter', sans-serif",          disp: "'Inter', sans-serif",           url: null },
        { name: 'Space Grotesk', body: "'Space Grotesk', sans-serif",  disp: "'Space Grotesk', sans-serif",   url: null },
        { name: 'Montserrat',    body: "'Montserrat', sans-serif",     disp: "'Montserrat', sans-serif",      url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' },
        { name: 'Raleway',       body: "'Raleway', sans-serif",        disp: "'Raleway', sans-serif",         url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap' },
        { name: 'Barlow',        body: "'Barlow', sans-serif",         disp: "'Barlow Condensed', sans-serif",url: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700&display=swap' },
        { name: 'Playfair',      body: "'Playfair Display', serif",    disp: "'Playfair Display', serif",     url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
        { name: 'Oswald',        body: "'Oswald', sans-serif",         disp: "'Oswald', sans-serif",          url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap' },
        { name: 'Nunito',        body: "'Nunito', sans-serif",         disp: "'Nunito', sans-serif",          url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap' },
    ];

    // ── Panel HTML ─────────────────────────────────────────────────────
    const wrap = document.createElement('div');
    wrap.innerHTML = `
        <button id="slider-toggle"><i class="fas fa-sliders"></i></button>
        <div id="slider-panel">
            <div class="sp-header">
                <span>Ajustări</span>
                <button class="sp-close"><i class="fas fa-xmark"></i></button>
            </div>
            <div class="sp-section" id="sp-fonts-section">
                <div class="sp-sec-label">Font</div>
                <div id="sp-font-chips" class="sp-chips"></div>
            </div>
            <div class="sp-body" id="sp-body"></div>
        </div>
    `;
    document.body.appendChild(wrap);

    // Chip + font section styles
    const s = document.createElement('style');
    s.textContent = `
        .sp-section { padding: 10px 16px; border-bottom: 1px solid var(--border); }
        .sp-sec-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 1.5px;
            text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
        .sp-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .sp-chip { font-size: 0.71rem; padding: 3px 10px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.12); background: none;
            color: var(--text-sec); cursor: pointer; transition: all 0.2s; }
        .sp-chip.active { border-color: var(--accent); color: var(--accent); }
        .sp-chip:hover:not(.active) { border-color: rgba(255,255,255,0.25); color: var(--text); }
    `;
    document.head.appendChild(s);

    // Render font chips
    const chipWrap = document.getElementById('sp-font-chips');
    FONTS.forEach((f, i) => {
        const chip = document.createElement('button');
        chip.className = 'sp-chip' + (i === 0 ? ' active' : '');
        chip.textContent = f.name;
        chip.dataset.fname = f.name;
        chip.style.fontFamily = f.body;
        chip.addEventListener('click', () => applyFont(f));
        chipWrap.appendChild(chip);
    });

    function applyFont(f) {
        if (f.url && !document.querySelector(`link[data-font="${f.name}"]`)) {
            const lnk = document.createElement('link');
            lnk.rel = 'stylesheet'; lnk.href = f.url;
            lnk.setAttribute('data-font', f.name);
            document.head.appendChild(lnk);
        }
        document.documentElement.style.setProperty('--font', f.body);
        document.documentElement.style.setProperty('--display', f.disp);
        document.querySelectorAll('.sp-chip[data-fname]').forEach(c =>
            c.classList.toggle('active', c.dataset.fname === f.name));
    }

    // ── Toggle / close ─────────────────────────────────────────────────
    document.getElementById('slider-toggle').addEventListener('click', () => {
        document.getElementById('slider-panel').classList.toggle('open');
    });
    wrap.querySelector('.sp-close').addEventListener('click', () => {
        document.getElementById('slider-panel').classList.remove('open');
    });

    // ── Sliders ────────────────────────────────────────────────────────
    // Base values from screenshot
    const BASE = {
        hue: 222, sat: 58, bgL: 5, cardL: 9,
        accent: 0, accentSat: 61, textL: 99, borderA: 35,
        bgOverlayAlpha: 81, bgOverlayHue: 240, bgOverlaySat: 28, bgOverlayL: 3,
    };

    const SLIDERS = [
        { id: 'bgL',            label: 'Darkness fundal',      min: 0,  max: 20,  val: BASE.bgL,            unit: '%', flip: true },
        { id: 'cardL',          label: 'Darkness carduri',     min: 0,  max: 25,  val: BASE.cardL,          unit: '%', flip: true },
        { id: 'hue',            label: 'Nuanță fundal',        min: 0,  max: 360, val: BASE.hue,            unit: '°' },
        { id: 'sat',            label: 'Saturație fundal',     min: 0,  max: 100, val: BASE.sat,            unit: '%' },
        { id: 'accent',         label: 'Nuanță accent',        min: 0,  max: 360, val: BASE.accent,         unit: '°' },
        { id: 'accentSat',      label: 'Saturație accent',     min: 10, max: 100, val: BASE.accentSat,      unit: '%' },
        { id: 'textL',          label: 'Luminozitate text',    min: 50, max: 100, val: BASE.textL,          unit: '%' },
        { id: 'borderA',        label: 'Vizibilitate borduri', min: 0,  max: 60,  val: BASE.borderA,        unit: '%' },
        { id: 'bgOverlayAlpha', label: 'Opacitate overlay',   min: 0,  max: 100, val: BASE.bgOverlayAlpha, unit: '%', flip: true },
        { id: 'bgOverlayHue',   label: 'Nuanță overlay',      min: 0,  max: 360, val: BASE.bgOverlayHue,   unit: '°' },
        { id: 'bgOverlaySat',   label: 'Saturație overlay',   min: 0,  max: 100, val: BASE.bgOverlaySat,   unit: '%' },
        { id: 'bgOverlayL',     label: 'Luminozitate overlay', min: 0, max: 50,  val: BASE.bgOverlayL,     unit: '%' },
    ];

    const state = {};
    const body = document.getElementById('sp-body');

    SLIDERS.forEach(sl => {
        state[sl.id] = sl.val;
        const g = document.createElement('div');
        g.className = 'sl-group';
        g.innerHTML = `
            <div class="sl-label"><span>${sl.label}</span><span class="sl-val" data-s="${sl.id}">${sl.val}${sl.unit}</span></div>
            <input type="range" min="${sl.min}" max="${sl.max}" value="${sl.val}" data-s="${sl.id}">
        `;
        g.querySelector('input').addEventListener('input', function() {
            state[sl.id] = +this.value;
            document.querySelectorAll(`.sl-val[data-s="${sl.id}"]`).forEach(v => v.textContent = this.value + sl.unit);
            apply();
        });
        body.appendChild(g);
    });

    apply();

    // ── Apply ──────────────────────────────────────────────────────────
    function apply() {
        const r = document.documentElement.style;
        const h = state.hue, s = state.sat;
        const bgL = state.bgL, cardL = state.cardL;
        const ah = state.accent, as = state.accentSat;
        const tl = state.textL;
        const ba = state.borderA / 100;
        const oa = state.bgOverlayAlpha / 100;
        const oh = state.bgOverlayHue, os = state.bgOverlaySat, ol = state.bgOverlayL;

        r.setProperty('--bg',      hsl(h, Math.min(s, 40), bgL));
        r.setProperty('--bg-alt',  hsl(h, Math.min(s, 35), bgL + 2));
        r.setProperty('--card',    hsl(h, Math.min(s, 30), cardL));
        r.setProperty('--surface', hsl(h, Math.min(s, 25), cardL + 4));

        r.setProperty('--accent',     hsl(ah, as, 55));
        r.setProperty('--accent-dim', `hsla(${ah}, ${as}%, 55%, 0.12)`);

        r.setProperty('--text',       hsl(h, Math.min(s, 8), tl));
        r.setProperty('--text-sec',   hsl(h, Math.min(s, 8), Math.max(tl - 28, 38)));
        r.setProperty('--text-muted', hsl(h, Math.min(s, 8), Math.max(tl - 48, 25)));

        r.setProperty('--border', `rgba(255,255,255,${(ba * 0.3).toFixed(3)})`);

        r.setProperty('--bg-overlay', `hsla(${oh}, ${os}%, ${ol}%, ${oa.toFixed(3)})`);

        const map = document.querySelector('.hero-right iframe');
        if (map) map.style.filter = bgL > 40 ? 'none'
            : 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)';

        r.scrollbarColor = `${hsl(ah, as, 55)} ${hsl(h, Math.min(s, 40), bgL)}`;
    }

    function hsl(h, s, l) { return `hsl(${h}, ${s}%, ${l}%)`; }

})();
