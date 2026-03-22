/* FOLIART — Slider-only theme tuning. No gradients. */

(function() {
    // Inject panel
    const wrap = document.createElement('div');
    wrap.innerHTML = `
        <button id="slider-toggle"><i class="fas fa-sliders"></i></button>
        <div id="slider-panel">
            <div class="sp-header">
                <span>Ajustări</span>
                <button class="sp-close"><i class="fas fa-xmark"></i></button>
            </div>
            <div class="sp-body" id="sp-body"></div>
        </div>
    `;
    document.body.appendChild(wrap);

    document.getElementById('slider-toggle').addEventListener('click', () => {
        document.getElementById('slider-panel').classList.toggle('open');
    });
    wrap.querySelector('.sp-close').addEventListener('click', () => {
        document.getElementById('slider-panel').classList.remove('open');
    });

    // Base theme values (Bleumarin închis + Auriu)
    const BASE = { hue: 222, sat: 55, bgL: 5, cardL: 9, accent: 40, accentSat: 68, textL: 88, borderA: 20, bgOverlayAlpha: 50, bgOverlayHue: 0 };

    const SLIDERS = [
        { id: 'bgL',       label: 'Darkness fundal',    min: 0, max: 20, val: BASE.bgL, unit: '%', flip: true },
        { id: 'cardL',     label: 'Darkness carduri',   min: 0, max: 25, val: BASE.cardL, unit: '%', flip: true },
        { id: 'hue',       label: 'Nuanță fundal',      min: 0, max: 360, val: BASE.hue, unit: '°' },
        { id: 'sat',       label: 'Saturație fundal',   min: 0, max: 100, val: BASE.sat, unit: '%' },
        { id: 'accent',    label: 'Nuanță accent',      min: 0, max: 360, val: BASE.accent, unit: '°' },
        { id: 'accentSat', label: 'Saturație accent',   min: 10, max: 100, val: BASE.accentSat, unit: '%' },
        { id: 'textL',     label: 'Luminozitate text',  min: 50, max: 100, val: BASE.textL, unit: '%' },
        { id: 'borderA',   label: 'Vizibilitate borduri', min: 0, max: 60, val: BASE.borderA, unit: '%' },
        { id: 'bgOverlayAlpha', label: 'Darkness overlay', min: 0, max: 100, val: BASE.bgOverlayAlpha, unit: '%', flip: true },
        { id: 'bgOverlayHue',   label: 'Nuanță overlay',   min: 0, max: 360, val: BASE.bgOverlayHue, unit: '°' },
    ];

    const state = {};
    const body = document.getElementById('sp-body');

    SLIDERS.forEach(s => {
        state[s.id] = s.val;
        const g = document.createElement('div');
        g.className = 'sl-group';
        g.innerHTML = `
            <div class="sl-label"><span>${s.label}</span><span class="sl-val" data-s="${s.id}">${s.val}${s.unit}</span></div>
            <input type="range" min="${s.min}" max="${s.max}" value="${s.val}" data-s="${s.id}">
        `;
        g.querySelector('input').addEventListener('input', function() {
            state[s.id] = +this.value;
            document.querySelectorAll(`.sl-val[data-s="${s.id}"]`).forEach(v => v.textContent = this.value + s.unit);
            apply();
        });
        body.appendChild(g);
    });

    apply(); // apply defaults on load

    function apply() {
        const r = document.documentElement.style;
        const h = state.hue;
        const s = state.sat;
        const bgL = state.bgL;
        const cardL = state.cardL;
        const ah = state.accent;
        const as = state.accentSat;
        const tl = state.textL;
        const ba = state.borderA / 100;
        const overlayAlpha = state.bgOverlayAlpha / 100;
        const overlayHue = state.bgOverlayHue;

        // Backgrounds — solid colors, no gradients
        r.setProperty('--bg', hsl(h, Math.min(s, 40), bgL));
        r.setProperty('--bg-alt', hsl(h, Math.min(s, 35), bgL + 2));
        r.setProperty('--card', hsl(h, Math.min(s, 30), cardL));
        r.setProperty('--surface', hsl(h, Math.min(s, 25), cardL + 4));

        // Accent — solid
        r.setProperty('--accent', hsl(ah, as, 55));
        r.setProperty('--accent-dim', `hsla(${ah}, ${as}%, 55%, 0.12)`);

        // Text
        r.setProperty('--text', hsl(h, Math.min(s, 8), tl));
        r.setProperty('--text-sec', hsl(h, Math.min(s, 8), Math.max(tl - 28, 38)));
        r.setProperty('--text-muted', hsl(h, Math.min(s, 8), Math.max(tl - 48, 25)));

        // Borders
        r.setProperty('--border', `rgba(255,255,255,${(ba * 0.3).toFixed(3)})`);

        // Background overlay (mask)
        r.setProperty('--bg-overlay', `hsla(${overlayHue}, 50%, 10%, ${overlayAlpha.toFixed(3)})`);

        // Map filter
        const map = document.querySelector('.hero-right iframe');
        if (map) map.style.filter = bgL > 40
            ? 'none'
            : 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)';

        // Scrollbar
        document.documentElement.style.scrollbarColor = `${hsl(ah, as, 55)} ${hsl(h, Math.min(s, 40), bgL)}`;
    }

    function hsl(h, s, l) { return `hsl(${h}, ${s}%, ${l}%)`; }
})();
