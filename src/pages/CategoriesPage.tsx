import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Car, Leaf, Building2, Shield,
  GraduationCap, Home, Users, ChevronRight, ArrowRight,
} from 'lucide-react';
import { ordinances, categoryStats } from '../data/ordinances';
import { OrdinanceCard } from '../components/ordinance/OrdinanceCard';
import type { OrdinanceCategory } from '../types';

// ── Category config ────────────────────────────────────────────────────────────
interface CategoryConfig {
  label: OrdinanceCategory;
  icon: React.ReactNode;
  description: string;
  color: { bg: string; text: string; border: string; accent: string };
  highlights: string[];
}

const categories: CategoryConfig[] = [
  {
    label: 'Health & Sanitation',
    icon: <Heart size={22} />,
    description:
      'Ordinances governing public health standards, waste disposal, sanitation requirements in markets and establishments, and disease prevention measures across Cebu City.',
    color: { bg: '#FFF1F2', text: '#9F1239', border: '#FECDD3', accent: '#F43F5E' },
    highlights: ['Market sanitation', 'Food safety', 'Solid waste management', 'Pest control'],
  },
  {
    label: 'Traffic & Transport',
    icon: <Car size={22} />,
    description:
      'Rules regulating vehicle movement, parking, public utility vehicles, ride-hailing services, and traffic flow management along Cebu City\'s road network.',
    color: { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE', accent: '#3B82F6' },
    highlights: ['No-parking zones', 'TNVS regulation', 'PUV routes', 'Peak hour rules'],
  },
  {
    label: 'Environment',
    icon: <Leaf size={22} />,
    description:
      'Policies protecting Cebu City\'s natural environment, including plastic bans, air quality standards, coastal zone management, and climate resilience measures.',
    color: { bg: '#F0FDF4', text: '#14532D', border: '#BBF7D0', accent: '#22C55E' },
    highlights: ['Plastic bag ban', 'Tree planting', 'Coastal protection', 'Air quality'],
  },
  {
    label: 'Business & Permits',
    icon: <Building2 size={22} />,
    description:
      'Requirements and procedures for obtaining and renewing business permits, licenses for food establishments, zoning compliance, and commercial operating regulations.',
    color: { bg: '#FFFBEB', text: '#78350F', border: '#FDE68A', accent: '#F59E0B' },
    highlights: ['Permit renewal', 'Food establishments', 'Zoning rules', 'Market stalls'],
  },
  {
    label: 'Public Safety',
    icon: <Shield size={22} />,
    description:
      'Ordinances ensuring the safety of Cebu City residents, including curfew rules, safe spaces programs, fire safety standards, and community security measures.',
    color: { bg: '#FFF7ED', text: '#7C2D12', border: '#FDBA74', accent: '#F97316' },
    highlights: ['Minor curfew', 'Safe spaces', 'Fire safety', 'Anti-VAWC'],
  },
  {
    label: 'Education & Youth',
    icon: <GraduationCap size={22} />,
    description:
      'Policies supporting Cebu City\'s students and youth, covering school regulations, scholarship programs, out-of-school youth services, and child welfare standards.',
    color: { bg: '#F5F3FF', text: '#4C1D95', border: '#DDD6FE', accent: '#8B5CF6' },
    highlights: ['Scholarship programs', 'School safety', 'Youth development', 'Child welfare'],
  },
  {
    label: 'Housing & Land Use',
    icon: <Home size={22} />,
    description:
      'Regulations on land use, building construction standards, socialized housing programs, informal settler relocation, and urban development planning within the city.',
    color: { bg: '#F0FDFA', text: '#134E4A', border: '#99F6E4', accent: '#14B8A6' },
    highlights: ['Building codes', 'Socialized housing', 'Zoning ordinances', 'Urban planning'],
  },
  {
    label: 'Social Welfare',
    icon: <Users size={22} />,
    description:
      'Programs and mandates supporting vulnerable populations, including senior citizens, persons with disabilities, indigenous peoples, and informal workers\' social protection.',
    color: { bg: '#FDF4FF', text: '#581C87', border: '#E9D5FF', accent: '#A855F7' },
    highlights: ['PhilHealth coverage', 'Senior benefits', 'PWD programs', 'Livelihood'],
  },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<OrdinanceCategory | null>(null);

  const activeCfg = categories.find((c) => c.label === activeCategory);
  const activeOrdinances = activeCategory
    ? ordinances.filter((o) => o.category === activeCategory)
    : [];

  const totalOrdinances = categoryStats.reduce((s, c) => s + c.count, 0);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: 'var(--surface)',
          borderBottom: '0.5px solid var(--border)',
          padding: '2.5rem 2rem 2rem',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '1.8px',
              textTransform: 'uppercase',
              color: 'var(--brand)',
              marginBottom: 10,
            }}
          >
            Cebu City · {totalOrdinances.toLocaleString()} Ordinances
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            Browse by category
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Cebu City ordinances are organized into 8 governance areas. Select a category
            to explore the relevant laws and understand how they affect you.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2rem 3rem' }}>
        {/* Category grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0.875rem',
            marginBottom: activeCategory ? '2.5rem' : 0,
          }}
        >
          {categories.map((cat, i) => {
            const stat = categoryStats.find((s) => s.label === cat.label);
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() =>
                  setActiveCategory(isActive ? null : cat.label)
                }
                className="animate-fade-in"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: '1.25rem',
                  background: isActive ? cat.color.bg : 'var(--surface)',
                  border: `0.5px solid ${isActive ? cat.color.border : 'var(--border)'}`,
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.16s',
                  boxShadow: isActive ? `0 0 0 1px ${cat.color.border}` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = cat.color.border;
                    el.style.background = cat.color.bg;
                    el.style.transform = 'translateY(-1px)';
                    el.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = 'var(--border)';
                    el.style.background = 'var(--surface)';
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: isActive ? cat.color.accent : 'var(--brand-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#fff' : 'var(--brand)',
                      flexShrink: 0,
                      transition: 'all 0.16s',
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 9px',
                      borderRadius: 99,
                      background: isActive ? cat.color.accent : 'var(--bg)',
                      color: isActive ? '#fff' : 'var(--text-tertiary)',
                      border: `0.5px solid ${isActive ? 'transparent' : 'var(--border)'}`,
                      transition: 'all 0.16s',
                    }}
                  >
                    {stat?.count ?? 0}
                  </span>
                </div>

                {/* Title + description */}
                <div>
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isActive ? cat.color.text : 'var(--text-primary)',
                      marginBottom: 5,
                      fontFamily: 'Playfair Display, serif',
                      transition: 'color 0.16s',
                    }}
                  >
                    {cat.label}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: isActive ? cat.color.text : 'var(--text-secondary)',
                      lineHeight: 1.6,
                      opacity: isActive ? 0.85 : 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      transition: 'color 0.16s',
                    }}
                  >
                    {cat.description}
                  </p>
                </div>

                {/* Highlights */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {cat.highlights.map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 99,
                        background: isActive
                          ? `rgba(255,255,255,0.6)`
                          : 'var(--bg)',
                        border: `0.5px solid ${isActive ? cat.color.border : 'var(--border)'}`,
                        color: isActive ? cat.color.text : 'var(--text-tertiary)',
                        transition: 'all 0.16s',
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 4,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: isActive ? cat.color.text : 'var(--brand)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      transition: 'color 0.16s',
                    }}
                  >
                    {isActive ? 'Showing ordinances' : 'Browse ordinances'}
                    <ChevronRight
                      size={12}
                      style={{
                        transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.16s',
                      }}
                    />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded ordinances panel */}
        {activeCategory && activeCfg && (
          <div
            style={{
              background: activeCfg.color.bg,
              border: `0.5px solid ${activeCfg.color.border}`,
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: `0.5px solid ${activeCfg.color.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: activeCfg.color.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {activeCfg.icon}
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 17,
                      fontWeight: 600,
                      color: activeCfg.color.text,
                    }}
                  >
                    {activeCategory}
                  </h2>
                  <p style={{ fontSize: 12, color: activeCfg.color.text, opacity: 0.7 }}>
                    {activeOrdinances.length} ordinance{activeOrdinances.length !== 1 ? 's' : ''} in database sample
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  navigate(`/ordinances?category=${encodeURIComponent(activeCategory)}`)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: activeCfg.color.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '7px 16px',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                View all {categoryStats.find((s) => s.label === activeCategory)?.count} ordinances
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Ordinance list */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeOrdinances.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: activeCfg.color.text, opacity: 0.7 }}>
                    No sample ordinances in this category yet.
                  </p>
                  <p style={{ fontSize: 12, color: activeCfg.color.text, opacity: 0.5, marginTop: 4 }}>
                    The full database is being populated progressively.
                  </p>
                </div>
              ) : (
                activeOrdinances.map((o, i) => (
                  <OrdinanceCard
                    key={o.id}
                    ordinance={o}
                    variant="default"
                    animationDelay={i * 0.06}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Info note */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.25rem 1.5rem',
            background: 'var(--surface)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ</span>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 3,
              }}
            >
              Category counts represent the full ordinance database
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The numbers shown per category reflect the complete Cebu City ordinance archive. The
              ordinances displayed when you expand a category are a curated sample from the OrdinanceFlow
              database, which is being progressively digitized. Browse the full list in the{' '}
              <button
                onClick={() => navigate('/ordinances')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  fontWeight: 500,
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Ordinance database
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};