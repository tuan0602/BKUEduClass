import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import { DEMO_ASSIGNMENTS, DEMO_COURSES, DEMO_SUBMISSIONS, User, Submission } from '../../lib/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface TeacherAssignmentsProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export function TeacherAssignments({ user, onNavigate }: TeacherAssignmentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ score: '', feedback: '' });
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    maxScore: '100'
  });

  const myCourses = DEMO_COURSES.filter(course => course.teacherId === user.id);
  const myAssignments = DEMO_ASSIGNMENTS.filter(assignment =>
    myCourses.some(course => course.id === assignment.courseId)
  );

  const filteredAssignments = myAssignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAssignment = () => {
    // Mock create
    setCreateDialogOpen(false);
    setFormData({
      courseId: '',
      title: '',
      description: '',
      dueDate: '',
      maxScore: '100'
    });
  };

  const getSubmissionStats = (assignmentId: string) => {
    const submissions = DEMO_SUBMISSIONS.filter(s => s.assignmentId === assignmentId);
    const graded = submissions.filter(s => s.status === 'graded').length;
    return { total: submissions.length, graded };
  };

  const handleViewSubmissions = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setGradeDialogOpen(true);
  };

  const assignmentSubmissions = selectedAssignment 
    ? DEMO_SUBMISSIONS.filter(s => s.assignmentId === selectedAssignment)
    : [];

  const handleOpenSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setSubmissionDialogOpen(true);
  };

  const handleGradeSubmission = () => {
    if (selectedSubmission) {
      const updatedSubmission = {
        ...selectedSubmission,
        score: parseFloat(gradeData.score),
        feedback: gradeData.feedback,
        status: 'graded'
      };
      // Mock update
      setGradeDialogOpen(false);
      setSubmissionDialogOpen(false);
      setGradeData({ score: '', feedback: '' });
      setSelectedSubmission(null);
      setSelectedAssignment(null);
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
              Tạo bài tập mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo bài tập mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo bài tập cho lớp học
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lớp học</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value: string) => setFormData({ ...formData, courseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tiêu đề bài tập</Label>
                <Input
                  placeholder="Nhập tiêu đề..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  placeholder="Mô tả yêu cầu bài tập..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hạn nộp</Label>
                  <Input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Điểm tối đa</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateAssignment} className="bg-primary">
                Tạo bài tập
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
                const stats = getSubmissionStats(assignment.id);
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = dueDate < new Date();

                return (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.title}</TableCell>
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
                        {stats.total > 0 && (
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
                  <TableHead>File</TableHead>
                  <TableHead>Điểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignmentSubmissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>
                      {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>{submission.fileUrl || '-'}</TableCell>
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
                        Chấm điểm
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
            <DialogTitle>Chấm điểm bài nộp</DialogTitle>
            <DialogDescription>
              Nhập điểm số và phản hồi cho bài nộp của sinh viên
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Điểm số</Label>
                <Input
                  type="number"
                  placeholder="Nhập điểm số..."
                  value={gradeData.score}
                  onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Phản hồi</Label>
                <Textarea
                  placeholder="Nhập phản hồi..."
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmissionDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleGradeSubmission} className="bg-primary">
              Chấm điểm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}