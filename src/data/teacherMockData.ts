import type {
  TeacherCourse,
  TeacherStudent,
  TeacherAssignment,
  TeacherSubmission,
  LiveStudent,
  CodingEvent,
  SessionAnalysis,
} from '../types/teacher';

// ─── Teacher Courses ───────────────────────────────────────────────────────
export const teacherCourses: TeacherCourse[] = [
  {
    id: 'tc1',
    name: 'Data Structures & Algorithms',
    language: 'Java',
    studentCount: 28,
    assignmentCount: 8,
    status: 'active',
    semester: 'Fall 2026',
    description: 'Core CS course covering fundamental data structures, algorithm design, and complexity analysis.',
    nextDeadline: '2026-10-08',
  },
  {
    id: 'tc2',
    name: 'Full-Stack Web Development',
    language: 'TypeScript',
    studentCount: 22,
    assignmentCount: 10,
    status: 'active',
    semester: 'Fall 2026',
    description: 'End-to-end web development using React, TypeScript, Node.js, and Express.',
    nextDeadline: '2026-10-12',
  },
  {
    id: 'tc3',
    name: 'Python for Data Science',
    language: 'Python',
    studentCount: 34,
    assignmentCount: 6,
    status: 'active',
    semester: 'Fall 2026',
    description: 'Applied data science with Python, NumPy, Pandas, Matplotlib, and scikit-learn.',
    nextDeadline: '2026-10-10',
  },
  {
    id: 'tc4',
    name: 'System Design Fundamentals',
    language: 'Multiple',
    studentCount: 18,
    assignmentCount: 5,
    status: 'active',
    semester: 'Fall 2026',
    description: 'Designing scalable distributed systems. Architecture, load balancing, caching, and microservices.',
    nextDeadline: '2026-12-01',
  },
];

// ─── Teacher Students ──────────────────────────────────────────────────────
export const teacherStudents: TeacherStudent[] = [
  { id: 'ts1', name: 'Alex Johnson',    email: 'alex.j@uni.edu',    avatar: 'AJ', courseId: 'tc1', progress: 68, submissionsCount: 5, avgScore: 84, status: 'coding',  lastSeen: '2 min ago' },
  { id: 'ts2', name: 'Maria Garcia',    email: 'maria.g@uni.edu',   avatar: 'MG', courseId: 'tc1', progress: 82, submissionsCount: 7, avgScore: 91, status: 'online',  lastSeen: '5 min ago' },
  { id: 'ts3', name: 'James Lee',       email: 'james.l@uni.edu',   avatar: 'JL', courseId: 'tc1', progress: 45, submissionsCount: 4, avgScore: 72, status: 'offline', lastSeen: '3h ago' },
  { id: 'ts4', name: 'Priya Patel',     email: 'priya.p@uni.edu',   avatar: 'PP', courseId: 'tc1', progress: 91, submissionsCount: 8, avgScore: 95, status: 'coding',  lastSeen: '1 min ago' },
  { id: 'ts5', name: 'Ethan Brown',     email: 'ethan.b@uni.edu',   avatar: 'EB', courseId: 'tc2', progress: 60, submissionsCount: 3, avgScore: 78, status: 'idle',    lastSeen: '12 min ago' },
  { id: 'ts6', name: 'Sofia Martinez',  email: 'sofia.m@uni.edu',   avatar: 'SM', courseId: 'tc2', progress: 73, submissionsCount: 6, avgScore: 88, status: 'online',  lastSeen: '8 min ago' },
  { id: 'ts7', name: 'David Kim',       email: 'david.k@uni.edu',   avatar: 'DK', courseId: 'tc3', progress: 55, submissionsCount: 4, avgScore: 69, status: 'offline', lastSeen: '1d ago' },
  { id: 'ts8', name: 'Emily Chen',      email: 'emily.c@uni.edu',   avatar: 'EC', courseId: 'tc3', progress: 88, submissionsCount: 7, avgScore: 93, status: 'coding',  lastSeen: 'Just now' },
  { id: 'ts9', name: 'Ryan Thompson',   email: 'ryan.t@uni.edu',    avatar: 'RT', courseId: 'tc4', progress: 30, submissionsCount: 1, avgScore: 55, status: 'offline', lastSeen: '2d ago' },
  { id: 'ts10', name: 'Aisha Malik',    email: 'aisha.m@uni.edu',   avatar: 'AM', courseId: 'tc1', progress: 77, submissionsCount: 6, avgScore: 86, status: 'online',  lastSeen: '4 min ago' },
];

