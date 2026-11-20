import Link from 'next/link';
import { Metadata } from 'next';
import { getAllUseCases } from '@/lib/data-store';

export const metadata: Metadata = {
  title: 'Daily Changelog & Fresh AI Workflows | zyvibe.com',
  description: 'Chronological timeline of real AI agent use cases scanned, verified, and published daily.',
  alternates: {
    canonical: 'https://zyvibe.com/new',
  },
};

export const revalidate = 60;

export default function NewPage() {
  const all = getAllUseCases();

  // Group use cases by date
  const groupedByDate: { [date: string]: typeof all } = {};
  all.forEach((item) => {
    if (!groupedByDate[item.date]) {
      groupedByDate[item.date] = [];
    }
    groupedByDate[item.date].push(item);
  });

  const dates = Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '16px' }}>
      <header style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>
          Daily Curation Changelog
        </p>
        <h1>New Use Cases, Day by Day</h1>
        <p style={{ color: '#555' }}>
          Real agent recipes added to the directory in chronological order.
        </p>
        <div style={{ marginTop: '8px' }}>
          <Link href="/">← Back to Main Directory (zyvibe.com)</Link>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {dates.map((date) => {
          const items = groupedByDate[date];
          const isToday = items.some(i => i.discoveredToday);

          return (
            <section key={date}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #ddd', paddingBottom: '6px' }}>
                <h2 style={{ fontSize: '16px', margin: 0 }}>{date}</h2>
                {isToday && (
                  <span style={{ fontSize: '11px', background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                    Fresh Today
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((item) => (
                  <article
                    key={item.slug}
                    style={{ border: '1px solid #eee', padding: '14px', borderRadius: '6px', background: '#fff' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      <span>{item.category}</span>
                      <span><strong>{item.tool}</strong> • {item.difficulty}</span>
                    </div>
                    <h3 style={{ margin: '4px 0', fontSize: '16px' }}>
                      <Link href={`/use-case/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '13px', color: '#555', margin: '6px 0 10px 0' }}>{item.oneLiner}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid #f5f5f5', paddingTop: '8px' }}>
                      <span>Source: {item.source.platform}</span>
                      <Link href={`/use-case/${item.slug}`} style={{ fontWeight: 'bold' }}>
                        View Recipe &amp; Prompt →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
