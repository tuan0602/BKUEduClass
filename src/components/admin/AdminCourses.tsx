import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Trash2, Eye, Users, BookOpen, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';
import { toast } from 'sonner';

import {
  useCourses,
  useDeleteCourse,
  useCreateCourse
} from '../../hooks/useCourse';
import { useTeachers } from "../../hooks/useUsers";
import { ReponseCourseDTO } from '../../lib/courseService';
import { CourseStatus } from '../../lib/courseService';

export function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<ReponseCourseDTO | null>(null);

  // Create Form State
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    description: "",
    teacherId: "",
  });

  // Fetch courses
  const { data: coursesData, isLoading, error } = useCourses({
    page: page,
    size: 10,
    courseName: searchQuery,
  });

  // Create course
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  // Fetch teachers for dropdown
  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachers();

  // Delete course
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const courses = coursesData?.result || [];
  const totalCourses = coursesData?.meta.totalElements || 0;
  const totalPages = coursesData?.meta.totalPages || 0;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(0);
  };

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;
    deleteCourse(selectedCourse.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedCourse(null);
        toast.success("Đã xóa lớp học thành công");
      }
    });
  };

  const handleCreateCourse = () => {
    if (!newCourse.code || !newCourse.name) {
      toast.error("Vui lòng nhập mã lớp và tên lớp");
      return;
    }

    createCourse(
      {
        ...newCourse,
        teacherId: String(newCourse.teacherId ?? ""), // 👈 ép sang string
        status: CourseStatus.ACTIVE,
      },
      {
        onSuccess: () => {
          toast.success("Tạo lớp học thành công");
          setCreateDialogOpen(false);

          setNewCourse({
            code: "",
            name: "",
            description: "",
            teacherId: "",
          });
        }
      }
    );
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg mb-2">⚠️ Lỗi tải dữ liệu</div>
        <div className="text-muted-foreground">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Quản lý lớp học</h1>
          <p className="text-muted-foreground">Xem và quản lý tất cả lớp học</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>+ Tạo lớp học</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Tổng lớp học</CardTitle></CardHeader>
          <CardContent><div className="text-primary">{totalCourses}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Đang hoạt động</CardTitle></CardHeader>
          <CardContent>
            <div className="text-primary">
              {courses.filter(c => c.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Tổng sinh viên</CardTitle></CardHeader>
          <CardContent>
            <div className="text-primary">
              {courses.reduce((sum, c) => sum + c.studentCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">TB SV/lớp</CardTitle></CardHeader>
          <CardContent>
            <div className="text-primary">
              {courses.length > 0
                ? Math.round(courses.reduce((sum, c) => sum + c.studentCount, 0) / courses.length)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm lớp học theo tên..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle>Danh sách lớp học ({courses.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã lớp</TableHead>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số SV</TableHead>
                <TableHead>Bài tập</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {courses.map(course => (
                <TableRow key={course.id}>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{course.code}</code>
                  </TableCell>

                  <TableCell className="font-medium">{course.name}</TableCell>

                  <TableCell>
                    {course.teacher?.name || <span className="text-muted-foreground italic">Chưa có giảng viên</span>}
                  </TableCell>

                  <TableCell>
                    <Badge variant={
                      course.status === "ACTIVE" ? "default" :
                        course.status === "INACTIVE" ? "secondary" : "outline"
                    }>
                      {course.status === "ACTIVE" ? "Hoạt động" :
                        course.status === "INACTIVE" ? "Tạm ngưng" : "Lưu trữ"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {course.studentCount}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      {course.assignmentCount}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedCourse(course); setDetailDialogOpen(true); }}>
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => { setSelectedCourse(course); setDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          {courses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy lớp học nào
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">Trang {page + 1} / {totalPages}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}>
                  Trước
                </Button>

                <Button size="sm" variant="outline" disabled={page === totalPages - 1}
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
                  Sau
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* CREATE COURSE DIALOG */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo lớp học</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">Mã lớp</label>
              <Input
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tên lớp</label>
              <Input
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mô tả</label>
              <Input
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </div>

            <div>
             <label className="text-sm font-medium">Giảng viên</label>

                  {isLoadingTeachers ? (
                    <div className="text-sm text-muted-foreground">Đang tải giảng viên...</div>
                  ) : (
                    <select
                      className="w-full border rounded-md px-3 py-2"
                      value={newCourse.teacherId}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, teacherId: e.target.value })
                      }
                    >
                      <option value="">-- Chọn giảng viên --</option>

                      {teachers.map((t) => (
                        <option key={t.userId} value={t.userId}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  )}
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Hủy</Button>

              <Button onClick={handleCreateCourse} disabled={isCreating}>
                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Tạo lớp
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa lớp học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lớp "<strong>{selectedCourse?.name}</strong>"?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDeleteCourse}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DETAIL DIALOG */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết lớp học</DialogTitle>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4">

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <BookOpen className="w-12 h-12 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">{selectedCourse.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCourse.code}</p>
                </div>
                <Badge>
                  {selectedCourse.status === "ACTIVE" ? "Hoạt động" :
                    selectedCourse.status === "INACTIVE" ? "Tạm ngưng" :
                      "Lưu trữ"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-muted-foreground">Giảng viên</p>
                  <p className="font-medium">
                    {selectedCourse.teacher?.name || "Chưa có"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Số sinh viên</p>
                  <p className="font-medium">{selectedCourse.studentCount}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Bài tập</p>
                  <p className="font-medium">{selectedCourse.assignmentCount}</p>
                </div>

              </div>

              {selectedCourse.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Mô tả</p>
                  <p>{selectedCourse.description}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
              </div>

            </div>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
}
