# Hướng Dẫn Sử Dụng - BK EduClass Management System

## Thông tin đăng nhập Demo

Hệ thống có sẵn 3 tài khoản demo cho từng vai trò:

### 1. Quản trị viên (Admin)
- **Email:** admin@bkedu.vn
- **Mật khẩu:** admin123
- **Chức năng:**
  - Quản lý toàn bộ người dùng (sinh viên, giảng viên)
  - Xem và quản lý tất cả lớp học
  - Xem thống kê và báo cáo toàn hệ thống
  - Khóa/mở tài khoản, reset mật khẩu

### 2. Giảng viên (Teacher)
- **Email:** teacher1@bkedu.vn
- **Mật khẩu:** teacher123
- **Chức năng:**
  - Tạo và quản lý lớp học
  - Tạo và quản lý bài tập
  - Upload và quản lý tài liệu
  - Quản lý sinh viên trong lớp
  - Chấm điểm và cho phản hồi
  - Xem thống kê lớp học
  - Tham gia thảo luận

### 3. Sinh viên (Student)
- **Email:** student1@bkedu.vn
- **Mật khẩu:** student123
- **Chức năng:**
  - Xem và đăng ký lớp học (nhập mã lớp)
  - Xem và nộp bài tập
  - Tải tài liệu học tập
  - Tham gia thảo luận
  - Xem điểm và báo cáo học tập
  - Cập nhật hồ sơ cá nhân

## Mã đăng ký lớp học (cho Sinh viên)

- **Lập trình Web nâng cao:** WEB2024
- **Cơ sở dữ liệu:** DB2024
- **Trí tuệ nhân tạo:** AI2024

## Cấu trúc Hệ thống

### Trang Đăng nhập
- Nhập email và mật khẩu
- Checkbox "Ghi nhớ đăng nhập"
- Link "Quên mật khẩu?"
- Link "Đăng ký ngay"

### Trang Đăng ký
- Nhập thông tin: Họ tên, Email, Mật khẩu, Vai trò
- Xác nhận mật khẩu
- Tự động chuyển về trang đăng nhập sau khi đăng ký thành công

### Dashboard (theo vai trò)

#### Dashboard Sinh viên
- Thống kê: Số lớp học, bài tập chờ, đã hoàn thành, quá hạn
- Tiến độ học tập với biểu đồ
- Lớp học gần đây
- Bài tập sắp đến hạn

#### Dashboard Giảng viên
- Thống kê: Số lớp học, sinh viên, bài tập, bài chờ chấm
- Biểu đồ tình trạng nộp bài
- Biểu đồ phân bố điểm
- Danh sách lớp học đang giảng dạy

#### Dashboard Admin
- Thống kê tổng quan hệ thống
- Biểu đồ người dùng theo vai trò
- Hoạt động theo tháng
- Log hoạt động gần đây

## Tính năng chính theo Vai trò

### SINH VIÊN

#### 1. Lớp học của tôi
- Xem danh sách lớp đang tham gia
- Đăng ký lớp mới bằng mã lớp
- Xem tiến độ học tập từng lớp
- Tìm kiếm lớp học

#### 2. Chi tiết lớp học (5 tabs)
- **Tổng quan:** Thông tin lớp, giảng viên, số sinh viên
- **Tài liệu:** Xem và tải tài liệu (PDF, Video, Slide)
- **Bài tập:** Danh sách bài tập với trạng thái
- **Thảo luận:** Các chủ đề thảo luận, trả lời
- **Thành viên:** Danh sách sinh viên trong lớp

#### 3. Bài tập
- Xem tất cả bài tập từ các lớp
- Lọc theo trạng thái: Chưa nộp, Đã nộp, Đã chấm, Quá hạn
- Tìm kiếm bài tập
- Xem hạn nộp và điểm tối đa

#### 4. Chi tiết bài tập
- Xem mô tả chi tiết
- Upload file nộp bài
- Xem điểm và phản hồi của giảng viên
- Cảnh báo nếu quá hạn

#### 5. Tài liệu
- Lọc theo loại: PDF, Video, Slide
- Tìm kiếm tài liệu
- Xem theo lớp học
- Tải xuống tài liệu

