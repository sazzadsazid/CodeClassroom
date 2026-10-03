import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { mockCodingHistory, mockCodingSessions } from '../../../data/mockData';
import { Card, Badge, statusColors, langBadgeStyle } from '../../../components/ui';

const langColor = (lang: string): string => {
  const map: Record<string, string> = { Java: '#f89820', TypeScript: '#3178c6', Python: '#3572a5', Multiple: '#8b5cf6' };
  return map[lang] ?? '#6366f1';
};

const CodingHistory: React.FC = () => {
  const navigate = useNavigate();
  const maxLines = Math.max(...mockCodingHistory.map((d) => d.linesOfCode), 1);

  return (
    <div style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Sessions', value: mockCodingSessions.length },
          { label: 'Lines Written', value: mockCodingHistory.reduce((s, d) => s + d.linesOfCode, 0).toLocaleString() },
          { label: 'Problems Solved', value: mockCodingHistory.reduce((s, d) => s + d.problemsSolved, 0) },
          { label: 'Total Minutes', value: mockCodingHistory.reduce((s, d) => s + d.sessionMinutes, 0) },
        ].map((stat) => (
          <Card key={stat.label}>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* ── Bar Chart ── */}
      <Card>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '20px' }}>
          Lines of Code — Last 7 Days
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
          {mockCodingHistory.map((d) => (
            <div
              key={d.date}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}
            >
              {d.linesOfCode > 0 && (
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{d.linesOfCode}</span>
              )}
              <div
                style={{
                  width: '100%',
                  maxWidth: '52px',
                  height: `${(d.linesOfCode / maxLines) * 110}px`,
                  minHeight: d.linesOfCode > 0 ? '6px' : '0',
                  backgroundColor: d.linesOfCode > 0 ? (d.language ? langColor(d.language) : 'var(--color-accent)') : 'var(--color-bg-hover)',
                  borderRadius: '5px 5px 0 0',
                  transition: 'height 0.3s ease',
                  opacity: 0.85,
                }}
              />
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                {new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Coding Sessions ── */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '14px' }}>
          Previous Coding Sessions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mockCodingSessions.map((session) => {
            const sc = statusColors(session.status);
            return (
              <div
                key={session.id}
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Assignment info */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                    {session.assignmentTitle}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{session.course}</p>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Duration</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                      {session.durationMinutes} min
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Runs</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                      {session.runs}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Lines</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                      {session.linesWritten}
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Date</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {new Date(session.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Right badges + button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                  <span style={langBadgeStyle(session.language)}>{session.language}</span>
                  <button
                    onClick={() => navigate(`/workspace/${session.assignmentId}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-accent)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-light)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent')
                    }
                  >
                    <Eye size={13} />
                    View Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Daily Log ── */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '14px' }}>
          Daily Activity Log
        </h2>
        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '130px 110px 1fr 100px 100px',
              gap: '12px',
              padding: '10px 20px',
              backgroundColor: 'var(--color-bg-hover)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {['Date', 'Language', 'Lines', 'Problems', 'Minutes'].map((h) => (
              <span key={h} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {h}
              </span>
            ))}
          </div>
          {mockCodingHistory.map((d, idx) => (
            <div
              key={d.date}
              style={{
                display: 'grid',
                gridTemplateColumns: '130px 110px 1fr 100px 100px',
                gap: '12px',
                padding: '13px 20px',
                borderBottom: idx < mockCodingHistory.length - 1 ? '1px solid var(--color-border)' : 'none',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{d.date}</span>
              {d.language ? (
                <span style={langBadgeStyle(d.language)}>{d.language}</span>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>—</span>
              )}
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{d.linesOfCode > 0 ? `${d.linesOfCode} lines` : '—'}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{d.problemsSolved > 0 ? d.problemsSolved : '—'}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{d.sessionMinutes > 0 ? `${d.sessionMinutes} min` : '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodingHistory;
