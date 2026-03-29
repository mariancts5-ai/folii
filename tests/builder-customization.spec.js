const { test, expect } = require('@playwright/test');

// Helper: wait for preview iframe to be ready
async function waitForPreview(page) {
  const iframe = page.frameLocator('#preview-frame');
  await iframe.locator('body').waitFor({ timeout: 15000 });
  await expect(page.locator('#preview-loading')).toHaveClass(/hidden/, { timeout: 10000 });
  return iframe;
}

// Helper: get a CSS variable value from the iframe's :root
async function getCssVar(page, varName) {
  return await page.evaluate((name) => {
    const iframe = document.getElementById('preview-frame');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    return getComputedStyle(doc.documentElement).getPropertyValue(name).trim();
  }, varName);
}

// Helper: set slider value via JS and dispatch input event
async function setSlider(page, paramName, value) {
  await page.evaluate(({ param, val }) => {
    const slider = document.querySelector(`input[type="range"][data-param="${param}"]`);
    if (slider) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      ).set;
      nativeInputValueSetter.call(slider, val);
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, { param: paramName, val: String(value) });
}

// Helper: toggle a module checkbox via JS (checkboxes are visually hidden)
async function toggleModule(page, moduleId, enable) {
  await page.evaluate(({ id, en }) => {
    const cb = document.querySelector(`.module-checkbox[data-module="${id}"]`);
    if (cb && cb.checked !== en) {
      cb.checked = en;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, { id: moduleId, en: enable });
}

test.describe('Builder Page Load', () => {
  test('builder page loads with sidebar and preview', async ({ page }) => {
    await page.goto('/builder');

    await expect(page.locator('.builder-sidebar')).toBeVisible();
    await expect(page.locator('#preview-frame')).toBeVisible();

    const themeCards = page.locator('.theme-card');
    await expect(themeCards).not.toHaveCount(0);

    await expect(page.locator('input[data-param="accentHue"]')).toBeVisible();
    await expect(page.locator('input[data-param="bgLightness"]')).toBeVisible();
  });

  test('default theme is selected and preview loads', async ({ page }) => {
    await page.goto('/builder');
    const iframe = await waitForPreview(page);

    const activeTheme = page.locator('.theme-card.active');
    await expect(activeTheme).toHaveCount(1);

    await expect(iframe.locator('body')).not.toBeEmpty();
  });
});

test.describe('Theme Selection', () => {
  test('switching theme changes preview content', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    const initialTheme = await page.locator('.theme-card.active').getAttribute('data-theme');
    const targetTheme = initialTheme === 'cafenea' ? 'frizerie' : 'cafenea';
    await page.locator(`.theme-card[data-theme="${targetTheme}"]`).click();

    await waitForPreview(page);

    await expect(page.locator(`.theme-card[data-theme="${targetTheme}"]`)).toHaveClass(/active/);
    await expect(page.locator(`.theme-card[data-theme="${initialTheme}"]`)).not.toHaveClass(/active/);
  });

  test('switching theme updates global param slider values', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    await page.locator('.theme-card[data-theme="auto"]').click();
    await waitForPreview(page);
    const autoHue = await page.locator('input[data-param="accentHue"]').inputValue();

    await page.locator('.theme-card[data-theme="cafenea"]').click();
    await waitForPreview(page);
    const cafeneaHue = await page.locator('input[data-param="accentHue"]').inputValue();

    expect(autoHue).not.toBe(cafeneaHue);
  });
});

