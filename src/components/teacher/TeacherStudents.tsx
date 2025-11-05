import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, UserCheck, UserX, Eye } from 'lucide-react';
import { DEMO_USERS, DEMO_COURSES, COURSE_ENROLLMENTS, User, DEMO_SUBMISSIONS } from '../../lib/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface TeacherStudentsProps {
  user: User;
}

export function TeacherStudents({ user }: TeacherStudentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const myCourses = DEMO_COURSES.filter(course => course.teacherId === user.id);
  
  // Get all unique students from all my courses
  const allStudentIds = Array.from(new Set(
    myCourses.flatMap(course => COURSE_ENROLLMENTS[course.id] || [])
  ));
  
  const allStudents = DEMO_USERS.filter(u => allStudentIds.includes(u.id));

  // Filter by selected course
  const filteredStudents = selectedCourse === 'all'
    ? allStudents
    : allStudents.filter(student => 
        COURSE_ENROLLMENTS[selectedCourse]?.includes(student.id)
      );

  // Filter by search query
  const searchedStudents = filteredStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetail = (student: User) => {
    setSelectedStudent(student);
    setDetailDialogOpen(true);
  };

  const getStudentCourses = (studentId: string) => {
    return myCourses.filter(course => 
      COURSE_ENROLLMENTS[course.id]?.includes(studentId)
    );
  };

  const getStudentAvgScore = () => {
    // Mock average score
    return (Math.random() * 30 + 70).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý sinh viên</h1>
        <p className="text-muted-foreground">Xem và quản lý sinh viên trong các lớp học</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{allStudents.length}</div>
          </CardContent>
        </Card>
        {myCourses.slice(0, 3).map(course => (
          <Card key={course.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm line-clamp-1">{course.code}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-primary">{COURSE_ENROLLMENTS[course.id]?.length || 0} SV</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sinh viên..."
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
              <SelectItem key={course.id} value={course.id}>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchedStudents.map(student => {
                const studentCourses = getStudentCourses(student.id);
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {selectedCourse === 'all' ? (
                        <span>{studentCourses.length} lớp</span>
                      ) : (
                        myCourses.find(c => c.id === selectedCourse)?.code
                      )}
                    </TableCell>
                    <TableCell className="text-primary">{getStudentAvgScore()}</TableCell>
                    <TableCell>
                      <Badge variant="default">Hoạt động</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewDetail(student)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {searchedStudents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy sinh viên nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thông tin sinh viên</DialogTitle>
            <DialogDescription>
              Chi tiết về sinh viên và kết quả học tập
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Họ và tên</label>
                  <p>{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Mã sinh viên</label>
                  <p>{selectedStudent.studentId}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p>{selectedStudent.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Số điện thoại</label>
                  <p>{selectedStudent.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Lớp học đang tham gia</h3>
                <div className="space-y-2">
                  {getStudentCourses(selectedStudent.id).map(course => (
                    <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div>{course.name}</div>
                        <div className="text-sm text-muted-foreground">{course.code}</div>
                      </div>
                      <Badge>Điểm TB: {getStudentAvgScore()}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3">Bài nộp gần đây</h3>
                <div className="space-y-2">
                  {DEMO_SUBMISSIONS
                    .filter(s => s.studentId === selectedStudent.id)
                    .map(submission => (
                      <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm">Bài nộp</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(submission.submittedAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        {submission.score !== undefined && (
                          <Badge variant="default">Điểm: {submission.score}</Badge>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
