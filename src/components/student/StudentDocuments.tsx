import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Download, FileText, Video, Presentation, BookOpen } from 'lucide-react';
import { DEMO_DOCUMENTS, DEMO_COURSES, COURSE_ENROLLMENTS, User } from '../../lib/mockData';

interface StudentDocumentsProps {
  user: User;
  onNavigate: (page: string, data?: any) => void;
}

export function StudentDocuments({ user, onNavigate }: StudentDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const myCourses = DEMO_COURSES.filter(course => 
    COURSE_ENROLLMENTS[course.id]?.includes(user.id)
  );

  const myDocuments = DEMO_DOCUMENTS.filter(doc =>
    myCourses.some(course => course.id === doc.courseId)
  );

  const filteredDocuments = myDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pdfDocs = filteredDocuments.filter(d => d.type === 'pdf');
  const videoDocs = filteredDocuments.filter(d => d.type === 'video');
  const slideDocs = filteredDocuments.filter(d => d.type === 'slide');

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

  const renderDocumentCard = (doc: typeof DEMO_DOCUMENTS[0]) => {
    const course = myCourses.find(c => c.id === doc.courseId);
    
    return (
      <Card key={doc.id} className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                {getIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="line-clamp-2 mb-1">{doc.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course?.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{doc.category}</span>
                  <span>•</span>
                  <span>{new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}</span>
                  <span>•</span>
                  <span className="text-primary">{getTypeLabel(doc.type)}</span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="ml-2">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Tài liệu học tập</h1>
        <p className="text-muted-foreground">Tài liệu từ các lớp học của bạn</p>
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
            <div className="text-primary">{pdfDocs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{videoDocs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Slide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary">{slideDocs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="slide">Slide</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredDocuments.map(renderDocumentCard)}
          </div>
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy tài liệu nào
            </div>
          )}
        </TabsContent>

        <TabsContent value="pdf" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {pdfDocs.map(renderDocumentCard)}
          </div>
          {pdfDocs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không có tài liệu PDF
            </div>
          )}
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {videoDocs.map(renderDocumentCard)}
          </div>
          {videoDocs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không có video
            </div>
          )}
        </TabsContent>

        <TabsContent value="slide" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {slideDocs.map(renderDocumentCard)}
          </div>
          {slideDocs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Không có slide
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* By Course */}
      <Card>
        <CardHeader>
          <CardTitle>Tài liệu theo lớp học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myCourses.map(course => {
              const courseDocs = myDocuments.filter(d => d.courseId === course.id);
              if (courseDocs.length === 0) return null;
              
              return (
                <div key={course.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div 
                    className="flex items-center gap-2 mb-3 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => onNavigate('course-detail', { courseId: course.id })}
                  >
                    <BookOpen className="w-5 h-5" />
                    <h3>{course.name}</h3>
                    <span className="text-sm text-muted-foreground">({courseDocs.length})</span>
                  </div>
                  <div className="space-y-2">
                    {courseDocs.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          {getIcon(doc.type)}
                          <span className="text-sm">{doc.title}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
