// Takes the project screenshots in src/assets/work/ from the live sites.
// Rerun after a featured site changes:  npm run shots

import { chromium } from '@playwright/test';

const OUT = 'src/assets/work';
const sites = [
  { slug: 'wimika', url: 'https://wimika.ng' },
  { slug: 'ellanielos', url: 'https://ellanielos.com.ng' },
  { slug: 'chidinma', url: 'https://dinmajj.github.io' },
];
const only = process.argv[2];
const views = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, scale: 1 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, scale: 2 },
];

// Uses the Chrome installed on this machine, so no Playwright browser download is needed.
const browser = await chromium.launch({ channel: 'chrome' });
// `npm run shots -- chidinma` retakes one site only.
for (const site of sites.filter((s) => !only || s.slug === only)) {
  for (const view of views) {
    const page = await browser.newPage({ viewport: view.viewport, deviceScaleFactor: view.scale, reducedMotion: 'reduce' });
    await page.goto(site.url, { waitUntil: 'networkidle' });
    // Let entrance animations and web fonts settle before the capture.
    await page.waitForTimeout(1500);
    // Hide floating corner widgets (chat launchers, host badges) so they don't cover the design.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        const style = getComputedStyle(el);
        if (style.position !== 'fixed') continue;
        const box = el.getBoundingClientRect();
        if (box.top > innerHeight / 2 && box.width < innerWidth / 2) el.style.visibility = 'hidden';
      }
    });
    const path = `${OUT}/${site.slug}-${view.name}.jpg`;
    await page.screenshot({ path, type: 'jpeg', quality: 85 });
    console.log('saved', path);
    await page.close();
  }
}
await browser.close();
