import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Code2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  PlayCircle,
} from 'lucide-react';
import { mockAssignments } from '../../../data/mockData';
import { Badge, difficultyColors, statusColors, langBadgeStyle } from '../../../components/ui';

const AssignmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const assignment = mockAssignments.find((a) => a.id === id);

  if (!assignment) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px' }}>Assignment not found.</p>
        <button
          onClick={() => navigate('/student/assignments')}
          style={{ marginTop: '16px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
        >
          ← Back to Assignments
        </button>
      </div>
    );
  }

  const sc = statusColors(assignment.status);
  const dc = difficultyColors(assignment.difficulty);
  const canStart = assignment.status === 'pending' || assignment.status === 'overdue';

  return (
    <div style={{ maxWidth: '820px' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/assignments')}
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
        Back to Assignments
      </button>

      {/* Header card */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '28px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              {assignment.status === 'overdue' && <AlertCircle size={16} color="var(--color-error)" />}
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                {assignment.title}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={13} color="var(--color-text-muted)" />
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{assignment.course}</span>
            </div>
          </div>

          {/* Start Coding button */}
          <button
            onClick={() => navigate(`/student/workspace/${assignment.id}`)}
            disabled={!canStart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              cursor: canStart ? 'pointer' : 'not-allowed',
              backgroundColor: canStart ? 'var(--color-accent)' : 'var(--color-bg-hover)',
              color: canStart ? '#fff' : 'var(--color-text-muted)',
              fontSize: '14px',
              fontWeight: 600,
              flexShrink: 0,
              transition: 'opacity 0.15s',
              opacity: canStart ? 1 : 0.6,
            }}
            onMouseEnter={(e) => { if (canStart) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { if (canStart) (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            <PlayCircle size={17} />
            {assignment.status === 'submitted' || assignment.status === 'graded'
              ? 'View Submission'
              : 'Start Coding'}
          </button>
        </div>

        {/* Meta badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Badge label={sc.label} color={sc.color} bg={sc.bg} />
          <Badge label={assignment.difficulty} color={dc.color} bg={dc.bg} />
          <span style={langBadgeStyle(assignment.language)}>{assignment.language}</span>
          {assignment.score != null && (
            <Badge
              label={`${assignment.score}/${assignment.maxScore} pts`}
              color={assignment.score >= 60 ? '#10b981' : '#ef4444'}
              bg={assignment.score >= 60 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'}
            />
          )}
        </div>

        {/* Due date row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'var(--color-bg-hover)',
            borderRadius: '8px',
          }}
        >
          <Calendar size={15} color="var(--color-text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Due date:</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: assignment.status === 'overdue' ? 'var(--color-error)' : 'var(--color-text-secondary)',
            }}
          >
            {assignment.dueDate}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
            · Max score: {assignment.maxScore} pts
          </span>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={16} color="var(--color-accent)" />
          Description
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          {assignment.description}
        </p>
      </div>

      {/* Requirements */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '24px 28px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="var(--color-accent)" />
          Requirements
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {assignment.requirements.map((req, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span
                style={{
                  flexShrink: 0,
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent)',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '1px',
                }}
              >
                {idx + 1}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {req}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Programming language info */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Code2 size={18} color="var(--color-text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Programming language</span>
        </div>
        <span style={langBadgeStyle(assignment.language)}>{assignment.language}</span>
      </div>
    </div>
  );
};

export default AssignmentDetails;
