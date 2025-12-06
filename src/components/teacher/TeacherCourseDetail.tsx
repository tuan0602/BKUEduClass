import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3,
  Edit, 
  Trash2,
  Search,
  Loader2,
  Lock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';
import { useCourseDetail } from '../../hooks/useCourse';
import { User } from '../../context/AuthContext';

interface TeacherCourseDetailProps {
  user: User;
}

export function TeacherCourseDetail({ user }: TeacherCourseDetailProps) {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchStudent, setSearchStudent] = useState('');

  // Fetch course detail
  const { data: courseDetail, isLoading, error } = useCourseDetail(Number(courseId));

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !courseDetail) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg mb-2">⚠️ Lỗi tải dữ liệu</div>
        <div className="text-muted-foreground">
          {error?.message || 'Không tìm thấy lớp học'}
        </div>
        <Button 
          onClick={() => navigate('/teacher/courses')} 
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách lớp
        </Button>
      </div>
    );
  }

  const { course, students, data: stats } = courseDetail;

  // Filter students
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/teacher/courses')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách lớp
        </Button>
        
        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg relative overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-white opacity-30" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white mb-2">{course.code}</div>
                <h1 className="text-white text-3xl font-bold">{course.name}</h1>
                <p className="text-white/90 mt-1">
                  {course.teacher?.name || 'Giảng viên'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinh viên</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.studentsCount}</div>
            <p className="text-xs text-muted-foreground">Đã đăng ký</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bài tập</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">Tổng số</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.averageGrade.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Lớp học này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nộp bài</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.submissionRate}%</div>
            <p className="text-xs text-muted-foreground">Tỷ lệ</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full flex flex-wrap">
          <TabsTrigger value="overview" className="flex-1 min-w-[100px]">Tổng quan</TabsTrigger>
          <TabsTrigger value="students" className="flex-1 min-w-[100px]">Sinh viên</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 min-w-[100px]">Báo cáo</TabsTrigger>
          <TabsTrigger value="assignments" className="flex-1 min-w-[100px]" disabled>
            <Lock className="w-3 h-3 mr-1" />
            Bài tập
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 min-w-[100px]" disabled>
            <Lock className="w-3 h-3 mr-1" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex-1 min-w-[100px]" disabled>
            <Lock className="w-3 h-3 mr-1" />
            Thảo luận
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả lớp học</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {course.description || 'Chưa có mô tả'}
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã lớp:</span>
                    <span className="font-medium">{course.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giảng viên:</span>
                    <span className="font-medium">{course.teacher?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số sinh viên:</span>
                    <span className="font-medium">{stats.studentsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <Badge variant={course.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng bài tập:</span>
                    <span className="font-medium">{stats.totalAssignments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điểm trung bình:</span>
                    <span className="font-medium">{stats.averageGrade.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tỷ lệ nộp bài:</span>
                    <span className="font-medium">{stats.submissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thảo luận:</span>
                    <span className="font-medium">{stats.discussionsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh sách sinh viên ({students.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sinh viên..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchStudent ? 'Không tìm thấy sinh viên' : 'Chưa có sinh viên nào'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredStudents.map(student => (
                      <div key={student.userId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {student.major && (
                            <Badge variant="outline">{student.major}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo lớp học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Tổng quan</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats.averageGrade.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Điểm TB</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats.submissionRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Nộp bài</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats.totalAssignments}
                      </div>
                      <div className="text-sm text-muted-foreground">Bài tập</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Thông tin chi tiết</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Tổng số sinh viên:</span>
                      <span className="font-medium">{stats.studentsCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Bài đã nộp:</span>
                      <span className="font-medium">{stats.submittedAssignments}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Tổng bài tập:</span>
                      <span className="font-medium">{stats.totalAssignments}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Số thảo luận:</span>
                      <span className="font-medium">{stats.discussionsCount}</span>
                    </div>
                  </div>
                </div>

                {stats.totalAssignments > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Tiến độ nộp bài</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tỷ lệ hoàn thành</span>
                        <span>{stats.submissionRate}%</span>
                      </div>
                      <Progress value={stats.submissionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {stats.submittedAssignments} / {stats.studentsCount * stats.totalAssignments} bài đã nộp
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disabled Tabs - Placeholder */}
        <TabsContent value="assignments">
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tính năng đang phát triển</h3>
              <p className="text-muted-foreground">
                Quản lý bài tập sẽ sớm được cập nhật
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tính năng đang phát triển</h3>
              <p className="text-muted-foreground">
                Quản lý tài liệu sẽ sớm được cập nhật
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions">
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tính năng đang phát triển</h3>
              <p className="text-muted-foreground">
                Quản lý thảo luận sẽ sớm được cập nhật
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}