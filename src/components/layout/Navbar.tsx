import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, Search } from 'lucide-react';

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
    }}
  >
    {label}
  </button>
);

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Ordinances', to: '/ordinances' },
    { label: 'Barangays', to: '/barangays' },
    { label: 'About', to: '/about' },
    { label: 'Help & FAQ', to: '/help' },
  ];

  return (
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
        <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
          Ordinance<span style={{ color: 'var(--brand)' }}>Flow</span>{' '}
          <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>Cebu</span>
        </span>
      </button>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, alignItems: 'center' }}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            label={l.label}
            to={l.to}
            active={location.pathname.startsWith(l.to)}
            onClick={() => navigate(l.to)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
        <button
          onClick={() => navigate('/ordinances')}
          style={{
            background: 'none', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)',
            padding: '6px 10px', cursor: 'pointer', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center',
          }}
          title="Search"
        >
          <Search size={15} />
        </button>
        <button
          onClick={() => navigate('/ordinances')}
          style={{
            fontSize: 12, fontFamily: 'inherit', fontWeight: 500, padding: '6px 14px',
            borderRadius: 'var(--radius-md)', background: 'none',
            border: '0.5px solid var(--border-strong)', color: 'var(--text-secondary)', cursor: 'pointer',
          }}
        >
          Report issue
        </button>
        <button
          style={{
            fontSize: 12, fontFamily: 'inherit', fontWeight: 500, padding: '6px 14px',
            borderRadius: 'var(--radius-md)', background: 'var(--brand)',
            border: 'none', color: '#fff', cursor: 'pointer',
          }}
        >
          For officials ↗
        </button>
      </div>
    </nav>
  );
};
