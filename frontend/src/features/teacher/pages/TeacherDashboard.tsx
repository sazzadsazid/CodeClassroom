import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, ClipboardList, HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { Card, langBadgeStyle } from '../../../components/ui';
import {
  teacherDashboardStats, teacherCourses,
  liveStudents,
} from '../../../data/teacherMockData';

const StatCard: React.FC<{
  icon: React.ReactNode; label: string; value: number | string;
  sub: string; iconBg: string; onClick?: () => void;
}> = ({ icon, label, value, sub, iconBg, onClick }) => (
  <Card style={{ cursor: onClick ? 'pointer' : 'default', transition: 'border-color 0.15s' }}
    onClick={onClick}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ fontSize: '30px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>{sub}</p>
      </div>
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
    </div>
  </Card>
);

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const activeLive = liveStudents.filter(s => s.status === 'coding' || s.status === 'online');

  return (
    <div style={{ maxWidth: '1200px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <StatCard icon={<BookOpen size={20} color="#6366f1" />} label="My Courses" value={teacherDashboardStats.totalCourses} sub="Active this semester" iconBg="rgba(99,102,241,0.15)" onClick={() => navigate('/teacher/classes')} />
        <StatCard icon={<Users size={20} color="#10b981" />} label="Total Students" value={teacherDashboardStats.totalStudents} sub="Across all courses" iconBg="rgba(16,185,129,0.15)" onClick={() => navigate('/teacher/classes')} />
        <StatCard icon={<HelpCircle size={20} color="#ef4444" />} label="Help Requests" value={teacherDashboardStats.helpRequests} sub="Students need help" iconBg="rgba(239,68,68,0.15)" onClick={() => navigate('/teacher/monitor')} />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* My Courses */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>My Courses</h2>
              <button onClick={() => navigate('/teacher/classes')} style={{ fontSize: '13px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View all →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {teacherCourses.map(course => (
                <Card key={course.id} style={{ cursor: 'pointer', padding: '16px 20px', transition: 'border-color 0.15s' }}
                  onClick={() => navigate(`/teacher/classes/${course.id}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{course.name}</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}><Users size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} />{course.studentCount} students</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}><ClipboardList size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} />{course.assignmentCount} assignments</span>
                        {course.nextDeadline && <span style={{ fontSize: '12px', color: 'var(--color-warning)' }}>Due {course.nextDeadline}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={langBadgeStyle(course.language)}>{course.language}</span>
                      <ChevronRight size={15} color="var(--color-text-muted)" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>


        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Live Students */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Live Now
                <span style={{ marginLeft: '8px', fontSize: '12px', color: '#10b981', fontWeight: 500 }}>● {activeLive.length} active</span>
              </h2>
              <button onClick={() => navigate('/teacher/live-monitor')} style={{ fontSize: '13px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Monitor →</button>
            </div>
            <Card style={{ padding: '0' }}>
              {liveStudents.filter(s => s.status !== 'offline').slice(0, 5).map((s, idx, arr) => {
                const dotColor = s.status === 'coding' ? '#10b981' : s.status === 'online' ? '#3b82f6' : '#f59e0b';
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: idx < arr.length - 1 ? '1px solid var(--color-border)' : 'none', cursor: 'pointer' }}
                    onClick={() => navigate(`/teacher/live-monitor/${s.id}`)}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{s.avatar}</div>
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderRadius: '50%', backgroundColor: dotColor, border: '2px solid var(--color-bg-card)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.currentActivity}</p>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>


        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
