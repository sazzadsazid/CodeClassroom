import React from 'react';

// ─── Card ──────────────────────────────────────────────────────────────────
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '20px',
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Badge ─────────────────────────────────────────────────────────────────
export const Badge: React.FC<{ label: string; color: string; bg: string; style?: React.CSSProperties }> = ({
  label,
  color,
  bg,
  style,
}) => (
  <span
    style={{
      backgroundColor: bg,
      color,
      fontSize: '11px',
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: '6px',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {label}
  </span>
);

// ─── ProgressBar ───────────────────────────────────────────────────────────
export const ProgressBar: React.FC<{ value: number; color?: string; height?: number }> = ({
  value,
  color = 'var(--color-accent)',
  height = 6,
}) => (
  <div
    style={{
      width: '100%',
      height: `${height}px`,
      backgroundColor: 'var(--color-bg-hover)',
      borderRadius: `${height / 2}px`,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: `${Math.min(value, 100)}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: `${height / 2}px`,
        transition: 'width 0.4s ease',
      }}
    />
  </div>
);

// ─── SectionHeader ─────────────────────────────────────────────────────────
export const SectionHeader: React.FC<{
  title: string;
  action?: string;
  onAction?: () => void;
}> = ({ title, action, onAction }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h2>
    {action && (
      <button
        onClick={onAction}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          color: 'var(--color-accent)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        {action} →
      </button>
    )}
  </div>
);

// ─── Colour helpers ────────────────────────────────────────────────────────
export const difficultyColors = (d: string): { color: string; bg: string } => {
  if (d === 'Beginner' || d === 'Easy') return { color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
  if (d === 'Intermediate' || d === 'Medium') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
  return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
};

export const statusColors = (status: string): { color: string; bg: string; label: string } => {
  switch (status) {
    case 'pending':     return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Pending' };
    case 'submitted':   return { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  label: 'Submitted' };
    case 'graded':      return { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Graded' };
    case 'overdue':     return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Overdue' };
    case 'passed':      return { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Passed' };
    case 'failed':      return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Failed' };
    case 'in-progress': return { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', label: 'In Progress' };
    case 'completed':   return { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Completed' };
    case 'abandoned':   return { color: '#64748b', bg: 'rgba(100,116,139,0.12)', label: 'Abandoned' };
    default:            return { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', label: status };
  }
};

export const langColor = (lang: string): string => {
  const map: Record<string, string> = {
    Java: '#f89820',
    TypeScript: '#3178c6',
    Python: '#3572a5',
    Multiple: '#8b5cf6',
    JavaScript: '#f7df1e',
  };
  return map[lang] ?? '#6366f1';
};

export const langBadgeStyle = (lang: string): React.CSSProperties => ({
  fontSize: '11px',
  fontWeight: 600,
  color: langColor(lang),
  backgroundColor: `${langColor(lang)}1a`,
  padding: '3px 8px',
  borderRadius: '6px',
  whiteSpace: 'nowrap' as const,
});
