import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../components/login-page/DashboardLayout";

// Auth pages
import { LoginPage } from "../components/login-page/LoginPage";
import { RegisterPage } from "../components/login-page/RegisterPage";
import { ForgotPasswordPage } from "../components/login-page/ForgotPasswordPage";
import { ProfilePage } from "../components/login-page/ProfilePage";

// Student pages
import { StudentDashboard } from "../components/student/StudentDashboard";
import { StudentCourses } from "../components/student/StudentCourses";
import { CourseDetail } from "../components/student/CourseDetail";
import { AssignmentDetail } from "../components/student/AssignmentDetail";
import { StudentAssignments } from "../components/student/StudentAssignments";
import { StudentReports } from "../components/student/StudentReports";
import { StudentDocuments } from "../components/student/StudentDocuments";
import { StudentDiscussions } from "../components/student/StudentDiscussions";

// Teacher pages
import { TeacherDashboard } from "../components/teacher/TeacherDashboard";
import { TeacherCourses } from "../components/teacher/TeacherCourses";
import { TeacherCourseDetail } from "../components/teacher/TeacherCourseDetail";
import { TeacherAssignments } from "../components/teacher/TeacherAssignments";
import { TeacherDocuments } from "../components/teacher/TeacherDocuments";
import { TeacherStudents } from "../components/teacher/TeacherStudents";
import { TeacherReports } from "../components/teacher/TeacherReports";
import { TeacherDiscussions } from "../components/teacher/TeacherDiscussions";

// Admin pages
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { UserManagement } from "../components/admin/UserManagement";
import { AdminCourses } from "../components/admin/AdminCourses";
import { AdminReports } from "../components/admin/AdminReports";

export function AppRoutes() {
  const { user, logout, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Auth routes (public)
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Protected routes (authenticated users)
  return (
    <DashboardLayout user={user} onLogout={logout}>
      <Routes>
        {/* Student routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentCourses user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentAssignments user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignments/:assignmentId"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <AssignmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDocuments user={user}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/discussions"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDiscussions user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentReports user={user} />
            </ProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherDashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/courses"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherCourses user={user} />
            </ProtectedRoute>
          }
        />
       <Route
          path="/teacher/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherCourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherAssignments user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/documents"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherDocuments user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherStudents user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/discussions"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherDiscussions user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/reports"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherReports user={user} />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Common routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage user={user} />
            </ProtectedRoute>
          }
        />

        {/* Redirect to role-based dashboard */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                user.role === "ADMIN"
                  ? "/admin/dashboard"
                  : user.role === "TEACHER"
                  ? "/teacher/dashboard"
                  : "/dashboard"
              }
              replace
            />
          }
        />

        {/* 404 */}
        <Route path="*" element={<div>Trang không tồn tại</div>} />
      </Routes>
    </DashboardLayout>
  );
}