import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/authContext';
import { LoginPage } from './components/login-page/LoginPage';
import { RegisterPage } from './components/login-page/RegisterPage';
import { ForgotPasswordPage } from './components/login-page/ForgotPasswordPage';
import { DashboardLayout } from './components/login-page/DashboardLayout';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentCourses } from './components/student/StudentCourses';
import { CourseDetail } from './components/student/CourseDetail';
import { AssignmentDetail } from './components/student/AssignmentDetail';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentReports } from './components/student/StudentReports';
import { StudentDocuments } from './components/student/StudentDocuments';
import { StudentDiscussions } from './components/student/StudentDiscussions';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherCourses } from './components/teacher/TeacherCourses';
import { TeacherAssignments } from './components/teacher/TeacherAssignments';
import { TeacherDocuments } from './components/teacher/TeacherDocuments';
import { TeacherStudents } from './components/teacher/TeacherStudents';
import { TeacherReports } from './components/teacher/TeacherReports';
import { TeacherDiscussions } from './components/teacher/TeacherDiscussions';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { AdminCourses } from './components/admin/AdminCourses';
import { AdminReports } from './components/admin/AdminReports';
import { ProfilePage } from './components/login-page/ProfilePage';
import { Toaster } from './components/ui/sonner';

type AuthPage = 'login' | 'register' | 'forgot-password';
type AppPage = 'dashboard' | 'courses' | 'assignments' | 'documents' | 'discussions' | 'reports' | 'profile' | 'users' | 'students' | 'settings' | 'course-detail' | 'assignment-detail';

function AppContent() {
  const { user, login, logout, register } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as AppPage);
    setPageData(data || null);
    window.scrollTo(0, 0);
  };

  // Auth pages
  if (!user) {
    if (authPage === 'register') {
      return (
        <RegisterPage
          onRegister={register}
          onNavigateToLogin={() => setAuthPage('login')}
        />
      );
    }
    
    if (authPage === 'forgot-password') {
      return (
        <ForgotPasswordPage
          onNavigateToLogin={() => setAuthPage('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={login}
        onNavigateToRegister={() => setAuthPage('register')}
        onNavigateToForgotPassword={() => setAuthPage('forgot-password')}
      />
    );
  }

  // Main dashboard
  const renderPage = () => {
    // Student pages
    if (user.role === 'student') {
      if (currentPage === 'dashboard') {
        return <StudentDashboard user={user} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'courses') {
        return <StudentCourses user={user} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'course-detail' && pageData?.courseId) {
        return <CourseDetail courseId={pageData.courseId} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'assignment-detail' && pageData?.assignmentId) {
        return <AssignmentDetail assignmentId={pageData.assignmentId} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'assignments') {
        return <StudentAssignments user={user} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'documents') {
        return <StudentDocuments user={user} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'discussions') {
        return <StudentDiscussions user={user} />;
      }
      if (currentPage === 'reports') {
        return <StudentReports user={user} />;
      }
      if (currentPage === 'profile') {
        return <ProfilePage user={user} />;
      }
    }

    // Teacher pages
    if (user.role === 'teacher') {
      if (currentPage === 'dashboard') {
        return <TeacherDashboard user={user} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'courses') {
        return <TeacherCourses user={user} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'course-detail' && pageData?.courseId) {
        return <CourseDetail courseId={pageData.courseId} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'assignments') {
        return <TeacherAssignments user={user} onNavigate={handleNavigate} />;
      }
      if (currentPage === 'documents') {
        return <TeacherDocuments user={user} />;
      }
      if (currentPage === 'students') {
        return <TeacherStudents user={user} />;
      }
      if (currentPage === 'discussions') {
        return <TeacherDiscussions user={user} />;
      }
      if (currentPage === 'reports') {
        return <TeacherReports user={user} />;
      }
      if (currentPage === 'profile') {
        return <ProfilePage user={user} />;
      }
    }

    // Admin pages
    if (user.role === 'admin') {
      if (currentPage === 'dashboard') {
        return <AdminDashboard onNavigate={handleNavigate} />;
      }
      if (currentPage === 'users') {
        return <UserManagement />;
      }
      if (currentPage === 'courses') {
        return <AdminCourses />;
      }
      if (currentPage === 'reports') {
        return <AdminReports />;
      }
      if (currentPage === 'settings') {
        return <ProfilePage user={user} />;
      }
      if (currentPage === 'profile') {
        return <ProfilePage user={user} />;
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
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}