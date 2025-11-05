import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Lock, Unlock, Trash2, Eye, Users, BookOpen } from 'lucide-react';
import { DEMO_COURSES, COURSE_ENROLLMENTS, Course } from '../../lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from 'sonner';

export function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState(DEMO_COURSES.map(c => ({ ...c, isLocked: false })));
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCourseLock = (courseId: string) => {
    setCourses(courses.map(c => 
      c.id === courseId ? { ...c, isLocked: !c.isLocked } : c
    ));
    const course = courses.find(c => c.id === courseId);
    toast.success(course?.isLocked ? 'Đã mở khóa lớp học' : 'Đã khóa lớp học');
  };

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    setCourses(courses.filter(c => c.id !== selectedCourse.id));
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
    toast.success('Đã xóa lớp học thành công');
  };

  const openCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setDetailDialogOpen(true);
  };

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Quản lý lớp học</h1>
        <p className="text-muted-foreground">Xem và quản lý tất cả lớp học trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{courses.filter(c => !c.isLocked).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">
              {courses.reduce((sum, c) => sum + c.studentCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">TB SV/lớp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">
              {courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.studentCount, 0) / courses.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm lớp học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lớp học ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã lớp</TableHead>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Số SV</TableHead>
                <TableHead>Mã đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map(course => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.teacherName}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.studentCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{course.enrollmentCode}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.isLocked ? 'destructive' : 'default'}>
                      {course.isLocked ? 'Đã khóa' : 'Hoạt động'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openCourseDetail(course)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleCourseLock(course.id)}
                        className={course.isLocked ? 'text-green-600' : 'text-orange-600'}
                      >
                        {course.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => openDeleteDialog(course)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy lớp học nào
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lớp học theo giảng viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(courses.map(c => c.teacherName))).map(teacher => {
                const teacherCourses = courses.filter(c => c.teacherName === teacher);
                return (
                  <div key={teacher} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div>{teacher}</div>
                      <div className="text-sm text-muted-foreground">{teacherCourses.length} lớp học</div>
                    </div>
                    <Badge>{teacherCourses.reduce((sum, c) => sum + c.studentCount, 0)} SV</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lớp học theo học kỳ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(courses.map(c => c.semester))).map(semester => {
                const semesterCourses = courses.filter(c => c.semester === semester);
                return (
                  <div key={semester} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div>{semester}</div>
                      <div className="text-sm text-muted-foreground">{semesterCourses.length} lớp học</div>
                    </div>
                    <Badge>{semesterCourses.reduce((sum, c) => sum + c.studentCount, 0)} SV</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết lớp học</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3>{selectedCourse.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCourse.code}</p>
                </div>
                <Badge variant={selectedCourse.isLocked ? 'destructive' : 'default'}>
                  {selectedCourse.isLocked ? 'Đã khóa' : 'Hoạt động'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Giảng viên</p>
                  <p>{selectedCourse.teacherName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Học kỳ</p>
                  <p>{selectedCourse.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Số sinh viên</p>
                  <p>{selectedCourse.studentCount} sinh viên</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mã đăng ký</p>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedCourse.enrollmentCode}</code>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Mô tả</p>
                <p>{selectedCourse.description}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lớp học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lớp học "{selectedCourse?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
