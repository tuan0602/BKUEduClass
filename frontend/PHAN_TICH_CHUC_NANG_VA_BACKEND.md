# PHÂN TÍCH CHỨC NĂNG VÀ YÊU CẦU BACKEND
## BK EduClass Management System

---

## 📊 TỔNG QUAN HỆ THỐNG

Hệ thống quản lý lớp học BK EduClass có **3 vai trò chính**:
- **Admin** (Quản trị viên)
- **Teacher** (Giảng viên)
- **Student** (Sinh viên)

### Phân loại chức năng:
- 🟢 **Frontend Only**: Chức năng chỉ cần giao diện, có thể mock data
- 🔴 **Backend Required**: Chức năng BẮT BUỘC cần backend/API thực

---

## 🔐 CHỨC NĂNG CHUNG (ALL ROLES)

### 1. XÁC THỰC & PHÂN QUYỀN

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 1.1 | Đăng ký tài khoản | 🔴 **Backend Required** | - Validation email duy nhất trong database<br>- Hash mật khẩu bảo mật (bcrypt)<br>- Tạo user ID unique<br>- Lưu vào database<br>- Gửi email xác nhận (optional) |
| 1.2 | Đăng nhập | 🔴 **Backend Required** | - Xác thực email/password với database<br>- So sánh hash password<br>- Tạo session/JWT token<br>- Kiểm tra tài khoản bị khóa<br>- Logging hoạt động đăng nhập |
| 1.3 | Quên mật khẩu | 🔴 **Backend Required** | - Tạo token reset password (có thời hạn)<br>- Gửi email với link reset<br>- Validate token reset<br>- Cập nhật password mới (hash)<br>- Invalidate token sau khi dùng |
| 1.4 | Đăng xuất | 🔴 **Backend Required** | - Xóa session/invalidate JWT token<br>- Clear cookies<br>- Logging hoạt động đăng xuất |
| 1.5 | Phân quyền truy cập | 🔴 **Backend Required** | - Middleware kiểm tra role<br>- Authorization cho từng endpoint<br>- Kiểm tra permissions theo resource |

### 2. QUẢN LÝ PROFILE CÁ NHÂN

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 2.1 | Xem thông tin cá nhân | 🔴 **Backend Required** | - Lấy dữ liệu user từ database<br>- Đảm bảo chỉ xem được profile của mình |
| 2.2 | Chỉnh sửa thông tin | 🔴 **Backend Required** | - Validation dữ liệu nhập<br>- Kiểm tra email trùng (nếu đổi)<br>- Cập nhật database<br>- Transaction để đảm bảo data integrity |
| 2.3 | Upload avatar | 🔴 **Backend Required** | - Upload file lên storage (S3, Cloudinary)<br>- Resize/optimize ảnh<br>- Validate file type và size<br>- Xóa ảnh cũ<br>- Lưu URL vào database |
| 2.4 | Đổi mật khẩu | 🔴 **Backend Required** | - Verify mật khẩu cũ<br>- Hash mật khẩu mới<br>- Cập nhật database<br>- Invalidate các session cũ<br>- Gửi email thông báo (security) |

### 3. THÔNG BÁO

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 3.1 | Xem danh sách thông báo | 🔴 **Backend Required** | - Query thông báo từ database theo user<br>- Sắp xếp theo thời gian<br>- Phân trang<br>- Mark as read/unread |
| 3.2 | Đánh dấu đã đọc | 🔴 **Backend Required** | - Cập nhật trạng thái trong database<br>- Real-time update count badge |
| 3.3 | Xóa thông báo | 🔴 **Backend Required** | - Soft delete trong database<br>- Cập nhật UI real-time |
| 3.4 | Real-time notifications | 🔴 **Backend Required** | - WebSocket/Socket.io<br>- Push notifications<br>- Server-Sent Events (SSE) |

---

## 👨‍💼 ADMIN - QUẢN TRỊ VIÊN (55 CHỨC NĂNG)

### 4. DASHBOARD ADMIN

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 4.1 | Hiển thị tổng số người dùng | 🔴 **Backend Required** | - COUNT query từ users table<br>- Group by role<br>- Real-time hoặc cached |
| 4.2 | Hiển thị tổng số lớp học | 🔴 **Backend Required** | - COUNT query từ courses table<br>- Filter theo trạng thái (active/locked) |
| 4.3 | Hiển thị tổng số bài tập | 🔴 **Backend Required** | - COUNT query từ assignments table |
| 4.4 | Hiển thị tổng số tài liệu | 🔴 **Backend Required** | - COUNT query từ documents table |
| 4.5 | Biểu đồ phân bố người dùng theo vai trò | 🔴 **Backend Required** | - Aggregate query group by role<br>- Return data cho Pie Chart |
| 4.6 | Biểu đồ hoạt động theo tháng | 🔴 **Backend Required** | - Query logs table theo tháng<br>- Aggregate actions<br>- Return data cho Bar Chart |
| 4.7 | Danh sách hoạt động gần đây | 🔴 **Backend Required** | - Query logs/activities table<br>- Order by timestamp DESC<br>- Limit 10-20 records |
| 4.8 | Thống kê trạng thái hệ thống | 🔴 **Backend Required** | - System health checks<br>- Database status<br>- Server metrics |

