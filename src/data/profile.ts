// Everything the page says lives here. Sources: Daniel_Iyoha_CV_new.docx and the project folders (Oct 2026).

export const person = {
  name: 'Daniel Iyoha',
  role: 'QA & Web Development',
  location: 'Lagos, Nigeria',
  email: 'danieliyoha6@gmail.com',
  linkedin: 'https://www.linkedin.com/in/daniel-iyoha-574b53313',
  github: 'https://github.com/Iyoha-dan',
  x: 'https://x.com/DanielIyoha9',
  // Opens a WhatsApp chat with a message already started (same number as on the CV).
  whatsapp: `https://wa.me/2349030851695?text=${encodeURIComponent('Hi Daniel, I saw your portfolio and ')}`,
  // The same chat, started as a website enquiry (small-business page and the "Hiring?" menu).
  whatsappWebsite: `https://wa.me/2349030851695?text=${encodeURIComponent("Hi Daniel, I'd like a website for my business. ")}`,
  // Path to a PDF in public/, e.g. '/Daniel_Iyoha_CV.pdf'. While null, the "Download CV" buttons stay hidden.
  cv: '/Daniel_Iyoha_CV.pdf' as string | null,
  headline: 'I build websites, then I try to break them.',
  intro:
    'QA tester at a Nigerian fintech who also builds production websites. I ship sites with the checks built in (automated tests, accessibility, real-phone performance) and test products end to end before they launch.',
  openTo: 'Open to test automation & web dev roles',
};

export type Score = { label: string; value: number };

export type Project = {
  slug: string;
  group: 'web' | 'qa';
  kind: string;
  title: string;
  role: string;
  summary: string;
  // Web projects: what was built and how it was checked. QA projects: the report card.
  built?: string[];
  checked?: string[];
  checks?: string[];
  checksLabel?: string;
  // QA projects: real results for the report card (a pass/fail bar and the bugs logged).
  results?: { label: string; passed: number; failed: number };
  bugs?: { id: string; severity: 'High' | 'Medium' | 'Low'; title: string }[];
  // Lighthouse, mobile, measured on the live site.
  scores?: { date: string; values: Score[] };
  outcome?: string;
  stack?: string[];
  link?: { href: string; label: string };
  // Screenshot slugs in src/assets/work (desktop + mobile).
  shots?: string;
  shotLabel?: string;
  note?: string;
  // Work index card: brand colour behind the screenshot, and one line of proof.
  accent?: string;
  stat?: string;
};

