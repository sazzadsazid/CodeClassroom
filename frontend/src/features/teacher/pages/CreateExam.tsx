import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Edit2, Trash2, Clock, BookOpen,
  Award, Globe, Save, CheckCircle2, FileText, Lock, Eye
} from 'lucide-react';
import { examApi, toServerDateTime } from '../exam-editor/examApi';
import type { Course } from '../exam-editor/types';
import { languageMeta } from '../exam-editor/types';
import { useConfirm, useToasts } from '../exam-editor/components/primitives';
import {
  QuestionEditorModal,
  type QuestionDraftWithTestCases,
} from '../exam-editor/components/QuestionEditorModal';
import '../exam-editor/examEditor.css';

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const { confirm, dialog } = useConfirm();
  const toasts = useToasts();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    durationMinutes: 60,
    startTime: '',
  });

  // Questions State
  const [questions, setQuestions] = useState<QuestionDraftWithTestCases[]>([]);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    examApi.listCourses()
      .then(setCourses)
      .catch(err => toasts.error('Failed to load courses: ' + err.message))
      .finally(() => setLoadingCourses(false));
  }, []);

  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  const selectedCourse = courses.find(c => String(c.id) === formData.courseId);

  // Question Modal Actions
  const handleOpenAddQuestion = () => {
    setActiveModalIndex(null);
    setIsModalOpen(true);
  };

  const handleOpenEditQuestion = (index: number) => {
    setActiveModalIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (savedQ: QuestionDraftWithTestCases) => {
    if (activeModalIndex !== null) {
      // Editing existing question
      setQuestions(prev => {
        const updated = [...prev];
        updated[activeModalIndex] = savedQ;
        return updated;
      });
      toasts.success(`Question Q${activeModalIndex + 1} updated`);
    } else {
      // Adding new question
      setQuestions(prev => [
        ...prev,
        { ...savedQ, questionNumber: prev.length + 1 },
      ]);
      toasts.success(`Question Q${questions.length + 1} added`);
    }
    setIsModalOpen(false);
    setActiveModalIndex(null);
  };

  const handleDeleteQuestion = async (index: number) => {
    const targetQ = questions[index];
    const ok = await confirm({
      title: 'Delete Question?',
      message: `Are you sure you want to delete Question Q${index + 1}: "${targetQ.title || 'Untitled'}" and its test cases?`,
      confirmLabel: 'Delete Question',
      tone: 'danger',
    });
    if (!ok) return;

    setQuestions(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      // Renumber
      return filtered.map((q, idx) => ({ ...q, questionNumber: idx + 1 }));
    });
    toasts.success('Question deleted');
  };

  // Save Draft / Publish Exam
  const handleSaveExam = async (publish: boolean) => {
    if (!formData.courseId) {
      toasts.error('Please select a target course');
      return;
    }
    if (!formData.title.trim()) {
      toasts.error('Please enter an exam title');
      return;
    }
    if (formData.durationMinutes < 1) {
      toasts.error('Duration must be at least 1 minute');
      return;
    }

    if (formData.startTime) {
      const startTimeDate = new Date(formData.startTime);
      if (startTimeDate < new Date()) {
        const ok = await confirm({
          title: 'Start Time in the Past',
          message: 'The scheduled start time is in the past. Are you sure you want to proceed?',
          confirmLabel: 'Yes, proceed',
          tone: 'danger' as const
        });
        if (!ok) return;
      }
    }

    if (publish) {
      if (questions.length === 0) {
        toasts.error('Cannot publish an exam without questions. Please add at least one question.');
        return;
      }
      const ok = await confirm({
        title: 'Publish Exam?',
        message: 'Publishing will make this exam visible to enrolled students. They will be able to take it when scheduled or when started.',
        confirmLabel: 'Publish Exam',
      });
      if (!ok) return;
    }

    setSaving(true);
    try {
      const examPayload = {
        courseId: parseInt(formData.courseId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        durationMinutes: formData.durationMinutes,
        startTime: toServerDateTime(formData.startTime),
        totalMarks: totalMarks,
      };

      const createdExam = await examApi.createExam(examPayload);

      // Create each question and its test cases
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const savedQ = await examApi.createQuestion(createdExam.id, {
          title: q.title,
          problemStatement: q.problemStatement,
          inputDescription: q.inputDescription,
          outputDescription: q.outputDescription,
          constraints: q.constraints,
          sampleInput: q.sampleInput,
          sampleOutput: q.sampleOutput,
          marks: q.marks,
          allowedLanguage: q.allowedLanguage,
          questionNumber: i + 1,
        });

        // Create test cases for this question
        if (q.testCases && q.testCases.length > 0) {
          for (const tc of q.testCases) {
            await examApi.createTestCase(savedQ.id, {
              input: tc.input,
              expectedOutput: tc.expectedOutput,
            });
          }
        }
      }

      if (publish) {
        await examApi.publishExam(createdExam.id);
        toasts.success('Exam created and published successfully!');
      } else {
        toasts.success('Exam draft saved successfully!');
      }

      setTimeout(() => {
        navigate(`/teacher/exams/${createdExam.id}`);
      }, 700);
    } catch (err: any) {
      toasts.error('Failed to create exam: ' + (err.message || 'Server error'));
      setSaving(false);
    }
  };

  const isDraftValid = Boolean(formData.courseId && formData.title.trim().length > 0);
  const isPublishValid = Boolean(isDraftValid && formData.durationMinutes > 0 && questions.length > 0);

  let statusIcon = <CheckCircle2 size={15} />;
  let statusText = "Ready to save";
  let statusClass = "text-gray-400";

  if (!formData.courseId || !formData.title.trim()) {
    statusIcon = <Lock size={15} />;
    statusText = "Select course & enter title";
    statusClass = "text-gray-400";
  } else if (questions.length === 0) {
    statusIcon = <CheckCircle2 size={15} />;
    statusText = "Add questions to publish";
    statusClass = "text-amber-400";
  } else {
    statusIcon = <CheckCircle2 size={15} />;
    statusText = "Ready to publish";
    statusClass = "text-emerald-400";
  }

  return (
    <div className="ee-root min-h-screen pb-40 text-gray-100">
      {toasts.node}
      {dialog}

      {/* Top Bar / Breadcrumb */}
      <div className="ee-topbar pt-6 px-4">
        <button
          onClick={() => navigate('/teacher/exams')}
          className="ee-back"
          title="Back to Exam Dashboard"
        >
          <ArrowLeft size={16} /> Back to Exams
        </button>
      </div>

      {/* Hero Header */}
      <div className="ee-hero mx-4">
        <div className="ee-hero__row">
          <div>
            <div className="ee-hero__eyebrow">
              <BookOpen size={14} /> Teacher Examination Portal
            </div>
            <h1 className="ee-hero__title text-white">
              {formData.title ? formData.title : "Create New Exam"}
            </h1>
            <p className="ee-hero__sub">
              Define exam structure, configure programming problems, and set up automated test cases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="ee-status ee-status--draft">
              <span className="ee-status__dot" /> DRAFT
            </span>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="ee-stats">
          <div className="ee-stat">
            <div className="ee-stat__icon">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="ee-stat__label">Target Course</div>
              <div className="ee-stat__value">
                {selectedCourse ? `${selectedCourse.courseCode}` : 'Not selected'}
              </div>
            </div>
          </div>

          <div className="ee-stat">
            <div className="ee-stat__icon">
              <Clock size={18} />
            </div>
            <div>
              <div className="ee-stat__label">Duration</div>
              <div className="ee-stat__value">{formData.durationMinutes} minutes</div>
            </div>
          </div>

          <div className="ee-stat">
            <div className="ee-stat__icon">
              <FileText size={18} />
            </div>
            <div>
              <div className="ee-stat__label">Questions</div>
              <div className="ee-stat__value">{questions.length} problems</div>
            </div>
          </div>

          <div className="ee-stat">
            <div className="ee-stat__icon">
              <Award size={18} />
            </div>
            <div>
              <div className="ee-stat__label">Total Marks</div>
              <div className="ee-stat__value text-teal-400 font-bold">{totalMarks} pts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="px-4 space-y-8 max-w-[1240px] mx-auto">
        {/* SECTION 1: EXAM INFORMATION */}
        <div className="bg-[#181b2b] border border-[#2b304c] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <BookOpen size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Exam Information</h2>
                <p className="text-xs text-gray-400">Course, schedule, and general exam instructions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Course <span className="text-teal-400">*</span>
              </label>
              <select
                required
                value={formData.courseId}
                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                className="ee-input"
                disabled={loadingCourses}
              >
                <option value="">Select a course...</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.courseCode} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Exam Title <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="ee-input"
                placeholder="e.g. Midterm Examination 2026"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Description / Instructions
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="ee-input text-sm"
              placeholder="Provide instructions, permitted tools, and examination rules..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Duration (minutes) <span className="text-teal-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  max={600}
                  value={formData.durationMinutes}
                  onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                  className="ee-input"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                  MINUTES
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Scheduled Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="ee-input text-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: QUESTIONS */}
        <div className="bg-[#181b2b] border border-[#2b304c] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Exam Questions
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-800 text-teal-400 border border-teal-500/30 font-mono">
                    {questions.length} problems · {totalMarks} pts
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  Programming problems, sample input/output, and automated test cases
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddQuestion}
              className="ee-btn ee-btn--publish flex items-center gap-2"
            >
              <Plus size={16} /> Add Question
            </button>
          </div>

          {/* Questions List */}
          {questions.length === 0 ? (
            <div className="ee-empty py-12">
              <div className="ee-empty__icon">
                <FileText size={24} />
              </div>
              <h3 className="ee-empty__title">No questions added yet</h3>
              <p className="ee-empty__text">
                Create programming challenges for students with problem statements, constraints, sample cases, and grading test cases.
              </p>
              <button
                type="button"
                onClick={handleOpenAddQuestion}
                className="mt-5 ee-btn ee-btn--publish flex items-center gap-2"
              >
                <Plus size={16} /> Add Your First Question
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const langInfo = languageMeta(q.allowedLanguage);
                return (
                  <div
                    key={idx}
                    className="relative bg-[#131622] border border-[#282d44] hover:border-teal-500/40 rounded-xl p-5 transition-all shadow-md flex items-start gap-4 overflow-hidden"
                  >
                    {/* Question Number Badge */}
                    <div className="ee-qnum shrink-0">
                      <span className="ee-qnum__q">QUESTION</span>
                      <span className="ee-qnum__n">{idx + 1}</span>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="text-base font-bold text-white truncate">
                          {q.title || `Question ${idx + 1}`}
                        </h3>
                      </div>

                      {/* Chips */}
                      <div className="ee-qcard__chips">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          {q.marks} Marks
                        </span>

                        <span
                          className="px-2.5 py-0.5 rounded-md text-xs font-bold border"
                          style={{
                            color: langInfo.color,
                            backgroundColor: `${langInfo.color}15`,
                            borderColor: `${langInfo.color}35`,
                          }}
                        >
                          {langInfo.label}
                        </span>

                        {q.sampleInput || q.sampleOutput ? (
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
                            <Eye size={12} /> Sample I/O
                          </span>
                        ) : null}

                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Lock size={12} /> {q.testCases.length} Test Cases
                        </span>
                      </div>

                      {/* Preview */}
                      <p className="ee-qcard__preview text-xs text-gray-400 mt-2 line-clamp-2">
                        {q.problemStatement}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditQuestion(idx)}
                        className="p-2 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-gray-800/80 transition-colors"
                        title="Edit Question"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800/80 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleOpenAddQuestion}
                className="ee-add-q"
              >
                <Plus size={18} /> Add Another Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#12141f] border-t border-[#2b304c] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] p-4 sm:px-6 md:px-8">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className={`flex items-center gap-1.5 font-bold ${statusClass}`}>
              {statusIcon} {statusText}
            </span>
            <span className="text-gray-500">·</span>
            <span className="font-medium text-gray-300">{questions.length} Questions</span>
            <span className="text-gray-500">·</span>
            <span className="font-bold text-teal-400">{totalMarks} Total Marks</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={saving}
              onClick={() => navigate('/teacher/exams')}
              className="ee-btn ee-btn--ghost flex-1 sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving || !isDraftValid}
              onClick={() => handleSaveExam(false)}
              className={`ee-btn ee-btn--ghost border border-gray-700 text-white flex items-center gap-2 flex-1 sm:flex-none ${(!isDraftValid || saving) ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}`}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              type="button"
              disabled={saving || !isPublishValid}
              onClick={() => handleSaveExam(true)}
              className={`ee-btn ee-btn--publish flex items-center gap-2 flex-1 sm:flex-none ${(!isPublishValid || saving) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Globe size={16} />
              {saving ? 'Publishing...' : 'Publish Exam'}
            </button>
          </div>
        </div>
      </div>

      {/* Question Editor Modal */}
      <QuestionEditorModal
        isOpen={isModalOpen}
        question={activeModalIndex !== null ? questions[activeModalIndex] : null}
        questionNumber={activeModalIndex !== null ? activeModalIndex + 1 : questions.length + 1}
        onSave={handleSaveQuestion}
        onClose={() => {
          setIsModalOpen(false);
          setActiveModalIndex(null);
        }}
      />
    </div>
  );
};

export default CreateExam;