// ─── Teacher Assignments ───────────────────────────────────────────────────
export const teacherAssignments: TeacherAssignment[] = [
  {
    id: 'ta1',
    courseId: 'tc1',
    courseName: 'Data Structures & Algorithms',
    title: 'Implement a Binary Search Tree',
    description: 'Implement a fully functional BST in Java with insert, delete, search, and all traversal methods. Include JUnit tests.',
    language: 'Java',
    deadline: '2026-10-08',
    timeLimit: 120,
    maxScore: 100,
    starterCode: `public class BinarySearchTree {
    private Node root;

    private class Node {
        int data;
        Node left, right;
        Node(int data) { this.data = data; }
    }

    // TODO: Implement insert
    public void insert(int data) {

    }

    // TODO: Implement search
    public boolean search(int data) {
        return false;
    }

    // TODO: Implement inOrder traversal
    public void inOrder() {

    }
}`,
    testCases: [
      { input: 'insert(5), insert(3), insert(7), search(3)', expectedOutput: 'true', isHidden: false },
      { input: 'insert(5), search(10)', expectedOutput: 'false', isHidden: false },
      { input: 'insert(5), insert(3), insert(7), inOrder()', expectedOutput: '3 5 7', isHidden: true },
    ],
    status: 'active',
    submissionsCount: 14,
    totalStudents: 28,
  },
  {
    id: 'ta2',
    courseId: 'tc2',
    courseName: 'Full-Stack Web Development',
    title: 'Build a REST API with Express',
    description: 'Create a CRUD REST API for a Books resource using Express.js and TypeScript with validation and error handling.',
    language: 'TypeScript',
    deadline: '2026-10-12',
    timeLimit: 180,
    maxScore: 100,
    starterCode: `import express from 'express';
const app = express();
app.use(express.json());

// TODO: Define Book interface
interface Book {
    // Add fields here
}

const books: Book[] = [];

// TODO: Implement GET /books
app.get('/books', (req, res) => {

});

// TODO: Implement POST /books
app.post('/books', (req, res) => {

});

app.listen(3000, () => console.log('Server running on port 3000'));`,
    testCases: [
      { input: 'POST /books { "title": "Clean Code" }', expectedOutput: '201 Created', isHidden: false },
      { input: 'GET /books', expectedOutput: '200 with array', isHidden: false },
    ],
    status: 'active',
    submissionsCount: 10,
    totalStudents: 22,
  },
  {
    id: 'ta3',
    courseId: 'tc3',
    courseName: 'Python for Data Science',
    title: 'Data Cleaning with Pandas',
    description: 'Clean and preprocess a provided CSV dataset with missing values, duplicates, and inconsistent formatting.',
    language: 'Python',
    deadline: '2026-09-30',
    timeLimit: 90,
    maxScore: 100,
    starterCode: `import pandas as pd

# Load the dataset
df = pd.read_csv('customer_data.csv')

# TODO: Remove duplicates

# TODO: Handle missing values

# TODO: Normalize column names

# TODO: Convert date columns

# Export
df.to_csv('cleaned_data.csv', index=False)
`,
    testCases: [
      { input: 'cleaned_data.csv exists', expectedOutput: 'True', isHidden: false },
      { input: 'df.duplicated().sum()', expectedOutput: '0', isHidden: true },
    ],
    status: 'closed',
    submissionsCount: 32,
    totalStudents: 34,
  },
  {
    id: 'ta4',
    courseId: 'tc1',
    courseName: 'Data Structures & Algorithms',
    title: 'Implement Quick Sort',
    description: 'Implement standard and randomised Quick Sort in Java, benchmark against Arrays.sort().',
    language: 'Java',
    deadline: '2026-10-20',
    timeLimit: 90,
    maxScore: 80,
    starterCode: `public class QuickSort {

    // TODO: Standard Quick Sort
    public static void quickSort(int[] arr, int low, int high) {

    }

    // TODO: Randomised Quick Sort
    public static void randomQuickSort(int[] arr, int low, int high) {

    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        quickSort(arr, 0, arr.length - 1);
    }
}`,
    testCases: [
      { input: '[64, 34, 25, 12, 22, 11, 90]', expectedOutput: '[11, 12, 22, 25, 34, 64, 90]', isHidden: false },
    ],
    status: 'active',
    submissionsCount: 3,
    totalStudents: 28,
  },
  {
    id: 'ta5',
    courseId: 'tc4',
    courseName: 'System Design Fundamentals',
    title: 'Design a URL Shortener',
    description: 'Design a scalable URL shortening service. Submit architecture diagrams and written analysis.',
    language: 'Multiple',
    deadline: '2026-09-25',
    timeLimit: 240,
    maxScore: 100,
    starterCode: `# System Design Document Template
# Assignment: URL Shortener

## 1. Requirements
### Functional
- 
### Non-Functional
- 

## 2. Capacity Estimation
### Traffic
- Reads per second: 
- Writes per second: 
### Storage
- 

## 3. High-Level Design
(Insert architecture diagram here)

## 4. Database Schema

## 5. API Design

## 6. Scalability Discussion
`,
    testCases: [],
    status: 'closed',
    submissionsCount: 11,
    totalStudents: 18,
  },
];

