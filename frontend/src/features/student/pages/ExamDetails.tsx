import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Calendar, Hash, Award, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchApi } from '../../../api/client';
import { languageMeta } from '../../teacher/exam-editor/types';
import '../../teacher/exam-editor/examEditor.css';

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

interface ExamQuestion {
  id: number;
  questionNumber: number;
  title: string;
  marks: number;
  allowedLanguage: string;
}

const ExamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [examData, questionsData, coursesData] = await Promise.all([
          fetchApi(`/exams/${id}`),
          fetchApi(`/exams/${id}/questions`),
          fetchApi('/courses').catch(() => []),
        ]);
        setExam(examData);
        setQuestions(questionsData);
        if (examData.courseId) {
          const found = coursesData.find((c: Course) => c.id === examData.courseId);
          if (found) setCourse(found);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load exam details');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleStartExam = async () => {
    try {
      setStarting(true);
      const attempt = await fetchApi(`/exams/${id}/attempts`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
      navigate(`/student/exams/${id}/attempt/${attempt.id}`);
    } catch (err: any) {
      alert('Failed to enter exam: ' + err.message);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="ee-layout min-h-screen bg-[#0f111a] flex flex-col items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm">Loading exam details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ee-layout min-h-screen bg-[#0f111a] p-8 text-center text-red-400">
        Error: {error}
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="ee-layout min-h-screen bg-[#0f111a] p-8 text-center text-gray-400">
        Exam not found.
      </div>
    );
  }

  return (
    <div className="ee-layout min-h-screen bg-[#0f111a] text-gray-200">
      {/* Top Header */}
      <header className="ee-header px-6 lg:px-8 border-b border-[#202538] bg-[#141724]">
        <div className="ee-header__main">
          <button
            onClick={() => navigate('/student/exams')}
            className="ee-btn ee-btn--ghost ee-btn--icon mr-4"
            title="Back to Exams"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="ee-header__title">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{exam.title}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border ${
                exam.status === 'PUBLISHED' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' :
                exam.status === 'ONGOING' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50' :
                exam.status === 'ENDED' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                'bg-amber-900/30 text-amber-400 border-amber-700/50'
              }`}>
                {exam.status}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <BookOpen size={13} className="text-teal-400" />
              <span className="text-teal-400 font-semibold">
                {course ? `${course.courseCode} — ${course.name}` : `Course #${exam.courseId}`}
              </span>
            </div>
          </div>
        </div>

        {/* Enter Exam Action if ONGOING */}
        <div className="ee-header__actions">
          {exam.status === 'ONGOING' && (
            <button
              onClick={handleStartExam}
              disabled={starting}
              className="ee-btn ee-btn--publish flex items-center gap-2 px-6 shadow-lg shadow-teal-900/40"
            >
              {starting ? 'Entering...' : (
                <>
                  <Play size={16} fill="currentColor" />
                  Enter Exam
                </>
              )}
            </button>
          )}
        </div>
      </header>

      <main className="ee-body p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Status Notice Banner */}
          {exam.status === 'DRAFT' && (
            <div className="bg-amber-950/30 border border-amber-800/60 text-amber-400 p-4 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              <div>
                <strong className="font-bold">Notice:</strong> Exam is not available yet.
              </div>
            </div>
          )}

          {exam.status === 'PUBLISHED' && (
            <div className="bg-blue-950/30 border border-blue-800/60 text-blue-400 p-4 rounded-xl flex items-center gap-3 text-sm">
              <Clock size={18} />
              <div>
                <strong className="font-bold">Notice:</strong> Waiting for the teacher to start the exam.
              </div>
            </div>
          )}

          {exam.status === 'ONGOING' && (
            <div className="bg-emerald-950/30 border border-emerald-800/60 text-emerald-400 p-4 rounded-xl flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} />
                <div>
                  <strong className="font-bold">Active:</strong> Exam is currently active and in progress.
                </div>
              </div>
              <button
                onClick={handleStartExam}
                disabled={starting}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2 text-xs"
              >
                <Play size={14} fill="currentColor" /> Enter Now
              </button>
            </div>
          )}

          {exam.status === 'ENDED' && (
            <div className="bg-gray-900 border border-gray-800 text-gray-400 p-4 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              <div>
                <strong className="font-bold">Notice:</strong> Exam has ended.
              </div>
            </div>
          )}

          {/* Information Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-[#141724] border border-[#24293f] rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-md">
              <Clock size={22} className="text-teal-400 mb-1.5" />
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Duration</div>
              <div className="text-sm font-bold text-white mt-0.5">{exam.durationMinutes} mins</div>
            </div>

            <div className="bg-[#141724] border border-[#24293f] rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-md">
              <Hash size={22} className="text-blue-400 mb-1.5" />
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Questions</div>
              <div className="text-sm font-bold text-white mt-0.5">{questions.length} problems</div>
            </div>

            <div className="bg-[#141724] border border-[#24293f] rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-md">
              <Award size={22} className="text-purple-400 mb-1.5" />
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Total Marks</div>
              <div className="text-sm font-bold text-teal-400 mt-0.5">{exam.totalMarks || 0} pts</div>
            </div>

            <div className="bg-[#141724] border border-[#24293f] rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-md">
              <Calendar size={22} className="text-orange-400 mb-1.5" />
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Start Time</div>
              <div className="text-xs font-mono font-bold text-white mt-0.5 truncate max-w-full">
                {exam.startTime ? new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Manual'}
              </div>
            </div>

            <div className="bg-[#141724] border border-[#24293f] rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-md">
              <Clock size={22} className="text-red-400 mb-1.5" />
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">End Time</div>
              <div className="text-xs font-mono font-bold text-white mt-0.5 truncate max-w-full">
                {exam.endTime ? new Date(exam.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
              </div>
            </div>
          </div>

          {/* Instructions & Description */}
          <div className="bg-[#141724] border border-[#24293f] rounded-xl p-6 shadow-md space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300 border-b border-gray-800 pb-2">
              Instructions & Guidelines
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {exam.description || 'No special instructions provided for this exam.'}
            </p>
          </div>

          {/* Questions Preview List (No teacher editing controls) */}
          <div className="bg-[#141724] border border-[#24293f] rounded-xl overflow-hidden shadow-md">
            <div className="px-6 py-4 border-b border-[#24293f] bg-[#11131f] flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Problem Preview
              </h2>
              <span className="text-xs text-gray-400 font-mono">
                {questions.length} Questions
              </span>
            </div>
            
            <div className="divide-y divide-[#1e2335]">
              {questions.map((q) => {
                const langInfo = languageMeta(q.allowedLanguage);
                return (
                  <div key={q.id} className="p-5 flex items-center justify-between hover:bg-gray-800/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold font-mono text-teal-400 text-sm shrink-0">
                        Q{q.questionNumber}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{q.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded border"
                            style={{
                              color: langInfo.color,
                              backgroundColor: `${langInfo.color}15`,
                              borderColor: `${langInfo.color}35`,
                            }}
                          >
                            {langInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-teal-400">{q.marks}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Marks</div>
                    </div>
                  </div>
                );
              })}

              {questions.length === 0 && (
                <div className="p-10 text-center text-gray-500 text-xs">
                  No problems configured for this exam yet.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ExamDetails;
