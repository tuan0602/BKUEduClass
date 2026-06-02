# Danh sách kiến thức cần học cho BK EduClass

## 1. Kiến thức tổng quan về hệ thống
- Phân tích chức năng hệ thống quản lý lớp học (BK EduClass): các vai trò (Admin, Teacher, Student), các chức năng chính (dashboard, quản lý người dùng, lớp học, bài tập, tài liệu, báo cáo, thảo luận...)
- Phân biệt chức năng frontend/backend, hiểu luồng hoạt động của một hệ thống quản lý giáo dục.

---

## 2. Frontend (React + TypeScript + Vite)
- ReactJS: Component, Props, State, Lifecycle, Hooks (useState, useEffect, custom hooks)
- TypeScript: Kiểu dữ liệu, interface/type, generic, type checking
- React Router: Routing, ProtectedRoute, phân quyền truy cập giao diện
- Context API: Quản lý trạng thái toàn cục (AuthContext)
- React Query: Quản lý data fetching, caching, mutation
- Form Handling: react-hook-form, validation
- UI Libraries: Radix UI, Tailwind CSS, clsx, class-variance-authority
- Axios: Gọi API, xử lý lỗi, interceptor
- Chart/Visualization: recharts
- Quản lý assets, cấu hình Vite, tối ưu hóa build

---

## 3. Backend (Java 17 + Spring Boot 3)
- Spring Boot: Cấu trúc project, Dependency Injection, cấu hình application.properties
- RESTful API: Controller, Service, Repository, DTO, Entity
- Spring Security: Xác thực (authentication), phân quyền (authorization), JWT, OAuth2
- Spring Data JPA: ORM, thao tác với database (MySQL), Repository pattern, Query methods
- Exception Handling: GlobalExceptionHandler, custom exception
- File Upload/Download: Lưu trữ file, tạo signed URL, validate file
- Gửi email: (nếu có), xác thực tài khoản, quên mật khẩu
- Swagger: Tài liệu hóa API
- Unit Test/Integration Test: JUnit, Spring Test
- Quản lý transaction, xử lý đồng thời, tối ưu hóa truy vấn

---

## 4. Database
- MySQL: Thiết kế bảng, quan hệ, khóa chính/phụ, index, transaction, migration
- Entity Relationship: Mapping giữa các bảng (User, Course, Assignment, Submission, Document...)

---

## 5. Kiến thức bổ trợ
- JWT, Session, Cookie: Cơ chế xác thực, bảo mật
- WebSocket/Socket.io: Thông báo real-time
- CI/CD cơ bản: Build, deploy, chạy test
- Quản lý mã nguồn với Git

---

## 6. Các chủ đề phỏng vấn thường gặp
- So sánh RESTful API và GraphQL
- Cách bảo mật API, xử lý lỗi, logging
- Tối ưu hóa truy vấn database, transaction, concurrent update
- Phân biệt Stateless/Stateful, Middleware, Interceptor
- Cách tổ chức code clean, scalable
- Cách test các tầng (unit, integration)
- Cách triển khai hệ thống thực tế (build, deploy, backup, restore)

---

## 7. Best Practices
- Clean code, SOLID, DRY, Separation of Concerns
- Xử lý lỗi tập trung, logging, monitoring
- Quản lý môi trường (dev, prod), biến môi trường

---

**Gợi ý ôn tập:**
- Đọc kỹ file PHAN_TICH_CHUC_NANG_VA_BACKEND.md để nắm các luồng nghiệp vụ
- Xem kỹ các file Controller, Service, Repository trong backend
- Hiểu rõ các hooks, context, service trong frontend
- Nắm chắc các package chính trong package.json (frontend) và pom.xml (backend)

Nếu cần chi tiết từng chủ đề hoặc tài liệu học, hãy hỏi thêm nhé!
