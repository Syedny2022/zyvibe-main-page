import Link from 'next/link';
import { Metadata } from 'next';
import { getAllBuilderShowcases } from '@/lib/data-store';

export const metadata: Metadata = {
  title: 'Builder Showcase | Autonomous Projects & Tools | zyvibe.com',
  description: 'Verified showcase of software, agent systems, and automated tools built by independent builders and engineers.',
  alternates: {
    canonical: 'https://zyvibe.com/showcase',
  },
};

export const revalidate = 60;

export default function ShowcasePage() {
  const showcases = getAllBuilderShowcases();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>
          Builder Showcase • zyvibe.com
        </p>
        <h1>Autonomous Projects & Builder Systems</h1>
        <p style={{ color: '#555' }}>
          Tested projects, open-source utilities, and automated systems built with modern agent architectures.
        </p>
        <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '14px' }}>
          <Link href="/promote" style={{ fontWeight: 'bold' }}>
            + Submit Your Project ($49/week or $149 permanent)
          </Link>
          <span>•</span>
          <Link href="/">AI Use Cases</Link>
          <span>•</span>
          <Link href="/services">Remote Solo Services</Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {showcases.map((project) => (
          <article
            key={project.slug}
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
                  {project.category}
                </span>
                {project.featured && (
                  <span style={{ fontSize: '11px', background: '#e3f2fd', color: '#0d47a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                    ★ Featured
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '18px', margin: '4px 0' }}>
                <Link href={`/showcase/${project.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {project.name}
                </Link>
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '6px', lineHeight: '1.4' }}>
                {project.tagline}
              </p>

              {project.metrics && (
                <p style={{ fontSize: '12px', color: '#2e7d32', marginTop: '8px', fontWeight: '600' }}>
                  📈 {project.metrics}
                </p>
              )}

              <div style={{ marginTop: '12px', fontSize: '12px', color: '#555' }}>
                <p><strong>Builder:</strong> {project.builderName} ({project.builderHandle})</p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {project.agentStack.map((tech, idx) => (
                  <span key={idx} style={{ fontSize: '11px', border: '1px solid #eee', padding: '2px 6px', borderRadius: '4px' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                Visit Project ↗
              </a>
              <Link href={`/showcase/${project.slug}`} style={{ fontWeight: 'bold' }}>
                Details →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