// ─── Teacher Submissions ───────────────────────────────────────────────────
export const teacherSubmissions: TeacherSubmission[] = [
  {
    id: 'tsub1',
    studentId: 'ts1',
    studentName: 'Alex Johnson',
    studentAvatar: 'AJ',
    assignmentId: 'ta1',
    assignmentTitle: 'Implement a Binary Search Tree',
    courseName: 'Data Structures & Algorithms',
    language: 'Java',
    submittedAt: '2026-10-02T09:45:00Z',
    status: 'pending',
    maxScore: 100,
    codeSnippet: `public void insert(int data) {
    root = insertRec(root, data);
}
private Node insertRec(Node root, int data) {
    if (root == null) { root = new Node(data); return root; }
    if (data < root.data) root.left = insertRec(root.left, data);
    else if (data > root.data) root.right = insertRec(root.right, data);
    return root;
}`,
    runAttempts: 7,
    timeSpentMinutes: 52,
  },
  {
    id: 'tsub2',
    studentId: 'ts2',
    studentName: 'Maria Garcia',
    studentAvatar: 'MG',
    assignmentId: 'ta1',
    assignmentTitle: 'Implement a Binary Search Tree',
    courseName: 'Data Structures & Algorithms',
    language: 'Java',
    submittedAt: '2026-10-01T18:20:00Z',
    status: 'graded',
    score: 96,
    maxScore: 100,
    feedback: 'Excellent implementation! All traversals correct. Minor style issue: prefer early returns over deeply nested conditionals.',
    codeSnippet: `public boolean search(int data) {
    return searchRec(root, data);
}
private boolean searchRec(Node root, int data) {
    if (root == null) return false;
    if (root.data == data) return true;
    return data < root.data ? searchRec(root.left, data) : searchRec(root.right, data);
}`,
    runAttempts: 4,
    timeSpentMinutes: 38,
  },
  {
    id: 'tsub3',
    studentId: 'ts4',
    studentName: 'Priya Patel',
    studentAvatar: 'PP',
    assignmentId: 'ta1',
    assignmentTitle: 'Implement a Binary Search Tree',
    courseName: 'Data Structures & Algorithms',
    language: 'Java',
    submittedAt: '2026-10-02T11:10:00Z',
    status: 'graded',
    score: 100,
    maxScore: 100,
    feedback: 'Perfect. Clean, well-commented code with comprehensive test coverage. Excellent edge case handling.',
    codeSnippet: `public void delete(int data) {
    root = deleteRec(root, data);
}`,
    runAttempts: 5,
    timeSpentMinutes: 44,
  },
  {
    id: 'tsub4',
    studentId: 'ts5',
    studentName: 'Ethan Brown',
    studentAvatar: 'EB',
    assignmentId: 'ta2',
    assignmentTitle: 'Build a REST API with Express',
    courseName: 'Full-Stack Web Development',
    language: 'TypeScript',
    submittedAt: '2026-10-05T09:15:00Z',
    status: 'reviewed',
    score: 74,
    maxScore: 100,
    feedback: 'API endpoints functional but missing input validation on POST. Error handling middleware not implemented.',
    codeSnippet: `app.post('/books', (req, res) => {
    const book = req.body;
    books.push(book);
    res.status(201).json(book);
});`,
    runAttempts: 12,
    timeSpentMinutes: 95,
  },
  {
    id: 'tsub5',
    studentId: 'ts8',
    studentName: 'Emily Chen',
    studentAvatar: 'EC',
    assignmentId: 'ta3',
    assignmentTitle: 'Data Cleaning with Pandas',
    courseName: 'Python for Data Science',
    language: 'Python',
    submittedAt: '2026-09-28T14:32:00Z',
    status: 'graded',
    score: 92,
    maxScore: 100,
    feedback: 'Excellent data cleaning. Minor: could have used imputation instead of dropping all NaN rows.',
    codeSnippet: `df.drop_duplicates(inplace=True)
df.dropna(inplace=True)
df.columns = [c.lower().replace(' ', '_') for c in df.columns]`,
    runAttempts: 6,
    timeSpentMinutes: 68,
  },
  {
    id: 'tsub6',
    studentId: 'ts3',
    studentName: 'James Lee',
    studentAvatar: 'JL',
    assignmentId: 'ta1',
    assignmentTitle: 'Implement a Binary Search Tree',
    courseName: 'Data Structures & Algorithms',
    language: 'Java',
    submittedAt: '2026-10-02T16:55:00Z',
    status: 'pending',
    maxScore: 100,
    codeSnippet: `public void insert(int data) {
    Node newNode = new Node(data);
    if (root == null) { root = newNode; return; }
    // TODO: implement the rest
}`,
    runAttempts: 3,
    timeSpentMinutes: 28,
  },
];

