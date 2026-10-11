import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import type { Concept, Palette } from '../../shared/concept';
import { CARE_PLAN_PRICE_LABEL, SPRINT_PRICE_LABEL, SPRINT_REVISION_ROUNDS, getVisualDirection } from '../../shared/concept';
import { CONTACT_EMAIL, setPageMeta, track } from '../lib/site';

const DISCLAIMER =
  'This is an AI-assisted concept draft based on the information you submitted. It shows a possible direction, structure, and message. It is not the final production website.';

interface ConceptResponse {
  status: 'queued' | 'ready' | 'failed' | 'expired';
  businessName?: string;
  visualDirection?: string;
  concept?: Concept | null;
  paymentUrl?: string | null;
}

type LoadState = { kind: 'loading' } | { kind: 'notFound' } | { kind: 'expired' } | { kind: 'error' } | { kind: 'loaded'; data: ConceptResponse };

const POLL_MS = 5000;
const MAX_POLLS = 24;

function ConceptView({ concept, palette }: { concept: Concept; palette: Palette }) {
  const surface = { background: palette.surface, borderColor: palette.border };
  const button = { background: palette.accent, color: palette.accentText };
  return (
    <div style={{ background: palette.bg, color: palette.text }} className="overflow-hidden rounded-2xl border border-white/10">
      <section className="px-6 py-16 md:px-12 md:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: palette.accent }}>{concept.hero.eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">{concept.hero.headline}</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: palette.muted }}>{concept.hero.subheadline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-lg px-5 py-3 text-sm font-bold" style={button}>{concept.hero.primaryCta}</span>
          <span className="rounded-lg border px-5 py-3 text-sm font-bold" style={{ borderColor: palette.border }}>{concept.hero.secondaryCta}</span>
        </div>
      </section>

      <section className="grid gap-4 px-6 pb-16 md:grid-cols-3 md:px-12">
        {concept.valueProps.map((item) => (
          <div key={item.title} className="rounded-xl border p-6" style={surface}>
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: palette.muted }}>{item.body}</p>
          </div>
        ))}
      </section>

      <section className="px-6 pb-16 md:px-12">
        <h3 className="text-2xl font-bold tracking-tight">How it works</h3>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {concept.howItWorks.map((step, index) => (
            <li key={step.title} className="rounded-xl border p-6" style={surface}>
              <span className="text-sm font-bold" style={{ color: palette.accent }}>0{index + 1}</span>
              <h4 className="mt-2 font-bold">{step.title}</h4>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: palette.muted }}>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <div className="rounded-xl border p-8" style={surface}>
          <h3 className="text-2xl font-bold tracking-tight">{concept.offer.title}</h3>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: palette.muted }}>{concept.offer.body}</p>
          <ul className="mt-5 space-y-2">
            {concept.offer.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-sm"><span style={{ color: palette.accent }}>✓</span>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <h3 className="text-2xl font-bold tracking-tight">Questions</h3>
        <div className="mt-6 space-y-3">
          {concept.faq.map((item) => (
            <div key={item.question} className="rounded-xl border p-6" style={surface}>
              <h4 className="font-bold">{item.question}</h4>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: palette.muted }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 text-center md:px-12">
        <h3 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-[-0.03em]">{concept.finalCta.headline}</h3>
        <p className="mx-auto mt-3 max-w-xl" style={{ color: palette.muted }}>{concept.finalCta.body}</p>
        <span className="mt-6 inline-block rounded-lg px-6 py-3 text-sm font-bold" style={button}>{concept.finalCta.button}</span>
      </section>
    </div>
  );
}

function RequestChanges({ conceptId }: { conceptId: string }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: conceptId, message }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) {
        track('changes_requested', { concept: 'preview' });
        setStatus('sent');
      } else {
        setError(data.error ?? 'That did not go through. Please try again.');
        setStatus('error');
      }
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-200">
        <CheckCircle2 className="h-5 w-5 shrink-0" /> Got it. We&apos;ll reply by email.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="changes" className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">What would you like changed?</label>
      <textarea
        id="changes"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
        minLength={10}
        maxLength={2000}
        rows={4}
        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60"
        placeholder="Headline, sections, tone, colors — anything."
      />
      {status === 'error' && <p className="text-sm text-red-300" role="alert">{error}</p>}
      <button type="submit" disabled={status === 'sending'} className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-white/[0.08] disabled:opacity-60">
        {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending</> : 'Send change request'}
      </button>
    </form>
  );
}

