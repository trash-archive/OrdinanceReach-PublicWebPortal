import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
        padding: '2.5rem 2rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Top row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr repeat(3, auto)',
            gap: '2rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Brand */}
          <div>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: 'var(--brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Scale size={14} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'var(--text-primary)',
                }}
              >
                Ordinance<span style={{ color: 'var(--brand)' }}>Flow</span>{' '}
                <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>Cebu</span>
              </span>
            </button>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-tertiary)',
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              A public legislative transparency portal for Cebu City. Making city
              ordinances accessible and understandable for every resident.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: 10,
              }}
            >
              Explore
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { label: 'All Ordinances', to: '/ordinances' },
                { label: 'Barangay Finder', to: '/barangays' },
                { label: 'Browse by Category', to: '/ordinances' },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={() => navigate(l.to)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                    padding: 0,
                    transition: 'color 0.12s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = 'var(--brand)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)')
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: 10,
              }}
            >
              Resources
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { label: 'Cebu City Official Website', href: 'https://www.cebucity.gov.ph' },
                { label: 'Sangguniang Panlungsod', href: 'https://www.cebucity.gov.ph' },
                { label: 'Open Data Portal', href: 'https://www.cebucity.gov.ph' },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.12s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--brand)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)')
                  }
                >
                  {l.label}
                  <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: 10,
              }}
            >
              Legal
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {['Privacy Policy', 'Terms of Use', 'Disclaimer'].map((l) => (
                <button
                  key={l}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                    padding: 0,
                    transition: 'color 0.12s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = 'var(--brand)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)')
                  }
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              © 2026 OrdinanceFlow Cebu · Built for the Cebu Solutionsfest 2026
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              AI summaries are for informational purposes only. Always refer to official ordinance text.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