// ─── Live Students ─────────────────────────────────────────────────────────
export const liveStudents: LiveStudent[] = [
  { id: 'ts1', name: 'Alex Johnson',   avatar: 'AJ', assignmentTitle: 'Binary Search Tree', courseId: 'tc1', status: 'coding',  currentActivity: 'Writing insert() method',      lastActivity: '23 sec ago',  linesWritten: 87,  runAttempts: 4,  sessionStart: '2026-10-02T12:30:00Z' },
  { id: 'ts2', name: 'Maria Garcia',   avatar: 'MG', assignmentTitle: 'Binary Search Tree', courseId: 'tc1', status: 'online',  currentActivity: 'Reading assignment description', lastActivity: '2 min ago',   linesWritten: 120, runAttempts: 6,  sessionStart: '2026-10-02T12:10:00Z' },
  { id: 'ts4', name: 'Priya Patel',    avatar: 'PP', assignmentTitle: 'Binary Search Tree', courseId: 'tc1', status: 'coding',  currentActivity: 'Running test cases',            lastActivity: '8 sec ago',   linesWritten: 210, runAttempts: 9,  sessionStart: '2026-10-02T11:55:00Z' },
  { id: 'ts5', name: 'Ethan Brown',    avatar: 'EB', assignmentTitle: 'Build a REST API',   courseId: 'tc2', status: 'idle',    currentActivity: 'Idle — no keystrokes',          lastActivity: '14 min ago',  linesWritten: 45,  runAttempts: 2,  sessionStart: '2026-10-02T13:00:00Z' },
  { id: 'ts6', name: 'Sofia Martinez', avatar: 'SM', assignmentTitle: 'Build a REST API',   courseId: 'tc2', status: 'online',  currentActivity: 'Viewing docs',                  lastActivity: '4 min ago',   linesWritten: 70,  runAttempts: 3,  sessionStart: '2026-10-02T12:45:00Z' },
  { id: 'ts8', name: 'Emily Chen',     avatar: 'EC', assignmentTitle: 'Data Cleaning',      courseId: 'tc3', status: 'coding',  currentActivity: 'Writing pandas transformations', lastActivity: '5 sec ago',   linesWritten: 95,  runAttempts: 7,  sessionStart: '2026-10-02T12:20:00Z' },
  { id: 'ts10', name: 'Aisha Malik',   avatar: 'AM', assignmentTitle: 'Binary Search Tree', courseId: 'tc1', status: 'online',  currentActivity: 'Reviewing output',              lastActivity: '6 min ago',   linesWritten: 60,  runAttempts: 2,  sessionStart: '2026-10-02T13:05:00Z' },
  { id: 'ts3', name: 'James Lee',      avatar: 'JL', assignmentTitle: 'Binary Search Tree', courseId: 'tc1', status: 'offline', currentActivity: 'Disconnected',                  lastActivity: '3h ago',      linesWritten: 30,  runAttempts: 1,  sessionStart: '2026-10-02T09:00:00Z' },
  { id: 'ts7', name: 'David Kim',      avatar: 'DK', assignmentTitle: 'Data Cleaning',      courseId: 'tc3', status: 'offline', currentActivity: 'Disconnected',                  lastActivity: '1d ago',      linesWritten: 0,   runAttempts: 0,  sessionStart: '2026-10-01T10:00:00Z' },
];

