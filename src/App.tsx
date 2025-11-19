import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./components/login-page/LoginPage";
import { RegisterPage } from "./components/login-page/RegisterPage";
import { ForgotPasswordPage } from "./components/login-page/ForgotPasswordPage";
import { DashboardLayout } from "./components/login-page/DashboardLayout";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { StudentCourses } from "./components/student/StudentCourses";
import { CourseDetail } from "./components/student/CourseDetail";
import { AssignmentDetail } from "./components/student/AssignmentDetail";
import { StudentAssignments } from "./components/student/StudentAssignments";
import { StudentReports } from "./components/student/StudentReports";
import { StudentDocuments } from "./components/student/StudentDocuments";
import { StudentDiscussions } from "./components/student/StudentDiscussions";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";
import { TeacherCourses } from "./components/teacher/TeacherCourses";
import { TeacherAssignments } from "./components/teacher/TeacherAssignments";
import { TeacherDocuments } from "./components/teacher/TeacherDocuments";
import { TeacherStudents } from "./components/teacher/TeacherStudents";
import { TeacherReports } from "./components/teacher/TeacherReports";
import { TeacherDiscussions } from "./components/teacher/TeacherDiscussions";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { UserManagement } from "./components/admin/UserManagement";
import { AdminCourses } from "./components/admin/AdminCourses";
import { AdminReports } from "./components/admin/AdminReports";
import { ProfilePage } from "./components/login-page/ProfilePage";
import { Toaster } from "./components/ui/sonner";

type AuthPage = "login" | "register" | "forgot-password";
type AppPage =
  | "dashboard"
  | "courses"
  | "assignments"
  | "documents"
  | "discussions"
  | "reports"
  | "profile"
  | "users"
  | "students"
  | "settings"
  | "course-detail"
  | "assignment-detail";

export default function App() {
  const { user, login, logout, register } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");
  const [pageData, setPageData] = useState<any>(null);

  // wrapper login để khớp với LoginPage
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      const role = user?.role || localStorage.getItem("user_role");
      // redirect theo role
      setCurrentPage("dashboard");
    } catch {
      throw new Error("Login thất bại");
    }
  };

  // wrapper register để khớp với RegisterPage
  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    role: "student" | "teacher"
  ) => {
    try {
      await register({ email, password, name, role });
      setAuthPage("login");
      return true;
    } catch {
      return false;
    }
  };

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as AppPage);
    setPageData(data || null);
    window.scrollTo(0, 0);
  };

  // --- Auth pages ---
  if (!user) {
    if (authPage === "register") {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onNavigateToLogin={() => setAuthPage("login")}
        />
      );
    }
    if (authPage === "forgot-password") {
      return (
        <ForgotPasswordPage
          onNavigateToLogin={() => setAuthPage("login")}
        />
      );
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToRegister={() => setAuthPage("register")}
        onNavigateToForgotPassword={() => setAuthPage("forgot-password")}
      />
    );
  }

  // --- Main dashboard ---
  const renderPage = () => {
    if (user.role === "student") {
      switch (currentPage) {
        case "dashboard":
          return <StudentDashboard user={user} onNavigate={handleNavigate} />;
        case "courses":
          return <StudentCourses user={user} onNavigate={handleNavigate} />;
        case "course-detail":
          return pageData?.courseId ? (
            <CourseDetail courseId={pageData.courseId} onNavigate={handleNavigate} />
          ) : null;
        case "assignment-detail":
          return pageData?.assignmentId ? (
            <AssignmentDetail assignmentId={pageData.assignmentId} onNavigate={handleNavigate} />
          ) : null;
        case "assignments":
          return <StudentAssignments user={user} onNavigate={handleNavigate} />;
        case "documents":
          return <StudentDocuments user={user} onNavigate={handleNavigate} />;
        case "discussions":
          return <StudentDiscussions user={user} />;
        case "reports":
          return <StudentReports user={user} />;
        case "profile":
          return <ProfilePage user={user} />;
        default:
          return <div>Trang không tồn tại</div>;
      }
    }

    if (user.role === "teacher") {
      switch (currentPage) {
        case "dashboard":
          return <TeacherDashboard user={user} onNavigate={handleNavigate} />;
        case "courses":
          return <TeacherCourses user={user} onNavigate={handleNavigate} />;
        case "assignments":
          return <TeacherAssignments user={user} onNavigate={handleNavigate} />;
        case "documents":
          return <TeacherDocuments user={user} />;
        case "students":
          return <TeacherStudents user={user} />;
        case "discussions":
          return <TeacherDiscussions user={user} />;
        case "reports":
          return <TeacherReports user={user} />;
        case "profile":
          return <ProfilePage user={user} />;
        default:
          return <div>Trang không tồn tại</div>;
      }
    }

    if (user.role === "admin") {
      switch (currentPage) {
        case "dashboard":
          return <AdminDashboard onNavigate={handleNavigate} />;
        case "users":
          return <UserManagement />;
        case "courses":
          return <AdminCourses />;
        case "reports":
          return <AdminReports />;
        case "settings":
        case "profile":
          return <ProfilePage user={user} />;
        default:
          return <div>Trang không tồn tại</div>;
      }
    }

    return <div>Trang không tồn tại</div>;
  };

  return (
    <DashboardLayout
      user={user}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
    >
      {renderPage()}
      <Toaster />
    </DashboardLayout>
  );
}
