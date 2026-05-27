// src/components/student/StudentAssignments.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Calendar, Award, BookOpen, Loader2 } from 'lucide-react';
import { User } from '../../context/AuthContext';
import courseService from '../../lib/courseService';
import assignmentService from '../../lib/assignmentService';
import submissionService from '../../lib/submissionService';

interface StudentAssignmentsProps {
  user: User;
}

interface EnrichedAssignment {
  assignmentId: number;
  title: string;
  courseId: number;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  maxScore: number;
  score?: number;
  description?: string;
}

export function StudentAssignments({ user }: StudentAssignmentsProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const coursesData = await courseService.getCourses({ size: 100 });

        if (!coursesData?.result) {
          setLoading(false);
          return;
        }

        const allAssignments: EnrichedAssignment[] = [];

        for (const course of coursesData.result) {
          try {
            const assignmentsData =
              await assignmentService.getAssignmentsByCourseId(course.id, {
                page: 0,
                size: 100,
              });

            const courseAssignments = assignmentsData.result || [];

            for (const assignment of courseAssignments) {
              let status: 'pending' | 'submitted' | 'graded' | 'overdue' = 'pending';
              let score: number | undefined;

              try {
                const submission =
                  await submissionService.getSubmissionByAssignmentId(assignment.id);

                if (submission.submitted === true) {
                  status = 'graded';
                  score = submission.grade ?? undefined;
                } else {
                  status = 'pending';
                }
              } catch {
                status = 'pending';
              }

              // Nếu chưa nộp → kiểm tra quá hạn
              if (status === 'pending') {
                const dueDate = new Date(assignment.dueDate);
                if (dueDate < new Date()) {
                  status = 'overdue';
                }
              }

              allAssignments.push({
                assignmentId: assignment.id,
                title: assignment.title,
                courseId: course.id,
                courseName: course.name,
                dueDate: assignment.dueDate,
                status,
                maxScore: 10,
                score,
                description: assignment.description,
              });
            }
          } catch (err) {
            console.error(`Error fetching assignments for course ${course.id}:`, err);
          }
        }

        setAssignments(allAssignments);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAssignments = filteredAssignments.filter((a) => a.status === 'pending');
  const submittedAssignments = filteredAssignments.filter((a) => a.status === 'submitted');
  const gradedAssignments = filteredAssignments.filter((a) => a.status === 'graded');
  const overdueAssignments = filteredAssignments.filter((a) => a.status === 'overdue');

  const getStatusInfo = (status: string) => {
    const variants: any = {
      pending: { variant: 'default', label: 'Chưa nộp' },
      submitted: { variant: 'secondary', label: 'Đã nộp' },
      graded: { variant: 'default', label: 'Đã chấm' },
      overdue: { variant: 'destructive', label: 'Quá hạn' },
    };
    return variants[status] || variants.pending;
  };

  const renderAssignmentCard = (assignment: EnrichedAssignment) => {
    const statusInfo = getStatusInfo(assignment.status);
    const dueDate = new Date(assignment.dueDate);

    return (
      <Card
        key={assignment.assignmentId}
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => navigate(`/assignments/${assignment.assignmentId}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{assignment.title}</h3>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{assignment.courseName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Hạn: {dueDate.toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Award className="w-4 h-4" />
              <span>{assignment.maxScore} điểm</span>
            </div>
          </div>

          {assignment.status === 'graded' && typeof assignment.score === 'number' && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Điểm số:</span>
                <span className="font-semibold text-green-600">
                  {assignment.score.toFixed(1)}/{assignment.maxScore}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bài tập của tôi</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi các bài tập</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bài tập..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Chưa nộp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendingAssignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Đã chấm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{gradedAssignments.length} / {assignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overdueAssignments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chưa nộp</TabsTrigger>
          <TabsTrigger value="graded">Đã chấm</TabsTrigger>
          <TabsTrigger value="overdue">Quá hạn</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredAssignments.map(renderAssignmentCard)}
          </div>
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy bài tập nào
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {pendingAssignments.map(renderAssignmentCard)}
          </div>
          {pendingAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Không có bài tập chưa nộp</div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {submittedAssignments.map(renderAssignmentCard)}
          </div>
          {submittedAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Chưa có bài tập nào đã nộp</div>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {gradedAssignments.map(renderAssignmentCard)}
          </div>
          {gradedAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Chưa có bài tập nào đã chấm</div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {overdueAssignments.map(renderAssignmentCard)}
          </div>
          {overdueAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Không có bài tập quá hạn</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