// ─── Coding Events (for session replay) ───────────────────────────────────
export const mockCodingEvents: CodingEvent[] = [
  { id: 'e1',  timestamp: '12:30:00', offsetSeconds: 0,   type: 'type',          description: 'Started typing class structure',              linesChanged: 8,  charsInserted: 180 },
  { id: 'e2',  timestamp: '12:31:20', offsetSeconds: 80,  type: 'type',          description: 'Added Node inner class',                       linesChanged: 5,  charsInserted: 95 },
  { id: 'e3',  timestamp: '12:33:10', offsetSeconds: 190, type: 'paste',         description: 'Pasted 42 lines of code',                      linesChanged: 42, charsInserted: 980 },
  { id: 'e4',  timestamp: '12:33:15', offsetSeconds: 195, type: 'run',           description: 'First run attempt — compile error',            linesChanged: 0 },
  { id: 'e5',  timestamp: '12:33:45', offsetSeconds: 225, type: 'compile_error', description: 'NullPointerException on line 18',             linesChanged: 0 },
  { id: 'e6',  timestamp: '12:34:30', offsetSeconds: 270, type: 'delete',        description: 'Deleted 6 lines, rewrote insert()',            linesChanged: 6,  charsInserted: 0 },
  { id: 'e7',  timestamp: '12:35:00', offsetSeconds: 300, type: 'type',          description: 'Rewrote insert() method',                      linesChanged: 10, charsInserted: 220 },
  { id: 'e8',  timestamp: '12:36:20', offsetSeconds: 380, type: 'run',           description: 'Second run attempt',                          linesChanged: 0 },
  { id: 'e9',  timestamp: '12:36:22', offsetSeconds: 382, type: 'run_success',   description: 'Test 1 passed: insert + search',              linesChanged: 0 },
  { id: 'e10', timestamp: '12:37:00', offsetSeconds: 420, type: 'type',          description: 'Added delete() method',                        linesChanged: 18, charsInserted: 410 },
  { id: 'e11', timestamp: '12:39:10', offsetSeconds: 550, type: 'idle',          description: 'No activity for 2 minutes',                   linesChanged: 0 },
  { id: 'e12', timestamp: '12:41:30', offsetSeconds: 690, type: 'type',          description: 'Added traversal methods',                      linesChanged: 12, charsInserted: 260 },
  { id: 'e13', timestamp: '12:43:00', offsetSeconds: 780, type: 'run',           description: 'Third run attempt',                           linesChanged: 0 },
  { id: 'e14', timestamp: '12:43:03', offsetSeconds: 783, type: 'run_success',   description: 'All 3 visible test cases passed',             linesChanged: 0 },
  { id: 'e15', timestamp: '12:44:00', offsetSeconds: 840, type: 'type',          description: 'Added JUnit tests',                            linesChanged: 20, charsInserted: 450 },
];

