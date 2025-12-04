import { useState, useRef } from 'react';
import { QuizAssignmentCreator } from './QuizAssignmentCreator'; 
import { 
  DEMO_QUIZ_ASSIGNMENTS, 
  DEMO_QUIZ_SUBMISSIONS, 
  getQuizStats, 
  autoGradeQuiz,
  DEMO_ASSIGNMENTS, 
  DEMO_COURSES, 
  DEMO_SUBMISSIONS, 
  Submission 
} from '../../lib/mockData';
import { User } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface TeacherAssignmentsProps {
  user: User;
}

export function TeacherAssignments({ user }: TeacherAssignmentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });
  
  // Ref to trigger quiz submit
  const quizSubmitRef = useRef<(() => void) | null>(null);

  // Fetch courses từ DB, fallback sang mock data nếu rỗng
  const myCoursesFromDB = DEMO_COURSES.filter(course => course.teacherId === user.userId);
  
  // TEMPORARY: Dùng mock data để test khi chưa có courses trong DB
  const myCourses = myCoursesFromDB.length > 0 
    ? myCoursesFromDB 
    : DEMO_COURSES.filter(course => course.teacherId === 'teacher-1');
  
  console.log('Using courses (fallback to mock):', myCourses);
  
  const myAssignments = DEMO_ASSIGNMENTS.filter(assignment =>
    myCourses.some(course => course.id === assignment.courseId)
  );

  // Lấy quiz của giáo viên
  const myQuizzes = DEMO_QUIZ_ASSIGNMENTS.filter(quiz =>
    myCourses.some(course => course.id === quiz.courseId)
  );

  // Merge quiz vào assignments để hiển thị chung
  const allAssignments = [
    ...myAssignments,
    ...myQuizzes.map(quiz => ({
      id: quiz.id,
      courseId: quiz.courseId,
      courseName: quiz.courseName,
      title: `[QUIZ] ${quiz.title}`,
      description: quiz.description,
      dueDate: quiz.dueDate,
      maxScore: 100, // Quiz mặc định 100 điểm
      status: 'pending' as const
    }))
  ];

  const filteredAssignments = allAssignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubmissionStats = (assignmentId: string) => {
    const submissions = DEMO_SUBMISSIONS.filter(s => s.assignmentId === assignmentId);
    const graded = submissions.filter(s => s.status === 'graded').length;
    return { total: submissions.length, graded };
  };

  // Hàm get submission stats cho quiz
  const getQuizSubmissionStats = (quizId: string) => {
    const submissions = DEMO_QUIZ_SUBMISSIONS.filter(s => s.quizId === quizId);
    const graded = submissions.filter(s => s.status === 'graded').length;
    return { total: submissions.length, graded };
  };

  const handleViewSubmissions = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setGradeDialogOpen(true);
  };

  // Check if assignment is quiz
  const isQuiz = (assignmentId: string) => assignmentId.startsWith('9');

  const assignmentSubmissions = selectedAssignment 
    ? (isQuiz(selectedAssignment)
        ? DEMO_QUIZ_SUBMISSIONS.filter(s => s.quizId === selectedAssignment)
        : DEMO_SUBMISSIONS.filter(s => s.assignmentId === selectedAssignment))
    : [];

  const handleOpenSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score?.toString() || '',
      feedback: submission.feedback || ''
    });
    setSubmissionDialogOpen(true);
  };

  const handleGradeSubmission = () => {
    if (!gradeData.score) {
      toast.error('Vui lòng nhập điểm số');
      return;
    }

    const score = parseFloat(gradeData.score);
    const assignment = allAssignments.find(a => a.id === selectedAssignment);
    
    if (assignment && (score < 0 || score > assignment.maxScore)) {
      toast.error(`Điểm phải từ 0 đến ${assignment.maxScore}`);
      return;
    }

    if (selectedSubmission) {
      const updatedSubmission = {
        ...selectedSubmission,
        score: score,
        feedback: gradeData.feedback,
        status: 'graded' as const
      };
      // Mock update
      setSubmissionDialogOpen(false);
      setGradeData({ score: '', feedback: '' });
      setSelectedSubmission(null);
      toast.success(`Đã chấm điểm cho ${updatedSubmission.studentName}!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Quản lý bài tập</h1>
          <p className="text-muted-foreground">Tạo và quản lý bài tập cho lớp học</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
  <DialogTrigger asChild>
    <Button className="bg-primary hover:bg-primary/90">
      <Plus className="w-4 h-4 mr-2" />
      Tạo bài kiểm tra trắc nghiệm
    </Button>
  </DialogTrigger>

  <DialogContent
    className="max-w-3xl h-[85vh] flex flex-col overflow-hidden"
  >
    <DialogHeader>
      <DialogTitle>Tạo bài kiểm tra trắc nghiệm</DialogTitle>
      <DialogDescription>
        Tạo bài kiểm tra với câu hỏi trắc nghiệm 4 đáp án
      </DialogDescription>
    </DialogHeader>

    {/* FIX 1: container dành cho form + câu hỏi phải scroll riêng */}
    <div className="flex-1 overflow-y-auto px-1 pb-4">
      <QuizAssignmentCreator
        myCourses={myCourses}
        onSubmit={(data) => {
          console.log('Quiz data:', data);

          const newQuiz = {
            id: `quiz-${Date.now()}`,
            courseId: data.courseId,
            courseName: myCourses.find(c => c.id === data.courseId)?.name || '',
            title: data.title,
            description: data.description,
            dueDate: data.dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            questions: data.questions.map((q: any, idx: number) => ({
              id: `q${Date.now()}-${idx}`,
              question: q.question,
              answerA: q.answerA,
              answerB: q.answerB,
              answerC: q.answerC,
              answerD: q.answerD,
              correctAnswer: q.correctAnswer
            }))
          };

          DEMO_QUIZ_ASSIGNMENTS.push(newQuiz);
          setCreateDialogOpen(false);
          toast.success('Đã tạo bài kiểm tra thành công!');
        }}
        onCancel={() => setCreateDialogOpen(false)}
        submitRef={quizSubmitRef}
      />
    </div>

    {/* FIX 2: Footer phải nằm cố định dưới, không bị đẩy xuống */}
    <DialogFooter className="border-t pt-4 mt-auto">
      <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
        Hủy
      </Button>
      <Button onClick={() => quizSubmitRef.current?.()} className="bg-primary">
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
          <CardTitle>Danh sách bài tập ({filteredAssignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Bài nộp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map(assignment => {
                const isQuizAssignment = isQuiz(assignment.id);
                const stats = isQuizAssignment 
                  ? getQuizSubmissionStats(assignment.id)
                  : getSubmissionStats(assignment.id);
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = dueDate < new Date();

                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {assignment.title}
                        {isQuizAssignment && (
                          <Badge variant="outline" className="text-xs">Quiz</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{assignment.courseName}</TableCell>
                    <TableCell>
                      <span className={isOverdue ? 'text-red-600' : ''}>
                        {dueDate.toLocaleDateString('vi-VN')}
                      </span>
                    </TableCell>
                    <TableCell>{assignment.maxScore}</TableCell>
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
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy bài tập nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Danh sách bài nộp và chấm điểm</DialogTitle>
            <DialogDescription>
              Xem và chấm điểm bài nộp của sinh viên
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sinh viên</TableHead>
                  <TableHead>Thời gian nộp</TableHead>
                  {!selectedAssignment?.startsWith('9') && <TableHead>File</TableHead>}
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
                    {!selectedAssignment?.startsWith('9') && (
                      <TableCell>{submission.fileUrl || '-'}</TableCell>
                    )}
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
                        {selectedAssignment?.startsWith('9') ? 'Xem chi tiết' : 'Chấm điểm'}
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAssignment?.startsWith('9') ? 'Chi tiết bài làm Quiz' : 'Chấm điểm bài nộp'}
            </DialogTitle>
            <DialogDescription>
              {selectedAssignment?.startsWith('9') 
                ? `Xem chi tiết bài làm của ${selectedSubmission?.studentName}`
                : `Nhập điểm số và phản hồi cho bài nộp của ${selectedSubmission?.studentName}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {/* Quiz submission details */}
              {selectedAssignment?.startsWith('9') && selectedSubmission && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Label className="text-sm font-semibold">Thông tin bài làm</Label>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Tổng câu hỏi: {(selectedSubmission as any).totalQuestions}</p>
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
                </div>
              )}

              {/* Regular assignment submission */}
              {!selectedAssignment?.startsWith('9') && selectedSubmission && (
                <>
                  {selectedSubmission.fileUrl && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm text-muted-foreground">File đã nộp</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex-1">{selectedSubmission.fileName || selectedSubmission.fileUrl}</span>
                        <Button size="sm" variant="outline" onClick={() => toast.success('Đang tải xuống...')}>
                          Tải xuống
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {selectedSubmission.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm text-muted-foreground">Ghi chú của sinh viên</Label>
                      <p className="mt-1">{selectedSubmission.notes}</p>
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
                      Điểm tối đa: {allAssignments.find(a => a.id === selectedAssignment)?.maxScore || 100}
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
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmissionDialogOpen(false)}>
              {selectedAssignment?.startsWith('9') ? 'Đóng' : 'Hủy'}
            </Button>
            {!selectedAssignment?.startsWith('9') && (
              <Button onClick={handleGradeSubmission} className="bg-primary">
                Chấm điểm
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}