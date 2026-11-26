import type { Metadata } from "next";
import Link from "next/link";
import { PromoteCheckout } from "@/components/PromoteCheckout";
import { AdLabel } from "@/components/EvidenceBadge";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/jsonld";
import { PLACEMENTS, pageOpenGraph } from "@/lib/site";

const description =
  "Reserve a labeled Builder Showcase placement on zyvibe.com. Self-serve Stripe Checkout, automatic link safety check, and a visible Advertisement label on every placement.";

export const metadata: Metadata = {
  title: "Advertise on Zyvibe",
  description,
  alternates: { canonical: "/promote" },
  openGraph: pageOpenGraph({ path: "/promote", title: "Advertise on Zyvibe", description }),
};

export default function PromotePage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: "Advertise on Zyvibe", description, path: "/promote" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Advertise on Zyvibe", path: "/promote" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Advertise</span>
          </nav>
          <p className="page-eyebrow label-caps">Commercial placements · Stripe Checkout</p>
          <h1 className="page-title">Advertise on Zyvibe</h1>
          <p className="page-lead">
            Builder Showcase placements are paid visibility for a project you built. Every placement
            is labeled <strong>Advertisement</strong> on the homepage and on the showcase page,
            beside the item, on mobile and desktop.
          </p>
          <p className="page-lead">
            Paid placement separate from editorial content. Choose a self-serve Builder Showcase or
            Category Sponsor slot below; there are no retainers, agency services, or live-support
            commitments.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="detail-grid">
            <div className="detail-main">
              <PromoteCheckout placements={PLACEMENTS} />
            </div>

            <aside className="detail-aside">
              <div className="aside-box">
                <AdLabel text="Advertisement" />
                <p className="aside-sample-title">How your placement is labeled</p>
                <p className="aside-sample-body">
                  Your project name, a short factual description, and one link. The label above sits
                  before the item, not behind a click.
                </p>
                <p className="aside-sample-link mono">Visit {"{builder name}"}</p>
              </div>

              <div className="aside-box">
                <p className="aside-title label-caps">What is included</p>
                <ul className="aside-list">
                  {PLACEMENTS[0].includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="aside-box">
                <p className="aside-title label-caps">What is not included</p>
                <ul className="aside-list">
                  <li>An editorial review, rating, or evidence label.</li>
                  <li>A founder endorsement or a claim that Zyvibe tested your product.</li>
                  <li>Placement inside editorial use-case records.</li>
                  <li>Email broadcasts. The digest is separate and sponsored blocks are labeled.</li>
                </ul>
              </div>

              <div className="aside-box">
                <p className="aside-title label-caps">Activation</p>
                <ol className="aside-list aside-list-numbered">
                  <li>Stripe confirms payment.</li>
                  <li>The project URL is fetched and checked for a public, reachable https page.</li>
                  <li>A passing check activates the placement and sends a receipt.</li>
                  <li>A failing check holds the placement for manual review.</li>
                </ol>
                <p>
                  Read the <Link href="/disclosures">disclosures</Link> and{" "}
                  <Link href="/terms">terms</Link> before paying.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