// ─── Code snapshots (for session replay) ──────────────────────────────────
export const replayCodeSnapshots: Record<string, string> = {
  e1: `public class BinarySearchTree {
    private Node root;

    private class Node {
        int data;
        Node left, right;
        Node(int data) { this.data = data; }
    }
}`,
  e3: `public class BinarySearchTree {
    private Node root;

    private class Node {
        int data;
        Node left, right;
        Node(int data) { this.data = data; }
    }

    public void insert(int data) {
        Node newNode = new Node(data);
        if (root == null) { root = newNode; return; }
        Node curr = root;
        while (true) {
            if (data < curr.data) {
                if (curr.left == null) { curr.left = newNode; return; }
                curr = curr.left;
            } else {
                if (curr.right == null) { curr.right = newNode; return; }
                curr = curr.right;
            }
        }
    }

    public boolean search(int data) {
        Node curr = root;
        while (curr != null) {
            if (curr.data == data) return true;
            curr = data < curr.data ? curr.left : curr.right;
        }
        return false;
    }
    // ... 20 more lines pasted
}`,
  e14: `public class BinarySearchTree {
    private Node root;

    private class Node {
        int data;
        Node left, right;
        Node(int data) { this.data = data; }
    }

    public void insert(int data) {
        root = insertRec(root, data);
    }

    private Node insertRec(Node node, int data) {
        if (node == null) return new Node(data);
        if (data < node.data) node.left = insertRec(node.left, data);
        else if (data > node.data) node.right = insertRec(node.right, data);
        return node;
    }

    public boolean search(int data) {
        return searchRec(root, data);
    }

    private boolean searchRec(Node node, int data) {
        if (node == null) return false;
        if (node.data == data) return true;
        return data < node.data ? searchRec(node.left, data) : searchRec(node.right, data);
    }

    public void inOrder() { inOrderRec(root); }
    private void inOrderRec(Node node) {
        if (node != null) {
            inOrderRec(node.left);
            System.out.print(node.data + " ");
            inOrderRec(node.right);
        }
    }
}`,
};

// ─── Session Analysis ──────────────────────────────────────────────────────
export const mockSessionAnalysis: SessionAnalysis = {
  studentId: 'ts1',
  studentName: 'Alex Johnson',
  assignmentTitle: 'Implement a Binary Search Tree',
  sessionDate: '2026-10-02T12:30:00Z',
  durationMinutes: 52,
  activeMinutes: 38,
  idleMinutes: 14,
  totalKeystrokes: 1840,
  totalCharsTyped: 1460,
  totalCharsPasted: 980,
  pasteEvents: 1,
  largeInsertionEvents: 1,
  codeRevisions: 3,
  runAttempts: 7,
  successfulRuns: 4,
  failedRuns: 3,
  avgTypingSpeedWPM: 52,
  signals: [
    {
      id: 'sig1',
      type: 'paste_detection',
      severity: 'high',
      label: 'Large paste event detected',
      description: 'A single paste of 42 lines (980 characters) was recorded at 12:33 into the session. This represents 40% of the final solution.',
      timestamp: '12:33:10',
      requiresReview: true,
    },
    {
      id: 'sig2',
      type: 'large_insertion',
      severity: 'medium',
      label: 'Unusual code insertion',
      description: 'Code insertion volume is significantly higher than typing activity in one burst. This pattern may warrant review.',
      timestamp: '12:33:10',
      requiresReview: true,
    },
    {
      id: 'sig3',
      type: 'no_revisions',
      severity: 'low',
      label: 'Low revision rate after paste',
      description: 'After the large paste event, fewer than 5 characters were modified before the first successful run. Signal detected — requires review.',
      requiresReview: false,
    },
    {
      id: 'sig4',
      type: 'unusual_speed',
      severity: 'low',
      label: 'Typing speed variation',
      description: 'Average WPM during early session (12 WPM) is significantly lower than during the rewrite phase (68 WPM). Inconsistency noted.',
      requiresReview: false,
    },
  ],
};

// ─── Teacher Dashboard Stats ───────────────────────────────────────────────
export const teacherDashboardStats = {
  totalCourses: 4,
  totalStudents: 102,
  activeAssignments: 4,
  pendingReviews: 8,
  recentSubmissions: 6,
  helpRequests: 2,
};
