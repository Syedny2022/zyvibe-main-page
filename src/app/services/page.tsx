import Link from 'next/link';
import { Metadata } from 'next';
import { getAllSoloServices } from '@/lib/data-store';

export const metadata: Metadata = {
  title: 'Remote Solo Developers & Solo Agencies Index | seo.zyvibe.com',
  description: 'Verified directory of remote solo developers, boutique solo agencies, and technical consultants. Zero local businesses, strictly remote digital talent.',
  alternates: {
    canonical: 'https://seo.zyvibe.com',
  },
};

export const revalidate = 60;

export default function ServicesPage() {
  const services = getAllSoloServices();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>
          Service Index • seo.zyvibe.com
        </p>
        <h1>Remote Solo Developers & Boutique Solo Agencies</h1>
        <p style={{ color: '#555' }}>
          Strictly remote individual developers, solo architects, and boutique 1-person agencies.
          No local or brick-and-mortar businesses.
        </p>
        <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '14px' }}>
          <Link href="/promote" style={{ fontWeight: 'bold' }}>
            + List Your Solo Service ($49/week or $149 permanent)
          </Link>
          <span>•</span>
          <Link href="/">Browse AI Use Cases (zyvibe.com)</Link>
          <span>•</span>
          <Link href="/showcase">Builder Showcase</Link>
        </div>
      </header>

      <section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {services.map((service) => (
            <article
              key={service.slug}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                    {service.providerType}
                  </span>
                  <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>
                    ✓ Verified Remote
                  </span>
                </div>

                <h2 style={{ fontSize: '18px', margin: '4px 0' }}>
                  <Link href={`/services/${service.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {service.name}
                  </Link>
                </h2>
                <p style={{ fontWeight: '600', fontSize: '14px', color: '#444' }}>{service.title}</p>
                <p style={{ fontSize: '13px', color: '#666', marginTop: '8px', lineHeight: '1.4' }}>
                  {service.oneLiner}
                </p>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#555' }}>
                  <p><strong>Founder:</strong> {service.founderName} ({service.founderHandle})</p>
                  <p><strong>Location:</strong> {service.location}</p>
                  <p><strong>Rate / Pricing:</strong> {service.rateOrPricing}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '12px' }}>
                  {service.skillsAndStack.map((skill, idx) => (
                    <span key={idx} style={{ fontSize: '11px', border: '1px solid #eee', padding: '2px 6px', borderRadius: '4px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <a href={service.portfolioOrProofUrl} target="_blank" rel="noopener noreferrer">
                  Portfolio / Proof ↗
                </a>
                <Link href={`/services/${service.slug}`} style={{ fontWeight: 'bold' }}>
                  Full Profile →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Network Cross-links */}
      <footer style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #eee', fontSize: '13px', color: '#666' }}>
        <p><strong>Zyvibe Ecosystem Network:</strong></p>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Primary Hub:</strong> <a href="https://zyvibe.com">zyvibe.com</a> - Verified AI Agent Use Cases & Playbook</li>
          <li><strong>Services Index:</strong> <a href="https://seo.zyvibe.com">seo.zyvibe.com</a> - Remote Solo Developers & Solo Agencies</li>
          <li><strong>Engineering Blog:</strong> <a href="https://blog.zyvibe.com">blog.zyvibe.com</a> - Automation Architecture & Deep Dives</li>
          <li><strong>Founder Profile:</strong> <a href="https://zyvibe.me">zyvibe.me</a> - Syed M. (@Syedny2022)</li>
        </ul>
      </footer>
    </div>
  );
}
