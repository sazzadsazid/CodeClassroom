// Shared types for the Teacher Exam Editor.

export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'ENDED';
export type Language = 'JAVA' | 'PYTHON' | 'C' | 'CPP' | 'JAVASCRIPT';

export interface Course {
  id: number;
  courseCode: string;
  name: string;
  teacherId?: number;
}

export interface Exam {
  id: number;
  courseId: number;
  title: string;
  description: string;
  durationMinutes: number;
  startTime: string | null;
  endTime: string | null;
  totalMarks: number | null;
  status: ExamStatus;
}

/** Student-visible question model (mirrors backend ExamQuestionDto — never contains test cases). */
export interface ExamQuestion {
  id: number;
  examId: number;
  questionNumber: number;
  title: string;
  problemStatement: string;
  inputDescription: string | null;
  outputDescription: string | null;
  constraints: string | null;
  sampleInput: string | null;
  sampleOutput: string | null;
  marks: number;
  allowedLanguage: Language;
}

export type QuestionDraft = Omit<ExamQuestion, 'id' | 'examId' | 'questionNumber'> & {
  questionNumber?: number;
};

/** Teacher-only hidden grading data (backend ExamTestCaseDto). */
export interface ExamTestCase {
  id: number;
  questionId: number;
  testCaseNumber: number;
  input: string;
  expectedOutput: string;
}

export interface TestCaseDraft {
  input: string;
  expectedOutput: string;
}

export const LANGUAGES: { value: Language; label: string; color: string }[] = [
  { value: 'JAVA',       label: 'Java',       color: '#f89820' },
  { value: 'PYTHON',     label: 'Python',     color: '#4b8bbe' },
  { value: 'C',          label: 'C',          color: '#a8b9cc' },
  { value: 'CPP',        label: 'C++',        color: '#f34b7d' },
  { value: 'JAVASCRIPT', label: 'JavaScript', color: '#f7df1e' },
];

export const languageMeta = (lang?: string | null) =>
  LANGUAGES.find(l => l.value === lang) ?? { value: lang as Language, label: lang ?? '—', color: '#94a3b8' };

export const EMPTY_QUESTION: QuestionDraft = {
  title: '',
  problemStatement: '',
  inputDescription: '',
  outputDescription: '',
  constraints: '',
  sampleInput: '',
  sampleOutput: '',
  marks: 10,
  allowedLanguage: 'JAVA',
};

export const MAX_MARKS = 1000;
export const MAX_TEST_CASE_LENGTH = 100_000;
