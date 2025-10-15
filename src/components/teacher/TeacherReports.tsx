import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, DEMO_COURSES, DEMO_ASSIGNMENTS, COURSE_ENROLLMENTS } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';

interface TeacherReportsProps {
  user: User;
}

export function TeacherReports({ user }: TeacherReportsProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  const myCourses = DEMO_COURSES.filter(course => course.teacherId === user.id);
  const myAssignments = DEMO_ASSIGNMENTS.filter(assignment =>
    myCourses.some(course => course.id === assignment.courseId)
  );
  const totalStudents = myCourses.reduce((sum, course) => sum + course.studentCount, 0);

  // Mock data for charts
  const submissionData = myCourses.map(course => ({
    name: course.code,
    'Đã nộp': Math.floor(Math.random() * course.studentCount),
    'Chưa nộp': Math.floor(Math.random() * (course.studentCount / 2)),
    'Quá hạn': Math.floor(Math.random() * 5)
  }));

  const gradeData = [
    { name: 'A (85-100)', value: 25, color: '#10b981' },
    { name: 'B (70-84)', value: 35, color: '#3b82f6' },
    { name: 'C (55-69)', value: 30, color: '#f59e0b' },
    { name: 'D (40-54)', value: 10, color: '#ef4444' }
  ];

  const attendanceData = [
    { week: 'T1', rate: 92 },
    { week: 'T2', rate: 88 },
    { week: 'T3', rate: 95 },
    { week: 'T4', rate: 90 },
    { week: 'T5', rate: 93 },
    { week: 'T6', rate: 91 }
  ];

  const coursePerformance = myCourses.map(course => ({
    name: course.name,
    'Điểm TB': (Math.random() * 30 + 70).toFixed(1),
    'Tỷ lệ đạt': Math.floor(Math.random() * 20 + 80)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Thống kê lớp học</h1>
          <p className="text-muted-foreground">Theo dõi hiệu quả giảng dạy và kết quả học tập</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp học</SelectItem>
              {myCourses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">Xuất báo cáo PDF</Button>
        </div>
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
            <p className="text-xs text-muted-foreground mt-1">Tổng số</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Bài tập</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đã giao</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Điểm TB</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">7.8/10</div>
            <p className="text-xs text-muted-foreground mt-1">Toàn khóa</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Submission Status */}
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
                <Bar dataKey="Chưa nộp" fill="#F59E0B" />
                <Bar dataKey="Quá hạn" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
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
                  label={(entry) => `${entry.value}%`}
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
            <div className="grid grid-cols-2 gap-2 mt-4">
              {gradeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ tham gia theo tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#2F80ED" 
                  name="Tỷ lệ (%)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu quả theo lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coursePerformance.map((course, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="line-clamp-1">{course.name}</span>
                    <span className="text-primary">Điểm TB: {course['Điểm TB']}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${course['Tỷ lệ đạt']}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tỷ lệ đạt: {course['Tỷ lệ đạt']}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng kết chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3>Kết quả học tập</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giỏi (A)</span>
                  <span>25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khá (B)</span>
                  <span>35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trung bình (C)</span>
                  <span>30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yếu (D)</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3>Tình trạng bài tập</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Đã chấm</span>
                  <span>68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chờ chấm</span>
                  <span>22%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chưa nộp</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3>Hoạt động</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tích cực</span>
                  <span>75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trung bình</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cần cải thiện</span>
                  <span>5%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
