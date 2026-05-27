# Tài liệu Kết nối API Tài liệu cho Teacher

## 📁 Files đã tạo/cập nhật

### 1. **src/lib/documentService.ts** (Mới)
Service xử lý các API calls liên quan đến tài liệu:

#### Các chức năng:
- ✅ `uploadDocument(data)` - Upload tài liệu lên server
- ✅ `getAllDocuments(courseId)` - Lấy danh sách tài liệu của một khóa học
- ✅ `getDocumentDetail(courseId, documentId)` - Lấy chi tiết tài liệu
- ✅ `downloadDocument(courseId, documentId)` - Tải xuống tài liệu
- ✅ `deleteDocument(courseId, documentId)` - Xóa tài liệu
- ✅ `triggerDownload(blob, filename)` - Helper function để tải file trong browser

#### Interface Document:
```typescript
{
  id: number;
  courseId: number;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  category?: string;
}
```

### 2. **src/hooks/useDocument.ts** (Mới)
Custom hook quản lý state và logic cho document operations:

#### Các chức năng:
- ✅ `uploadDocument(data)` - Upload tài liệu với xử lý loading và error
- ✅ `fetchDocuments(courseId)` - Lấy danh sách tài liệu
- ✅ `getDocumentDetail(courseId, documentId)` - Lấy chi tiết tài liệu
- ✅ `downloadDocument(courseId, documentId, fileName)` - Tải tài liệu
- ✅ `deleteDocument(courseId, documentId)` - Xóa tài liệu

#### State management:
```typescript
{
  loading: boolean;
  documents: Document[];
}
```

### 3. **src/components/teacher/TeacherDocuments.tsx** (Cập nhật)
Component UI cho teacher quản lý tài liệu, đã được cập nhật hoàn toàn để sử dụng real API thay vì mock data.

## 🔌 API Endpoints được sử dụng

### 1. Upload Document
```
POST /courses/:courseid/documents/upload
Content-Type: multipart/form-data

Body:
- file: File
- title: string
```

### 2. Get All Documents
```
GET /courses/:courseid/documents

Response: List<Document>
```

### 3. Get Document Detail
```
GET /courses/:courseid/documents/:documentid

Response: Document
```

### 4. Download Document
```
GET /courses/:courseid/documents/:documentid/download
Query params:
- documentid: number
- courseid: number

Response: byte[] (file blob)
```

### 5. Delete Document
```
DELETE /courses/:courseid/documents/:documentid

Response: Success message
```

## 🎯 Tính năng đã implement

### Upload tài liệu
- ✅ Chọn lớp học
- ✅ Nhập tiêu đề tài liệu
- ✅ Upload file (hỗ trợ PDF, Word, PowerPoint, Excel, Video)
- ✅ Hiển thị preview file đã chọn với tên và size
- ✅ Validation đầy đủ (course, file, title)
- ✅ Loading state trong quá trình upload
- ✅ Toast notification khi thành công/thất bại
- ✅ Auto refresh danh sách sau khi upload

### Danh sách tài liệu
- ✅ Hiển thị table với các cột: Tên file, Tiêu đề, Loại file, Dung lượng, Ngày upload
- ✅ Tìm kiếm theo tên file và tiêu đề
- ✅ Icon file theo loại
- ✅ Format file size (Bytes, KB, MB, GB)
- ✅ Format ngày giờ theo định dạng Việt Nam
- ✅ Loading state khi fetch data
- ✅ Empty state khi chưa có tài liệu

### Download tài liệu
- ✅ Button download cho từng tài liệu
- ✅ Auto trigger download trong browser
- ✅ Giữ nguyên tên file gốc
- ✅ Toast notification

### Xóa tài liệu
- ✅ Confirmation dialog trước khi xóa
- ✅ Hiển thị tên tài liệu trong dialog
- ✅ Loading state khi đang xóa
- ✅ Auto update danh sách sau khi xóa
- ✅ Toast notification

### Thống kê
- ✅ Tổng số tài liệu
- ✅ Số lớp học
- ✅ Tổng dung lượng tài liệu
- ✅ Tên lớp đang chọn

### Chọn lớp học
- ✅ Dropdown chọn lớp học
- ✅ Auto-select lớp đầu tiên
- ✅ Auto fetch documents khi đổi lớp
- ✅ Disable upload button khi chưa chọn lớp

## 🔒 Security & Error Handling

### Authentication
- ✅ Bearer token tự động thêm vào headers (từ axios interceptor)
- ✅ Authorization checks (TEACHER role required)

### Error Handling
- ✅ Try-catch cho tất cả API calls
- ✅ Toast notification cho errors
- ✅ Console.error cho debugging
- ✅ Graceful fallback UI khi có lỗi

### Validation
- ✅ File required check
- ✅ Title required check
- ✅ Course selection check
- ✅ Server-side validation (từ backend)

## 📝 Cách sử dụng

### Import và sử dụng trong component:

```typescript
import { TeacherDocuments } from '../../components/teacher/TeacherDocuments';

// Trong component
<TeacherDocuments user={currentUser} />
```

### Sử dụng documentService trực tiếp:

```typescript
import documentService from '../../lib/documentService';

// Upload
await documentService.uploadDocument({
  file: selectedFile,
  title: "Bài giảng 1",
  courseId: 123
});

// Get list
const docs = await documentService.getAllDocuments(123);

// Download
const blob = await documentService.downloadDocument(123, 456);
documentService.triggerDownload(blob, "filename.pdf");

// Delete
await documentService.deleteDocument(123, 456);
```

### Sử dụng useDocument hook:

```typescript
import { useDocument } from '../../hooks/useDocument';

const {
  documents,
  loading,
  uploadDocument,
  fetchDocuments,
  downloadDocument,
  deleteDocument
} = useDocument();

// Upload
const success = await uploadDocument({
  file, title, courseId
});

// Fetch
await fetchDocuments(courseId);

// Download
await downloadDocument(courseId, documentId, fileName);

// Delete
await deleteDocument(courseId, documentId);
```

## 🎨 UI/UX Features

- ✅ Responsive design (mobile-friendly)
- ✅ Loading indicators
- ✅ Empty states
- ✅ Confirmation dialogs
- ✅ Toast notifications
- ✅ Accessible buttons và forms
- ✅ Icons cho file types
- ✅ File size formatting
- ✅ Date formatting (Vietnamese)
- ✅ Search functionality
- ✅ Disabled states khi appropriate

## 🚀 Lưu ý khi triển khai

1. **Backend phải hỗ trợ multipart/form-data** cho upload endpoint
2. **CORS phải được cấu hình** cho file upload
3. **File size limit** nên được set ở backend (recommend: 100MB)
4. **Bearer token** phải có trong localStorage
5. **User phải có role TEACHER** để upload/delete
6. **File type validation** nên được thực hiện ở cả frontend và backend

## ✅ Checklist hoàn thành

- [x] Document Service với tất cả API endpoints
- [x] Custom hook useDocument
- [x] Upload tài liệu với file picker
- [x] Danh sách tài liệu
- [x] Download tài liệu
- [x] Xóa tài liệu với confirmation
- [x] Search/filter tài liệu
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] Responsive UI
- [x] TypeScript types
- [x] Integration với existing course service

## 🔄 Workflow

1. Teacher vào trang Documents
2. Auto fetch danh sách courses
3. Auto select course đầu tiên
4. Auto fetch documents của course đó
5. Teacher có thể:
   - Upload tài liệu mới
   - Tìm kiếm tài liệu
   - Download tài liệu
   - Xóa tài liệu
   - Chuyển qua course khác