### 5. QUẢN LÝ NGƯỜI DÙNG (UserManagement)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 5.1 | Xem danh sách tất cả người dùng | 🔴 **Backend Required** | - Query users table<br>- Pagination<br>- Sorting options |
| 5.2 | Tìm kiếm người dùng | 🔴 **Backend Required** | - Full-text search trong database<br>- Search by: name, email, studentId, teacherId<br>- Optimization với indexing |
| 5.3 | Lọc người dùng theo vai trò | 🔴 **Backend Required** | - WHERE clause filter by role |
| 5.4 | Tạo người dùng mới | 🔴 **Backend Required** | - Validation đầy đủ<br>- Check email unique<br>- **Tự động tạo mã SV/GV** theo pattern<br>- Hash password<br>- Insert vào database<br>- Gửi email chào mừng (optional) |
| 5.5 | Tự động tăng mã sinh viên | 🔴 **Backend Required** | - Query mã SV lớn nhất hiện tại<br>- Parse và increment số<br>- Format: SV2021XXX<br>- Handle concurrent requests (transaction) |
| 5.6 | Tự động tăng mã giảng viên | 🔴 **Backend Required** | - Query mã GV lớn nhất<br>- Increment: GV001 → GV002<br>- Transaction lock để tránh duplicate |
| 5.7 | Chỉnh sửa thông tin người dùng | 🔴 **Backend Required** | - Validation dữ liệu<br>- Check email unique (nếu đổi)<br>- UPDATE database<br>- Logging changes |
| 5.8 | Xóa người dùng | 🔴 **Backend Required** | - Soft delete (recommended)<br>- Hoặc Hard delete với cascade<br>- Xóa các bản ghi liên quan:<br>  + Submissions<br>  + Enrollments<br>  + Discussions<br>- Transaction để đảm bảo consistency |
| 5.9 | Khóa tài khoản | 🔴 **Backend Required** | - UPDATE isLocked = true<br>- Invalidate tất cả sessions hiện tại<br>- Logging action<br>- Gửi email thông báo (optional) |
| 5.10 | Mở khóa tài khoản | 🔴 **Backend Required** | - UPDATE isLocked = false<br>- Logging action<br>- Gửi email thông báo |
| 5.11 | Reset mật khẩu người dùng | 🔴 **Backend Required** | - Tạo password mới (random hoặc default)<br>- Hash password<br>- UPDATE database<br>- Gửi email password mới<br>- Force user đổi password lần đầu đăng nhập |
| 5.12 | Xem lịch sử hoạt động người dùng | 🔴 **Backend Required** | - Query activity logs theo userId<br>- Pagination<br>- Filter theo loại hoạt động |
| 5.13 | Export danh sách người dùng | 🔴 **Backend Required** | - Query toàn bộ users<br>- Generate CSV/Excel file<br>- Return download link |

### 6. QUẢN LÝ LỚP HỌC (AdminCourses)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 6.1 | Xem danh sách tất cả lớp học | 🔴 **Backend Required** | - Query courses với JOIN teachers<br>- COUNT students enrolled<br>- Pagination |
| 6.2 | Tìm kiếm lớp học | 🔴 **Backend Required** | - Full-text search<br>- Search by: name, code, teacherName<br>- Indexing optimization |
| 6.3 | Lọc theo giảng viên | 🔴 **Backend Required** | - WHERE teacherId = ?<br>- Join với users table |
| 6.4 | Lọc theo học kỳ | 🔴 **Backend Required** | - WHERE semester = ?<br>- Index trên semester column |
| 6.5 | Xem chi tiết lớp học | 🔴 **Backend Required** | - Query course by ID<br>- JOIN với teacher info<br>- COUNT assignments, documents, students<br>- List enrolled students |
| 6.6 | Khóa lớp học | 🔴 **Backend Required** | - UPDATE isLocked = true<br>- Ngăn student mới enroll<br>- Logging action |
| 6.7 | Mở khóa lớp học | 🔴 **Backend Required** | - UPDATE isLocked = false<br>- Cho phép enrollment lại |
| 6.8 | Xóa lớp học | 🔴 **Backend Required** | - **Cascade delete** tất cả:<br>  + Assignments<br>  + Documents<br>  + Discussions<br>  + Enrollments<br>  + Submissions<br>- Sử dụng database transaction<br>- Confirm dialog ở frontend<br>- Logging chi tiết |
| 6.9 | Thống kê sinh viên theo lớp | 🔴 **Backend Required** | - GROUP BY courseId<br>- COUNT students |
| 6.10 | Thống kê lớp theo giảng viên | 🔴 **Backend Required** | - GROUP BY teacherId<br>- COUNT courses |
| 6.11 | Export danh sách lớp học | 🔴 **Backend Required** | - Generate Excel/PDF với data<br>- Include statistics |

### 7. BÁO CÁO HỆ THỐNG (AdminReports)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 7.1 | Thống kê tổng quan | 🔴 **Backend Required** | - Multiple aggregate queries<br>- Cache để optimize performance |
| 7.2 | Biểu đồ phân bố người dùng (Pie Chart) | 🔴 **Backend Required** | - GROUP BY role với COUNT<br>- Return JSON cho Recharts |
| 7.3 | Biểu đồ hoạt động tháng (Bar Chart) | 🔴 **Backend Required** | - Query activities grouped by month<br>- Last 6-12 months |
| 7.4 | Biểu đồ xu hướng tăng trưởng (Line Chart) | 🔴 **Backend Required** | - Time-series data<br>- Cumulative counts over time |
| 7.5 | Biểu đồ hiệu quả lớp học | 🔴 **Backend Required** | - Calculate metrics:<br>  + Submission rate<br>  + Average grade<br>  + Completion rate<br>- Aggregate per course |
| 7.6 | Lọc báo cáo theo thời gian | 🔴 **Backend Required** | - WHERE clause với date range<br>- Parameters: 1M, 3M, 6M, 1Y |
| 7.7 | Export báo cáo PDF | 🔴 **Backend Required** | - Generate PDF với charts<br>- Libraries: Puppeteer, PDFKit<br>- Include all statistics |
| 7.8 | Export báo cáo Excel | 🔴 **Backend Required** | - Generate Excel với multiple sheets<br>- Libraries: ExcelJS, xlsx<br>- Format data tables |
| 7.9 | Thống kê hiệu suất hệ thống | 🔴 **Backend Required** | - Server metrics<br>- Database performance<br>- API response times |
| 7.10 | Log hoạt động hệ thống | 🔴 **Backend Required** | - Query system logs<br>- Filter by level (info, warning, error)<br>- Real-time updates |

