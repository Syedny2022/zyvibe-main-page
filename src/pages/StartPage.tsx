import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { PAGE_GOALS, SPRINT_PRICE_LABEL, SPRINT_REVISION_ROUNDS, VISUAL_DIRECTIONS } from '../../shared/concept';
import { CONTACT_EMAIL, setPageMeta, track } from '../lib/site';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

type Status = 'idle' | 'generating' | 'failed' | 'error';

const fieldClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 focus:ring-1 focus:ring-violet-500/40';
const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300';

const initialForm = {
  businessName: '',
  contactName: '',
  email: '',
  websiteUrl: '',
  offer: '',
  audience: '',
  pageGoal: '',
  visualDirection: '',
  referenceSites: '',
  priceConfirmed: false,
  company_fax: '',
};

export default function StartPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    setPageMeta('Get Your Free Landing Page Concept | Zyvibe');
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !widgetRef.current) return;
    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };
    if (window.turnstile) {
      renderWidget();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = renderWidget;
    document.head.appendChild(script);
  }, []);

  const update = (key: keyof typeof initialForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!turnstileToken) {
      setError('Please complete the verification check above the button.');
      setStatus('error');
      return;
    }
    setStatus('generating');
    setError('');
    setFieldErrors({});
    const src = new URLSearchParams(window.location.search).get('src') ?? '';

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, src, turnstileToken }),
      });
      const data = (await res.json()) as { success: boolean; id?: string; status?: string; error?: string; fieldErrors?: Record<string, string> };
      if (data.success && data.id) {
        track('intake_submitted', { status: data.status ?? 'unknown', src: src || 'direct' });
        if (data.status === 'ready') {
          window.location.href = `/preview/${data.id}`;
          return;
        }
        setStatus('failed');
        return;
      }
      setFieldErrors(data.fieldErrors ?? {});
      setError(data.error ?? 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
    setTurnstileToken('');
    window.turnstile?.reset(widgetId.current);
  };

  const fieldError = (key: string) =>
    fieldErrors[key] ? <p className="mt-1.5 text-xs text-red-300">{fieldErrors[key]}</p> : null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-main text-slate-300 bg-grid-premium">
      <SiteHeader />
      <main className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Free concept · No call needed</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-white md:text-5xl">Get your free landing page concept.</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Answer a few questions. We generate an AI-assisted concept for your landing page and email you a private preview link.
            </p>
            <div className="bento-card mt-8 p-6 text-sm leading-relaxed">
              <p className="font-bold text-white">If you like it, we build it.</p>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>Website Sprint: {SPRINT_PRICE_LABEL}, one-time payment</li>
                <li>Built in a 2-week sprint, {SPRINT_REVISION_ROUNDS} revision rounds</li>
                <li>No subscription. The optional Care Plan is offered only after launch.</li>
              </ul>
            </div>
          </div>

          <div className="bento-card p-6 md:p-8">
            {status === 'generating' && (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
                <h2 className="mt-6 text-2xl font-bold text-white">Writing your concept…</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">This usually takes under a minute. Keep this tab open. We&apos;ll also email you the private link.</p>
              </div>
            )}
            {status === 'failed' && (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
                <h2 className="text-2xl font-bold text-white">We got your request.</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                  Your concept didn&apos;t generate cleanly on the first pass. We&apos;ve been notified and will email you the preview link directly. Questions: {CONTACT_EMAIL}.
                </p>
              </div>
            )}
            {/* The form stays mounted while generating so the Turnstile widget survives a retry. */}
            <form onSubmit={handleSubmit} className={status === 'generating' || status === 'failed' ? 'hidden' : 'space-y-5'} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="businessName" className={labelClass}>Business name</label>
                    <input id="businessName" value={form.businessName} onChange={update('businessName')} required maxLength={120} className={fieldClass} autoComplete="organization" />
                    {fieldError('businessName')}
                  </div>
                  <div>
                    <label htmlFor="contactName" className={labelClass}>Your name</label>
                    <input id="contactName" value={form.contactName} onChange={update('contactName')} required maxLength={120} className={fieldClass} autoComplete="name" />
                    {fieldError('contactName')}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Email</label>
                    <input id="email" type="email" value={form.email} onChange={update('email')} required maxLength={200} className={fieldClass} autoComplete="email" />
                    {fieldError('email')}
                  </div>
                  <div>
                    <label htmlFor="websiteUrl" className={labelClass}>Current website <span className="normal-case tracking-normal text-slate-500">(optional)</span></label>
                    <input id="websiteUrl" type="url" inputMode="url" value={form.websiteUrl} onChange={update('websiteUrl')} maxLength={300} className={fieldClass} placeholder="yourbusiness.com" autoComplete="url" />
                    {fieldError('websiteUrl')}
                  </div>
                </div>

                <div>
                  <label htmlFor="offer" className={labelClass}>What do you sell or offer?</label>
                  <textarea id="offer" value={form.offer} onChange={update('offer')} required maxLength={800} rows={3} className={fieldClass} />
                  {fieldError('offer')}
                </div>
                <div>
                  <label htmlFor="audience" className={labelClass}>Who is it for?</label>
                  <textarea id="audience" value={form.audience} onChange={update('audience')} required maxLength={500} rows={2} className={fieldClass} />
                  {fieldError('audience')}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pageGoal" className={labelClass}>Primary page goal</label>
                    <select id="pageGoal" value={form.pageGoal} onChange={update('pageGoal')} required className={fieldClass}>
                      <option value="" disabled>Choose one</option>
                      {PAGE_GOALS.map((goal) => <option key={goal} value={goal} className="bg-[#030014]">{goal}</option>)}
                    </select>
                    {fieldError('pageGoal')}
                  </div>
                  <div>
                    <label htmlFor="visualDirection" className={labelClass}>Preferred visual direction</label>
                    <select id="visualDirection" value={form.visualDirection} onChange={update('visualDirection')} required className={fieldClass}>
                      <option value="" disabled>Choose one</option>
                      {VISUAL_DIRECTIONS.map((direction) => (
                        <option key={direction.id} value={direction.id} className="bg-[#030014]">{direction.label} — {direction.description}</option>
                      ))}
                    </select>
                    {fieldError('visualDirection')}
                  </div>
                </div>

                <div>
                  <label htmlFor="referenceSites" className={labelClass}>Reference sites you like <span className="normal-case tracking-normal text-slate-500">(optional)</span></label>
                  <textarea id="referenceSites" value={form.referenceSites} onChange={update('referenceSites')} maxLength={600} rows={2} className={fieldClass} placeholder="Links, and what you like about each" />
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company_fax">Company fax</label>
                  <input id="company_fax" tabIndex={-1} autoComplete="off" value={form.company_fax} onChange={update('company_fax')} />
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                    <input type="checkbox" checked={form.priceConfirmed} onChange={update('priceConfirmed')} required className="mt-1 h-4 w-4 accent-[#7c3aed]" />
                    <span>I understand the Website Sprint is a one-time {SPRINT_PRICE_LABEL} payment if I choose to build. The Care Plan is separate and optional.</span>
                  </label>
                  {fieldError('priceConfirmed')}
                </div>

                {TURNSTILE_SITE_KEY ? (
                  <div ref={widgetRef} />
                ) : (
                  <p className="text-sm text-amber-300">The request form is temporarily unavailable. Email {CONTACT_EMAIL} and we&apos;ll start your concept directly.</p>
                )}

                {status === 'error' && error && <p className="text-sm text-red-300" role="alert">{error}</p>}

                <button
                  type="submit"
                  disabled={!TURNSTILE_SITE_KEY}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-5 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-[0_7px_30px_rgba(124,58,237,0.38)] transition hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Get My Free Concept <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-center text-xs text-slate-500">
                  By submitting you agree to our <a href="/terms" className="underline hover:text-slate-300">Terms</a> and <a href="/privacy" className="underline hover:text-slate-300">Privacy Policy</a>.
                </p>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
