import Link from 'next/link';

interface SuccessPageProps {
  searchParams: Promise<{ listing?: string; session_id?: string }>;
}

export default async function PromoteSuccessPage({ searchParams }: SuccessPageProps) {
  const { listing, session_id } = await searchParams;

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '24px 16px', textAlign: 'center' }}>
      <h1>Payment & Listing Confirmed</h1>
      <p style={{ fontSize: '18px', marginTop: '12px' }}>
        Thank you for promoting <strong>{listing || 'your project'}</strong> on Zyvibe.
      </p>

      <div style={{ margin: '24px auto', padding: '16px', border: '1px solid #ccc', background: '#fafafa', textAlign: 'left' }}>
        <p><strong>Status:</strong> Active & Verified</p>
        {session_id && <p><strong>Reference ID:</strong> <code>{session_id}</code></p>}
        <p><strong>Confirmation:</strong> A receipt has been dispatched to your billing email from <code>mail.zyvibe.com</code>.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
        <Link href="/" style={{ padding: '8px 16px', border: '1px solid #333', textDecoration: 'none' }}>
          Back to Directory
        </Link>
        <Link href="/services" style={{ padding: '8px 16px', border: '1px solid #333', textDecoration: 'none' }}>
          View Solo Services Index
        </Link>
      </div>
    </div>
  );
}
