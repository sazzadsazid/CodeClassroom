import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Code2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';

const ROLE_HOME: Record<UserRole, string> = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  admin:   '/admin/dashboard',
};

const DEMO_BADGES = [
  { role: 'student', label: 'Student',  user: 'student', pass: 'student123', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)' },
  { role: 'teacher', label: 'Teacher',  user: 'teacher', pass: 'teacher123', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  { role: 'admin',   label: 'Admin',    user: 'admin',   pass: 'admin123',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)'  },
];

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in → redirect to their portal
  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: Location })?.from?.pathname;
      navigate(from && from !== '/login' ? from : ROLE_HOME[user.role], { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Small artificial delay for UX
    setTimeout(() => {
      const result = login(username.trim(), password);
      if (!result.success) {
        setError(result.error ?? 'Login failed.');
      }
      setLoading(false);
    }, 350);
  };

  const fillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '9px',
    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-hover)',
    color: 'var(--color-text-primary)', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Code2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '5px' }}>Sign in to CodeClassroom</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Enter your credentials to access your portal.</p>
        </div>

        {/* Demo badges */}
        <div style={{ marginBottom: '22px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', textAlign: 'center' }}>Quick demo login</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {DEMO_BADGES.map(b => (
              <button
                key={b.role}
                onClick={() => fillDemo(b.user, b.pass)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${b.border}`, backgroundColor: b.bg, color: b.color, fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Username</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username" required autoFocus autoComplete="username"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: '42px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                />
                <button
                  type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px' }}>
                <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: '#ef4444' }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: loading ? 'var(--color-bg-hover)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: loading ? 'var(--color-text-muted)' : '#fff', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px', transition: 'opacity 0.15s' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
            ← Back to Home
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
