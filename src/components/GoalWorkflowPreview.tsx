"use client";

import Link from "next/link";
import { useState } from "react";
import { EvidenceBadge } from "./EvidenceBadge";

export type GoalPreview = {
  slug: string;
  label: string;
  count: number;
  items: { slug: string; title: string; agentName: string; evidence: string }[];
};

export function GoalWorkflowPreview({ goals }: { goals: GoalPreview[] }) {
  const [active, setActive] = useState(goals[0]?.slug ?? "");
  const [expanded, setExpanded] = useState(false);
  const current = goals.find((goal) => goal.slug === active) ?? goals[0];
  if (!current) return null;

  const shown = expanded ? current.items : current.items.slice(0, 3);

  return (
    <div className="goal-preview">
      <div className="filter-pills goal-preview-pills" role="group" aria-label="Preview workflows by goal">
        {goals.map((goal) => (
          <button
            key={goal.slug}
            type="button"
            className="filter-pill"
            aria-pressed={goal.slug === current.slug}
            onClick={() => {
              setActive(goal.slug);
              setExpanded(false);
            }}
          >
            {goal.label} <span className="filter-pill-count">{goal.count}</span>
          </button>
        ))}
      </div>

      <div className="goal-preview-panel">
        <ul className="goal-preview-list">
          {shown.map((item) => (
            <li key={item.slug}>
              <Link href={`/use-cases/${item.slug}`} className="goal-preview-link">
                <span className="goal-preview-title">{item.title}</span>
                <span className="goal-preview-meta mono">{item.agentName}</span>
              </Link>
              <EvidenceBadge label={item.evidence} />
            </li>
          ))}
        </ul>
        <div className="goal-preview-actions">
          {current.items.length > 3 && (
            <button
              type="button"
              className="filter-pill"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Show fewer" : `Show ${current.items.length - 3} more`}
            </button>
          )}
          <Link className="inline-link mono" href={`/use-cases?goal=${current.slug}`}>
            See all {current.count} in Use Cases <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
