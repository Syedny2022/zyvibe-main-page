import { SITE } from "./site";

type Json = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE.url}/#organization`;

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Zyvibe",
    url: SITE.url,
    logo: `${SITE.url}/brand/zyvibe-avatar.svg`,
    description:
      "Zyvibe publishes a directory of real-world AI agent use cases with source links, requirements, and evidence labels.",
    founder: { "@type": "Person", name: SITE.founder.name, url: SITE.founder.url },
    sameAs: [
      "https://blog.zyvibe.com",
      "https://seo.zyvibe.com",
      "https://zyvibe.me",
      "https://github.com/Syedny2022",
    ],
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en",
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path?: string; url?: string }[];
}): Json {
  return {
    "@type": "CollectionPage",
    "@id": `${SITE.url}${input.path}#page`,
    url: `${SITE.url}${input.path}`,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url ?? `${SITE.url}${item.path}`,
      })),
    },
  };
}

export function webPageSchema(input: { name: string; description: string; path: string }): Json {
  return {
    "@type": "WebPage",
    "@id": `${SITE.url}${input.path}#webpage`,
    url: `${SITE.url}${input.path}`,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en",
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  section: string;
}): Json {
  return {
    "@type": "Article",
    "@id": `${SITE.url}${input.path}#article`,
    headline: input.headline,
    description: input.description,
    articleSection: input.section,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: `${SITE.url}${input.path}`,
  };
}

export function techArticleSchema(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  sourceUrl: string;
}): Json {
  return {
    "@type": "TechArticle",
    "@id": `${SITE.url}${input.path}#article`,
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: `${SITE.url}${input.path}`,
    citation: input.sourceUrl,
  };
}

export function personSchema(): Json {
  return {
    "@type": "Person",
    "@id": `${SITE.url}/about#person`,
    name: SITE.founder.name,
    jobTitle: "Founder, Zyvibe",
    url: SITE.founder.url,
    sameAs: ["https://github.com/Syedny2022", "https://zyvibe.me"],
    worksFor: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function graph(...nodes: Json[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
