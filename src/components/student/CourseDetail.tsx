import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, BookOpen, FileText, MessageSquare, Users, Download } from 'lucide-react';
import { DEMO_COURSES, DEMO_ASSIGNMENTS, DEMO_DOCUMENTS, DEMO_DISCUSSIONS, COURSE_ENROLLMENTS, DEMO_USERS } from '../../lib/mockData';
import { Badge } from '../ui/badge';

interface CourseDetailProps {
  courseId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function CourseDetail({ courseId, onNavigate }: CourseDetailProps) {
  const course = DEMO_COURSES.find(c => c.id === courseId);
  const assignments = DEMO_ASSIGNMENTS.filter(a => a.courseId === courseId);
  const documents = DEMO_DOCUMENTS.filter(d => d.courseId === courseId);
  const discussions = DEMO_DISCUSSIONS.filter(d => d.courseId === courseId);
  const enrolledStudentIds = COURSE_ENROLLMENTS[courseId] || [];
  const enrolledStudents = DEMO_USERS.filter(u => enrolledStudentIds.includes(u.id));

  if (!course) {
    return <div>Không tìm thấy lớp học</div>;
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: { variant: any; label: string } } = {
      pending: { variant: 'default', label: 'Chưa nộp' },
      submitted: { variant: 'secondary', label: 'Đã nộp' },
      graded: { variant: 'default', label: 'Đã chấm' },
      overdue: { variant: 'destructive', label: 'Quá hạn' }
    };
    return variants[status] || variants.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => onNavigate('courses')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách lớp
        </Button>
        
        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg relative overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-white opacity-30" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="text-white mb-2">{course.code}</div>
            <h1 className="text-white">{course.name}</h1>
            <p className="text-white/90 mt-1">{course.teacherName} • {course.semester}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="assignments">Bài tập</TabsTrigger>
          <TabsTrigger value="discussions">Thảo luận</TabsTrigger>
          <TabsTrigger value="members">Thành viên</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả lớp học</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Giảng viên</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.teacherName}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Số sinh viên</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary">{course.studentCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Học kỳ</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{course.semester}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tài liệu học tập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <div>{doc.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.category} • {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có tài liệu nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách bài tập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map(assignment => {
                  const statusInfo = getStatusBadge(assignment.status);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => onNavigate('assignment-detail', { assignmentId: assignment.id })}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{assignment.title}</span>
                          <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {assignment.maxScore} điểm
                      </div>
                    </div>
                  );
                })}
                {assignments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có bài tập nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-4">
          {discussions.map(discussion => (
            <Card key={discussion.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {discussion.title}
                      {discussion.isPinned && <Badge>Đã ghim</Badge>}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {discussion.authorName} • {discussion.authorRole} • {new Date(discussion.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{discussion.content}</p>
                <div className="border-t pt-4 space-y-3">
                  {discussion.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm mb-1">
                        <span>{reply.authorName}</span>
                        <span className="text-muted-foreground"> • {reply.authorRole}</span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {discussions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                Chưa có thảo luận nào
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thành viên ({enrolledStudents.length} sinh viên)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {enrolledStudents.map(student => (
                  <div key={student.id} className="flex items-center gap-3 p-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div>{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.studentId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
