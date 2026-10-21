import { ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import SamplePreview from './components/SamplePreview';
import { CTA_HREF, CTA_LABEL, faqs, finalCta, hero, marquee, pricing, process, services, work } from './content/site';
import { track } from './lib/analytics';

function Cta({ id, className = 'btn-primary' }: { id: string; className?: string }) {
  return (
    <a href={CTA_HREF} className={className} onClick={() => track('select_content', { content_type: 'cta', item_id: id })}>
      {CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900">
        Skip to content
      </a>
      <Header />

      <main id="main">
        {/* Hero */}
        <section className="grain relative overflow-hidden">
          <div className="rule-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="container-x relative grid gap-16 pb-28 pt-16 md:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20 lg:pb-36">
            <div className="animate-rise">
              <p className="label">{hero.eyebrow}</p>
              <h1 className="display mt-7 text-[clamp(2.75rem,7vw,6rem)] leading-[0.95]">
                <span className="block">{hero.titleLines[0]}</span>
                <span className="block text-accent-soft">{hero.titleLines[1]}</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed md:text-xl">{hero.lead}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Cta id="hero" />
                <a href="#process" className="btn-ghost">How it works</a>
              </div>
              <p className="mt-6 text-sm text-muted">{hero.note}</p>
            </div>
            <div className="lg:pl-4">
              <SamplePreview />
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="overflow-hidden border-y border-line bg-navy-950 py-5" aria-label="What we build">
          <ul className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {[...marquee, ...marquee].map((item, i) => (
              <li key={i} aria-hidden={i >= marquee.length ? true : undefined} className="flex items-center gap-12 text-lg font-semibold tracking-tight text-white/80">
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        {/* Process */}
        <section id="process" className="py-24 md:py-36">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="label">{process.eyebrow}</p>
                <h2 className="display mt-5 text-4xl leading-[1.02] md:text-6xl">{process.title}</h2>
              </div>
              <p className="max-w-xl text-lg leading-relaxed lg:justify-self-end">{process.body}</p>
            </div>

            <ol className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
              <span className="absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-accent via-line-strong to-line md:block" aria-hidden="true" />
              {process.steps.map((s) => (
                <li key={s.title} className="relative">
                  <span className="relative block h-[15px] w-[15px] rounded-full border-2 border-accent bg-navy-900" aria-hidden="true" />
                  <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-accent-soft">{s.mark}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 max-w-sm leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="border-t border-line bg-navy-950 py-24 md:py-36">
          <div className="container-x grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="label">Services</p>
              <h2 className="display mt-5 text-4xl leading-[1.02] md:text-5xl">Design and development, under one roof.</h2>
              <p className="mt-6 max-w-sm text-lg leading-relaxed">From the first layout to a live, search-ready website. One team, one point of contact.</p>
              <div className="mt-9"><Cta id="services" className="btn-ghost" /></div>
            </div>
            <ul className="border-t border-line">
              {services.map((s, i) => (
                <li key={s.title} className="group grid gap-3 border-b border-line py-9 sm:grid-cols-[4rem_1fr] md:py-11">
                  <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent-soft">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{s.title}</h3>
                    <p className="mt-3 max-w-xl text-lg leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="py-24 md:py-36">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="label">Selected work</p>
                <h2 className="display mt-5 text-4xl leading-[1.02] md:text-5xl">Recent projects.</h2>
              </div>
              <p className="max-w-sm">Case studies are being written up and will be published here.</p>
            </div>
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {work.map((w, i) => (
                <li key={i} className="group">
                  <div className="overflow-hidden rounded-xl border border-line bg-navy-800">
                    <div className="flex gap-1.5 border-b border-line px-3 py-2.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-line-strong" />
                      <span className="h-2 w-2 rounded-full bg-line-strong" />
                      <span className="h-2 w-2 rounded-full bg-line-strong" />
                    </div>
                    <div className="grain aspect-[4/3] max-w-full" aria-hidden="true" />
                  </div>
                  <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-muted">{w.kind}</p>
                  <p className="mt-2 flex items-center gap-2 font-medium text-white">{w.status} <ArrowUpRight className="h-4 w-4 text-muted" aria-hidden="true" /></p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-line bg-navy-950 py-24 md:py-36">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="label">{pricing.eyebrow}</p>
                <h2 className="display mt-5 text-4xl leading-[1.02] md:text-6xl">{pricing.title}</h2>
              </div>
              <p className="max-w-xl text-lg leading-relaxed lg:justify-self-end">{pricing.body}</p>
            </div>

            <div className="mt-16 overflow-hidden rounded-2xl border border-line-strong">
              <dl className="divide-y divide-line">
                {pricing.lines.map((l, i) => (
                  <div key={l.what} className={`grid items-baseline gap-2 px-6 py-7 sm:grid-cols-[12rem_1fr_auto] sm:gap-8 md:px-10 ${i === 0 ? 'bg-accent/10' : 'bg-navy-900'}`}>
                    <dt className="font-mono text-xs uppercase tracking-[0.16em] text-accent-soft">{l.when}</dt>
                    <dd className="text-xl font-semibold tracking-tight text-white md:text-2xl">{l.what}</dd>
                    <dd className="flex items-baseline gap-3 sm:justify-end">
                      <span className="display text-4xl tabular-nums md:text-5xl">{l.price}</span>
                      <span className="text-sm text-muted">{l.note}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {[
                { title: 'Launch setup includes', items: pricing.setupIncludes },
                { title: 'Growth plan includes', items: pricing.growthIncludes },
              ].map((g) => (
                <div key={g.title}>
                  <h3 className="text-lg font-semibold">{g.title}</h3>
                  <ul className="mt-5 grid gap-3">
                    {g.items.map((item) => (
                      <li key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-soft" aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-14"><Cta id="pricing" /></div>
          </div>
        </section>

        {/* Book */}
        <section id="book" className="grain relative overflow-hidden py-24 md:py-36">
          <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="label">{CTA_LABEL}</p>
              <h2 className="display mt-5 text-4xl leading-[1.02] md:text-6xl">Get your free sample site.</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed">Tell us about your business. Within 24 hours you receive a private link to a working landing page designed for you.</p>
              <ul className="mt-10 grid gap-4">
                {['No payment details needed', 'Confirmation email sent right away', 'Sample site link within 24 hours'].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-white"><Check className="h-5 w-5 shrink-0 text-accent-soft" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </div>
            <BookingForm />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-line py-24 md:py-36">
          <div className="container-x grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="label">FAQ</p>
              <h2 className="display mt-5 text-4xl leading-[1.02] md:text-5xl">Questions, answered.</h2>
            </div>
            <div className="border-t border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-xl font-semibold tracking-tight">{f.q}</h3>
                    <Plus className="h-5 w-5 shrink-0 text-accent-soft transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
                  </summary>
                  <p className="-mt-2 max-w-2xl pb-7 text-lg leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line bg-accent">
          <div className="container-x flex flex-col items-start gap-10 py-20 md:py-28 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="display text-4xl leading-[1.02] md:text-6xl">{finalCta.title}</h2>
              <p className="mt-6 text-lg text-white/85">{finalCta.body}</p>
            </div>
            <a href={CTA_HREF} onClick={() => track('select_content', { content_type: 'cta', item_id: 'final' })} className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">
              {CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
