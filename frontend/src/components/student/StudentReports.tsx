import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User } from '../../context/AuthContext';
import { DEMO_COURSES, DEMO_ASSIGNMENTS, COURSE_ENROLLMENTS } from '../../lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Award, BookOpen, CheckCircle } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useState, useEffect } from 'react';
import { getStudentReport, getStudentCourseProgress, StudentReportData, CourseProgressData } from '../../lib/reportService';
import { toast } from 'sonner';
import api from '../../lib/axios';

interface StudentReportsProps {
  user: User;
}

interface CourseWithProgress {
  id: number;
  courseName: string;
  courseCode: string;
  progressData?: CourseProgressData;
}

export function StudentReports({ user }: StudentReportsProps) {
  const [reportData, setReportData] = useState<StudentReportData | null>(null);
  const [coursesWithProgress, setCoursesWithProgress] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch general report
        const report = await getStudentReport();
        setReportData(report);
        
        // Fetch courses list
        let courses = [];
        try {
          const coursesResponse = await api.get('/courses');
          const responseData = coursesResponse.data.data?.result || coursesResponse.data.data || [];
          console.log('Courses from API:', responseData);
          courses = responseData;
        } catch (error) {
          console.error('Failed to fetch courses from API, using mock data:', error);
          // Fallback to mock data
          courses = myCourses.map(course => ({
            id: course.id,
            courseName: course.name,
            courseCode: course.code
          }));
        }
        
        // Fetch progress for each course
        const coursesWithProgressData = await Promise.all(
          courses.map(async (course: any) => {
            try {
              const progressData = await getStudentCourseProgress(course.id);
              return {
                id: course.id,
                courseName: course.courseName || course.name,
                courseCode: course.courseCode || course.code,
                progressData
              };
            } catch (error) {
              console.error(`Failed to fetch progress for course ${course.id}`, error);
              return {
                id: course.id,
                courseName: course.courseName || course.name,
                courseCode: course.courseCode || course.code,
                progressData: undefined
              };
            }
          })
        );
        
        console.log('Courses with progress:', coursesWithProgressData);
        setCoursesWithProgress(coursesWithProgressData);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
        toast.error('Không thể tải báo cáo học tập');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const myCourses = DEMO_COURSES.filter(course => 
    COURSE_ENROLLMENTS[course.id]?.includes(user.userId)
  );

  const myAssignments = DEMO_ASSIGNMENTS.filter(assignment =>
    myCourses.some(course => course.id === assignment.courseId)
  );

  const completedAssignments = reportData?.numberSubmissions ?? myAssignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
  const totalAssignments = reportData?.numberAssignments ?? myAssignments.length;
  const completionRate = reportData?.submissionRate ?? (myAssignments.length > 0 
    ? Math.round((completedAssignments / myAssignments.length) * 100) 
    : 0);
  const avgGrade = reportData?.averageGrade ?? 3.45;
  const totalCourses = reportData?.numberCourse ?? myCourses.length;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải báo cáo...</div>
      </div>
    );
  }

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
            <CardTitle>Điểm TB</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{avgGrade.toFixed(2)}/10</div>
            <p className="text-xs text-muted-foreground mt-1">Điểm trung bình</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Lớp học</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Bài tập</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{completedAssignments}/{totalAssignments}</div>
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
            {coursesWithProgress.length > 0 ? (
              coursesWithProgress.map(course => {
                const progress = course.progressData?.submissionRate ?? 0;
                const completed = course.progressData?.numberSubmissions ?? 0;
                const total = course.progressData?.numberAssignments ?? 0;
                // Lấy điểm từ AverageGrade hoặc averageGrade
                const averageGrade = (course.progressData?.AverageGrade ?? course.progressData?.averageGrade ?? 0) as number;
                // Nếu 0/0 thì hiển thị 100%
                const displayProgress = total === 0 ? 100 : progress;
                // Hiển thị NaN nếu chưa có submission
                const gradeDisplay = completed === 0 ? 'NaN' : averageGrade.toFixed(1);
                
                return (
                  <div key={course.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{course.courseName}</p>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {gradeDisplay}/10
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{course.courseCode}</p>
                      </div>
                      <span className="text-sm text-primary whitespace-nowrap ml-2">
                        {completed}/{total} - {Math.round(displayProgress)}%
                      </span>
                    </div>
                    <Progress value={displayProgress} className="h-2" />
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">Chưa có dữ liệu môn học</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
      </div>
    </div>
  );
}
