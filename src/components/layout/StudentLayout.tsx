import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, History,
  Send, Bell, Code2, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { mockNotifications } from '../../data/mockData';

const NAV = [
  { id: 'dashboard',     label: 'Dashboard',      path: '/student/dashboard',       icon: <LayoutDashboard size={20} /> },
  { id: 'courses',       label: 'My Courses',      path: '/student/courses',         icon: <BookOpen size={20} /> },
  { id: 'assignments',   label: 'Assignments',     path: '/student/assignments',     icon: <ClipboardList size={20} /> },
  { id: 'history',       label: 'Coding History',  path: '/student/coding-history',  icon: <History size={20} /> },
  { id: 'submissions',   label: 'Submissions',     path: '/student/submissions',     icon: <Send size={20} /> },
];

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/student/dashboard') return location.pathname === '/student/dashboard' || location.pathname === '/student';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-bg-primary)' }}>

      {/* Sidebar */}
      <aside style={{ width: collapsed ? '72px' : '240px', minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', height: '64px' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate('/student/dashboard')}>
            <Code2 size={18} color="#fff" />
          </div>
          {!collapsed && <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => navigate('/student/dashboard')}>CodeClassroom</span>}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div style={{ margin: '10px 16px', padding: '5px 10px', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Student Portal</span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ padding: '8px 0', flex: 1 }}>
          {NAV.map(item => {
            const active = isActive(item.path);
            const badge = undefined;
            return (
              <button key={item.id} onClick={() => navigate(item.path)} title={collapsed ? item.label : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: collapsed ? '11px 0' : '10px 20px', justifyContent: collapsed ? 'center' : 'flex-start', border: 'none', cursor: 'pointer', position: 'relative', backgroundColor: active ? 'var(--color-accent-light)' : 'transparent', color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)', transition: 'background-color 0.15s, color 0.15s', marginBottom: '1px' }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'; } }}
              >
                {active && <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '60%', backgroundColor: 'var(--color-accent)', borderRadius: '0 3px 3px 0' }} />}
                <span style={{ flexShrink: 0, display: 'flex', position: 'relative' }}>
                  {item.icon}
                  {collapsed && badge != null && badge > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>{badge}</span>}
                </span>
                {!collapsed && (
                  <>
                    <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400, flex: 1, textAlign: 'left' }}>{item.label}</span>
                    {badge != null && badge > 0 && <span style={{ backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '10px', padding: '1px 7px' }}>{badge}</span>}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(c => !c)} style={{ margin: '8px auto', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        {/* User + logout */}
        <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: '1px solid var(--color-border)' }}>
          {!collapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff', flexShrink: 0 }}>{user?.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName}</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Student</p>
              </div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '6px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff' }}>{user?.avatar}</div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <StudentTopNav />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px', backgroundColor: 'var(--color-bg-primary)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

// ── Student TopNav ──────────────────────────────────────────────────────────
const STUDENT_META: Record<string, { title: string; subtitle: string }> = {
  '/student/dashboard':      { title: 'Dashboard',      subtitle: 'Welcome back 👋' },
  '/student/courses':        { title: 'My Courses',      subtitle: 'Track your learning progress' },
  '/student/assignments':    { title: 'Assignments',     subtitle: 'Manage your tasks and deadlines' },
  '/student/coding-history': { title: 'Coding History',  subtitle: 'Your coding activity over time' },
  '/student/submissions':    { title: 'Submissions',     subtitle: 'Review your submitted work' },
  '/student/notifications':  { title: 'Notifications',   subtitle: 'Stay up to date' },
};

const resolveStudentMeta = (pathname: string) => {
  if (STUDENT_META[pathname]) return STUDENT_META[pathname];
  if (pathname.startsWith('/student/assignments/') && !pathname.includes('/workspace'))
    return { title: 'Assignment Details', subtitle: 'Review requirements and start coding' };
  if (pathname.includes('/workspace'))
    return { title: 'Coding Workspace', subtitle: 'Write and test your solution' };
  return { title: 'CodeClassroom', subtitle: '' };
};

const StudentTopNav: React.FC = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { title, subtitle } = resolveStudentMeta(location.pathname);
  const unread = mockNotifications.filter(n => !n.read).length;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{ height: '64px', backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{title}</h1>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '1px' }}>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button onClick={() => setShowDropdown(!showDropdown)} style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={17} />
            {unread > 0 && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', border: '2px solid var(--color-bg-secondary)' }} />}
          </button>
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '320px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 100 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Notifications</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-accent)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {mockNotifications.length > 0 ? mockNotifications.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', backgroundColor: n.read ? 'transparent' : 'var(--color-bg-hover)', cursor: 'pointer' }}>
                    <p style={{ fontSize: '13px', fontWeight: n.read ? 500 : 600, color: 'var(--color-text-primary)' }}>{n.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{n.message}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>{new Date(n.timestamp).toLocaleDateString()}</p>
                  </div>
                )) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentLayout;
