import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, Scale, Search, MapPin,
  Bot, Building2, FileText, ArrowRight, Mail, ExternalLink,
} from 'lucide-react';

// ── FAQ ───────────────────────────────────────────────────────────────────────
interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is an ordinance?',
    answer:
      'An ordinance is a local law enacted by the Sangguniang Panlungsod (City Council) of Cebu City. It has the force of law within the city\'s jurisdiction and covers everything from traffic rules and business permits to environmental standards and social welfare programs. Ordinances are distinct from national laws — they apply only within Cebu City and are enforced by city government offices.',
  },
  {
    question: 'How is OrdinanceFlow Cebu different from official government records?',
    answer:
      'OrdinanceFlow Cebu is a transparency and accessibility portal — not an official government repository. We present ordinance data with plain-language AI summaries to make the information more understandable. For official, legally binding references, always consult the Cebu City Council\'s office directly or the official Sangguniang Panlungsod records.',
  },
  {
    question: 'How often is the database updated?',
    answer:
      'We aim to add new ordinances within 30 days of enactment by the Sangguniang Panlungsod. Amendments and status changes (active/amended/repealed) are updated as changes are made official. The current database is a growing sample — not all historical ordinances are yet digitized.',
  },
  {
    question: 'Are the AI-generated summaries legally accurate?',
    answer:
      'The AI summaries are generated for informational purposes to help residents quickly understand the general intent of each ordinance. They are not legal advice and should not be used as a substitute for the full official text. Penalties, deadlines, and requirements described in summaries are approximate — always refer to the full ordinance text for exact legal language.',
  },
  {
    question: 'How do I report non-compliance with an ordinance?',
    answer:
      'To report violations or non-compliance, contact the Responsible Office listed on the relevant ordinance\'s detail page. For general complaints, you may also reach out to your Barangay Hall, the Cebu City Police Office, or the relevant city department (e.g., CENRO for environmental violations, CTOC for traffic violations). This portal does not process compliance reports directly.',
  },
  {
    question: 'Can I download ordinance documents?',
    answer:
      'Full ordinance text is displayed on each ordinance\'s detail page and can be printed. PDF downloads of official documents are available for select ordinances where digitized files have been uploaded. For certified true copies of all ordinances, visit the Cebu City Council Records Office at the Cebu City Hall.',
  },
  {
    question: 'How can I suggest a correction or flag outdated information?',
    answer:
      'Use the "Report Issue" button found on any ordinance detail page. You can flag inaccurate AI summaries, outdated information, wrong category or status, or broken document links. Our team reviews all reports and updates the information as needed.',
  },
  {
    question: 'Is this portal affiliated with the Cebu City Government?',
    answer:
      'OrdinanceFlow Cebu was built for the Cebu Solutionsfest 2026 in response to a problem identified by the Office of the City Councilor. While the system addresses real governance needs, it is an independent project and is not an official Cebu City Government platform. We operate independently with the goal of improving legislative transparency.',
  },
];

// ── How it works steps ────────────────────────────────────────────────────────
const steps = [
  {
    number: '01',
    icon: <FileText size={20} />,
    title: 'Ordinance is enacted',
    description:
      'The Sangguniang Panlungsod passes an ordinance after deliberation. It becomes effective after the required publication period (typically 15 days).',
  },
  {
    number: '02',
    icon: <Building2 size={20} />,
    title: 'Offices are notified',
    description:
      'Implementing offices — like CENRO, CTOC, or CHO — are assigned responsibility and receive notifications with the ordinance details and compliance deadlines.',
  },
  {
    number: '03',
    icon: <Search size={20} />,
    title: 'Published on the portal',
    description:
      'The ordinance is added to OrdinanceFlow Cebu with an AI-generated plain-language summary. It becomes immediately searchable by the public.',
  },
  {
    number: '04',
    icon: <Bot size={20} />,
    title: 'Citizens can ask questions',
    description:
      'Residents can search, browse, and ask the AI assistant questions like "What does this ordinance mean for my business?" in plain language.',
  },
];

