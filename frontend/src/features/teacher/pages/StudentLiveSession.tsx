import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Eye, MessageSquare, Edit3, Play, BarChart2 } from 'lucide-react';
import { liveStudents } from '../../../data/teacherMockData';
import { Badge, getMonacoLanguage } from '../../../components/ui';

const MOCK_CODE = `public class BinarySearchTree {
    private Node root;

    private class Node {
        int data;
        Node left, right;
        Node(int data) { this.data = data; }
    }

    public void insert(int data) {
        root = insertRec(root, data);
    }

    private Node insertRec(Node node, int data) {
        if (node == null) return new Node(data);
        if (data < node.data) node.left = insertRec(node.left, data);
        else if (data > node.data) node.right = insertRec(node.right, data);
        return node;
    }

    public boolean search(int data) {
        return searchRec(root, data);
    }

    private boolean searchRec(Node node, int data) {
        if (node == null) return false;
        if (node.data == data) return true;
        return data < node.data
            ? searchRec(node.left, data)
            : searchRec(node.right, data);
    }

    // TODO: implement inOrder()
}`;

const timeline = [
  { time: '12:30', event: 'Session started', type: 'info' },
  { time: '12:31', event: 'Started typing class structure', type: 'type' },
  { time: '12:33', event: '⚠ Large paste detected — 42 lines', type: 'warning' },
  { time: '12:33', event: 'Compile error: NullPointerException', type: 'error' },
  { time: '12:35', event: 'Rewrote insert() method', type: 'type' },
  { time: '12:36', event: '✓ Run successful — test 1 passed', type: 'success' },
  { time: '12:37', event: 'Added delete() method', type: 'type' },
  { time: '12:39', event: 'Idle — 2 minutes no keystrokes', type: 'idle' },
  { time: '12:41', event: 'Added traversal methods', type: 'type' },
];

const runHistory = [
  { attempt: 1, time: '12:33', result: 'Compile Error', output: 'NullPointerException at line 18' },
  { attempt: 2, time: '12:36', result: 'Pass',          output: 'Test 1: insert+search — PASSED' },
  { attempt: 3, time: '12:43', result: 'Pass',          output: 'Tests 1, 2, 3 — ALL PASSED' },
];

const StudentLiveSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'observe' | 'assist' | 'edit'>('observe');
  const [showPanel, setShowPanel] = useState<'timeline' | 'runs'>('timeline');

  const student = liveStudents.find(s => s.id === id);

  if (!student) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Session not found.</p>
      <button onClick={() => navigate('/teacher/live-monitor')} style={{ marginTop: '12px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
    </div>
  );

  const dotColor = student.status === 'coding' ? '#10b981' : student.status === 'online' ? '#3b82f6' : '#f59e0b';
  const modeBtn = (m: typeof mode, label: string, icon: React.ReactNode, color: string) => (
    <button
      onClick={() => setMode(m)}
      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: `1px solid ${mode === m ? color : 'var(--color-border)'}`, backgroundColor: mode === m ? `${color}1a` : 'transparent', color: mode === m ? color : 'var(--color-text-secondary)', fontSize: '13px', fontWeight: mode === m ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
    >
      {icon} {label}
    </button>
  );

  const eventColor = (type: string) => ({ type: '#6366f1', warning: '#f59e0b', error: '#ef4444', success: '#10b981', idle: '#64748b', info: '#3b82f6' }[type] ?? '#94a3b8');

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Back */}
      <button onClick={() => navigate('/teacher/monitor')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', marginBottom: '18px', padding: 0 }}>
        <ArrowLeft size={15} /> Back to Monitor
      </button>

      {/* Student Info Bar */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px 22px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff' }}>{student.avatar}</div>
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '11px', height: '11px', borderRadius: '50%', backgroundColor: dotColor, border: '2px solid var(--color-bg-card)' }} />
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{student.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{student.assignmentTitle}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[{ label: 'Lines', value: student.linesWritten }, { label: 'Runs', value: student.runAttempts }, { label: 'Last active', value: student.lastActivity }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mode buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {modeBtn('observe', 'Observe', <Eye size={14} />, '#3b82f6')}
          {modeBtn('assist', 'Assist', <MessageSquare size={14} />, '#10b981')}
          {modeBtn('edit', 'Edit', <Edit3 size={14} />, '#f59e0b')}
        </div>
      </div>

      {/* Mode banner */}
      {mode !== 'observe' && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', marginBottom: '14px', backgroundColor: mode === 'assist' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${mode === 'assist' ? '#10b981' : '#f59e0b'}33`, fontSize: '13px', color: mode === 'assist' ? '#10b981' : '#f59e0b' }}>
          {mode === 'assist' ? '💬 Assist mode: You can send messages and hints to the student.' : '✏️ Edit mode: You can modify the student\'s code. Changes are tracked.'}
        </div>
      )}

      {/* Main layout: editor + panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
        {/* Editor */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          {/* Editor title bar */}
          <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>BinarySearchTree.java</span>
            <Badge label={mode === 'observe' ? '👁 Observing' : mode === 'assist' ? '💬 Assisting' : '✏️ Editing'} color={mode === 'observe' ? '#3b82f6' : mode === 'assist' ? '#10b981' : '#f59e0b'} bg={mode === 'observe' ? 'rgba(59,130,246,0.15)' : mode === 'assist' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'} />
          </div>
          <Editor
            height="520px"
            defaultLanguage={getMonacoLanguage(student.language || 'JAVA')}
            value={MOCK_CODE}
            theme="vs-dark"
            options={{ readOnly: mode !== 'edit', minimap: { enabled: false }, fontSize: 13, lineHeight: 22, scrollBeyondLastLine: false, padding: { top: 12 } }}
          />
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Panel tabs */}
          <div style={{ display: 'flex', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '4px', gap: '4px' }}>
            {(['timeline', 'runs'] as const).map(p => (
              <button key={p} onClick={() => setShowPanel(p)} style={{ flex: 1, padding: '7px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: showPanel === p ? 600 : 400, backgroundColor: showPanel === p ? 'var(--color-accent-light)' : 'transparent', color: showPanel === p ? 'var(--color-accent)' : 'var(--color-text-secondary)', transition: 'all 0.15s' }}>
                {p === 'timeline' ? '⏱ Timeline' : '▶ Run History'}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {showPanel === 'timeline' && (
            <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', flex: 1 }}>
              {timeline.map((e, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', padding: '11px 14px', borderBottom: idx < timeline.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace', flexShrink: 0, width: '34px' }}>{e.time}</span>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: eventColor(e.type), flexShrink: 0, marginTop: '5px' }} />
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{e.event}</p>
                </div>
              ))}
            </div>
          )}

          {/* Run History */}
          {showPanel === 'runs' && (
            <div style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', flex: 1 }}>
              {runHistory.map((r, idx) => (
                <div key={idx} style={{ padding: '13px 16px', borderBottom: idx < runHistory.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Run #{r.attempt}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{r.time}</span>
                      <Badge label={r.result} color={r.result === 'Pass' ? '#10b981' : '#ef4444'} bg={r.result === 'Pass' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'} />
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace', backgroundColor: 'var(--color-bg-hover)', padding: '6px 10px', borderRadius: '6px' }}>{r.output}</p>
                </div>
              ))}
            </div>
          )}

          {/* Shortcut: View Replay / AI Analysis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => navigate(`/teacher/session-replay/${student.id}`)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Play size={14} /> View Session Replay
            </button>
            <button onClick={() => navigate(`/teacher/ai-analysis/${student.id}`)} style={{ padding: '9px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.4)', backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--color-accent)', fontSize: '13px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <BarChart2 size={14} /> AI Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLiveSession;
