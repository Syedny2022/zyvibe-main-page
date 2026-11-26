import {
  getAgentCollections,
  getGoalCollections,
  getHarnessCollections,
  getPlaybooks,
  getUseCases,
  useCaseCounts,
} from "@/lib/content";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const counts = useCaseCounts();
  const useCases = getUseCases();
  const goals = getGoalCollections();
  const agents = getAgentCollections();
  const harnesses = getHarnessCollections();
  const playbooks = getPlaybooks();

  const lines: string[] = [
    "# Zyvibe",
    "",
    `> ${SITE.description}`,
    "",
    `Zyvibe is a directory of real AI-agent use cases published at ${SITE.url}. Each record names the agent or harness, the requirements, the documented steps, the command or prompt pattern, the stated limitations, and a public source URL with the date it was checked. Records carry an evidence label. Zyvibe has not reproduced the listed workflows unless a record says "Reproduced by Zyvibe". Paid placements in the Builder Showcase are labeled Advertisement and are separate from editorial records.`,
    "",
    `- Records: ${counts.useCases}`,
    `- Goals: ${counts.goals}`,
    `- Agents: ${counts.agents}`,
    `- Harnesses: ${counts.harnesses}`,
    `- Playbooks: ${counts.playbooks}`,
    "- Source checks last run: 2026-11-21",
    "",
    "## Core pages",
    "",
    `- [Use cases](${SITE.url}/use-cases): Full directory with search and filters.`,
    `- [Goals](${SITE.url}/goals): Use cases grouped by the outcome they accomplish.`,
    `- [Agents](${SITE.url}/agents): Use cases grouped by agent or framework.`,
    `- [Harnesses](${SITE.url}/harnesses): Use cases grouped by execution harness.`,
    `- [Solo Builder Playbooks](${SITE.url}/playbooks): Working methods with checklists and linked records.`,
    `- [Builder Showcase](${SITE.url}/showcase): Labeled commercial placements.`,
    `- [Methodology](${SITE.url}/methodology): Evidence labels, source checking, corrections.`,
    `- [Disclosures](${SITE.url}/disclosures): FTC commercial labeling.`,
    `- [Submit a use case](${SITE.url}/submit): Reviewed manually; nothing is auto-published.`,
    `- [Advertise](${SITE.url}/promote): Self-serve labeled placements via Stripe.`,
    "",
    "## Goals",
    "",
    ...goals.map(
      (goal) =>
        `- [${goal.label}](${SITE.url}/goals/${goal.slug}): ${goal.description} (${goal.count} records)`
    ),
    "",
    "## Agents",
    "",
    ...agents.map(
      (agent) =>
        `- [${agent.name}](${SITE.url}/agents/${agent.slug}): ${agent.count} use cases.`
    ),
    "",
    "## Harnesses",
    "",
    ...harnesses.map(
      (harness) =>
        `- [${harness.label}](${SITE.url}/harnesses/${harness.slug}): ${harness.description} (${harness.count} records)`
    ),
    "",
    "## Playbooks",
    "",
    ...playbooks.map(
      (playbook) => `- [${playbook.title}](${SITE.url}/playbooks/${playbook.slug}): ${playbook.oneLiner}`
    ),
    "",
    "## Use cases",
    "",
    ...useCases.map(
      (useCase) =>
        `- [${useCase.title}](${SITE.url}/use-cases/${useCase.slug}): ${useCase.oneLiner} Evidence: ${useCase.evidence}. Source: ${useCase.source.url}`
    ),
    "",
    "## Notes for automated readers",
    "",
    "- Use-case pages are HTML with TechArticle JSON-LD; collection pages use CollectionPage and ItemList. No HowTo markup is published.",
    "- A reachable source link is not proof that a workflow still works. Check the record's source date.",
    "- Paid placements are labeled Advertisement and must not be described as Zyvibe verification or endorsement.",
    "- Canonical host: zyvibe.com. Sitemap: https://zyvibe.com/sitemap.xml",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