export default function PreviewPage({ conceptId }: { conceptId: string }) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });

  useEffect(() => {
    setPageMeta('Your Landing Page Concept | Zyvibe', true);
  }, []);

  useEffect(() => {
    let polls = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/concept/${conceptId}`);
        if (cancelled) return;
        if (res.status === 404) return setState({ kind: 'notFound' });
        if (res.status === 410) return setState({ kind: 'expired' });
        if (!res.ok) return setState({ kind: 'error' });
        const data = (await res.json()) as ConceptResponse;
        setState({ kind: 'loaded', data });
        if (data.status === 'ready') {
          setPageMeta(`Concept for ${data.businessName} | Zyvibe`, true);
          track('preview_viewed', { status: 'ready' });
        }
        if (data.status === 'queued' && polls < MAX_POLLS) {
          polls += 1;
          timer = setTimeout(load, POLL_MS);
        }
      } catch {
        if (!cancelled) setState({ kind: 'error' });
      }
    };
    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [conceptId]);

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-bg-main text-slate-300">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 text-center">
        <a href="/" className="mb-10 text-2xl font-extrabold tracking-[-0.06em] text-white">Zyvibe</a>
        {children}
      </div>
    </div>
  );

  if (state.kind === 'loading') return shell(<Loader2 className="h-8 w-8 animate-spin text-violet-400" />);
  if (state.kind === 'notFound') return shell(<><h1 className="text-2xl font-bold text-white">This preview link isn&apos;t valid.</h1><p className="mt-3 text-sm">Check the link in your email, or <a href="/start" className="text-violet-300 underline">request a new concept</a>.</p></>);
  if (state.kind === 'expired') return shell(<><h1 className="text-2xl font-bold text-white">This preview has expired.</h1><p className="mt-3 text-sm">Preview links stay active for 30 days. <a href="/start" className="text-violet-300 underline">Request a new concept</a> or email {CONTACT_EMAIL}.</p></>);
  if (state.kind === 'error') return shell(<><h1 className="text-2xl font-bold text-white">We couldn&apos;t load this preview.</h1><p className="mt-3 text-sm">Refresh the page, or email {CONTACT_EMAIL}.</p></>);

  const { data } = state;
  if (data.status === 'queued') return shell(<><Loader2 className="h-8 w-8 animate-spin text-violet-400" /><h1 className="mt-6 text-2xl font-bold text-white">Your concept is still being written.</h1><p className="mt-3 text-sm">This page refreshes on its own. We&apos;ll also email you the link.</p></>);
  if (data.status === 'failed' || !data.concept || !data.paymentUrl) return shell(<><h1 className="text-2xl font-bold text-white">We&apos;re finishing your concept by hand.</h1><p className="mt-3 text-sm">It didn&apos;t generate cleanly, so we&apos;ve been notified and will email you directly. Questions: {CONTACT_EMAIL}.</p></>);

  const direction = getVisualDirection(data.visualDirection ?? '');
  const paymentUrl = data.paymentUrl;

  return (
    <div className="min-h-screen bg-bg-main text-slate-300">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-bg-main/90 px-5 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-extrabold tracking-[-0.06em] text-white">Zyvibe</a>
            <span className="hidden text-xs text-slate-500 sm:inline">Concept preview · {data.businessName}</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#request-changes" className="rounded-lg border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-white/[0.06]">Request changes</a>
            <a
              href={paymentUrl}
              onClick={() => track('sprint_pay_clicked', { location: 'preview_header' })}
              className="rounded-lg bg-[#7c3aed] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#6d28d9]"
            >
              Start my {SPRINT_PRICE_LABEL} Sprint
            </a>
          </div>
        </div>
      </header>

      <main className="px-5 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm leading-relaxed text-amber-100" role="note">{DISCLAIMER}</p>

          <div className="mt-8">
            <ConceptView concept={data.concept} palette={direction.palette} />
          </div>

          <section className="mt-12 grid gap-6 lg:grid-cols-2" aria-labelledby="offer-heading">
            <div className="bento-card p-7 md:p-8">
              <h2 id="offer-heading" className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Website Sprint</h2>
              <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-white">{SPRINT_PRICE_LABEL} <span className="text-base font-semibold text-slate-400">one-time</span></p>
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                <li>✓ Design and build of your site, starting from this concept</li>
                <li>✓ 2-week sprint from kickoff</li>
                <li>✓ {SPRINT_REVISION_ROUNDS} revision rounds</li>
                <li>✓ Launch on your domain</li>
                <li>✓ Full refund if you cancel before kickoff</li>
              </ul>
              <a
                href={paymentUrl}
                onClick={() => track('sprint_pay_clicked', { location: 'offer_card' })}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-5 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-[0_7px_30px_rgba(124,58,237,0.38)] hover:bg-[#6d28d9]"
              >
                Start my {SPRINT_PRICE_LABEL} Sprint <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-center text-xs text-slate-500">Secure checkout by Stripe. One payment, never a subscription. <a href="/terms" className="underline">Terms</a></p>
            </div>
            <div className="bento-card p-7 md:p-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">After launch (optional)</h2>
              <p className="mt-3 text-2xl font-bold text-white">Care Plan · {CARE_PLAN_PRICE_LABEL}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">Ongoing care with a defined monthly scope, offered only once your site is live. It is separate from the Sprint and never added automatically.</p>

              <div id="request-changes" className="mt-8 scroll-mt-24 border-t border-white/[0.08] pt-6">
                <h2 className="text-lg font-bold text-white">Request changes</h2>
                <p className="mt-1 mb-4 text-sm text-slate-400">Tell us what to adjust. You can also reply to your concept email.</p>
                <RequestChanges conceptId={conceptId} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
