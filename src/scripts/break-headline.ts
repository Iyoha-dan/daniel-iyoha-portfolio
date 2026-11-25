// "break them." in the hero headline: click it and the letters fall into a heap under the
// buttons while the test panel reports a failing test; "Run tests" snaps them back.
// Reduced motion: the letters jump straight to their broken and fixed positions.

import { animate, stagger } from 'motion';

const root = document.documentElement;
const breakable = document.querySelector<HTMLButtonElement>('[data-break]');
const runTests = document.querySelector<HTMLButtonElement>('[data-run-tests]');
const rubble = document.querySelector<HTMLElement>('[data-rubble]');
const status = document.querySelector<HTMLElement>('[data-break-status]');

if (breakable && runTests && rubble) {
  const chars = [...breakable.querySelectorAll<HTMLElement>('.char')];
  const ease = [0.22, 1, 0.36, 1] as const; // --ease-out in global.css
  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fromKeyboard = (e: MouseEvent) => e.detail === 0;
  // While letters are still falling, "Run tests" waits for them to land and then fixes.
  let falling: Promise<unknown> | null = null;
  let fixing = false;

  const setStatus = (text: string) => {
    if (status) status.textContent = text;
  };

  breakable.addEventListener('click', async (event) => {
    if (falling || fixing || root.dataset.headline === 'broken') return;

    // Open a strip under the buttons for the letters to land in, sized to the headline's type.
    const size = parseFloat(getComputedStyle(breakable).fontSize);
    const depth = Math.round(size * 1.35);
    rubble.style.setProperty('--rubble-h', `${depth}px`);
    root.dataset.headline = 'broken';
    runTests.hidden = false;

    const strip = rubble.getBoundingClientRect();
    const floor = strip.top + depth - size * 0.1;
    const room = Math.max(strip.width - runTests.offsetWidth - size, size * 2);

    const falls = chars.map((char, i) => {
      const box = char.getBoundingClientRect();
      const x = strip.left + (room * i) / Math.max(chars.length - 1, 1) - box.left + rand(-6, 6);
      const y = floor - box.bottom - rand(0, size * 0.15);
      const turn = rand(-60, 60);
      const resting = `translate(${x}px, ${y}px) rotate(${turn}deg)`;
      if (reduced()) {
        char.style.transform = resting;
        return Promise.resolve();
      }
      // Gravity in, one small bounce, settle: an object falling, not a UI transition.
      return animate(
        char,
        {
          transform: [
            'translate(0px, 0px) rotate(0deg)',
            `translate(${x * 0.6}px, ${y}px) rotate(${turn * 0.8}deg)`,
            `translate(${x * 0.85}px, ${y - size * 0.35}px) rotate(${turn * 1.05}deg)`,
            resting,
          ],
        },
        { duration: 0.95, times: [0, 0.55, 0.78, 1], ease: ['easeIn', 'easeOut', 'easeIn'], delay: i * 0.035 + rand(0, 0.06) },
      ).finished;
    });

    falling = Promise.all(falls);
    await falling;
    falling = null;
    setStatus('Headline broken: 1 test failing. Run the tests to put it back.');
    if (fromKeyboard(event) && root.dataset.headline === 'broken') runTests.focus();
  });

  const fix = async (event?: MouseEvent) => {
    if (fixing || root.dataset.headline !== 'broken') return;
    fixing = true;
    if (falling) await falling;
    if (reduced() || !event) {
      chars.forEach((char) => (char.style.transform = ''));
    } else {
      await animate(chars, { transform: 'translate(0px, 0px) rotate(0deg)' }, { duration: 0.6, ease, delay: stagger(0.03, { from: 'last' }) })
        .finished;
      chars.forEach((char) => (char.style.transform = ''));
    }
    delete root.dataset.headline;
    runTests.hidden = true;

    // Replay the test list so the green run reads as fresh.
    for (const line of document.querySelectorAll<HTMLElement>('.term-body li, .term-total')) {
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = '';
    }
    setStatus('All tests passed. Headline fixed.');
    if (event && fromKeyboard(event)) breakable.focus();
    fixing = false;
  };

  runTests.addEventListener('click', fix);
  // The heap is laid out for the current width; a width change would misplace it, so tidy up instead.
  // (Height-only resizes happen on phones whenever the address bar slides, so those are ignored.)
  let width = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === width) return;
    width = innerWidth;
    fix();
  });
}
