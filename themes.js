/* Constanta Folii Auto — Theme tuning panel */

(function () {

    // ── Fonts ──────────────────────────────────────────────────────────
    const FONTS = [
        { name: 'Inter',             body: "'Inter', sans-serif",             disp: "'Inter', sans-serif",             url: null },
        { name: 'Space Grotesk',     body: "'Space Grotesk', sans-serif",     disp: "'Space Grotesk', sans-serif",     url: null },
        { name: 'Montserrat',        body: "'Montserrat', sans-serif",        disp: "'Montserrat', sans-serif",        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' },
        { name: 'Raleway',           body: "'Raleway', sans-serif",           disp: "'Raleway', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap' },
        { name: 'Barlow',            body: "'Barlow', sans-serif",            disp: "'Barlow Condensed', sans-serif",  url: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700&display=swap' },
        { name: 'Playfair',          body: "'Playfair Display', serif",       disp: "'Playfair Display', serif",       url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
        { name: 'Nunito',            body: "'Nunito', sans-serif",            disp: "'Nunito', sans-serif",            url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap' },
        { name: 'DM Sans',           body: "'DM Sans', sans-serif",           disp: "'DM Sans', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap' },
        { name: 'Outfit',            body: "'Outfit', sans-serif",            disp: "'Outfit', sans-serif",            url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap' },
        { name: 'Figtree',           body: "'Figtree', sans-serif",           disp: "'Figtree', sans-serif",           url: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap' },
        { name: 'Plus Jakarta Sans', body: "'Plus Jakarta Sans', sans-serif", disp: "'Plus Jakarta Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap' },
        { name: 'Sora',              body: "'Sora', sans-serif",              disp: "'Sora', sans-serif",              url: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap' },
    ];
    window.__FONTS = FONTS;

    const FONT_DEFAULT = 2; // Montserrat

    // ── Button variants ────────────────────────────────────────────────
    const VARIANTS = [
        { name: 'A — Alb + verde solid' },
        { name: 'B — Accent + verde outline' },
        { name: 'C — Ambele outline' },
        { name: 'D — Glass' },
    ];
    const VARIANT_DEFAULT = 3; // D

    // ── Only mount panel for admin ─────────────────────────────────────
    const isAdmin = new URLSearchParams(window.location.search).has('admin');

    if (isAdmin) {
        // Panel HTML
        const wrap = document.createElement('div');
        wrap.innerHTML = `
            <button id="slider-toggle"><i class="fas fa-sliders"></i></button>
            <div id="slider-panel">
                <div class="sp-header">
                    <span>Ajustări</span>
                    <button class="sp-close"><i class="fas fa-xmark"></i></button>
                </div>
                <div class="sp-dd-section" id="sp-font-dd"></div>
                <div class="sp-dd-section" id="sp-variant-dd"></div>
                <div class="sp-body" id="sp-body"></div>
            </div>
        `;
        document.body.appendChild(wrap);

        // Dropdown styles
        const panelStyle = document.createElement('style');
        panelStyle.textContent = `
            .sp-dd-section { padding: 10px 16px; border-bottom: 1px solid var(--border); }
            .sp-dd-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 1.5px;
                text-transform: uppercase; color: var(--text-muted); margin-bottom: 7px; }
            .sp-dd-row { display: flex; align-items: center; gap: 6px; outline: none; }
            .sp-dd-row:focus-visible { outline: 1px solid var(--accent); border-radius: 6px; }
            .sp-arr { background: none; border: 1px solid rgba(255,255,255,0.12);
                color: var(--text-sec); border-radius: 5px;
                width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; font-size: 1rem; flex-shrink: 0;
                transition: border-color 0.2s, color 0.2s; }
            .sp-arr:hover { border-color: var(--accent); color: var(--accent); }
            .sp-dd-select { flex: 1; background: var(--card); border: 1px solid rgba(255,255,255,0.12);
                color: var(--text); border-radius: 6px; padding: 4px 8px;
                font-size: 0.78rem; font-family: var(--font); cursor: pointer;
                outline: none; appearance: none; text-align: center; }
            .sp-dd-select:focus { border-color: var(--accent); }
            .sp-dd-select option { background: #0f1828; }
        `;
        document.head.appendChild(panelStyle);

        document.getElementById('slider-toggle').addEventListener('click', () => {
            document.getElementById('slider-panel').classList.toggle('open');
        });
        wrap.querySelector('.sp-close').addEventListener('click', () => {
            document.getElementById('slider-panel').classList.remove('open');
        });
    }

    // ── Dropdown factory ───────────────────────────────────────────────
    function makeDropdown(containerId, label, items, defaultIdx, onChange) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = `<div class="sp-dd-label">${label}</div>`;
        const row = document.createElement('div');
        row.className = 'sp-dd-row';
        row.setAttribute('tabindex', '0');

        const prev = document.createElement('button');
        prev.className = 'sp-arr'; prev.innerHTML = '&#8249;'; prev.setAttribute('aria-label', 'Anterior');

        const sel = document.createElement('select');
        sel.className = 'sp-dd-select';
        items.forEach((item, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = typeof item === 'string' ? item : item.name;
            if (i === defaultIdx) opt.selected = true;
            sel.appendChild(opt);
        });

        const next = document.createElement('button');
        next.className = 'sp-arr'; next.innerHTML = '&#8250;'; next.setAttribute('aria-label', 'Următor');

        row.append(prev, sel, next);
        container.appendChild(row);

        function step(dir) {
            sel.selectedIndex = (sel.selectedIndex + dir + items.length) % items.length;
            onChange(sel.selectedIndex);
        }

        prev.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
        next.addEventListener('click', (e) => { e.stopPropagation(); step(+1); });
        sel.addEventListener('change', () => onChange(+sel.value));
        row.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); step(+1); }
        });

        return sel;
    }

    // ── Font apply ─────────────────────────────────────────────────────
    function applyFont(idx) {
        const f = FONTS[Math.min(Math.max(0, idx), FONTS.length - 1)];
        if (f.url && !document.querySelector(`link[data-font="${f.name}"]`)) {
            const lnk = document.createElement('link');
            lnk.rel = 'stylesheet'; lnk.href = f.url;
            lnk.setAttribute('data-font', f.name);
            document.head.appendChild(lnk);
        }
        document.documentElement.style.setProperty('--font', f.body);
        document.documentElement.style.setProperty('--display', f.disp);
    }

    // ── Variant apply ──────────────────────────────────────────────────
    function applyVariant(idx) {
        const cta = document.getElementById('hero-cta');
        if (cta) cta.dataset.variant = ['A', 'B', 'C', 'D'][Math.min(Math.max(0, idx), 3)];
    }

    // ── Mount dropdowns (admin only) ───────────────────────────────────
    const fontSelectEl    = makeDropdown('sp-font-dd',    'Font',          FONTS,    FONT_DEFAULT,    applyFont);
    const variantSelectEl = makeDropdown('sp-variant-dd', 'Stil butoane',  VARIANTS, VARIANT_DEFAULT, applyVariant);

    // Apply defaults immediately
    applyFont(FONT_DEFAULT);
    applyVariant(VARIANT_DEFAULT);

    // ── Sliders ────────────────────────────────────────────────────────
    const BASE = {
        hue: 222, sat: 58, bgL: 5, cardL: 9,
        accent: 0, accentSat: 61, textL: 99, borderA: 35,
        bgOverlayAlpha: 81, bgOverlayHue: 240, bgOverlaySat: 28, bgOverlayL: 3,
    };

    const SLIDERS = [
        { id: 'bgL',            label: 'Darkness fundal',       min: 0,  max: 12,  val: BASE.bgL,            unit: '%', flip: true },
        { id: 'cardL',          label: 'Darkness carduri',      min: 2,  max: 18,  val: BASE.cardL,          unit: '%', flip: true },
        { id: 'hue',            label: 'Nuanță fundal',         min: 0,  max: 360, val: BASE.hue,            unit: '°' },
        { id: 'sat',            label: 'Saturație fundal',      min: 28, max: 88,  val: BASE.sat,            unit: '%' },
        { id: 'accent',         label: 'Nuanță accent',         min: 0,  max: 360, val: BASE.accent,         unit: '°' },
        { id: 'accentSat',      label: 'Saturație accent',      min: 28, max: 90,  val: BASE.accentSat,      unit: '%' },
        { id: 'textL',          label: 'Luminozitate text',     min: 75, max: 100, val: BASE.textL,          unit: '%' },
        { id: 'borderA',        label: 'Vizibilitate borduri',  min: 5,  max: 58,  val: BASE.borderA,        unit: '%' },
        { id: 'bgOverlayAlpha', label: 'Opacitate overlay',    min: 40, max: 100, val: BASE.bgOverlayAlpha, unit: '%', flip: true },
        { id: 'bgOverlayHue',   label: 'Nuanță overlay',       min: 0,  max: 360, val: BASE.bgOverlayHue,   unit: '°' },
        { id: 'bgOverlaySat',   label: 'Saturație overlay',    min: 0,  max: 75,  val: BASE.bgOverlaySat,   unit: '%' },
        { id: 'bgOverlayL',     label: 'Luminozitate overlay', min: 0,  max: 25,  val: BASE.bgOverlayL,     unit: '%' },
    ];

    const state = {};
    SLIDERS.forEach(sl => { state[sl.id] = sl.val; });

    if (isAdmin) {
        const body = document.getElementById('sp-body');
        SLIDERS.forEach(sl => {
            const g = document.createElement('div');
            g.className = 'sl-group';
            g.innerHTML = `
                <div class="sl-label">
                    <span>${sl.label}</span>
                    <span class="sl-val" data-s="${sl.id}">${sl.val}${sl.unit}</span>
                </div>
                <input type="range" min="${sl.min}" max="${sl.max}" value="${sl.val}" data-s="${sl.id}">
            `;
            g.querySelector('input').addEventListener('input', function () {
                state[sl.id] = +this.value;
                document.querySelectorAll(`.sl-val[data-s="${sl.id}"]`)
                    .forEach(v => v.textContent = this.value + sl.unit);
                apply();
            });
            body.appendChild(g);
        });
    }

    apply();

    // ── Apply CSS variables ────────────────────────────────────────────
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

        document.documentElement.style.scrollbarColor =
            `${hsl(ah, as, 55)} ${hsl(h, Math.min(s, 40), bgL)}`;
    }

    function hsl(h, s, l) { return `hsl(${h}, ${s}%, ${l}%)`; }

    // ── Public API (used by admin.js) ──────────────────────────────────
    window.__FONTS         = FONTS;
    window.__fontSelectEl  = fontSelectEl;
    window.__variantSelectEl = variantSelectEl;

    window.__applyThemeFromConfig = function (cfg) {
        if (!cfg) return;
        SLIDERS.forEach(sl => {
            if (cfg[sl.id] !== undefined) {
                state[sl.id] = cfg[sl.id];
                // Update slider UI if admin panel is mounted
                const input = document.querySelector(`input[data-s="${sl.id}"]`);
                if (input) {
                    input.value = cfg[sl.id];
                    document.querySelectorAll(`.sl-val[data-s="${sl.id}"]`)
                        .forEach(v => v.textContent = cfg[sl.id] + sl.unit);
                }
            }
        });
        apply();
        if (cfg.fontIndex !== undefined)    applyFont(cfg.fontIndex);
        if (cfg.variantIndex !== undefined) applyVariant(cfg.variantIndex);
        // Sync dropdowns
        if (fontSelectEl    && cfg.fontIndex    !== undefined) fontSelectEl.value    = cfg.fontIndex;
        if (variantSelectEl && cfg.variantIndex !== undefined) variantSelectEl.value = cfg.variantIndex;
    };

    window.__getCurrentThemeConfig = function () {
        return Object.assign({}, state, {
            fontIndex:    fontSelectEl    ? +fontSelectEl.value    : FONT_DEFAULT,
            variantIndex: variantSelectEl ? +variantSelectEl.value : VARIANT_DEFAULT,
        });
    };

})();
