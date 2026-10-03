import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, RefreshCw, Eye } from 'lucide-react';
import { liveStudents } from '../../../data/teacherMockData';

type Filter = 'all' | 'coding' | 'online' | 'idle' | 'offline';

const statusDot = (status: string) => {
  switch (status) {
    case 'coding':  return '#10b981';
    case 'online':  return '#3b82f6';
    case 'idle':    return '#f59e0b';
    case 'offline': return '#64748b';
    default:        return '#94a3b8';
  }
};

const statusLabel: Record<string, string> = {
  coding: 'Coding', online: 'Online', idle: 'Idle', offline: 'Offline',
};

const LiveMonitor: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? liveStudents : liveStudents.filter(s => s.status === filter);
  const counts = { coding: liveStudents.filter(s=>s.status==='coding').length, online: liveStudents.filter(s=>s.status==='online').length, idle: liveStudents.filter(s=>s.status==='idle').length, offline: liveStudents.filter(s=>s.status==='offline').length };

  const filterBtnStyle = (f: Filter): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: filter === f ? 600 : 400, transition: 'all 0.15s',
    borderColor: filter === f ? 'var(--color-accent)' : 'var(--color-border)',
    backgroundColor: filter === f ? 'var(--color-accent-light)' : 'transparent',
    color: filter === f ? 'var(--color-accent)' : 'var(--color-text-secondary)',
  });

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Monitor size={18} color="var(--color-accent)" />
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            <span style={{ color: '#10b981', fontWeight: 700 }}>●</span> {counts.coding} coding &nbsp;
            <span style={{ color: '#3b82f6', fontWeight: 700 }}>●</span> {counts.online} online &nbsp;
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>●</span> {counts.idle} idle &nbsp;
            <span style={{ color: '#64748b', fontWeight: 700 }}>●</span> {counts.offline} offline
          </span>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(['all', 'coding', 'online', 'idle', 'offline'] as Filter[]).map(f => (
          <button key={f} style={filterBtnStyle(f)} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${liveStudents.length})` : `${statusLabel[f]} (${counts[f] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Student grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {filtered.map(student => {
          const dotColor = statusDot(student.status);
          const isActive = student.status !== 'offline';
          return (
            <div
              key={student.id}
              style={{ backgroundColor: 'var(--color-bg-card)', border: `1px solid ${isActive ? 'var(--color-border)' : 'var(--color-border)'}`, borderRadius: '12px', padding: '18px', opacity: student.status === 'offline' ? 0.6 : 1, transition: 'border-color 0.15s, opacity 0.15s' }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>{student.avatar}</div>
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: dotColor, border: '2px solid var(--color-bg-card)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{student.name}</p>
                    <p style={{ fontSize: '11px', color: dotColor, fontWeight: 600 }}>{statusLabel[student.status]}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/teacher/live-monitor/${student.id}`)}
                  disabled={!isActive}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '7px', border: 'none', backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-bg-hover)', color: isActive ? '#fff' : 'var(--color-text-muted)', fontSize: '12px', fontWeight: 600, cursor: isActive ? 'pointer' : 'not-allowed' }}
                >
                  <Eye size={13} /> Open Session
                </button>
              </div>

              {/* Assignment */}
              <div style={{ backgroundColor: 'var(--color-bg-hover)', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Working on</p>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{student.assignmentTitle}</p>
              </div>

              {/* Activity */}
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Current activity</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{student.currentActivity}</p>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{student.linesWritten}</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Lines</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{student.runAttempts}</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Runs</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{student.lastActivity}</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Last active</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveMonitor;
