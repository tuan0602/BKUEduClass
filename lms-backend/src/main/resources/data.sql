-- Full demo seed for LMS (users, subclasses, courses, assignments, submissions, documents, discussions, replies, enrollments)

-- Users (base)
INSERT INTO users (id, email, password, name, avatar, phone, is_locked, role) VALUES
('admin-1', 'admin@bkedu.vn', 'admin123', 'Nguyễn Văn Admin', NULL, '0901234567', 0, 'ADMIN'),
('teacher-1', 'teacher1@bkedu.vn', 'teacher123', 'Trần Thị Hương', NULL, '0902345678', 0, 'TEACHER'),
('teacher-2', 'teacher2@bkedu.vn', 'teacher123', 'Lê Văn Minh', NULL, '0903456789', 0, 'TEACHER'),
('student-1', 'student1@bkedu.vn', 'student123', 'Phạm Minh Tuấn', NULL, '0904567890', 0, 'STUDENT'),
('student-2', 'student2@bkedu.vn', 'student123', 'Hoàng Thị Lan', NULL, NULL, 0, 'STUDENT'),
('student-3', 'student3@bkedu.vn', 'student123', 'Đỗ Văn Hùng', NULL, NULL, 0, 'STUDENT'),
('student-4', 'student4@bkedu.vn', 'student123', 'Nguyễn Thị Mai', NULL, NULL, 0, 'STUDENT'),
('student-5', 'student5@bkedu.vn', 'student123', 'Vũ Văn Nam', NULL, NULL, 0, 'STUDENT'),
('student-6', 'student6@bkedu.vn', 'student123', 'Bùi Thị Hoa', NULL, NULL, 0, 'STUDENT'),
('student-7', 'student7@bkedu.vn', 'student123', 'Trịnh Văn Đức', NULL, NULL, 0, 'STUDENT'),
('student-8', 'student8@bkedu.vn', 'student123', 'Lý Thị Ngọc', NULL, NULL, 0, 'STUDENT'),
('student-9', 'student9@bkedu.vn', 'student123', 'Phan Văn Sơn', NULL, NULL, 0, 'STUDENT'),
('student-10', 'student10@bkedu.vn', 'student123', 'Đinh Thị Thảo', NULL, NULL, 0, 'STUDENT');

-- Subclass rows: admins, teachers, students (joined inheritance)
INSERT INTO admins (id) VALUES ('admin-1');
INSERT INTO teachers (id, teacher_id) VALUES ('teacher-1', 'GV001'), ('teacher-2', 'GV002');
INSERT INTO students (id, student_id) VALUES
('student-1', 'SV2021001'),
('student-2', 'SV2021002'),
('student-3', 'SV2021003'),
('student-4', 'SV2021004'),
('student-5', 'SV2021005'),
('student-6', 'SV2021006'),
('student-7', 'SV2021007'),
('student-8', 'SV2021008'),
('student-9', 'SV2021009'),
('student-10', 'SV2021010');

-- Courses
INSERT INTO courses (id, name, code, description, cover_image, semester, enrollment_code, is_locked, teacher_id) VALUES
('course-1', 'Lập trình Web nâng cao', 'IT4409', 'Học các kỹ thuật lập trình web hiện đại với React, Node.js và các công nghệ mới nhất', NULL, 'HK1 2024-2025', 'WEB2024', 0, 'teacher-1'),
('course-2', 'Cơ sở dữ liệu', 'IT3080', 'Tìm hiểu về thiết kế và quản trị cơ sở dữ liệu quan hệ', NULL, 'HK1 2024-2025', 'DB2024', 0, 'teacher-2'),
('course-3', 'Trí tuệ nhân tạo', 'IT4868', 'Khám phá các thuật toán machine learning và deep learning', NULL, 'HK1 2024-2025', 'AI2024', 0, 'teacher-1');

-- Assignments
INSERT INTO assignments (id, title, description, due_date, max_score, course_id, status) VALUES
('assign-1', 'Bài tập 1: Tạo ứng dụng React cơ bản', 'Xây dựng ứng dụng Todo List sử dụng React Hooks', '2025-10-20 23:59:59', 100, 'course-1', 'PENDING'),
('assign-2', 'Bài tập 2: REST API với Node.js', 'Tạo RESTful API cho ứng dụng quản lý sản phẩm', '2025-10-25 23:59:59', 100, 'course-1', 'PENDING'),
('assign-3', 'Thiết kế CSDL cho hệ thống thư viện', 'Vẽ sơ đồ ER và chuẩn hóa cơ sở dữ liệu', '2025-10-18 23:59:59', 100, 'course-2', 'SUBMITTED'),
('assign-4', 'Truy vấn SQL nâng cao', 'Viết các câu truy vấn SQL phức tạp', '2025-10-10 23:59:59', 100, 'course-2', 'OVERDUE'),
('assign-5', 'Bài tập: Thuật toán tìm kiếm', 'Cài đặt thuật toán A* và so sánh với BFS, DFS', '2025-10-22 23:59:59', 100, 'course-3', 'GRADED');

