// Scroll motion for the portfolio, built on Motion (motion.dev).
//  - [data-reveal] elements fade up once as they enter the viewport; siblings in a grid stagger.
//  - .scroll-progress fills as the page scrolls (state: where you are on a long page).
//  - Phone mockups drift against their browser screenshots for a little depth.
// Reduced motion keeps the progress bar (it moves only with the reader's own scrolling) and drops the rest.

import { animate, inView, scroll, stagger } from 'motion';

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-out in global.css
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const progress = document.querySelector<HTMLElement>('.scroll-progress');
if (progress) {
  scroll(animate(progress, { transform: ['scaleX(0)', 'scaleX(1)'] }, { ease: 'linear' }));
}

if (!reduceMotion) {
  // Hide only what's below the fold. Anything already on screen stays put, so nothing flickers
  // on load and the page reads fine if this script never runs.
  const below = (el: Element) => el.getBoundingClientRect().top > innerHeight * 0.9;
  const hidden = { opacity: '0', transform: 'translateY(20px)' };
  const shown = { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] };

  // Items laid out side by side in one grid reveal together, one after another.
  const groups = new Map<Element, HTMLElement[]>();
  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    if (!below(el)) continue;
    const parent = el.parentElement!;
    const key = getComputedStyle(parent).display === 'grid' ? parent : el;
    groups.set(key, [...(groups.get(key) ?? []), el]);
  }

  const pending = new Map<Element, () => void>();
  for (const [trigger, items] of groups) {
    items.forEach((el) => Object.assign(el.style, hidden));
    const stop = inView(
      trigger,
      () => {
        animate(items, shown, { duration: 0.6, ease, delay: stagger(0.07) });
        stop();
        pending.delete(trigger);
      },
      { margin: '0px 0px -10% 0px' },
    );
    // A jump past the section (nav link, End key) never makes it intersect; show it outright then.
    pending.set(trigger, () => {
      stop();
      items.forEach((el) => Object.assign(el.style, { opacity: '1', transform: 'none' }));
    });
  }

  let queued = false;
  addEventListener(
    'scroll',
    () => {
      if (queued || !pending.size) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        for (const [trigger, show] of pending) {
          if (trigger.getBoundingClientRect().bottom < 0) {
            show();
            pending.delete(trigger);
          }
        }
      });
    },
    { passive: true },
  );

  for (const phone of document.querySelectorAll<HTMLElement>('.shots .phone')) {
    const card = phone.closest('article');
    if (!card) continue;
    scroll(animate(phone, { transform: ['translateY(28px)', 'translateY(-28px)'] }, { ease: 'linear' }), {
      target: card,
      offset: ['start end', 'end start'],
    });
  }
}
