import React from 'react';
import { LogIn, FilePlus, Send, MessageSquare, Play, Filter, Clock } from 'lucide-react';
import { Card } from '../../../components/ui';

const MOCK_LOGS = [
  { id: 1, action: 'User logged in', user: 'Alex Johnson', role: 'student', resource: 'System', time: '10:45 AM, Oct 24', icon: <LogIn size={14} />, color: '#3b82f6' },
  { id: 2, action: 'Assignment created', user: 'Sarah Miller', role: 'teacher', resource: 'Course: Full-Stack Web', time: '10:30 AM, Oct 24', icon: <FilePlus size={14} />, color: '#10b981' },
  { id: 3, action: 'Student submitted assignment', user: 'Ethan Brown', role: 'student', resource: 'Assign: REST API', time: '09:15 AM, Oct 24', icon: <Send size={14} />, color: '#6366f1' },
  { id: 4, action: 'Teacher gave feedback', user: 'David Chen', role: 'teacher', resource: 'Subm: Binary Tree', time: '08:50 AM, Oct 24', icon: <MessageSquare size={14} />, color: '#f59e0b' },
  { id: 5, action: 'Coding session started', user: 'Alex Johnson', role: 'student', resource: 'Workspace: Binary Tree', time: 'Yesterday', icon: <Play size={14} />, color: '#ec4899' },
  { id: 6, action: 'User logged in', user: 'Admin User', role: 'admin', resource: 'System', time: 'Yesterday', icon: <LogIn size={14} />, color: '#3b82f6' },
];

const AdminActivityLogs: React.FC = () => {
  return (
    <div style={{ maxWidth: '1000px' }}>
      
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>System Audit Logs</h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer' }}>
          <Filter size={14} /> Filter Logs
        </button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-hover)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', width: '30%' }}>Action</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>User</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Resource</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Date / Time</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: `${log.color}20`, color: log.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {log.icon}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{log.action}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{log.user}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{log.role}</p>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {log.resource}
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', fontSize: '12px' }}>
                    <Clock size={12} /> {log.time}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminActivityLogs;
