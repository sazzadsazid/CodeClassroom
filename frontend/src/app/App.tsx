import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import StudentLayout from '../components/layout/StudentLayout';
import TeacherLayout from '../components/layout/TeacherLayout';
import AdminLayout from '../components/layout/AdminLayout';

// ─── Public pages ──────────────────────────────────────────────────────────
import Home from '../features/public/pages/Home';
import Login from '../features/auth/pages/Login';

// ─── Student pages ─────────────────────────────────────────────────────────
import Dashboard from '../features/student/pages/Dashboard';
import MyCourses from '../features/student/pages/MyCourses';
import Assignments from '../features/student/pages/Assignments';
import AssignmentDetails from '../features/student/pages/AssignmentDetails';
import CodingWorkspace from '../features/student/pages/CodingWorkspace';
import CodingHistory from '../features/student/pages/CodingHistory';
import Submissions from '../features/student/pages/Submissions';

// ─── Teacher pages ─────────────────────────────────────────────────────────
import TeacherDashboard from '../features/teacher/pages/TeacherDashboard';
import MyClasses from '../features/teacher/pages/MyClasses';
import ClassDetails from '../features/teacher/pages/ClassDetails';
import LiveMonitor from '../features/teacher/pages/LiveMonitor';
import StudentLiveSession from '../features/teacher/pages/StudentLiveSession';
import SessionReplay from '../features/teacher/pages/SessionReplay';
import AIAnalysis from '../features/teacher/pages/AIAnalysis';
import TeacherAssignments from '../features/teacher/pages/TeacherAssignments';
import TeacherAssignmentDetail from '../features/teacher/pages/TeacherAssignmentDetail';
import CreateAssignment from '../features/teacher/pages/CreateAssignment';
import TeacherSubmissions from '../features/teacher/pages/TeacherSubmissions';
import HelpRequests from '../features/teacher/pages/HelpRequests';

// ─── Admin pages ───────────────────────────────────────────────────────────
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import AdminUsers from '../features/admin/pages/AdminUsers';
import AdminCourses from '../features/admin/pages/AdminCourses';
import AdminActivityLogs from '../features/admin/pages/AdminActivityLogs';
import AdminSettings from '../features/admin/pages/AdminSettings';

// ─── Helpers ───────────────────────────────────────────────────────────────
const S = (page: React.ReactNode) => (
  <ProtectedRoute requiredRole="student">
    <StudentLayout>{page}</StudentLayout>
  </ProtectedRoute>
);

const T = (page: React.ReactNode) => (
  <ProtectedRoute requiredRole="teacher">
    <TeacherLayout>{page}</TeacherLayout>
  </ProtectedRoute>
);

const A = (page: React.ReactNode) => (
  <ProtectedRoute requiredRole="admin">
    <AdminLayout>{page}</AdminLayout>
  </ProtectedRoute>
);

import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ───────────────────────────────────────────────── */}
          <Route path="/"      element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* ── Student portal ───────────────────────────────────────── */}
          <Route path="/student"                          element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/dashboard"                element={S(<Dashboard />)} />
          <Route path="/student/courses"                  element={S(<MyCourses />)} />
          <Route path="/student/assignments"              element={S(<Assignments />)} />
          <Route path="/student/assignments/:id"          element={S(<AssignmentDetails />)} />
          <Route path="/student/workspace/:id"            element={S(<CodingWorkspace />)} />
          <Route path="/student/coding-history"           element={S(<CodingHistory />)} />
          <Route path="/student/submissions"              element={S(<Submissions />)} />

          {/* ── Teacher portal ───────────────────────────────────────── */}
          <Route path="/teacher"                              element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="/teacher/dashboard"                    element={T(<TeacherDashboard />)} />
          <Route path="/teacher/classes"                      element={T(<MyClasses />)} />
          <Route path="/teacher/classes/:id"                  element={T(<ClassDetails />)} />
          <Route path="/teacher/live-monitor"                 element={T(<LiveMonitor />)} />
          <Route path="/teacher/live-monitor/:id"             element={T(<StudentLiveSession />)} />
          <Route path="/teacher/session-replay"               element={T(<SessionReplay />)} />
          <Route path="/teacher/session-replay/:id"           element={T(<SessionReplay />)} />
          <Route path="/teacher/ai-analysis"                  element={T(<AIAnalysis />)} />
          <Route path="/teacher/ai-analysis/:id"              element={T(<AIAnalysis />)} />
          <Route path="/teacher/assignments"                  element={T(<TeacherAssignments />)} />
          <Route path="/teacher/assignments/create"           element={T(<CreateAssignment />)} />
          <Route path="/teacher/assignments/:id"              element={T(<TeacherAssignmentDetail />)} />
          <Route path="/teacher/assignments/:id/edit"         element={T(<CreateAssignment />)} />
          <Route path="/teacher/submissions"                  element={T(<TeacherSubmissions />)} />
          <Route path="/teacher/help-requests"                element={T(<HelpRequests />)} />

          {/* ── Admin portal ─────────────────────────────────────────── */}
          <Route path="/admin"                                element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard"                      element={A(<AdminDashboard />)} />
          <Route path="/admin/users"                          element={A(<AdminUsers />)} />
          <Route path="/admin/courses"                        element={A(<AdminCourses />)} />
          <Route path="/admin/activity"                       element={A(<AdminActivityLogs />)} />
          <Route path="/admin/settings"                       element={A(<AdminSettings />)} />

          {/* ── Fallback ─────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
