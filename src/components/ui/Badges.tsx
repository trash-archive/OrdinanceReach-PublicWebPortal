import React from 'react';
import type { OrdinanceStatus } from '../../types';

// ── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  status: OrdinanceStatus;
  className?: string;
}

const statusMap: Record<OrdinanceStatus, { label: string; style: React.CSSProperties }> = {
  active: {
    label: 'Active',
    style: {
      background: 'var(--active-bg)',
      color: 'var(--active-text)',
      border: '0.5px solid var(--active-border)',
    },
  },
  amended: {
    label: 'Amended',
    style: {
      background: 'var(--amended-bg)',
      color: 'var(--amended-text)',
      border: '0.5px solid var(--amended-border)',
    },
  },
  repealed: {
    label: 'Repealed',
    style: {
      background: 'var(--repealed-bg)',
      color: 'var(--repealed-text)',
      border: '0.5px solid var(--repealed-border)',
    },
  },
};

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const { label, style } = statusMap[status];
  return (
    <span
      className={className}
      style={{
        ...style,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 9px',
        borderRadius: 99,
        letterSpacing: '0.2px',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
          opacity: 0.7,
        }}
      />
      {label}
    </span>
  );
};

// ── Category chip ─────────────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  size?: 'sm' | 'md';
}
export const CategoryChip: React.FC<ChipProps> = ({ label, size = 'sm' }) => (
  <span
    style={{
      display: 'inline-block',
      fontSize: size === 'sm' ? 11 : 12,
      padding: size === 'sm' ? '2px 9px' : '3px 11px',
      borderRadius: 99,
      background: 'var(--surface-raised)',
      color: 'var(--text-secondary)',
      border: '0.5px solid var(--border)',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

// ── AI pill ───────────────────────────────────────────────────────────────────
export const AIPill: React.FC = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 10,
      fontWeight: 600,
      padding: '3px 9px',
      borderRadius: 99,
      background: 'var(--brand-light)',
      color: 'var(--brand)',
      border: '0.5px solid var(--brand-border)',
      letterSpacing: '0.4px',
      whiteSpace: 'nowrap',
    }}
  >
    ✦ AI SUMMARY
  </span>
);

// ── Button ────────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Button: React.FC<BtnProps> = ({
  variant = 'outline',
  size = 'sm',
  icon,
  children,
  style,
  ...rest
}) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: 'inherit',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    transition: 'background 0.14s, border-color 0.14s, color 0.14s, box-shadow 0.14s',
    whiteSpace: 'nowrap',
    fontSize: size === 'sm' ? 12 : 13,
    padding: size === 'sm' ? '6px 13px' : '8px 18px',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--brand)',
      color: '#fff',
      border: 'none',
    },
    outline: {
      background: 'var(--surface)',
      color: 'var(--text-secondary)',
      border: '0.5px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '0.5px solid transparent',
    },
  };

  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};
