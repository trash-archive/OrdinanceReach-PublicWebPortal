import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Clock } from 'lucide-react';
import { ordinances } from '../../data/ordinances';
import { StatusBadge } from '../ui/Badges';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const recent = ['solid waste disposal', 'no-parking zones', 'business permit renewal'];

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = query.trim().length > 1
    ? ordinances.filter(
        (o) =>
          o.title.toLowerCase().includes(query.toLowerCase()) ||
          o.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())) ||
          o.number.includes(query) ||
          o.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  const handleSelect = (id: string) => {
    onClose();
    navigate(`/ordinances/${id}`);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(26,24,20,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        animation: 'fadeInOverlay 0.18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: 600,
          margin: '0 1rem',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn 0.2s ease',
          overflow: 'hidden',
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '0.5px solid var(--border)',
          }}
        >
          <Search size={18} color="var(--text-tertiary)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ordinances, topics, or ordinance numbers…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 15,
              color: 'var(--text-primary)',
              background: 'transparent',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}
            >
              <X size={16} color="var(--text-tertiary)" />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg)',
              border: '0.5px solid var(--border)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: 11,
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {query.trim().length < 2 ? (
            <div style={{ padding: '14px 18px' }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 8,
                }}
              >
                Recent searches
              </p>
              {recent.map((r) => (
                <button
                  key={r}
                  onClick={() => setQuery(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '9px 10px',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'none')}
                >
                  <Clock size={13} color="var(--text-tertiary)" />
                  {r}
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                No ordinances found for "<strong>{query}</strong>"
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                Try a different keyword or ordinance number.
              </p>
            </div>
          ) : (
            <div style={{ padding: '8px 10px' }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  padding: '4px 8px 8px',
                }}
              >
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((o) => (
                <button
                  key={o.id}
                  onClick={() => handleSelect(o.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    width: '100%',
                    padding: '10px 10px',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'none')}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'var(--brand-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--brand)' }}>#{o.number}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {o.title}
                    </p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <StatusBadge status={o.status} />
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{o.category}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-tertiary)" style={{ marginTop: 2, flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '0.5px solid var(--border)',
            display: 'flex',
            gap: 16,
          }}
        >
          {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([k, v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd
                style={{
                  fontSize: 10,
                  background: 'var(--bg)',
                  border: '0.5px solid var(--border-strong)',
                  borderRadius: 4,
                  padding: '1px 5px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'inherit',
                }}
              >
                {k}
              </kbd>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{v}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
