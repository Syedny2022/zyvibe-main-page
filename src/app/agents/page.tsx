import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getAgentCollections, getHarnessCollections, useCaseCounts } from "@/lib/content";
import { harnessBySlug } from "@/lib/taxonomy";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

const description =
  "Browse AI agent use cases by agent, framework, or execution harness — terminal CLIs, IDE extensions, cloud agents, SDKs, no-code builders, and sandboxes.";

export const metadata: Metadata = {
  title: "Browse by Agent or Harness",
  description,
  alternates: { canonical: "/agents" },
  openGraph: pageOpenGraph({
    path: "/agents",
    title: "Browse by Agent or Harness",
    description,
  }),
};

export default function AgentsPage() {
  const agents = getAgentCollections();
  const harnesses = getHarnessCollections();
  const counts = useCaseCounts();

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Browse by Agent or Harness",
            description,
            path: "/agents",
            items: agents.map((agent) => ({
              name: agent.name,
              path: `/agents/${agent.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Agents & Harnesses", path: "/agents" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Agents &amp; Harnesses</span>
          </nav>
          <p className="page-eyebrow label-caps">
            {counts.agents} agents · {counts.harnesses} harnesses
          </p>
          <h1 className="page-title">Browse by Agent or Harness</h1>
          <p className="page-lead">
            An agent is the product or framework doing the work. A harness is where it runs: your
            terminal, an editor, a cloud worker, a sandbox, or a visual builder. Filtering by harness
            tells you how much control and isolation you actually get.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="grid-12 section-header">
            <span className="section-header-index label-caps">A</span>
            <h2 className="section-header-title">Agents &amp; frameworks</h2>
            <div className="section-header-note">
              <span className="label-caps">Sorted by name</span>
            </div>
          </div>

          <ul className="agent-list">
            {agents.map((agent) => (
              <li key={agent.slug}>
                <Link href={`/agents/${agent.slug}`} className="agent-row">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-meta mono">
                    {agent.harnessSlugs
                      .map((slug) => harnessBySlug(slug)?.label.replace(" harness", ""))
                      .join(" · ")}
                  </span>
                  <span className="agent-goals">{agent.goalLabels.join(" · ")}</span>
                  <span className="agent-count mono">{String(agent.count).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-tight" id="harnesses">
        <div className="container">
          <div className="grid-12 section-header">
            <span className="section-header-index label-caps">B</span>
            <h2 className="section-header-title">Harnesses</h2>
            <div className="section-header-note">
              <Link className="section-header-cta mono" href="/harnesses">
                All harnesses <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <ul className="harness-list harness-list-wide">
            {harnesses.map((harness) => (
              <li key={harness.slug}>
                <Link href={`/harnesses/${harness.slug}`}>
                  <span className="harness-label">{harness.label}</span>
                  <span className="harness-count mono">{harness.count}</span>
                </Link>
                <p className="harness-desc">{harness.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
