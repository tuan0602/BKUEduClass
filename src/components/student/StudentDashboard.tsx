import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '../ui/progress';
import { User } from '../../context/authContext';

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

interface StudentDashboardProps {
  user: User;
  courses: Course[];          // các lớp học của sinh viên
  assignments: Assignment[];  // các bài tập của sinh viên
  onNavigate: (page: string, data?: any) => void;
}

export function StudentDashboard({ user, courses, assignments, onNavigate }: StudentDashboardProps) {
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const completedAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const overdueAssignments = assignments.filter(a => a.status === 'overdue').length;

  const completionRate = assignments.length > 0
    ? Math.round((completedAssignments / assignments.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1>Xin chào, {user.name}!</h1>
        <p className="text-muted-foreground mt-1">Chào mừng bạn trở lại với BK EduClass</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Lớp học</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{courses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Bài tập chờ</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Cần hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Đã hoàn thành</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{completedAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Bài tập</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle>Quá hạn</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{overdueAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Bài tập</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ học tập</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <span>Tỷ lệ hoàn thành bài tập</span>
              <span className="text-primary">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Lớp học gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.slice(0, 3).map(course => (
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
                    <div className="text-sm text-muted-foreground">{course.teacherName}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{course.code}</div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Bạn chưa tham gia lớp học nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
