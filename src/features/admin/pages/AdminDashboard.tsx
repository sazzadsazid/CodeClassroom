import React from 'react';
import { Users, BookOpen, ClipboardList, Activity, ShieldCheck, Play } from 'lucide-react';
import { Card } from '../../../components/ui';

const RECENT_ACTIVITY = [
  { id: 1, action: 'User login', user: 'Alex Johnson (Student)', time: '2 min ago', icon: <Users size={14} /> },
  { id: 2, action: 'Assignment created', user: 'Sarah Miller (Teacher)', time: '15 min ago', icon: <ClipboardList size={14} /> },
  { id: 3, action: 'Course updated', user: 'David Chen (Teacher)', time: '1 hour ago', icon: <BookOpen size={14} /> },
  { id: 4, action: 'System maintenance', user: 'Admin System', time: '3 hours ago', icon: <ShieldCheck size={14} /> },
];

const AdminDashboard: React.FC = () => (
  <div style={{ maxWidth: '1000px' }}>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
      {[
        { label: 'Total Students', value: '1,248', icon: <Users size={22} color="#f59e0b" />,     bg: 'rgba(245,158,11,0.12)' },
        { label: 'Total Teachers', value: '84',    icon: <ShieldCheck size={22} color="#6366f1" />, bg: 'rgba(99,102,241,0.12)' },
        { label: 'Total Courses',  value: '142',   icon: <BookOpen size={22} color="#10b981" />,  bg: 'rgba(16,185,129,0.12)' },
        { label: 'Active Sessions',value: '24',    icon: <Play size={22} color="#3b82f6" />,      bg: 'rgba(59,130,246,0.12)' },
      ].map(s => (
        <Card key={s.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</p>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
          </div>
        </Card>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
      
      {/* Platform Activity Chart (Mock) */}
      <Card style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="var(--color-accent)" /> System Usage Over Time
        </h3>
        <div style={{ flex: 1, border: '1px dashed var(--color-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-hover)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>[ Activity Chart Placeholder ]</p>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Recent Activity</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '12px', cursor: 'pointer' }}>View All</button>
        </div>
        <div>
          {RECENT_ACTIVITY.map((act, i) => (
            <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px 20px', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {act.icon}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{act.action}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{act.user}</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  </div>
);

export default AdminDashboard;
