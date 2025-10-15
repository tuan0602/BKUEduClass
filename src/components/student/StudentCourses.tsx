import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BookOpen, Plus, Search, Users } from 'lucide-react';
import { DEMO_COURSES, COURSE_ENROLLMENTS, User } from '../../lib/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

interface StudentCoursesProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export function StudentCourses({ user, onNavigate }: StudentCoursesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollCode, setEnrollCode] = useState('');
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);

  const myCourses = DEMO_COURSES.filter(course => 
    COURSE_ENROLLMENTS[course.id]?.includes(user.id)
  );

  const filteredCourses = myCourses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = () => {
    // Mock enrollment
    if (enrollCode) {
      setEnrollDialogOpen(false);
      setEnrollCode('');
      // In real app would add user to course
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Lớp học của tôi</h1>
          <p className="text-muted-foreground">Quản lý các lớp học bạn đang tham gia</p>
        </div>

        <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Đăng ký lớp học
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đăng ký lớp học mới</DialogTitle>
              <DialogDescription>
                Nhập mã lớp học để đăng ký tham gia
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="enrollCode">Mã lớp học</Label>
                <Input
                  id="enrollCode"
                  placeholder="Ví dụ: WEB2024"
                  value={enrollCode}
                  onChange={(e) => setEnrollCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Mã demo: WEB2024, DB2024, AI2024
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEnroll} className="bg-primary">
                Đăng ký
              </Button>
            </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => {
          const progress = Math.floor(Math.random() * 40) + 60; // Mock progress
          
          return (
            <Card
              key={course.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onNavigate('course-detail', { courseId: course.id })}
            >
              <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white opacity-50" />
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-white text-primary px-2 py-1 rounded text-sm">
                    {course.code}
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.name}</CardTitle>
                <CardDescription>{course.teacherName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{course.studentCount} sinh viên</span>
                    </div>
                    <span className="text-muted-foreground">{course.semester}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-muted-foreground mb-2">Không tìm thấy lớp học</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bạn chưa tham gia lớp học nào'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setEnrollDialogOpen(true)} className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Đăng ký lớp học
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
