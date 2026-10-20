import { CTA_HREF, CTA_LABEL, contact, nav } from '../content/site';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-navy-950">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="text-white">
          <a href="/" className="text-xl font-bold tracking-tight">zyvibe</a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-body">
            Website design and development for businesses that want a site worth showing. Sample site in 24 hours, free.
          </p>
          <a href={CTA_HREF} className="btn-primary mt-6">{CTA_LABEL}</a>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}><a href={item.href} className="transition-colors hover:text-white">{item.label}</a></li>
            ))}
            <li><a href={CTA_HREF} className="transition-colors hover:text-white">Book a free spot</a></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href={`mailto:${contact.general}`} className="transition-colors hover:text-white">{contact.general}</a></li>
            <li><a href={`mailto:${contact.support}`} className="transition-colors hover:text-white">{contact.support}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Zyvibe. All rights reserved.</p>
          <p>Designed and built in-house.</p>
        </div>
      </div>
    </footer>
  );
}
