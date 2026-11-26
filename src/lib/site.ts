export const SITE = {
  name: "Zyvibe",
  domain: "zyvibe.com",
  url: "https://zyvibe.com",
  title: "AI Agent Use Cases & Workflows | Zyvibe",
  description:
    "Explore real-world AI agent use cases by goal, agent, and harness, with source links, requirements, and implementation details where available.",
  h1: "Real-World AI Agent Use Cases & Workflows",
  supporting:
    "Discover what people are doing with AI agents and harnesses. Explore source-backed examples, requirements, and implementation details where available.",
  founder: {
    name: "Syed Moh",
    role: "Founder, Zyvibe",
    url: "https://zyvibe.me",
  },
  emails: {
    contact: "contact@zyvibe.com",
    privacy: "contact@zyvibe.com",
    corrections: "contact@zyvibe.com",
    transactionalFrom: "Zyvibe <receipts@mail.zyvibe.com>",
    alertsTo: "listings@mail.zyvibe.com",
  },
  analytics: {
    googleTagId: "GT-NNXKN8VR",
    crossDomains: ["zyvibe.com", "seo.zyvibe.com", "blog.zyvibe.com", "zyvibe.me"],
  },
} as const;

export const NAV = [
  { label: "Use Cases", href: "/use-cases" },
  { label: "Goals", href: "/goals" },
  { label: "Agents & Harnesses", href: "/agents" },
  { label: "Solo Builder Playbooks", href: "/playbooks" },
  { label: "Builder Showcase", href: "/showcase" },
  { label: "Ecosystem", href: "/about" },
  { label: "Submit a Use Case", href: "/submit" },
] as const;

export const ECOSYSTEM = [
  {
    label: "Discover Workflows",
    href: "https://zyvibe.com",
    domain: "zyvibe.com",
    description: "The use-case directory you are reading.",
  },
  {
    label: "Read Guides",
    href: "https://blog.zyvibe.com",
    domain: "blog.zyvibe.com",
    description: "Implementation guides, Search Console walkthroughs, and publishing workflows.",
  },
  {
    label: "Find Specialists",
    href: "https://seo.zyvibe.com",
    domain: "seo.zyvibe.com",
    description: "Remote solo developers and solo agencies for agent and SEO work.",
  },
  {
    label: "Moh & Blueprints",
    href: "https://zyvibe.me",
    domain: "zyvibe.me",
    description: "Moh's projects, implementation notes, and blueprint catalog.",
  },
] as const;

export type Placement = {
  id: string;
  name: string;
  duration: string;
  durationDays: number;
  priceLabel: string;
  amount: number;
  currency: "usd";
  summary: string;
  includes: string[];
};

export const PLACEMENTS: Placement[] = [
  {
    id: "showcase-30",
    name: "Builder Showcase, 30 days",
    duration: "30 days",
    durationDays: 30,
    priceLabel: "$49",
    amount: 4900,
    currency: "usd",
    summary:
      "One listed builder project in the Builder Showcase with an Advertisement label and one outbound link.",
    includes: [
      "One project card on /showcase with a visible Advertisement label",
      "One outbound link to your project URL, safety-checked before activation",
      "Relisted in digest mentions when relevant placements are discussed",
    ],
  },
  {
    id: "showcase-90",
    name: "Builder Showcase, 90 days",
    duration: "90 days",
    durationDays: 90,
    priceLabel: "$149",
    amount: 14900,
    currency: "usd",
    summary:
      "The 30-day showcase placement held for a full quarter at a lower monthly rate.",
    includes: [
      "Everything in the 30-day placement for 90 days",
      "One placement update per month, such as a new project URL or tagline",
      "Placement record and activation receipt kept on file",
    ],
  },
];

export function placementById(id: string) {
  return PLACEMENTS.find((placement) => placement.id === id);
}

/**
 * Page-specific OpenGraph block. Every route states its own absolute URL so a
 * child page never inherits the homepage `og:url` from the root layout.
 */
export function pageOpenGraph(input: {
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}) {
  return {
    type: input.type ?? "website",
    siteName: SITE.name,
    title: input.title,
    description: input.description,
    url: `${SITE.url}${input.path}`,
    locale: "en_US",
  };
}
