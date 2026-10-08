import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { liveStudents, mockCodingEvents, replayCodeSnapshots } from '../../../data/teacherMockData';
import { Badge, getMonacoLanguage } from '../../../components/ui';

const SPEEDS = [0.5, 1, 1.5, 2];

const eventTypeStyle = (type: string): { color: string; bg: string; label: string } => {
  switch (type) {
    case 'type':          return { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',   label: 'Type' };
    case 'paste':         return { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   label: 'Paste' };
    case 'delete':        return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    label: 'Delete' };
    case 'run':           return { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',   label: 'Run' };
    case 'compile_error': return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    label: 'Error' };
    case 'run_success':   return { color: '#10b981', bg: 'rgba(16,185,129,0.12)',   label: '✓ Pass' };
    case 'run_fail':      return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    label: '✗ Fail' };
    case 'idle':          return { color: '#64748b', bg: 'rgba(100,116,139,0.12)',  label: 'Idle' };
    default:              return { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)',  label: type };
  }
};

const SessionReplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const student = liveStudents.find(s => s.id === id);
  const events = mockCodingEvents;
  const totalDuration = events[events.length - 1]?.offsetSeconds ?? 840;

  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEvent = events[currentEventIdx];

  // Get the most recent code snapshot at or before current event
  const getCodeForEvent = (idx: number): string => {
    for (let i = idx; i >= 0; i--) {
      const snap = replayCodeSnapshots[events[i].id];
      if (snap) return snap;
    }
    return '// Session starting...';
  };

  const currentCode = getCodeForEvent(currentEventIdx);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + speed;
          // Advance event if we've passed it
          setCurrentEventIdx(ei => {
            const nextEi = events.findIndex(e => e.offsetSeconds > next);
            return nextEi === -1 ? events.length - 1 : Math.max(ei, nextEi - 1);
          });
          if (next >= totalDuration) { setPlaying(false); return totalDuration; }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, events, totalDuration]);

  const seek = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, events.length - 1));
    setCurrentEventIdx(clamped);
    setCurrentTime(events[clamped].offsetSeconds);
    setPlaying(false);
  };

  const progressPct = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '18px', padding: 0 }}>
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 22px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Session Replay — {student?.name ?? 'Student'}</p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{student?.assignmentTitle} · {events.length} events · {formatTime(totalDuration)} total</p>
        </div>
        <Badge label="Replay Mode" color="#6366f1" bg="rgba(99,102,241,0.12)" />
      </div>

      {/* Main: editor + events */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '18px' }}>
        {/* Editor */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '10px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>BinarySearchTree.java @ {currentEvent?.timestamp}</span>
            {currentEvent && <Badge {...eventTypeStyle(currentEvent.type)} label={eventTypeStyle(currentEvent.type).label} />}
          </div>
          <Editor
            height="440px"
            defaultLanguage={getMonacoLanguage(student?.language || 'JAVA')}
            value={currentCode}
            theme="vs-dark"
            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 22, scrollBeyondLastLine: false, padding: { top: 12 } }}
          />
        </div>

        {/* Event List */}
        <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Event List</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {events.map((e, idx) => {
              const es = eventTypeStyle(e.type);
              const isActive = idx === currentEventIdx;
              return (
                <div
                  key={e.id}
                  onClick={() => seek(idx)}
                  style={{ display: 'flex', gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent', transition: 'background-color 0.1s' }}
                  onMouseEnter={el => { if (!isActive) (el.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--color-bg-hover)'; }}
                  onMouseLeave={el => { if (!isActive) (el.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace', flexShrink: 0, width: '40px', paddingTop: '2px' }}>{e.timestamp}</span>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: es.color, flexShrink: 0, marginTop: '5px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: isActive ? 600 : 400, lineHeight: 1.4 }}>{e.description}</p>
                    {e.linesChanged != null && e.linesChanged > 0 && <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>+{e.linesChanged} lines</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 22px' }}>
        {/* Progress bar */}
        <div
          style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg-hover)', borderRadius: '3px', marginBottom: '14px', cursor: 'pointer', position: 'relative' }}
          onClick={e => {
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const newTime = pct * totalDuration;
            setCurrentTime(newTime);
            const ni = events.findIndex(ev => ev.offsetSeconds > newTime);
            setCurrentEventIdx(ni === -1 ? events.length - 1 : Math.max(0, ni - 1));
            setPlaying(false);
          }}
        >
          <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: 'var(--color-accent)', borderRadius: '3px', transition: 'width 0.2s' }} />
          <div style={{ position: 'absolute', top: '50%', left: `${progressPct}%`, transform: 'translate(-50%,-50%)', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', border: '2px solid var(--color-bg-card)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Time */}
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{formatTime(currentTime)} / {formatTime(totalDuration)}</span>

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => seek(currentEventIdx - 1)} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SkipBack size={15} />
            </button>
            <button onClick={() => setPlaying(p => !p)} style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-accent)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={() => seek(currentEventIdx + 1)} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SkipForward size={15} />
            </button>
          </div>

          {/* Speed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Speed:</span>
            {SPEEDS.map(s => (
              <button key={s} onClick={() => setSpeed(s)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid', borderColor: speed === s ? 'var(--color-accent)' : 'var(--color-border)', backgroundColor: speed === s ? 'var(--color-accent-light)' : 'transparent', color: speed === s ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontSize: '12px', fontWeight: speed === s ? 700 : 400, cursor: 'pointer' }}>
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionReplay;