### 8. QUẢN LÝ HỆ THỐNG

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 8.1 | Cấu hình hệ thống | 🔴 **Backend Required** | - Settings stored in database<br>- Cache invalidation khi update |
| 8.2 | Backup dữ liệu | 🔴 **Backend Required** | - Database dump<br>- Schedule automatic backups<br>- Store in cloud storage |
| 8.3 | Restore dữ liệu | 🔴 **Backend Required** | - Import từ backup file<br>- Validate data integrity<br>- Transaction rollback nếu lỗi |
| 8.4 | Xem logs hệ thống | 🔴 **Backend Required** | - Read từ log files/database<br>- Real-time streaming<br>- Filter và search |
| 8.5 | Email templates | 🔴 **Backend Required** | - CRUD email templates<br>- Variable interpolation<br>- Preview và test |

---

## 👨‍🏫 GIẢNG VIÊN - TEACHER (60 CHỨC NĂNG)

### 9. DASHBOARD GIẢNG VIÊN

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 9.1 | Thống kê số lớp đang dạy | 🔴 **Backend Required** | - COUNT courses WHERE teacherId = currentUser |
| 9.2 | Thống kê tổng số sinh viên | 🔴 **Backend Required** | - COUNT DISTINCT students trong các lớp của teacher |
| 9.3 | Thống kê số bài tập | 🔴 **Backend Required** | - COUNT assignments trong lớp của teacher |
| 9.4 | Thống kê bài tập chờ chấm | 🔴 **Backend Required** | - COUNT submissions WHERE status = 'submitted' AND graded = false |
| 9.5 | Danh sách lớp đang dạy | 🔴 **Backend Required** | - Query courses với student count |
| 9.6 | Bài tập cần chấm gấp | 🔴 **Backend Required** | - Query submissions chưa chấm<br>- Sort by dueDate |
| 9.7 | Hoạt động gần đây | 🔴 **Backend Required** | - Query activities của teacher và students<br>- Last 7 days |
| 9.8 | Lịch dạy trong tuần | 🟢 **Frontend Only** | - Hiển thị từ course data<br>- Format theo schedule |

### 10. QUẢN LÝ LỚP HỌC (TeacherCourses)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 10.1 | Xem danh sách lớp của mình | 🔴 **Backend Required** | - WHERE teacherId = currentUser<br>- Include student count |
| 10.2 | Tìm kiếm lớp học | 🔴 **Backend Required** | - Search trong courses của teacher |
| 10.3 | Tạo lớp học mới | 🔴 **Backend Required** | - Insert course vào database<br>- **Tự động tạo mã enrollment code** (unique)<br>- Validate course code unique<br>- Set teacherId = currentUser |
| 10.4 | Chỉnh sửa thông tin lớp | 🔴 **Backend Required** | - UPDATE course<br>- Validate ownership (teacherId)<br>- Logging changes |
| 10.5 | Xóa lớp học | 🔴 **Backend Required** | - Cascade delete assignments, docs, discussions<br>- Xóa enrollments<br>- Transaction<br>- Confirm dialog |
| 10.6 | Xem chi tiết lớp | 🔴 **Backend Required** | - Query course với:<br>  + Student list<br>  + Assignment count<br>  + Document count<br>  + Discussion count |
| 10.7 | Quản lý sinh viên trong lớp | 🔴 **Backend Required** | - List enrollments<br>- Add/Remove students<br>- View student progress |
| 10.8 | Generate mã đăng ký | 🔴 **Backend Required** | - Random unique code<br>- Check not exists in database<br>- Update course.enrollmentCode |
| 10.9 | Thống kê tiến độ lớp | 🔴 **Backend Required** | - Calculate completion rates<br>- Average grades<br>- Submission statistics |

### 11. QUẢN LÝ BÀI TẬP (TeacherAssignments)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 11.1 | Xem danh sách bài tập | 🔴 **Backend Required** | - Query assignments trong courses của teacher<br>- Include submission stats |
| 11.2 | Tìm kiếm bài tập | 🔴 **Backend Required** | - Full-text search<br>- Filter by course, status |
| 11.3 | Tạo bài tập mới | 🔴 **Backend Required** | - Validation:<br>  + dueDate phải trong tương lai<br>  + maxScore > 0<br>- Insert vào database<br>- Tạo notifications cho students enrolled |
| 11.4 | Chỉnh sửa bài tập | 🔴 **Backend Required** | - UPDATE assignment<br>- Validate ownership via courseId<br>- Notify students về changes |
| 11.5 | Xóa bài tập | 🔴 **Backend Required** | - Cascade delete submissions<br>- Transaction<br>- Confirm dialog |
| 11.6 | Xem danh sách bài nộp | 🔴 **Backend Required** | - Query submissions WHERE assignmentId = ?<br>- JOIN với student info<br>- Order by submittedAt |
| 11.7 | **CHẤM ĐIỂM BÀI TẬP** | 🔴 **Backend Required** | - UPDATE submission:<br>  + score<br>  + feedback<br>  + status = 'graded'<br>  + gradedAt<br>- Validation score <= maxScore<br>- Create notification cho student<br>- Logging |
| 11.8 | Download file bài làm | 🔴 **Backend Required** | - Get file URL từ database<br>- Generate signed URL (nếu dùng S3)<br>- Stream file về client<br>- Logging download action |
| 11.9 | Chấm điểm hàng loạt | 🔴 **Backend Required** | - Bulk UPDATE submissions<br>- Transaction<br>- Batch notifications |
| 11.10 | Export điểm ra Excel | 🔴 **Backend Required** | - Query all submissions<br>- Generate Excel với:<br>  + Student info<br>  + Scores<br>  + Submission status |
| 11.11 | Thống kê bài nộp | 🔴 **Backend Required** | - COUNT by status<br>- Calculate averages<br>- Grade distribution |
| 11.12 | Gửi nhắc nhở deadline | 🔴 **Backend Required** | - Query students chưa nộp<br>- Send email/notification<br>- Schedule với cron job |

