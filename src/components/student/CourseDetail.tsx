import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Users, 
  Download,
  Loader2,
  Lock,
  BarChart3
} from 'lucide-react';
import { useCourseDetail } from '../../hooks/useCourse';
import { Progress } from '../ui/progress';

export function CourseDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [searchMember, setSearchMember] = useState('');

  // Fetch course detail
  const { data: courseDetail, isLoading, error } = useCourseDetail(Number(courseId));

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
          onClick={() => navigate('/courses')} 
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách lớp
        </Button>
      </div>
    );
  }

  const { course, students, data: stats, teacher } = courseDetail;
  
  // Use teacher from root level or fallback to course.teacher
  const courseTeacher = teacher || course.teacher;

  // Filter students for Members tab
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    student.email.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/courses')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách lớp
        </Button>
        
        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg relative overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-white opacity-30" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="text-white mb-2">{course.code}</div>
            <h1 className="text-white text-3xl font-bold">{course.name}</h1>
            <p className="text-white/90 mt-1">
              {courseTeacher?.name || 'Giảng viên'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats for Students */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.submittedAssignments}</div>
            <p className="text-xs text-muted-foreground">Bài đã nộp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.averageGrade > 0 ? stats.averageGrade.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Của bạn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thảo luận</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.discussionsCount}</div>
            <p className="text-xs text-muted-foreground">Bài viết</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="members">Thành viên</TabsTrigger>
          <TabsTrigger value="documents" disabled>
            <Lock className="w-3 h-3 mr-1" />
            Tài liệu
          </TabsTrigger>
          <TabsTrigger value="assignments" disabled>
            <Lock className="w-3 h-3 mr-1" />
            Bài tập
          </TabsTrigger>
          <TabsTrigger value="discussions" disabled>
            <Lock className="w-3 h-3 mr-1" />
            Thảo luận
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

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Giảng viên</CardTitle>
              </CardHeader>
              <CardContent>
                {courseTeacher ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                      {courseTeacher.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{courseTeacher.name}</p>
                      <p className="text-sm text-muted-foreground">{courseTeacher.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Chưa có thông tin giảng viên</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Số sinh viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <p className="text-2xl font-bold text-primary">{stats.studentsCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={course.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {course.status}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Tiến độ học tập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Bài tập đã hoàn thành</span>
                  <span className="font-medium">
                    {stats.submittedAssignments} / {stats.totalAssignments}
                  </span>
                </div>
                <Progress 
                  value={stats.totalAssignments > 0 ? (stats.submittedAssignments / stats.totalAssignments) * 100 : 0} 
                  className="h-2" 
                />
              </div>

              {stats.averageGrade > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {stats.averageGrade.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Điểm trung bình</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalAssignments > 0 
                        ? Math.round((stats.submittedAssignments / stats.totalAssignments) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Hoàn thành</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thành viên ({students.length} sinh viên)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thành viên..."
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchMember ? 'Không tìm thấy thành viên' : 'Chưa có thành viên nào'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredStudents.map(student => (
                      <div key={student.userId} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                        </div>
                        {student.major && (
                          <Badge variant="outline">{student.major}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disabled Tabs - Documents */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tính năng đang phát triển</h3>
              <p className="text-muted-foreground">
                Quản lý tài liệu sẽ sớm được cập nhật
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disabled Tabs - Assignments */}
        <TabsContent value="assignments">
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Tính năng đang phát triển</h3>
              <p className="text-muted-foreground">
                Quản lý bài tập sẽ sớm được cập nhật
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disabled Tabs - Discussions */}
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