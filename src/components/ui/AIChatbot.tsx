import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, ChevronDown, Sparkles } from 'lucide-react';
import { ordinances } from '../../data/ordinances';
import type { Ordinance } from '../../types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  links?: { label: string; id: string }[];
}

interface AIChatbotProps {
  /** When provided, chatbot answers in context of this specific ordinance */
  ordinance?: Ordinance;
  /** Visual theme: 'navy' for government, 'teal' for public portal */
  theme?: 'navy' | 'teal';
}

// ── Simulated AI response engine ──────────────────────────────────────────────
function generateResponse(
  input: string,
  contextOrdinance?: Ordinance
): { text: string; links?: { label: string; id: string }[] } {
  const q = input.toLowerCase().trim();

  // ── Context-aware (single ordinance) mode ────────────────────────────────
  if (contextOrdinance) {
    const o = contextOrdinance;

    if (/penalty|fine|penalt|punishment|violation|sanction/.test(q)) {
      const penaltyMatch = o.fullText.match(/penalt[^.]*?₱[\d,]+[^.]*\./gi);
      if (penaltyMatch) {
        return {
          text: `Based on Ordinance No. ${o.number}, penalties include:\n\n${penaltyMatch.slice(0, 3).join('\n\n')}\n\nAlways refer to the full text for the exact legal language.`,
        };
      }
      return {
        text: `Ordinance No. ${o.number} prescribes penalties for violations. Please expand the "Full ordinance text" section below to read the exact penalty provisions under the Penalties section.`,
      };
    }

    if (/who|apply|affect|sector|cover|scope/.test(q)) {
      const sectors = o.affectedSectors.join(', ');
      return {
        text: `Ordinance No. ${o.number} primarily affects: ${sectors}.\n\nThe ordinance covers all relevant parties within Cebu City's jurisdiction as defined in its Scope and Coverage section.`,
      };
    }

    if (/office|enforce|implement|responsible|department/.test(q)) {
      const offices = o.responsibleOffices.map((r) => `• ${r.name} (${r.acronym})`).join('\n');
      return {
        text: `The following offices are responsible for implementing Ordinance No. ${o.number}:\n\n${offices}\n\nYou can contact any of these offices at Cebu City Hall for compliance questions.`,
      };
    }

    if (/summary|about|what is|explain|mean|overview/.test(q)) {
      return {
        text: `Here's a plain-language summary of Ordinance No. ${o.number}:\n\n${o.aiSummary}\n\nThis is an AI-generated summary for reference only. Always consult the full text for official legal language.`,
      };
    }

    if (/when|date|enacted|passed|effective|effectiv/.test(q)) {
      return {
        text: `Ordinance No. ${o.number} was enacted on ${o.dateEnacted}.${o.dateAmended ? ` It was last amended on ${o.dateAmended}.` : ''}\n\nOrdinances typically take effect 15 days after publication in a newspaper of general circulation.`,
      };
    }

    if (/amend|change|revision|update|history/.test(q)) {
      if (o.amendments && o.amendments.length > 0) {
        const history = o.amendments.map((a) => `• ${a.date}: ${a.description}`).join('\n');
        return { text: `Amendment history for Ordinance No. ${o.number}:\n\n${history}` };
      }
      return { text: `Ordinance No. ${o.number} has not been amended since its enactment on ${o.dateEnacted}.` };
    }

    if (/comply|compliance|how to|what should|requirement|obligation/.test(q)) {
      return {
        text: `To comply with Ordinance No. ${o.number}:\n\n${o.aiSummary}\n\nFor specific compliance requirements, expand the full ordinance text and refer to the relevant sections. You may also contact the responsible offices listed in the sidebar.`,
      };
    }

    // Default context-aware fallback
    return {
      text: `I can help you understand Ordinance No. ${o.number} — "${o.title}".\n\nTry asking about:\n• Penalties and fines\n• Who is affected\n• Responsible offices\n• Compliance requirements\n• Amendment history`,
    };
  }

  // ── Global mode (cross-ordinance search) ─────────────────────────────────

  if (/food|restaurant|carinderia|eatery|food stall|bakery/.test(q)) {
    const matches = ordinances.filter((o) =>
      o.category === 'Business & Permits' ||
      o.keywords.some((k) => /food|restaurant|market/.test(k))
    );
    return {
      text: `I found ${matches.length} ordinance(s) relevant to food businesses in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/litter|garbage|waste|trash|solid waste/.test(q)) {
    const matches = ordinances.filter((o) =>
      o.keywords.some((k) => /waste|litter|garbage|disposal/.test(k))
    );
    return {
      text: `Here are ordinances related to waste and littering in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/traffic|parking|vehicle|transport|road|driving/.test(q)) {
    const matches = ordinances.filter((o) => o.category === 'Traffic & Transport');
    return {
      text: `I found ${matches.length} traffic and transport ordinance(s) in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/plastic|environment|pollution|coastal|air quality/.test(q)) {
    const matches = ordinances.filter((o) => o.category === 'Environment');
    return {
      text: `Here are environment-related ordinances in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/curfew|minor|youth|children|student/.test(q)) {
    const matches = ordinances.filter((o) =>
      o.keywords.some((k) => /curfew|minor|youth/.test(k))
    );
    return {
      text: `Here are ordinances related to minors and youth in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/noise|night|sound|loud/.test(q)) {
    return {
      text: `Noise-related provisions are typically covered under Public Safety and Health & Sanitation ordinances. Try searching "noise" in the ordinance database for the most relevant results.`,
      links: [],
    };
  }

  if (/business|permit|license|registration/.test(q)) {
    const matches = ordinances.filter((o) => o.category === 'Business & Permits');
    return {
      text: `Here are business and permit ordinances in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/health|sanitation|hospital|medical|disease/.test(q)) {
    const matches = ordinances.filter((o) => o.category === 'Health & Sanitation');
    return {
      text: `Here are health and sanitation ordinances in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/safety|violence|abuse|harassment|safe space/.test(q)) {
    const matches = ordinances.filter((o) => o.category === 'Public Safety');
    return {
      text: `Here are public safety ordinances in Cebu City:`,
      links: matches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  if (/hello|hi|hey|good morning|good afternoon/.test(q)) {
    return {
      text: `Hello! I'm the OrdinanceFlow AI assistant. I can help you find and understand Cebu City ordinances.\n\nTry asking me:\n• "What ordinances apply to food businesses?"\n• "What are the penalties for littering?"\n• "Which office handles traffic violations?"\n• "Is there an ordinance about noise at night?"`,
    };
  }

  // Generic fallback — try keyword search across all ordinances
  const keywordMatches = ordinances.filter(
    (o) =>
      o.title.toLowerCase().includes(q) ||
      o.keywords.some((k) => k.toLowerCase().includes(q)) ||
      o.aiSummary.toLowerCase().includes(q)
  );

  if (keywordMatches.length > 0) {
    return {
      text: `I found ${keywordMatches.length} ordinance(s) matching "${input}":`,
      links: keywordMatches.map((o) => ({ label: `Ord. No. ${o.number} — ${o.title}`, id: o.id })),
    };
  }

  return {
    text: `I couldn't find a specific ordinance matching "${input}" in the current database sample.\n\nTry browsing the full ordinance list or searching by category. You can also ask me about specific topics like traffic, food businesses, environment, or public safety.`,
  };
}

// ── Suggested questions ───────────────────────────────────────────────────────
const globalSuggestions = [
  'What ordinances apply to food businesses?',
  'What are the penalties for littering?',
  'Which office handles traffic violations?',
  'Is there an ordinance about noise at night?',
];

function getContextSuggestions(o: Ordinance): string[] {
  return [
    `What are the penalties in Ordinance No. ${o.number}?`,
    'Who does this ordinance affect?',
    'Which offices implement this?',
    'When was this ordinance enacted?',
  ];
}

// ── Message bubble ────────────────────────────────────────────────────────────
const MessageBubble: React.FC<{
  message: Message;
  brandColor: string;
  onLinkClick: (id: string) => void;
}> = ({ message, brandColor, onLinkClick }) => {
  const isUser = message.role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 10,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 26, height: 26, borderRadius: '50%',
            background: brandColor, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginRight: 8, marginTop: 2,
          }}
        >
          <Sparkles size={12} color="#fff" />
        </div>
      )}
      <div style={{ maxWidth: '82%' }}>
        <div
          style={{
            padding: '9px 13px',
            borderRadius: isUser ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
            background: isUser ? brandColor : 'var(--bg)',
            border: isUser ? 'none' : '0.5px solid var(--border)',
            color: isUser ? '#fff' : 'var(--text-primary)',
            fontSize: 13,
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.text}
        </div>
        {message.links && message.links.length > 0 && (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {message.links.map((link) => (
              <button
                key={link.id}
                onClick={() => onLinkClick(link.id)}
                style={{
                  textAlign: 'left', background: 'var(--surface)',
                  border: `0.5px solid ${brandColor}33`,
                  borderRadius: 8, padding: '6px 10px',
                  fontSize: 12, color: brandColor,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.12s',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = `${brandColor}11`)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)')}
              >
                → {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator: React.FC<{ brandColor: string }> = ({ brandColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
    <div
      style={{
        width: 26, height: 26, borderRadius: '50%',
        background: brandColor, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      <Sparkles size={12} color="#fff" />
    </div>
    <div
      style={{
        padding: '10px 14px', background: 'var(--bg)',
        border: '0.5px solid var(--border)', borderRadius: '4px 14px 14px 14px',
        display: 'flex', gap: 4, alignItems: 'center',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--text-tertiary)',
            display: 'inline-block',
            animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

// ── Main chatbot component ────────────────────────────────────────────────────
export const AIChatbot: React.FC<AIChatbotProps> = ({
  ordinance,
  theme = 'navy',
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const brandColor = theme === 'teal' ? '#0D9488' : '#185FA5';
  const suggestions = ordinance ? getContextSuggestions(ordinance) : globalSuggestions;

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing, open, minimized]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, minimized]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setShowSuggestions(false);

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(text, ordinance);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: response.text,
        links: response.links,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setTyping(false);
    }, 900 + Math.random() * 400);
  };

  const handleLinkClick = (id: string) => {
    setOpen(false);
    navigate(`/ordinances/${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* CSS animations */}
      <style>{`
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { transform: translateY(16px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${brandColor}44; }
          50% { box-shadow: 0 0 0 8px ${brandColor}00; }
        }
      `}</style>

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Ask AI assistant"
          style={{
            position: 'fixed', bottom: '1.75rem', right: '1.75rem',
            zIndex: 300,
            width: 52, height: 52, borderRadius: '50%',
            background: brandColor, border: 'none',
            boxShadow: `0 4px 20px ${brandColor}55`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'chatPulse 2.5s ease-in-out infinite',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
        >
          <Bot size={22} color="#fff" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: '1.75rem', right: '1.75rem',
            zIndex: 300,
            width: 360, borderRadius: 16,
            background: 'var(--surface)',
            border: '0.5px solid var(--border)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatSlideUp 0.22s ease',
            maxHeight: minimized ? 'auto' : 520,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: brandColor,
              padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: minimized ? 'pointer' : 'default',
            }}
            onClick={() => minimized && setMinimized(false)}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={15} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                OrdinanceFlow AI
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
                {ordinance ? `Ord. No. ${ordinance.number}` : 'Ask about any ordinance'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized((v) => !v); }}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  borderRadius: 6, padding: '4px 6px', cursor: 'pointer',
                  color: '#fff', display: 'flex', alignItems: 'center',
                }}
                title={minimized ? 'Expand' : 'Minimize'}
              >
                <ChevronDown
                  size={14}
                  style={{ transform: minimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                />
              </button>
              <button
                onClick={() => { setOpen(false); setMinimized(false); }}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  borderRadius: 6, padding: '4px 6px', cursor: 'pointer',
                  color: '#fff', display: 'flex', alignItems: 'center',
                }}
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body — hidden when minimized */}
          {!minimized && (
            <>
              {/* Messages area */}
              <div
                style={{
                  flex: 1, overflowY: 'auto',
                  padding: '14px 12px 8px',
                  display: 'flex', flexDirection: 'column',
                  minHeight: 200, maxHeight: 340,
                }}
              >
                {/* Welcome message */}
                {messages.length === 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: brandColor, display: 'flex',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}
                      >
                        <Sparkles size={12} color="#fff" />
                      </div>
                      <div
                        style={{
                          padding: '9px 13px', background: 'var(--bg)',
                          border: '0.5px solid var(--border)',
                          borderRadius: '4px 14px 14px 14px',
                          fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.65,
                        }}
                      >
                        {ordinance
                          ? `Hi! I can help you understand Ordinance No. ${ordinance.number}. Ask me about penalties, who it affects, responsible offices, or compliance requirements.`
                          : `Hi! I can help you find and understand Cebu City ordinances. Ask me anything — penalties, which office to contact, or what laws apply to your situation.`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggested questions */}
                {showSuggestions && messages.length === 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>
                      Suggested questions
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          style={{
                            textAlign: 'left', background: 'var(--bg)',
                            border: `0.5px solid ${brandColor}33`,
                            borderRadius: 8, padding: '7px 10px',
                            fontSize: 12, color: brandColor,
                            cursor: 'pointer', fontFamily: 'inherit',
                            lineHeight: 1.4, transition: 'background 0.12s',
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = `${brandColor}11`)}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)')}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation */}
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    brandColor={brandColor}
                    onLinkClick={handleLinkClick}
                  />
                ))}

                {typing && <TypingIndicator brandColor={brandColor} />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div
                style={{
                  borderTop: '0.5px solid var(--border)',
                  padding: '10px 12px',
                }}
              >
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question…"
                    disabled={typing}
                    style={{
                      flex: 1, border: '0.5px solid var(--border-strong)',
                      borderRadius: 10, padding: '8px 12px',
                      fontFamily: 'inherit', fontSize: 13,
                      color: 'var(--text-primary)', background: 'var(--bg)',
                      outline: 'none', transition: 'border-color 0.12s',
                    }}
                    onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = brandColor)}
                    onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border-strong)')}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: input.trim() && !typing ? brandColor : 'var(--border)',
                      border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'background 0.14s',
                    }}
                  >
                    <Send size={14} color={input.trim() && !typing ? '#fff' : 'var(--text-tertiary)'} />
                  </button>
                </form>
                <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 6, textAlign: 'center' }}>
                  AI responses are for reference only · Not legal advice
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