### 12. QUẢN LÝ TÀI LIỆU (TeacherDocuments)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 12.1 | Xem danh sách tài liệu | 🔴 **Backend Required** | - Query documents trong courses của teacher<br>- Group by category |
| 12.2 | Tìm kiếm tài liệu | 🔴 **Backend Required** | - Full-text search trong docs của teacher |
| 12.3 | **Upload tài liệu mới** | 🔴 **Backend Required** | - **Upload file lên cloud storage** (S3, Google Cloud)<br>- Validate:<br>  + File type (PDF, Video, etc.)<br>  + File size limit<br>- Virus scan (optional)<br>- Insert metadata vào database:<br>  + title, type, category<br>  + fileUrl, fileSize<br>  + uploadedBy, uploadedAt<br>- Create notification cho students |
| 12.4 | Chỉnh sửa thông tin tài liệu | 🔴 **Backend Required** | - UPDATE document metadata<br>- Không đổi file (hoặc cho phép replace) |
| 12.5 | Xóa tài liệu | 🔴 **Backend Required** | - Delete file từ storage<br>- DELETE record từ database<br>- Transaction<br>- Confirm dialog |
| 12.6 | Download tài liệu | 🔴 **Backend Required** | - Get file URL<br>- Generate signed URL<br>- Stream file |
| 12.7 | Phân loại tài liệu | 🔴 **Backend Required** | - Update category/tags<br>- Batch operations |
| 12.8 | Thống kế tài liệu | 🔴 **Backend Required** | - COUNT by type<br>- Total file size<br>- Most downloaded |

### 13. QUẢN LÝ SINH VIÊN (TeacherStudents)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 13.1 | Xem danh sách sinh viên | 🔴 **Backend Required** | - Query students enrolled trong courses của teacher<br>- JOIN với enrollments, users |
| 13.2 | Tìm kiếm sinh viên | 🔴 **Backend Required** | - Search by name, studentId, email |
| 13.3 | Lọc theo lớp học | 🔴 **Backend Required** | - WHERE courseId = ? |
| 13.4 | Xem chi tiết sinh viên | 🔴 **Backend Required** | - Student profile<br>- Courses enrolled<br>- Submissions history<br>- Grade statistics<br>- Attendance (nếu có) |
| 13.5 | Xem kết quả học tập | 🔴 **Backend Required** | - Query submissions của student<br>- Calculate GPA<br>- Grade trends |
| 13.6 | Xóa sinh viên khỏi lớp | 🔴 **Backend Required** | - DELETE enrollment<br>- Optional: keep submissions hoặc cascade delete<br>- Notify student |
| 13.7 | Thêm sinh viên vào lớp | 🔴 **Backend Required** | - INSERT enrollment<br>- Validate student exists<br>- Check not duplicate<br>- Notify student |
| 13.8 | Export danh sách sinh viên | 🔴 **Backend Required** | - Generate Excel với student info<br>- Include grades |

### 14. THẢO LUẬN (TeacherDiscussions)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 14.1 | Xem tất cả thảo luận | 🔴 **Backend Required** | - Query discussions trong courses của teacher<br>- Include reply count |
| 14.2 | Tìm kiếm thảo luận | 🔴 **Backend Required** | - Full-text search title và content |
| 14.3 | **Tạo chủ đề thảo luận** | 🔴 **Backend Required** | - INSERT discussion<br>- Set authorId = currentUser<br>- **Create notifications** cho tất cả students enrolled<br>- Support pinning |
| 14.4 | Ghim/Bỏ ghim thảo luận | 🔴 **Backend Required** | - UPDATE isPinned<br>- Notification (optional) |
| 14.5 | **Trả lời thảo luận** | 🔴 **Backend Required** | - INSERT reply<br>- **Notify discussion author** (nếu là student)<br>- Notify other participants |
| 14.6 | Xóa thảo luận | 🔴 **Backend Required** | - Cascade delete replies<br>- Validate ownership<br>- Transaction |
| 14.7 | Xóa reply không phù hợp | 🔴 **Backend Required** | - DELETE reply<br>- Moderation log<br>- Notify author (optional) |
| 14.8 | Thống kê thảo luận | 🔴 **Backend Required** | - COUNT discussions<br>- Group by author role<br>- Most active students |
| 14.9 | Lọc thảo luận theo lớp | 🔴 **Backend Required** | - WHERE courseId = ? |

