import React, { useState } from 'react';
import { Search, Plus, Edit2, Ban, ShieldCheck, BookOpen, User } from 'lucide-react';
import { Card } from '../../../components/ui';

const MOCK_USERS = [
  { id: 1, name: 'Alex Johnson', email: 'alex@student.edu', role: 'student', status: 'active', joined: '2023-09-01' },
  { id: 2, name: 'Sarah Miller', email: 'smiller@school.edu', role: 'teacher', status: 'active', joined: '2022-01-15' },
  { id: 3, name: 'Admin User', email: 'admin@codeclassroom.com', role: 'admin', status: 'active', joined: '2021-08-20' },
  { id: 4, name: 'Ethan Brown', email: 'ethan@student.edu', role: 'student', status: 'disabled', joined: '2023-10-12' },
  { id: 5, name: 'David Chen', email: 'dchen@school.edu', role: 'teacher', status: 'active', joined: '2023-05-05' },
];

const AdminUsers: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_USERS.filter(u => 
    (filter === 'all' || u.role === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" placeholder="Search users..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', fontSize: '13px', width: '250px' }} 
            />
          </div>
          
          <select 
            value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', fontSize: '13px', cursor: 'pointer' }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Users Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-hover)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Name</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Role</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Joined</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                      {user.role === 'ADMIN' ? <ShieldCheck size={16} /> : user.role === 'TEACHER' ? <BookOpen size={16} /> : <User size={16} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{user.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '6px', 
                    backgroundColor: user.role === 'ADMIN' ? 'rgba(245,158,11,0.12)' : user.role === 'TEACHER' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)',
                    color: user.role === 'ADMIN' ? '#f59e0b' : user.role === 'TEACHER' ? '#10b981' : '#6366f1'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: user.status === 'active' ? '#10b981' : '#ef4444' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'active' ? '#10b981' : '#ef4444' }} />
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{user.joined}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button style={{ padding: '6px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-muted)', cursor: 'pointer' }} title="Edit User">
                      <Edit2 size={14} />
                    </button>
                    <button style={{ padding: '6px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', color: user.status === 'active' ? '#ef4444' : '#10b981', cursor: 'pointer' }} title={user.status === 'active' ? 'Disable User' : 'Enable User'}>
                      <Ban size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminUsers;
