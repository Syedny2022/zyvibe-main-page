export type Goal = {
  slug: string;
  label: string;
  description: string;
};

export const GOALS: Goal[] = [
  {
    slug: "code-and-repo-automation",
    label: "Code & Repo Automation",
    description:
      "Agents that read a repository, plan a change, edit files, and hand back a reviewable diff or pull request.",
  },
  {
    slug: "testing-and-qa",
    label: "Testing & QA",
    description:
      "Agents that generate tests, reproduce failures, verify browser flows, or audit a change before it merges.",
  },
  {
    slug: "workflow-orchestration",
    label: "Workflow Orchestration",
    description:
      "Frameworks and runtimes that coordinate multiple agents, tools, and durable steps across a longer task.",
  },
  {
    slug: "browser-and-computer-use",
    label: "Browser & Computer Use",
    description:
      "Agents that drive a real browser or desktop interface when the target system has no usable API.",
  },
  {
    slug: "research-and-data-synthesis",
    label: "Research & Data Synthesis",
    description:
      "Agents that gather sources, extract structured data, and produce a cited brief you can check.",
  },
  {
    slug: "seo-and-content-ops",
    label: "SEO & Content Ops",
    description:
      "Agents that research, draft, and review publishing work while a human keeps editorial control.",
  },
];

export type Harness = {
  slug: string;
  label: string;
  description: string;
};

export const HARNESSES: Harness[] = [
  {
    slug: "terminal-cli",
    label: "Terminal CLI harness",
    description:
      "The agent runs in your shell, reads the working directory, and executes commands you approve.",
  },
  {
    slug: "ide-extension",
    label: "IDE extension harness",
    description:
      "The agent runs inside the editor with diff review and per-step approval.",
  },
  {
    slug: "cloud-agent",
    label: "Cloud agent harness",
    description:
      "The agent works in a remote environment and returns a branch, pull request, or artifact.",
  },
  {
    slug: "python-sdk",
    label: "Python SDK harness",
    description:
      "You embed the agent loop in Python and own the tools, state, and deployment.",
  },
  {
    slug: "typescript-sdk",
    label: "TypeScript SDK harness",
    description:
      "You embed the agent loop in TypeScript and own the tools, state, and deployment.",
  },
  {
    slug: "no-code-builder",
    label: "No-code builder harness",
    description:
      "Nodes, triggers, and integrations are wired in a visual builder instead of code.",
  },
  {
    slug: "docker-sandbox",
    label: "Docker sandbox harness",
    description:
      "File, shell, and browser access are contained inside an isolated container or virtual machine.",
  },
  {
    slug: "desktop-app",
    label: "Desktop & browser app harness",
    description:
      "The agent ships as a desktop application or a browser the user already works in.",
  },
  {
    slug: "browser-sdk",
    label: "Browser automation SDK harness",
    description:
      "A library drives the browser and exposes navigation, extraction, or accessibility-tree actions to the model.",
  },
  {
    slug: "self-hosted-assistant",
    label: "Self-hosted assistant harness",
    description:
      "You host the assistant yourself and connect it to messaging apps, calendars, and local files.",
  },
  {
    slug: "api-service",
    label: "API & data service harness",
    description:
      "A hosted API supplies a capability the agent calls, such as web extraction or screen control.",
  },
];

export const EVIDENCE_LABELS = [
  {
    label: "Reported",
    tone: "neutral",
    meaning: "An external source describes the workflow or result.",
  },
  {
    label: "Documented",
    tone: "documented",
    meaning: "Requirements, steps, or implementation details are available.",
  },
  {
    label: "Reproduced by Zyvibe",
    tone: "verified",
    meaning: "Zyvibe tested and reproduced the workflow end to end.",
  },
  {
    label: "Needs Rechecking",
    tone: "audit",
    meaning: "The source, dependency, or evidence may be outdated.",
  },
  {
    label: "Provider-Supplied Claim",
    tone: "neutral",
    meaning: "A provider states information about its own product.",
  },
  {
    label: "Profile Ownership Checked",
    tone: "documented",
    meaning: "Zyvibe checked a narrow ownership signal.",
  },
  {
    label: "Advertisement",
    tone: "ad",
    meaning: "Paid or house commercial placement.",
  },
] as const;

export function goalBySlug(slug: string) {
  return GOALS.find((goal) => goal.slug === slug);
}

export function harnessBySlug(slug: string) {
  return HARNESSES.find((harness) => harness.slug === slug);
}

export function evidenceTone(label: string): string {
  return EVIDENCE_LABELS.find((item) => item.label === label)?.tone ?? "neutral";
}
