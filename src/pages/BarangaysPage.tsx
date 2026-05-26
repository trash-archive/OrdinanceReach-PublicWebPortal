import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Users, FileText, ChevronRight,
  X, ArrowLeft, Building2, Heart, Car, Leaf, Shield,
} from 'lucide-react';
import { ordinances } from '../data/ordinances';
import { StatusBadge, CategoryChip } from '../components/ui/Badges';

// ── Barangay data ─────────────────────────────────────────────────────────────
interface Barangay {
  id: string;
  name: string;
  district: number;
  population: number;
  area: string;
  captain: string;
  tags: string[];
  relevantCategories: string[];
}

const barangays: Barangay[] = [
  { id: 'apas', name: 'Apas', district: 2, population: 38420, area: '2.1 km²', captain: 'Hon. R. Tudtud', tags: ['Residential', 'Commercial'], relevantCategories: ['Traffic & Transport', 'Business & Permits'] },
  { id: 'banilad', name: 'Banilad', district: 2, population: 22100, area: '1.8 km²', captain: 'Hon. M. Osmeña', tags: ['Residential', 'Schools'], relevantCategories: ['Education & Youth', 'Public Safety'] },
  { id: 'carbon', name: 'Carbon', district: 1, population: 15600, area: '0.6 km²', captain: 'Hon. T. Bacalso', tags: ['Market', 'Commercial'], relevantCategories: ['Health & Sanitation', 'Business & Permits'] },
  { id: 'guadalupe', name: 'Guadalupe', district: 3, population: 31900, area: '3.2 km²', captain: 'Hon. L. Lim', tags: ['Residential', 'Mixed-use'], relevantCategories: ['Housing & Land Use', 'Social Welfare'] },
  { id: 'lahug', name: 'Lahug', district: 2, population: 44200, area: '3.7 km²', captain: 'Hon. A. Fernandez', tags: ['IT Park', 'Commercial', 'Residential'], relevantCategories: ['Business & Permits', 'Traffic & Transport'] },
  { id: 'mabolo', name: 'Mabolo', district: 2, population: 27500, area: '2.3 km²', captain: 'Hon. R. Garcia', tags: ['Residential', 'Commercial'], relevantCategories: ['Environment', 'Public Safety'] },
  { id: 'pari-an', name: 'Pari-an', district: 1, population: 9800, area: '0.4 km²', captain: 'Hon. C. Ybañez', tags: ['Heritage', 'Residential'], relevantCategories: ['Housing & Land Use', 'Health & Sanitation'] },
  { id: 'pasil', name: 'Pasil', district: 1, population: 18400, area: '1.1 km²', captain: 'Hon. E. Pepito', tags: ['Fishing', 'Market'], relevantCategories: ['Health & Sanitation', 'Environment'] },
  { id: 'sambag-1', name: 'Sambag I', district: 1, population: 21300, area: '1.2 km²', captain: 'Hon. J. Flores', tags: ['Residential'], relevantCategories: ['Social Welfare', 'Public Safety'] },
  { id: 'sambag-2', name: 'Sambag II', district: 1, population: 19700, area: '1.0 km²', captain: 'Hon. P. Santos', tags: ['Residential', 'Schools'], relevantCategories: ['Education & Youth', 'Social Welfare'] },
  { id: 'san-nicolas', name: 'San Nicolas', district: 1, population: 12800, area: '0.7 km²', captain: 'Hon. B. Madrona', tags: ['Heritage', 'Commercial'], relevantCategories: ['Business & Permits', 'Health & Sanitation'] },
  { id: 'sinsin', name: 'Sinsin', district: 3, population: 8200, area: '0.5 km²', captain: 'Hon. V. Reyes', tags: ['Residential'], relevantCategories: ['Housing & Land Use', 'Public Safety'] },
  { id: 't-padilla', name: 'T. Padilla', district: 4, population: 34600, area: '2.8 km²', captain: 'Hon. M. Cabrera', tags: ['Industrial', 'Residential'], relevantCategories: ['Environment', 'Traffic & Transport'] },
  { id: 'talamban', name: 'Talamban', district: 2, population: 52100, area: '9.6 km²', captain: 'Hon. D. Cuenco Jr.', tags: ['University', 'Residential', 'Commercial'], relevantCategories: ['Education & Youth', 'Traffic & Transport'] },
  { id: 'tisa', name: 'Tisa', district: 4, population: 41800, area: '3.4 km²', captain: 'Hon. A. Alcoseba', tags: ['Residential', 'Commercial'], relevantCategories: ['Housing & Land Use', 'Health & Sanitation'] },
  { id: 'to-ong', name: 'To-ong', district: 4, population: 6400, area: '1.2 km²', captain: 'Hon. R. Ybarra', tags: ['Residential'], relevantCategories: ['Social Welfare', 'Public Safety'] },
];

