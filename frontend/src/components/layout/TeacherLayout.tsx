import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, GraduationCap, Monitor, ClipboardList,
  HelpCircle, Code2,
  ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',      path: '/teacher/dashboard',     icon: <LayoutDashboard size={20} /> },
  { id: 'classes',      label: 'My Classes',      path: '/teacher/classes',       icon: <GraduationCap size={20} /> },
  { id: 'monitor',      label: 'Live Monitor',    path: '/teacher/live-monitor',  icon: <Monitor size={20} /> },
  { id: 'exams',        label: 'Exams',           path: '/teacher/exams',         icon: <ClipboardList size={20} /> },
  { id: 'help',         label: 'Help Requests',   path: '/teacher/help-requests', icon: <HelpCircle size={20} /> },
];

const TEACHER_META: Record<string, { title: string; subtitle: string }> = {
  '/teacher/dashboard':      { title: 'Teacher Dashboard',  subtitle: 'Overview of your courses and students' },
  '/teacher/classes':        { title: 'My Classes',          subtitle: 'Manage your courses and students' },
  '/teacher/live-monitor':   { title: 'Live Monitor',        subtitle: 'Watch students code in real time' },
  '/teacher/exams':          { title: 'Exams',               subtitle: 'Manage exams across all courses' },
  '/teacher/session-replay': { title: 'Session Replay',      subtitle: 'Replay recorded coding sessions' },
  '/teacher/ai-analysis':    { title: 'AI Analysis',         subtitle: 'Behavioral signals and session metrics' },
  '/teacher/help-requests':  { title: 'Help Requests',       subtitle: 'Students asking for assistance' },
};

const resolveTeacherMeta = (pathname: string) => {
  if (TEACHER_META[pathname]) return TEACHER_META[pathname];
  if (pathname.startsWith('/teacher/classes/'))             return { title: 'Class Details',        subtitle: 'Course overview, students, and exams' };
  if (pathname.startsWith('/teacher/live-monitor/'))        return { title: 'Student Live Session', subtitle: 'Observe and assist a student in real time' };
  if (pathname.startsWith('/teacher/session-replay/'))      return { title: 'Session Replay',       subtitle: 'Replay a recorded coding session' };
  if (pathname.startsWith('/teacher/ai-analysis/'))         return { title: 'AI Analysis',          subtitle: 'Behavioral signals and session metrics' };
  if (pathname.startsWith('/teacher/exams/create'))         return { title: 'Create Exam',         subtitle: 'Define a new coding exam' };
  if (pathname.startsWith('/teacher/exams/'))               return { title: 'Exam Details',        subtitle: 'View details, test cases, and submissions' };
  if (pathname.startsWith('/teacher/submissions/'))         return { title: 'Submission Review',   subtitle: 'Grade and leave feedback' };
  return { title: 'Teacher Portal', subtitle: '' };
};

const TeacherLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/teacher/dashboard') return location.pathname === '/teacher/dashboard' || location.pathname === '/teacher';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const { title, subtitle } = resolveTeacherMeta(location.pathname);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-bg-primary)' }}>

      {/* Sidebar */}
      <aside style={{ width: collapsed ? '72px' : '240px', minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', height: '64px' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate('/teacher/dashboard')}>
            <Code2 size={18} color="#fff" />
          </div>
          {!collapsed && <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => navigate('/teacher/dashboard')}>CodeClassroom</span>}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div style={{ margin: '10px 16px', padding: '5px 10px', borderRadius: '6px', backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Teacher Portal</span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ padding: '8px 0', flex: 1 }}>
          {NAV.map(item => {
            const active = isActive(item.path);
            return (
              <button key={item.id} onClick={() => navigate(item.path)} title={collapsed ? item.label : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: collapsed ? '11px 0' : '10px 20px', justifyContent: collapsed ? 'center' : 'flex-start', border: 'none', cursor: 'pointer', position: 'relative', backgroundColor: active ? 'rgba(16,185,129,0.12)' : 'transparent', color: active ? '#10b981' : 'var(--color-text-secondary)', transition: 'background-color 0.15s, color 0.15s', marginBottom: '1px' }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'; } }}
              >
                {active && <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '60%', backgroundColor: '#10b981', borderRadius: '0 3px 3px 0' }} />}
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400, flex: 1, textAlign: 'left' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse */}
        <button onClick={() => setCollapsed(c => !c)} style={{ margin: '8px auto', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        {/* User + logout */}
        <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid var(--color-border)' }}>
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff', flexShrink: 0 }}>{user?.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName}</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Teacher</p>
              </div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '6px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff' }}>{user?.avatar}</div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* TopNav */}
        <header style={{ height: '64px', backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{title}</h1>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '1px' }}>{subtitle}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff', cursor: 'default' }}>{user?.avatar}</div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px', backgroundColor: 'var(--color-bg-primary)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
