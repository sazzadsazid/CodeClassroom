import { fetchApi } from '../../../api/client';
import type {
  Course, Exam, ExamQuestion, ExamTestCase, QuestionDraft, TestCaseDraft,
} from './types';

/**
 * Thin API layer for the Teacher Exam Editor.
 * Kept separate from UI so a future importer (e.g. test-case files) can reuse
 * `createTestCase` without touching components.
 */
export interface ExamInfoPayload {
  courseId: number;
  title: string;
  description: string;
  durationMinutes: number;
  /** Local wall-clock time "YYYY-MM-DDTHH:mm:ss" (server uses LocalDateTime). */
  startTime: string | null;
  totalMarks?: number | null;
}

export const examApi = {
  // Courses
  listCourses: (): Promise<Course[]> => fetchApi('/courses'),

  // Exams
  getExam: (id: number | string): Promise<Exam> => fetchApi(`/exams/${id}`),
  createExam: (payload: ExamInfoPayload): Promise<Exam> =>
    fetchApi('/exams', { method: 'POST', body: JSON.stringify(payload) }),
  updateExam: (id: number, payload: ExamInfoPayload): Promise<Exam> =>
    fetchApi(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  publishExam: (id: number): Promise<Exam> => fetchApi(`/exams/${id}/publish`, { method: 'POST' }),
  startExam: (id: number): Promise<Exam> => fetchApi(`/exams/${id}/start`, { method: 'POST' }),

  // Questions
  listQuestions: (examId: number | string): Promise<ExamQuestion[]> => fetchApi(`/exams/${examId}/questions`),
  createQuestion: (examId: number, q: QuestionDraft): Promise<ExamQuestion> =>
    fetchApi(`/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify(q) }),
  updateQuestion: (id: number, q: QuestionDraft): Promise<ExamQuestion> =>
    fetchApi(`/exam-questions/${id}`, { method: 'PUT', body: JSON.stringify(q) }),
  deleteQuestion: (id: number): Promise<null> => fetchApi(`/exam-questions/${id}`, { method: 'DELETE' }),

  // Hidden test cases (teacher only)
  listTestCases: (questionId: number): Promise<ExamTestCase[]> =>
    fetchApi(`/exam-questions/${questionId}/test-cases`),
  createTestCase: (questionId: number, tc: TestCaseDraft): Promise<ExamTestCase> =>
    fetchApi(`/exam-questions/${questionId}/test-cases`, { method: 'POST', body: JSON.stringify(tc) }),
  updateTestCase: (id: number, tc: TestCaseDraft): Promise<ExamTestCase> =>
    fetchApi(`/exam-test-cases/${id}`, { method: 'PUT', body: JSON.stringify(tc) }),
  deleteTestCase: (id: number): Promise<null> => fetchApi(`/exam-test-cases/${id}`, { method: 'DELETE' }),
};

// ─── Date helpers ────────────────────────────────────────────────────────
// The backend stores LocalDateTime and compares against the server's local clock.
// Send the teacher's local wall-clock time as-is (NOT toISOString(), which shifts to UTC).

/** "2026-10-07T20:30" (datetime-local) -> "2026-10-07T20:30:00" */
export const toServerDateTime = (local: string): string | null =>
  local ? (local.length === 16 ? `${local}:00` : local) : null;

/** "2026-10-07T20:30:00[.sss]" -> "2026-10-07T20:30" for <input type="datetime-local"> */
export const toInputDateTime = (server: string | null | undefined): string =>
  server ? server.slice(0, 16) : '';

export const formatDateTime = (server: string | null | undefined): string => {
  if (!server) return 'Not scheduled';
  const d = new Date(server);
  if (isNaN(d.getTime())) return server;
  return d.toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

/** Extracts a readable message from fetchApi errors (Spring may return JSON or plain text). */
export const errorMessage = (err: unknown): string => {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const parsed = JSON.parse(raw);
    return parsed.message || parsed.error || raw;
  } catch {
    return raw || 'Something went wrong';
  }
};
