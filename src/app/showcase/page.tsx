import type { Metadata } from "next";
import Link from "next/link";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { SponsorSlot } from "@/components/SponsorSlot";
import { JsonLd } from "@/components/JsonLd";
import { getShowcase } from "@/lib/content";
import { PLACEMENTS, pageOpenGraph } from "@/lib/site";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/jsonld";

const description =
  "The Zyvibe Builder Showcase: clearly labeled commercial placements for builder projects. Every item carries an Advertisement label beside it.";

export const metadata: Metadata = {
  title: "Builder Showcase",
  description,
  alternates: { canonical: "/showcase" },
  openGraph: pageOpenGraph({ path: "/showcase", title: "Builder Showcase", description }),
};

// Revalidated so an activated paid placement appears without a redeploy.
export const revalidate = 60;

export default async function ShowcasePage() {
  const items = await getShowcase();
  return (
    <>
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: "Builder Showcase",
            description,
            path: "/showcase",
            items: items.map((item) => ({ name: item.name, url: item.projectUrl })),
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Builder Showcase", path: "/showcase" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Builder Showcase</span>
          </nav>
          <p className="page-eyebrow label-caps">Commercial section · {items.length} placements</p>
          <h1 className="page-title">Builder Showcase</h1>
          <p className="page-lead">
            A clearly labeled commercial section for builder projects. Every placement below carries
            an <strong>Advertisement</strong> label before the item. Nothing here is an independent
            editorial review, a verification, or a founder endorsement.
          </p>
          <p className="page-lead">
            Failing a URL safety check does not make a placement editorial. Placements are reviewed
            for link safety only; the claims belong to the builder.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="showcase-list">
            <SponsorSlot />
            {items.map((item) => (
              <ShowcaseCard key={item.slug} item={item} />
            ))}
          </div>

          <div className="advertise-strip">
            <div>
              <p className="label-caps">Reserve a placement</p>
              <h2 className="advertise-title">Advertise on Zyvibe</h2>
              <p className="advertise-body">
                Placements are self-serve through Stripe Checkout. Choose a duration, submit the
                project URL, and the placement is checked and activated after payment.
              </p>
            </div>
            <div className="advertise-actions">
              <Link href="/promote" className="btn-primary">
                Advertise on Zyvibe
              </Link>
              <p className="mono advertise-price">
                From {PLACEMENTS[0].priceLabel} / {PLACEMENTS[0].duration}
              </p>
            </div>
          </div>

          <div className="page-footnote">
            <p>
              Read the <Link href="/disclosures">disclosures</Link> for how paid placements are
              labeled, or the <Link href="/methodology">methodology</Link> for how editorial records
              are separated from commercial ones.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