test.describe('Global Param Sliders — Real-time CSS Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);
  });

  test('accent hue slider changes --accent-h in preview', async ({ page }) => {
    const before = await getCssVar(page, '--accent-h');
    const newHue = before === '180' ? '90' : '180';
    await setSlider(page, 'accentHue', newHue);
    await page.waitForTimeout(300);
    const after = await getCssVar(page, '--accent-h');
    expect(after).toBe(newHue);
  });

  test('accent saturation slider changes --accent-s in preview', async ({ page }) => {
    await setSlider(page, 'accentSat', '30');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--accent-s')).toBe('30%');
  });

  test('background lightness slider changes --bg-l in preview', async ({ page }) => {
    await setSlider(page, 'bgLightness', '15');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--bg-l')).toBe('15%');
  });

  test('background hue slider changes --bg-h in preview', async ({ page }) => {
    await setSlider(page, 'bgHue', '120');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--bg-h')).toBe('120');
  });

  test('background saturation slider changes --bg-s in preview', async ({ page }) => {
    await setSlider(page, 'bgSat', '60');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--bg-s')).toBe('60%');
  });

  test('text lightness slider changes --text-l in preview', async ({ page }) => {
    await setSlider(page, 'textLightness', '75');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--text-l')).toBe('75%');
  });

  test('border alpha slider changes --border-a in preview', async ({ page }) => {
    await setSlider(page, 'borderAlpha', '25');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--border-a')).toBe('25');
  });

  test('border radius slider changes --radius in preview', async ({ page }) => {
    await setSlider(page, 'borderRadius', '16');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--radius')).toBe('16px');
  });

  test('card lightness slider changes --card-l in preview', async ({ page }) => {
    await setSlider(page, 'cardLightness', '12');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--card-l')).toBe('12%');
  });

  test('font family dropdown changes --font in preview', async ({ page }) => {
    const fontSelect = page.locator('select[data-param="fontFamily"]');
    await fontSelect.selectOption('Playfair Display');
    await page.waitForTimeout(300);
    expect(await getCssVar(page, '--font')).toContain('Playfair Display');
  });

  test('button style dropdown triggers re-render with new style', async ({ page }) => {
    const styleSelect = page.locator('select[data-param="buttonStyle"]');
    await styleSelect.selectOption('glass');
    await page.waitForTimeout(1500);
    await waitForPreview(page);
    expect(await getCssVar(page, '--btn-style')).toBe('glass');
  });
});

test.describe('Slider Visual Impact', () => {
  test('changing accent hue visually changes accent color in preview', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    await setSlider(page, 'accentHue', '0');
    await page.waitForTimeout(500);
    const accentRed = await page.evaluate(() => {
      const doc = document.getElementById('preview-frame').contentDocument;
      return getComputedStyle(doc.documentElement).getPropertyValue('--accent').trim();
    });

    await setSlider(page, 'accentHue', '240');
    await page.waitForTimeout(500);
    const accentBlue = await page.evaluate(() => {
      const doc = document.getElementById('preview-frame').contentDocument;
      return getComputedStyle(doc.documentElement).getPropertyValue('--accent').trim();
    });

    expect(accentRed).not.toBe(accentBlue);
  });

  test('changing background lightness visually changes page background', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    const getBgColor = async () => {
      return await page.evaluate(() => {
        const doc = document.getElementById('preview-frame').contentDocument;
        return getComputedStyle(doc.body).backgroundColor;
      });
    };

    await setSlider(page, 'bgLightness', '2');
    await page.waitForTimeout(500);
    const bgDark = await getBgColor();

    await setSlider(page, 'bgLightness', '18');
    await page.waitForTimeout(500);
    const bgLight = await getBgColor();

    expect(bgDark).not.toBe(bgLight);
  });
});

