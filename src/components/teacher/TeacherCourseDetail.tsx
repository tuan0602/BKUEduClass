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
  Plus,
  Upload,
  Download,
  Pin,
  Search
} from 'lucide-react';
import { 
  DEMO_COURSES, 
  DEMO_ASSIGNMENTS, 
  DEMO_DOCUMENTS, 
  DEMO_DISCUSSIONS,
  DEMO_USERS,
  COURSE_ENROLLMENTS 
} from '../../lib/mockData';
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

export function TeacherCourseDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  // ✅ THÊM dummy course để test
  const course = {
    id: courseId || '1',
    name: 'Lập trình Web nâng cao',
    code: 'IT4409',
    description: 'Khóa học về phát triển ứng dụng web hiện đại với React, Node.js và MongoDB',
    teacherId: '1',
    teacherName: 'GV Nguyễn Văn A',
    semester: 'HK1 2024-2025',
    studentCount: 45,
    enrollmentCode: 'WEB2024'
  };

  // ✅ THÊM dummy assignments
  const assignments = [
    {
      id: '1',
      title: 'Bài tập 1: HTML/CSS cơ bản',
      courseId: courseId || '1',
      dueDate: '2024-12-25',
      maxScore: 100
    },
    {
      id: '2',
      title: 'Bài tập 2: JavaScript ES6',
      courseId: courseId || '1',
      dueDate: '2024-12-30',
      maxScore: 100
    }
  ];

  // ✅ THÊM dummy documents
  const documents = [
    {
      id: '1',
      title: 'Slide bài giảng 1',
      courseId: courseId || '1',
      category: 'Lecture',
      uploadedAt: '2024-11-01'
    }
  ];

  // ✅ THÊM dummy discussions
  const discussions = [
    {
      id: '1',
      title: 'Thông báo về thi cuối kỳ',
      courseId: courseId || '1',
      content: 'Kỳ thi sẽ diễn ra vào tuần 16',
      authorName: 'GV Nguyễn Văn A',
      createdAt: '2024-11-20',
      isPinned: true,
      replies: []
    }
  ];

  // ✅ THÊM dummy students
  const enrolledStudents = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'student1@bk.edu.vn',
      studentId: '20200001',
      role: 'student' as const
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'student2@bk.edu.vn',
      studentId: '20200002',
      role: 'student' as const
    }
  ];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');

  if (!courseId) {
    return <div>Không tìm thấy lớp học</div>;
  }

