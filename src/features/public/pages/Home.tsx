import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, BookOpen, Monitor, BarChart2, Users, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: <Code2 size={24} color="#6366f1" />,
    bg: 'rgba(99,102,241,0.12)',
    title: 'Live Coding Environment',
    desc: 'Students write, run, and test code directly in the browser with Monaco Editor.',
  },
  {
    icon: <Monitor size={24} color="#10b981" />,
    bg: 'rgba(16,185,129,0.12)',
    title: 'Real-Time Monitoring',
    desc: 'Teachers observe active coding sessions, view progress, and step in to assist.',
  },
  {
    icon: <BarChart2 size={24} color="#a78bfa" />,
    bg: 'rgba(167,139,250,0.12)',
    title: 'AI-Assisted Analysis',
    desc: 'Behavioral signals flag unusual activity so instructors can review with context.',
  },
  {
    icon: <BookOpen size={24} color="#f59e0b" />,
    bg: 'rgba(245,158,11,0.12)',
    title: 'Course Management',
    desc: 'Organise courses, assignments, and deadlines all in one structured workspace.',
  },
  {
    icon: <Users size={24} color="#3b82f6" />,
    bg: 'rgba(59,130,246,0.12)',
    title: 'Multi-Role Portals',
    desc: 'Separate, role-specific dashboards for Students, Teachers, and Administrators.',
  },
  {
    icon: <ShieldCheck size={24} color="#ef4444" />,
    bg: 'rgba(239,68,68,0.12)',
    title: 'Session Replay',
    desc: 'Replay any coding session event-by-event to review how work was completed.',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Nav bar ────────────────────────────────────────────────────── */}
      <nav style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '17px', color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>CodeClassroom</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Login
        </button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px' }}>
        {/* Pill badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '20px', backgroundColor: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '28px' }}>
          <Zap size={13} color="#a78bfa" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#a78bfa' }}>The next-gen programming education platform</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px', maxWidth: '800px' }}>
          Where code meets{' '}
          <span style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            classroom
          </span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', maxWidth: '540px', lineHeight: 1.7, marginBottom: '40px' }}>
          CodeClassroom brings real-time coding assignments, live monitoring, and intelligent session analysis to modern programming education.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 30px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(99,102,241,0.4)', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.4)'; }}
          >
            Get Started <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '13px 30px', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            See Features
          </button>
        </div>

        {/* Role pills */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { role: 'Students', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)' },
            { role: 'Teachers', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
            { role: 'Admins',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
          ].map(r => (
            <div key={r.role} style={{ padding: '6px 16px', borderRadius: '20px', backgroundColor: r.bg, border: `1px solid ${r.border}`, fontSize: '13px', fontWeight: 600, color: r.color }}>
              {r.role}
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid ───────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '64px 48px', backgroundColor: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '8px' }}>Everything you need</h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '44px' }}>Built for every role in the programming classroom.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '18px' }}>
            {FEATURES.map((f, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '24px', transition: 'border-color 0.2s, transform 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA footer ─────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '12px' }}>Ready to get started?</h2>
        <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', marginBottom: '28px' }}>Log in and access your portal instantly.</p>
        <button
          onClick={() => navigate('/login')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 32px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}
        >
          Login to CodeClassroom <ArrowRight size={16} />
        </button>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer style={{ padding: '18px 48px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={13} color="#fff" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>CodeClassroom</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>© 2026 CodeClassroom. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
