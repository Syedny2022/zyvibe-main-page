import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { BLOG_URL, SEO_URL, startUrl, track } from '../lib/site';

const navLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'SEO Audit', href: `${SEO_URL}header` },
  { label: 'Blog', href: BLOG_URL },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-bg-main/85 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
        <a href="/" aria-label="Zyvibe home" className="flex items-center gap-2 text-white">
          <span className="text-2xl font-extrabold tracking-[-0.06em]">Zyvibe</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 lg:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-white">{link.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={startUrl('header')}
            onClick={() => track('select_content', { content_type: 'sprint_cta', item_id: 'header' })}
            className="hidden rounded-lg bg-[#7c3aed] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all hover:bg-[#6d28d9] sm:inline-flex"
          >
            Get My Free Concept
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-4 max-w-7xl overflow-hidden border-t border-white/[0.08] lg:hidden"
          >
            <div className="flex flex-col gap-1 py-4 text-sm font-semibold text-slate-300">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={closeMobileMenu} className="rounded-lg px-3 py-3 hover:bg-white/[0.05] hover:text-white">{link.label}</a>
              ))}
              <a
                href={startUrl('header_mobile')}
                onClick={() => { closeMobileMenu(); track('select_content', { content_type: 'sprint_cta', item_id: 'header_mobile' }); }}
                className="mt-2 rounded-lg bg-[#7c3aed] px-3 py-3 text-center text-xs font-bold uppercase tracking-widest text-white"
              >
                Get My Free Concept
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
