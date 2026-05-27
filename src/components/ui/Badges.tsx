import React from 'react';
import type { OrdinanceStatus } from '../../types';

// ── StatusBadge ───────────────────────────────────────────────────────────────
const statusConfig: Record<
  OrdinanceStatus,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  active: {
    bg: 'var(--active-bg, #EDFAF3)',
    text: 'var(--active-text, #166534)',
    border: 'var(--active-border, #BBF7D0)',
    dot: '#22C55E',
    label: 'Active',
  },
  amended: {
    bg: 'var(--amended-bg, #FFFBEB)',
    text: 'var(--amended-text, #92400E)',
    border: 'var(--amended-border, #FDE68A)',
    dot: '#F59E0B',
    label: 'Amended',
  },
  repealed: {
    bg: 'var(--repealed-bg, #FFF1F2)',
    text: 'var(--repealed-text, #9F1239)',
    border: 'var(--repealed-border, #FECDD3)',
    dot: '#F43F5E',
    label: 'Repealed',
  },
};

export const StatusBadge: React.FC<{ status: OrdinanceStatus }> = ({ status }) => {
  const cfg = statusConfig[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.4px',
        padding: '2px 8px',
        borderRadius: 99,
        background: cfg.bg,
        color: cfg.text,
        border: `0.5px solid ${cfg.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
};

// ── CategoryChip ──────────────────────────────────────────────────────────────
export const CategoryChip: React.FC<{ label: string; size?: 'sm' | 'md' }> = ({
  label,
  size = 'sm',
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: size === 'md' ? 11 : 10,
      fontWeight: 500,
      padding: size === 'md' ? '3px 10px' : '2px 8px',
      borderRadius: 99,
      background: 'var(--brand-light, #EBF4FF)',
      color: 'var(--brand, #185FA5)',
      border: '0.5px solid var(--brand-border, #BFDBFE)',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

// ── AIPill ────────────────────────────────────────────────────────────────────
export const AIPill: React.FC = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.5px',
      padding: '2px 8px',
      borderRadius: 99,
      background: 'linear-gradient(135deg, #EBF4FF 0%, #F0EBFF 100%)',
      color: 'var(--brand, #185FA5)',
      border: '0.5px solid var(--brand-border, #BFDBFE)',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}
  >
    ✦ AI Summary
  </span>
);

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'outline',
  size = 'md',
  icon,
  onClick,
  children,
  style,
  disabled,
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: 12, padding: '5px 11px', borderRadius: 8 },
    md: { fontSize: 13, padding: '7px 16px', borderRadius: 10 },
    lg: { fontSize: 14, padding: '10px 22px', borderRadius: 12 },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--brand, #185FA5)',
      color: '#fff',
      border: 'none',
    },
    outline: {
      background: 'none',
      color: 'var(--text-secondary)',
      border: '0.5px solid var(--border-strong)',
    },
    ghost: {
      background: 'none',
      color: 'var(--text-tertiary)',
      border: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'inherit',
        fontWeight: 500,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.12s',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
};