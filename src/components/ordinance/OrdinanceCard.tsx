import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Bookmark, Share2, Eye, ArrowRight } from 'lucide-react';
import type { Ordinance } from '../../types';
import { StatusBadge, CategoryChip, AIPill, Button } from '../ui/Badges';

interface OrdinanceCardProps {
  ordinance: Ordinance;
  variant?: 'default' | 'featured' | 'compact';
  animationDelay?: number;
}

export const OrdinanceCard: React.FC<OrdinanceCardProps> = ({
  ordinance,
  variant = 'default',
  animationDelay = 0,
}) => {
  const navigate = useNavigate();

  const handleView = () => navigate(`/ordinances/${ordinance.id}`);

  if (variant === 'compact') {
    return (
      <div
        onClick={handleView}
        className="animate-fade-in"
        style={{
          animationDelay: `${animationDelay}s`,
          background: 'var(--surface)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          cursor: 'pointer',
          transition: 'border-color 0.14s, box-shadow 0.14s',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand-border)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--brand-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--brand)' }}>
            #{ordinance.number}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              marginBottom: 4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {ordinance.title}
          </p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <StatusBadge status={ordinance.status} />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{ordinance.dateEnacted}</span>
          </div>
        </div>
        <ArrowRight size={14} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: 2 }} />
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        className="animate-fade-in"
        style={{
          animationDelay: `${animationDelay}s`,
          background: 'var(--surface)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          cursor: 'pointer',
          transition: 'border-color 0.14s, box-shadow 0.14s, transform 0.14s',
        }}
        onClick={handleView}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--brand-border)';
          el.style.boxShadow = 'var(--shadow-md)';
          el.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--border)';
          el.style.boxShadow = 'none';
          el.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <StatusBadge status={ordinance.status} />
            <CategoryChip label={ordinance.category} />
          </div>
          <AIPill />
        </div>

        <div>
          <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 4 }}>
            Ordinance No. {ordinance.number}
          </p>
          <h3
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            {ordinance.title}
          </h3>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {ordinance.aiSummary}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '0.5px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} color="var(--text-tertiary)" />
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{ordinance.dateEnacted}</span>
          </div>
          <span
            style={{
              fontSize: 12,
              color: 'var(--brand)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Read more <ArrowRight size={12} />
          </span>
        </div>
      </div>
    );
  }

  // default
  return (
    <div
      className="animate-fade-in"
      style={{
        animationDelay: `${animationDelay}s`,
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        transition: 'border-color 0.14s, box-shadow 0.14s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 5, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              Ordinance No. {ordinance.number}
            </span>
            <StatusBadge status={ordinance.status} />
            <CategoryChip label={ordinance.category} />
          </div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              marginBottom: 6,
            }}
          >
            {ordinance.title}
          </h3>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {ordinance.aiSummary}
          </p>
        </div>
        <AIPill />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingTop: 10,
          borderTop: '0.5px solid var(--border)',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={12} color="var(--text-tertiary)" />
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            Enacted: {ordinance.dateEnacted}
            {ordinance.dateAmended && (
              <span style={{ color: 'var(--amended-text)', marginLeft: 8 }}>
                · Amended {ordinance.dateAmended}
              </span>
            )}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button
            variant="outline"
            size="sm"
            icon={<Eye size={13} />}
            onClick={handleView}
          >
            View full
          </Button>
          <Button variant="ghost" size="sm" icon={<Bookmark size={13} />}>
            Save
          </Button>
          <Button variant="ghost" size="sm" icon={<Share2 size={13} />}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};
