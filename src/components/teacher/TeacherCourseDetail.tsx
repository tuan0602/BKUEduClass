import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
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
  Lock,
  Download,
  Upload,
  Plus,
  Calendar,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { useDocument } from '../../hooks/useDocument';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { Progress } from '../../components/ui/progress';
import { useCourseDetail } from '../../hooks/useCourse';
import { 
  useAssignmentsByCourse, 
  useCreateAssignment, 
  useUpdateAssignment, 
  useDeleteAssignment 
} from '../../hooks/useAssignment';
import { User } from '../../context/AuthContext';
import { StatusAssignment, QuestionDTO, CreateAssignmentDTO } from '../../lib/assignmentService';
interface TeacherCourseDetailProps {
  user: User;
}

export function TeacherCourseDetail({ user }: TeacherCourseDetailProps) {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchStudent, setSearchStudent] = useState('');
  const [searchAssignment, setSearchAssignment] = useState('');
  // Fetch course detail
  const { data: courseDetail, isLoading, error } = useCourseDetail(Number(courseId));

  // Fetch documents for this course
  const { documents, loading, fetchDocuments, downloadDocument, uploadDocument, deleteDocument } = useDocument();

  // Fetch assignments for this course
  const { 
    data: assignmentsData, 
    isLoading: assignmentsLoading 
  } = useAssignmentsByCourse(Number(courseId), { page: 1, size: 100 });
  const createAssignmentMutation = useCreateAssignment();
  const updateAssignmentMutation = useUpdateAssignment();
  const deleteAssignmentMutation = useDeleteAssignment();
  
  // Check if due date is overdue
   const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };
  // Document upload states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  // Assignment states
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [deleteAssignmentDialogOpen, setDeleteAssignmentDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Assignment form states
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxScore: 10,
  });

  // Load documents when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchDocuments(Number(courseId));
    }
  }, [courseId]);

  // Reset assignment form
  const resetAssignmentForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      maxScore: 10,
    });
    setEditingAssignment(null);
  };

  // Open create assignment dialog
  const openCreateAssignmentDialog = () => {
    resetAssignmentForm();
    setAssignmentDialogOpen(true);
  };

  // Open edit assignment dialog
  const openEditAssignmentDialog = (assignment: any) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description || '',
      dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
      maxScore: assignment.maxScore || 10,
    });
    setAssignmentDialogOpen(true);
  };

  // Handle create/update assignment
  const handleSaveAssignment = async () => {
    if (!courseId) {
      toast.error('Không tìm thấy khóa học');
      return;
    }

    if (!assignmentForm.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài tập');
      return;
    }

    const assignmentData: CreateAssignmentDTO = {
  courseId: Number(courseId),
  title: assignmentForm.title,
  description: assignmentForm.description || undefined,
  dueDate: assignmentForm.dueDate 
    ? new Date(assignmentForm.dueDate).toISOString() 
    : new Date().toISOString(),
  status: StatusAssignment.PUBLISHED,
  question: [],
};

    try {
      if (editingAssignment) {
        await updateAssignmentMutation.mutateAsync({
          assignmentId: editingAssignment.id,
          assignmentData,
        });
      } else {
        await createAssignmentMutation.mutateAsync(assignmentData);
      }
      setAssignmentDialogOpen(false);
      resetAssignmentForm();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  // Open delete assignment dialog
  const openDeleteAssignmentDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setDeleteAssignmentDialogOpen(true);
  };

  // Handle delete assignment
  const handleDeleteAssignment = async () => {
    if (!selectedAssignment) return;

    try {
      await deleteAssignmentMutation.mutateAsync(selectedAssignment.id);
      setDeleteAssignmentDialogOpen(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!courseId) {
      toast.error('Không tìm thấy khóa học');
      return;
    }

    if (!selectedFile) {
      toast.error('Vui lòng chọn file để upload');
      return;
    }

    if (!uploadTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề tài liệu');
      return;
    }

    const success = await uploadDocument({
      file: selectedFile,
      title: uploadTitle,
      courseId: Number(courseId),
    });

    if (success) {
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchDocuments(Number(courseId));
    }
  };

  // Open delete dialog
  const openDeleteDialog = (doc: any) => {
    setSelectedDoc(doc);
    setDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedDoc || !courseId) return;

    const success = await deleteDocument(Number(courseId), selectedDoc.id);
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedDoc(null);
      fetchDocuments(Number(courseId));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
  const assignments = assignmentsData?.result || [];
  const totalPossibleSubmissions = stats.studentsCount * stats.totalAssignments;
  const submittedCount = Math.round((stats.submissionRate / 100) * totalPossibleSubmissions);
  // Filter students
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment: any) =>
    assignment.title.toLowerCase().includes(searchAssignment.toLowerCase())
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
          <TabsTrigger value="assignments" className="flex-1 min-w-[100px]">
            Bài tập
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1 min-w-[100px]">
            Tài liệu
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
                        {submittedCount} bài đã nộp
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Quản lý bài tập ({assignments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài tập..."
                  value={searchAssignment}
                  onChange={(e) => setSearchAssignment(e.target.value)}
                  className="pl-10"
                />
              </div>

              {assignmentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchAssignment ? 'Không tìm thấy bài tập' : 'Chưa có bài tập nào'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Hạn nộp</TableHead>
                      <TableHead>Điểm tối đa</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment: any) => {
                      const isLate = isOverdue(assignment.dueDate);
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {assignment.title}
                              {isLate && (
                                <Badge variant="destructive" className="text-xs">
                                  Quá hạn
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            {assignment.dueDate ? (
                              <div className={`flex items-center gap-1 text-sm ${
                                isLate ? 'text-red-600 font-semibold' : 'text-muted-foreground'
                              }`}>
                                <Calendar className="w-3 h-3" />
                                {formatDate(assignment.dueDate)}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Không có</span>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            <Badge variant="outline">10 điểm</Badge>
                          </TableCell>
                          
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(assignment.createdAt)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Tài liệu khóa học</CardTitle>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm tài liệu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tải lên tài liệu mới</DialogTitle>
                    <DialogDescription>
                      Tải lên tài liệu học tập cho khóa học này
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề tài liệu</Label>
                      <Input
                        id="title"
                        placeholder="Nhập tiêu đề tài liệu"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Chọn file</Label>
                      <Input
                        id="file"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground">
                          File đã chọn: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={loading}>
                      Hủy
                    </Button>
                    <Button onClick={handleUpload} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Đang tải lên...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-1" />
                          Tải lên
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chưa có tài liệu nào</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên tài liệu</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Kích thước</TableHead>
                      <TableHead>Ngày tải lên</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.fileExtension?.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                        <TableCell>{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadDocument(Number(courseId), doc.id, doc.title, doc.fileExtension)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Tải xuống
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(doc)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa tài liệu "{selectedDoc?.title}"? Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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