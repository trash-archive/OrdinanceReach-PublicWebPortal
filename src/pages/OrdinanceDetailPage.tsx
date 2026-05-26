import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, User, Building2, Bookmark, Share2,
  Download, Flag, ChevronDown, ChevronUp, Copy, Check,
  FileText, AlertCircle, ExternalLink,
} from 'lucide-react';
import { ordinances } from '../data/ordinances';
import { StatusBadge, CategoryChip, AIPill, Button } from '../components/ui/Badges';
import { OrdinanceCard } from '../components/ordinance/OrdinanceCard';

// Share modal
const ShareModal: React.FC<{ open: boolean; onClose: () => void; title: string }> = ({
  open, onClose, title,
}) => {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,24,20,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeInOverlay 0.18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 440,
          boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.2s ease', overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '0.5px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Share this ordinance
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{title}</p>
        </div>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg)', border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '8px 12px',
            }}
          >
            <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {url}
            </span>
            <button
              onClick={copy}
              style={{
                background: copied ? 'var(--active-bg)' : 'var(--brand)',
                color: copied ? 'var(--active-text)' : '#fff',
                border: 'none', borderRadius: 7, padding: '5px 12px',
                fontSize: 12, fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
                transition: 'background 0.2s',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '9px', background: 'var(--bg)',
              border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)',
              fontFamily: 'inherit', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Report issue modal
const ReportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [selected, setSelected] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const issues = [
    'Inaccurate AI summary',
    'Missing ordinance information',
    'Wrong category or status',
    'Outdated information',
    'Broken document link',
    'Other',
  ];

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,24,20,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeInOverlay 0.18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 440,
          boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.2s ease', overflow: 'hidden',
        }}
      >
        {submitted ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              Report received
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Thank you. Our team will review your report and update the information if needed.
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 20, padding: '9px 24px',
                background: 'var(--brand)', color: '#fff', border: 'none',
                borderRadius: 'var(--radius-md)', fontFamily: 'inherit',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '0.5px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600 }}>
                Report an issue
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                What's wrong with this ordinance entry?
              </p>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {issues.map((issue) => (
                <button
                  key={issue}
                  onClick={() => setSelected(issue)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    background: selected === issue ? 'var(--brand-light)' : 'var(--bg)',
                    border: `0.5px solid ${selected === issue ? 'var(--brand-border)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 13,
                    color: selected === issue ? 'var(--brand)' : 'var(--text-secondary)',
                    textAlign: 'left', transition: 'all 0.12s',
                  }}
                >
                  <div
                    style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${selected === issue ? 'var(--brand)' : 'var(--border-strong)'}`,
                      background: selected === issue ? 'var(--brand)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {selected === issue && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  {issue}
                </button>
              ))}
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', gap: 8 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: '9px', background: 'none',
                  border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => selected && setSubmitted(true)}
                style={{
                  flex: 1, padding: '9px',
                  background: selected ? 'var(--brand)' : 'var(--border)',
                  color: selected ? '#fff' : 'var(--text-tertiary)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                  cursor: selected ? 'pointer' : 'default', transition: 'all 0.14s',
                }}
              >
                Submit report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const OrdinanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fullTextOpen, setFullTextOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const ordinance = ordinances.find((o) => o.id === id);

  if (!ordinance) {
    return (
      <div style={{ maxWidth: 700, margin: '4rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, marginBottom: 12 }}>
          Ordinance not found
        </p>
        <button
          onClick={() => navigate('/ordinances')}
          style={{
            background: 'var(--brand)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-md)', padding: '9px 20px',
            fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
          }}
        >
          Back to ordinances
        </button>
      </div>
    );
  }

  const related = ordinances
    .filter((o) => o.id !== ordinance.id && o.category === ordinance.category)
    .slice(0, 3);

  return (
    <>
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title={ordinance.title} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 2rem 3rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem' }}>
          <button
            onClick={() => navigate('/ordinances')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit',
              padding: '4px 8px', borderRadius: 'var(--radius-sm)',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--border)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'none')}
          >
            <ArrowLeft size={14} /> Back to ordinances
          </button>
          <span style={{ color: 'var(--border-strong)' }}>/</span>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            Ordinance No. {ordinance.number}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          {/* ── Main column ─────────────────────────────────────────── */}
          <div>
            {/* Header card */}
            <div
              className="animate-fade-in"
              style={{
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                marginBottom: '1rem',
              }}
            >
              {/* Tags */}
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
                <StatusBadge status={ordinance.status} />
                <CategoryChip label={ordinance.category} size="md" />
                <span
                  style={{
                    fontSize: 11, color: 'var(--text-tertiary)',
                    background: 'var(--bg)', border: '0.5px solid var(--border)',
                    borderRadius: 99, padding: '2px 9px',
                  }}
                >
                  No. {ordinance.number}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                }}
              >
                {ordinance.title}
              </h1>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {[
                  { icon: <Calendar size={13} />, label: `Enacted ${ordinance.dateEnacted}` },
                  { icon: <User size={13} />, label: `Authored by ${ordinance.author}` },
                  ...(ordinance.dateAmended
                    ? [{ icon: <AlertCircle size={13} />, label: `Amended ${ordinance.dateAmended}` }]
                    : []),
                ].map((m) => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}>{m.icon}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  size="md"
                  icon={<Download size={14} />}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  icon={saved ? <Check size={14} /> : <Bookmark size={14} />}
                  onClick={() => setSaved((s) => !s)}
                  style={saved ? { color: 'var(--brand)', borderColor: 'var(--brand-border)', background: 'var(--brand-light)' } : {}}
                >
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  icon={<Share2 size={14} />}
                  onClick={() => setShareOpen(true)}
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  icon={<Flag size={14} />}
                  onClick={() => setReportOpen(true)}
                >
                  Report issue
                </Button>
              </div>
            </div>

            {/* AI Summary */}
            <div
              className="animate-fade-in stagger-1"
              style={{
                background: 'var(--brand-light)',
                border: '0.5px solid var(--brand-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem 1.75rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <AIPill />
                <span style={{ fontSize: 12, color: 'var(--brand-dark)', opacity: 0.7 }}>
                  Generated from ordinance text · For reference only
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--brand-dark)',
                  lineHeight: 1.75,
                  fontWeight: 400,
                }}
              >
                {ordinance.aiSummary}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--brand-dark)',
                  opacity: 0.6,
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '0.5px solid var(--brand-border)',
                }}
              >
                ⓘ This AI summary is for informational purposes only. Always refer to the full ordinance text for official legal reference.
              </p>
            </div>

            {/* Affected sectors */}
            <div
              className="animate-fade-in stagger-2"
              style={{
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem 1.75rem',
                marginBottom: '1rem',
              }}
            >
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 12,
                }}
              >
                Who is affected
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {ordinance.affectedSectors.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 13,
                      padding: '5px 12px',
                      borderRadius: 99,
                      background: 'var(--surface-raised)',
                      border: '0.5px solid var(--border)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Amendment history */}
            {ordinance.amendments && ordinance.amendments.length > 0 && (
              <div
                className="animate-fade-in stagger-3"
                style={{
                  background: 'var(--amended-bg)',
                  border: '0.5px solid var(--amended-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem 1.75rem',
                  marginBottom: '1rem',
                }}
              >
                <h2
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    color: 'var(--amended-text)',
                    marginBottom: 12,
                  }}
                >
                  Amendment history
                </h2>
                {ordinance.amendments.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      paddingBottom: i < ordinance.amendments!.length - 1 ? 12 : 0,
                      marginBottom: i < ordinance.amendments!.length - 1 ? 12 : 0,
                      borderBottom: i < ordinance.amendments!.length - 1 ? `0.5px solid var(--amended-border)` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'var(--amended-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={14} color="#fff" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--amended-text)', marginBottom: 3 }}>
                        {a.date}{a.ordinanceRef && ` · Ref: Ord. No. ${a.ordinanceRef}`}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {a.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Full ordinance text */}
            <div
              className="animate-fade-in stagger-4"
              style={{
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                marginBottom: '1rem',
              }}
            >
              <button
                onClick={() => setFullTextOpen((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  borderBottom: fullTextOpen ? '0.5px solid var(--border)' : 'none',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={16} color="var(--text-secondary)" />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                      Full ordinance text
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                      Official legislative language
                    </p>
                  </div>
                </div>
                {fullTextOpen ? (
                  <ChevronUp size={18} color="var(--text-tertiary)" />
                ) : (
                  <ChevronDown size={18} color="var(--text-tertiary)" />
                )}
              </button>

              {fullTextOpen && (
                <div
                  style={{
                    padding: '1.5rem 1.75rem',
                    animation: 'fadeIn 0.2s ease',
                  }}
                >
                  <pre
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 13,
                      lineHeight: 1.8,
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {ordinance.fullText}
                  </pre>
                  <div
                    style={{
                      marginTop: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '0.5px solid var(--border)',
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <Button variant="outline" size="sm" icon={<Download size={13} />}>
                      Download full PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<ExternalLink size={13} />}
                    >
                      View on official site
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar column ──────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Responsible offices */}
            <div
              className="animate-fade-in stagger-1"
              style={{
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
              }}
            >
              <h2
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 12,
                }}
              >
                Responsible offices
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ordinance.responsibleOffices.map((o) => (
                  <div
                    key={o.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      background: 'var(--bg)',
                      border: '0.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        background: 'var(--brand-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Building2 size={13} color="var(--brand)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {o.acronym}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.3 }}>
                        {o.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div
              className="animate-fade-in stagger-2"
              style={{
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
              }}
            >
              <h2
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 12,
                }}
              >
                Quick facts
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Status', value: ordinance.status.charAt(0).toUpperCase() + ordinance.status.slice(1) },
                  { label: 'Ordinance No.', value: ordinance.number },
                  { label: 'Category', value: ordinance.category },
                  { label: 'Date enacted', value: ordinance.dateEnacted },
                  { label: 'Author', value: ordinance.author },
                  ...(ordinance.dateAmended ? [{ label: 'Last amended', value: ordinance.dateAmended }] : []),
                ].map((fact) => (
                  <div
                    key={fact.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 8,
                      paddingBottom: 8,
                      borderBottom: '0.5px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}>
                      {fact.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                        textAlign: 'right',
                      }}
                    >
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div
              className="animate-fade-in stagger-3"
              style={{
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
              }}
            >
              <h2
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 10,
                }}
              >
                Keywords
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ordinance.keywords.map((k) => (
                  <span
                    key={k}
                    style={{
                      fontSize: 11,
                      padding: '3px 9px',
                      borderRadius: 99,
                      background: 'var(--bg)',
                      border: '0.5px solid var(--border)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related ordinances */}
        {related.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}
            >
              Related ordinances
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Other {ordinance.category} ordinances you may find relevant
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {related.map((o, i) => (
                <OrdinanceCard key={o.id} ordinance={o} variant="default" animationDelay={i * 0.07} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
