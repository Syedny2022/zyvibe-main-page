const BRIDGES = [
  {
    domain: "blog.zyvibe.com",
    eyebrow: "Understand the setup",
    title: "Read the implementation guide",
    body: "Step-by-step walkthroughs for agents, automation, Search Console, and publishing workflows. The blog explains how to complete the task; this directory shows what people did.",
    cta: "Read the Guide",
    href: "https://blog.zyvibe.com",
  },
  {
    domain: "seo.zyvibe.com",
    eyebrow: "Find a specialist",
    title: "Find a remote solo developer",
    body: "An index of strictly remote solo developers and solo agencies for agent implementation, technical SEO, and integrations. Contact providers directly; Zyvibe does not mediate the work.",
    cta: "Find a Specialist",
    href: "https://seo.zyvibe.com",
  },
  {
    domain: "zyvibe.me",
    eyebrow: "Moh & blueprints",
    title: "Explore projects and blueprints",
    body: "Moh's engineering portfolio, implementation notes, and reusable workflow resources behind the Zyvibe ecosystem, with license and support terms stated on each product.",
    cta: "Explore Projects",
    href: "https://zyvibe.me",
  },
];

export function EcosystemBridges() {
  return (
    <div className="bridges">
      {BRIDGES.map((bridge) => (
        <article key={bridge.href} className="bridge">
          <p className="bridge-domain mono">{bridge.domain}</p>
          <p className="bridge-eyebrow label-caps">{bridge.eyebrow}</p>
          <h3 className="bridge-title">{bridge.title}</h3>
          <p className="bridge-body">{bridge.body}</p>
          <a className="bridge-cta" href={bridge.href} rel="noopener">
            {bridge.cta}
          </a>
        </article>
      ))}
    </div>
  );
}
