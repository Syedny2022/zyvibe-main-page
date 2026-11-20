import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllSoloServices, getSoloServiceBySlug } from '@/lib/data-store';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = getAllSoloServices();
  return all.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getSoloServiceBySlug(slug);
  if (!item) {
    return { title: 'Service Not Found' };
  }
  return {
    title: `${item.name} - ${item.title} | seo.zyvibe.com`,
    description: item.oneLiner,
    alternates: {
      canonical: `https://seo.zyvibe.com/services/${item.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getSoloServiceBySlug(slug);

  if (!item) {
    notFound();
  }

  // Structured Data (JSON-LD) for LocalBusiness/ProfessionalService (Remote)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: item.name,
    description: item.description,
    url: `https://seo.zyvibe.com/services/${item.slug}`,
    areaServed: 'Worldwide',
    priceRange: item.rateOrPricing,
    founder: {
      '@type': 'Person',
      name: item.founderName,
      sameAs: `https://github.com/Syedny2022`,
    },
  };

  return (
    <article style={{ maxWidth: '720px', margin: '0 auto', padding: '16px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
        <Link href="/">zyvibe.com</Link> / <Link href="/services">seo.zyvibe.com</Link> / <span>{item.name}</span>
      </nav>

      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
        <span style={{ fontSize: '12px', background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
          ✓ Verified Remote {item.providerType}
        </span>
        <h1 style={{ fontSize: '28px', marginTop: '8px', marginBottom: '4px' }}>{item.name}</h1>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#444' }}>{item.title}</p>
        <p style={{ fontSize: '15px', color: '#555', marginTop: '8px' }}>{item.oneLiner}</p>
      </header>

      <section style={{ marginBottom: '24px' }}>
        <h2>About the Service</h2>
        <p style={{ lineHeight: '1.6', fontSize: '15px', color: '#333' }}>{item.description}</p>
      </section>

      <section style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Engagement Details</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
          <li><strong>Founder:</strong> {item.founderName} ({item.founderHandle})</li>
          <li><strong>Location:</strong> {item.location}</li>
          <li><strong>Rates & Pricing:</strong> {item.rateOrPricing}</li>
          <li><strong>Skills & Tech Stack:</strong> {item.skillsAndStack.join(', ')}</li>
        </ul>
      </section>

      <section id="contact" style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <a
          href={item.portfolioOrProofUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '10px 16px', border: '1px solid #333', textDecoration: 'none', fontWeight: 'bold' }}
        >
          View Verified Portfolio / Work ↗
        </a>
        <a
          href={item.contactEmailOrUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '10px 16px', background: '#0066cc', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Contact / Inquire Directly →
        </a>
      </section>

      <footer style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid #eee', fontSize: '13px' }}>
        <Link href="/services">← Back to Solo Services Directory (seo.zyvibe.com)</Link>
      </footer>
    </article>
  );
}
