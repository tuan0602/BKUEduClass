import { useState, useEffect, useRef } from 'react';
import { User } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Plus, Trash2, Upload, FileText, Download, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from 'sonner';
import { useDocument } from '../../hooks/useDocument';
import { useCourses } from '../../hooks/useCourse';
import { Document } from '../../lib/documentService';

interface TeacherDocumentsProps {
  user: User;
}

export function TeacherDocuments({ user }: TeacherDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load courses của teacher
  const { data: coursesData, isLoading: coursesLoading } = useCourses({
    size: 100,
  });

  const myCourses = coursesData?.result
    .filter(course => course.teacher?.userId === user.userId)
    .map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
    })) || [];

  const {
    documents,
    loading: documentsLoading,
    uploadDocument,
    fetchDocuments,
    downloadDocument,
    deleteDocument,
  } = useDocument();

  // Fetch documents when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      fetchDocuments(selectedCourseId);
    }
  }, [selectedCourseId]);

  // Auto-select first course if available
  useEffect(() => {
    if (myCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(myCourses[0].id);
    }
  }, [myCourses]);

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedCourseId) {
      toast.error('Vui lòng chọn lớp học');
      return;
    }

    if (!selectedFile) {
      toast.error('Vui lòng chọn file để upload');
      return;
    }

    if (!uploadTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề tài liệu');
      return;
    }

    const success = await uploadDocument({
      file: selectedFile,
      title: uploadTitle,
      courseId: selectedCourseId,
    });

    if (success) {
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Refresh documents list
      if (selectedCourseId) {
        fetchDocuments(selectedCourseId);
      }
    }
  };

  const openDeleteDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDoc || !selectedCourseId) return;

    const success = await deleteDocument(selectedCourseId, selectedDoc.id);
    if (success) {
      setDeleteDialogOpen(false);
      setSelectedDoc(null);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (!selectedCourseId) return;
    // Get extension from fileUrl if available
    let filename = doc.fileName || doc.title;
    if (doc.fileUrl && !filename.includes('.')) {
      const ext = doc.fileUrl.substring(doc.fileUrl.lastIndexOf('.'));
      if (ext) filename += ext;
    }
    await downloadDocument(selectedCourseId, doc.id, filename);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileName: string) => {
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const selectedCourse = myCourses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý tài liệu</h1>
          <p className="text-muted-foreground">Upload và quản lý tài liệu học tập</p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" disabled={!selectedCourseId}>
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
                <Input value={selectedCourse?.name || ''} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Tiêu đề tài liệu *</Label>
                <Input
                  placeholder="Nhập tiêu đề..."
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>File tài liệu *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-medium mb-2">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatFileSize(selectedFile.size)}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Chọn file khác
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-2">Chọn file để upload</p>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="max-w-xs mx-auto"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.mp4,.avi,.mov"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Hỗ trợ: PDF, Word, PowerPoint, Excel, Video (Tối đa 100MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadDialogOpen(false);
                  setSelectedFile(null);
                  setUploadTitle('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleUpload} disabled={documentsLoading}>
                {documentsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn lớp học</CardTitle>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Select
              value={selectedCourseId?.toString()}
              onValueChange={(value) => setSelectedCourseId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn lớp học" />
              </SelectTrigger>
              <SelectContent>
                {myCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng tài liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lớp học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{myCourses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tổng dung lượng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatFileSize(documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Lớp đã chọn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-primary truncate">
              {selectedCourse?.name || 'Chưa chọn'}
            </div>
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
          {documentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên file</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Loại file</TableHead>
                    <TableHead>Dung lượng</TableHead>
                    <TableHead>Ngày upload</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.fileName)}
                          <span className="font-medium">{doc.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {doc.fileType?.toUpperCase() || 'FILE'}
                        </span>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.fileSize || 0)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(doc.uploadedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(doc)}
                            title="Tải xuống"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(doc)}
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  {selectedCourseId
                    ? 'Chưa có tài liệu nào. Hãy upload tài liệu đầu tiên!'
                    : 'Vui lòng chọn lớp học để xem tài liệu'}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu "{selectedDoc?.title}"?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={documentsLoading}
            >
              {documentsLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
