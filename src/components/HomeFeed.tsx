"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { UseCase } from "@/lib/content";
import { ENGAGEMENT_EVENT, isNewThisWeek, readSaved, readVoted } from "@/lib/engagement";
import { UseCaseList } from "./UseCaseRow";

type View = "all" | "documented" | "week" | "reproduced" | "saved";
type Sort = "top" | "new";

export function HomeFeed({
  items,
  voteCounts = {},
}: {
  items: UseCase[];
  voteCounts?: Record<string, number>;
}) {
  const [sort, setSort] = useState<Sort>("new");
  const [view, setView] = useState<View>("all");
  const [limit, setLimit] = useState(8);
  const [voted, setVoted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setVoted(readVoted());
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

  const counts = useMemo(() => {
    const next: Record<string, number> = {};
    for (const item of items) {
      next[item.slug] = (voteCounts[item.slug] ?? 0) + (voted.includes(item.slug) ? 1 : 0);
    }
    return next;
  }, [items, voteCounts, voted]);

  const results = useMemo(() => {
    const filtered = items.filter((item) => {
      if (view === "documented") return item.evidence === "Documented";
      if (view === "week") return isNewThisWeek(item.addedOn);
      if (view === "reproduced") return item.evidence === "Reproduced by Zyvibe";
      if (view === "saved") return saved.includes(item.slug);
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "top") {
        const delta = counts[b.slug] - counts[a.slug];
        if (delta !== 0) return delta;
      }
      return b.addedOn.localeCompare(a.addedOn) || a.order - b.order;
    });
  }, [items, view, saved, sort, counts]);

  const visible = results.slice(0, limit);

  return (
    <div className="home-feed">
      <div className="feed-controls">
        <div className="feed-group" role="group" aria-label="Sort use cases">
          <span className="feed-label mono">SORT</span>
          <button
            type="button"
            className="filter-pill"
            aria-pressed={sort === "top"}
            onClick={() => setSort("top")}
          >
            Top
          </button>
          <button
            type="button"
            className="filter-pill"
            aria-pressed={sort === "new"}
            onClick={() => setSort("new")}
          >
            New
          </button>
        </div>
        <div className="feed-group" role="group" aria-label="Filter use cases">
          <span className="feed-label mono">FILTER</span>
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
            aria-pressed={view === "documented"}
            onClick={() => setView("documented")}
          >
            Documented
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
      </div>

      <div className="explorer-meta">
        <span className="mono result-count">
          SHOWING {visible.length} OF {results.length} USE CASES
        </span>
        {sort === "top" && (
          <span className="mono result-count">
            Ranked by upvotes; ties fall back to the newest record.
          </span>
        )}
      </div>

      {visible.length > 0 ? (
        <>
          <UseCaseList items={visible} voteCounts={voteCounts} />
          {results.length > limit && (
            <div className="feed-more">
              <button
                type="button"
                className="filter-pill"
                onClick={() => setLimit((current) => current + 8)}
              >
                Show more
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>
            {view === "saved"
              ? "Nothing saved yet. Use Save on a record to keep it in this browser."
              : view === "reproduced"
                ? "No workflow currently carries the Reproduced by Zyvibe label."
                : view === "documented"
                  ? "No record is labeled Documented yet."
                  : "No use case was added in the last seven days."}
          </p>
          <p>
            <Link href="/use-cases">Browse all use cases</Link> or{" "}
            <Link href="/submit">submit one</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