-- Submissions
INSERT INTO submissions (id, assignment_id, student_id, submitted_at, file_url, file_name, notes, score, feedback, status) VALUES
('sub-1', 'assign-3', 'student-1', '2025-10-17 14:30:00', 'database-design.pdf', 'Thiet_ke_CSDL_PhamMinhTuan.pdf', 'Em đã hoàn thành thiết kế theo yêu cầu. Đã áp dụng chuẩn hóa đến BCNF.', 85, 'Thiết kế tốt, cần chú ý thêm về chuẩn hóa', 'GRADED'),
('sub-2', 'assign-3', 'student-2', '2025-10-18 09:15:00', 'er-diagram.pdf', 'SoDo_ER_HoangThiLan.pdf', 'Em vẽ sơ đồ ER chi tiết và giải thích các mối quan hệ.', NULL, NULL, 'SUBMITTED'),
('sub-3', 'assign-5', 'student-1', '2025-10-21 20:00:00', 'ai-search.py', 'ThuatToan_AStar_PhamMinhTuan.py', 'Em đã cài đặt thuật toán A* và so sánh hiệu suất với BFS, DFS. Kèm file báo cáo.', 92, 'Xuất sắc! Code rất sạch và có comment tốt', 'GRADED');

-- Documents
INSERT INTO documents (id, course_id, title, type, url, uploaded_at, category) VALUES
('doc-1', 'course-1', 'Slide bài giảng - Giới thiệu React', 'SLIDE', 'react-intro.pdf', '2025-09-15 10:00:00', 'Chương 1'),
('doc-2', 'course-1', 'Video hướng dẫn - React Hooks', 'VIDEO', 'react-hooks-tutorial.mp4', '2025-09-20 14:30:00', 'Chương 2'),
('doc-3', 'course-2', 'Tài liệu - Thiết kế CSDL', 'PDF', 'database-design.pdf', '2025-09-18 09:00:00', 'Chương 1'),
('doc-4', 'course-3', 'Slide - Machine Learning cơ bản', 'SLIDE', 'ml-basics.pdf', '2025-09-25 11:00:00', 'Chương 3');

-- Discussions and Replies
INSERT INTO discussions (id, course_id, author_id, title, content, created_at, is_pinned) VALUES
('disc-1', 'course-1', 'teacher-1', 'Thông báo: Lịch học tuần sau', 'Lớp học tuần sau sẽ chuyển sang phòng 205 nhé các em!', '2025-10-13 09:00:00', 1),
('disc-2', 'course-1', 'student-2', 'Hỏi về bài tập 1', 'Em không hiểu phần useState trong React, thầy có thể giải thích thêm được không ạ?', '2025-10-12 15:30:00', 0);

INSERT INTO replies (id, discussion_id, author_id, content, created_at) VALUES
('reply-1', 'disc-1', 'student-1', 'Dạ em đã nhận được thông báo ạ!', '2025-10-13 09:30:00'),
('reply-2', 'disc-2', 'teacher-1', 'useState là hook để quản lý state trong functional component. Em xem lại video bài giảng nhé!', '2025-10-12 16:00:00');

-- Enrollments (map from mock)
INSERT INTO enrollments (id, course_id, student_id, enrolled_at, status) VALUES
('enroll-1', 'course-1', 'student-1', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-2', 'course-1', 'student-2', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-3', 'course-1', 'student-3', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-4', 'course-1', 'student-4', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-5', 'course-1', 'student-5', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-6', 'course-1', 'student-6', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-7', 'course-1', 'student-7', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-8', 'course-1', 'student-8', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-9', 'course-2', 'student-1', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-10', 'course-2', 'student-2', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-11', 'course-2', 'student-3', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-12', 'course-2', 'student-9', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-13', 'course-2', 'student-10', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-14', 'course-2', 'student-4', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-15', 'course-3', 'student-1', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-16', 'course-3', 'student-5', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-17', 'course-3', 'student-6', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-18', 'course-3', 'student-7', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-19', 'course-3', 'student-8', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-20', 'course-3', 'student-9', '2025-09-01 08:00:00', 'ACTIVE'),
('enroll-21', 'course-3', 'student-10', '2025-09-01 08:00:00', 'ACTIVE');
