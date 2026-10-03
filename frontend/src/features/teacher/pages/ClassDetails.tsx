import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, ClipboardList, TrendingUp, ChevronRight, Eye } from 'lucide-react';
import { Card, Badge, ProgressBar, langBadgeStyle } from '../../../components/ui';
import { teacherCourses, teacherStudents, teacherAssignments } from '../../../data/teacherMockData';

type Tab = 'overview' | 'students' | 'assignments';

const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const course = teacherCourses.find(c => c.id === id);
  const students = teacherStudents.filter(s => s.courseId === id);
  const assignments = teacherAssignments.filter(a => a.courseId === id);

  if (!course) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Course not found.</p>
      <button onClick={() => navigate('/teacher/classes')} style={{ marginTop: '12px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
    </div>
  );

  const avgScore = students.reduce((s, st) => s + st.avgScore, 0) / (students.length || 1);

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === t ? 600 : 400,
    backgroundColor: activeTab === t ? 'var(--color-accent-light)' : 'transparent',
    color: activeTab === t ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '960px' }}>
      <button onClick={() => navigate('/teacher/classes')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '22px', padding: 0 }}>
        <ArrowLeft size={15} /> Back to Classes
      </button>

      {/* Header */}
      <Card style={{ marginBottom: '20px', padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>{course.name}</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>{course.semester}</p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{course.description}</p>
          </div>
          <span style={langBadgeStyle(course.language)}>{course.language}</span>
        </div>
        {/* Quick stats */}
        <div style={{ display: 'flex', gap: '28px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
          {[
            { label: 'Students', value: course.studentCount, icon: <Users size={14} /> },
            { label: 'Assignments', value: course.assignmentCount, icon: <ClipboardList size={14} /> },
            { label: 'Avg Score', value: `${Math.round(avgScore)}%`, icon: <TrendingUp size={14} /> },
          ].map(stat => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{stat.icon}</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{stat.label}:</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {(['overview', 'students', 'assignments'] as Tab[]).map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Score distribution */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>Score Distribution</h3>
            {[{ label: '90–100', count: 3, color: '#10b981' }, { label: '75–89', count: 5, color: '#6366f1' }, { label: '60–74', count: 1, color: '#f59e0b' }, { label: '<60', count: 1, color: '#ef4444' }].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', width: '52px' }}>{r.label}</span>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={(r.count / students.length) * 100} color={r.color} height={5} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', width: '16px', textAlign: 'right' }}>{r.count}</span>
              </div>
            ))}
          </Card>
          {/* Submission rate */}
          <Card>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>Submissions by Assignment</h3>
            {assignments.map(a => {
              const pct = Math.round((a.submissionsCount / a.totalStudents) * 100);
              return (
                <div key={a.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{a.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', flexShrink: 0 }}>{a.submissionsCount}/{a.totalStudents}</span>
                  </div>
                  <ProgressBar value={pct} height={5} />
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* Tab: Students */}
      {activeTab === 'students' && (
        <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 90px 80px', gap: '12px', padding: '10px 18px', backgroundColor: 'var(--color-bg-hover)', borderBottom: '1px solid var(--color-border)' }}>
            {['Student', 'Progress', 'Avg Score', 'Submissions', 'Status', ''].map(h => (
              <span key={h} style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
            ))}
          </div>
          {students.map((s, idx) => {
            const dotColor = s.status === 'coding' ? '#10b981' : s.status === 'online' ? '#3b82f6' : s.status === 'idle' ? '#f59e0b' : '#64748b';
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px 90px 80px', gap: '12px', padding: '13px 18px', borderBottom: idx < students.length - 1 ? '1px solid var(--color-border)' : 'none', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{s.avatar}</div>
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor, border: '2px solid var(--color-bg-card)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.email}</p>
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{s.progress}%</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: s.avgScore >= 80 ? '#10b981' : s.avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>{s.avgScore}%</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{s.submissionsCount}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: dotColor }}>{s.status}</span>
                <button onClick={() => navigate(`/teacher/live-monitor/${s.id}`)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-accent)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={12} /> View
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Assignments */}
      {activeTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {assignments.map(a => {
            const sc = a.status === 'active' ? { label: 'Active', color: '#10b981', bg: 'rgba(16,185,129,0.12)' } : a.status === 'closed' ? { label: 'Closed', color: '#64748b', bg: 'rgba(100,116,139,0.12)' } : { label: 'Draft', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
            return (
              <Card key={a.id} style={{ cursor: 'pointer', padding: '16px 20px' }} onClick={() => navigate(`/teacher/assignments/${a.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{a.title}</p>
                      <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Due {a.deadline} · {a.submissionsCount}/{a.totalStudents} submitted · {a.maxScore} pts</p>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassDetails;
