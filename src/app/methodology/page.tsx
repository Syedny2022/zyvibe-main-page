import type { Metadata } from "next";
import Link from "next/link";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { JsonLd } from "@/components/JsonLd";
import { useCaseCounts } from "@/lib/content";
import { EVIDENCE_LABELS } from "@/lib/taxonomy";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

const description =
  "How Zyvibe adds, labels, checks, and corrects AI agent use cases — including what each evidence label means and what it does not mean.";

export const metadata: Metadata = {
  title: "Methodology & Evidence Labels",
  description,
  alternates: { canonical: "/methodology" },
  openGraph: pageOpenGraph({
    path: "/methodology",
    title: "Methodology & Evidence Labels",
    description,
  }),
};

export default function MethodologyPage() {
  const counts = useCaseCounts();

  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({
            name: "Methodology & Evidence Labels",
            description,
            path: "/methodology",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Methodology", path: "/methodology" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Methodology</span>
          </nav>
          <p className="page-eyebrow label-caps">Standards · last updated 21 Nov 2026</p>
          <h1 className="page-title">Methodology &amp; Evidence Labels</h1>
          <p className="page-lead">
            This directory describes what other people documented or reported. It is not a benchmark
            lab, a review site, or a ranking. The labels below tell you how much support a record has
            before you spend time on it.
          </p>
        </div>
      </section>

      <section className="section section-tight" id="evidence-labels">
        <div className="container">
          <div className="prose prose-wide">
            <h2>Evidence labels</h2>
            <p>
              Every record carries exactly one evidence label. A label describes the state of the
              evidence, not the quality of the tool.
            </p>
            <ul className="label-definitions">
              {EVIDENCE_LABELS.map((label) => (
                <li key={label.label}>
                  <span className="label-def-name">
                    <EvidenceBadge label={label.label} tone={label.tone} />
                  </span>
                  <span className="label-def-meaning">{label.meaning}</span>
                </li>
              ))}
            </ul>

            <h2>How a record is added</h2>
            <ol className="step-list">
              <li>
                A candidate workflow is identified from provider documentation, a public repository,
                or a creator write-up.
              </li>
              <li>
                The source URL is opened. We record the check date and reject links that are dead,
                behind a login, or point only at a marketing homepage with no workflow detail.
              </li>
              <li>
                The record is written with the agent, harness, requirements, steps, command or prompt
                pattern, and the limitations the source states.
              </li>
              <li>
                The record is given the lowest label the evidence supports. Provider documentation
                with steps becomes <strong>Documented</strong>; a description without implementation
                detail becomes <strong>Reported</strong>.
              </li>
              <li>
                Nothing is published from an unverified submission. Submissions are stored as{" "}
                <span className="mono">pending_review</span> and published only after the same
                review.
              </li>
            </ol>

            <h2>What the reproduced label requires</h2>
            <p>
              <strong>Reproduced by Zyvibe</strong> is reserved for a workflow Zyvibe ran end to end
              on a recorded date, with the environment noted and the output retained. A successful
              installation is not a reproduction. A vendor demo is not a reproduction. At the time of
              this update, {counts.useCases} records are published and none carry the reproduced
              label; the homepage section states this openly rather than filling it with unverified
              claims.
            </p>

            <h2>Source checking</h2>
            <p>
              Each record shows the date its source was last checked. The check confirms the page
              resolves over https and that the content still describes the workflow. A reachable page
              is not proof that the workflow works, that pricing is current, or that the tool behaves
              the same way today.
            </p>
            <p>
              When a source changes materially, the record is either corrected or relabeled{" "}
              <strong>Needs Rechecking</strong> until it is reviewed again. Records are not silently
              deleted.
            </p>

            <h2>Structured data</h2>
            <p>
              Pages include JSON-LD that matches visible content: <span className="mono">CollectionPage</span>{" "}
              and <span className="mono">ItemList</span> for collections,{" "}
              <span className="mono">TechArticle</span> for use-case records, and{" "}
              <span className="mono">Organization</span> or <span className="mono">Person</span> for
              the publisher. We do not use <span className="mono">HowTo</span> markup as a rich-result
              tactic.
            </p>

            <h2>Commercial separation</h2>
            <p>
              Paid placements live in the Builder Showcase and are labeled{" "}
              <strong>Advertisement</strong> beside the item. Payment never changes an evidence label,
              never moves a project into an editorial collection, and is never described as
              verification. Paid placements are not counted in the directory&apos;s record totals.
            </p>

            <h2>Corrections</h2>
            <p>
              To report an outdated workflow, a dead source, or a mislabelled record, use the{" "}
              <Link href="/contact">contact page</Link>. Include the record URL and what changed.
              Corrections are applied to the record and the check date is updated. If a claim cannot
              be supported, the label is lowered or the record is removed with a note.
            </p>

            <h2>What this directory does not do</h2>
            <ul className="check-list">
              <li>It does not test every workflow it lists.</li>
              <li>It does not rank tools or sell rankings.</li>
              <li>It does not accept payment for an evidence label.</li>
              <li>It does not publish unverified submissions.</li>
              <li>It does not guarantee that a workflow will work in your environment.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
