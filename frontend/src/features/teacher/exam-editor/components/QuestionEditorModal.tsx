import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, Lock, Code2 } from 'lucide-react';
import { Field, CodeArea } from './primitives';
import { LANGUAGES, type Language } from '../types';

export interface TestCaseDraftItem {
  id?: number;
  input: string;
  expectedOutput: string;
}

export interface QuestionDraftWithTestCases {
  id?: number;
  questionNumber?: number;
  title: string;
  problemStatement: string;
  inputDescription: string | null;
  outputDescription: string | null;
  constraints: string | null;
  sampleInput: string | null;
  sampleOutput: string | null;
  marks: number;
  allowedLanguage: Language;
  testCases: TestCaseDraftItem[];
}

interface QuestionEditorModalProps {
  isOpen: boolean;
  question: QuestionDraftWithTestCases | null;
  questionNumber: number;
  onSave: (q: QuestionDraftWithTestCases) => void;
  onClose: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  question,
  questionNumber,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<QuestionDraftWithTestCases>({
    title: '',
    problemStatement: '',
    inputDescription: '',
    outputDescription: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    marks: 10,
    allowedLanguage: 'JAVA',
    testCases: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (question) {
      const initialTestCases = question.testCases && question.testCases.length > 0
        ? [...question.testCases]
        : [{ input: '', expectedOutput: '' }];
        
      setFormData({
        ...question,
        inputDescription: question.inputDescription || '',
        outputDescription: question.outputDescription || '',
        constraints: question.constraints || '',
        sampleInput: question.sampleInput || '',
        sampleOutput: question.sampleOutput || '',
        testCases: initialTestCases,
      });
    } else {
      setFormData({
        title: '',
        problemStatement: '',
        inputDescription: '',
        outputDescription: '',
        constraints: '',
        sampleInput: '',
        sampleOutput: '',
        marks: 10,
        allowedLanguage: 'JAVA',
        testCases: [
          { input: '', expectedOutput: '' }
        ],
      });
    }
    setErrors({});
  }, [question, isOpen]);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }],
    }));
  };

  const handleRemoveTestCase = (index: number) => {
    if (formData.testCases.length <= 1) return; // Prevent deleting the last test case
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'expectedOutput', value: string) => {
    setFormData(prev => {
      const updated = [...prev.testCases];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, testCases: updated };
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    }
    if (!formData.problemStatement.trim()) {
      errs.problemStatement = 'Problem statement is required';
    }
    if (!formData.marks || formData.marks < 1) {
      errs.marks = 'Marks must be at least 1';
    }
    if (!formData.allowedLanguage) {
      errs.allowedLanguage = 'Allowed language is required';
    }

    if (formData.testCases.length === 0) {
      errs['general'] = 'At least one test case is required';
    }

    // Check test cases: both input and expected output are required
    formData.testCases.forEach((tc, idx) => {
      if (!tc.input.trim()) {
        errs[`tc_input_${idx}`] = `Test Case #${idx + 1} must have a test input`;
      }
      if (!tc.expectedOutput.trim()) {
        errs[`tc_output_${idx}`] = `Test Case #${idx + 1} must have an expected output`;
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Small timeout to allow React to render the error texts
      setTimeout(() => {
        const errorEl = document.querySelector('.text-red-400');
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }
    onSave({
      ...formData,
      questionNumber: formData.questionNumber || questionNumber,
      title: formData.title.trim(),
      problemStatement: formData.problemStatement.trim(),
      inputDescription: formData.inputDescription?.trim() || null,
      outputDescription: formData.outputDescription?.trim() || null,
      constraints: formData.constraints?.trim() || null,
      sampleInput: formData.sampleInput?.trim() || null,
      sampleOutput: formData.sampleOutput?.trim() || null,
    });
  };

  return (
    <div className="ee-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="ee-modal max-w-4xl max-h-[92vh] flex flex-col bg-[#131622] border border-[#2b304c] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="ee-modal__head flex items-center justify-between px-6 py-4 border-b border-[#242940] bg-[#171a2b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono text-sm font-bold">
              Q{formData.questionNumber || questionNumber}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {question ? `Edit Question: ${question.title || `Q${questionNumber}`}` : `Add New Question (Q${questionNumber})`}
              </h2>
              <p className="text-xs text-gray-400">
                Configure problem details, sample input/output, and hidden grading test cases.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/60 transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-gray-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Basic Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Field label="Problem Title" required error={errors.title}>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="ee-input"
                    placeholder="e.g. Two Sum"
                  />
                </Field>
              </div>

              <div>
                <Field label="Marks" required error={errors.marks}>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={formData.marks}
                    onChange={e => setFormData({ ...formData, marks: parseInt(e.target.value) || 0 })}
                    className="ee-input font-bold text-teal-400"
                  />
                </Field>
              </div>
            </div>

            <div>
              <Field label="Allowed Language" required error={errors.allowedLanguage}>
                <select
                  value={formData.allowedLanguage}
                  onChange={e => setFormData({ ...formData, allowedLanguage: e.target.value as Language })}
                  className="ee-input"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label} ({lang.value})
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Section 2: Problem Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider border-b border-gray-800 pb-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              Problem Description
            </div>

            <Field
              label="Problem Statement"
              required
              error={errors.problemStatement}
              hint="Write the full problem description. Line breaks and indentation are preserved."
            >
              <textarea
                rows={6}
                value={formData.problemStatement}
                onChange={e => setFormData({ ...formData, problemStatement: e.target.value })}
                className="ee-input font-sans text-sm leading-relaxed"
                placeholder="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Input Description"
                hint="Describe the format of standard input (stdin)."
              >
                <textarea
                  rows={3}
                  value={formData.inputDescription || ''}
                  onChange={e => setFormData({ ...formData, inputDescription: e.target.value })}
                  className="ee-input text-sm"
                  placeholder="The first line contains an integer N representing..."
                />
              </Field>

              <Field
                label="Output Description"
                hint="Describe the format of expected standard output (stdout)."
              >
                <textarea
                  rows={3}
                  value={formData.outputDescription || ''}
                  onChange={e => setFormData({ ...formData, outputDescription: e.target.value })}
                  className="ee-input text-sm"
                  placeholder="Print the solution on a single line..."
                />
              </Field>
            </div>

            <Field
              label="Constraints"
              hint="List constraints on input values and complexity limits."
            >
              <textarea
                rows={2}
                value={formData.constraints || ''}
                onChange={e => setFormData({ ...formData, constraints: e.target.value })}
                className="ee-input ee-code text-sm font-mono"
                placeholder="1 <= N <= 10^5&#10;-10^9 <= nums[i] <= 10^9"
              />
            </Field>
          </div>

          {/* Section 3: Sample Input / Output (Public Examples) */}
          <div className="p-5 rounded-xl border border-sky-500/30 bg-gradient-to-b from-sky-500/10 to-sky-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Eye size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Sample Input & Output
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      Visible to Students
                    </span>
                  </h3>
                  <p className="text-xs text-sky-200/70">
                    These examples will be shown to students in the problem description as reference cases.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Sample Input (stdin)">
                <CodeArea
                  id="sample-input"
                  title="sample.in"
                  value={formData.sampleInput || ''}
                  onChange={v => setFormData({ ...formData, sampleInput: v })}
                  placeholder="4&#10;2 7 11 15&#10;9"
                  rows={4}
                  allowFileLoad
                />
              </Field>

              <Field label="Sample Output (stdout)">
                <CodeArea
                  id="sample-output"
                  title="sample.out"
                  value={formData.sampleOutput || ''}
                  onChange={v => setFormData({ ...formData, sampleOutput: v })}
                  placeholder="0 1"
                  rows={4}
                  allowFileLoad
                />
              </Field>
            </div>
          </div>

          {/* Section 4: Hidden Test Cases (Grading) */}
          <div className="p-5 rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-amber-500/5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Lock size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Hidden Test Cases
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Teacher Only · Grading
                    </span>
                  </h3>
                  <p className="text-xs text-amber-200/70">
                    Students will NEVER see these test cases. They are used exclusively for automated evaluation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddTestCase}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} /> Add Test Case
              </button>
            </div>

            {/* Test Cases List */}
            <div className="space-y-4 pt-2">
              {formData.testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#3b3221] bg-[#12141f] p-4 space-y-3 relative shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Code2 size={13} />
                      Test Case #{idx + 1}
                    </span>
                    {formData.testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(idx)}
                        className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors text-xs flex items-center gap-1"
                        title="Delete Test Case"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Field label="Test Input (stdin)" required hint="Input passed to student's program" error={errors[`tc_input_${idx}`]}>
                        <CodeArea
                          id={`tc-in-${idx}`}
                          title={`input_${idx + 1}.txt`}
                          value={tc.input}
                          onChange={v => handleTestCaseChange(idx, 'input', v)}
                          placeholder="Test input..."
                          rows={3}
                          invalid={Boolean(errors[`tc_input_${idx}`])}
                          allowFileLoad
                        />
                      </Field>
                    </div>

                    <div>
                      <Field label="Expected Output (stdout)" required hint="Exact expected program output" error={errors[`tc_output_${idx}`]}>
                        <CodeArea
                          id={`tc-out-${idx}`}
                          title={`expected_${idx + 1}.txt`}
                          value={tc.expectedOutput}
                          onChange={v => handleTestCaseChange(idx, 'expectedOutput', v)}
                          placeholder="Expected output..."
                          rows={3}
                          invalid={Boolean(errors[`tc_output_${idx}`])}
                          allowFileLoad
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}

              {formData.testCases.length === 0 && (
                <div className="text-center py-6 border border-dashed border-gray-800 rounded-xl text-gray-400 text-xs">
                  No hidden test cases yet. Click &quot;Add Test Case&quot; to configure grading test cases.
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer inside form */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="ee-btn ee-btn--ghost px-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ee-btn ee-btn--publish px-6 flex items-center gap-2"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
