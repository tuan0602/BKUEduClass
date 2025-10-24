import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageSquare, Pin, Send, Search } from 'lucide-react';
import { DEMO_DISCUSSIONS, DEMO_COURSES, COURSE_ENROLLMENTS, User } from '../../lib/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface StudentDiscussionsProps {
  user: User;
}

export function StudentDiscussions({ user }: StudentDiscussionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newDiscussion, setNewDiscussion] = useState({
    courseId: '',
    title: '',
    content: ''
  });

  const myCourses = DEMO_COURSES.filter(course => 
    COURSE_ENROLLMENTS[course.id]?.includes(user.id)
  );

  const myDiscussions = DEMO_DISCUSSIONS.filter(disc =>
    myCourses.some(course => course.id === disc.courseId)
  );

  const filteredDiscussions = myDiscussions.filter(disc =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDiscussion = () => {
    // Mock create discussion
    setCreateDialogOpen(false);
    setNewDiscussion({ courseId: '', title: '', content: '' });
  };

  const handleReply = (discussionId: string) => {
    // Mock reply
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Thảo luận</h1>
          <p className="text-muted-foreground">Trao đổi và thảo luận với giảng viên, bạn bè</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <MessageSquare className="w-4 h-4 mr-2" />
              Tạo chủ đề mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo chủ đề thảo luận mới</DialogTitle>
              <DialogDescription>
                Đặt câu hỏi hoặc bắt đầu thảo luận với lớp học
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lớp học</Label>
                <Select
                  value={newDiscussion.courseId}
                  onValueChange={(value: string) => setNewDiscussion({ ...newDiscussion, courseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tiêu đề</Label>
                <Input
                  placeholder="Nhập tiêu đề thảo luận..."
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Nội dung</Label>
                <Textarea
                  placeholder="Nhập nội dung thảo luận..."
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateDiscussion} className="bg-primary">
                Đăng bài
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm thảo luận..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map(discussion => {
          const course = myCourses.find(c => c.id === discussion.courseId);
          
          return (
            <Card key={discussion.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{discussion.title}</CardTitle>
                      {discussion.isPinned && (
                        <Badge variant="secondary" className="gap-1">
                          <Pin className="w-3 h-3" />
                          Đã ghim
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary text-white">
                          {discussion.authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{discussion.authorName}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{discussion.authorRole}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {new Date(discussion.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {course && (
                      <Badge variant="outline" className="mt-2">
                        {course.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{discussion.content}</p>

                {/* Replies */}
                <div className="space-y-3 mb-4">
                  {discussion.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-primary text-white">
                            {reply.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{reply.authorName}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{reply.authorRole}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {replyingTo === discussion.id ? (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Nhập câu trả lời..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleReply(discussion.id)}
                        className="bg-primary"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Gửi
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setReplyingTo(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReplyingTo(discussion.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Trả lời ({discussion.replies.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredDiscussions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-muted-foreground mb-2">Chưa có thảo luận nào</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Bắt đầu thảo luận để trao đổi với lớp học
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-primary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Tạo chủ đề mới
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
