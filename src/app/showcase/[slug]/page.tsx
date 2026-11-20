import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllBuilderShowcases, getBuilderShowcaseBySlug } from '@/lib/data-store';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = getAllBuilderShowcases();
  return all.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getBuilderShowcaseBySlug(slug);
  if (!item) {
    return { title: 'Project Not Found' };
  }
  return {
    title: `${item.name} - Builder Showcase | zyvibe.com`,
    description: item.tagline,
    alternates: {
      canonical: `https://zyvibe.com/showcase/${item.slug}`,
    },
  };
}

export default async function ShowcaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getBuilderShowcaseBySlug(slug);

  if (!item) {
    notFound();
  }

  // Structured Data (JSON-LD) for SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: item.name,
    description: item.description,
    applicationCategory: item.category,
    url: item.websiteUrl,
    author: {
      '@type': 'Person',
      name: item.builderName,
      url: item.builderWebsite || 'https://zyvibe.me',
    },
  };

  return (
    <article style={{ maxWidth: '720px', margin: '0 auto', padding: '16px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
        <Link href="/">zyvibe.com</Link> / <Link href="/showcase">Showcase</Link> / <span>{item.name}</span>
      </nav>

      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>
          {item.category}
        </span>
        <h1 style={{ fontSize: '28px', marginTop: '8px', marginBottom: '4px' }}>{item.name}</h1>
        <p style={{ fontSize: '16px', color: '#555' }}>{item.tagline}</p>
        {item.metrics && (
          <p style={{ fontSize: '13px', color: '#2e7d32', marginTop: '8px', fontWeight: 'bold' }}>
            📈 {item.metrics}
          </p>
        )}
      </header>

      <section style={{ marginBottom: '24px' }}>
        <h2>About the Project</h2>
        <p style={{ lineHeight: '1.6', fontSize: '15px', color: '#333' }}>{item.description}</p>
      </section>

      <section style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Builder Details</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
          <li><strong>Builder:</strong> {item.builderName} ({item.builderHandle})</li>
          {item.builderGithub && (
            <li><strong>GitHub:</strong> <a href={item.builderGithub} target="_blank" rel="noopener noreferrer">{item.builderGithub}</a></li>
          )}
          {item.builderWebsite && (
            <li><strong>Personal Site:</strong> <a href={item.builderWebsite} target="_blank" rel="noopener noreferrer">{item.builderWebsite}</a></li>
          )}
          <li><strong>Stack:</strong> {item.agentStack.join(', ')}</li>
        </ul>
      </section>

      <div style={{ display: 'flex', gap: '16px' }}>
        <a
          href={item.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '10px 16px', background: '#0066cc', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Open Live Project ↗
        </a>
      </div>

      <footer style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid #eee', fontSize: '13px' }}>
        <Link href="/showcase">← Back to Builder Showcase</Link>
      </footer>
    </article>
  );
}
