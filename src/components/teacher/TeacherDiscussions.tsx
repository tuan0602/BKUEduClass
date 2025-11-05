import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageSquare, Pin, Send, Search, Plus } from 'lucide-react';
import { DEMO_DISCUSSIONS, DEMO_COURSES, User } from '../../lib/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface TeacherDiscussionsProps {
  user: User;
}

export function TeacherDiscussions({ user }: TeacherDiscussionsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newDiscussion, setNewDiscussion] = useState({
    courseId: '',
    title: '',
    content: '',
    isPinned: false
  });

  const myCourses = DEMO_COURSES.filter(course => course.teacherId === user.id);
  
  const myDiscussions = DEMO_DISCUSSIONS.filter(disc =>
    myCourses.some(course => course.id === disc.courseId)
  );

  const filteredDiscussions = myDiscussions.filter(disc =>
    disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDiscussion = () => {
    if (!newDiscussion.courseId || !newDiscussion.title || !newDiscussion.content) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Mock create discussion
    setCreateDialogOpen(false);
    setNewDiscussion({ courseId: '', title: '', content: '', isPinned: false });
    
    // Notify students
    const course = myCourses.find(c => c.id === newDiscussion.courseId);
    toast.success(`Đã đăng bài thảo luận và gửi thông báo cho ${course?.studentCount || 0} sinh viên!`);
  };

  const handleReply = (discussionId: string) => {
    if (!replyText.trim()) {
      toast.error('Vui lòng nhập nội dung trả lời');
      return;
    }

    // Mock reply
    setReplyingTo(null);
    setReplyText('');
    
    // Notify students if replying to student discussion
    const discussion = DEMO_DISCUSSIONS.find(d => d.id === discussionId);
    if (discussion?.authorRole === 'Sinh viên') {
      toast.success('Đã gửi trả lời và thông báo cho sinh viên!');
    } else {
      toast.success('Đã gửi trả lời!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Thảo luận</h1>
          <p className="text-muted-foreground">Tạo thảo luận và trả lời câu hỏi của sinh viên</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tạo chủ đề mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo chủ đề thảo luận mới</DialogTitle>
              <DialogDescription>
                Đăng thông báo hoặc bắt đầu thảo luận với lớp học
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lớp học *</Label>
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
                        {course.name} ({course.studentCount} sinh viên)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tiêu đề *</Label>
                <Input
                  placeholder="Nhập tiêu đề thảo luận..."
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Nội dung *</Label>
                <Textarea
                  placeholder="Nhập nội dung thảo luận..."
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={newDiscussion.isPinned}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, isPinned: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isPinned" className="cursor-pointer">
                  Ghim bài viết (hiển thị ở đầu danh sách)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateDiscussion} className="bg-primary">
                Đăng bài
              </Button>
            </DialogFooter>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng thảo luận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myDiscussions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">
              {myDiscussions.filter(d => d.authorRole === 'Giảng viên').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Của sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">
              {myDiscussions.filter(d => d.authorRole === 'Sinh viên').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Đã ghim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">
              {myDiscussions.filter(d => d.isPinned).length}
            </div>
          </CardContent>
        </Card>
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
              Tạo chủ đề thảo luận để tương tác với sinh viên
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Tạo chủ đề mới
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
