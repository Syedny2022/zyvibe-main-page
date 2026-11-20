'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { UseCase, CategoryCount, ToolCount } from '../lib/types';

interface DirectoryViewProps {
  useCases: UseCase[];
  categories: CategoryCount[];
  tools: ToolCount[];
}

export default function DirectoryView({ useCases, categories, tools }: DirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<string>('all');

  // Newsletter subscribe state
  const [subEmail, setSubEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subStatus, setSubStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubLoading(true);
    setSubStatus(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail, source: 'homepage' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubStatus({ ok: true, msg: data.message });
        setSubEmail('');
      } else {
        setSubStatus({ ok: false, msg: data.error || 'Failed to subscribe' });
      }
    } catch (err: any) {
      setSubStatus({ ok: false, msg: err.message || 'Error subscribing' });
    } finally {
      setSubLoading(false);
    }
  };

  const filteredUseCases = useMemo(() => {
    return useCases.filter(item => {
      if (selectedCategory !== 'all' && item.categorySlug !== selectedCategory) {
        return false;
      }
      if (selectedTool !== 'all' && item.toolSlug !== selectedTool) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesOneLiner = item.oneLiner.toLowerCase().includes(query);
        const matchesProblem = item.problem.toLowerCase().includes(query);
        const matchesTool = item.tool.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        return matchesTitle || matchesOneLiner || matchesProblem || matchesTool || matchesCategory;
      }
      return true;
    });
  }, [useCases, selectedCategory, selectedTool, searchQuery]);

  const discoveredTodayItems = useMemo(() => {
    return useCases.filter(i => i.discoveredToday).slice(0, 3);
  }, [useCases]);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      {/* Network Header & Quick Navigation */}
      <nav style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
        <Link href="/" style={{ fontWeight: 'bold' }}>AI Use Cases (zyvibe.com)</Link>
        <span>•</span>
        <Link href="/services">Solo Services (seo.zyvibe.com)</Link>
        <span>•</span>
        <Link href="/showcase">Builder Showcase</Link>
        <span>•</span>
        <Link href="/new">Daily Changelog</Link>
        <span>•</span>
        <Link href="/promote" style={{ color: '#0066cc', fontWeight: 'bold' }}>+ Promote Listing</Link>
      </nav>

      {/* Main Header */}
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>Real AI Workflows &amp; Agent Directory</h1>
        <p style={{ color: '#555', margin: 0, fontSize: '15px' }}>
          Verified community experiments, runnable prompt recipes, and remote solo developers.
        </p>
      </header>

      {/* Email Subscription Box */}
      <section style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '28px', background: '#fafafa' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>Get Fresh Use Cases in Your Inbox</h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666' }}>
          Weekly updates with tested prompts. Stored cleanly via <code>/api/subscribe</code>.
        </p>
        <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="email"
            required
            value={subEmail}
            onChange={(e) => setSubEmail(e.target.value)}
            placeholder="you@domain.com"
            style={{ padding: '8px', minWidth: '240px', flex: '1', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button
            type="submit"
            disabled={subLoading}
            style={{ padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {subLoading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {subStatus && (
          <p style={{ fontSize: '13px', marginTop: '8px', color: subStatus.ok ? 'green' : 'red', margin: '8px 0 0 0' }}>
            {subStatus.msg}
          </p>
        )}
      </section>

      {/* Search Input */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="search-input" style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
          Search practical workflows:
        </label>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. invoices, resumes, contracts, support, SEO..."
          style={{ width: '100%', padding: '10px', fontSize: '14px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      {/* Discovered Today Shelf */}
      {!searchQuery && selectedCategory === 'all' && selectedTool === 'all' && discoveredTodayItems.length > 0 && (
        <section style={{ marginBottom: '32px', border: '1px solid #c8e6c9', background: '#f1f8e9', padding: '16px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '15px', margin: '0 0 12px 0', color: '#2e7d32', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ● Discovered Today • Fresh Workflows
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {discoveredTodayItems.map((item) => (
              <div key={item.slug} style={{ background: '#fff', border: '1px solid #dcedc8', borderRadius: '6px', padding: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#388e3c' }}>{item.tool}</span>
                <h3 style={{ fontSize: '15px', margin: '6px 0' }}>
                  <Link href={`/use-case/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {item.title}
                  </Link>
                </h3>
                <p style={{ fontSize: '12px', color: '#555', margin: '0 0 8px 0' }}>{item.oneLiner}</p>
                <Link href={`/use-case/${item.slug}`} style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  View Recipe &amp; Prompt →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filter Chips */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
            Filter by Goal:
          </strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
              }}
            >
              All Goals ({useCases.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat.slug ? 'bold' : 'normal',
                }}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        <div>
          <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '6px' }}>
            Filter by Tool:
          </strong>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTool('all')}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: selectedTool === 'all' ? 'bold' : 'normal',
              }}
            >
              Any Tool
            </button>
            {tools.map((t) => (
              <button
                key={t.slug}
                onClick={() => setSelectedTool(t.slug)}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: selectedTool === t.slug ? 'bold' : 'normal',
                }}
              >
                {t.name} ({t.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows List */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>
            {selectedCategory === 'all' && selectedTool === 'all' && !searchQuery ? 'The Core Playbook' : 'Filtered Results'}
          </h2>
          <span style={{ fontSize: '13px', color: '#666' }}>{filteredUseCases.length} workflows</span>
        </div>

        {filteredUseCases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <p>No use cases match your search query.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedTool('all'); }} style={{ padding: '6px 12px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredUseCases.map((item) => (
              <article
                key={item.slug}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                    <span>{item.category}</span>
                    <span><strong>{item.tool}</strong> • {item.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', margin: '4px 0' }}>
                    <Link href={`/use-case/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {item.title}
                    </Link>
                  </h3>
                  <p style={{ fontSize: '13px', color: '#555', marginTop: '6px', lineHeight: '1.4' }}>
                    {item.oneLiner}
                  </p>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#666' }}>▲ {item.votes || 10} votes</span>
                  <Link href={`/use-case/${item.slug}`} style={{ fontWeight: 'bold' }}>
                    View Prompt →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
