import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';
import { User } from '../../context/AuthContext';
import { Progress } from '../ui/progress';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getStudentReport, StudentReportData } from '../../lib/reportService';
import courseService from '../../lib/courseService';
import assignmentService from '../../lib/assignmentService';
import submissionService from '../../lib/submissionService';
import { toast } from 'sonner';

interface StudentDashboardProps {
  user: User;
}

interface DashboardAssignment {
  assignmentId: number;
  title: string;
  courseId: number;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  score?: number;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<StudentReportData | null>(null);
  const [assignments, setAssignments] = useState<DashboardAssignment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch student report
        const report = await getStudentReport();
        setReportData(report);

        // Fetch courses and assignments (giống StudentAssignments)
        const coursesData = await courseService.getCourses({ size: 100 });
        
        if (!coursesData?.result) {
          setLoading(false);
          return;
        }

        const allAssignments: DashboardAssignment[] = [];

        for (const course of coursesData.result) {
          try {
            const assignmentsData = await assignmentService.getAssignmentsByCourseId(course.id, {
              page: 0,
              size: 100,
            });

            const courseAssignments = assignmentsData.result || [];

            for (const assignment of courseAssignments) {
              let status: 'pending' | 'submitted' | 'graded' | 'overdue' = 'pending';
              let score: number | undefined;

              try {
                const submission = await submissionService.getSubmissionByAssignmentId(assignment.id);

                if (submission.submitted === true) {
                  status = 'graded';
                  score = submission.grade ?? undefined;
                } else {
                  status = 'pending';
                }
              } catch {
                status = 'pending';
              }

              // Nếu chưa nộp → kiểm tra quá hạn
              if (status === 'pending') {
                const dueDate = new Date(assignment.dueDate);
                if (dueDate < new Date()) {
                  status = 'overdue';
                }
              }

              allAssignments.push({
                assignmentId: assignment.id,
                title: assignment.title,
                courseId: course.id,
                courseName: course.name,
                dueDate: assignment.dueDate,
                status,
                score,
              });
            }
          } catch (err) {
            console.error(`Error fetching assignments for course ${course.id}:`, err);
          }
        }

        setAssignments(allAssignments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  // Calculate stats from API data
  const numberCourses = reportData?.numberCourse ?? 0;
  const numberAssignments = reportData?.numberAssignments ?? 0;
  const numberSubmissions = reportData?.numberSubmissions ?? 0;
  const submissionRate = reportData?.submissionRate ?? 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Bài tập quá hạn = status === 'overdue'
  const overdueAssignments = assignments.filter((a: DashboardAssignment) => {
    return a.status === 'overdue';
  });
  
  // Bài tập sắp tới hạn = còn 1-7 ngày và chưa nộp (pending)
  const upcomingAssignments = assignments.filter((a: DashboardAssignment) => {
    if (a.status !== 'pending') return false;
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    return dueDate >= today && dueDate <= oneWeekFromNow;
  });
  
  // Bài tập chờ = tất cả bài pending (chưa nộp và chưa quá hạn)
  const pendingAssignments = assignments.filter((a: DashboardAssignment) => {
    return a.status === 'pending';
  });
  
  const completionRate = Math.round(submissionRate);

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
            <div className="text-primary">{numberCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Bài tập chờ</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Cần hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Đã hoàn thành</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{numberSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">Bài tập</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Quá hạn</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-primary">{overdueAssignments.length}</div>
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
                <div className="text-primary">{numberSubmissions}</div>
                <div className="text-muted-foreground">Đã nộp</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-primary">{pendingAssignments.length}</div>
                <div className="text-muted-foreground">Chưa nộp</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-primary">{overdueAssignments.length}</div>
                <div className="text-muted-foreground">Quá hạn</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Bài tập quá hạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overdueAssignments.map((assignment: DashboardAssignment) => (
              <div
                key={assignment.assignmentId}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors border border-red-200"
                onClick={() => navigate(`/assignments/${assignment.assignmentId}`)}
              >
                <div className="flex-1">
                  <div className="font-medium">{assignment.title}</div>
                  <div className="text-sm text-muted-foreground">{assignment.courseName || 'Unknown Course'}</div>
                </div>
                <div className="text-sm text-red-600 font-medium">
                  Quá: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
            {overdueAssignments.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Không có bài tập quá hạn
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assignments (Due within 1 week) */}
      <Card>
        <CardHeader>
          <CardTitle>Bài tập sắp tới hạn (còn 1 tuần)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAssignments.map((assignment: DashboardAssignment) => {
              const dueDate = new Date(assignment.dueDate);
              dueDate.setHours(0, 0, 0, 0);
              const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={assignment.assignmentId}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer transition-colors border border-yellow-200"
                  onClick={() => navigate(`/assignments/${assignment.assignmentId}`)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{assignment.title}</div>
                    <div className="text-sm text-muted-foreground">{assignment.courseName || 'Unknown Course'}</div>
                  </div>
                  <div className="text-sm text-orange-600 font-medium">
                    Còn {daysUntilDue} ngày
                  </div>
                </div>
              );
            })}
            {upcomingAssignments.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                Không có bài tập nào sắp tới hạn
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
