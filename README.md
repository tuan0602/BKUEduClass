# BKU EduClass — Hệ thống quản lý lớp học

Đây là repo cho một demo hệ thống quản lý lớp học (LMS) gồm 2 phần:
- Backend: Spring Boot (Java 17, Maven)
- Frontend: React + Vite (TypeScript)

---

## Tổng quan nhanh

- Frontend development server (Vite) mặc định chạy tại: http://localhost:3000
- Backend Spring Boot mặc định chạy tại: http://localhost:8080 (API base: /api)
- Swagger UI: http://localhost:8080/swagger-ui/index.html

Lưu ý: frontend có file `src/lib/axios.ts` hiện cấu hình `baseURL: "http://localhost:8080/api"` — nếu backend chạy ở chỗ khác, hãy cập nhật `src/lib/axios.ts`.

---

## Yêu cầu (Prerequisites)

- Node.js (v18+) và npm
- Java 17
- Maven
- MySQL (hoặc dùng Docker để chạy MySQL nhanh)

---

## Cấu hình môi trường

Copy file mẫu và điền thông tin thực tế:

```bash
cp lms-backend/src/main/resources/application-example.properties lms-backend/src/main/resources/application.properties
```

Sau đó mở `application.properties` và điền đầy đủ:
- Thông tin database MySQL
- JWT secret key
- AWS S3 credentials

---

## Thiết lập & chạy môi trường

### 1. Backend (Spring Boot)

```powershell
cd lms-backend
mvn spring-boot:run
```

### 2. Frontend (React + Vite)

```powershell
npm install
npm run dev
```

### Chạy cả hai cùng lúc

Mở 2 terminal:
- Terminal A: `cd lms-backend` → `mvn spring-boot:run`
- Terminal B: `npm install` → `npm run dev`