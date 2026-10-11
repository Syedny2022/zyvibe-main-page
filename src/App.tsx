import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Loader2,
  Sparkles,
} from 'lucide-react';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { CARE_PLAN_PRICE_LABEL, SPRINT_PRICE_LABEL, SPRINT_REVISION_ROUNDS } from '../shared/concept';
import { CONTACT_EMAIL, SEO_URL, setPageMeta, startUrl, track } from './lib/site';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const steps = [
  { title: 'Tell us about your business', body: 'Fill in a short intake form. No discovery call.' },
  { title: 'Get your free concept', body: 'We generate an AI-assisted landing page concept from your answers.' },
  { title: 'Review it privately', body: 'We email you a private preview link to look over on your own time.' },
  { title: 'Build it or adjust it', body: `Pay ${SPRINT_PRICE_LABEL} once to start your sprint, or request changes first.` },
  { title: 'Launch, then decide', body: 'After launch you can add the optional Care Plan. Nothing is automatic.' },
];

const included = [
  'Design and build of your website, starting from your approved concept',
  'A 2-week sprint from kickoff',
  `${SPRINT_REVISION_ROUNDS} revision rounds`,
  'Launch on your domain',
  'You work directly with the founder building it',
];

const faqs = [
  {
    question: 'Do I need a discovery call?',
    answer: 'No. Fill in the intake form and we email you a private link to your concept. You can ask questions by replying to that email.',
  },
  {
    question: 'What is the free concept?',
    answer: 'An AI-assisted landing page draft based on your answers: headline, sections, and copy in your chosen visual direction. It shows a possible direction. It is not the final production website.',
  },
  {
    question: `Is the ${SPRINT_PRICE_LABEL} a subscription?`,
    answer: `No. The Website Sprint is one ${SPRINT_PRICE_LABEL} payment for one 2-week sprint. It never renews.`,
  },
  {
    question: 'What is the Care Plan?',
    answer: `An optional ${CARE_PLAN_PRICE_LABEL} plan for ongoing care with a defined monthly scope. It is offered only after launch, paid separately, and never added automatically.`,
  },
  {
    question: 'How many revisions do I get?',
    answer: `${SPRINT_REVISION_ROUNDS} revision rounds during the sprint.`,
  },
  {
    question: 'What if I change my mind?',
    answer: 'You get a full refund if you ask before kickoff. Once the sprint has started, the payment is non-refundable.',
  },
  {
    question: 'Do you guarantee rankings or traffic?',
    answer: 'No. We build a clear, well-structured site. We do not promise rankings, traffic, or revenue.',
  },
  {
    question: 'How can I contact Zyvibe?',
    answer: `Email ${CONTACT_EMAIL}.`,
  },
];

