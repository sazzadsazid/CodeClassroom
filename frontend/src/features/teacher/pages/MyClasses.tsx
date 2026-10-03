import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, BookOpen } from 'lucide-react';
import { Badge, langBadgeStyle } from '../../../components/ui';
import { teacherCourses } from '../../../data/teacherMockData';

const statusConfig = (status: string) => {
  switch (status) {
    case 'active':   return { label: 'Active',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    case 'archived': return { label: 'Archived', color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
    case 'draft':    return { label: 'Draft',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
    default:         return { label: status,     color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' };
  }
};

const MyClasses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/teacher/classes/new')}
          style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          + New Course
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
        {teacherCourses.map(course => {
          const sc = statusConfig(course.status);
          return (
            <div
              key={course.id}
              onClick={() => navigate(`/teacher/classes/${course.id}`)}
              style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              {/* Banner */}
              <div style={{ height: '72px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={28} color="var(--color-accent)" />
              </div>

              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3, flex: 1, marginRight: '8px' }}>{course.name}</h3>
                  <Badge label={sc.label} color={sc.color} bg={sc.bg} />
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{course.semester}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>{course.description.slice(0, 80)}…</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} /> {course.studentCount}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ClipboardList size={12} /> {course.assignmentCount}
                    </span>
                  </div>
                  <span style={langBadgeStyle(course.language)}>{course.language}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyClasses;
