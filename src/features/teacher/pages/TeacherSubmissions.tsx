import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Eye } from 'lucide-react';
import { Badge, ProgressBar, langBadgeStyle } from '../../../components/ui';
import { teacherSubmissions } from '../../../data/teacherMockData';

type StatusFilter = 'all' | 'pending' | 'reviewed' | 'graded';

const statusConfig = (s: string) => {
  switch (s) {
    case 'pending':  return { label: 'Pending',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    case 'reviewed': return { label: 'Reviewed', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' };
    case 'graded':   return { label: 'Graded',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    default:         return { label: s,           color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' };
  }
};

const TeacherSubmissions: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number | ''>('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);

  const filtered = filter === 'all'
    ? teacherSubmissions
    : teacherSubmissions.filter(s => s.status === filter);

  const selected = teacherSubmissions.find(s => s.id === selectedId);

  const filterBtn = (f: StatusFilter): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '13px',
    fontWeight: filter === f ? 600 : 400, transition: 'all 0.15s',
    borderColor: filter === f ? 'var(--color-accent)' : 'var(--color-border)',
    backgroundColor: filter === f ? 'var(--color-accent-light)' : 'transparent',
    color: filter === f ? 'var(--color-accent)' : 'var(--color-text-secondary)',
  });

  const handleGive = () => {
    setFeedbackSaving(true);
    setTimeout(() => { setFeedbackSaving(false); setSelectedId(null); }, 600);
  };

  return (
    <div style={{ maxWidth: '1100px', display: 'flex', gap: '20px' }}>
      {/* Left: list */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
          {(['all', 'pending', 'reviewed', 'graded'] as StatusFilter[]).map(f => (
            <button key={f} style={filterBtn(f)} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{ marginLeft: '5px', fontSize: '11px', opacity: 0.7 }}>
                ({(f === 'all' ? teacherSubmissions : teacherSubmissions.filter(s => s.status === f)).length})
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(sub => {
            const sc = statusConfig(sub.status);
            const pct = sub.score != null ? Math.round((sub.score / sub.maxScore) * 100) : null;
            const isSelected = selectedId === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedId(isSelected ? null : sub.id)}
                style={{
                  backgroundColor: 'var(--color-bg-card)', border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.5)'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  {/* Student info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {sub.studentAvatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{sub.studentName}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.assignmentTitle}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Submitted</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {new Date(sub.submittedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Score</p>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: pct != null && pct >= 60 ? '#10b981' : pct != null ? '#ef4444' : 'var(--color-text-muted)' }}>
                        {pct != null ? `${sub.score}/${sub.maxScore}` : '—'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                      <span style={langBadgeStyle(sub.language)}>{sub.language}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedId(sub.id); setFeedback(sub.feedback ?? ''); setScore(sub.score ?? ''); }}
                        style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--color-accent)', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <MessageSquare size={12} /> Feedback
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/teacher/live-monitor/${sub.studentId}`); }}
                        style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} /> Code
                      </button>
                    </div>
                  </div>
                </div>

                {/* Code snippet */}
                {isSelected && (
                  <div style={{ marginTop: '14px', backgroundColor: '#0d1117', borderRadius: '8px', padding: '12px 14px', border: '1px solid #30363d', fontFamily: 'monospace', fontSize: '12px', color: '#e6edf3', lineHeight: 1.6, overflowX: 'auto' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{sub.codeSnippet}</pre>
                  </div>
                )}

                {/* Existing feedback */}
                {isSelected && sub.feedback && (
                  <div style={{ marginTop: '12px', padding: '12px 14px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '8px', borderLeft: '3px solid var(--color-accent)' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Previous Feedback</p>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{sub.feedback}</p>
                  </div>
                )}

                {/* Stats row */}
                {isSelected && (
                  <div style={{ display: 'flex', gap: '20px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                    {[{ label: 'Run Attempts', value: sub.runAttempts }, { label: 'Time Spent', value: `${sub.timeSpentMinutes} min` }, { label: 'Language', value: sub.language }].map(s => (
                      <div key={s.label}>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{s.label}</p>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{s.value}</p>
                      </div>
                    ))}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                      <button onClick={e => { e.stopPropagation(); navigate(`/teacher/session-replay/${sub.studentId}`); }} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer' }}>
                        View Replay
                      </button>
                      <button onClick={e => { e.stopPropagation(); navigate(`/teacher/ai-analysis/${sub.studentId}`); }} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid rgba(99,102,241,0.4)', backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--color-accent)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                        AI Analysis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: feedback panel */}
      {selected && (
        <div style={{ width: '320px', flexShrink: 0 }}>
          <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Give Feedback</h3>
              <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
            </div>

            {/* Student info */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', padding: '10px 12px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {selected.studentAvatar}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{selected.studentName}</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{selected.assignmentTitle}</p>
              </div>
            </div>

            {/* Score */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Score (out of {selected.maxScore})
              </label>
              <input
                type="number" min={0} max={selected.maxScore}
                value={score}
                onChange={e => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={`0–${selected.maxScore}`}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontSize: '14px', fontWeight: 700, outline: 'none' }}
              />
              {score !== '' && (
                <div style={{ marginTop: '8px' }}>
                  <ProgressBar value={(Number(score) / selected.maxScore) * 100} color={Number(score) >= 60 ? '#10b981' : '#ef4444'} height={5} />
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '3px' }}>{Math.round((Number(score) / selected.maxScore) * 100)}%</p>
                </div>
              )}
            </div>

            {/* Feedback text */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Feedback
              </label>
              <textarea
                rows={6} value={feedback} onChange={e => setFeedback(e.target.value)}
                placeholder="Write constructive feedback for the student…"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
              />
            </div>

            <button
              onClick={handleGive} disabled={feedbackSaving}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: feedbackSaving ? 'not-allowed' : 'pointer', opacity: feedbackSaving ? 0.7 : 1 }}
            >
              {feedbackSaving ? 'Saving…' : 'Save Feedback'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmissions;
