import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/jsonld";
import { SITE, pageOpenGraph } from "@/lib/site";

const description =
  "What Zyvibe collects, why, which processors are involved, and how to unsubscribe or request deletion.";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: pageOpenGraph({ path: "/privacy", title: "Privacy Notice", description }),
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: "Privacy Notice", description, path: "/privacy" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Notice", path: "/privacy" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Privacy</span>
          </nav>
          <p className="page-eyebrow label-caps">Last updated 21 November 2026</p>
          <h1 className="page-title">Privacy Notice</h1>
          <p className="page-lead">
            Zyvibe collects the minimum needed to run a directory, a newsletter, and paid placements.
            This notice describes what is collected, why it is collected, and how to have it removed.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="prose prose-wide">
            <h2>What is collected</h2>
            <ul className="check-list">
              <li>Email address, when you subscribe to Zyvibe Digest.</li>
              <li>
                Subscription source and date: the referring property (for example{" "}
                <a className="mono" href="https://zyvibe.com">
                  zyvibe.com
                </a>
                ), the page path, the consent text shown, and a timestamp.
              </li>
              <li>
                Contact details you choose to send, such as the email address on a use-case
                submission or a correction request.
              </li>
              <li>
                Submission content: the workflow details you provide, so the submission can be
                reviewed.
              </li>
              <li>
                Payment-related information processed by Stripe, such as the receipt email, amount,
                and session reference. Zyvibe does not receive or store card numbers.
              </li>
              <li>
                Analytics and usage data where enabled: pages viewed, approximate location derived
                from IP, device and browser type, and referral source.
              </li>
            </ul>

            <h2>Why it is collected</h2>
            <ul className="check-list">
              <li>To deliver the newsletter you asked for.</li>
              <li>To review submissions and answer correction or billing questions.</li>
              <li>To process and activate approved placements, and to send the related receipt.</li>
              <li>To understand which pages are useful and improve the directory.</li>
              <li>To prevent abuse, spam submissions, and fraudulent payments.</li>
            </ul>

            <h2>Processors</h2>
            <ul className="check-list">
              <li>
                <strong>Stripe</strong> processes payments and sends receipts for placements.
              </li>
              <li>
                <strong>Resend</strong>, sending from <span className="mono">mail.zyvibe.com</span>,
                delivers transactional messages: payment receipts, listing confirmations, and
                internal alerts.
              </li>
              <li>
                <strong>MailPoet</strong>, sending from{" "}
                <span className="mono">digest@mail.zyvibe.com</span>, delivers the Zyvibe Digest.
                Resend is not used for newsletter capture or broadcasts.
              </li>
              <li>
                <strong>Google Analytics 4</strong> (tag{" "}
                <span className="mono">{SITE.analytics.googleTagId}</span>) measures site usage, with
                cross-domain measurement between{" "}
                <a className="mono" href="https://zyvibe.com">
                  zyvibe.com
                </a>{" "}
                and{" "}
                <a className="mono" href="https://zyvibe.me">
                  zyvibe.me
                </a>
                .
              </li>
              <li>
                <strong>Google Search Console</strong> provides search performance reporting for the
                domain property covering{" "}
                <a className="mono" href="https://zyvibe.com">
                  zyvibe.com
                </a>
                .
              </li>
              <li>
                <strong>Hosting and source control providers</strong> serve this site and store its
                code.
              </li>
            </ul>

            <h2>Cookies and measurement</h2>
            <p>
              The site sets no advertising cookies and runs no display ad network. Analytics may set
              first-party cookies to distinguish sessions. Cross-domain measurement adds a{" "}
              <span className="mono">_gl</span> parameter when you move between{" "}
              <a className="mono" href="https://zyvibe.com">
                zyvibe.com
              </a>{" "}
              and{" "}
              <a className="mono" href="https://zyvibe.me">
                zyvibe.me
              </a>{" "}
              so
              the same visit is not counted twice. You can block cookies in your browser; the
              directory still works.
            </p>

            <h2>What is not done</h2>
            <ul className="check-list">
              <li>Personal information is not sold.</li>
              <li>Email addresses are not rented, exchanged, or published.</li>
              <li>Subscribers are not transferred between newsletter platforms without consent.</li>
              <li>No advertising network has access to visitor data through this site.</li>
            </ul>

            <h2>Retention</h2>
            <p>
              Subscriber records are kept until you unsubscribe or ask for deletion. Submission
              records are kept while the review is open and after publication as part of the
              editorial record. Payment records are kept as long as required for accounting and
              dispute handling.
            </p>

            <h2>Your choices</h2>
            <ul className="check-list">
              <li>Every Zyvibe Digest email includes a working unsubscribe link.</li>
              <li>
                You can ask for a copy or deletion of your subscriber record by emailing{" "}
                <a href={`mailto:${SITE.emails.privacy}`}>{SITE.emails.privacy}</a>.
              </li>
              <li>
                You can ask which submission record came from you, and ask for it to be withdrawn
                before publication.
              </li>
              <li>You can block analytics with a browser setting or an extension.</li>
            </ul>

            <h2>Children</h2>
            <p>
              The directory is written for working professionals and is not directed at children. Do
              not submit personal information about a child.
            </p>

            <h2>Changes</h2>
            <p>
              Material changes to this notice update the date at the top of the page. Continued use
              after an update means the revised notice applies.
            </p>

            <h2>Contact</h2>
            <p>
              Privacy questions and requests:{" "}
              <a href={`mailto:${SITE.emails.privacy}`}>{SITE.emails.privacy}</a>. Zyvibe is operated
              by {SITE.founder.name}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
