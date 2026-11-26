import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CopyTemplateButton } from "@/components/CopyTemplateButton";
import { getPlaybooks } from "@/lib/content";
import { playbookTemplate } from "@/lib/format";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

const description =
  "Solo builder playbooks for agent work: ship a tested change, sandbox untrusted runs, make browser tasks repeatable, keep memory across sessions, and put an agent in CI without noise.";

export const metadata: Metadata = {
  title: "Solo Builder Playbooks",
  description,
  alternates: { canonical: "/playbooks" },
  openGraph: pageOpenGraph({ path: "/playbooks", title: "Solo Builder Playbooks", description }),
};

export default function PlaybooksPage() {
  const playbooks = getPlaybooks();
  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Solo Builder Playbooks",
            description,
            path: "/playbooks",
            items: playbooks.map((playbook) => ({
              name: playbook.title,
              path: `/playbooks/${playbook.slug}`,
            })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Playbooks", path: "/playbooks" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Playbooks</span>
          </nav>
          <p className="page-eyebrow label-caps">{playbooks.length} playbooks</p>
          <h1 className="page-title">Solo Builder Playbooks</h1>
          <p className="page-lead">
            A playbook is the working method behind a set of use cases: the constraints to set, the
            checks that catch a bad run, and the point where a human has to look. Each one links to
            the source-documented workflows that put it into practice.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="playbook-list">
            {playbooks.map((playbook, index) => (
              <article key={playbook.slug} className="playbook-row">
                <span className="playbook-index mono">PB.{String(index + 1).padStart(2, "0")}</span>
                <div className="playbook-main">
                  <h2 className="playbook-title">
                    <Link href={`/playbooks/${playbook.slug}`}>{playbook.title}</Link>
                  </h2>
                  <p className="playbook-desc">{playbook.oneLiner}</p>
                  <p className="playbook-audience mono">For {playbook.audience}</p>
                </div>
                <div className="playbook-side">
                  <span className="mono playbook-count">{playbook.checklist.length} checks</span>
                  <Link className="inline-link mono" href={`/playbooks/${playbook.slug}`}>
                    Read playbook <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <CopyTemplateButton
                    text={playbookTemplate(playbook)}
                    className="copy-btn mono playbook-copy"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
