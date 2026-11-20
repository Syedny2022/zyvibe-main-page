import { getAllUseCases, getAllSoloServices, getAllBuilderShowcases } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zyvibe.com';
  const allUseCases = getAllUseCases();
  const allServices = getAllSoloServices();

  const useCaseItems = allUseCases.map((item) => {
    const pubDate = new Date(item.date).toUTCString();
    return `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${baseUrl}/use-case/${item.slug}</link>
      <guid>${baseUrl}/use-case/${item.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${item.oneLiner} | Tool: ${item.tool} | Category: ${item.category}]]></description>
      <category>${item.category}</category>
    </item>`;
  });

  const serviceItems = allServices.map((service) => {
    const pubDate = new Date(service.createdAt).toUTCString();
    return `    <item>
      <title><![CDATA[Remote Solo Service: ${service.name} (${service.title})]]></title>
      <link>https://seo.zyvibe.com/services/${service.slug}</link>
      <guid>https://seo.zyvibe.com/services/${service.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${service.oneLiner} | Rate: ${service.rateOrPricing} | Location: ${service.location}]]></description>
      <category>Solo Services</category>
    </item>`;
  });

  const allItems = [...useCaseItems, ...serviceItems].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Zyvibe Network Feed (zyvibe.com &amp; seo.zyvibe.com)</title>
    <link>${baseUrl}</link>
    <description>Verified AI agent workflows, remote solo developers &amp; solo agencies, and builder systems.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${allItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
