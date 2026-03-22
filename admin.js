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
    `;
    document.head.appendChild(style);

    // ── Check existing session ─────────────────────────────────────────
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
        injectSaveButton();
    } else {
        showLoginModal();
    }

    // ── Login modal ────────────────────────────────────────────────────
    function showLoginModal() {
        const overlay = document.createElement('div');
        overlay.id = 'admin-overlay';
        overlay.innerHTML = `
            <div id="admin-modal">
                <h2>Admin login</h2>
                <input id="admin-email"    type="email"    placeholder="Email" autocomplete="username">
                <input id="admin-password" type="password" placeholder="Parolă" autocomplete="current-password">
                <button id="admin-submit">Intră</button>
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
            submitEl.textContent = 'Se conectează…';
            const { error } = await sb.auth.signInWithPassword({
                email: emailEl.value.trim(),
                password: passEl.value,
            });
            if (error) {
                errorEl.textContent = 'Email sau parolă greșită.';
                submitEl.disabled = false;
                submitEl.textContent = 'Intră';
            } else {
                overlay.remove();
                injectSaveButton();
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
        btn.textContent = 'Salvează pentru public';
        panel.appendChild(btn);

        btn.addEventListener('click', async () => {
            if (!window.__getCurrentThemeConfig) return;
            const config = window.__getCurrentThemeConfig();
            btn.disabled = true;
            btn.textContent = 'Se salvează…';

            const { error } = await sb
                .from('settings')
                .update({ config, updated_at: new Date().toISOString() })
                .eq('id', 1);

            btn.disabled = false;
            if (error) {
                btn.textContent = '✕ Eroare la salvare';
                setTimeout(() => { btn.textContent = 'Salvează pentru public'; }, 2500);
            } else {
                btn.textContent = '✓ Salvat!';
                setTimeout(() => { btn.textContent = 'Salvează pentru public'; }, 2000);
            }
        });

        // Listen for auth expiry
        sb.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                btn.remove();
                showLoginModal();
            }
        });
    }

})();
