/* Constanta Folii Auto — Admin panel & public settings loader */

(async function () {

    const SUPABASE_URL = 'https://uzmpxtfwflfujpeqljjw.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6bXB4dGZ3ZmxmdWpwZXFsamp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxODc2MTYsImV4cCI6MjA4OTc2MzYxNn0.EAqCmoTwI_hi00ZwWHY8AX2pgKJA2TMUC7WhHrUDEiM';

    // ── Init Supabase client ───────────────────────────────────────────
    const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // ── Load & apply public settings (runs for ALL visitors) ──────────
    try {
        const { data } = await sb
            .from('settings')
            .select('config')
            .eq('id', 1)
            .single();
        if (data?.config && window.__applyThemeFromConfig) {
            window.__applyThemeFromConfig(data.config);
        }
    } catch (_) { /* silently fall back to hardcoded defaults */ }

    // ── Admin only below this line ─────────────────────────────────────
    const isAdmin = new URLSearchParams(window.location.search).has('admin');
    if (!isAdmin) return;

    // Prevent indexing of admin URL
    const noindex = document.createElement('meta');
    noindex.name = 'robots'; noindex.content = 'noindex';
    document.head.appendChild(noindex);

    // ── Inject styles ──────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        /* Login modal */
        #admin-overlay {
            position: fixed; inset: 0; z-index: 99999;
            background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
        }
        #admin-modal {
            background: var(--card); border: 1px solid var(--border);
            border-radius: 12px; padding: 32px 28px; width: 320px;
            box-shadow: 0 24px 64px rgba(0,0,0,0.6);
        }
        #admin-modal h2 {
            font-family: var(--display); font-size: 1.1rem; font-weight: 700;
            margin-bottom: 20px; color: var(--text);
        }
        #admin-modal input {
            width: 100%; padding: 10px 12px; margin-bottom: 10px;
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 8px; color: var(--text); font-family: var(--font);
            font-size: 0.88rem; outline: none; box-sizing: border-box;
        }
        #admin-modal input:focus { border-color: var(--accent); }
        #admin-submit {
            width: 100%; padding: 11px; margin-top: 4px;
            background: var(--accent); color: var(--bg);
            border: none; border-radius: 8px;
            font-family: var(--font); font-weight: 700; font-size: 0.88rem;
            cursor: pointer; transition: opacity 0.2s;
        }
        #admin-submit:hover { opacity: 0.88; }
        #admin-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        #admin-error {
            margin-top: 10px; font-size: 0.78rem;
            color: #ff6b6b; text-align: center; min-height: 18px;
        }

        /* Save button */
        #sp-save-btn {
            margin: 12px 16px 16px; width: calc(100% - 32px);
            padding: 10px 0; background: var(--accent); color: var(--bg);
            border: none; border-radius: 8px;
            font-family: var(--font); font-weight: 700; font-size: 0.82rem;
            cursor: pointer; transition: opacity 0.2s;
        }
        #sp-save-btn:hover { opacity: 0.88; }
        #sp-save-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Admin nav links */
        .admin-nav-link {
            color: var(--text-sec) !important;
            font-size: 0.82rem !important;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .admin-nav-link:hover { opacity: 1; }

        /* Admin info section in panel */
        .sp-admin-info {
            padding: 12px 16px; border-top: 1px solid var(--border);
            font-size: 0.72rem; color: var(--text-muted);
            line-height: 1.7;
        }
        .sp-admin-info strong { color: var(--text-sec); font-weight: 600; }
    `;
    document.head.appendChild(style);

    // ── Check existing session ─────────────────────────────────────────
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        onAdminReady();
    } else {
        showLoginModal();
    }

    // ── Called after successful login ──────────────────────────────────
    function onAdminReady() {
        injectAdminNav();
        injectSaveButton();
        injectAdminInfo();
    }

    // ── Admin nav links (Panou admin + Deconectare) ───────────────────
    function injectAdminNav() {
        if (document.getElementById('admin-nav-items')) return;

        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const li1 = document.createElement('li');
            li1.id = 'admin-nav-items';
            const a1 = document.createElement('a');
            a1.href = '#';
            a1.className = 'admin-nav-link';
            a1.innerHTML = '<i class="fas fa-sliders"></i> Panou admin';
            a1.addEventListener('click', (e) => {
                e.preventDefault();
                const panel = document.getElementById('slider-panel');
                if (panel) panel.classList.toggle('open');
            });
            li1.appendChild(a1);
            navLinks.appendChild(li1);

            const li2 = document.createElement('li');
            li2.id = 'admin-nav-logout';
            const a2 = document.createElement('a');
            a2.href = '#';
            a2.className = 'admin-nav-link';
            a2.innerHTML = '<i class="fas fa-right-from-bracket"></i> Deconectare';
            a2.addEventListener('click', async (e) => {
                e.preventDefault();
                await sb.auth.signOut();
                removeAdminUI();
                showLoginModal();
            });
            li2.appendChild(a2);
            navLinks.appendChild(li2);
        }

        // Also add to mobile menu
        const mobileMenu = document.querySelector('#mobile-menu ul');
        if (mobileMenu) {
            const mli1 = document.createElement('li');
            mli1.className = 'admin-mobile-item';
            mli1.innerHTML = '<a href="#" class="admin-nav-link"><i class="fas fa-sliders"></i> Panou admin</a>';
            mli1.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('slider-panel')?.classList.toggle('open');
                document.getElementById('mobile-menu')?.classList.remove('open');
                document.querySelector('.nav-toggle')?.classList.remove('active');
                document.body.style.overflow = '';
            });
            mobileMenu.appendChild(mli1);

            const mli2 = document.createElement('li');
            mli2.className = 'admin-mobile-item';
            mli2.innerHTML = '<a href="#" class="admin-nav-link"><i class="fas fa-right-from-bracket"></i> Deconectare</a>';
            mli2.querySelector('a').addEventListener('click', async (e) => {
                e.preventDefault();
                await sb.auth.signOut();
                removeAdminUI();
                showLoginModal();
            });
            mobileMenu.appendChild(mli2);
        }
    }

    // ── Remove admin UI on logout ─────────────────────────────────────
    function removeAdminUI() {
        document.getElementById('admin-nav-items')?.remove();
        document.getElementById('admin-nav-logout')?.remove();
        document.querySelectorAll('.admin-mobile-item').forEach(el => el.remove());
        document.getElementById('sp-save-btn')?.remove();
        document.getElementById('sp-admin-info')?.remove();
        document.getElementById('slider-panel')?.classList.remove('open');
    }

    // ── Login modal ────────────────────────────────────────────────────
    function showLoginModal() {
        const overlay = document.createElement('div');
        overlay.id = 'admin-overlay';
        overlay.innerHTML = `
            <div id="admin-modal">
                <h2>Admin login</h2>
                <input id="admin-email"    type="email"    placeholder="Email" autocomplete="username">
                <input id="admin-password" type="password" placeholder="Parol\u0103" autocomplete="current-password">
                <button id="admin-submit">Intr\u0103</button>
                <div id="admin-error"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        const emailEl  = overlay.querySelector('#admin-email');
        const passEl   = overlay.querySelector('#admin-password');
        const submitEl = overlay.querySelector('#admin-submit');
        const errorEl  = overlay.querySelector('#admin-error');

        async function doLogin() {
            errorEl.textContent = '';
            submitEl.disabled = true;
            submitEl.textContent = 'Se conecteaz\u0103\u2026';
            const { error } = await sb.auth.signInWithPassword({
                email: emailEl.value.trim(),
                password: passEl.value,
            });
            if (error) {
                errorEl.textContent = 'Email sau parol\u0103 gre\u0219it\u0103.';
                submitEl.disabled = false;
                submitEl.textContent = 'Intr\u0103';
            } else {
                overlay.remove();
                onAdminReady();
            }
        }

        submitEl.addEventListener('click', doLogin);
        overlay.addEventListener('keydown', e => {
            if (e.key === 'Enter') doLogin();
        });
        emailEl.focus();
    }

    // ── Save button ────────────────────────────────────────────────────
    function injectSaveButton() {
        const panel = document.getElementById('slider-panel');
        if (!panel || document.getElementById('sp-save-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'sp-save-btn';
        btn.textContent = 'Salveaz\u0103 pentru public';
        panel.appendChild(btn);

        btn.addEventListener('click', async () => {
            if (!window.__getCurrentThemeConfig) return;
            const config = window.__getCurrentThemeConfig();
            btn.disabled = true;
            btn.textContent = 'Se salveaz\u0103\u2026';

            console.log('[Admin] Saving config:', config);

            // Use .select() to force return=representation and verify the update
            const { data, error } = await sb
                .from('settings')
                .update({ config: config, updated_at: new Date().toISOString() })
                .eq('id', 1)
                .select();

            console.log('[Admin] Save result:', { data, error });

            btn.disabled = false;
            if (error) {
                console.error('[Admin] Save error:', error);
                btn.textContent = '\u2715 Eroare: ' + error.message;
                setTimeout(() => { btn.textContent = 'Salveaz\u0103 pentru public'; }, 3000);
            } else if (!data || data.length === 0) {
                console.warn('[Admin] Save returned 0 rows — RLS may be blocking the update');
                btn.textContent = '\u2715 Acces refuzat (RLS)';
                setTimeout(() => { btn.textContent = 'Salveaz\u0103 pentru public'; }, 3000);
            } else {
                btn.textContent = '\u2713 Salvat!';
                setTimeout(() => { btn.textContent = 'Salveaz\u0103 pentru public'; }, 2000);
            }
        });

        // Listen for auth expiry
        sb.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                removeAdminUI();
                showLoginModal();
            }
        });
    }

    // ── Admin info section ─────────────────────────────────────────────
    function injectAdminInfo() {
        const panel = document.getElementById('slider-panel');
        if (!panel || document.getElementById('sp-admin-info')) return;

        const info = document.createElement('div');
        info.id = 'sp-admin-info';
        info.className = 'sp-admin-info';
        info.innerHTML = `
            <strong>Versiune site:</strong> 1.0.0<br>
            <strong>Ultima salvare:</strong> <span id="admin-last-save">se \u00eencarc\u0103\u2026</span>
        `;
        panel.appendChild(info);

        // Fetch last save time from DB
        sb.from('settings').select('updated_at').eq('id', 1).single().then(({ data }) => {
            const el = document.getElementById('admin-last-save');
            if (el && data?.updated_at) {
                const d = new Date(data.updated_at);
                el.textContent = d.toLocaleDateString('ro-RO') + ' ' + d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
            } else if (el) {
                el.textContent = 'necunoscut';
            }
        });
    }

})();
