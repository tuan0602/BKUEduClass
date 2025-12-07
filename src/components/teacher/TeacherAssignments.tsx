import { useState, useRef } from 'react';
import { QuizAssignmentCreator } from './QuizAssignmentCreator';
import {
  useAssignmentsByCourse,
  useCreateAssignment,
  useDeleteAssignment,
  useUpdateAssignment,
  assignmentKeys,
  fetchAssignmentsByCourse,
} from '../../hooks/useAssignment';
import { useCourses } from '../../hooks/useCourse';
import { CreateAssignmentDTO, StatusAssignment } from '../../lib/assignmentService';
import { DEMO_SUBMISSIONS, Submission } from '../../lib/mockData';
import { User } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useQueries } from '@tanstack/react-query';

interface TeacherAssignmentsProps {
  user: User;
}

export function TeacherAssignments({ user }: TeacherAssignmentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });

  const quizSubmitRef = useRef<(() => void) | null>(null);

  // ===========================
  // API HOOKS
  // ===========================

  // Fetch courses của teacher từ API
  const { data: coursesData, isLoading: isLoadingCourses, error: coursesError } = useCourses({
    size: 100,
  });

  // Get course IDs của teacher hiện tại
  const myCourseIds = coursesData?.result
    .filter(course => course.teacher?.userId === user.userId)
    .map(course => course.id) || [];

  // Fetch assignments từ tất cả courses
  const courseIds = myCourseIds;

  // Lấy assignments cho từng course
  const assignmentQueries = useQueries({
  queries: courseIds.map(courseId => ({
    queryKey: assignmentKeys.list(courseId, { size: 100 }),
    queryFn: () => fetchAssignmentsByCourse(courseId, { size: 100 }),
    enabled: courseId > 0,
    staleTime: 1000 * 60 * 3
  }))
});

  // Mutations
  const createAssignmentMutation = useCreateAssignment();
  const updateAssignmentMutation = useUpdateAssignment();
  const deleteAssignmentMutation = useDeleteAssignment();
  
  // ===========================
  // DATA PROCESSING
  // ===========================

  // Combine tất cả assignments từ các courses
  const allAssignmentsFromAPI = assignmentQueries
  .filter(q => q.data?.result)
  .flatMap((q, index) => {
    const currentCourseId = courseIds[index];
    const course = coursesData?.result.find(c => c.id === currentCourseId);
    return q.data!.result.map((assignment: any) => ({
      ...assignment,
      courseId: currentCourseId,
      courseName: course?.name || 'Unknown',
    }));
  });
console.log("DEBUG assignment:", allAssignmentsFromAPI);
  const isLoadingAssignments = assignmentQueries.some(q => q.isLoading);
  const hasErrorAssignments = assignmentQueries.some(q => q.error);

  // Overall loading state
  const isLoading = isLoadingCourses || isLoadingAssignments;
  const hasError = coursesError || hasErrorAssignments;

  // Filter assignments
  const filteredAssignments = allAssignmentsFromAPI.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===========================
  // HANDLERS
  // ===========================

  const handleCreateQuiz = (data: any) => {
    console.log('Creating quiz with data:', data);

    const payload: CreateAssignmentDTO = {
      courseId: parseInt(data.courseId),
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate,
      status: StatusAssignment.PUBLISHED,
      question: data.questions.map((q: any) => ({
        question: q.question,
        answerA: q.answerA,
        answerB: q.answerB,
        answerC: q.answerC,
        answerD: q.answerD,
        correctAnswer: q.correctAnswer,
      })),
    };

    createAssignmentMutation.mutate(payload, {
      onSuccess: () => {
        setCreateDialogOpen(false);
      },
    });
  };

   // Handle update assignment
   const handleEditClick = (assignment: any) => {
  setEditingAssignment(assignment);
  setEditDialogOpen(true);
};

