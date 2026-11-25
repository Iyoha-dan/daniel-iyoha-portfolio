# Daniel Iyoha · portfolio

**Live:** https://daniel-iyoha.web.app

My portfolio as a QA tester who also builds websites. The site is tested with its own Playwright suite, the homepage panel shows the latest real run, and a deploy only goes out if every test passes.

- **Astro** static site, hosted on **Firebase Hosting**
- **Playwright** end-to-end tests in [`tests/site.spec.ts`](tests/site.spec.ts): navigation, accessibility, the work index, project pages, the bug hunt game, the "Hiring?" menu, the feedback card, the 404 page and phone layouts
- **Motion** for scroll animations (reduced motion respected)
- **Firestore** for the feedback card, with create-only security rules in [`firestore.rules`](firestore.rules)

## Run it

```bash
npm install
npm run dev      # http://localhost:4371
npm test         # builds the site, runs tests/ in Chrome, writes src/data/test-run.json
npm run build    # static site in dist/
```

The tests use the Chrome installed on the machine (`channel: 'chrome'`), so no Playwright browser download is needed.

## Where things are

| To change… | Edit |
|---|---|
| Headline, intro, email, links, CV file | `src/data/profile.ts` (`person`) |
| Projects and the "Hiring?" menu routes | `src/data/profile.ts` (`projects`, `hireRoutes`) |
| Project page text | `src/data/case-studies.ts` |
| Experience, skills, education | `src/data/profile.ts` |
| Project screenshots | `npm run shots` retakes them from the live sites into `src/assets/work/` |
| Colours and fonts | `src/styles/global.css` |
| Tests | `tests/site.spec.ts` |

**Testimonials:** add an entry to `testimonials` in `profile.ts`. The section appears as soon as there is one. Real quotes only, from people who have agreed to be named.

**The CV:** `public/Daniel_Iyoha_CV.pdf`. Setting `cv: null` in `profile.ts` hides the download buttons.

**Lighthouse scores** in `profile.ts` were measured on the live sites (mobile). Re-measure before quoting them again: `npx lighthouse https://wimika.ng --only-categories=performance,accessibility,best-practices,seo`.

**The test panel:** the hero panel reads `src/data/test-run.json`, written by `npm test` (not committed). Run `npm test` before building so it shows the current run. If a test fails, the panel says so; fix the site, not the test.

**Feedback:** answers from the card after the bug hunt go to the `feedback` collection in Firestore. Visitors can only add answers; read them in the Firebase console. Tests stub the Firestore request, so they never write real data.

## Deploy (Firebase Hosting)

```bash
npm run deploy                                # runs the tests first and stops if any fail
firebase deploy --only firestore:rules        # only after changing firestore.rules
```
