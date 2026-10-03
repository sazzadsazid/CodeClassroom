import React, { useState } from 'react';
import { Search, BookOpen, Users, ClipboardList, Eye } from 'lucide-react';
import { Card } from '../../../components/ui';

const MOCK_COURSES = [
  { id: 1, name: 'Data Structures & Algorithms', teacher: 'David Chen', students: 45, assignments: 12, status: 'Active', created: '2023-08-15' },
  { id: 2, name: 'Full-Stack Web Development', teacher: 'Sarah Miller', students: 38, assignments: 8, status: 'Active', created: '2023-09-02' },
  { id: 3, name: 'Introduction to Python', teacher: 'Alice Williams', students: 102, assignments: 5, status: 'Draft', created: '2024-01-10' },
  { id: 4, name: 'Advanced Machine Learning', teacher: 'Dr. Robert Smith', students: 22, assignments: 4, status: 'Archived', created: '2022-01-20' },
];

const AdminCourses: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_COURSES.filter(c => 
    (filter === 'all' || c.status.toLowerCase() === filter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" placeholder="Search courses or teachers..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', fontSize: '13px', width: '300px' }} 
            />
          </div>
          
          <select 
            value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-primary)', fontSize: '13px', cursor: 'pointer' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-hover)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Course & Teacher</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Stats</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Created</th>
              <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(course => (
              <tr key={course.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(99,102,241,0.12)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{course.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Teacher: {course.teacher}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-secondary)' }}><Users size={14} /> {course.students}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-text-secondary)' }}><ClipboardList size={14} /> {course.assignments}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', 
                    backgroundColor: course.status === 'Active' ? 'rgba(16,185,129,0.12)' : course.status === 'Draft' ? 'rgba(245,158,11,0.12)' : 'rgba(100,116,139,0.12)',
                    color: course.status === 'Active' ? '#10b981' : course.status === 'Draft' ? '#f59e0b' : '#94a3b8'
                  }}>
                    {course.status}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>{course.created}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-secondary)', fontSize: '12px', cursor: 'pointer' }}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  No courses found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminCourses;