const handleUpdateQuiz = (data: any) => {
  if (!editingAssignment) return;

  const payload: CreateAssignmentDTO = {
    courseId: editingAssignment.courseId,
    title: data.title,
    description: data.description || '',
    dueDate: data.dueDate,
    status: StatusAssignment.PUBLISHED,
    question: data.questions.map((q: any) => ({
      question: q.question,
      answerA: q.answerA,
      answerB: q.answerB,
      answerC: q.answerC,
      answerD: q.answerD,
      correctAnswer: q.correctAnswer,
    })),
  };

  updateAssignmentMutation.mutate(
    { assignmentId: editingAssignment.id, assignmentData: payload },
    {
      onSuccess: () => {
        setEditDialogOpen(false);
        setEditingAssignment(null);
      },
    }
  );
};

  // Handle delete assignment
  const handleDeleteAssignment = (assignmentId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;
    deleteAssignmentMutation.mutate(assignmentId);
  };

  const getSubmissionStats = (assignmentId: number) => {
    // TODO: Fetch từ API thật
    const submissions = DEMO_SUBMISSIONS.filter(s => s.assignmentId === assignmentId.toString());
    const graded = submissions.filter(s => s.status === 'graded').length;
    return { total: submissions.length, graded };
  };

  const handleViewSubmissions = (assignmentId: number) => {
    setSelectedAssignment(assignmentId);
    setGradeDialogOpen(true);
  };

  const assignmentSubmissions = selectedAssignment
    ? DEMO_SUBMISSIONS.filter(s => s.assignmentId === selectedAssignment.toString())
    : [];

  const handleOpenSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score?.toString() || '',
      feedback: submission.feedback || '',
    });
    setSubmissionDialogOpen(true);
  };

  const handleGradeSubmission = () => {
    if (!gradeData.score) {
      toast.error('Vui lòng nhập điểm số');
      return;
    }

    const score = parseFloat(gradeData.score);
    const assignment = allAssignmentsFromAPI.find(a => a.id === selectedAssignment);

    // TODO: Thay bằng maxScore từ assignment
    const maxScore = 100;
    if (score < 0 || score > maxScore) {
      toast.error(`Điểm phải từ 0 đến ${maxScore}`);
      return;
    }

    if (selectedSubmission) {
      // TODO: Call API để grade submission
      setSubmissionDialogOpen(false);
      setGradeData({ score: '', feedback: '' });
      setSelectedSubmission(null);
      toast.success(`Đã chấm điểm cho ${selectedSubmission.studentName}!`);
    }
  };

  // ===========================
  // RENDER
  // ===========================

  if (hasError) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-destructive">
              {coursesError ? 'Có lỗi xảy ra khi tải danh sách lớp học' : 'Có lỗi xảy ra khi tải dữ liệu bài tập'}
            </p>
            <Button
              onClick={() => {
                if (coursesError) {
                  window.location.reload();
                } else {
                  assignmentQueries.forEach(q => q.refetch());
                }
              }}
              className="mt-4"
            >
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col overflow-hidden space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Quản lý bài tập</h1>
          <p className="text-muted-foreground">Tạo và quản lý bài tập cho lớp học</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90"
              disabled={isLoadingCourses || myCourseIds.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo bài kiểm tra trắc nghiệm
            </Button>
          </DialogTrigger>

          <DialogContent
            className="max-w-3xl flex flex-col p-0"
            style={{ height: '85vh', maxHeight: '85vh' }}
          >
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Tạo bài kiểm tra trắc nghiệm</DialogTitle>
              <DialogDescription>
                Tạo bài kiểm tra với câu hỏi trắc nghiệm 4 đáp án
              </DialogDescription>
            </DialogHeader>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px', minHeight: 0 }}>
              <QuizAssignmentCreator
                teacherId={user.userId}
                onSubmit={handleCreateQuiz}
                onCancel={() => setCreateDialogOpen(false)}
                submitRef={quizSubmitRef}
              />
            </div>

            <DialogFooter style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px', flexShrink: 0 }}>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={createAssignmentMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                onClick={() => quizSubmitRef.current?.()}
                className="bg-primary"
                disabled={createAssignmentMutation.isPending}
              >
                {createAssignmentMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Tạo bài kiểm tra
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bài tập..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách bài tập ({filteredAssignments.length})
            {isLoading && (
              <Loader2 className="w-4 h-4 ml-2 inline-block animate-spin" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Đang tải danh sách bài tập...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Lớp học</TableHead>
                  <TableHead>Hạn nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Bài nộp</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map(assignment => {
                  const stats = getSubmissionStats(assignment.id);
                  const dueDate = new Date(assignment.dueDate);
                  const isOverdue = dueDate < new Date();

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {assignment.title}
                          <Badge variant="outline" className="text-xs">
                            Quiz
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{assignment.courseName}</TableCell>
                      <TableCell>
                        <span className={isOverdue ? 'text-red-600' : ''}>
                          {dueDate.toLocaleDateString('vi-VN')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={assignment.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {assignment.status === 'PUBLISHED' ? 'Đang mở' : 'Bản nháp'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{stats.graded}/{stats.total}</span>
                          {stats.total > 0 && stats.total - stats.graded > 0 && (
                            <Badge variant="secondary">{stats.total - stats.graded} chờ chấm</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewSubmissions(assignment.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEditClick(assignment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            disabled={deleteAssignmentMutation.isPending}
                          >
                            {deleteAssignmentMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy bài tập nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] max-h-[80vh!important] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Danh sách bài nộp và chấm điểm</DialogTitle>
            <DialogDescription>
              Xem và chấm điểm bài nộp của sinh viên
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Thời gian nộp</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentSubmissions.map((submission: any) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {submission.score !== undefined ? submission.score : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={submission.status === 'graded' ? 'default' : 'secondary'}>
                        {submission.status === 'graded' ? 'Đã chấm' : 'Chưa chấm'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handleOpenSubmission(submission)}>
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {assignmentSubmissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có bài nộp nào
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Submission Dialog */}
      <Dialog open={submissionDialogOpen} onOpenChange={setSubmissionDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] max-h-[80vh!important] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Chi tiết bài làm Quiz</DialogTitle>
            <DialogDescription>
              Xem chi tiết bài làm của {selectedSubmission?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 overflow-y-auto">
            <div className="space-y-4">
              {selectedSubmission && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Label className="text-sm font-semibold">Thông tin bài làm</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Tổng câu hỏi: {(selectedSubmission as any).totalQuestions || 'N/A'}</p>
                      <p>Điểm số: {selectedSubmission.score || 'Chưa chấm'}/100</p>
                      <p>Trạng thái: {selectedSubmission.status === 'graded' ? 'Đã chấm' : 'Chưa chấm'}</p>
                    </div>
                  </div>

                  {(selectedSubmission as any).answers && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Đáp án đã chọn</Label>
                      {(selectedSubmission as any).answers.map((answer: any, idx: number) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                          Câu {idx + 1}: <span className="font-semibold">{answer.selectedAnswer}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Điểm số *</Label>
                    <Input
                      type="number"
                      placeholder="Nhập điểm số..."
                      value={gradeData.score}
                      onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Điểm tối đa: 100
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Phản hồi</Label>
                    <Textarea
                      placeholder="Nhập nhận xét và phản hồi cho sinh viên..."
                      value={gradeData.feedback}
                      onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmissionDialogOpen(false)}>
              Đóng
            </Button>
            <Button onClick={handleGradeSubmission} className="bg-primary">
              Chấm điểm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Assignment Dialog */}
      {/* Edit Assignment Dialog */}
<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
  <DialogContent
    className="max-w-3xl flex flex-col p-0"
    style={{ height: "85vh", maxHeight: "85vh" }}
  >
    <DialogHeader className="px-6 pt-6">
      <DialogTitle>Chỉnh sửa bài kiểm tra</DialogTitle>
      <DialogDescription>
        Thay đổi thông tin và câu hỏi của bài kiểm tra
      </DialogDescription>
    </DialogHeader>

    <div style={{ flex: 1, overflowY: "auto", padding: "0 24px", minHeight: 0 }}>
      {editingAssignment && (
        <QuizAssignmentCreator
          teacherId={user.userId}
          initialData={editingAssignment}   // ⭐ cần thêm prop này vào creator
          onSubmit={handleUpdateQuiz}
          onCancel={() => setEditDialogOpen(false)}
          submitRef={quizSubmitRef}
        />
      )}
    </div>

    <DialogFooter style={{ borderTop: "1px solid #e5e7eb", padding: "16px 24px" }}>
      <Button
        variant="outline"
        onClick={() => setEditDialogOpen(false)}
        disabled={updateAssignmentMutation.isPending}
      >
        Hủy
      </Button>
      <Button
        onClick={() => quizSubmitRef.current?.()}
        className="bg-primary"
        disabled={updateAssignmentMutation.isPending}
      >
        {updateAssignmentMutation.isPending && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Cập nhật bài kiểm tra
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}