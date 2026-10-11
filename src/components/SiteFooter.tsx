import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink, Loader2, Mail } from 'lucide-react';
import { BLOG_URL, CONTACT_EMAIL, SEO_URL, startUrl, track } from '../lib/site';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function SiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<SubmitStatus>('idle');

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim(), source_page: 'newsletter' }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        track('newsletter_signup', { source: 'footer' });
        setNewsletterStatus('success');
      } else {
        setNewsletterStatus('error');
      }
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <footer className="border-t border-white/[0.07] bg-[#030014] px-5 py-16 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="/" className="text-2xl font-extrabold tracking-[-0.06em] text-white">Zyvibe</a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">Build your dream. Grow your vibe. Founder-led design and development for solo founders and small teams.</p>
          <p className="mt-3 text-sm font-semibold text-violet-300">Vibe is the voice.</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Products</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li><a href={startUrl('footer')} className="transition hover:text-white">Website Sprint</a></li>
            <li><a href={`${SEO_URL}footer_cta`} className="transition hover:text-white">SEO Audit</a></li>
            <li><a href={BLOG_URL} className="transition hover:text-white">Blog</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Company</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li><a href="/#affiliates" className="transition hover:text-white">Affiliate Program</a></li>
            <li><a href="/terms" className="transition hover:text-white">Terms</a></li>
            <li><a href="/privacy" className="transition hover:text-white">Privacy</a></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div id="newsletter">
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white">Stay in the loop</h2>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">Get Zyvibe updates and practical founder playbooks.</p>
          {newsletterStatus === 'success' ? (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4 shrink-0" /> You&apos;re on the list.</div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-5 space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input id="newsletter-email" type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} disabled={newsletterStatus === 'submitting'} placeholder="you@yourbusiness.com" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60" />
              {newsletterStatus === 'error' && <p className="text-sm text-red-300">That didn&apos;t go through. Please try again.</p>}
              <button type="submit" disabled={newsletterStatus === 'submitting'} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60">
                {newsletterStatus === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining</> : <>Join Now <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-4 border-t border-white/[0.06] pt-7 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Zyvibe. Built for the Solo Founder.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 transition hover:text-white"><Mail className="h-3.5 w-3.5" /> {CONTACT_EMAIL}</a>
          <a href={BLOG_URL} className="inline-flex items-center gap-1.5 transition hover:text-white">Blog <ExternalLink className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </footer>
  );
}
