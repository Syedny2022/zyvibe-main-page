import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { CopyBlock } from "@/components/CopyBlock";
import { UseCaseList } from "@/components/UseCaseRow";
import { JsonLd } from "@/components/JsonLd";
import { getUseCase, getUseCases, relatedUseCases } from "@/lib/content";
import { goalBySlug, harnessBySlug } from "@/lib/taxonomy";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema, graph, techArticleSchema } from "@/lib/jsonld";
import { pageOpenGraph } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getUseCases().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return { title: "Use case not found" };
  return {
    title: useCase.title,
    description: useCase.oneLiner.slice(0, 158),
    alternates: { canonical: `/use-cases/${useCase.slug}` },
    openGraph: pageOpenGraph({
      path: `/use-cases/${useCase.slug}`,
      title: useCase.title,
      description: useCase.oneLiner.slice(0, 158),
      type: "article",
    }),
  };
}

export default async function UseCasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  const goal = goalBySlug(useCase.goal);
  const harness = harnessBySlug(useCase.harness);
  const related = relatedUseCases(useCase);
  const isComplexWorkflow =
    useCase.goal === "workflow-orchestration" ||
    /multi-agent|orchestrat|parallel/i.test(`${useCase.title} ${useCase.oneLiner}`);

  return (
    <>
      <JsonLd
        data={graph(
          techArticleSchema({
            headline: useCase.title,
            description: useCase.oneLiner,
            path: `/use-cases/${useCase.slug}`,
            datePublished: useCase.addedOn,
            dateModified: useCase.source.checkedOn,
            sourceUrl: useCase.source.url,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Use Cases", path: "/use-cases" },
            { name: useCase.title, path: `/use-cases/${useCase.slug}` },
          ])
        )}
      />

      <section className="page-head">
        <div className="container">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/use-cases">Use Cases</Link>
            <span aria-hidden="true">/</span>
            <span>{useCase.agentName}</span>
          </nav>
          <p className="page-eyebrow label-caps">
            {goal?.label ?? useCase.goal} · {harness?.label ?? useCase.harness}
          </p>
          <h1 className="page-title">{useCase.title}</h1>
          <p className="page-lead">{useCase.oneLiner}</p>
          <div className="meta-strip">
            <span>
              <span className="label-caps">Evidence</span> <EvidenceBadge label={useCase.evidence} />
            </span>
            <span>
              <span className="label-caps">Agent</span>{" "}
              <Link href={`/agents/${useCase.agent}`}>{useCase.agentName}</Link>
            </span>
            <span>
              <span className="label-caps">Harness</span>{" "}
              <Link href={`/harnesses/${useCase.harness}`}>{harness?.label ?? useCase.harness}</Link>
            </span>
            <span>
              <span className="label-caps">Added</span>{" "}
              <span className="mono">{formatDate(useCase.addedOn)}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="detail-grid">
            <div className="detail-main prose">
              <h2>What This Workflow Does</h2>
              {useCase.whatItDoes.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              <p className="prose-meta">
                Written for {useCase.role}. Goal:{" "}
                <Link href={`/goals/${useCase.goal}`}>{goal?.label ?? useCase.goal}</Link>.
              </p>

              <h2>Agent, Harness &amp; Requirements</h2>
              <p>
                The workflow runs on <strong>{useCase.agentName}</strong> inside a{" "}
                <strong>{harness?.label ?? useCase.harness}</strong>. {harness?.description}
              </p>
              <ul className="check-list">
                {useCase.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>

              <h2>How It Works</h2>
              <ol className="step-list">
                {useCase.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <CopyBlock label={useCase.configLabel} text={useCase.configSnippet} />

              <h2>Evidence &amp; Source</h2>
              <p>
                <EvidenceBadge label={useCase.evidence} /> {useCase.evidenceDetail}
              </p>
              <div className="source-box">
                <p className="source-title">{useCase.source.title}</p>
                <p className="source-meta mono">
                  {useCase.source.platform} · checked {formatDate(useCase.source.checkedOn)}
                </p>
                <a href={useCase.source.url} rel="noopener" className="source-link">
                  Open the source
                </a>
              </div>

              <h2>Limitations</h2>
              <ul className="check-list">
                {useCase.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
              <p>
                This record describes what the source states. It is not a review, a benchmark, or a
                recommendation. If the tool has changed since the check date,{" "}
                <Link href="/contact">report it</Link>.
              </p>
            </div>

            <aside className="detail-aside">
              <div className="aside-box">
                <p className="aside-title label-caps">At a glance</p>
                <dl className="meta-list">
                  <div>
                    <dt>Goal</dt>
                    <dd>
                      <Link href={`/goals/${useCase.goal}`}>{goal?.label ?? useCase.goal}</Link>
                    </dd>
                  </div>
                  <div>
                    <dt>Agent</dt>
                    <dd>
                      <Link href={`/agents/${useCase.agent}`}>{useCase.agentName}</Link>
                    </dd>
                  </div>
                  <div>
                    <dt>Harness</dt>
                    <dd>
                      <Link href={`/harnesses/${useCase.harness}`}>
                        {harness?.label ?? useCase.harness}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt>Audience</dt>
                    <dd>{useCase.role}</dd>
                  </div>
                  <div>
                    <dt>Evidence</dt>
                    <dd>{useCase.evidence}</dd>
                  </div>
                  <div>
                    <dt>Source checked</dt>
                    <dd className="mono">{useCase.source.checkedOn}</dd>
                  </div>
                </dl>
              </div>

              <div className="aside-box">
                <p className="aside-title label-caps">Source host</p>
                <p className="aside-domain mono">{new URL(useCase.source.url).hostname}</p>
                <a href={useCase.source.url} rel="noopener" className="aside-link">
                  {useCase.source.platform}
                </a>
              </div>

              <div className="aside-box">
                <p className="aside-title label-caps">Next step</p>
                <p>
                  Read the implementation guide for this kind of task, or find a remote specialist to
                  do it.
                </p>
                <ul className="aside-links">
                  <li>
                    <a href="https://blog.zyvibe.com" rel="noopener">
                      Read the Guide
                    </a>
                  </li>
                  <li>
                    <a href="https://seo.zyvibe.com" rel="noopener">
                      Find a Specialist
                    </a>
                  </li>
                  <li>
                    <a href="https://zyvibe.me" rel="noopener">
                      Browse blueprints
                    </a>
                  </li>
                  <li>
                    <Link href="/playbooks">Solo Builder Playbooks</Link>
                  </li>
                </ul>
              </div>

              {isComplexWorkflow && (
                <div className="aside-box">
                  <p className="aside-title label-caps">Multi-agent setup?</p>
                  <p>
                    This workflow coordinates several steps or agents. Browse a blueprint for the
                    scaffolding, or hire a remote specialist to wire it up.
                  </p>
                  <ul className="aside-links">
                    <li>
                      <a href="https://zyvibe.me" rel="noopener">
                        Browse blueprints
                      </a>
                    </li>
                    <li>
                      <a href="https://seo.zyvibe.com" rel="noopener">
                        Find a specialist
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </aside>
          </div>

          {related.length > 0 && (
            <div className="related-block">
              <h2 className="related-title">Related Workflows</h2>
              <UseCaseList items={related} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