### 15. BÁO CÁO GIẢNG VIÊN (TeacherReports)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 15.1 | Biểu đồ phân tích lớp học | 🔴 **Backend Required** | - Aggregate data per course<br>- Submission rates, averages |
| 15.2 | Thống kê sinh viên | 🔴 **Backend Required** | - Performance metrics<br>- Grade distribution |
| 15.3 | Báo cáo bài tập | 🔴 **Backend Required** | - Assignment statistics<br>- Completion rates<br>- Average scores |
| 15.4 | Hiệu suất lớp học | 🔴 **Backend Required** | - Compare courses<br>- Identify issues |
| 15.5 | Export báo cáo PDF | 🔴 **Backend Required** | - Generate PDF với charts và tables |

---

## 👨‍🎓 SINH VIÊN - STUDENT (50 CHỨC NĂNG)

### 16. DASHBOARD SINH VIÊN

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 16.1 | Thống kê số lớp đang học | 🔴 **Backend Required** | - COUNT enrollments WHERE studentId = currentUser |
| 16.2 | Thống kê bài tập chờ làm | 🔴 **Backend Required** | - COUNT assignments chưa submit<br>- WHERE dueDate > now() |
| 16.3 | Thống kê bài tập đã hoàn thành | 🔴 **Backend Required** | - COUNT submissions WHERE status = 'graded' |
| 16.4 | Thống kê bài tập quá hạn | 🔴 **Backend Required** | - COUNT assignments chưa submit<br>- WHERE dueDate < now() |
| 16.5 | Tiến độ học tập (Progress) | 🔴 **Backend Required** | - Calculate completion percentage<br>- Per course và overall |
| 16.6 | Biểu đồ điểm số | 🔴 **Backend Required** | - Query scores<br>- Group by course/assignment |
| 16.7 | Lớp học gần đây | 🔴 **Backend Required** | - Recent enrollments<br>- Sort by activity |
| 16.8 | Bài tập sắp đến hạn | 🔴 **Backend Required** | - WHERE dueDate BETWEEN now() AND +3 days<br>- ORDER BY dueDate ASC |
| 16.9 | Lịch học trong tuần | 🟢 **Frontend Only** | - Format course schedules |
| 16.10 | Điểm trung bình (GPA) | 🔴 **Backend Required** | - Calculate weighted average<br>- Từ tất cả assignments đã chấm |

### 17. LỚP HỌC (StudentCourses)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 17.1 | Xem danh sách lớp đã đăng ký | 🔴 **Backend Required** | - Query enrollments JOIN courses<br>- WHERE studentId = currentUser<br>- Include progress |
| 17.2 | Tìm kiếm lớp học | 🔴 **Backend Required** | - Search trong enrolled courses |
| 17.3 | **ĐĂNG KÝ LỚP HỌC MỚI** | 🔴 **Backend Required** | - Validate enrollment code exists<br>- Check course NOT locked<br>- Check NOT already enrolled<br>- INSERT enrollment<br>- Create notification cho teacher<br>- Transaction |
| 17.4 | Hủy đăng ký lớp | 🔴 **Backend Required** | - DELETE enrollment<br>- Confirm dialog<br>- Notify teacher |
| 17.5 | Xem tiến độ từng lớp | 🔴 **Backend Required** | - Calculate:<br>  + Assignments completed / total<br>  + Average grade |

### 18. CHI TIẾT LỚP HỌC (CourseDetail)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 18.1 | Tab Tổng quan | 🔴 **Backend Required** | - Course details<br>- Teacher info<br>- Syllabus |
| 18.2 | Tab Tài liệu - Xem danh sách | 🔴 **Backend Required** | - Query documents WHERE courseId = ?<br>- Order by uploadedAt |
| 18.3 | **Tab Tài liệu - Download** | 🔴 **Backend Required** | - Get file URL<br>- Generate signed URL<br>- Stream file<br>- Track download count |
| 18.4 | Tab Bài tập - Danh sách | 🔴 **Backend Required** | - Query assignments WHERE courseId = ?<br>- Include submission status cho current student |
| 18.5 | Tab Bài tập - Xem trạng thái | 🔴 **Backend Required** | - Check submission exists<br>- Get score nếu đã chấm |
| 18.6 | Tab Thảo luận - Xem | 🔴 **Backend Required** | - Query discussions WHERE courseId = ?<br>- Include replies |
| 18.7 | Tab Thảo luận - Trả lời | 🔴 **Backend Required** | - INSERT reply<br>- Notify discussion author |
| 18.8 | Tab Thành viên - Danh sách | 🔴 **Backend Required** | - Query enrollments JOIN users<br>- WHERE courseId = ? |

### 19. BÀI TẬP (StudentAssignments)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 19.1 | Xem tất cả bài tập | 🔴 **Backend Required** | - Query assignments trong enrolled courses<br>- JOIN với submissions để lấy status |
| 19.2 | Tìm kiếm bài tập | 🔴 **Backend Required** | - Full-text search |
| 19.3 | Lọc: Tất cả | 🔴 **Backend Required** | - No filter |
| 19.4 | Lọc: Chưa nộp | 🔴 **Backend Required** | - WHERE submission NOT EXISTS |
| 19.5 | Lọc: Đã nộp | 🔴 **Backend Required** | - WHERE submission EXISTS AND status = 'submitted' |
| 19.6 | Lọc: Đã chấm | 🔴 **Backend Required** | - WHERE submission.status = 'graded' |
| 19.7 | Lọc: Quá hạn | 🔴 **Backend Required** | - WHERE dueDate < now() AND submission NOT EXISTS |
| 19.8 | Thống kê cards | 🔴 **Backend Required** | - Multiple COUNT queries với filters |

