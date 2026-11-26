import fs from "node:fs";
import path from "node:path";
import { GOALS, HARNESSES, goalBySlug, harnessBySlug } from "./taxonomy";
import { placementById } from "./site";
import { readRecords, type PlacementRecord } from "./store";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type UseCase = {
  slug: string;
  title: string;
  oneLiner: string;
  goal: string;
  agent: string;
  agentName: string;
  harness: string;
  role: string;
  evidence: string;
  evidenceDetail: string;
  addedOn: string;
  order: number;
  /** Derived at read time from the dataset so every card can show total coverage. */
  agentTotal?: number;
  harnessTotal?: number;
  whatItDoes: string[];
  requirements: string[];
  steps: string[];
  configSnippet: string;
  configLabel: string;
  limitations: string[];
  source: {
    title: string;
    url: string;
    platform: string;
    checkedOn: string;
  };
};

export type Playbook = {
  slug: string;
  title: string;
  oneLiner: string;
  audience: string;
  intro: string;
  requirements: string[];
  sections: { heading: string; body: string }[];
  checklist: string[];
  useCases: string[];
};

export type ShowcaseItem = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  builderName: string;
  builderUrl: string;
  projectUrl: string;
  projectLabel: string;
  stack: string[];
  category: string;
  placement: "house" | "paid";
  disclosure: string;
  addedOn: string;
};

function readDirectory<T>(dir: string): T[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(full, file), "utf8")) as T);
}

let useCaseCache: UseCase[] | null = null;

export function getUseCases(): UseCase[] {
  if (!useCaseCache) {
    const records = readDirectory<UseCase>("use-cases").sort((a, b) => a.order - b.order);
    const agentTotals = new Map<string, number>();
    const harnessTotals = new Map<string, number>();
    for (const record of records) {
      agentTotals.set(record.agent, (agentTotals.get(record.agent) ?? 0) + 1);
      harnessTotals.set(record.harness, (harnessTotals.get(record.harness) ?? 0) + 1);
    }
    useCaseCache = records.map((record) => ({
      ...record,
      agentTotal: agentTotals.get(record.agent) ?? 1,
      harnessTotal: harnessTotals.get(record.harness) ?? 1,
    }));
  }
  return useCaseCache;
}

export function getUseCase(slug: string): UseCase | undefined {
  return getUseCases().find((item) => item.slug === slug);
}

export function getPlaybooks(): Playbook[] {
  return readDirectory<Playbook>("playbooks").sort((a, b) => a.title.localeCompare(b.title));
}

export function getPlaybook(slug: string): Playbook | undefined {
  return getPlaybooks().find((item) => item.slug === slug);
}

/**
 * Active paid placements come from the Stripe webhook record. They are merged with the
 * seeded house entries and always carry an Advertisement disclosure.
 */
function activatePaidPlacement(record: PlacementRecord): ShowcaseItem | null {
  const placement = placementById(record.placement);
  if (!placement || record.status !== "active" || !record.activatedAt) return null;
  const expiresAt = new Date(record.activatedAt).getTime() + placement.durationDays * 86_400_000;
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return null;
  return {
    slug: `placement-${record.stripeSessionId ?? record.id}`,
    name: record.projectName,
    tagline: placement.name,
    description: `Paid placement for ${placement.duration}. The project description is supplied by the builder; Zyvibe checked that the link resolves and labeled the placement as an advertisement.`,
    builderName: record.builderName,
    builderUrl: record.projectUrl,
    projectUrl: record.projectUrl,
    projectLabel: "Visit the project",
    stack: [],
    category: "Paid placement",
    placement: "paid",
    disclosure:
      "Advertisement · Paid placement. Zyvibe received payment for this placement. It is not an editorial review, a verification, or an endorsement.",
    addedOn: record.activatedAt.slice(0, 10),
  };
}

