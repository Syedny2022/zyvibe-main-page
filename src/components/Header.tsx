import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CTA_HREF, CTA_LABEL, nav } from '../content/site';
import { track } from '../lib/analytics';

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-navy-900/80 text-white backdrop-blur-md">
      <div className="container-x flex h-[72px] items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight">zyvibe</a>

        <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-body md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-white">{item.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CTA_HREF}
            onClick={() => track('select_content', { content_type: 'cta', item_id: 'header' })}
            className="btn-primary hidden px-5 py-2.5 sm:inline-flex"
          >
            {CTA_LABEL}
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-navy-900 md:hidden">
          <div className="container-x flex flex-col gap-1 py-4 text-sm">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={close} className="rounded-md px-3 py-3 text-body hover:bg-navy-800 hover:text-white">{item.label}</a>
            ))}
            <a
              href={CTA_HREF}
              onClick={() => { close(); track('select_content', { content_type: 'cta', item_id: 'header_mobile' }); }}
              className="btn-primary mt-2"
            >
              {CTA_LABEL}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
