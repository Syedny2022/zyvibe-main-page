import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UseCaseList } from "@/components/UseCaseRow";
import { JsonLd } from "@/components/JsonLd";
import { filterUseCases, getGoalCollections } from "@/lib/content";
import { GOALS, goalBySlug } from "@/lib/taxonomy";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

type Params = { goal: string };

export function generateStaticParams(): Params[] {
  return GOALS.map((goal) => ({ goal: goal.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { goal: slug } = await params;
  const goal = goalBySlug(slug);
  if (!goal) return { title: "Goal not found" };
  const description = `${goal.description} Browse ${filterUseCases({ goal: slug }).length} source-checked AI agent use cases for ${goal.label.toLowerCase()}.`;
  return {
    title: `${goal.label} Agent Use Cases`,
    description: description.slice(0, 158),
    alternates: { canonical: `/goals/${goal.slug}` },
    openGraph: pageOpenGraph({
      path: `/goals/${goal.slug}`,
      title: `${goal.label} Agent Use Cases`,
      description: description.slice(0, 158),
    }),
  };
}

export default async function GoalPage({ params }: { params: Promise<Params> }) {
  const { goal: slug } = await params;
  const goal = goalBySlug(slug);
  if (!goal) notFound();

  const items = filterUseCases({ goal: slug });
  const related = getGoalCollections().filter((item) => item.slug !== slug);

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: `${goal.label} Agent Use Cases`,
            description: goal.description,
            path: `/goals/${goal.slug}`,
            items: items.map((item) => ({
              name: item.title,
              path: `/use-cases/${item.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Goals", path: "/goals" },
            { name: goal.label, path: `/goals/${goal.slug}` },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/goals">Goals</Link>
            <span aria-hidden="true">/</span>
            <span>{goal.label}</span>
          </nav>
          <p className="page-eyebrow label-caps">
            Goal · {items.length} {items.length === 1 ? "record" : "records"}
          </p>
          <h1 className="page-title">{goal.label}</h1>
          <p className="page-lead">{goal.description}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          {items.length > 0 ? (
            <UseCaseList items={items} />
          ) : (
            <div className="empty-state">
              <p>No records in this goal yet.</p>
              <p>
                <Link href="/submit">Submit a use case</Link> to start this collection.
              </p>
            </div>
          )}

          <div className="related-goals">
            <p className="label-caps">Other goals</p>
            <ul className="chip-list">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/goals/${item.slug}`} className="chip">
                    <span>{item.label}</span>
                    <span className="chip-count mono">{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
