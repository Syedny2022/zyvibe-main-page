import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SubmissionForm } from "@/components/SubmissionForm";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";
import { getHarnessCollections } from "@/lib/content";
import { GOALS } from "@/lib/taxonomy";

const description =
  "Submit a real AI agent use case to the Zyvibe directory. Every submission is reviewed against the source before anything is published.";

export const metadata: Metadata = {
  title: "Submit a Use Case",
  description,
  alternates: { canonical: "/submit" },
  openGraph: pageOpenGraph({ path: "/submit", title: "Submit a Use Case", description }),
};

export default function SubmitPage() {
  const goals = GOALS.map((goal) => ({ slug: goal.slug, label: goal.label }));
  const harnesses = getHarnessCollections().map((harness) => ({
    slug: harness.slug,
    label: harness.label,
  }));

  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: "Submit a Use Case", description, path: "/submit" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Submit a Use Case", path: "/submit" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Submit a Use Case</span>
          </nav>
          <p className="page-eyebrow label-caps">Reviewed manually · never auto-published</p>
          <h1 className="page-title">Submit a Use Case</h1>
          <p className="page-lead">
            Send a workflow you actually ran, with a public source that describes it. A reviewer
            opens the source, checks the steps, and decides whether the record meets the directory
            standard. Nothing you submit appears on the site until that review is finished.
          </p>
        </div>
      </section>

      <section className="section section-tight" id="guidelines">
        <div className="container">
          <div className="detail-grid">
            <div className="detail-main">
              <SubmissionForm goals={goals} harnesses={harnesses} />
            </div>
            <aside className="detail-aside">
              <div className="aside-box">
                <p className="aside-title label-caps">What gets accepted</p>
                <ul className="aside-list">
                  <li>A specific task, not a category of tasks.</li>
                  <li>A public https source that documents or reports the workflow.</li>
                  <li>Requirements a reader can check before starting.</li>
                  <li>At least three reproducible steps.</li>
                  <li>A command, config, or prompt pattern.</li>
                  <li>Honest limitations, including what broke.</li>
                </ul>
              </div>
              <div className="aside-box">
                <p className="aside-title label-caps">What gets rejected</p>
                <ul className="aside-list">
                  <li>A homepage with no workflow detail.</li>
                  <li>Marketing copy with no steps.</li>
                  <li>Claims with no source and no trace.</li>
                  <li>Affiliate links or paid placement disguised as a record.</li>
                  <li>Anything that requires private credentials to verify.</li>
                </ul>
              </div>
              <div className="aside-box">
                <p className="aside-title label-caps">What happens next</p>
                <ol className="aside-list aside-list-numbered">
                  <li>Your submission is stored as <span className="mono">pending_review</span>.</li>
                  <li>The source link is opened and checked.</li>
                  <li>Steps and limitations are compared to the source.</li>
                  <li>You are contacted if a claim cannot be supported.</li>
                </ol>
              </div>
              <div className="aside-box">
                <p className="aside-title label-caps">Corrections</p>
                <p>
                  Reporting a problem with an existing record? Use the{" "}
                  <Link href="/contact">contact page</Link> instead of resubmitting.
                </p>
              </div>
              <div className="aside-box">
                <p className="aside-title label-caps">Optional paid feature</p>
                <p>
                  Want additional commercial visibility after review? Keep the submission editorial,
                  then choose a labeled featured upgrade on the <Link href="/promote">promotion page</Link>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
