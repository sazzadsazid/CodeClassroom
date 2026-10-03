import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  // ─── Student ───────────────────────────────────────────────────────────
  '/':              { title: 'Dashboard',        subtitle: 'Welcome back, Alex 👋' },
  '/courses':       { title: 'My Courses',        subtitle: 'Track your learning progress' },
  '/assignments':   { title: 'Assignments',       subtitle: 'Manage your tasks and deadlines' },
  '/history':       { title: 'Coding History',    subtitle: 'Your coding activity over time' },
  '/submissions':   { title: 'Submissions',       subtitle: 'Review your submitted work' },
  '/notifications': { title: 'Notifications',     subtitle: 'Stay up to date' },
  // ─── Teacher ───────────────────────────────────────────────────────────
  '/teacher':                  { title: 'Teacher Dashboard',  subtitle: 'Overview of your courses and students' },
  '/teacher/classes':          { title: 'My Classes',          subtitle: 'Manage your courses and students' },
  '/teacher/monitor':          { title: 'Live Monitor',        subtitle: 'Watch students code in real time' },
  '/teacher/assignments':      { title: 'Assignments',         subtitle: 'Manage assignments across all courses' },
  '/teacher/assignments/create': { title: 'Create Assignment', subtitle: 'Define a new coding assignment' },
  '/teacher/submissions':      { title: 'Submissions',         subtitle: 'Review and grade student submissions' },
};

const resolvePageMeta = (pathname: string): { title: string; subtitle: string } => {
  // Exact match first
  if (pageMeta[pathname]) return pageMeta[pathname];

  // Teacher sub-pages
  if (pathname === '/teacher') return pageMeta['/teacher'];
  if (pathname.startsWith('/teacher/classes/')) return { title: 'Class Details',          subtitle: 'Course overview, students, and assignments' };
  if (pathname.startsWith('/teacher/monitor/'))  return { title: 'Student Live Session',   subtitle: 'Observe and assist a student in real time' };
  if (pathname.startsWith('/teacher/replay/'))   return { title: 'Session Replay',         subtitle: 'Replay a recorded coding session' };
  if (pathname.startsWith('/teacher/analysis/')) return { title: 'AI Analysis',            subtitle: 'Behavioral signals and session metrics' };
  if (pathname.startsWith('/teacher/assignments/') && pathname.endsWith('/edit')) return { title: 'Edit Assignment', subtitle: 'Modify assignment details' };
  if (pathname.startsWith('/teacher/assignments/')) return { title: 'Assignment Details',  subtitle: 'View details, test cases, and submissions' };
  if (pathname.startsWith('/teacher/submissions/')) return { title: 'Submission Review',   subtitle: 'Grade and leave feedback' };

  // Student sub-pages
  if (pathname.startsWith('/assignments/') && !pathname.includes('/workspace'))
    return { title: 'Assignment Details', subtitle: 'Review requirements and start coding' };
  if (pathname.includes('/workspace'))
    return { title: 'Coding Workspace', subtitle: 'Write and test your solution' };
  if (pathname.startsWith('/courses/'))
    return { title: 'Course Details', subtitle: 'Your course overview' };

  // Prefix match for student routes
  for (const [key, val] of Object.entries(pageMeta)) {
    if (key !== '/' && pathname.startsWith(key)) return val;
  }

  return { title: 'CodeClassroom', subtitle: '' };
};

const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const { title, subtitle } = resolvePageMeta(location.pathname);

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10,
      }}
    >
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '1px' }}>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '7px 14px', width: '220px' }}>
          <Search size={15} color="var(--color-text-muted)" />
          <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', fontSize: '13px', width: '100%' }} />
        </div>

        {/* Bell */}
        <button
          onClick={() => navigate('/notifications')}
          style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s, color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'; }}
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', border: '2px solid var(--color-bg-secondary)' }} />
          )}
        </button>

        {/* Settings */}
        <button
          style={{ width: '38px', height: '38px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s, color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'; }}
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
