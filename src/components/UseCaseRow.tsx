"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { UseCase } from "@/lib/content";
import { goalBySlug, harnessBySlug } from "@/lib/taxonomy";
import { formatMonthYear, hostnameOf } from "@/lib/format";
import { SITE } from "@/lib/site";
import { writeClipboard } from "@/lib/clipboard";
import {
  ENGAGEMENT_EVENT,
  isSaved,
  isVoted,
  toggleSave,
  toggleVote,
} from "@/lib/engagement";
import { EvidenceBadge } from "./EvidenceBadge";
import { PromptDialog } from "./PromptDialog";

export function UseCaseRow({
  useCase,
  index,
  baseVotes = 0,
}: {
  useCase: UseCase;
  index: number;
  baseVotes?: number;
}) {
  const goal = goalBySlug(useCase.goal);
  const harness = harnessBySlug(useCase.harness);
  const [voted, setVoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setVoted(isVoted(useCase.slug));
      setSaved(isSaved(useCase.slug));
    };
    sync();
    window.addEventListener(ENGAGEMENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ENGAGEMENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [useCase.slug]);

  const closePrompt = useCallback(() => setPromptOpen(false), []);
  const votes = baseVotes + (voted ? 1 : 0);

  async function share() {
    const url = `${SITE.url}/use-cases/${useCase.slug}`;
    const ok = await writeClipboard(url);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <li className="feature-row">
      <Link href={`/use-cases/${useCase.slug}`} className="grid-12 feature-row-inner">
        <span className="row-index mono">{String(index + 1).padStart(2, "0")}</span>
        <span className="row-title-group">
          <span className="row-title">{useCase.title}</span>
          <span className="row-domain mono">
            {hostnameOf(useCase.source.url)} · {formatMonthYear(useCase.addedOn)}
          </span>
        </span>
        <span className="row-desc">{useCase.oneLiner}</span>
        <span className="row-tag">
          <EvidenceBadge label={useCase.evidence} />
        </span>
      </Link>

      <div className="row-actions">
        <span className="row-taxonomy">
          <Link className="row-chip" href={`/goals/${useCase.goal}`}>
            {goal?.label ?? useCase.goal}
          </Link>
          <Link className="row-chip" href={`/agents/${useCase.agent}`}>
            {useCase.agentName}
            {typeof useCase.agentTotal === "number"
              ? ` · ${useCase.agentTotal} ${useCase.agentTotal === 1 ? "use case" : "use cases"}`
              : ""}
          </Link>
          <Link className="row-chip" href={`/harnesses/${useCase.harness}`}>
            {harness?.label ?? useCase.harness}
            {typeof useCase.harnessTotal === "number"
              ? ` · ${useCase.harnessTotal} ${useCase.harnessTotal === 1 ? "use case" : "use cases"}`
              : ""}
          </Link>
        </span>
        <button
          type="button"
          className="row-action"
          onClick={() => setPromptOpen(true)}
          aria-haspopup="dialog"
        >
          View prompt / config
        </button>
        <button
          type="button"
          className="row-action"
          aria-pressed={saved}
          data-active={saved}
          onClick={() => toggleSave(useCase.slug)}
        >
          {saved ? "Saved" : "Save"}
        </button>
        <button type="button" className="row-action" onClick={share}>
          {copied ? "Copied!" : "Share"}
        </button>
        <button
          type="button"
          className="row-action row-vote"
          aria-pressed={voted}
          data-active={voted}
          onClick={() => toggleVote(useCase.slug)}
        >
          <span aria-hidden="true">▲</span>
          <span className="row-action-count mono">{votes}</span>
          <span className="sr-only">
            {voted ? "Remove upvote" : "Upvote"}: {votes} {votes === 1 ? "vote" : "votes"}
          </span>
        </button>
      </div>

      <PromptDialog
        open={promptOpen}
        onClose={closePrompt}
        title={useCase.title}
        configLabel={useCase.configLabel}
        configSnippet={useCase.configSnippet}
        steps={useCase.steps}
      />
    </li>
  );
}

export function UseCaseList({
  items,
  voteCounts,
}: {
  items: UseCase[];
  voteCounts?: Record<string, number>;
}) {
  return (
    <ul className="feature-list">
      {items.map((useCase, index) => (
        <UseCaseRow
          key={useCase.slug}
          useCase={useCase}
          index={index}
          baseVotes={voteCounts?.[useCase.slug] ?? 0}
        />
      ))}
    </ul>
  );
}
