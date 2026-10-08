import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Edit2, Trash2, Copy, Globe, Play, Clock,
  Award, BookOpen, FileText, CheckCircle2,
  Users, Code2, X
} from 'lucide-react';
import { fetchApi } from '../../../api/client';
import { examApi, toInputDateTime, toServerDateTime } from '../exam-editor/examApi';
import type { Exam, ExamQuestion, ExamTestCase } from '../exam-editor/types';
import { languageMeta } from '../exam-editor/types';
import { useConfirm, useToasts } from '../exam-editor/components/primitives';
import {
  QuestionEditorModal,
  type QuestionDraftWithTestCases,
} from '../exam-editor/components/QuestionEditorModal';
import '../exam-editor/examEditor.css';

interface Course {
  id: number;
  courseCode: string;
  name: string;
}

interface ExamAttempt {
  id: number;
  examId: number;
  studentId: number;
  startedAt: string | null;
  submittedAt: string | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'TIME_EXPIRED';
}

interface StudentAnswer {
  id: number;
  attemptId: number;
  questionId: number;
  code: string;
  language: string;
  lastSavedAt: string | null;
  submittedAt: string | null;
  status: string;
}

type TabType = 'overview' | 'questions' | 'attempts';

const TeacherExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  const toasts = useToasts();

  const [exam, setExam] = useState<Exam | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [questionTestCases, setQuestionTestCases] = useState<Record<number, ExamTestCase[]>>({});
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Question Editor Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionDraftWithTestCases | null>(null);
  const [editingQuestionNumber, setEditingQuestionNumber] = useState<number>(1);

  // Edit Exam General Info Modal State
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    durationMinutes: 60,
    startTime: '',
  });

  // Extend Exam Modal State
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(15);
  const [extending, setExtending] = useState(false);

  // View Student Attempt Code Modal State
  const [selectedAttempt, setSelectedAttempt] = useState<ExamAttempt | null>(null);
  const [attemptAnswers, setAttemptAnswers] = useState<StudentAnswer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [ex, qs, atts] = await Promise.all([
        examApi.getExam(id),
        examApi.listQuestions(id),
        fetchApi(`/exams/${id}/attempts`).catch(() => []),
      ]);
      setExam(ex);
      setQuestions(qs);
      setAttempts(atts);

      // Load Course info
      if (ex.courseId) {
        fetchApi('/courses')
          .then((courses: Course[]) => {
            const found = courses.find(c => c.id === ex.courseId);
            if (found) setCourse(found);
          })
          .catch(() => {});
      }

      // Load test cases for all questions
      const tcMap: Record<number, ExamTestCase[]> = {};
      await Promise.all(
        qs.map(async (q: ExamQuestion) => {
          try {
            const tcs = await examApi.listTestCases(q.id);
            tcMap[q.id] = tcs;
          } catch {
            tcMap[q.id] = [];
          }
        })
      );
      setQuestionTestCases(tcMap);
    } catch (err: any) {
      toasts.error('Failed to load exam details: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Publish Exam
  const handlePublish = async () => {
    if (!exam) return;
    if (questions.length === 0) {
      return toasts.error('Cannot publish an exam with 0 questions.');
    }
    const ok = await confirm({
      title: 'Publish Exam?',
      message: 'Students enrolled in the course will be able to see this exam on their dashboard.',
      confirmLabel: 'Publish',
    });
    if (!ok) return;

    try {
      await examApi.publishExam(exam.id);
      toasts.success('Exam published successfully!');
      loadData();
    } catch (e: any) {
      toasts.error('Failed to publish: ' + e.message);
    }
  };

  // Start Exam
  const handleStart = async () => {
    if (!exam) return;
    const ok = await confirm({
      title: 'Start Exam Now?',
      message: 'Students will immediately be permitted to enter the exam workspace and the countdown timer will begin.',
      confirmLabel: 'Start Now',
      tone: 'danger',
    });
    if (!ok) return;

    try {
      await examApi.startExam(exam.id);
      toasts.success('Exam started! State is now ONGOING.');
      loadData();
    } catch (e: any) {
      toasts.error('Failed to start exam: ' + e.message);
    }
  };

  // Extend Exam
  const handleExtendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || extendMinutes < 1) return;
    setExtending(true);
    try {
      await fetchApi(`/exams/${exam.id}/extend?minutes=${extendMinutes}`, { method: 'POST' });
      toasts.success(`Exam extended by ${extendMinutes} minutes.`);
      setIsExtendModalOpen(false);
      loadData();
    } catch (err: any) {
      toasts.error('Failed to extend exam: ' + err.message);
    } finally {
      setExtending(false);
    }
  };

  // Edit Exam General Info
  const openEditExamModal = () => {
    if (!exam) return;
    setExamForm({
      title: exam.title || '',
      description: exam.description || '',
      durationMinutes: exam.durationMinutes || 60,
      startTime: toInputDateTime(exam.startTime),
    });
    setIsEditingExam(true);
  };

  const handleSaveExamInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam) return;
    if (!examForm.title.trim()) return toasts.error('Title is required');
    if (examForm.durationMinutes < 1) return toasts.error('Duration must be at least 1 minute');

    try {
      const updated = await examApi.updateExam(exam.id, {
        courseId: exam.courseId,
        title: examForm.title.trim(),
        description: examForm.description.trim(),
        durationMinutes: examForm.durationMinutes,
        startTime: toServerDateTime(examForm.startTime),
        totalMarks: exam.totalMarks,
      });
      setExam(updated);
      setIsEditingExam(false);
      toasts.success('Exam information updated');
    } catch (err: any) {
      toasts.error('Failed to update exam: ' + err.message);
    }
  };

  // Question CRUD via Modal
  const openAddProblem = () => {
    setEditingQuestion(null);
    setEditingQuestionNumber(questions.length + 1);
    setIsQuestionModalOpen(true);
  };

  const openEditProblem = (q: ExamQuestion) => {
    const tcs = questionTestCases[q.id] || [];
    setEditingQuestion({
      id: q.id,
      questionNumber: q.questionNumber,
      title: q.title,
      problemStatement: q.problemStatement,
      inputDescription: q.inputDescription,
      outputDescription: q.outputDescription,
      constraints: q.constraints,
      sampleInput: q.sampleInput,
      sampleOutput: q.sampleOutput,
      marks: q.marks,
      allowedLanguage: q.allowedLanguage,
      testCases: tcs.map(tc => ({
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      })),
    });
    setEditingQuestionNumber(q.questionNumber);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (savedDraft: QuestionDraftWithTestCases) => {
    if (!exam) return;
    try {
      let qId: number;
      if (savedDraft.id) {
        // Updating existing question
        await examApi.updateQuestion(savedDraft.id, {
          title: savedDraft.title,
          problemStatement: savedDraft.problemStatement,
          inputDescription: savedDraft.inputDescription,
          outputDescription: savedDraft.outputDescription,
          constraints: savedDraft.constraints,
          sampleInput: savedDraft.sampleInput,
          sampleOutput: savedDraft.sampleOutput,
          marks: savedDraft.marks,
          allowedLanguage: savedDraft.allowedLanguage,
          questionNumber: savedDraft.questionNumber,
        });
        qId = savedDraft.id;
        toasts.success(`Question Q${savedDraft.questionNumber} updated`);
      } else {
        // Creating new question
        const createdQ = await examApi.createQuestion(exam.id, {
          title: savedDraft.title,
          problemStatement: savedDraft.problemStatement,
          inputDescription: savedDraft.inputDescription,
          outputDescription: savedDraft.outputDescription,
          constraints: savedDraft.constraints,
          sampleInput: savedDraft.sampleInput,
          sampleOutput: savedDraft.sampleOutput,
          marks: savedDraft.marks,
          allowedLanguage: savedDraft.allowedLanguage,
          questionNumber: savedDraft.questionNumber,
        });
        qId = createdQ.id;
        toasts.success(`Question Q${savedDraft.questionNumber} added`);
      }

      // Sync test cases
      const existingTcs = questionTestCases[qId] || [];
      const existingTcIds = new Set(existingTcs.map(tc => tc.id));

      if (savedDraft.testCases && savedDraft.testCases.length > 0) {
        for (const tc of savedDraft.testCases) {
          if (tc.id && existingTcIds.has(tc.id)) {
            await examApi.updateTestCase(tc.id, {
              input: tc.input,
              expectedOutput: tc.expectedOutput,
            });
            existingTcIds.delete(tc.id);
          } else {
            await examApi.createTestCase(qId, {
              input: tc.input,
              expectedOutput: tc.expectedOutput,
            });
          }
        }
      }

      // Delete removed test cases
      for (const idToDelete of existingTcIds) {
        await examApi.deleteTestCase(idToDelete);
      }

      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      loadData();
    } catch (err: any) {
      toasts.error('Failed to save question: ' + err.message);
    }
  };

  const handleDuplicateQuestion = async (q: ExamQuestion) => {
    if (!exam) return;
    try {
      const nextNum = questions.length + 1;
      const createdQ = await examApi.createQuestion(exam.id, {
        title: `${q.title} (Copy)`,
        problemStatement: q.problemStatement,
        inputDescription: q.inputDescription,
        outputDescription: q.outputDescription,
        constraints: q.constraints,
        sampleInput: q.sampleInput,
        sampleOutput: q.sampleOutput,
        marks: q.marks,
        allowedLanguage: q.allowedLanguage,
        questionNumber: nextNum,
      });

      // Duplicate test cases
      const tcs = questionTestCases[q.id] || [];
      for (const tc of tcs) {
        await examApi.createTestCase(createdQ.id, {
          input: tc.input,
          expectedOutput: tc.expectedOutput,
        });
      }

      toasts.success(`Duplicated as Question Q${nextNum}`);
      loadData();
    } catch (err: any) {
      toasts.error('Failed to duplicate question: ' + err.message);
    }
  };

  const handleDeleteQuestion = async (q: ExamQuestion) => {
    const ok = await confirm({
      title: 'Delete Question?',
      message: `Permanently delete Question ${q.questionNumber}: "${q.title}" and its grading test cases?`,
      confirmLabel: 'Delete Question',
      tone: 'danger',
    });
    if (!ok) return;

    try {
      await examApi.deleteQuestion(q.id);
      toasts.success('Question deleted');
      loadData();
    } catch (err: any) {
      toasts.error('Failed to delete question: ' + err.message);
    }
  };

  // Inspect Student Attempt Answers
  const handleInspectAttempt = async (attempt: ExamAttempt) => {
    setSelectedAttempt(attempt);
    setLoadingAnswers(true);
    try {
      const ans = await fetchApi(`/exam-attempts/${attempt.id}/answers`);
      setAttemptAnswers(ans);
    } catch (err: any) {
      toasts.error('Failed to load student answers: ' + err.message);
    } finally {
      setLoadingAnswers(false);
    }
  };

  if (loading && !exam) {
    return (
      <div className="ee-layout min-h-screen bg-[#0f111a] flex flex-col items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-sm">Loading exam details...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="ee-layout min-h-screen bg-[#0f111a] p-8 text-center text-red-400">
        Exam not found.
      </div>
    );
  }

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="ee-root min-h-screen pb-24 text-gray-100">
      {toasts.node}
      {dialog}

      {/* Top Bar / Breadcrumb */}
      <div className="ee-topbar pt-6 px-4">
        <button
          onClick={() => navigate('/teacher/exams')}
          className="ee-back"
          title="Back to Exams"
        >
          <ArrowLeft size={16} /> Back to Exams
        </button>
      </div>

      {/* Hero Header */}
      <div className="ee-hero mx-4">
        <div className="ee-hero__row">
          <div>
            <div className="ee-hero__eyebrow">
              <BookOpen size={14} /> Exam Management
            </div>
            <h1 className="ee-hero__title flex items-center gap-3">
              {exam.title}
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border align-middle ${
                exam.status === 'PUBLISHED' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' :
                exam.status === 'ONGOING' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50' :
                exam.status === 'ENDED' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                'bg-amber-900/30 text-amber-400 border-amber-700/50'
              }`}>
                {exam.status}
              </span>
            </h1>
            <div className="ee-hero__sub">
              {course ? `${course.courseCode} - ${course.name}` : `Course #${exam.courseId}`}
            </div>
          </div>

        <div className="flex items-center gap-3">
          {exam.status === 'DRAFT' && (
            <>
              <button
                onClick={openEditExamModal}
                className="ee-btn ee-btn--secondary"
              >
                <Edit2 size={16} /> Edit Exam
              </button>
              <button
                onClick={handlePublish}
                disabled={questions.length === 0 || exam.totalMarks === 0}
                className={`ee-btn ee-btn--publish shadow-md ${(questions.length === 0 || exam.totalMarks === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={(questions.length === 0 || exam.totalMarks === 0) ? "Add questions before publishing" : "Publish Exam"}
              >
                <Globe size={16} /> Publish
              </button>
            </>
          )}

          {exam.status === 'PUBLISHED' && (
            <button
              onClick={handleStart}
              className="ee-btn bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/30"
            >
              <Play size={16} /> Start Exam
            </button>
          )}

          {exam.status === 'ONGOING' && (
            <>
              <button
                onClick={() => setIsExtendModalOpen(true)}
                className="ee-btn ee-btn--ghost border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
              >
                <Clock size={16} /> Extend
              </button>
              <button
                onClick={() => setActiveTab('attempts')}
                className="ee-btn ee-btn--publish"
              >
                <Users size={16} /> View Attempts
              </button>
            </>
          )}

          {exam.status === 'ENDED' && (
            <button
              onClick={() => setActiveTab('attempts')}
              className="ee-btn ee-btn--ghost"
            >
              <CheckCircle2 size={16} /> View Results
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="ee-stats mx-4 mb-6">
        <div className="ee-stat">
          <div className="ee-stat__icon">
            <Clock size={18} />
          </div>
          <div>
            <div className="ee-stat__label">Duration</div>
            <div className="ee-stat__value">{exam.durationMinutes} mins</div>
          </div>
        </div>
        <div className="ee-stat">
          <div className="ee-stat__icon" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.12)' }}>
            <FileText size={18} />
          </div>
          <div>
            <div className="ee-stat__label">Questions</div>
            <div className="ee-stat__value">{questions.length}</div>
          </div>
        </div>
        <div className="ee-stat">
          <div className="ee-stat__icon" style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.12)' }}>
            <Award size={18} />
          </div>
          <div>
            <div className="ee-stat__label">Total Marks</div>
            <div className="ee-stat__value">{totalMarks} pts</div>
          </div>
        </div>
        <div className="ee-stat">
          <div className="ee-stat__icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.12)' }}>
            <Users size={18} />
          </div>
          <div>
            <div className="ee-stat__label">Attempts</div>
            <div className="ee-stat__value">{attempts.length}</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="px-4 space-y-8 max-w-[1240px] mx-auto">
        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-6 border-b border-[#2b304c] mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookOpen size={15} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'questions'
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText size={15} /> Questions
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800 text-teal-300 font-mono">
              {questions.length}
            </span>
          </button>

        <button
          onClick={() => setActiveTab('attempts')}
          className={`py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'attempts'
              ? 'border-teal-400 text-teal-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Users size={15} /> Attempts
        </button>
      </div>

        {/* BODY CONTENT */}
        <div className="pb-16">
          {/* ─────────────────── TAB 1: OVERVIEW ─────────────────── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Instructions / Description Box */}
              <div className="bg-[#181b2b] border border-[#2b304c] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">
                    Instructions & Description
                  </h3>
                  {exam.status === 'DRAFT' && (
                    <button
                      onClick={openEditExamModal}
                      className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {exam.description || 'No instructions provided.'}
                </p>
              </div>

              {/* Timing Schedule Card */}
              <div className="bg-[#181b2b] border border-[#2b304c] rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 border-b border-gray-800 pb-3">
                  Schedule Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium block mb-1">Scheduled Start Time:</span>
                    <span className="text-gray-200 font-mono text-sm">
                      {exam.startTime ? new Date(exam.startTime).toLocaleString() : 'Unscheduled (Manual Start)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block mb-1">End Time:</span>
                    <span className="text-gray-200 font-mono text-sm">
                      {exam.endTime ? new Date(exam.endTime).toLocaleString() : 'Not ended yet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────── TAB 2: QUESTIONS ─────────────────── */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Questions Subheader */}
              <div className="flex items-center justify-between bg-[#181b2b] border border-[#2b304c] p-6 rounded-2xl shadow-xl">
                <div>
                  <h2 className="text-base font-bold text-white">Questions</h2>
                  <div className="text-xs text-gray-400 mt-0.5 font-mono">
                    Total: {questions.length} questions · {totalMarks} marks
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openAddProblem}
                  className="ee-btn ee-btn--publish flex items-center gap-2 text-xs"
                >
                  <Plus size={15} /> Add Problem
                </button>
              </div>

              {/* Questions Cards List */}
              {questions.length === 0 ? (
                <div className="ee-empty py-16 mt-4">
                  <div className="ee-empty__icon">
                    <FileText size={28} />
                  </div>
                  <h3 className="ee-empty__title">No questions added yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Create problems with input/output format, constraints, student sample cases, and hidden grading test cases.
                  </p>
                  <button
                    onClick={openAddProblem}
                    className="mt-5 ee-btn ee-btn--publish flex items-center gap-2 mx-auto text-xs"
                  >
                    <Plus size={15} /> Add First Problem
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q) => {
                    const langInfo = languageMeta(q.allowedLanguage);
                    const tcs = questionTestCases[q.id] || [];

                    return (
                      <div
                        key={q.id}
                        className="relative bg-[#181b2b] border border-[#2b304c] hover:border-teal-500/40 rounded-xl p-5 transition-all shadow-md flex flex-col sm:flex-row items-start gap-4 overflow-hidden"
                      >
                        {/* Question Number Badge */}
                        <div className="ee-qnum shrink-0">
                          <span className="ee-qnum__q">QUESTION</span>
                          <span className="ee-qnum__n">{q.questionNumber}</span>
                        </div>

                        {/* Middle Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-base font-bold text-white truncate">{q.title}</h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                              {q.marks} marks
                            </span>

                            <span
                              className="px-2.5 py-0.5 rounded text-xs font-bold border"
                              style={{
                                color: langInfo.color,
                                backgroundColor: `${langInfo.color}15`,
                                borderColor: `${langInfo.color}35`,
                              }}
                            >
                              {langInfo.label}
                            </span>

                            {q.sampleInput || q.sampleOutput ? (
                              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                Sample I/O configured
                              </span>
                            ) : null}

                            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {tcs.length} Hidden Test Cases
                            </span>
                          </div>

                          <p className="text-xs text-gray-400 line-clamp-2 mt-2.5">
                            {q.problemStatement}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openEditProblem(q)}
                            className="p-2 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-gray-800 transition-colors"
                            title="Edit Problem"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDuplicateQuestion(q)}
                            className="p-2 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-gray-800 transition-colors"
                            title="Duplicate Problem"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
                            title="Delete Problem"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─────────────────── TAB 3: ATTEMPTS ─────────────────── */}
          {activeTab === 'attempts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#181b2b] border border-[#2b304c] p-6 rounded-2xl shadow-xl">
                <div>
                  <h2 className="text-base font-bold text-white">Student Attempts</h2>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Monitor live progress, submissions, and code from students.
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  {attempts.length} Total Submissions
                </span>
              </div>

              {attempts.length === 0 ? (
                <div className="ee-empty py-16 mt-4">
                  <div className="ee-empty__icon">
                    <Users size={28} />
                  </div>
                  <h3 className="ee-empty__title">No student attempts recorded</h3>
                  <p className="ee-empty__text">
                    Student submissions will appear here automatically when students enter and work on the exam.
                  </p>
                </div>
              ) : (
                <div className="bg-[#181b2b] border border-[#2b304c] rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-[#11131c] text-gray-400 uppercase font-mono border-b border-[#2b304c]">
                        <tr>
                          <th className="px-6 py-3">Attempt ID</th>
                          <th className="px-6 py-3">Student ID</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Started At</th>
                          <th className="px-6 py-3">Submitted At</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e2335]">
                        {attempts.map(att => (
                          <tr key={att.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-teal-400">
                              #{att.id}
                            </td>
                            <td className="px-6 py-4 font-mono">
                              Student #{att.studentId}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                                att.status === 'SUBMITTED' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50' :
                                att.status === 'TIME_EXPIRED' ? 'bg-red-900/30 text-red-400 border-red-700/50' :
                                'bg-amber-900/30 text-amber-400 border-amber-700/50'
                              }`}>
                                {att.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-400">
                              {att.startedAt ? new Date(att.startedAt).toLocaleTimeString() : '—'}
                            </td>
                            <td className="px-6 py-4 font-mono text-gray-400">
                              {att.submittedAt ? new Date(att.submittedAt).toLocaleTimeString() : '—'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleInspectAttempt(att)}
                                className="px-3 py-1 rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 text-xs font-semibold transition-colors"
                              >
                                View Code
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────── MODALS ─────────────────── */}

      {/* Question Editor Modal */}
      <QuestionEditorModal
        isOpen={isQuestionModalOpen}
        question={editingQuestion}
        questionNumber={editingQuestionNumber}
        onSave={handleSaveQuestion}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setEditingQuestion(null);
        }}
      />

      {/* Edit Exam Details Modal */}
      {isEditingExam && (
        <div className="ee-backdrop" onMouseDown={e => e.target === e.currentTarget && setIsEditingExam(false)}>
          <div className="ee-modal max-w-lg bg-[#131622] border border-[#2b304c] rounded-2xl shadow-2xl overflow-hidden p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
              <h2 className="text-lg font-bold text-white">Edit Exam Information</h2>
              <button
                type="button"
                onClick={() => setIsEditingExam(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800/60"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveExamInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={e => setExamForm({ ...examForm, title: e.target.value })}
                  className="ee-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={3}
                  value={examForm.description}
                  onChange={e => setExamForm({ ...examForm, description: e.target.value })}
                  className="ee-input text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Duration (mins) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={examForm.durationMinutes}
                    onChange={e => setExamForm({ ...examForm, durationMinutes: parseInt(e.target.value) || 0 })}
                    className="ee-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={examForm.startTime}
                    onChange={e => setExamForm({ ...examForm, startTime: e.target.value })}
                    className="ee-input text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditingExam(false)}
                  className="ee-btn ee-btn--ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ee-btn ee-btn--publish"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Exam Modal */}
      {isExtendModalOpen && (
        <div className="ee-backdrop" onMouseDown={e => e.target === e.currentTarget && setIsExtendModalOpen(false)}>
          <div className="ee-modal max-w-sm bg-[#131622] border border-[#2b304c] rounded-2xl shadow-2xl overflow-hidden p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-amber-400" />
                Extend Exam Duration
              </h2>
              <button
                type="button"
                onClick={() => setIsExtendModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleExtendSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">
                  Extra Minutes to Add
                </label>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={extendMinutes}
                  onChange={e => setExtendMinutes(parseInt(e.target.value) || 0)}
                  className="ee-input font-bold text-amber-400"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  This will extend the exam deadline for all students immediately.
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsExtendModalOpen(false)}
                  className="ee-btn ee-btn--ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={extending}
                  className="ee-btn ee-btn--publish text-xs"
                >
                  {extending ? 'Extending...' : 'Extend'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Answers Modal */}
      {selectedAttempt && (
        <div className="ee-backdrop" onMouseDown={e => e.target === e.currentTarget && setSelectedAttempt(null)}>
          <div className="ee-modal max-w-4xl max-h-[88vh] bg-[#131622] border border-[#2b304c] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#161a29]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 size={18} className="text-teal-400" />
                  Student #{selectedAttempt.studentId} Submission
                </h2>
                <div className="text-xs text-gray-400 mt-0.5">
                  Attempt #{selectedAttempt.id} · Status: {selectedAttempt.status}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {loadingAnswers ? (
                <div className="text-center py-12 text-gray-400">Loading student code...</div>
              ) : attemptAnswers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No answers recorded for this attempt.</div>
              ) : (
                attemptAnswers.map((ans, idx) => {
                  const q = questions.find(item => item.id === ans.questionId);
                  return (
                    <div key={idx} className="bg-[#0e1019] border border-gray-800 rounded-xl overflow-hidden shadow-md">
                      <div className="px-4 py-3 bg-gray-900/60 border-b border-gray-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-400 font-mono">
                          {q ? `Q${q.questionNumber}: ${q.title}` : `Question #${ans.questionId}`}
                        </span>
                        <span className="text-xs text-gray-400 uppercase font-mono">
                          {ans.language}
                        </span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
                        {ans.code || '// No code saved'}
                      </pre>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default TeacherExamDetail;
