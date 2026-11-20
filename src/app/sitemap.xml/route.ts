import { getAllUseCases, getAllSoloServices, getAllBuilderShowcases } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zyvibe.com';
  const seoBaseUrl = 'https://seo.zyvibe.com';

  const allUseCases = getAllUseCases();
  const allServices = getAllSoloServices();
  const allShowcases = getAllBuilderShowcases();

  const staticUrls: SitemapEntry[] = [
    { loc: `${baseUrl}`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/new`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/showcase`, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/promote`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${seoBaseUrl}`, changefreq: 'daily', priority: '0.9' },
    { loc: `${seoBaseUrl}/services`, changefreq: 'daily', priority: '0.9' },
  ];

  const useCaseUrls: SitemapEntry[] = allUseCases.map((item) => ({
    loc: `${baseUrl}/use-case/${item.slug}`,
    lastmod: item.date,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const serviceUrls: SitemapEntry[] = allServices.map((item) => ({
    loc: `${seoBaseUrl}/services/${item.slug}`,
    lastmod: item.createdAt ? item.createdAt.split('T')[0] : undefined,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const showcaseUrls: SitemapEntry[] = allShowcases.map((item) => ({
    loc: `${baseUrl}/showcase/${item.slug}`,
    lastmod: item.createdAt ? item.createdAt.split('T')[0] : undefined,
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const urls: SitemapEntry[] = [...staticUrls, ...useCaseUrls, ...serviceUrls, ...showcaseUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
