import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Terminal, Maximize2 } from 'lucide-react';
import { mockAssignments } from '../../../data/mockData';
import { langBadgeStyle } from '../../../components/ui';

const CodingWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const assignment = mockAssignments.find((a) => a.id === id);

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Back */}
      <button
        onClick={() => navigate(`/assignments/${id}`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-text-muted)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          marginBottom: '22px',
          padding: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)')}
      >
        <ArrowLeft size={15} />
        Back to Assignment
      </button>

      {/* Title bar */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px 12px 0 0',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code2 size={18} color="var(--color-accent)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {assignment?.title ?? 'Coding Workspace'}
          </span>
          {assignment && <span style={langBadgeStyle(assignment.language)}>{assignment.language}</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
        </div>
      </div>

      {/* Editor placeholder */}
      <div
        style={{
          backgroundColor: '#0d1117',
          border: '1px solid var(--color-border)',
          borderTop: '1px solid #30363d',
          minHeight: '420px',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontSize: '13px',
          padding: '20px 24px',
          color: '#e6edf3',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <span><span style={{ color: '#ff7b72' }}>// </span><span style={{ color: '#8b949e' }}>Coding Workspace — Editor coming soon</span></span>
        <span><span style={{ color: '#ff7b72' }}>// </span><span style={{ color: '#8b949e' }}>This is a placeholder for the real code editor.</span></span>
        <br />
        <span>
          <span style={{ color: '#ff7b72' }}>public class </span>
          <span style={{ color: '#79c0ff' }}>Solution </span>
          <span style={{ color: '#e6edf3' }}>{'{'}</span>
        </span>
        <span style={{ paddingLeft: '24px' }}>
          <span style={{ color: '#ff7b72' }}>public static void </span>
          <span style={{ color: '#d2a8ff' }}>main</span>
          <span style={{ color: '#e6edf3' }}>(String[] args) {'{'}</span>
        </span>
        <span style={{ paddingLeft: '48px' }}>
          <span style={{ color: '#79c0ff' }}>System</span>
          <span style={{ color: '#e6edf3' }}>.</span>
          <span style={{ color: '#d2a8ff' }}>out</span>
          <span style={{ color: '#e6edf3' }}>.</span>
          <span style={{ color: '#d2a8ff' }}>println</span>
          <span style={{ color: '#e6edf3' }}>(</span>
          <span style={{ color: '#a5d6ff' }}>"Hello, CodeClassroom!"</span>
          <span style={{ color: '#e6edf3' }}>);</span>
        </span>
        <span style={{ paddingLeft: '24px' }}><span style={{ color: '#e6edf3' }}>{'}'}</span></span>
        <span><span style={{ color: '#e6edf3' }}>{'}'}</span></span>
        <br />
        <span style={{ color: '#8b949e' }}>// Start typing your solution here…</span>
        <span style={{ display: 'inline-block', width: '2px', height: '16px', backgroundColor: 'var(--color-accent)', animation: 'blink 1s step-end infinite', verticalAlign: 'middle' }} />
      </div>

      {/* Terminal placeholder */}
      <div
        style={{
          backgroundColor: '#161b22',
          border: '1px solid var(--color-border)',
          borderTop: '1px solid #30363d',
          borderRadius: '0 0 12px 12px',
          padding: '14px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Terminal size={14} color="#8b949e" />
          <span style={{ fontSize: '12px', color: '#8b949e', fontFamily: 'monospace' }}>Terminal</span>
          <Maximize2 size={12} color="#8b949e" style={{ marginLeft: 'auto', cursor: 'pointer' }} />
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#3fb950', lineHeight: 1.7 }}>
          <span>$ javac Solution.java</span><br />
          <span style={{ color: '#8b949e' }}># Ready to compile and run your code</span>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
        <button
          style={{
            padding: '9px 22px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Run Code
        </button>
        <button
          style={{
            padding: '9px 22px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodingWorkspace;