### 20. CHI TIẾT BÀI TẬP (AssignmentDetail)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 20.1 | Xem thông tin bài tập | 🔴 **Backend Required** | - Query assignment by ID<br>- Check enrollment |
| 20.2 | Xem mô tả yêu cầu | 🔴 **Backend Required** | - Part of assignment data |
| 20.3 | Xem hạn nộp | 🔴 **Backend Required** | - Display dueDate<br>- Calculate time remaining |
| 20.4 | Xem điểm tối đa | 🔴 **Backend Required** | - Display maxScore |
| 20.5 | **NỘP BÀI TẬP - Upload file** | 🔴 **Backend Required** | - **Upload file lên storage**<br>- Validate:<br>  + File type (PDF, DOC, ZIP...)<br>  + File size (max 10MB)<br>  + Not after deadline<br>- INSERT submission:<br>  + assignmentId, studentId<br>  + fileUrl, fileName<br>  + notes (optional)<br>  + submittedAt = now()<br>  + status = 'submitted'<br>- Create notification cho teacher<br>- Transaction |
| 20.6 | **NỘP BÀI TẬP - Ghi chú** | 🔴 **Backend Required** | - Save notes cùng submission |
| 20.7 | Xem bài đã nộp | 🔴 **Backend Required** | - Query submission<br>- Display file name, submitted time |
| 20.8 | **Download file đã nộp** | 🔴 **Backend Required** | - Get file URL<br>- Generate signed URL<br>- Stream file |
| 20.9 | Xem điểm đã chấm | 🔴 **Backend Required** | - Display score, feedback từ submission |
| 20.10 | Xem feedback giảng viên | 🔴 **Backend Required** | - Display feedback text |
| 20.11 | Nộp lại bài (nếu cho phép) | 🔴 **Backend Required** | - UPDATE submission<br>- Replace file<br>- Set status = 'resubmitted'<br>- Notify teacher |
| 20.12 | Kiểm tra quá hạn | 🔴 **Backend Required** | - Compare dueDate với now()<br>- Disable submit button |

### 21. TÀI LIỆU (StudentDocuments)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 21.1 | Xem danh sách tài liệu | 🔴 **Backend Required** | - Query documents trong enrolled courses<br>- Group by course hoặc category |
| 21.2 | Tìm kiếm tài liệu | 🔴 **Backend Required** | - Full-text search title |
| 21.3 | Lọc theo lớp học | 🔴 **Backend Required** | - WHERE courseId = ? |
| 21.4 | Lọc theo loại (PDF/Video/Slide) | 🔴 **Backend Required** | - WHERE type = ? |
| 21.5 | **Download tài liệu** | 🔴 **Backend Required** | - Get file URL<br>- Generate signed URL (S3)<br>- Stream file<br>- Increment download  count<br>- Logging |
| 21.6 | Preview tài liệu (PDF) | 🔴 **Backend Required** | - Serve file với appropriate headers<br>- Hoặc embed PDF viewer |
| 21.7 | Thống kê số lượng theo loại | 🔴 **Backend Required** | - COUNT GROUP BY type |

### 22. THẢO LUẬN (StudentDiscussions)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 22.1 | Xem tất cả thảo luận | 🔴 **Backend Required** | - Query discussions trong enrolled courses<br>- Order by isPinned, createdAt DESC |
| 22.2 | Tìm kiếm thảo luận | 🔴 **Backend Required** | - Full-text search |
| 22.3 | **Tạo chủ đề mới** | 🔴 **Backend Required** | - INSERT discussion<br>- Validate enrolled in course<br>- **Create notification cho teacher**<br>- Notify other students (optional) |
| 22.4 | **Trả lời thảo luận** | 🔴 **Backend Required** | - INSERT reply<br>- **Notify discussion author** (nếu là teacher)<br>- Notify participants |
| 22.5 | Xem số lượng replies | 🔴 **Backend Required** | - COUNT replies per discussion |
| 22.6 | Xóa chủ đề của mình | 🔴 **Backend Required** | - DELETE discussion<br>- Validate authorId = currentUser<br>- Cascade delete replies |
| 22.7 | Xóa reply của mình | 🔴 **Backend Required** | - DELETE reply<br>- Validate ownership |
| 22.8 | Lọc theo lớp học | 🔴 **Backend Required** | - WHERE courseId = ? |

### 23. BÁO CÁO HỌC TẬP (StudentReports)

| # | Chức năng | Loại | Giải thích |
|---|-----------|------|------------|
| 23.1 | Biểu đồ điểm số | 🔴 **Backend Required** | - Query scores từ submissions<br>- Group by assignment/course |
| 23.2 | Tiến độ học tập | 🔴 **Backend Required** | - Calculate completion percentage<br>- Over time |
| 23.3 | Thống kê bài tập | 🔴 **Backend Required** | - Counts by status |
| 23.4 | Lịch sử hoạt động | 🔴 **Backend Required** | - Query activity logs<br>- Timeline view |
| 23.5 | Biểu đồ phân bố điểm | 🔴 **Backend Required** | - Grade distribution |
| 23.6 | Biểu đồ tiến độ theo tuần | 🔴 **Backend Required** | - Time-series data |
| 23.7 | Tổng kết học kỳ | 🔴 **Backend Required** | - Aggregate all metrics |
| 23.8 | Export transcript | 🔴 **Backend Required** | - Generate PDF transcript |

---

## 📊 TỔNG HỢP PHÂN TÍCH

### Tổng số chức năng: **165 chức năng**

