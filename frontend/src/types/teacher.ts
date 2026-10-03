// ─── Teacher types ─────────────────────────────────────────────────────────

export interface TeacherCourse {
  id: string;
  name: string;
  language: string;
  studentCount: number;
  assignmentCount: number;
  status: 'active' | 'archived' | 'draft';
  semester: string;
  description: string;
  nextDeadline?: string;
}

export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials
  courseId: string;
  progress: number;
  submissionsCount: number;
  avgScore: number;
  status: 'online' | 'offline' | 'coding' | 'idle';
  lastSeen: string;
}

export interface TeacherAssignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  language: string;
  deadline: string;
  timeLimit: number; // minutes
  maxScore: number;
  starterCode: string;
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[];
  status: 'draft' | 'active' | 'closed';
  submissionsCount: number;
  totalStudents: number;
}

export interface TeacherSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  assignmentId: string;
  assignmentTitle: string;
  courseName: string;
  language: string;
  submittedAt: string;
  score?: number;
  maxScore: number;
  status: 'pending' | 'reviewed' | 'graded';
  feedback?: string;
  codeSnippet: string;
  runAttempts: number;
  timeSpentMinutes: number;
}

export interface LiveStudent {
  id: string;
  name: string;
  avatar: string;
  assignmentTitle: string;
  courseId: string;
  status: 'online' | 'offline' | 'coding' | 'idle';
  currentActivity: string;
  lastActivity: string;
  linesWritten: number;
  runAttempts: number;
  sessionStart: string;
}

export interface CodingEvent {
  id: string;
  timestamp: string;
  offsetSeconds: number;
  type: 'type' | 'paste' | 'delete' | 'run' | 'compile_error' | 'run_success' | 'run_fail' | 'idle';
  description: string;
  codeBefore?: string;
  codeAfter?: string;
  linesChanged?: number;
  charsInserted?: number;
}

export interface AISignal {
  id: string;
  type: 'paste_detection' | 'unusual_speed' | 'large_insertion' | 'pattern_mismatch' | 'no_revisions';
  severity: 'low' | 'medium' | 'high';
  label: string;
  description: string;
  timestamp?: string;
  requiresReview: boolean;
}

export interface SessionAnalysis {
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  sessionDate: string;
  durationMinutes: number;
  activeMinutes: number;
  idleMinutes: number;
  totalKeystrokes: number;
  totalCharsTyped: number;
  totalCharsPasted: number;
  pasteEvents: number;
  largeInsertionEvents: number;
  codeRevisions: number;
  runAttempts: number;
  successfulRuns: number;
  failedRuns: number;
  avgTypingSpeedWPM: number;
  signals: AISignal[];
}
