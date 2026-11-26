import Link from "next/link";
import type { Metadata } from "next";
import { Marquee } from "@/components/Marquee";
import { SectionHeader } from "@/components/SectionHeader";
import { UseCaseList } from "@/components/UseCaseRow";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { SponsorSlot } from "@/components/SponsorSlot";
import { EcosystemBridges } from "@/components/EcosystemBridges";
import { DigestForm } from "@/components/DigestForm";
import { HomeSearch } from "@/components/HomeSearch";
import { HomeFeed } from "@/components/HomeFeed";
import { TrendingToday } from "@/components/TrendingToday";
import { GoalWorkflowPreview } from "@/components/GoalWorkflowPreview";
import { CopyTemplateButton } from "@/components/CopyTemplateButton";
import { JsonLd } from "@/components/JsonLd";
import { playbookTemplate } from "@/lib/format";
import {
  getAgentCollections,
  getGoalCollections,
  getHarnessCollections,
  getPlaybooks,
  getShowcase,
  getUseCases,
  getVoteCounts,
  reproducedUseCases,
  useCaseCounts,
} from "@/lib/content";
import {
  collectionPageSchema,
  graph,
  organizationSchema,
  websiteSchema,
} from "@/lib/jsonld";
import { SITE, pageOpenGraph } from "@/lib/site";
import { goalBySlug, harnessBySlug } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph({
    path: "/",
    title: SITE.title,
    description: SITE.description,
  }),
};

// Revalidated so an activated paid placement appears without a redeploy.
export const revalidate = 60;

const QUEUE_SLUGS = [
  "claude-code-spec-driven-development",
  "openhands-github-issue-resolution",
  "playwright-mcp-deterministic-e2e-testing",
  "browser-use-deterministic-web-automation",
];

