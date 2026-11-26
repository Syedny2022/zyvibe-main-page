const ITEMS = [
  "Agent Workflows",
  "Source-Backed Use Cases",
  "Goals & Harnesses",
  "Solo Builder Playbooks",
  "Evidence Labels",
  "Builder Showcase",
];

export function Marquee() {
  return (
    <section className="marquee-band" aria-label="Zyvibe directory scope">
      <div className="marquee-track">
        <div className="marquee-group">
          {ITEMS.map((item) => (
            <span key={item} className="marquee-pair">
              <span className="marquee-item">{item}</span>
              <span className="marquee-dot" aria-hidden="true" />
            </span>
          ))}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {ITEMS.map((item) => (
            <span key={`${item}-copy`} className="marquee-pair">
              <span className="marquee-item">{item}</span>
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
