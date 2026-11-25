// Long-form content for the project pages (/work/<slug>). Keyed by the project's slug in profile.ts.
// Sources: notes/project-notes.md. Only facts from there; anything still marked "Confirm" stays out.

export type CaseStudy = {
  // Opening paragraph under the title.
  lede: string;
  // Short label/value pairs in the strip under the lede.
  facts: { label: string; value: string }[];
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
  // An optional pulled quote, shown in full with its author.
  quote?: { text: string; name: string; role: string };
  // Skip the Outcome block when a section already says the same thing.
  hideOutcome?: boolean;
};

export const caseStudies: Record<string, CaseStudy> = {
  'wimika-website': {
    lede: 'The marketing site for Wimika and its fraud-protection product, MoneyGuard. One brand speaks to two very different visitors, and every sentence about cover and reimbursement is regulated.',
    facts: [
      { label: 'Role', value: 'Built and tested the site' },
      { label: 'Type', value: 'Fintech marketing site, 20 pages' },
    ],
    sections: [
      {
        heading: 'The brief',
        paragraphs: [
          'Two journeys under one brand. Individuals arrive protecting money they worked for, or in the middle of a fraud and needing to know what to do right now, often on a phone. Banks, fintechs and insurers arrive evaluating a partner and need enough security, regulatory and implementation detail to get through due diligence.',
          'The promise is "Stop fraud before it happens. Get your money back when it does." Because the product is insurance-backed, the wording is a compliance matter: "guaranteed" never appears without "eligible", and claims only go live once they are approved.',
        ],
      },
      {
        heading: 'What I built',
        list: [
          'A first version in React, Vite, Tailwind and shadcn/ui with 10+ pages.',
          'The current site: a 20-page Astro rebuild with separate journeys for individuals and institutions, a safety centre, a guide to spotting fake bank callers, claims and covered-fraud pages, team and legal pages.',
          'Incident report, demo request and due-diligence forms, sent through a Firebase Cloud Function.',
          'A claims register: one file of approval switches (app available, proof points, insurer named, regulatory status) that decides which statements the site is allowed to make.',
          'A chat assistant with its own knowledge base about the app.',
          'Old addresses redirected (301), so links already shared keep working.',
        ],
      },
      {
        heading: 'How I checked it',
        list: [
          'Copy controls run against the built site on every build: a regulated claim without its qualifying wording fails the build.',
          'A contrast check on every page at desktop and phone widths: WCAG AA for all text, no faded text colours, and underlined links inside running text. The earlier build had 74 contrast failures; 62 of them came from faded text, which the check now blocks.',
        ],
      },
    ],
  },

  ellanielos: {
    lede: 'A one-page site for a Lagos monogram, embroidery and printing shop. Customers arrive from WhatsApp on mid-range Android phones, so the site has one job: turn a visit into a WhatsApp order chat, quickly, on mobile data.',
    facts: [
      { label: 'Role', value: 'Designed and built the site' },
      { label: 'Type', value: 'Small business site, one page' },
    ],
    sections: [
      {
        heading: 'The brief',
        paragraphs: [
          'Ellanielos Concept makes custom monograms, embroidery, branded uniforms and printing at a walk-in shop in Shomolu, for individuals (gifts, weddings, aso-ebi) and for schools, churches and companies ordering in bulk. Orders happen in WhatsApp or on the phone; there is no online checkout.',
          'The site is maintained by the family, not a developer, so everything had to be editable without code.',
        ],
      },
      {
        heading: 'What I built',
        list: [
          '"See it stitched": type your initials (choosing a lettering style, thread colour and frame) or upload a logo, and see it embroidered on a polo, cap, towel or shirt pocket. Then send the design straight to WhatsApp for a quote.',
          'Every service button opens WhatsApp with an order message already written.',
          'All content in plain data files: contact details, services, FAQs, gallery. The gallery and testimonials stay hidden until real photos and quotes exist.',
          'Nothing invented: details the shop has not confirmed (hours, prices, delivery areas) point visitors to WhatsApp instead of guessing.',
        ],
      },
      {
        heading: 'How I checked it',
        paragraphs: ['Measured on the live site with Lighthouse, on mobile.'],
      },
    ],
  },

  chidinma: {
    lede: 'A portfolio for a data analyst at a fintech. She needed to show her dashboards and case studies to recruiters, then keep adding projects herself after handover, without a developer.',
    facts: [
      { label: 'Role', value: 'Designed, built and handed over' },
      { label: 'Type', value: 'Client portfolio site' },
    ],
    sections: [
      {
        heading: 'The brief',
        paragraphs: [
          'Chidinma started from a draft of her skills and a one-page portfolio. The site had to make her data work look as strong as it is, and stay in her hands: her account, her existing address, her updates.',
        ],
      },
      {
        heading: 'What I built',
        list: [
          'Three design directions to choose from; she picked a bold fintech look in cream, cobalt and ink.',
          'Case studies as plain text files she adds on github.com, with optional live dashboard, code and image links. A short guide in the project walks her through it.',
          'Publishing on her own GitHub Pages: every change goes live by itself through GitHub Actions.',
          'Dashboard screenshots retaken by script from her live Streamlit apps, so they never go stale.',
          'A private preview for her to review before handover.',
        ],
      },
      {
        heading: 'How I checked it',
        list: [
          'Every claim matched against her live work: her stock dashboard scores 25 companies, so the site never says 500.',
          'Measured on the live site with Lighthouse, on mobile.',
        ],
      },
    ],
  },

  'moneyguard-launch': {
    lede: 'MoneyGuard is an embedded cyber-fraud protection product for banking customers. Before the consumer app went to the app store, I tested every core journey end to end and supported security and abuse testing ahead of the public launch.',
    facts: [
      { label: 'Role', value: 'QA tester, Wimika RMS Technologies' },
      { label: 'Type', value: 'Release testing, mobile app' },
      { label: 'Scope', value: '7 core flows, plus security and abuse' },
    ],
    sections: [
      {
        heading: 'The release',
        paragraphs: [
          'A consumer finance app that links to people’s bank accounts and takes payments has to work the first time: a broken sign-up loses the customer, and a broken payment or policy step loses their trust in a product sold on trust.',
        ],
      },
      // The seven flows are shown in the release checklist above the text (Project.checks).
      {
        heading: 'How',
        paragraphs: [
          'The way I run QA across Wimika’s products: a test plan, structured test cases, and bug reports with steps to reproduce.',
        ],
      },
    ],
  },

  linkhut: {
    hideOutcome: true,
    lede: 'A QA School testing programme on Linkhut, a live Nigerian link-in-bio and commerce platform. Five testers each owned one feature area; mine was Hut pages, plus the marketplace test cases.',
    facts: [
      { label: 'Role', value: 'QA tester, one of five' },
      { label: 'Type', value: 'QA School team testing programme' },
      { label: 'Result', value: '63 test cases, 2 bugs logged' },
    ],
    sections: [
      {
        heading: 'The platform',
        paragraphs: [
          'Linkhut (linkhut.co) combines a link-in-bio page with a full commerce stack: a marketplace, rentals, events, services, gifting campaigns and waitlists, a Buy-Now-Pay-Later product, and a smart link shortener with analytics. Payments run through Paystack.',
        ],
      },
      {
        heading: 'How I tested',
        paragraphs: [
          'The programme’s rule was to test the user stories deliberately, then explore beyond them. I worked from the PRD for my area: setting up and customising Hut pages for the Creator/Media and Founder/Professional types, and listing and buying products in the marketplace (Hut store).',
        ],
      },
      {
        heading: 'What I found',
        list: [
          '63 test cases on Hut pages: 59 passed, 4 failed. All four failures were page customisation not applying correctly: theme colour, text style, header height and button style.',
          'Bug MKT-001 (High): the stock count did not go down after a successful purchase.',
          'Bug MKT-002 (Medium): for quantities above 1, the order confirmation showed the single-unit price instead of the total.',
        ],
      },
    ],
  },
};
