import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BookOpen, Plus, Search, Users, Edit, Trash2 } from 'lucide-react';
import { DEMO_COURSES, Course } from '../../lib/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface TeacherCoursesProps {
  user: User;
}

export function TeacherCourses({ user }: TeacherCoursesProps) {
  const navigate = useNavigate();
   // ✅ THÊM dummy courses để test
  const [courses, setCourses] = useState([
    {
      id: '1',
      name: 'Lập trình Web nâng cao',
      code: 'IT4409',
      description: 'Khóa học về phát triển ứng dụng web hiện đại',
      teacherId: user.userId,
      teacherName: user.name,
      semester: 'HK1 2024-2025',
      studentCount: 45,
      enrollmentCode: 'WEB2024'
    },
    {
      id: '2',
      name: 'Cơ sở dữ liệu',
      code: 'IT3080',
      description: 'Thiết kế và quản lý cơ sở dữ liệu',
      teacherId: user.userId,
      teacherName: user.name,
      semester: 'HK1 2024-2025',
      studentCount: 38,
      enrollmentCode: 'DB2024'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // const [courses, setCourses] = useState(DEMO_COURSES.filter(course => course.teacherId === user.userId));
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    semester: 'HK1 2024-2025',
    enrollmentCode: ''
  });

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCourse = () => {
    if (!formData.name || !formData.code) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      teacherId: user.userId,
      teacherName: user.name,
      semester: formData.semester,
      studentCount: 0,
      enrollmentCode: formData.enrollmentCode || formData.code.toUpperCase()
    };

    setCourses([...courses, newCourse]);
    setCreateDialogOpen(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      semester: 'HK1 2024-2025',
      enrollmentCode: ''
    });
    toast.success(`Đã tạo lớp học ${newCourse.name} thành công!`);
  };

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description,
      semester: course.semester,
      enrollmentCode: course.enrollmentCode
    });
    setEditDialogOpen(true);
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    if (!formData.name || !formData.code) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setCourses(courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, ...formData }
        : c
    ));
    setEditDialogOpen(false);
    setSelectedCourse(null);
    toast.success('Đã cập nhật lớp học thành công!');
  };

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCourse = () => {
    if (!selectedCourse) return;

    setCourses(courses.filter(c => c.id !== selectedCourse.id));
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
    toast.success('Đã xóa lớp học thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Quản lý lớp học</h1>
          <p className="text-muted-foreground">Quản lý các lớp học bạn đang giảng dạy</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tạo lớp học mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo lớp học mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo lớp học mới
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên lớp học</Label>
                  <Input
                    placeholder="Lập trình Web nâng cao"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã lớp</Label>
                  <Input
                    placeholder="IT4409"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  placeholder="Mô tả về nội dung lớp học..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Học kỳ</Label>
                  <Input
                    placeholder="HK1 2024-2025"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã đăng ký</Label>
                  <Input
                    placeholder="WEB2024"
                    value={formData.enrollmentCode}
                    onChange={(e) => setFormData({ ...formData, enrollmentCode: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateCourse} className="bg-primary">
                Tạo lớp học
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm lớp học theo tên hoặc mã..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCourses.map(course => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/teacher/courses/${course.id}`)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3>{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{course.code} • {course.semester}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{course.studentCount} sinh viên</span>
                    </div>
                    <div className="text-muted-foreground">
                      Mã đăng ký: <span className="text-primary">{course.enrollmentCode}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(course)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => openDeleteDialog(course)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-muted-foreground mb-2">
            {searchQuery ? 'Không tìm thấy lớp học' : 'Chưa có lớp học nào'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Tạo lớp học mới để bắt đầu'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Tạo lớp học mới
            </Button>
          )}
        </div>
      )}

      {/* Edit Course Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
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
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mã lớp</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Học kỳ</Label>
                <Input
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mã đăng ký</Label>
                <Input
                  value={formData.enrollmentCode}
                  onChange={(e) => setFormData({ ...formData, enrollmentCode: e.target.value })}
                />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lớp học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lớp học "{selectedCourse?.name}"? 
              Hành động này sẽ xóa tất cả bài tập, tài liệu và thảo luận liên quan. 
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