export default async function HomePage() {
  const counts = useCaseCounts();
  const allUseCases = getUseCases();
  const goals = getGoalCollections();
  const agents = getAgentCollections();
  const harnesses = getHarnessCollections().filter((item) => item.count > 0);
  const playbooks = getPlaybooks();
  const showcase = await getShowcase();
  const voteCounts = await getVoteCounts();
  const recent = allUseCases.slice(0, 8);
  const searchItems = allUseCases.map((item) => ({
    slug: item.slug,
    title: item.title,
    oneLiner: item.oneLiner,
    goalLabel: goalBySlug(item.goal)?.label ?? item.goal,
    agentName: item.agentName,
    harnessLabel: harnessBySlug(item.harness)?.label ?? item.harness,
    evidence: item.evidence,
  }));
  const reproduced = reproducedUseCases();
  const allAgents = [...agents].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
  const goalPreviews = goals.map((goal) => ({
    slug: goal.slug,
    label: goal.label,
    count: goal.count,
    items: allUseCases
      .filter((item) => item.goal === goal.slug)
      .slice(0, 6)
      .map((item) => ({
        slug: item.slug,
        title: item.title,
        agentName: item.agentName,
        evidence: item.evidence,
      })),
  }));
  const trendingItems = allUseCases.map((item) => ({
    slug: item.slug,
    title: item.title,
    agentName: item.agentName,
    addedOn: item.addedOn,
  }));
  const queue = QUEUE_SLUGS.map((slug) => allUseCases.find((item) => item.slug === slug)).filter(
    (item): item is (typeof allUseCases)[number] => Boolean(item)
  );

  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(),
          websiteSchema(),
          collectionPageSchema({
            name: SITE.h1,
            description: SITE.description,
            path: "/",
            items: recent.map((item) => ({
              name: item.title,
              path: `/use-cases/${item.slug}`,
            })),
          })
        )}
      />

      <section className="hero">
        <div className="container">
          <div className="grid-12 hero-eyebrow">
            <p className="eyebrow-left label-caps">
              <a className="eyebrow-link" href="https://zyvibe.com">
                {SITE.domain}
              </a>{" "}
              <span aria-hidden="true">—</span> AI Agent Use-Case Directory
            </p>
            <p className="eyebrow-right label-caps">
              Discover a workflow → learn how it works → find a specialist or blueprint
            </p>
          </div>

          <h1 className="hero-headline">{SITE.h1}</h1>

          <div className="grid-12 hero-subgrid">
            <div className="hero-caption mono">
              <p>
                <Link href="/use-cases">USE CASES: {counts.useCases}</Link>
              </p>
              <p>
                <Link href="/agents">AGENTS: {counts.agents}</Link>
              </p>
              <p>
                <Link href="/harnesses">HARNESSES: {counts.harnesses}</Link>
              </p>
              <p>
                <Link href="/goals">GOALS: {counts.goals}</Link>
              </p>
              <p>SOURCES CHECKED: {counts.sources}</p>
            </div>
            <div className="hero-lead-wrap">
              <p className="hero-lead">{SITE.supporting}</p>

              <HomeSearch items={searchItems} />

              <div className="hero-actions">
                <Link className="btn-primary" href="/use-cases">
                  Explore Use Cases
                </Link>
                <Link className="btn-secondary" href="/submit">
                  Submit a Use Case
                </Link>
              </div>

              <div className="hero-digest">
                <DigestForm compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <TrendingToday items={trendingItems} voteCounts={voteCounts} />

      <section className="section" id="goals">
        <div className="container">
          <SectionHeader
            index="01"
            title="Find a Workflow by Goal"
            note={`${counts.goals} goals · ${counts.useCases} records`}
            cta={{ label: "Browse by Goal", href: "/goals" }}
          />
          <div className="goal-grid">
            {goals.map((goal) => (
              <Link key={goal.slug} href={`/goals/${goal.slug}`} className="goal-card">
                <span className="goal-count mono">{String(goal.count).padStart(2, "0")}</span>
                <span className="goal-label">{goal.label}</span>
                <span className="goal-desc">{goal.description}</span>
                <span className="goal-agents mono">{goal.agents.slice(0, 3).join(" · ")}</span>
              </Link>
            ))}
          </div>
          <GoalWorkflowPreview goals={goalPreviews} />
        </div>
      </section>

      <section className="section" id="recent">
        <div className="container">
          <SectionHeader
            index="02"
            title="Recently Added Use Cases"
            note="Newest source-checked records"
            cta={{ label: "All use cases", href: "/use-cases" }}
          />
          <HomeFeed items={allUseCases} voteCounts={voteCounts} />
        </div>
      </section>

      <section className="digest-inline" aria-label="Zyvibe Digest">
        <div className="container digest-inline-grid">
          <div>
            <p className="label-caps digest-kicker">Bi-weekly dispatch</p>
            <p className="digest-inline-title">Get curated agent workflows + prompts</p>
            <p className="digest-inline-sub">
              Two source-checked records, one playbook, and one correction per issue. No
              advertising unless a block is labeled.
            </p>
          </div>
          <DigestForm compact heading="Join the digest" />
        </div>
      </section>

      <section className="section" id="agents">
        <div className="container">
          <SectionHeader
            index="03"
            title="Browse by Agent or Harness"
            note={`${counts.agents} agents · ${counts.harnesses} harnesses`}
            cta={{ label: "Browse by Agent or Harness", href: "/agents" }}
          />
          <div className="split-grid">
            <div>
              <p className="split-title label-caps">Agents & frameworks</p>
              <ul className="chip-list">
                {allAgents.map((agent) => (
                  <li key={agent.slug}>
                    <Link href={`/agents/${agent.slug}`} className="chip">
                      <span className="chip-name">{agent.name}</span>
                      <span className="chip-divider" aria-hidden="true">
                        ·
                      </span>
                      <span className="chip-count mono">
                        {agent.count}
                        <span className="sr-only">
                          {" "}
                          {agent.count === 1 ? "use case" : "use cases"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="inline-link mono" href="/agents">
                All agents <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div>
              <p className="split-title label-caps">Harnesses</p>
              <ul className="harness-list">
                {harnesses.map((harness) => (
                  <li key={harness.slug}>
                    <Link href={`/harnesses/${harness.slug}`}>
                      <span className="harness-label">{harness.label}</span>
                      <span className="harness-count mono">{harness.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="inline-link mono" href="/harnesses">
                All harnesses <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="playbooks">
        <div className="container">
          <SectionHeader
            index="04"
            title="Solo Builder Playbooks"
            note={`${counts.playbooks} playbooks`}
            cta={{ label: "Explore Solo Builder Playbooks", href: "/playbooks" }}
          />
          <div className="card-grid">
            {playbooks.map((playbook, index) => (
              <article key={playbook.slug} className="card">
                <span className="card-kicker mono">PB.{String(index + 1).padStart(2, "0")}</span>
                <span className="card-title">
                  <Link href={`/playbooks/${playbook.slug}`}>{playbook.title}</Link>
                </span>
                <span className="card-body">{playbook.oneLiner}</span>
                <span className="card-meta mono">
                  {playbook.useCases.length} linked use cases ·{" "}
                  <Link href={`/playbooks/${playbook.slug}`}>Read playbook &rarr;</Link>
                </span>
                <CopyTemplateButton
                  text={playbookTemplate(playbook)}
                  label="Copy Template"
                  className="copy-btn mono"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="reproduced">
        <div className="container">
          <SectionHeader
            index="05"
            title="Workflows Reproduced by Zyvibe"
            note="Only workflows Zyvibe tested end to end"
            cta={{ label: "See Zyvibe-Tested Workflows", href: "/use-cases" }}
          />
          {reproduced.length > 0 ? (
            <UseCaseList items={reproduced} voteCounts={voteCounts} />
          ) : (
            <div className="queue">
              <p className="section-intro">
                No record carries the <strong>Reproduced by Zyvibe</strong> label yet. These
                workflows are queued for an end-to-end run; the label is only applied once that run
                is recorded, so nothing below is presented as tested.
              </p>
              <ol className="queue-list">
                {queue.map((item, index) => (
                  <li className="queue-row" key={item.slug}>
                    <span className="queue-index mono">{String(index + 1).padStart(2, "0")}</span>
                    <span className="queue-main">
                      <Link href={`/use-cases/${item.slug}`} className="queue-title">
                        {item.title}
                      </Link>
                      <span className="queue-meta mono">
                        {item.agentName} · {goalBySlug(item.goal)?.label ?? item.goal}
                      </span>
                    </span>
                    <span className="queue-status mono">Queued for reproduction</span>
                  </li>
                ))}
              </ol>
              <p className="queue-note">
                Read how evidence labels are applied in the{" "}
                <Link href="/methodology">methodology</Link>.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section" id="showcase">
        <div className="container">
          <SectionHeader
            index="06"
            title="Builder Showcase"
            note="Labeled commercial placements"
            cta={{ label: "View Builder Showcase", href: "/showcase" }}
          />
          <p className="section-intro">
            The Builder Showcase is a commercial section. Each item below carries an{" "}
            <strong>Advertisement</strong> label beside it and is separate from the directory&apos;s
            editorial records. Builders can reserve a placement from the{" "}
            <Link href="/promote">advertising page</Link>.
          </p>
          <div className="showcase-list">
            <SponsorSlot />
            {showcase.map((item) => (
              <ShowcaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="bridges">
        <div className="container">
          <SectionHeader
            index="07"
            title="Understand the Setup or Find a Specialist"
            note="Three paths from a use case"
          />
          <EcosystemBridges />
        </div>
      </section>

      <section className="digest-band" id="digest">
        <div className="container">
          <div className="grid-12 digest-grid">
            <div className="digest-copy">
              <p className="label-caps digest-kicker">Bi-weekly dispatch</p>
              <h2 className="digest-title">Get Zyvibe Digest</h2>
              <p className="digest-sub">
                New source-checked workflows, playbook updates, and corrections to existing records
                — sent every two weeks. No advertising in the digest unless a block is labeled
                Advertisement.
              </p>
            </div>
            <DigestForm />
          </div>
        </div>
      </section>
    </>
  );
}
