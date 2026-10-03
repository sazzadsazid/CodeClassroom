import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Users, Clock, Code2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, Badge, ProgressBar, langBadgeStyle } from '../../../components/ui';
import { teacherAssignments, teacherSubmissions } from '../../../data/teacherMockData';

const statusConfig = (s: string) => {
  switch (s) {
    case 'active': return { label: 'Active', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    case 'closed': return { label: 'Closed', color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
    case 'draft':  return { label: 'Draft',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    default:       return { label: s,        color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' };
  }
};

const subStatusCfg = (s: string) => {
  switch (s) {
    case 'pending':  return { label: 'Pending',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    case 'reviewed': return { label: 'Reviewed', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' };
    case 'graded':   return { label: 'Graded',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    default:         return { label: s,           color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' };
  }
};

const TeacherAssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'details' | 'testcases' | 'submissions'>('details');

  const assignment = teacherAssignments.find(a => a.id === id);
  const subs = teacherSubmissions.filter(s => s.assignmentId === id);

  if (!assignment) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Assignment not found.</p>
      <button onClick={() => navigate('/teacher/assignments')} style={{ marginTop: '12px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
    </div>
  );

  const sc = statusConfig(assignment.status);
  const pct = Math.round((assignment.submissionsCount / assignment.totalStudents) * 100);
  const avgScore = subs.filter(s => s.score != null).reduce((acc, s) => acc + (s.score ?? 0), 0) / (subs.filter(s => s.score != null).length || 1);

  const tabStyle = (t: typeof tab): React.CSSProperties => ({
    padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: tab === t ? 600 : 400,
    backgroundColor: tab === t ? 'var(--color-accent-light)' : 'transparent',
    color: tab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '900px' }}>
      <button onClick={() => navigate('/teacher/assignments')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '22px', padding: 0 }}>
        <ArrowLeft size={15} /> Back to Assignments
      </button>

      {/* Header card */}
      <Card style={{ marginBottom: '20px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{assignment.title}</h1>
              <Badge label={sc.label} color={sc.color} bg={sc.bg} />
              <span style={langBadgeStyle(assignment.language)}>{assignment.language}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{assignment.courseName}</p>
          </div>
          <button
            onClick={() => navigate(`/teacher/assignments/${id}/edit`)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer' }}
          >
            <Edit3 size={14} /> Edit
          </button>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '14px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
          {[
            { icon: <Users size={14} color="var(--color-text-muted)" />, label: 'Submissions', value: `${assignment.submissionsCount}/${assignment.totalStudents}` },
            { icon: <Clock size={14} color="var(--color-text-muted)" />, label: 'Deadline', value: assignment.deadline },
            { icon: <Code2 size={14} color="var(--color-text-muted)" />, label: 'Time Limit', value: `${assignment.timeLimit} min` },
            { icon: <CheckCircle2 size={14} color="var(--color-text-muted)" />, label: 'Max Score', value: `${assignment.maxScore} pts` },
            { icon: <ChevronRight size={14} color="var(--color-text-muted)" />, label: 'Avg Score', value: subs.filter(s=>s.score!=null).length ? `${Math.round(avgScore)}/${assignment.maxScore}` : '—' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>{s.icon}<span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</span></div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Submission progress */}
        <div style={{ marginTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Submission rate</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{pct}%</span>
          </div>
          <ProgressBar value={pct} />
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
        {(['details', 'testcases', 'submissions'] as const).map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
            {t === 'details' ? 'Details' : t === 'testcases' ? `Test Cases (${assignment.testCases.length})` : `Submissions (${subs.length})`}
          </button>
        ))}
      </div>

      {/* Details tab */}
      {tab === 'details' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>Description</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{assignment.description}</p>
          </Card>
          <Card style={{ padding: '0' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Starter Code</h2>
            </div>
            <pre style={{ margin: 0, padding: '16px 20px', fontFamily: '"Fira Code", monospace', fontSize: '12px', color: '#e6edf3', backgroundColor: '#0d1117', overflowX: 'auto', lineHeight: 1.6, borderRadius: '0 0 12px 12px' }}>
              {assignment.starterCode}
            </pre>
          </Card>
        </div>
      )}

      {/* Test cases tab */}
      {tab === 'testcases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {assignment.testCases.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No test cases defined.</p>
          )}
          {assignment.testCases.map((tc, idx) => (
            <Card key={idx} style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Test #{idx + 1}</span>
                {tc.isHidden && <Badge label="Hidden" color="#64748b" bg="rgba(100,116,139,0.12)" />}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 600 }}>INPUT</p>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-hover)', padding: '8px 10px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>{tc.input || '—'}</pre>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 600 }}>EXPECTED OUTPUT</p>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-hover)', padding: '8px 10px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>{tc.expectedOutput || '—'}</pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Submissions tab */}
      {tab === 'submissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subs.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No submissions yet.</p>}
          {subs.map(sub => {
            const ss = subStatusCfg(sub.status);
            const pctSub = sub.score != null ? Math.round((sub.score / sub.maxScore) * 100) : null;
            return (
              <div key={sub.id} style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '180px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {sub.studentAvatar}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{sub.studentName}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{new Date(sub.submittedAt).toLocaleString('en', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', minWidth: '60px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: pctSub != null && pctSub >= 60 ? '#10b981' : pctSub != null ? '#ef4444' : 'var(--color-text-muted)' }}>
                      {sub.score != null ? `${sub.score}/${sub.maxScore}` : '—'}
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Score</p>
                  </div>
                  <Badge label={ss.label} color={ss.color} bg={ss.bg} />
                  <button onClick={() => navigate(`/teacher/submissions`)} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid var(--color-accent)', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
                    Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentDetail;
