import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zyvibe | Real AI Workflows & Remote Solo Services',
  description: 'Verified directory of practical AI agent use cases, remote solo developers & solo agencies, and builder systems.',
  metadataBase: new URL('https://zyvibe.com'),
  alternates: {
    canonical: 'https://zyvibe.com',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    title: 'Zyvibe | Real AI Workflows & Remote Solo Services',
    description: 'Verified directory of practical AI agent use cases and remote solo developers.',
    url: 'https://zyvibe.com',
    siteName: 'Zyvibe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zyvibe | Real AI Workflows & Remote Solo Services',
    description: 'Verified directory of practical AI agent use cases and remote solo developers.',
    creator: '@Syedny2022',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zyvibe',
    url: 'https://zyvibe.com',
    sameAs: [
      'https://github.com/Syedny2022',
      'https://zyvibe.me',
      'https://seo.zyvibe.com',
      'https://blog.zyvibe.com',
    ],
    founder: {
      '@type': 'Person',
      name: 'Syed M.',
      url: 'https://zyvibe.me',
      sameAs: 'https://github.com/Syedny2022',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Google Analytics Tag: GT-NNXKN8VR (Property 500711711) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GT-NNXKN8VR" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GT-NNXKN8VR', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Main Navigation Bar */}
        <header style={{ borderBottom: '1px solid #ddd', padding: '12px 20px', background: '#fff' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href="/" style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', color: '#111' }}>
                zyvibe.com
              </Link>
              <nav style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                <Link href="/">AI Use Cases</Link>
                <Link href="/services">Solo Services (seo.zyvibe.com)</Link>
                <Link href="/showcase">Builder Showcase</Link>
                <Link href="/new">Daily Changelog</Link>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
              <Link href="/promote" style={{ fontWeight: 'bold', color: '#0066cc' }}>
                + Promote Listing ($49)
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, width: '100%' }}>
          {children}
        </main>

        {/* Global Footer & Ecosystem Cross-Links */}
        <footer style={{ borderTop: '1px solid #eee', background: '#fafafa', padding: '32px 20px', fontSize: '13px', color: '#666' }}>
          <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#222', margin: '0 0 8px 0' }}>Zyvibe Network</p>
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                Verified directory for autonomous workflows, remote developers, and builder systems. Zero database, pure file-based architecture.
              </p>
            </div>

            <div>
              <p style={{ fontWeight: 'bold', color: '#222', margin: '0 0 8px 0' }}>Ecosystem Navigation</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
                <li><a href="https://zyvibe.com">zyvibe.com (Directory Hub)</a></li>
                <li><a href="https://seo.zyvibe.com">seo.zyvibe.com (Solo Services)</a></li>
                <li><a href="https://blog.zyvibe.com">blog.zyvibe.com (Engineering Blog)</a></li>
                <li><a href="https://zyvibe.me">zyvibe.me (Founder Profile)</a></li>
              </ul>
            </div>

            <div>
              <p style={{ fontWeight: 'bold', color: '#222', margin: '0 0 8px 0' }}>Resources & Feeds</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
                <li><Link href="/llms.txt">/llms.txt (AI Crawlers & LLMs)</Link></li>
                <li><Link href="/sitemap.xml">/sitemap.xml (Search Engines)</Link></li>
                <li><Link href="/rss.xml">/rss.xml (Syndication Feed)</Link></li>
                <li><Link href="/promote">Submit Paid Listing</Link></li>
              </ul>
            </div>

            <div>
              <p style={{ fontWeight: 'bold', color: '#222', margin: '0 0 8px 0' }}>Provenance & Verification</p>
              <p style={{ margin: '0 0 4px 0' }}>GitHub: <a href="https://github.com/Syedny2022" target="_blank" rel="noopener noreferrer">@Syedny2022</a></p>
              <p style={{ margin: '0 0 4px 0' }}>Domain: <code>zyvibe.com</code></p>
              <p style={{ margin: 0 }}>Mail: <code>mail.zyvibe.com</code> (Transactional)</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
