import { CTA_HREF, CTA_LABEL, nav } from '../content/site';

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="max-w-sm text-lg leading-relaxed text-body">
            High-end website design and development. A free sample site for your business within 24 hours.
          </p>
          <a href={CTA_HREF} className="btn-primary mt-8">{CTA_LABEL}</a>
        </div>
        <nav aria-label="Footer">
          <h2 className="label">Explore</h2>
          <ul className="mt-5 space-y-3 text-body">
            {nav.map((item) => (
              <li key={item.href}><a href={item.href} className="transition-colors hover:text-white">{item.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="label">Start a project</h2>
          <ul className="mt-5 space-y-3 text-body">
            <li><a href={CTA_HREF} className="transition-colors hover:text-white">Book a free spot</a></li>
            <li><a href="#pricing" className="transition-colors hover:text-white">See pricing</a></li>
          </ul>
        </div>
      </div>
      <div className="container-x overflow-hidden" aria-hidden="true">
        <p className="select-none text-[clamp(5rem,22vw,20rem)] font-bold leading-[0.8] tracking-tight text-white/[0.06]">zyvibe</p>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} <a href="/" className="font-bold tracking-tight text-white">zyvibe</a>. All rights reserved.</p>
          <p>Designed and built in-house.</p>
        </div>
      </div>
    </footer>
  );
}
