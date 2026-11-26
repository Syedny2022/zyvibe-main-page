import { evidenceTone } from "@/lib/taxonomy";

export function EvidenceBadge({ label, tone }: { label: string; tone?: string }) {
  return (
    <span className="badge" data-tone={tone ?? evidenceTone(label)}>
      <span className="badge-dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export function AdLabel({ text = "Advertisement" }: { text?: string }) {
  return (
    <p className="ad-label">
      <span className="ad-mark mono">{text}</span>
    </p>
  );
}
