"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EvidenceBadge } from "./EvidenceBadge";

export type HomeSearchItem = {
  slug: string;
  title: string;
  oneLiner: string;
  goalLabel: string;
  agentName: string;
  harnessLabel: string;
  evidence: string;
};

export function HomeSearch({ items }: { items: HomeSearchItem[] }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trimmed = query.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", next);
  }, [query]);

  const needle = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!needle) return [];
    return items.filter((item) =>
      [item.title, item.oneLiner, item.goalLabel, item.agentName, item.harnessLabel]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [items, needle]);

  const directoryHref = needle ? `/use-cases?q=${encodeURIComponent(query.trim())}` : "/use-cases";

  return (
    <div className="home-search">
      <form
        className="search-form"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sr-only" htmlFor="home-search">
          Search use cases by title, summary, goal, agent, or harness
        </label>
        <input
          id="home-search"
          name="q"
          type="search"
          className="search-input"
          placeholder="Search by task, goal, agent, or harness"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
        <Link className="search-button mono" href={directoryHref}>
          {needle ? "All results" : "Browse"}
        </Link>
      </form>

      {needle && (
        <div className="home-results" aria-live="polite">
          <p className="home-results-count mono">
            {results.length} OF {items.length} USE CASES MATCH &ldquo;{query.trim()}&rdquo;
          </p>
          {results.length > 0 ? (
            <ul className="home-results-list">
              {results.slice(0, 6).map((item) => (
                <li key={item.slug}>
                  <Link href={`/use-cases/${item.slug}`} className="home-result-link">
                    <span className="home-result-title">{item.title}</span>
                    <span className="home-result-meta mono">
                      {item.goalLabel} · {item.agentName} · {item.harnessLabel}
                    </span>
                  </Link>
                  <EvidenceBadge label={item.evidence} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="home-results-empty">
              No record matches that search yet.{" "}
              <Link href="/submit">Submit a use case</Link> with a working source link.
            </p>
          )}
          <Link className="inline-link mono home-results-all" href={directoryHref}>
            See all results in the directory <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      )}
    </div>
  );
}