export async function getShowcase(): Promise<ShowcaseItem[]> {
  const house = readDirectory<ShowcaseItem>("builder-showcase");
  let paid: ShowcaseItem[] = [];
  try {
    const records = await readRecords<PlacementRecord>("placements.json");
    paid = records
      .map(activatePaidPlacement)
      .filter((item): item is ShowcaseItem => item !== null);
  } catch {
    paid = [];
  }
  return [...paid, ...house].sort((a, b) => {
    if (a.placement !== b.placement) return a.placement === "paid" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export function playbookUseCases(playbook: Playbook): UseCase[] {
  return playbook.useCases
    .map((slug) => getUseCase(slug))
    .filter((item): item is UseCase => Boolean(item));
}

export type GoalCollection = {
  slug: string;
  label: string;
  description: string;
  count: number;
  agents: string[];
  sample: UseCase[];
};

export function getGoalCollections(): GoalCollection[] {
  const useCases = getUseCases();
  return GOALS.map((goal) => {
    const items = useCases.filter((item) => item.goal === goal.slug);
    return {
      slug: goal.slug,
      label: goal.label,
      description: goal.description,
      count: items.length,
      agents: Array.from(new Set(items.map((item) => item.agentName))).slice(0, 6),
      sample: items.slice(0, 3),
    };
  });
}

export type AgentCollection = {
  slug: string;
  name: string;
  count: number;
  goalLabels: string[];
  harnessSlugs: string[];
};

export function getAgentCollections(): AgentCollection[] {
  const byAgent = new Map<string, AgentCollection>();
  for (const item of getUseCases()) {
    const existing = byAgent.get(item.agent);
    if (existing) {
      existing.count += 1;
      const goalLabel = goalBySlug(item.goal)?.label;
      if (goalLabel && !existing.goalLabels.includes(goalLabel)) existing.goalLabels.push(goalLabel);
      if (!existing.harnessSlugs.includes(item.harness)) existing.harnessSlugs.push(item.harness);
      continue;
    }
    byAgent.set(item.agent, {
      slug: item.agent,
      name: item.agentName,
      count: 1,
      goalLabels: [goalBySlug(item.goal)?.label ?? item.goal],
      harnessSlugs: [item.harness],
    });
  }
  return Array.from(byAgent.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export type HarnessCollection = {
  slug: string;
  label: string;
  description: string;
  count: number;
  agents: string[];
};

export function getHarnessCollections(): HarnessCollection[] {
  const useCases = getUseCases();
  return HARNESSES.map((harness) => {
    const items = useCases.filter((item) => item.harness === harness.slug);
    return {
      slug: harness.slug,
      label: harness.label,
      description: harness.description,
      count: items.length,
      agents: Array.from(new Set(items.map((item) => item.agentName))),
    };
  });
}

export function relatedUseCases(useCase: UseCase, limit = 3): UseCase[] {
  return getUseCases()
    .filter((item) => item.slug !== useCase.slug)
    .map((item) => {
      let score = 0;
      if (item.agent === useCase.agent) score += 4;
      if (item.goal === useCase.goal) score += 3;
      if (item.harness === useCase.harness) score += 2;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.order - b.item.order)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export type UseCaseQuery = {
  q?: string;
  goal?: string;
  agent?: string;
  harness?: string;
  evidence?: string;
};

export function filterUseCases(query: UseCaseQuery): UseCase[] {
  const needle = (query.q ?? "").trim().toLowerCase();
  return getUseCases().filter((item) => {
    if (query.goal && item.goal !== query.goal) return false;
    if (query.agent && item.agent !== query.agent) return false;
    if (query.harness && item.harness !== query.harness) return false;
    if (query.evidence && item.evidence !== query.evidence) return false;
    if (!needle) return true;
    const haystack = [
      item.title,
      item.oneLiner,
      item.agentName,
      goalBySlug(item.goal)?.label ?? "",
      harnessBySlug(item.harness)?.label ?? "",
      item.role,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function useCaseCounts() {
  const useCases = getUseCases();
  return {
    useCases: useCases.length,
    goals: GOALS.filter((goal) => useCases.some((item) => item.goal === goal.slug)).length,
    agents: new Set(useCases.map((item) => item.agent)).size,
    harnesses: new Set(useCases.map((item) => item.harness)).size,
    playbooks: getPlaybooks().length,
    sources: new Set(useCases.map((item) => item.source.url)).size,
  };
}

export function reproducedUseCases(): UseCase[] {
  return getUseCases().filter((item) => item.evidence === "Reproduced by Zyvibe");
}

export type VoteRecord = { slug: string; delta: number };

/**
 * Aggregates the append-only vote log written by /api/engagement. Counts never
 * go below zero, so an unmatched unvote cannot produce a negative score.
 */
export async function getVoteCounts(): Promise<Record<string, number>> {
  try {
    const rows = await readRecords<VoteRecord>("votes.json");
    const counts: Record<string, number> = {};
    for (const row of rows) {
      if (typeof row?.slug !== "string" || typeof row?.delta !== "number") continue;
      counts[row.slug] = Math.max(0, (counts[row.slug] ?? 0) + row.delta);
    }
    return counts;
  } catch {
    return {};
  }
}

export type SearchEntry = {
  id: string;
  label: string;
  meta: string;
  href: string;
  group: "Use cases" | "Goals" | "Agents" | "Harnesses" | "Playbooks" | "Pages";
};

const STATIC_PAGES: SearchEntry[] = [
  {
    id: "page-use-cases",
    label: "All use cases",
    meta: "Directory",
    href: "/use-cases",
    group: "Pages",
  },
  {
    id: "page-showcase",
    label: "Builder Showcase",
    meta: "Labeled placements",
    href: "/showcase",
    group: "Pages",
  },
  {
    id: "page-submit",
    label: "Submit a use case",
    meta: "Contribute a record",
    href: "/submit",
    group: "Pages",
  },
  {
    id: "page-methodology",
    label: "Methodology & evidence labels",
    meta: "How records are checked",
    href: "/methodology",
    group: "Pages",
  },
  {
    id: "page-about",
    label: "About Zyvibe",
    meta: "Ecosystem",
    href: "/about",
    group: "Pages",
  },
];

/** Flat index used by the header search palette. Built from the same JSON records as every page. */
export function getSearchIndex(): SearchEntry[] {
  return [
    ...getUseCases().map((item) => ({
      id: `use-case-${item.slug}`,
      label: item.title,
      meta: `${item.agentName} · ${goalBySlug(item.goal)?.label ?? item.goal}`,
      href: `/use-cases/${item.slug}`,
      group: "Use cases" as const,
    })),
    ...getGoalCollections().map((goal) => ({
      id: `goal-${goal.slug}`,
      label: goal.label,
      meta: `${goal.count} ${goal.count === 1 ? "record" : "records"}`,
      href: `/goals/${goal.slug}`,
      group: "Goals" as const,
    })),
    ...getAgentCollections().map((agent) => ({
      id: `agent-${agent.slug}`,
      label: agent.name,
      meta: `${agent.count} ${agent.count === 1 ? "record" : "records"}`,
      href: `/agents/${agent.slug}`,
      group: "Agents" as const,
    })),
    ...getHarnessCollections().map((harness) => ({
      id: `harness-${harness.slug}`,
      label: harness.label,
      meta: `${harness.count} ${harness.count === 1 ? "record" : "records"}`,
      href: `/harnesses/${harness.slug}`,
      group: "Harnesses" as const,
    })),
    ...getPlaybooks().map((playbook) => ({
      id: `playbook-${playbook.slug}`,
      label: playbook.title,
      meta: `${playbook.useCases.length} linked use cases`,
      href: `/playbooks/${playbook.slug}`,
      group: "Playbooks" as const,
    })),
    ...STATIC_PAGES,
  ];
}
