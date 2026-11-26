import type { Metadata } from "next";
import Link from "next/link";

export const runtime = "edge";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Placement Received",
  description: "Your Zyvibe Builder Showcase payment was received.",
  alternates: { canonical: "/promote/success" },
  robots: { index: false, follow: false },
  openGraph: pageOpenGraph({
    path: "/promote/success",
    title: "Placement Received",
    description: "Your Zyvibe Builder Showcase payment was received.",
  }),
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PromoteSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  return (
    <section className="page-head">
      <div className="container">
        <nav className="crumbs mono" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/promote">Advertise</Link>
          <span aria-hidden="true">/</span>
          <span>Received</span>
        </nav>
        <p className="page-eyebrow label-caps">Stripe Checkout complete</p>
        <h1 className="page-title">Placement received</h1>
        <p className="page-lead">
          Stripe accepted the payment. The placement is activated automatically once the project URL
          passes the public-link check. If the check fails, the placement is held for manual review
          and you will receive an email explaining what failed.
        </p>

        <div className="detail-grid">
          <div className="detail-main">
            <div className="aside-box">
              <p className="aside-title label-caps">What happens now</p>
              <ol className="aside-list aside-list-numbered">
                <li>A receipt is sent from mail.zyvibe.com to the email you entered.</li>
                <li>The project URL is fetched once and checked for a public https response.</li>
                <li>A passing check activates the placement with an Advertisement label.</li>
                <li>A failing check holds the placement until a reviewer resolves it.</li>
              </ol>
            </div>
            {sessionId && (
              <p className="page-footnote mono">
                Stripe session reference: {sessionId.slice(0, 32)}
              </p>
            )}
          </div>
          <aside className="detail-aside">
            <div className="aside-box">
              <p className="aside-title label-caps">Next</p>
              <ul className="aside-links">
                <li>
                  <Link href="/showcase">View the Builder Showcase</Link>
                </li>
                <li>
                  <Link href="/disclosures">Read the disclosures</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Zyvibe about this placement</Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
