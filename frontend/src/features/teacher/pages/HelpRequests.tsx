import React from 'react';

import { Card } from '../../../components/ui';

const HELP_REQUESTS = [
  { id: 1, student: 'Alex Johnson', avatar: 'AJ', assignment: 'Binary Search Tree',  course: 'Data Structures & Algorithms', message: 'My delete() method causes a NullPointerException but I can\'t find why.', time: '2 min ago',  status: 'open' },
  { id: 2, student: 'Ethan Brown',  avatar: 'EB', assignment: 'Build a REST API',     course: 'Full-Stack Web Development',  message: 'How do I properly handle async errors in Express middleware?',           time: '15 min ago', status: 'open' },
  { id: 3, student: 'James Lee',    avatar: 'JL', assignment: 'Binary Search Tree',   course: 'Data Structures & Algorithms', message: 'I\'m confused about the difference between pre-order and in-order traversal.', time: '1h ago', status: 'resolved' },
];

const HelpRequests: React.FC = () => (
  <div style={{ maxWidth: '800px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>● {HELP_REQUESTS.filter(r => r.status === 'open').length} open</span>
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>· {HELP_REQUESTS.length} total</span>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {HELP_REQUESTS.map(req => (
        <Card key={req.id} style={{ padding: '18px 22px', borderLeft: `3px solid ${req.status === 'open' ? '#ef4444' : '#10b981'}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{req.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{req.student}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{req.time}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', backgroundColor: req.status === 'open' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: req.status === 'open' ? '#ef4444' : '#10b981' }}>
                    {req.status === 'open' ? 'Open' : 'Resolved'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{req.course} · {req.assignment}</p>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{req.message}</p>
              {req.status === 'open' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button style={{ padding: '6px 16px', borderRadius: '7px', border: 'none', backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Respond</button>
                  <button style={{ padding: '6px 16px', borderRadius: '7px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer' }}>Mark Resolved</button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default HelpRequests;
