// Builds the static site into dist/: wraps each page in the shared head, header and footer,
// fills per-page metadata, generates JSON-LD (FAQPage from the visible FAQ markup) and copies assets.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://zyvibe.com';
const CONTACT_EMAIL = 'contact@zyvibe.com';
const read = (path) => readFileSync(join(root, path), 'utf8');

const organization = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Zyvibe',
  url: `${SITE}/`,
  email: CONTACT_EMAIL,
  logo: `${SITE}/apple-touch-icon.png`,
  description: 'Founder-led web design studio offering the Website Sprint: a custom business website in two weeks for $1,999.',
};

const website = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: 'Zyvibe',
  url: `${SITE}/`,
  publisher: { '@id': `${SITE}/#organization` },
};

const service = {
  '@type': 'Service',
  '@id': `${SITE}/#website-sprint`,
  name: 'Zyvibe Website Sprint',
  serviceType: 'Custom business website design and development',
  description: 'A custom business website designed and built in two weeks, with two revision rounds and a full refund before kickoff.',
  provider: { '@id': `${SITE}/#organization` },
  areaServed: 'Worldwide',
  offers: {
    '@type': 'Offer',
    price: '1999',
    priceCurrency: 'USD',
    url: `${SITE}/website-sprint`,
    availability: 'https://schema.org/InStock',
  },
};

const pages = [
  {
    src: 'index.html',
    out: 'index.html',
    path: '/',
    title: 'Website Sprint — Custom Business Website in Two Weeks | Zyvibe',
    ogTitle: 'Launch a Custom Business Website in Two Weeks | Zyvibe',
    description: 'Launch a custom business website in two weeks. $1,999 one-time. No subscriptions. Two revision rounds included.',
    schema: [organization, website, service],
  },
  {
    src: 'website-sprint.html',
    out: 'website-sprint.html',
    path: '/website-sprint',
    title: 'Start Your Website Sprint | Zyvibe',
    ogTitle: 'Start Your Website Sprint | Zyvibe',
    description: 'Tell us about your business and vision. We build your custom website in two weeks for $1,999.',
    schema: [organization, service],
  },
  {
    src: 'about.html',
    out: 'about.html',
    path: '/about',
    title: 'About Zyvibe — Small by Design, Direct by Default',
    ogTitle: 'About Zyvibe — Small by Design, Direct by Default',
    description: 'Zyvibe is a founder-led web design studio. One client at a time. Two-week delivery. No account managers.',
    schema: [organization, { '@type': 'AboutPage', name: 'About Zyvibe', url: `${SITE}/about`, about: { '@id': `${SITE}/#organization` } }],
  },
  {
    src: 'contact.html',
    out: 'contact.html',
    path: '/contact',
    title: 'Contact Zyvibe — Start a Conversation',
    ogTitle: 'Contact Zyvibe — Start a Conversation',
    description: 'Reach Zyvibe directly. No forms routed to interns. Expect a reply within one business day.',
    schema: [organization, { '@type': 'ContactPage', name: 'Contact Zyvibe', url: `${SITE}/contact`, about: { '@id': `${SITE}/#organization` } }],
  },
  {
    src: 'faq.html',
    out: 'faq.html',
    path: '/faq',
    title: 'Website Sprint FAQ | Zyvibe',
    ogTitle: 'Website Sprint FAQ | Zyvibe',
    description: "Answers to common questions about Zyvibe's Website Sprint: pricing, timeline, revisions, refunds, and tech stack.",
    schema: [organization],
    faqSchema: true,
  },
  {
    src: 'thank-you.html',
    out: 'thank-you.html',
    path: '/thank-you',
    title: 'Request Received | Zyvibe',
    ogTitle: 'Request Received | Zyvibe',
    description: 'Your Website Sprint request has been received.',
    schema: [organization],
    noindex: true,
  },
  {
    src: '404.html',
    out: '404.html',
    path: '/404',
    title: 'Page Not Found | Zyvibe',
    ogTitle: 'Page Not Found | Zyvibe',
    description: 'The page you were looking for does not exist.',
    schema: [organization],
    noindex: true,
  },
];

const decode = (text) =>
  text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

function faqEntities(html) {
  const items = [...html.matchAll(/<details class="faq-item"[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<div class="faq-answer">([\s\S]*?)<\/div>\s*<\/details>/g)];
  if (items.length === 0) throw new Error('faq.html: no FAQ items found for FAQPage schema');
  return items.map(([, question, answer]) => ({
    '@type': 'Question',
    name: decode(question),
    acceptedAnswer: { '@type': 'Answer', text: decode(answer) },
  }));
}

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// JSON inside <script> must not be able to close the tag.
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const fill = (template, values) =>
  template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Missing template value: ${key}`);
    return values[key];
  });

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const head = read('partials/head.html');
const header = read('partials/header.html');
const footer = read('partials/footer.html');
const year = String(new Date().getUTCFullYear());

for (const page of pages) {
  const body = read(join('pages', page.src));
  const canonical = page.path === '/404' ? `${SITE}/` : `${SITE}${page.path === '/' ? '/' : page.path}`;
  const graph = [...page.schema];
  if (page.faqSchema) graph.push({ '@type': 'FAQPage', url: canonical, mainEntity: faqEntities(body) });

  const headHtml = fill(head, {
    title: escapeAttr(page.title),
    ogTitle: escapeAttr(page.ogTitle),
    description: escapeAttr(page.description),
    canonical,
    robots: page.noindex ? 'noindex, nofollow' : 'index, follow',
    jsonLd: safeJson({ '@context': 'https://schema.org', '@graph': graph }),
  });
  const html = `<!doctype html>
<html lang="en">
  <head>
${headHtml}  </head>
  <body data-page="${page.path}">
${header}    <main id="main">
${fill(body, { contactEmail: CONTACT_EMAIL })}    </main>
${fill(footer, { contactEmail: CONTACT_EMAIL, year })}  </body>
</html>
`;
  const outPath = join(dist, page.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}

cpSync(join(root, 'assets'), join(dist, 'assets'), {
  recursive: true,
  filter: (src) => !src.endsWith('input.css'),
});
cpSync(join(root, 'static'), dist, { recursive: true });

for (const required of ['favicon.ico', 'apple-touch-icon.png', 'robots.txt', 'sitemap.xml', '_headers', 'assets/images/og-image.png']) {
  if (!existsSync(join(dist, required))) throw new Error(`Build output is missing ${required}`);
}
console.log(`Built ${pages.length} pages into dist/`);
