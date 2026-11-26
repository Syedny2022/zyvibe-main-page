import type { MetadataRoute } from "next";
import {
  getAgentCollections,
  getGoalCollections,
  getHarnessCollections,
  getPlaybooks,
  getUseCases,
} from "@/lib/content";
import { SITE } from "@/lib/site";

const LAST_CHECK = new Date("2026-11-21T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/use-cases",
    "/goals",
    "/agents",
    "/harnesses",
    "/playbooks",
    "/showcase",
    "/submit",
    "/promote",
    "/methodology",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclosures",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: LAST_CHECK,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const useCases = getUseCases().map((item) => ({
    url: `${SITE.url}/use-cases/${item.slug}`,
    lastModified: new Date(`${item.source.checkedOn}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const goals = getGoalCollections().map((goal) => ({
    url: `${SITE.url}/goals/${goal.slug}`,
    lastModified: LAST_CHECK,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const agents = getAgentCollections().map((agent) => ({
    url: `${SITE.url}/agents/${agent.slug}`,
    lastModified: LAST_CHECK,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const harnesses = getHarnessCollections().map((harness) => ({
    url: `${SITE.url}/harnesses/${harness.slug}`,
    lastModified: LAST_CHECK,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const playbooks = getPlaybooks().map((playbook) => ({
    url: `${SITE.url}/playbooks/${playbook.slug}`,
    lastModified: LAST_CHECK,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...goals, ...agents, ...harnesses, ...playbooks, ...useCases];
}
