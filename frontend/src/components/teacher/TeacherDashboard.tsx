// src/components/teacher/TeacherDashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, FileText, Users, CheckCircle, Loader2, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../context/AuthContext';
import { useCourses } from '../../hooks/useCourse';
import { useQueries } from '@tanstack/react-query';
import { assignmentKeys, fetchAssignmentsByCourse } from '../../hooks/useAssignment';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface TeacherDashboardProps {
  user: User;
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const navigate = useNavigate();
  const [totalAssignments, setTotalAssignments] = useState(0);

  // Fetch courses
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({ size: 100 });

  // Filter courses by teacher
  const myCourses = coursesData?.result.filter(
    course => course.teacher?.userId === user.userId
  ) || [];

  // Fetch assignments for each course
  const assignmentQueries = useQueries({
    queries: myCourses.map(course => ({
      queryKey: assignmentKeys.list(course.id, { size: 100 }),
      queryFn: () => fetchAssignmentsByCourse(course.id, { size: 100 }),
      enabled: course.id > 0,
      staleTime: 1000 * 60 * 3
    }))
  });

  const isLoadingAssignments = assignmentQueries.some(q => q.isLoading);
  const isLoading = isLoadingCourses || isLoadingAssignments;

  // Calculate total assignments
  useEffect(() => {
    const total = assignmentQueries
      .filter(q => q.data?.result)
      .reduce((sum, q) => sum + (q.data?.result.length || 0), 0);
    setTotalAssignments(total);
  }, [assignmentQueries]);

  // Calculate total students from courses
  const totalStudents = myCourses.reduce((sum, course) => sum + (course.studentCount || 0), 0);

  // Calculate course statistics
  const courseDetailData = myCourses.map(course => ({
    code: course.code,
    name: course.name,
    studentCount: course.studentCount || 0,
    assignmentCount: course.assignmentCount || 0,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tổng quan giảng dạy</h1>
        <p className="text-muted-foreground mt-1">Xin chào, {user.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Lớp học */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lớp học</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{myCourses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang giảng dạy</p>
          </CardContent>
        </Card>

        {/* Card 2: Sinh viên */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinh viên</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng số sinh viên</p>
          </CardContent>
        </Card>

        {/* Card 3: Bài tập */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài tập</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {isLoadingAssignments ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                totalAssignments
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Đã tạo</p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Teaching Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tổng quan giảng dạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Lớp học đang dạy</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{myCourses.length}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Tổng sinh viên</span>
                </div>
                <span className="text-lg font-bold text-green-600">{totalStudents}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Bài tập đã tạo</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {isLoadingAssignments ? '...' : totalAssignments}
                </span>
              </div>

              {myCourses.length > 0 && totalStudents > 0 && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Trung bình sinh viên/lớp</span>
                    <span className="font-semibold">
                      {Math.round(totalStudents / myCourses.length)} sinh viên
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Thống kê lớp học
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courseDetailData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có dữ liệu lớp học
              </div>
            ) : (
              <div className="space-y-3">
                {courseDetailData.slice(0, 5).map((course, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{course.code}</span>
                      <span className="text-muted-foreground">
                        {course.studentCount} sinh viên • {course.assignmentCount} bài tập
                      </span>
                    </div>
                    <Progress 
                      value={course.studentCount > 0 ? Math.min((course.studentCount / 50) * 100, 100) : 0} 
                      className="h-2"
                    />
                  </div>
                ))}
                {courseDetailData.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    và {courseDetailData.length - 5} lớp học khác...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}