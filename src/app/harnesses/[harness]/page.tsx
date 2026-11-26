import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UseCaseList } from "@/components/UseCaseRow";
import { JsonLd } from "@/components/JsonLd";
import { filterUseCases, getHarnessCollections } from "@/lib/content";
import { HARNESSES, harnessBySlug } from "@/lib/taxonomy";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

type Params = { harness: string };

export function generateStaticParams(): Params[] {
  return HARNESSES.map((harness) => ({ harness: harness.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { harness: slug } = await params;
  const harness = harnessBySlug(slug);
  if (!harness) return { title: "Harness not found" };
  const count = filterUseCases({ harness: slug }).length;
  const description = `${harness.description} ${count} source-checked use cases use this harness.`;
  return {
    title: harness.label,
    description: description.slice(0, 158),
    alternates: { canonical: `/harnesses/${harness.slug}` },
    openGraph: pageOpenGraph({
      path: `/harnesses/${harness.slug}`,
      title: harness.label,
      description: description.slice(0, 158),
    }),
  };
}

export default async function HarnessPage({ params }: { params: Promise<Params> }) {
  const { harness: slug } = await params;
  const harness = harnessBySlug(slug);
  if (!harness) notFound();

  const items = filterUseCases({ harness: slug });
  const others = getHarnessCollections().filter((item) => item.slug !== slug && item.count > 0);

  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: harness.label,
            description: harness.description,
            path: `/harnesses/${harness.slug}`,
            items: items.map((item) => ({
              name: item.title,
              path: `/use-cases/${item.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Harnesses", path: "/harnesses" },
            { name: harness.label, path: `/harnesses/${harness.slug}` },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/harnesses">Harnesses</Link>
            <span aria-hidden="true">/</span>
            <span>{harness.label}</span>
          </nav>
          <p className="page-eyebrow label-caps">
            Harness · {items.length} {items.length === 1 ? "record" : "records"}
          </p>
          <h1 className="page-title">{harness.label}</h1>
          <p className="page-lead">{harness.description}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          {items.length > 0 ? (
            <UseCaseList items={items} />
          ) : (
            <div className="empty-state">
              <p>No records use this harness yet.</p>
              <p>
                <Link href="/submit">Submit a use case</Link> if you run an agent this way.
              </p>
            </div>
          )}

          <div className="related-goals">
            <p className="label-caps">Other harnesses</p>
            <ul className="chip-list">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={`/harnesses/${item.slug}`} className="chip">
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
