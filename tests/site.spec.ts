import { test, expect } from '@playwright/test';
import { hireRoutes, projects, testimonials } from '../src/data/profile';
import { caseStudies } from '../src/data/case-studies';

test.beforeEach(async ({ page }) => {
  // Tests never write to the real feedback database.
  await page.route('**/firestore.googleapis.com/**', (route) => route.fulfill({ status: 200, body: '{}' }));
  await page.goto('/');
});

test.describe('home', () => {
  test('has one h1 and a descriptive title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Daniel Iyoha/);
  });

  test('lists every project once, each with a proof figure', async ({ page }) => {
    const tiles = page.locator('[data-work-list] [data-tile]');
    await expect(tiles).toHaveCount(projects.length);
    for (const [i, p] of projects.entries()) {
      await expect(tiles.nth(i).locator('.card-title')).toHaveText(p.title);
      if (p.stat) await expect(tiles.nth(i).locator('.card-stat')).toHaveText(p.stat);
      // Screen readers hear the title first, then the kind of work and the proof.
      expect((await tiles.nth(i).getAttribute('aria-label'))!.startsWith(`${p.title}. `)).toBe(true);
    }
  });

  test('old links to the Websites and QA sections land on the work', async ({ page }) => {
    for (const old of ['websites', 'qa']) {
      await page.goto(`/#${old}`);
      await expect(page.locator('#work h2')).toBeInViewport();
    }
  });
});

test.describe('testimonials', () => {
  test('show only real quotes, each with a named author', async ({ page }) => {
    const quotes = page.locator('#testimonials figure.quote');
    // Hidden entirely until the data file has a quote.
    await expect(page.locator('#testimonials')).toHaveCount(testimonials.length ? 1 : 0);
    await expect(quotes).toHaveCount(testimonials.length);
    for (const t of testimonials) {
      // The longest quote is shown first, so find each one by its author.
      const quote = quotes.filter({ has: page.locator('.name', { hasText: t.name }) });
      await expect(quote.locator('blockquote')).toHaveText(t.quote);
      // A highlight only emphasises the quote's own words, never adds any.
      if (t.highlight) await expect(quote.locator('mark')).toHaveText(t.highlight);
      await expect(quote.locator('.name')).toHaveText(t.name);
      await expect(quote.locator('.role')).toContainText(t.role);
    }
  });
});

test.describe('navigation', () => {
  for (const name of ['Work', 'Experience', 'Skills', 'Contact']) {
    test(`${name} link scrolls to its section`, async ({ page }) => {
      await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#${name.toLowerCase()}$`));
      await expect(page.locator(`#${name.toLowerCase()} h2`)).toBeInViewport();
    });
  }
});

