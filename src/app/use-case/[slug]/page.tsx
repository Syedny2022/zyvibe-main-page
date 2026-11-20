import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllUseCases, getUseCaseBySlug } from '@/lib/data-store';
import CopyablePrompt from '@/components/CopyablePrompt';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = getAllUseCases();
  return all.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getUseCaseBySlug(slug);
  if (!item) {
    return { title: 'Use Case Not Found' };
  }
  return {
    title: `${item.title} | zyvibe.com`,
    description: item.oneLiner,
    alternates: {
      canonical: `https://zyvibe.com/use-case/${item.slug}`,
    },
    openGraph: {
      title: item.title,
      description: item.oneLiner,
      url: `https://zyvibe.com/use-case/${item.slug}`,
      type: 'article',
      publishedTime: item.date,
    },
    twitter: {
      card: 'summary',
      title: item.title,
      description: item.oneLiner,
    },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const item = getUseCaseBySlug(slug);

  if (!item) {
    notFound();
  }

  const all = getAllUseCases();
  const related = all.filter(u => u.slug !== item.slug && (u.categorySlug === item.categorySlug || u.toolSlug === item.toolSlug)).slice(0, 2);

  // Structured Data (JSON-LD): Article + HowTo
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.oneLiner,
    url: `https://zyvibe.com/use-case/${item.slug}`,
    datePublished: item.date,
    dateModified: item.date,
    author: {
      '@type': 'Person',
      name: item.source.author,
      url: item.source.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zyvibe',
      url: 'https://zyvibe.com',
    },
  };

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: item.title,
    description: item.oneLiner,
    step: item.workflow.map((stepText, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: stepText,
    })),
  };

  return (
    <article style={{ maxWidth: '760px', margin: '0 auto', padding: '16px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />

      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
        <Link href="/">Home (zyvibe.com)</Link> / <span>{item.category}</span> / <span>{item.title}</span>
      </nav>

      {/* Header Info */}
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#555', marginBottom: '8px' }}>
          <span style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
            {item.category}
          </span>
          <span>•</span>
          <span><strong>Tool:</strong> {item.tool}</span>
          <span>•</span>
          <span><strong>Setup:</strong> {item.difficulty}</span>
          <span>•</span>
          <span>Verified: {item.date}</span>
        </div>

        <h1 style={{ fontSize: '28px', lineHeight: '1.25', margin: '8px 0' }}>{item.title}</h1>

        <div style={{ padding: '12px', border: '1px solid #e0e0e0', background: '#fafafa', borderRadius: '6px', fontSize: '15px' }}>
          <strong>Quick Outcome:</strong> {item.oneLiner}
        </div>
      </header>

      {/* Problem & Headache */}
      <section style={{ marginBottom: '24px' }}>
        <h2>The Pain Point / Headache</h2>
        <div style={{ padding: '14px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' }}>
          <p style={{ margin: 0, lineHeight: '1.6' }}>{item.problem}</p>
        </div>
      </section>

      {/* Step-by-Step Workflow */}
      <section style={{ marginBottom: '24px' }}>
        <h2>Step-by-Step Workflow</h2>
        <div style={{ padding: '14px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' }}>
          <ol style={{ paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
            {item.workflow.map((step, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Copyable Prompt Template Box */}
      <section style={{ marginBottom: '24px' }}>
        <h2>Ready-to-Run Prompt Template</h2>
        <CopyablePrompt
          prompt={item.prompt}
          placeholders={item.promptPlaceholders}
        />
      </section>

      {/* The Reality Check (Gotchas & Limitations) */}
      <section style={{ marginBottom: '24px' }}>
        <h2>The Reality Check (Gotchas &amp; Limitations)</h2>
        <div style={{ padding: '14px', border: '1px solid #ffe0b2', background: '#fff8e1', borderRadius: '6px', fontSize: '14px', lineHeight: '1.6' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>First-Try Mistake:</strong> {item.realityCheck.firstTryMistake}
          </p>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Manual Review Required:</strong> {item.realityCheck.manualCleanupTime}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Real Limitations:</strong> {item.realityCheck.limitations}
          </p>
        </div>
      </section>

      {/* Source Verification Link */}
      <section style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '6px', background: '#fafafa', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '13px' }}>
        <div>
          <strong>Verified Source:</strong> Originally shared on {item.source.platform} by <code>{item.source.author}</code>
        </div>
        <a
          href={item.source.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 'bold', color: '#0066cc' }}
        >
          Read Original Discussion ↗
        </a>
      </section>

      {/* Related Use Cases */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>Related AI Workflows</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {related.map((rel) => (
              <div key={rel.slug} style={{ border: '1px solid #eee', padding: '12px', borderRadius: '6px' }}>
                <span style={{ fontSize: '11px', color: '#666' }}>{rel.tool} • {rel.category}</span>
                <h4 style={{ margin: '4px 0', fontSize: '14px' }}>
                  <Link href={`/use-case/${rel.slug}`}>{rel.title}</Link>
                </h4>
                <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{rel.oneLiner}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #eee', fontSize: '13px' }}>
        <Link href="/">← Back to All Use Cases (zyvibe.com)</Link>
      </footer>
    </article>
  );
}
