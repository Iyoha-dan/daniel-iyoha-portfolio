// English and German for the homepage and the small-business page (/ and /websites, /de and
// /de/websites). English data lives in src/data/profile.ts; the German versions of those fields
// are below, merged over the English by `profileFor('de')`. Case studies, the CV and the inbox
// stay English. German copy needs a native speaker's proofread before big changes go live.
import * as en from '../data/profile';
import type { Project } from '../data/profile';

export type Lang = 'en' | 'de';

// Pages that exist in both languages, by their English path.
const localized = ['/', '/websites'];
export const pathFor = (lang: Lang, enPath: string) => (lang === 'de' ? (enPath === '/' ? '/de' : `/de${enPath}`) : enPath);
export const alternatesFor = (enPath: string) =>
  localized.includes(enPath) ? { en: enPath, de: pathFor('de', enPath) } : undefined;

/* ---------- German versions of the profile data ---------- */

const dePerson = {
  role: 'QA & Webentwicklung',
  headline: 'Ich baue Websites. Dann versuche ich, sie kaputtzumachen.',
  intro:
    'QA-Tester bei einem nigerianischen Fintech, der auch Websites für den echten Einsatz baut. Meine Websites kommen mit eingebauten Prüfungen (automatisierte Tests, Barrierefreiheit, Tempo auf echten Handys), und Produkte teste ich vor dem Launch von Anfang bis Ende.',
  openTo: 'Offen für Stellen in Testautomatisierung und Webentwicklung',
  whatsapp: `https://wa.me/2349030851695?text=${encodeURIComponent('Hallo Daniel, ich habe Ihr Portfolio gesehen und ')}`,
  whatsappWebsite: `https://wa.me/2349030851695?text=${encodeURIComponent('Hallo Daniel, ich hätte gern eine Website für mein Unternehmen. ')}`,
};

const scoreLabels: Record<string, string> = {
  Performance: 'Performance',
  Accessibility: 'Barrierefreiheit',
  'Best practices': 'Best Practices',
  SEO: 'SEO',
};
const severity: Record<string, string> = { High: 'Hoch', Medium: 'Mittel', Low: 'Niedrig' };

const deProjects: Record<string, Partial<Project>> = {
  'wimika-website': { kind: 'Fintech-Marketingwebsite' },
  'moneyguard-launch': {
    kind: 'Release-Tests · Mobile App',
    title: 'MoneyGuard App-Launch',
    stat: '7 Launch-Abläufe geprüft',
    checksLabel: 'Abläufe geprüft',
    checks: [
      'Registrierung und OTP-Bestätigung',
      'KYC und Verknüpfung des Bankkontos',
      'Bezahlter Checkout',
      'Policenausstellung und Lebenszyklus',
      'Gerätebindung',
      'Kontolöschung durch Nutzer',
      'Sicherheits- und Missbrauchsfälle',
    ],
  },
  ellanielos: { kind: 'Website für ein kleines Unternehmen' },
  chidinma: { kind: 'Persönliches Portfolio · Datenanalystin' },
  linkhut: { kind: 'QA School · Team-Testprogramm', stat: '63 Testfälle · 2 Bugs gemeldet' },
};
const deBugs: Record<string, string> = {
  'MKT-001': 'Lagerbestand sank nach einem Kauf nicht',
  'MKT-002': 'Bestätigung zeigte den Einzelpreis statt der Summe',
};

