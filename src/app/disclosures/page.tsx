import type { Metadata } from "next";
import Link from "next/link";
import { AdLabel } from "@/components/EvidenceBadge";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/jsonld";
import { PLACEMENTS, SITE, pageOpenGraph } from "@/lib/site";

const description =
  "How Zyvibe labels paid placements, sponsored digest blocks, and affiliate relationships, and what an Advertisement label does not mean.";

export const metadata: Metadata = {
  title: "Disclosures",
  description,
  alternates: { canonical: "/disclosures" },
  openGraph: pageOpenGraph({ path: "/disclosures", title: "Disclosures", description }),
};

export default function DisclosuresPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: "Disclosures", description, path: "/disclosures" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Disclosures", path: "/disclosures" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Disclosures</span>
          </nav>
          <p className="page-eyebrow label-caps">Commercial disclosure · last updated 21 November 2026</p>
          <h1 className="page-title">Disclosures</h1>
          <p className="page-lead">
            If Zyvibe receives payment, free product access, a commission, or another material
            benefit for a placement, review, endorsement, or recommendation, the relationship is
            disclosed clearly and prominently beside the relevant item.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="prose prose-wide">
            <h2>The standard</h2>
            <p>
              A paid placement is never presented as independent editorial judgment, verification, or
              a founder recommendation. The disclosure appears before or beside the paid item, is
              visible on mobile and desktop, and is not hidden behind a click, an accordion, or a
              footer link.
            </p>

            <h2>How a paid item is labeled</h2>
            <div className="disclosure-example">
              <AdLabel />
              <p className="disclosure-name">Your project name</p>
              <p className="disclosure-body">
                Short factual description supplied by the builder. Placement purchased for{" "}
                {PLACEMENTS[0].duration}.
              </p>
              <p className="disclosure-cta mono">Visit {"{builder name}"}</p>
            </div>
            <p>
              The same label is used on this property for every paid placement, and the same
              convention is used across the Zyvibe properties.
            </p>

            <h2>Where paid placements appear</h2>
            <ul className="check-list">
              <li>The Builder Showcase section on the homepage.</li>
              <li>The Builder Showcase page at <span className="mono">/showcase</span>.</li>
              <li>
                Sponsored blocks inside Zyvibe Digest, always preceded by an Advertisement label.
              </li>
            </ul>

            <h2>Where they do not appear</h2>
            <ul className="check-list">
              <li>Inside use-case records or their evidence sections.</li>
              <li>Inside goal, agent, harness, or playbook collections.</li>
              <li>As an evidence label. Evidence labels describe evidence only.</li>
            </ul>

            <h2>Affiliate links</h2>
            <p>
              This property currently contains no affiliate links. If a compensated link is added, it
              will carry this disclosure immediately beside or before the link:{" "}
              <em>
                Affiliate link. Zyvibe may receive a commission if you make a qualifying purchase
                through a link on this page. This does not affect the price you pay.
              </em>{" "}
              Affiliate links will not appear inside editorial records.
            </p>

            <h2>Newsletter sponsorship</h2>
            <p>
              A sponsored block in Zyvibe Digest is preceded by{" "}
              <strong>Advertisement</strong> and the line “This is a paid placement in Zyvibe
              Digest.” Sponsorship does not affect which workflows are covered editorially.
            </p>

            <h2>Free access and review copies</h2>
            <p>
              If Zyvibe receives free access to a product for the purpose of documenting a workflow,
              that access is noted on the record. Free access does not create an evidence label and
              does not make the record an endorsement.
            </p>

            <h2>What Advertisement does not mean</h2>
            <ul className="check-list">
              <li>It does not mean Zyvibe tested, vetted, or verified the product.</li>
              <li>It does not mean the claims in the placement are accurate.</li>
              <li>It does not mean the placement was reviewed editorially for quality.</li>
              <li>It does not mean Zyvibe recommends the product over another one.</li>
            </ul>

            <h2>Directory records are not for sale</h2>
            <p>
              An evidence label cannot be purchased. Paying for a placement does not change a record,
              move a project into a collection, or add a rating. Editorial records and commercial
              placements are separate inventories.
            </p>

            <h2>Questions</h2>
            <p>
              Disagreement about a placement label, or a request to review a commercial relationship,{" "}
              <a href={`mailto:${SITE.emails.contact}`}>contact Zyvibe</a>. Advertising terms are in
              the <Link href="/terms">terms of use</Link>; editorial standards are in the{" "}
              <Link href="/methodology">methodology</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