// In order of weight; websites and QA work sit together (every build is also tested).
export const projects: Project[] = [
  {
    slug: 'wimika-website',
    accent: '#2817f7',
    stat: 'Lighthouse 93 · 96 · 96 · 100',
    group: 'web',
    kind: 'Fintech marketing site',
    title: 'wimika.ng',
    role: 'Built and tested the site, Wimika RMS Technologies',
    summary:
      'Wimika’s site has to win two audiences under one brand: people protecting their money, and banks evaluating a partner. Every statement about cover and reimbursement is regulated, so a wording slip is a compliance problem, not a typo.',
    built: [
      'First version: 10+ pages in React, Vite, Tailwind and shadcn/ui',
      'Rebuild: a 20-page Astro site on Firebase Hosting, with GSAP motion',
      'Incident report, demo request and due-diligence forms wired to a Cloud Function',
      'Old URLs 301-redirected, so links already shared keep working',
    ],
    checked: [
      'Copy controls on every build: a regulated claim without its qualifying wording fails the build',
      'WCAG AA contrast checked on every page, at desktop and phone widths',
    ],
    scores: {
      date: 'Oct 2026',
      values: [
        { label: 'Performance', value: 93 },
        { label: 'Accessibility', value: 96 },
        { label: 'Best practices', value: 96 },
        { label: 'SEO', value: 100 },
      ],
    },
    stack: ['Astro', 'GSAP', 'Firebase Hosting', 'Cloud Functions', 'Puppeteer'],
    link: { href: 'https://wimika.ng', label: 'wimika.ng' },
    shots: 'wimika',
  },
  {
    slug: 'moneyguard-launch',
    stat: '7 launch flows verified',
    group: 'qa',
    kind: 'Release testing · Mobile app',
    title: 'MoneyGuard app launch',
    role: 'QA tester, Wimika RMS Technologies',
    summary:
      'MoneyGuard is an embedded cyber-fraud protection product for banking customers. Before the consumer app went to the app store, I verified every core journey end to end and supported security and abuse testing ahead of the public launch.',
    checksLabel: 'Flows verified',
    checks: [
      'Sign-up and OTP verification',
      'KYC and bank account linking',
      'Paid checkout',
      'Policy issuance and lifecycle',
      'Device binding',
      'Self-service account deletion',
      'Security and abuse cases',
    ],
    outcome: 'Issues surfaced and logged before go-live, not after.',
    note: 'Product screens are not shown: the app is a live financial product.',
  },
  {
    slug: 'ellanielos',
    accent: '#e8218a',
    stat: 'Lighthouse 92 · 100 · 100 · 100',
    group: 'web',
    kind: 'Small business site',
    title: 'Ellanielos Concept',
    role: 'Designed and built the site',
    summary:
      'A Lagos monogram, embroidery and printing shop. Customers arrive from WhatsApp links on mid-range Android phones, so the page has one job: turn a visit into a WhatsApp order chat, fast, on mobile data.',
    built: [
      '"See it stitched": type initials or upload a logo and preview it embroidered on a towel, polo or cap',
      'Every service button opens WhatsApp with a pre-filled order message',
      'Content in plain data files, so the family can update it without a developer',
    ],
    checked: ['Kept light for mid-range Android phones on mobile data'],
    scores: {
      date: 'Oct 2026',
      values: [
        { label: 'Performance', value: 92 },
        { label: 'Accessibility', value: 100 },
        { label: 'Best practices', value: 100 },
        { label: 'SEO', value: 100 },
      ],
    },
    stack: ['Astro', 'Tailwind CSS', 'Netlify'],
    link: { href: 'https://ellanielos.com.ng', label: 'ellanielos.com.ng' },
    shots: 'ellanielos',
  },
  {
    slug: 'chidinma',
    accent: '#2a4bff',
    stat: 'Lighthouse 100 · 100 · 100 · 100',
    group: 'web',
    kind: 'Personal portfolio · Data analyst',
    title: 'Chidinma Onyeri',
    role: 'Client site: designed, built and handed over',
    summary:
      'A portfolio for a data analyst at a fintech. She needed to show her dashboards and case studies to recruiters, then keep adding projects herself after handover, without a developer.',
    built: [
      'Three design directions to choose from; she picked the bold fintech look',
      'Case studies are plain text files she adds on github.com, no coding needed',
      'Dashboard screenshots retaken by script from her live Streamlit apps',
      'Publishes itself to her GitHub Pages on every change, through GitHub Actions',
    ],
    checked: [
      'Every claim matched against her live work: the stock dashboard scores 25 stocks, so the site never says 500',
    ],
    scores: {
      date: 'Nov 2026',
      values: [
        { label: 'Performance', value: 100 },
        { label: 'Accessibility', value: 100 },
        { label: 'Best practices', value: 100 },
        { label: 'SEO', value: 100 },
      ],
    },
    stack: ['Astro', 'GitHub Pages', 'GitHub Actions', 'Playwright'],
    link: { href: 'https://dinmajj.github.io', label: 'dinmajj.github.io' },
    shots: 'chidinma',
  },
  {
    slug: 'linkhut',
    stat: '63 test cases · 2 bugs logged',
    group: 'qa',
    kind: 'QA School · Team testing programme',
    title: 'Linkhut',
    role: 'QA tester, one of five on a QA School programme',
    summary:
      'A QA School programme on Linkhut (linkhut.co), a live Nigerian link-in-bio and commerce platform, with one tester per feature area. I owned Hut pages (Creator/Media and Founder/Professional) and wrote the marketplace test cases: user stories first, checked against the PRD, then exploratory testing beyond them.',
    checksLabel: 'Scope',
    checks: ['Hut page setup and customisation', 'Marketplace (Hut store) commerce widget', 'Build checked against the PRD'],
    results: { label: 'Hut pages', passed: 59, failed: 4 },
    bugs: [
      { id: 'MKT-001', severity: 'High', title: 'Stock count did not go down after a purchase' },
      { id: 'MKT-002', severity: 'Medium', title: 'Confirmation showed the unit price, not the total' },
    ],
    outcome: '63 test cases run (59 passed, 4 failed) and 2 marketplace bugs logged, including stock not going down after a sale (High).',
    note: 'A training programme, not client work.',
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  // How they know Daniel, shown as a tag: 'Manager', 'Client', 'Engineer, worked with my bug reports'.
  relation: string;
  // Optional square photo in src/assets/people/, e.g. 'jane-doe.jpg'.
  photo?: string;
  // Optional link to the original, e.g. a LinkedIn recommendation.
  link?: string;
  // Optional phrase from the quote to emphasise; must appear in the quote exactly.
  highlight?: string;
  // Slug of the project it is about; the quote also appears on that project's page.
  project?: string;
};

// Real quotes only, each from someone who has agreed to be named here.
// The Testimonials section appears once this list has at least one entry.
export const testimonials: Testimonial[] = [
  {
    quote:
      'Daniel did an amazing job with my portfolio website. All I gave him was a draft of my skills and my one-page portfolio, and he was able to turn it into something really beautiful and appealing. The entire process was smooth, everything worked just as it should, and I didn’t have to ask for a single correction. He was also very proactive and quick to deliver. I really enjoyed working with him and would definitely recommend him to anyone looking to build a great website that is not only visually appealing but also responsive and works seamlessly across devices.',
    name: 'Chidinma Onyeri',
    role: 'Data Analyst',
    company: 'BudPay',
    relation: 'Client',
    project: 'chidinma',
    highlight: 'I didn’t have to ask for a single correction',
  },
];

export const experience = {
  company: 'Wimika RMS Technologies',
  title: 'Software Tester & Executive Assistant',
  // Shown as the role line; the full title stays in the meta line below it.
  headline: 'Software Tester',
  dates: 'Jul 2024 – Present',
  context: 'Nigerian fintech startup building MoneyGuard, embedded cyber-fraud protection for banking customers.',
  groups: [
    {
      label: 'QA & testing',
      items: [
        'Test lead on QA engagements across Wimika’s own products and client work: test plans, structured test cases and bug reports.',
        'Verified end-to-end flows for the MoneyGuard consumer app ahead of app store release.',
        'Supported end-to-end and security/abuse testing before the public launch.',
        'Converting existing manual QA workflows into Playwright + TypeScript suites.',
      ],
    },
    {
      label: 'Web development',
      items: [
        'Built the first Wimika/MoneyGuard website in React, Vite, Tailwind and shadcn/ui (10+ pages).',
        'Rebuilt it as the current 20-page Astro site on Firebase Hosting, with forms wired to a Cloud Function.',
        'Added build-time copy-compliance and WCAG contrast checks, so regulated wording and accessibility are tested on every build.',
      ],
    },
    {
      label: 'Regulatory & compliance',
      items: [
        'Sprint manager for a 5-day NDPA compliance sprint with engineering and product: records-of-processing register, gap register and checklist.',
        'Wrote the full PIA Zambia regulatory sandbox application for Wimika’s market entry.',
        'Prepared CBN VASP sandbox responses and NAICOM/CBN regulatory documentation.',
      ],
    },
    {
      label: 'Business development',
      items: [
        'Built a six-sheet Excel pricing workbook (protection design, pricing engine, business case) for a bank partnership pitch.',
        'Produced a fraud intelligence report from public NIBSS/CBN data.',
        'Compiled and vetted a ranked outreach list of 50 Nigerian microfinance banks.',
        'Led MoneyGuard’s social media revival, including AI-generated video ads.',
      ],
    },
  ],
};

export const skills = [
  { label: 'Web development', items: ['Astro', 'React', 'Vite', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'GSAP'] },
  { label: 'Hosting & delivery', items: ['Firebase Hosting', 'Cloud Functions', 'Netlify', 'Responsive, accessible builds'] },
  { label: 'Test automation', items: ['Playwright', 'TypeScript', 'GitHub'], note: 'In progress' },
  { label: 'API testing', items: ['Postman', 'Request/response validation'] },
  {
    label: 'Manual & exploratory',
    items: ['Test plans', 'Test case design', 'Cross-feature testing', 'PRD verification', 'Security/abuse testing'],
  },
  { label: 'Bug tracking', items: ['Azure DevOps', 'Structured bug logs'] },
];

export const education = [
  { title: 'B.Sc. Software Engineering', detail: 'Babcock University · Second Class Upper', date: '2024' },
  { title: 'QA School', detail: 'Playwright, Postman API testing, Scandium', date: 'Training' },
  { title: 'National Youth Service Corps', detail: 'Completed', date: 'Mar 2026' },
];

// The "Hiring?" menu in the header: for each kind of visitor, the shortest path to the proof that
// matters to them. A pick is a project slug, or 'tests' (this site's own test run) or 'websites'
// (the small-business page). `proof` replaces the project's stat line where the visitor cares about
// something else.
export type HireRoute = {
  id: string;
  label: string;
  picks: { slug: string; proof?: string }[];
  primary: 'cv' | 'whatsapp';
};

export const hireRoutes: HireRoute[] = [
  {
    id: 'tester',
    label: 'A tester',
    picks: [{ slug: 'moneyguard-launch' }, { slug: 'linkhut' }, { slug: 'tests' }],
    primary: 'cv',
  },
  {
    id: 'developer',
    label: 'A web developer',
    picks: [{ slug: 'wimika-website' }, { slug: 'chidinma' }, { slug: 'ellanielos' }],
    primary: 'cv',
  },
  {
    id: 'business',
    label: 'A business website',
    picks: [
      { slug: 'websites' },
      { slug: 'ellanielos', proof: 'A shop’s site that turns visits into WhatsApp orders' },
      { slug: 'chidinma', proof: 'A client site she updates herself, no developer needed' },
    ],
    primary: 'whatsapp',
  },
];
