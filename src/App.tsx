import { ArrowRight, Check } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import { benefits, CTA_HREF, CTA_LABEL, faqs, finalCta, hero, pricing, services, steps, work } from './content/site';
import { track } from './lib/analytics';

function Cta({ id, className = 'btn-primary' }: { id: string; className?: string }) {
  return (
    <a href={CTA_HREF} className={className} onClick={() => track('select_content', { content_type: 'cta', item_id: id })}>
      {CTA_LABEL} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-lg leading-relaxed">{body}</p>}
    </div>
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
        <section className="hairline-grid relative overflow-hidden border-b border-line">
          <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-[1.25fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{hero.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed">{hero.lead}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Cta id="hero" />
                <a href="#process" className="btn-ghost">See how it works</a>
              </div>
              <p className="mt-5 text-sm text-muted">{hero.note}</p>
            </div>

            <ol className="grid gap-px overflow-hidden rounded-lg border border-line bg-line" aria-label="What happens after you book">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4 bg-navy-800 p-5">
                  <span className="mt-0.5 font-mono text-sm text-accent-soft">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-medium text-white">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="services" className="py-20 md:py-28">
          <div className="container-x">
            <SectionHead eyebrow="Services" title="Design and front-end development, end to end." body="One team takes your idea from first layout to live, search-ready website." />
            <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.title} className="bg-navy-900 p-7">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="border-y border-line bg-navy-950 py-20 md:py-28">
          <div className="container-x">
            <SectionHead eyebrow="How it works" title="From booking to a live site in three steps." />
            <ol className="mt-14 grid gap-10 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="border-t border-accent pt-6">
                  <p className="font-mono text-sm text-accent-soft">Step {i + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="why" className="py-20 md:py-28">
          <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr]">
            <SectionHead eyebrow="Why Zyvibe" title="Agency-quality work without the agency guesswork." />
            <dl className="grid gap-10 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b.title}>
                  <dt className="text-lg font-semibold text-white">{b.title}</dt>
                  <dd className="mt-2 leading-relaxed">{b.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="work" className="border-y border-line bg-navy-950 py-20 md:py-28">
          <div className="container-x">
            <SectionHead eyebrow="Selected work" title="Recent projects." body="Case studies are being prepared and will appear here." />
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {work.map((w, i) => (
                <li key={i} className="rounded-lg border border-dashed border-line p-6">
                  <div className="hairline-grid aspect-[4/3] max-w-full rounded-md bg-navy-800" aria-hidden="true" />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{w.kind}</p>
                  <p className="mt-2 font-medium text-white">{w.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="pricing" className="py-20 md:py-28">
          <div className="container-x">
            <SectionHead eyebrow="Pricing" title="One setup fee. One flat monthly plan." body={pricing.footnote} />
            <div className="mt-14 grid gap-6 lg:grid-cols-2">
              {[pricing.setup, pricing.growth].map((p, i) => (
                <div key={p.name} className={`flex flex-col rounded-lg border p-8 ${i === 0 ? 'border-accent bg-navy-800' : 'border-line bg-navy-900'}`}>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-5xl font-bold tracking-tight text-white tabular-nums">{p.price}</span>
                    <span className="text-sm text-muted">{p.cadence}</span>
                  </p>
                  <ul className="mt-8 grid gap-3">
                    {p.items.map((item) => (
                      <li key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-soft" aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10"><Cta id="pricing" /></div>
          </div>
        </section>

        <section id="book" className="border-y border-line bg-navy-950 py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <SectionHead eyebrow="Book Spot Free" title="Get your free sample site." body="Answer five questions. Within 24 hours we email you a link to a working sample landing page built for your business." />
              <ul className="mt-8 grid gap-3 text-sm">
                <li className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-accent-soft" aria-hidden="true" />No payment details needed</li>
                <li className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-accent-soft" aria-hidden="true" />Confirmation email sent right away</li>
                <li className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-accent-soft" aria-hidden="true" />Sample site link within 24 hours</li>
              </ul>
            </div>
            <BookingForm />
          </div>
        </section>

        <section id="faq" className="py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <SectionHead eyebrow="FAQ" title="Questions, answered." />
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-white">
                    <h3 className="text-lg font-medium">{f.q}</h3>
                    <span className="text-2xl leading-none text-accent-soft transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-navy-800 py-20 md:py-24">
          <div className="container-x flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{finalCta.title}</h2>
              <p className="mt-4 text-lg">{finalCta.body}</p>
            </div>
            <Cta id="final" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
