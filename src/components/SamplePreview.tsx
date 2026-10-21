export default function SamplePreview() {
  return (
    <figure className="relative" aria-label="Illustration of a sample landing page, the kind delivered within 24 hours">
      <div className="absolute -inset-6 rounded-[2rem] bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-navy-950 shadow-2xl shadow-black/50" aria-hidden="true">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </span>
          <span className="flex-1 truncate rounded-full bg-navy-800 px-3 py-1 font-mono text-[11px] text-muted">yourbusiness.com</span>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold tracking-tight text-white">yourbrand</span>
            <span className="flex items-center gap-4 text-muted">
              <span>Work</span>
              <span>About</span>
              <span className="rounded-full bg-accent px-3 py-1 font-semibold text-white">Contact</span>
            </span>
          </div>

          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-soft">Your business</p>
          <p className="mt-3 text-[clamp(1.35rem,2.4vw,1.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
            A headline written for the customers you want.
          </p>
          <p className="mt-3 max-w-[30ch] text-xs leading-relaxed text-body">
            Clear copy, a strong offer and one obvious next step, on every screen size.
          </p>
          <div className="mt-5 flex gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-accent px-4 py-2 text-white">Get started</span>
            <span className="rounded-full border border-white/20 px-4 py-2 text-white">Learn more</span>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {['Services', 'Results', 'Pricing'].map((t, i) => (
              <div key={t} className="rounded-lg border border-line bg-gradient-to-b from-navy-700 to-navy-800 p-3">
                <span className={`block h-10 rounded-md ${i === 1 ? 'bg-accent/40' : 'bg-white/10'}`} />
                <span className="mt-3 block text-[10px] font-semibold text-white">{t}</span>
                <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="absolute -bottom-5 left-6 flex items-center gap-2 rounded-full border border-line-strong bg-navy-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
        <span className="h-2 w-2 rounded-full bg-accent-soft" aria-hidden="true" />
        Your sample site, within 24 hours
      </figcaption>
    </figure>
  );
}
