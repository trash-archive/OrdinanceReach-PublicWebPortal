import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, Search, X, Menu } from 'lucide-react';
import { SearchModal } from '../ui/SearchModal';

const NavLink: React.FC<{
  label: string;
  to: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: active ? 500 : 400,
      color: active ? 'var(--brand)' : 'var(--text-secondary)',
      cursor: 'pointer',
      padding: '4px 2px',
      borderBottom: active ? '1.5px solid var(--brand)' : '1.5px solid transparent',
      transition: 'color 0.14s, border-color 0.14s',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={(e) => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
    }}
    onMouseLeave={(e) => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
    }}
  >
    {label}
  </button>
);

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { label: 'Ordinances', to: '/ordinances' },
    { label: 'Categories', to: '/categories' },
    { label: 'Barangays', to: '/barangays' },
    { label: 'About', to: '/about' },
  ];

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 'var(--nav-h)',
          background: 'var(--surface)',
          borderBottom: '0.5px solid var(--border)',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
          transition: 'box-shadow 0.2s',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          gap: '2rem',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: 8, background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Scale size={16} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: 'Playfair Display, serif', fontWeight: 600,
              fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.2px',
            }}
          >
            Ordinance<span style={{ color: 'var(--brand)' }}>Flow</span>{' '}
            <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>Cebu</span>
          </span>
        </button>

        {/* Desktop nav links */}
        <div
          style={{
            display: 'flex', gap: '1.5rem', flex: 1, alignItems: 'center',
          }}
          className="nav-links-desktop"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              label={l.label}
              to={l.to}
              active={isActive(l.to)}
              onClick={() => navigate(l.to)}
            />
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
          {/* Search button — opens SearchModal */}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              background: 'none', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)',
              padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', transition: 'border-color 0.14s',
            }}
            title="Search ordinances"
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)')}
          >
            <Search size={15} />
          </button>

          {/* Help & FAQ */}
          <button
            onClick={() => navigate('/about')}
            style={{
              fontSize: 12, fontFamily: 'inherit', fontWeight: 500, padding: '6px 14px',
              borderRadius: 'var(--radius-md)', background: 'none',
              border: '0.5px solid var(--border-strong)', color: 'var(--text-secondary)', cursor: 'pointer',
              transition: 'border-color 0.14s, color 0.14s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'var(--brand-border)';
              el.style.color = 'var(--brand)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = 'var(--border-strong)';
              el.style.color = 'var(--text-secondary)';
            }}
          >
            Help & FAQ
          </button>

          {/* For officials CTA */}
          <button
            style={{
              fontSize: 12, fontFamily: 'inherit', fontWeight: 500, padding: '6px 14px',
              borderRadius: 'var(--radius-md)', background: 'var(--brand)',
              border: 'none', color: '#fff', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            For officials ↗
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="nav-mobile-toggle"
            style={{
              display: 'none', // shown via CSS media query
              background: 'none', border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '6px 8px',
              cursor: 'pointer', color: 'var(--text-secondary)', alignItems: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0,
            background: 'var(--surface)', borderBottom: '0.5px solid var(--border)',
            zIndex: 99, padding: '0.75rem 2rem 1rem',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => navigate(l.to)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 0', background: 'none', border: 'none',
                fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
                color: isActive(l.to) ? 'var(--brand)' : 'var(--text-secondary)',
                fontWeight: isActive(l.to) ? 500 : 400,
                borderBottom: '0.5px solid var(--border)',
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/about')}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '10px 0', background: 'none', border: 'none',
              fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            Help & FAQ
          </button>
        </div>
      )}
    </>
  );
};
