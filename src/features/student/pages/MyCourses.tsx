import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, ClipboardList } from 'lucide-react';
import { mockCourses } from '../../../data/mockData';
import { ProgressBar, difficultyColors, langColor } from '../../../components/ui';

const MyCourses: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '18px',
        }}
      >
        {mockCourses.map((course) => {
          const dc = difficultyColors(course.difficulty);
          const lc = langColor(course.language);
          return (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-accent)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Colour banner */}
              <div
                style={{
                  height: '88px',
                  background: `linear-gradient(135deg, ${lc}33, ${lc}11)`,
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <BookOpen size={34} color={lc} />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: lc,
                    backgroundColor: `${lc}1a`,
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {course.language}
                </span>
              </div>

              <div style={{ padding: '18px' }}>
                {/* Title + difficulty */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                    {course.title}
                  </h3>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: dc.color, backgroundColor: dc.bg, padding: '2px 7px', borderRadius: '5px', flexShrink: 0 }}>
                    {course.difficulty}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  {course.instructor}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                      {course.progress}%
                    </span>
                  </div>
                  <ProgressBar value={course.progress} color={lc} />
                </div>

                {/* Assignments stat */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ClipboardList size={13} color="var(--color-text-muted)" />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {course.completedAssignments}/{course.totalAssignments} assignments
                    </span>
                  </div>
                  <ChevronRight size={15} color="var(--color-text-muted)" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCourses;
