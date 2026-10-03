import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { mockAssignments } from '../../../data/mockData';
import { Badge, difficultyColors, statusColors, langBadgeStyle } from '../../../components/ui';

type FilterStatus = 'all' | 'pending' | 'submitted' | 'graded' | 'overdue';

const filterBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 16px',
  borderRadius: '8px',
  border: '1px solid',
  borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
  backgroundColor: active ? 'var(--color-accent-light)' : 'transparent',
  color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
  fontSize: '13px',
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  transition: 'all 0.15s',
});

const Assignments: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered =
    filter === 'all'
      ? mockAssignments
      : mockAssignments.filter((a) => a.status === filter);

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {(['all', 'pending', 'submitted', 'graded', 'overdue'] as FilterStatus[]).map((f) => (
          <button key={f} style={filterBtnStyle(filter === f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && (
              <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.7 }}>
                ({mockAssignments.length})
              </span>
            )}
            {f !== 'all' && (
              <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.7 }}>
                ({mockAssignments.filter((a) => a.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Assignment cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((a) => {
          const sc = statusColors(a.status);
          const dc = difficultyColors(a.difficulty);
          return (
            <div
              key={a.id}
              onClick={() => navigate(`/assignments/${a.id}`)}
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '18px 22px',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-accent)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)')
              }
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                {/* Left */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    {a.status === 'overdue' && <AlertCircle size={15} color="var(--color-error)" style={{ flexShrink: 0 }} />}
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {a.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                    {a.course}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                    <Badge label={a.difficulty} color={dc.color} bg={dc.bg} />
                    <span style={langBadgeStyle(a.language)}>{a.language}</span>
                  </div>
                </div>

                {/* Right */}
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '100px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>Due</p>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: a.status === 'overdue' ? 'var(--color-error)' : 'var(--color-text-secondary)',
                      marginBottom: '10px',
                    }}
                  >
                    {a.dueDate}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>Score</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    {a.score != null ? (
                      <span style={{ color: a.score >= 60 ? 'var(--color-success)' : 'var(--color-error)' }}>
                        {a.score}/{a.maxScore}
                      </span>
                    ) : (
                      <span>—/{a.maxScore}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', padding: '24px 0' }}>
            No assignments found for this filter.
          </p>
        )}
      </div>
    </div>
  );
};

export default Assignments;
