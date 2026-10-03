import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { Badge, langBadgeStyle } from '../../../components/ui';
import { teacherAssignments } from '../../../data/teacherMockData';

const statusConfig = (s: string) => {
  switch (s) {
    case 'active': return { label: 'Active', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    case 'closed': return { label: 'Closed', color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
    case 'draft':  return { label: 'Draft',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    default:       return { label: s,        color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' };
  }
};

type Filter = 'all' | 'active' | 'closed' | 'draft';

const TeacherAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? teacherAssignments : teacherAssignments.filter(a => a.status === filter);

  const filterBtn = (f: Filter): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: filter === f ? 600 : 400,
    borderColor: filter === f ? 'var(--color-accent)' : 'var(--color-border)',
    backgroundColor: filter === f ? 'var(--color-accent-light)' : 'transparent',
    color: filter === f ? 'var(--color-accent)' : 'var(--color-text-secondary)',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ maxWidth: '920px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'active', 'closed', 'draft'] as Filter[]).map(f => (
            <button key={f} style={filterBtn(f)} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span style={{ marginLeft: '5px', fontSize: '11px', opacity: 0.7 }}>({(f === 'all' ? teacherAssignments : teacherAssignments.filter(a => a.status === f)).length})</span>
            </button>
          ))}
        </div>
        <button onClick={() => navigate('/teacher/assignments/create')} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={15} /> Create Assignment
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(a => {
          const sc = statusConfig(a.status);
          const pct = Math.round((a.submissionsCount / a.totalStudents) * 100);
          return (
            <div key={a.id} style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '18px 22px', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'}
              onClick={() => navigate(`/teacher/assignments/${a.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{a.title}</h3>
                    <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                    <span style={langBadgeStyle(a.language)}>{a.language}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>{a.courseName} · Due {a.deadline} · {a.maxScore} pts · {a.timeLimit} min</p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{a.description.slice(0, 100)}…</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '110px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', marginBottom: '6px' }}>
                    <Users size={12} color="var(--color-text-muted)" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{a.submissionsCount}/{a.totalStudents}</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '2px' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{pct}% submitted</p>
                </div>
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <button onClick={e => { e.stopPropagation(); navigate(`/teacher/assignments/${a.id}`); }} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer' }}>View</button>
                <button onClick={e => { e.stopPropagation(); navigate(`/teacher/assignments/${a.id}/edit`); }} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                <button onClick={e => { e.stopPropagation(); navigate('/teacher/submissions', { state: { assignmentId: a.id } }); }} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid var(--color-accent)', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>Submissions ({a.submissionsCount})</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherAssignments;
