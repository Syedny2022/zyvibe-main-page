import type { ShowcaseItem } from "@/lib/content";
import { AdLabel } from "./EvidenceBadge";

export function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <article className="showcase-item">
      <AdLabel />
      <div className="showcase-body">
        <p className="showcase-kicker mono">{item.category}</p>
        <h3 className="showcase-title">{item.name}</h3>
        <p className="showcase-tagline">{item.tagline}</p>
        <p className="showcase-desc">{item.description}</p>
        {item.stack.length > 0 && (
          <ul className="tag-list">
            {item.stack.map((tech) => (
              <li key={tech} className="tag mono">
                {tech}
              </li>
            ))}
          </ul>
        )}
        <div className="showcase-links">
          <a href={item.projectUrl} rel="noopener nofollow sponsored">
            {item.projectLabel}
          </a>
          <a href={item.builderUrl} rel="noopener nofollow sponsored" className="showcase-builder">
            Builder: {item.builderName}
          </a>
        </div>
        <p className="showcase-disclosure">{item.disclosure}</p>
      </div>
    </article>
  );
}