test.describe('Module Toggles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);
  });

  test('disabling a module hides it in the preview', async ({ page }) => {
    // About module is enabled by default on cafenea
    const iframe = page.frameLocator('#preview-frame');
    await expect(iframe.locator('#module-about')).toBeVisible({ timeout: 5000 });

    // Disable about
    await toggleModule(page, 'about', false);
    await page.waitForTimeout(1500);
    await waitForPreview(page);

    const iframe2 = page.frameLocator('#preview-frame');
    await expect(iframe2.locator('#module-about')).toHaveCount(0, { timeout: 5000 });
  });

  test('enabling a module shows it in the preview', async ({ page }) => {
    // Disable gallery, then re-enable
    await toggleModule(page, 'gallery', false);
    await page.waitForTimeout(1500);
    await waitForPreview(page);

    // Verify it's gone
    const iframe1 = page.frameLocator('#preview-frame');
    await expect(iframe1.locator('#module-gallery')).toHaveCount(0, { timeout: 5000 });

    // Re-enable
    await toggleModule(page, 'gallery', true);
    await page.waitForTimeout(1500);
    await waitForPreview(page);

    const iframe2 = page.frameLocator('#preview-frame');
    await expect(iframe2.locator('#module-gallery')).toBeVisible({ timeout: 5000 });
  });

  test('toggling multiple modules updates preview correctly', async ({ page }) => {
    // Enable faq and contact
    await toggleModule(page, 'faq', true);
    await toggleModule(page, 'contact', true);
    await page.waitForTimeout(1500);
    await waitForPreview(page);

    const iframe = page.frameLocator('#preview-frame');
    await expect(iframe.locator('#module-faq')).toBeVisible({ timeout: 5000 });
    await expect(iframe.locator('#module-contact')).toBeVisible({ timeout: 5000 });

    // Disable both
    await toggleModule(page, 'faq', false);
    await toggleModule(page, 'contact', false);
    await page.waitForTimeout(1500);
    await waitForPreview(page);

    const iframe2 = page.frameLocator('#preview-frame');
    await expect(iframe2.locator('#module-faq')).toHaveCount(0, { timeout: 5000 });
    await expect(iframe2.locator('#module-contact')).toHaveCount(0, { timeout: 5000 });
  });
});

test.describe('Content Generation', () => {
  test('generate button fetches new content and reloads preview', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    await page.locator('#btn-generate').click();
    await waitForPreview(page);

    const iframe = page.frameLocator('#preview-frame');
    const body = await iframe.locator('body').textContent();
    expect(body.length).toBeGreaterThan(50);
  });
});

test.describe('Export', () => {
  test('export button downloads a ZIP file', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.locator('#btn-export').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });
});

test.describe('Module Parameters', () => {
  test('expanding module params reveals controls', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    const expander = page.locator('.module-expand').first();
    if (await expander.count() > 0) {
      await expander.click();

      const moduleId = await expander.getAttribute('data-module');
      if (moduleId) {
        const paramsPanel = page.locator(`#params-${moduleId}`);
        await expect(paramsPanel).toBeVisible({ timeout: 3000 });
      }
    }
  });
});

test.describe('Combined Workflow', () => {
  test('full customization flow: theme → sliders → modules → export', async ({ page }) => {
    await page.goto('/builder');
    await waitForPreview(page);

    // 1. Select restaurant theme
    await page.locator('.theme-card[data-theme="restaurant"]').click();
    await waitForPreview(page);
    await expect(page.locator('.theme-card[data-theme="restaurant"]')).toHaveClass(/active/);

    // 2. Verify theme defaults loaded in preview
    const themeHue = await getCssVar(page, '--accent-h');
    expect(themeHue).toBe('350'); // restaurant default

    // 3. Adjust sliders (slider CSS var propagation tested in detail above)
    await setSlider(page, 'accentSat', '80');
    await setSlider(page, 'borderRadius', '20');
    // Verify the slider UI values changed
    const satVal = await page.evaluate(() =>
      document.querySelector('input[data-param="accentSat"]').value
    );
    expect(satVal).toBe('80');

    // 4. Toggle a module (testimonials is on by default for restaurant)
    await toggleModule(page, 'testimonials', false);
    await page.waitForTimeout(1500);
    await waitForPreview(page);

    const iframe = page.frameLocator('#preview-frame');
    await expect(iframe.locator('#module-testimonials')).toHaveCount(0, { timeout: 5000 });

    // 5. Export
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.locator('#btn-export').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
  });
});
