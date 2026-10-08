// ─── Course ────────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  title: string;
  instructor: string;
  language: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  nextLesson: string;
  dueDate?: string;
  totalAssignments: number;
  completedAssignments: number;
  description: string;
}


// ─── CodingHistory ─────────────────────────────────────────────────────────
export interface CodingActivity {
  date: string;
  linesOfCode: number;
  problemsSolved: number;
  language: string;
  sessionMinutes: number;
}

// ─── CodingSession ─────────────────────────────────────────────────────────
export interface CodingSession {
  id: string;
  attemptId: string;
  examTitle: string;
  course: string;
  language: string;
  date: string;
  durationMinutes: number;
  runs: number;
  linesWritten: number;
  status: 'completed' | 'in-progress' | 'abandoned';
}

// ─── Notification ─────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: 'assignment' | 'grade' | 'announcement' | 'reminder' | 'feedback';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  courseId?: string;
  examId?: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalCourses: number;
  completedAssignments: number;
  pendingAssignments: number;
  averageScore: number;
  currentStreak: number;
  totalCodingHours: number;
}