#### 6. Thảo luận
- Tạo chủ đề thảo luận mới
- Trả lời các bài viết
- Xem thảo luận đã ghim
- Tìm kiếm thảo luận

#### 7. Báo cáo học tập
- GPA trung bình
- Biểu đồ phân bố điểm
- Tiến độ theo môn học
- Biểu đồ tiến độ theo tuần
- Tổng kết học kỳ

#### 8. Hồ sơ cá nhân
- Xem và chỉnh sửa thông tin
- Đổi mật khẩu
- Upload ảnh đại diện
- Xem thống kê học tập

### GIẢNG VIÊN

#### 1. Quản lý lớp học
- Tạo lớp học mới
- Sửa/xóa lớp học
- Xem danh sách lớp đang giảng dạy
- Quản lý mã đăng ký lớp
- Xem chi tiết từng lớp

#### 2. Quản lý bài tập
- Tạo bài tập mới cho lớp
- Sửa/xóa bài tập
- Xem danh sách bài nộp
- Chấm điểm và cho phản hồi
- Theo dõi tình trạng nộp bài

#### 3. Chấm điểm & Phản hồi
- Xem danh sách sinh viên đã nộp
- Nhập điểm
- Viết nhận xét
- Xuất báo cáo điểm

#### 4. Quản lý tài liệu
- Upload tài liệu (PDF, Video, Slide)
- Phân loại theo chương/buổi học
- Gắn tài liệu vào lớp học
- Sửa/xóa tài liệu

#### 5. Quản lý sinh viên
- Xem danh sách sinh viên trong lớp
- Lọc theo lớp học
- Xem chi tiết sinh viên
- Xem kết quả học tập
- Xóa sinh viên khỏi lớp

#### 6. Thống kê lớp học
- Biểu đồ tình trạng nộp bài
- Phân bố điểm
- Tỷ lệ tham gia
- Hiệu quả theo lớp
- Xuất báo cáo PDF

#### 7. Thảo luận
- Tạo và ghim thảo luận
- Trả lời câu hỏi sinh viên
- Xóa bình luận không phù hợp

### QUẢN TRỊ VIÊN

#### 1. Quản lý người dùng
- Tạo tài khoản mới (Sinh viên/Giảng viên/Admin)
- Sửa thông tin người dùng
- Khóa/mở tài khoản
- Reset mật khẩu
- Xóa tài khoản
- Gán quyền

#### 2. Quản lý lớp học
- Xem tất cả lớp học
- Khóa/mở lớp học
- Xóa lớp học
- Xem thống kê theo giảng viên
- Xem thống kê theo học kỳ

#### 3. Thống kê hệ thống
- Tổng số người dùng, lớp học, bài tập
- Biểu đồ phân bố người dùng
- Xu hướng tăng trưởng
- Hoạt động hệ thống
- Hiệu suất server
- Log hoạt động

## Thao tác chung

### Đăng xuất
1. Click vào avatar ở góc trên bên phải
2. Chọn "Đăng xuất" từ menu dropdown

### Tìm kiếm
- Mỗi trang có thanh tìm kiếm riêng
- Hỗ trợ tìm theo tên, mã, email

### Thông báo
- Icon chuông ở header hiển thị số thông báo mới
- Click để xem chi tiết

### Responsive
- Giao diện tự động điều chỉnh cho desktop, tablet, mobile
- Menu sidebar có thể đóng/mở bằng nút Menu

## Lưu ý khi sử dụng

1. **Dữ liệu Demo:** Tất cả dữ liệu đều là mock data, không lưu vào database thực
2. **Tính năng Upload:** Upload file chỉ là giao diện, không thực sự upload
3. **Mật khẩu:** Đổi mật khẩu chỉ là demo, không thay đổi thực tế
4. **Thời gian thực:** Một số tính năng như thông báo real-time chỉ là mock
5. **Xuất PDF:** Nút xuất báo cáo chỉ là giao diện

## Hỗ trợ

Nếu gặp vấn đề khi sử dụng:
1. Kiểm tra thông tin đăng nhập
2. Refresh trang
3. Clear cache trình duyệt
4. Đăng xuất và đăng nhập lại

## Công nghệ sử dụng

- **Frontend:** React + TypeScript
- **UI Framework:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Backend (Demo):** Mock data trong frontend

