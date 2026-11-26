import Link from "next/link";
import { PLACEMENTS } from "@/lib/site";
import { AdLabel } from "./EvidenceBadge";

export function SponsorSlot() {
  const entry = PLACEMENTS[0];
  return (
    <article className="showcase-item sponsor-slot">
      <AdLabel />
      <div className="showcase-body">
        <p className="showcase-kicker mono">Open placement</p>
        <h3 className="showcase-title">Your listing could go here</h3>
        <p className="showcase-tagline">
          Reserve a Builder Showcase placement to feature your AI agent tool, harness, or workflow
          resource alongside source-checked directory entries.
        </p>
        <div className="showcase-links">
          <Link href="/promote" className="sponsor-cta">
            Advertise on Zyvibe
          </Link>
          <span className="sponsor-price mono">
            From {entry.priceLabel} / {entry.duration}
          </span>
        </div>
        <p className="showcase-disclosure">
          Paid placement separate from editorial content. Zyvibe does not endorse or guarantee
          advertised listings.
        </p>
      </div>
    </article>
  );
}
