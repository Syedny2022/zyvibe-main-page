import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getHarnessCollections } from "@/lib/content";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

const description =
  "Compare agent execution harnesses: terminal CLIs, IDE extensions, cloud agents, SDKs, no-code builders, Docker sandboxes, and browser automation libraries.";

export const metadata: Metadata = {
  title: "Agent & Harness Types",
  description,
  alternates: { canonical: "/harnesses" },
  openGraph: pageOpenGraph({ path: "/harnesses", title: "Agent & Harness Types", description }),
};

export default function HarnessesPage() {
  const harnesses = getHarnessCollections();
  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Agent & Harness Types",
            description,
            path: "/harnesses",
            items: harnesses.map((harness) => ({
              name: harness.label,
              path: `/harnesses/${harness.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Harnesses", path: "/harnesses" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Harnesses</span>
          </nav>
          <p className="page-eyebrow label-caps">{harnesses.length} harness types</p>
          <h1 className="page-title">Agent &amp; Harness Types</h1>
          <p className="page-lead">
            The harness decides where the agent runs, what it can touch, and how much of its work you
            can review. The same model behaves differently in a terminal CLI and a cloud worker.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="card-grid">
            {harnesses.map((harness) => (
              <Link
                key={harness.slug}
                href={`/harnesses/${harness.slug}`}
                className="card card-tall"
              >
                <span className="card-kicker mono">{String(harness.count).padStart(2, "0")} records</span>
                <span className="card-title">{harness.label}</span>
                <span className="card-body">{harness.description}</span>
                <span className="card-meta mono">{harness.agents.slice(0, 3).join(" · ")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
