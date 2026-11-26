// Renders the link-preview image (og.html) to public/og.png at 1200 x 630.
//   node scripts/og/render.mjs
import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1300, height: 700 } });
await page.goto(pathToFileURL(path.join(here, 'og.html')).href);
await page.evaluate(() => document.fonts.ready);
const out = path.join(here, '../../public/og.png');
await page.locator('#og').screenshot({ path: out });
await browser.close();
console.log('saved', out);