test.describe('hiring menu', () => {
  const menuButton = (page) => page.getByRole('button', { name: 'Hiring?' });
  const panel = (page) => page.getByRole('group', { name: 'The short route' });
  const expectedHref = (slug: string, home = true) =>
    slug === 'tests' ? `${home ? '' : '/'}#test-run` : slug === 'websites' ? '/websites' : `/work/${slug}`;

  test('each kind of hire gets its own three picks and next step', async ({ page }) => {
    await menuButton(page).click();
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'true');
    for (const route of hireRoutes) {
      await panel(page).getByRole('radio', { name: route.label }).check();
      const shown = panel(page).locator(`[data-route="${route.id}"]`);
      await expect(shown).toBeVisible();
      // Only the picked route is on screen.
      await expect(panel(page).locator('.hire-route:visible')).toHaveCount(1);
      const hrefs = await shown.locator('li a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
      expect(hrefs).toEqual(route.picks.map((p) => expectedHref(p.slug)));
      for (const href of hrefs) if (!href!.startsWith('#')) expect((await page.request.get(href!)).ok()).toBe(true);
      const primary = shown.locator('.hire-actions a.solid');
      if (route.primary === 'cv') await expect(primary).toHaveAttribute('href', '/Daniel_Iyoha_CV.pdf');
      else await expect(primary).toHaveAttribute('href', /wa\.me\/.*website/);
    }
  });

  test('Escape or a click outside closes it', async ({ page }) => {
    await menuButton(page).click();
    await expect(panel(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel(page)).toBeHidden();
    await expect(menuButton(page)).toBeFocused();
    await menuButton(page).click();
    await page.mouse.click(5, 500);
    await expect(panel(page)).toBeHidden();
  });

  test('remembers the pick on the next page', async ({ page }) => {
    await menuButton(page).click();
    await panel(page).getByRole('radio', { name: 'A business website' }).check();
    await page.goto('/work/linkhut');
    await menuButton(page).click();
    await expect(panel(page).locator('[data-route="business"]')).toBeVisible();
    await expect(panel(page).getByRole('link', { name: /All the ways to reach me/ })).toHaveAttribute('href', '/#contact');
  });

  test('on a phone it takes the Contact pill’s place and fits the screen', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await expect(page.getByRole('navigation', { name: 'Sections' })).toBeHidden();
    await menuButton(page).click();
    const box = (await panel(page).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    await expect(panel(page).getByRole('link', { name: /All the ways to reach me/ })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('links', () => {
  test('external links open safely in a new tab', async ({ page }) => {
    const external = page.locator('a[href^="http"]');
    expect(await external.count()).toBeGreaterThan(0);
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('the footer links to this suite on GitHub', async ({ page }) => {
    await expect(page.locator('.foot').getByRole('link', { name: /read the tests/ })).toHaveAttribute(
      'href',
      'https://github.com/Iyoha-dan/daniel-iyoha-portfolio/blob/main/tests/site.spec.ts',
    );
  });

  test('CV download serves a PDF', async ({ page, request }) => {
    const href = await page.getByRole('link', { name: 'Download CV' }).first().getAttribute('href');
    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/pdf');
  });

  test('WhatsApp links open a chat with a message started', async ({ page }) => {
    const links = page.locator('#contact a[href^="https://wa.me/"]');
    await expect(links).toHaveCount(1);
    for (const link of await links.all()) {
      const url = new URL((await link.getAttribute('href'))!);
      expect(url.pathname).toBe('/2349030851695');
      expect(url.searchParams.get('text')).toMatch(/^Hi Daniel/);
    }
  });

  test('email link opens a new message', async ({ page }) => {
    await expect(page.locator('.contact-email')).toHaveAttribute('href', 'mailto:danieliyoha6@gmail.com');
  });
});

test.describe('accessibility', () => {
  test('every image has alt text', async ({ page }) => {
    for (const img of await page.locator('img').all()) {
      await expect(img).toHaveAttribute('alt', /.*/);
    }
  });

  test('skip link moves focus to the content', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe('local time', () => {
  test('shows the current time in Lagos', async ({ page }) => {
    const lagos = () =>
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' }).format(new Date());
    const before = lagos();
    const shown = await page.locator('[data-lagos-time]').textContent();
    // Allow for the minute ticking over between reading the page and checking.
    expect([before, lagos()]).toContain(shown);
  });
});

test.describe('work index', () => {
  const tiles = (page) => page.locator('[data-work-list] [data-tile]');
  const item = (page, i: number) => page.locator(`[data-work-list] li[data-index="${i}"]`);
  const desktop = async (page) => {
    // Tall enough to show the whole Work section, so nothing scrolls under the mouse mid-test.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#work').scrollIntoViewIfNeeded();
  };

  test('every project opens its case study', async ({ page }) => {
    for (const tile of await tiles(page).all()) {
      const href = (await tile.getAttribute('href'))!;
      if (href.startsWith('#')) await expect(page.locator(href)).toHaveCount(1);
      else expect((await page.request.get(href)).ok()).toBe(true);
    }
  });

  test('desktop: pointing at a panel opens it, and clicking the open panel opens the page', async ({ page }) => {
    await desktop(page);
    await expect(item(page, 0)).toHaveAttribute('data-active', '');
    await tiles(page).nth(2).hover();
    await expect(item(page, 2)).toHaveAttribute('data-active', '');
    await expect(page.locator('[data-work-list] li[data-active]')).toHaveCount(1);
    // The open panel is the wide one.
    await expect
      .poll(async () => (await item(page, 2).boundingBox())!.width / (await item(page, 0).boundingBox())!.width)
      .toBeGreaterThan(3);
    const target = (await tiles(page).nth(2).getAttribute('href'))!;
    await tiles(page).nth(2).click();
    await expect(page).toHaveURL((url) => url.pathname === target);
  });

  test('desktop: a tap on a closed panel opens it first, without leaving the page', async ({ page }) => {
    await desktop(page);
    // A touch screen has no hover: the click arrives on its own.
    await tiles(page).nth(4).dispatchEvent('click');
    await expect(item(page, 4)).toHaveAttribute('data-active', '');
    await expect(page).toHaveURL((url) => url.pathname === '/');
  });

  test('the open card runs its checks and lands on the real results', async ({ page }) => {
    await desktop(page);
    for (const [i, p] of projects.entries()) {
      await tiles(page).nth(i).hover();
      const card = page.locator(`[data-card="${i}"]`);
      await expect(card).toHaveClass(/is-running/);
      const counters = card.locator('[data-count]');
      // Every number counts up to the figure in profile.ts, never past it or short of it.
      for (const el of await counters.all()) await expect(el).toHaveText((await el.getAttribute('data-count'))!);
      if (p.scores) await expect(counters).toHaveText(p.scores.values.map((s) => String(s.value)));
      if (p.results) await expect(counters).toHaveText([String(p.results.passed + p.results.failed)]);
      if (!p.results && p.checks) await expect(card.locator('.summary')).toHaveText(`${p.checks.length}/${p.checks.length} ${p.checksLabel!.toLowerCase()}`);
    }
  });

  test('with reduced motion the results show at once, without a replay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await desktop(page);
    const i = projects.findIndex((p) => p.results);
    await tiles(page).nth(i).hover();
    await expect(item(page, i)).toHaveAttribute('data-active', '');
    const card = page.locator(`[data-card="${i}"]`);
    await expect(card).not.toHaveClass(/is-running/);
    const p = projects[i];
    await expect(card.locator('[data-count]')).toHaveText(String(p.results!.passed + p.results!.failed));
  });

  test('keyboard focus opens a panel too', async ({ page }) => {
    await desktop(page);
    await tiles(page).nth(3).focus();
    await expect(item(page, 3)).toHaveAttribute('data-active', '');
  });

  test('phones: a swipeable carousel with dots, one card in focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const list = page.locator('[data-work-list]');
    await list.scrollIntoViewIfNeeded();
    // The cards scroll sideways inside the section, never the page.
    expect(await list.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await expect(page.locator('[data-track-count]')).toHaveText(`1 / ${projects.length}`);
    for (const tile of await tiles(page).all()) await expect(tile.locator('.card')).toHaveCSS('height', /^4[0-9]{2}px$/);
    await page.locator('[data-dot="3"]').click();
    await expect(item(page, 3)).toHaveAttribute('data-active', '');
    await expect(page.locator('[data-track-count]')).toHaveText(`4 / ${projects.length}`);
    await expect(page.locator('[data-dot="3"]')).toHaveAttribute('aria-current', 'true');
    const p = projects[3];
    if (p.scores) await expect(page.locator('[data-card="3"] [data-count]')).toHaveText(p.scores.values.map((s) => String(s.value)));
  });
});

test.describe('headline', () => {
  test('breaks on click and the tests put it back', async ({ page }) => {
    const root = page.locator('html');
    await expect(page.locator('h1')).toHaveText('I build websites, then I try to break them.');
    await page.getByRole('button', { name: 'break them.' }).click();
    await expect(root).toHaveAttribute('data-headline', 'broken');
    await expect(page.locator('.term-body li.sim-only')).toBeVisible();
    const runTests = page.getByRole('button', { name: 'Run tests' });
    await runTests.click();
    await expect(root).not.toHaveAttribute('data-headline');
    await expect(runTests).toBeHidden();
    await expect(page.locator('.term-body li.sim-only')).toBeHidden();
  });
});

test.describe('underline', () => {
  test('a dashed underline sits under each breakable word', async ({ page }) => {
    const words = page.locator('.breakable .word');
    await expect(words).toHaveCount(2);
    for (const word of await words.all()) {
      expect(await word.evaluate((w) => getComputedStyle(w, '::after').borderBottomStyle)).toBe('dashed');
    }
  });
});

test.describe('theme', () => {
  test('toggle switches the theme and remembers it', async ({ page }) => {
    const root = page.locator('html');
    const toggle = page.getByRole('button', { name: /Switch to (dark|light) theme/ });
    const before = (await toggle.getAttribute('aria-label'))!.includes('dark') ? 'light' : 'dark';
    const after = before === 'dark' ? 'light' : 'dark';
    await toggle.click();
    await expect(root).toHaveAttribute('data-theme', after);
    await expect(toggle).toHaveAttribute('aria-label', `Switch to ${before} theme`);
    await page.reload();
    await expect(root).toHaveAttribute('data-theme', after);
  });
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('test results collapse to one line and open on tap', async ({ page }) => {
    const panel = page.locator('#test-run');
    await expect(panel).not.toHaveAttribute('open');
    // The summary shows the previous run's result, passed or failed; this test is about the collapse.
    await expect(panel.locator('summary')).toContainText(/tests? (passed|failed)/);
    await expect(panel.locator('li:not(.sim-only)').first()).toBeHidden();
    await panel.locator('summary').click();
    await expect(panel.locator('li:not(.sim-only)').first()).toBeVisible();
  });
});

test.describe('project pages', () => {
  const withPages = projects.filter((p) => caseStudies[p.slug]);

  for (const p of withPages) {
    test(`${p.slug} page tells the story and links on`, async ({ page }) => {
      await page.goto(`/work/${p.slug}`);
      await expect(page.locator('h1')).toHaveText(p.title);
      await expect(page.locator('.lede')).toHaveText(caseStudies[p.slug].lede);
      await expect(page.locator('.case-body h2').first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'All work' })).toHaveAttribute('href', '/#work');
      // Websites say how they were built and how they were checked.
      if (p.group === 'web') {
        await expect(page.getByRole('heading', { name: 'What I built' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'How I checked it' })).toBeVisible();
      }
      // "Next project" leads to another real page.
      const next = (await page.getByRole('navigation', { name: 'Next project' }).getByRole('link').getAttribute('href'))!;
      expect((await page.request.get(next)).ok()).toBe(true);
      // It ends with a way to get in touch.
      const cta = page.locator('.cta');
      await expect(cta.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', /^mailto:/);
      await expect(cta.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    });
  }

  test('every work row opens a case study page', async ({ page }) => {
    const hrefs = await page.locator('[data-work-list] [data-tile]').evaluateAll((rows) => rows.map((r) => r.getAttribute('href')));
    expect(hrefs.filter((h) => h?.startsWith('/work/'))).toHaveLength(withPages.length);
  });

  test('a project page has no sideways scroll on a 360px phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(`/work/${withPages[0].slug}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('QA pages show real results, not placeholders', async ({ page }) => {
    for (const p of withPages.filter((q) => q.group === 'qa')) {
      await page.goto(`/work/${p.slug}`);
      const report = page.locator('[data-report]');
      await expect(report.locator('.redacted')).toHaveCount(0);
      if (p.results) {
        await expect(report).toContainText(`${p.results.passed} passed`);
        await expect(report).toContainText(`${p.results.failed} failed`);
      }
      for (const b of p.bugs ?? []) await expect(report).toContainText(b.id);
      for (const c of p.results ? [] : p.checks ?? []) await expect(report).toContainText(c);
    }
  });

  test('a project page says each thing once', async ({ page }) => {
    await page.goto('/work/linkhut');
    // "What I found" already gives the results, so there is no separate Outcome block.
    await expect(page.getByRole('heading', { name: 'Outcome' })).toHaveCount(0);
    for (const p of withPages.filter((q) => q.stack)) {
      await page.goto(`/work/${p.slug}`);
      // The stack is listed under "Built with", not repeated in the facts strip.
      await expect(page.locator('.facts dt', { hasText: 'Stack' })).toHaveCount(0);
      await expect(page.getByRole('heading', { name: 'Built with' })).toBeVisible();
    }
  });

  test('"Next project" says where you are in the list', async ({ page }) => {
    await page.goto(`/work/${withPages[0].slug}`);
    await expect(page.getByRole('navigation', { name: 'Next project' })).toContainText(`2 of ${withPages.length}`);
    await page.goto(`/work/${withPages.at(-1)!.slug}`);
    await expect(page.getByRole('navigation', { name: 'Next project' })).toContainText(`1 of ${withPages.length}`);
  });
});

test.describe('missing pages', () => {
  test('an unknown address gets a 404 with a way back', async ({ page }) => {
    const res = await page.goto('/no-such-page');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('This page failed its test.');
    await expect(page.locator('[data-path]')).toHaveText('/no-such-page');
    await expect(page.getByRole('link', { name: 'See my work' })).toHaveAttribute('href', '/#work');
    await expect(page.getByRole('navigation', { name: 'Projects' }).getByRole('link')).toHaveCount(projects.length);
  });
});

test.describe('bug hunt', () => {
  const bugs = ['delivery', 'total', 'phone', 'pay', 'coupon'];
  const spot = (page, id) => page.locator(`#bug-hunt [data-spot="${id}"]`);

  test('finding all five bugs ends the game', async ({ page }) => {
    await page.locator('#bug-hunt').scrollIntoViewIfNeeded();
    for (const id of bugs) await spot(page, id).click();
    await expect(page.locator('#bug-hunt [data-found]')).toHaveText('5');
    await expect(page.locator('#bug-hunt .found-list li.is-found')).toHaveCount(5);
    await expect(page.locator('#bug-hunt [data-end-line]')).toContainText('All 5');
  });

  test('tapping something that works counts as a miss', async ({ page }) => {
    await spot(page, 'title').click();
    await expect(page.locator('#bug-hunt [data-misses]')).toHaveText('1');
    await expect(page.locator('#bug-hunt [data-found]')).toHaveText('0');
  });

  test('can be played with a keyboard', async ({ page }) => {
    await spot(page, 'total').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#bug-hunt [data-found]')).toHaveText('1');
  });

  test('when time runs out, the missed bugs are shown', async ({ page }) => {
    // Reduced motion keeps the arcade's demo still, so fast-forwarding a minute doesn't draw 3,600 frames.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.install();
    await page.goto('/');
    await spot(page, 'phone').click();
    await page.clock.runFor(61_000);
    await expect(page.locator('#bug-hunt .found-list li.is-missed')).toHaveCount(4);
    await expect(page.locator('#bug-hunt [data-end-line]')).toContainText('1 of 5');
  });
});

test.describe('private inbox', () => {
  test('asks for sign-in, reads nothing before it, and stays out of search', async ({ page }) => {
    const reads: string[] = [];
    page.on('request', (r) => r.url().includes('firestore.googleapis.com') && reads.push(r.url()));
    await page.goto('/inbox');
    await expect(page.getByRole('heading', { name: 'Private inbox' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await page.waitForTimeout(500);
    expect(reads).toHaveLength(0);
  });

  test('is not linked from the site', async ({ page }) => {
    for (const path of ['/', '/websites', '/work/linkhut']) {
      await page.goto(path);
      await expect(page.locator('a[href*="inbox"]')).toHaveCount(0);
    }
  });
});

test.describe('bug blaster', () => {
  const game = (page) => page.locator('[data-blaster-dialog]');
  const play = (page) => page.locator('[data-blaster]').getByRole('button', { name: 'Play' });

  test('opens from the mini player, scores, and closes back to the button', async ({ page }) => {
    await play(page).click();
    await expect(page.getByRole('dialog', { name: 'Bug blaster' })).toBeVisible();
    await expect(game(page)).toHaveAttribute('data-state', 'ready');
    await page.keyboard.press('Space');
    await expect(game(page)).toHaveAttribute('data-state', 'play');
    // Sprint 1 sends its bugs straight down the middle, so holding fire from the start scores.
    await page.keyboard.down('Space');
    await expect(game(page)).not.toHaveAttribute('data-score', '0', { timeout: 10_000 });
    await page.keyboard.up('Space');
    await page.keyboard.press('Escape');
    await expect(game(page)).toBeHidden();
    await expect(play(page)).toBeFocused();
  });

  test('P pauses and Space carries on', async ({ page }) => {
    await play(page).click();
    await page.keyboard.press('Space');
    await page.keyboard.press('KeyP');
    await expect(game(page)).toHaveAttribute('data-state', 'paused');
    await page.keyboard.press('Space');
    await expect(game(page)).toHaveAttribute('data-state', 'play');
  });

  test('sound stays off until turned on, and is remembered', async ({ page }) => {
    await play(page).click();
    const sound = game(page).getByRole('button', { name: /Sound/ });
    await expect(sound).toHaveAttribute('aria-pressed', 'false');
    await sound.click();
    await expect(sound).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await play(page).click();
    await expect(game(page).getByRole('button', { name: /Sound/ })).toHaveAttribute('aria-pressed', 'true');
  });

  test('on a phone it fills the screen and a tap starts it', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await play(page).click();
    const canvas = game(page).locator('canvas');
    for (const el of [game(page), canvas, game(page).getByRole('button', { name: 'Close the game' })]) {
      const box = (await el.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(360);
    }
    await canvas.click();
    await expect(game(page)).toHaveAttribute('data-state', 'play');
  });
});

test.describe('site feedback', () => {
  const card = (page) => page.locator('[data-feedback]');
  const winGame = async (page) => {
    await page.locator('#bug-hunt').scrollIntoViewIfNeeded();
    for (const id of ['delivery', 'total', 'phone', 'pay', 'coupon']) await page.locator(`#bug-hunt [data-spot="${id}"]`).click();
  };
  // Catches what would be sent to Firestore and answers with the given status.
  const capture = async (page, status = 200) => {
    const sent: any[] = [];
    await page.route('**/firestore.googleapis.com/**', async (route) => {
      sent.push(route.request().postDataJSON());
      await route.fulfill({ status, body: '{}' });
    });
    return sent;
  };
  const fields = (body) => body.writes[0].update.fields;

  test('appears only after a game, then sends the rating and the note', async ({ page }) => {
    const sent = await capture(page);
    await expect(card(page)).toBeHidden();
    await winGame(page);
    await expect(card(page)).toBeVisible();
    await expect(card(page).locator('[data-fb-next]')).toBeDisabled();
    await card(page).getByRole('radio', { name: '4' }).check();
    await card(page).getByRole('button', { name: 'Next' }).click();
    await card(page).getByLabel('Anything broken or confusing?').fill('The coupon button looked off on my phone.');
    await card(page).getByRole('button', { name: 'Send' }).click();
    await expect(card(page).locator('[data-fb-done]')).toBeVisible();
    expect(sent).toHaveLength(1);
    expect(fields(sent[0])).toEqual({
      device: { stringValue: 'desktop' },
      ease: { integerValue: '4' },
      note: { stringValue: 'The coupon button looked off on my phone.' },
    });
    expect(sent[0].writes[0].updateTransforms).toEqual([{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }]);
    // Never asks the same visitor twice.
    await page.reload();
    await winGame(page);
    await page.waitForTimeout(1200);
    await expect(card(page)).toBeHidden();
  });

  test('Skip sends the rating alone', async ({ page }) => {
    const sent = await capture(page);
    await winGame(page);
    await card(page).getByRole('radio', { name: '2' }).check();
    await card(page).getByRole('button', { name: 'Next' }).click();
    await card(page).getByRole('button', { name: 'Skip' }).click();
    await expect(card(page).locator('[data-fb-done]')).toBeVisible();
    expect(fields(sent[0])).toEqual({ device: { stringValue: 'desktop' }, ease: { integerValue: '2' } });
  });

  test('"Not now" closes it for good and sends nothing', async ({ page }) => {
    const sent = await capture(page);
    await winGame(page);
    await card(page).getByRole('button', { name: 'Not now' }).first().click();
    await expect(card(page)).toBeHidden();
    await page.reload();
    await winGame(page);
    await page.waitForTimeout(1200);
    await expect(card(page)).toBeHidden();
    expect(sent).toHaveLength(0);
  });

  test('a failed send says so and keeps the answers', async ({ page }) => {
    await capture(page, 500);
    await winGame(page);
    await card(page).getByRole('radio', { name: '5' }).check();
    await card(page).getByRole('button', { name: 'Next' }).click();
    await card(page).getByLabel('Anything broken or confusing?').fill('Nothing, nice site.');
    await card(page).getByRole('button', { name: 'Send' }).click();
    await expect(card(page).getByRole('alert')).toBeVisible();
    await expect(card(page).getByLabel('Anything broken or confusing?')).toHaveValue('Nothing, nice site.');
    await expect(card(page).locator('[data-fb-done]')).toBeHidden();
  });
});

test.describe('small-business page', () => {
  test('is linked from the homepage and leads with Ellanielos', async ({ page }) => {
    await page.getByRole('link', { name: 'See how I work' }).click();
    await expect(page).toHaveURL(/\/websites$/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Ellanielos Concept' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Read the full story' })).toHaveAttribute('href', '/work/ellanielos');
  });

  test('every WhatsApp button starts a website enquiry', async ({ page }) => {
    await page.goto('/websites');
    const links = page.locator('a[href^="https://wa.me/"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      const url = new URL((await link.getAttribute('href'))!);
      expect(url.searchParams.get('text')).toMatch(/website for my business/);
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('has no sideways scroll on a 360px phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/websites');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('responsive', () => {
  test('no sideways scroll on a 360px phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
