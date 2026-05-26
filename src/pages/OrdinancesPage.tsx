import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, X, SlidersHorizontal, Heart, Car, Leaf, Building2,
  Shield, GraduationCap, Home, Users, List,
} from 'lucide-react';
import { ordinances, categoryStats } from '../data/ordinances';
import { OrdinanceCard } from '../components/ordinance/OrdinanceCard';
import type { OrdinanceStatus, OrdinanceCategory } from '../types';

const categoryIcons: Record<string, React.ReactNode> = {
  'Health & Sanitation': <Heart size={15} />,
  'Traffic & Transport': <Car size={15} />,
  'Environment': <Leaf size={15} />,
  'Business & Permits': <Building2 size={15} />,
  'Public Safety': <Shield size={15} />,
  'Education & Youth': <GraduationCap size={15} />,
  'Housing & Land Use': <Home size={15} />,
  'Social Welfare': <Users size={15} />,
};

export const OrdinancesPage: React.FC = () => {
  
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState<OrdinanceCategory | 'All'>(
    (searchParams.get('category') as OrdinanceCategory) || 'All'
  );
  const [activeStatus, setActiveStatus] = useState<OrdinanceStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az'>('newest');

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setQuery(q);
    if (cat) setActiveCategory(cat as OrdinanceCategory);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...ordinances];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.aiSummary.toLowerCase().includes(q) ||
          o.keywords.some((k) => k.toLowerCase().includes(q)) ||
          o.number.includes(q) ||
          o.category.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      list = list.filter((o) => o.category === activeCategory);
    }
    if (activeStatus !== 'all') {
      list = list.filter((o) => o.status === activeStatus);
    }
    if (sortBy === 'newest') list.sort((a, b) => parseInt(b.number) - parseInt(a.number));
    else if (sortBy === 'oldest') list.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    else if (sortBy === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [query, activeCategory, activeStatus, sortBy]);

  const statusDotColor: Record<OrdinanceStatus | 'all', string> = {
    all: 'var(--text-tertiary)',
    active: 'var(--active-text)',
    amended: 'var(--amended-text)',
    repealed: 'var(--repealed-text)',
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 2rem 3rem' }}>
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          Ordinance database
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Browse, search, and read all Cebu City ordinances with plain-language summaries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--sidebar-w) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1rem)' }}>
          {/* Categories */}
          <div
            style={{
              background: 'var(--surface)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                padding: '0 4px',
                marginBottom: 8,
              }}
            >
              Categories
            </p>

            <button
              onClick={() => setActiveCategory('All')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '7px 8px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeCategory === 'All' ? 'var(--brand-light)' : 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                marginBottom: 2,
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== 'All')
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)';
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== 'All')
                  (e.currentTarget as HTMLButtonElement).style.background = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <List size={15} color={activeCategory === 'All' ? 'var(--brand)' : 'var(--text-secondary)'} />
                <span
                  style={{
                    fontSize: 13,
                    color: activeCategory === 'All' ? 'var(--brand)' : 'var(--text-secondary)',
                    fontWeight: activeCategory === 'All' ? 500 : 400,
                  }}
                >
                  All ordinances
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  background: activeCategory === 'All' ? 'var(--brand-border)' : 'var(--bg)',
                  color: activeCategory === 'All' ? 'var(--brand-dark)' : 'var(--text-tertiary)',
                  border: `0.5px solid ${activeCategory === 'All' ? 'var(--brand-border)' : 'var(--border)'}`,
                  borderRadius: 99,
                  padding: '1px 7px',
                }}
              >
                {ordinances.length}
              </span>
            </button>

            {categoryStats.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label as OrdinanceCategory)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '7px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeCategory === cat.label ? 'var(--brand-light)' : 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  marginBottom: 2,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat.label)
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)';
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat.label)
                    (e.currentTarget as HTMLButtonElement).style.background = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: activeCategory === cat.label ? 'var(--brand)' : 'var(--text-secondary)', display: 'flex' }}>
                    {categoryIcons[cat.label]}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: activeCategory === cat.label ? 'var(--brand)' : 'var(--text-secondary)',
                      fontWeight: activeCategory === cat.label ? 500 : 400,
                      textAlign: 'left',
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    background: activeCategory === cat.label ? 'var(--brand-border)' : 'var(--bg)',
                    color: activeCategory === cat.label ? 'var(--brand-dark)' : 'var(--text-tertiary)',
                    border: `0.5px solid ${activeCategory === cat.label ? 'var(--brand-border)' : 'var(--border)'}`,
                    borderRadius: 99,
                    padding: '1px 7px',
                    flexShrink: 0,
                  }}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div
            style={{
              background: 'var(--surface)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                padding: '0 4px',
                marginBottom: 8,
              }}
            >
              Status
            </p>
            {(['all', 'active', 'amended', 'repealed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  width: '100%',
                  padding: '7px 8px',
                  background: activeStatus === s ? 'var(--bg)' : 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  color: activeStatus === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeStatus === s ? 500 : 400,
                  marginBottom: 2,
                  transition: 'background 0.12s',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: statusDotColor[s],
                    flexShrink: 0,
                  }}
                />
                {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div>
          {/* Search + sort bar */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--surface)',
                border: '0.5px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                padding: '8px 14px',
              }}
            >
              <Search size={16} color="var(--text-tertiary)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ordinances…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  background: 'transparent',
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={15} color="var(--text-tertiary)" />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              style={{
                padding: '8px 12px',
                border: '0.5px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                fontFamily: 'inherit',
                fontSize: 13,
                color: 'var(--text-secondary)',
                background: 'var(--surface)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A–Z title</option>
            </select>
          </div>

          {/* Active filters */}
          {(activeCategory !== 'All' || activeStatus !== 'all' || query) && (
            <div style={{ display: 'flex', gap: 7, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                <SlidersHorizontal size={12} style={{ verticalAlign: -2 }} /> Active filters:
              </span>
              {activeCategory !== 'All' && (
                <button
                  onClick={() => setActiveCategory('All')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
                    background: 'var(--brand-light)', color: 'var(--brand)',
                    border: '0.5px solid var(--brand-border)', borderRadius: 99,
                    padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {activeCategory} <X size={11} />
                </button>
              )}
              {activeStatus !== 'all' && (
                <button
                  onClick={() => setActiveStatus('all')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
                    background: 'var(--bg)', color: 'var(--text-secondary)',
                    border: '0.5px solid var(--border)', borderRadius: 99,
                    padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {activeStatus} <X size={11} />
                </button>
              )}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
                    background: 'var(--bg)', color: 'var(--text-secondary)',
                    border: '0.5px solid var(--border)', borderRadius: 99,
                    padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  "{query}" <X size={11} />
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> ordinance{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
            </p>
          </div>

          {/* Ordinance list */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8 }}>No results found</p>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => { setQuery(''); setActiveCategory('All'); setActiveStatus('all'); }}
                style={{
                  marginTop: 16,
                  padding: '8px 20px',
                  background: 'var(--brand)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.map((o, i) => (
                <OrdinanceCard
                  key={o.id}
                  ordinance={o}
                  variant="default"
                  animationDelay={i * 0.04}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
