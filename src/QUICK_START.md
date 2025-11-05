# BK EduClass - Hướng Dẫn Nhanh

## 🚀 Bắt Đầu

### Tài Khoản Demo

**Admin:**
```
Email: admin@bkedu.vn
Password: admin123
```

**Giảng viên:**
```
Email: teacher1@bkedu.vn
Password: teacher123
```

**Sinh viên:**
```
Email: student1@bkedu.vn  (hoặc student2, student3, ... student10)
Password: student123
```

---

## 📋 Tính Năng Chính Theo Vai Trò

### 👨‍💼 Admin
- ✅ Tạo/Sửa/Xóa người dùng (Users → Tạo người dùng mới)
- ✅ Xem thống kê hệ thống (Dashboard & Reports)
- ✅ Quản lý tất cả lớp học (Courses)

**Demo nhanh:**
1. Đăng nhập admin@bkedu.vn
2. Vào "Users" → Click "Tạo người dùng mới"
3. Điền thông tin và chọn vai trò
4. Xem thống kê tại "Dashboard" và "Reports"

---

### 👨‍🏫 Giảng Viên
- ✅ Tạo lớp học mới (Courses → Tạo lớp học mới)
- ✅ Tạo bài tập (Assignments → Tạo bài tập mới)
- ✅ Chấm điểm bài tập (Assignments → Xem → Chấm điểm)
- ✅ Upload tài liệu (Documents → Upload tài liệu)
- ✅ Quản lý sinh viên (Students)

**Demo nhanh:**
1. Đăng nhập teacher1@bkedu.vn
2. Vào "Assignments" → Click "Tạo bài tập mới"
3. Điền thông tin bài tập
4. Click icon "Eye" để xem bài nộp
5. Click "Chấm điểm" để nhập điểm và feedback

**Tạo lớp học mới:**
1. Vào "Courses" → "Tạo lớp học mới"
2. Nhập: Tên lớp, Mã lớp (VD: IT3080), Mô tả, Học kỳ, Mã đăng ký (VD: TEST2024)
3. Sinh viên có thể dùng mã này để đăng ký

---

### 👨‍🎓 Sinh Viên
- ✅ Đăng ký lớp học (Courses → Đăng ký lớp học)
- ✅ Xem tài liệu (Documents)
- ✅ Nộp bài tập (Assignments → Click bài tập → Nộp bài)
- ✅ Thảo luận (Discussions → Tạo chủ đề mới)
- ✅ Xem điểm và feedback

**Demo nhanh:**
1. Đăng nhập student1@bkedu.vn
2. Vào "Courses" → Click "Đăng ký lớp học"
3. Nhập mã: `WEB2024` hoặc `DB2024` hoặc `AI2024`
4. Click vào lớp vừa đăng ký để xem chi tiết
5. Vào tab "Bài tập" → Click vào bài tập → "Nộp bài"

**Tham gia thảo luận:**
1. Vào "Discussions"
2. Click "Tạo chủ đề mới"
3. Chọn lớp, nhập tiêu đề và nội dung
4. Click "Trả lời" để reply các thảo luận

---

## 🎯 Demo Workflow Hoàn Chỉnh

### Quy Trình: Giảng Viên Tạo Bài Tập → Sinh Viên Nộp → Giảng Viên Chấm

**Bước 1: Giảng viên tạo bài tập**
```
1. Login: teacher1@bkedu.vn / teacher123
2. Navigate: Assignments → Tạo bài tập mới
3. Chọn lớp: Lập trình Web nâng cao
4. Tiêu đề: "Bài tập mới của bạn"
5. Điểm tối đa: 100
6. Click "Tạo bài tập"
```

**Bước 2: Sinh viên nộp bài**
```
1. Logout và login: student1@bkedu.vn / student123
2. Navigate: Assignments
3. Click vào bài tập vừa tạo
4. Upload file và ghi chú
5. Click "Nộp bài"
```

**Bước 3: Giảng viên chấm điểm**
```
1. Logout và login lại: teacher1@bkedu.vn / teacher123
2. Navigate: Assignments
3. Click icon "Eye" ở bài tập
4. Click "Chấm điểm" ở bài nộp
5. Nhập điểm (VD: 85) và feedback
6. Click "Chấm điểm"
```

**Bước 4: Sinh viên xem điểm**
```
1. Login: student1@bkedu.vn
2. Navigate: Assignments → Click bài tập
3. Xem điểm và feedback từ giảng viên
```

---

## 🔍 Mã Lớp Học Demo

Sinh viên có thể dùng các mã sau để đăng ký lớp:

- `WEB2024` - Lập trình Web nâng cao
- `DB2024` - Cơ sở dữ liệu  
- `AI2024` - Trí tuệ nhân tạo

---

## 💡 Tips

### Toast Notifications
- Mọi thao tác (tạo, sửa, xóa) đều hiển thị toast notification
- Success = màu xanh, Error = màu đỏ
- Auto dismiss sau 3-5 giây

### Search & Filter
- Tất cả danh sách đều có search box
- Real-time filtering khi gõ
- Không phân biệt hoa thường

### Responsive
- Desktop: Full layout với sidebar
- Tablet: Sidebar thu gọn
- Mobile: Menu hamburger

### Navigation
- Click vào các card/rows để xem chi tiết
- Nút "Quay lại" để về danh sách
- Scroll tự động về đầu trang

---

## 🎨 Design System

- **Màu chính**: #2F80ED (xanh dương)
- **Font**: Inter/Poppins
- **Icons**: Lucide React
- **Charts**: Recharts
- **UI Components**: Shadcn/UI

---

## 📱 Test Responsive

1. Mở DevTools (F12)
2. Toggle Device Toolbar (Ctrl + Shift + M)
3. Chọn thiết bị:
   - iPhone 12 Pro (Mobile)
   - iPad Air (Tablet)
   - Desktop 1920x1080

---

## ⚠️ Lưu Ý

- Đây là **DEMO** với mock data
- Dữ liệu không persist (reload là mất)
- Tất cả file upload chỉ là UI mock
- Ready để integrate với backend API

---

## 🐛 Troubleshooting

**Toast không hiện?**
- Check console logs
- Đảm bảo `<Toaster />` có trong App.tsx

**Dialog không đóng?**
- Click nút "Hủy" hoặc click outside
- Hoặc ESC

**Không tìm thấy trang?**
- Check URL trên browser
- Navigate bằng sidebar menu

---

**Enjoy!** 🎉
