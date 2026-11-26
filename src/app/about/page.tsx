import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { useCaseCounts } from "@/lib/content";
import { ECOSYSTEM, SITE, pageOpenGraph } from "@/lib/site";
import { breadcrumbSchema, graph, organizationSchema, personSchema } from "@/lib/jsonld";

const description =
  "Zyvibe is a four-property ecosystem for solo builders: a use-case directory, an implementation blog, a remote specialist index, and Moh's blueprint catalog.";

export const metadata: Metadata = {
  title: "About Zyvibe",
  description,
  alternates: { canonical: "/about" },
  openGraph: pageOpenGraph({ path: "/about", title: "About Zyvibe", description }),
};

export default function AboutPage() {
  const counts = useCaseCounts();

  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(),
          personSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>About</span>
          </nav>
          <p className="page-eyebrow label-caps">About · four properties</p>
          <h1 className="page-title">About Zyvibe</h1>
          <p className="page-lead">
            Zyvibe is a four-property ecosystem for independent builders. The reader journey is
            simple: discover a workflow, learn how it works, then find a specialist or a reusable
            resource. {SITE.domain} is the first step in that journey.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="prose prose-wide">
            <h2>What this property is</h2>
            <p>
              {SITE.domain} is a directory of real AI-agent use cases. Each record names the agent or
              harness, the requirements, the documented steps, the command or prompt pattern, and the
              limitations. Every record links to the source it came from and shows when that source
              was last checked.
            </p>
            <p>
              The directory currently holds {counts.useCases} records across {counts.goals} goals,{" "}
              {counts.agents} agents, and {counts.harnesses} harness types. The commercial section is
              the Builder Showcase, where every item is labeled Advertisement.
            </p>

            <h2>The four pillars</h2>
            <ul className="pillar-list">
              {ECOSYSTEM.map((pillar) => (
                <li key={pillar.href}>
                  <a href={pillar.href} rel="noopener" className="pillar-domain mono">
                    {pillar.domain}
                  </a>
                  <span className="pillar-body">{pillar.description}</span>
                </li>
              ))}
            </ul>

            <h2>Who publishes this</h2>
            <p>
              {SITE.founder.name} builds the Zyvibe ecosystem and writes the implementation notes
              behind it. His project work and reusable resources live at{" "}
              <a href={SITE.founder.url} rel="noopener">
                zyvibe.me
              </a>
              , and the code behind this directory is public on{" "}
              <a href="https://github.com/Syedny2022" rel="noopener">
                GitHub
              </a>
              .
            </p>

            <h2>Editorial and commercial boundaries</h2>
            <ul className="check-list">
              <li>Directory records are not for sale and cannot be purchased.</li>
              <li>Paid placements carry an Advertisement label beside the item.</li>
              <li>No display advertising network runs on this property.</li>
              <li>No escrow, dispute handling, or delivery management is offered.</li>
              <li>
                Providers and builders handle their own scope, pricing, and delivery; Zyvibe only
                publishes information.
              </li>
            </ul>

            <h2>Contact</h2>
            <p>
              Corrections, takedown requests, and review questions go to{" "}
              <a href={`mailto:${SITE.emails.contact}`}>{SITE.emails.contact}</a>. Read the{" "}
              <Link href="/methodology">methodology</Link> for how records are added, labelled, and
              corrected.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
