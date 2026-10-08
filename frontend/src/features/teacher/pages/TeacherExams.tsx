import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Eye, Play, Globe, Clock, FileText,
  Search, Award, BookOpen, CheckCircle
} from 'lucide-react';
import { fetchApi } from '../../../api/client';
import { examApi } from '../exam-editor/examApi';
import { useConfirm, useToasts } from '../exam-editor/components/primitives';
import '../exam-editor/examEditor.css';

interface Exam {
  id: number;
  courseId: number;
  title: string;
  description: string;
  durationMinutes: number;
  startTime: string | null;
  endTime: string | null;
  totalMarks: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'ENDED';
}

interface Course {
  id: number;
  courseCode: string;
  name: string;
}

type FilterStatus = 'ALL' | 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'ENDED';

const TeacherExams: React.FC = () => {
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  const toasts = useToasts();

  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questionCounts, setQuestionCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      const [examsData, coursesData] = await Promise.all([
        fetchApi('/exams'),
        fetchApi('/courses')
      ]);
      setExams(examsData);
      setCourses(coursesData);

      // Fetch question counts in parallel
      const counts: Record<number, number> = {};
      await Promise.all(
        examsData.map(async (exam: Exam) => {
          try {
            const qs = await fetchApi(`/exams/${exam.id}/questions`);
            counts[exam.id] = qs.length;
          } catch {
            counts[exam.id] = 0;
          }
        })
      );
      setQuestionCounts(counts);
    } catch (err: any) {
      toasts.error('Failed to load exams: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePublishExam = async (examId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirm({
      title: 'Publish Exam?',
      message: 'Students enrolled in the course will be able to view this exam on their dashboard.',
      confirmLabel: 'Publish',
    });
    if (!ok) return;

    try {
      await examApi.publishExam(examId);
      toasts.success('Exam published successfully');
      loadData();
    } catch (err: any) {
      toasts.error('Failed to publish exam: ' + err.message);
    }
  };

  const handleStartExam = async (examId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirm({
      title: 'Start Exam Now?',
      message: 'This will transition the exam to ONGOING. Students can immediately enter the exam workspace and timer will begin.',
      confirmLabel: 'Start Now',
      tone: 'danger',
    });
    if (!ok) return;

    try {
      await examApi.startExam(examId);
      toasts.success('Exam started! It is now ONGOING.');
      loadData();
    } catch (err: any) {
      toasts.error('Failed to start exam: ' + err.message);
    }
  };

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      // Status filter
      if (statusFilter !== 'ALL' && exam.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const course = courses.find(c => c.id === exam.courseId);
        const matchTitle = exam.title.toLowerCase().includes(query);
        const matchDesc = (exam.description || '').toLowerCase().includes(query);
        const matchCourse = course ? (course.courseCode.toLowerCase().includes(query) || course.name.toLowerCase().includes(query)) : false;
        return matchTitle || matchDesc || matchCourse;
      }
      return true;
    });
  }, [exams, courses, statusFilter, searchQuery]);

  const countByStatus = (status: FilterStatus) => {
    if (status === 'ALL') return exams.length;
    return exams.filter(e => e.status === status).length;
  };

  if (loading && exams.length === 0) {
    return (
      <div className="ee-root min-h-screen text-gray-200 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm text-gray-400">Loading examination dashboard...</p>
      </div>
    );
  }

  return (
    <div className="ee-root min-h-screen pb-24 text-gray-100">
      {toasts.node}
      {dialog}

      <div className="px-4 pt-8">
        {/* Header Hero Area */}
        <div className="ee-hero">
          <div className="ee-hero__row">
            <div>
              <div className="ee-hero__eyebrow">
                <BookOpen size={14} /> Teacher Examination Portal
              </div>
              <h1 className="ee-hero__title">
                Exams Dashboard
              </h1>
              <p className="ee-hero__sub">
                Create, manage, and monitor programming exams for all your courses.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/teacher/exams/create')}
                className="ee-btn ee-btn--publish flex items-center gap-2"
              >
                <Plus size={16} /> Create Exam
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="ee-stats">
            <div className="ee-stat">
              <div className="ee-stat__icon">
                <FileText size={18} />
              </div>
              <div>
                <div className="ee-stat__label">Total Exams</div>
                <div className="ee-stat__value">{exams.length}</div>
              </div>
            </div>
            <div className="ee-stat">
              <div className="ee-stat__icon" style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)' }}>
                <Edit2 size={18} />
              </div>
              <div>
                <div className="ee-stat__label">Drafts</div>
                <div className="ee-stat__value">{countByStatus('DRAFT')}</div>
              </div>
            </div>
            <div className="ee-stat">
              <div className="ee-stat__icon" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.12)' }}>
                <Globe size={18} />
              </div>
              <div>
                <div className="ee-stat__label">Published</div>
                <div className="ee-stat__value">{countByStatus('PUBLISHED')}</div>
              </div>
            </div>
            <div className="ee-stat">
              <div className="ee-stat__icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.12)' }}>
                <Play size={18} />
              </div>
              <div>
                <div className="ee-stat__label">Ongoing</div>
                <div className="ee-stat__value">{countByStatus('ONGOING')}</div>
              </div>
            </div>
            <div className="ee-stat">
              <div className="ee-stat__icon" style={{ color: '#9ca3af', background: 'rgba(156, 163, 175, 0.12)' }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <div className="ee-stat__label">Ended</div>
                <div className="ee-stat__value">{countByStatus('ENDED')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-[1240px] mx-auto space-y-6">
          
          {/* Controls Bar: Search & Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 bg-[#181b2b] border border-[#2b304c] p-5 rounded-2xl shadow-xl mt-10 mb-8">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-3 lg:pb-0 scrollbar-hide">
              {(['ALL', 'DRAFT', 'PUBLISHED', 'ONGOING', 'ENDED'] as FilterStatus[]).map(status => {
                const count = countByStatus(status);
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                        : 'bg-[#1e2235] text-gray-400 hover:text-gray-200 hover:bg-[#252a42] border border-[#2b304c]'
                    }`}
                  >
                    <span>{status === 'ALL' ? 'All Exams' : status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold leading-none flex items-center justify-center min-w-[24px] h-[24px] ${
                      isActive ? 'bg-teal-500/30 text-teal-200' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:w-96 shrink-0 mt-2 lg:mt-0">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search exams by title or course..."
                style={{ paddingLeft: '44px', paddingRight: '36px' }}
                className="w-full bg-[#0d0f17] border border-[#2b304c] rounded-xl py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Exam List */}
          {filteredExams.length === 0 ? (
            <div className="ee-empty py-16">
              <div className="ee-empty__icon">
                <FileText size={28} />
              </div>
              {searchQuery || statusFilter !== 'ALL' ? (
                <>
                  <h3 className="ee-empty__title">No matching exams found</h3>
                  <p className="ee-empty__text">
                    Try adjusting your search query or filter status to find what you're looking for.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                    className="mt-6 ee-btn ee-btn--ghost text-sm"
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <h3 className="ee-empty__title">No exams yet</h3>
                  <p className="ee-empty__text">
                    Create your first programming exam to get started with coding questions and automated test cases.
                  </p>
                  <button
                    onClick={() => navigate('/teacher/exams/create')}
                    className="mt-6 ee-btn ee-btn--publish flex items-center gap-2"
                  >
                    <Plus size={16} /> Create Exam
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExams.map(exam => {
                const course = courses.find(c => c.id === exam.courseId);
                const qCount = questionCounts[exam.id] ?? 0;

                return (
                  <div
                    key={exam.id}
                    onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                    className="bg-[#181b2b] border border-[#2b304c] hover:border-teal-500/40 rounded-xl p-5 shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors truncate">
                          {exam.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border whitespace-nowrap ${
                          exam.status === 'PUBLISHED' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' :
                          exam.status === 'ONGOING' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50' :
                          exam.status === 'ENDED' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                          'bg-amber-900/30 text-amber-400 border-amber-700/50'
                        }`}>
                          {exam.status}
                        </span>
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/25 whitespace-nowrap">
                          {course?.courseCode || `Course #${exam.courseId}`}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 pr-4 leading-relaxed">
                        {exam.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} /> {exam.durationMinutes} mins
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText size={14} /> {qCount} Qs
                        </div>
                        <div className="flex items-center gap-1.5 text-teal-400">
                          <Award size={14} /> {exam.totalMarks || 0} pts
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      {exam.status === 'DRAFT' && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/teacher/exams/${exam.id}`);
                            }}
                            className="ee-btn ee-btn--sm ee-btn--secondary"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              if (qCount === 0 || exam.totalMarks === 0) {
                                e.stopPropagation();
                                return;
                              }
                              handlePublishExam(exam.id, e);
                            }}
                            className={`ee-btn ee-btn--sm ee-btn--publish shadow-md ${
                              (qCount === 0 || exam.totalMarks === 0) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={(qCount === 0 || exam.totalMarks === 0) ? "Add questions before publishing" : "Publish Exam"}
                            disabled={qCount === 0 || exam.totalMarks === 0}
                          >
                            <Globe size={13} /> Publish
                          </button>
                        </>
                      )}

                      {exam.status === 'PUBLISHED' && (
                        <button
                          type="button"
                          onClick={(e) => handleStartExam(exam.id, e)}
                          className="ee-btn ee-btn--sm bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/30"
                        >
                          <Play size={13} /> Start
                        </button>
                      )}

                      {exam.status === 'ONGOING' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teacher/exams/${exam.id}`);
                          }}
                          className="ee-btn ee-btn--sm bg-teal-600 text-white hover:bg-teal-500 shadow-md"
                        >
                          <Eye size={13} /> Monitor
                        </button>
                      )}

                      {exam.status === 'ENDED' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teacher/exams/${exam.id}`);
                          }}
                          className="ee-btn ee-btn--sm ee-btn--ghost"
                        >
                          <Eye size={13} /> View Results
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherExams;

