import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/jsonld";
import { SITE, pageOpenGraph } from "@/lib/site";

const description =
  "Contact Zyvibe about a correction, an outdated workflow, a submission review, or a Builder Showcase placement.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph({ path: "/contact", title: "Contact", description }),
};

const ROUTES = [
  {
    title: "Report an outdated workflow",
    body: "Send the record URL and what changed. Include a new source if the old one moved. Corrections are applied to the record and the check date is updated.",
    email: SITE.emails.corrections,
    subject: "Outdated workflow report",
  },
  {
    title: "Ask about a submission",
    body: "Use this if you submitted a use case and want to know where it stands. Include the title you submitted and the source URL.",
    email: SITE.emails.contact,
    subject: "Submission review question",
  },
  {
    title: "Builder Showcase and billing",
    body: "For placement activation problems, a failed URL check, or a receipt question, include the Stripe session reference from your receipt email.",
    email: SITE.emails.contact,
    subject: "Builder Showcase placement",
  },
  {
    title: "Privacy and data requests",
    body: "Ask about a digest subscription, a deletion request, or how analytics data is handled. Subscriptions can also be ended from the unsubscribe link in any digest email.",
    email: SITE.emails.privacy,
    subject: "Privacy request",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Contact</span>
          </nav>
          <p className="page-eyebrow label-caps">Inbound only · no live chat</p>
          <h1 className="page-title">Contact</h1>
          <p className="page-lead">
            Email is the only support channel. These addresses are inbound only; outbound
            transactional mail comes from mail.zyvibe.com. There is no live chat and no ticket
            portal.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="contact-grid">
            {ROUTES.map((route) => (
              <article key={route.title} className="contact-card">
                <h2 className="contact-title">{route.title}</h2>
                <p className="contact-body">{route.body}</p>
                <a
                  className="contact-link mono"
                  href={`mailto:${route.email}?subject=${encodeURIComponent(route.subject)}`}
                >
                  {route.email}
                </a>
              </article>
            ))}
          </div>

          <div className="prose prose-wide">
            <h2>Before you write</h2>
            <ul className="check-list">
              <li>
                Submitting a new use case? Use the <Link href="/submit">submission form</Link> so the
                required fields are captured.
              </li>
              <li>
                Buying a placement? Start from the <Link href="/promote">advertising page</Link>; the
                checkout records your project details automatically.
              </li>
              <li>
                Reporting a dead source? Include the record URL, not just the tool name.
              </li>
            </ul>

            <h2>Response expectations</h2>
            <p>
              Correction and review requests are handled in the order they arrive. There is no
              guaranteed response time, and no support is offered for third-party tools listed in the
              directory. For a tool&apos;s own problem, contact its maintainer.
            </p>

            <h2>Sender boundaries</h2>
            <ul className="check-list">
              <li>
                <span className="mono">{SITE.emails.transactionalFrom}</span> — transactional
                receipts, listing confirmations, and alerts only.
              </li>
              <li>
                <span className="mono">digest@mail.zyvibe.com</span> — Zyvibe Digest editorial
                newsletter only.
              </li>
              <li>
                <span className="mono">{SITE.emails.contact}</span> — inbound contact.
              </li>
            </ul>
            <p>No outbound mail is sent from a root domain.</p>
          </div>
        </div>
      </section>
    </>
  );
}
