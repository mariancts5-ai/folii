/**
 * FoliiBuilder — Builder page interactivity.
 *
 * Manages theme selection, global/module params, live preview
 * communication (postMessage), content generation, and export.
 */
(function () {
    'use strict';

    const DATA = window.__BUILDER_DATA__;
    const iframe = document.getElementById('preview-frame');
    const loading = document.getElementById('preview-loading');

    // ---- State ----
    let currentThemeId = DATA.selectedTheme;
    let globalParams = {};
    let enabledModules = [];
    let moduleParams = {};
    let content = null; // populated after generation
    let previewReady = false;
    let debounceTimer = null;

    // ---- Init ----
    init();

    function init() {
        selectTheme(currentThemeId, true);
        bindThemeCards();
        bindGlobalParams();
        bindModuleToggles();
        bindModuleParams();
        bindModuleExpanders();
        bindToolbarButtons();

        // Listen for preview ready signal
        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'previewReady') {
                previewReady = true;
                loading.classList.add('hidden');
            }
        });
    }

    // ---- Theme Selection ----

    function selectTheme(themeId, initial) {
        const theme = DATA.themes.find(t => t.id === themeId);
        if (!theme) return;

        currentThemeId = themeId;
        globalParams = { ...theme.defaultGlobalParams };
        enabledModules = [...theme.defaultModules];
        moduleParams = {};

        // Update UI
        document.querySelectorAll('.theme-card').forEach(c => {
            c.classList.toggle('active', c.dataset.theme === themeId);
        });

        // Update global param sliders
        updateGlobalParamUI();

        // Update module checkboxes
        updateModuleUI();

        // Generate content and load preview
        generateContentAndPreview();
    }

    function bindThemeCards() {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', () => selectTheme(card.dataset.theme));
        });
    }

    // ---- Global Params ----

    function updateGlobalParamUI() {
        // Map param names to input values
        const paramMap = {
            accentHue: globalParams.accentHue,
            accentSat: globalParams.accentSat,
            bgHue: globalParams.bgHue,
            bgSat: globalParams.bgSat,
            bgLightness: globalParams.bgLightness,
            textLightness: globalParams.textLightness,
            borderAlpha: globalParams.borderAlpha,
            borderRadius: globalParams.borderRadius,
            cardLightness: globalParams.cardLightness
        };

        document.querySelectorAll('.global-param').forEach(input => {
            const param = input.dataset.param;
            if (paramMap[param] !== undefined) {
                input.value = paramMap[param];
                const valEl = document.querySelector(`.param-val[data-for="${param}"]`);
                if (valEl) valEl.textContent = paramMap[param];
            }
        });

        // Selects
        const fontSelect = document.getElementById('font-select');
        if (fontSelect) fontSelect.value = globalParams.fontFamily || 'Inter';
        const btnSelect = document.getElementById('btn-style-select');
        if (btnSelect) btnSelect.value = globalParams.buttonStyle || 'outline';
    }

    function bindGlobalParams() {
        document.querySelectorAll('.global-param').forEach(input => {
            input.addEventListener('input', () => {
                const param = input.dataset.param;
                globalParams[param] = parseInt(input.value);
                const valEl = document.querySelector(`.param-val[data-for="${param}"]`);
                if (valEl) valEl.textContent = input.value;

                // Send real-time update to iframe
                sendToPreview('updateGlobalParams', globalParams);
            });
        });

        document.querySelectorAll('.global-param-select').forEach(select => {
            select.addEventListener('change', () => {
                const param = select.dataset.param;
                globalParams[param] = select.value;

                if (param === 'fontFamily') {
                    sendToPreview('updateGlobalParams', { fontFamily: select.value });
                } else {
                    // Button style needs a full re-render
                    debouncedPreviewReload();
                }
            });
        });
    }

    // ---- Module Toggles ----

    function updateModuleUI() {
        document.querySelectorAll('.module-checkbox').forEach(cb => {
            const moduleId = cb.dataset.module;
            if (!cb.disabled) {
                cb.checked = enabledModules.includes(moduleId);
            }
        });
    }

    function bindModuleToggles() {
        document.querySelectorAll('.module-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const moduleId = cb.dataset.module;
                if (cb.checked) {
                    if (!enabledModules.includes(moduleId)) {
                        enabledModules.push(moduleId);
                    }
                } else {
                    enabledModules = enabledModules.filter(m => m !== moduleId);
                }
                // Module toggle needs server re-render for correct HTML structure
                debouncedPreviewReload();
            });
        });
    }

    // ---- Module Params ----

    function bindModuleParams() {
        // Range params
        document.querySelectorAll('.module-param').forEach(input => {
            input.addEventListener('input', () => {
                const moduleId = input.dataset.module;
                const paramId = input.dataset.param;
                if (!moduleParams[moduleId]) moduleParams[moduleId] = {};
                moduleParams[moduleId][paramId] = parseInt(input.value);
                const valEl = document.querySelector(`.param-val[data-for="${moduleId}-${paramId}"]`);
                if (valEl) valEl.textContent = input.value;
                debouncedPreviewReload();
            });
        });

        // Select params
        document.querySelectorAll('.module-param-select').forEach(select => {
            select.addEventListener('change', () => {
                const moduleId = select.dataset.module;
                const paramId = select.dataset.param;
                if (!moduleParams[moduleId]) moduleParams[moduleId] = {};
                moduleParams[moduleId][paramId] = select.value;
                debouncedPreviewReload();
            });
        });

        // Toggle params
        document.querySelectorAll('.module-param-toggle').forEach(cb => {
            cb.addEventListener('change', () => {
                const moduleId = cb.dataset.module;
                const paramId = cb.dataset.param;
                if (!moduleParams[moduleId]) moduleParams[moduleId] = {};
                moduleParams[moduleId][paramId] = cb.checked;
                debouncedPreviewReload();
            });
        });
    }

    // ---- Module Expanders ----

    function bindModuleExpanders() {
        document.querySelectorAll('.module-expand').forEach(btn => {
            btn.addEventListener('click', () => {
                const moduleId = btn.dataset.module;
                const panel = document.getElementById('params-' + moduleId);
                if (!panel) return;
                const isOpen = panel.style.display !== 'none';
                panel.style.display = isOpen ? 'none' : 'block';
                btn.classList.toggle('open', !isOpen);
            });
        });
    }

    // ---- Toolbar ----

    function bindToolbarButtons() {
        document.getElementById('btn-generate').addEventListener('click', generateContentAndPreview);
        document.getElementById('btn-export').addEventListener('click', exportSite);
    }

    // ---- Preview ----

    function sendToPreview(type, data) {
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type, data }, '*');
        }
    }

    function debouncedPreviewReload() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => loadPreview(), 400);
    }

    function loadPreview() {
        if (!content) return;
        previewReady = false;
        loading.classList.remove('hidden');

        const config = buildConfig();

        fetch('/api/preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        })
            .then(res => res.text())
            .then(html => {
                // Write HTML directly into iframe
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(html);
                doc.close();
                // previewReady will be set when iframe sends 'previewReady' message
                // Fallback timeout in case postMessage doesn't fire
                setTimeout(() => loading.classList.add('hidden'), 1500);
            })
            .catch(err => {
                console.error('Preview error:', err);
                loading.classList.add('hidden');
            });
    }

    // ---- Content Generation ----

    function generateContentAndPreview() {
        loading.classList.remove('hidden');

        fetch('/api/content/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ themeId: currentThemeId })
        })
            .then(res => res.json())
            .then(data => {
                content = data;
                loadPreview();
            })
            .catch(err => {
                console.error('Content generation error:', err);
                loading.classList.add('hidden');
            });
    }

    // ---- Export ----

    function exportSite() {
        if (!content) {
            alert('Mai întâi generează conținut!');
            return;
        }

        const config = buildConfig();
        const btn = document.getElementById('btn-export');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se exportă...';
        btn.disabled = true;

        fetch('/api/export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        })
            .then(res => {
                const filename = res.headers.get('Content-Disposition')?.match(/filename="?(.+)"?/)?.[1] || 'site.zip';
                return res.blob().then(blob => ({ blob, filename }));
            })
            .then(({ blob, filename }) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error('Export error:', err);
                alert('Eroare la export. Încearcă din nou.');
            })
            .finally(() => {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            });
    }

    // ---- Build Config ----

    function buildConfig() {
        return {
            themeId: currentThemeId,
            globalParams: globalParams,
            enabledModules: enabledModules,
            moduleParams: moduleParams,
            content: content
        };
    }
})();
