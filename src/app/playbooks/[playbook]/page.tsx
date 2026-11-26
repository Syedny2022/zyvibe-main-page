import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UseCaseList } from "@/components/UseCaseRow";
import { JsonLd } from "@/components/JsonLd";
import { CopyBlock } from "@/components/CopyBlock";
import { CopyTemplateButton } from "@/components/CopyTemplateButton";
import { getPlaybook, getPlaybooks, playbookUseCases } from "@/lib/content";
import { playbookTemplate } from "@/lib/format";
import { articleSchema, breadcrumbSchema, graph } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

type Params = { playbook: string };

export function generateStaticParams(): Params[] {
  return getPlaybooks().map((playbook) => ({ playbook: playbook.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { playbook: slug } = await params;
  const playbook = getPlaybook(slug);
  if (!playbook) return { title: "Playbook not found" };
  return {
    title: playbook.title,
    description: playbook.oneLiner.slice(0, 158),
    alternates: { canonical: `/playbooks/${playbook.slug}` },
    openGraph: pageOpenGraph({
      path: `/playbooks/${playbook.slug}`,
      title: playbook.title,
      description: playbook.oneLiner.slice(0, 158),
    }),
  };
}

export default async function PlaybookPage({ params }: { params: Promise<Params> }) {
  const { playbook: slug } = await params;
  const playbook = getPlaybook(slug);
  if (!playbook) notFound();

  const linked = playbookUseCases(playbook);

  return (
    <>
      <JsonLd
        data={graph(
          articleSchema({
            headline: playbook.title,
            description: playbook.oneLiner,
            path: `/playbooks/${playbook.slug}`,
            section: "Solo Builder Playbooks",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Playbooks", path: "/playbooks" },
            { name: playbook.title, path: `/playbooks/${playbook.slug}` },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/playbooks">Playbooks</Link>
            <span aria-hidden="true">/</span>
            <span>{playbook.title}</span>
          </nav>
          <p className="page-eyebrow label-caps">Solo builder playbook</p>
          <h1 className="page-title">{playbook.title}</h1>
          <p className="page-lead">{playbook.oneLiner}</p>
          <p className="page-audience mono">For {playbook.audience}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="detail-grid">
            <div className="detail-main prose">
              <p className="playbook-intro">{playbook.intro}</p>

              <CopyBlock label="Playbook template" text={playbookTemplate(playbook)} />

              <h2>Requirements</h2>
              <ul className="check-list">
                {playbook.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>

              {playbook.sections.map((section) => (
                <div key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </div>
              ))}

              <h2>Checklist</h2>
              <ul className="check-list check-list-numbered">
                {playbook.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <aside className="detail-aside">
              <div className="aside-box">
                <p className="aside-title label-caps">Linked records</p>
                <p className="mono aside-big">{linked.length}</p>
                <p>Each record links to the source that documents the workflow.</p>
                <CopyTemplateButton
                  text={playbookTemplate(playbook)}
                  className="copy-btn mono playbook-copy"
                />
              </div>
              <div className="aside-box">
                <p className="aside-title label-caps">Keep going</p>
                <ul className="aside-links">
                  <li>
                    <Link href="/playbooks">All playbooks</Link>
                  </li>
                  <li>
                    <Link href="/use-cases">All use cases</Link>
                  </li>
                  <li>
                    <a href="https://blog.zyvibe.com" rel="noopener">
                      Read the Guide
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="related-block">
            <h2 className="related-title">Use Cases in This Playbook</h2>
            <UseCaseList items={linked} />
          </div>
        </div>
      </section>
    </>
  );
}
