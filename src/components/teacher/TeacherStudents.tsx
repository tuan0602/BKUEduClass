// src/components/teacher/TeacherStudents.tsx
import { useState } from 'react';
import { User } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Eye, Loader2, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useCourses, useCourseDetail } from '../../hooks/useCourse';
import { useQueries } from '@tanstack/react-query';
import { courseKeys } from '../../hooks/useCourse';
import courseService from '../../lib/courseService';

interface TeacherStudentsProps {
  user: User;
}

export function TeacherStudents({ user }: TeacherStudentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Fetch all courses
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses({ size: 100 });

  // Filter courses by teacher
  const myCourses = coursesData?.result.filter(
    course => course.teacher?.userId === user.userId
  ) || [];

  // Fetch course details for each course to get students
  const courseDetailQueries = useQueries({
    queries: myCourses.map(course => ({
      queryKey: courseKeys.detail(course.id),
      queryFn: () => courseService.getCourseDetail(course.id),
      enabled: course.id > 0,
      staleTime: 1000 * 60 * 3
    }))
  });

  const isLoadingDetails = courseDetailQueries.some(q => q.isLoading);
  const isLoading = isLoadingCourses || isLoadingDetails;

  // Get all unique students from all courses
  const allStudentsMap = new Map();
  
  courseDetailQueries.forEach((query, index) => {
    if (query.data?.students) {
      const courseId = myCourses[index].id;
      const courseName = myCourses[index].name;
      const courseCode = myCourses[index].code;
      
      query.data.students.forEach(student => {
        if (!allStudentsMap.has(student.userId)) {
          allStudentsMap.set(student.userId, {
            ...student,
            courses: [{
              id: courseId,
              name: courseName,
              code: courseCode,
              stats: query.data.data // Course stats
            }]
          });
        } else {
          const existingStudent = allStudentsMap.get(student.userId);
          existingStudent.courses.push({
            id: courseId,
            name: courseName,
            code: courseCode,
            stats: query.data.data
          });
        }
      });
    }
  });

  const allStudents = Array.from(allStudentsMap.values());

  // Filter by selected course
  const filteredStudents = selectedCourse === 'all'
    ? allStudents
    : allStudents.filter(student => 
        student.courses.some((c: any) => c.id === Number(selectedCourse))
      );

  // Filter by search query
  const searchedStudents = filteredStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetail = (student: any) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  // Calculate average grade for student across their courses
  const getStudentAvgGrade = (student: any) => {
    const grades = student.courses
      .map((c: any) => c.stats?.averageGrade)
      .filter((g: number | undefined) => g !== undefined);
    
    if (grades.length === 0) return 'N/A';
    
    const avg = grades.reduce((sum: number, g: number) => sum + g, 0) / grades.length;
    return avg.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản lý sinh viên</h1>
        <p className="text-muted-foreground">Xem và quản lý sinh viên trong các lớp học</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tổng sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{allStudents.length}</div>
            <p className="text-xs text-muted-foreground">Unique students</p>
          </CardContent>
        </Card>
        
        {myCourses.slice(0, 3).map((course, index) => {
          const courseDetail = courseDetailQueries[index]?.data;
          const studentCount = courseDetail?.students?.length || 0;
          
          return (
            <Card key={course.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium line-clamp-1">{course.code}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{studentCount}</div>
                <p className="text-xs text-muted-foreground">sinh viên</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sinh viên theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lớp học</SelectItem>
            {myCourses.map(course => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sinh viên ({searchedStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {searchedStudents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery || selectedCourse !== 'all' 
                ? 'Không tìm thấy sinh viên nào' 
                : 'Chưa có sinh viên nào'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Chuyên ngành</TableHead>
                  <TableHead>Số lớp học</TableHead>
                  <TableHead>Điểm TB</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedStudents.map((student: any) => (
                  <TableRow key={student.userId}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {student.major ? (
                        <Badge variant="outline">{student.major}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {selectedCourse === 'all' ? (
                        <span className="text-sm">{student.courses.length} lớp</span>
                      ) : (
                        <span className="text-sm">
                          {myCourses.find(c => c.id === Number(selectedCourse))?.code}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {getStudentAvgGrade(student)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewDetail(student)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thông tin sinh viên</DialogTitle>
            <DialogDescription>
              Chi tiết về sinh viên và kết quả học tập
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Họ và tên</label>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Chuyên ngành</label>
                  <p className="font-medium">{selectedStudent.major || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Năm học</label>
                  <p className="font-medium">{selectedStudent.year || 'N/A'}</p>
                </div>
                {selectedStudent.className && (
                  <div>
                    <label className="text-sm text-muted-foreground">Lớp</label>
                    <p className="font-medium">{selectedStudent.className}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-muted-foreground">Số điện thoại</label>
                  <p className="font-medium">{selectedStudent.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>

              {/* Courses */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Lớp học đang tham gia ({selectedStudent.courses.length})
                </h3>
                <div className="space-y-2">
                  {selectedStudent.courses.map((course: any) => (
                    <div 
                      key={course.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-muted-foreground">{course.code}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Điểm TB lớp</div>
                          <div className="font-semibold text-primary">
                            {course.stats?.averageGrade?.toFixed(1) || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Tỷ lệ nộp</div>
                          <div className="font-semibold text-green-600">
                            {course.stats?.submissionRate || 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Số lớp</div>
                  <div className="text-2xl font-bold text-primary">
                    {selectedStudent.courses.length}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Điểm TB</div>
                  <div className="text-2xl font-bold text-green-600">
                    {getStudentAvgGrade(selectedStudent)}
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Trạng thái</div>
                  <Badge variant="default" className="mt-1">Hoạt động</Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}