const deExperience = {
  title: 'Softwaretester & Executive Assistant',
  headline: 'Softwaretester',
  dates: 'Juli 2024 – heute',
  context: 'Nigerianisches Fintech-Start-up, das MoneyGuard entwickelt: eingebetteten Schutz vor Cyberbetrug für Bankkunden.',
  groups: [
    {
      label: 'QA & Tests',
      items: [
        'Testleitung bei QA-Projekten für Wimikas eigene Produkte und Kundenaufträge: Testpläne, strukturierte Testfälle und Bug-Reports.',
        'End-to-End-Abläufe der MoneyGuard-App vor dem Release im App Store geprüft.',
        'End-to-End- sowie Sicherheits- und Missbrauchstests vor dem öffentlichen Launch unterstützt.',
        'Überführe bestehende manuelle QA-Abläufe in Playwright- und TypeScript-Suites.',
      ],
    },
    {
      label: 'Webentwicklung',
      items: [
        'Die erste Wimika/MoneyGuard-Website mit React, Vite, Tailwind und shadcn/ui gebaut (über 10 Seiten).',
        'Als heutige Astro-Website mit 20 Seiten auf Firebase Hosting neu gebaut, Formulare über eine Cloud Function angebunden.',
        'Prüfungen für regulierte Formulierungen und WCAG-Kontraste in den Build eingebaut, sodass Texte und Barrierefreiheit bei jedem Build getestet werden.',
      ],
    },
    {
      label: 'Regulierung & Compliance',
      items: [
        'Sprint-Manager eines 5-tägigen NDPA-Compliance-Sprints mit Engineering und Produkt: Verzeichnis der Verarbeitungstätigkeiten, Gap-Register und Checkliste.',
        'Den vollständigen Antrag für die Regulatory Sandbox der PIA Sambia für Wimikas Markteintritt geschrieben.',
        'Antworten für die VASP-Sandbox der CBN und regulatorische Unterlagen für NAICOM/CBN vorbereitet.',
      ],
    },
    {
      label: 'Geschäftsentwicklung',
      items: [
        'Eine Excel-Preiskalkulation mit sechs Tabellenblättern (Schutzdesign, Preis-Engine, Business Case) für den Pitch bei einer Partnerbank gebaut.',
        'Einen Betrugslagebericht aus öffentlichen NIBSS/CBN-Daten erstellt.',
        'Eine geprüfte, gerankte Liste von 50 nigerianischen Mikrofinanzbanken für die Ansprache zusammengestellt.',
        'Den Social-Media-Neustart von MoneyGuard geleitet, inklusive KI-generierter Videoanzeigen.',
      ],
    },
  ],
};

const deSkills = [
  { label: 'Webentwicklung', items: ['Astro', 'React', 'Vite', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'GSAP'] },
  { label: 'Hosting & Auslieferung', items: ['Firebase Hosting', 'Cloud Functions', 'Netlify', 'Responsive, barrierefreie Builds'] },
  { label: 'Testautomatisierung', items: ['Playwright', 'TypeScript', 'GitHub'], note: 'In Arbeit' },
  { label: 'API-Tests', items: ['Postman', 'Request/Response-Validierung'] },
  {
    label: 'Manuell & explorativ',
    items: ['Testpläne', 'Testfalldesign', 'Funktionsübergreifende Tests', 'Prüfung gegen das PRD', 'Sicherheits- und Missbrauchstests'],
  },
  { label: 'Bug-Tracking', items: ['Azure DevOps', 'Strukturierte Bug-Logs'] },
];

const deEducation = [
  { title: 'B.Sc. Software Engineering', detail: 'Babcock University · Second Class Upper', date: '2024' },
  { title: 'QA School', detail: 'Playwright, API-Tests mit Postman, Scandium', date: 'Weiterbildung' },
  { title: 'National Youth Service Corps', detail: 'Abgeschlossen (nigerianischer Nationaldienst)', date: 'März 2026' },
];

const deHireRoutes: Record<string, { label: string; proof?: Record<string, string> }> = {
  tester: { label: 'Einen Tester' },
  developer: { label: 'Einen Webentwickler' },
  business: {
    label: 'Eine Firmen-Website',
    proof: {
      ellanielos: 'Website eines Ladens, die Besuche in WhatsApp-Bestellungen verwandelt',
      chidinma: 'Kundenseite, die sie selbst pflegt, ohne Entwickler',
    },
  },
};

