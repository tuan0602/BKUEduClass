import { useState, useEffect } from "react";
import { useAuth, User } from "./context/authContext";
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
import api from "./lib/axios";

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
  | "course-detail"
  | "assignment-detail";

interface Course {
  id: string;
  name: string;
  code: string;
  teacherName: string;
}

interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
}

export default function App() {
  const { user, logout } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [currentPage, setCurrentPage] = useState<AppPage>("dashboard");
  const [pageData, setPageData] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as AppPage);
    setPageData(data || null);
    window.scrollTo(0, 0);
  };

  // --- Fetch courses & assignments khi user login ---
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const coursesRes = await api.get<Course[]>(`/students/${user.userId}/courses`);
        setCourses(coursesRes.data);

        const assignmentsRes = await api.get<Assignment[]>(`/students/${user.userId}/assignments`);
        setAssignments(assignmentsRes.data);
      } catch (err) {
        console.error("Failed to fetch courses or assignments", err);
      }
    };

    fetchData();
  }, [user]);

  // --- Auth pages ---
  if (!user) {
    if (authPage === "register") {
      return <RegisterPage onNavigateToLogin={() => setAuthPage("login")} />;
    }
    if (authPage === "forgot-password") {
      return <ForgotPasswordPage onNavigateToLogin={() => setAuthPage("login")} />;
    }
    return (
      <LoginPage
        onNavigateToRegister={() => setAuthPage("register")}
        onNavigateToForgotPassword={() => setAuthPage("forgot-password")}
      />
    );
  }

  // --- Main dashboard ---
  const renderPage = () => {
    switch (user.role) {
      case "STUDENT":
        switch (currentPage) {
          case "dashboard":
            return <StudentDashboard user={user} courses={courses} assignments={assignments} onNavigate={handleNavigate} />;
          case "courses":
            return <StudentCourses user={user} onNavigate={handleNavigate} />;
          case "course-detail":
            return pageData?.courseId ? <CourseDetail courseId={pageData.courseId} onNavigate={handleNavigate} /> : null;
          case "assignment-detail":
            return pageData?.assignmentId ? <AssignmentDetail assignmentId={pageData.assignmentId} onNavigate={handleNavigate} /> : null;
          case "assignments":
            return <StudentAssignments user={user} onNavigate={handleNavigate} />;
          case "documents":
            return <StudentDocuments onNavigate={handleNavigate} />;
          case "discussions":
            return <StudentDiscussions  />;
          case "reports":
            return <StudentReports user={user} />;
          case "profile":
            return <ProfilePage user={user} />;
          default:
            return <div>Trang không tồn tại</div>;
        }
      case "TEACHER":
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
      case "ADMIN":
        switch (currentPage) {
          case "dashboard":
            return <AdminDashboard onNavigate={handleNavigate} />;
          case "users":
            return <UserManagement />;
          case "courses":
            return <AdminCourses />;
          case "reports":
            return <AdminReports />;
          case "profile":
            return <ProfilePage user={user} />;
          default:
            return <div>Trang không tồn tại</div>;
        }
      default:
        return <div>Trang không tồn tại</div>;
    }
  };

  return (
    <DashboardLayout user={user} currentPage={currentPage} onNavigate={handleNavigate} onLogout={logout}>
      {renderPage()}
      <Toaster />
    </DashboardLayout>
  );
}
