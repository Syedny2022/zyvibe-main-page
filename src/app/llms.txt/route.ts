import { getAllUseCases, getAllSoloServices, getAllBuilderShowcases } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allUseCases = getAllUseCases();
  const allServices = getAllSoloServices();
  const allShowcases = getAllBuilderShowcases();

  const useCasesMarkdown = allUseCases
    .map((u) => `- [${u.title}](https://zyvibe.com/use-case/${u.slug}): ${u.oneLiner} (Tool: ${u.tool}, Category: ${u.category})`)
    .join('\n');

  const servicesMarkdown = allServices
    .map((s) => `- [${s.name} - ${s.title}](https://seo.zyvibe.com/services/${s.slug}): ${s.oneLiner} (Rate: ${s.rateOrPricing}, Location: ${s.location})`)
    .join('\n');

  const showcasesMarkdown = allShowcases
    .map((p) => `- [${p.name}](https://zyvibe.com/showcase/${p.slug}): ${p.tagline} (Builder: ${p.builderName}, Category: ${p.category})`)
    .join('\n');

  const content = `# Zyvibe Network (zyvibe.com & seo.zyvibe.com)

> Verified directory of practical AI agent use cases, remote solo developers & boutique solo agencies, and builder systems.

## Network Architecture & Cross-Links
- Primary Hub: https://zyvibe.com (Real AI agent workflows and builder showcases)
- Service Index: https://seo.zyvibe.com (Remote solo developers and solo agencies)
- Engineering Blog: https://blog.zyvibe.com (Playbooks and technical write-ups)
- Founder Profile: https://zyvibe.me (Syed M. - GitHub: https://github.com/Syedny2022)
- Promotion & Paid Listings: https://zyvibe.com/promote
- Transactional Notifications: mail.zyvibe.com (Strictly payment confirmations)

## Verified AI Agent Workflows & Use Cases
${useCasesMarkdown}

## Remote Solo Developers & Solo Agencies (seo.zyvibe.com)
${servicesMarkdown}

## Builder Showcases & Automated Tools
${showcasesMarkdown}

## Quality & Anti-Fluff Standards
1. Zero local businesses: seo.zyvibe.com lists strictly remote developers and solo agencies.
2. Verified Source URLs: Every use case links directly to primary public discussions (Reddit, HN, X, GitHub).
3. The Reality Check: Every entry lists first-try errors, manual review times, and actual tool limitations.
4. Runnable Prompt Templates: Standardized prompts with bracketed placeholders ready for execution.
`.trim();

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