export default function App() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [affiliateStatus, setAffiliateStatus] = useState<SubmitStatus>('idle');

  useEffect(() => {
    setPageMeta('Zyvibe — Website Sprint for Founders | $2,999 Flat Fee');
  }, []);

  const handleAffiliateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!affiliateEmail) return;
    setAffiliateStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: affiliateEmail.trim(), source_page: 'affiliate' }),
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        track('affiliate_interest_signup', { source: 'zyvibe_home_affiliates' });
        setAffiliateStatus('success');
      } else {
        setAffiliateStatus('error');
      }
    } catch {
      setAffiliateStatus('error');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-main text-slate-300 bg-grid-premium">
      <SiteHeader />

      <main>
        <section className="relative isolate px-5 pb-20 pt-16 md:px-8 md:pb-32 md:pt-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden">
            <div className="absolute left-[6%] top-[-260px] h-[520px] w-[520px] rounded-full bg-[#7c3aed]/20 blur-[120px]" />
            <div className="absolute right-[5%] top-[-230px] h-[480px] w-[480px] rounded-full bg-[#4f46e5]/15 blur-[120px]" />
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300">
                <Sparkles className="h-3.5 w-3.5" />
                Founder-led design &amp; development
              </p>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-[-0.065em] text-white md:text-7xl lg:text-8xl">
                Build your dream. <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Grow your vibe.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                Zyvibe designs and builds your website in one 2-week sprint for a flat {SPRINT_PRICE_LABEL}. Start with a free AI-assisted landing page concept. No discovery call, no subscription.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={startUrl('hero')}
                  onClick={() => track('select_content', { content_type: 'sprint_cta', item_id: 'hero' })}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_7px_30px_rgba(124,58,237,0.38)] transition hover:-translate-y-0.5 hover:bg-[#6d28d9]"
                >
                  Get My Free Concept <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  See How It Works
                </a>
              </div>
              <p className="mt-5 text-sm text-slate-500">One-time {SPRINT_PRICE_LABEL}. Pay only if you want us to build it.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.08 }}>
              <div className="bento-card relative overflow-hidden p-7 md:p-9">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
                <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Website Sprint</p>
                <p className="relative mt-3 text-6xl font-extrabold tracking-[-0.06em] text-white">{SPRINT_PRICE_LABEL}</p>
                <p className="relative mt-1 text-sm text-slate-400">One-time payment. Never a subscription.</p>
                <ul className="relative mt-7 space-y-3 text-sm text-slate-300">
                  {included.map((item) => (
                    <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-y border-white/[0.07] bg-white/[0.015] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">How it works</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">From a short form to a live site. No call needed.</h2>
            <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {steps.map((step, index) => (
                <li key={step.title} className="bento-card p-6">
                  <span className="text-sm font-bold text-violet-300">0{index + 1}</span>
                  <h3 className="mt-3 text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Pricing</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">One flat fee to launch. One optional plan after.</h2>
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              <div className="bento-card border-violet-500/30 p-8 md:p-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Website Sprint</h3>
                <p className="mt-4 text-5xl font-extrabold tracking-[-0.05em] text-white">{SPRINT_PRICE_LABEL} <span className="text-base font-semibold text-slate-400">one-time</span></p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">Required to start the real build. A 2-week sprint with {SPRINT_REVISION_ROUNDS} revision rounds. Full refund if you cancel before kickoff.</p>
                <a
                  href={startUrl('pricing')}
                  onClick={() => track('select_content', { content_type: 'sprint_cta', item_id: 'pricing' })}
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#6d28d9]"
                >
                  Get My Free Concept <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="bento-card p-8 md:p-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Care Plan · optional</h3>
                <p className="mt-4 text-5xl font-extrabold tracking-[-0.05em] text-white">{CARE_PLAN_PRICE_LABEL.replace('/month', '')} <span className="text-base font-semibold text-slate-400">/month</span></p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">Ongoing care with a defined monthly scope, offered only after your site launches. Paid separately. Never added automatically, and never &ldquo;unlimited&rdquo;.</p>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Available after launch</p>
              </div>
            </div>
          </div>
        </section>

        <section id="seo-audit" className="border-y border-white/[0.07] bg-white/[0.015] px-5 py-20 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">Already have a site?</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">Check what is holding it back in search with the Zyvibe SEO audit.</p>
              <a href={`${SEO_URL}seo_audit_section`} onClick={() => track('select_content', { content_type: 'product_cta', item_id: 'seo_audit_section' })} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-indigo-300 transition-colors hover:text-white">
                Go to the SEO audit <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="bento-card p-8 md:p-10">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300"><FileSearch className="h-6 w-6" /></span>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">seo.zyvibe.com</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">Technical, content, and visibility checks for an existing website.</p>
            </div>
          </div>
        </section>

        <section id="affiliates" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Partner with Zyvibe</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">Know founders who need a site?</h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">Join the Zyvibe partner list and we&apos;ll email you program details when they&apos;re ready.</p>
            </div>
            <div className="bento-card p-7 md:p-8">
              {affiliateStatus === 'success' ? (
                <div className="flex min-h-[190px] flex-col justify-center text-center">
                  <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-400" />
                  <h3 className="mt-4 text-xl font-bold text-white">You&apos;re on the partner list.</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">We&apos;ll use this address for Zyvibe partner updates.</p>
                </div>
              ) : (
                <form onSubmit={handleAffiliateSubmit} className="space-y-4">
                  <label htmlFor="affiliate-email" className="block text-xs font-bold uppercase tracking-[0.16em] text-white">Partner email</label>
                  <input id="affiliate-email" type="email" required value={affiliateEmail} onChange={(event) => setAffiliateEmail(event.target.value)} disabled={affiliateStatus === 'submitting'} placeholder="you@yourbusiness.com" className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 disabled:cursor-not-allowed disabled:opacity-60" />
                  {affiliateStatus === 'error' && <p className="text-sm text-red-300">That didn&apos;t go through. Please try again.</p>}
                  <button type="submit" disabled={affiliateStatus === 'submitting'} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-60">
                    {affiliateStatus === 'submitting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Joining</> : <>Join the Partner List <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.07] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Questions</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl">Frequently Asked Questions</h2>
            </div>
            <div className="mt-12 space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={faq.question} className="bento-card overflow-hidden">
                    <button type="button" onClick={() => setActiveFaq(isOpen ? null : index)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left text-base font-semibold text-white transition hover:bg-white/[0.03]">
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="h-5 w-5 shrink-0 text-violet-300" /> : <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                          <p className="border-t border-white/[0.06] px-6 py-5 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <div className="mt-14 text-center">
              <a
                href={startUrl('faq')}
                onClick={() => track('select_content', { content_type: 'sprint_cta', item_id: 'faq' })}
                className="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#6d28d9]"
              >
                Get My Free Concept <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
