import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Calendar, Award, BookOpen, Loader2 } from 'lucide-react';
import { User } from '../../context/authContext';
import api from '../../lib/axios';

interface StudentAssignmentsProps {
  user: User;
}

interface Assignment {
  assignmentId: string; 
  title: string;
  courseId: string;
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
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch assignments từ API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get<Assignment[]>(`/students/${user.userId}/assignments`);
        setAssignments(res.data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user.userId]);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingAssignments = filteredAssignments.filter(a => a.status === 'pending');
  const submittedAssignments = filteredAssignments.filter(a => a.status === 'submitted');
  const gradedAssignments = filteredAssignments.filter(a => a.status === 'graded');
  const overdueAssignments = filteredAssignments.filter(a => a.status === 'overdue');

  const getStatusInfo = (status: string) => {
    const variants: { [key: string]: { variant: any; label: string; color: string } } = {
      pending: { variant: 'default', label: 'Chưa nộp', color: 'bg-orange-100' },
      submitted: { variant: 'secondary', label: 'Đã nộp', color: 'bg-blue-100' },
      graded: { variant: 'default', label: 'Đã chấm', color: 'bg-green-100' },
      overdue: { variant: 'destructive', label: 'Quá hạn', color: 'bg-red-100' }
    };
    return variants[status] || variants.pending;
  };

  const renderAssignmentCard = (assignment: Assignment) => {
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
                <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
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

          {assignment.status === 'graded' && assignment.score !== undefined && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Điểm số:</span>
                <span className="font-semibold text-green-600">
                  {assignment.score}/{assignment.maxScore}
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Đã nộp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{submittedAssignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Đã chấm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{gradedAssignments.length}</div>
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chưa nộp</TabsTrigger>
          <TabsTrigger value="submitted">Đã nộp</TabsTrigger>
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
            <div className="text-center py-12 text-muted-foreground">
              Không có bài tập chưa nộp
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {submittedAssignments.map(renderAssignmentCard)}
          </div>
          {submittedAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có bài tập nào đã nộp
            </div>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {gradedAssignments.map(renderAssignmentCard)}
          </div>
          {gradedAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có bài tập nào đã chấm
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {overdueAssignments.map(renderAssignmentCard)}
          </div>
          {overdueAssignments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không có bài tập quá hạn
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}