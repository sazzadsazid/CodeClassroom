import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Flame,
  Code2,
  ArrowRight,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import {
  mockStats,
  mockCourses,
  recentActivity,
  mockNotifications,
} from '../../../data/mockData';

// ─── Helper components ────────────────────────────────────────────────────

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '20px',
      ...style,
    }}
  >
    {children}
  </div>
);

const Badge: React.FC<{ label: string; color: string; bg: string }> = ({ label, color, bg }) => (
  <span
    style={{
      backgroundColor: bg,
      color,
      fontSize: '11px',
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: '6px',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

const ProgressBar: React.FC<{ value: number; color?: string }> = ({
  value,
  color = 'var(--color-accent)',
}) => (
  <div
    style={{
      width: '100%',
      height: '6px',
      backgroundColor: 'var(--color-bg-hover)',
      borderRadius: '3px',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: `${value}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: '3px',
        transition: 'width 0.4s ease',
      }}
    />
  </div>
);

const difficultyColor = (d: string) => {
  if (d === 'Beginner' || d === 'Easy') return { color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
  if (d === 'Intermediate' || d === 'Medium') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
  return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
};


const langColor = (lang: string) => {
  const map: Record<string, string> = {
    Java: '#f89820',
    TypeScript: '#3178c6',
    Python: '#3572a5',
    Multiple: '#8b5cf6',
  };
  return map[lang] ?? '#6366f1';
};

// ─── Stat Card ────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  iconBg: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, iconBg }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>{sub}</p>
      </div>
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

// ─── Section Header ───────────────────────────────────────────────────────
const SectionHeader: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({
  title,
  action,
  onAction,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
    <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h2>
    {action && (
      <button
        onClick={onAction}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          color: 'var(--color-accent)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        {action}
        <ArrowRight size={14} />
      </button>
    )}
  </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const unreadNotifications = mockNotifications.filter((n) => !n.read);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px' }}>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        <StatCard
          icon={<BookOpen size={20} color="#6366f1" />}
          label="Enrolled Courses"
          value={mockStats.totalCourses}
          sub="Active this semester"
          iconBg="rgba(99,102,241,0.15)"
        />
        <StatCard
          icon={<CheckCircle2 size={20} color="#10b981" />}
          label="Completed"
          value={mockStats.completedAssignments}
          sub="Assignments done"
          iconBg="rgba(16,185,129,0.15)"
        />
        <StatCard
          icon={<ClipboardList size={20} color="#8b5cf6" />}
          label="Active Exams"
          value={1}
          sub="Ready to take"
          iconBg="rgba(139,92,246,0.15)"
        />

        <StatCard
          icon={<TrendingUp size={20} color="#3b82f6" />}
          label="Avg. Score"
          value={`${mockStats.averageScore}%`}
          sub="Across all assignments"
          iconBg="rgba(59,130,246,0.15)"
        />
        <StatCard
          icon={<Flame size={20} color="#ef4444" />}
          label="Day Streak"
          value={`${mockStats.currentStreak}🔥`}
          sub="Keep it going!"
          iconBg="rgba(239,68,68,0.15)"
        />
        <StatCard
          icon={<Code2 size={20} color="#8b5cf6" />}
          label="Coding Hours"
          value={mockStats.totalCodingHours}
          sub="Total logged time"
          iconBg="rgba(139,92,246,0.15)"
        />
      </div>

      {/* ── Main two-column section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Active Courses */}
          <div>
            <SectionHeader
              title="Active Courses"
              action="View all"
              onAction={() => navigate('/student/courses')}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockCourses.map((course) => (
                <Card
                  key={course.id}
                  style={{
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {course.title}
                        </h3>
                        <Badge
                          {...difficultyColor(course.difficulty)}
                          label={course.difficulty}
                        />
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {course.instructor}
                      </p>
                    </div>
                    <span
                      style={{
                        marginLeft: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: langColor(course.language),
                        backgroundColor: `${langColor(course.language)}1a`,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        flexShrink: 0,
                      }}
                    >
                      {course.language}
                    </span>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {course.completedLessons} / {course.totalLessons} lessons
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        {course.progress}%
                      </span>
                    </div>
                    <ProgressBar value={course.progress} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Next: <span style={{ color: 'var(--color-text-secondary)' }}>{course.nextLesson}</span>
                    </span>
                    <ChevronRight size={15} color="var(--color-text-muted)" />
                  </div>
                </Card>
              ))}
            </div>
          </div>


        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Weekly Activity */}
          <div>
            <SectionHeader
              title="Weekly Activity"
              action="Full history"
              onAction={() => navigate('/student/coding-history')}
            />
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { day: 'Mon', problems: 2, active: true },
                  { day: 'Tue', problems: 0, active: false },
                  { day: 'Wed', problems: 3, active: true },
                  { day: 'Thu', problems: 1, active: true },
                  { day: 'Fri', problems: 2, active: true },
                  { day: 'Sat', problems: 5, active: true },
                  { day: 'Sun', problems: 2, active: true },
                ].map((d) => (
                  <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', width: '28px' }}>
                      {d.day}
                    </span>
                    <div style={{ flex: 1 }}>
                      <ProgressBar
                        value={d.active ? (d.problems / 5) * 100 : 0}
                        color={d.active ? 'var(--color-accent)' : 'var(--color-border)'}
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', width: '20px', textAlign: 'right' }}>
                      {d.problems}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: '14px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>15</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Problems</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>6.5h</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Coding time</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>5🔥</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Day streak</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <SectionHeader title="Recent Activity" />
            <Card style={{ padding: '0' }}>
              {recentActivity.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px 18px',
                    borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                      flexShrink: 0,
                      marginTop: '5px',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{item.action}</span>{' '}
                      <span style={{ fontWeight: 500 }}>{item.target}</span>
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Unread Notifications */}
          <div>
            <SectionHeader
              title="Notifications"
              action="View all"
              onAction={() => navigate('/student/notifications')}
            />
            <Card style={{ padding: '0' }}>
              {unreadNotifications.slice(0, 3).map((n, idx) => (
                <div
                  key={n.id}
                  style={{
                    padding: '14px 18px',
                    borderBottom: idx < Math.min(unreadNotifications.length, 3) - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        flexShrink: 0,
                        marginTop: '5px',
                      }}
                    />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                        {n.title}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {unreadNotifications.length === 0 && (
                <p style={{ padding: '16px 18px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  All caught up! No new notifications.
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