/** Profile data in the given language (German fields over the English ones). */
export const profileFor = (lang: Lang) => {
  if (lang === 'en') return en;
  const projects = en.projects.map((p) => {
    const o = deProjects[p.slug] ?? {};
    return {
      ...p,
      ...o,
      results: p.results && { ...p.results, label: 'Hut-Seiten' },
      bugs: p.bugs?.map((b) => ({ ...b, title: deBugs[b.id] ?? b.title, severity: (severity[b.severity] ?? b.severity) as typeof b.severity })),
      scores: p.scores && { ...p.scores, values: p.scores.values.map((s) => ({ ...s, label: scoreLabels[s.label] ?? s.label })) },
    } as Project;
  });
  return {
    ...en,
    person: { ...en.person, ...dePerson },
    projects,
    experience: { ...en.experience, ...deExperience },
    skills: deSkills,
    education: deEducation,
    testimonials: en.testimonials.map((t) => ({ ...t, relation: t.relation === 'Client' ? 'Kundin' : t.relation })),
    hireRoutes: en.hireRoutes.map((r) => ({
      ...r,
      label: deHireRoutes[r.id]?.label ?? r.label,
      picks: r.picks.map((pk) => ({ ...pk, proof: deHireRoutes[r.id]?.proof?.[pk.slug] ?? pk.proof })),
    })),
  };
};

/* ---------- Interface text ---------- */

