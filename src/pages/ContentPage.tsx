import React, { useEffect } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { setPageMeta } from '../lib/site';

interface ContentPageProps {
  title: string;
  metaTitle: string;
  noindex?: boolean;
  intro?: string;
  children: React.ReactNode;
}

/** Shared layout for text pages (thanks, terms, privacy). */
export default function ContentPage({ title, metaTitle, noindex = false, intro, children }: ContentPageProps) {
  useEffect(() => {
    setPageMeta(metaTitle, noindex);
  }, [metaTitle, noindex]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg-main text-slate-300 bg-grid-premium">
      <SiteHeader />
      <main className="px-5 py-16 md:px-8 md:py-24">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-white md:text-5xl">{title}</h1>
          {intro && <p className="mt-6 text-lg leading-relaxed text-slate-400">{intro}</p>}
          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-300 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
