import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, DEMO_COURSES, DEMO_ASSIGNMENTS, COURSE_ENROLLMENTS } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Award, BookOpen, CheckCircle } from 'lucide-react';
import { Progress } from '../ui/progress';

interface StudentReportsProps {
  user: User;
}

export function StudentReports({ user }: StudentReportsProps) {
  const myCourses = DEMO_COURSES.filter(course => 
    COURSE_ENROLLMENTS[course.id]?.includes(user.id)
  );

  const myAssignments = DEMO_ASSIGNMENTS.filter(assignment =>
    myCourses.some(course => course.id === assignment.courseId)
  );

  const completedAssignments = myAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const completionRate = myAssignments.length > 0 
    ? Math.round((completedAssignments / myAssignments.length) * 100) 
    : 0;

  // Mock data for charts
  const gradeDistribution = [
    { name: 'A (85-100)', value: 30, color: '#10b981' },
    { name: 'B (70-84)', value: 40, color: '#3b82f6' },
    { name: 'C (55-69)', value: 20, color: '#f59e0b' },
    { name: 'D (40-54)', value: 10, color: '#ef4444' }
  ];

  const progressData = myCourses.map(course => ({
    name: course.code,
    'Điểm TB': Math.floor(Math.random() * 30) + 70,
    'Hoàn thành': Math.floor(Math.random() * 30) + 70
  }));

  const weeklyProgress = [
    { week: 'T1', completed: 2, pending: 1 },
    { week: 'T2', completed: 3, pending: 2 },
    { week: 'T3', completed: 4, pending: 1 },
    { week: 'T4', completed: 3, pending: 3 },
    { week: 'T5', completed: 5, pending: 1 },
    { week: 'T6', completed: 4, pending: 2 }
  ];

  const avgGPA = 3.45; // Mock GPA

  return (
    <div className="space-y-6">
      <div>
        <h1>Báo cáo học tập</h1>
        <p className="text-muted-foreground">Theo dõi tiến độ và thành tích học tập của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>GPA Trung bình</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{avgGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Học kỳ này</p>
          </CardContent>
        </Card>

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
            <CardTitle>Bài tập</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{completedAssignments}/{myAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đã hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tỷ lệ hoàn thành</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Bài tập</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ tổng quan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myCourses.map(course => {
              const progress = Math.floor(Math.random() * 40) + 60;
              return (
                <div key={course.id}>
                  <div className="flex justify-between mb-2">
                    <span>{course.name}</span>
                    <span className="text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Phân bố điểm</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {gradeDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Performance by Course */}
        <Card>
          <CardHeader>
            <CardTitle>Thành tích theo môn</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Điểm TB" fill="#2F80ED" />
                <Bar dataKey="Hoàn thành" fill="#27AE60" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tiến độ theo tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#2F80ED" name="Đã hoàn thành" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="Chưa hoàn thành" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng kết học kỳ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-primary mb-1">Điểm trung bình</div>
              <div className="text-muted-foreground">{avgGPA.toFixed(2)}/4.0</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-primary mb-1">Tỷ lệ hoàn thành</div>
              <div className="text-muted-foreground">{completionRate}%</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-primary mb-1">Xếp loại</div>
              <div className="text-muted-foreground">Khá</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
