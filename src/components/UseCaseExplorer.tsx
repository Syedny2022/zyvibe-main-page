"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { UseCase } from "@/lib/content";
import { ENGAGEMENT_EVENT, isNewThisWeek, readSaved } from "@/lib/engagement";
import { goalBySlug, harnessBySlug } from "@/lib/taxonomy";
import { UseCaseRow } from "./UseCaseRow";

type Props = {
  items: UseCase[];
  goals: { slug: string; label: string }[];
  harnesses: { slug: string; label: string }[];
  agents: { slug: string; name: string }[];
  evidenceLabels: string[];
  voteCounts?: Record<string, number>;
};

type Sort = "top" | "new" | "title";
type View = "all" | "week" | "reproduced" | "saved";

export function UseCaseExplorer({
  items,
  goals,
  harnesses,
  agents,
  evidenceLabels,
  voteCounts = {},
}: Props) {
  const [query, setQuery] = useState("");
  const [goal, setGoal] = useState("all");
  const [agent, setAgent] = useState("all");
  const [harness, setHarness] = useState("all");
  const [evidence, setEvidence] = useState("all");
  const [sort, setSort] = useState<Sort>("new");
  const [view, setView] = useState<View>("all");
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setSaved(readSaved());
    };
    sync();
    window.addEventListener(ENGAGEMENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ENGAGEMENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    const initialGoal = params.get("goal");
    const initialAgent = params.get("agent");
    const initialHarness = params.get("harness");
    const initialEvidence = params.get("evidence");
    const initialSort = params.get("sort");
    const initialView = params.get("view");
    const initialSaved = params.get("saved");
    if (initialQuery) setQuery(initialQuery);
    if (initialGoal && goals.some((item) => item.slug === initialGoal)) setGoal(initialGoal);
    if (initialAgent && agents.some((item) => item.slug === initialAgent)) setAgent(initialAgent);
    if (initialHarness && harnesses.some((item) => item.slug === initialHarness))
      setHarness(initialHarness);
    if (initialEvidence && evidenceLabels.includes(initialEvidence)) setEvidence(initialEvidence);
    if (initialSort === "top" || initialSort === "new" || initialSort === "title") setSort(initialSort);
    if (initialSaved === "1") setView("saved");
    else if (initialView === "week" || initialView === "reproduced") setView(initialView);
  }, [goals, agents, harnesses, evidenceLabels]);

  useEffect(() => {
    const params = new URLSearchParams();
    const trimmed = query.trim();
    if (trimmed) params.set("q", trimmed);
    if (goal !== "all") params.set("goal", goal);
    if (agent !== "all") params.set("agent", agent);
    if (harness !== "all") params.set("harness", harness);
    if (evidence !== "all") params.set("evidence", evidence);
    if (sort !== "new") params.set("sort", sort);
    if (view === "saved") params.set("saved", "1");
    else if (view !== "all") params.set("view", view);
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search ? `?${search}` : ""}`
    );
  }, [query, goal, agent, harness, evidence, sort, view]);

  // Each row adds the visitor's own +1 from localStorage. Keeping the server
  // count separate prevents the same vote being added twice.
  const counts = useMemo(() => {
    const next: Record<string, number> = {};
    for (const item of items) {
      next[item.slug] = voteCounts[item.slug] ?? 0;
    }
    return next;
  }, [items, voteCounts]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (goal !== "all" && item.goal !== goal) return false;
      if (agent !== "all" && item.agent !== agent) return false;
      if (harness !== "all" && item.harness !== harness) return false;
      if (evidence !== "all" && item.evidence !== evidence) return false;
      if (view === "week" && !isNewThisWeek(item.addedOn)) return false;
      if (view === "reproduced" && item.evidence !== "Reproduced by Zyvibe") return false;
      if (view === "saved" && !saved.includes(item.slug)) return false;
      if (!needle) return true;
      return [
        item.title,
        item.oneLiner,
        item.agentName,
        item.role,
        goalBySlug(item.goal)?.label ?? "",
        harnessBySlug(item.harness)?.label ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    return [...filtered].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "top") {
        const delta = (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0);
        if (delta !== 0) return delta;
      }
      return b.addedOn.localeCompare(a.addedOn) || a.order - b.order;
    });
  }, [items, query, goal, agent, harness, evidence, sort, view, saved, counts]);

  const goalCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.goal, (map.get(item.goal) ?? 0) + 1);
    return map;
  }, [items]);

  const evidenceCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.evidence, (map.get(item.evidence) ?? 0) + 1);
    return map;
  }, [items]);
  const evidenceTotal = items.length;

  const hasFilters =
    query !== "" ||
    goal !== "all" ||
    agent !== "all" ||
    harness !== "all" ||
    evidence !== "all" ||
    sort !== "new" ||
    view !== "all";

  function reset() {
    setQuery("");
    setGoal("all");
    setAgent("all");
    setHarness("all");
    setEvidence("all");
    setSort("new");
    setView("all");
  }

  return (
    <div className="explorer">
      <div className="explorer-controls">
        <div className="search-box">
          <span className="mono search-prefix">QUERY &gt;</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by title, summary, goal, agent, or harness..."
            aria-label="Filter use cases"
          />
        </div>
        <label className="select-box">
          <span className="mono label-caps">Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
            <option value="new">New</option>
            <option value="top">Top</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
        <label className="select-box">
          <span className="mono label-caps">Agent</span>
          <select value={agent} onChange={(event) => setAgent(event.target.value)}>
            <option value="all">All agents</option>
            {agents.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="select-box">
          <span className="mono label-caps">Harness</span>
          <select value={harness} onChange={(event) => setHarness(event.target.value)}>
            <option value="all">All harnesses</option>
            {harnesses.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="select-box">
          <span className="mono label-caps">Evidence</span>
          <select value={evidence} onChange={(event) => setEvidence(event.target.value)}>
            <option value="all">All labels ({evidenceTotal})</option>
            {evidenceLabels.map((label) => (
              <option key={label} value={label}>
                {label} ({evidenceCounts.get(label) ?? 0})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-pills" role="group" aria-label="Filter by goal">
        <button
          type="button"
          className="filter-pill"
          aria-pressed={goal === "all"}
          onClick={() => setGoal("all")}
        >
          All goals <span className="filter-pill-count">{items.length}</span>
        </button>
        {goals.map((item) => (
          <button
            key={item.slug}
            type="button"
            className="filter-pill"
            aria-pressed={goal === item.slug}
            onClick={() => setGoal(item.slug)}
          >
            {item.label} <span className="filter-pill-count">{goalCounts.get(item.slug) ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="filter-pills" role="group" aria-label="Filter by freshness or saved records">
        <button
          type="button"
          className="filter-pill"
          aria-pressed={view === "all"}
          onClick={() => setView("all")}
        >
          All
        </button>
        <button
          type="button"
          className="filter-pill"
          aria-pressed={view === "week"}
          onClick={() => setView("week")}
        >
          New this week
        </button>
        <button
          type="button"
          className="filter-pill"
          aria-pressed={view === "reproduced"}
          onClick={() => setView("reproduced")}
        >
          Reproduced by Zyvibe
        </button>
        <button
          type="button"
          className="filter-pill"
          aria-pressed={view === "saved"}
          onClick={() => setView("saved")}
        >
          Saved <span className="filter-pill-count">{saved.length}</span>
        </button>
      </div>

      <div className="explorer-meta">
        <span className="mono result-count">
          SHOWING {results.length} OF {items.length} USE CASES
        </span>
        {hasFilters && (
          <button type="button" className="clear-filters mono" onClick={reset}>
            Reset filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <p>No use case matches those filters yet.</p>
          <p>
            <Link href="/submit">Submit a use case</Link> with a working source link and the steps
            you actually followed.
          </p>
        </div>
      ) : (
        <ul className="feature-list">
          {results.map((item, index) => (
            <UseCaseRow
              key={item.slug}
              useCase={item}
              index={index}
              baseVotes={counts[item.slug] ?? 0}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
