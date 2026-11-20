export interface UseCase {
  slug: string;
  title: string;
  oneLiner: string;
  date: string;
  discoveredToday?: boolean;
  category: string;
  categorySlug: string;
  role: string;
  tool: string;
  toolSlug: string;
  difficulty: string;
  problem: string;
  workflow: string[];
  prompt: string;
  promptPlaceholders: string[];
  realityCheck: {
    firstTryMistake: string;
    manualCleanupTime: string;
    limitations: string;
  };
  source: {
    platform: string;
    author: string;
    url: string;
    verifiedDate: string;
  };
  accountsCount?: number;
  votes?: number;
}

export interface BuilderShowcase {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  builderName: string;
  builderHandle: string;
  builderGithub?: string;
  builderWebsite?: string;
  agentStack: string[];
  websiteUrl: string;
  category: string;
  metrics?: string;
  featured: boolean;
  createdAt: string;
}

export interface SoloService {
  slug: string;
  name: string;
  title: string;
  oneLiner: string;
  description: string;
  providerType: 'Solo Developer' | 'Solo Agency' | 'Remote Consultant';
  founderName: string;
  founderHandle: string;
  location: string;
  rateOrPricing: string;
  skillsAndStack: string[];
  portfolioOrProofUrl: string;
  contactEmailOrUrl: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
}

export interface Subscriber {
  email: string;
  source?: string;
  createdAt: string;
  verified: boolean;
}

export interface CategoryCount {
  name: string;
  slug: string;
  count: number;
}

export interface ToolCount {
  name: string;
  slug: string;
  count: number;
}
