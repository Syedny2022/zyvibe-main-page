import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UseCaseList } from "@/components/UseCaseRow";
import { JsonLd } from "@/components/JsonLd";
import { filterUseCases, getAgentCollections } from "@/lib/content";
import { goalBySlug, harnessBySlug } from "@/lib/taxonomy";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

type Params = { agent: string };

export function generateStaticParams(): Params[] {
  return getAgentCollections().map((agent) => ({ agent: agent.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { agent: slug } = await params;
  const agent = getAgentCollections().find((item) => item.slug === slug);
  if (!agent) return { title: "Agent not found" };
  const description = `${agent.count} source-checked AI agent use cases documented for ${agent.name}, covering ${agent.goalLabels.join(", ").toLowerCase()}.`;
  return {
    title: `${agent.name} Use Cases`,
    description: description.slice(0, 158),
    alternates: { canonical: `/agents/${agent.slug}` },
    openGraph: pageOpenGraph({
      path: `/agents/${agent.slug}`,
      title: `${agent.name} Use Cases`,
      description: description.slice(0, 158),
    }),
  };
}

export default async function AgentPage({ params }: { params: Promise<Params> }) {
  const { agent: slug } = await params;
  const agent = getAgentCollections().find((item) => item.slug === slug);
  if (!agent) notFound();

  const items = filterUseCases({ agent: slug });
  const goals = Array.from(new Set(items.map((item) => item.goal)));

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: `${agent.name} Use Cases`,
            description: `Source-checked AI agent use cases documented for ${agent.name}.`,
            path: `/agents/${agent.slug}`,
            items: items.map((item) => ({
              name: item.title,
              path: `/use-cases/${item.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Agents", path: "/agents" },
            { name: agent.name, path: `/agents/${agent.slug}` },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/agents">Agents</Link>
            <span aria-hidden="true">/</span>
            <span>{agent.name}</span>
          </nav>
          <p className="page-eyebrow label-caps">
            Agent · {items.length} {items.length === 1 ? "record" : "records"}
          </p>
          <h1 className="page-title">{agent.name} Use Cases</h1>
          <p className="page-lead">
            Documented workflows that run on {agent.name}. Each record links to the source that
            describes the requirements and steps.
          </p>
          <div className="meta-strip">
            {agent.harnessSlugs.map((harness) => (
              <span key={harness}>
                <span className="label-caps">Harness</span>{" "}
                <Link href={`/harnesses/${harness}`}>
                  {harnessBySlug(harness)?.label ?? harness}
                </Link>
              </span>
            ))}
            {goals.map((goal) => (
              <span key={goal}>
                <span className="label-caps">Goal</span>{" "}
                <Link href={`/goals/${goal}`}>{goalBySlug(goal)?.label ?? goal}</Link>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <UseCaseList items={items} />
          <div className="page-footnote">
            <p>
              Using a different agent for the same job?{" "}
              <Link href="/submit">Submit the workflow</Link> with a public source and the steps you
              followed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
