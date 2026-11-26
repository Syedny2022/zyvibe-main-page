import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getGoalCollections } from "@/lib/content";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

const description =
  "Browse AI agent use cases by the goal they accomplish: code automation, testing, orchestration, browser work, research, and content operations.";

export const metadata: Metadata = {
  title: "Browse Use Cases by Goal",
  description,
  alternates: { canonical: "/goals" },
  openGraph: pageOpenGraph({
    path: "/goals",
    title: "Browse Use Cases by Goal",
    description,
  }),
};

export default function GoalsPage() {
  const goals = getGoalCollections();
  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Browse Use Cases by Goal",
            description,
            path: "/goals",
            items: goals.map((goal) => ({
              name: goal.label,
              path: `/goals/${goal.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Goals", path: "/goals" },
          ])
        )}
      />
      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Goals</span>
          </nav>
          <p className="page-eyebrow label-caps">{goals.length} goals</p>
          <h1 className="page-title">Browse Use Cases by Goal</h1>
          <p className="page-lead">
            Start from the outcome you need rather than a product name. Each goal collects the agents
            and harnesses that people have used for that kind of work.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="goal-grid">
            {goals.map((goal) => (
              <Link key={goal.slug} href={`/goals/${goal.slug}`} className="goal-card">
                <span className="goal-count mono">{String(goal.count).padStart(2, "0")}</span>
                <span className="goal-label">{goal.label}</span>
                <span className="goal-desc">{goal.description}</span>
                <span className="goal-agents mono">{goal.agents.join(" · ")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
