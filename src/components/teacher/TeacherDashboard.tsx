import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, FileText, Users, CheckCircle } from 'lucide-react';
import { DEMO_COURSES, DEMO_ASSIGNMENTS, DEMO_SUBMISSIONS, User } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TeacherDashboardProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export function TeacherDashboard({ user, onNavigate }: TeacherDashboardProps) {
  const myCourses = DEMO_COURSES.filter(course => course.teacherId === user.id);
  const myAssignments = DEMO_ASSIGNMENTS.filter(assignment =>
    myCourses.some(course => course.id === assignment.courseId)
  );
  const totalStudents = myCourses.reduce((sum, course) => sum + course.studentCount, 0);
  const pendingGrading = DEMO_SUBMISSIONS.filter(s => s.status === 'submitted').length;

  const submissionData = myCourses.map(course => ({
    name: course.code,
    'Đã nộp': Math.floor(Math.random() * course.studentCount),
    'Chưa nộp': Math.floor(Math.random() * (course.studentCount / 2))
  }));

  const gradeData = [
    { name: 'A (85-100)', value: 25, color: '#10b981' },
    { name: 'B (70-84)', value: 35, color: '#3b82f6' },
    { name: 'C (55-69)', value: 30, color: '#f59e0b' },
    { name: 'D (40-54)', value: 10, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Tổng quan giảng dạy</h1>
        <p className="text-muted-foreground mt-1">Xin chào, {user.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Lớp học</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myCourses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang giảng dạy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Sinh viên</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng số sinh viên</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Bài tập</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đã tạo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Chờ chấm</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{pendingGrading}</div>
            <p className="text-xs text-muted-foreground mt-1">Bài nộp</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tình trạng nộp bài</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Đã nộp" fill="#2F80ED" />
                <Bar dataKey="Chưa nộp" fill="#E0E0E0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Lớp học của tôi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCourses.map(course => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => onNavigate('course-detail', { courseId: course.id })}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div>{course.name}</div>
                    <div className="text-sm text-muted-foreground">{course.code} • {course.studentCount} sinh viên</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{course.semester}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
