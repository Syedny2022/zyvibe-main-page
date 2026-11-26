"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ENGAGEMENT_EVENT, readVoted } from "@/lib/engagement";

export type TrendingItem = {
  slug: string;
  title: string;
  agentName: string;
  addedOn: string;
};

export function TrendingToday({
  items,
  voteCounts = {},
}: {
  items: TrendingItem[];
  voteCounts?: Record<string, number>;
}) {
  const [voted, setVoted] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setVoted(readVoted());
    sync();
    window.addEventListener(ENGAGEMENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ENGAGEMENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const { top, total } = useMemo(() => {
    const ranked = items.map((item) => ({
      ...item,
      votes: (voteCounts[item.slug] ?? 0) + (voted.includes(item.slug) ? 1 : 0),
    }));
    const sum = ranked.reduce((accumulator, item) => accumulator + item.votes, 0);
    const sorted = ranked.sort((a, b) =>
      sum > 0 ? b.votes - a.votes || b.addedOn.localeCompare(a.addedOn) : b.addedOn.localeCompare(a.addedOn)
    );
    return { top: sorted.slice(0, 3), total: sum };
  }, [items, voteCounts, voted]);

  return (
    <section className="trending" id="trending" aria-labelledby="trending-title">
      <div className="container">
        <div className="trending-head">
          <h2 id="trending-title" className="trending-title label-caps">
            Trending Today
          </h2>
          <p className="trending-note mono">
            {total > 0
              ? `${total} ${total === 1 ? "upvote" : "upvotes"} recorded`
              : "No upvotes yet — showing the newest records"}
          </p>
        </div>
        <div className="trending-grid">
          {top.map((item, index) => (
            <Link key={item.slug} href={`/use-cases/${item.slug}`} className="trending-item">
              <span className="trending-rank mono">{String(index + 1).padStart(2, "0")}</span>
              <span className="trending-item-title">{item.title}</span>
              <span className="trending-meta mono">
                {item.agentName} · {item.votes} {item.votes === 1 ? "upvote" : "upvotes"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
