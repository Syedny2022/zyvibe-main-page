'use client';

import React, { useState } from 'react';

export default function PromotePage() {
  const [listingType, setListingType] = useState<'showcase' | 'solo_service'>('showcase');
  const [tier, setTier] = useState<'weekly' | 'permanent'>('weekly');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingType,
          tier,
          name,
          email,
          url,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px' }}>
      <h1>Promote Your Project or Solo Service</h1>
      <p>
        Get listed on <strong>zyvibe.com</strong> and <strong>seo.zyvibe.com</strong>.
        Verified placement for autonomous projects, remote solo developers, and boutique solo agencies.
      </p>

      {error && (
        <div style={{ padding: '12px', margin: '16px 0', border: '1px solid red', color: 'red' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Listing Category:</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="listingType"
                value="showcase"
                checked={listingType === 'showcase'}
                onChange={() => setListingType('showcase')}
              />{' '}
              Builder Showcase (Agent / Tool Project)
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="listingType"
                value="solo_service"
                checked={listingType === 'solo_service'}
                onChange={() => setListingType('solo_service')}
              />{' '}
              Remote Solo Developer / Solo Agency
            </label>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Promotion Tier:</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="tier"
                value="weekly"
                checked={tier === 'weekly'}
                onChange={() => setTier('weekly')}
              />{' '}
              1-Week Featured Slot ($49)
            </label>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="tier"
                value="permanent"
                checked={tier === 'permanent'}
                onChange={() => setTier('permanent')}
              />{' '}
              Permanent Verified Listing ($149)
            </label>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Project / Service Name:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. DocTriage AI or CloudOps Solo Studio"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Target Destination URL:</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Contact / Billing Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
            Transactional receipt will be sent from <strong>mail.zyvibe.com</strong> upon confirmation.
          </small>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>Short Description (One-liner):</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does your project or remote solo agency do?"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginTop: '8px',
          }}
        >
          {loading ? 'Initializing Stripe Checkout...' : `Proceed to Secure Checkout ($${tier === 'permanent' ? '149' : '49'})`}
        </button>
      </form>

      <div style={{ marginTop: '32px', borderTop: '1px solid #ddd', paddingTop: '16px', fontSize: '13px', color: '#666' }}>
        <p>• Zero recurring subscriptions. One-time payment via Stripe.</p>
        <p>• Instant idempotent webhook activation & email delivery via mail.zyvibe.com.</p>
        <p>• Strictly remote developers & solo agencies. No local businesses accepted.</p>
      </div>
    </div>
  );
}
