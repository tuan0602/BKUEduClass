import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Trash2, Eye, Users, BookOpen, Loader2, Pencil, Clock, CheckCircle, XCircle, UserPlus } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import {
  useCourses,
  useDeleteCourse,
  useCreateCourse,
  useUpdateCourse
} from '../../hooks/useCourse';
import { useTeachers } from "../../hooks/useUsers";
import { ReponseCourseDTO, CourseStatus } from '../../lib/courseService';
import { 
  useAcceptEnrollment, 
  useRefuseEnrollment,
  useBatchEnrollmentAction,
  usePendingEnrollments
} from '../../hooks/useEnrollment';
import { CourseEnrollment, EnrollmentStatus } from '../../lib/enrollment';

export function AdminCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState("courses");

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<ReponseCourseDTO | null>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<number[]>([]);

  // Form chung Create + Edit
  const [courseForm, setCourseForm] = useState({
    code: "",
    name: "",
    description: "",
    teacherId: "",
    status: CourseStatus.ACTIVE,
  });

  // Fetch courses
  const { data: coursesData, isLoading, error } = useCourses({
    page,
    size: 10,
    courseName: searchQuery,
  });

  // Mutations
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  
  // Enrollment mutations
  const { mutate: acceptEnrollment, isPending: isAccepting } = useAcceptEnrollment();
  const { mutate: refuseEnrollment, isPending: isRefusing } = useRefuseEnrollment();
  const { mutate: batchAction, isPending: isBatchProcessing } = useBatchEnrollmentAction();

  // Fetch teachers
  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachers();
  
  // Fetch pending enrollments
  const { 
    data: pendingEnrollments = [], 
    isLoading: isLoadingEnrollments,
    error: enrollmentsError 
  } = usePendingEnrollments();

  const courses = coursesData?.result || [];
  const totalCourses = coursesData?.meta.totalElements || 0;
  const totalPages = coursesData?.meta.totalPages || 0;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(0);
  };

  // Open create dialog
  const handleOpenCreateDialog = () => {
    setCourseForm({
      code: "",
      name: "",
      description: "",
      teacherId: "",
      status: CourseStatus.ACTIVE,
    });
    setCreateDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (course: ReponseCourseDTO) => {
    setSelectedCourse(course);
    setCourseForm({
      code: course.code,
      name: course.name,
      description: course.description || "",
      teacherId: course.teacher?.userId || "",
      status: course.status as CourseStatus,
    });
    setEditDialogOpen(true);
  };

  // Create course
  const handleCreateCourse = () => {
    if (!courseForm.code || !courseForm.name) {
      toast.error("Vui lòng nhập mã lớp và tên lớp");
      return;
    }

    createCourse(
      { ...courseForm, teacherId: String(courseForm.teacherId ?? "") },
      {
        onSuccess: () => {
          toast.success("Tạo lớp học thành công");
          setCreateDialogOpen(false);
        }
      }
    );
  };

  // Update course
  const handleUpdateCourse = () => {
    if (!courseForm.code || !courseForm.name || !selectedCourse) {
      toast.error("Vui lòng nhập mã lớp và tên lớp");
      return;
    }

    updateCourse(
      {
        courseId: selectedCourse.id,
        courseData: { ...courseForm, teacherId: String(courseForm.teacherId ?? "") }
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật lớp học thành công");
          setEditDialogOpen(false);
          setSelectedCourse(null);
        }
      }
    );
  };

  // Delete course
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

  // Enrollment actions
  const handleAcceptEnrollment = (enrollmentId: number) => {
    acceptEnrollment(enrollmentId);
  };

  const handleRefuseEnrollment = (enrollmentId: number) => {
    refuseEnrollment(enrollmentId);
  };

  const handleBatchAccept = () => {
    if (selectedEnrollments.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 yêu cầu");
      return;
    }
    batchAction({
      enrollmentIds: selectedEnrollments,
      action: 'accept'
    }, {
      onSuccess: () => {
        setSelectedEnrollments([]);
      }
    });
  };

  const handleBatchRefuse = () => {
    if (selectedEnrollments.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 yêu cầu");
      return;
    }
    batchAction({
      enrollmentIds: selectedEnrollments,
      action: 'refuse'
    }, {
      onSuccess: () => {
        setSelectedEnrollments([]);
      }
    });
  };

  const toggleEnrollmentSelection = (id: number) => {
    setSelectedEnrollments(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEnrollments.length === pendingEnrollments.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(pendingEnrollments.map(e => e.id));
    }
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
        <Button onClick={handleOpenCreateDialog}>+ Tạo lớp học</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Tổng lớp học</CardTitle></CardHeader>
          <CardContent><div className="text-primary text-2xl font-bold">{totalCourses}</div></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Đang hoạt động</CardTitle></CardHeader>
          <CardContent>
            <div className="text-green-600 text-2xl font-bold">
              {courses.filter(c => c.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Tổng sinh viên</CardTitle></CardHeader>
          <CardContent>
            <div className="text-blue-600 text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.studentCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">TB SV/lớp</CardTitle></CardHeader>
          <CardContent>
            <div className="text-purple-600 text-2xl font-bold">
              {courses.length > 0
                ? Math.round(courses.reduce((sum, c) => sum + c.studentCount, 0) / courses.length)
                : 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Chờ duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-600 text-2xl font-bold">
              {pendingEnrollments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" />
            Danh sách lớp học
          </TabsTrigger>
          <TabsTrigger value="enrollments" className="relative">
            <UserPlus className="w-4 h-4 mr-2" />
            Yêu cầu tham gia
            {pendingEnrollments.length > 0 && (
              <Badge className="ml-2 bg-orange-500 text-white">
                {pendingEnrollments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* COURSES TAB */}
        <TabsContent value="courses" className="space-y-4">
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
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleOpenEditDialog(course)}
                          >
                            <Pencil className="w-4 h-4" />
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
        </TabsContent>

        {/* ENROLLMENTS TAB */}
        <TabsContent value="enrollments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Yêu cầu tham gia lớp học ({pendingEnrollments.length})</CardTitle>
                {selectedEnrollments.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={handleBatchAccept}
                      disabled={isBatchProcessing}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Duyệt ({selectedEnrollments.length})
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleBatchRefuse}
                      disabled={isBatchProcessing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Từ chối ({selectedEnrollments.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedEnrollments.length === pendingEnrollments.length && pendingEnrollments.length > 0}
                        onChange={toggleSelectAll}
                        className="cursor-pointer"
                      />
                    </TableHead>
                    <TableHead>Sinh viên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Lớp học</TableHead>
                    <TableHead>Mã lớp</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pendingEnrollments.map(enrollment => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedEnrollments.includes(enrollment.id)}
                          onChange={() => toggleEnrollmentSelection(enrollment.id)}
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{enrollment.student.name}</TableCell>
                      <TableCell className="text-muted-foreground">{enrollment.student.email}</TableCell>
                      <TableCell>{enrollment.course.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {enrollment.course.code}
                        </code>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(enrollment.enrolledAt).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAcceptEnrollment(enrollment.id)}
                            disabled={isAccepting || isRefusing}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRefuseEnrollment(enrollment.id)}
                            disabled={isAccepting || isRefusing}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pendingEnrollments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Không có yêu cầu tham gia nào đang chờ duyệt</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* CREATE + EDIT COURSE DIALOG */}
      <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editDialogOpen ? "Chỉnh sửa lớp học" : "Tạo lớp học"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium">Mã lớp</label>
              <Input
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tên lớp</label>
              <Input
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mô tả</label>
              <Input
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Giảng viên</label>
              {isLoadingTeachers ? (
                <div className="text-sm text-muted-foreground">Đang tải giảng viên...</div>
              ) : (
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={courseForm.teacherId}
                  onChange={(e) => setCourseForm({ ...courseForm, teacherId: e.target.value })}
                >
                  <option value="">-- Chọn giảng viên --</option>
                  {teachers.map((t) => (
                    <option key={t.userId} value={t.userId}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button
                variant="outline"
                onClick={() => { setCreateDialogOpen(false); setEditDialogOpen(false); }}
              >
                Hủy
              </Button>

              <Button
                onClick={editDialogOpen ? handleUpdateCourse : handleCreateCourse}
                disabled={isCreating || isUpdating}
              >
                {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editDialogOpen ? "Cập nhật" : "Tạo lớp"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}