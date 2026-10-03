import React from 'react';
import { mockSubmissions } from '../../../data/mockData';
import { Badge, ProgressBar, statusColors, langBadgeStyle } from '../../../components/ui';

const Submissions: React.FC = () => (
  <div style={{ maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
    {mockSubmissions.map((s) => {
      const sc = statusColors(s.status);
      const scorePercent = s.score != null ? Math.round((s.score / s.maxScore) * 100) : null;
      const scoreColor = scorePercent != null && scorePercent >= 60 ? 'var(--color-success)' : 'var(--color-error)';

      return (
        <div
          key={s.id}
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '22px 24px',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                {s.assignmentTitle}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.course}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
              <Badge label={sc.label} color={sc.color} bg={sc.bg} />
              <span style={langBadgeStyle(s.language)}>{s.language}</span>
            </div>
          </div>

          {/* Score row */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Score</span>
              {scorePercent != null ? (
                <span style={{ fontSize: '14px', fontWeight: 700, color: scoreColor }}>
                  {s.score}/{s.maxScore} pts &nbsp;
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>({scorePercent}%)</span>
                </span>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Awaiting grade</span>
              )}
            </div>
            {scorePercent != null && (
              <ProgressBar value={scorePercent} color={scoreColor} />
            )}
          </div>

          {/* Submitted at */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              {s.feedback ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-hover)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    borderLeft: `3px solid ${sc.color}`,
                  }}
                >
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Instructor Feedback
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {s.feedback}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  Awaiting instructor review…
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Submitted</p>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                {new Date(s.submittedAt).toLocaleDateString('en', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {new Date(s.submittedAt).toLocaleTimeString('en', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default Submissions;
