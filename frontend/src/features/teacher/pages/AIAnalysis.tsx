import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Info, AlertCircle, Keyboard, Clipboard, Zap, RotateCcw, Play, CheckCircle, XCircle, Activity } from 'lucide-react';
import { mockSessionAnalysis } from '../../../data/teacherMockData';
import { Card, Badge, ProgressBar } from '../../../components/ui';

const severityConfig = (s: string) => {
  switch (s) {
    case 'high':   return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: <AlertCircle size={15} color="#ef4444" />,   label: 'High' };
    case 'medium': return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <AlertTriangle size={15} color="#f59e0b" />, label: 'Medium' };
    case 'low':    return { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  icon: <Info size={15} color="#6366f1" />,          label: 'Low' };
    default:       return { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', icon: <Info size={15} />,                          label: s };
  }
};

const MetricRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number; note?: string; barValue?: number; barColor?: string }> = ({ icon, label, value, note, barValue, barColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderBottom: '1px solid var(--color-border)' }}>
    <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--color-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: barValue != null ? '5px' : 0 }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{value}</span>
      </div>
      {barValue != null && <ProgressBar value={barValue} color={barColor ?? 'var(--color-accent)'} height={4} />}
      {note && <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{note}</p>}
    </div>
  </div>
);

const AIAnalysis: React.FC = () => {
  const navigate = useNavigate();

  const analysis = mockSessionAnalysis; // always use mock
  const pasteRatio = analysis.totalCharsPasted / (analysis.totalCharsTyped + analysis.totalCharsPasted);
  const successRate = analysis.successfulRuns / (analysis.runAttempts || 1);
  const hasHighSignals = analysis.signals.some(s => s.severity === 'high');

  return (
    <div style={{ maxWidth: '960px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '22px', padding: 0 }}>
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header */}
      <Card style={{ marginBottom: '20px', padding: '22px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Session Analysis</p>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>{analysis.studentName}</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{analysis.assignmentTitle} · {new Date(analysis.sessionDate).toLocaleDateString('en', { dateStyle: 'medium' })}</p>
          </div>
          {hasHighSignals ? (
            <div style={{ backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center' }}>
              <AlertTriangle size={20} color="#f59e0b" style={{ marginBottom: '4px' }} />
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>Requires Review</p>
            </div>
          ) : (
            <div style={{ backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center' }}>
              <CheckCircle size={20} color="#10b981" style={{ marginBottom: '4px' }} />
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>No Major Signals</p>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
          {[
            { label: 'Duration', value: `${analysis.durationMinutes} min` },
            { label: 'Active', value: `${analysis.activeMinutes} min` },
            { label: 'Idle', value: `${analysis.idleMinutes} min` },
            { label: 'Avg WPM', value: analysis.avgTypingSpeedWPM },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

        {/* Typing & Code Activity */}
        <Card>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>Typing & Code Activity</h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Characters typed vs pasted</p>
          <MetricRow icon={<Keyboard size={16} color="var(--color-accent)" />} label="Chars typed" value={analysis.totalCharsTyped.toLocaleString()} barValue={(1 - pasteRatio) * 100} barColor="var(--color-accent)" />
          <MetricRow icon={<Clipboard size={16} color="#f59e0b" />} label="Chars pasted" value={analysis.totalCharsPasted.toLocaleString()} barValue={pasteRatio * 100} barColor="#f59e0b" note={`${Math.round(pasteRatio * 100)}% of total input was pasted`} />
          <MetricRow icon={<Zap size={16} color="#ef4444" />} label="Paste events" value={analysis.pasteEvents} note="Large paste events: 1" />
          <MetricRow icon={<RotateCcw size={16} color="#10b981" />} label="Code revisions" value={analysis.codeRevisions} note="Edits made after writing" />
        </Card>

        {/* Run Activity */}
        <Card>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>Run Activity</h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Code execution attempts</p>
          <MetricRow icon={<Play size={16} color="var(--color-accent)" />} label="Total run attempts" value={analysis.runAttempts} />
          <MetricRow icon={<CheckCircle size={16} color="#10b981" />} label="Successful runs" value={analysis.successfulRuns} barValue={successRate * 100} barColor="#10b981" />
          <MetricRow icon={<XCircle size={16} color="#ef4444" />} label="Failed runs" value={analysis.failedRuns} barValue={(1 - successRate) * 100} barColor="#ef4444" />
          <MetricRow icon={<Activity size={16} color="#6366f1" />} label="Total keystrokes" value={analysis.totalKeystrokes.toLocaleString()} />
        </Card>
      </div>

      {/* Behavioral Signals */}
      <Card>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>Behavioral Signals</h2>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          The following signals were detected during this session. These are indicators only and <strong>do not constitute a definitive conclusion</strong>. Instructor review is recommended before taking any action.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analysis.signals.map(signal => {
            const sc = severityConfig(signal.severity);
            return (
              <div key={signal.id} style={{ backgroundColor: sc.bg, border: `1px solid ${sc.color}22`, borderRadius: '10px', padding: '16px 18px', borderLeft: `3px solid ${sc.color}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {sc.icon}
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{signal.label}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <Badge label={`${sc.label} severity`} color={sc.color} bg={`${sc.color}20`} />
                    {signal.requiresReview && <Badge label="Requires review" color="#f59e0b" bg="rgba(245,158,11,0.12)" />}
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: signal.timestamp ? '6px' : 0 }}>{signal.description}</p>
                {signal.timestamp && <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>Detected at {signal.timestamp}</p>}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '18px', padding: '12px 16px', backgroundColor: 'rgba(99,102,241,0.06)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--color-text-secondary)' }}>Disclaimer:</strong> Signals are based on automated behavioral analysis of session activity (paste events, typing patterns, run frequency). This analysis is not a determination of academic dishonesty. All signals should be reviewed by an instructor before any conclusion is made.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIAnalysis;
