// /sitemap.xml for search engines: every public page, at the clean address Firebase serves
// (no .html). The private inbox and the 404 page are left out on purpose.
// A new public page needs adding to `pages` below.
import type { APIRoute } from 'astro';
import { caseStudies } from '../data/case-studies';

const pages = ['/', '/websites', '/cv', ...Object.keys(caseStudies).map((slug) => `/work/${slug}`)];

export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