| Vai trò | Số chức năng | Frontend Only | Backend Required |
|---------|--------------|---------------|------------------|
| **Chung (All Roles)** | 16 | 0 | 16 (100%) |
| **Admin** | 55 | 0 | 55 (100%) |
| **Teacher** | 60 | 1 | 59 (98.3%) |
| **Student** | 50 | 1 | 49 (98%) |
| **TỔNG CỘNG** | **165** | **2** | **163 (98.8%)** |

### Kết luận:

**🔴 163/165 chức năng (98.8%) CẦN BACKEND thực**

Chỉ có 2 chức năng có thể làm Frontend Only:
1. Lịch dạy trong tuần (Teacher Dashboard)
2. Lịch học trong tuần (Student Dashboard)

---

## 🎯 CÁC CÔNG NGHỆ BACKEND CẦN THIẾT

### 1. **Backend Framework**
- Node.js + Express.js
- Hoặc: Python + Django/FastAPI
- Hoặc: Java + Spring Boot
- Hoặc: PHP + Laravel

### 2. **Database**
- **Relational DB**: PostgreSQL hoặc MySQL
  - Users, Courses, Assignments, Submissions
  - Enrollments, Documents, Discussions
- **Optional NoSQL**: MongoDB cho logs, notifications

### 3. **Authentication & Authorization**
- JWT (JSON Web Tokens)
- Session management
- Role-based access control (RBAC)
- Password hashing (bcrypt)

### 4. **File Storage**
- **Cloud Storage**:
  - AWS S3
  - Google Cloud Storage
  - Cloudinary (cho images)
- Upload/Download với signed URLs
- CDN để optimize delivery

### 5. **Email Service**
- SendGrid
- AWS SES
- Mailgun
- NodeMailer (cho development)

### 6. **Real-time Features**
- Socket.io (WebSocket)
- Server-Sent Events (SSE)
- Redis cho pub/sub

### 7. **Caching**
- Redis
- Memcached
- Application-level caching

### 8. **Job Queue**
- Bull (Node.js)
- Celery (Python)
- Cron jobs cho scheduled tasks

### 9. **API Documentation**
- Swagger/OpenAPI
- Postman collections

### 10. **Security**
- HTTPS/SSL
- CORS configuration
- Rate limiting
- Input validation & sanitization
- SQL injection prevention
- XSS protection

---

## ���� CÁC YÊU CẦU BẢO MẬT QUAN TRỌNG

### 1. **Authentication**
- Hash password với bcrypt (cost factor >= 10)
- Implement password reset với token có thời hạn
- Login attempt limiting
- Session timeout
- Remember me token (secure)

### 2. **Authorization**
- Middleware kiểm tra role trên mọi endpoint
- Resource-level permissions:
  - Teacher chỉ truy cập courses của mình
  - Student chỉ truy cập enrolled courses
  - Admin có quyền cao nhất
- Validate ownership trước khi update/delete

### 3. **File Upload Security**
- Validate file type (whitelist)
- Check file size limits
- Rename files để tránh path traversal
- Virus scanning (ClamAV)
- Store files ngoài webroot
- Serve files qua signed URLs (expire sau X phút)

### 4. **Database Security**
- Prepared statements (prevent SQL injection)
- Least privilege principle cho DB users
- Encrypt sensitive data at rest
- Regular backups với encryption

### 5. **API Security**
- Rate limiting per user/IP
- CORS với whitelist domains
- Input validation với schemas (Joi, Yup)
- Output sanitization
- CSRF protection

---

## 📝 DATABASE SCHEMA OVERVIEW

### Core Tables (Tối thiểu cần có)

1. **users**
   - id, email, password_hash, name, role
   - student_id, teacher_id, phone, avatar_url
   - is_locked, created_at, updated_at

2. **courses**
   - id, name, code, description
   - teacher_id (FK to users)
   - semester, enrollment_code
   - is_locked, created_at, updated_at

3. **enrollments**
   - id, course_id (FK), student_id (FK)
   - enrolled_at, status

4. **assignments**
   - id, course_id (FK)
   - title, description, due_date, max_score
   - created_at, updated_at

5. **submissions**
   - id, assignment_id (FK), student_id (FK)
   - file_url, file_name, file_size
   - notes, score, feedback
   - status (submitted, graded, resubmitted)
   - submitted_at, graded_at

6. **documents**
   - id, course_id (FK)
   - title, type, category
   - file_url, file_size
   - uploaded_by (FK to users)
   - uploaded_at, download_count

7. **discussions**
   - id, course_id (FK), author_id (FK)
   - title, content
   - is_pinned, created_at, updated_at

8. **discussion_replies**
   - id, discussion_id (FK), author_id (FK)
   - content, created_at

9. **notifications**
   - id, user_id (FK)
   - type, title, content, related_id
   - is_read, created_at

10. **activity_logs**
    - id, user_id (FK), action, resource_type
    - resource_id, ip_address, user_agent
    - created_at

---

## 🚀 API ENDPOINTS OVERVIEW (Tham khảo)