const districtColors: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: '#E6F1FB', text: '#185FA5', border: '#B5D4F4' },
  2: { bg: '#EAF3DE', text: '#3B6D11', border: '#C2DFAA' },
  3: { bg: '#FAEEDA', text: '#854F0B', border: '#F0C987' },
  4: { bg: '#F3E6FB', text: '#6B2FA5', border: '#C9A4E8' },
};

const categoryIcons: Record<string, React.ReactNode> = {
  'Health & Sanitation': <Heart size={13} />,
  'Traffic & Transport': <Car size={13} />,
  'Environment': <Leaf size={13} />,
  'Business & Permits': <Building2 size={13} />,
  'Public Safety': <Shield size={13} />,
};

// ── Detail drawer ─────────────────────────────────────────────────────────────
const BarangayDrawer: React.FC<{ barangay: Barangay | null; onClose: () => void }> = ({
  barangay, onClose,
}) => {
  const navigate = useNavigate();
  if (!barangay) return null;

  const related = ordinances.filter((o) =>
    barangay.relevantCategories.includes(o.category)
  );

  const dc = districtColors[barangay.district];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,24,20,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'flex-end',
        animation: 'fadeInOverlay 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480, background: 'var(--surface)',
          height: '100%', overflowY: 'auto',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          animation: 'slideFromRight 0.25s ease',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: dc.bg, borderBottom: `0.5px solid ${dc.border}`,
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '1.2px',
                    textTransform: 'uppercase', color: dc.text,
                  }}
                >
                  District {barangay.district}
                </span>
                <span
                  style={{
                    fontSize: 10, background: dc.border, color: dc.text,
                    borderRadius: 99, padding: '2px 8px',
                  }}
                >
                  Barangay
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 26, fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: 4,
                }}
              >
                {barangay.name}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Barangay Captain: {barangay.captain}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.7)', border: '0.5px solid var(--border)',
                borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex',
              }}
            >
              <X size={16} color="var(--text-secondary)" />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.25rem' }}>
            {[
              { label: 'Population', value: barangay.population.toLocaleString() },
              { label: 'Area', value: barangay.area },
              { label: 'District', value: `District ${barangay.district}` },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tags */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>
              Barangay profile
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {barangay.tags.map((t) => (
                <span key={t} style={{ fontSize: 12, padding: '4px 11px', borderRadius: 99, background: 'var(--bg)', border: '0.5px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Relevant categories */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>
              Key governance areas
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {barangay.relevantCategories.map((cat) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '0.5px solid var(--border)' }}>
                  <span style={{ color: 'var(--brand)', display: 'flex' }}>
                    {categoryIcons[cat] ?? <FileText size={13} />}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related ordinances */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>
              Relevant ordinances ({related.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {related.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  onClick={() => { onClose(); navigate(`/ordinances/${o.id}`); }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px',
                    background: 'var(--bg)', border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    fontFamily: 'inherit', textAlign: 'left', transition: 'border-color 0.12s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brand-border)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)')}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 5 }}>
                      {o.title}
                    </p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <StatusBadge status={o.status} />
                      <CategoryChip label={o.category} />
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: 2 }} />
                </button>
              ))}
            </div>

            <button
              onClick={() => { onClose(); navigate(`/ordinances?category=${encodeURIComponent(barangay.relevantCategories[0])}`); }}
              style={{
                marginTop: 10, width: '100%', padding: '9px',
                background: 'none', border: '0.5px dashed var(--border-strong)',
                borderRadius: 'var(--radius-md)', fontSize: 12,
                color: 'var(--text-secondary)', cursor: 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              View all related ordinances <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export const BarangaysPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeDistrict, setActiveDistrict] = useState<number | 'all'>('all');
  const [selected, setSelected] = useState<Barangay | null>(null);

  const filtered = useMemo(() => {
    let list = [...barangays];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.relevantCategories.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (activeDistrict !== 'all') {
      list = list.filter((b) => b.district === activeDistrict);
    }
    return list;
  }, [query, activeDistrict]);

  const grouped = useMemo(() => {
    const map: Record<number, Barangay[]> = { 1: [], 2: [], 3: [], 4: [] };
    filtered.forEach((b) => { if (map[b.district]) map[b.district].push(b); });
    return map;
  }, [filtered]);

  return (
    <>
      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <BarangayDrawer barangay={selected} onClose={() => setSelected(null)} />

      {/* Hero */}
      <section
        style={{
          background: 'var(--surface)',
          borderBottom: '0.5px solid var(--border)',
          padding: '2.5rem 2rem',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '1.8px',
              textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 10,
            }}
          >
            Cebu City · 80 Barangays
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.2,
            }}
          >
            Barangay ordinance finder
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Find your barangay and discover which city ordinances are most relevant to your community.
          </p>

          {/* Search + district filter */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)', padding: '8px 14px',
                flex: '1', maxWidth: 400, boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Search size={16} color="var(--text-tertiary)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search barangay name or topic…"
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: 'inherit', fontSize: 14,
                  color: 'var(--text-primary)', background: 'transparent',
                }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <X size={14} color="var(--text-tertiary)" />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 1, 2, 3, 4] as const).map((d) => {
                const active = activeDistrict === d;
                const dc = d !== 'all' ? districtColors[d] : null;
                return (
                  <button
                    key={d}
                    onClick={() => setActiveDistrict(d)}
                    style={{
                      fontSize: 12, fontFamily: 'inherit', fontWeight: active ? 600 : 400,
                      padding: '7px 14px', borderRadius: 99, cursor: 'pointer',
                      border: `0.5px solid ${active && dc ? dc.border : 'var(--border)'}`,
                      background: active && dc ? dc.bg : active ? 'var(--text-primary)' : 'var(--surface)',
                      color: active && dc ? dc.text : active ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.12s',
                    }}
                  >
                    {d === 'all' ? 'All districts' : `District ${d}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <div style={{ background: 'var(--surface)', borderBottom: '0.5px solid var(--border)' }}>
        <div
          style={{
            maxWidth: 1100, margin: '0 auto', padding: '1rem 2rem',
            display: 'flex', gap: '2rem', flexWrap: 'wrap',
          }}
        >
          {([1, 2, 3, 4] as const).map((d) => {
            const dc = districtColors[d];
            const count = barangays.filter((b) => b.district === d).length;
            return (
              <button
                key={d}
                onClick={() => setActiveDistrict(activeDistrict === d ? 'all' : d)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', padding: '4px 0',
                }}
              >
                <div
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: dc.text, flexShrink: 0,
                  }}
                />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    District {d}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{count} barangays</p>
                </div>
              </button>
            );
          })}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of 80 barangays
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2rem 3rem' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 8 }}>No barangays found</p>
            <button onClick={() => { setQuery(''); setActiveDistrict('all'); }} style={{ padding: '8px 20px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
              Clear filters
            </button>
          </div>
        ) : (
          activeDistrict !== 'all' ? (
            /* Flat grid when district filtered */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <button onClick={() => setActiveDistrict('all')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>
                  <ArrowLeft size={14} /> All districts
                </button>
                <span style={{ color: 'var(--border-strong)' }}>/</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>District {activeDistrict}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {filtered.map((b, i) => (
                  <BarangayCard key={b.id} barangay={b} delay={i * 0.04} onClick={() => setSelected(b)} />
                ))}
              </div>
            </div>
          ) : (
            /* Grouped by district */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {([1, 2, 3, 4] as const).map((d) => {
                const list = grouped[d];
                if (!list || list.length === 0) return null;
                const dc = districtColors[d];
                return (
                  <div key={d}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: dc.text, flexShrink: 0 }} />
                      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                        District {d}
                      </h2>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', background: dc.bg, border: `0.5px solid ${dc.border}`, borderRadius: 99, padding: '2px 9px' }}>
                        {list.length} barangay{list.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                      {list.map((b, i) => (
                        <BarangayCard key={b.id} barangay={b} delay={i * 0.04} onClick={() => setSelected(b)} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Note */}
        <div
          style={{
            marginTop: '2.5rem', padding: '1.25rem 1.5rem',
            background: 'var(--surface)', border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)', display: 'flex', gap: 12, alignItems: 'flex-start',
          }}
        >
          <MapPin size={18} color="var(--brand)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
              Note: This is a representative sample of 16 barangays
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Cebu City has 80 barangays across 4 congressional districts. The full database is being populated
              progressively. Relevant ordinances shown per barangay are based on category tags and proximity to
              affected zones — not official designations.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Barangay card ─────────────────────────────────────────────────────────────
const BarangayCard: React.FC<{
  barangay: Barangay;
  delay: number;
  onClick: () => void;
}> = ({ barangay, delay, onClick }) => {
  const dc = districtColors[barangay.district];
  const relCount = ordinances.filter((o) => barangay.relevantCategories.includes(o.category)).length;

  return (
    <button
      onClick={onClick}
      className="animate-fade-in"
      style={{
        animationDelay: `${delay}s`,
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.125rem',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: 'border-color 0.14s, box-shadow 0.14s, transform 0.14s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = dc.border;
        el.style.boxShadow = 'var(--shadow-sm)';
        el.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.borderColor = 'var(--border)';
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
          {barangay.name}
        </h3>
        <span style={{ fontSize: 10, background: dc.bg, color: dc.text, border: `0.5px solid ${dc.border}`, borderRadius: 99, padding: '2px 7px', flexShrink: 0 }}>
          Dist. {barangay.district}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Users size={12} color="var(--text-tertiary)" />
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {barangay.population.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={12} color="var(--text-tertiary)" />
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{barangay.area}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <FileText size={12} color="var(--text-tertiary)" />
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{relCount} ordinances</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {barangay.tags.map((t) => (
          <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'var(--bg)', border: '0.5px solid var(--border)', color: 'var(--text-secondary)' }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 500 }}>
          View details <ChevronRight size={12} />
        </span>
      </div>
    </button>
  );
};