// ── FAQ accordion item ────────────────────────────────────────────────────────
const FAQAccordion: React.FC<{ item: FAQItem; defaultOpen?: boolean }> = ({
  item,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color 0.14s',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '1rem 1.25rem',
          background: open ? 'var(--brand-light)' : 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
          transition: 'background 0.14s',
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: open ? 'var(--brand)' : 'var(--text-primary)',
            lineHeight: 1.4,
            transition: 'color 0.14s',
          }}
        >
          {item.question}
        </span>
        {open ? (
          <ChevronUp size={16} color="var(--brand)" style={{ flexShrink: 0 }} />
        ) : (
          <ChevronDown size={16} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
        )}
      </button>
      {open && (
        <div
          style={{
            padding: '0 1.25rem 1rem',
            animation: 'fadeIn 0.18s ease',
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
            }}
          >
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: 'var(--surface)',
          borderBottom: '0.5px solid var(--border)',
          padding: '2.5rem 2rem',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '3rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
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
                About this portal
              </p>
              <h1
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 'clamp(24px, 3.5vw, 36px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                  marginBottom: 14,
                }}
              >
                Bringing Cebu City's laws
                <br />
                <em style={{ fontStyle: 'italic', color: 'var(--brand)' }}>closer to its people.</em>
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.75,
                  maxWidth: 520,
                }}
              >
                OrdinanceFlow Cebu was built to solve a persistent gap in local governance:
                ordinances are enacted, but residents often have no easy way to find, read, or
                understand them. This portal bridges that gap with a searchable database, plain-language
                summaries, and an AI assistant — all without requiring a login.
              </p>
            </div>

            {/* Brand card */}
            <div
              style={{
                background: 'var(--brand)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
                minWidth: 240,
                maxWidth: 300,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <Scale size={22} color="#fff" />
              </div>
              <p
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: 8,
                  lineHeight: 1.25,
                }}
              >
                OrdinanceFlow Cebu
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>
                Built for the{' '}
                <strong style={{ color: '#fff' }}>Cebu Solutionsfest 2026</strong>
                {' '}— Ordinance Reach Track.
                <br />
                <br />
                Problem source: Office of the City Councilor, Cebu City
              </p>
              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '0.5px solid rgba(255,255,255,0.2)',
                }}
              >
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                  Part of OrdinanceFlow Cebu — a two-app system with a{' '}
                  <strong style={{ color: 'rgba(255,255,255,0.9)' }}>
                    Government Web App
                  </strong>{' '}
                  for encoders and department heads, and this public portal for citizens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem 3rem' }}>
        {/* How it works */}
        <div style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}
          >
            How it works
          </h2>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginBottom: '1.75rem',
            }}
          >
            The journey of a Cebu City ordinance from the Council chamber to your screen.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            {steps.map((step, i) => (
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
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 72,
                    fontWeight: 700,
                    color: 'var(--border)',
                    lineHeight: 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {step.number}
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--brand-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand)',
                    marginBottom: 12,
                  }}
                >
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 6,
                    fontFamily: 'Playfair Display, serif',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Problem & mission */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}
          >
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
              The problem we solve
            </p>
            <h3
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 10,
                lineHeight: 1.3,
              }}
            >
              Ordinances exist. People don't know about them.
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {[
                'Implementing offices are not consistently notified of new ordinances',
                'Department heads may be unaware of policies they\'re required to enforce',
                'Residents have no easy way to find ordinances relevant to their situation',
                'Legal language creates barriers to understanding one\'s rights and obligations',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#FFF1F2',
                      border: '0.5px solid #FECDD3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✕
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'var(--brand-light)',
              border: '0.5px solid var(--brand-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--brand)',
                marginBottom: 10,
              }}
            >
              Our solution
            </p>
            <h3
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--brand-dark)',
                marginBottom: 10,
                lineHeight: 1.3,
              }}
            >
              A complete ordinance lifecycle system.
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Centralized, searchable ordinance database accessible to anyone',
                'Multi-channel notifications to implementing offices upon publication',
                'Plain-language AI summaries and an AI chatbot for Q&A',
                'Compliance tracking and escalation for government accountability',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'var(--brand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      color: '#fff',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✓
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--brand-dark)', lineHeight: 1.5, opacity: 0.9 }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}
          >
            Frequently asked questions
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Common questions about ordinances and how to use this portal.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {faqs.map((faq, i) => (
              <FAQAccordion key={i} item={faq} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* Contact + CTA */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          {/* Contact */}
          <div
            style={{
              background: 'var(--surface)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: 12,
              }}
            >
              Contact &amp; official resources
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  icon: <Building2 size={15} />,
                  label: 'Cebu City Council',
                  value: 'Cebu City Hall, Osmeña Blvd, Cebu City',
                  href: null,
                },
                {
                  icon: <Mail size={15} />,
                  label: 'City Council Records',
                  value: 'records@cebucitycouncil.gov.ph',
                  href: 'mailto:records@cebucitycouncil.gov.ph',
                },
                {
                  icon: <MapPin size={15} />,
                  label: 'Sangguniang Panlungsod',
                  value: 'Official website →',
                  href: 'https://www.cebucity.gov.ph',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    padding: '10px 12px',
                    background: 'var(--bg)',
                    border: '0.5px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span style={{ color: 'var(--brand)', display: 'flex', marginTop: 1 }}>
                    {item.icon}
                  </span>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 13,
                          color: 'var(--brand)',
                          fontWeight: 500,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {item.value}
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              background: 'var(--brand)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: 10,
                }}
              >
                Ready to explore?
              </p>
              <h3
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1.3,
                  marginBottom: 10,
                }}
              >
                Find ordinances that affect your life.
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>
                Search by keyword, browse by category, or find your barangay to discover
                which Cebu City laws are most relevant to your community.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => navigate('/ordinances')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: '#fff',
                  color: 'var(--brand)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 20px',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Browse all ordinances <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/barangays')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '0.5px solid rgba(255,255,255,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 20px',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Find my barangay <MapPin size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};