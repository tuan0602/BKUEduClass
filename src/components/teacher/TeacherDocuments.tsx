import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Plus, Edit, Trash2, Upload, FileText, Video, Presentation } from 'lucide-react';
import { DEMO_DOCUMENTS, DEMO_COURSES, User } from '../../lib/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TeacherDocumentsProps {
  user: User;
}

export function TeacherDocuments({ user }: TeacherDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    type: 'pdf' as 'pdf' | 'video' | 'slide',
    category: ''
  });

  const myCourses = DEMO_COURSES.filter(course => course.teacherId === user.id);
  const myDocuments = DEMO_DOCUMENTS.filter(doc =>
    myCourses.some(course => course.id === doc.courseId)
  );

  const filteredDocuments = myDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    // Mock upload
    setUploadDialogOpen(false);
    setFormData({
      courseId: '',
      title: '',
      type: 'pdf',
      category: ''
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'slide':
        return <Presentation className="w-5 h-5 text-orange-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      pdf: 'PDF',
      video: 'Video',
      slide: 'Slide'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Quản lý tài liệu</h1>
          <p className="text-muted-foreground">Upload và quản lý tài liệu học tập</p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Upload tài liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload tài liệu mới</DialogTitle>
              <DialogDescription>
                Thêm tài liệu học tập cho lớp học
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Lớp học</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value: string) => setFormData({ ...formData, courseId: value })}
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
                <Label>Tiêu đề tài liệu</Label>
                <Input
                  placeholder="Nhập tiêu đề..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại tài liệu</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'pdf' | 'video' | 'slide') => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="slide">Slide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Phân loại</Label>
                  <Input
                    placeholder="VD: Chương 1"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Kéo và thả file hoặc</p>
                <Button variant="outline">Chọn file</Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Hỗ trợ: PDF, MP4, PPTX (Tối đa 100MB)
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpload} className="bg-primary">
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng tài liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myDocuments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myDocuments.filter(d => d.type === 'pdf').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myDocuments.filter(d => d.type === 'video').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Slide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{myDocuments.filter(d => d.type === 'slide').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm tài liệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài liệu ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead>Ngày upload</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map(doc => {
                const course = myCourses.find(c => c.id === doc.courseId);
                
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getIcon(doc.type)}
                        <span>{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{course?.name}</TableCell>
                    <TableCell>{getTypeLabel(doc.type)}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>
                      {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy tài liệu nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
