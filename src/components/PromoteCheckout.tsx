import type { Placement } from "@/lib/site";
import { COMMERCIAL_PRICING } from "@/lib/site";

export function PromoteCheckout({ placements }: { placements: Placement[] }) {
  const placement = placements[0];
  return (
    <div className="form">
      <div className="placement-grid">
        <article className="placement" data-selected="true">
          <span className="placement-head">
            <span className="placement-name">{placement.name}</span>
            <span className="placement-price mono">{COMMERCIAL_PRICING.monthly}</span>
          </span>
          <span className="placement-body">{placement.summary}</span>
          <span className="placement-duration mono">{COMMERCIAL_PRICING.activeCap}</span>
        </article>
      </div>
      <div className="aside-box" style={{ marginTop: "1rem" }}>
        <p className="aside-title label-caps">Before you pay</p>
        <ul className="aside-list">
          <li>Monthly renewal; cancel before the next billing date.</li>
          <li>Manual approval is required before anything goes live.</li>
          <li>Daily publishing or PR automation never overwrites an approved placement.</li>
          <li>Paid placement separate from editorial content.</li>
        </ul>
      </div>
      <div className="form-actions">
        <a
          className="btn-primary"
          href={COMMERCIAL_PRICING.paymentLink}
          rel="sponsored nofollow noopener"
        >
          Continue to Stripe Checkout ↗
        </a>
        <p className="form-note">
          <strong>Advertisement.</strong> Every approved placement is labeled Advertisement and
          remains separate from editorial content.
        </p>
      </div>
    </div>
  );
}
