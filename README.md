# BKU EduClass — Hệ thống quản lý lớp học

Hệ thống quản lý lớp học trực tuyến (LMS) hỗ trợ 3 vai trò ADMIN / TEACHER / STUDENT với các tính năng quản lý khóa học, tạo bài tập trắc nghiệm, nộp bài và chấm điểm tự động.

- **Backend:** Spring Boot 3 (Java 17, Maven)
- **Frontend:** React 18 + Vite (TypeScript)

---

## Tính năng chính

- Xác thực JWT với access token (15 phút) + refresh token (1 ngày)
- Phân quyền 3 role: ADMIN / TEACHER / STUDENT
- Quản lý khóa học — tạo, sửa, xóa, duyệt đăng ký học
- Tạo bài tập trắc nghiệm, nộp bài và chấm điểm tự động
- Quản lý tài liệu học tập (AWS S3)
- Khóa / mở khóa tài khoản người dùng
- Phân trang và tìm kiếm danh sách

---

## Tech Stack

| Tầng | Công nghệ |
|------|-----------|
| Backend | Spring Boot 3, Spring Security, JPA/Hibernate |
| Database | MySQL 8 |
| Frontend | React 18, TypeScript, Tailwind CSS, shadcn/ui |
| HTTP Client | Axios + Tanstack Query |
| Auth | JWT (NimbusJWT HS512) |
| Storage | AWS S3 |
| API Docs | Swagger / OpenAPI (springdoc) |
| Build | Maven (backend), Vite (frontend) |

---

## Tổng quan nhanh

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html

> **Lưu ý:** Frontend có file `src/lib/axios.ts` cấu hình `baseURL: "http://localhost:8080/api"` — nếu backend chạy ở port khác, hãy cập nhật file này.

---

## Tài khoản demo

| Role    | Email               | Password |
|---------|---------------------|----------|
| Admin   | msphuong@gmail.com     | 123456   |
| Teacher | ltphuong@gmail.com   | 123456   |
| Student | minhnguyenvan@gmail.com  | 123456   |

> Tạo tài khoản mới qua `POST /api/auth/register` (mặc định role STUDENT).  
> Tài khoản TEACHER/ADMIN do Admin tạo qua giao diện quản lý.

---

## Yêu cầu (Prerequisites)

- Node.js (v18+) và npm
- Java 17
- Maven
- MySQL 8

---

## Cấu hình môi trường

Copy file mẫu và điền thông tin thực tế:

```bash
cp lms-backend/src/main/resources/application-example.properties lms-backend/src/main/resources/application.properties
```

Sau đó mở `application.properties` và điền đầy đủ:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
tuan.jwt.base64-secret=your_base64_secret

# AWS S3
aws.accessKey=your_access_key
aws.secretKey=your_secret_key
aws.s3.bucket=your_bucket_name
```

---

## Thiết lập & chạy

### 1. Tạo database MySQL

```sql
CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (Spring Boot)

```bash
cd lms-backend
mvn spring-boot:run
```

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

### Chạy cả hai cùng lúc

Mở 2 terminal riêng:

```bash
# Terminal 1 — Backend
cd lms-backend && mvn spring-boot:run

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

---

## Cấu trúc project

```
BKUEduClass/
├── lms-backend/                  # Spring Boot
│   └── src/main/java/com/example/demo/
│       ├── config/               # Security, CORS, S3, Swagger
│       ├── controller/           # REST API endpoints
│       ├── service/              # Business logic
│       ├── repository/           # JPA repositories
│       ├── domain/               # Entity classes
│       ├── dto/                  # Request / Response DTOs
│       └── util/                 # JWT, SecurityUtil
└── frontend/                     # React + Vite
    └── src/
        ├── components/           # UI components theo role
        ├── context/              # AuthContext
        ├── lib/                  # Axios instance
        └── routes/               # Protected routes
```

---

## API nổi bật

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký (STUDENT) |
| GET | `/api/auth/refresh` | Làm mới access token |
| GET | `/api/courses` | Danh sách khóa học |
| POST | `/api/courses` | Tạo khóa học (ADMIN) |
| POST | `/api/submissions` | Nộp bài quiz |
| GET | `/api/users` | Danh sách user (ADMIN) |

> Xem đầy đủ tại Swagger UI: http://localhost:8080/swagger-ui/index.html