export const ui = {
  en: {
    skip: 'Skip to content',
    nav: { work: 'Work', experience: 'Experience', skills: 'Skills', contact: 'Contact', sections: 'Sections', backToTop: 'back to top', home: 'home' },
    lang: { switchTo: 'Deutsch', switchShort: 'DE', switchLabel: 'Diese Seite auf Deutsch' },
    theme: { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' },
    hire: {
      button: 'Hiring?',
      kicker: 'The short route',
      legend: "I'm hiring for",
      testsTitle: 'The tests behind this site',
      testsProof: (n: number) => `${n} tests run before every deploy`,
      websitesTitle: 'How I build business websites',
      websitesProof: 'What you get, how it works, getting a quote',
      viewCv: 'View CV →',
      whatsapp: 'WhatsApp me ↗',
      email: 'Email me',
      more: 'All the ways to reach me →',
      otherLang: '',
    },
    work: {
      lede: "What I've built and tested.",
      cta: 'Case study',
      testReport: 'Test report',
      checklist: 'Release checklist',
      testCases: 'test cases',
      passed: 'passed',
      failed: 'failed',
      summary: (n: number, label: string) => `${n}/${n} ${label.toLowerCase()}`,
      spokenScores: 'Lighthouse on mobile',
      spokenCases: (label: string, total: number, passed: number, failed: number, bugs: number) =>
        `${label}: ${total} test cases, ${passed} passed, ${failed} failed, ${bugs} bugs logged`,
      spokenCta: 'Case study',
      show: (title: string) => `Show ${title}`,
    },
    hero: {
      seeWork: 'See my work',
      viewCv: 'View CV',
      emailMe: 'Email me',
      runTests: 'Run tests',
      breakHint: 'Breaks the headline. Run the tests to put it back.',
      panelLabel: 'Playwright test results for this website',
      caption: "This site's own Playwright suite. The panel is built from the latest real run.",
      readTests: 'Read the tests ↗',
    },
    testimonials: { title: 'What people say', original: 'Read the original', quoteNote: '' },
    experience: { title: 'Experience', fullTitle: 'Full title', also: (labels: string[]) => `Also at Wimika: ${labels.map((l) => l.toLowerCase()).join(' and ')}` },
    skills: {
      title: 'Skills & training',
      currently: 'Currently',
      now: 'Learning Playwright + TypeScript and converting my manual QA workflows into automated suites. The first public sample is this website: its tests run against every build, and the panel at the top of the page shows the latest run.',
      follow: 'Follow along on GitHub',
    },
    contact: {
      title: 'Hiring a tester, or need a website that looks good and works well on every device?',
      chat: 'Prefer to chat?',
      chatLink: 'Message me on WhatsApp ↗',
      business: 'Need a website for your business?',
      businessLink: 'See how I work →',
      viewCv: 'View CV →',
    },
    footer: { built: 'Built with Astro. Tested with Playwright:', readTests: 'read the tests ↗' },
    suggest: { text: '', go: '', stay: '' },
  },
  de: {
    skip: 'Zum Inhalt springen',
    nav: { work: 'Arbeiten', experience: 'Erfahrung', skills: 'Kenntnisse', contact: 'Kontakt', sections: 'Bereiche', backToTop: 'zurück nach oben', home: 'Startseite' },
    lang: { switchTo: 'English', switchShort: 'EN', switchLabel: 'This page in English' },
    theme: { toDark: 'Zum dunklen Design wechseln', toLight: 'Zum hellen Design wechseln' },
    hire: {
      button: 'Sie suchen?',
      kicker: 'Der kurze Weg',
      legend: 'Ich suche',
      testsTitle: 'Die Tests hinter dieser Website',
      testsProof: (n: number) => `${n} Tests laufen vor jedem Deploy`,
      websitesTitle: 'Wie ich Firmen-Websites baue',
      websitesProof: 'Leistungen, Ablauf, Angebot',
      viewCv: 'Lebenslauf ansehen (EN) →',
      whatsapp: 'Per WhatsApp schreiben ↗',
      email: 'E-Mail schreiben',
      more: 'Alle Kontaktwege →',
      otherLang: 'This page in English →',
    },
    work: {
      lede: 'Was ich gebaut und getestet habe. Die Fallstudien sind auf Englisch.',
      cta: 'Fallstudie (EN)',
      testReport: 'Testbericht',
      checklist: 'Release-Checkliste',
      testCases: 'Testfälle',
      passed: 'bestanden',
      failed: 'fehlgeschlagen',
      summary: (n: number, label: string) => `${n}/${n} ${label}`,
      spokenScores: 'Lighthouse mobil',
      spokenCases: (label: string, total: number, passed: number, failed: number, bugs: number) =>
        `${label}: ${total} Testfälle, ${passed} bestanden, ${failed} fehlgeschlagen, ${bugs} Bugs gemeldet`,
      spokenCta: 'Fallstudie auf Englisch',
      show: (title: string) => `${title} zeigen`,
    },
    hero: {
      seeWork: 'Meine Arbeiten',
      viewCv: 'Lebenslauf (EN)',
      emailMe: 'E-Mail schreiben',
      runTests: 'Tests ausführen',
      breakHint: 'Zerbricht die Überschrift. Führen Sie die Tests aus, um sie zu reparieren.',
      panelLabel: 'Playwright-Testergebnisse dieser Website',
      caption: 'Die eigene Playwright-Testsuite dieser Website. Das Panel zeigt den letzten echten Testlauf.',
      readTests: 'Tests ansehen ↗',
    },
    testimonials: { title: 'Was andere sagen', original: 'Original ansehen', quoteNote: 'Original auf Englisch' },
    experience: { title: 'Erfahrung', fullTitle: 'Vollständiger Titel', also: (labels: string[]) => `Außerdem bei Wimika: ${labels.join(' und ')}` },
    skills: {
      title: 'Kenntnisse & Weiterbildung',
      currently: 'Aktuell',
      now: 'Ich lerne Playwright mit TypeScript und überführe meine manuellen QA-Abläufe in automatisierte Suites. Das erste öffentliche Beispiel ist diese Website: Ihre Tests laufen bei jedem Build, und das Panel oben auf der Seite zeigt den letzten Lauf.',
      follow: 'Auf GitHub mitverfolgen',
    },
    contact: {
      title: 'Sie suchen einen Tester oder brauchen eine Website, die gut aussieht und auf jedem Gerät funktioniert?',
      chat: 'Lieber chatten?',
      chatLink: 'Schreiben Sie mir auf WhatsApp ↗',
      business: 'Sie brauchen eine Website für Ihr Unternehmen?',
      businessLink: 'So arbeite ich →',
      viewCv: 'Lebenslauf ansehen (EN) →',
    },
    footer: { built: 'Gebaut mit Astro. Getestet mit Playwright:', readTests: 'Tests ansehen ↗' },
    suggest: { text: 'Diese Seite gibt es auch auf Deutsch.', go: 'Auf Deutsch lesen', stay: 'Auf Englisch bleiben' },
  },
};

export type UI = (typeof ui)['en'];
