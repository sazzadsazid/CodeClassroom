import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Code2, LayoutDashboard, LogOut, Users, BookOpen, Activity, Settings } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'users',     label: 'Users',     path: '/admin/users',     icon: <Users size={20} /> },
  { id: 'courses',   label: 'Courses',   path: '/admin/courses',   icon: <BookOpen size={20} /> },
  { id: 'activity',  label: 'Activity Logs', path: '/admin/activity', icon: <Activity size={20} /> },
  { id: 'settings',  label: 'Settings',  path: '/admin/settings',  icon: <Settings size={20} /> },
];

const ADMIN_META: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': { title: 'Admin Dashboard', subtitle: 'System overview and metrics' },
  '/admin/users':     { title: 'User Management', subtitle: 'Manage students, teachers, and admins' },
  '/admin/courses':   { title: 'Course Management', subtitle: 'View and manage all courses' },
  '/admin/activity':  { title: 'Activity Logs', subtitle: 'System-wide events and actions' },
  '/admin/settings':  { title: 'System Settings', subtitle: 'Configure platform preferences' },
};

const resolveAdminMeta = (pathname: string) => {
  return ADMIN_META[pathname] || { title: 'Admin Portal', subtitle: '' };
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/'); };
  
  const isActive = (path: string) => location.pathname.startsWith(path);
  const { title, subtitle } = resolveAdminMeta(location.pathname);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-bg-primary)' }}>

      {/* Sidebar */}
      <aside style={{ width: '240px', minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', height: '64px' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Code2 size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text-primary)' }}>CodeClassroom</span>
        </div>

        <div style={{ margin: '10px 16px', padding: '5px 10px', borderRadius: '6px', backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Portal</span>
        </div>

        <nav style={{ padding: '8px 0', flex: 1 }}>
          {NAV.map(item => {
            const active = isActive(item.path);
            return (
              <button key={item.id} onClick={() => navigate(item.path)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 20px', border: 'none', cursor: 'pointer', position: 'relative', backgroundColor: active ? 'rgba(245,158,11,0.12)' : 'transparent', color: active ? '#f59e0b' : 'var(--color-text-secondary)', transition: 'background-color 0.15s, color 0.15s', marginBottom: '1px' }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'; } }}
              >
                {active && <span style={{ position: 'absolute', left: 0, width: '3px', height: '28px', backgroundColor: '#f59e0b', borderRadius: '0 3px 3px 0' }} />}
                {item.icon}
                <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff', flexShrink: 0 }}>{user?.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.displayName}</p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Administrator</p>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '6px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <header style={{ height: '64px', backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h1>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{subtitle}</p>
          </div>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#fff' }}>{user?.avatar}</div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px', backgroundColor: 'var(--color-bg-primary)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
