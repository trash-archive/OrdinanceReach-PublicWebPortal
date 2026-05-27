import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, X, SlidersHorizontal, Heart, Car, Leaf, Building2,
  Shield, GraduationCap, Home, Users, List, ChevronLeft, ChevronRight,
  Calendar,
} from 'lucide-react';
import { ordinances, categoryStats } from '../data/ordinances';
import { OrdinanceCard } from '../components/ordinance/OrdinanceCard';
import type { OrdinanceStatus, OrdinanceCategory } from '../types';

const PAGE_SIZE = 10;

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

// Derive available years from the data
const availableYears: string[] = Array.from(
  new Set(
    ordinances
      .map((o) => {
        const match = o.dateEnacted.match(/\d{4}$/);
        return match ? match[0] : null;
      })
      .filter(Boolean) as string[]
  )
).sort((a, b) => parseInt(b) - parseInt(a)); // newest first

export const OrdinancesPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState<OrdinanceCategory | 'All'>(
    (searchParams.get('category') as OrdinanceCategory) || 'All'
  );
  const [activeStatus, setActiveStatus] = useState<OrdinanceStatus | 'all'>('all');
  const [activeYear, setActiveYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az'>('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setQuery(q);
    if (cat) setActiveCategory(cat as OrdinanceCategory);
  }, [searchParams]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [query, activeCategory, activeStatus, activeYear, sortBy]);

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
    if (activeYear !== 'all') {
      list = list.filter((o) => o.dateEnacted.endsWith(activeYear));
    }
    if (sortBy === 'newest') list.sort((a, b) => parseInt(b.number) - parseInt(a.number));
    else if (sortBy === 'oldest') list.sort((a, b) => parseInt(a.number) - parseInt(b.number));
    else if (sortBy === 'az') list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [query, activeCategory, activeStatus, activeYear, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusDotColor: Record<OrdinanceStatus | 'all', string> = {
    all: 'var(--text-tertiary)',
    active: 'var(--active-text)',
    amended: 'var(--amended-text)',
    repealed: 'var(--repealed-text)',
  };

  const hasActiveFilters = activeCategory !== 'All' || activeStatus !== 'all' || activeYear !== 'all' || !!query;

  const clearAll = () => {
    setQuery('');
    setActiveCategory('All');
    setActiveStatus('all');
    setActiveYear('all');
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
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
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
                fontSize: 10, fontWeight: 600, letterSpacing: '1.2px',
                textTransform: 'uppercase', color: 'var(--text-tertiary)',
                padding: '0 4px', marginBottom: 8,
              }}
            >
              Categories
            </p>

            {/* All */}
            <SidebarBtn
              active={activeCategory === 'All'}
              onClick={() => setActiveCategory('All')}
              icon={<List size={15} color={activeCategory === 'All' ? 'var(--brand)' : 'var(--text-secondary)'} />}
              label="All ordinances"
              count={ordinances.length}
            />

            {categoryStats.map((cat) => (
              <SidebarBtn
                key={cat.label}
                active={activeCategory === cat.label}
                onClick={() => setActiveCategory(cat.label as OrdinanceCategory)}
                icon={
                  <span style={{ color: activeCategory === cat.label ? 'var(--brand)' : 'var(--text-secondary)', display: 'flex' }}>
                    {categoryIcons[cat.label]}
                  </span>
                }
                label={cat.label}
                count={cat.count}
              />
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
                fontSize: 10, fontWeight: 600, letterSpacing: '1.2px',
                textTransform: 'uppercase', color: 'var(--text-tertiary)',
                padding: '0 4px', marginBottom: 8,
              }}
            >
              Status
            </p>
            {(['all', 'active', 'amended', 'repealed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '7px 8px',
                  background: activeStatus === s ? 'var(--bg)' : 'none',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                  color: activeStatus === s ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeStatus === s ? 500 : 400,
                  marginBottom: 2, transition: 'background 0.12s',
                }}
              >
                <span
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: statusDotColor[s], flexShrink: 0,
                  }}
                />
                {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Year filter */}
          <div
            style={{
              background: 'var(--surface)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1rem',
            }}
          >
            <p
              style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '1.2px',
                textTransform: 'uppercase', color: 'var(--text-tertiary)',
                padding: '0 4px', marginBottom: 8,
              }}
            >
              Year enacted
            </p>

            {/* All years */}
            <button
              onClick={() => setActiveYear('all')}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '7px 8px',
                background: activeYear === 'all' ? 'var(--brand-light)' : 'none',
                border: 'none', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                color: activeYear === 'all' ? 'var(--brand)' : 'var(--text-secondary)',
                fontWeight: activeYear === 'all' ? 500 : 400,
                marginBottom: 2, transition: 'background 0.12s',
              }}
            >
              <Calendar size={14} color={activeYear === 'all' ? 'var(--brand)' : 'var(--text-secondary)'} />
              All years
            </button>

            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveYear(yr)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '7px 8px',
                  background: activeYear === yr ? 'var(--brand-light)' : 'none',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                  color: activeYear === yr ? 'var(--brand)' : 'var(--text-secondary)',
                  fontWeight: activeYear === yr ? 500 : 400,
                  marginBottom: 2, transition: 'background 0.12s',
                }}
              >
                <Calendar size={14} color={activeYear === yr ? 'var(--brand)' : 'var(--text-secondary)'} />
                {yr}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div>
          {/* Search + sort bar */}
          <div
            style={{
              display: 'flex', gap: 10, marginBottom: '1rem',
              alignItems: 'center', flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                flex: 1, minWidth: 200,
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)',
                border: '0.5px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)', padding: '8px 14px',
              }}
            >
              <Search size={16} color="var(--text-tertiary)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ordinances…"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: 'inherit', fontSize: 14,
                  color: 'var(--text-primary)', background: 'transparent',
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
                fontFamily: 'inherit', fontSize: 13,
                color: 'var(--text-secondary)',
                background: 'var(--surface)',
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A–Z title</option>
            </select>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', gap: 7, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                <SlidersHorizontal size={12} style={{ verticalAlign: -2 }} /> Active filters:
              </span>
              {activeCategory !== 'All' && (
                <FilterChip label={activeCategory} onRemove={() => setActiveCategory('All')} variant="brand" />
              )}
              {activeStatus !== 'all' && (
                <FilterChip label={activeStatus} onRemove={() => setActiveStatus('all')} />
              )}
              {activeYear !== 'all' && (
                <FilterChip label={activeYear} onRemove={() => setActiveYear('all')} />
              )}
              {query && (
                <FilterChip label={`"${query}"`} onRemove={() => setQuery('')} />
              )}
              <button
                onClick={clearAll}
                style={{
                  fontSize: 11, color: 'var(--text-tertiary)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', padding: '3px 6px',
                  textDecoration: 'underline',
                }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results count + page info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Showing{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
              </strong>{' '}
              of{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong>{' '}
              ordinance{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
            </p>
            {totalPages > 1 && (
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          {/* Ordinance list */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '3rem', textAlign: 'center',
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
                onClick={clearAll}
                style={{
                  marginTop: 16, padding: '8px 20px',
                  background: 'var(--brand)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {paginated.map((o, i) => (
                  <OrdinanceCard
                    key={o.id}
                    ordinance={o}
                    variant="default"
                    animationDelay={i * 0.04}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const SidebarBtn: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}> = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      width: '100%', padding: '7px 8px',
      borderRadius: 'var(--radius-md)', border: 'none',
      background: active ? 'var(--brand-light)' : 'none',
      cursor: 'pointer', fontFamily: 'inherit',
      marginBottom: 2, transition: 'background 0.12s',
    }}
    onMouseEnter={(e) => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)';
    }}
    onMouseLeave={(e) => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'none';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {icon}
      <span
        style={{
          fontSize: 13, textAlign: 'left',
          color: active ? 'var(--brand)' : 'var(--text-secondary)',
          fontWeight: active ? 500 : 400,
        }}
      >
        {label}
      </span>
    </div>
    <span
      style={{
        fontSize: 11, flexShrink: 0,
        background: active ? 'var(--brand-border)' : 'var(--bg)',
        color: active ? 'var(--brand-dark)' : 'var(--text-tertiary)',
        border: `0.5px solid ${active ? 'var(--brand-border)' : 'var(--border)'}`,
        borderRadius: 99, padding: '1px 7px',
      }}
    >
      {count}
    </span>
  </button>
);

const FilterChip: React.FC<{
  label: string;
  onRemove: () => void;
  variant?: 'brand' | 'default';
}> = ({ label, onRemove, variant = 'default' }) => (
  <button
    onClick={onRemove}
    style={{
      display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
      background: variant === 'brand' ? 'var(--brand-light)' : 'var(--bg)',
      color: variant === 'brand' ? 'var(--brand)' : 'var(--text-secondary)',
      border: `0.5px solid ${variant === 'brand' ? 'var(--brand-border)' : 'var(--border)'}`,
      borderRadius: 99, padding: '3px 10px',
      cursor: 'pointer', fontFamily: 'inherit',
    }}
  >
    {label} <X size={11} />
  </button>
);

const Pagination: React.FC<{
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}> = ({ page, totalPages, onPageChange }) => {
  // Build page number array with ellipsis
  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: 'var(--radius-md)',
    fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
    border: '0.5px solid var(--border)', background: 'var(--surface)',
    color: 'var(--text-secondary)', transition: 'all 0.12s',
  };

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, marginTop: '1.5rem', paddingTop: '1.5rem',
        borderTop: '0.5px solid var(--border)',
      }}
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{
          ...btnBase,
          opacity: page === 1 ? 0.4 : 1,
          cursor: page === 1 ? 'default' : 'pointer',
        }}
        title="Previous page"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            style={{ fontSize: 13, color: 'var(--text-tertiary)', padding: '0 4px' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            style={{
              ...btnBase,
              background: page === p ? 'var(--brand)' : 'var(--surface)',
              color: page === p ? '#fff' : 'var(--text-secondary)',
              borderColor: page === p ? 'var(--brand)' : 'var(--border)',
              fontWeight: page === p ? 600 : 400,
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        style={{
          ...btnBase,
          opacity: page === totalPages ? 0.4 : 1,
          cursor: page === totalPages ? 'default' : 'pointer',
        }}
        title="Next page"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
};
