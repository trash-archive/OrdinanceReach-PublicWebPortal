import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Heart, Car, Leaf, Building2,
  Shield, GraduationCap, Home, Users, TrendingUp, BookOpen, ChevronRight,
  FileText, Bell, Bot,
} from 'lucide-react';
import { ordinances, categoryStats } from '../data/ordinances';
import { OrdinanceCard } from '../components/ordinance/OrdinanceCard';
import { SearchModal } from '../components/ui/SearchModal';

const categoryIcons: Record<string, React.ReactNode> = {
  'Health & Sanitation': <Heart size={18} />,
  'Traffic & Transport': <Car size={18} />,
  'Environment': <Leaf size={18} />,
  'Business & Permits': <Building2 size={18} />,
  'Public Safety': <Shield size={18} />,
  'Education & Youth': <GraduationCap size={18} />,
  'Housing & Land Use': <Home size={18} />,
  'Social Welfare': <Users size={18} />,
};

const stats = [
  { value: '1,204', label: 'Total ordinances', icon: <BookOpen size={16} /> },
  { value: '847', label: 'Currently active', icon: <TrendingUp size={16} /> },
  { value: '38', label: 'Passed this year', icon: <ArrowRight size={16} /> },
  { value: '80', label: 'Barangays covered', icon: <Home size={16} /> },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/ordinances?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/ordinances');
    }
  };

  const featured = ordinances.slice(0, 3);
  const recent = ordinances.slice(0, 5);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--surface)',
          borderBottom: '0.5px solid var(--border)',
          padding: '3.5rem 2rem 3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background pattern */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 80% 50%, rgba(24,95,165,0.06) 0%, transparent 55%), ' +
              'radial-gradient(circle at 10% 80%, rgba(24,95,165,0.04) 0%, transparent 45%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ maxWidth: 660 }}>
            <p
              className="animate-fade-in"
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                color: 'var(--brand)',
                marginBottom: 14,
              }}
            >
              Cebu City · Legislative Transparency Portal
            </p>
            <h1
              className="animate-fade-in stagger-1"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: 14,
                letterSpacing: '-0.5px',
              }}
            >
              Find and understand
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--brand)' }}>Cebu City ordinances.</em>
            </h1>
            <p
              className="animate-fade-in stagger-2"
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '1.75rem',
                maxWidth: 520,
              }}
            >
              Search the complete database of city ordinances, read plain-language
              AI summaries, and stay informed about the laws that govern your community.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="animate-fade-in stagger-3"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                padding: '6px 6px 6px 16px',
                gap: 10,
                maxWidth: 540,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Search size={17} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search by keyword, topic, or ordinance number…"
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
              <button
                type="submit"
                style={{
                  background: 'var(--brand)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px 20px',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div
              className="animate-fade-in stagger-4"
              style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}
            >
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Popular:</span>
              {['Plastic bag ban', 'No-parking zones', 'Business permits', 'Curfew'].map((t) => (
                <button
                  key={t}
                  onClick={() => navigate(`/ordinances?q=${encodeURIComponent(t)}`)}
                  style={{
                    fontSize: 12,
                    color: 'var(--brand)',
                    background: 'var(--brand-light)',
                    border: '0.5px solid var(--brand-border)',
                    borderRadius: 99,
                    padding: '3px 10px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.12s',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--brand)', padding: '1.25rem 2rem' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.07}s`, textAlign: 'center' }}
            >
              <div
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Featured ordinances */}
        <div style={{ marginBottom: '3rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 2,
                }}
              >
                Featured ordinances
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Recently passed laws affecting Cebu City residents
              </p>
            </div>
            <button
              onClick={() => navigate('/ordinances')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13,
                color: 'var(--brand)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {featured.map((o, i) => (
              <OrdinanceCard key={o.id} ordinance={o} variant="featured" animationDelay={i * 0.08} />
            ))}
          </div>
        </div>

        {/* Two-column: categories + recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          {/* Browse by category */}
          <div>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}
            >
              Browse by category
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Find ordinances by the area of governance they cover
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
              }}
            >
              {categoryStats.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => navigate(`/ordinances?category=${encodeURIComponent(cat.label)}`)}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'var(--surface)',
                    border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.14s, box-shadow 0.14s, transform 0.14s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.borderColor = 'var(--brand-border)';
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: 'var(--brand-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--brand)',
                        flexShrink: 0,
                      }}
                    >
                      {categoryIcons[cat.label]}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {cat.label}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                        {cat.count} ordinances
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-tertiary)" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent additions */}
          <div>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}
            >
              Recent additions
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Latest ordinances uploaded to the database
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recent.map((o, i) => (
                <OrdinanceCard
                  key={o.id}
                  ordinance={o}
                  variant="compact"
                  animationDelay={i * 0.06}
                />
              ))}
              <button
                onClick={() => navigate('/ordinances')}
                style={{
                  marginTop: 4,
                  width: '100%',
                  padding: '10px',
                  background: 'none',
                  border: '0.5px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                Browse all ordinances <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div
          className="animate-fade-in"
          style={{
            marginTop: '3rem',
            background: 'var(--brand-light)',
            border: '0.5px solid var(--brand-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 22 }}>✦</span>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--brand-dark)', marginBottom: 3 }}>
              AI-powered plain-language summaries
            </p>
            <p style={{ fontSize: 12, color: 'var(--brand-dark)', lineHeight: 1.6, opacity: 0.85 }}>
              Every ordinance on this portal includes an AI-generated summary that translates legal language
              into plain English. These are provided for informational purposes — always consult the full
              ordinance text for official reference.
            </p>
          </div>
          <button
            onClick={() => navigate('/ordinances')}
            style={{
              background: 'var(--brand)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '9px 20px',
              fontFamily: 'inherit',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Explore ordinances
          </button>
        </div>

        {/* ── How it works ──────────────────────────────────────────── */}
        <div style={{ marginTop: '3.5rem' }}>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: '1.25rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 22, fontWeight: 600,
                  color: 'var(--text-primary)', marginBottom: 2,
                }}
              >
                How it works
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                The journey of a Cebu City ordinance from the Council chamber to your screen.
              </p>
            </div>
            <button
              onClick={() => navigate('/about')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 13, color: 'var(--brand)',
                background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
              }}
            >
              Learn more <ChevronRight size={14} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              {
                number: '01',
                icon: <FileText size={18} />,
                title: 'Ordinance is enacted',
                description:
                  'The Sangguniang Panlungsod passes an ordinance. It becomes effective after the required 15-day publication period.',
              },
              {
                number: '02',
                icon: <Bell size={18} />,
                title: 'Offices are notified',
                description:
                  'Implementing offices receive multi-channel notifications with the ordinance details and compliance deadlines.',
              },
              {
                number: '03',
                icon: <Search size={18} />,
                title: 'Published on the portal',
                description:
                  'The ordinance is added here with an AI-generated plain-language summary and becomes immediately searchable.',
              },
              {
                number: '04',
                icon: <Bot size={18} />,
                title: 'Citizens can ask questions',
                description:
                  'Residents can search, browse, and ask the AI assistant questions about any ordinance in plain language.',
              },
            ].map((step, i) => (
              <div
                key={step.number}
                className="animate-fade-in"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  background: 'var(--surface)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Large background number */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: -10, right: -6,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 68, fontWeight: 700,
                    color: 'var(--border)', lineHeight: 1,
                    userSelect: 'none', pointerEvents: 'none',
                  }}
                >
                  {step.number}
                </div>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--brand-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--brand)', marginBottom: 12,
                  }}
                >
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontSize: 13, fontWeight: 600,
                    color: 'var(--text-primary)', marginBottom: 6,
                    fontFamily: 'Playfair Display, serif',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
