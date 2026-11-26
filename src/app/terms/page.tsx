import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/jsonld";
import { SITE, pageOpenGraph } from "@/lib/site";

const description =
  "Terms for using the Zyvibe directory, submitting a use case, and purchasing a Builder Showcase placement.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: { canonical: "/terms" },
  openGraph: pageOpenGraph({ path: "/terms", title: "Terms of Use", description }),
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: "Terms of Use", description, path: "/terms" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms of Use", path: "/terms" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Terms</span>
          </nav>
          <p className="page-eyebrow label-caps">Last updated 21 November 2026</p>
          <h1 className="page-title">Terms of Use</h1>
          <p className="page-lead">
            These terms cover the directory, submitted use cases, and paid Builder Showcase
            placements. They are written to match how the site actually works.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="prose prose-wide">
            <h2>1. What this site is</h2>
            <p>
              {SITE.domain} is a directory of AI-agent use cases. Records describe workflows that
              other people documented or reported. Zyvibe publishes information; it does not provide
              implementation services, manage projects, hold funds in escrow, or mediate disputes.
            </p>

            <h2>2. Use of the directory</h2>
            <ul className="check-list">
              <li>You may read, link to, and quote records with attribution.</li>
              <li>
                You may not scrape the directory at a rate that degrades service, republish it as your
                own product, or resell the data set.
              </li>
              <li>
                You may not present a paid placement as an independent Zyvibe review, rating, or
                verification.
              </li>
            </ul>

            <h2>3. No warranty on third-party tools</h2>
            <p>
              Agent tools, frameworks, and providers change without notice. A record may describe
              behavior that no longer exists. The directory is provided as-is, without warranty of
              accuracy, fitness for a particular purpose, or non-infringement. Verify anything
              consequential in your own environment before relying on it.
            </p>

            <h2>4. Submitted use cases</h2>
            <ul className="check-list">
              <li>
                You keep ownership of what you submit and grant Zyvibe a non-exclusive license to
                publish, edit for clarity, and archive it.
              </li>
              <li>
                You confirm the submission is accurate, that the source is public, and that you have
                the right to share it.
              </li>
              <li>
                Submissions are stored as pending review. Zyvibe may reject, edit, relabel, or remove
                a submission at any time.
              </li>
              <li>Nothing is published automatically, and no payment is offered for a submission.</li>
            </ul>

            <h2>5. Builder Showcase placements</h2>
            <ul className="check-list">
              <li>
                A placement buys labelled commercial visibility for the stated period. It does not
                buy an editorial record, an evidence label, a rating, or an endorsement.
              </li>
              <li>
                Every placement displays an <strong>Advertisement</strong> label beside the item on
                the homepage and the showcase page, on mobile and desktop.
              </li>
              <li>
                The submitted project URL must be a public https page. It is fetched and checked
                after payment; a failed check holds the placement for manual review instead of
                activating it.
              </li>
              <li>
                Placements are prepaid through Stripe. If a placement cannot be activated because the
                URL fails the check, Zyvibe will either activate a corrected public URL or refund that
                placement.
              </li>
              <li>
                Placements that misrepresent the product, point to malware, or change to prohibited
                content are removed without a pro-rata refund.
              </li>
            </ul>

            <h2>6. Links to other sites</h2>
            <p>
              Records and placements link to third-party sites. Those sites have their own terms and
              privacy practices. Zyvibe is not responsible for their content, availability, pricing,
              or conduct, including the conduct of any specialist listed on a sister property.
            </p>

            <h2>7. Newsletter</h2>
            <p>
              Zyvibe Digest is sent every two weeks from{" "}
              <span className="mono">digest@mail.zyvibe.com</span>. Subscribing requires consent to
              receive those emails. Every email includes an unsubscribe link, and unsubscribing ends
              the subscription.
            </p>

            <h2>8. Acceptable conduct</h2>
            <ul className="check-list">
              <li>Do not attempt to break, overload, or gain unauthorized access to the site.</li>
              <li>Do not submit content that is unlawful, deceptive, or infringing.</li>
              <li>Do not use the submission form for advertising or link building.</li>
            </ul>

            <h2>9. Changes and contact</h2>
            <p>
              These terms may be updated; the date at the top of the page changes when they are.
              Questions go to <a href={`mailto:${SITE.emails.contact}`}>{SITE.emails.contact}</a>.
              Commercial labelling is explained on the{" "}
              <Link href="/disclosures">disclosures page</Link>, and editorial standards on the{" "}
              <Link href="/methodology">methodology page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
