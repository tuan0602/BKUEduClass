import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';
import { DEMO_COURSES, DEMO_ASSIGNMENTS, COURSE_ENROLLMENTS, User } from '../../lib/mockData';
import { Progress } from '../ui/progress';

interface StudentDashboardProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export function StudentDashboard({ user, onNavigate }: StudentDashboardProps) {
  const myCourses = DEMO_COURSES.filter(course => 
    COURSE_ENROLLMENTS[course.id]?.includes(user.id)
  );

  const myAssignments = DEMO_ASSIGNMENTS.filter(assignment =>
    myCourses.some(course => course.id === assignment.courseId)
  );

  const pendingAssignments = myAssignments.filter(a => a.status === 'pending').length;
  const completedAssignments = myAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const overdueAssignments = myAssignments.filter(a => a.status === 'overdue').length;

  const completionRate = myAssignments.length > 0 
    ? Math.round((completedAssignments / myAssignments.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1>Xin chào, {user.name}!</h1>
        <p className="text-muted-foreground mt-1">Chào mừng bạn trở lại với BK EduClass</p>
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
            <p className="text-xs text-muted-foreground mt-1">Đang tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Bài tập chờ</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Cần hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Đã hoàn thành</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{completedAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Bài tập</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Quá hạn</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{overdueAssignments}</div>
            <p className="text-xs text-muted-foreground mt-1">Bài tập</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ học tập</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Tỷ lệ hoàn thành bài tập</span>
                <span className="text-primary">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-primary">{completedAssignments}</div>
                <div className="text-muted-foreground">Đã nộp</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-primary">{pendingAssignments}</div>
                <div className="text-muted-foreground">Chưa nộp</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-primary">{overdueAssignments}</div>
                <div className="text-muted-foreground">Quá hạn</div>
              </div>
            </div>
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
            {myCourses.slice(0, 3).map(course => (
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
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Bài tập sắp đến hạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myAssignments
              .filter(a => a.status === 'pending')
              .slice(0, 3)
              .map(assignment => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => onNavigate('assignment-detail', { assignmentId: assignment.id })}
                >
                  <div className="flex-1">
                    <div>{assignment.title}</div>
                    <div className="text-sm text-muted-foreground">{assignment.courseName}</div>
                  </div>
                  <div className="text-sm text-orange-600">
                    Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              ))}
            {myAssignments.filter(a => a.status === 'pending').length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Không có bài tập nào sắp đến hạn
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
