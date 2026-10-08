import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, History, Bell,
  Code2, ChevronLeft, ChevronRight, Monitor, GraduationCap,
  BarChart2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const studentNavItems: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',      path: '/',               icon: <LayoutDashboard size={20} /> },
  { id: 'courses',       label: 'My Courses',      path: '/courses',        icon: <BookOpen size={20} /> },
  { id: 'exams',         label: 'Exams',           path: '/exams',          icon: <ClipboardList size={20} /> },
  { id: 'history',       label: 'Coding History',  path: '/history',        icon: <History size={20} /> },
  { id: 'notifications', label: 'Notifications',   path: '/notifications',  icon: <Bell size={20} /> },
];

const teacherNavItems: NavItem[] = [
  { id: 'teacher-dashboard',   label: 'Dashboard',       path: '/teacher',                  icon: <LayoutDashboard size={20} /> },
  { id: 'teacher-classes',     label: 'My Classes',      path: '/teacher/classes',          icon: <GraduationCap size={20} /> },
  { id: 'teacher-exams',       label: 'Exams',           path: '/teacher/exams',            icon: <ClipboardList size={20} /> },
  { id: 'teacher-monitor',     label: 'Live Monitor',    path: '/teacher/monitor',          icon: <Monitor size={20} /> },
  { id: 'teacher-analysis',    label: 'AI Analysis',     path: '/teacher/analysis/ts1',    icon: <BarChart2 size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const isTeacherPath = location.pathname.startsWith('/teacher');
  const [teacherExpanded, setTeacherExpanded] = useState(isTeacherPath);

  const isActive = (item: NavItem): boolean => {
    if (item.path === '/') return location.pathname === '/';
    if (item.path === '/teacher') return location.pathname === '/teacher';
    return location.pathname.startsWith(item.path);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);
    const badge = item.id === 'notifications' ? unreadCount : item.badge;
    return (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        title={collapsed ? item.label : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
          padding: collapsed ? '11px 0' : '10px 20px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          border: 'none', cursor: 'pointer', borderRadius: '0', position: 'relative',
          backgroundColor: active ? 'var(--color-accent-light)' : 'transparent',
          color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          transition: 'background-color 0.15s, color 0.15s',
          marginBottom: '1px',
        }}
        onMouseEnter={e => {
          if (!active) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-hover)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
          }
        }}
      >
        {active && (
          <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '60%', backgroundColor: 'var(--color-accent)', borderRadius: '0 3px 3px 0' }} />
        )}
        <span style={{ flexShrink: 0, display: 'flex', position: 'relative' }}>
          {item.icon}
          {collapsed && badge != null && badge > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>{badge}</span>
          )}
        </span>
        {!collapsed && (
          <>
            <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400, flex: 1, textAlign: 'left' }}>{item.label}</span>
            {badge != null && badge > 0 && (
              <span style={{ backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '10px', padding: '1px 7px', minWidth: '20px', textAlign: 'center' }}>{badge}</span>
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <aside style={{
      width: collapsed ? '72px' : '240px', height: '100dvh',
      backgroundColor: 'var(--color-bg-secondary)', borderRight: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', flexShrink: 0, position: 'relative',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 0' : '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', height: '64px' }}>
        <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Code2 size={18} color="#fff" />
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-text-primary)', letterSpacing: '-0.3px', whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => navigate('/')}>
            CodeClassroom
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>

        {/* Student section label */}
        {!collapsed && (
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 20px 4px', marginBottom: '2px' }}>Student</p>
        )}

        {studentNavItems.map(renderNavItem)}

        {/* Teacher section */}
        <div style={{ marginTop: '8px' }}>
          {/* Divider / toggle */}
          {!collapsed ? (
            <button
              onClick={() => setTeacherExpanded(e => !e)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '6px 20px 4px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '2px' }}
            >
              <p style={{ fontSize: '10px', fontWeight: 700, color: isTeacherPath ? 'var(--color-accent)' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Teacher
              </p>
              {teacherExpanded ? <ChevronUp size={12} color="var(--color-text-muted)" /> : <ChevronDown size={12} color="var(--color-text-muted)" />}
            </button>
          ) : (
            <div style={{ margin: '8px 0', borderTop: '1px solid var(--color-border)' }} />
          )}

          {(teacherExpanded || collapsed) && teacherNavItems.map(renderNavItem)}
        </div>
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ margin: '12px auto', width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.15s, color 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-hover)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-bg-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)'; }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        {/* User profile */}
        {!collapsed ? (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#fff', flexShrink: 0 }}>SC</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dr. Sarah Chen</p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Teacher</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 0', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#fff' }}>SC</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
