import type { Metadata } from "next";
import Link from "next/link";
import { UseCaseExplorer } from "@/components/UseCaseExplorer";
import { JsonLd } from "@/components/JsonLd";
import {
  getAgentCollections,
  getGoalCollections,
  getHarnessCollections,
  getUseCases,
  getVoteCounts,
  useCaseCounts,
} from "@/lib/content";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

const description =
  "Browse every source-checked AI agent use case by goal, agent, and harness. Each record lists requirements, steps, a source link, and known limitations.";

export const metadata: Metadata = {
  title: "AI Agent Use Cases",
  description,
  alternates: { canonical: "/use-cases" },
  openGraph: pageOpenGraph({ path: "/use-cases", title: "AI Agent Use Cases", description }),
};

export default async function UseCasesPage() {
  const items = getUseCases();
  const voteCounts = await getVoteCounts();
  const counts = useCaseCounts();
  const goals = getGoalCollections().map((goal) => ({ slug: goal.slug, label: goal.label }));
  const harnesses = getHarnessCollections()
    .filter((harness) => harness.count > 0)
    .map((harness) => ({ slug: harness.slug, label: harness.label }));
  const agents = getAgentCollections().map((agent) => ({ slug: agent.slug, name: agent.name }));
  const evidenceLabels = Array.from(new Set(items.map((item) => item.evidence))).sort();

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "AI Agent Use Cases",
            description,
            path: "/use-cases",
            items: items.map((item) => ({
              name: item.title,
              path: `/use-cases/${item.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Use Cases", path: "/use-cases" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Use Cases</span>
          </nav>
          <p className="page-eyebrow label-caps">
            Directory · {counts.useCases} records · sources checked 21 Nov 2026
          </p>
          <h1 className="page-title">AI Agent Use Cases</h1>
          <p className="page-lead">
            Every record names the agent or harness, the requirements, the steps that were
            documented, and the source it came from. Filter by goal or harness, or search for a task.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <UseCaseExplorer
            items={items}
            goals={goals}
            harnesses={harnesses}
            agents={agents}
            evidenceLabels={evidenceLabels}
            voteCounts={voteCounts}
          />
          <div className="page-footnote">
            <p>
              Records carry an evidence label. <strong>Documented</strong> means the source lists
              requirements and steps; <strong>Reported</strong> means a source describes the
              workflow. Neither label means Zyvibe tested it.{" "}
              <Link href="/methodology">Read the methodology</Link>.
            </p>
            <p>
              Found something outdated? <Link href="/contact">Report an outdated workflow</Link> or{" "}
              <Link href="/submit">submit a replacement</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