//   const course = DEMO_COURSES.find(c => c.id === courseId);
//   const assignments = DEMO_ASSIGNMENTS.filter(a => a.courseId === courseId);
//   const documents = DEMO_DOCUMENTS.filter(d => d.courseId === courseId);
//   const discussions = DEMO_DISCUSSIONS.filter(d => d.courseId === courseId);
//   const enrolledStudentIds = COURSE_ENROLLMENTS[courseId] || [];
//   const enrolledStudents = DEMO_USERS.filter(u => enrolledStudentIds.includes(u.id));

  if (!course) {
    return <div>Không tìm thấy lớp học</div>;
  }

  const filteredStudents = enrolledStudents.filter(student =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const handleDeleteCourse = () => {
    toast.success('Đã xóa lớp học thành công!');
    setTimeout(() => {
      navigate('/teacher/courses');
    }, 1000);
  };

  const handleEditCourse = () => {
    toast.success('Đã cập nhật lớp học thành công!');
    setEditDialogOpen(false);
  };

  // Stats
  const pendingSubmissions = Math.floor(Math.random() * 15) + 5;
  const avgGrade = (Math.random() * 2 + 7).toFixed(1);
  const attendanceRate = Math.floor(Math.random() * 20) + 80;

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
                <h1 className="text-white">{course.name}</h1>
                <p className="text-white/90 mt-1">{course.semester} • Mã đăng ký: {course.enrollmentCode}</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa lớp học</DialogTitle>
                      <DialogDescription>
                        Cập nhật thông tin lớp học
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tên lớp học</Label>
                          <Input defaultValue={course.name} />
                        </div>
                        <div className="space-y-2">
                          <Label>Mã lớp</Label>
                          <Input defaultValue={course.code} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Mô tả</Label>
                        <Textarea defaultValue={course.description} rows={4} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Học kỳ</Label>
                          <Input defaultValue={course.semester} />
                        </div>
                        <div className="space-y-2">
                          <Label>Mã đăng ký</Label>
                          <Input defaultValue={course.enrollmentCode} />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button onClick={handleEditCourse} className="bg-primary">
                        Lưu thay đổi
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa lớp học</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa lớp học "{course.name}"? 
                        Hành động này sẽ xóa tất cả bài tập, tài liệu và thảo luận liên quan. 
                        Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteCourse}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
            <div className="text-2xl font-bold text-primary">{course.studentCount}</div>
            <p className="text-xs text-muted-foreground">Đã đăng ký</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ chấm</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">Bài nộp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{avgGrade}</div>
            <p className="text-xs text-muted-foreground">Lớp học này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tham gia</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Tỷ lệ</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full flex flex-wrap">
            <TabsTrigger value="overview" className="flex-1 min-w-[100px]">Tổng quan</TabsTrigger>
            <TabsTrigger value="students" className="flex-1 min-w-[100px]">Sinh viên</TabsTrigger>
            <TabsTrigger value="assignments" className="flex-1 min-w-[100px]">Bài tập</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1 min-w-[100px]">Tài liệu</TabsTrigger>
            <TabsTrigger value="discussions" className="flex-1 min-w-[100px]">Thảo luận</TabsTrigger>
            <TabsTrigger value="reports" className="flex-1 min-w-[100px]">Báo cáo</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả lớp học</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bài tập gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignments.slice(0, 3).map(assignment => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Hạn: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <Badge>{Math.floor(Math.random() * 30) + 10} bài nộp</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm">Sinh viên nộp bài tập 3</div>
                      <div className="text-xs text-muted-foreground">5 phút trước</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm">Tài liệu mới được tải lên</div>
                      <div className="text-xs text-muted-foreground">2 giờ trước</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm">Thảo luận mới</div>
                      <div className="text-xs text-muted-foreground">1 ngày trước</div>
                    </div>
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
                <CardTitle>Danh sách sinh viên ({enrolledStudents.length})</CardTitle>
                <Button size="sm" className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sinh viên
                </Button>
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

                <div className="space-y-2">
                  {filteredStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.studentId || student.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{(Math.random() * 3 + 7).toFixed(1)}/10</Badge>
                        <Button size="sm" variant="ghost">Xem chi tiết</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Quản lý bài tập</CardTitle>
                <Button size="sm" className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo bài tập mới
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map(assignment => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <Badge variant="secondary">{Math.floor(Math.random() * 30) + 15} bài nộp</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} • {assignment.maxScore} điểm
                      </div>
                      <div className="mt-2">
                        <Progress value={Math.floor(Math.random() * 40) + 60} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.floor(Math.random() * 30) + 15}/{course.studentCount} đã nộp
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">Chấm bài</Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tài liệu học tập</CardTitle>
                <Button size="sm" className="bg-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Tải lên tài liệu
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.category} • {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-4">
          {discussions.map(discussion => (
            <Card key={discussion.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{discussion.title}</CardTitle>
                      {discussion.isPinned && (
                        <Badge variant="secondary">
                          <Pin className="w-3 h-3 mr-1" />
                          Đã ghim
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {discussion.authorName} • {new Date(discussion.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Pin className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{discussion.content}</p>
                <div className="text-sm text-muted-foreground">
                  {discussion.replies.length} phản hồi
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <h3 className="text-sm font-medium mb-2">Tổng quan</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{avgGrade}</div>
                      <div className="text-sm text-muted-foreground">Điểm TB</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
                      <div className="text-sm text-muted-foreground">Tham gia</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{assignments.length}</div>
                      <div className="text-sm text-muted-foreground">Bài tập</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Phân bố điểm</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>A (85-100)</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>B (70-84)</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>C (55-69)</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>D (40-54)</span>
                        <span>10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}