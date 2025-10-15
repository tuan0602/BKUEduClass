import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Upload, Download, Calendar, Award } from 'lucide-react';
import { DEMO_ASSIGNMENTS, DEMO_SUBMISSIONS } from '../../lib/mockData';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';

interface AssignmentDetailProps {
  assignmentId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function AssignmentDetail({ assignmentId, onNavigate }: AssignmentDetailProps) {
  const assignment = DEMO_ASSIGNMENTS.find(a => a.id === assignmentId);
  const [submissionText, setSubmissionText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!assignment) {
    return <div>Không tìm thấy bài tập</div>;
  }

  const getStatusInfo = (status: string) => {
    const variants: { [key: string]: { variant: any; label: string; color: string } } = {
      pending: { variant: 'default', label: 'Chưa nộp', color: 'text-orange-600' },
      submitted: { variant: 'secondary', label: 'Đã nộp', color: 'text-blue-600' },
      graded: { variant: 'default', label: 'Đã chấm', color: 'text-green-600' },
      overdue: { variant: 'destructive', label: 'Quá hạn', color: 'text-red-600' }
    };
    return variants[status] || variants.pending;
  };

  const statusInfo = getStatusInfo(assignment.status);
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date();

  const handleSubmit = () => {
    // Mock submission
    setSubmitted(true);
    setTimeout(() => {
      onNavigate('assignments');
    }, 1500);
  };

  const mySubmission = DEMO_SUBMISSIONS.find(s => s.assignmentId === assignmentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => onNavigate('assignments')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách bài tập
        </Button>
      </div>

      {submitted && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <AlertDescription>Nộp bài thành công! Đang chuyển về danh sách bài tập...</AlertDescription>
        </Alert>
      )}

      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle>{assignment.title}</CardTitle>
                <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{assignment.courseName}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Award className="w-4 h-4" />
                <span>{assignment.maxScore} điểm</span>
              </div>
              <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                <Calendar className="w-4 h-4" />
                <span>Hạn: {dueDate.toLocaleDateString('vi-VN', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3>Mô tả bài tập</h3>
              <p className="text-muted-foreground mt-2">{assignment.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Submission */}
      {mySubmission ? (
        <Card>
          <CardHeader>
            <CardTitle>Bài nộp của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Thời gian nộp</label>
              <p>{new Date(mySubmission.submittedAt).toLocaleString('vi-VN')}</p>
            </div>
            {mySubmission.fileUrl && (
              <div>
                <label className="text-sm text-muted-foreground">File đã nộp</label>
                <div className="flex items-center gap-2 mt-1">
                  <span>{mySubmission.fileUrl}</span>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            {mySubmission.score !== undefined && (
              <div>
                <label className="text-sm text-muted-foreground">Điểm</label>
                <p className="text-primary">{mySubmission.score}/{assignment.maxScore}</p>
              </div>
            )}
            {mySubmission.feedback && (
              <div>
                <label className="text-sm text-muted-foreground">Nhận xét của giảng viên</label>
                <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                  <p>{mySubmission.feedback}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Submit Assignment Form
        <Card>
          <CardHeader>
            <CardTitle>Nộp bài tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Ghi chú (tùy chọn)</label>
              <Textarea
                placeholder="Nhập ghi chú về bài làm của bạn..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Kéo và thả file hoặc</p>
              <Button variant="outline">Chọn file</Button>
              <p className="text-xs text-muted-foreground mt-2">
                Hỗ trợ: PDF, DOC, DOCX, ZIP (Tối đa 10MB)
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit} 
                className="bg-primary flex-1"
                disabled={isOverdue}
              >
                {isOverdue ? 'Đã quá hạn' : 'Nộp bài'}
              </Button>
              <Button variant="outline" onClick={() => onNavigate('assignments')}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