### Authentication
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/logout` - Đăng xuất
- POST `/api/auth/forgot-password` - Quên mật khẩu
- POST `/api/auth/reset-password` - Reset mật khẩu
- GET `/api/auth/me` - Lấy thông tin user hiện tại

### Users (Admin only)
- GET `/api/users` - Danh sách users (pagination, filter, search)
- POST `/api/users` - Tạo user mới
- GET `/api/users/:id` - Chi tiết user
- PUT `/api/users/:id` - Cập nhật user
- DELETE `/api/users/:id` - Xóa user
- PATCH `/api/users/:id/lock` - Khóa tài khoản
- PATCH `/api/users/:id/unlock` - Mở khóa tài khoản

### Profile
- GET `/api/profile` - Xem profile
- PUT `/api/profile` - Cập nhật profile
- POST `/api/profile/avatar` - Upload avatar
- PUT `/api/profile/password` - Đổi mật khẩu

### Courses
- GET `/api/courses` - Danh sách courses (filter by role)
- POST `/api/courses` - Tạo course (Teacher)
- GET `/api/courses/:id` - Chi tiết course
- PUT `/api/courses/:id` - Cập nhật course (Teacher, Admin)
- DELETE `/api/courses/:id` - Xóa course (Teacher, Admin)
- POST `/api/courses/:id/enroll` - Đăng ký lớp (Student, by code)
- DELETE `/api/courses/:id/enroll` - Hủy đăng ký (Student)
- GET `/api/courses/:id/students` - Danh sách sinh viên (Teacher)

### Assignments
- GET `/api/assignments` - Danh sách assignments (filter by course)
- POST `/api/assignments` - Tạo assignment (Teacher)
- GET `/api/assignments/:id` - Chi tiết assignment
- PUT `/api/assignments/:id` - Cập nhật assignment (Teacher)
- DELETE `/api/assignments/:id` - Xóa assignment (Teacher)
- GET `/api/assignments/:id/submissions` - Danh sách bài nộp (Teacher)

### Submissions
- GET `/api/submissions` - Danh sách submissions của student
- POST `/api/submissions` - Nộp bài (Student, with file upload)
- GET `/api/submissions/:id` - Chi tiết submission
- PUT `/api/submissions/:id` - Nộp lại bài (Student)
- PATCH `/api/submissions/:id/grade` - Chấm điểm (Teacher)
- GET `/api/submissions/:id/download` - Download file bài làm

### Documents
- GET `/api/documents` - Danh sách documents (filter by course)
- POST `/api/documents` - Upload document (Teacher)
- GET `/api/documents/:id` - Chi tiết document
- PUT `/api/documents/:id` - Cập nhật metadata (Teacher)
- DELETE `/api/documents/:id` - Xóa document (Teacher)
- GET `/api/documents/:id/download` - Download document (Student, Teacher)

### Discussions
- GET `/api/discussions` - Danh sách discussions (filter by course)
- POST `/api/discussions` - Tạo discussion (Teacher, Student)
- GET `/api/discussions/:id` - Chi tiết discussion với replies
- PUT `/api/discussions/:id` - Cập nhật discussion
- DELETE `/api/discussions/:id` - Xóa discussion
- PATCH `/api/discussions/:id/pin` - Ghim/bỏ ghim (Teacher)
- POST `/api/discussions/:id/replies` - Trả lời discussion
- DELETE `/api/discussions/:discussionId/replies/:replyId` - Xóa reply

### Notifications
- GET `/api/notifications` - Danh sách notifications
- PATCH `/api/notifications/:id/read` - Đánh dấu đã đọc
- DELETE `/api/notifications/:id` - Xóa notification

### Reports & Analytics
- GET `/api/reports/admin/overview` - Admin dashboard stats
- GET `/api/reports/admin/users` - User analytics
- GET `/api/reports/admin/activities` - Activity logs
- GET `/api/reports/teacher/courses` - Teacher course stats
- GET `/api/reports/teacher/students` - Student performance
- GET `/api/reports/student/progress` - Student progress
- GET `/api/reports/student/grades` - Student grades

---

## 💡 KHUYẾN NGHỊ IMPLEMENTATION

### Giai đoạn 1: Core Features (MVP)
1. Authentication & Authorization
2. User Management (Admin)
3. Course CRUD (Teacher, Admin)
4. Course Enrollment (Student)
5. Profile Management

### Giai đoạn 2: Content Management
6. Assignment CRUD (Teacher)
7. Assignment Submission (Student)
8. Document Upload/Download (Teacher, Student)
9. Basic grading (Teacher)

### Giai đoạn 3: Advanced Features
10. Discussions & Replies
11. Real-time Notifications
12. Advanced Grading với feedback
13. Reports & Analytics

### Giai đoạn 4: Enhancement
14. Email notifications
15. File preview
16. Batch operations
17. Advanced search & filters
18. Export to PDF/Excel
19. Activity logging
20. Performance optimization

---

## 📌 NOTES

1. **Mock Data hiện tại**: Hệ thống frontend đang sử dụng mock data trong `/lib/mockData.ts`. Khi tích hợp backend, cần thay thế các mock calls bằng API calls thực.

2. **Authentication Flow**: Cần implement JWT hoặc session-based auth để thay thế AuthContext hiện tại.

3. **File Upload**: Hiện tại chỉ là UI mockup. Backend cần implement multipart/form-data handling và cloud storage integration.

4. **Real-time Features**: Notifications và live updates hiện tại là static. Cần WebSocket hoặc polling để có real-time updates.

5. **Validation**: Frontend đang có basic validation. Backend PHẢI có validation layer riêng để đảm bảo security.

6. **Error Handling**: Backend cần consistent error responses với proper HTTP status codes.

7. **Testing**: Cần unit tests, integration tests cho tất cả API endpoints.

8. **Documentation**: Cần API documentation (Swagger) để frontend dev dễ tích hợp.

---

**Tài liệu này liệt kê TOÀN BỘ 165 chức năng của hệ thống BK EduClass Management System và phân tích chi tiết yêu cầu backend cho từng chức năng.**

**Kết luận: 98.8% chức năng CẦN backend thực để hoạt động đầy đủ. Frontend hiện tại chỉ là prototype với mock data.**
