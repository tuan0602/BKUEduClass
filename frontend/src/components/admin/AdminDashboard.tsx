// src/components/admin/AdminDashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, BookOpen, FileText, Activity, TrendingUp, Award, ClipboardList } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useUsers } from '../../hooks/useUsers';
import { useCourses } from '../../hooks/useCourse';
import { useMemo } from 'react';
import { Role } from '../../lib/user.types';

export function AdminDashboard() {
  // ===========================
  // FETCH DATA USING HOOKS
  // ===========================
  
  // Lấy tất cả users
  const { data: usersData, isLoading: loadingUsers } = useUsers({ 
    page: 0, 
    size: 9999 
  });
  
  // Lấy tất cả courses
  const { data: coursesData, isLoading: loadingCourses } = useCourses({ 
    page: 0, 
    size: 9999 
  });

  // ===========================
  // COMPUTE STATS FROM DATA
  // ===========================
  const stats = useMemo(() => {
    const users = usersData?.result || [];
    const courses = coursesData?.result || [];

    // Tính tổng số assignments từ tất cả courses
    const totalAssignments = courses.reduce((sum, course) => {
      return sum + (course.assignmentCount || 0);
    }, 0);

    return {
      totalUsers: usersData?.meta?.totalElements || 0,
      students: users.filter(u => u.role === Role.STUDENT).length,
      teachers: users.filter(u => u.role === Role.TEACHER).length,
      admins: users.filter(u => u.role === Role.ADMIN).length,
      totalCourses: coursesData?.meta?.totalElements || 0,
      totalAssignments: totalAssignments,
    };
  }, [usersData, coursesData]);

  // ===========================
  // TOP COURSES - Courses có nhiều sinh viên nhất
  // ===========================
  const topCourses = useMemo(() => {
    const courses = coursesData?.result || [];
    return courses
      .sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0))
      .slice(0, 5);
  }, [coursesData]);

  // ===========================
  // COURSES WITH MOST ASSIGNMENTS - Courses có nhiều bài tập nhất
  // ===========================
  const coursesWithMostAssignments = useMemo(() => {
    const courses = coursesData?.result || [];
    return courses
      .sort((a, b) => (b.assignmentCount || 0) - (a.assignmentCount || 0))
      .slice(0, 5);
  }, [coursesData]);

  // ===========================
  // TOP STUDENTS - Mock data (cần backend hỗ trợ để lấy điểm thật)
  // ===========================
  const topStudents = useMemo(() => {
    const students = (usersData?.result || []).filter(u => u.role === Role.STUDENT);
    
    // TODO: Backend cần endpoint /api/admin/top-students với điểm thực
    // Hiện tại dùng mock data
    return students.slice(0, 5).map((student, index) => ({
      ...student,
      averageScore: 9.5 - (index * 0.3), // Mock score
      totalAssignments: 15 - index, // Mock
    }));
  }, [usersData]);

  // ===========================
  // PREPARE CHART DATA
  // ===========================
  const userRoleData = useMemo(() => [
    { name: 'Sinh viên', value: stats.students, color: '#2F80ED' },
    { name: 'Giảng viên', value: stats.teachers, color: '#27AE60' },
    { name: 'Quản trị viên', value: stats.admins, color: '#E74C3C' }
  ], [stats]);

  const activityData = useMemo(() => [
    { month: 'T7', users: 65, courses: 12 },
    { month: 'T8', users: 75, courses: 15 },
    { month: 'T9', users: 85, courses: 18 },
    { month: 'T10', users: 98, courses: 20 },
    { month: 'T11', users: 110, courses: 22 },
    { month: 'T12', users: stats.totalUsers, courses: stats.totalCourses }
  ], [stats]);

  // ===========================
  // FORMAT TIME
  // ===========================
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  // ===========================
  // LOADING STATE
  // ===========================
  const isLoading = loadingUsers || loadingCourses;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-lg text-muted-foreground">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  // ===========================
  // RENDER UI
  // ===========================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground mt-1">Quản trị BK EduClass</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.students} SV • {stats.teachers} GV • {stats.admins} Admin
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lớp học</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài tập</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng số bài tập</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Hệ thống ổn định</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố người dùng theo vai trò</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2F80ED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#2F80ED" 
                  name="Người dùng"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="courses" 
                  stroke="#27AE60" 
                  name="Lớp học"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Three columns section */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* 1. TOP COURSES */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <CardTitle>Top lớp học</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Nhiều sinh viên nhất</p>
          </CardHeader>
          <CardContent>
            {topCourses.length > 0 ? (
              <div className="space-y-3">
                {topCourses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-muted-foreground">{course.code}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{course.studentCount || 0}</div>
                      <div className="text-xs text-muted-foreground">sinh viên</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. TOP STUDENTS */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <CardTitle>Sinh viên xuất sắc</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Điểm cao nhất</p>
          </CardHeader>
          <CardContent>
            {topStudents.length > 0 ? (
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div 
                    key={student.userId} 
                    className="flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">{student.averageScore?.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">điểm TB</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. COURSES WITH MOST ASSIGNMENTS */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-purple-600" />
              <CardTitle>Nhiều bài tập nhất</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Lớp học với nhiều assignment</p>
          </CardHeader>
          <CardContent>
            {coursesWithMostAssignments.length > 0 ? (
              <div className="space-y-3">
                {coursesWithMostAssignments.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.code} • {course.teacher?.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">{course.assignmentCount || 0}</div>
                      <div className="text-xs text-muted-foreground">bài tập</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}